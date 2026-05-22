import type {
  ColorTokens,
  Density,
  Profile,
  ResolvedTokens,
  ShadowStyle,
  ThemeMode,
} from '@/types'

/** Merge a profile + theme + overrides into a single resolved token set. */
export function resolveTokens(
  profile: Profile,
  theme: ThemeMode,
  overrides: Partial<ResolvedTokens> = {},
): ResolvedTokens {
  const colors = theme === 'dark' ? profile.dark : profile.light
  return {
    ...colors,
    radius: profile.radius,
    density: profile.density,
    shadow: profile.shadow,
    fontSans: profile.fontSans,
    fontDisplay: profile.fontDisplay,
    ...overrides,
  }
}

const DENSITY_UNIT: Record<Density, number> = {
  compact: 3,
  cozy: 4,
  spacious: 6,
}

const SHADOW_VALUE: Record<ShadowStyle, string> = {
  none: 'none',
  soft: '0 1px 2px rgba(15,18,30,0.06), 0 8px 24px -8px rgba(15,18,30,0.18)',
  crisp: '0 2px 4px rgba(15,18,30,0.10), 0 12px 28px -10px rgba(15,18,30,0.30)',
  dramatic: '0 4px 8px rgba(15,18,30,0.16), 0 28px 56px -16px rgba(15,18,30,0.55)',
}

/**
 * Produce the `--n-*` CSS custom properties for a resolved token set.
 * Apply the returned object as inline `style` on any `.n-scope` element so
 * the design world stays scoped — never leaking onto the app chrome.
 */
export function tokensToCssVars(t: ResolvedTokens): Record<string, string> {
  const unit = DENSITY_UNIT[t.density]
  const r = t.radius
  return {
    '--n-brand': t.brand,
    '--n-brand-hover': t.brandHover,
    '--n-brand-subtle': t.brandSubtle,
    '--n-on-brand': t.onBrand,
    '--n-accent': t.accent,
    '--n-bg': t.bg,
    '--n-surface': t.surface,
    '--n-elevated': t.elevated,
    '--n-text': t.text,
    '--n-text-muted': t.textMuted,
    '--n-text-subtle': t.textSubtle,
    '--n-border': t.border,
    '--n-border-strong': t.borderStrong,
    '--n-success': t.success,
    '--n-warning': t.warning,
    '--n-danger': t.danger,
    '--n-info': t.info,
    // shape
    '--n-radius-sm': `${Math.max(0, r - 4)}px`,
    '--n-radius': `${r}px`,
    '--n-radius-lg': `${r + 6}px`,
    '--n-radius-xl': `${r + 14}px`,
    '--n-radius-pill': '999px',
    // density-driven spacing scale
    '--n-space-1': `${unit}px`,
    '--n-space-2': `${unit * 2}px`,
    '--n-space-3': `${unit * 3}px`,
    '--n-space-4': `${unit * 4}px`,
    '--n-space-6': `${unit * 6}px`,
    '--n-space-8': `${unit * 8}px`,
    // elevation
    '--n-shadow': SHADOW_VALUE[t.shadow],
    // type
    '--n-font-sans': t.fontSans,
    '--n-font-display': t.fontDisplay,
  }
}

/* ── Color math (used by the AI co-pilot + contrast checks) ──── */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const int = parseInt(full, 16)
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return [h * 360, s * 100, l * 100]
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255)
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Pick black or white text for best contrast on a background. */
export function readableOn(bg: string): string {
  return contrastRatio(bg, '#ffffff') >= contrastRatio(bg, '#0b0b0f')
    ? '#ffffff'
    : '#0b0b0f'
}

/** Lighten/darken a hex by a lightness delta. */
export function shift(hex: string, dl: number): string {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex))
  return hslToHex(h, s, l + dl)
}

/** Mix a color toward another by `amount` (0–1). */
export function mix(a: string, b: string, amount: number): string {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  return rgbToHex(
    ar + (br - ar) * amount,
    ag + (bg - ag) * amount,
    ab + (bb - ab) * amount,
  )
}
