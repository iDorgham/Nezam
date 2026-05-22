'use client'

import { useCallback, useMemo, type ChangeEvent } from 'react'

// F-007 §3 / §4 — Typography. font-size MUST be a clamp() formula or a token
// reference; fixed px/rem is hardlock-blocked (T-F007-005/006 enforce; this
// component surfaces the validation hint).

export interface TypographyValues {
  fontFamily:  string
  fontWeight:  number
  fontSize:    string
  lineHeight:  number
}

export type TypographyKey = keyof TypographyValues

interface TypographyFieldsProps {
  values:   TypographyValues
  onChange: <K extends TypographyKey>(key: K, value: TypographyValues[K]) => void
  disabled?: boolean
  /** T-F007-009: keys whose value differs across the multi-select set. */
  mixedKeys?: ReadonlySet<TypographyKey>
}

const FONT_FAMILIES = [
  { value: 'Geist Sans',         label: 'Geist Sans' },
  { value: 'Geist Mono',         label: 'Geist Mono' },
  { value: 'Inter',              label: 'Inter' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
  { value: 'system-ui',          label: 'system-ui' },
] as const

const WEIGHTS: ReadonlyArray<{ value: number; label: string }> = [
  { value: 300, label: '300 — Light' },
  { value: 400, label: '400 — Regular' },
  { value: 500, label: '500 — Medium' },
  { value: 600, label: '600 — Semibold' },
  { value: 700, label: '700 — Bold' },
]

// Hardlock §4: "Fixed px/rem font-size → Use clamp() for fluid type".
// Accept any string that contains `clamp(`, a CSS variable reference, or is
// otherwise non-fixed. Anything else is flagged with an inline hint.
export function isFluidFontSize(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length === 0) return true // empty = no value yet, allow it
  if (trimmed.startsWith('var(')) return true
  if (trimmed.includes('clamp(')) return true
  // Reject bare numbers and fixed px/rem/em.
  if (/^\d+(\.\d+)?(px|rem|em)?$/.test(trimmed)) return false
  return true
}

export default function TypographyFields({
  values,
  onChange,
  disabled = false,
  mixedKeys,
}: TypographyFieldsProps) {
  const sizeIsFluid = useMemo(
    () => (mixedKeys?.has('fontSize') ? true : isFluidFontSize(values.fontSize)),
    [values.fontSize, mixedKeys],
  )

  const isMixed = (key: TypographyKey) => mixedKeys?.has(key) ?? false

  const handleFontFamily = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => onChange('fontFamily', e.target.value),
    [onChange],
  )
  const handleWeight = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const next = Number(e.target.value)
      onChange('fontWeight', Number.isFinite(next) ? next : 400)
    },
    [onChange],
  )
  const handleSize = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange('fontSize', e.target.value),
    [onChange],
  )
  const handleLineHeight = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.valueAsNumber
      onChange('lineHeight', Number.isFinite(next) ? next : 1.5)
    },
    [onChange],
  )

  return (
    <section aria-labelledby="typography-heading" className="flex flex-col gap-3">
      <h3
        id="typography-heading"
        className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-secondary"
      >
        Typography
      </h3>

      <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
        <span>Font</span>
        <select
          value={isMixed('fontFamily') ? '' : values.fontFamily}
          onChange={handleFontFamily}
          disabled={disabled}
          aria-label="font-family"
          data-mixed={isMixed('fontFamily') || undefined}
          className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled disabled:cursor-not-allowed"
        >
          {isMixed('fontFamily') && <option value="" disabled>(mixed)</option>}
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
        <span>Weight</span>
        <select
          value={isMixed('fontWeight') ? '' : values.fontWeight}
          onChange={handleWeight}
          disabled={disabled}
          aria-label="font-weight"
          data-mixed={isMixed('fontWeight') || undefined}
          className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled disabled:cursor-not-allowed"
        >
          {isMixed('fontWeight') && <option value="" disabled>(mixed)</option>}
          {WEIGHTS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
        <span className="flex items-center justify-between">
          <span>Size</span>
          <span className="text-[9px] font-mono text-ds-text-muted">clamp() or var()</span>
        </span>
        <input
          type="text"
          value={isMixed('fontSize') ? '' : values.fontSize}
          onChange={handleSize}
          disabled={disabled}
          aria-invalid={!sizeIsFluid}
          aria-label="font-size"
          data-mixed={isMixed('fontSize') || undefined}
          placeholder={isMixed('fontSize') ? '(mixed)' : 'clamp(1rem, 2vw, 1.25rem)'}
          className={`w-full px-2 py-1 rounded-ds-sm bg-ds-background border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled disabled:cursor-not-allowed placeholder:text-ds-text-muted placeholder:italic ${
            sizeIsFluid ? 'border-ds-border' : 'border-ds-destructive'
          }`}
        />
        {!sizeIsFluid && (
          <p role="alert" className="text-[10px] text-ds-destructive">
            Use clamp() for fluid type — fixed px/rem font-size is blocked.
          </p>
        )}
      </label>

      <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
        <span className="flex items-center justify-between">
          <span>Leading</span>
          <span className="text-[9px] font-mono text-ds-text-muted">unitless</span>
        </span>
        <input
          type="number"
          step="0.05"
          min="1"
          value={isMixed('lineHeight') ? '' : Number.isFinite(values.lineHeight) ? values.lineHeight : 1.5}
          onChange={handleLineHeight}
          disabled={disabled}
          aria-label="line-height"
          data-mixed={isMixed('lineHeight') || undefined}
          placeholder={isMixed('lineHeight') ? '(mixed)' : undefined}
          className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled disabled:cursor-not-allowed placeholder:text-ds-text-muted placeholder:italic"
        />
      </label>
    </section>
  )
}
