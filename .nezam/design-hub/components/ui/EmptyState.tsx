import * as React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  /** Optional decorative icon/illustration. */
  icon?: React.ReactNode
  /** Optional call-to-action (e.g. a Button or link). */
  action?: React.ReactNode
  className?: string
}

/**
 * Branded, accessible empty state. Token-only styling (no raw hex/px).
 * Renders a labelled region so screen readers announce the heading.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        'px-6 py-12 text-app-muted',
        className,
      )}
    >
      {icon && (
        <div aria-hidden="true" className="text-app-subtle">
          {icon}
        </div>
      )}
      <h2 className="text-base font-semibold text-app-text">{title}</h2>
      {description && <p className="max-w-sm text-sm text-app-subtle">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
