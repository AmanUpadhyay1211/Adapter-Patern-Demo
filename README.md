# Students Table – Cache First Demo

## How to Run

```bash
# frontend
npm install
npm start

# backend (new Phase 2 API)
cd backend
npm install
npm run dev
```

The frontend commands install all dependencies and boot Vite in dev mode, opening the React single page app with Redux and Dexie (IndexedDB).  
The backend commands install the Express + SQLite server, then start it on port 4000. The React app proxies `/api/*` calls to this server during development, so make sure it is running.

### Environment configuration

- The frontend talks to the backend through `VITE_API_BASE_URL`. By default it falls back to `/api`, which works with the included Vite dev proxy.  
- When deploying the backend separately, set `VITE_API_BASE_URL` (e.g. `https://your-domain.com/api`) so the Http adapter calls the correct host.

## Architecture Overview

The data layer follows the Adapter pattern so the UI stays ignorant about where student rows originate. `StudentRepository` is the single entry point the rest of the app talks to. Internally it holds two adapters: `IndexedDBAdapter` for the cache and `HttpAdapter` for the Phase 2 REST API. Because each adapter exposes a tiny contract (`getAll`, `addMany`, `fetchStudents`, etc.), it is trivial to swap persistence or network implementations later without touching UI or Redux code.

The repository implements the cache-first flow: load from IndexedDB, dispatch the cached payload to Redux immediately, then trigger `refreshInBackground`. That method speaks only to the adapters, replaces the IndexedDB contents, and emits an `updateStudents` action when fresh data is in. If the HTTP call dies the repository catches the error, keeps whatever was already cached, and the UI continues to show consistent state. This small adapter layer gives us a clean separation of concerns while still keeping the codebase approachable.
