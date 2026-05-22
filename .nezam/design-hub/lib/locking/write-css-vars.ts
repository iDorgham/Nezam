import fs from 'fs'
import path from 'path'
import type { DesignTokens } from '../store/tokens.store'
import { getProjectRoot } from '../paths'

const MARKER_START = '/* ===== NEZAM DESIGN TOKENS (auto-generated — do not edit) ===== */'
const MARKER_END = '/* ===== END NEZAM DESIGN TOKENS ===== */'

export function buildTokenCssBlock(tokens: DesignTokens): string {
  const c = tokens.colors
  const tp = tokens.typography
  const sp = tokens.spacing
  const r = tokens.radius
  const e = tokens.elevation
  const m = tokens.motion
  const z = tokens.zIndex

  const lines: string[] = []
  lines.push(MARKER_START)
  lines.push(':root, [data-theme="dark"] {')

  // Colors
  lines.push(`  --ds-primary: ${c.primary};`)
  lines.push(`  --ds-primary-hover: ${c.primaryHover};`)
  lines.push(`  --ds-secondary: ${c.secondary};`)
  lines.push(`  --ds-accent: ${c.accent};`)
  lines.push(`  --ds-interactive: ${c.interactive};`)
  lines.push(`  --ds-destructive: ${c.destructive};`)
  lines.push(`  --ds-success: ${c.success};`)
  lines.push(`  --ds-warning: ${c.warning};`)
  lines.push(`  --ds-info: ${c.info};`)
  lines.push(`  --ds-background: ${c.background};`)
  lines.push(`  --ds-surface: ${c.surface};`)
  lines.push(`  --ds-surface-elevated: ${c.surfaceElevated};`)
  lines.push(`  --ds-overlay: ${c.overlay};`)
  lines.push(`  --ds-text-primary: ${c.textPrimary};`)
  lines.push(`  --ds-text-secondary: ${c.textSecondary};`)
  lines.push(`  --ds-text-muted: ${c.textMuted};`)
  lines.push(`  --ds-text-disabled: ${c.textDisabled};`)
  lines.push(`  --ds-text-inverse: ${c.textInverse};`)
  lines.push(`  --ds-border: ${c.border};`)
  lines.push(`  --ds-border-strong: ${c.borderStrong};`)
  lines.push(`  --ds-border-focus: ${c.borderFocus};`)

  // Typography
  lines.push(`  --ds-font-heading: ${tp.fontHeading};`)
  lines.push(`  --ds-font-body: ${tp.fontBody};`)
  lines.push(`  --ds-font-mono: ${tp.fontMono};`)
  lines.push(`  --ds-text-xs: ${tp.sizeXs};`)
  lines.push(`  --ds-text-sm: ${tp.sizeSm};`)
  lines.push(`  --ds-text-base: ${tp.sizeMd};`)
  lines.push(`  --ds-text-lg: ${tp.sizeLg};`)
  lines.push(`  --ds-text-xl: ${tp.sizeXl};`)
  lines.push(`  --ds-text-2xl: ${tp.size2xl};`)
  lines.push(`  --ds-text-3xl: ${tp.size3xl};`)
  lines.push(`  --ds-text-4xl: ${tp.size4xl};`)

  // Spacing
  lines.push(`  --ds-spacing-xs: ${sp.xs};`)
  lines.push(`  --ds-spacing-sm: ${sp.sm};`)
  lines.push(`  --ds-spacing-md: ${sp.md};`)
  lines.push(`  --ds-spacing-lg: ${sp.lg};`)
  lines.push(`  --ds-spacing-xl: ${sp.xl};`)
  lines.push(`  --ds-spacing-2xl: ${sp['2xl']};`)
  lines.push(`  --ds-spacing-3xl: ${sp['3xl']};`)
  lines.push(`  --ds-spacing-4xl: ${sp['4xl']};`)

  // Radius
  lines.push(`  --ds-radius-none: ${r.none};`)
  lines.push(`  --ds-radius-sm: ${r.sm};`)
  lines.push(`  --ds-radius-md: ${r.md};`)
  lines.push(`  --ds-radius-lg: ${r.lg};`)
  lines.push(`  --ds-radius-xl: ${r.xl};`)
  lines.push(`  --ds-radius-full: ${r.full};`)

  // Elevation
  lines.push(`  --ds-elevation-none: ${e.none};`)
  lines.push(`  --ds-elevation-sm: ${e.sm};`)
  lines.push(`  --ds-elevation-md: ${e.md};`)
  lines.push(`  --ds-elevation-lg: ${e.lg};`)
  lines.push(`  --ds-elevation-xl: ${e.xl};`)

  // Motion
  lines.push(`  --ds-duration-fast: ${m.durationFast};`)
  lines.push(`  --ds-duration-normal: ${m.durationNormal};`)
  lines.push(`  --ds-duration-slow: ${m.durationSlow};`)
  lines.push(`  --ds-easing-default: ${m.easingDefault};`)
  lines.push(`  --ds-easing-spring: ${m.easingSpring};`)

  // Z-Index
  lines.push(`  --ds-z-base: ${z.base};`)
  lines.push(`  --ds-z-dropdown: ${z.dropdown};`)
  lines.push(`  --ds-z-sticky: ${z.sticky};`)
  lines.push(`  --ds-z-overlay: ${z.overlay};`)
  lines.push(`  --ds-z-modal: ${z.modal};`)
  lines.push(`  --ds-z-toast: ${z.toast};`)

  lines.push('}')
  lines.push(MARKER_END)
  return lines.join('\n')
}

/**
 * Locates the main app's globals.css. Returns the first existing path or
 * `null` if none of the common locations exist.
 */
function findMainAppGlobalsCss(): string | null {
  const root = getProjectRoot()
  const candidates = [
    path.join(root, 'src/app/globals.css'),
    path.join(root, 'app/globals.css'),
    path.join(root, 'src/styles/globals.css'),
    path.join(root, 'styles/globals.css'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return null
}

export type InjectionResult =
  | { status: 'injected'; path: string }
  | { status: 'no-target' }
  | { status: 'error'; message: string }

/**
 * Writes (or replaces) the token block inside the main app's globals.css.
 * Idempotent — running it twice produces the same file.
 */
export function injectTokensIntoMainAppGlobals(tokens: DesignTokens): InjectionResult {
  try {
    const target = findMainAppGlobalsCss()
    if (!target) return { status: 'no-target' }

    const block = buildTokenCssBlock(tokens)
    const current = fs.readFileSync(target, 'utf8')

    const startIdx = current.indexOf(MARKER_START)
    const endIdx = current.indexOf(MARKER_END)
    let next: string
    if (startIdx !== -1 && endIdx !== -1) {
      next = current.slice(0, startIdx) + block + current.slice(endIdx + MARKER_END.length)
    } else {
      next = current.trimEnd() + '\n\n' + block + '\n'
    }
    fs.writeFileSync(target, next, 'utf8')
    return { status: 'injected', path: target }
  } catch (err: any) {
    return { status: 'error', message: err?.message ?? String(err) }
  }
}
