'use client'

import React from 'react'

interface ColorTokenRowProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export default function ColorTokenRow({ label, value, onChange }: ColorTokenRowProps) {
  // Safe helper to get a valid 7-character hex value for the color input.
  // Native input type="color" strictly requires lowercase #rrggbb format.
  const getSafeHexValue = (val: string) => {
    if (!val) return '#000000'
    const trimmed = val.trim()
    if (trimmed.startsWith('#')) {
      if (trimmed.length === 7) return trimmed.toLowerCase()
      if (trimmed.length === 4) {
        // Expand shorthand hex #rgb -> #rrggbb
        const r = trimmed[1]
        const g = trimmed[2]
        const b = trimmed[3]
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
      }
    }
    // Return a fallback if it's a CSS variable or invalid hex
    return '#3b82f6' // Default blue
  }

  const safeHexValue = getSafeHexValue(value)

  return (
    <div className="flex items-center justify-between p-2 hover:bg-ds-surface-subtle rounded transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative w-6 h-6 rounded overflow-hidden border border-ds-border flex items-center justify-center cursor-pointer">
          <input
            type="color"
            value={safeHexValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[150%] h-[150%] -translate-x-[16.6%] -translate-y-[16.6%] border-0 cursor-pointer p-0 bg-transparent appearance-none"
            title="Pick color"
          />
        </div>
        <span className="text-sm font-medium text-ds-text-primary">{label}</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-ds-surface-subtle border border-ds-border rounded px-2 py-1 text-xs text-ds-text-primary font-mono w-24 text-end focus:border-ds-primary/50 focus:outline-none"
      />
    </div>
  )
}
