import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
  iconEnd?: React.ReactNode
}

const base =
  'inline-flex items-center justify-center gap-1.5 font-medium rounded-app-sm transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-1 focus-visible:ring-offset-app-bg disabled:opacity-40 disabled:pointer-events-none select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:scale-[0.98]',
  secondary:
    'bg-app-elevated text-app-text hover:bg-app-border active:scale-[0.98]',
  ghost:
    'bg-transparent text-app-muted hover:bg-app-elevated hover:text-app-text active:scale-[0.98]',
  danger:
    'bg-transparent text-red-400 hover:bg-red-500/10 active:scale-[0.98]',
  outline:
    'border border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  xs: 'h-6 px-2 text-[11px]',
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3 text-xs',
  lg: 'h-9 px-4 text-sm',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconEnd && <span className="shrink-0">{iconEnd}</span>}
    </button>
  )
}
