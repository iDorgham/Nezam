import { describe, expect, it } from 'vitest'

import { buildDesignPreviewCssVars } from '@/lib/preview-scope-vars'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'

describe('buildDesignPreviewCssVars', () => {
  it('maps design profile brand to preview and app accent vars', () => {
    const profile = DESIGN_PROFILES_MAP.vibrant
    const vars = buildDesignPreviewCssVars(profile.tokens)

    expect(vars['--brand']).toBe(profile.tokens.colors.brand['500'])
    expect(vars['--app-accent']).toBe(profile.tokens.colors.brand['500'])
    expect(vars['--app-surface']).toBe(profile.tokens.colors.surface.bg)
  })
})
