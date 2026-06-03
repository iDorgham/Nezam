import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  const reactId = React.useId()
  const selectId = id ?? reactId
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] text-app-muted font-medium uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'h-7 w-full rounded-app-sm border border-app-border bg-app-inset px-2.5 text-xs text-app-text',
          'focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent',
          'transition-colors duration-100 cursor-pointer',
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-app-elevated">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
