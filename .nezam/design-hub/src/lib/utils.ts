import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generate a short random ID. */
export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Deep set a value in a nested object by dot-path. Mutates the object (use inside immer). */
export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  current[keys[keys.length - 1]] = value
}

/** Get a value by dot-path from a nested object. */
export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

/** Convert a hex color to rgb values (0-255). */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

/** Mix two hex colors with a given weight (0–1, 0 = full a, 1 = full b). */
export function mixHex(a: string, b: string, t: number): string {
  const ra = hexToRgb(a)
  const rb = hexToRgb(b)
  if (!ra || !rb) return a
  const r = Math.round(ra.r + (rb.r - ra.r) * t)
  const g = Math.round(ra.g + (rb.g - ra.g) * t)
  const bl = Math.round(ra.b + (rb.b - ra.b) * t)
  return `#${[r, g, bl].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

/** Generate a 11-step color scale from a single brand hex (50→950). */
export function generateColorScale(brandHex: string): Record<string, string> {
  const white = '#fbfdff'
  const black = '#090909'
  return {
    '50':  mixHex(white, brandHex, 0.08),
    '100': mixHex(white, brandHex, 0.16),
    '200': mixHex(white, brandHex, 0.32),
    '300': mixHex(white, brandHex, 0.50),
    '400': mixHex(white, brandHex, 0.70),
    '500': brandHex,
    '600': mixHex(brandHex, black, 0.15),
    '700': mixHex(brandHex, black, 0.32),
    '800': mixHex(brandHex, black, 0.50),
    '900': mixHex(brandHex, black, 0.68),
    '950': mixHex(brandHex, black, 0.80),
  }
}
