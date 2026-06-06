# NEZAM Runbooks

Quick index of all operational guides. Each runbook is a standalone document you can open when something goes wrong — or when you want to understand a system before touching it.

---

## Runbooks

### Sync & Mirrors
**File:** [`.nezam/core/docs/SYNC_RUNBOOK.md`](../.nezam/core/docs/SYNC_RUNBOOK.md)

Use this when AI tool mirrors are out of sync, a drift alert fires, or the pre-commit hook keeps failing.

Covers:
- How to recover from sync drift
- Rolling back a bad sync
- What to do when drift exceeds the 0.5% CI threshold
- How certified agents are tracked
- Archive and deprecation process

---

### Security
**File:** [`.nezam/core/docs/SECURITY_RUNBOOK.md`](../.nezam/core/docs/SECURITY_RUNBOOK.md)

Use this when a secret needs rotating, a vulnerability is reported, or a security alert fires.

Covers:
- Secret rotation schedule and steps
- Push protection — how to unblock a rejected push
- Dependency CVE remediation path
- Incident response checklist

---

### Observability
**File:** [`.nezam/core/docs/OBSERVABILITY_RUNBOOK.md`](../.nezam/core/docs/OBSERVABILITY_RUNBOOK.md)

Use this when Sentry fires an alert, Core Web Vitals regress, or Lighthouse CI fails.

Covers:
- How to triage a Sentry error in production
- Reading the Web Vitals dashboard
- Diagnosing LCP, CLS, and INP regressions
- Lighthouse budget failures and how to fix them

---

### Deployment & Rollback
**File:** [`docs/release/DEPLOYMENT_RUNBOOK.md`](release/DEPLOYMENT_RUNBOOK.md)

Use this when deploying to staging or production, or when you need to roll back a broken release.

Covers:
- Pre-deploy checklist
- Staging deploy steps
- Production release steps
- How to roll back using git tags
- Smoke test checklist after deploy

---

## Quick Reference

| Problem | Runbook |
|:---|:---|
| AI tool mirror is out of sync | Sync & Mirrors |
| Pre-commit hook keeps failing | Sync & Mirrors |
| Leaked secret or CVE alert | Security |
| Sentry alert in production | Observability |
| Web Vitals dropped after a deploy | Observability |
| Need to deploy to staging | Deployment & Rollback |
| Need to roll back a bad release | Deployment & Rollback |

---

## Related Docs

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — common errors with quick fixes
- [ONBOARDING.md](ONBOARDING.md) — getting started from scratch
- [CONTRIBUTING.md](../CONTRIBUTING.md) — how to make changes safely
