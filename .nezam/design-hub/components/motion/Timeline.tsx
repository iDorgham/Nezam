'use client'

import { useCallback, useMemo, type MouseEvent, type ReactNode } from 'react'
import { useMotionStore } from '@/src/store/motion.store'

// F-006 T-F006-002 — Timeline ruler + grid.
// Ruler ticks every 0.1s, major label every 1.0s. Click anywhere on the
// ruler (or in the empty grid body) to scrub the playhead. Track rows from
// T-F006-003 mount via `children`. Cyan playhead line is T-F006-008.

export const PX_PER_SECOND = 120
const MINOR_TICK_MS = 100
const MAJOR_TICK_MS = 1000

export function msToPx(ms: number): number {
  return (ms / 1000) * PX_PER_SECOND
}

export function pxToMs(px: number): number {
  return (px / PX_PER_SECOND) * 1000
}

interface TimelineProps {
  /** Track rows (T-F006-003) render in the grid body. */
  children?: ReactNode
}

export default function Timeline({ children }: TimelineProps) {
  const durationMs     = useMotionStore((s) => s.durationMs)
  const currentTimeMs  = useMotionStore((s) => s.currentTimeMs)
  const setCurrentTime = useMotionStore((s) => s.setCurrentTime)

  const totalWidthPx = msToPx(durationMs)

  // Compute tick positions once per duration change. Includes the leading 0
  // and the trailing edge at exactly durationMs.
  const ticks = useMemo(() => {
    const out: { ms: number; major: boolean }[] = []
    for (let ms = 0; ms <= durationMs; ms += MINOR_TICK_MS) {
      out.push({ ms, major: ms % MAJOR_TICK_MS === 0 })
    }
    return out
  }, [durationMs])

  const handleScrub = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      setCurrentTime(pxToMs(x))
    },
    [setCurrentTime],
  )

  return (
    <div
      role="region"
      aria-label="Timeline"
      className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex flex-col"
    >
      <div
        className="relative flex flex-col"
        style={{ width: Math.max(totalWidthPx, 1) }}
      >
        {/* ── Ruler ─────────────────────────────────────────────────────── */}
        <div
          role="slider"
          aria-label="Playhead position"
          aria-valuemin={0}
          aria-valuemax={durationMs}
          aria-valuenow={Math.round(currentTimeMs)}
          aria-valuetext={`${(currentTimeMs / 1000).toFixed(2)} seconds`}
          tabIndex={0}
          onClick={handleScrub}
          data-testid="timeline-ruler"
          className="relative h-6 border-b border-ds-border bg-ds-surface-elevated cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-ds-border-focus"
        >
          {ticks.map(({ ms, major }) => (
            <div
              key={ms}
              data-tick-ms={ms}
              data-tick-major={major || undefined}
              aria-hidden="true"
              className={`absolute top-0 ${major ? 'h-3' : 'h-1.5'} w-px ${
                major ? 'bg-ds-text-secondary' : 'bg-ds-border'
              }`}
              style={{ left: msToPx(ms) }}
            />
          ))}

          {ticks.filter((t) => t.major).map(({ ms }) => (
            <span
              key={`label-${ms}`}
              aria-hidden="true"
              className="absolute top-3 text-[9px] font-mono text-ds-text-muted leading-none ps-0.5"
              style={{ left: msToPx(ms) }}
            >
              {(ms / 1000).toFixed(1)}s
            </span>
          ))}
        </div>

        {/* ── Grid body ─────────────────────────────────────────────────── */}
        <div
          onClick={handleScrub}
          data-testid="timeline-grid"
          className="relative flex-1 min-h-[80px] cursor-pointer"
        >
          {/* Vertical column guides at every major tick — subtle, behind the
              tracks. Helps the eye line up keyframes (T-F006-004). */}
          {ticks.filter((t) => t.major).map(({ ms }) => (
            <div
              key={`col-${ms}`}
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-px bg-ds-border/40"
              style={{ left: msToPx(ms) }}
            />
          ))}
          {children}
        </div>

        {/* ── Scrub playhead (T-F006-008) ────────────────────────────────
            Cyan 1px line spans ruler + grid; position tracks currentTimeMs
            reactively. pointer-events-none so it doesn't eat scrub clicks. */}
        <div
          aria-hidden="true"
          data-testid="timeline-playhead"
          className="absolute top-0 bottom-0 w-px bg-ds-info pointer-events-none"
          style={{ left: msToPx(currentTimeMs) }}
        />
      </div>
    </div>
  )
}
