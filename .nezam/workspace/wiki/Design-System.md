# Design System

NEZAM enforces a **token-first design governance** model. No UI decisions are made without a locked design contract (`DESIGN.md` at repo root).

## Core Principle

> Design gates block development. Tokens are locked before components are built. Components are approved before pages are assembled.

## Design Profiles

Design profiles live in `.nezam/design/<brand>/design.md`. Each profile defines:

- Color tokens (primitive and semantic)
- Typography scale (font families, sizes, weights, line heights)
- Spacing grid (base unit, scale)
- Border radius system
- Shadow system
- Motion/animation tokens
- Dark mode parity requirements

## Applying a Design Profile

```bash
pnpm run design:apply -- <brand>
```

Example:
```bash
pnpm run design:apply -- minimal
```

This copies the profile to `DESIGN.md` at the repo root, which becomes the active design contract.

## Design Gates

Before any frontend implementation begins, the following must pass:

```bash
pnpm run check:tokens    # Validates design tokens
pnpm run check:a11y      # Contrast, touch targets, focus
```

These also run in CI via `.github/workflows/design-gates.yml`.

## Token Naming Convention

Tokens follow a three-tier hierarchy:

```
primitive → semantic → component

primitive:  --color-blue-500: #3b82f6
semantic:   --color-brand-primary: var(--color-blue-500)
component:  --button-bg-default: var(--color-brand-primary)
```

See `docs/templates/ui-ux/TOKEN_NAMING.md` for the full convention.

## Dark Mode

Every token must have a dark mode equivalent. The design contract enforces:
- No hardcoded color values in components
- All tokens defined for both light and dark schemes
- Contrast ratio ≥ 4.5:1 for text (WCAG AA)

## RTL Support

All layout tokens and components must support RTL (right-to-left) rendering for Arabic content. See `docs/templates/ui-ux/LAYOUT_RTL_MOTION.md`.

## Component Blueprint Format

New components follow the blueprint template at `docs/templates/ui-ux/COMPONENT_BLUEPRINT.md`:

```markdown
## Component: [Name]
Status: [Draft | Review | Approved]
Design tokens used: [list]
States: [default, hover, active, disabled, error, loading]
A11y: [ARIA roles, keyboard nav]
RTL: [handled | not applicable]
Dark mode: [handled | not applicable]
```

## Design Reports

CI generates reports in `docs/reports/`:

| Report | Path | Trigger |
|---|---|---|
| Token audit | `docs/reports/perf/TOKEN_AUDIT.latest.md` | On push |
| Color sync | Generated from template | On design change |
| A11y | `docs/reports/a11y/` | On push |
| Lighthouse | `docs/reports/lighthouse/` | On PR |
