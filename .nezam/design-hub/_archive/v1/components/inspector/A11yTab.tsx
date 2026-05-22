'use client'

import { useCallback, useMemo, type ChangeEvent } from 'react'
import {
  evaluateContrast,
  suggestSafeForeground,
} from '@/src/lib/wcag-contrast'

// F-007 §3 / AC-004 — A11y tab. Live contrast ratio badge with safe-color
// suggestion when the ratio drops below 4.5:1. Tab index + ARIA role are
// surfaced read-only since they map to canvas-graph node fields, not user
// inputs (T-F007-009 may evolve this for multi-select).

export interface A11yValues {
  /** Foreground color (CSS hex or rgb()). */
  fgColor:    string
  /** Background color (CSS hex or rgb()). */
  bgColor:    string
  /** Tab order index — controlled by IA team, displayed for verification. */
  tabIndex:   number
  /** ARIA role applied to the node. */
  ariaRole:   string
}

export type A11yKey = keyof A11yValues

interface A11yTabProps {
  values:   A11yValues
  onChange: <K extends A11yKey>(key: K, value: A11yValues[K]) => void
  disabled?: boolean
  /** T-F007-009: keys whose value differs across the multi-select set. */
  mixedKeys?: ReadonlySet<A11yKey>
}

export default function A11yTab({
  values,
  onChange,
  disabled = false,
  mixedKeys,
}: A11yTabProps) {
  const isMixed = (key: A11yKey) => mixedKeys?.has(key) ?? false

  // Contrast computation is only meaningful when both colors are uniform
  // across the selection. Otherwise we'd be inventing a ratio.
  const contrast = useMemo(() => {
    if (isMixed('fgColor') || isMixed('bgColor')) return null
    return evaluateContrast(values.fgColor, values.bgColor)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.fgColor, values.bgColor, mixedKeys])

  const safeFg = useMemo(() => {
    if (!contrast || contrast.passes) return null
    return suggestSafeForeground(values.fgColor, values.bgColor)
  }, [contrast, values.fgColor, values.bgColor])

  const handleFg = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange('fgColor', e.target.value),
    [onChange],
  )
  const handleBg = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange('bgColor', e.target.value),
    [onChange],
  )
  const handleTabIndex = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.valueAsNumber
      onChange('tabIndex', Number.isFinite(next) ? next : 0)
    },
    [onChange],
  )
  const handleAriaRole = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange('ariaRole', e.target.value),
    [onChange],
  )

  const applySafe = useCallback(() => {
    if (safeFg) onChange('fgColor', safeFg)
  }, [safeFg, onChange])

  return (
    <section aria-labelledby="a11y-heading" className="flex flex-col gap-4">
      <h3
        id="a11y-heading"
        className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-secondary"
      >
        Accessibility
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
          <span>Foreground</span>
          <input
            type="text"
            value={isMixed('fgColor') ? '' : values.fgColor}
            onChange={handleFg}
            disabled={disabled}
            aria-label="foreground color"
            data-mixed={isMixed('fgColor') || undefined}
            placeholder={isMixed('fgColor') ? '(mixed)' : '#000000'}
            className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled placeholder:text-ds-text-muted placeholder:italic"
          />
        </label>

        <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
          <span>Background</span>
          <input
            type="text"
            value={isMixed('bgColor') ? '' : values.bgColor}
            onChange={handleBg}
            disabled={disabled}
            aria-label="background color"
            data-mixed={isMixed('bgColor') || undefined}
            placeholder={isMixed('bgColor') ? '(mixed)' : '#ffffff'}
            className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled placeholder:text-ds-text-muted placeholder:italic"
          />
        </label>
      </div>

      <ContrastBadge
        contrast={contrast}
        safeFg={safeFg}
        onApplySafe={applySafe}
        suppressed={isMixed('fgColor') || isMixed('bgColor')}
      />

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ds-border">
        <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
          <span>Tab index</span>
          <input
            type="number"
            value={isMixed('tabIndex') ? '' : Number.isFinite(values.tabIndex) ? values.tabIndex : 0}
            onChange={handleTabIndex}
            disabled={disabled}
            aria-label="tab-index"
            data-mixed={isMixed('tabIndex') || undefined}
            placeholder={isMixed('tabIndex') ? '(mixed)' : undefined}
            className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled placeholder:text-ds-text-muted placeholder:italic"
          />
        </label>

        <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
          <span>ARIA role</span>
          <input
            type="text"
            value={isMixed('ariaRole') ? '' : values.ariaRole}
            onChange={handleAriaRole}
            disabled={disabled}
            aria-label="aria-role"
            data-mixed={isMixed('ariaRole') || undefined}
            placeholder={isMixed('ariaRole') ? '(mixed)' : 'region'}
            className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled placeholder:text-ds-text-muted placeholder:italic"
          />
        </label>
      </div>
    </section>
  )
}

interface ContrastBadgeProps {
  contrast:     ReturnType<typeof evaluateContrast>
  safeFg:       string | null
  onApplySafe:  () => void
  /** Multi-select with mixed fg or bg — ratio would be misleading; suppress. */
  suppressed?:  boolean
}

function ContrastBadge({ contrast, safeFg, onApplySafe, suppressed = false }: ContrastBadgeProps) {
  if (suppressed) {
    return (
      <div
        role="status"
        aria-label="Contrast suppressed for mixed selection"
        className="flex items-center gap-2 px-2.5 py-2 rounded-ds-sm border border-ds-border bg-ds-surface-elevated text-ds-xs text-ds-text-muted italic"
      >
        <span aria-hidden="true">—</span>
        <span>Contrast hidden — selected nodes have different colors.</span>
      </div>
    )
  }

  if (!contrast) {
    return (
      <div
        role="status"
        aria-label="Contrast unavailable"
        className="flex items-center gap-2 px-2.5 py-2 rounded-ds-sm border border-ds-border bg-ds-surface-elevated text-ds-xs text-ds-text-muted"
      >
        <span aria-hidden="true">—</span>
        <span>Enter both colors to compute contrast.</span>
      </div>
    )
  }

  if (contrast.passes) {
    return (
      <div
        role="status"
        aria-label={`Contrast pass ${contrast.ratio.toFixed(1)} to 1, grade ${contrast.grade}`}
        data-contrast-grade={contrast.grade}
        className="flex items-center gap-2 px-2.5 py-2 rounded-ds-sm border border-ds-success bg-ds-success/10 text-ds-xs text-ds-success-foreground"
      >
        <span aria-hidden="true" className="font-bold">✓</span>
        <span className="font-mono">{contrast.ratio.toFixed(1)}:1</span>
        <span className="ms-auto uppercase tracking-wide font-semibold">{contrast.grade}</span>
      </div>
    )
  }

  return (
    <div
      role="alert"
      aria-label={`Contrast fail ${contrast.ratio.toFixed(1)} to 1`}
      data-contrast-grade={contrast.grade}
      className="flex flex-col gap-1.5 px-2.5 py-2 rounded-ds-sm border border-ds-destructive bg-ds-destructive/10 text-ds-xs text-ds-destructive"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="font-bold">✗</span>
        <span className="font-mono">{contrast.ratio.toFixed(1)}:1</span>
        <span className="ms-auto uppercase tracking-wide font-semibold">Contrast fail</span>
      </div>
      {safeFg && (
        <button
          type="button"
          onClick={onApplySafe}
          className="self-start underline decoration-dotted underline-offset-2 hover:text-ds-destructive/80 focus:outline-none focus:ring-2 focus:ring-ds-border-focus rounded-ds-sm font-mono"
        >
          Use {safeFg}
        </button>
      )}
    </div>
  )
}
