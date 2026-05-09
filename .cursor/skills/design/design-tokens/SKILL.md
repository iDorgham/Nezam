---
name: nezam-pro-design-tokens
description: W3C-style design tokens, theme switching, fluid typography, and spacing matrices — the design-system core contract.
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
