# Performance Baseline Report

Generated on: ${new Date().toISOString()}

This document establishes the official performance baseline for the NEZAM Design Hub, including current Lighthouse budgets and metrics targets.

## 1. Lighthouse Scores & Budgets

Performance budgets are declared and enforced via [.lighthouserc.json](file:///.lighthouserc.json). The targets for key performance categories are:

- **Performance:** ≥ 90
- **Accessibility:** 100 (Strict rad-a11y gate)
- **Best Practices:** ≥ 90
- **SEO:** ≥ 90

---

## 2. Core Web Vitals Targets

The following targets are enforced in pre-merge integration tests and production performance budgets:

- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Interaction to Next Paint (INP):** < 200ms
- **First Contentful Paint (FCP):** < 1.5s
- **Time to First Byte (TTFB):** < 800ms

---

## 3. Measurement Methodology

1. **Continuous Integration Gate:** LHCI runs `lighthouse-ci-action` on every pull request, testing routes in simulated mobile/desktop configurations. If the scores fall below the target budgets, the build gate fails.
2. **Real User Monitoring (RUM):** Telemetry is captured in production via Next.js `useReportWebVitals` and pushed to `/api/vitals` to track real user metrics in real-time.
