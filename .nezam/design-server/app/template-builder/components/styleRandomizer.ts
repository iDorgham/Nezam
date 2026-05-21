/**
 * NEZAM Style Randomizer Engine
 * Generates aesthetically coherent style combinations across 20 named archetypes.
 * Each style has a palette, typography, spacing density, button style, and border radius
 * that work together visually — no clashing combinations.
 */

import type { WebsiteType, ColorPalette, FontValue, ButtonStyle, InputVariant, RadiusScale } from './config'

export interface RandomStyle {
  name: string
  tagline: string
  palette: ColorPalette
  font: FontValue
  buttonStyle: ButtonStyle
  buttonWeight: string
  inputVariant: InputVariant
  radius: RadiusScale
  spacing: string
  heroStyle: string
  headerStyle: string
  footerStyle: string
  websiteType?: WebsiteType
}

// ── 20 Named Archetypes ───────────────────────────────────────────────────────
export const STYLE_ARCHETYPES: RandomStyle[] = [
  {
    name: 'Sahel Dusk',
    tagline: 'Warm Egyptian sunset palette with editorial typography',
    palette: 'orange', font: 'playfair', buttonStyle: 'solid', buttonWeight: 'bold',
    inputVariant: 'outlined', radius: 'sm', spacing: 'spacious',
    heroStyle: 'centered', headerStyle: 'classic', footerStyle: 'big',
  },
  {
    name: 'Nile Depths',
    tagline: 'Deep blue-violet tones with clean sans-serif clarity',
    palette: 'indigo', font: 'geist', buttonStyle: 'soft', buttonWeight: 'semibold',
    inputVariant: 'filled', radius: 'md', spacing: 'balanced',
    heroStyle: 'split', headerStyle: 'minimal', footerStyle: 'big',
  },
  {
    name: 'Cairo Brutalist',
    tagline: 'Zero-radius, high contrast, raw typographic power',
    palette: 'slate', font: 'mono', buttonStyle: 'outline', buttonWeight: 'black',
    inputVariant: 'underline', radius: 'none', spacing: 'compact',
    heroStyle: 'centered', headerStyle: 'classic', footerStyle: 'simple',
  },
  {
    name: 'Desert Bloom',
    tagline: 'Earthy rose tones with fluid organic shapes',
    palette: 'rose', font: 'lora', buttonStyle: 'soft', buttonWeight: 'semibold',
    inputVariant: 'soft', radius: 'lg', spacing: 'spacious',
    heroStyle: 'split', headerStyle: 'minimal', footerStyle: 'big',
  },
  {
    name: 'Electric Oasis',
    tagline: 'High-energy cyan energy in compact, kinetic layouts',
    palette: 'cyan', font: 'outfit', buttonStyle: 'solid', buttonWeight: 'black',
    inputVariant: 'outlined', radius: 'md', spacing: 'compact',
    heroStyle: 'video', headerStyle: 'mega', footerStyle: 'simple',
  },
  {
    name: 'Pyramid Gold',
    tagline: 'Rich amber and gold with classical editorial weight',
    palette: 'amber', font: 'plus', buttonStyle: 'solid', buttonWeight: 'bold',
    inputVariant: 'filled', radius: 'sm', spacing: 'balanced',
    heroStyle: 'centered', headerStyle: 'classic', footerStyle: 'big',
  },
  {
    name: 'Emerald Canopy',
    tagline: 'Lush emerald greens with generous breathing room',
    palette: 'emerald', font: 'dm', buttonStyle: 'outline', buttonWeight: 'semibold',
    inputVariant: 'outlined', radius: 'full', spacing: 'spacious',
    heroStyle: 'split', headerStyle: 'minimal', footerStyle: 'big',
  },
  {
    name: 'Clean Minimal',
    tagline: 'Pure white with sharp geometry and zero decoration',
    palette: 'white', font: 'inter', buttonStyle: 'solid', buttonWeight: 'semibold',
    inputVariant: 'outlined', radius: 'md', spacing: 'balanced',
    heroStyle: 'centered', headerStyle: 'minimal', footerStyle: 'simple',
  },
  {
    name: 'Dark Cosmos',
    tagline: 'Deep space violet with glowing accents and pill shapes',
    palette: 'violet', font: 'geist', buttonStyle: 'solid', buttonWeight: 'semibold',
    inputVariant: 'soft', radius: 'full', spacing: 'spacious',
    heroStyle: 'video', headerStyle: 'minimal', footerStyle: 'big',
  },
  {
    name: 'Fuchsia Beat',
    tagline: 'High-saturation fuchsia for bold creative identities',
    palette: 'fuchsia', font: 'outfit', buttonStyle: 'soft', buttonWeight: 'black',
    inputVariant: 'filled', radius: 'lg', spacing: 'compact',
    heroStyle: 'centered', headerStyle: 'mega', footerStyle: 'simple',
  },
  {
    name: 'Coastal Serenity',
    tagline: 'Teal and turquoise with open, airy layout density',
    palette: 'teal', font: 'dm', buttonStyle: 'outline', buttonWeight: 'medium',
    inputVariant: 'underline', radius: 'lg', spacing: 'spacious',
    heroStyle: 'split', headerStyle: 'classic', footerStyle: 'big',
  },
  {
    name: 'Greenhouse Fresh',
    tagline: 'Lime green energy with compact, data-forward layouts',
    palette: 'lime', font: 'space', buttonStyle: 'ghost', buttonWeight: 'bold',
    inputVariant: 'filled', radius: 'md', spacing: 'compact',
    heroStyle: 'split', headerStyle: 'sidebar', footerStyle: 'simple',
  },
  {
    name: 'Editorial Luxury',
    tagline: 'Serif elegance with spacious columns and soft tones',
    palette: 'amber', font: 'playfair', buttonStyle: 'outline', buttonWeight: 'normal',
    inputVariant: 'underline', radius: 'none', spacing: 'spacious',
    heroStyle: 'split', headerStyle: 'classic', footerStyle: 'big',
  },
  {
    name: 'Tokyo Grid',
    tagline: 'Monospace precision with brutalist geometric layouts',
    palette: 'cyan', font: 'mono', buttonStyle: 'outline', buttonWeight: 'black',
    inputVariant: 'underline', radius: 'none', spacing: 'compact',
    heroStyle: 'centered', headerStyle: 'sidebar', footerStyle: 'simple',
  },
  {
    name: 'Midnight SaaS',
    tagline: 'Slate dark with precise typography for B2B platforms',
    palette: 'indigo', font: 'inter', buttonStyle: 'solid', buttonWeight: 'semibold',
    inputVariant: 'filled', radius: 'md', spacing: 'balanced',
    heroStyle: 'split', headerStyle: 'mega', footerStyle: 'big',
  },
  {
    name: 'Lush Jungle',
    tagline: 'Rich emerald with serif headlines and bold organic CTA',
    palette: 'emerald', font: 'lora', buttonStyle: 'solid', buttonWeight: 'bold',
    inputVariant: 'soft', radius: 'lg', spacing: 'spacious',
    heroStyle: 'video', headerStyle: 'classic', footerStyle: 'big',
  },
  {
    name: 'Phoenix Rise',
    tagline: 'Orange fire with pill buttons and cinematic hero',
    palette: 'orange', font: 'plus', buttonStyle: 'solid', buttonWeight: 'black',
    inputVariant: 'outlined', radius: 'full', spacing: 'balanced',
    heroStyle: 'video', headerStyle: 'mega', footerStyle: 'simple',
  },
  {
    name: 'Soft Blossom',
    tagline: 'Pastel rose with gentle curves and humanist type',
    palette: 'rose', font: 'dm', buttonStyle: 'ghost', buttonWeight: 'medium',
    inputVariant: 'soft', radius: 'full', spacing: 'spacious',
    heroStyle: 'centered', headerStyle: 'minimal', footerStyle: 'simple',
  },
  {
    name: 'Cyber Neon',
    tagline: 'Fuchsia neon with zero-radius grids and glowing UI',
    palette: 'fuchsia', font: 'space', buttonStyle: 'outline', buttonWeight: 'black',
    inputVariant: 'underline', radius: 'none', spacing: 'compact',
    heroStyle: 'video', headerStyle: 'classic', footerStyle: 'simple',
  },
  {
    name: 'Neutral Pro',
    tagline: 'Professional slate with balanced typography and structure',
    palette: 'slate', font: 'inter', buttonStyle: 'soft', buttonWeight: 'semibold',
    inputVariant: 'outlined', radius: 'sm', spacing: 'balanced',
    heroStyle: 'split', headerStyle: 'minimal', footerStyle: 'big',
  },
]

