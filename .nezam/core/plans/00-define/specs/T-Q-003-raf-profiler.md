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
    description: scheduleIdleWork (src/lib/preview/schedule-idle.ts) defers work via requestIdleCallback when available and falls back to a setTimeout, verified with a faked idle/timer clock.
  - id: AC-002
    description: Scrubber (src/components/ui/Scrubber.tsx) coalesces input by value-equality (no onChange when the computed value is unchanged) and clamps to min/max on keyboard increment.
  - id: AC-003
    description: scheduleIdleWork invokes its callback exactly once per schedule (no double-dispatch across the idle and fallback paths).
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
