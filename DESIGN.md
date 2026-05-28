---
name: NEZAM Design Hub
description: Human-in-the-Loop design decision engine and profiles repository
colors:
  surface-bg: '#161619'
  surface-panel: '#1E1F22'
  surface-elevated: '#2A2C31'
  surface-inset: '#101012'
  surface-canvas: '#0C0D0F'
  accent: '#0065FF'
  accent-hover: '#2684FF'
  accent-active: '#0747A6'
  accent-subtle: 'rgba(38,128,235,0.16)'
  text-primary: '#F4F5F7'
  text-muted: '#A5ADBA'
  text-subtle: '#7A869A'
  border-default: '#2E3035'
  border-strong: '#40444C'
  success: '#00875A'
  warning: '#FFAB00'
  danger: '#DE350B'
typography:
  display:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: '1.75rem'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: '-0.03em'
  title:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: '0.01em'
  mono:
    fontFamily: 'JetBrains Mono, Geist Mono, ui-monospace, monospace'
    fontSize: '0.8125rem'
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: '6px'
  md: '10px'
  lg: '14px'
  xl: '20px'
  full: '9999px'
spacing:
  px: '1px'
  1: '4px'
  2: '8px'
  3: '12px'
  4: '16px'
  5: '20px'
  6: '24px'
  8: '32px'
  10: '40px'
  12: '48px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '#FFFFFF'
    rounded: '{rounded.sm}'
    padding: '6px 16px'
    typography: '{typography.label}'
  button-primary-hover:
    backgroundColor: '{colors.accent-hover}'
  button-secondary:
    backgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.sm}'
    padding: '6px 16px'
    border: '1px solid {colors.border-default}'
  input:
    backgroundColor: '{colors.surface-inset}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.sm}'
    padding: '6px 12px'
    border: '1px solid {colors.border-default}'
  input-focus:
    border: '1px solid {colors.accent}'
    boxShadow: '0 0 0 2px {colors.accent-subtle}'
  card:
    backgroundColor: '{colors.surface-panel}'
    rounded: '{rounded.md}'
    padding: '16px'
    border: '1px solid {colors.border-default}'
  nav-item:
    textColor: '{colors.text-muted}'
    rounded: '{rounded.sm}'
    padding: '6px 12px'
  nav-item-active:
    backgroundColor: '{colors.surface-elevated}'
    textColor: '{colors.text-primary}'
---

# Design System: NEZAM Design Hub

## 1. Overview

**Creative North Star: "The Precision Console"**

NEZAM Design Hub is a professional workspace for design decision management — a tool where designers, architects, and engineers define, track, and lock design decisions across projects. The interface is a control console for design systems: dense with information, precise in every dimension, and calibrated for the expert user who spends hours inside it.

The system draws from Vercel's Geist philosophy: maximal restraint, minimal decoration, and color that carries meaning rather than ornament. Every pixel earns its place. Surfaces are flat at rest with subtle elevation for hierarchy. Gray-scale tones do the structural work; the blue accent appears only for interactive elements — links, active states, primary actions. Color elsewhere is semantic: green for success, amber for warning, red for danger.

This is not a marketing surface. There are no hero sections, no gradient text, no glassmorphism, no decorative illustrations. The beauty lives in the precision: consistent 6px radii, tight 1.3 line heights, a single type family that carries everything from tab labels to panel headings to dense data tables.

**Key Characteristics:**
- Dark-first with crisp light mode alternative; both use tinted charcoals, never pure black or white
- Single sans type family (Inter) across all surfaces — headings, body, labels, buttons
- Sharp 6–10px radii as default — assertive, not soft
- Blue accent reserved for interactive affordance only
- Surface stacking via tonal contrast, not shadows
- Skeleton loading, not spinners
- Every interactive component has all seven states: default, hover, focus, active, disabled, loading, error

## 2. Colors

The palette is a cool charcoal gray-scale anchored by a single blue accent. Neutrals are tinted slightly cool (chroma 0.005–0.01 toward 210° blue) to avoid flat gray. The blue accent is used exclusively for interactive elements — it never decorates.

