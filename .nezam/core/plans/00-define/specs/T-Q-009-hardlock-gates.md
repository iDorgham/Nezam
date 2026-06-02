---
spec_id: SPEC-QA-009
feature: Hardlock / SDD gate behavior tests
status: approved
spec_version: 0.1.0
phase: phase_3
owner: lead-qa-architect
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: Tests for src/lib/hardlock-check.ts assert that a missing or invalid wireframes_locked.json blocks the develop transition and a valid lock permits it.
  - id: AC-002
    description: The empty stub tests/unit/lib/hardlock-check.test.ts is implemented to cover pass, missing-artifact, and malformed-artifact paths with explicit violation messages.
  - id: AC-003
    description: A test asserts the gate ordering invariant — develop cannot proceed unless planning_complete is true and all required SDD artifacts resolve — mirroring check-wireframes-lock.js / check-onboarding-readiness.sh semantics.
---

# T-Q-009 — Hardlock / SDD gate tests

## Context
The SDD hardlock is the safety mechanism that blocks development when planning artifacts are
incomplete. `src/lib/hardlock-check.ts` (with the 0-byte stub
`tests/unit/lib/hardlock-check.test.ts`) and the root gate scripts
(`check-wireframes-lock.js`, `check-onboarding-readiness.sh`) encode these rules — they must be
tested so the gate cannot silently regress.

## Target files
- `src/lib/hardlock-check.ts`
- `wireframes_locked.json` (fixture input)
- `.nezam/core/scripts/checks/check-wireframes-lock.js` (reference semantics)
- Stub to fill: `tests/unit/lib/hardlock-check.test.ts`

## Test plan
1. Provide valid lock fixture → assert gate passes.
2. Remove / corrupt the lock → assert gate blocks with a violation message.
3. Assert planning_complete + artifact-presence invariant is enforced before transition.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | lock gates transition | hardlock-check.ts |
| AC-002 | all paths covered | hardlock-check.test.ts |
| AC-003 | gate ordering invariant | hardlock + gate scripts |
