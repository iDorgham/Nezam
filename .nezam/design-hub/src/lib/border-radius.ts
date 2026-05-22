import type { DesignTokens } from '../types/tokens.types'

// Six standard radius buckets per F-003 spec §4. The order is monotonic,
// so we can binary-bucket a numeric value into a token.
export const RADIUS_BUCKETS = [
  { id: 'none', label: 'None', max: 2,  tokenKey: 'radiusNone' },
  { id: 'sm',   label: 'SM',   max: 5,  tokenKey: 'radiusSm' },
  { id: 'md',   label: 'MD',   max: 9,  tokenKey: 'radiusMd' },
  { id: 'lg',   label: 'LG',   max: 14, tokenKey: 'radiusLg' },
  { id: 'xl',   label: 'XL',   max: 20, tokenKey: 'radiusXl' },
  { id: '2xl',  label: '2XL',  max: 32, tokenKey: 'radius2xl' },
] as const satisfies ReadonlyArray<{
  id:       string
  label:    string
  max:      number
  tokenKey: keyof DesignTokens
}>

export type RadiusBucketId = (typeof RADIUS_BUCKETS)[number]['id']
export type RadiusBucket   = (typeof RADIUS_BUCKETS)[number]

export const MIN_RADIUS_PX = 0
export const MAX_RADIUS_PX = 32

// Clamp helper used by both slider and numeric input.
export function clampRadius(n: number): number {
  if (!Number.isFinite(n)) return MIN_RADIUS_PX
  if (n < MIN_RADIUS_PX)   return MIN_RADIUS_PX
  if (n > MAX_RADIUS_PX)   return MAX_RADIUS_PX
  return Math.round(n)
}

// Find which bucket a px value belongs to. Always returns a bucket; the
// last one covers everything > xl.max.
export function bucketForValue(px: number): RadiusBucket {
  const clamped = clampRadius(px)
  for (const b of RADIUS_BUCKETS) {
    if (clamped <= b.max) return b
  }
  return RADIUS_BUCKETS[RADIUS_BUCKETS.length - 1]
}

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; reason: 'empty' | 'invalid-unit' | 'not-a-number' }

// Parse a user-typed value. Accepts:
//   "8"        → 8
//   "8px"      → 8
//   " 12 px "  → 12
// Rejects: "auto", "8rem", "1em", "8%", anything non-numeric.
export function parseRadiusInput(raw: string): ParseResult {
  const trimmed = raw.trim()
  if (trimmed === '') return { ok: false, reason: 'empty' }

  // Strip an optional trailing "px" (case-insensitive). Anything else is
  // an invalid unit per AC-003.
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*([a-z%]*)$/i)
  if (!match) return { ok: false, reason: 'not-a-number' }

  const [, numStr, unit] = match
  if (unit !== '' && unit.toLowerCase() !== 'px') {
    return { ok: false, reason: 'invalid-unit' }
  }

  const n = Number(numStr)
  if (!Number.isFinite(n)) return { ok: false, reason: 'not-a-number' }

  return { ok: true, value: clampRadius(n) }
}
