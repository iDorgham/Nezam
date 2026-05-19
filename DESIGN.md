# DESIGN.md — Nezam Design Server · Ultimate UI Suite

> **Design contract for the `nezam-obsidian-cyan-orange` profile.**
> This file is the single source of truth for all visual decisions.
> No component may use a value that is not traceable to a token defined here.

---

## 1. Design Profile Identity

| Field | Value |
|---|---|
| Profile Name | `nezam-obsidian-cyan-orange` |
| Visual Direction | Premium minimalist · absolute dark ambient · Claude-grade layout predictability |
| Grid Baseline | 4px geometric rhythm |
| Container Max-Width | 1200px (canvas shell: full viewport) |
| Rendering Target | Dark-only — no light mode in v1 |
| RTL Support | Full — logical properties required throughout |

---

## 2. Color Tokens

All values expressed as CSS custom properties. Map to Tailwind `ds-*` utilities via `@layer base`.

### 2.1 Background & Surface

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| `background` | `--ds-background` | `#09090B` | Raw pitch canvas — page background |
| `surface` | `--ds-surface` | `#18181B` | Structural panels, side docks, cards |
| `surface-elevated` | `--ds-surface-elevated` | `#27272A` | Context menus, active elements, dropdowns |
| `surface-hover` | `--ds-surface-hover` | `#2D2D30` | Panel hover state |

### 2.2 Borders

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| `border` | `--ds-border` | `#27272A` | Standard structural separation |
| `border-muted` | `--ds-border-muted` | `#3F3F46` | Grid alignment guides, subtle dividers |
| `border-strong` | `--ds-border-strong` | `#52525B` | High-emphasis containers |

### 2.3 Accent Colors

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| `primary` | `--ds-primary` | `#06B6D4` | Electric Cyan — active nodes, validation passes, primary CTA |
| `primary-hover` | `--ds-primary-hover` | `#0891B2` | Hover state on primary elements |
| `primary-subtle` | `--ds-primary-subtle` | `#06B6D41A` | Subtle primary backgrounds (10% alpha) |
| `alert` | `--ds-alert` | `#EA580C` | GateFlow Orange — timeline headers, hot metrics, alerts |
| `alert-hover` | `--ds-alert-hover` | `#C2410C` | Alert hover |
| `alert-subtle` | `--ds-alert-subtle` | `#EA580C1A` | Subtle alert backgrounds |
| `success` | `--ds-success` | `#22C55E` | Gate pass indicators |
| `destructive` | `--ds-destructive` | `#EF4444` | Errors, rejected assets, gate failures |
| `warning` | `--ds-warning` | `#F59E0B` | Pending states, soft warnings |

### 2.4 Text

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| `text-primary` | `--ds-text-primary` | `#FAFAFA` | Headers, crisp metadata, primary labels |
| `text-secondary` | `--ds-text-secondary` | `#A1A1AA` | Body copy, explanatory microcopy |
| `text-muted` | `--ds-text-muted` | `#71717A` | Subdued labels, terminal logs, timestamps |
| `text-disabled` | `--ds-text-disabled` | `#3F3F46` | Disabled states |

### 2.5 Semantic Overrides (Canvas-specific)

| Token | Value | Usage |
|---|---|---|
| `--dv-wire-navigational` | `#06B6D4` | Navigational bezier wire stroke |
| `--dv-wire-data` | `#3B82F6` | Data wire stroke |
| `--dv-wire-auth` | `#A855F7` | Auth wire stroke |
| `--dv-wire-conditional` | `#EAB308` | Conditional wire stroke |
| `--dv-node-page` | `#18181B` | Page node background |
| `--dv-node-border-active` | `#06B6D4` | Active node border |
| `--dv-node-border-hardlock` | `#EA580C` | Hardlock-failing node border |
| `--dv-timeline-header` | `#EA580C` | Motion Studio timeline ruler |
| `--dv-keyframe` | `#06B6D4` | Keyframe diamond marker |

---

## 3. Typography

### 3.1 Font Stack

```css
--ds-font-sans: "Geist", "Inter", system-ui, sans-serif;
--ds-font-mono: "JetBrains Mono", "Fira Code", monospace;
```

### 3.2 Scale — Fluid `clamp()` Required on All Steps

Every font-size value MUST use `clamp(min, preferred, max)`. Fixed `px`/`rem` values throw a design gate error.

