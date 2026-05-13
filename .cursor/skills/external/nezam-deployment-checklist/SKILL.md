---
name: "nezam-deployment-checklist"
description: Pre/post deployment checklist — environment validation, smoke tests, rollback plan, observability confirmation, and go/no-go decision for production releases.
paths:
  - "docs/plan/**"
  - ".github/workflows/**"
  - "docs/reports/**"
version: 1.0.0
updated: 2026-05-12
changelog: []
---
# Deployment Checklist Skill

## Purpose

Ensure every production deployment follows a structured go/no-go process with mandatory pre-deploy checks, smoke test confirmation, and a documented rollback plan. Prevents partial or broken releases from reaching users.

## Pre-Deployment Checklist

### Code Quality Gates (must all pass)
- [ ] All CI checks green (lint, typecheck, unit, integration).
- [ ] Security scan: no CRITICAL or HIGH findings unresolved.
- [ ] Performance budget: Lighthouse LCP < 2.5s, CLS < 0.1.
- [ ] WCAG 2.2 AA: no critical accessibility violations.
- [ ] PR approved by ≥ 1 reviewer (code owner for sensitive paths).

### Environment Validation
- [ ] Target environment variables confirmed (no dev values in production).
- [ ] Database migrations run and verified on staging first.
- [ ] Third-party API keys/secrets confirmed valid and rotated if needed.
- [ ] Feature flags set correctly for release scope.
- [ ] CDN cache invalidation plan confirmed (if static assets changed).

### Observability Ready
- [ ] Error monitoring active (Sentry/Datadog/etc.).
- [ ] Performance monitoring active.
- [ ] Alerting rules configured for new features.
- [ ] Log aggregation confirmed.

### Rollback Plan
- [ ] Previous stable version tag identified (`v{PREV_VERSION}`).
- [ ] Rollback command documented and tested on staging.
- [ ] Database rollback strategy confirmed (if schema changed).
- [ ] Estimated rollback time < 10 minutes.

## Post-Deployment Checklist (first 30 minutes)

- [ ] Smoke tests pass on production (critical user paths).
- [ ] Error rate < baseline (compare to same window previous week).
- [ ] Latency within SLA (p95 response time).
- [ ] New feature metrics recording correctly.
- [ ] No CRITICAL alerts firing.

**Decision point at 30 min:** Proceed → mark deployment complete. Issues → initiate rollback.

## Output Format

Create `docs/reports/deployments/DEPLOY_LOG.md` entry:
```markdown
## Deploy: v{VERSION} — {YYYY-MM-DD HH:MM UTC}

**Status:** ✅ Success / ❌ Rolled back
**Deploy time:** X minutes
**Rollback time (if applicable):** X minutes

### Pre-deploy gate results
[checklist summary]

### Post-deploy smoke test results
[pass/fail per critical path]

### Incidents
[none / link to incident report]
```

## Integration Hooks
- Pairs with `git-workflow` skill for release tagging.
- Referenced by `devops-manager` and `/DEPLOY` command.
- `/SCAN all` pre-deploy gate is this checklist.

## External Reference
- Google SRE Book (deployment practices): https://sre.google/sre-book/
- Deployment Frequency metric (DORA): https://dora.dev/
