'use client'

import { memo, useCallback, type MouseEvent } from 'react'
import { useCanvasGraphStore, type CanvasWire } from '@/src/store/canvas-graph.store'
import {
  bezierControlPoints,
  bezierPathD,
  sourcePort,
  targetPort,
  type NodeBox,
} from '@/src/lib/canvas-math'
import { wireTypeColorVar } from '@/src/lib/node-style'

interface BezierWireProps {
  wire:        CanvasWire
  fromNode:    NodeBox
  toNode:      NodeBox
  rtl:         boolean
  isSelected:  boolean
}

// Renders a single bezier wire between two node ports. Uses
// `vector-effect="non-scaling-stroke"` so stroke width stays readable
// when the canvas zooms out — without it, low zoom would render the wire
// as an invisible hairline.
function BezierWireImpl({ wire, fromNode, toNode, rtl, isSelected }: BezierWireProps) {
  const src = sourcePort(fromNode, rtl)
  const tgt = targetPort(toNode, rtl)
  const path = bezierControlPoints(src, tgt, wire.cp1Offset, wire.cp2Offset, rtl)
  const d    = bezierPathD(path)

  const color = wireTypeColorVar(wire.type)

  // SVG parent uses pointer-events: none so wires don't block node clicks.
  // The hit-target path below re-enables pointer events locally so clicking
  // the wire opens the inspector.
  const setSelectedWireId = useCanvasGraphStore((s) => s.setSelectedWireId)
  const handleClick = useCallback(
    (e: MouseEvent<SVGPathElement>) => {
      e.stopPropagation()
      setSelectedWireId(wire.id)
    },
    [setSelectedWireId, wire.id],
  )

  return (
    <g aria-label={`${wire.type} wire`}>
      {/* Halo for selection — drawn under the main stroke. */}
      {isSelected && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeOpacity={0.25}
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}

      {/* Main wire stroke with dash-flow animation for navigational feel. */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;-10"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>

      {/* Invisible wide hit target — easier to click than a 1.5px stroke. */}
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        vectorEffect="non-scaling-stroke"
        onClick={handleClick}
        style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
      />
    </g>
  )
}

export default memo(BezierWireImpl)
