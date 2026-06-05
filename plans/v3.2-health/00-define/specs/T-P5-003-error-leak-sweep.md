---
spec_id: SPEC-SEC-003
feature: Error-envelope / secret-leakage sweep across real API routes
status: approved
spec_version: 0.1.0
phase: phase_5
owner: lead-security-officer
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: A sweep test forces error paths on the real routes (context unparseable JSON, lock invalid payload) and asserts the JSON error body contains no stack trace ('at ' frames) and no key-like secrets (sk- substrings).
  - id: AC-002
    description: Each tested error response returns a structured envelope with an 'error' string and an appropriate 4xx/5xx status — never an unhandled throw or HTML error page.
  - id: AC-003
    description: The sweep asserts the AI route (already covered by T-Q-007) remains secret-free, consolidating leakage checks across context, lock, and ai/* in one suite.
---

# T-P5-003 — Error / secret-leakage sweep

## Context
T-Q-007 proved the AI routes do not leak the ANTHROPIC_API_KEY. Phase 5 extends the leakage
discipline repo-wide: any real route's error path must return a sanitized structured envelope —
no stack frames, no secret values — consolidated into one security sweep.

## Target files
- `app/api/context/route.ts`, `app/api/lock/route.ts`, `app/api/ai/generate/route.ts`
- New: `src/test/error-leakage.security.test.ts`

## Test plan
1. Trigger error/validation paths on each route.
2. Assert body has `error` string + correct status; no `at ` stack frames; no `sk-` secrets.
3. Keep hermetic (tmp-mock fs paths; no real ANTHROPIC_API_KEY).

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | no stack/secret in errors | context, lock |
| AC-002 | structured envelope + status | all tested routes |
| AC-003 | ai/* stays secret-free | ai/generate |
