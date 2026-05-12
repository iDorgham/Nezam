---
skill_id: "frontend/nextjs-patterns"
name: "nextjs-patterns"
description: "App Router composition, View Transitions API, partial prerendering, streaming, parallel/intercepting routes, and runtime constraints."
version: 1.1.0
updated: 2026-05-12
changelog:
  - version: 1.1.0
    date: 2026-05-12
    notes: "Wave 2 Upgrade: Added Vercel-specific React composition, View Transitions API, and Partial Prerendering patterns."
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial version metadata added."
owner: "frontend-framework-manager"
tier: 1
sdd_phase: "Development"
rtl_aware: false
certified: true
dependencies: []
---

# Next.js Patterns

## Purpose

Apply consistent Next.js architecture: App Router composition, Partial Prerendering (PPR), React Server Components (RSC) patterns, View Transitions API, streaming with `Suspense`, parallel/intercepting routes, middleware, and runtime constraints.

## Trigger Conditions

- Greenfield Next.js app or major router migration.
- New route groups, modals-from-URL, or parallel dashboards.
- Performance or caching behavior optimization (e.g., PPR).

## Prerequisites

- Product type and rendering strategy locked in PRD/plan.
- Auth and data access patterns agreed.

## Procedure

1. **RSC Composition:** Default to Server Components. Push `'use client'` to the leaves of the component tree. Pass server components as `children` to client components to avoid making the whole subtree client-side.
2. **Partial Prerendering (PPR):** Adopt PPR where supported. Wrap dynamic sections in `<Suspense>` so the static shell is served instantly from the edge while dynamic holes stream in.
3. **View Transitions API:** Implement Next.js View Transitions (where applicable) for native-app-like seamless navigation across routes without heavy SPA overhead.
4. **Streaming:** Wrap slow async subtrees in `Suspense` with design system skeletons. Prefer progressive HTML over blocking server renders.
5. **Parallel/Intercepting Routes:** Use `@slot` for independently loadable panes, and `(.)` for modals that preserve URL semantics.
6. **Middleware:** Keep synchronous fast paths. Use for auth redirects and header rewrites only. Match narrowly.
7. **Edge constraints:** Validate environment secrets never shipped to client bundles. Ensure compatibility if using Edge runtime.

## Output Artifacts

- Route manifest table (path, rendering mode, cache tags).
- Component architecture diagrams (Client vs Server split).
- `loading.tsx` / `error.tsx` implementations.

## Validation Checklist

- [ ] Client boundaries are pushed to the leaves (composition pattern applied).
- [ ] PPR static shells contain no blocking dynamic data fetches.
- [ ] No accidental client bundle of server secrets.
- [ ] Middleware matcher audited for cost and correctness.

## Handoff Target

`frontend-lead` for implementation slicing, or `lead-devops-performance` when CDN/deployment flags change.
