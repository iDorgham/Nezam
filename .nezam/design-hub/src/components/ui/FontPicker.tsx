'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, ChevronDown, Type } from 'lucide-react'
import { GOOGLE_FONTS, loadGoogleFont, fontDisplayName, type FontCategory } from '@/lib/google-fonts'
import { cn } from '@/lib/cn'

interface FontPickerProps {
  value: string
  onChange: (cssValue: string) => void
  label?: string
}

const CATEGORIES: { id: FontCategory | 'all'; label: string }[] = [
  { id: 'all',        label: 'All'    },
  { id: 'sans-serif', label: 'Sans'   },
  { id: 'serif',      label: 'Serif'  },
  { id: 'display',    label: 'Display'},
  { id: 'monospace',  label: 'Mono'   },
]

const PREVIEW_TEXT = 'The quick brown fox'

export function FontPicker({ value, onChange, label }: FontPickerProps) {
  const [open, setOpen]         = useState(false)
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState<FontCategory | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return GOOGLE_FONTS.filter((f) => {
      if (category !== 'all' && f.category !== category) return false
      if (q && !f.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, category])

  const handleSelect = useCallback(
    (cssValue: string) => {
      const font = GOOGLE_FONTS.find((f) => f.cssValue === cssValue)
      if (font) loadGoogleFont(font)
      onChange(cssValue)
      setOpen(false)
      setQuery('')
    },
    [onChange],
  )

  const handleHover = useCallback((cssValue: string) => {
    const font = GOOGLE_FONTS.find((f) => f.cssValue === cssValue)
    if (font) loadGoogleFont(font)
  }, [])

  const selectedName = fontDisplayName(value)

  return (
    <div className="relative">
      {label && (
        <div className="mb-1.5 text-[11px] font-medium text-app-muted">{label}</div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'focus-ring flex w-full items-center justify-between gap-2 rounded-app border border-app-border bg-app-surface px-3 py-2 text-left text-[12px] font-medium transition-colors hover:border-app-border-strong',
          open && 'border-app-accent ring-1 ring-app-accent/30',
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <Type size={12} className="shrink-0 text-app-subtle" />
          <span style={{ fontFamily: value }} className="truncate text-app-text">
            {selectedName}
          </span>
        </span>
        <ChevronDown
          size={12}
          className={cn('shrink-0 text-app-subtle transition-transform', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 flex flex-col rounded-app border border-app-border bg-app-surface shadow-app-md">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-app-border px-2.5 py-2">
            <Search size={12} className="shrink-0 text-app-subtle" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fonts…"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-app-text placeholder:text-app-subtle outline-none"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1 border-b border-app-border px-2 py-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors',
                  category === c.id
                    ? 'bg-app-accent text-app-on-accent'
                    : 'text-app-subtle hover:text-app-text',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Font list */}
          <div className="app-scroll max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-[11px] text-app-subtle">
                No fonts found
              </div>
            )}
            {filtered.map((font) => {
              const active = font.cssValue === value
              return (
                <button
                  key={font.name}
                  onClick={() => handleSelect(font.cssValue)}
                  onMouseEnter={() => handleHover(font.cssValue)}
                  className={cn(
                    'flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors',
                    active
                      ? 'bg-app-accent/10 text-app-text'
                      : 'hover:bg-app-elevated/60 text-app-muted hover:text-app-text',
                  )}
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-medium text-app-text">{font.name}</span>
                    <span
                      style={{ fontFamily: font.cssValue }}
                      className="text-[13px] text-app-muted"
                    >
                      {PREVIEW_TEXT}
                    </span>
                  </span>
                  {font.arabic && (
                    <span className="shrink-0 rounded bg-app-elevated px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-app-subtle">
                      AR
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
