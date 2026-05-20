import { describe, expect, it } from 'vitest'
import {
  checkCssDeclaration,
  checkFontSize,
  checkPropertyName,
} from './hardlock-check'

describe('checkPropertyName · directional margin', () => {
  it.each(['margin-left', 'margin-right', 'margin-top', 'margin-bottom'])(
    'blocks %s',
    (name) => {
      const result = checkPropertyName(name)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.code).toBe('directional-margin')
        expect(result.message).toMatch(/margin-inline-start/)
      }
    },
  )

  it('is case-insensitive', () => {
    expect(checkPropertyName('Margin-Left').ok).toBe(false)
  })
})

describe('checkPropertyName · directional padding', () => {
  it.each(['padding-left', 'padding-right', 'padding-top', 'padding-bottom'])(
    'blocks %s',
    (name) => {
      const result = checkPropertyName(name)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.code).toBe('directional-padding')
        expect(result.message).toMatch(/padding-inline-start/)
      }
    },
  )
})

describe('checkPropertyName · logical properties pass through', () => {
  it.each([
    'margin-inline-start',
    'margin-inline-end',
    'margin-block-start',
    'margin-block-end',
    'padding-inline-start',
    'padding-inline-end',
    'padding-block-start',
    'padding-block-end',
    'color',
    'font-size',
    'gap',
  ])('accepts %s', (name) => {
    expect(checkPropertyName(name).ok).toBe(true)
  })
})

describe('checkFontSize', () => {
  it('accepts an empty value (not yet entered)', () => {
    expect(checkFontSize('').ok).toBe(true)
  })

  it('accepts clamp() formulas', () => {
    expect(checkFontSize('clamp(1rem, 2vw, 1.25rem)').ok).toBe(true)
  })

  it('accepts CSS variable references', () => {
    expect(checkFontSize('var(--ds-font-size-base)').ok).toBe(true)
  })

  it.each(['16', '16px', '1rem', '0.875rem', '1.2em'])('blocks fixed value %s', (value) => {
    const result = checkFontSize(value)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.code).toBe('fixed-font-size')
      expect(result.suggestion).toMatch(/clamp\(/)
    }
  })
})

describe('checkCssDeclaration · raw CSS guard', () => {
  it('passes when the line is not a declaration', () => {
    expect(checkCssDeclaration('not a declaration').ok).toBe(true)
  })

  it('blocks margin-left declarations', () => {
    const result = checkCssDeclaration('margin-left: 12px;')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('directional-margin')
  })

  it('blocks padding-right declarations', () => {
    const result = checkCssDeclaration('padding-right: 8px')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('directional-padding')
  })

  it('blocks fixed font-size declarations', () => {
    const result = checkCssDeclaration('font-size: 14px;')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('fixed-font-size')
  })

  it('accepts fluid font-size declarations', () => {
    expect(checkCssDeclaration('font-size: clamp(1rem, 2vw, 1.25rem);').ok).toBe(true)
  })

  it('accepts logical-property declarations', () => {
    expect(checkCssDeclaration('margin-inline-start: 12px;').ok).toBe(true)
  })
})
