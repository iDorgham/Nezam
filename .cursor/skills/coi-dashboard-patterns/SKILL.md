---
name: coi-dashboard-patterns
description: Dense data layouts, filtering/sorting UX, KPI cards, responsive tables, and admin panel composition.
---

# Purpose

Specify dashboard surfaces — KPI cards, filterable tables, charts, panels — that handle dense data with predictable performance and a11y. Single-responsibility: data-dense UI patterns.

# Inputs

- Domain entities + KPIs from `docs/specs/prd/PRD.md`.
- Component library contract from `@.cursor/skills/coi-component-library-api/SKILL.md`.
- Token + grid systems from `@.cursor/skills/coi-pro-design-tokens/SKILL.md` and `@.cursor/skills/token-grid-typography/SKILL.md`.
- Data API contract from `@.cursor/skills/coi-api-design/SKILL.md`.

# Step-by-Step Workflow

1. Define dashboard archetype: overview, monitoring, transactional, analytics; choose layout (grid of cards, master/detail, split-pane).
2. Specify KPI card variants: metric, delta, sparkline, target band, status; add tooltips and source-of-truth links.
3. Design tables: column definitions, sort, filter, pagination vs virtualization, row selection, bulk actions, sticky header, responsive collapse.
4. Define filter UX: faceted panel, query-string serialization, saved views, URL-shareable state.
5. Choose chart library + theme: Recharts/Visx/Nivo aligned to tokens; specify color encoding accessible to color-vision deficiencies.
6. Plan empty/error/loading states per panel; skeletons match real layout.
7. Performance: virtualize tables > 200 rows; debounce filters; cancel stale requests.

# Validation & Metrics

- Filter state round-trips through the URL (shareable).
- Tables > 200 rows use virtualization; no main-thread blocks > 50ms.
- Charts pass color-contrast and color-blind safe palette checks.
- KPI cards expose accessible names + values to screen readers.
- INP < 200ms on filter/sort interactions.

# Output Format

- `docs/specs/sdd/DASHBOARD_PATTERNS.md` (archetypes, panels, table contracts, filters).
- Column definition schema (markdown).
- Saved-view + URL-state spec.
- Chart palette + color-blind audit.

# Integration Hooks

- `/PLAN design` and `/PLAN dev` consume patterns.
- `/DEVELOP` builds dashboards against the spec (without writing app code here).
- `/SCAN a11y perf` validates virtualization and contrast.
- Pairs with `@.cursor/skills/coi-component-library-api/SKILL.md`, `@.cursor/skills/coi-api-design/SKILL.md`, `@.cursor/skills/coi-performance-optimization/SKILL.md`.
- Honors `[.cursor/rules/design-dev-gates.mdc](.cursor/rules/design-dev-gates.mdc)`.

# Anti-Patterns

- KPI cards with bare numbers (no period, no comparison).
- Tables that load all rows client-side (kills INP).
- Filter state in component state only (not shareable).
- Color-only encoding in charts.
- Modals for primary admin tasks (use side panels or routes).

# External Reference

- Stripe / Linear / Vercel dashboard patterns (current).
- Recharts (https://recharts.org/), Visx (https://airbnb.io/visx/), Nivo (https://nivo.rocks/) — current.
- TanStack Table v8 (https://tanstack.com/table/latest) — current.
- WCAG 2.2 SC 1.4.1 (Use of Color), 1.4.11 (Non-text Contrast).
- Closest skills.sh/official analog: dashboard-patterns / admin-ui.
