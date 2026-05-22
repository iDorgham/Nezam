'use client'

import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

interface ResizeHandleProps {
  /** Current width of the panel being resized. */
  value: number
  onChange: (next: number) => void
  /** 'left' resizes the panel to this handle's left; 'right' the panel to its right. */
  edge: 'left' | 'right'
}

/** A thin draggable divider for resizing a side panel. */
export function ResizeHandle({ value, onChange, edge }: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const startW = useRef(0)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      startX.current = e.clientX
      startW.current = value
      setDragging(true)
    },
    [value],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      const delta = e.clientX - startX.current
      // 'left' panel grows when dragged right; 'right' panel grows when dragged left.
      onChange(startW.current + (edge === 'left' ? delta : -delta))
    },
    [dragging, edge, onChange],
  )

  const stop = useCallback((e: React.PointerEvent) => {
    ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    setDragging(false)
  }, [])

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      onDoubleClick={() => onChange(edge === 'left' ? 280 : 420)}
      className={cn(
        'group relative z-20 w-1.5 shrink-0 cursor-col-resize',
        'before:absolute before:inset-y-0 before:-left-1 before:-right-1 before:content-[""]',
      )}
    >
      <div
        className={cn(
          'mx-auto h-full w-px transition-colors duration-150',
          dragging ? 'bg-app-accent' : 'bg-app-border group-hover:bg-app-border-strong',
        )}
      />
      {dragging && <div className="fixed inset-0 z-50 cursor-col-resize" />}
    </div>
  )
}
