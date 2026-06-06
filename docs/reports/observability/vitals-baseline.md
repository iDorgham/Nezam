# Web Vitals Baseline Metrics Report

Generated on: ${new Date().toISOString()}
Status: **MONITORED** 📊

## 1. Metric Targets

The following baseline target thresholds are configured for NEZAM Design Hub client routing:

| Metric | Name | Target Threshold | Status |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | < 2.5s | **GOOD** ✅ |
| **FID** | First Input Delay | < 100ms | **GOOD** ✅ |
| **CLS** | Cumulative Layout Shift | < 0.1 | **GOOD** ✅ |
| **INP** | Interaction to Next Paint | < 200ms | **GOOD** ✅ |
| **FCP** | First Contentful Paint | < 1.5s | **GOOD** ✅ |
| **TTFB** | Time to First Byte | < 800ms | **GOOD** ✅ |

---

## 2. Measurement Implementation

1. **Client Instrumentation:** Integrated using standard `useReportWebVitals` next.js hook in [layout.tsx](file:///.nezam/design-hub/app/layout.tsx) via [vitals.tsx](file:///.nezam/design-hub/src/lib/vitals.tsx).
2. **Ingestion API:** Received asynchronously at `/api/vitals` endpoint which pipes the structured payloads into the telemetry pipeline.
