---
spec_id: SPEC-QA-002
feature: RTL (right-to-left) rendering audit for design-hub layout and primitives
status: approved
spec_version: 0.1.0
phase: phase_3
owner: rtl-layout-specialist
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A test renders the sidebar shell layout and key primitives under dir="rtl" and asserts logical-property-driven layout (no left/right physical hardcoding leaks into computed inline styles).
  - id: AC-002
    description: The audit verifies src/lib/wireframe/sidebar-shell-layout.ts resolves mirrored geometry consistently for rtl and ltr inputs.
  - id: AC-003
    description: A static check fails when physical-direction CSS (margin-left, padding-right, left:, right:) is introduced in src/styles or component style props instead of logical properties (margin-inline, inset-inline).
---

# T-Q-002 — RTL rendering audit

## Context
NEZAM targets MENA markets; RTL correctness is a first-class quality gate. The design-hub
shell and primitives must mirror under `dir="rtl"` using logical properties, not physical ones.

## Target files
- `src/lib/wireframe/sidebar-shell-layout.ts` (existing `sidebar-shell-layout.test.ts`)
- `src/styles/canvas.css`, `src/styles/tokens.css`
- `src/components/ui/*` rendered with a `dir="rtl"` wrapper
- New: `src/test/rtl-layout.audit.test.tsx`

## Test plan
1. Render shell + primitives inside `<div dir="rtl">`; snapshot computed layout fields.
2. Assert `sidebar-shell-layout.ts` produces mirrored insets for rtl vs ltr.
3. Grep-style guard over `src/styles` + inline styles for physical-direction CSS.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | rtl render is logical | shell + primitives |
| AC-002 | mirrored geometry | sidebar-shell-layout.ts |
| AC-003 | no physical CSS | src/styles, component props |
