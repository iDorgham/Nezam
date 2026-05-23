'use client'

import { useRef, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useCanvasGraph } from '@/store/canvas-graph.store'
import { useCanvasCamera } from '@/hooks/useCanvasCamera'
import { GraphNode, outputSocketPos, inputSocketPos } from './GraphNode'
import { WirePath, DraftWirePath, bezierPath } from './WirePath'
import { IntegrationMenu } from './IntegrationMenu'

// ── SVG defs (glow filter + gradient) — hoisted outside component ──

const SVG_DEFS = (
  <defs>
    {/* Bloom glow for wire halo layer */}
    <filter id="wire-glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
)

// ── CanvasWorkspace ───────────────────────────────────────────────

/**
 * Infinite sitemap canvas.
 *
 * Architecture:
 *   - containerRef  : overflow:hidden hit surface — receives pan/zoom events
 *   - gridRef       : screen-space dot grid; background-position tracks camera pan
 *   - worldRef      : world container with translate3d+scale transform; holds nodes + SVG wires
 *   - SVG overlay   : sits inside worldRef at (0,0), overflow:visible — all paths in world space
 *   - draftPathRef  : the in-progress wire path, mutated directly on every pointermove (zero renders)
 *
 * Camera math:  screenX = worldX * scale + panX   (and inverse for screen→world)
 * Zoom-to-point: new pan = cursor - worldPointUnderCursor * newScale
 */
