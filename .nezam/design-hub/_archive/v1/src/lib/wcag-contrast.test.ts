import { describe, expect, it } from 'vitest'
import {
  contrastRatio,
  evaluateContrast,
  gradeContrast,
  parseColor,
  suggestSafeForeground,
} from './wcag-contrast'

describe('parseColor', () => {
  it('parses 6-digit hex with and without leading #', () => {
    expect(parseColor('#ffffff')).toEqual([255, 255, 255])
    expect(parseColor('000000')).toEqual([0, 0, 0])
  })

  it('parses 3-digit hex (expands each nibble)', () => {
    expect(parseColor('#fff')).toEqual([255, 255, 255])
    expect(parseColor('#0a8')).toEqual([0, 170, 136])
  })

  it('parses rgb() strings', () => {
    expect(parseColor('rgb(255, 128, 0)')).toEqual([255, 128, 0])
  })

  it('returns null for unparseable input', () => {
    expect(parseColor('nope')).toBeNull()
    expect(parseColor('')).toBeNull()
    expect(parseColor('rgb(300, 0, 0)')).toBeNull()
  })
})

describe('contrastRatio', () => {
  it('white on black is 21:1', () => {
    const r = contrastRatio('#ffffff', '#000000')!
    expect(r).toBeGreaterThan(20.9)
    expect(r).toBeLessThan(21.1)
  })

  it('black on white is 21:1 (symmetric)', () => {
    const r = contrastRatio('#000000', '#ffffff')!
    expect(r).toBeGreaterThan(20.9)
  })

  it('same colors are 1:1', () => {
    expect(contrastRatio('#888888', '#888888')).toBeCloseTo(1, 5)
  })

  it('returns null for unparseable input', () => {
    expect(contrastRatio('not-a-color', '#000')).toBeNull()
  })
})

describe('gradeContrast · WCAG 2.2 thresholds', () => {
  it('AAA at ratio ≥ 7', () => {
    expect(gradeContrast(7)).toBe('AAA')
    expect(gradeContrast(21)).toBe('AAA')
  })

  it('AA at ratio ≥ 4.5 but < 7', () => {
    expect(gradeContrast(4.5)).toBe('AA')
    expect(gradeContrast(6.9)).toBe('AA')
  })

  it('AA-large at ratio ≥ 3 but < 4.5', () => {
    expect(gradeContrast(3)).toBe('AA-large')
    expect(gradeContrast(4.4)).toBe('AA-large')
  })

  it('fail below 3', () => {
    expect(gradeContrast(2.99)).toBe('fail')
    expect(gradeContrast(1)).toBe('fail')
  })
})

describe('evaluateContrast', () => {
  it('rounds ratio to one decimal place', () => {
    const r = evaluateContrast('#ffffff', '#000000')!
    expect(r.ratio).toBe(21)
    expect(r.passes).toBe(true)
    expect(r.grade).toBe('AAA')
  })

  it('flags an AA-large case as not passing normal-text AA', () => {
    // #949494 on #ffffff is ~3.0:1 — sits inside the [3, 4.5) AA-large band.
    const r = evaluateContrast('#949494', '#ffffff')!
    expect(r.grade).toBe('AA-large')
    expect(r.passes).toBe(false)
  })

  it('returns null when either color is unparseable', () => {
    expect(evaluateContrast('nope', '#000')).toBeNull()
  })
})

describe('suggestSafeForeground', () => {
  it('returns a darker color when foreground is too light on a light bg', () => {
    const safer = suggestSafeForeground('#cccccc', '#ffffff')
    expect(safer).not.toBeNull()
    const result = evaluateContrast(safer!, '#ffffff')!
    expect(result.passes).toBe(true)
  })

  it('returns a lighter color when foreground is too dark on a dark bg', () => {
    const safer = suggestSafeForeground('#333333', '#111111')
    expect(safer).not.toBeNull()
    const result = evaluateContrast(safer!, '#111111')!
    expect(result.passes).toBe(true)
  })
})
