'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn } from '@/lib/utils'

// Switch implemented as a styled visual toggle — no Radix Switch dep required.
// Uses a controlled checkbox under the hood for full a11y.

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
    const isControlled = checked !== undefined
    const isOn = isControlled ? checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalChecked(e.target.checked)
      onCheckedChange?.(e.target.checked)
      onChange?.(e)
    }

    return (
      <label
        className={cn(
          'relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors',
          isOn ? 'bg-app-accent' : 'bg-app-border',
          props.disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={isOn}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <span
          className={cn(
            'absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-transform',
            isOn ? 'translate-x-[18px]' : 'translate-x-[3px]',
          )}
        />
      </label>
    )
  },
)
Switch.displayName = 'Switch'

export { Switch }
