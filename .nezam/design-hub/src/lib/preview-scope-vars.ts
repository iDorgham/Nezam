import type { CSSProperties } from 'react'

import type { ThemePreviewOverride } from '@/store/hub.store'
import type { DesignTokens } from '@/types/design'

export type HubThemeMode = 'light' | 'dark'

/** Hub shell palette (globals.css :root / .light) — wireframe editor matches chrome theme. */
export function buildHubShellPreviewCssVars(hubTheme: HubThemeMode): CSSProperties {
  if (hubTheme === 'light') {
    return {
      '--app-bg': '#FAFBFC',
      '--app-surface': '#FFFFFF',
      '--app-elevated': '#F4F5F7',
      '--app-inset': '#EBECF0',
      '--app-deep': '#F4F5F7',
      '--app-border': '#DFE1E6',
      '--app-border-strong': '#C1C7D0',
      '--app-text': '#172B4D',
      '--app-muted': '#5E6C84',
      '--app-subtle': '#8993A4',
      '--app-accent': '#0052CC',
      '--app-accent-hover': '#0065FF',
      '--app-accent-active': '#0747A6',
      '--app-accent-subtle': 'rgba(0, 82, 204, 0.08)',
      '--app-on-accent': '#fbfdff',
      '--app-danger': '#DE350B',
      '--app-warning': '#FFAB00',
      '--app-success': '#00875A',
      '--bg-surface': '#FAFBFC',
      '--panel': '#FFFFFF',
      '--border': '#DFE1E6',
      '--text': '#172B4D',
      '--text-secondary': '#5E6C84',
      '--text-muted': '#8993A4',
    } as CSSProperties
  }

  return {
    '--app-bg': '#161619',
    '--app-surface': '#1E1F22',
    '--app-elevated': '#2A2C31',
    '--app-inset': '#101012',
    '--app-deep': '#0C0D0F',
    '--app-border': '#2E3035',
    '--app-border-strong': '#40444C',
    '--app-text': '#F4F5F7',
    '--app-muted': '#A5ADBA',
    '--app-subtle': '#7A869A',
    '--app-accent': '#0065FF',
    '--app-accent-hover': '#2684FF',
    '--app-accent-active': '#0747A6',
    '--app-accent-subtle': 'rgba(38, 128, 235, 0.16)',
    '--app-on-accent': '#fbfdff',
    '--app-danger': '#DE350B',
    '--app-warning': '#FFAB00',
    '--app-success': '#00875A',
    '--bg-surface': '#161619',
    '--panel': '#1E1F22',
    '--border': '#2E3035',
    '--text': '#F4F5F7',
    '--text-secondary': '#A5ADBA',
    '--text-muted': '#7A869A',
  } as CSSProperties
}

