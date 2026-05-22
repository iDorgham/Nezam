# DESIGN_SYSTEM.md — NEZAM V3

## Data Visualization Tokens (v2.0)

### Categorical Palette (<=12 series)

Light mode:
- `token/chart/cat-1`: oklch(52% 0.18 230) /* blue */
- `token/chart/cat-2`: oklch(65% 0.20 50)  /* orange */
- `token/chart/cat-3`: oklch(52% 0.18 145) /* green */
- `token/chart/cat-4`: oklch(50% 0.20 25)  /* red */
- `token/chart/cat-5`: oklch(52% 0.16 295) /* purple */
- `token/chart/cat-6`: oklch(45% 0.12 35)  /* brown */
- `token/chart/cat-7` through `token/chart/cat-12`: additional series colors

Dark mode: same hues, lightness +15% (WCAG AA on dark bg)

### Sequential Palette
- `token/chart/seq-1`: oklch(92% 0.06 230) /* lightest */
- `token/chart/seq-5`: oklch(65% 0.14 230)
- `token/chart/seq-9`: oklch(35% 0.18 230) /* darkest */

### Diverging Palette
- `token/chart/div-neg-3`: oklch(75% 0.15 50)  /* negative high */
- `token/chart/div-neutral`: oklch(98% 0.02 90)
- `token/chart/div-pos-3`: oklch(50% 0.18 145)  /* positive high */

## OKLCH Color System

All colors MUST be defined in OKLCH for perceptual uniformity.

### Semantic Tokens
- `token/color/primary`: oklch(52% 0.18 260)
- `token/color/success`: oklch(52% 0.18 145)
- `token/color/warning`: oklch(72% 0.18 75)
- `token/color/danger`: oklch(50% 0.20 25)

### Tinted Neutrals
- `token/neutral/bg`: oklch(98% 0.005 260)
- `token/neutral/surface`: oklch(96% 0.008 260)
- `token/neutral/text`: oklch(20% 0.01 260)
- `token/neutral/subtle`: oklch(60% 0.01 260)

Dark mode: automatic via `prefers-color-scheme` with OKLCH lightness inversion.

## Typography

### Arabic Fonts by Dialect
- Khaleeji: `Tajawal` (primary), `Noto Sans Arabic` (fallback)
- Masri: `Cairo` (primary), `Noto Sans Arabic` (fallback)
- Levantine/MSA: `Noto Sans Arabic`
- Maghrebi: `Noto Sans Arabic`

### Scale
Modular 8px baseline grid. Fluid type via `clamp()` for optical sizing.

## Motion Budget

| Type | Duration | Easing |
|---|---|---|
| Micro | <=300ms | cubic-bezier(0.25, 0.1, 0.25, 1.0) |
| Macro | <=600ms | cubic-bezier(0.25, 0.1, 0.25, 1.0) |
| Chart entrance | 350ms | cubic-bezier(0.25, 0.1, 0.25, 1.0) |
| Chart update | 200ms | cubic-bezier(0.25, 0.1, 0.25, 1.0) |
| Chart exit | 150ms | linear |

GPU hints required: `transform`, `will-change: transform`, `contain: strict`

## Usage Rules
- All chart colors MUST use token references — zero hardcoded hex
- RTL: axis/legend flips; color scale unchanged unless cultural rules dictate
- Adjacent chart tokens must maintain >= 3:1 contrast ratio
- OKLCH required for all new color definitions (min 80% of palette)
- Tinted neutrals required for all backgrounds (min 90%)
