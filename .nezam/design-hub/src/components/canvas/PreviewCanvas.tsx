'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MousePointerClick, Hand, PlusSquare, MessageCircle, Edit3, Trash2, Copy, Clipboard, ChevronUp, ChevronDown } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useTokenVars } from '@/hooks/useTokens'
import { ensureGsap, prefersReducedMotion } from '@/lib/gsap'
import { CanvasToolbar } from './CanvasToolbar'
import { PreviewScene } from './PreviewScene'
import { CommentLayer } from './CommentLayer'
import { cn } from '@/lib/cn'
import type { BlockKind, Tool } from '@/types'

const DEVICE_WIDTH = { mobile: 390, tablet: 834, desktop: 1280 } as const
const ADD_TOOLS: Tool[] = ['text', 'paragraph', 'image', 'icon', 'section']

/** The center stage — a device-framed, scaled artboard of the live design. */
export function PreviewCanvas() {
  const device = useHub((s) => s.device)
  const theme = useHub((s) => s.theme)
  const dir = useHub((s) => s.dir)
  const zoom = useHub((s) => s.zoom)
  const pulse = useHub((s) => s.pulse)
  const selection = useHub((s) => s.selection)
  const select = useHub((s) => s.select)
  const tool = useHub((s) => s.activeTool)
  const addBlock = useHub((s) => s.addBlock)
  const removeBlock = useHub((s) => s.removeBlock)
  const duplicateBlock = useHub((s) => s.duplicateBlock)
  const moveBlock = useHub((s) => s.moveBlock)
  const copyStyle = useHub((s) => s.copyStyle)
  const pasteStyle = useHub((s) => s.pasteStyle)
  const copiedStyle = useHub((s) => s.copiedStyle)
  const beginEdit = useHub((s) => s.beginEdit)
  const setTool = useHub((s) => s.setTool)
  const vars = useTokenVars()

  const canvasRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const sizerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const scopeRef = useRef<HTMLDivElement>(null)
  const pan = useRef<{ x: number; y: number; sl: number; st: number } | null>(null)

  const [avail, setAvail] = useState({ w: 1000, h: 700 })
  const [frameH, setFrameH] = useState(900)

  // Right Click Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId: string
    blockId?: string
    label: string
    isSection: boolean
  } | null>(null)

  const isAddTool = ADD_TOOLS.includes(tool)
  const deviceW = DEVICE_WIDTH[device]
  
  // Account for border bezels in sizing
  const bezelSize = device === 'mobile' ? 24 : device === 'tablet' ? 32 : 0
  const outerW = deviceW + bezelSize
  const outerH = frameH + bezelSize

  const fit = Math.min(1, (avail.w - 96) / outerW, (avail.h - 96) / Math.max(outerH, 1))
  const scale = Math.max(0.18, fit * zoom)

  useLayoutEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setAvail({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setFrameH(e.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  })

  // Profile / theme / archetype cross-fade. Token tweaks don't bump pulse.
  useEffect(() => {
    const el = scopeRef.current
    if (!el || prefersReducedMotion()) return
    const gsap = ensureGsap()
    gsap.fromTo(
      el,
      { opacity: 0.4, filter: 'blur(3px)', scale: 0.992 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.45, ease: 'power2.out' },
    )
  }, [pulse])

  // Handle outside click to close context menu
  useEffect(() => {
    const handleClose = () => setContextMenu(null)
    window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [])

  const onCanvasClick = () => {
    if (isAddTool) {
      addBlock(tool as BlockKind)
      setTool('select')
    } else {
      select(null)
    }
  }

  // Right click context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    if (tool === 'hand') return
    const target = e.target as HTMLElement
    const nodeEl = target.closest('[data-node]') as HTMLElement | null
    if (!nodeEl) return

    e.preventDefault()
    e.stopPropagation()

    const nodeId = nodeEl.getAttribute('data-node') || ''
    const isSection = nodeEl.tagName.toLowerCase() === 'section' || nodeId.split(':').length === 1
    const blockId = nodeEl.getAttribute('data-node')?.split(':')[0] || nodeId

    let label = nodeEl.getAttribute('aria-label') || 'Element'
    if (isSection) {
      const foundBlock = useHub.getState().blocks.find(b => b.id === nodeId)
      label = foundBlock?.label || 'Section'
    } else {
      // Clean display label
      label = label.replace(/[nav|hero|featureGrid|pricing|dashboard|footer]:/i, '')
      label = label.charAt(0).toUpperCase() + label.slice(1)
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId,
      blockId,
      label,
      isSection,
    })
  }

  // Hand-tool panning.
  const onPointerDown = (e: React.PointerEvent) => {
    if (tool !== 'hand') return
    const el = canvasRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    pan.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pan.current || !canvasRef.current) return
    canvasRef.current.scrollLeft = pan.current.sl - (e.clientX - pan.current.x)
    canvasRef.current.scrollTop = pan.current.st - (e.clientY - pan.current.y)
  }
  const endPan = () => {
    pan.current = null
  }

  const cursor =
    tool === 'hand'
      ? 'cursor-grab active:cursor-grabbing'
      : tool === 'comment'
        ? 'cursor-help'
        : isAddTool
          ? 'cursor-crosshair'
          : ''

  return (
    <div className="relative flex h-full flex-col select-none">
      {/* Zoom Toolbar */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2">
        <div className="pointer-events-auto">
          <CanvasToolbar />
        </div>
      </div>

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
        <div className="flex items-center gap-1.5 rounded-app-pill border border-app-border bg-app-surface/90 px-3 py-1.5 text-[11px] text-app-muted shadow-app backdrop-blur">
          {isAddTool ? (
            <>
              <PlusSquare size={12} className="text-app-accent animate-pulse" />
              <span>
                Click the canvas to drop{' '}
                <span className="font-semibold text-app-text">{tool}</span>
              </span>
            </>
          ) : tool === 'hand' ? (
            <>
              <Hand size={12} className="text-app-accent" />
              <span>Drag to pan the canvas</span>
            </>
          ) : tool === 'comment' ? (
            <>
              <MessageCircle size={12} className="text-app-accent" />
              <span>Click any element to drop a comment for AI agents</span>
            </>
          ) : (
            <>
              <MousePointerClick size={12} className="text-app-accent" />
              {selection ? (
                <span>
                  Editing <span className="font-semibold text-app-text">{selection.label}</span> —
                  see the Inspector →
                </span>
              ) : (
                <span>Click any element or right-click to shape it</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Artboard */}
      <div
        ref={canvasRef}
        className={cn('app-scroll canvas-grid flex-1 overflow-auto', cursor)}
        onClick={onCanvasClick}
        onContextMenu={handleContextMenu}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div ref={gridRef} className="relative grid min-h-full place-items-center p-12">
          <div
            ref={sizerRef}
            style={{ width: outerW * scale, height: outerH * scale }}
            className="relative shrink-0 transition-all duration-300 ease-smooth"
          >
            <div
              ref={frameRef}
              style={{
                width: deviceW,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                // Bezels setup based on device
                borderWidth: device === 'mobile' ? '12px' : device === 'tablet' ? '16px' : '0px',
              }}
              className={cn(
                'absolute left-0 top-0 transition-all duration-300 ease-smooth overflow-hidden bg-app-elevated border-neutral-900 shadow-2xl',
                device === 'mobile'
                  ? 'rounded-[48px] shadow-[0_25px_60px_rgba(0,0,0,0.5)]'
                  : device === 'tablet'
                    ? 'rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.5)]'
                    : 'rounded-none border-none shadow-app-lg'
              )}
            >
              {/* Dynamic Island Notch for Mobile Mode */}
              {device === 'mobile' && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-neutral-950 rounded-full z-50 flex items-center justify-between px-4 border border-neutral-850 shadow-inner">
                  <div className="w-2 h-2 bg-[#09090b] rounded-full border border-neutral-800" /> {/* Camera lens */}
                  <div className="w-10 h-1.5 bg-[#0f0f13] rounded-full" /> {/* Speaker */}
                </div>
              )}

              {/* Front Camera Dot for Tablet Mode */}
              {device === 'tablet' && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-950 rounded-full z-50 border border-neutral-850" />
              )}

              {/* Artboard Scene container */}
              <div
                ref={scopeRef}
                className="n-scope min-h-[500px]"
                dir={dir}
                data-theme={theme}
                style={vars as React.CSSProperties}
                onClick={(e) => {
                  if (!isAddTool) e.stopPropagation()
                }}
              >
                <PreviewScene />
              </div>

              {/* Apple thin iOS home indicator line */}
              {device === 'mobile' && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 dark:bg-white/25 rounded-full z-50" />
              )}

              {/* Tablet iOS home indicator line */}
              {device === 'tablet' && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-44 h-1 bg-black/20 dark:bg-white/25 rounded-full z-50" />
              )}
            </div>
          </div>
          <CommentLayer containerRef={gridRef} />
        </div>
      </div>

      {/* Realistic Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-[100] min-w-[170px] overflow-hidden rounded-app border border-app-border bg-app-surface/95 p-1 shadow-app-lg backdrop-blur animate-in fade-in zoom-in-95 duration-100 ease-out"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-semibold text-app-muted uppercase tracking-[0.05em] truncate border-b border-app-border/60 mb-1">
            {contextMenu.label}
          </div>

          {!contextMenu.isSection && (
            <ContextMenuItem
              icon={<Edit3 size={12} />}
              label="Edit content"
              onClick={() => {
                beginEdit(contextMenu.nodeId)
                setContextMenu(null)
              }}
            />
          )}

          <ContextMenuItem
            icon={<Copy size={12} />}
            label="Copy Style"
            onClick={() => {
              copyStyle(contextMenu.nodeId)
              setContextMenu(null)
            }}
          />

          <ContextMenuItem
            icon={<Clipboard size={12} />}
            label="Paste Style"
            disabled={!copiedStyle}
            onClick={() => {
              pasteStyle(contextMenu.nodeId)
              setContextMenu(null)
            }}
          />

          {contextMenu.isSection && (
            <>
              <div className="my-1 border-t border-app-border/60" />
              <ContextMenuItem
                icon={<Copy size={12} />}
                label="Duplicate Section"
                onClick={() => {
                  if (contextMenu.blockId) duplicateBlock(contextMenu.blockId)
                  setContextMenu(null)
                }}
              />
              <ContextMenuItem
                icon={<ChevronUp size={12} />}
                label="Move Section Up"
                onClick={() => {
                  if (contextMenu.blockId) moveBlock(contextMenu.blockId, 'up')
                  setContextMenu(null)
                }}
              />
              <ContextMenuItem
                icon={<ChevronDown size={12} />}
                label="Move Section Down"
                onClick={() => {
                  if (contextMenu.blockId) moveBlock(contextMenu.blockId, 'down')
                  setContextMenu(null)
                }}
              />
              <div className="my-1 border-t border-app-border/60" />
              <ContextMenuItem
                icon={<Trash2 size={12} className="text-app-danger" />}
                label="Delete Section"
                onClick={() => {
                  if (contextMenu.blockId) removeBlock(contextMenu.blockId)
                  setContextMenu(null)
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ContextMenuItem({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-app-text transition-colors duration-100',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-app-elevated/80 active:scale-[0.98]'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
