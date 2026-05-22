'use client'

import { useCallback, type ChangeEvent } from 'react'

// F-007 §3 / AC-001 — Box model uses logical properties only. Never -left /
// -right / -top / -bottom. Four groups, each a start/end pair, so an RTL
// flip on the canvas trivially flows through without re-labelling.

export interface BoxModelValues {
  marginInlineStart:  number
  marginInlineEnd:    number
  marginBlockStart:   number
  marginBlockEnd:     number
  paddingInlineStart: number
  paddingInlineEnd:   number
  paddingBlockStart:  number
  paddingBlockEnd:    number
}

export type BoxModelKey = keyof BoxModelValues

interface BoxModelFieldsProps {
  values:   BoxModelValues
  onChange: (key: BoxModelKey, value: number) => void
  /** Optional disabled state for hardlock failures. */
  disabled?: boolean
  /** AC-006 / T-F007-010: flip inline-side annotations when canvas is RTL. */
  rtlMode?:  boolean
  /** T-F007-009: keys whose value differs across the multi-select set. */
  mixedKeys?: ReadonlySet<BoxModelKey>
}

interface Group {
  title:   string
  axis:    'inline' | 'block'
  start:   { key: BoxModelKey; label: string; cssName: string }
  end:     { key: BoxModelKey; label: string; cssName: string }
}

const GROUPS: ReadonlyArray<Group> = [
  {
    title: 'Margin · Inline', axis: 'inline',
    start: { key: 'marginInlineStart', label: 'Start', cssName: 'margin-inline-start' },
    end:   { key: 'marginInlineEnd',   label: 'End',   cssName: 'margin-inline-end' },
  },
  {
    title: 'Margin · Block', axis: 'block',
    start: { key: 'marginBlockStart',  label: 'Start', cssName: 'margin-block-start' },
    end:   { key: 'marginBlockEnd',    label: 'End',   cssName: 'margin-block-end' },
  },
  {
    title: 'Padding · Inline', axis: 'inline',
    start: { key: 'paddingInlineStart', label: 'Start', cssName: 'padding-inline-start' },
    end:   { key: 'paddingInlineEnd',   label: 'End',   cssName: 'padding-inline-end' },
  },
  {
    title: 'Padding · Block', axis: 'block',
    start: { key: 'paddingBlockStart',  label: 'Start', cssName: 'padding-block-start' },
    end:   { key: 'paddingBlockEnd',    label: 'End',   cssName: 'padding-block-end' },
  },
]

// AC-006: physical-side hint for the current writing mode. Inline axis flips
// with rtlMode; block axis assumes horizontal-tb (start=top, end=bottom).
export function physicalSideHint(
  axis: 'inline' | 'block',
  edge: 'start' | 'end',
  rtlMode: boolean,
): string {
  if (axis === 'block') return edge === 'start' ? 'top' : 'bottom'
  if (edge === 'start') return rtlMode ? 'right' : 'left'
  return rtlMode ? 'left' : 'right'
}

export default function BoxModelFields({
  values,
  onChange,
  disabled = false,
  rtlMode  = false,
  mixedKeys,
}: BoxModelFieldsProps) {
  const handle = useCallback(
    (key: BoxModelKey) => (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.valueAsNumber
      // Empty input gives NaN — treat as zero so the input stays controlled
      // without forcing the consumer to coerce on every keystroke.
      onChange(key, Number.isFinite(next) ? next : 0)
    },
    [onChange],
  )

  return (
    <section aria-labelledby="box-model-heading" className="flex flex-col gap-3">
      <h3
        id="box-model-heading"
        className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-secondary"
      >
        Box model
      </h3>

      {GROUPS.map((group) => (
        <fieldset
          key={group.title}
          aria-label={group.title}
          className="grid grid-cols-2 gap-2 border border-ds-border rounded-ds-sm p-2 bg-ds-surface-elevated"
        >
          <legend className="col-span-2 text-[10px] uppercase tracking-wide text-ds-text-muted mb-1">
            {group.title}
          </legend>

          {(['start', 'end'] as const).map((edge) => {
            const field    = group[edge]
            const isMixed  = mixedKeys?.has(field.key) ?? false
            const sideHint = physicalSideHint(group.axis, edge, rtlMode)
            // AC-006 — surface the physical side as a data attribute so the
            // RTL test can verify it without parsing user-facing copy.
            return (
              <label key={field.key} className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
                <span title={field.cssName} className="flex items-center justify-between gap-1">
                  <span className="flex items-baseline gap-1">
                    <span>{field.label}</span>
                    <span
                      aria-hidden="true"
                      data-side-hint={sideHint}
                      data-key={field.key}
                      className="text-[9px] font-mono text-ds-text-muted"
                    >
                      ({sideHint})
                    </span>
                  </span>
                  <span className="text-[9px] font-mono text-ds-text-muted">px</span>
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={isMixed ? '' : Number.isFinite(values[field.key]) ? values[field.key] : 0}
                  onChange={handle(field.key)}
                  aria-label={field.cssName}
                  data-side-hint={sideHint}
                  data-mixed={isMixed || undefined}
                  placeholder={isMixed ? '(mixed)' : undefined}
                  disabled={disabled}
                  className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm font-mono text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled disabled:cursor-not-allowed placeholder:text-ds-text-muted placeholder:italic"
                />
              </label>
            )
          })}
        </fieldset>
      ))}
    </section>
  )
}
