'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Scrollable body for a builder panel. */
export function PanelBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('app-scroll flex-1 overflow-y-auto px-4 py-4', className)}>
      {children}
    </div>
  )
}

/** Sticky header for a builder panel. */
export function PanelHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-app-border px-4 py-3.5">
      <div className="flex items-start gap-2.5">
        {icon && (
          <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-app-sm bg-app-accent-subtle text-app-accent">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-[13px] font-semibold leading-tight text-app-text">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-app-subtle">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

/** A labeled group inside a panel. */
export function Section({
  label,
  children,
  hint,
  action,
}: {
  label: ReactNode
  children: ReactNode
  hint?: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="mb-6 last:mb-0">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.09em] text-app-subtle">
          {label}
        </h3>
        {action}
      </div>
      {hint && <p className="mb-2.5 text-[11px] leading-relaxed text-app-muted">{hint}</p>}
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

/** A bordered card used to group related controls. */
export function ControlCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-app border border-app-border bg-app-inset/60 p-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
