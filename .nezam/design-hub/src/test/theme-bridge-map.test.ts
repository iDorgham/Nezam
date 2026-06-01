import { describe, expect, it } from 'vitest'
import { DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import {
  applyThemeVarsToTokens,
  THEME_VAR_MAP,
} from '@/lib/theme-bridge-map'
import type { DesignTokens } from '@/types/design'

function cloneTokens(source: DesignTokens): DesignTokens {
  return structuredClone(source)
}

describe('theme-bridge-map', () => {
  it('THEME_VAR_MAP includes all planned shadcn keys', () => {
    const keys = [
      'background',
      'foreground',
      'primary',
      'accent',
      'card',
      'border',
      'muted',
      'accent-foreground',
    ]
    for (const key of keys) {
      expect(typeof THEME_VAR_MAP[key]).toBe('function')
    }
  })

  it('applyThemeVarsToTokens updates surface and brand from vars', () => {
    const tokens = cloneTokens(DESIGN_PROFILES_MAP.minimal.tokens)
    applyThemeVarsToTokens(
      tokens,
      {
        background: '#111111',
        foreground: '#eeeeee',
        primary: '#3366ff',
      },
      'dark',
    )
    expect(tokens.colors.mode).toBe('dark')
    expect(tokens.colors.surface.bg).toBe('#111111')
    expect(tokens.colors.text.primary).toBe('#eeeeee')
    expect(tokens.colors.brand['500']).toBe('#3366ff')
  })
})
