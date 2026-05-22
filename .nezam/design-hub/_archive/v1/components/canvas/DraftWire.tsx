'use client'

import {
  bezierControlPoints,
  bezierPathD,
  type Point,
} from '@/src/lib/canvas-math'

// Transient wire drawn while the user is dragging from a source port to a
// target. Not persisted; mounts inside the world SVG so its coords are in
// canvas space. Same dash-flow as a real wire so the user gets immediate
// visual continuity once they commit.
export default function DraftWire({
  src,
  cursor,
  rtl,
}: {
  src:    Point
  cursor: Point
  rtl:    boolean
}) {
  const path = bezierControlPoints(
    src,
    cursor,
    { x: 80,  y: 0 },
    { x: -80, y: 0 },
    rtl,
  )
  return (
    <path
      d={bezierPathD(path)}
      fill="none"
      stroke="var(--dv-wire-navigational)"
      strokeWidth={1.5}
      strokeDasharray="4 4"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      opacity={0.75}
    />
  )
}
