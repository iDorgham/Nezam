// Fluid type scale per F-004. Each step exposes a clamp() expression plus
// its three resolved values so we can render a breakdown tooltip without
// re-parsing the formula at runtime.

export interface ScaleStep {
  id:          string
  label:       string
  minPx:       number
  preferredVw: number
  maxPx:       number
  expression:  string
  sampleEn:    string
  sampleAr:    string
}

const SAMPLE_EN = 'The quick brown fox jumps over the lazy dog'
const SAMPLE_AR = 'الذكاء الاصطناعي يحول العالم'

// 8-step scale from xs to 4xl. minPx/maxPx are the resolved bounds; vw is
// the preferred grow rate. Math is a 1.2 modular scale rooted at base=16.
function step(
  id:          string,
  label:       string,
  minPx:       number,
  preferredVw: number,
  maxPx:       number,
): ScaleStep {
  const minRem = +(minPx / 16).toFixed(3)
  const maxRem = +(maxPx / 16).toFixed(3)
  return {
    id,
    label,
    minPx,
    preferredVw,
    maxPx,
    expression: `clamp(${minRem}rem, ${preferredVw}vw, ${maxRem}rem)`,
    sampleEn:   SAMPLE_EN,
    sampleAr:   SAMPLE_AR,
  }
}

export const TYPOGRAPHY_SCALE: readonly ScaleStep[] = [
  step('xs',   'XS',   11, 1.2, 12),
  step('sm',   'SM',   13, 1.5, 14),
  step('base', 'Base', 15, 1.8, 16),
  step('lg',   'LG',   17, 2.2, 18),
  step('xl',   'XL',   19, 2.6, 20),
  step('2xl',  '2XL',  23, 3.0, 24),
  step('3xl',  '3XL',  29, 4.0, 30),
  step('4xl',  '4XL',  34, 5.0, 36),
] as const

// A "fluid" expression is anything wrapped in clamp(…). Fixed px / rem /
// other static units fail this check and trigger the Non-fluid badge per
// AC-005.
export function isFluidExpression(expr: string): boolean {
  return /^\s*clamp\s*\(/i.test(expr.trim())
}

export interface ClampParts {
  minRem:      number
  preferredVw: number
  maxRem:      number
}

// Best-effort parse of `clamp(MIN, PREFERRED, MAX)` where MIN/MAX are rem
// and PREFERRED is vw. Returns null for non-clamp or malformed input.
// Used to render the tooltip when steps come from a future external
// source (today's TYPOGRAPHY_SCALE table carries the parts pre-computed).
export function parseClampFormula(expr: string): ClampParts | null {
  const match = expr.trim().match(
    /^clamp\s*\(\s*([\d.]+)\s*rem\s*,\s*([\d.]+)\s*vw\s*,\s*([\d.]+)\s*rem\s*\)\s*$/i,
  )
  if (!match) return null
  return {
    minRem:      Number(match[1]),
    preferredVw: Number(match[2]),
    maxRem:      Number(match[3]),
  }
}

// Compute the resolved px size at a given viewport width.
// CSS clamp semantics: max(MIN, min(PREFERRED, MAX)).
export function computeStepPx(step: ScaleStep, viewportPx: number, rootPx = 16): number {
  const preferred = (step.preferredVw / 100) * viewportPx
  const clamped   = Math.min(step.maxPx, Math.max(step.minPx, preferred))
  // Round to the nearest 0.1px so the tooltip stays stable on resize.
  return Math.round(clamped * 10) / 10
  // rootPx left as a knob for future per-context computation if --ds-base
  // ever moves away from 16px; currently unused.
  void rootPx
}

// Default UI controls. Persisted choice is out of scope for F-004.
export const FONT_FAMILIES = [
  { id: 'sans',  label: 'Geist Sans',  stack: '"Geist Sans", system-ui, sans-serif' },
  { id: 'serif', label: 'Geist Serif', stack: '"Geist Serif", Georgia, serif' },
  { id: 'mono',  label: 'Geist Mono',  stack: '"Geist Mono", ui-monospace, monospace' },
] as const

export const FONT_WEIGHTS = [
  { id: 400, label: 'Regular' },
  { id: 500, label: 'Medium' },
  { id: 600, label: 'Semibold' },
  { id: 700, label: 'Bold' },
] as const

export type FontFamilyId = (typeof FONT_FAMILIES)[number]['id']
export type FontWeightId = (typeof FONT_WEIGHTS)[number]['id']
