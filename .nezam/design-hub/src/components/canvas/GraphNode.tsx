'use client'

import { useRef, useCallback } from 'react'
import { FileText, Database, ShieldCheck, Zap, Globe, Sparkles, X } from 'lucide-react'
import { useCanvasGraph } from '@/store/canvas-graph.store'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/cn'
import type { CanvasNode, CameraState, NodeType } from '@/store/canvas-graph.store'

// ── Node metadata ────────────────────────────────────────────────

interface NodeMeta {
  label: string
  color: string
  icon: typeof Database
}

const NODE_META: Record<NodeType, NodeMeta> = {
  page:          { label: 'Page',        color: 'var(--app-accent)',   icon: FileText    },
  neon:          { label: 'Neon DB',     color: '#3b82f6',             icon: Database    },
  'better-auth': { label: 'Better Auth', color: '#a78bfa',             icon: ShieldCheck },
  redis:         { label: 'Redis',       color: 'var(--app-danger)',   icon: Zap         },
  'cf-workers':  { label: 'CF Workers',  color: '#f97316',             icon: Globe       },
  gemini:        { label: 'Gemini LLM',  color: 'var(--app-success)',  icon: Sparkles    },
}

// Socket geometry constants
const SOCK_R = 6 // socket circle radius px (world space)

// ── Exported helpers — used by WirePath and CanvasWorkspace ──────

/** Center of a node's output socket in world space. */
export function outputSocketPos(node: CanvasNode) {
  return { x: node.x + node.width, y: node.y + node.height / 2 }
}

/** Center of a node's input socket in world space. */
export function inputSocketPos(node: CanvasNode) {
  return { x: node.x, y: node.y + node.height / 2 }
}

// ── GraphNode component ──────────────────────────────────────────

interface GraphNodeProps {
  node: CanvasNode
  isSelected: boolean
  cam: React.MutableRefObject<CameraState>
}

export function GraphNode({ node, isSelected, cam }: GraphNodeProps) {
  const updateNodePosition = useCanvasGraph((s) => s.updateNodePosition)
  const selectNode = useCanvasGraph((s) => s.selectNode)
  const removeNode = useCanvasGraph((s) => s.removeNode)
  const setDraftWire = useCanvasGraph((s) => s.setDraftWire)
  const setBuilderMode = useHub((s) => s.setBuilderMode)

  const meta = NODE_META[node.type]
  const Icon = meta.icon
  const isService = node.type !== 'page'

  const nodeRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    startClientX: number
    startClientY: number
    startX: number
    startY: number
  } | null>(null)

  // ── Node dragging (direct DOM → sync to store on drop) ───────────

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Let socket pointer events through to their own handler
      if ((e.target as HTMLElement).dataset.socket) return
      if (e.button !== 0) return

      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      selectNode(node.id)
      dragRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: node.x,
        startY: node.y,
      }
    },
    [node.id, node.x, node.y, selectNode],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return
      const { scale } = cam.current
      const dx = (e.clientX - dragRef.current.startClientX) / scale
      const dy = (e.clientY - dragRef.current.startClientY) / scale
      // Directly mutate DOM — no React render during drag
      if (nodeRef.current) {
        nodeRef.current.style.transform = `translate(${dragRef.current.startX + dx}px,${dragRef.current.startY + dy}px)`
      }
    },
    [cam],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return
      const { scale } = cam.current
      const dx = (e.clientX - dragRef.current.startClientX) / scale
      const dy = (e.clientY - dragRef.current.startClientY) / scale
      updateNodePosition(node.id, dragRef.current.startX + dx, dragRef.current.startY + dy)
      dragRef.current = null
    },
    [node.id, cam, updateNodePosition],
  )

  // ── Double-click: switch to page builder ─────────────────────────
  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (node.type !== 'page') return
      e.stopPropagation()
      selectNode(node.id)
      // Switch center canvas to page-builder view
      setBuilderMode('brand')
    },
    [node.id, node.type, selectNode, setBuilderMode],
  )

  // ── Output socket drag — start wire ─────────────────────────────
  const onOutputSocketPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const out = outputSocketPos(node)
      setDraftWire({ fromNodeId: node.id, fromX: out.x, fromY: out.y })
    },
    [node, setDraftWire],
  )

  return (
    <div
      ref={nodeRef}
      data-node-id={node.id}
      style={{
        position: 'absolute',
        transform: `translate(${node.x}px,${node.y}px)`,
        width: node.width,
        height: node.height,
        willChange: 'transform',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      {/* ── Input socket — inline-start ───────────────────────── */}
      <div
        data-socket="input"
        data-node-id={node.id}
        style={{
          position: 'absolute',
          insetInlineStart: -(SOCK_R + 1),
          top: node.height / 2 - SOCK_R,
          width: SOCK_R * 2,
          height: SOCK_R * 2,
          borderRadius: '50%',
          background: 'var(--app-elevated)',
          border: '2px solid var(--app-border-strong)',
          cursor: 'crosshair',
          zIndex: 10,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* ── Node card ─────────────────────────────────────────── */}
      <div
        className={cn(
          'h-full w-full select-none rounded-[6px] border transition-all duration-150',
          isSelected
            ? 'border-app-accent bg-app-elevated shadow-app-glow'
            : 'border-app-border bg-app-surface shadow-app hover:border-app-border-strong hover:bg-app-elevated',
        )}
        style={{ cursor: dragRef.current ? 'grabbing' : 'grab' }}
      >
        {/* Header stripe */}
        <div className="flex items-center gap-2 border-b border-app-border px-2.5 py-1.5">
          <div
            className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded"
            style={{
              background: `color-mix(in srgb, ${meta.color} 16%, transparent)`,
              color: meta.color,
            }}
          >
            <Icon size={10} />
          </div>
          <span
            className="truncate text-[9px] font-semibold uppercase tracking-widest"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>

          {isSelected && (
            <button
              className="ms-auto grid h-4 w-4 place-items-center rounded text-app-subtle hover:text-app-danger active:scale-90"
              data-socket="" // prevents drag on this button
              onPointerDown={(e) => {
                e.stopPropagation()
                removeNode(node.id)
              }}
              aria-label="Remove node"
            >
              <X size={9} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-0.5 px-2.5 py-2">
          <span className="truncate text-[12px] font-semibold text-app-text leading-tight">
            {node.label}
          </span>
          {node.type === 'page' && isSelected && (
            <span className="text-[9px] text-app-subtle">⌤ double-click → Page Builder</span>
          )}
        </div>
      </div>

      {/* ── Output socket — inline-end ────────────────────────── */}
      <div
        data-socket="output"
        style={{
          position: 'absolute',
          insetInlineEnd: -(SOCK_R + 1),
          top: node.height / 2 - SOCK_R,
          width: SOCK_R * 2,
          height: SOCK_R * 2,
          borderRadius: '50%',
          background: meta.color,
          border: '2px solid var(--app-deep)',
          cursor: 'crosshair',
          zIndex: 10,
          boxShadow: `0 0 8px color-mix(in srgb, ${meta.color} 55%, transparent)`,
        }}
        onPointerDown={onOutputSocketPointerDown}
      />
    </div>
  )
}
