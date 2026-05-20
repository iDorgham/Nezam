'use client'

import { memo, useCallback, useRef, type CSSProperties, type PointerEvent } from 'react'
import {
  useCanvasGraphStore,
  type CanvasNode as CanvasNodeData,
} from '@/src/store/canvas-graph.store'
import { lodForScale, screenToCanvas } from '@/src/lib/canvas-math'
import { nodeTypeColorVar } from '@/src/lib/node-style'
import HardlockOverlay from './HardlockOverlay'

interface CanvasNodeProps {
  node:        CanvasNodeData
  isSelected:  boolean
  wiringMode:  boolean
  onPortDown:  (nodeId: string, role: 'source' | 'target', e: PointerEvent<HTMLElement>) => void
}

// One node on the world layer. Renders one of three LOD branches based on
// the current viewport scale. Drag-to-move is supported only in the two
// larger LODs — at dot scale the user can't aim precisely enough.
function CanvasNodeImpl({ node, isSelected, wiringMode, onPortDown }: CanvasNodeProps) {
  const viewport       = useCanvasGraphStore((s) => s.viewport)
  const rtlMode        = useCanvasGraphStore((s) => s.rtlMode)
  const updateNode     = useCanvasGraphStore((s) => s.updateNode)
  const setSelectedIds = useCanvasGraphStore((s) => s.setSelectedNodeIds)

  const lod  = lodForScale(viewport.scale)
  const color = nodeTypeColorVar(node.type)

  // Drag state lives in a ref so we don't re-render on every pointermove.
  const dragOrigin = useRef<{ screen: { x: number; y: number }; nodeStart: { x: number; y: number } } | null>(null)

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return
      // Don't start a drag when the user is targeting a port — that path
      // belongs to wiring mode. Port handlers stop propagation themselves
      // but be defensive.
      if ((e.target as HTMLElement).dataset.port) return

      e.stopPropagation()
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      setSelectedIds([node.id])
      dragOrigin.current = {
        screen:    { x: e.clientX, y: e.clientY },
        nodeStart: { x: node.x, y: node.y },
      }
    },
    [node.id, node.x, node.y, setSelectedIds],
  )

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const drag = dragOrigin.current
      if (!drag) return
      // World-space delta = screen delta / scale. No RTL flip here: node
      // drag is a direct physical action — dragging right always moves
      // the node right regardless of reading direction. The RTL flip in
      // useCanvasViewport applies to viewport pan only.
      const dx = (e.clientX - drag.screen.x) / viewport.scale
      const dy = (e.clientY - drag.screen.y) / viewport.scale
      updateNode(node.id, {
        x: drag.nodeStart.x + dx,
        y: drag.nodeStart.y + dy,
      })
    },
    [node.id, viewport.scale, updateNode],
  )

  const onPointerUp = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragOrigin.current = null
  }, [])

  // Position the node in world coordinates. The world layer above already
  // applies the viewport transform, so we just place by node.x / node.y.
  const baseStyle: CSSProperties = {
    position: 'absolute',
    left:     node.x,
    top:      node.y,
    width:    node.width,
    height:   node.height,
  }

  // ── Dot LOD (scale < 0.1) ─────────────────────────────────────────────────
  if (lod === 'dot') {
    return (
      <div
        aria-label={node.title}
        style={{
          ...baseStyle,
          // Re-center the 8px dot on the node's logical center.
          left:            node.x + node.width / 2 - 4,
          top:             node.y + node.height / 2 - 4,
          width:           8,
          height:          8,
          borderRadius:    '50%',
          backgroundColor: color,
        }}
      />
    )
  }

  // ── Simplified LOD (0.1 ≤ scale < 0.4) ────────────────────────────────────
  if (lod === 'simplified') {
    return (
      <div
        role="button"
        aria-label={node.title}
        aria-pressed={isSelected}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          ...baseStyle,
          backgroundColor: 'var(--dv-node-page)',
          borderColor:     isSelected ? 'var(--dv-node-border-active)' : 'var(--ds-border)',
          borderWidth:     1,
          borderStyle:     'solid',
          borderRadius:    6,
          padding:         '0 8px',
          display:         'flex',
          alignItems:      'center',
          color:           'var(--ds-text-primary)',
          fontSize:        12,
          cursor:          'grab',
          // Stripe of node-type color so simplified nodes are visually
          // categorizable without the full chrome.
          boxShadow:       `inset 4px 0 0 0 ${color}`,
        }}
      >
        <span className="truncate font-medium">{node.title}</span>
      </div>
    )
  }

  // ── Full LOD (scale ≥ 0.4) ────────────────────────────────────────────────
  const hasHardlockFailures = node.hardlockFailures.length > 0
  const borderColor =
    hasHardlockFailures ? 'var(--dv-node-border-hardlock)' :
    isSelected          ? 'var(--dv-node-border-active)' :
                          'var(--ds-border)'

  // F-007 AC-002 — Live preview: apply Property Inspector style edits to the
  // node card. Logical margins are no-ops on an absolutely-positioned card,
  // so we map them to padding/typography on the inner surface instead.
  const s = node.style ?? {}
  const fullStyle: CSSProperties = {
    ...baseStyle,
    backgroundColor: s.bgColor ?? 'var(--dv-node-page)',
    color:           s.fgColor ?? 'var(--ds-text-primary)',
    borderColor,
    borderWidth:     hasHardlockFailures || isSelected ? 2 : 1,
    borderStyle:     'solid',
    borderRadius:    6,
    boxShadow:       'var(--ds-shadow-node)',
    cursor:          wiringMode ? 'crosshair' : 'grab',
    paddingInlineStart: s.paddingInlineStart,
    paddingInlineEnd:   s.paddingInlineEnd,
    paddingBlockStart:  s.paddingBlockStart,
    paddingBlockEnd:    s.paddingBlockEnd,
    fontFamily:         s.fontFamily,
    fontWeight:         s.fontWeight,
    fontSize:           s.fontSize,
    lineHeight:         s.lineHeight,
  }

  return (
    <div
      role="button"
      aria-label={node.title}
      aria-pressed={isSelected}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={fullStyle}
      className="flex flex-col justify-between p-2.5"
    >
      <div className="flex items-start gap-2 min-w-0">
        <span
          aria-hidden="true"
          className="mt-1 w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-ds-xs font-semibold text-ds-text-primary truncate">
            {node.title}
          </p>
          {node.route && (
            <p className="text-[10px] font-mono text-ds-text-muted truncate">
              {node.route}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[9px] uppercase tracking-wide text-ds-text-muted">
          {node.type}
        </span>
        <HardlockOverlay failures={node.hardlockFailures} />
      </div>

      {/* Port handles — only meaningful at full LOD. In RTL the source
          port is on the leading (left) edge; target on the trailing.
          Ports are visible always (so user can hover-discover them); the
          crosshair cursor in wiring mode signals action. */}
      <Port
        role="source"
        side={rtlMode ? 'left' : 'right'}
        color={color}
        wiringMode={wiringMode}
        onPointerDown={(e) => onPortDown(node.id, 'source', e)}
      />
      <Port
        role="target"
        side={rtlMode ? 'right' : 'left'}
        color="var(--ds-border-strong)"
        wiringMode={wiringMode}
        onPointerDown={(e) => onPortDown(node.id, 'target', e)}
      />
    </div>
  )
}

interface PortProps {
  role:          'source' | 'target'
  side:          'left' | 'right'
  color:         string
  wiringMode:    boolean
  onPointerDown: (e: PointerEvent<HTMLElement>) => void
}

function Port({ role, side, color, wiringMode, onPointerDown }: PortProps) {
  const positional =
    side === 'left' ? 'left-[-6px]' : 'right-[-6px]'

  return (
    <span
      role="button"
      aria-label={role === 'source' ? 'source port' : 'target port'}
      data-port={role}
      onPointerDown={(e) => {
        e.stopPropagation()
        onPointerDown(e)
      }}
      style={{ backgroundColor: color }}
      className={[
        'absolute top-1/2 -translate-y-1/2',
        'w-3 h-3 rounded-full border-2 border-ds-background',
        'transition-opacity duration-ds-fast motion-reduce:transition-none',
        wiringMode ? 'opacity-100' : 'opacity-60 hover:opacity-100',
        'cursor-crosshair',
        positional,
      ].join(' ')}
    />
  )
}

export default memo(CanvasNodeImpl)

// Re-export for tests that want to construct world->screen positions
// independently of the component.
export { screenToCanvas }
