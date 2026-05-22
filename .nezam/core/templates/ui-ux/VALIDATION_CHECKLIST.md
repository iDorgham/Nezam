# UI/UX Validation Checklist (Template)

Use this checklist before promoting template UI contracts into a product repo.

## Theme and contrast

- [ ] Light theme tokens render correctly across primary surfaces.
- [ ] Dark theme tokens render correctly across primary surfaces.
- [ ] Text contrast meets WCAG 2.2 AA (>= 4.5:1) for normal text.
- [ ] Critical reading surfaces target AAA (>= 7:1) where practical.

## RTL/LTR parity

- [ ] `dir="ltr"` and `dir="rtl"` views both render without layout breakage.
- [ ] Directional icons/arrows mirror correctly in RTL.
- [ ] Inline alignment uses logical start/end behavior.
- [ ] Direction-sensitive transitions have mirrored behavior.

## Responsive and container queries

- [ ] Component behavior adapts through `@container` breakpoints.
- [ ] `@media` fallbacks exist for critical responsive behavior.
- [ ] Dashboard and bento patterns preserve spacing rhythm across sizes.

## Motion and accessibility

- [ ] Hover/focus/active states are present on all interactive controls.
- [ ] Motion uses `transform`/`opacity` by default.
- [ ] Reduced-motion mode is supported via `prefers-reduced-motion`.
- [ ] Focus-visible styles remain clear in both light/dark and LTR/RTL.

## Component architecture

- [ ] Reusable components support `className` passthrough.
- [ ] Variant contracts are typed and predictable (CVA-friendly).
- [ ] Interactive primitives support keyboard access and labels.

## Performance and bundle governance

- [ ] No new animation pattern triggers avoidable layout thrash.
- [ ] `will-change` is scoped and temporary when used.
- [ ] UI component library additions do not increase client bundle by >15% without approved justification.

## Suggested validation commands (project-level when scaffolded)

- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- `pnpm run scan:a11y` (if present)
- `pnpm run scan:perf` (if present)
