'use client'

import { useState, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  label: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  kbd?: string
}

/** Lightweight hover tooltip — no portal, positioned with CSS. */
export function Tooltip({ label, children, side = 'top', kbd }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const show = () => {
    timer.current = setTimeout(() => setOpen(true), 320)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  const pos: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={show}
      onPointerLeave={hide}
      onPointerDown={hide}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 flex items-center gap-1.5 whitespace-nowrap rounded-app-sm',
            'border border-app-border-strong bg-app-elevated px-2 py-1 text-[11px] font-medium text-app-text',
            'shadow-app-lg animate-fade-in',
            pos[side],
          )}
        >
          {label}
          {kbd && (
            <kbd className="rounded bg-app-inset px-1 py-px font-mono text-[10px] text-app-muted">
              {kbd}
            </kbd>
          )}
        </span>
      )}
    </span>
  )
}
