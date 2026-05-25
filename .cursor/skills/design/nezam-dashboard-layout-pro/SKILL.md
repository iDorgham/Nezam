---
skill_id: nezam-dashboard-layout-pro
name: "Dashboard Layout Pro"
tier: 2
description: Dense data layouts, KPI composition, filtering UX, responsive breakpoints, state matrices
version: 1.0
updated: 2026-05-22
changelog: ["2026-05-22: Initial version"]
---

## Inputs
- PRD analytics KPIs and user roles
- Target screen sizes (mobile, tablet, desktop, ultrawide)
- Data refresh frequency (realtime, 5min, daily)

## Workflow
1. Define grid: 12-col desktop, 6-col tablet, 1-col mobile
2. Place KPI cards with progressive disclosure (value > sparkline > tooltip > drilldown)
3. Map filters: global vs local, clear-all, reset defaults, RTL alignment
4. Define states: loading (skeleton), empty (guidance), error (retry + fallback)
5. Generate responsive breakpoint matrix with container query hints

## Validation
- Max 7 primary metrics above fold
- All filters RTL-safe
- Loading skeletons match final component aspect ratio +-5%

## Example
Invoked by: `/DESIGN dashboard spec revenue_overview --chart=area --framework=recharts`
