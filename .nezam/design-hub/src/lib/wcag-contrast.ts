// F-007 §4 / AC-004 — WCAG 2.2 contrast ratio computation.
// Pure functions: parse a hex / rgb() / 3-digit color, compute relative
// luminance per https://www.w3.org/WAI/GL/wiki/Relative_luminance, and
// derive the foreground/background ratio rounded to 1 decimal.

export type Wcag22Grade = 'AAA' | 'AA' | 'AA-large' | 'fail'

export interface ContrastResult {
  /** Foreground/background ratio, e.g. 7.2 or 3.1. */
  ratio: number
  /** Highest WCAG 2.2 grade this ratio satisfies for normal-size text. */
  grade: Wcag22Grade
  /** True iff `grade` is at least 'AA' for normal text. */
  passes: boolean
}

const HEX_3 = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i
const HEX_6 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
const RGB   = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i

// Parse any commonly-used CSS color string we expect to see in the inspector.
// Returns null when the string isn't something we recognize so callers can
// fall back rather than crash.
export function parseColor(input: string): [number, number, number] | null {
  const value = input.trim()
  if (value.length === 0) return null

  const hex6 = value.match(HEX_6)
  if (hex6) {
    return [
      parseInt(hex6[1], 16),
      parseInt(hex6[2], 16),
      parseInt(hex6[3], 16),
    ]
  }

  const hex3 = value.match(HEX_3)
  if (hex3) {
    return [
      parseInt(hex3[1] + hex3[1], 16),
      parseInt(hex3[2] + hex3[2], 16),
      parseInt(hex3[3] + hex3[3], 16),
    ]
  }

  const rgb = value.match(RGB)
  if (rgb) {
    const r = Number(rgb[1])
    const g = Number(rgb[2])
    const b = Number(rgb[3])
    if ([r, g, b].some((c) => c < 0 || c > 255)) return null
    return [r, g, b]
  }

  return null
}

function channelLuminance(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function relativeLuminance([r, g, b]: [number, number, number]): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  )
}

export function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = parseColor(fg)
  const bgRgb = parseColor(bg)
  if (!fgRgb || !bgRgb) return null

  const fgL = relativeLuminance(fgRgb)
  const bgL = relativeLuminance(bgRgb)
  const [lighter, darker] = fgL > bgL ? [fgL, bgL] : [bgL, fgL]
  return (lighter + 0.05) / (darker + 0.05)
}

export function gradeContrast(ratio: number): Wcag22Grade {
  if (ratio >= 7)   return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3)   return 'AA-large'
  return 'fail'
}

export function evaluateContrast(fg: string, bg: string): ContrastResult | null {
  const ratio = contrastRatio(fg, bg)
  if (ratio === null) return null

  const rounded = Math.round(ratio * 10) / 10
  const grade   = gradeContrast(rounded)
  return {
    ratio:  rounded,
    grade,
    passes: grade === 'AA' || grade === 'AAA',
  }
}

// Suggest a safe color by darkening the foreground (or lightening) until the
// AA threshold is met against the supplied background. Returns null if the
// inputs cannot be parsed.
export function suggestSafeForeground(fg: string, bg: string, target = 4.5): string | null {
  const fgRgb = parseColor(fg)
  const bgRgb = parseColor(bg)
  if (!fgRgb || !bgRgb) return null

  const bgL = relativeLuminance(bgRgb)
  const direction = bgL > 0.5 ? -1 : 1 // dark fg on light bg, light fg on dark bg

  let [r, g, b] = fgRgb
  for (let i = 0; i < 25; i++) {
    const trial: [number, number, number] = [
      Math.max(0, Math.min(255, r + direction * 10)),
      Math.max(0, Math.min(255, g + direction * 10)),
      Math.max(0, Math.min(255, b + direction * 10)),
    ]
    r = trial[0]; g = trial[1]; b = trial[2]
    const trialLum = relativeLuminance(trial)
    const [lighter, darker] = trialLum > bgL ? [trialLum, bgL] : [bgL, trialLum]
    const ratio = (lighter + 0.05) / (darker + 0.05)
    if (ratio >= target) {
      const hex = (n: number) => n.toString(16).padStart(2, '0')
      return `#${hex(r)}${hex(g)}${hex(b)}`
    }
  }
  return null
}
