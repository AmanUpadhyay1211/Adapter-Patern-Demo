import { HttpAdapter, StaleVersionError } from "../adapters/httpAdapter";
import { IndexedDBAdapter } from "../adapters/indexedDb";
import type { Student } from "../types";
import { store } from "../store/store";
import {
  setStudents,
  updateStudents,
  setLoading,
  setRefreshing,
  setError,
  upsertStudent,
  setGlobalVersion,
  selectGlobalVersion,
} from "../store/studentSlice";

export class StudentRepository {
  private dbAdapter = new IndexedDBAdapter();
  private http = new HttpAdapter();

  /**
   * Load students with cache-first strategy:
   * 1. Load from IndexedDB (cache)
   * 2. Update Redux store immediately
   * 3. Fetch fresh data in background
   * 4. Update IndexedDB and Redux if new data arrives
   */
  async loadStudents(): Promise<Student[]> {
    try {
      store.dispatch(setLoading(true));
      
      // Step 1: Load from cache (IndexedDB)
      const cached = await this.dbAdapter.getAll();

      // Step 2: Show cached data immediately
      if (cached.length > 0) {
        // Get cached version from Redux or default to 1
        const cachedVersion = selectGlobalVersion(store.getState());
        store.dispatch(setStudents({ students: cached, globalVersion: cachedVersion }));
        store.dispatch(setLoading(false));
        console.log(`✅ Loaded ${cached.length} students from cache, refreshing in background...`);
        
        // Step 3: Refresh in background (don't await)
        this.refreshInBackground();
        return cached;
      }

      // Step 4: No cache, fetch from server
      const response = await this.http.fetchStudents();
      await this.dbAdapter.addMany(response.students);
      store.dispatch(setStudents(response));
      store.dispatch(setLoading(false));
      console.log(`✅ Loaded ${response.students.length} students from API (version ${response.globalVersion})`);
      return response.students;
    } catch (err) {
      console.error("❌ Error loading students:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load students";
      store.dispatch(setError(errorMessage));
      
      // Fallback to cache even on error
      const cached = await this.dbAdapter.getAll();
      if (cached.length > 0) {
        const cachedVersion = selectGlobalVersion(store.getState());
        store.dispatch(setStudents({ students: cached, globalVersion: cachedVersion }));
      }
      return cached;
    }
  }

  /**
   * Background refresh: Fetch fresh data and update cache + Redux
   */
  public async refreshInBackground() {
    try {
      store.dispatch(setRefreshing(true));
      const response = await this.http.fetchStudents();
      
      // Update IndexedDB
      await this.dbAdapter.clear();
      await this.dbAdapter.addMany(response.students);
      
      // Update Redux store
      store.dispatch(updateStudents(response));
      store.dispatch(setRefreshing(false));
      console.log(`✅ Background refresh completed: ${response.students.length} students updated (version ${response.globalVersion})`);
    } catch (err) {
      console.error("❌ Background refresh failed (using cached data):", err);
      store.dispatch(setRefreshing(false));
      // Don't throw - app continues with cached data
    }
  }

  /**
   * Force sync: Fetch latest data from server and update everything
   * Used when version conflict occurs
   */
  public async forceSync(): Promise<void> {
    try {
      const response = await this.http.fetchStudents();
      
      // Update IndexedDB
      await this.dbAdapter.clear();
      await this.dbAdapter.addMany(response.students);
      
      // Update Redux store
      store.dispatch(updateStudents(response));
      console.log(`✅ Force sync completed: ${response.students.length} students (version ${response.globalVersion})`);
    } catch (err) {
      console.error("❌ Force sync failed:", err);
      throw err;
    }
  }

  /**
   * Update a single student and sync API + IndexedDB + Redux
   * Handles version conflicts with retry logic
   */
  public async updateStudent(id: string, data: Partial<Student>, retryCount = 0): Promise<Student> {
    const maxRetries = 1; // Only retry once after sync
    
    try {
      const currentVersion = selectGlobalVersion(store.getState());
      const response = await this.http.updateStudent(id, data, currentVersion);
      
      // Update IndexedDB
      await this.dbAdapter.update(id, response);
      
      // Update Redux store
      store.dispatch(upsertStudent(response));
      
      // Update global version if returned
      if (response.globalVersion !== undefined) {
        store.dispatch(setGlobalVersion(response.globalVersion));
      }
      
      store.dispatch(setError(null));
      return response;
    } catch (err) {
      // Handle stale version error
      if (err instanceof StaleVersionError && retryCount < maxRetries) {
        const currentVersion = selectGlobalVersion(store.getState());
        console.log(`⚠️ Stale version detected (client: ${currentVersion}, server: ${err.serverVersion}). Syncing...`);
        
        // Force sync to get latest data
        await this.forceSync();
        
        // Retry the update with new version
        return this.updateStudent(id, data, retryCount + 1);
      }
      
      console.error(`❌ Failed to update student ${id}:`, err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update student";
      store.dispatch(setError(errorMessage));
      throw err;
    }
  }
}
