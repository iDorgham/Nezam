---
name: nezam-pro-design-tokens
description: W3C-style design tokens, theme switching, fluid typography, and spacing matrices — the design-system core contract. Includes merged **system build** and **frontend integration** workflows from archived `design-system-builder` and `frontend-design-pro`.
version: 1.0.0
updated: 2026-05-08
breaking_changes: false
changelog:
  - version: 1.0.0
    date: 2026-05-08
    notes: "Initial version metadata added."
compatible_with:
  - react: ">=18"
  - next: ">=14"
  - node: ">=20"
---

# Purpose

Build deterministic token manifests, theme scopes, and CSS-variable exports that satisfy token-first gates before `/DEVELOP`. Single-responsibility: design-system core (tokens). (Absorbs the previously-proposed `nezam-design-system-core`.)

# Inputs

- `docs/DESIGN.md` sections: Visual Theme, Color Roles, Typography, Layout, Components.
- Existing token drafts (if any) under design/spec docs.
- SEO/IA constraints affecting content density and hierarchy.
- A11y contrast requirements from `@.cursor/skills/nezam-a11y-automation/SKILL.md`.

# Step-by-Step Workflow

1. Parse semantic roles (`bg`, `fg`, `accent`, `danger`, `surface-*`, `border-*`) and map to base palettes; document base ↔ semantic ↔ component-alias tiers.
2. Create token groups in W3C-format JSON: `color`, `spacing`, `radius`, `elevation`, `zIndex`, `typography`, `motion`, `breakpoint`.
3. Define fluid typography tokens with `clamp(min, preferred, max)` for display, h1–h6, body, label, caption tiers; emit line-height + tracking pairs.
4. Produce breakpoint and container tokens: `mobile → tablet → desktop → wide`.
5. Define theme scopes: `:root` (light), `[data-theme='dark']`, optional `prefers-color-scheme` mirror; ensure swap is paint-only (no layout shift).
6. Export CSS variables (`tokens.css`) and platform manifests (Style Dictionary, Theo, or Tokens Studio export).
7. Component aliases (`--surface-card`, `--text-muted`) protect components from base-token churn.
8. Add token drift checks: lint hardcoded `px`, `rem`, hex outside the token sources.

# Validation & Metrics

- Zero hardcoded `px`/`rem`/hex outside approved token sources.
- Typography scales use `clamp()` for primary roles.
- Theme switching does not cause CLS; FOUC prevented.
- Contrast pairings (token × token) satisfy WCAG 2.2 AA (4.5:1 / 3:1).
- Token traceability to `docs/DESIGN.md` maintained (round-trip identifiable).

# Output Format

- `tokens/base.json` (raw scales) and `tokens/semantic.json` (usage semantics).
- `css/tokens.css` (`:root` + theme scopes + dark mode).
- Token drift checklist (pass/fail).
- Theme switch behavior memo (FOUC prevention strategy).

# Integration Hooks

- `/PLAN design` for token planning.
- `/DEVELOP` only after token validation passes.
- `/SCAN code a11y perf` during hardening.
- Pairs with `@.cursor/skills/token-grid-typography/SKILL.md`, `@.cursor/skills/nezam-component-library-api/SKILL.md`, `@.cursor/skills/nezam-motion-3d-progressive/SKILL.md`, `@.cursor/skills/nezam-a11y-automation/SKILL.md`.
- Enforces `[.cursor/rules/design-dev-gates.mdc](.cursor/rules/design-dev-gates.mdc)` Gate 1 and `[.cursor/rules/nezam-design-gates-pro.mdc](.cursor/rules/nezam-design-gates-pro.mdc)`.

# Anti-Patterns

- Hardcoded hex/px/rem in component styles.
- Single semantic name reused across conflicting roles.
- Theme variables overridden inline at component level.
- Token JSON not exported to platform-native targets.
- Adding a new base token without updating semantic + component alias tiers.

# External Reference

- W3C Design Tokens Format Module (https://design-tokens.github.io/community-group/format/) — current.
- Style Dictionary (https://amzn.github.io/style-dictionary/) — current.
- Tokens Studio (https://tokens.studio/) — current.
- MDN `clamp()` and `prefers-color-scheme` (current).
- WCAG 2.2 SC 1.4.3 / 1.4.11 (contrast).
- Closest skills.sh/official analog: design-tokens / design-system.

## System Build Mode

> Merged from archived `design-system-builder`: template-driven contracts before implementation alignment.

Use during `/PLAN system` or any design-system alignment pass before `/DEVELOP`.

### Objective

Create a governed design-system contract that implementation teams can follow without design drift.

### Output artifacts

Create or update:

- `docs/workspace/templates/ui-ux/UI_FOUNDATION.md`
- `docs/workspace/templates/ui-ux/tokens.css`
- `docs/workspace/templates/ui-ux/TOKEN_NAMING.md`
- `docs/workspace/templates/ui-ux/COMPONENT_BLUEPRINT.md`

Include:

1. Token taxonomy — color (semantic roles), typography (roles + clamp strategy), spacing, radius, elevation, z-index.
2. Theme model — light or dark mapping, contrast targets (WCAG 2.2 AA minimum), CSS-variable-first theming with `prefers-color-scheme` baseline.
3. Component primitives — canonical naming; variant and state conventions; CVA-friendly typed APIs with `className` passthrough; direction-aware (`dir`) composition and logical CSS guidance.
4. Motion hooks — approved easing or timing primitives; reduced-motion contract.
5. Implementation constraints — no hardcoded primitives outside token sources.

### Output structure reference

```yaml
token_sets:
  - colors
  - typography
  - spacing
themes:
  - light
  - dark
component_contracts:
  - Button
  - Card
compliance:
  wcag_level: "2.2 AA"
  reduced_motion_required: true
  rtl_support_required: true
```

### Core rules

- Token-first always.
- Accessibility is a system requirement, not optional polish.
- Keep naming consistent with existing component architecture.
- Docs must support FE handoff without ambiguity.

### Dependencies

Pairs with `wireframe-to-spec`, `token-grid-typography`, `css-architecture-runtime`.

## Frontend Integration Mode

> Merged from archived `frontend-design-pro`: gate-aware UI direction tied to tokens.

Turn `DESIGN.md` intent into production-grade frontend design direction without generic UI output or gate violations.

### Inputs

- Repository root `DESIGN.md` (or legacy `docs/DESIGN.md`) full document.
- SEO, IA, and content artifacts from SDD planning stages.
- Existing component constraints and brand priorities.

### Workflow

1. Confirm phase readiness: SEO, IA, and content artifacts exist before visual refinement.
2. Select a coherent design direction (tone, density, typography, color strategy).
3. Map typography and spacing to tokenized scales using `clamp()` and container-aware rules.
4. Define component-level visual patterns tied to variant APIs.
5. Attach motion guidance that respects composited properties and reduced-motion constraints.
6. Document anti-patterns and drift checks for implementation review.
7. Prepare handoff summary for `/DEVELOP` with explicit pass or fail gates.

### Validation targets

- Visual decisions reference tokens, not ad-hoc values.
- LCP `< 2.5s` and CLS `< 0.1` targets preserved in design choices.
- WCAG 2.2 AA contrast and focus visibility documented.
- Motion specs include reduced-motion parity.

### Outputs

- Design direction summary.
- Token-aligned component styling matrix.
- Handoff checklist with blocking and non-blocking findings.

### Integration

- `/PLAN design` as primary entry point.
- `/SCAN perf` + `/SCAN a11y` before phase transition.
- `/FIX` for gate-breaking regressions.

