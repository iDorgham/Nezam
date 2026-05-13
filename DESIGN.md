# Design System — NEZAM Workspace Kit

> Profile: minimal  
> Category: Modern & Minimal  
> Applied: 2026-05-13 via /START gates fix  
> Status: **LOCKED**

Stripped-back design emphasizing whitespace, clean typography, and restrained color for maximum clarity and focus. Optimized for developer tooling and documentation interfaces.

---

## 1. Visual Theme & Atmosphere

- **Visual style:** minimal, clean, monochrome
- **Color stance:** high contrast, neutral-first, accent-sparse
- **Design intent:** Keep outputs recognizable to this style family while preserving usability and readability.

---

## 2. Color

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#0C0C09` | CTA, headings, active states |
| `--color-secondary` | `#312C85` | Accent, links, highlights |
| `--color-success` | `#16A34A` | Gate pass, confirmations |
| `--color-warning` | `#D97706` | Soft warnings, cautions |
| `--color-danger` | `#DC2626` | Gate fail, errors |
| `--color-surface` | `#F4F4F1` | Backgrounds, cards |
| `--color-text` | `#0C0C09` | Body copy |
| `--color-muted` | `#6B7280` | Secondary text, captions |
| `--color-border` | `#E5E7EB` | Dividers, input borders |

**Dark mode equivalents required for all tokens above.**

- Favor Primary (`#0C0C09`) for CTA emphasis.
- Use Surface (`#F4F4F1`) for large backgrounds and cards.
- Keep body copy on Text (`#0C0C09`) for legibility (AA contrast minimum).

---

## 3. Typography

| Role | Family | Weight | Size |
|---|---|---|---|
| Display | Inter | 700–900 | clamp(2rem, 5vw, 4rem) |
| Heading | Inter | 600–700 | clamp(1.25rem, 3vw, 2rem) |
| Body | Open Sans | 400 | 1rem / 1.6 line-height |
| Code | Inconsolata | 400 | 0.9rem |
| Caption | Open Sans | 400 | 0.8rem |

- Headings carry style personality; body optimizes scanability.
- Use fluid `clamp()` sizing for display and heading levels.

---

## 4. Spacing & Grid

- **Base unit:** 4px
- **Scale:** `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96`
- Named steps: `xs=4` `sm=8` `md=16` `lg=24` `xl=32` `2xl=48`
- Keep vertical rhythm consistent across sections and components.
- Align columns and modules to a predictable grid; avoid ad-hoc offsets.

---

## 5. Typography — Fluid Type Scale

```css
--text-xs:      clamp(0.75rem, 1vw, 0.8rem);
--text-sm:      clamp(0.875rem, 1.5vw, 0.9rem);
--text-base:    clamp(1rem, 2vw, 1rem);
--text-lg:      clamp(1.125rem, 2.5vw, 1.25rem);
--text-xl:      clamp(1.25rem, 3vw, 1.5rem);
--text-2xl:     clamp(1.5rem, 4vw, 2rem);
--text-3xl:     clamp(2rem, 5vw, 3rem);
--text-display: clamp(2.5rem, 6vw, 4rem);
```

### 5.1 Fluid type scale

Applied via CSS `clamp()` across all heading levels. Values above are the canonical source.

### 5.2 Breakpoint and container-query matrix

| Breakpoint | Token | Width |
|---|---|---|
| Mobile | `--bp-sm` | 640px |
| Tablet | `--bp-md` | 768px |
| Desktop | `--bp-lg` | 1024px |
| Wide | `--bp-xl` | 1280px |
| Ultra | `--bp-2xl` | 1536px |

Container queries preferred over media queries for component-level responsiveness.

---

## 6. Components

Core component list derived from NEZAM product type (developer tooling / docs):

- **Navigation:** top bar + sidebar (collapsible)
- **Command palette:** `/command` trigger overlay
- **Gate status card:** ✅/❌ + progress bar
- **Code block:** syntax highlighted, copy button
- **Phase timeline:** step indicator for SDD pipeline
- **Notification/toast:** success / warning / error variants
- **Modal/dialog:** confirmation, lock ceremony
- **Badge/chip:** phase status, lock status
- **Table:** gate matrix, agent map, CI status
- **Button:** primary / secondary / ghost / destructive

---

## 7. Motion & Interaction

### 7.1 Motion tokens

```css
--duration-fast:   150ms;
--duration-base:   250ms;
--duration-slow:   400ms;
--easing-default:  cubic-bezier(0.4, 0, 0.2, 1);
--easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

- Default to short, purposeful transitions (150–250ms) with stable easing.
- Hover, focus-visible, active, disabled, and loading states must all be explicit.

### 7.3 Progressive 3D fallback specification

- No 3D transforms in v1. Flat design only.
- If 3D is introduced later: provide a `prefers-reduced-motion` fallback that collapses to opacity/translate only.
- All motion must respect `@media (prefers-reduced-motion: reduce)`.

---

## 8. Dark Mode

Dark mode parity is **required**. Every color token must have a dark-mode counterpart:

```css
@media (prefers-color-scheme: dark) {
  --color-surface:  #0d1117;
  --color-text:     #e6edf3;
  --color-border:   #30363d;
  --color-muted:    #8b949e;
  --color-primary:  #f0f0ed;
}
```

---

## 9. RTL Support

RTL layout support is **required** for all directional CSS properties:

- Use `margin-inline-start/end` instead of `margin-left/right`
- Use `padding-inline-start/end` instead of `padding-left/right`
- Use `text-align: start` instead of `text-align: left`
- Test all components in both LTR and RTL viewport

---

## ## Component API and variant map

| Component | Variants | States |
|---|---|---|
| Button | primary, secondary, ghost, destructive | default, hover, active, disabled, loading |
| Badge | success, warning, danger, neutral, locked | — |
| Input | default, error, success | default, focus, disabled |
| Card | flat, elevated, bordered | — |
| Modal | default, confirmation, lock-ceremony | open, closing |

---

## ## Motion and reduced-motion contract

All animated components must:
1. Define transitions using `--duration-*` and `--easing-*` tokens only
2. Wrap animations in `@media (prefers-reduced-motion: no-preference)`
3. Provide a static fallback (instant state change) when reduced-motion is active
4. Never animate more than `opacity`, `transform`, or `clip-path` for performance
