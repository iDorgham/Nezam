import type { DesignTokens } from '../types/tokens.types'

// Maps camelCase token keys to CSS custom property names
const TOKEN_VAR_MAP: Record<keyof DesignTokens, string> = {
  primary:           '--ds-primary',
  primaryHover:      '--ds-primary-hover',
  primarySubtle:     '--ds-primary-subtle',
  primaryForeground: '--ds-primary-foreground',
  secondary:         '--ds-secondary',
  accent:            '--ds-accent',
  alert:             '--ds-alert',
  alertHover:        '--ds-alert-hover',
  alertSubtle:       '--ds-alert-subtle',

  background:      '--ds-background',
  surface:         '--ds-surface',
  surfaceElevated: '--ds-surface-elevated',
  surfaceHover:    '--ds-surface-hover',
  surfaceSubtle:   '--ds-surface-subtle',
  overlay:         '--ds-overlay',

  textPrimary:   '--ds-text-primary',
  textSecondary: '--ds-text-secondary',
  textMuted:     '--ds-text-muted',
  textDisabled:  '--ds-text-disabled',
  textInverse:   '--ds-text-inverse',

  border:       '--ds-border',
  borderStrong: '--ds-border-strong',
  borderSubtle: '--ds-border-subtle',
  borderHover:  '--ds-border-hover',
  borderFocus:  '--ds-border-focus',
  borderMuted:  '--ds-border-muted',

  interactive: '--ds-interactive',
  destructive: '--ds-destructive',
  success:     '--ds-success',
  warning:     '--ds-warning',
  error:       '--ds-error',
  info:        '--ds-info',

  radiusNone: '--ds-radius-none',
  radiusSm:   '--ds-radius-sm',
  radiusMd:   '--ds-radius-md',
  radiusLg:   '--ds-radius-lg',
  radiusXl:   '--ds-radius-xl',
  radius2xl:  '--ds-radius-2xl',
  radiusFull: '--ds-radius-full',
}

// Injects a partial token set into :root CSS custom properties.
// Only processes keys present in TOKEN_VAR_MAP — unknown keys are silently ignored.
// Target: < 16ms for full set (requestAnimationFrame budget).
export function injectTokens(tokens: Partial<DesignTokens>): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  for (const [key, value] of Object.entries(tokens) as [keyof DesignTokens, string][]) {
    if (!value) continue
    const cssVar = TOKEN_VAR_MAP[key]
    if (cssVar) root.style.setProperty(cssVar, value)
  }
}

// Removes all injected overrides, restoring globals.css baseline values.
export function resetInjectedTokens(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  for (const cssVar of Object.values(TOKEN_VAR_MAP)) {
    root.style.removeProperty(cssVar)
  }
}
