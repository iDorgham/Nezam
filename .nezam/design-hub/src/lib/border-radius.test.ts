import { describe, expect, it } from 'vitest'
import {
  RADIUS_BUCKETS,
  bucketForValue,
  clampRadius,
  parseRadiusInput,
} from './border-radius'

describe('border-radius · clampRadius', () => {
  it('clamps negatives to 0 (spec §5)', () => {
    expect(clampRadius(-1)).toBe(0)
    expect(clampRadius(-999)).toBe(0)
  })

  it('clamps values above 32 to 32', () => {
    expect(clampRadius(33)).toBe(32)
    expect(clampRadius(1000)).toBe(32)
  })

  it('rounds non-integers to the nearest integer', () => {
    expect(clampRadius(7.4)).toBe(7)
    expect(clampRadius(7.6)).toBe(8)
  })

  it('returns 0 for NaN / Infinity', () => {
    expect(clampRadius(NaN)).toBe(0)
    expect(clampRadius(Infinity)).toBe(0)
  })
})

describe('border-radius · bucketForValue', () => {
  const cases: Array<[number, string]> = [
    [0,  'none'],
    [2,  'none'],
    [3,  'sm'],
    [5,  'sm'],
    [6,  'md'],
    [9,  'md'],
    [10, 'lg'],
    [14, 'lg'],
    [15, 'xl'],
    [20, 'xl'],
    [21, '2xl'],
    [32, '2xl'],
  ]

  it.each(cases)('px=%i → bucket %s', (px, expected) => {
    expect(bucketForValue(px).id).toBe(expected)
  })

  it('clamps before bucketing (negatives → none, huge → 2xl)', () => {
    expect(bucketForValue(-5).id).toBe('none')
    expect(bucketForValue(999).id).toBe('2xl')
  })
})

describe('border-radius · parseRadiusInput', () => {
  it('accepts a bare integer', () => {
    expect(parseRadiusInput('8')).toEqual({ ok: true, value: 8 })
  })

  it('accepts an integer with px unit', () => {
    expect(parseRadiusInput('12px')).toEqual({ ok: true, value: 12 })
    expect(parseRadiusInput('  16 px  ')).toEqual({ ok: true, value: 16 })
  })

  it('clamps parsed values to [0, 32]', () => {
    expect(parseRadiusInput('-5')).toEqual({ ok: true, value: 0 })
    expect(parseRadiusInput('99px')).toEqual({ ok: true, value: 32 })
  })

  it('rejects "auto" with invalid-unit (edge case from spec §5)', () => {
    expect(parseRadiusInput('auto')).toEqual({ ok: false, reason: 'not-a-number' })
  })

  it('rejects non-px CSS units (rem, em, %)', () => {
    expect(parseRadiusInput('1rem')).toEqual({ ok: false, reason: 'invalid-unit' })
    expect(parseRadiusInput('2em')).toEqual({ ok: false, reason: 'invalid-unit' })
    expect(parseRadiusInput('50%')).toEqual({ ok: false, reason: 'invalid-unit' })
  })

  it('rejects garbage input', () => {
    expect(parseRadiusInput('abc')).toEqual({ ok: false, reason: 'not-a-number' })
    expect(parseRadiusInput('8px8')).toEqual({ ok: false, reason: 'not-a-number' })
  })

  it('flags empty input distinctly so callers can no-op silently', () => {
    expect(parseRadiusInput('')).toEqual({ ok: false, reason: 'empty' })
    expect(parseRadiusInput('   ')).toEqual({ ok: false, reason: 'empty' })
  })
})

describe('border-radius · bucket configuration', () => {
  it('exposes the 6 spec-mandated buckets in monotonic order', () => {
    expect(RADIUS_BUCKETS.map((b) => b.id)).toEqual([
      'none', 'sm', 'md', 'lg', 'xl', '2xl',
    ])
    // Each bucket max must be strictly greater than the previous.
    for (let i = 1; i < RADIUS_BUCKETS.length; i++) {
      expect(RADIUS_BUCKETS[i].max).toBeGreaterThan(RADIUS_BUCKETS[i - 1].max)
    }
  })

  it('maps each bucket to a DesignTokens radius* key', () => {
    expect(RADIUS_BUCKETS.map((b) => b.tokenKey)).toEqual([
      'radiusNone', 'radiusSm', 'radiusMd', 'radiusLg', 'radiusXl', 'radius2xl',
    ])
  })
})
