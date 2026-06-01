import { describe, expect, it } from 'vitest'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import {
  diffFlatTokens,
  flattenTokens,
  pathToTokenCategory,
} from '@/lib/design/token-flattener'

describe('token-flattener', () => {
  const minimal = DESIGN_PROFILES_MAP.minimal.tokens
  const corporate = DESIGN_PROFILES_MAP.corporate.tokens

  it('flattenTokens includes nested color paths', () => {
    const flat = flattenTokens(minimal)
    expect(flat.some((r) => r.path.includes('colors'))).toBe(true)
    expect(flat.some((r) => r.path.includes('brand'))).toBe(true)
  })

  it('pathToTokenCategory maps first segment to category id', () => {
    expect(pathToTokenCategory('colors.brand.600')).toBe('colors')
    expect(pathToTokenCategory('typography.fontFamily.sans')).toBe('typography')
    expect(pathToTokenCategory('unknown.foo')).toBeNull()
  })

  it('diffFlatTokens reports changed keys between profiles', () => {
    const before = flattenTokens(minimal)
    const after = flattenTokens(corporate)
    const diff = diffFlatTokens(before, after)
    expect(diff.changed.length + diff.added.length + diff.removed.length).toBeGreaterThan(
      0,
    )
  })
})
