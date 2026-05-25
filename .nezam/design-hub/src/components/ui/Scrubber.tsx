'use client'

import { useCallback, useRef } from 'react'
import { cn } from '@/lib/cn'

interface ScrubberProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  /** Pixels of drag per one `step` unit. Default 3. */
  pixelsPerStep?: number
  format?: (v: number) => string
  className?: string
}

/**
 * DevFlow value scrubber — horizontal click-drag to increment/decrement a
 * numeric token at 60fps. Shows a dashed underline and ↔ cursor to hint
 * interactivity.
 *
 * Usage:
 *   <Scrubber value={tokens.radius} onChange={v => setToken('radius', v)} min={0} max={28} step={1} />
 */
export function Scrubber({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  pixelsPerStep = 3,
  format = (v) => String(v),
  className,
}: ScrubberProps) {
  const startX = useRef<number | null>(null)
  const startVal = useRef<number>(value)

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      e.preventDefault()
      startX.current = e.clientX
      startVal.current = value
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [value],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (startX.current === null) return
      const dx = e.clientX - startX.current
      const delta = Math.round(dx / pixelsPerStep) * step
      const next = Math.max(min, Math.min(max, startVal.current + delta))
      if (next !== value) onChange(next)
    },
    [value, onChange, min, max, step, pixelsPerStep],
  )

  const onPointerUp = useCallback(() => {
    startX.current = null
  }, [])

  return (
    <span
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max === Infinity ? undefined : max}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(Math.min(max, value + step))
        if (e.key === 'ArrowLeft')  onChange(Math.max(min, value - step))
      }}
      className={cn(
        'select-none font-mono text-[11px] text-app-accent',
        'cursor-ew-resize border-b border-dashed border-app-accent/50',
        'transition-colors hover:border-app-accent hover:text-app-accent-hover',
        'focus:outline-none focus:ring-1 focus:ring-app-accent rounded-[2px]',
        className,
      )}
    >
      {format(value)}
    </span>
  )
}
