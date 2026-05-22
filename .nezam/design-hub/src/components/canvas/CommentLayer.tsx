'use client'

import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/cn'

interface CommentLayerProps {
  /** The element whose coordinate space the pins live in. */
  containerRef: RefObject<HTMLElement | null>
}

/** Renders numbered comment pins anchored to their target nodes. */
export function CommentLayer({ containerRef }: CommentLayerProps) {
  const comments = useHub((s) => s.comments)
  const pulse = useHub((s) => s.pulse)
  const setBuilderMode = useHub((s) => s.setBuilderMode)
  const select = useHub((s) => s.select)
  const blocks = useHub((s) => s.blocks)

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({})
  const frame = useRef<number | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const update = () => {
      const cRect = container.getBoundingClientRect()
      const next: Record<string, { x: number; y: number }> = {}
      for (const c of comments) {
        const el = container.querySelector(`[data-node="${cssEscape(c.nodeId)}"]`) as HTMLElement | null
        if (!el) continue
        const r = el.getBoundingClientRect()
        // Anchor the pin at the top-trailing corner of the node.
        next[c.id] = { x: r.right - cRect.left, y: r.top - cRect.top }
      }
      setPositions(next)
    }
    const schedule = () => {
      if (frame.current != null) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(update)
    }
    schedule()
    const ro = new ResizeObserver(schedule)
    ro.observe(container)
    const scroller = container.closest('.app-scroll') as HTMLElement | null
    scroller?.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      scroller?.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame.current != null) cancelAnimationFrame(frame.current)
    }
  }, [comments, pulse, blocks, containerRef])

  if (comments.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {comments.map((c, i) => {
        const p = positions[c.id]
        if (!p) return null
        return (
          <button
            key={c.id}
            onClick={(e) => {
              e.stopPropagation()
              setBuilderMode('comments')
              select({
                scope: 'element',
                blockId: c.blockId,
                nodeId: c.nodeId,
                label: c.label,
                role: 'text',
              })
            }}
            className={cn(
              'pointer-events-auto absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[10px] font-bold shadow-app-lg ring-2 ring-app-bg transition-transform',
              c.resolved
                ? 'bg-app-surface text-app-muted hover:scale-110'
                : 'bg-app-accent text-app-on-accent hover:scale-110',
            )}
            style={{ left: p.x, top: p.y }}
            title={c.text || `Comment ${i + 1}`}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}

/** Minimal CSS.escape polyfill — colons in our node ids must be escaped for query selectors. */
function cssEscape(s: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(s)
  return s.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`)
}
