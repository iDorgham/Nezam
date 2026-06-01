import { describe, expect, it } from 'vitest'
import {
  contrastBadge,
  getContrastRatio,
  meetsWCAG,
} from '@/lib/color-a11y'

describe('color-a11y · WCAG 2.2 AA thresholds', () => {
  it('white on black is 21:1', () => {
    const ratio = getContrastRatio('#ffffff', '#000000')
    expect(ratio).toBeGreaterThan(20.9)
    expect(ratio).toBeLessThan(21.1)
  })

  it('enforces AA normal text at 4.5:1', () => {
    expect(meetsWCAG(4.5, 'AA', 'normal')).toBe(true)
    expect(meetsWCAG(4.49, 'AA', 'normal')).toBe(false)
  })

  it('enforces AA large text at 3:1', () => {
    expect(meetsWCAG(3, 'AA', 'large')).toBe(true)
    expect(meetsWCAG(2.99, 'AA', 'large')).toBe(false)
  })

  it('contrastBadge marks sub-AA as fail', () => {
    const badge = contrastBadge(3.2, 'normal')
    expect(badge.pass).toBe(false)
    expect(badge.label).toMatch(/^FAIL/)
  })
})
