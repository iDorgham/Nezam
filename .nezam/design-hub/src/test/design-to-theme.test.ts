import { describe, expect, it } from 'vitest'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import {
  buildPreviewOverrideFromSnapshot,
  buildThemeEditorSnapshot,
  designTokensToShadcnThemeTokens,
  resolveThemePresetIdForDesignProfile,
} from '@/lib/design-to-theme'

describe('design-to-theme', () => {
  it('maps minimal profile surfaces to shadcn tokens', () => {
    const tokens = DESIGN_PROFILES_MAP.minimal.tokens
    const light = designTokensToShadcnThemeTokens(tokens, 'light')
    expect(light.background).toBe(tokens.colors.surface.bg)
    expect(light.primary).toBe(tokens.colors.brand['600'])
    expect(light.foreground).toBe(tokens.colors.text.primary)
  })

  it('resolves known design profile to closest theme preset', () => {
    expect(resolveThemePresetIdForDesignProfile('glass')).toBe('glass')
    expect(resolveThemePresetIdForDesignProfile('minimal')).toBe('neutral')
    expect(resolveThemePresetIdForDesignProfile('vercel')).toBe('mono')
  })

  it('builds editor snapshot with profile metadata', () => {
    const profile = DESIGN_PROFILES_MAP.corporate
    const snapshot = buildThemeEditorSnapshot(profile.tokens, profile.id, profile.name)
    expect(snapshot.sourceDesignProfileId).toBe('corporate')
    expect(snapshot.sourceDesignProfileName).toBe('Corporate')
    expect(snapshot.presetId).toBe('blue')
    expect(snapshot.light.background).toBe(profile.tokens.colors.surface.bg)
  })

  it('preview override uses design profile name and brand color', () => {
    const profile = DESIGN_PROFILES_MAP.vibrant
    const snapshot = buildThemeEditorSnapshot(profile.tokens, profile.id, profile.name)
    const override = buildPreviewOverrideFromSnapshot(snapshot)
    expect(override.presetName).toBe('Vibrant')
    expect(override.light['--brand']).toBe(snapshot.light.primary)
    expect(override.mode).toBe(snapshot.defaultMode)
  })
})
