import { HttpAdapter } from "../adapters/httpAdapter";
import { IndexedDBAdapter } from "../adapters/indexedDb";
import type { Student } from "../types";
import { store } from "../store/store";
import { setStudents, updateStudents, setLoading, setRefreshing, setError } from "../store/studentSlice";

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
    console.log("🔄 [StudentRepository] loadStudents() called");
    try {
      console.log("📦 [StudentRepository] Setting loading to true");
      store.dispatch(setLoading(true));
      
      // Step 1: Load from cache (IndexedDB)
      console.log("💾 [StudentRepository] Loading from IndexedDB cache...");
      const cached = await this.dbAdapter.getAll();
      console.log(`💾 [StudentRepository] Found ${cached.length} cached students`);

      // Step 2: Show cached data immediately
      if (cached.length > 0) {
        console.log("✅ [StudentRepository] Cache found! Dispatching to Redux and showing immediately");
        store.dispatch(setStudents(cached));
        store.dispatch(setLoading(false));
        console.log("🔄 [StudentRepository] Starting background refresh...");
        
        // Step 3: Refresh in background (don't await)
        this.refreshInBackground();
        return cached;
      }

      // Step 4: No cache, fetch from server
      console.log("🌐 [StudentRepository] No cache found, fetching from API...");
      const fresh = await this.http.fetchStudents();
      console.log(`🌐 [StudentRepository] Fetched ${fresh.length} students from API`);
      await this.dbAdapter.addMany(fresh);
      console.log("💾 [StudentRepository] Saved to IndexedDB");
      store.dispatch(setStudents(fresh));
      store.dispatch(setLoading(false));
      console.log("✅ [StudentRepository] Dispatched to Redux");
      return fresh;
    } catch (err) {
      console.error("❌ [StudentRepository] Error loading students:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load students";
      store.dispatch(setError(errorMessage));
      
      // Fallback to cache even on error
      const cached = await this.dbAdapter.getAll();
      if (cached.length > 0) {
        console.log("🔄 [StudentRepository] Fallback: Using cached data");
        store.dispatch(setStudents(cached));
      }
      return cached;
    }
  }

  /**
   * Background refresh: Fetch fresh data and update cache + Redux
   */
  public async refreshInBackground() {
    console.log("🔄 [StudentRepository] refreshInBackground() started");
    try {
      console.log("🔄 [StudentRepository] Setting refreshing to true");
      store.dispatch(setRefreshing(true));
      console.log("🌐 [StudentRepository] Fetching fresh data from API...");
      const fresh = await this.http.fetchStudents();
      console.log(`🌐 [StudentRepository] Fetched ${fresh.length} fresh students`);
      
      // Update IndexedDB
      console.log("💾 [StudentRepository] Clearing old cache...");
      await this.dbAdapter.clear();
      await this.dbAdapter.addMany(fresh);
      console.log("💾 [StudentRepository] Updated IndexedDB with fresh data");
      
      // Update Redux store
      console.log("🔄 [StudentRepository] Updating Redux store with fresh data");
      store.dispatch(updateStudents(fresh));
      store.dispatch(setRefreshing(false));
      console.log("✅ [StudentRepository] Background refresh completed!");
    } catch (err) {
      // Silently fail - we already have cached data showing
      console.error("❌ [StudentRepository] Background refresh failed (using cached data):", err);
      store.dispatch(setRefreshing(false));
      // Don't throw - app continues with cached data
    }
  }
}
