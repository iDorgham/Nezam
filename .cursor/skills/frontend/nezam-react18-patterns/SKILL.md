---
skill_id: nezam-react18-patterns"
name: "nezam-react18-patterns"
description: "Implements React 18+ concurrent features, automatic batching, and modern rendering patterns."
version: 1.0.0
updated: 2026-05-12
changelog:
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial Wave 2 implementation."
owner: "frontend-framework-manager"
tier: 2
sdd_phase: "Development"
rtl_aware: false
certified: true
dependencies: ["frontend/react-architecture"]
---
# React 18+ Concurrent Patterns

## Purpose

Implement modern React (18 and preparing for 19) concurrent features, including automatic batching, `useTransition`, `useDeferredValue`, and new testing patterns to ensure non-blocking UI rendering.

## Trigger Conditions

- Complex state updates causing UI stutter or input lag.
- Expensive rendering lists or heavy data visualization.
- Migration to or optimization of React 18+ codebases.

## Prerequisites

- React 18+ installed.
- Performance bottlenecks identified via profiling.

## Procedure

1. **Automatic Batching:** Rely on React 18's automatic batching for state updates inside promises, timeouts, and native event handlers. Remove legacy `unstable_batchedUpdates`.
2. **Transitions (`useTransition`):** Wrap non-urgent state updates (like filtering a large list or navigating tabs) in `startTransition`. Keep inputs completely responsive while the transition renders in the background.
3. **Deferred Values (`useDeferredValue`):** Use `useDeferredValue` for receiving props from the top down that shouldn't block the current render (e.g., deferred search query passed to a heavy list component).
4. **Suspense boundaries:** Implement `<Suspense>` natively for data fetching and lazy-loaded components to orchestrate loading states smoothly.
5. **Testing Patterns:** Update unit tests to account for concurrent rendering. Use `act()` correctly around transitions and asynchronous updates.

## Output Artifacts

- Optimized React components leveraging `useTransition` / `useDeferredValue`.
- Updated test suites handling concurrent updates.

## Validation Checklist

- [ ] Urgent updates (typing) are never blocked by non-urgent renders.
- [ ] `useTransition` correctly displays `isPending` states.
- [ ] Automatic batching is utilized; redundant renders are eliminated.
- [ ] Suspense fallbacks prevent UI layout shift.

## Handoff Target

`frontend/performance-budget` to verify UX metrics, or `quality/component-testing`.
