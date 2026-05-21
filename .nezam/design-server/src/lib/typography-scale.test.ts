import { describe, expect, it } from 'vitest'
import {
  TYPOGRAPHY_SCALE,
  computeStepPx,
  isFluidExpression,
  parseClampFormula,
  type ScaleStep,
} from './typography-scale'

describe('typography-scale · TYPOGRAPHY_SCALE config', () => {
  it('exposes 8 steps in spec-mandated order (xs → 4xl)', () => {
    expect(TYPOGRAPHY_SCALE.map((s) => s.id)).toEqual([
      'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl',
    ])
  })

  it('each step is monotonically larger than the previous in min/max px', () => {
    for (let i = 1; i < TYPOGRAPHY_SCALE.length; i++) {
      expect(TYPOGRAPHY_SCALE[i].minPx).toBeGreaterThan(TYPOGRAPHY_SCALE[i - 1].minPx)
      expect(TYPOGRAPHY_SCALE[i].maxPx).toBeGreaterThan(TYPOGRAPHY_SCALE[i - 1].maxPx)
    }
  })

  it('each step expression is a clamp() — pre-baked fluid', () => {
    for (const step of TYPOGRAPHY_SCALE) {
      expect(isFluidExpression(step.expression)).toBe(true)
    }
  })

  it('each step carries both EN and AR sample strings', () => {
    for (const step of TYPOGRAPHY_SCALE) {
      expect(step.sampleEn.length).toBeGreaterThan(0)
      expect(step.sampleAr.length).toBeGreaterThan(0)
    }
  })
})

describe('typography-scale · isFluidExpression (AC-005)', () => {
  it('accepts standard clamp() formulas', () => {
    expect(isFluidExpression('clamp(0.75rem, 1.2vw, 1rem)')).toBe(true)
    expect(isFluidExpression('  CLAMP(1rem, 2vw, 1.5rem)  ')).toBe(true)
  })

  it('rejects fixed px / rem / em sizes', () => {
    expect(isFluidExpression('16px')).toBe(false)
    expect(isFluidExpression('1.5rem')).toBe(false)
    expect(isFluidExpression('1em')).toBe(false)
  })

  it('rejects calc() and other CSS functions', () => {
    expect(isFluidExpression('calc(1rem + 2vw)')).toBe(false)
    expect(isFluidExpression('min(1rem, 16px)')).toBe(false)
  })
})

describe('typography-scale · parseClampFormula', () => {
  it('extracts min / preferred / max from a well-formed expression', () => {
    expect(parseClampFormula('clamp(0.75rem, 1.5vw, 1rem)')).toEqual({
      minRem:      0.75,
      preferredVw: 1.5,
      maxRem:      1,
    })
  })

  it('tolerates whitespace and casing', () => {
    expect(parseClampFormula('  CLAMP( 1rem ,  2vw , 1.25rem )')).toEqual({
      minRem:      1,
      preferredVw: 2,
      maxRem:      1.25,
    })
  })

  it('returns null for non-clamp input', () => {
    expect(parseClampFormula('16px')).toBeNull()
    expect(parseClampFormula('clamp(16px, 2vw, 1rem)')).toBeNull() // px in min slot
    expect(parseClampFormula('garbage')).toBeNull()
  })
})

describe('typography-scale · computeStepPx (CSS clamp semantics)', () => {
  const step: ScaleStep = {
    id:          'base',
    label:       'Base',
    minPx:       15,
    preferredVw: 2.0,
    maxPx:       16,
    expression:  'clamp(0.938rem, 2vw, 1rem)',
    sampleEn:    '',
    sampleAr:    '',
  }

  it('returns minPx when preferred * vw is below min', () => {
    // viewport 300 → 6px preferred, below min 15
    expect(computeStepPx(step, 300)).toBe(15)
  })

  it('returns maxPx when preferred * vw is above max', () => {
    // viewport 1280 → 25.6px preferred, above max 16
    expect(computeStepPx(step, 1280)).toBe(16)
  })

  it('returns the preferred value when in range', () => {
    // viewport 780 → 15.6px (in range [15, 16])
    expect(computeStepPx(step, 780)).toBeCloseTo(15.6, 1)
  })
})