// ── Website type affinities ───────────────────────────────────────────────────
// Maps website types to archetype indices that work best visually
const TYPE_AFFINITIES: Partial<Record<WebsiteType, number[]>> = {
  saas:        [1, 7, 14, 19],
  dashboard:   [1, 2, 14, 19],
  ai:          [8, 13, 14, 18],
  ecommerce:   [0, 5, 6, 7],
  restaurant:  [0, 5, 10, 12],
  agency:      [3, 9, 10, 16],
  portfolio:   [3, 7, 12, 17],
  photography: [8, 12, 15, 18],
  news:        [2, 12, 13, 19],
  startup:     [4, 9, 14, 16],
  marketing:   [0, 5, 9, 16],
  realestate:  [3, 6, 10, 12],
}

// ── Randomizer state — tracks last N used to avoid repeats ────────────────────
let _recentIndices: number[] = []
const MAX_RECENT = 4

function pickIndex(currentIndex: number, websiteType?: WebsiteType): number {
  const preferred = websiteType ? TYPE_AFFINITIES[websiteType] ?? [] : []
  const candidates = STYLE_ARCHETYPES.map((_, i) => i).filter(i => {
    if (i === currentIndex) return false
    if (_recentIndices.includes(i)) return false
    return true
  })

  // Prefer type-affinity matches if available
  const affineCandidates = candidates.filter(i => preferred.includes(i))
  const pool = affineCandidates.length > 0 ? affineCandidates : candidates
  const fallback = candidates.length === 0 ? STYLE_ARCHETYPES.map((_, i) => i).filter(i => i !== currentIndex) : pool

  const chosen = fallback[Math.floor(Math.random() * fallback.length)]
  _recentIndices = [..._recentIndices.slice(-(MAX_RECENT - 1)), chosen]
  return chosen
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Pick the next style, avoiding the current one and recent repeats */
export function nextStyle(currentStyleName: string, websiteType?: WebsiteType): RandomStyle {
  const currentIndex = STYLE_ARCHETYPES.findIndex(s => s.name === currentStyleName)
  const nextIndex = pickIndex(currentIndex, websiteType)
  return STYLE_ARCHETYPES[nextIndex]
}

/** Get a truly random style (ignoring affinity) */
export function randomStyle(): RandomStyle {
  const i = Math.floor(Math.random() * STYLE_ARCHETYPES.length)
  return STYLE_ARCHETYPES[i]
}

/** Find a style by name */
export function getStyle(name: string): RandomStyle | undefined {
  return STYLE_ARCHETYPES.find(s => s.name === name)
}

/** Get the default (first) style */
export const DEFAULT_STYLE = STYLE_ARCHETYPES[0]
