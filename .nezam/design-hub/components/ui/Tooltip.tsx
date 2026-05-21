'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className = '', sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={[
        'z-50 select-none rounded-ds-md',
        'bg-ds-surface-elevated text-ds-text-primary',
        'border border-ds-border-strong shadow-ds-lg',
        'px-2.5 py-1.5 text-xs font-medium',
        'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
        className,
      ].join(' ')}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'

type TooltipProps = {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  children: React.ReactNode
  shortcut?: string
}

/** Convenience wrapper — pass `content` and `children` (trigger). */
export function Tooltip({
  content,
  side = 'right',
  align = 'center',
  delayDuration = 250,
  shortcut,
  children,
}: TooltipProps) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <span className="flex items-center gap-2">
          {content}
          {shortcut && (
            <kbd className="text-[10px] font-mono text-ds-text-muted bg-ds-surface px-1 py-0.5 rounded border border-ds-border">
              {shortcut}
            </kbd>
          )}
        </span>
      </TooltipContent>
    </TooltipRoot>
  )
}
