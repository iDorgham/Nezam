# DASHBOARD_SPEC: <page_name>

> Source: `/DESIGN dashboard spec <page_name>`

## Intent
<brief from /DESIGN dashboard intent>

## Layout Architecture
- Grid: 12-col desktop / 6-col tablet / 1-col mobile
- KPI Pattern: progressive-disclosure (value > sparkline > tooltip > drilldown)
- Filter Strategy: global-local-mixed
- Responsive: CSS @container queries

## Chart Specifications

| Chart ID | Type | Encoding | A11y | RTL Rules | Framework Map |
|---|---|---|---|---|---|
| <id> | <type> | x:<dim>, y:<measure>, color:<segment> | ARIA + data table | axis_flip: true, legend: right | <Recharts/ECharts/D3> |

## Motion Timeline

| State | Duration | Easing | GPU Hints | Reduced Motion |
|---|---|---|---|---|
| Entrance | <=350ms | cubic-bezier(0.25,0.1,0.25,1) | transform, will-change | instant-opacity-crossfade |
| Update | <=200ms | cubic-bezier(0.25,0.1,0.25,1) | transform | instant |
| Exit | <=150ms | linear | transform | instant |

## State Matrix
- **Loading:** skeleton (matches final component aspect ratio +-5%)
- **Empty:** guidance copy + CTA
- **Error:** retry button + fallback data

## Handoff Checklist
- [ ] Token references verified (0 literals)
- [ ] RTL mirror validated
- [ ] A11y table attached per chart
- [ ] Motion perf budget respected (all <=600ms)
- [ ] /PLAN design dashboard audit --strict passed
- [ ] sdd-gate-validator approved — ready for /DEVELOP