/** Map onboarding / design-profile tokens to preview CSS variables (compose + wireframe). */
export function buildDesignPreviewCssVars(
  tokens: DesignTokens,
  options?: { mode?: HubThemeMode },
): CSSProperties {
  const c = tokens.colors
  const mode = options?.mode ?? c.mode
  const useDefault = mode === c.mode
  const surface = useDefault ? c.surface : c.darkSurface
  const text = useDefault ? c.text : c.darkText
  const { brand, accent, neutral, semantic } = c

  return {
    '--brand': brand['500'],
    '--brand-hover': brand['400'],
    '--brand-subtle': brand['100'],
    '--brand-deep': brand['700'],
    '--bg-surface': surface.bg,
    '--panel': surface.panel,
    '--border': surface.border,
    '--text': text.primary,
    '--text-secondary': text.secondary,
    '--text-muted': text.muted,
    '--text-disabled': text.disabled,
    '--success': semantic.success,
    '--warning': semantic.warning,
    '--error': semantic.error,
    '--accent': accent['500'],
    '--radius-sm': tokens.radius.sm,
    '--radius-md': tokens.radius.md,
    '--radius-lg': tokens.radius.lg,
    '--radius-xl': tokens.radius.xl,
    '--radius-full': tokens.radius.full,
    '--shadow-sm': tokens.shadows.sm,
    '--shadow-md': tokens.shadows.md,
    '--shadow-lg': tokens.shadows.lg,
    '--font-sans': tokens.typography.sans,
    '--font-display': tokens.typography.display,
    '--font-mono': tokens.typography.mono,
    '--motion-duration': tokens.motion.duration.base,
    '--motion-easing': tokens.motion.easing.default,
    '--border-width': tokens.borders.width,
    '--border-style': tokens.borders.style,
    '--neutral-100': neutral['100'],
    '--neutral-200': neutral['200'],
    '--neutral-300': neutral['300'],
    '--spacing-base': `${tokens.spacing.base}px`,
    // WireframeBlocksPage uses Tailwind app-* utilities — scope them to the active design profile.
    '--app-bg': surface.bg,
    '--app-surface': surface.bg,
    '--app-elevated': surface.panel,
    '--app-inset': mode === 'dark' ? neutral['900'] : neutral['100'],
    '--app-deep': mode === 'dark' ? c.darkSurface.bg : surface.bg,
    '--app-border': surface.border,
    '--app-border-strong': mode === 'dark' ? neutral['700'] : neutral['300'],
    '--app-text': text.primary,
    '--app-muted': text.secondary,
    '--app-subtle': text.muted,
    '--app-accent': brand['500'],
    '--app-accent-hover': brand['400'],
    '--app-accent-active': brand['700'],
    '--app-accent-subtle': brand['100'],
    '--app-on-accent': '#ffffff',
    '--app-danger': semantic.error,
    '--app-warning': semantic.warning,
    '--app-success': semantic.success,
    '--app-font-sans': tokens.typography.sans,
    '--app-font-mono': tokens.typography.mono,
  } as CSSProperties
}

export function buildThemeOverridePreviewCssVars(
  override: NonNullable<ThemePreviewOverride>,
  mode?: HubThemeMode,
): CSSProperties {
  const v = override[mode ?? override.mode]
  if (!v) return {}

  const brand = v.primary ?? undefined
  const surface = v.background ?? undefined
  const panel = v.card ?? undefined
  const border = v.border ?? undefined
  const text = v.foreground ?? undefined
  const textMuted = v['muted-foreground'] ?? undefined

  return {
    '--bg-surface': surface,
    '--panel': panel,
    '--border': border,
    '--text': text,
    '--text-secondary': v['card-foreground'] ?? textMuted,
    '--text-muted': textMuted,
    '--brand': brand,
    '--brand-hover': brand,
    '--brand-subtle': v.secondary,
    '--brand-deep': brand,
    '--accent': v.accent,
    '--neutral-100': v.secondary,
    '--neutral-200': v.muted,
    '--error': v.destructive,
    '--radius-md': v.radius,
    '--radius-lg': v.radius,
    '--app-bg': surface,
    '--app-surface': surface,
    '--app-elevated': panel,
    '--app-inset': v.muted,
    '--app-border': border,
    '--app-text': text,
    '--app-muted': textMuted,
    '--app-subtle': textMuted,
    '--app-accent': brand,
    '--app-accent-hover': brand,
    '--app-accent-subtle': v.secondary,
    '--app-on-accent': '#ffffff',
    '--app-danger': v.destructive,
  } as CSSProperties
}

export function mergePreviewScopeVars(
  tokens: DesignTokens,
  override: ThemePreviewOverride | null,
  options?: {
    fillHeight?: boolean
    /** When true, block previews use hub shell colors for the given hubTheme (not profile light tokens). */
    matchHubChrome?: boolean
    hubTheme?: HubThemeMode
  },
): CSSProperties {
  const hubTheme = options?.hubTheme ?? tokens.colors.mode
  const effectiveMode = options?.matchHubChrome ? (options?.hubTheme ?? 'dark') : hubTheme

  return {
    ...buildDesignPreviewCssVars(tokens, { mode: effectiveMode }),
    ...(override ? buildThemeOverridePreviewCssVars(override, effectiveMode) : {}),
    ...(options?.matchHubChrome ? buildHubShellPreviewCssVars(options.hubTheme ?? 'dark') : {}),
    ...(options?.fillHeight !== false ? { minHeight: '100%' } : {}),
  }
}
