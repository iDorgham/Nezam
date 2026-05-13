# UI/UX Foundation Template

This document defines reusable UI/UX contracts for future projects created from this workspace template.

## 1) Design Token Contract

All visual primitives must be token-driven.

- Colors: semantic roles only (`--color-bg-surface`, `--color-text-primary`, `--color-border-muted`, `--color-accent-primary`)
- Typography: role-based scale (`--font-size-body`, `--font-size-title`, `--font-size-display`) with fluid sizing
- Spacing: scale tokens (`--space-1` through `--space-12`)
- Radius: scale tokens (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`)
- Elevation/shadows: layered tokens (`--shadow-sm`, `--shadow-md`, `--shadow-lg`)
- Z-index: role tokens (`--z-base`, `--z-dropdown`, `--z-sticky`, `--z-modal`, `--z-toast`)
- Breakpoints and containers: governed tokens and named container sizes

Hard rule: no hardcoded spacing, colors, shadows, or breakpoints in component styles.

## 2) Theme Model (Light/Dark)

Use CSS variables as the primary source of truth.

- Define default tokens at `:root`.
- Provide dark overrides via both:
  - `@media (prefers-color-scheme: dark)` (baseline)
  - `[data-theme="dark"]` (explicit user preference)
- Keep semantic token names identical across themes; only values change.

Contrast requirements:

- Body and UI text: WCAG 2.2 AA minimum (4.5:1)
- Critical body text and high-readability contexts: target AAA (7:1)

## 3) RTL/LTR Direction Contract

All components must be direction-safe.

- Use logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`, etc.).
- Avoid physical properties (`left`, `right`, `margin-left`) unless impossible.
- Direction source: nearest `dir` attribute (`ltr` or `rtl`) at app/shell boundary.
- Iconography:
  - Directional arrows/chevrons mirror in RTL.
  - Non-directional icons do not mirror.
- Animations and transforms that imply direction must have RTL variants.

## 4) Layout and Responsiveness Contract

Layout behavior must be container-first and mobile-first.

- Prefer `@container` queries for component-level adaptation.
- Use `@media` fallbacks for environments without container query support.
- Keep dashboard sections grid-based with governed gaps and column spans.
- Use fluid type and spacing with `clamp()` for major display roles.
- Define standard templates:
  - Dashboard shell (sidebar/header/content)
  - Bento-style card grid
  - Dense data panel layout

## 5) Animation and Micro-interaction Contract

Motion should be subtle, performant, and accessible.

- Animate only composited properties by default: `transform`, `opacity`.
- Define tokenized durations/easings (`--motion-duration-fast`, `--motion-ease-standard`).
- Include reduced-motion alternatives for all non-essential motion:
  - `@media (prefers-reduced-motion: reduce)` disables or simplifies transitions.
- Avoid layout-triggering animation unless explicitly justified.
- Use hover/focus/active transitions consistently across interactive controls.

## 6) Component Architecture Contract

Future components should follow variant-driven and typed APIs.

- Public components accept `className`.
- Interactive primitives support keyboard navigation and visible focus.
- Direction compatibility:
  - Components inherit `dir` from parent by default.
  - Components with directional UI expose explicit handling for mirrored behavior.
- Prefer headless primitives + composition patterns over large monolithic widgets.

## 7) Validation Gates (Template Baseline)

Before adoption in a project:

1. Theme parity check (light/dark visual and contrast verification)
2. Direction parity check (`ltr` and `rtl` screenshots/interactive checks)
3. Responsive/container-query behavior check
4. Reduced-motion check
5. Accessibility check (landmarks, focus states, contrast, keyboard flow)
6. Bundle impact check for new component libraries (<= 15% growth unless justified)

## 8) Implementation Mapping (Starter)

- Token values starter: `.nezam/templates/ui-ux/tokens.css`
- Component API starter: `.nezam/templates/ui-ux/COMPONENT_BLUEPRINT.md`
- Validation checklist starter: `.nezam/templates/ui-ux/VALIDATION_CHECKLIST.md`
