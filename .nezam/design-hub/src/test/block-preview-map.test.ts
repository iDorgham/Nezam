import { describe, expect, it } from 'vitest'

import {
  BLOCK_TYPES_WITH_PREVIEW,
  getAllRegistryBlockTypes,
  hasDedicatedPreview,
} from '../lib/wireframe/block-preview-map'

describe('block preview map', () => {
  it('lists dedicated previews for every registry block type', () => {
    const registryTypes = getAllRegistryBlockTypes()
    expect(registryTypes.length).toBe(53)

    for (const type of registryTypes) {
      expect(hasDedicatedPreview(type)).toBe(true)
    }

    expect(new Set(BLOCK_TYPES_WITH_PREVIEW).size).toBe(registryTypes.length)
  })
})
