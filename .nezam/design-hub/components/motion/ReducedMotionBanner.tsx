'use client'

import { useReducedMotion } from '@/src/hooks/useReducedMotion'

// F-006 T-F006-007 — Inline orange notice that surfaces when the OS reports
// `prefers-reduced-motion: reduce`. Mounted near the top of MotionStudio so
// users editing keyframes know previews will play as static stills.

export default function ReducedMotionBanner() {
  const reduced = useReducedMotion()
  if (!reduced) return null

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="reduced-motion-banner"
      className="flex items-start gap-2 px-3 py-2 border-b border-ds-warning bg-ds-warning/10 text-ds-xs text-ds-warning-foreground"
    >
      <span aria-hidden="true" className="font-bold">⚠</span>
      <span>
        <strong className="font-semibold">Reduced motion is on.</strong>{' '}
        Animations preview as static stills and durations collapse to 0ms.
      </span>
    </div>
  )
}
