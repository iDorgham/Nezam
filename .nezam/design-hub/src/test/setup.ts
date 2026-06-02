// Vitest setup file referenced by `vitest.config.ts`.
import * as matchers from 'vitest-axe/matchers'
import { expect } from 'vitest'

expect.extend(matchers)

// In-memory localStorage shim so persisted Zustand stores work under the
// happy-dom test environment (which does not expose a global `localStorage`).
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>()
  const localStorageMock: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key) => (store.has(key) ? store.get(key)! : null),
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => void store.delete(key),
    setItem: (key, value) => void store.set(key, String(value)),
  }
  globalThis.localStorage = localStorageMock
}

