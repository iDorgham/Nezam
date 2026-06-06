# Monitoring & Logging Configuration Report

This document details the configuration for Grafana dashboard monitoring (`T-HEALTH-5-002`) and structured JSON logging (`T-HEALTH-5-003`).

## 1. Structured Logging (`T-HEALTH-5-003`)

We have implemented structured JSON logging inside the Next.js Design Hub via [logger.ts](file:///.nezam/design-hub/src/lib/logger.ts).

- **Development Mode:** Outputs colorized, human-readable terminal logs.
- **Production Mode:** Outputs standard JSON objects to `stdout` / `stderr`. This allows cloud log shippers (like Google Cloud Logging, Promtail, Fluentd) to easily parse levels, timestamps, messages, and associated metadata.

### Example Production Log
```json
{"timestamp":"2026-06-06T07:01:28.000Z","level":"info","message":"Design session locked","environment":"production","session_id":"11111111-1111-1111-1111-111111111111"}
```

---

## 2. Grafana Dashboard Configuration (`T-HEALTH-5-002`)

The Grafana monitoring dashboard aggregates visual telemetry metrics from Sentry and our telemetry APIs.

- **Metrics Ingested:**
  - HTTP Request Rates / Latencies (from API routes).
  - Web Vitals (LCP, CLS, INP) received via `/api/vitals` endpoint.
  - Sentry critical/high exception rates.
- **Alerting thresholds:**
  - Alert if LCP > 2.5s for more than 5% of requests over a 5-minute window.
  - Alert if API Route 5xx error rate > 1%.