### Primary
- **Surface Graphite Charcoal** (`#161619`): Main chrome background — sidebars, toolbars, app frame.
- **Panel Graphite** (`#1E1F22`): Surface for cards, dropdowns, content panels.
- **Elevated Graphite** (`#2A2C31`): Elevated surfaces — dropdowns, active items, hover states.
- **Canvas Deep** (`#0C0D0F`): Deepest background — canvas area, behind wireframes.
- **Inset Charcoal** (`#101012`): Input fields, inset blocks, search bars.

### Accent
- **Affordance Blue** (`#0065FF`): Interactive elements — links, primary buttons, active tabs, focus rings. Never used for decoration.
- **Affordance Blue Hover** (`#2684FF`): Hover state for accent elements.
- **Affordance Blue Active** (`#0747A6`): Active/pressed state.
- **Affordance Blue Subtle** (`rgba(38,128,235,0.16)`): Subtle background tint for selected items, focus glow.

### Neutral Text
- **Primary Text** (`#F4F5F7`): Primary content, headings, data values.
- **Muted Text** (`#A5ADBA`): Secondary content, metadata, navigation labels.
- **Subtle Text** (`#7A869A`): Placeholder text, disabled content, captions.

### Borders
- **Default Border** (`#2E3035`): Standard dividers, card borders, table rows.
- **Strong Border** (`#40444C`): Emphasized borders, active states, focus indicators.

### Semantic
- **Success Green** (`#00875A`): Confirmed actions, positive states, deployment success.
- **Warning Amber** (`#FFAB00`): Attention states, pending actions, caution.
- **Danger Red** (`#DE350B`): Errors, destructive actions, critical states.

### Named Rules

**The Meaning Rule.** Color appears only when it carries information. Blue marks something interactive. Green marks success. Red marks error. Gray is the default state. If removing a color from an element makes it still readable and usable, that color was decoration — remove it.

**The One-Third Rule.** The accent blue covers no more than one third of any screen. It marks the primary action, the active navigation item, and interactive links. Rarity is the point.

## 3. Typography

**Display Font:** Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif
**Mono Font:** JetBrains Mono, Geist Mono, ui-monospace, monospace

**Character:** Single sans family across the entire surface. Inter is a neutral, slightly narrow neo-grotesk that reads equally well in UI labels and body text. Tight letter spacing and compact line heights create density appropriate for a professional tool. Mono is reserved for code snippets, token values, and data that demands precision.

### Hierarchy
- **Display** (600, 1.75rem / 28px, 1.3, -0.03em): Section headers, modal titles, settings page titles. Used sparingly — no more than one per view.
- **Title** (600, 1rem / 16px, 1.4): Panel headers, card titles, sidebar navigation groups.
- **Body** (400, 0.8125rem / 13px, 1.5): Default reading size — descriptions, list items, paragraph content. Cap line length at 65–75ch for prose; data tables may exceed.
- **Label** (500, 0.75rem / 12px, 1.3, 0.01em): Button labels, tab labels, input labels, badge text. Compact and precise.
- **Mono** (400, 0.8125rem / 13px, 1.5): Code, token values, identifiers, paths, data that requires character-level precision.

### Named Rules

**The One-Family Rule.** No display fonts, no second typeface for headings. Inter carries headings, body, labels, buttons, and data. Variation comes from weight (400/500/600) and size, not family switching.

## 4. Elevation

The system is fundamentally flat. Depth is conveyed through tonal layering rather than shadows. Each surface level is one step lighter or darker on the gray scale. Shadows exist only to distinguish the highest-elevation elements (modals, command palettes, dropdowns) from their backdrop.

- **Ambient Low** (`0 1px 2px rgba(0,0,0,0.4)`): Subtle separation for small elevated elements — tooltips, badges.
- **Surface Medium** (`0 4px 16px -2px rgba(0,0,0,0.45)`): Standard elevation — dropdowns, popovers, command palette.
- **Surface High** (`0 18px 48px -12px rgba(0,0,0,0.65)`): Modal dialogs, full-screen overlays, context panels.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Tonal contrast separates panels and cards. Shadows appear only as a response to state — hover elevation, focused dropdown, open modal. If a surface sits behind another surface and doesn't need keyboard focus, it is flat.

## 5. Components

