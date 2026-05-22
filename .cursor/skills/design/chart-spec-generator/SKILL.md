---
tier: 2
name: chart-spec-generator
description: Framework-agnostic chart specs with a11y, RTL parity, theme token mappings
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- Data schema (dimensions, measures, time ranges)
- Target chart library (Recharts, ECharts, Chart.js, D3, Vega-Lite)
- Accessibility level (WCAG AA/AAA)

## Workflow
1. Map data to visual encoding (position, length, color, shape)
2. Apply contrast thresholds (>= 4.5:1 lines/bars, >= 3:1 backgrounds)
3. Generate RTL/LTR mirroring rules (y-axis flip, legend flip, tooltip anchor)
4. Output theme-aware token mappings (light/dark)
5. Generate ARIA data table structure for screen readers

## Validation
- Zero hardcoded hex values
- All series have distinct pattern/shape fallback
- ARIA table structure provided

## Example
Invoked by: `/DESIGN dashboard spec cohort_retention --chart=heatmap --framework=recharts`
