import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export function Input({ label, hint, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide">{label}</label>}
      <input
        className={cn(
          'h-7 w-full rounded-app-sm border border-app-border bg-app-inset px-2.5 text-xs text-app-text placeholder:text-app-subtle',
          'focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'transition-colors duration-100',
          className,
        )}
        {...props}
      />
      {hint && <p className="text-[11px] text-app-subtle">{hint}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] text-app-muted font-medium uppercase tracking-wide">{label}</label>}
      <textarea
        className={cn(
          'w-full rounded-app-sm border border-app-border bg-app-inset px-2.5 py-1.5 text-xs text-app-text placeholder:text-app-subtle',
          'focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent',
          'resize-none transition-colors duration-100',
          className,
        )}
        {...props}
      />
    </div>
  )
}
