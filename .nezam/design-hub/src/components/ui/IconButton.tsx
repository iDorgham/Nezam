'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Tooltip } from './Tooltip'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  kbd?: string
  active?: boolean
  size?: 'sm' | 'md'
  tone?: 'default' | 'accent'
}

/** Square icon button with a built-in tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, kbd, active, size = 'md', tone = 'default', className, children, ...rest }, ref) => {
    return (
      <Tooltip label={label} kbd={kbd}>
        <button
          ref={ref}
          aria-label={label}
          aria-pressed={active}
          className={cn(
            'focus-ring grid place-items-center rounded-app-sm border transition-all duration-150 ease-smooth',
            'active:scale-90',
            size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
            active
              ? tone === 'accent'
                ? 'border-app-accent bg-app-accent text-app-on-accent shadow-app-glow'
                : 'border-app-border-strong bg-app-elevated text-app-text'
              : 'border-transparent text-app-muted hover:border-app-border hover:bg-app-elevated hover:text-app-text',
            className,
          )}
          {...rest}
        >
          {children}
        </button>
      </Tooltip>
    )
  },
)
IconButton.displayName = 'IconButton'
