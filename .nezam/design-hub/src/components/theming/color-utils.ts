/**
 * Tiny color helpers for the theme generator's "wild knobs" — hue shift,
 * saturation scale, lightness scale, randomize. Keeps the editor pure and
 * deterministic — no runtime CSS parsing, no third-party dep.
 */

export interface HSL {
  h: number   // 0..360
  s: number   // 0..1
  l: number   // 0..1
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i)
  if (!m) return null
  const n = parseInt(m[1], 16)
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break
      case gn: h = (bn - rn) / d + 2; break
      case bn: h = (rn - gn) / d + 4; break
    }
    h *= 60
  }
  return { h, s, l }
}

export function hslToRgb({ h, s, l }: HSL): { r: number; g: number; b: number } {
  const hk = ((h % 360) + 360) % 360 / 360
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return {
    r: hue2rgb(hk + 1 / 3) * 255,
    g: hue2rgb(hk) * 255,
    b: hue2rgb(hk - 1 / 3) * 255,
  }
}

export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex)
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null
}

export function hslToHex(hsl: HSL): string {
  const { r, g, b } = hslToRgb(hsl)
  return rgbToHex(r, g, b)
}

export interface ColorTransform {
  hueShift:   number   // degrees, -180..180
  satScale:   number   // 0..2
  lightScale: number   // 0..2
}

export const IDENTITY_TRANSFORM: ColorTransform = {
  hueShift:   0,
  satScale:   1,
  lightScale: 1,
}

/** Apply a transform to a single hex color. Returns the original on parse failure. */
export function transformColor(hex: string, t: ColorTransform): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return hex
  return hslToHex({
    h: hsl.h + t.hueShift,
    s: Math.max(0, Math.min(1, hsl.s * t.satScale)),
    l: Math.max(0, Math.min(1, hsl.l * t.lightScale)),
  })
}

/** Whether transform is identity (no-op). */
export function isIdentityTransform(t: ColorTransform): boolean {
  return t.hueShift === 0 && t.satScale === 1 && t.lightScale === 1
}

/** Pick a random vibrant hue, return as hex. */
export function randomVibrantHex(): string {
  return hslToHex({
    h: Math.random() * 360,
    s: 0.55 + Math.random() * 0.4,
    l: 0.45 + Math.random() * 0.15,
  })
}

/** Pick a random soft hue at a given lightness. */
export function randomSoftHex(lightness = 0.92): string {
  return hslToHex({
    h: Math.random() * 360,
    s: 0.25 + Math.random() * 0.35,
    l: lightness,
  })
}

// ─── Color harmony (color theory) ────────────────────────────────────────────

export type HarmonyType =
  | 'complementary'
  | 'triadic'
  | 'analogous'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic'

function harmonyHueOffsets(type: HarmonyType): number[] {
  switch (type) {
    case 'complementary':       return [0, 180]
    case 'triadic':             return [0, 120, 240]
    case 'analogous':           return [0, 30, 60]
    case 'split-complementary': return [0, 150, 210]
    case 'tetradic':            return [0, 90, 180, 270]
    case 'monochromatic':       return [0]
  }
}

export interface HarmoniousPalette {
  primary:     string
  secondary:   string
  accent:      string
  highlight:   string
  charts:      [string, string, string, string, string]
  harmonyType: HarmonyType
}

/**
 * Generate a visually harmonious multi-color palette using color theory.
 * Picks a random harmony type and base hue each call.
 */
export function generateHarmoniousPalette(): HarmoniousPalette {
  const TYPES: HarmonyType[] = [
    'complementary', 'triadic', 'analogous', 'split-complementary', 'tetradic',
  ]
  const type     = TYPES[Math.floor(Math.random() * TYPES.length)]
  const baseHue  = Math.random() * 360
  const baseSat  = 0.60 + Math.random() * 0.25
  const baseLit  = 0.45 + Math.random() * 0.12

  const offsets  = harmonyHueOffsets(type)
  const hues: number[] = offsets.map((o) => ((baseHue + o) % 360 + 360) % 360)

  // Pad to 4 distinct hues
  while (hues.length < 4) hues.push(((hues[hues.length - 1] + 60) % 360 + 360) % 360)

  const make = (h: number, s: number, l: number) =>
    hslToHex({ h: ((h % 360) + 360) % 360, s: Math.max(0, Math.min(1, s)), l: Math.max(0, Math.min(1, l)) })

  return {
    primary:   make(hues[0], baseSat,        baseLit),
    secondary: make(hues[1], baseSat * 0.45, baseLit + 0.35),
    accent:    make(hues[2], baseSat * 0.80, baseLit + 0.05),
    highlight: make(hues[3], baseSat * 0.65, baseLit + 0.10),
    charts: [
      make(hues[0],               baseSat,        baseLit),
      make(hues[1 % hues.length], baseSat * 0.85, baseLit + 0.08),
      make(hues[2 % hues.length], baseSat * 0.70, baseLit + 0.12),
      make((baseHue + 45) % 360,  baseSat * 0.60, baseLit + 0.16),
      make((baseHue + 90) % 360,  baseSat * 0.50, baseLit + 0.20),
    ],
    harmonyType: type,
  }
}

