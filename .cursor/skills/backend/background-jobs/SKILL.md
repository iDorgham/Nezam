---
name: "nezam-background-jobs"
description: Durable async job orchestration with Trigger.dev and Inngest patterns.
version: 1.0.0
updated: 2026-05-10
changelog: []
---

# Background Jobs
## Purpose
Implement resilient asynchronous workflows using Trigger.dev or Inngest with retries, idempotency, and observability.

## Inputs Required
- Job trigger source (event, schedule, webhook, queue).
- Workflow steps and side effects.
- Retry policy and timeout constraints.
- Idempotency keys and failure handling rules.

## Step-by-Step Workflow
1. Define job boundary and idempotency contract.
2. Model workflow steps with explicit retries and backoff.
3. Add durable state checkpoints and error classification.
4. Wire monitoring and alerting for failed or delayed jobs.
5. Test happy path and failure-recovery scenarios.
6. Document operational runbook and replay instructions.

## Validation Checks
- Job handlers are idempotent across retries.
- Retries, timeouts, and dead-letter behavior are explicit.
- Critical failures emit actionable alerts.
- Replays do not cause duplicate business side effects.

## Output Format
- Job workflow specification.
- Retry and failure policy table.
- Deployment and monitoring checklist.

## Integration Hooks (which agents use this)
- `automation-manager`
- `backend-lead`

## Anti-Patterns
- Running long business-critical tasks in request-response handlers.
- Missing idempotency for payment or mutation jobs.
- Silent failures without ownership and alert routing.

## External References (official docs URL from tech stack)
- https://trigger.dev/docs
- https://www.inngest.com/docs