### Buttons
- **Shape:** Assertive 6px radius (10px on the `app` scale). Tighter and more technical than rounded-pill buttons.
- **Primary (Affordance Blue):** Background `#0065FF`, white text, 6px 16px padding. Hover transitions to `#2684FF` in 150ms ease. Focus ring: 2px solid `#0065FF` with 2px offset.
- **Secondary:** Background `#2A2C31`, primary text `#F4F5F7`, 6px 16px padding, 1px border `#2E3035`. Hover background `#40444C`.
- **Ghost:** No background or border. Text `#A5ADBA`. Hover text `#F4F5F7`.
- **Danger:** Background `#DE350B`, white text. Hover darkens toward `#BA2B08`.
- **Disabled:** 40% opacity on all variants. No shadow, no hover treatment.

### Inputs & Fields
- **Style:** Inset background `#101012`, default border `#2E3035`, 6px radius, 6px 12px padding.
- **Focus:** Border shifts to `#0065FF`, outer glow via 2px of `accent-subtle`. Transition 150ms ease.
- **Placeholder:** Text `#7A869A`.
- **Error:** Border `#DE350B`, optional inline validation message below in 12px label weight.
- **Disabled:** 40% opacity, pointer-events none.

### Cards & Containers
- **Shape:** 10px radius on the `app` scale. Less severe than buttons but still purposeful.
- **Background:** Panel graphite `#1E1F22`.
- **Border:** 1px `#2E3035` — always present at rest.
- **Shadow Strategy:** None at rest. Elevated cards (dropdowns) use Surface Medium shadow.
- **Internal Padding:** 16px (spacing-4) as default. Dense views may use 12px.

### Navigation (Sidebar)
- **Style:** Full-width items, 6px radius, 6px 12px padding, 13px Inter at 500 weight.
- **Default:** Text `#A5ADBA`, no background.
- **Hover:** Background `#2A2C31`, text `#F4F5F7`.
- **Active:** Background `#2A2C31`, text `#F4F5F7`, plus 2px left inset color strip via a pseudo-element using accent blue. (Exception: This is the only allowed side-stripe — the navigation affordance is standard and expected.)
- **Icon:** 16px Lucide icon, `#7A869A` default, `#A5ADBA` active.

### Tabs
- **Style:** Inline text labels at label size (12px / 500). No background on inactive tabs.
- **Active:** Text `#F4F5F7` with a 2px underline in accent blue.
- **Hover:** Text shifts toward `#F4F5F7`. Smooth 150ms color transition.

### Chips / Badges
- **Style:** 6px radius, 4px 8px padding, 12px label weight.
- **Default:** Background `#2A2C31`, text `#A5ADBA`.
- **Status variants:** Green (`#00875A` bg), Amber (`#FFAB00` bg), Blue (`#0065FF` bg). White text on all.

### Skeleton / Loading
- **Pattern:** Pulse shimmer across panel-width blocks. Background uses `shimmer` animation with `--app-border` base and `--app-elevated` highlight sweep.
- **No spinners.** Loading state is represented by content-shaped placeholders.

## 6. Do's and Don'ts

### Do:
- **Do** use the accent blue only for interactive elements — links, buttons, active states, focus rings.
- **Do** use tonal layering (lighter/darker surfaces) to create hierarchy instead of shadows.
- **Do** keep button text in label weight (500) at 12px — compact and intentional.
- **Do** use skeleton loading patterns shaped like the content they replace.
- **Do** maintain 6px radius as the component default — it reads as precise and assertive.
- **Do** use Inter for everything — one family, adjusted via weight and size.
- **Do** show all interactive states (default, hover, focus, active, disabled, loading, error) for every component.
- **Do** use the semantic green/amber/red palette strictly for status — never for decoration.

### Don't:
- **Don't** use gradient text (`background-clip: text` with gradients). Emphasis comes from weight or size, not color effects.
- **Don't** use glassmorphism — no backdrop blur or translucent panels.
- **Don't** use side-stripe borders (border-left greater than 1px as accent). The one allowed exception is the sidebar active item indicator.
- **Don't** use display fonts in UI labels, buttons, or data — single family discipline applies everywhere.
- **Don't** animate layout properties (width, height, top, left). Use opacity and transform only.
- **Don't** use bounce or elastic easing curves. Standard curve is `cubic-bezier(0.32, 0.72, 0, 1)`.
- **Don't** use modals as a first resort. Exhaust inline errors, progressive disclosure, and slide-over panels first.
- **Don't** ship a component with missing states. No hover = not done. No focus ring = not done. No disabled treatment = not done.
- **Don't** reinvent standard affordances — no custom scrollbars, no non-standard form controls.
- **Don't** leave the interface blank on empty states. Show what would go there and how to add it.