/** Check lightness to choose high-contrast text foreground. */
export function getContrastForeground(hex: string): string {
  const hsl = hexToHsl(hex)
  if (!hsl) return '#fbfdff'
  // Return very dark charcoal for light colors, pure white for dark colors
  return hsl.l > 0.55 ? '#09090b' : '#fbfdff'
}

/**
 * Generates a fully cohesive set of shadcn UI ThemeTokens (or generic representation)
 * using a single base hue with harmonious tints and mathematically correct lightness levels.
 */
export function generateTintedTheme(baseHue: number, baseSat: number, mode: 'light' | 'dark'): any {
  const isDark = mode === 'dark'
  
  const make = (h: number, s: number, l: number) =>
    hslToHex({ h: ((h % 360) + 360) % 360, s: Math.max(0, Math.min(1, s)), l: Math.max(0, Math.min(1, l)) })
    
  // Harmony offset angles for supplementary colors
  const accentHue = (baseHue + 180) % 360
  const secondaryHue = (baseHue + 30) % 360
  
  // Base brand colors
  const primary = make(baseHue, baseSat, isDark ? 0.60 : 0.45)
  const primaryForeground = getContrastForeground(primary)
  
  const accent = make(accentHue, baseSat * 0.4, isDark ? 0.22 : 0.93)
  const accentForeground = getContrastForeground(accent)
  
  const destructive = make(0, 0.85, isDark ? 0.35 : 0.50)
  const destructiveForeground = '#fbfdff'
  
  if (isDark) {
    const bg = make(baseHue, baseSat * 0.12, 0.04)        // Very deep black/charcoal with subtle tint
    const card = make(baseHue, baseSat * 0.12, 0.07)      // Slightly lighter card background
    const border = make(baseHue, baseSat * 0.15, 0.13)    // Muted border
    
    return {
      background:            bg,
      foreground:            make(baseHue, baseSat * 0.05, 0.96),
      card:                  card,
      cardForeground:        make(baseHue, baseSat * 0.05, 0.96),
      popover:               card,
      popoverForeground:     make(baseHue, baseSat * 0.05, 0.96),
      primary:               primary,
      primaryForeground:     primaryForeground,
      secondary:             make(baseHue, baseSat * 0.10, 0.12),
      secondaryForeground:   make(baseHue, baseSat * 0.05, 0.96),
      muted:                 make(baseHue, baseSat * 0.10, 0.11),
      mutedForeground:       make(baseHue, baseSat * 0.10, 0.60),
      accent:                accent,
      accentForeground:      accentForeground,
      destructive:           destructive,
      destructiveForeground: destructiveForeground,
      border:                border,
      input:                 make(baseHue, baseSat * 0.15, 0.11),
      ring:                  primary,
      chart1:                primary,
      chart2:                make(secondaryHue, baseSat, 0.6),
      chart3:                make(accentHue, baseSat, 0.6),
      chart4:                make((baseHue + 90) % 360, baseSat, 0.6),
      chart5:                make((baseHue + 270) % 360, baseSat, 0.6),
    }
  } else {
    const bg = make(baseHue, baseSat * 0.08, 0.985)        // Ultra soft white with subtle tint
    const card = '#fbfdff'                                // Crisp white cards
    const border = make(baseHue, baseSat * 0.15, 0.91)    // Soft border
    
    return {
      background:            bg,
      foreground:            make(baseHue, baseSat * 0.20, 0.06),
      card:                  card,
      cardForeground:        make(baseHue, baseSat * 0.20, 0.06),
      popover:               card,
      popoverForeground:     make(baseHue, baseSat * 0.20, 0.06),
      primary:               primary,
      primaryForeground:     primaryForeground,
      secondary:             make(baseHue, baseSat * 0.10, 0.94),
      secondaryForeground:   make(baseHue, baseSat * 0.20, 0.06),
      muted:                 make(baseHue, baseSat * 0.08, 0.95),
      mutedForeground:       make(baseHue, baseSat * 0.15, 0.40),
      accent:                accent,
      accentForeground:      accentForeground,
      destructive:           destructive,
      destructiveForeground: destructiveForeground,
      border:                border,
      input:                 make(baseHue, baseSat * 0.15, 0.94),
      ring:                  primary,
      chart1:                primary,
      chart2:                make(secondaryHue, baseSat, 0.5),
      chart3:                make(accentHue, baseSat, 0.5),
      chart4:                make((baseHue + 90) % 360, baseSat, 0.5),
      chart5:                make((baseHue + 270) % 360, baseSat, 0.5),
    }
  }
}

