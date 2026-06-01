import type { ColorScale, DesignTokens } from '@/types/design'
import { hexToHsl, hslToHex } from '@/components/theming/color-utils'

export type VarApplicator = (tokens: DesignTokens, value: string) => void

/** Build a brand/accent scale from a single hex (HSL-based, matches hub store). */
export function generateScaleFromHex(hex: string): ColorScale {
  const hsl = hexToHsl(hex)
  if (!hsl) {
    return {
      '50': hex,
      '100': hex,
      '200': hex,
      '300': hex,
      '400': hex,
      '500': hex,
      '600': hex,
      '700': hex,
      '800': hex,
      '900': hex,
      '950': hex,
    }
  }

  const make = (l: number) =>
    hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(0, Math.min(1, l)) })

  return {
    '50': make(0.97),
    '100': make(0.92),
    '200': make(0.84),
    '300': make(0.74),
    '400': make(0.62),
    '500': hex,
    '600': make(hsl.l * 0.85),
    '700': make(hsl.l * 0.7),
    '800': make(hsl.l * 0.55),
    '900': make(hsl.l * 0.4),
    '950': make(hsl.l * 0.25),
  }
}

/** shadcn CSS var keys → design token applicators (theme editor bridge). */
export const THEME_VAR_MAP: Record<string, VarApplicator> = {
  background: (tokens, value) => {
    tokens.colors.surface.bg = value
  },
  foreground: (tokens, value) => {
    tokens.colors.text.primary = value
  },
  primary: (tokens, value) => {
    tokens.colors.brand = generateScaleFromHex(value)
  },
  accent: (tokens, value) => {
    tokens.colors.accent = generateScaleFromHex(value)
  },
  card: (tokens, value) => {
    tokens.colors.surface.panel = value
  },
  border: (tokens, value) => {
    tokens.colors.surface.border = value
  },
  muted: (tokens, value) => {
    tokens.colors.text.muted = value
  },
  'accent-foreground': (tokens, value) => {
    tokens.colors.text.secondary = value
  },
}

export function applyThemeVarsToTokens(
  tokens: DesignTokens,
  vars: Record<string, string>,
  mode: 'light' | 'dark',
) {
  tokens.colors.mode = mode
  Object.entries(vars).forEach(([key, value]) => {
    if (value) THEME_VAR_MAP[key]?.(tokens, value)
  })
}
