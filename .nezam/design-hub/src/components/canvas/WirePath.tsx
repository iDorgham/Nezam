'use client'

import { useMemo } from 'react'
import type { CanvasNode, CanvasEdge } from '@/store/canvas-graph.store'
import { outputSocketPos, inputSocketPos } from './GraphNode'

// ── Bezier geometry ──────────────────────────────────────────────

/**
 * Build an SVG cubic bezier path between two world-space points.
 * Control-point offset grows with horizontal distance so curves look
 * natural for both short and long connections.
 */
export function bezierPath(fx: number, fy: number, tx: number, ty: number): string {
  const cx = Math.max(Math.abs(tx - fx) * 0.45, 50)
  return `M ${fx} ${fy} C ${fx + cx} ${fy}, ${tx - cx} ${ty}, ${tx} ${ty}`
}

// ── WirePath ─────────────────────────────────────────────────────

interface WirePathProps {
  edge: CanvasEdge
  fromNode: CanvasNode
  toNode: CanvasNode
}

/**
 * Renders a connected wire between two nodes.
 *
 * Layers (bottom to top):
 *   1. Wide glow halo via SVG filter
 *   2. Thin base track (--app-border-strong)
 *   3. Animated accent pulse (stroke-dashoffset via CSS @keyframes wire-pulse)
 *   4. Latency badge via <foreignObject>
 *
 * All paths use pathLength="1000" so dash values are scale-independent.
 * vector-effect="non-scaling-stroke" keeps stroke widths constant at any zoom.
 */
export function WirePath({ edge, fromNode, toNode }: WirePathProps) {
  const from = outputSocketPos(fromNode)
  const to = inputSocketPos(toNode)
  const d = useMemo(() => bezierPath(from.x, from.y, to.x, to.y), [from.x, from.y, to.x, to.y])

  // Approximate path length in pixels to drive pulse speed
  const dx = to.x - from.x
  const dy = to.y - from.y
  const approxLen = Math.sqrt(dx * dx + dy * dy) * 1.2
  // Duration: ~0.8s for short paths, scales up for longer ones
  const duration = `${Math.max(0.7, approxLen / 280).toFixed(2)}s`

  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2

  return (
    <g>
      {/* Glow halo */}
      <path
        d={d}
        fill="none"
        stroke="var(--app-accent)"
        strokeWidth={7}
        strokeOpacity={0.12}
        vectorEffect="non-scaling-stroke"
        filter="url(#wire-glow)"
      />

      {/* Base track */}
      <path
        d={d}
        fill="none"
        stroke="var(--app-border-strong)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      {/* Accent gradient overlay — faint tint so wires feel "live" */}
      <path
        d={d}
        fill="none"
        stroke="var(--app-accent)"
        strokeWidth={1.5}
        strokeOpacity={0.25}
        vectorEffect="non-scaling-stroke"
      />

      {/* Animated pulse dot */}
      <path
        d={d}
        fill="none"
        stroke="var(--app-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray="80 1000"
        vectorEffect="non-scaling-stroke"
        style={{
          animationName: 'wire-pulse',
          animationDuration: duration,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      />

      {/* Latency badge */}
      <foreignObject
        x={midX - 18}
        y={midY - 9}
        width={36}
        height={18}
        style={{ overflow: 'visible', pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'var(--app-elevated)',
            border: '1px solid var(--app-border)',
            borderRadius: 3,
            padding: '1px 5px',
            fontSize: 9,
            color: 'var(--app-muted)',
            textAlign: 'center',
            fontFamily: 'var(--app-font-mono)',
            whiteSpace: 'nowrap',
            lineHeight: 1.4,
          }}
        >
          {edge.latency}ms
        </div>
      </foreignObject>
    </g>
  )
}

// ── DraftWirePath ─────────────────────────────────────────────────

interface DraftWirePathProps {
  fromX: number
  fromY: number
  // toX / toY are written directly to this element's `d` attribute
  // via CanvasWorkspace's useEffect to avoid React re-renders on every
  // pointermove. We render only the path element — parent manages updates.
  pathRef: React.RefObject<SVGPathElement | null>
}

/**
 * A controlled SVG path for the in-progress wire being dragged from a socket.
 * The parent writes to pathRef.current.setAttribute('d', ...) on every pointermove
 * to achieve 60fps updates without triggering React reconciliation.
 */
export function DraftWirePath({ fromX, fromY, pathRef }: DraftWirePathProps) {
  const initialD = bezierPath(fromX, fromY, fromX + 60, fromY)

  return (
    <path
      ref={pathRef}
      d={initialD}
      fill="none"
      stroke="var(--app-accent)"
      strokeWidth={2}
      strokeDasharray="6 4"
      strokeLinecap="round"
      strokeOpacity={0.85}
      vectorEffect="non-scaling-stroke"
    />
  )
}
