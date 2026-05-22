'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MousePointerClick, Hand, PlusSquare, MessageCircle } from 'lucide-react'
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

  const isAddTool = ADD_TOOLS.includes(tool)
  const deviceW = DEVICE_WIDTH[device]
  const fit = Math.min(1, (avail.w - 96) / deviceW, (avail.h - 96) / Math.max(frameH, 1))
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

  const onCanvasClick = () => {
    if (isAddTool) {
      addBlock(tool as BlockKind)
      setTool('select')
    } else {
      select(null)
    }
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
    <div className="relative flex h-full flex-col">
      {/* Toolbar */}
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
              <PlusSquare size={12} className="text-app-accent" />
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
                <span>Click any element to shape it</span>
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div ref={gridRef} className="relative grid min-h-full place-items-center p-12">
          <div
            ref={sizerRef}
            style={{ width: deviceW * scale, height: frameH * scale }}
            className="relative shrink-0"
          >
            <div
              ref={frameRef}
              style={{ width: deviceW, transform: `scale(${scale})`, transformOrigin: 'top left' }}
              className="absolute left-0 top-0 overflow-hidden rounded-app-xl border border-app-border-strong bg-app-elevated shadow-app-lg"
            >
              <div className="flex h-7 items-center gap-1.5 border-b border-app-border bg-app-surface px-3">
                <span className="h-2 w-2 rounded-full bg-app-border-strong" />
                <span className="h-2 w-2 rounded-full bg-app-border-strong" />
                <span className="h-2 w-2 rounded-full bg-app-border-strong" />
                <span className="ml-2 truncate font-mono text-[9px] text-app-subtle">
                  nezam.design / {device} · {dir.toUpperCase()} · {theme}
                </span>
              </div>
              <div
                ref={scopeRef}
                className="n-scope"
                dir={dir}
                data-theme={theme}
                style={vars as React.CSSProperties}
                onClick={(e) => {
                  if (!isAddTool) e.stopPropagation()
                }}
              >
                <PreviewScene />
              </div>
            </div>
          </div>
          <CommentLayer containerRef={gridRef} />
        </div>
      </div>
    </div>
  )
}
