# Purpose
Build a consistent, typed, token-driven React component library with reusable variant APIs and Storybook-ready documentation.

# Activation & precedence
- Activate during `/PLAN design` and before `/DEVELOP` for reusable UI component work.
- This skill defines deterministic component API completion criteria.
- If guidance conflicts, follow `.cursor/rules/design-dev-gates.mdc` first, then this skill.

# Inputs
- `DESIGN.md` component anatomy and visual behavior.
- Token contracts from `@token-grid-typography`.
- Interaction and motion specs from `@motion-3d-progressive`.
- Accessibility requirements and keyboard interaction expectations.
- Feature-level component specs and acceptance criteria.

# Step-by-Step Workflow
1. Define component taxonomy: primitives (`Button`, `Input`), composites (`Card`), and layout sections (`Section`).
2. Establish API conventions:
   - typed props interfaces
   - constrained variant unions
   - `forwardRef` for focus/control composition
   - semantic element override when needed
3. Bind style system to CSS variables only; consume semantic tokens rather than base token literals.
4. Implement accessibility contracts:
   - ARIA roles/attributes where necessary
   - keyboard navigation patterns
   - visible focus rings and focus management
5. Add motion hooks as optional, progressive layers; ensure reduced-motion-safe defaults.
6. Ensure tree-shakeable exports with per-component entry points and barrel strategy that does not force full imports.
7. Author Storybook argTypes and stories for all variants/states (default, hover, focus, disabled, loading, invalid).
8. Add snapshot/interaction test scaffolding for critical behavior.
9. Validate naming and usage consistency against `DESIGN.md`.

# Validation & Metrics
- Type safety: strict prop typing with no `any` leakage in public API.
- Accessibility: keyboard and focus behavior verified for interactive components.
- Performance: tree-shaking validation and component-level bundle size checks.
- Consistency: all component style values sourced from token variables.
- UX quality: state coverage across stories and test cases.
- Stability: no breaking API changes without migration notes.

# Deterministic completion checklist
- Public components expose typed variant-driven props.
- Interactive primitives use `forwardRef`.
- Accessibility contracts define keyboard behavior, ARIA semantics, and visible focus states.
- Export strategy supports tree-shaking (per-component entry points).
- Story coverage includes default/hover/focus/disabled/loading/invalid states.

# Output Format
- `components/<Name>/<Name>.tsx` (typed component)
- `components/<Name>/<Name>.styles.css` (token-driven styles)
- `components/<Name>/index.ts` (tree-shakeable export)
- `components/<Name>/<Name>.stories.tsx` (Storybook with argTypes)
- `components/<Name>/<Name>.spec.tsx` (behavior test stub)
- `docs/specs/features/<id>-<slug>/COMPONENT_API.md` (API contract)

# Integration Hooks
- `/PLAN design`: validate API shapes before coding.
- `/DEVELOP`: generate components only after token and motion specs are ready.
- `/SCAN code|a11y`: enforce API and accessibility standards.
- CI: type-check, story coverage, and export-size checks.
- `DESIGN.md`: update when variants/states are added or removed.
