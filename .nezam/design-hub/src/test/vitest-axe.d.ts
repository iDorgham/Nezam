import type { AxeResults } from 'vitest-axe'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): T extends AxeResults ? void : never
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void
  }
}
