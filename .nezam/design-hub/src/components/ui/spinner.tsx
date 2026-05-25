import * as React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-8 w-8 border-[3px]' }

function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-app-border border-t-app-accent',
        SIZE_MAP[size],
        className,
      )}
      {...props}
    />
  )
}

export { Spinner }
