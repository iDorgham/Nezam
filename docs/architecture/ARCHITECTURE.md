# ARCHITECTURE — Nezam Design Server

> Stub generated 2026-05-19 to unblock Phase 2B (Asset Browser, F-008). Expand each section in place as work lands.

## 1. System overview

The design server is a Next.js 16 App Router application (`/.nezam/design-server`) that ships an in-browser design surface: an infinite canvas, property inspector, motion studio, and asset browser. Runtime data lives in Zustand stores; durable artefacts (assets, exports) live in Vercel Blob.

```
┌─────────────────────────────────────────────────────┐
│  Browser (RSC + Client Components)                  │
│   - app/canvas/page.tsx                             │
│   - components/canvas/* / inspector/* / motion/*    │
│   - src/store/canvas-graph.store.ts (Zustand)       │
└──────────────────────┬──────────────────────────────┘
                       │  fetch /api/*
┌──────────────────────▼──────────────────────────────┐
│  Next.js Route Handlers (Fluid Compute, Node.js 24) │
│   - app/api/ai/* (Vision Gate, Generate)            │
│   - app/api/assets/upload  (T-F008-005, planned)    │
│   - app/api/canvas, cli, context, export-*, lock,   │
│     pages, presets, profiles, tui                   │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼─────────────────────┐
        ▼              ▼                     ▼
  Vercel AI Gateway  Vercel Blob       Local filesystem
  (anthropic/...)    (assets, exports)  (.nezam/state/*)
```

## 2. Frameworks & versions

- **Next.js** 16 App Router · Server Components default · Client Components opt-in via `'use client'`
- **React** 19
- **TypeScript** strict mode
- **Zustand** for canvas-graph / motion / inspector state
- **Tailwind** with design tokens (`--ds-*`, `--dv-*`) sourced from `DESIGN.md`
- **Vitest** + Testing Library for unit + component tests
- **Node.js** 24 LTS runtime on Vercel Fluid Compute

## 3. State model

| Store | File | Scope |
|---|---|---|
| `canvas-graph.store` | `src/store/canvas-graph.store.ts` | Nodes, wires, selection, viewport, RTL mode |
| `motion.store` | `src/store/motion.store.ts` | Tracks, keyframes, timeline cursor |
| Token state | inline RSC props | Token Studio (Phase 1A) reads `DESIGN.md` profile |

Persistence: `src/lib/canvas-storage.ts` writes the canvas graph to `localStorage` with debounced batching. There is no server-side canvas DB in v1.

## 4. Storage (decision · 2026-05-19)

**Vercel Blob** is the canonical asset store.

- SDK: `@vercel/blob` (`put`, `del`, `head`, `list`)
- Env: `BLOB_READ_WRITE_TOKEN` (pulled via `vercel env pull`)
- Public mode for thumbnails, private mode for source files
- Local dev hits the same Blob bucket via token — no FS fallback

## 5. AI / model integration (decision · 2026-05-19)

**Vercel AI Gateway** routes all model traffic.

- AI SDK v6, provider strings (e.g. `anthropic/claude-sonnet-4-6`)
- Env: `AI_GATEWAY_API_KEY`
- Observability, fallback, and ZDR handled by gateway
- No direct `@ai-sdk/anthropic` / `@ai-sdk/openai` imports unless a route explicitly opts out

Current routes:

- `app/api/ai/generate` — token generation (Phase 1A)
- `app/api/ai/generate-node` — canvas node generation (Phase 1B)
- `app/api/ai/vision-gate` — asset vision check (Phase 2B, T-F008-008)

## 6. Routing

App Router file conventions. All API routes live under `app/api/<segment>/route.ts` and run on Fluid Compute (300s default timeout). No legacy `/pages` API routes.

## 7. Token system

Tokens are declared in `DESIGN.md` and compiled into `src/styles/tokens.css` as CSS variables (`--ds-*` for design tokens, `--dv-*` for variant overrides). Components reference Tailwind utility classes that resolve to these variables (e.g. `bg-ds-surface`, `text-ds-text-primary`).

Hardlock rules:
- Box model uses logical properties only (`margin-inline-start`, etc.) — enforced at the input layer via `src/lib/hardlock-check.ts`
- Typography sizes must be `clamp(...)` or `var(--...)` — fixed `px/rem/em` blocked
- WCAG AA contrast verified live in the A11y tab via `src/lib/wcag-contrast.ts`

## 8. Generative propagation

See `docs/architecture/GENERATIVE_PROPAGATION_FLOW.md` for the full token → component → canvas propagation graph.

## 9. Security boundaries

- **Asset uploads (T-F008-005..007):** MIME allowlist, SVG sanitization (strip `<script>`, `<text>` if Vision Gate flags it), `sharp` re-encode to WebP for raster
- **CSS injection:** color inputs validated against `^#[0-9a-f]{3,8}$|^rgb(a?)\(.*\)$|^var\(--.*\)$`
- **Hardlock at input layer:** value is rejected client-side before reaching the store

## 10. Performance budgets (PRD §10.1)

- Canvas at 50 nodes: ≥ 60 fps via RAF profiler (`src/lib/raf-profiler.ts`)
- Property Inspector live preview: ≤ 16 ms input → committed node update
- Context window: ≤ 32k tokens (compression via `src/lib/context-compression.ts`)

## 11. Accessibility budgets (PRD §10.2)

- WCAG 2.2 AA across all surfaces
- Axe-core CI scan (T-Q-001, pending)
- RTL audit across all panels (T-Q-002, pending)
- Roving tabindex on tablists; ARIA roles surfaced read-write where applicable

## 12. API contracts (Phase 2 → Phase 3)

| Route | Method | Purpose | Status |
|---|---|---|---|
| `/api/ai/generate` | POST | Token generation prompt | ✅ |
| `/api/ai/generate-node` | POST | Canvas node generation from prompt | ✅ |
| `/api/ai/vision-gate` | POST | Vision check on uploaded image | ✅ (stub) |
| `/api/assets/upload` | POST | Asset upload + sanitize + optimize | ⬜ (T-F008-005) |
| `/api/canvas/*` | various | Canvas persistence (server-side mirror) | ✅ |
| `/api/export-design-layout` | POST | Design layout export bundle | ✅ |
| `/api/export-wireframes` | POST | Wireframe export bundle | ✅ |
| `/api/lock` | POST | Hardlock state mutate | ✅ |
| `/api/pages` | CRUD | Page metadata | ✅ |
| `/api/presets` | CRUD | Preset CRUD | ✅ |
| `/api/profiles` | CRUD | Design profile selection | ✅ |
| `/api/context` | POST | Context compression endpoint | ✅ |
| `/api/cli`, `/api/tui` | POST | Tooling bridges | ✅ |

Integration tests for every route → T-Q-004 (Phase 3).

## 13. Open questions

- Canvas server-side persistence: out of scope for v1; revisit before multi-user
- Asset Vision Gate fallback when AI Gateway is unreachable: fail-open vs fail-closed → land in F-008 spec
- Export pipeline output format (HTML/JSX/Figma JSON) → covered in `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md`

---

*Generated: 2026-05-19 · sources: PRD v2.0.0 · SPEC-DS-CANVAS-001 · DESIGN.md*
