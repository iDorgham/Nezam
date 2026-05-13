---
name: nezam-monitoring-observability
description: OpenTelemetry, structured logging, distributed tracing, and alerting strategy for production observability.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
# Purpose

Specify the observability stack: structured logs, metrics, distributed traces (OpenTelemetry), dashboards, and alert routing. Single-responsibility: observability contract.

# Inputs

- Service inventory + SLOs from `docs/specs/`.
- API + gateway specs.
- Risk register from `@.cursor/skills/nezam-risk-mitigation/SKILL.md`.
- DevOps pipeline + cloud target.

# Step-by-Step Workflow

1. Adopt OpenTelemetry for traces, metrics, and logs; instrument SDK at entry/exit per service.
2. Choose backend: Datadog / Honeycomb / New Relic / Grafana stack / Vercel Observability + Sentry; one source of truth per signal type.
3. Logging: structured JSON, fixed fields (`timestamp`, `level`, `service`, `traceId`, `userId-anon`); never log PII or secrets.
4. Metrics: define USE (Utilization/Saturation/Errors) for resources and RED (Rate/Errors/Duration) for services; emit per-route latency histograms.
5. Tracing: propagate W3C `traceparent` headers; sample at 10–25% baseline + 100% on error.
6. SLOs + alerts: error budgets per service; alert on burn rate (fast: 1h, slow: 6h); page only critical, ticket the rest.
7. Dashboards: per-service overview + system-wide top-N; on-call runbook linked from alert payload.

# Validation & Metrics

- Every service exports OTel traces with end-to-end correlation.
- Logs queryable by `traceId` and `userId` (anon).
- Alert noise ratio (page → real incident) ≥ 70%.
- SLO burn rates surfaced per release.
- Dashboards load < 5s and cover RED for top services.

# Output Format

- `docs/specs/OBSERVABILITY.md` (signals, SDKs, SLOs, alerts).
- OTel collector config.
- Dashboard JSON (vendor-specific).
- Alert routing matrix (severity × channel × team).
- On-call runbook stubs.

# Integration Hooks

- `/SCAN perf security` consumes monitoring data.
- `/SAVE log` records SLO reviews.
- Pairs with `@.cursor/skills/nezam-error-tracking/SKILL.md`, `@.cursor/skills/nezam-performance-optimization/SKILL.md`, `@.cursor/skills/nezam-risk-mitigation/SKILL.md`, `@.cursor/skills/nezam-devops-pipeline/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- Logging unstructured strings ("user X did Y").
- Logging PII or secrets (PII in URLs, full tokens).
- Sampling 100% in production (cost + noise).
- Alerting on every CPU spike (alert fatigue).
- Dashboards no one reviews until an incident.

# External Reference

- OpenTelemetry (https://opentelemetry.io/) — current.
- W3C Trace Context (https://www.w3.org/TR/trace-context/).
- Google SRE / SRE Workbook (https://sre.google/) — current.
- Datadog / Honeycomb / Grafana docs — current.
- Closest skills.sh/official analog: observability / opentelemetry.
