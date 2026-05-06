# DESIGN.md — COIA Workspace Kit

## Resolved design sources

| Role | Path |
| ---- | ---- |
| Canonical brand library | `.cursor/design/<brand>/` — folder name **is** the brand slug |
| Active brand file | [`.cursor/design/default/design.md`](.cursor/design/default/design.md) |
| Catalog index | [`.cursor/design/catalog.json`](.cursor/design/catalog.json), [`.cursor/design/README.md`](.cursor/design/README.md) |
| Skill procedure | [`.cursor/skills/design-md/SKILL.md`](.cursor/skills/design-md/SKILL.md) |

### Choosing another brand

1. Pick a folder under `.cursor/design/` (see list in [`.cursor/design/README.md`](.cursor/design/README.md)).
2. Update **Active brand** in [`docs/context/project.md`](docs/context/project.md).
3. Refresh token tables and example screens in this file from `.cursor/design/<brand>/design.md`.

**Brand:** Neutral Modern (`default`) — calm B2B/documentation-first; content-first chrome-second.

## Brand & moodboard keywords

Functional, quiet confidence, whitespace-led separation, single cobalt accent per screen, Inter-forward typography.

## Layout archetype

- **Primary:** Documentation and planning spine (`docs/`, `plan/`) — vertical stack, long-form readability.
- **Future product shell:** Multi-page corporate or dashboard entry when an app package lands; **vertical** scroll paradigm (no horizontal storytelling unless a marketing slice explicitly requires it).

## Navigation model

- **Primary:** Top bar or sidebar doc nav — links to `plan/INDEX.md`-mapped phases, specs index, and guides (exact URL scheme deferred until site router exists).
- **Utility:** Repo shortcuts (GitHub), optional search.
- **Footer:** Minimal — version, license, companion-AI upload reminder.
- **Breakpoints:** Align with grid breakpoints below; sticky primary nav optional from `tablet` up.

## Color system (semantic tokens)

Maps the reference palette. **Implement UI via these CSS variables** (no ad-hoc hex in components).

| Token | Role | Value | Notes |
| ----- | ---- | ----- | ----- |
| `--color-bg` | Page background | `#FAFAFA` | Not pure white |
| `--color-fg` | Primary text | `#111111` | Not pure black |
| `--color-accent` | CTAs, links, hero accent | `#2F6FEB` | Max one hero + one CTA accent per view |
| `--color-muted` | Secondary text | `#6B6B6B` | Captions, meta |
| `--color-border` | Hairlines | `#E5E5E5` | Inputs, dividers |
| `--color-surface` | Cards, modals | `#FFFFFF` | Elevated surface |
| `--color-success` | Success | `#17A34A` | |
| `--color-warn` | Warning | `#EAB308` | |
| `--color-danger` | Error/destructive | `#DC2626` | |

**WCAG pairing:** Body text uses `--color-fg` on `--color-bg` / `--color-surface`; accent text on `--color-accent` should maintain ≥4.5:1 (use white `#FFFFFF` on accent for buttons).

## Typography scale

- **Families:** `--font-sans`: `'Inter', -apple-system, system-ui, sans-serif`; `--font-mono`: `ui-monospace, 'JetBrains Mono', monospace`.
- **Weights:** Display/heading 600; body 400.
- **Fluid roles (clamp):** Prefer clamp for display and section titles, e.g. `clamp(1.25rem, 2vw + 0.5rem, 2rem)` for H2 — tune at implementation from scale below.
- **Reference scale (px anchors):** 12 · 14 · 16 · 20 · 24 · 32 · 48 · 64 — map to fluid tokens in code.
- **Line-height:** 1.5 body; 1.2 headings.
- **Letter-spacing:** -0.01em on display sizes ≥32px.

## Motion principles

- **Default:** Only composited properties (`transform`, `opacity`) for UI motion; durations 150–220ms; easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **`prefers-reduced-motion: reduce`:** Replace motion with instant state change or opacity-only cross-fade ≤120ms.
- **Depth:** Raised layer uses subtle shadow: 2px y-offset, 8px blur, foreground at 8% opacity — no neumorphism/glass per reference.

## Imagery & media

- Formats: SVG icons, WebP/AVIF for raster when available; lazy-load below fold.
- Aspect ratios: Hero 16:9 or 4:3; cards 4:3 or 1:1 for thumbnails.

## Breakpoint matrix

| Name | Range | Grid | Gutters |
| ---- | ----- | ---- | ------- |
| `mobile` | &lt; 640px | 4-col | 12px |
| `tablet` | 640px – 1023px | 8-col | 16px |
| `desktop` | 1024px – 1439px | 12-col | 24px |
| `wide` | ≥ 1440px | 12-col, max-width 1200px content | 24px |

Section vertical spacing: desktop 80px block padding; tablet 48px; mobile 32px. Hero target height 40–60vh desktop; 40vh mobile.

## Example pages (text mocks)

### Page: Home / kit overview

1. Hero: H1 “Specification-driven delivery”; lead line with JTBD; single primary CTA “Open plan index” (`--color-accent`).
2. Three tiles: Onboarding, Plan phases, Design gates — link placeholders.
3. Footer strip with repo metadata.

### Page: Plan phase (template)

1. H1 phase name; breadcrumb placeholder.
2. Table or list of PT-IDs from `plan/*/TASKS.md` scoping.
3. “Gate status” callout using `--color-surface` card.

### Page: Docs / spec deep-dive

1. Sidebar TOC placeholder.
2. Article body using body type scale; code blocks in `--font-mono`.

## Component inventory

| Component | Variants / states | Token / behavior notes |
| --------- | ------------------ | ------------------------ |
| `Button` | primary, secondary, ghost, disabled, loading | Primary fill `--color-accent` + white label; secondary 1px `--color-border`; focus ring 2px on `--color-accent` |
| `Card` | default, interactive | `--color-surface`, 1px `--color-border`, radius 12px, padding 20px |
| `Input` | default, focus, error | Border `--color-border`; focus ring cobalt; error text `--color-danger` |
| `Link` | default, hover | `--color-accent`; underline on hover only |
| `NavItem` | active, inactive | Active bottom border or pill using `--color-accent` |

## Token mapping obligation

Until a generated `tokens.css` exists, components MUST reference the variables in the **Color system** table above. Any new hex must be added first to this document and the semantic token table before use in code.
