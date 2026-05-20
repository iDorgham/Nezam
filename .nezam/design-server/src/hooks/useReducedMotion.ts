'use client'

import { useEffect, useState } from 'react'

// F-006 T-F006-006 — Listen for `prefers-reduced-motion: reduce`. The PRD
// (Flow 4) requires Motion Studio durations to collapse to 0ms and show a
// static fallback when this is on, so the rest of the canvas reads this hook
// to decide whether to animate.
//
// SSR-safe: returns `false` on the server, then re-evaluates on mount.

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    const mql = window.matchMedia(QUERY)
    setReduced(mql.matches)

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    // Older Safari needs addListener / removeListener — addEventListener is
    // the standard path used by everything since 2020.
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    }
    // Legacy Safari API. Cast through unknown because TS doesn't ship the
    // ancient `addListener` / `removeListener` overloads anymore.
    const legacy = mql as unknown as {
      addListener:    (cb: (e: MediaQueryListEvent) => void) => void
      removeListener: (cb: (e: MediaQueryListEvent) => void) => void
    }
    legacy.addListener(handler)
    return () => { legacy.removeListener(handler) }
  }, [])

  return reduced
}
