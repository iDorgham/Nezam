---
spec_id: SPEC-QA-004
feature: API route integration tests for design-hub handlers
status: approved
spec_version: 0.2.0
phase: phase_3
owner: api-logic-manager
assigned_tool: claude
acceptance_criteria:
  - id: AC-001
    description: "Reserved placeholder routes (canvas, canvas/node, assets/upload, presets, presets/save) are contract-tested to return a controlled 501 'not_implemented' envelope — never a 5xx crash — pinning the reserved behavior."
  - id: AC-002
    description: "Real routes are tested for invalid input returning a controlled status: app/api/lock returns 422 on missing tokens / empty sitemap (before any write); app/api/context coerces malformed-but-valid JSON to a safe empty shape and returns a controlled envelope on unparseable JSON."
  - id: AC-003
    description: "app/api/context GET/POST coverage uses a mocked @/lib/paths tmp target so tests never overwrite repo-root project_context.json / DESIGN.md / wireframes_locked.json; lock happy-path writes are intentionally excluded from this suite to avoid clobbering root artifacts."
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
