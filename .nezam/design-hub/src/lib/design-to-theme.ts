/**
 * Bridge NEZAM design profiles (onboarding / Design panel) → shadcn theme editor + preview.
 */
import type { DesignProfileId, DesignTokens } from '@/types/design'
import {
  THEME_PRESET_MAP,
  type ThemeTokens,
} from '@/components/theming/theme-presets'
import type { ThemePreviewOverride } from '@/store/hub.store'

/** Persisted theme editor state derived from a design profile. */
export interface ThemeEditorSnapshot {
  presetId: string
  light: ThemeTokens
  dark: ThemeTokens
  radius: number
  fontSans: string
  fontMono: string
  defaultMode: 'light' | 'dark'
  sourceDesignProfileId: DesignProfileId
  sourceDesignProfileName: string
}

const DESIGN_TO_THEME_PRESET: Partial<Record<DesignProfileId, string>> = {
  glass: 'glass',
  minimal: 'neutral',
  corporate: 'blue',
  vibrant: 'violet',
  neon: 'cyberpunk',
  ocean: 'blue',
  nordic: 'iceland',
  sand: 'amber',
  midnight: 'slate',
  'warm-earth': 'orange',
  aurora: 'violet',
  'dark-studio': 'slate',
  vercel: 'mono',
  linear: 'slate',
  spotify: 'green',
  github: 'slate',
  stripe: 'violet',
  apple: 'neutral',
  google: 'blue',
  notion: 'neutral',
  netflix: 'rose',
  airbnb: 'rose',
}

function parseRadiusRem(radiusMd: string): number {
  const px = parseFloat(radiusMd)
  if (Number.isFinite(px) && px > 0) return Math.round((px / 16) * 100) / 100
  return 0.5
}

/** Map design tokens to shadcn-style theme tokens for one color mode. */
export function designTokensToShadcnThemeTokens(
  tokens: DesignTokens,
  mode: 'light' | 'dark',
): ThemeTokens {
  const c = tokens.colors
  const surface = mode === 'light' ? c.surface : c.darkSurface
  const text = mode === 'light' ? c.text : c.darkText
  const { brand, accent, neutral, semantic } = c

  const primaryFg =
    mode === 'light'
      ? '#fafafa'
      : neutral['50']

  return {
    background: surface.bg,
    foreground: text.primary,
    card: surface.panel,
    cardForeground: text.primary,
    popover: surface.panel,
    popoverForeground: text.primary,
    primary: brand['600'],
    primaryForeground: primaryFg,
    secondary: neutral['100'],
    secondaryForeground: text.primary,
    muted: neutral['100'],
    mutedForeground: text.muted,
    accent: accent['500'],
    accentForeground: text.primary,
    destructive: semantic.error,
    destructiveForeground: mode === 'light' ? '#fafafa' : c.errorScale['950'],
    border: surface.border,
    input: surface.border,
    ring: brand['500'],
    chart1: brand['500'],
    chart2: accent['500'],
    chart3: semantic.success,
    chart4: semantic.warning,
    chart5: semantic.info,
  }
}

export function resolveThemePresetIdForDesignProfile(profileId: DesignProfileId): string {
  const mapped = DESIGN_TO_THEME_PRESET[profileId]
  if (mapped && THEME_PRESET_MAP[mapped]) return mapped
  if (THEME_PRESET_MAP[profileId]) return profileId
  return 'custom'
}

export function buildThemeEditorSnapshot(
  tokens: DesignTokens,
  profileId: DesignProfileId,
  profileName: string,
): ThemeEditorSnapshot {
  const presetId = resolveThemePresetIdForDesignProfile(profileId)
  const defaultMode = tokens.colors.mode === 'dark' ? 'dark' : 'light'

  return {
    presetId,
    light: designTokensToShadcnThemeTokens(tokens, 'light'),
    dark: designTokensToShadcnThemeTokens(tokens, 'dark'),
    radius: parseRadiusRem(tokens.radius.md),
    fontSans: tokens.typography.sans,
    fontMono: tokens.typography.mono,
    defaultMode,
    sourceDesignProfileId: profileId,
    sourceDesignProfileName: profileName,
  }
}

function buildVars(
  t: ThemeTokens,
  fontSans: string,
  fontMono: string,
  radiusRem: number,
): Record<string, string> {
  return {
    background: t.background,
    foreground: t.foreground,
    card: t.card,
    'card-foreground': t.cardForeground,
    popover: t.popover,
    'popover-foreground': t.popoverForeground,
    primary: t.primary,
    'primary-foreground': t.primaryForeground,
    secondary: t.secondary,
    'secondary-foreground': t.secondaryForeground,
    muted: t.muted,
    'muted-foreground': t.mutedForeground,
    accent: t.accent,
    'accent-foreground': t.accentForeground,
    destructive: t.destructive,
    border: t.border,
    input: t.input,
    ring: t.ring,
    radius: `${radiusRem}rem`,
    '--bg-surface': t.background,
    '--text': t.foreground,
    '--panel': t.card,
    '--border': t.border,
    '--brand': t.primary,
    '--accent': t.accent,
    '--text-secondary': t.mutedForeground,
    '--error': t.destructive,
    '--font-sans': fontSans,
    '--font-mono': fontMono,
  }
}

export function buildPreviewOverrideFromSnapshot(
  snapshot: ThemeEditorSnapshot,
  mode: 'light' | 'dark' = snapshot.defaultMode,
): ThemePreviewOverride {
  const light = snapshot.light
  const dark = snapshot.dark
  return {
    light: buildVars(light, snapshot.fontSans, snapshot.fontMono, snapshot.radius),
    dark: buildVars(dark, snapshot.fontSans, snapshot.fontMono, snapshot.radius),
    mode,
    fontSans: snapshot.fontSans,
    fontMono: snapshot.fontMono,
    radius: `${snapshot.radius}rem`,
    presetName: snapshot.sourceDesignProfileName,
  }
}