| Step | Token | Formula |
|---|---|---|
| `xs` | `--ds-text-xs` | `clamp(0.694rem, 1.5vw, 0.75rem)` |
| `sm` | `--ds-text-sm` | `clamp(0.833rem, 1.8vw, 0.875rem)` |
| `base` | `--ds-text-base` | `clamp(1rem, 2vw, 1rem)` |
| `lg` | `--ds-text-lg` | `clamp(1rem, 2.5vw, 1.125rem)` |
| `xl` | `--ds-text-xl` | `clamp(1.125rem, 3vw, 1.25rem)` |
| `2xl` | `--ds-text-2xl` | `clamp(1.25rem, 4vw, 1.5rem)` |
| `3xl` | `--ds-text-3xl` | `clamp(1.5rem, 5vw, 1.875rem)` |
| `4xl` | `--ds-text-4xl` | `clamp(1.875rem, 6vw, 2.25rem)` |

### 3.3 Letter Spacing

```css
--ds-tracking-label: 0.05em;   /* microcopy, tab labels */
--ds-tracking-mono: 0em;       /* monospace code — no extra tracking */
```

### 3.4 Line Height

```css
--ds-leading-tight:  1.25;
--ds-leading-normal: 1.5;
--ds-leading-arabic: 1.6;   /* ≥ 1.4× expanded for Arabic script */
```

### 3.5 Font Weights

| Token | Value | Usage |
|---|---|---|
| `--ds-weight-normal` | 400 | Body copy |
| `--ds-weight-medium` | 500 | Labels, panel headers |
| `--ds-weight-semibold` | 600 | Section titles, CTA labels |
| `--ds-weight-bold` | 700 | Hero headings, numeric metrics |

---

## 4. Spacing System

Grid baseline: **4px**. All spacing must be an exact multiple of 4px.

```css
--ds-space-0:   0px;
--ds-space-1:   4px;    /* space.xs */
--ds-space-2:   8px;    /* space.sm */
--ds-space-3:   12px;
--ds-space-4:   16px;   /* space.md */
--ds-space-6:   24px;   /* space.lg — inner panel breathing minimum */
--ds-space-8:   32px;   /* space.xl */
--ds-space-12:  48px;
--ds-space-16:  64px;
--ds-space-24:  96px;
```

**Inner breathing rule:** Panel containers must have a minimum padding of `space.lg (24px)`.

---

## 5. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--ds-radius-sm` | `4px` | Badges, chips |
| `--ds-radius-md` | `6px` | Canvas nodes, buttons |
| `--ds-radius-lg` | `8px` | Cards, panels |
| `--ds-radius-xl` | `12px` | Modals, drop zones |
| `--ds-radius-full` | `9999px` | Pills, status indicators |

---

## 6. Shadow & Elevation

```css
--ds-shadow-sm:   0 1px 2px rgba(0,0,0,0.4);
--ds-shadow-md:   0 4px 12px rgba(0,0,0,0.5);
--ds-shadow-lg:   0 8px 24px rgba(0,0,0,0.6);
--ds-shadow-node: 0 0 0 1px var(--ds-border), 0 4px 12px rgba(0,0,0,0.5);
--ds-shadow-active-node: 0 0 0 2px var(--ds-primary), 0 4px 16px rgba(6,182,212,0.15);
```

---

## 7. Motion Contract

### 7.1 Duration Scale

```css
--ds-duration-instant:  0ms;
--ds-duration-fast:     100ms;
--ds-duration-normal:   200ms;
--ds-duration-slow:     350ms;
--ds-duration-enter:    300ms;
--ds-duration-exit:     200ms;
```

### 7.2 Easing

```css
--ds-ease-default:  cubic-bezier(0.25, 0.1, 0.25, 1.0);
--ds-ease-in:       cubic-bezier(0.4, 0, 1, 1);
--ds-ease-out:      cubic-bezier(0, 0, 0.2, 1);
--ds-ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 7.3 Reduced Motion Rule (MANDATORY)

Every animated component MUST wrap its animation in:

```tsx
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
}
```

Canvas wire `dash-flow` animation: use `animation-duration: var(--ds-duration-instant)` when `prefers-reduced-motion: reduce`.

---

## 8. Layout System

### 8.1 Grid

- **Document grid:** 12-column, 1200px max-width, `gap: space.lg (24px)`
- **Canvas:** Full viewport — no grid constraint; affine transform coordinate space
- **Panels:** Fixed widths — left dock `240px`, right dock `320px`, bottom dock `collapsible (240px default)`

### 8.2 Breakpoints

| Name | Min-width | Usage |
|---|---|---|
| `sm` | 640px | Mobile breakpoints |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop (primary target) |
| `xl` | 1280px | Wide desktop |

### 8.3 Directional Rule (HARDLOCK)

**ALL directional styling must use logical properties.** No exceptions.

| ❌ Forbidden | ✅ Required |
|---|---|
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-left` | `padding-inline-start` |
| `padding-right` | `padding-inline-end` |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `left: 0` | `inset-inline-start: 0` |
| `border-right` | `border-inline-end` |

