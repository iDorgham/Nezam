---
skill_id: frontend/nextjs-patterns
name: nextjs-patterns
description: App Router vs Pages Router, RSC composition, streaming, parallel/intercepting routes, middleware, rendering modes, and runtime constraints.
version: 1.0.0
updated: 2026-05-12
changelog: []
owner: frontend-framework-manager
tier: 3
sdd_phase: Development
rtl_aware: false
certified: false
dependencies: []
---

# Next.js patterns (frontend/nextjs-patterns)

## Purpose

Apply consistent **Next.js** architecture: **App Router vs Pages Router** decision matrix, **React Server Components** composition, **streaming** with `Suspense`, **parallel** and **intercepting** routes, **middleware** patterns, **ISR / SSG / SSR** selection, and **runtime** (Node vs Edge) constraints aligned to deployment targets.

## Trigger Conditions

- Greenfield Next.js app or major router migration.
- New route groups, modals-from-URL, or parallel dashboards are required.
- Performance or caching behavior must change per segment (marketing vs app shell).
- Platform limits (Edge, Fluid Compute) affect auth, geolocation, or DB drivers.

## Prerequisites

- Product type and rendering strategy locked in PRD/plan (see SDD pipeline).
- Auth and data access patterns agreed (`middleware` vs RSC vs Route Handlers).
- Design contracts for loading/error boundaries per segment.

## Procedure

1. **App Router vs Pages Router**
   - **Default App Router** for new work (layouts, nested loading, RSC, Server Actions).
   - **Pages Router** only for legacy constraints; document port plan if hybrid.
2. **RSC composition**
   - Server components by default; `'use client'` only for hooks, events, or browser APIs.
   - Do not import server-only modules into client files; split shared types to neutral modules.
   - Serialize props across the boundary; avoid non-POJO props.
3. **Streaming**
   - Wrap slow async subtrees in `Suspense` with skeletons from design system.
   - Prefer progressive HTML over blocking server renders for long I/O.
4. **Parallel routes** (`@slot`)
   - Use for dashboards with independently loadable panes; define `default.tsx` for fallbacks.
5. **Intercepting routes** (`(.)`, `(..)`, etc.)
   - Use for modal patterns that preserve URL semantics; verify back/forward and deep-link behavior.
6. **Middleware**
   - Keep synchronous fast paths; auth redirects and header rewrites only.
   - Match matcher narrowly to avoid running on static assets.
   - Confirm runtime APIs available on chosen runtime (see step 8).
7. **ISR / SSG / SSR**
   - **SSG/ISR**: marketing, docs, rarely changing catalog — set `revalidate` explicitly.
   - **SSR/dynamic**: personalized or authorization-gated pages — `dynamic = 'force-dynamic'` or `noStore()` when appropriate.
   - Document per-route table in plan or `SPEC.md`.
8. **Edge runtime constraints**
   - List incompatible Node APIs and ORM clients; if Edge required, use edge-compatible clients or proxy to Node Route Handlers.
   - Validate env secrets never shipped to client bundles.

## Output Artifacts

- Route manifest table (path, rendering mode, runtime, cache tags if used).
- Updated `SPEC.md` or architecture note under `docs/specs/` / plan tree.

## Validation Checklist

- [ ] No accidental client bundle of server secrets or large server-only libs
- [ ] Each dynamic segment has `loading.tsx` / `error.tsx` where UX requires it
- [ ] Middleware matcher audited for cost and correctness
- [ ] Rendering and cache strategy matches SEO/auth requirements

## Handoff Target

- `frontend-lead` for implementation slicing.
- `lead-devops-performance` when CDN, headers, or deployment flags change.
