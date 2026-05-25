# DESIGN.md v2 (Impeccable++)

## Intent
*Brief generated via /DESIGN intent — source: .nezam/core/plans/05-design/DESIGN_BRIEF_<page>.md*

## Tokens
*W3C DTCG format + framework bindings*
- OKLCH color definitions (>= 80% of palette)
- Tinted neutrals for all backgrounds (>= 90%)
- Fluid type scale with optical sizing

## Components
*Spec with a11y props, RTL logic, test hooks*

## Motion
*Animation specs with perf budgets + fallback chains*
- Entrance: <=350ms cubic-bezier(0.25, 0.1, 0.25, 1.0)
- Update: <=200ms
- Exit: <=150ms
- Reduced motion: instant snap or opacity crossfade

## Accessibility
*WCAG 2.2 AA compliance report + MENA screen-reader notes*

## RTL Parity
*LTR/RTL comparison notes + mirror snapshot links*

## Cultural Context
*Dialect-specific validation report (khaleeji|masri|levantine|maghrebi|msa)*

## Anti-Pattern Checklist
- [ ] No Inter/Arial default
- [ ] No purple-to-blue gradients
- [ ] No gray-on-color text (>= 4.5:1)
- [ ] No cards in cards
- [ ] No pure black
- [ ] No bounce easing
- [ ] No arbitrary spacing
- [ ] No hardcoded hex values
- [ ] No missing RTL layout

## Handoff Checklist
- [ ] Tokens synced to frameworks
- [ ] RTL layout tested in CI
- [ ] A11y props implemented
- [ ] Motion perf budget verified
- [ ] Cultural validation passed
- [ ] /DESIGN audit --strict passed
- [ ] sdd-gate-validator: PASS

## MENA-Inspired Styling Profiles (Brand Presets)

Use these curated, highly premium brand presets to anchor your design system tokens with high MENA/Cairo cultural resonance:

### 1. Cairo Sunrise (Masri / Urban Energy)
* **Vibe**: High-contrast, energetic, warm, and accessible.
* **Palette Tokens**:
  - `oklch(78% 0.14 72)` (Cairo Gold primitive — Primary)
  - `oklch(62% 0.18 36)` (Warm Terracotta primitive — Accent)
  - `oklch(98% 0.01 72)` (Linen Cream Neutral — Background)
  - `oklch(22% 0.02 72)` (Deep Charcoal — Foreground)
* **Typography**: Outwardly warm, friendly, utilizing large headers using *Outfit* or *Tajawal*.

### 2. Sahel Dusk (Coastal Colloquial / Sleek)
* **Vibe**: Modern, fluid, luxury, relaxed.
* **Palette Tokens**:
  - `oklch(64% 0.16 230)` (Mediterranean Turquoise — Primary)
  - `oklch(84% 0.11 82)` (Warm Sahara Sand — Accent)
  - `oklch(96% 0.02 85)` (Tinted Soft Neutral — Background)
  - `oklch(18% 0.03 230)` (Deep Sea Blue — Foreground)
* **Typography**: Geometric, modern, utilizing *Inter* or *Cairo* with fluid `clamp()` sizing.

### 3. Levant Olive (Regional / Terrene)
* **Vibe**: Organic, rich, historical, craft-centric.
* **Palette Tokens**:
  - `oklch(58% 0.11 125)` (Levant Olive Green — Primary)
  - `oklch(58% 0.16 28)` (Pomegranate Rust — Accent)
  - `oklch(97% 0.01 125)` (Earthy Soft Clay — Background)
* **Typography**: Highly elegant, utilizing traditional editorial serifs alongside *Amiri* or *Ruqah* for accents.

### 4. Gulf Pearl (GCC / Prestige)
* **Vibe**: Ultra-clean, prestigious, corporate-luxury.
* **Palette Tokens**:
  - `oklch(26% 0.06 200)` (Deep Petroleum Indigo — Primary)
  - `oklch(76% 0.08 85)` (Metallic Brass Gold — Accent)
  - `oklch(99% 0.005 85)` (Lustrous Pearl Grey — Background)
  - `oklch(14% 0.02 200)` (Void Blue — Foreground)
* **Typography**: Minimalist sans-serifs combined with crisp *Mada* or *Almarai* typography.
