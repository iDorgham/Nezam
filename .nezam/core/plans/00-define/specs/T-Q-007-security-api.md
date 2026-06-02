---
spec_id: SPEC-QA-007
feature: Security tests for API hardening — secret hygiene and AI route guardrails
status: approved
spec_version: 0.1.0
phase: phase_3
owner: lead-security-officer
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: Tests assert the AI routes (app/api/ai/generate, generate-node, vision-gate) never echo provider API keys or raw upstream error bodies into responses, returning sanitized error envelopes instead.
  - id: AC-002
    description: Route handlers validate required env/config presence and fail with a controlled 5xx/4xx (no stack traces, no secret values) when the AI gateway credential is missing.
  - id: AC-003
    description: A test confirms request payload size and schema are validated before any model call is dispatched, preventing unbounded prompt forwarding.
---

# T-Q-007 — Security: API hardening

## Context
The AI routes proxy to the Vercel AI Gateway. They must not leak credentials, must validate
input before dispatch, and must return sanitized errors. Memory notes confirm all model traffic
routes through the AI Gateway with provider strings — tests assert no secret reaches the client.

## Target files
- `app/api/ai/generate/route.ts`
- `app/api/ai/generate-node/route.ts`
- `app/api/ai/vision-gate/route.ts`
- New: `tests/integration/api/ai-routes.security.test.ts`

## Test plan
1. Invoke routes with the gateway credential unset; assert controlled error, no secret/stack.
2. Spy on the response body; assert no `sk-`/key-like substrings and no raw upstream error.
3. Send oversized/invalid payloads; assert rejection before any model dispatch (mocked).

## Traceability
| AC | Verifies | Surface |
|----|----------|---------|
| AC-001 | no secret/raw-error leak | ai/* routes |
| AC-002 | missing-cred fail closed | ai/* routes |
| AC-003 | payload validated pre-dispatch | ai/* routes |
