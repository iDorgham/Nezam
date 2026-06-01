/** Token-driven tint, media, and motion helpers for wireframe block renderers. */

import type { CSSProperties } from 'react'

export type BlockTint =
  | 'brand'
  | 'accent'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'muted'
  | 'surface'
  | 'inverse'

export type BlockMotion =
  | 'none'
  | 'lift'
  | 'glow'
  | 'scale-media'
  | 'border-accent'
  | 'tilt'
  | 'reveal'

export type BlockDensity = 'compact' | 'default' | 'spacious'

export const BLOCK_TINT_VAR: Record<BlockTint, string> = {
  brand: 'var(--brand)',
  accent: 'var(--accent)',
  secondary: 'var(--app-secondary, var(--accent))',
  success: 'var(--app-success, var(--accent))',
  warning: 'var(--app-warning, var(--accent))',
  muted: 'var(--app-muted)',
  surface: 'var(--app-surface)',
  inverse: 'var(--app-text)',
}

export const BLOCK_SECTION_DENSITY: Record<BlockDensity, string> = {
  compact: 'px-5 py-8 md:py-10',
  default: 'px-6 py-12 md:py-16',
  spacious: 'px-6 py-16 md:py-24',
}

const MOTION_CLASS: Record<BlockMotion, string> = {
  none: '',
  lift: 'block-hover-lift',
  glow: 'block-hover-glow',
  'scale-media': 'block-hover-scale-media',
  'border-accent': 'block-hover-border-accent',
  tilt: 'block-hover-tilt',
  reveal: 'block-scroll-reveal',
}

export function blockMotionClass(motion: BlockMotion = 'none'): string {
  return MOTION_CLASS[motion] ?? ''
}

/** Mix a profile tint into the app surface for band backgrounds. */
export function blockTintBg(tint: BlockTint, mixPercent: number, base = 'var(--app-surface)'): string {
  return `color-mix(in oklab, ${BLOCK_TINT_VAR[tint]} ${mixPercent}%, ${base})`
}

/** Foreground on saturated bands: mix surface into tint for readable inverse text. */
export function blockTintFg(tint: BlockTint, mixPercent = 92): string {
  return `color-mix(in oklab, var(--app-surface) ${mixPercent}%, ${BLOCK_TINT_VAR[tint]})`
}

/** Deterministic placeholder imagery from active profile tokens (no external URLs). */
export function blockImageStyle(seed = 0, overlayOpacity = 0.55): CSSProperties {
  const hues = ['var(--brand)', 'var(--accent)', 'var(--app-success, var(--accent))', 'var(--app-warning, var(--accent))']
  const a = hues[seed % hues.length]
  const b = hues[(seed + 2) % hues.length]
  const layers = [
    `linear-gradient(145deg, color-mix(in oklab, ${a} 38%, var(--app-elevated)) 0%, color-mix(in oklab, ${b} 22%, var(--app-surface)) 55%, var(--app-surface) 100%)`,
    'radial-gradient(circle at 18% 22%, color-mix(in oklab, var(--accent) 28%, transparent) 0%, transparent 48%)',
    'radial-gradient(circle at 82% 78%, color-mix(in oklab, var(--brand) 24%, transparent) 0%, transparent 42%)',
  ]
  return {
    backgroundImage: layers.join(', '),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    ...(overlayOpacity > 0
      ? {
          boxShadow: `inset 0 0 0 9999px color-mix(in oklab, var(--app-surface) ${Math.round(overlayOpacity * 100)}%, transparent)`,
        }
      : {}),
  }
}

/** Hero cover: full-bleed image field with bottom fade into surface. */
export function blockHeroCoverStyle(seed = 0): CSSProperties {
  const hues = ['var(--brand)', 'var(--accent)', 'var(--app-success, var(--accent))', 'var(--app-warning, var(--accent))']
  const a = hues[seed % hues.length]
  const b = hues[(seed + 2) % hues.length]
  return {
    backgroundImage: [
      `linear-gradient(to top, var(--app-surface) 0%, color-mix(in oklab, var(--app-surface) 55%, transparent) 38%, transparent 72%)`,
      `linear-gradient(145deg, color-mix(in oklab, ${a} 42%, var(--app-elevated)) 0%, color-mix(in oklab, ${b} 26%, var(--app-surface)) 55%, var(--app-surface) 100%)`,
      'radial-gradient(circle at 18% 22%, color-mix(in oklab, var(--accent) 28%, transparent) 0%, transparent 48%)',
    ].join(', '),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

export function blockTintStyles(tint: BlockTint): {
  bg: string
  border: string
  fg: string
  subtle: string
} {
  return {
    bg: blockTintBg(tint, tint === 'muted' ? 8 : 14),
    border: `color-mix(in oklab, ${BLOCK_TINT_VAR[tint]} 28%, var(--app-border))`,
    fg: tint === 'inverse' ? blockTintFg('brand') : 'var(--app-text)',
    subtle: `color-mix(in oklab, ${BLOCK_TINT_VAR[tint]} 65%, var(--app-muted))`,
  }
}

/** Cycle tints for multi-card grids so blocks reflect profile palette variance. */
export function blockTintAt(index: number): BlockTint {
  const cycle: BlockTint[] = ['brand', 'accent', 'secondary', 'success', 'warning', 'muted']
  return cycle[index % cycle.length]
}
