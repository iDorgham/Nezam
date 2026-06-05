---
spec_id: SPEC-AX-001
feature: Accessibility coverage for complex Radix UI components
status: approved
spec_version: 0.1.0
phase: phase_4
owner: a11y-performance-auditor
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A vitest-axe suite renders the complex Radix-backed primitives (Dialog, Select, Tabs, DropdownMenu, Tooltip) in a minimal valid composition and asserts toHaveNoViolations for their visible trigger/content.
  - id: AC-002
    description: Each component's trigger exposes an accessible name and is keyboard-focusable; Tabs exposes correct role/aria-selected semantics for the active tab.
  - id: AC-003
    description: The suite is wired into the dedicated test:a11y gate script so the Gate-5 a11y check exercises these components, exiting non-zero on serious/critical violations.
---

# T-P4-001 — a11y for complex Radix components

## Context
Phase 3 (T-Q-001) covered the simple primitives (Button, Input, Switch, Badge). Phase 4 extends
axe + keyboard coverage to the Radix-backed components that render via portals and manage focus:
`dialog`, `select`, `tabs`, `dropdown-menu`, `tooltip`.

## Target files
- `src/components/ui/{dialog,select,tabs,dropdown-menu,tooltip}.tsx`
- New: `src/test/radix-components.a11y.test.tsx`
- Gate: `package.json` `test:a11y` / `a11y:report`

## Test plan
1. Render each component in a minimal valid composition (trigger + content where needed).
2. Run `axe(container)`; assert no serious/critical violations.
3. Assert trigger accessible name + tab/role semantics; add to the a11y gate script.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | no axe violations | Dialog/Select/Tabs/DropdownMenu/Tooltip |
| AC-002 | keyboard + roles | triggers, tablist |
| AC-003 | wired into gate | test:a11y script |
