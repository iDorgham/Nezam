// Vitest's happy-dom environment does not expose a usable `localStorage`
// on `window` or `globalThis`, and Node's experimental shim has no
// `removeItem`/`setItem`. Zustand's persist middleware needs a real
// Storage implementation, so install a minimal in-memory shim.
function createMemoryStorage(): Storage {
  let store = new Map<string, string>()
  return {
    get length() { return store.size },
    key:        (i) => Array.from(store.keys())[i] ?? null,
    getItem:    (k) => store.get(k) ?? null,
    setItem:    (k, v) => { store.set(k, String(v)) },
    removeItem: (k) => { store.delete(k) },
    clear:      () => { store = new Map() },
  }
}

const memoryStorage = createMemoryStorage()

Object.defineProperty(globalThis, 'localStorage', {
  value:        memoryStorage,
  writable:     true,
  configurable: true,
})

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value:        memoryStorage,
    writable:     true,
    configurable: true,
  })
}
