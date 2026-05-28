import { describe, expect, it } from 'vitest'

import {
  getAllBlocks,
  getBlocksForProfile,
  getPaletteByCategory,
} from '../lib/wireframe/blockRegistry'

describe('block registry', () => {
  it('exposes 53 block types (28 core + 25 artistic)', () => {
    const blocks = getAllBlocks()
    const types = new Set(blocks.map((b) => b.type))
    expect(types.size).toBe(53)
  })

  it('filters blocks by profile canvas mode', () => {
    const mobile = getBlocksForProfile('mobile-app')
    const web = getBlocksForProfile('landing-page')

    expect(mobile.length).toBeGreaterThan(0)
    expect(mobile.every((b) => (b.canvas_modes ?? []).includes('mobile'))).toBe(true)
    expect(web.length).toBeGreaterThan(mobile.length)
  })

  it('returns non-empty palette categories for saas profile', () => {
    const palette = getPaletteByCategory('saas')
    expect(palette.length).toBeGreaterThan(0)
    expect(palette.every((cat) => cat.blocks.length > 0)).toBe(true)
  })
})
