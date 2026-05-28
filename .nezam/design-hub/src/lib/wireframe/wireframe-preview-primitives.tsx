'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function WireframePreviewFrame({
  compact,
  children,
  className,
}: {
  compact?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative z-0 rounded-app-md border border-app-border bg-app-surface shadow-sm overflow-hidden',
        compact ? 'min-h-[52px]' : 'min-h-[88px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MiniCard({
  compact,
  children,
  className,
}: {
  compact?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-app-sm border border-app-border bg-app-elevated/80',
        compact ? 'p-1.5' : 'p-2',
        className,
      )}
    >
      {children}
    </div>
  )
}
