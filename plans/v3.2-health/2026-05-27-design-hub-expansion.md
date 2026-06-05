# Design Hub Token System Expansion & Theming Polish

**Date:** 2026-05-27
**Status:** Draft for review
**Context:** Internal team tool — prioritize practical value over flash.

---

## Overview

Transform the Design Hub from a functional token editor into a comprehensive design system builder. All 6 phases below are ordered by dependency — later phases depend on earlier ones being complete.

---

## Phase 1: Expanded Token Architecture

### 1a — Deepen existing token categories

**`design.ts` — `colors`**
- Add `successScale: ColorScale`, `warningScale: ColorScale`, `errorScale: ColorScale`, `infoScale: ColorScale` (full 11-step scales, not just single semantic colors)
- Add `dark` sub-object under `colors` with `surface: { bg, panel, overlay, border }` and `text: { primary, secondary, muted, disabled }` — light mode uses top-level surface/text, dark mode uses `colors.dark.*`

**`design.ts` — `shadows`**
- Add `inner: string` (inset shadow for inputs/wells)
- Add `colored: string` (brand-tinted glow shadow)

**`design.ts` — `motion`**
- Add `transition` object: `{ color: string, transform: string, opacity: string, all: string }` — property-specific transition presets
- Add `spring` object: `{ stiffness: number, damping: number, mass: number }` — spring physics config

**`design.ts` — `borders`**
- Add `divider: { width: string, style: 'solid' | 'dashed' | 'dotted', color: string }`
- Add `focus: { width: string, color: string, offset: string }`
- Add `widthScale: { '0': string, '1': string, '2': string, '3': string, '4': string }` — named border widths

### 1b — Add new token categories

All new types go into `design.ts` under `DesignTokens`:

```typescript
cursor: {
  focusRing: { width: string, offset: string, style: 'solid' | 'dashed' | 'dotted' }
  default: string   // cursor name for interactive elements
  pointer: string
  text: string
  disabled: string
}

scrollbar: {
  width: string
  thumb: { color: string, radius: string, hoverColor: string }
  track: { color: string, radius: string }
}

glass: {
  blur: { sm: string, md: string, lg: string, xl: string }
  overlay: { light: string, dark: string }
  borderOpacity: string
}

gradients: {
  brand: string     // CSS gradient value
  accent: string
  surface: string
  mesh: string[]    // array of hex colors for mesh gradient seeds
}

grid: {
  columns: { xs: number, sm: number, md: number, lg: number, xl: number, '2xl': number }
  gutter: string
  maxWidth: string
  containerPadding: string
  margin: string
}

content: {
  proseMaxWidth: string
  lineLength: string     // optimal reading width (ch units)
  paragraphSpacing: string
  headingSpacing: string
  listIndent: string
  blockquoteBorder: string
}

density: {
  mode: 'compact' | 'comfortable' | 'spacious'
  /** Multiplier applied to spacing, padding, font-size globally */
  multiplier: number
}
```

### 1c — Update token nav

**`design.ts` — `TOKEN_CATEGORY_GROUPS`**
- Reorganize into cleaner hierarchy reflecting Material Design 3 influence
- Add new categories to appropriate groups

### 1d — Update all 22 design profiles

**`design-profiles.ts`**
- Every profile (12 aesthetic + 10 brand) gets complete values for all new/deepened token categories
- Each profile gets proper `colors.dark` sub-object (dark surface/text tokens)
- Verify WCAG AA contrast for each profile's text-on-surface combos

### 1e — Store migration

**`hub.store.ts`**
- Bump persist name to `nezam-design-hub-v8`
- Add `version: 2` persist config
- Migration: detect v1 state, merge in all new token defaults from `DESIGN_PROFILES_MAP['minimal'].tokens`
- All new categories initialized with sensible defaults

---

## Phase 2: Accessibility & Contrast Tooling

### 2a — Color utility library

**`lib/color-a11y.ts`** (new)
- `relativeLuminance(hex: string): number` — WCAG 2.1 relative luminance
- `getContrastRatio(fg: string, bg: string): number`
- `meetsWCAG(ratio: number, level: 'AA' | 'AAA', size: 'normal' | 'large'): boolean`
- `findNearestCompliant(color: string, bg: string, level: 'AA' | 'AAA'): string`
- `simulateColorBlindness(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): string`
- `generateAccessibleScale(baseHex: string, steps: number): ColorScale` — produces 11-step scale where middle steps meet 4.5:1 against white and black
- `getColorTemperature(hex: string): number` — warm (0) to cool (100)
- `shiftColorTemperature(hex: string, amount: number): string`

