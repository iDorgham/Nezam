# Layout, RTL, and Motion Rules

Template-level implementation rules for responsive layout, bidirectional support, and micro-interactions.

## 1) Layout recipes

## Dashboard shell

- Structure: header + optional sidebar + content region
- Content region uses tokenized spacing and a 12-column responsive grid
- Minimum recipes:
  - Mobile: 1 column
  - Tablet: 6 columns
  - Desktop: 12 columns

## Bento grid

- Cards span controlled column/row patterns
- Use token-based gaps only
- Prefer content-first sizing; avoid fixed heights unless data visualization requires it

## Data-dense panel layout

- Prioritize readability with consistent rhythm
- Sticky controls only when essential
- Ensure keyboard focus order follows visual flow

## 2) Container query first

- Components should adapt from parent container width, not viewport alone.
- Use named container breakpoints where possible.
- Provide `@media` fallback styles for legacy support.

Example policy:

- Base styles -> `@container (min-width: 36rem)` -> `@container (min-width: 56rem)`
- Fallback mirrors major adjustments with `@media (min-width: var(--bp-md))` and `@media (min-width: var(--bp-lg))`

## 3) RTL/LTR behavior

- All spacing and alignment must use logical properties.
- Direction must be inherited from app root and overridable at section scope.
- Direction-sensitive transforms must have mirrored variants.

Mirroring checklist:

1. Chevron/arrow icon direction
2. Slide/fly-in transforms
3. Inline paddings and margins
4. Alignment (`start`/`end` instead of `left`/`right`)
5. Tooltip/popover preferred side logic

## 4) Motion and micro-interaction standards

- Prefer CSS transitions for small interactions.
- Reserve JS animation libraries for complex sequencing only.
- Animate `transform` and `opacity` by default.
- Use duration/easing tokens from `tokens.css`.

Interaction states:

- Hover: subtle elevation or tint shift
- Focus-visible: clear high-contrast ring
- Active/pressed: short-scale or depth feedback
- Disabled: reduced contrast and interaction lock

Reduced-motion:

- Respect `@media (prefers-reduced-motion: reduce)`.
- Replace movement-heavy effects with opacity/state swaps.

## 5) Performance guardrails

- No animation that causes layout thrash by default.
- Scope `will-change` to active interaction windows only.
- Avoid long-running infinite animations on key surfaces.
- Target 60fps for interactive transitions under normal hardware conditions.
