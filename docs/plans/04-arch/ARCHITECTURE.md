# System Architecture Specification

> **Domain:** Nezam Platform Architecture + Egypt Nightclub System Spec  
> **Source:** PRD v2.0.0 · PROJECT_PROMPT.md

---

# Part 1: Nezam Design Server Platform UI Suite

> Defines tech stack, data layer, state architecture, API design, and integration contracts for the design server.

## 1. Architecture Overview

**Product Type:** Local Single-Page Application (SPA)
**Runtime:** Next.js 15 App Router running on `localhost:4000`
**Data boundary:** All persistence is local — browser `localStorage` + project filesystem (`.nezam/design/`)
**Network:** No cloud services except on-demand LLM calls to Anthropic API (Vision Gate, generate-node)

```
┌──────────────────────────────────────────────────────────────────┐
│  Browser (localhost:4000)                                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Next.js 15 App Router (RSC + Client Components)            │ │
│  │                                                              │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │ │
│  │  │ Zustand     │  │ React Query  │  │ Motion.dev        │  │ │
│  │  │ session     │  │ (server      │  │ (timeline,        │  │ │
│  │  │ canvas-graph│  │  state sync) │  │  keyframes)       │  │ │
│  │  └─────────────┘  └──────────────┘  └───────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                          │                                        │
│                    Next.js API Routes                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  /api/presets      /api/canvas     /api/assets/upload       │ │
│  │  /api/ai/vision-gate              /api/ai/generate-node     │ │
│  │  /api/session/save-page                                      │ │
│  └──────────────────────────┬────────────────────────────────── │ │
└─────────────────────────────│────────────────────────────────────┘
                              │
                 ┌────────────┴──────────────┐
                 │  Local Filesystem          │
                 │  .nezam/design/<brand>/    │
                 │  .nezam/sessions/          │
                 └─────────────┬─────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │  Anthropic API (external)  │
                 │  claude-haiku-4-5          │
                 │  Vision Gate · Generate    │
                 └───────────────────────────┘
```

## 2. Tech Stack — Locked Decisions

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Framework | Next.js App Router | 15.x | RSC + API routes in one process; no separate backend |
| Language | TypeScript | 5.x strict | Type safety at all store/API boundaries |
| State | Zustand | 5.x | Minimal boilerplate; `persist` middleware for localStorage |
| Schema validation | Zod | 3.x | Runtime validation at store hydration and API boundaries |
| Styling | Tailwind CSS | v4 | Token-driven utility classes; CSS variables for design tokens |
| Animation | Motion.dev | 12.x | Declarative timeline API; `useReducedMotion` hook built-in |
| Query | TanStack Query | v5 | Server state for API routes (presets, canvas) |
| Testing | Vitest + Testing Library | latest | Unit + integration tests for store actions and components |
| AI SDK | Anthropic SDK | latest | Direct API client for Vision Gate and generate-node |
| Fonts | Geist Sans · JetBrains Mono | CDN | Primary sans + mono as defined in design token contract |

## 3. State Architecture — Three-Store Model

All client state is managed via three Zustand stores. Each has a distinct concern and persistence strategy.

### Store 1: `useSessionStore` — Navigation & Preferences

**File:** `src/store/session.store.ts`
**Persisted to:** `localStorage('nezam-ds:session')`

### Store 2: `useTokenStore` — Design Token Values

**File:** `src/store/tokens.store.ts`
**Persisted to:** `localStorage('nezam-ds:tokens')`

**Sync behavior:** `updateToken` sets `isDirty: true` → triggers debounced CSS custom property injection via `document.documentElement.style.setProperty()`

### Store 3: `useCanvasGraphStore` — Infinity Canvas State

**File:** `src/store/canvas-graph.store.ts`
**Persisted to:** `localStorage('nezam-ds:canvas-graph')`
**Schema:** Zod-validated via `CanvasStateSchema.partial().parse()` on hydration
**Reference:** `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md`

## 4. Data Model — Zod Schemas

All persistent entities are typed and validated at store/API boundaries.

### `DesignPreset`
```ts
z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  colors: DesignColorsSchema,
  borderRadius: z.string().regex(/^\d+(px|rem|%)$/),
  typography: TypographySchema,
  isCustom: z.boolean(),
  updatedAt: z.string().datetime(),
})
```

### `AssetItem`
```ts
z.object({
  id: z.string().uuid(),
  name: z.string(),
  mimeType: z.enum(['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp',
                    'font/woff2', 'application/json', 'text/yaml']),
  optimizedUrl: z.string(),
  altText: z.string().default(''),
  visionStatus: z.enum(['pending', 'valid', 'rejected']),
  createdAt: z.string().datetime(),
})
```

## 5. API Route Architecture

All API routes live at `.nezam/design-server/app/api/`. They use Next.js App Router Route Handlers.

### Vision Gate Implementation

```ts
// app/api/ai/vision-gate/route.ts
// Uses claude-haiku-4-5 for low latency (< 3s target)
const response = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 64,
  system: 'Scan this image. Reply ONLY with: VALID or REJECTED: <reason>. Reject if ANY text, words, letters, or numbers are embedded in the image artwork.',
  messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type, data: base64 } }] }],
})
```

## 6. CSS Token Injection Architecture

Design tokens flow from Zustand store → CSS custom properties → Tailwind v4 utilities.

