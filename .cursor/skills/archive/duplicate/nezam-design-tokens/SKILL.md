---
skill_id: nezam-design-tokens
name: "nezam-Design Token Architecture"
tier: 3
description: W3C-style design tokens, theme switching, fluid typography, and spacing matrices — the design-system core contract. Includes system build and frontend integration workflows.
version: 2.0.0
updated: 2026-06-04
changelog:
  - version: 2.0.0
    date: 2026-06-04
    notes: "Merged full workflow, anti-patterns, external references, System Build Mode, and Frontend Integration Mode from legacy design-tokens skill."
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial stub — hierarchy definition, naming governance, multi-platform strategy."
---
# Design Token Architecture Skill

## Purpose

Build deterministic token manifests, theme scopes, and CSS-variable exports that satisfy token-first gates before `/DEVELOP`. Covers the full stack: token hierarchy governance, system build contracts, and frontend integration direction.

## Inputs

- Repository root `DESIGN.md` sections: Visual Theme, Color Roles, Typography, Layout, Components.
- Existing token drafts (if any) under `.nezam/core/plans/05-design/`.
- SEO/IA constraints affecting content density and hierarchy.
- A11y contrast requirements from `@.cursor/skills/nezam-a11y-automation/SKILL.md`.

## Procedure

### 1. Hierarchy Definition

- **Primitive Tokens (Base):** Raw values (`blue-500`, `spacing-16`). No semantic meaning.
- **Semantic Tokens (Alias):** Meaningful names (`action-primary-bg`, `surface-default-padding`).
- **Component Tokens (Override):** Component-specific (`button-primary-shadow`, `input-border-focus`).

### 2. Naming Governance

- Follow `[Category]-[Property]-[Concept]-[Variant]-[State]`.
- Example: `color-background-primary-hover`.
- Enforce lowercase hyphenated strings. Every semantic token must map to a primitive.

### 3. Multi-Platform Strategy

- CSS Variables for Web.
- XML/JSON for Android/iOS.
- Inline styles/table-constants for Email.
- Single source of truth: `tokens.json` → platform targets via Style Dictionary or Tokens Studio.

### 4. Step-by-Step Workflow

1. Parse semantic roles (`bg`, `fg`, `accent`, `danger`, `surface-*`, `border-*`) and map to base palettes; document base ↔ semantic ↔ component-alias tiers.
2. Create token groups in W3C-format JSON: `color`, `spacing`, `radius`, `elevation`, `zIndex`, `typography`, `motion`, `breakpoint`.
3. Define fluid typography tokens with `clamp(min, preferred, max)` for display, h1–h6, body, label, caption tiers; emit line-height + tracking pairs.
4. Produce breakpoint and container tokens: `mobile → tablet → desktop → wide`.
5. Define theme scopes: `:root` (light), `[data-theme='dark']`, optional `prefers-color-scheme` mirror; ensure swap is paint-only (no layout shift).
6. Export CSS variables (`tokens.css`) and platform manifests (Style Dictionary, Theo, or Tokens Studio export).
7. Component aliases (`--surface-card`, `--text-muted`) protect components from base-token churn.
8. Add token drift checks: lint hardcoded `px`, `rem`, hex outside the token sources.

## Output Artifacts

- `tokens/base.json` (raw scales) and `tokens/semantic.json` (usage semantics).
- `css/tokens.css` (`:root` + theme scopes + dark mode).
- `.nezam/core/plans/05-design/TOKEN_NAMING_CONVENTION.md`: naming rulebook.
- `.nezam/core/plans/05-design/PLATFORM_MAPPING.yaml`: cross-platform token map.
- Updated root `DESIGN.md` reflecting the architectural tiers.
- Token drift checklist (pass/fail).
- Theme switch behavior memo (FOUC prevention strategy).

## Validation & Metrics

- Zero hardcoded `px`/`rem`/hex outside approved token sources.
- Typography scales use `clamp()` for primary roles.
- Theme switching does not cause CLS; FOUC prevented.
- Contrast pairings (token × token) satisfy WCAG 2.2 AA (4.5:1 / 3:1).
- Token traceability to `DESIGN.md` maintained (round-trip identifiable).
- Every semantic token maps to a primitive.
- Naming follows `[Category]-[Property]-[Concept]-[Variant]-[State]`.
- Platform mapping covers all targets in the PRD.

## Anti-Patterns

- Hardcoded hex/px/rem in component styles.
- Single semantic name reused across conflicting roles.
- Theme variables overridden inline at component level.
- Token JSON not exported to platform-native targets.
- Adding a new base token without updating semantic + component alias tiers.

## Integration Hooks

- `/PLAN design` for token planning.
- `/DEVELOP` only after token validation passes.
- `/SCAN code a11y perf` during hardening.
- Pairs with `@.cursor/skills/design/token-grid-typography/SKILL.md`, `@.cursor/skills/design/nezam-component-library-api/SKILL.md`, `@.cursor/skills/design/nezam-motion-3d/SKILL.md`.
- Enforces `[.cursor/rules/design-gates.mdc](.cursor/rules/design-gates.mdc)` Gate 1.

## External References

- W3C Design Tokens Format Module — https://design-tokens.github.io/community-group/format/
- Style Dictionary — https://amzn.github.io/style-dictionary/
- Tokens Studio — https://tokens.studio/
- MDN `clamp()` and `prefers-color-scheme` (current)
- WCAG 2.2 SC 1.4.3 / 1.4.11 (contrast)

---

## System Build Mode

> Use during `/PLAN system` or any design-system alignment pass before `/DEVELOP`.

Create a governed design-system contract that implementation teams can follow without design drift.

### Output artifacts

Create or update:

- `.nezam/core/plans/05-design/UI_FOUNDATION.md`
- `.nezam/core/plans/05-design/tokens.css`
- `.nezam/core/plans/05-design/TOKEN_NAMING.md`
- `.nezam/core/plans/05-design/COMPONENT_BLUEPRINT.md`

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

Pairs with `nezam-wireframe-to-spec`, `token-grid-typography`, `nezam-css-architecture`.

---

## Frontend Integration Mode

> Use during `/PLAN design` or any visual refinement pass before `/DEVELOP`.

Turn `DESIGN.md` intent into production-grade frontend design direction without generic UI output or gate violations.

### Inputs

- Repository root `DESIGN.md` (full document).
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
