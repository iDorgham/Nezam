'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Tooltip } from './Tooltip'

export interface SegmentOption<T extends string> {
  value: T
  label: ReactNode
  tooltip?: string
}

interface SegmentedProps<T extends string> {
  value: T
  options: SegmentOption<T>[]
  onChange: (value: T) => void
  size?: 'sm' | 'md'
  className?: string
}

/** A compact segmented control with a sliding active background. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-app-sm border border-app-border bg-app-inset p-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        const btn = (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'focus-ring flex items-center justify-center gap-1.5 rounded-[5px] font-medium transition-all duration-150 ease-smooth',
              size === 'sm' ? 'h-6 px-2 text-[11px]' : 'h-7 px-2.5 text-xs',
              active
                ? 'bg-app-elevated text-app-text shadow-app-sm'
                : 'text-app-muted hover:text-app-text',
            )}
          >
            {opt.label}
          </button>
        )
        return opt.tooltip ? (
          <Tooltip key={opt.value} label={opt.tooltip}>
            {btn}
          </Tooltip>
        ) : (
          btn
        )
      })}
    </div>
  )
}
