'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function LeftPanelTitleRow({
  title,
  rightSlot,
  className,
}: {
  title: ReactNode
  rightSlot?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('shrink-0 flex min-h-10 items-center justify-between gap-2 border-b border-app-border bg-app-bg/70 px-3', className)}>
      <div className="min-w-0 truncate text-xs font-semibold text-app-text">{title}</div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  )
}

export function LeftPanelTabsRow({
  children,
  className,
  ...props
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shrink-0 h-10 px-2 border-b border-app-border bg-app-bg/50 flex items-center gap-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function LeftPanelSearchRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('shrink-0 px-2 py-2 border-b border-app-border bg-app-surface/40', className)}>
      {children}
    </div>
  )
}