export function CanvasWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const draftPathRef = useRef<SVGPathElement>(null)

  // Zustand subscriptions — only stable/structural data
  const nodes = useCanvasGraph((s) => s.nodes)
  const edges = useCanvasGraph((s) => s.edges)
  const draftWire = useCanvasGraph((s) => s.draftWire)
  const selectedNodeId = useCanvasGraph((s) => s.selectedNodeId)
  const camera = useCanvasGraph((s) => s.camera)

  const selectNode = useCanvasGraph((s) => s.selectNode)
  const addEdge = useCanvasGraph((s) => s.addEdge)
  const setDraftWire = useCanvasGraph((s) => s.setDraftWire)
  const openContextMenu = useCanvasGraph((s) => s.openContextMenu)

  // Camera hook — live transform via direct DOM, Zustand synced on end
  const { cam, screenToWorld, jumpTo } = useCanvasCamera(containerRef, worldRef, gridRef)

  // Fit all nodes into view on first mount (handles any canvas width)
  useEffect(() => {
    const el = containerRef.current
    if (!el || nodes.length === 0) return

    const PADDING = 64
    const minX = Math.min(...nodes.map((n) => n.x))
    const minY = Math.min(...nodes.map((n) => n.y))
    const maxX = Math.max(...nodes.map((n) => n.x + n.width))
    const maxY = Math.max(...nodes.map((n) => n.y + n.height))

    const worldW = maxX - minX
    const worldH = maxY - minY
    const { offsetWidth: vw, offsetHeight: vh } = el

    const scale = Math.max(
      0.1,
      Math.min(1.2, Math.min((vw - PADDING * 2) / worldW, (vh - PADDING * 2) / worldH)),
    )

    jumpTo({
      panX: (vw - worldW * scale) / 2 - minX * scale,
      panY: (vh - worldH * scale) / 2 - minY * scale,
      scale,
    })
  // Run once on mount — nodes list from initial store state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Draft wire tracking — zero React renders on pointermove ─────

  useEffect(() => {
    const path = draftPathRef.current
    if (!path) return

    if (!draftWire) {
      path.style.opacity = '0'
      return
    }

    path.style.opacity = '1'
    const { fromX, fromY } = draftWire

    const onMove = (e: PointerEvent) => {
      const { x, y } = screenToWorld(e.clientX, e.clientY)
      path.setAttribute('d', bezierPath(fromX, fromY, x, y))
    }

    const onUp = (e: PointerEvent) => {
      // Hit-test: did the pointer land on an input socket?
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const socketEl = target?.closest?.('[data-socket="input"]') as HTMLElement | null
      if (socketEl?.dataset.nodeId) {
        addEdge(draftWire.fromNodeId, socketEl.dataset.nodeId)
      }
      setDraftWire(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [draftWire, screenToWorld, addEdge, setDraftWire])

  // ── Interaction handlers ─────────────────────────────────────────

  const onContainerClick = useCallback(
    (e: React.MouseEvent) => {
      // Deselect when clicking empty canvas
      if (!(e.target as HTMLElement).closest('[data-node-id]')) {
        selectNode(null)
      }
    },
    [selectNode],
  )

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const { x, y } = screenToWorld(e.clientX, e.clientY)
      openContextMenu({ screenX: e.clientX, screenY: e.clientY, worldX: x, worldY: y })
    },
    [screenToWorld, openContextMenu],
  )

  // ── Zoom control buttons ─────────────────────────────────────────

  const zoomBy = useCallback(
    (factor: number) => {
      const el = containerRef.current
      if (!el) return
      const { panX, panY, scale } = cam.current
      const cx = el.offsetWidth / 2
      const cy = el.offsetHeight / 2
      const wx = (cx - panX) / scale
      const wy = (cy - panY) / scale
      const newScale = Math.max(0.1, Math.min(2, scale * factor))
      jumpTo({ panX: cx - wx * newScale, panY: cy - wy * newScale, scale: newScale })
    },
    [containerRef, cam, jumpTo],
  )

  const resetCamera = useCallback(() => {
    const el = containerRef.current
    const currentNodes = useCanvasGraph.getState().nodes
    if (!el || currentNodes.length === 0) return

    const PADDING = 64
    const minX = Math.min(...currentNodes.map((n) => n.x))
    const minY = Math.min(...currentNodes.map((n) => n.y))
    const maxX = Math.max(...currentNodes.map((n) => n.x + n.width))
    const maxY = Math.max(...currentNodes.map((n) => n.y + n.height))
    const worldW = maxX - minX
    const worldH = maxY - minY
    const { offsetWidth: vw, offsetHeight: vh } = el
    const scale = Math.max(
      0.1,
      Math.min(1.2, Math.min((vw - PADDING * 2) / worldW, (vh - PADDING * 2) / worldH)),
    )
    jumpTo({
      panX: (vw - worldW * scale) / 2 - minX * scale,
      panY: (vh - worldH * scale) / 2 - minY * scale,
      scale,
    })
  }, [containerRef, jumpTo])

  // ── Find nodes referenced by edges (memoised in render loop) ────

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  // ── Render ───────────────────────────────────────────────────────

  return (
    <div className="relative h-full w-full overflow-hidden bg-app-deep select-none">
      {/* ── Dot grid — screen space, position tracks camera ─────── */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--app-border-strong) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          opacity: 0.55,
        }}
      />

      {/* ── Hit surface — receives pan/zoom, click, context menu ── */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onClick={onContainerClick}
        onContextMenu={onContextMenu}
      >
        {/* ── World container — camera transform applied here ───── */}
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            overflow: 'visible',
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
        >
          {/* ── SVG overlay — wires drawn in world coordinates ───── */}
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1,
              height: 1,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            {SVG_DEFS}

            {/* Connected edges */}
            {edges.map((edge) => {
              const from = nodeMap[edge.fromNodeId]
              const to = nodeMap[edge.toNodeId]
              if (!from || !to) return null
              return <WirePath key={edge.id} edge={edge} fromNode={from} toNode={to} />
            })}

            {/*
             * Draft wire — always rendered so draftPathRef is stable.
             * Opacity is toggled via the useEffect above; the path's `d`
             * attribute is written directly on every pointermove without
             * any React re-renders.
             */}
            <DraftWirePath
              fromX={draftWire?.fromX ?? 0}
              fromY={draftWire?.fromY ?? 0}
              pathRef={draftPathRef}
            />
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <GraphNode
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              cam={cam}
            />
          ))}
        </div>
      </div>

      {/* ── Zoom HUD — bottom inline-end ──────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-4 z-20 flex items-center gap-1"
        style={{ insetInlineEnd: 16 }}
      >
        <div className="pointer-events-auto flex items-center gap-0.5 rounded-[5px] border border-app-border bg-app-elevated px-1.5 py-1 shadow-app">
          <button
            className="grid h-6 w-6 place-items-center rounded text-app-muted transition-colors hover:bg-app-surface hover:text-app-text active:scale-90"
            onClick={() => zoomBy(0.8)}
            aria-label="Zoom out"
          >
            <ZoomOut size={12} />
          </button>
          <span className="min-w-[34px] text-center font-mono text-[10px] text-app-muted">
            {Math.round(camera.scale * 100)}%
          </span>
          <button
            className="grid h-6 w-6 place-items-center rounded text-app-muted transition-colors hover:bg-app-surface hover:text-app-text active:scale-90"
            onClick={() => zoomBy(1.25)}
            aria-label="Zoom in"
          >
            <ZoomIn size={12} />
          </button>
          <div className="mx-0.5 h-3.5 w-px bg-app-border" />
          <button
            className="grid h-6 w-6 place-items-center rounded text-app-muted transition-colors hover:bg-app-surface hover:text-app-text active:scale-90"
            onClick={resetCamera}
            aria-label="Reset view"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* ── Keyboard hint — bottom center ─────────────────────────── */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        <p className="whitespace-nowrap rounded-full border border-app-border bg-app-elevated/80 px-4 py-1 text-[10px] text-app-subtle backdrop-blur">
          <kbd className="font-mono">Space</kbd> drag · Scroll zoom · Right-click add ·{' '}
          <kbd className="font-mono">dbl-click</kbd> page&nbsp;→ builder
        </p>
      </div>

      {/* ── Integration context menu (screen-space fixed) ─────────── */}
      <IntegrationMenu />
    </div>
  )
}
