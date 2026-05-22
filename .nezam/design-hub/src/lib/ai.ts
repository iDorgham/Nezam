import type { ColorTokens, Density, Profile, ShadowStyle } from '@/types'
import { hslToHex, mix, readableOn } from './tokens'

/**
 * Local, deterministic-feeling design generation. Powers "✦ Surprise Me" and
 * the offline fallback for "Generate Full System" — no network required.
 */

const ADJECTIVES = [
  'Lumen', 'Aurora', 'Cobalt', 'Verdant', 'Ember', 'Quartz', 'Tidal',
  'Saffron', 'Obsidian', 'Marigold', 'Cascade', 'Halcyon', 'Nimbus', 'Indigo',
]
const NOUNS = ['Studio', 'System', 'Atlas', 'Field', 'Frame', 'Bloom', 'Drift', 'Forge']

const FONT_PAIRS: Array<{ sans: string; display: string }> = [
  { sans: "'Geist', 'Inter', system-ui, sans-serif", display: "'Sora', 'Inter', sans-serif" },
  { sans: "'Manrope', 'Inter', system-ui, sans-serif", display: "'Manrope', sans-serif" },
  { sans: "'Inter', system-ui, sans-serif", display: "'Sora', sans-serif" },
  { sans: "'IBM Plex Sans', system-ui, sans-serif", display: "'IBM Plex Sans', sans-serif" },
  { sans: "'Cairo', 'IBM Plex Sans Arabic', sans-serif", display: "'Cairo', sans-serif" },
]

const RADII = [4, 6, 8, 10, 12, 14, 18]
const DENSITIES: Density[] = ['compact', 'cozy', 'spacious']
const SHADOWS: ShadowStyle[] = ['soft', 'crisp', 'dramatic']

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

/** A tiny seedable PRNG so a given seed reproduces the same system. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}

function buildColors(
  mode: 'light' | 'dark',
  hue: number,
  accentHue: number,
  sat: number,
): ColorTokens {
  if (mode === 'light') {
    const brand = hslToHex(hue, sat, 47)
    return {
      brand,
      brandHover: hslToHex(hue, sat, 39),
      brandSubtle: mix(brand, '#ffffff', 0.88),
      onBrand: readableOn(brand),
      accent: hslToHex(accentHue, Math.min(92, sat + 6), 50),
      bg: hslToHex(hue, 16, 99),
      surface: hslToHex(hue, 16, 97),
      elevated: '#ffffff',
      text: hslToHex(hue, 28, 12),
      textMuted: hslToHex(hue, 12, 42),
      textSubtle: hslToHex(hue, 10, 64),
      border: hslToHex(hue, 18, 91),
      borderStrong: hslToHex(hue, 16, 83),
      success: '#16a34a',
      warning: '#d97706',
      danger: '#dc2626',
      info: hslToHex(accentHue, 70, 46),
    }
  }
  const brand = hslToHex(hue, Math.min(90, sat + 4), 66)
  const bg = hslToHex(hue, 26, 6)
  return {
    brand,
    brandHover: hslToHex(hue, Math.min(92, sat + 6), 74),
    brandSubtle: mix(brand, bg, 0.8),
    onBrand: readableOn(brand),
    accent: hslToHex(accentHue, 78, 68),
    bg,
    surface: hslToHex(hue, 22, 10),
    elevated: hslToHex(hue, 20, 14),
    text: hslToHex(hue, 16, 95),
    textMuted: hslToHex(hue, 12, 64),
    textSubtle: hslToHex(hue, 10, 42),
    border: hslToHex(hue, 20, 18),
    borderStrong: hslToHex(hue, 18, 27),
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: hslToHex(accentHue, 74, 70),
  }
}

/** An explicit design brief — the minimal seed for a full profile. */
export interface DesignBrief {
  name: string
  arabicName?: string
  personality?: string
  hue: number
  accentHue: number
  saturation: number
  radius: number
  density: Density
  shadow: ShadowStyle
}

/** Compose a full light + dark profile from an explicit brief. */
export function composeProfile(brief: DesignBrief): Profile {
  const fonts = FONT_PAIRS[Math.abs(Math.round(brief.hue)) % FONT_PAIRS.length]
  const hue = ((brief.hue % 360) + 360) % 360
  const accentHue = ((brief.accentHue % 360) + 360) % 360
  const sat = Math.max(45, Math.min(92, brief.saturation))
  return {
    id: `gen-${Date.now().toString(36)}-${Math.floor(Math.random() * 1296).toString(36)}`,
    name: brief.name,
    arabicName: brief.arabicName ?? 'نظام مُولّد',
    personality: brief.personality ?? 'AI-composed — a fresh harmony.',
    tagline: 'Generated this moment',
    fontSans: fonts.sans,
    fontDisplay: fonts.display,
    radius: brief.radius,
    density: brief.density,
    shadow: brief.shadow,
    light: buildColors('light', hue, accentHue, sat),
    dark: buildColors('dark', hue, accentHue, sat),
  }
}

export interface GenerateOptions {
  seed?: number
  /** Bias the brand hue toward a family, e.g. from a prompt keyword. */
  hueHint?: number
}

/** Generate a complete, coherent design profile (light + dark). */
export function generateProfile(opts: GenerateOptions = {}): Profile {
  const seed = opts.seed ?? Math.floor(Math.random() * 1e9)
  const rng = makeRng(seed)
  const hue = opts.hueHint ?? Math.floor(rng() * 360)
  const harmonics = [hue + 180, hue + 150, hue + 210, hue + 40, hue - 40]
  return composeProfile({
    name: `${pick(ADJECTIVES, rng)} ${pick(NOUNS, rng)}`,
    hue,
    accentHue: pick(harmonics, rng),
    saturation: 62 + Math.floor(rng() * 22),
    radius: pick(RADII, rng),
    density: pick(DENSITIES, rng),
    shadow: pick(SHADOWS, rng),
  })
}

/** Map a free-text prompt to a hue hint so generation feels intentional. */
export function hueFromPrompt(prompt: string): number | undefined {
  const p = prompt.toLowerCase()
  const map: Array<[RegExp, number]> = [
    [/ocean|sea|water|blue|calm|trust/, 205],
    [/forest|green|nature|eco|growth/, 145],
    [/sunset|warm|coral|energy|bold/, 14],
    [/royal|purple|premium|luxury/, 270],
    [/gold|amber|sand|desert|arab/, 38],
    [/rose|pink|playful|soft/, 330],
    [/tech|cyan|electric|future/, 188],
  ]
  for (const [re, h] of map) if (re.test(p)) return h
  return undefined
}
