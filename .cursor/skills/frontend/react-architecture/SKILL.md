---
name: coi-react-architecture
description: React 19 / Next.js 15 patterns — Server Components, Suspense, Server Actions, state strategy, and rendering modes.
version: 2.0.0
updated: 2026-05-08
breaking_changes: true
changelog:
  - version: 2.0.0
    date: 2026-05-08
    notes: "React 19 and Next.js 15 architecture defaults with RSC-first guidance."
compatible_with:
  - react: ">=19"
  - next: ">=15"
  - node: ">=20"
---

# Purpose

Specify the React/Next.js architecture choices that govern the application: server vs client component split, data fetching, Suspense boundaries, Server Actions, and state management. Single-responsibility: rendering & data architecture spec.

# Inputs

- `docs/DESIGN.md` page archetypes and interaction states.
- IA + URL hierarchy from `@.cursor/skills/coi-ia-taxonomy/SKILL.md`.
- Tokens & component contracts from `@.cursor/skills/coi-pro-design-tokens/SKILL.md` and `@.cursor/skills/coi-component-library-api/SKILL.md`.
- Performance budget from `@.cursor/skills/coi-performance-optimization/SKILL.md`.

# Step-by-Step Workflow

1. Default to React Server Components; mark client islands with `'use client'` only when interactive APIs are required (state, effects, browser APIs).
2. Define data fetching: server fetch + cache (`fetch` with `cache`/`next: { revalidate }`), Server Actions for mutations.
3. Place Suspense boundaries around async sub-trees; provide skeleton fallbacks aligned to layout.
4. Choose state strategy: URL state (search params) > server state (RSC) > Zustand/Jotai for cross-tree client state; reserve Redux only for legacy needs.
5. Define route grouping (`(marketing)`, `(app)`) and layout hierarchy; protect routes via middleware.
6. Configure rendering modes per route: static, ISR, dynamic, streaming; document why.
7. Establish error/notFound boundaries and loading.tsx per segment.

# Validation & Metrics

- Server-component default verified (client bundles do not include server-only modules).
- LCP < 2.5s, INP < 200ms, CLS < 0.1 on priority pages.
- Suspense + streaming reduce TTFB tail; documented per route.
- No prop drilling > 3 levels (use context or co-location).
- Server Action input validation present (Zod or equivalent).

# Output Format

- `docs/core/required/sdd/REACT_ARCHITECTURE.md` (RSC/CC split, data fetching, state, routing).
- Per-route rendering-mode table.
- Suspense boundary map.
- Server Action contract list.

# Integration Hooks

- `/PLAN design` and `/PLAN dev` consume architecture spec.
- `/DEVELOP` builds against the contract.
- `/SCAN perf` validates rendering budgets.
- Pairs with `@.cursor/skills/coi-component-library-api/SKILL.md`, `@.cursor/skills/coi-performance-optimization/SKILL.md`, `@.cursor/skills/coi-cache-strategies/SKILL.md`.
- Honors `[.cursor/rules/design-dev-gates.mdc](.cursor/rules/design-dev-gates.mdc)` Gates 5 & 6.

# Anti-Patterns

- `'use client'` on the root layout (forces entire app to client).
- `useEffect` for data fetching in RSC-eligible components.
- Server Actions without input validation.
- Global Redux for state that belongs in URL or RSC props.
- Mixing pages router and app router patterns ad hoc.

# External Reference

- React 19 docs (https://react.dev/) — current.
- Next.js 15 App Router docs (https://nextjs.org/docs) — current.
- React Server Components RFC (https://github.com/reactjs/rfcs).
- Closest skills.sh/official analog: react-architecture / nextjs-app-router.
