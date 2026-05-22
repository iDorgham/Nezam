import { describe, expect, it } from 'vitest'
import { nodeTypeColorVar, wireTypeColorVar } from './node-style'

describe('node-style · nodeTypeColorVar', () => {
  it('maps every CanvasNode type to a CSS var', () => {
    expect(nodeTypeColorVar('page')).toContain('var(--')
    expect(nodeTypeColorVar('service')).toContain('var(--')
    expect(nodeTypeColorVar('auth')).toContain('var(--')
    expect(nodeTypeColorVar('mobile')).toContain('var(--')
    expect(nodeTypeColorVar('group')).toContain('var(--')
  })

  it('uses Electric Cyan (--ds-primary) for page nodes — matches active CTA token', () => {
    expect(nodeTypeColorVar('page')).toBe('var(--ds-primary)')
  })
})

describe('node-style · wireTypeColorVar (spec §3.3 wire color map)', () => {
  it('maps each wire type to its spec-mandated --dv-wire-* token', () => {
    expect(wireTypeColorVar('navigational')).toBe('var(--dv-wire-navigational)')
    expect(wireTypeColorVar('data')).toBe('var(--dv-wire-data)')
    expect(wireTypeColorVar('auth')).toBe('var(--dv-wire-auth)')
    expect(wireTypeColorVar('conditional')).toBe('var(--dv-wire-conditional)')
  })
})