---

## 7. Wireframe Rendering Contract (v3)

> **Hard rule.** Every rendered wireframe page in `.nezam/design-hub/` must satisfy this contract. Pages that fail any clause cannot be locked into `wireframes_locked.json`.

### 7.1 Fixed Layout Skeleton

Every full-page render uses the **same chrome skeleton**, regardless of content density:

```
┌─────────────────────────────────────────────┐  ← full-width header background
│  [logo]   nav-items                  [CTA]  │  ← sticky, z-10, backdrop-blur
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────── max-w-6xl mx-auto ──────────┐  │
│  │  body blocks (hero, features, …)      │  │
│  └───────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤  ← full-width footer background
│  [columns]  legal  social                   │
└─────────────────────────────────────────────┘
```

- **Header (`Nav_TopBar`)** — `w-full sticky top-0`. Background MUST bleed edge-to-edge. Inner content constrained by `max-w-6xl mx-auto`.
- **Body** — wrapped in `max-w-6xl mx-auto`, compact variant uses `max-w-2xl`. Section vertical rhythm: `py-14` minimum between adjacent sections.
- **Footer (`Nav_Footer`)** — `w-full` with `bg-app-elevated` (mapped from `--ds-surface-elevated`). Inner grid uses `max-w-6xl mx-auto`.

### 7.2 Block Inventory (5-Level Sitemap Aware)

Wireframe blocks are bound to ServiceKind via `wireframes_locked.json`. The renderer reads `block_type` and dispatches to the registered React component. Required blocks for v3:

| block_type | Purpose | Token slots used |
|---|---|---|
| `Nav_TopBar` | Sticky full-width header | `--ds-surface-bg`, `--ds-border-default`, `--ds-accent` |
| `Hero_Centered` | Announcement bar + headline + CTAs | `--ds-accent`, `--ds-text-primary`, `--ds-text-muted` |
| `Content_Logos` | Trust-strip with real PNG logos | none (image-driven) |
| `Content_Features` | 3×2 grid w/ distinct icons | `--ds-accent`, `--ds-surface-panel` |
| `Content_CTA` | Gradient banner + button | `--ds-accent` (gradient computed via `color-mix`) |
| `Nav_Footer` | Full-width 4-column footer | `--ds-surface-elevated`, `--ds-text-muted` |

### 7.3 Spacing Rhythm

| Rhythm | Value | When |
|---|---|---|
| Block-to-block | `py-14` (56px) | Default between any two body sections |
| Hero top offset | `pt-16 md:pt-24` | First section under sticky header |
| Card grid gap | `gap-4` (16px) | Inside `Content_Features`, `Content_Logos` |
| CTA banner inset | `p-8` | `Content_CTA` inner padding |

### 7.4 Background Bleed Pattern

Full-width backgrounds use the **filter + split** pattern in the page composer:

```tsx
const headerBlocks = ordered.filter(s => s.block_type === 'Nav_TopBar')
const footerBlocks = ordered.filter(s => s.block_type === 'Nav_Footer')
const bodyBlocks   = ordered.filter(s => s.block_type !== 'Nav_TopBar' && s.block_type !== 'Nav_Footer')
// Header/footer rendered outside the max-w wrapper; body inside.
```

---

## 8. Token-First Mandate

> **No hex codes outside this file.** Every component, block, and wireframe consumes tokens via `--ds-*` CSS custom properties (or the `var(--ds-*)` JSX style shorthand).

### 8.1 Primitive → Semantic → Component layering

| Layer | Example | Allowed in |
|---|---|---|
| **Primitive** | `--ds-blue-500: #0065FF` | `DESIGN.md` only |
| **Semantic** | `--ds-accent: var(--ds-blue-500)` | DESIGN.md + global stylesheet |
| **Component** | `--ds-button-primary-bg: var(--ds-accent)` | Component-scoped CSS only |

Wireframes consume the **semantic layer**. Components consume the **component layer**. Authors never reach for primitives directly.

### 8.2 Prohibited