### 2b — ColorEditor WCAG upgrade

**`ColorEditor.tsx`**
- Add contrast ratio badges next to every text color input: `AA ✓`, `AAA ✓`, or `FAIL ✗` with exact ratio
- Auto-fix button beside failed tokens — suggests nearest compliant color
- Contrast matrix toggle — grid of all text×surface combos with pass/fail
- Color blindness simulator toggle (protanopia/deuteranopia/tritanopia preview)
- Add semantic color scale editors for the 4 new scales (successScale, warningScale, errorScale, infoScale)

### 2c — Theme panel WCAG overlay

**`ThemingSection.tsx`**
- Add global WCAG overlay toggle — shows contrast ratio badges on every element in ThemingPreview
- Global accessibility score: `"83% of tokens pass AA"`

---

## Phase 3: Enhanced Token Editors

### 3a — New editors

Create 7 new editor components following the existing pattern:

| File | Key Features |
|------|-------------|
| `CursorEditor.tsx` | Interactive focus ring demo (button that shows focus-visible ring), width/offset/style controls, cursor type select |
| `ScrollbarEditor.tsx` | Live scrollbar preview in a scrollable container, thumb/track color pickers, width slider |
| `GlassEditor.tsx` | Backdrop-blur slider with frosted panel over image background, border opacity control |
| `GradientEditor.tsx` | Visual gradient bar with draggable stops, direction picker (to/br/bl/tr/tl), mesh gradient seed input |
| `GridEditor.tsx` | Column grid overlay on a sample layout, column count per breakpoint, gutter slider |
| `ContentEditor.tsx` | Prose demo with adjustable max-width ruler, paragraph spacing slider, line-length indicator |
| `DensityEditor.tsx` | 3-state toggle with side-by-side preview of a card component at each density |

### 3b — Register editors in TokensView

**`TokensView.tsx`**
- Add imports and conditional renders for 7 new editors

### 3c — Polish existing editors (optional, lower priority)

- Add "copy token value" button to each editor row
- Add "reset to profile defaults" button per section
- Keep existing visual previews; only add interactive ones where they add real value (e.g., shadow builder sliders, not 3D stacking diagrams)

---

## Phase 4: Theming Panel Overhaul

### 4a — Brand seed generator

**`ThemingSection.tsx`** — new "Seed" tab
- Single brand color picker → auto-generates complete light & dark themes
- Sliders: warmth/coolness, vibrancy/subtlety, lightness distribution
- Result: full `ThemeConfig` with 11-step scales, surface/text tokens, WCAG-calibrated contrast

### 4b — Split light/dark preview

**`ThemingPreview.tsx`**
- Side-by-side split view showing light mode (left) and dark mode (right) simultaneously
- Changes in one mode auto-derive the other via `colors.dark` sub-object mapping

### 4c — Mood presets (expand)

**`theme-presets.ts`** — add mood presets category:
- "Corporate Trust", "Creative Energy", "Luxury Minimal", "SaaS Dashboard", "E-commerce Warm", "Developer Tool"
- Each includes: colors, radius, spacing scale, font recommendations, shadow style

### 4d — Theming color utils

**`color-utils.ts`** additions:
- `generateThemeFromSeed(hex: string, options: SeedOptions): { light: ThemeTokens, dark: ThemeTokens }`
- `generateMoodPreset(mood: MoodPresetId): ThemeConfig`

---

## Phase 5: Component Preview Expansion

### 5a — New ComponentStrip sections

**`ComponentStrip.tsx`**
Add these preview sections using the existing inline-styled pattern:
- **Dialog** — with backdrop overlay, title, body, action buttons
- **Toast** — success/error/warning/info variants with dismiss button
- **Select/Dropdown** — open state with options, hovered option
- **Data Table** — headers, sortable columns, row striping
- **Skeleton** — animated skeleton using skeleton tokens
- **Tag/Chip** — removable tags with semantic colors
- **Empty State** — illustration placeholder + action CTA

### 5b — Token reactivity

