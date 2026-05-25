import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default:  'bg-app-accent/15 text-app-accent border border-app-accent/30',
  accent:   'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  success:  'bg-green-500/15 text-green-400 border border-green-500/30',
  warning:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  danger:   'bg-red-500/15 text-red-400 border border-red-500/30',
  muted:    'bg-app-elevated text-app-muted border border-app-border',
}

export function Badge({ variant = 'muted', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
