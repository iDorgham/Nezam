---
skill_id: frontend/performance-budget
name: "nezam-performance-budget"
description: Core Web Vitals by route type, bundle analysis, dynamic imports, images, Arabic font subsetting, prefetch, and Lighthouse CI gates.
version: 1.0.0
updated: 2026-05-12
changelog: []
owner: frontend-performance-manager
tier: 3
sdd_phase: Development
rtl_aware: false
certified: false
dependencies: []
---

# Performance budget (frontend/performance-budget)

## Purpose

Enforce **Core Web Vitals** targets per route class, **bundle analyzer** workflow, **dynamic `import()`** discipline, **image optimization** pipeline, **Arabic font subsetting**, **prefetch** strategy, and **Lighthouse CI** gate configuration through development into release.

## Trigger Conditions

- New marketing page, dashboard, or heavy client island.
- LCP/INP/CLS regressions in CI or field data.
- Font or image payload growth exceeds budget.
- Release gate requires Lighthouse evidence (`docs/reports/lighthouse/` per reports policy).

## Prerequisites

- Route inventory with expected traffic and rendering mode (from `frontend/nextjs-patterns`).
- Design-approved skeletons and above-the-fold content order.
- `.lighthouserc.json` or equivalent exists for CI (see `design-dev-gates.mdc`).

## Procedure

1. **Targets per route type** (defaults align NEZAM design gates: LCP < 2.5s, CLS < 0.1, INP < 200ms)
   - **Marketing / landing**: prioritize LCP (hero media, font), CLS (reserved space for fonts/embeds).
   - **App / dashboard**: prioritize INP (tables, virtualized lists, client charts); cap long tasks.
   - Document per-route budget table in plan or `SPEC.md`.
2. **Bundle analyzer**
   - Run `@next/bundle-analyzer` or framework equivalent on representative build; file top chunks and shared deps.
   - Open PR comment with top 3 wins (split chunk, server move, lazy route).
3. **Dynamic import discipline**
   - Lazy-load heavy client-only modules (charts, maps, rich editors) at route or interaction boundary.
   - Avoid waterfall: parallelize dynamic imports when independent.
4. **Images**
   - Use framework image component with explicit `sizes`; modern formats; priority only for true LCP candidate.
5. **Arabic font subsetting**
   - Subset to required codepoints where tooling allows; preload only primary WOFF2; verify FOIT/FOUT policy matches design.
6. **Prefetch**
   - Use `prefetch` for high-probability navigations; disable for low-value or auth-sensitive hops.
7. **Lighthouse CI**
   - Wire assertions to `.lighthouserc.json`; store reports under `docs/reports/lighthouse/` with timestamp or `*.latest.md` policy.

## Output Artifacts

- Budget table + remediation tickets.
- Lighthouse or Web Vitals report paths under `docs/reports/`.

## Validation Checklist

- [ ] LCP image and font chain documented for each template type
- [ ] No accidental eager import of server-only or huge client libs in RSC entry paths
- [ ] CI fails on agreed thresholds or documents waiver with owner sign-off

## Handoff Target

- `lead-qa-architect` for perf regressions caught in test environments.
- `lead-devops-performance` for CDN, caching headers, and production profiling.
