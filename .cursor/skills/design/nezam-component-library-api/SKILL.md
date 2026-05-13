---
name: nezam-component-library-api
description: Design typed, variant-driven React component APIs with Storybook, forwardRef, tree-shaking, and a11y defaults.
version: 1.1.0
updated: 2026-05-12
changelog:
  - 1.1.0: Added React Email component guidelines.
---
# Purpose

Define reusable React component APIs that are typed, variant-driven, accessible, tree-shakeable, and Storybook-documented. Single-responsibility: component library contract. (Absorbs the previously-proposed `nezam-component-library`.)

# Inputs

- `docs/DESIGN.md` component inventory and states.
- Token contracts from `@.cursor/skills/nezam-pro-design-tokens/SKILL.md`.
- Grid + typography matrix from `@.cursor/skills/token-grid-typography/SKILL.md`.
- UX flows + interaction states from `@.cursor/skills/nezam-ui-ux-design/SKILL.md`.
- A11y plan from `@.cursor/skills/nezam-a11y-automation/SKILL.md`.

# Step-by-Step Workflow

1. Classify components: primitives (Button, Input, Card), composites (Form, DataTable), page sections (Hero, Footer).
2. Define typed props + variants using a system (CVA, vanilla-extract, Stitches, Tailwind class-variance-authority); list every variant + intent + size + tone.
3. Forward refs (`React.forwardRef`) on interactive primitives; expose imperative handles only when required.
4. Specify semantic DOM contracts: `role`, `aria-*`, label association, keyboard shortcuts, focus management, focus return.
5. Map every style decision to token aliases (no hardcoded values); document elevation, spacing, radius, color via tokens.
6. Author Storybook stories with `argTypes` covering every variant + state (default, hover, focus, active, disabled, loading, empty, error, success).
7. Ensure tree-shakeability: no side-effectful module imports; per-component entry; mark `sideEffects: false` where applicable.

# Validation & Metrics

- Every primitive has typed props + complete variant matrix.
- Every interactive primitive has keyboard + focus + ARIA spec.
- 100% of style decisions map to tokens.
- Storybook coverage: every component has stories for every documented state.
- Tree-shake test: removing an unused export drops it from the production bundle.
- A11y baseline passes WCAG 2.2 AA on each component (axe + manual SR checks).

# Output Format

- Per-component spec: API table, variant matrix, state matrix, ARIA contract.
- Storybook configuration + per-component stories.
- Public exports map (no barrel side-effects).
- A11y behavior checklist per component.

# Integration Hooks

- `/PLAN design` and `/DEVELOP` consume the contract.
- `/SCAN code a11y` validates contracts.
- Pairs with `@.cursor/skills/nezam-pro-design-tokens/SKILL.md`, `@.cursor/skills/token-grid-typography/SKILL.md`, `@.cursor/skills/nezam-ui-ux-design/SKILL.md`, `@.cursor/skills/nezam-a11y-automation/SKILL.md`, `@.cursor/skills/nezam-react-architecture/SKILL.md`, `@.cursor/skills/nezam-motion-3d-progressive/SKILL.md`.
- Enforces `[.cursor/rules/design-dev-gates.mdc](.cursor/rules/design-dev-gates.mdc)` Gate 5 and `[.cursor/rules/nezam-design-gates-pro.mdc](.cursor/rules/nezam-design-gates-pro.mdc)`.

# Anti-Patterns

- "Mega-component" with 30+ boolean props.
- Hardcoded colors/spacing inside component CSS.
- Components that own page layout (coupling primitives to pages).
- Missing `forwardRef` on primitives that consumers need to ref.
- Storybook stories that only document the default state.
- Implicit a11y (no documented ARIA roles/keyboard map).

# External Reference

- React 19 docs (https://react.dev/) — current.
- Storybook 8+ (https://storybook.js.org/) — current.
- WAI-ARIA Authoring Practices 1.2+ (https://www.w3.org/WAI/ARIA/apg/) — current.
- class-variance-authority (https://cva.style/) — current.
- Radix Primitives / Headless UI (current) for a11y reference.
- Closest skills.sh/official analog: component-library / design-system-components.

## React Email Components

When building React Email templates:
- Use `shadcn-ui` design tokens for styling consistency.
- Ensure all emails are responsive and tested on mobile devices.
- Follow `backend/resend-email` guidelines for transactional email structure.