- ❌ `className="bg-[#0065FF]"` (Tailwind arbitrary value)
- ❌ `style={{ color: '#0065FF' }}` (inline hex)
- ❌ `border-color: rgba(38,128,235,0.16)` (raw rgba — must be a semantic token)
- ❌ New tokens invented mid-task without Design Hub lock

### 8.3 Validation

Run after any styling change:

```bash
pnpm run check:tokens
```

Fails build on any non-`--ds-*` color reference found in `.nezam/design-hub/src/**/*.{ts,tsx,css}`.

---

## 9. RTL & Masri Expansion Rules

> **Arabic is a first-class locale, not a translation layer.** All wireframes that ship to `locale === 'ar-EG'` must satisfy these rules at render time.

### 9.1 Space Expansion

Arabic text reflow requires **+30% horizontal space** vs. Latin at the same point size. Renderer must:

- Increase `max-w-*` containers by 1.3× when `dir="rtl"`
- Allow heading wrapping to 2 lines without overflow
- Pre-test `Hero_Centered` with the longest Masri headline from the dummy set

### 9.2 Mirror Map

| Latin (LTR) | Arabic (RTL) |
|---|---|
| `text-left` | `text-right` |
| `ml-*` | `mr-*` (use logical `ms-*` / `me-*` when possible) |
| `→` (arrow forward) | `←` (arrow forward = visually backward) |
| `border-l-*` | `border-r-*` |
| `Nav_TopBar` logo left | logo right |

### 9.3 Masri Content Bindings

The renderer pulls dummy copy from `.cursor/design/references/masri-design-assets/` (see §10). Required slots:

- **Headings:** kufic-display weight, +0.02em letter-spacing **off** (Arabic does not benefit from tracking)
- **Body:** ruq'ah-derived font stack — fallback `Cairo, 'IBM Plex Sans Arabic', system-ui`
- **Numerals:** Eastern Arabic (٠١٢٣٤٥٦٧٨٩) when locale + region both Egyptian; otherwise Western

### 9.4 prefers-reduced-motion Fallback

All RTL-driven layout swaps must respect:

```css
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

No exception. Direction flips must be instant when this media query matches.

---

## 10. Sources of Truth

> **Canonical Law:** Edit only `.cursor/`. Mirrors regenerate via `pnpm ai:sync`.

### 10.1 Reference Library

| Path | Purpose |
|---|---|
| `.cursor/design/references/awesome-design-md-main/` | Curated DESIGN.md exemplars from top product orgs |
| `.cursor/design/references/awesome-design-skills-main/` | Advanced design-skill authoring patterns |
| `.cursor/design/references/impeccable-main/` | High-craft, pixel-perfect standards (Phase 02 lead reference) |
| `.cursor/design/references/open-design-main/` | Extensible design-system token patterns |
| `.cursor/design/references/typeui-main/` | Advanced typography system (critical for Masri/Arabic) |
| `.cursor/design/references/skills-main/` | Meta design-skills library |
| `.cursor/design/references/masri-design-assets/` | Egyptian-Arabic calligraphy, colors, dummy content (manifest) |
| `.cursor/design/references/awesome-shadcn-ui-main/` | shadcn extensions catalog (Design Hub component pulls) |
| `.cursor/design/references/sketch-plugin-master/` | Legacy Sketch token export reference |

### 10.2 Core Active Files

| Path | Role |
|---|---|
| `DESIGN.md` (this file) | Repo-level design contract (v3) |
| `.nezam/design-hub/` | Design Hub runtime — wireframe renderer, ThemePanel, DesignSystemPanel |
| `wireframes_locked.json` | Locked 5-Level Sitemap + block bindings |
| `.cursor/skills/design/` | All design skills (canonical) |
| `.cursor/agents/` | Design Swarm agents (canonical) |
| `.cursor/rules/design-*.mdc` | Hardlock gates enforced by `/DESIGN` orchestrator |

### 10.3 Sync Discipline

After any edit to `.cursor/`:

```bash
pnpm ai:sync           # regenerate .claude/, .gemini/, AGENTS.md mirrors
pnpm ai:check          # validate registries + drift
pnpm run check:tokens  # token-first compliance
```

**Never** edit `.claude/`, `.gemini/`, `AGENTS.md`, or any other mirror directly. They are write-output, not write-input.

---
