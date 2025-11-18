# Students Table – Cache First Demo

## How to Run

```bash
npm i
npm start
```

The first command installs all dependencies. The second command boots Vite in dev mode, opens the React single page app, and wires up Redux, Dexie (IndexedDB), and the mock API.

## Architecture Overview

The data layer follows the Adapter pattern so the UI stays ignorant about where student rows originate. `StudentRepository` is the single entry point the rest of the app talks to. Internally it holds two adapters: `IndexedDBAdapter` for the cache and `HttpAdapter` for the mock backend. Because each adapter exposes a tiny contract (`getAll`, `addMany`, `fetchStudents`, etc.), it is trivial to swap persistence or network implementations later without touching UI or Redux code.

The repository implements the cache-first flow: load from IndexedDB, dispatch the cached payload to Redux immediately, then trigger `refreshInBackground`. That method speaks only to the adapters, replaces the IndexedDB contents, and emits an `updateStudents` action when fresh data is in. If the HTTP call dies the repository catches the error, keeps whatever was already cached, and the UI continues to show consistent state. This small adapter layer gives us a clean separation of concerns while still keeping the codebase approachable.
