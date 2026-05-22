import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// Minimal MediaQueryList fake — happy-dom doesn't ship one. We expose
// `_setMatches(b)` so the test can flip state and exercise the change listener.
function makeMatchMediaFake() {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  let matches = false

  const mql = {
    get matches() { return matches },
    media: '(prefers-reduced-motion: reduce)',
    addEventListener:    (_t: string, l: (e: MediaQueryListEvent) => void) => listeners.add(l),
    removeEventListener: (_t: string, l: (e: MediaQueryListEvent) => void) => listeners.delete(l),
  } as unknown as MediaQueryList & { _setMatches: (m: boolean) => void }

  ;(mql as { _setMatches: (m: boolean) => void })._setMatches = (next) => {
    matches = next
    for (const l of listeners) l({ matches: next } as MediaQueryListEvent)
  }
  return mql
}

function Probe({ onValue }: { onValue: (v: boolean) => void }) {
  const reduced = useReducedMotion()
  onValue(reduced)
  return null
}

let container: HTMLDivElement | null = null
let root: Root | null = null
let mql: ReturnType<typeof makeMatchMediaFake>
const originalMatchMedia = typeof window !== 'undefined' ? window.matchMedia : undefined

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => { root!.render(ui) })
}

beforeEach(() => {
  mql = makeMatchMediaFake()
  ;(window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = () => mql
})

afterEach(() => {
  if (root) {
    act(() => { root!.unmount() })
    root = null
  }
  container?.remove()
  container = null
  if (originalMatchMedia) (window as unknown as { matchMedia: typeof originalMatchMedia }).matchMedia = originalMatchMedia
})

describe('useReducedMotion', () => {
  it('returns false on mount when matchMedia.matches is false', () => {
    const samples: boolean[] = []
    render(<Probe onValue={(v) => samples.push(v)} />)

    expect(samples[samples.length - 1]).toBe(false)
  })

  it('returns true on mount when matchMedia.matches is true', () => {
    ;(mql as unknown as { _setMatches: (m: boolean) => void })._setMatches(true)
    const samples: boolean[] = []
    render(<Probe onValue={(v) => samples.push(v)} />)

    // First sample (server-default false) is discarded by the effect setter.
    expect(samples[samples.length - 1]).toBe(true)
  })

  it('updates reactively when the media-query value flips', () => {
    const samples: boolean[] = []
    render(<Probe onValue={(v) => samples.push(v)} />)
    expect(samples[samples.length - 1]).toBe(false)

    act(() => {
      ;(mql as unknown as { _setMatches: (m: boolean) => void })._setMatches(true)
    })
    expect(samples[samples.length - 1]).toBe(true)

    act(() => {
      ;(mql as unknown as { _setMatches: (m: boolean) => void })._setMatches(false)
    })
    expect(samples[samples.length - 1]).toBe(false)
  })
})
