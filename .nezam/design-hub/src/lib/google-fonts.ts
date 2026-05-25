/**
 * NEZAM Design Hub — Google Fonts registry.
 *
 * Curated list of ~80 popular fonts covering Latin + Arabic scripts.
 * No API key required — each font is loaded on-demand by injecting a
 * <link> tag pointing to fonts.googleapis.com.
 */

export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'monospace'

export interface GoogleFont {
  name: string
  category: FontCategory
  /** CSS font-family value to store in the token. */
  cssValue: string
  /** Full Google Fonts CSS import URL (includes weight variants). */
  importUrl: string
  /** True if the font includes Arabic/RTL glyph coverage. */
  arabic?: boolean
}

const GF = 'https://fonts.googleapis.com/css2?family='
const W  = ':wght@300;400;500;600;700&display=swap'
const WD = ':wght@400;700;900&display=swap'

export const GOOGLE_FONTS: GoogleFont[] = [
  /* ── Sans-serif (Latin) ───────────────────────────────────── */
  { name: 'Inter',            category: 'sans-serif', cssValue: "'Inter', sans-serif",            importUrl: `${GF}Inter${W}` },
  { name: 'Roboto',           category: 'sans-serif', cssValue: "'Roboto', sans-serif",           importUrl: `${GF}Roboto${W}` },
  { name: 'Open Sans',        category: 'sans-serif', cssValue: "'Open Sans', sans-serif",        importUrl: `${GF}Open+Sans${W}` },
  { name: 'Lato',             category: 'sans-serif', cssValue: "'Lato', sans-serif",             importUrl: `${GF}Lato${W}` },
  { name: 'Poppins',          category: 'sans-serif', cssValue: "'Poppins', sans-serif",          importUrl: `${GF}Poppins${W}` },
  { name: 'Nunito',           category: 'sans-serif', cssValue: "'Nunito', sans-serif",           importUrl: `${GF}Nunito${W}` },
  { name: 'Raleway',          category: 'sans-serif', cssValue: "'Raleway', sans-serif",          importUrl: `${GF}Raleway${W}` },
  { name: 'Montserrat',       category: 'sans-serif', cssValue: "'Montserrat', sans-serif",       importUrl: `${GF}Montserrat${W}` },
  { name: 'Outfit',           category: 'sans-serif', cssValue: "'Outfit', sans-serif",           importUrl: `${GF}Outfit${W}` },
  { name: 'DM Sans',          category: 'sans-serif', cssValue: "'DM Sans', sans-serif",          importUrl: `${GF}DM+Sans${W}` },
  { name: 'Plus Jakarta Sans',category: 'sans-serif', cssValue: "'Plus Jakarta Sans', sans-serif",importUrl: `${GF}Plus+Jakarta+Sans${W}` },
  { name: 'Manrope',          category: 'sans-serif', cssValue: "'Manrope', sans-serif",          importUrl: `${GF}Manrope${W}` },
  { name: 'Geist',            category: 'sans-serif', cssValue: "'Geist', sans-serif",            importUrl: `${GF}Geist${W}` },
  { name: 'Sora',             category: 'sans-serif', cssValue: "'Sora', sans-serif",             importUrl: `${GF}Sora${W}` },
  { name: 'Work Sans',        category: 'sans-serif', cssValue: "'Work Sans', sans-serif",        importUrl: `${GF}Work+Sans${W}` },
  { name: 'Figtree',          category: 'sans-serif', cssValue: "'Figtree', sans-serif",          importUrl: `${GF}Figtree${W}` },
  { name: 'Urbanist',         category: 'sans-serif', cssValue: "'Urbanist', sans-serif",         importUrl: `${GF}Urbanist${W}` },
  { name: 'Jost',             category: 'sans-serif', cssValue: "'Jost', sans-serif",             importUrl: `${GF}Jost${W}` },
  { name: 'Mulish',           category: 'sans-serif', cssValue: "'Mulish', sans-serif",           importUrl: `${GF}Mulish${W}` },
  { name: 'Noto Sans',        category: 'sans-serif', cssValue: "'Noto Sans', sans-serif",        importUrl: `${GF}Noto+Sans${W}` },
  { name: 'IBM Plex Sans',    category: 'sans-serif', cssValue: "'IBM Plex Sans', sans-serif",    importUrl: `${GF}IBM+Plex+Sans${W}` },

  /* ── Sans-serif with Arabic support ──────────────────────── */
  { name: 'Cairo',    category: 'sans-serif', cssValue: "'Cairo', sans-serif",    importUrl: `${GF}Cairo${W}`,    arabic: true },
  { name: 'Tajawal',  category: 'sans-serif', cssValue: "'Tajawal', sans-serif",  importUrl: `${GF}Tajawal${W}`,  arabic: true },
  { name: 'Almarai',  category: 'sans-serif', cssValue: "'Almarai', sans-serif",  importUrl: `${GF}Almarai${W}`,  arabic: true },
  { name: 'Noto Kufi Arabic', category: 'sans-serif', cssValue: "'Noto Kufi Arabic', sans-serif", importUrl: `${GF}Noto+Kufi+Arabic${W}`, arabic: true },
  { name: 'IBM Plex Sans Arabic', category: 'sans-serif', cssValue: "'IBM Plex Sans Arabic', sans-serif", importUrl: `${GF}IBM+Plex+Sans+Arabic${W}`, arabic: true },

  /* ── Serif ────────────────────────────────────────────────── */
  { name: 'Playfair Display', category: 'serif', cssValue: "'Playfair Display', serif",  importUrl: `${GF}Playfair+Display${WD}` },
  { name: 'Merriweather',     category: 'serif', cssValue: "'Merriweather', serif",       importUrl: `${GF}Merriweather${W}` },
  { name: 'EB Garamond',      category: 'serif', cssValue: "'EB Garamond', serif",        importUrl: `${GF}EB+Garamond${W}` },
  { name: 'Lora',             category: 'serif', cssValue: "'Lora', serif",               importUrl: `${GF}Lora${W}` },
  { name: 'DM Serif Display', category: 'serif', cssValue: "'DM Serif Display', serif",   importUrl: `${GF}DM+Serif+Display:ital@0;1&display=swap` },
  { name: 'Libre Baskerville',category: 'serif', cssValue: "'Libre Baskerville', serif",  importUrl: `${GF}Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap` },
  { name: 'Cormorant Garamond',category: 'serif',cssValue: "'Cormorant Garamond', serif", importUrl: `${GF}Cormorant+Garamond${W}` },
  { name: 'Crimson Text',     category: 'serif', cssValue: "'Crimson Text', serif",       importUrl: `${GF}Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap` },
  { name: 'Spectral',         category: 'serif', cssValue: "'Spectral', serif",           importUrl: `${GF}Spectral${W}` },

  /* ── Display ──────────────────────────────────────────────── */
  { name: 'Space Grotesk',  category: 'display', cssValue: "'Space Grotesk', sans-serif",  importUrl: `${GF}Space+Grotesk${W}` },
  { name: 'Bricolage Grotesque', category: 'display', cssValue: "'Bricolage Grotesque', sans-serif", importUrl: `${GF}Bricolage+Grotesque${W}` },
  { name: 'Cabinet Grotesk',category: 'display', cssValue: "'Cabinet Grotesk', sans-serif",importUrl: `${GF}Cabinet+Grotesk${W}` },
  { name: 'Clash Display',  category: 'display', cssValue: "'Clash Display', sans-serif",  importUrl: `${GF}Clash+Display${W}` },
  { name: 'Bebas Neue',     category: 'display', cssValue: "'Bebas Neue', sans-serif",     importUrl: `${GF}Bebas+Neue:wght@400&display=swap` },
  { name: 'Anton',          category: 'display', cssValue: "'Anton', sans-serif",          importUrl: `${GF}Anton:wght@400&display=swap` },
  { name: 'Barlow Condensed',category: 'display',cssValue: "'Barlow Condensed', sans-serif",importUrl: `${GF}Barlow+Condensed${W}` },
  { name: 'Oswald',         category: 'display', cssValue: "'Oswald', sans-serif",         importUrl: `${GF}Oswald${W}` },
  { name: 'Exo 2',          category: 'display', cssValue: "'Exo 2', sans-serif",          importUrl: `${GF}Exo+2${W}` },
  { name: 'Rajdhani',       category: 'display', cssValue: "'Rajdhani', sans-serif",       importUrl: `${GF}Rajdhani${W}` },

  /* ── Monospace ────────────────────────────────────────────── */
  { name: 'JetBrains Mono',   category: 'monospace', cssValue: "'JetBrains Mono', monospace", importUrl: `${GF}JetBrains+Mono${W}` },
  { name: 'Fira Code',        category: 'monospace', cssValue: "'Fira Code', monospace",       importUrl: `${GF}Fira+Code${W}` },
  { name: 'Source Code Pro',  category: 'monospace', cssValue: "'Source Code Pro', monospace", importUrl: `${GF}Source+Code+Pro${W}` },
  { name: 'IBM Plex Mono',    category: 'monospace', cssValue: "'IBM Plex Mono', monospace",   importUrl: `${GF}IBM+Plex+Mono${W}` },
  { name: 'Space Mono',       category: 'monospace', cssValue: "'Space Mono', monospace",       importUrl: `${GF}Space+Mono:wght@400;700&display=swap` },
]

const loaded = new Set<string>()

/**
 * Lazily inject a `<link>` tag for a Google Font.
 * Safe to call multiple times with the same font — deduped by name.
 */
export function loadGoogleFont(font: GoogleFont): void {
  if (loaded.has(font.name)) return
  if (typeof document === 'undefined') return
  if (document.querySelector(`link[data-gf="${font.name}"]`)) {
    loaded.add(font.name)
    return
  }
  const link = document.createElement('link')
  link.rel  = 'stylesheet'
  link.href = font.importUrl
  link.setAttribute('data-gf', font.name)
  document.head.appendChild(link)
  loaded.add(font.name)
}

/** Find a GoogleFont entry by its cssValue (token value). */
export function fontByCssValue(cssValue: string): GoogleFont | undefined {
  return GOOGLE_FONTS.find((f) => f.cssValue === cssValue)
}

/** Derive a human-readable display name from a cssValue. */
export function fontDisplayName(cssValue: string): string {
  return fontByCssValue(cssValue)?.name ?? cssValue.split(',')[0].replace(/['"]/g, '').trim()
}
