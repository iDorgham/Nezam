'use client'

import { useCallback, useMemo, type ChangeEvent } from 'react'

// F-006 T-F006-005 — Easing selector + cubic-bezier SVG preview.
// Value is a CSS-compatible string: `linear`, `cubic-bezier(x1, y1, x2, y2)`,
// or one of the canonical aliases (`ease`, `ease-in`, `ease-out`, `ease-in-out`).
// Custom presets land in T-F006-005b; for now the selector exposes the
// canonical set plus a read-only "custom" reflection of the active value.

export interface EasingPreset {
  value: string
  label: string
  cp:    readonly [number, number, number, number]
}

export const EASING_PRESETS: ReadonlyArray<EasingPreset> = [
  { value: 'linear',                                label: 'Linear',         cp: [0,    0, 1,    1] },
  { value: 'cubic-bezier(0.25, 0.1, 0.25, 1)',      label: 'Ease',           cp: [0.25, 0.1, 0.25, 1] },
  { value: 'cubic-bezier(0.42, 0, 1, 1)',           label: 'Ease in',        cp: [0.42, 0, 1, 1] },
  { value: 'cubic-bezier(0, 0, 0.58, 1)',           label: 'Ease out',       cp: [0, 0, 0.58, 1] },
  { value: 'cubic-bezier(0.42, 0, 0.58, 1)',        label: 'Ease in-out',    cp: [0.42, 0, 0.58, 1] },
  { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', label: 'Back in-out',    cp: [0.68, -0.55, 0.27, 1.55] },
]

const BEZIER_RE = /cubic-bezier\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/

// Pure helper: extract the four control points from any value the selector
// accepts. Returns null for unrecognized strings.
export function parseEasing(value: string): readonly [number, number, number, number] | null {
  const trimmed = value.trim()
  if (trimmed === 'linear') return [0, 0, 1, 1]

  const preset = EASING_PRESETS.find((p) => p.value === trimmed)
  if (preset) return preset.cp

  const match = trimmed.match(BEZIER_RE)
  if (!match) return null
  const cp = [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])] as const
  if (cp.some((n) => !Number.isFinite(n))) return null
  return cp
}

interface EasingSelectorProps {
  value:    string
  onChange: (value: string) => void
  disabled?: boolean
}

const SVG_SIZE = 80
const SVG_PAD  = 8

export default function EasingSelector({ value, onChange, disabled = false }: EasingSelectorProps) {
  const cp = useMemo<readonly [number, number, number, number]>(
    () => parseEasing(value) ?? ([0, 0, 1, 1] as const),
    [value],
  )

  // Recognized preset → match by string; otherwise treat as custom.
  const presetValue = useMemo(() => {
    const match = EASING_PRESETS.find((p) => p.value === value)
    return match ? match.value : 'custom'
  }, [value])

  const handlePreset = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value
      if (next === 'custom') return // selecting "custom" doesn't overwrite the current value
      onChange(next)
    },
    [onChange],
  )

  const path = useMemo(() => bezierPath(cp), [cp])

  return (
    <section
      aria-label="Easing"
      className="flex flex-col gap-2"
    >
      <label className="flex flex-col gap-1 text-ds-xs text-ds-text-secondary">
        <span>Easing</span>
        <select
          value={presetValue}
          onChange={handlePreset}
          disabled={disabled}
          aria-label="easing preset"
          className="w-full px-2 py-1 rounded-ds-sm bg-ds-background border border-ds-border text-ds-sm text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus disabled:bg-ds-interactive disabled:text-ds-text-disabled"
        >
          {EASING_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
          {presetValue === 'custom' && (
            <option value="custom">Custom — {value}</option>
          )}
        </select>
      </label>

      <BezierPreview cp={cp} path={path} />
    </section>
  )
}

interface BezierPreviewProps {
  cp:   readonly [number, number, number, number]
  path: string
}

function BezierPreview({ cp, path }: BezierPreviewProps) {
  const innerSize = SVG_SIZE - SVG_PAD * 2
  // Map normalized [0..1] control points into SVG inner-box coordinates.
  // Y is inverted (SVG Y grows down; easing visualizes 0→bottom, 1→top).
  const p1x = SVG_PAD + cp[0] * innerSize
  const p1y = SVG_PAD + (1 - cp[1]) * innerSize
  const p2x = SVG_PAD + cp[2] * innerSize
  const p2y = SVG_PAD + (1 - cp[3]) * innerSize

  return (
    <svg
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      width={SVG_SIZE}
      height={SVG_SIZE}
      role="img"
      aria-label="Cubic bezier preview"
      data-testid="easing-preview"
      className="border border-ds-border rounded-ds-sm bg-ds-surface-elevated"
    >
      {/* Reference frame (start / end corners) */}
      <line
        x1={SVG_PAD} y1={SVG_SIZE - SVG_PAD}
        x2={SVG_SIZE - SVG_PAD} y2={SVG_PAD}
        stroke="var(--ds-border)" strokeWidth="1" strokeDasharray="2 2"
        aria-hidden="true"
      />

      {/* Easing curve */}
      <path
        d={path}
        fill="none"
        stroke="var(--ds-primary)"
        strokeWidth="1.5"
        data-testid="easing-curve"
      />

      {/* Control-point handles (read-only for now) */}
      <line
        x1={SVG_PAD} y1={SVG_SIZE - SVG_PAD} x2={p1x} y2={p1y}
        stroke="var(--ds-text-muted)" strokeWidth="0.5"
        aria-hidden="true"
      />
      <line
        x1={SVG_SIZE - SVG_PAD} y1={SVG_PAD} x2={p2x} y2={p2y}
        stroke="var(--ds-text-muted)" strokeWidth="0.5"
        aria-hidden="true"
      />
      <circle cx={p1x} cy={p1y} r="2.5" fill="var(--ds-primary)" data-testid="cp1" />
      <circle cx={p2x} cy={p2y} r="2.5" fill="var(--ds-primary)" data-testid="cp2" />
    </svg>
  )
}

// Bezier SVG path from normalized cp values. Exported for unit tests.
export function bezierPath(
  cp: readonly [number, number, number, number],
  size = SVG_SIZE,
  pad  = SVG_PAD,
): string {
  const inner = size - pad * 2
  const x1 = pad + cp[0] * inner
  const y1 = pad + (1 - cp[1]) * inner
  const x2 = pad + cp[2] * inner
  const y2 = pad + (1 - cp[3]) * inner
  const startX = pad
  const startY = size - pad
  const endX   = size - pad
  const endY   = pad
  return `M ${startX} ${startY} C ${x1} ${y1}, ${x2} ${y2}, ${endX} ${endY}`
}
