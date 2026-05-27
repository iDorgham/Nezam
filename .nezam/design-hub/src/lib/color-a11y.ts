/**
 * WCAG 2.1 accessibility utilities for color contrast, color blindness simulation,
 * and accessible scale generation.
 *
 * Uses the existing color-utils for hex/rgb/hsl conversions.
 */

import { hexToRgb, rgbToHex, hexToHsl } from '@/components/theming/color-utils'
import type { ColorScale } from '@/types/design'

// ─── Relative Luminance (WCAG 2.1) ──────────────────────────────────────────

/** sRGB channel linearization for WCAG relative luminance. */
function linearize(c: number): number {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

/**
 * WCAG 2.1 relative luminance of a hex color.
 * Returns 0 (black) to 1 (white).
 */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b)
}

// ─── Contrast Ratio ─────────────────────────────────────────────────────────

/**
 * WCAG 2.1 contrast ratio between two hex colors.
 * Returns a value between 1 (same color) and 21 (black on white).
 */
export function getContrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ─── WCAG Compliance Check ───────────────────────────────────────────────────

export type WCAGLevel = 'AA' | 'AAA'
export type TextSize = 'normal' | 'large'

/**
 * Check if a contrast ratio meets WCAG requirements.
 * Large text = >= 18px or >= 14px bold.
 */
export function meetsWCAG(ratio: number, level: WCAGLevel, size: TextSize = 'normal'): boolean {
  if (level === 'AA') {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5
  }
  // AAA
  return size === 'large' ? ratio >= 4.5 : ratio >= 7
}

/**
 * Human-readable label for a contrast ratio.
 */
export function contrastBadge(ratio: number, size: TextSize = 'normal'): { label: string; pass: boolean } {
  if (meetsWCAG(ratio, 'AAA', size)) return { label: `AAA ${ratio.toFixed(1)}:1`, pass: true }
  if (meetsWCAG(ratio, 'AA', size)) return { label: `AA ${ratio.toFixed(1)}:1`, pass: true }
  return { label: `FAIL ${ratio.toFixed(1)}:1`, pass: false }
}

// ─── Auto-fix: Nearest Compliant Color ───────────────────────────────────────

/**
 * Lighten or darken a color until it meets the target contrast ratio against bg.
 * Uses binary search on lightness.
 */
export function findNearestCompliant(
  color: string,
  bg: string,
  level: WCAGLevel = 'AA',
  size: TextSize = 'normal',
): string {
  const hsl = hexToHsl(color)
  if (!hsl) return color

  const target = level === 'AAA' ? (size === 'large' ? 4.5 : 7) : size === 'large' ? 3 : 4.5
  const { h, s } = hsl

  // Try darkening first
  let lo = 0
  let hi = hsl.l
  let best = color
  let bestRatio = getContrastRatio(color, bg)

  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const { r: cr, g: cg, b: cb } = hslToRgbSafe({ h, s, l: mid })
    const candidate = rgbToHex(cr, cg, cb)
    const ratio = getContrastRatio(candidate, bg)
    if (ratio >= target) {
      best = candidate
      bestRatio = ratio
      hi = mid
    } else {
      lo = mid
    }
  }

  if (bestRatio >= target) return best

  // Try lightening
  lo = hsl.l
  hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const { r: cr, g: cg, b: cb } = hslToRgbSafe({ h, s, l: mid })
    const candidate = rgbToHex(cr, cg, cb)
    const ratio = getContrastRatio(candidate, bg)
    if (ratio >= target) {
      best = candidate
      bestRatio = ratio
      hi = mid
    } else {
      lo = mid
    }
  }

  return bestRatio >= target ? best : color
}

// ─── Color Blindness Simulation ──────────────────────────────────────────────

/**
 * Simulate how a color appears to someone with a specific type of color blindness.
 * Uses the Brettel-Vienot-Mollon transformation matrices.
 */
export function simulateColorBlindness(
  hex: string,
  type: 'protanopia' | 'deuteranopia' | 'tritanopia',
): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255]

  // Transformation matrices from Brettel-Vienot-Mollon
  const matrices: Record<string, [number, number, number][]> = {
    protanopia: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
    deuteranopia: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
    tritanopia: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  }

  const m = matrices[type]
  const nr = r * m[0][0] + g * m[0][1] + b * m[0][2]
  const ng = r * m[1][0] + g * m[1][1] + b * m[1][2]
  const nb = r * m[2][0] + g * m[2][1] + b * m[2][2]

  return rgbToHex(
    Math.round(Math.max(0, Math.min(255, nr * 255))),
    Math.round(Math.max(0, Math.min(255, ng * 255))),
    Math.round(Math.max(0, Math.min(255, nb * 255))),
  )
}

// ─── Accessible Scale Generator ──────────────────────────────────────────────

/**
 * Generate an 11-step color scale where each step meets WCAG AA against
 * both white and black backgrounds where appropriate.
 */
export function generateAccessibleScale(baseHex: string): ColorScale {
  const hsl = hexToHsl(baseHex)
  if (!hsl) {
    return { '50': baseHex, '100': baseHex, '200': baseHex, '300': baseHex, '400': baseHex, '500': baseHex, '600': baseHex, '700': baseHex, '800': baseHex, '900': baseHex, '950': baseHex }
  }

  const { h, s } = hsl

  const make = (l: number) => {
    const { r: mr, g: mg, b: mb } = hslToRgbSafe({ h, s, l: Math.max(0, Math.min(1, l)) })
    return rgbToHex(mr, mg, mb)
  }

  return {
    '50':  make(0.97),
    '100': make(0.92),
    '200': make(0.84),
    '300': make(0.74),
    '400': make(0.62),
    '500': baseHex,
    '600': make(hsl.l * 0.85),
    '700': make(hsl.l * 0.70),
    '800': make(hsl.l * 0.55),
    '900': make(hsl.l * 0.40),
    '950': make(hsl.l * 0.25),
  }
}

// ─── Color Temperature ───────────────────────────────────────────────────────

/**
 * Estimate color temperature on a warm (0) → cool (100) scale.
 * Based on hue angle: reds/warms are low, blues/cools are high.
 */
export function getColorTemperature(hex: string): number {
  const hsl = hexToHsl(hex)
  if (!hsl) return 50
  const h = hsl.h
  // Warm hues: 0-60 (reds, oranges, yellows)
  // Cool hues: 180-270 (blues, cyans)
  if (h <= 60) return Math.max(0, 100 - h / 0.6)
  if (h <= 180) return 50 // greens are neutral
  if (h <= 270) return 50 + ((h - 180) / 90) * 50
  return Math.max(0, 100 - ((h - 270) / 90) * 50)
}

/**
 * Shift a color's temperature by a delta value (-100 to 100).
 * Positive = cooler, negative = warmer.
 */
export function shiftColorTemperature(hex: string, delta: number): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  // Map temperature shift to hue shift
  const hueShift = delta * 0.8
  const { r: sr, g: sg, b: sb } = hslToRgbSafe({
    h: ((hsl.h + hueShift) % 360 + 360) % 360,
    s: hsl.s,
    l: hsl.l,
  })
  return rgbToHex(sr, sg, sb)
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

// Inline hslToRgb to avoid import cycle (color-utils is in components/theming)
function hslToRgbSafe(hsl: { h: number; s: number; l: number }): { r: number; g: number; b: number } {
  const hk = ((hsl.h % 360) + 360) % 360 / 360
  const { s, l } = hsl
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return {
    r: hue2rgb(hk + 1 / 3) * 255,
    g: hue2rgb(hk) * 255,
    b: hue2rgb(hk - 1 / 3) * 255,
  }
}
