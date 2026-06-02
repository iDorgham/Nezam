---
spec_id: SPEC-QA-005
feature: Unit-test coverage for design-hub lib and store modules
status: approved
spec_version: 0.1.0
phase: phase_3
owner: lead-qa-architect
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: The empty stubs tests/unit/lib/{canvas-math,token-injection}.test.ts are implemented against src/lib/canvas-math.ts and src/lib/token-injection.ts covering core transforms and edge cases.
  - id: AC-002
    description: The empty store stubs tests/unit/store/{tokens,session}.store.test.ts are implemented against src/store/tokens.store.ts and src/store/session.store.ts asserting state transitions and selectors.
  - id: AC-003
    description: All implemented unit tests pass under `pnpm --filter design-hub test` with zero skipped assertions and no reliance on network or real filesystem.
---

# T-Q-005 — Unit coverage

## Context
`tests/unit/lib` and `tests/unit/store` contain 0-byte stub files. The underlying modules are
real and pure enough to unit-test in happy-dom: `canvas-math.ts`, `token-injection.ts`, and the
Zustand stores `tokens.store.ts` / `session.store.ts`.

## Target files
- `src/lib/canvas-math.ts`, `src/lib/token-injection.ts`
- `src/store/tokens.store.ts`, `src/store/session.store.ts`
- Stubs to fill: `tests/unit/lib/canvas-math.test.ts`, `token-injection.test.ts`,
  `tests/unit/store/tokens.store.test.ts`, `session.store.test.ts`

## Test plan
1. Characterize current behavior of each pure function/store action.
2. Add boundary cases (empty, max, malformed token names, clamping).
3. Keep tests hermetic; reset store state between cases.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | lib transforms | canvas-math, token-injection |
| AC-002 | store transitions | tokens.store, session.store |
| AC-003 | green + hermetic | full unit suite |
