---
spec_id: SPEC-UX-001
feature: UX state coverage — loading, error, and not-found boundaries
status: approved
spec_version: 0.1.0
phase: phase_4
owner: lead-uiux-designer
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: Next.js App Router loading.tsx and error.tsx boundaries are added at the app root using the existing Skeleton/Spinner primitives, with no raw hex/px primitives (tokens only).
  - id: AC-002
    description: A not-found.tsx is added using the existing EmptyState component so unknown routes render a branded, accessible empty state rather than the default.
  - id: AC-003
    description: A render test asserts loading and not-found boundaries mount without error and expose accessible status/heading semantics (role=status or an aria-labelled heading).
---

# T-P4-003 — UX states (loading / error / not-found)

## Context
`app/` has no `loading.tsx`, `error.tsx`, or `not-found.tsx`. The design-hub already ships
`Skeleton`, `Spinner` (src/components/ui) and `EmptyState` (components/ui) primitives — Phase 4
wires them into the App Router state conventions so navigation, failures, and bad routes are
polished and accessible.

## Target files
- New: `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`
- `src/components/ui/{skeleton,spinner}.tsx`, `components/ui/EmptyState.tsx`
- New: `src/test/ux-states.test.tsx`

## Test plan
1. Build loading/error/not-found using existing primitives + design tokens (no primitives).
2. Render loading + not-found; assert they mount and expose status/heading semantics.
3. `error.tsx` is a client boundary with a reset action; verified for mount + accessible button.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | loading/error added, token-only | app/loading.tsx, app/error.tsx |
| AC-002 | branded not-found | app/not-found.tsx |
| AC-003 | a11y status/heading | ux-states.test.tsx |
