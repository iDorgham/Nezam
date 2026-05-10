---
name: openrouter
description: Multi-model routing and fallback orchestration using OpenRouter.
version: 1.0.0
updated: 2026-05-10
changelog: []
---

# OpenRouter
## Purpose
Standardize OpenRouter integration for model routing, fallback policies, and cost-aware provider selection.

## Inputs Required
- Feature-level model requirements (quality, speed, budget).
- Candidate models and provider constraints.
- Fallback and degradation policy.
- Safety and logging requirements.

## Step-by-Step Workflow
1. Define routing policy by feature tier and latency budget.
2. Configure primary and fallback model chains.
3. Add guardrails for failures, rate limits, and timeout handling.
4. Instrument responses for cost, latency, and quality tracking.
5. Validate behavior across success, failover, and degraded modes.
6. Document model selection rationale and update triggers.

## Validation Checks
- Fallback routes activate predictably on provider/model failure.
- Feature budgets (cost and latency) are measurable and enforced.
- Prompt or output compatibility is stable across selected models.
- Error handling avoids user-facing dead ends.

## Output Format
- Routing policy matrix by feature.
- Fallback tree and timeout policy.
- Validation report with cost/latency benchmarks.

## Integration Hooks (which agents use this)
- `lead-backend-architect`
- `prompt-engineer`

## Anti-Patterns
- Single-model dependency with no fallback for critical flows.
- Switching models without compatibility and quality checks.
- Cost spikes caused by missing model-tier controls.

## External References (official docs URL from tech stack)
- https://openrouter.ai/docs
