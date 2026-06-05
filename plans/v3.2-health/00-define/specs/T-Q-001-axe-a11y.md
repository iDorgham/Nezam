---
spec_id: SPEC-QA-001
feature: Automated axe-core accessibility coverage for design-hub UI
status: approved
spec_version: 0.1.0
phase: phase_3
owner: a11y-performance-auditor
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A vitest-axe smoke test renders every interactive primitive in src/components/ui (button, input, select, switch, tabs, dialog, dropdown-menu, tooltip) and asserts toHaveNoViolations under happy-dom.
  - id: AC-002
    description: The suite runs via `pnpm --filter design-hub test` and a dedicated `test:a11y` script, exiting non-zero on any serious or critical axe violation.
  - id: AC-003
    description: WCAG 2.2 AA contrast is verified for token-driven color pairs by exercising src/lib/color-a11y.ts, reusing the existing color-a11y.wcag.test.ts pattern with no hardcoded hex.
---

# T-Q-001 — axe-core accessibility coverage

## Context
`.nezam/design-hub` already ships `axe-core@4.10.3` + `vitest-axe@0.1.0` and a single smoke
test (`src/test/ui-button.a11y.test.tsx`). Phase 3 extends this into systematic coverage of
the interactive UI primitives so a11y regressions fail CI rather than ship.

## Target files
- `src/components/ui/*.tsx` (button, input, select, switch, tabs, dialog, dropdown-menu, tooltip, label)
- `src/lib/color-a11y.ts` (existing WCAG contrast helper)
- New: `src/test/ui-primitives.a11y.test.tsx`
- Existing pattern: `src/test/color-a11y.wcag.test.ts`, `src/test/ui-button.a11y.test.tsx`

## Test plan
1. For each primitive, render a labeled instance and run `axe(container)`.
2. Assert `expect(results).toHaveNoViolations()`.
3. Gate on serious/critical impact; document any allowed best-practice exceptions inline.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | No axe violations on primitives | `src/components/ui/*` |
| AC-002 | CI gate exits non-zero | `package.json` test:a11y |
| AC-003 | WCAG 2.2 AA contrast | `src/lib/color-a11y.ts` |
