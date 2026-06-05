# ADR-0004 — Observability Stack (v3.2)

| Field | Value |
|---|---|
| ID | ADR-0004 |
| Status | Accepted |
| Date | 2026-06-05 |
| Deciders | Frontend Performance Lead, Analytics Engineer |
| Supersedes | — |
| Related | ROADMAP_v3.2_HEALTH_100.md §Phase 5.2 |

---

## Context

v3.1 observability: 40% health. The Design Hub app was built and tested, but:
- No runtime error tracking in place
- Web Vitals collected only in CI (lhci), not in production runtime
- No product analytics events instrumented post-Phase 4
- No alerting for performance regressions in production

## Decision

Adopt a **two-layer observability model** matching the two deployment surfaces:

### Layer 1 — Design Hub app (`.nezam/design-hub/`)

| Concern | Tool | Integration |
|---|---|---|
| Runtime errors | **Sentry** (free tier) | `@sentry/nextjs`; source maps uploaded on build |
| Web Vitals | **Vercel Analytics** (if deployed to Vercel) or `web-vitals` + Sentry perf | `app/layout.tsx` instrumentation |
| Product events | **PostHog** (workspace plugin, optional) | `posthog-js` + `/api/analytics` route wrapper |
| Perf budget enforcement | **lighthouse-ci** | `nezam-nightly.yml`; alerts on LCP > 2.5s |

### Layer 2 — Workspace kit (scripts, CI, sync)

| Concern | Tool | Integration |
|---|---|---|
| CI health | GitHub Actions summary | Weekly `ci-health-check.yml` report |
| Sync drift | `pnpm ai:check` output | `sync-drift-check.yml` — alerts if drift > 1% |
| Dependency health | DependaBot + `pnpm audit` | Weekly; see ADR-0003 |

### Alert routing (solo mode)

Since `user_mode: solo`, all alerts route to the developer directly:
- GitHub Notifications → PR comments for gate failures
- Sentry → email on `error` + `fatal`
- CI summary → GitHub Actions tab

Teams with Slack can add `slack-notify` step to workflows.

### Perf baselines to document

Required in `.nezam/core/reports/PERF_BASELINE.md`:
- Design Hub: LCP, CLS, INP per route (home, wireframes, tokens, components)
- Bundle size: JS gzipped per page
- API route latency: p50 + p99 for `/api/ai/generate`, `/api/lock`, `/api/context`

## Consequences

**Good:**
- Errors surfaced in production, not just CI
- Performance regressions caught in nightly run before user-visible
- Baseline documented — regression detection has a reference point

**Bad / mitigated:**
- Sentry free tier: 5K errors/month. Sufficient for kit usage; upgrade if user apps embedded
- PostHog is optional — kit works without it; only activate when product analytics needed

## Files affected

- `.nezam/design-hub/` — `@sentry/nextjs` integration, `web-vitals` reporting
- `.github/workflows/nezam-nightly.yml` — add lhci perf budget step
- `.github/workflows/ci-health-check.yml` — new weekly summary
- `.nezam/core/reports/PERF_BASELINE.md` — new (generated after first run)
- `.nezam/core/docs/OBSERVABILITY_RUNBOOK.md` — new
