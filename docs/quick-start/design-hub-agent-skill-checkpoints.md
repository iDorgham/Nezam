# Design Hub Agent/Skill Checkpoints

This file wires the execution tasks to concrete agent and skill checkpoints used during implementation and review.

## Checkpoint Matrix

- `tree-parity-preview`
  - Responsible agent: `lead-frontend-architect`
  - Reviewer agent: `design-excellence-lead`
  - Skills: `nezam-react-architecture`, `nezam-design-to-code-handoff`
  - Exit check: all tree panels share one structural row contract.

- `layer-controls` + `section-dnd`
  - Responsible agent: `frontend-lead`
  - Reviewer agent: `a11y-rtl-integration-engineer`
  - Skills: `nezam-component-library-api`, `nezam-accessibility-audit`
  - Exit check: hide/show, lock/unlock, reorder actions are available and keyboard-safe.

- `wireframe-first-rendering` + `token-theme-propagation`
  - Responsible agent: `react-server-components-expert`
  - Reviewer agent: `token-architect-pro`
  - Skills: `nezam-nextjs-patterns`, `nezam-design-tokens`
  - Exit check: wireframe-session path is first render source; template path remains fallback; theming remains live.

- `topbar-subtab-polish` + `design-excellence-upgrade`
  - Responsible agent: `design-excellence-lead`
  - Reviewer agent: `lead-uiux-designer`
  - Skills: `frontend-design-pro`, `token-grid-typography`
  - Exit check: tab, tree, and control visuals match typography/spacing/motion/icon standards.

- `premium-mode-checklist`
  - Responsible agent: `token-architect-pro`
  - Reviewer agent: `a11y-performance-auditor`
  - Skills: `nezam-design-tokens`, `nezam-a11y-rtl-fusion`
  - Exit check: premium standards tests pass and reduced-motion behavior remains intact.

- `architecture-ia-redesign`
  - Responsible agent: `design-hub-architecture`
  - Reviewer agent: `lead-solution-architect`
  - Skills: `nezam-design-hub`, `nezam-user-flow-mapper`
  - Exit check: + Add types work; services in rack only; wireframe trees exclude `service`; onboarding shows profiles + page packs.

- `components-top-level-tab`
  - Responsible agent: `design-hub-components`
  - Reviewer agent: `design-systems-token-architect`
  - Skills: `nezam-component-library-api`, `nezam-shadcn-ui`
  - Exit check: Components is a top-level hub section; Preview sub-tabs are Preview + Sections only.

- `layout-catalog-integration`
  - Responsible agent: `token-architect-pro`
  - Reviewer agent: `design-excellence-lead`
  - Skills: `nezam-design-tokens`, `nezam-css-architecture`
  - Exit check: Layout presets load from `layout-catalog.json` via `catalog.ts`; title/button hints visible in Layout editor.

- `developer-services-catalog`
  - Responsible agent: `design-hub-architecture`
  - Reviewer agent: `integration-architecture-manager`
  - Skills: `nezam-design-hub`, `nezam-multi-agent-handoff`
  - Exit check: `developer-services-catalog.json` (80+ providers); rack uses catalog picker; instance `wiredServiceIds`; right-rail `ServiceIntegrationGuide`; `pnpm test` + `pnpm build` pass.

## Required Verification Sequence

1. Unit tests (`pnpm test`)
2. Type/build checks (`pnpm build`)
3. Lint checks for changed files
4. Manual review: Architecture rack, + Add menu, onboarding page packs, Components tab theme live

