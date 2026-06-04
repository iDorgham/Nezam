---
spec_id: SPEC-QA-008
feature: Context compression / overflow handling tests
status: approved
spec_version: 0.1.0
phase: phase_3
owner: prompt-engineer
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: Tests for src/lib/context-compression.ts assert that input under the budget passes through unchanged and input over the budget is compressed/truncated deterministically without dropping required anchors.
  - id: AC-002
    description: The compression boundary is verified at exactly-at-budget, one-over, and far-over sizes, with monotonic output size (never larger than input, never exceeding the cap).
  - id: AC-003
    description: The context route (app/api/context/route.ts) returns a payload within the documented size ceiling for an oversized request and surfaces a truncation indicator rather than failing.
---

# T-Q-008 — Context overflow handling

## Context
`src/lib/context-compression.ts` bounds the context assembled for AI calls. The 0-byte stub
`tests/unit/lib/context-compression.test.ts` must be filled to prove overflow is handled
gracefully — preserving required anchors while staying under the cap.

## Target files
- `src/lib/context-compression.ts`
- `app/api/context/route.ts`
- Stub to fill: `tests/unit/lib/context-compression.test.ts`

## Test plan
1. Characterize current compression at sizes: under, at, +1, and far-over budget.
2. Assert output never exceeds the cap and never exceeds input length.
3. Assert required anchors survive; route returns truncation indicator on overflow.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | passthrough vs compress | context-compression.ts |
| AC-002 | boundary monotonicity | context-compression.ts |
| AC-003 | route stays under ceiling | context route |
