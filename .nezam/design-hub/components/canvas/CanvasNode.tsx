'use client'

import { memo, useCallback, useRef, type CSSProperties, type PointerEvent } from 'react'
import {
  useCanvasGraphStore,
  type CanvasNode as CanvasNodeData,
} from '@/src/store/canvas-graph.store'
import { screenToCanvas } from '@/src/lib/canvas-math'
import { nodeTypeColorVar } from '@/src/lib/node-style'
import HardlockOverlay from './HardlockOverlay'
import type { LODLevel } from '@/src/hooks/useCanvasLOD'

interface CanvasNodeProps {
  node:        CanvasNodeData
  isSelected:  boolean
  wiringMode:  boolean
  lodLevel?:   LODLevel
  onPortDown:  (nodeId: string, role: 'source' | 'target', e: PointerEvent<HTMLElement>) => void
}

// One node on the world layer. Renders one of four LOD branches based on
// the current viewport scale. Drag-to-move is supported only in the two
// larger LODs — at dot scale the user can't aim precisely enough.
function CanvasNodeImpl({ node, isSelected, wiringMode, lodLevel = 'page', onPortDown }: CanvasNodeProps) {
  const rtlMode        = useCanvasGraphStore((s) => s.rtlMode)
  const updateNode     = useCanvasGraphStore((s) => s.updateNode)
  const scale          = useCanvasGraphStore((s) => s.viewport.scale)
  const setSelectedIds = useCanvasGraphStore((s) => s.setSelectedNodeIds)

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
      // the node right regardless of reading direction.
      const dx = (e.clientX - drag.screen.x) / scale
      const dy = (e.clientY - drag.screen.y) / scale
      updateNode(node.id, {
        x: drag.nodeStart.x + dx,
        y: drag.nodeStart.y + dy,
      })
    },
    [node.id, scale, updateNode],
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

  // ── Sitemap LOD (scale < 0.30) — pill, title only ────────────────────────
  if (lodLevel === 'sitemap') {
    return (
      <div
        aria-label={node.title}
        style={{
          ...baseStyle,
          left:         node.x + node.width / 2 - 32,
          top:          node.y + node.height / 2 - 12,
          width:        64,
          height:       24,
          borderRadius: 12,
          background:   `linear-gradient(135deg, ${color}22, ${color}44)`,
          border:       `1px solid ${color}66`,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          overflow:     'hidden',
        }}
      >
        <span style={{ fontSize: 8, fontWeight: 600, color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 56, padding: '0 4px' }}>
          {node.title}
        </span>
      </div>
    )
  }

  // ── Page LOD (0.30 ≤ scale < 0.70) — wireframe skeleton ──────────────────
  if (lodLevel === 'page') {
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
          cursor:          'grab',
          boxShadow:       `inset 3px 0 0 0 ${color}`,
          overflow:        'hidden',
          padding:         6,
        }}
      >
        {/* Wireframe skeleton lines */}
        <div style={{ height: 6, background: color, opacity: 0.4, borderRadius: 2, marginBottom: 4 }} />
        <div style={{ height: 4, background: 'var(--ds-border)', borderRadius: 2, marginBottom: 3, width: '80%' }} />
        <div style={{ height: 4, background: 'var(--ds-border)', borderRadius: 2, marginBottom: 3, width: '60%' }} />
        <div style={{ height: 4, background: 'var(--ds-border)', borderRadius: 2, width: '40%' }} />
        <span style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 8, color: 'var(--ds-text-muted)', fontWeight: 500 }}>
          {node.title}
        </span>
      </div>
    )
  }

  // ── Section LOD (0.70 ≤ scale < 1.50) — block labels + type ─────────────
  if (lodLevel === 'section') {
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
          borderWidth:     isSelected ? 2 : 1,
          borderStyle:     'solid',
          borderRadius:    6,
          cursor:          'grab',
          padding:         '8px 10px',
          display:         'flex',
          flexDirection:   'column',
          gap:             4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ds-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.title}
          </span>
        </div>
        {node.route && (
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--ds-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {node.route}
          </span>
        )}
        <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ds-text-muted)' }}>
          {node.type}
        </span>
        <Port role="source" side={rtlMode ? 'left' : 'right'} color={color} wiringMode={wiringMode} onPointerDown={(e) => onPortDown(node.id, 'source', e)} />
        <Port role="target" side={rtlMode ? 'right' : 'left'} color="var(--ds-border-strong)" wiringMode={wiringMode} onPointerDown={(e) => onPortDown(node.id, 'target', e)} />
      </div>
    )
  }

  // ── Element LOD (scale ≥ 1.50) — full editing surface ────────────────────
  const hasHardlockFailures = node.hardlockFailures.length > 0
  const borderColor =
    hasHardlockFailures ? 'var(--dv-node-border-hardlock)' :
    isSelected          ? 'var(--dv-node-border-active)' :
                          'var(--ds-border)'

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

      {/* Resize handle indicator at element LOD */}
      <div className="absolute bottom-0.5 right-0.5 w-2 h-2 opacity-30" style={{ borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}`, borderBottomRightRadius: 2 }} />

      <Port role="source" side={rtlMode ? 'left' : 'right'} color={color} wiringMode={wiringMode} onPointerDown={(e) => onPortDown(node.id, 'source', e)} />
      <Port role="target" side={rtlMode ? 'right' : 'left'} color="var(--ds-border-strong)" wiringMode={wiringMode} onPointerDown={(e) => onPortDown(node.id, 'target', e)} />
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
