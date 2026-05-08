---
name: coi-api-gateway
description: Rate limiting, auth middleware, request transformation, routing policies, and gateway resilience.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Specify the API gateway/edge policy: routing, rate limits, auth enforcement, request/response transformation, and resilience controls (retries, circuit breakers, timeouts). Single-responsibility: edge policy spec.

# Inputs

- API contract from `@.cursor/skills/coi-api-design/SKILL.md`.
- Auth model from `@.cursor/skills/coi-auth-workflows/SKILL.md`.
- Cache policy from `@.cursor/skills/coi-cache-strategies/SKILL.md`.
- Hosting target (Vercel, Cloudflare, AWS API Gateway, Kong, Envoy).

# Step-by-Step Workflow

1. Choose gateway: Vercel Edge Functions / Cloudflare Workers / AWS API Gateway HTTP API / Kong / Envoy — based on traffic, latency, ecosystem.
2. Define routing: hostname → service mapping; path-based vs header-based routing.
3. Configure rate limits per consumer + per route; choose token-bucket or fixed-window.
4. Enforce auth: JWT verification, API key, mTLS for service-to-service; reject before backend hop.
5. Configure timeouts (read, write, idle), retries (exponential backoff with jitter), circuit breakers (consecutive failures threshold).
6. Apply request transformation: header normalization, body validation, payload size limits.
7. Apply response transformation: CORS, security headers (HSTS, CSP, X-Content-Type-Options), compression.

# Validation & Metrics

- 429 issued before backend overload (rate-limit threshold tested).
- p99 gateway latency < 50ms overhead.
- Circuit breakers trip and recover within documented windows.
- Security headers present on every response.
- All auth failures return 401/403 with problem+json body.

# Output Format

- `docs/core/required/api/gateway-policy.md` (routing, limits, auth, timeouts, transformations).
- Gateway-specific config (`vercel.json`, `wrangler.toml`, `kong.yml`, etc.).
- Rate-limit matrix (consumer × route × limit).
- Resilience parameters table.

# Integration Hooks

- `/PLAN api` produces the policy.
- `/DEVELOP` consumes config (without writing app code here).
- `/SCAN security perf` validates headers and limits.
- Pairs with `@.cursor/skills/coi-api-design/SKILL.md`, `@.cursor/skills/coi-auth-workflows/SKILL.md`, `@.cursor/skills/coi-cache-strategies/SKILL.md`, `@.cursor/skills/coi-cloudflare-edge/SKILL.md`, `@.cursor/skills/coi-vercel-deploy/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- Rate limits enforced only in app code (gateway should reject early).
- No timeouts → upstream hangs propagate.
- Identical retry policy for idempotent and non-idempotent verbs.
- CORS `*` + credentials.
- Auth checks duplicated incorrectly between gateway and service (skew).

# External Reference

- AWS API Gateway HTTP API docs (current).
- Cloudflare Workers + Rate Limiting Rules (current).
- Vercel Edge Middleware (https://vercel.com/docs/functions/edge-middleware) — current.
- Kong Gateway 3.x docs (current).
- Envoy Proxy v1.30+ docs (current).
- OWASP API Security Top 10 (current).
- Closest skills.sh/official analog: api-gateway / edge-policy.
