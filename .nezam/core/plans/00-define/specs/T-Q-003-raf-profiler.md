---
spec_id: SPEC-QA-003
feature: requestAnimationFrame / motion frame-budget profiler tests
status: approved
spec_version: 0.1.0
phase: phase_3
owner: motion-performance-specialist
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: A profiler harness wraps src/lib/preview/schedule-idle.ts and asserts work is chunked across frames rather than executed synchronously in a single tick.
  - id: AC-002
    description: Scrubber-driven value updates (src/components/ui/Scrubber.tsx) are verified to coalesce rapid input into at most one update per animation frame via a faked rAF clock.
  - id: AC-003
    description: The test fails if any profiled interaction schedules more than the documented frame budget of callbacks per simulated frame.
---

# T-Q-003 — rAF / motion frame-budget profiler

## Context
Canvas interactions (scrubbing, idle preview hydration) must respect the frame budget to keep
the editor at 60fps. `src/lib/preview/schedule-idle.ts` and `Scrubber.tsx` are the rAF-adjacent
hot paths. happy-dom + a faked `requestAnimationFrame` clock lets us assert scheduling behavior
deterministically without a real browser.

## Target files
- `src/lib/preview/schedule-idle.ts`
- `src/components/ui/Scrubber.tsx`
- New: `src/test/raf-frame-budget.test.ts`

## Test plan
1. Stub `requestAnimationFrame`/`cancelAnimationFrame` with a manual clock.
2. Drive rapid inputs; advance the clock frame-by-frame.
3. Assert coalescing and chunking against the documented budget.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | idle work chunked | schedule-idle.ts |
| AC-002 | input coalesced per frame | Scrubber.tsx |
| AC-003 | budget not exceeded | profiler harness |
