---
spec_id: SPEC-QA-007
feature: Security tests for API hardening — secret hygiene and AI route guardrails
status: approved
spec_version: 0.2.0
phase: phase_3
owner: lead-security-officer
assigned_tool: claude
security: true
acceptance_criteria:
  - id: AC-001
    description: "Tests assert the AI routes (app/api/ai/generate, generate-node, vision-gate) never echo the ANTHROPIC_API_KEY value into responses, returning sanitized error envelopes (no sk- key substrings)."
  - id: AC-002
    description: "app/api/ai/generate returns a controlled 503 ('ANTHROPIC_API_KEY not set') when the credential is missing — no key value, no stack trace; placeholder routes (generate-node, vision-gate) return a controlled 501/405."
  - id: AC-003
    description: app/api/ai/generate validates the prompt (400 on missing/empty) before any model dispatch, and falls back to 503 on missing credential before calling streamText — proving no unbounded prompt forwarding.
---

# T-Q-007 — Security: API hardening

## Context
In design-hub, `app/api/ai/generate` calls Anthropic directly via `@ai-sdk/anthropic` using
`process.env.ANTHROPIC_API_KEY` (the Vercel AI Gateway is used by the separate design-server,
not this app). The route must not leak the key, must validate the prompt before any model
dispatch, and must return sanitized errors. `generate-node` and `vision-gate` are reserved 501
placeholders. Tests assert no secret reaches the client and that validation precedes dispatch.

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