Tailwind class equivalents: `ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`.

---

## 9. Component Specifications

### 9.1 Canvas Node

```
border-radius:  var(--ds-radius-md)          /* 6px */
border:         1px solid var(--ds-border)
background:     var(--ds-surface)
padding:        var(--ds-space-3) var(--ds-space-4)   /* 12px 16px */
min-width:      180px
min-height:     80px
font-size:      var(--ds-text-sm)
font-weight:    var(--ds-weight-medium)
color:          var(--ds-text-primary)

/* Active */
border-color:   var(--dv-node-border-active)
box-shadow:     var(--ds-shadow-active-node)

/* Hardlock failure */
border-color:   var(--dv-node-border-hardlock)
```

### 9.2 Bezier Wire

```
stroke:           var(--dv-wire-navigational)   /* color by type */
stroke-width:     1.5px
stroke-dasharray: 6 4                           /* animated dash flow */
fill:             none
animation:        dash-flow 1.5s linear infinite
```

### 9.3 Panel / Dock

```
background:     var(--ds-surface)
border-inline-end: 1px solid var(--ds-border)   /* left dock */
border-inline-start: 1px solid var(--ds-border) /* right dock */
padding:        var(--ds-space-6)                /* 24px inner breathing */
```

### 9.4 Button — Primary

```
background:     var(--ds-primary)
color:          #09090B                          /* pitch dark on cyan */
padding:        var(--ds-space-2) var(--ds-space-4)
border-radius:  var(--ds-radius-md)
font-weight:    var(--ds-weight-semibold)
font-size:      var(--ds-text-sm)

/* Hover */
background:     var(--ds-primary-hover)
/* Focus */
outline:        2px solid var(--ds-primary)
outline-offset: 2px
/* Disabled */
opacity:        0.4
cursor:         not-allowed
```

### 9.5 Status Indicator Pills

```
/* Synced */
background: var(--ds-primary-subtle)
color:      var(--ds-primary)
border:     1px solid var(--ds-primary)

/* Syncing */
background: var(--ds-alert-subtle)
color:      var(--ds-alert)

/* Error */
background: rgba(239,68,68,0.1)
color:      var(--ds-destructive)
```

### 9.6 Timeline Keyframe Diamond `[◆]`

```
fill:           var(--dv-keyframe)
width:          8px
height:         8px
cursor:         ew-resize

/* Hover */
fill:           var(--ds-alert)          /* GateFlow Orange on hover/drag */
transform:      scale(1.3)
```

---

## 10. Accessibility Contract

- **Contrast:** All text/background pairs ≥ 4.5:1 (WCAG 2.2 AA). Enforced via axe-core CI.
- **Focus rings:** `outline: 2px solid var(--ds-primary); outline-offset: 2px` on all interactive elements.
- **Tab order:** Canvas nodes in DOM order; inspector tabs follow visual order.
- **Landmarks:** `<header>`, `<main>`, `<aside aria-label="Property Inspector">`, `<footer aria-label="Motion Studio">`.
- **Motion:** `prefers-reduced-motion` check mandatory on all animated components.
- **SVG assets:** No `<text>` elements; all icons wrapped with `aria-hidden="true"` or `<title>`.

---

## 11. Hardlock Validation Gates

These run on every `pnpm ai:sync` cycle. Failures block `/DEVELOP`:

| Gate | Check | Action on Fail |
|---|---|---|
| Typography fluid | Every font-size uses `clamp()` | Design gate error |
| Spacing baseline | All spacing values in `[0,4,8,12,16,24,32,48,64,96]` | Reverts to nearest 4px |
| Contrast | Foreground/background ≥ 4.5:1 | Restore to secure primitives |
| Logical properties | No `left`/`right`/`ml-`/`pr-` | Blocks `/DEVELOP` |
| Zero-Text assets | No `<text>` in SVG placeholder art | Rejects asset |
| Inner breathing | Panel padding ≥ 24px (`space.lg`) | Warning + auto-correct |
