import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import ReducedMotionBanner from './ReducedMotionBanner'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function makeMatchMediaFake(initial: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  let matches = initial
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
  mql = makeMatchMediaFake(false)
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

describe('ReducedMotionBanner', () => {
  it('renders nothing when reduced motion is off', () => {
    render(<ReducedMotionBanner />)
    expect(container!.querySelector('[data-testid="reduced-motion-banner"]')).toBeNull()
  })

  it('renders an aria-live status banner when reduced motion is on', () => {
    mql._setMatches(true)
    render(<ReducedMotionBanner />)

    const banner = container!.querySelector('[data-testid="reduced-motion-banner"]')!
    expect(banner).not.toBeNull()
    expect(banner.getAttribute('role')).toBe('status')
    expect(banner.getAttribute('aria-live')).toBe('polite')
    expect(banner.textContent).toMatch(/Reduced motion is on/)
  })

  it('appears reactively when the media query flips after mount', () => {
    render(<ReducedMotionBanner />)
    expect(container!.querySelector('[data-testid="reduced-motion-banner"]')).toBeNull()

    act(() => { mql._setMatches(true) })

    expect(container!.querySelector('[data-testid="reduced-motion-banner"]')).not.toBeNull()
  })
})
