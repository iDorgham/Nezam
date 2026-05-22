'use client'

import { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { cn } from '@/lib/cn'

interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
}

/** A color row: label, live swatch, hex input, and a popover picker. */
export function ColorField({ label, value, onChange, hint }: ColorFieldProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setDraft(value), [value])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const commit = (v: string) => {
    setDraft(v)
    onChange(v)
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2.5">
        <button
          aria-label={`Edit ${label}`}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'focus-ring h-8 w-8 shrink-0 rounded-app-sm border border-app-border-strong transition-transform',
            'hover:scale-105 active:scale-95',
          )}
          style={{ background: value }}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-medium text-app-text">{label}</div>
          {hint && <div className="truncate text-[10px] text-app-subtle">{hint}</div>}
        </div>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => e.key === 'Enter' && commit(draft)}
          spellCheck={false}
          className={cn(
            'focus-ring h-7 w-[88px] rounded-app-sm border border-app-border bg-app-inset px-2',
            'font-mono text-[11px] text-app-text',
          )}
        />
      </div>

      {open && (
        <div
          className={cn(
            'absolute right-0 z-40 mt-2 rounded-app-lg border border-app-border-strong bg-app-elevated p-3',
            'shadow-app-lg animate-rise-in nz-color',
          )}
        >
          <HexColorPicker color={value} onChange={commit} />
          <style jsx global>{`
            .nz-color .react-colorful {
              width: 188px;
              height: 150px;
            }
            .nz-color .react-colorful__saturation {
              border-radius: 8px 8px 0 0;
            }
            .nz-color .react-colorful__hue {
              height: 14px;
              border-radius: 0 0 8px 8px;
            }
            .nz-color .react-colorful__pointer {
              width: 16px;
              height: 16px;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}
