# Observability & Telemetry Runbook

This runbook outlines operational procedures for managing alerts, performance regressions, and health checks in the NEZAM visual design hub.

---

## 1. Sentry Alert Triage

Sentry reports errors and uncaught exceptions to the `#ops-alerts-nezam` Slack channel.

### Step-by-Step Triage
1. **Identify Severity:**
   - **Critical (P0):** Auth failure, database lock issue, file system write failure. Action: Page on-call immediately.
   - **Error (P1):** API route returned 500, state deserialization failure. Action: File ticket; resolve within 24 hours.
   - **Warning (P2):** Resource not found (404), deprecated asset usage. Action: Track in weekly planning.
2. **Investigation:**
   - Open Sentry issue.
   - Analyze breadcrumbs, stack trace, and context variables.
   - Note affected versions and browser/runtime environment.
3. **Resolution:**
   - Write regression unit tests reproducing the issue.
   - Fix in code, commit referencing the Sentry Issue ID.

---

## 2. Web Vitals Regression Protocol

If average LCP, CLS, or INP exceed the target thresholds:

1. **Local Profiling:**
   - Run a production build locally: `pnpm build && pnpm start`.
   - Open Chrome DevTools Performance tab and capture profiling data.
2. **Identify Bottlenecks:**
   - **LCP Regression:** Check if a heavy hero image lacks fetch priority or if custom fonts block initial rendering.
   - **CLS Regression:** Check for images or layout blocks without explicit dimensions, causing content shifts.
   - **INP Regression:** Profile long tasks in CPU metrics. Look for excessive React re-renders or synchronous execution blocks.
3. **Remediation:**
   - Optimize code splitting and dynamic lazy rendering.
   - Add preload link headers for critical styling and assets.

---

## 3. CI Health Check Reading Guide

The weekly `ci-health-check` pipeline aggregates repository health statistics.
- **Location:** GitHub Action `.github/workflows/ci-health-check.yml`
- **Output Artifact:** Contains a summary JSON outlining test coverage trend, dependency vulnerabilities, and mirror drift check results.
- **Failures:** If any key metric degrades, the health check workflow logs warnings and raises a GitHub issue assigned to the DevOps Lead.

---

## 4. Lighthouse Budget Alert Response

If Lighthouse CI fails on a pull request:

1. **Read LHCI report:** Access the report link output in the GitHub Action step description.
2. **Compare budgets:** Check which budget failed (e.g., performance score fell from 92 to 88).
3. **Common fixes:**
   - Reduce JS bundle sizes using code splitting.
   - Compress new raster assets.
   - Optimize Tailwind layout utilities.
