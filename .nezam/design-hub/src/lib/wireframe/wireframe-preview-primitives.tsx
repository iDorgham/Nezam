'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type ChromeButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ChromeButtonSize = 'xs' | 'sm' | 'md' | 'lg'

const chromeButtonBase =
  'inline-flex items-center justify-center gap-1.5 font-medium rounded-app-sm select-none'

const chromeButtonVariants: Record<ChromeButtonVariant, string> = {
  primary: 'bg-app-accent text-app-on-accent',
  secondary: 'bg-app-elevated text-app-text',
  ghost: 'bg-transparent text-app-muted',
  danger: 'bg-transparent text-red-400',
  outline: 'border border-app-border text-app-muted',
}

const chromeButtonSizes: Record<ChromeButtonSize, string> = {
  xs: 'h-6 px-2 text-[11px]',
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3 text-xs',
  lg: 'h-9 px-4 text-sm',
}

/** Palette thumbnails sit inside a focusable row — use non-interactive chrome when compact. */
export function ChromeButton({
  compact,
  variant = 'secondary',
  size = 'md',
  className,
  children,
}: {
  compact?: boolean
  variant?: ChromeButtonVariant
  size?: ChromeButtonSize
  className?: string
  children: ReactNode
}) {
  const style = cn(chromeButtonBase, chromeButtonVariants[variant], chromeButtonSizes[size], className)

  if (compact) {
    return <span className={style}>{children}</span>
  }

  return (
    <Button variant={variant} size={size} type="button" tabIndex={-1} className={cn('pointer-events-none', className)}>
      {children}
    </Button>
  )
}

export function ChromeInput({
  compact,
  placeholder,
  className,
  type,
}: {
  compact?: boolean
  placeholder?: string
  className?: string
  type?: string
}) {
  if (compact) {
    return (
      <span
        className={cn(
          'block w-full rounded-app-sm border border-app-border bg-app-inset px-2.5 text-[10px] text-app-subtle truncate',
          className,
        )}
      >
        {type === 'password' ? placeholder ?? '••••••••' : placeholder}
      </span>
    )
  }

  return <Input placeholder={placeholder} type={type} className={className} readOnly tabIndex={-1} />
}

export function ChromeTabPills({
  compact,
  tabs = ['Week', 'Month'],
  activeIndex = 0,
}: {
  compact?: boolean
  tabs?: string[]
  activeIndex?: number
}) {
  if (compact) {
    return (
      <div className="inline-flex h-5 items-center gap-0.5 rounded-app-sm border border-app-border bg-app-elevated p-0.5">
        {tabs.map((label, index) => (
          <span
            key={label}
            className={cn(
              'inline-flex h-4 items-center rounded-app-sm px-1.5 text-[8px]',
              index === activeIndex ? 'bg-app-surface text-app-text' : 'text-app-muted',
            )}
          >
            {label}
          </span>
        ))}
      </div>
    )
  }

  const active = String(activeIndex)

  return (
    <Tabs value={active} className="pointer-events-none">
      <TabsList className="h-6">
        {tabs.map((label, index) => (
          <TabsTrigger key={label} value={String(index)} className="text-[8px] px-2">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

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
