import { DesignTokens } from './store/tokens.store'

export function injectTokens(tokens: DesignTokens): void {
  if (typeof document === 'undefined') return // SSR check

  const root = document.documentElement

  // Colors
  root.style.setProperty('--ds-primary', tokens.colors.primary)
  root.style.setProperty('--ds-primary-hover', tokens.colors.primaryHover)
  root.style.setProperty('--ds-secondary', tokens.colors.secondary)
  root.style.setProperty('--ds-accent', tokens.colors.accent)
  root.style.setProperty('--ds-interactive', tokens.colors.interactive)
  root.style.setProperty('--ds-destructive', tokens.colors.destructive)
  root.style.setProperty('--ds-success', tokens.colors.success)
  root.style.setProperty('--ds-warning', tokens.colors.warning)
  root.style.setProperty('--ds-info', tokens.colors.info)
  
  root.style.setProperty('--ds-background', tokens.colors.background)
  root.style.setProperty('--ds-surface', tokens.colors.surface)
  root.style.setProperty('--ds-surface-elevated', tokens.colors.surfaceElevated)
  root.style.setProperty('--ds-overlay', tokens.colors.overlay)
  
  root.style.setProperty('--ds-text-primary', tokens.colors.textPrimary)
  root.style.setProperty('--ds-text-secondary', tokens.colors.textSecondary)
  root.style.setProperty('--ds-text-muted', tokens.colors.textMuted)
  root.style.setProperty('--ds-text-disabled', tokens.colors.textDisabled)
  root.style.setProperty('--ds-text-inverse', tokens.colors.textInverse)
  
  root.style.setProperty('--ds-border', tokens.colors.border)
  root.style.setProperty('--ds-border-strong', tokens.colors.borderStrong)
  root.style.setProperty('--ds-border-focus', tokens.colors.borderFocus)

  // Typography
  root.style.setProperty('--ds-font-heading', tokens.typography.fontHeading)
  root.style.setProperty('--ds-font-body', tokens.typography.fontBody)
  root.style.setProperty('--ds-font-mono', tokens.typography.fontMono)
  root.style.setProperty('--ds-base-size', `${tokens.typography.baseSize}px`)
  root.style.setProperty('--ds-scale', tokens.typography.scale.toString())
  
  root.style.setProperty('--ds-text-xs', tokens.typography.sizeXs)
  root.style.setProperty('--ds-text-sm', tokens.typography.sizeSm)
  root.style.setProperty('--ds-text-md', tokens.typography.sizeMd)
  root.style.setProperty('--ds-text-lg', tokens.typography.sizeLg)
  root.style.setProperty('--ds-text-xl', tokens.typography.sizeXl)
  root.style.setProperty('--ds-text-2xl', tokens.typography.size2xl)
  root.style.setProperty('--ds-text-3xl', tokens.typography.size3xl)
  root.style.setProperty('--ds-text-4xl', tokens.typography.size4xl)

  // Spacing
  root.style.setProperty('--ds-space-unit', `${tokens.spacing.baseUnit}px`)
  root.style.setProperty('--ds-spacing-xs', tokens.spacing.xs)
  root.style.setProperty('--ds-spacing-sm', tokens.spacing.sm)
  root.style.setProperty('--ds-spacing-md', tokens.spacing.md)
  root.style.setProperty('--ds-spacing-lg', tokens.spacing.lg)
  root.style.setProperty('--ds-spacing-xl', tokens.spacing.xl)
  root.style.setProperty('--ds-spacing-2xl', tokens.spacing['2xl'])
  root.style.setProperty('--ds-spacing-3xl', tokens.spacing['3xl'])
  root.style.setProperty('--ds-spacing-4xl', tokens.spacing['4xl'])

  // Radius
  root.style.setProperty('--ds-radius-none', tokens.radius.none)
  root.style.setProperty('--ds-radius-sm', tokens.radius.sm)
  root.style.setProperty('--ds-radius-md', tokens.radius.md)
  root.style.setProperty('--ds-radius-lg', tokens.radius.lg)
  root.style.setProperty('--ds-radius-xl', tokens.radius.xl)
  root.style.setProperty('--ds-radius-full', tokens.radius.full)

  // Elevation
  root.style.setProperty('--ds-elevation-none', tokens.elevation.none)
  root.style.setProperty('--ds-elevation-sm', tokens.elevation.sm)
  root.style.setProperty('--ds-elevation-md', tokens.elevation.md)
  root.style.setProperty('--ds-elevation-lg', tokens.elevation.lg)
  root.style.setProperty('--ds-elevation-xl', tokens.elevation.xl)

  // Motion
  root.style.setProperty('--ds-duration-fast', tokens.motion.durationFast)
  root.style.setProperty('--ds-duration-normal', tokens.motion.durationNormal)
  root.style.setProperty('--ds-duration-slow', tokens.motion.durationSlow)
  root.style.setProperty('--ds-easing-default', tokens.motion.easingDefault)
  root.style.setProperty('--ds-easing-spring', tokens.motion.easingSpring)

  // zIndex
  root.style.setProperty('--ds-z-base', tokens.zIndex.base.toString())
  root.style.setProperty('--ds-z-dropdown', tokens.zIndex.dropdown.toString())
  root.style.setProperty('--ds-z-sticky', tokens.zIndex.sticky.toString())
  root.style.setProperty('--ds-z-overlay', tokens.zIndex.overlay.toString())
  root.style.setProperty('--ds-z-modal', tokens.zIndex.modal.toString())
  root.style.setProperty('--ds-z-toast', tokens.zIndex.toast.toString())
}
