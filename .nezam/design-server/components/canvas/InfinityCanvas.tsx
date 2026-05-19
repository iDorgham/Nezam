'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react'
import { useCanvasGraphStore, type CanvasWire } from '@/src/store/canvas-graph.store'
import { useCanvasViewport } from '@/src/hooks/useCanvasViewport'
import { sourcePort, targetPort, type Point } from '@/src/lib/canvas-math'
import CanvasEmptyState from './CanvasEmptyState'
import CanvasNode from './CanvasNode'
import BezierWire from './BezierWire'
import DraftWire from './DraftWire'
import WireInspector from './WireInspector'

const GRID_PX = 24

interface WiringSource {
  nodeId:  string
  portPos: Point
}

// SPEC-DS-CANVAS-001 §3 + §4. F-005a delivered the shell; F-005b adds
// nodes, wires, LOD, and wiring mode on top of the world layer.
export default function InfinityCanvas() {
  const {
    viewport,
    handlePointerDown: panPointerDown,
    handlePointerMove: panPointerMove,
    handlePointerUp:   panPointerUp,
    handleWheel,
    screenToWorld,
  } = useCanvasViewport()

  const nodes           = useCanvasGraphStore((s) => s.nodes)
  const wires           = useCanvasGraphStore((s) => s.wires)
  const rtlMode         = useCanvasGraphStore((s) => s.rtlMode)
  const selectedNodeIds = useCanvasGraphStore((s) => s.selectedNodeIds)
  const selectedWireId  = useCanvasGraphStore((s) => s.selectedWireId)
  const addWire         = useCanvasGraphStore((s) => s.addWire)
  const setSelectedIds  = useCanvasGraphStore((s) => s.setSelectedNodeIds)

  const selectedSet = useMemo(() => new Set(selectedNodeIds), [selectedNodeIds])
  const nodeById    = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  // Wiring mode is a local UI state — the W key toggles it. The source
  // anchor is also local; we only commit a CanvasWire to the store once
  // both endpoints are known.
  const [wiringMode,    setWiringMode]   = useState(false)
  const [wiringSource,  setWiringSource] = useState<WiringSource | null>(null)
  const [cursorWorld,   setCursorWorld]  = useState<Point | null>(null)

  // Keyboard: W toggles wiring mode, Esc cancels an in-flight wire.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs/textareas.
      const target = e.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (target?.isContentEditable) return

      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault()
        setWiringMode((v) => {
          if (v) setWiringSource(null) // exiting → clear source
          return !v
        })
      } else if (e.key === 'Escape') {
        setWiringSource(null)
        setWiringMode(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handlePortDown = useCallback(
    (nodeId: string, role: 'source' | 'target', _e: PointerEvent<HTMLElement>) => {
      const node = nodeById.get(nodeId)
      if (!node) return

      // Click a source port → start wire. Even if wiring mode wasn't on,
      // we flip it on so the cursor switches to crosshair and the user
      // sees the draft wire (spec AC-002 mentions W activates, but
      // port-down is a natural shortcut into the same state).
      if (role === 'source') {
        setWiringMode(true)
        setWiringSource({ nodeId, portPos: sourcePort(node, rtlMode) })
        setCursorWorld(targetPort(node, rtlMode)) // seed cursor near port
        return
      }

      // Click a target port — completes the wire if we have a source on
      // a *different* node. Same-node targets are silently ignored per
      // spec §6 edge case "Wire from node to itself → blocked".
      if (role === 'target' && wiringSource && wiringSource.nodeId !== nodeId) {
        const newWire: CanvasWire = {
          id:                   crypto.randomUUID(),
          fromNodeId:           wiringSource.nodeId,
          toNodeId:             nodeId,
          type:                 'navigational',
          attachments:          [],
          annotativeDirectives: [],
          cp1Offset:            { x: 80,  y: 0 },
          cp2Offset:            { x: -80, y: 0 },
        }
        addWire(newWire)
        setWiringSource(null)
        setWiringMode(false)
      }
    },
    [nodeById, rtlMode, wiringSource, addWire],
  )

  const handleRootPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      // Port and node handlers already stopped propagation, so anything
      // reaching here is on the bare canvas. Two cases:
      //   1. Wiring mode is OFF → start a viewport pan.
      //   2. Wiring mode is ON  → cancel any in-flight wire on background click.
      if (wiringSource) {
        setWiringSource(null)
        return
      }
      panPointerDown(e)
      // Background click also clears selection.
      if (selectedNodeIds.length > 0) setSelectedIds([])
    },
    [wiringSource, panPointerDown, selectedNodeIds.length, setSelectedIds],
  )

  const handleRootPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      // Track cursor in world space whenever a draft wire is live.
      if (wiringSource) {
        const rect = e.currentTarget.getBoundingClientRect()
        setCursorWorld(
          screenToWorld({ x: e.clientX - rect.left, y: e.clientY - rect.top }),
        )
      }
      panPointerMove(e)
    },
    [wiringSource, screenToWorld, panPointerMove],
  )

  // Style for the inner transformed layer. transform-origin: 0 0 is the
  // contract assumed by canvas-math's screen↔canvas conversion.
  const layerStyle: CSSProperties = useMemo(() => ({
    transform:        `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
    transformOrigin:  '0 0',
    willChange:       'transform',
  }), [viewport])

  // Dot grid background that pans with the viewport.
  const gridStyle: CSSProperties = useMemo(() => {
    const sizePx = GRID_PX * viewport.scale
    return {
      backgroundImage:    'radial-gradient(circle, var(--dv-canvas-grid) 1px, transparent 1px)',
      backgroundSize:     `${sizePx}px ${sizePx}px`,
      backgroundPosition: `${viewport.x}px ${viewport.y}px`,
    }
  }, [viewport])

  const cursorClass =
    wiringMode || wiringSource
      ? 'cursor-crosshair'
      : 'cursor-grab active:cursor-grabbing'

  return (
    <div
      role="application"
      aria-label="Infinity canvas"
      dir={rtlMode ? 'rtl' : 'ltr'}
      onPointerDown={handleRootPointerDown}
      onPointerMove={handleRootPointerMove}
      onPointerUp={panPointerUp}
      onPointerCancel={panPointerUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden bg-ds-background touch-none select-none ${cursorClass}`}
    >
      {/* Grid layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={gridStyle}
      />

      {/* World layer — nodes positioned in canvas coordinates. */}
      <div className="absolute inset-0" style={layerStyle}>
        {/* Wire SVG sits BEFORE nodes so wires render behind them. The
            SVG has no fixed size — its content uses world coordinates
            and pointer-events: none keeps node interaction clean. */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 overflow-visible pointer-events-none"
          width="1"
          height="1"
        >
          {wires.map((wire) => {
            const from = nodeById.get(wire.fromNodeId)
            const to   = nodeById.get(wire.toNodeId)
            if (!from || !to) return null
            return (
              <BezierWire
                key={wire.id}
                wire={wire}
                fromNode={from}
                toNode={to}
                rtl={rtlMode}
                isSelected={wire.id === selectedWireId}
              />
            )
          })}

          {wiringSource && cursorWorld && (
            <DraftWire
              src={wiringSource.portPos}
              cursor={cursorWorld}
              rtl={rtlMode}
            />
          )}
        </svg>

        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            isSelected={selectedSet.has(node.id)}
            wiringMode={wiringMode}
            onPortDown={handlePortDown}
          />
        ))}
      </div>

      <CanvasEmptyState />

      {/* Wiring mode hint — bottom-left badge so the user knows the
          mode is engaged and how to exit. */}
      {wiringMode && (
        <div className="absolute bottom-3 start-3 px-2.5 py-1 rounded-ds-sm border border-ds-primary bg-ds-primary-subtle text-ds-primary text-ds-xs font-medium pointer-events-none">
          Wiring mode · W or Esc to exit
        </div>
      )}

      <WireInspector />
    </div>
  )
}
