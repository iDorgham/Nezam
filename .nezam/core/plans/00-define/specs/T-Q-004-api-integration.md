---
spec_id: SPEC-QA-004
feature: API route integration tests for design-hub handlers
status: approved
spec_version: 0.1.0
phase: phase_3
owner: api-logic-manager
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: The empty stubs tests/integration/api/{canvas,assets,presets}.test.ts are implemented to exercise their app/api route handlers for happy-path 2xx responses with valid payloads.
  - id: AC-002
    description: Each route is tested for malformed/invalid input returning a 4xx with a structured error body, never a 5xx or unhandled throw.
  - id: AC-003
    description: The lock and context routes (app/api/lock/route.ts, app/api/context/route.ts) gain integration coverage asserting they read/write through their lib layer without leaking filesystem errors.
---

# T-Q-004 — API integration tests

## Context
`app/api/` has 13 route handlers; only three integration stubs exist and all are 0 bytes.
Phase 3 implements real coverage by invoking the exported route handlers (GET/POST) directly
with constructed `Request` objects under the vitest node environment.

## Target files
- `app/api/canvas/route.ts`, `app/api/canvas/node/route.ts`
- `app/api/assets/upload/route.ts`
- `app/api/presets/route.ts`, `app/api/presets/save/route.ts`
- `app/api/lock/route.ts`, `app/api/context/route.ts`
- Stubs: `tests/integration/api/canvas.test.ts`, `assets.test.ts`, `presets.test.ts`

## Test plan
1. Import the route handler; call with a `new Request(url, { method, body })`.
2. Assert status + parsed JSON shape for valid and invalid inputs.
3. Mock the Vercel Blob / fs boundary so tests are hermetic.

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | happy-path 2xx | canvas/assets/presets routes |
| AC-002 | invalid input → 4xx | all tested routes |
| AC-003 | lock/context hardened | lock + context routes |