All new previews respond to:
- New glass/blur tokens (dialog backdrop, toast background)
- Gradient tokens (brand gradient on primary buttons)
- Density tokens (compact vs spacious layout)
- Scrollbar tokens (scrollbar styling in table)
- Focus/cursor tokens (focus ring on interactive elements)

---

## Phase 6: Export & Integration

### 6a — New export formats

**`ExportPanel.tsx`** additions:

| Format | Description |
|--------|-------------|
| **Figma JSON** | Figma Tokens plugin format — `$themes` + `$metadata` compatible |
| **Style Dictionary** | Platform-agnostic `tokens.json` with `type`, `value`, `description` per token |
| **Design System Doc** | Markdown document with all tokens organized by category, usage examples |

### 6b — Update existing exports

- CSS Variables export: include all new token categories
- Tailwind config export: include new tokens in `theme.extend`
- JSON export: already serializes full `DesignTokens` — just works with new fields

---

## Store Migration Strategy

```typescript
// hub.store.ts persist config
{
  name: 'nezam-design-hub-v8',
  version: 2,
  migrate: (persisted: any, version: number) => {
    // version 0 = pre-v7 (no version field)
    // version 1 = v7 (current)
    // version 2 = v8 (after this expansion)

    let state = persisted

    if (version < 2) {
      // Merge missing token fields from minimal profile defaults
      const defaults = DESIGN_PROFILES_MAP['minimal'].tokens
      if (state?.design?.tokens) {
        for (const key of Object.keys(defaults) as (keyof typeof defaults)[]) {
          if (!(key in state.design.tokens)) {
            state.design.tokens[key] = defaults[key]
          }
        }
        // Deep merge for nested fields that were expanded
        // Colors: add dark sub-object, add successScale/warningScale/errorScale/infoScale
        // Shadows: add inner, colored
        // Motion: add transition, spring
        // Borders: add divider, focus, widthScale
      }
    }

    return state
  },
}
```

---

## Verification Plan

### Build
```bash
cd .nezam/design-hub && pnpm run type-check && pnpm run build
```

### Manual checks
1. Load Design Hub → verify no console errors
2. Navigate every token category (16 old + 7 new = 23)
3. Verify each editor renders with values
4. Switch design profile → all tokens update
5. Theme panel: seed generator → verify full theme generation
6. WCAG overlay: toggle on → verify badges appear
7. Component strip: verify new sections render
8. Export: verify CSS/Tailwind/JSON output includes all new tokens
9. Hard refresh / clear storage → verify migration fires correctly

---

## Effort Estimates

| Phase | Files | Est. Effort | Priority |
|-------|-------|-------------|----------|
| P1a Deepen existing types | 2 (design.ts, design-profiles.ts) | Medium | High |
| P1b New token categories | 2 (design.ts, design-profiles.ts) | Large | High |
| P1c Token nav update | 1 (design.ts) | Small | High |
| P1d Profile data fill | 1 (design-profiles.ts ~1000 lines added) | Very Large | High |
| P1e Store migration | 1 (hub.store.ts) | Small | High |
| P2a Color a11y lib | 1 (new file) | Medium | High |
| P2b ColorEditor WCAG | 1 (ColorEditor.tsx) | Large | High |
| P2c Theme WCAG overlay | 2 (ThemingSection, ThemingPreview) | Medium | Medium |
| P3a New editors (×7) | 7 new files | Very Large | Medium |
| P3b Register editors | 1 (TokensView.tsx) | Small | Medium |
| P3c Polish existing editors | ~16 files | Large | Low |
| P4a Seed generator | 2 (ThemingSection, color-utils) | Large | Medium |
| P4b Split preview | 1 (ThemingPreview) | Medium | Low |
| P4c Mood presets | 2 (theme-presets, ThemingSection) | Medium | Medium |
| P5a New previews | 1 (ComponentStrip.tsx) | Large | Low |
| P5b Token reactivity | 1 (ComponentStrip.tsx) | Small | Low |
| P6a New export formats | 1 (ExportPanel.tsx) | Large | Medium |
| P6b Update existing exports | 1 (ExportPanel.tsx) | Small | High |

**Total: ~25+ files, 3-4 weeks full-time for one developer.**

---

Ready for your review. If the scope looks right, I'll start with Phase 1 implementation.