/** Generates a theme using a specific color harmony type! */
export function generateSpecificHarmonyTheme(type: HarmonyType, mode: 'light' | 'dark'): any {
  const baseHue = Math.random() * 360
  const baseSat = 0.60 + Math.random() * 0.20 // 60% - 80%
  const baseLit = mode === 'dark' ? 0.60 : 0.45
  
  const offsets = harmonyHueOffsets(type)
  const hues: number[] = offsets.map((o) => ((baseHue + o) % 360 + 360) % 360)
  
  // Pad to 4 distinct hues
  while (hues.length < 4) hues.push(((hues[hues.length - 1] + 60) % 360 + 360) % 360)
  
  const make = (h: number, s: number, l: number) =>
    hslToHex({ h: ((h % 360) + 360) % 360, s: Math.max(0, Math.min(1, s)), l: Math.max(0, Math.min(1, l)) })
    
  const primary = make(hues[0], baseSat, baseLit)
  const primaryForeground = getContrastForeground(primary)
  
  const secondary = make(hues[1 % hues.length], baseSat * 0.4, mode === 'dark' ? 0.125 : 0.945)
  const secondaryForeground = getContrastForeground(secondary)
  
  const accent = make(hues[2 % hues.length], baseSat * 0.6, mode === 'dark' ? 0.22 : 0.93)
  const accentForeground = getContrastForeground(accent)
  
  const destructive = make(0, 0.85, mode === 'dark' ? 0.35 : 0.50)
  const destructiveForeground = '#fbfdff'
  
  if (mode === 'dark') {
    const bg = make(baseHue, baseSat * 0.12, 0.04)
    const card = make(baseHue, baseSat * 0.12, 0.07)
    const border = make(baseHue, baseSat * 0.15, 0.13)
    
    return {
      background:            bg,
      foreground:            make(baseHue, baseSat * 0.05, 0.96),
      card:                  card,
      cardForeground:        make(baseHue, baseSat * 0.05, 0.96),
      popover:               card,
      popoverForeground:     make(baseHue, baseSat * 0.05, 0.96),
      primary:               primary,
      primaryForeground:     primaryForeground,
      secondary:             secondary,
      secondaryForeground:   secondaryForeground,
      muted:                 make(baseHue, baseSat * 0.10, 0.11),
      mutedForeground:       make(baseHue, baseSat * 0.10, 0.60),
      accent:                accent,
      accentForeground:      accentForeground,
      destructive:           destructive,
      destructiveForeground: destructiveForeground,
      border:                border,
      input:                 make(baseHue, baseSat * 0.15, 0.11),
      ring:                  primary,
      chart1:                primary,
      chart2:                make(hues[1 % hues.length], baseSat, 0.6),
      chart3:                make(hues[2 % hues.length], baseSat, 0.6),
      chart4:                make((baseHue + 90) % 360, baseSat, 0.6),
      chart5:                make((baseHue + 270) % 360, baseSat, 0.6),
    }
  } else {
    const bg = make(baseHue, baseSat * 0.08, 0.985)
    const card = '#fbfdff'
    const border = make(baseHue, baseSat * 0.15, 0.91)
    
    return {
      background:            bg,
      foreground:            make(baseHue, baseSat * 0.20, 0.06),
      card:                  card,
      cardForeground:        make(baseHue, baseSat * 0.20, 0.06),
      popover:               card,
      popoverForeground:     make(baseHue, baseSat * 0.20, 0.06),
      primary:               primary,
      primaryForeground:     primaryForeground,
      secondary:             secondary,
      secondaryForeground:   secondaryForeground,
      muted:                 make(baseHue, baseSat * 0.08, 0.95),
      mutedForeground:       make(baseHue, baseSat * 0.15, 0.40),
      accent:                accent,
      accentForeground:      accentForeground,
      destructive:           destructive,
      destructiveForeground: destructiveForeground,
      border:                border,
      input:                 make(baseHue, baseSat * 0.15, 0.94),
      ring:                  primary,
      chart1:                primary,
      chart2:                make(hues[1 % hues.length], baseSat, 0.5),
      chart3:                make(hues[2 % hues.length], baseSat, 0.5),
      chart4:                make((baseHue + 90) % 360, baseSat, 0.5),
      chart5:                make((baseHue + 270) % 360, baseSat, 0.5),
    }
  }
}