**Token namespace prefixes:**
- `--ds-*` — design system tokens (colors, spacing, typography, radius)
- `--dv-*` — design viewer / canvas-specific (wire colors, node borders, timeline)

**Hot-reload latency target:** < 16ms (one animation frame)

## 7. RTL Architecture

RTL is a first-class concern, not an afterthought.

### Activation

```ts
// session.store.ts
setLang: (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
  set({ lang })
}
```

### Arabic Typography

```css
:lang(ar) {
  font-family: var(--ds-font-arabic, 'IBM Plex Sans Arabic', sans-serif);
  line-height: var(--ds-leading-arabic); /* ≥ 1.4 */
  letter-spacing: 0; /* Arabic does not use letter-spacing */
}
```

## 8. Asset Pipeline

Vision Gate runs asynchronously after upload for image assets. Status updates from `'pending'` → `'valid'` or `'rejected'` via store update.

## 9. Local Filesystem Layout

```
.nezam/
├── design/                   ← Brand design profiles
├── sessions/                 ← Generated page sessions
│   └── <pageId>/
│       ├── blocks.json       ← Wireframe blocks
│       └── spec.md           ← COMPONENT_SPEC.md
└── memory/                   ← Workspace memory (Claude/Cursor)
```

## 10. Performance Architecture

| Concern | Strategy | Target |
|---|---|---|
| CSS hot-reload | `style.setProperty()` direct injection | < 16ms |
| Disk compile | API route filesystem write | < 35ms |
| Canvas render | CSS `matrix()` affine transform, LOD rendering | 60fps p95 @ 50 nodes |
| Vision Gate | Haiku model, 3s timeout + retry | < 3s |

Implemented via `useMemo` + scale subscription in canvas component.

## 11. Security Architecture

| Threat | Mitigation |
|---|---|
| CSS injection via color inputs | Sanitize with CSS.supports() check before setProperty() |
| XSS via SVG ingest | DOMParser + allowlist element stripping |
| SVG `<text>` bypass | Recursive tree walker — reject on ANY text node |
| LLM prompt injection via wire directives | Directives treated as user content, not system prompt |
| Path traversal via asset upload | Filenames sanitized via `path.basename()` + uuid rename |
| Unvalidated state hydration | Zod `.parse()` on localStorage hydration — reset on failure |

## 12. Testing Architecture

**Coverage targets:** Store actions 90% · API routes 80% · Critical components 70%

## 13. Dependency Graph (Key)

```
useSessionStore
  └─ setLang() → document.dir + lang
  └─ setSyncStatus() → SyncStatusPill

useTokenStore
  └─ updateToken() → CSS.setProperty() → Tailwind classes
  └─ syncToDisk() → /api/presets/sync-to-disk → .nezam/design/

useCanvasGraphStore  (SPEC-DS-CANVAS-001)
  └─ aggregateContext(wireId) → ContextPayload
  └─ compressContext() → /api/ai/generate-node
  └─ hardlockCheck() → node.hardlockFailures[]
  └─ attachAsset() → /api/assets/upload → /api/ai/vision-gate
```

---

# Part 2: Nightclub Reservation System Application (System Architecture)

> **Focus:** Multi-platform architecture with real-time sync and offline capabilities.

## 14. System Overview
The system consists of three main components interacting with a centralized backend:
1.  **Web Dashboard:** For Owners, Managers, and Accountants (Browser-based).
2.  **Mobile Apps:** For Sales (Reservations) and Security (QR Scanning).
3.  **Backend & Database:** Handling business logic, real-time sync, and data storage.

## 15. Tech Stack Decisions

| Component | Technology | Rationale |
|---|---|---|
| **Web Dashboard** | Next.js (React) | Great for complex dashboards and potential public landing pages. |
| **Mobile Apps** | Flutter | Cross-platform (iOS/Android) with excellent performance and offline storage capabilities. |
| **Backend/DB** | Supabase (PostgreSQL) | Provides managed Postgres, built-in Auth, and Realtime sync out of the box. |
| **Real-time** | Supabase Realtime | Essential for live table status updates across all devices. |
| **Offline Mode** | Hive / SQLite (Flutter) | For local caching of the guest list in the security app. |

## 3. Data Model (Core Entities)

### 3.1 Users & Roles
- `id`, `email`, `role` (`owner` | `manager` | `accountant` | `sales` | `security`).

### 3.2 Venues & Tables
- **Venue:** `id`, `name`, `location`, `layout_config` (JSON for drag & drop layout).
- **Table:** `id`, `venue_id`, `table_number`, `capacity`, `min_spend`, `status` (`available` | `reserved` | `occupied`).

### 3.3 Reservations & Guests
- **Reservation:** `id`, `table_id`, `sales_rep_id`, `guest_name`, `guest_contact`, `qr_code_hash`, `status` (`pending` | `confirmed` | `arrived` | `cancelled`).
- **Client/CRM:** `id`, `name`, `phone`, `email`, `visit_count`, `notes`.

### 3.4 Financials
- **Leaderboard/Commissions:** Track completed reservations per `sales_rep_id` and calculate payouts.

## 4. Key Architectural Patterns
- **Database-Level Locks:** To prevent double-booking of tables during simultaneous requests.
- **Optimistic UI:** For the drag-and-drop table layout to feel instantaneous.
- **Event-Driven Arrival:** Scanning a QR code triggers a real-time event to update the manager's live feed and the sales rep's dashboard.

