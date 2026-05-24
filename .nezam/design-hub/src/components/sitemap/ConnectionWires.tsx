'use client'

import { useLayoutEffect, useRef, useState } from 'react'

// ── Wire config ───────────────────────────────────────────────────────────────

const WIRE_COLORS: Record<string, string> = {
  git:      '#22c55e', // emerald-500
  database: '#3b82f6', // blue-500
  platform: '#8b5cf6', // violet-500
}

interface WirePath {
  key: string
  d: string
  color: string
  opacity: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Walk up offsetParent chain to compute element position relative to `root`.
 * root must have position: relative (or absolute/fixed).
 */
function offsetRect(el: HTMLElement, root: HTMLElement): { x: number; y: number; w: number; h: number } {
  let x = 0; let y = 0
  let curr: HTMLElement | null = el
  while (curr && curr !== root) {
    x += curr.offsetLeft
    y += curr.offsetTop
    curr = curr.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

function bezier(x1: number, y1: number, x2: number, y2: number): string {
  const cx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ConnectionWiresProps {
  /** The canvas transform div (position: relative) — offsetParent for all children. */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Increment whenever apps/infra changes to trigger a remeasure. */
  version: number
}

export function ConnectionWires({ containerRef, version }: ConnectionWiresProps) {
  const [wires, setWires] = useState<WirePath[]>([])
  const frameRef = useRef<number>(0)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const sections = ['git', 'database', 'platform'] as const
      const appEls = Array.from(
        container.querySelectorAll('[data-app-block]'),
      ) as HTMLElement[]

      if (!appEls.length) { setWires([]); return }

      const newWires: WirePath[] = []

      for (const key of sections) {
        const srcEl = container.querySelector(
          `[data-infra-section="${key}"]`,
        ) as HTMLElement | null
        if (!srcEl) continue

        const src = offsetRect(srcEl, container)
        const srcX = src.x + src.w          // right edge
        const srcY = src.y + src.h / 2      // vertical center

        for (const appEl of appEls) {
          const dst = offsetRect(appEl, container)
          const dstX = dst.x                // left edge
          const dstY = dst.y + dst.h / 2   // vertical center

          newWires.push({
            key: `${key}-${appEl.dataset.appBlock ?? Math.random()}`,
            d: bezier(srcX, srcY, dstX, dstY),
            color: WIRE_COLORS[key],
            opacity: 0.45,
          })
        }
      }

      setWires(newWires)
    }

    // Defer slightly so the layout has settled
    frameRef.current = requestAnimationFrame(measure)

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(measure)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
    }
  }, [containerRef, version])

  if (!wires.length) return null

  return (
    <svg
      className="pointer-events-none absolute"
      style={{ top: 0, left: 0, width: 0, height: 0, overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <style>{`
          @keyframes _wire-flow {
            to { stroke-dashoffset: -20; }
          }
          .snb-wire { animation: _wire-flow 1.4s linear infinite; }
        `}</style>
      </defs>
      {wires.map((w) => (
        <path
          key={w.key}
          d={w.d}
          stroke={w.color}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5 4"
          strokeOpacity={w.opacity}
          strokeLinecap="round"
          className="snb-wire"
        />
      ))}
    </svg>
  )
}
