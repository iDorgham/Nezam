# System Architecture — Nezam Design Server · Ultimate UI Suite

> **Phase:** 04-Architecture | **Source:** PRD v2.0.0 · PROJECT_PROMPT.md
> Defines tech stack, data layer, state architecture, API design, and integration contracts.

---

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
│  │  │ tokens      │  │  state sync) │  │  keyframes)       │  │ │
│  │  │ canvas-graph│  └──────────────┘  └───────────────────┘  │ │
│  │  └─────────────┘                                            │ │
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

---

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

---

## 3. State Architecture — Three-Store Model

All client state is managed via three Zustand stores. Each has a distinct concern and persistence strategy.

### Store 1: `useSessionStore` — Navigation & Preferences

**File:** `src/store/session.store.ts`
**Persisted to:** `localStorage('nezam-ds:session')`

```ts
interface SessionState {
  lang: 'en' | 'ar'
  theme: 'dark' | 'light'
  activeMode: 'token-studio' | 'sitemap-graph'
  tabs: Tab[]
  activeTabId: string | null
  syncStatus: 'idle' | 'syncing' | 'synced' | 'failed' | 'offline'
  lastSyncAt: string | null
}
```

**Actions:** `setLang`, `setTheme`, `setMode`, `openTab`, `closeTab`, `setActiveTab`, `setSyncStatus`

**Side effects:**
- `setLang('ar')` → `document.documentElement.dir = 'rtl'`
- `setLang('en')` → `document.documentElement.dir = 'ltr'`

### Store 2: `useTokenStore` — Design Token Values

**File:** `src/store/tokens.store.ts`
**Persisted to:** `localStorage('nezam-ds:tokens')`

```ts
interface TokenState {
  activePresetId: string | null
  presets: DesignPreset[]
  activeTokens: DesignTokens
  isDirty: boolean
}

interface DesignTokens {
  colors: {
    background: string
    surface: { base: string; elevated: string }
    border: { subtle: string; muted: string }
    accent: { cyan: string; orange: string }
    text: { primary: string; secondary: string; muted: string }
  }
  typography: {
    fontFamily: { sans: string; mono: string }
    scale: TypographyStep[]  // clamp() formulas
    lineHeight: { base: number; arabic: number }
  }
  spacing: SpacingScale
  borderRadius: BorderRadiusScale
}
```

**Actions:** `loadPreset`, `updateToken`, `savePreset`, `deletePreset`, `syncToDisk`, `resetToDefault`

**Sync behavior:** `updateToken` sets `isDirty: true` → triggers debounced CSS custom property injection via `document.documentElement.style.setProperty()`

### Store 3: `useCanvasGraphStore` — Infinity Canvas State

**File:** `src/store/canvas-graph.store.ts` ← **Already implemented**
**Persisted to:** `localStorage('nezam-ds:canvas-graph')`
**Schema:** Zod-validated via `CanvasStateSchema.partial().parse()` on hydration
**Reference:** `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md`

---

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

### `DesignTokens`
```ts
z.object({
  colors: z.object({
    background: z.string(),
    surface: z.object({ base: z.string(), elevated: z.string() }),
    border: z.object({ subtle: z.string(), muted: z.string() }),
    accent: z.object({ cyan: z.string(), orange: z.string() }),
    text: z.object({ primary: z.string(), secondary: z.string(), muted: z.string() }),
  }),
  typography: z.object({
    fontFamily: z.object({ sans: z.string(), mono: z.string() }),
    scale: z.array(TypographyStepSchema),
    lineHeight: z.object({ base: z.number(), arabic: z.number().min(1.4) }),
  }),
  spacing: z.object({ scale: z.array(z.number()) }),
  borderRadius: BorderRadiusSchema,
})
```

### `MotionTrack`
```ts
z.object({
  id: z.string().uuid(),
  componentId: z.string(),
  property: z.enum(['opacity', 'translateX', 'translateY', 'scale', 'stagger_delay']),
  keyframes: z.array(z.object({
    time: z.number().min(0),
    value: z.union([z.number(), z.string()]),
    easing: z.string(),
  })),
  reducedMotionFallback: z.enum(['instant', 'none']),
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

---

## 5. API Route Architecture

All API routes live at `.nezam/design-server/app/api/`. They use Next.js App Router Route Handlers.

### Route Map

```
app/api/
├── context/route.ts          GET  — project context
├── profiles/route.ts         GET  — list profiles from .nezam/design/
├── presets/
│   ├── route.ts              GET  — list presets
│   ├── save/route.ts         POST — save preset to localStorage + disk
│   └── sync-to-disk/route.ts POST — write preset to .nezam/design/
├── canvas/
│   ├── route.ts              GET  — fetch canvas nodes + wires
│   └── node/route.ts         POST — create canvas node
├── assets/
│   └── upload/route.ts       POST — upload + optimize asset
├── ai/
│   ├── vision-gate/route.ts  POST — scan image for embedded text
│   └── generate-node/route.ts POST — LLM-generate canvas node
└── session/
    └── save-page/route.ts    POST — persist generated page session
```

### Request / Response Contract

**Error envelope (all routes):**
```json
{ "error": "<human message>", "code": "<machine code>", "details": {} }
```

**Success HTTP codes:** 200 (GET/update), 201 (create), 204 (delete)

**Error HTTP codes:**
- 400 — validation failure (bad request shape)
- 404 — resource not found
- 409 — conflict (preset name collision)
- 422 — unprocessable (unsupported MIME type, zero-text violation)
- 500 — internal (filesystem write fail, LLM error)

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

---

## 6. CSS Token Injection Architecture

Design tokens flow from Zustand store → CSS custom properties → Tailwind v4 utilities.

```
useTokenStore.activeTokens
        │
        ▼ updateToken() action
document.documentElement.style.setProperty('--ds-color-accent-cyan', '#06B6D4')
        │
        ▼
Tailwind v4 picks up CSS custom property via @theme { ... }
        │
        ▼
Components use utility classes: text-[--ds-color-text-primary]
or CSS modules: color: var(--ds-color-text-primary)
```

**Token namespace prefixes:**
- `--ds-*` — design system tokens (colors, spacing, typography, radius)
- `--dv-*` — design viewer / canvas-specific (wire colors, node borders, timeline)

**Hot-reload latency target:** < 16ms (one animation frame)

---

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

### Layout Rules

- **All padding/margin:** logical properties only (`margin-inline-start`, `padding-block-end`)
- **No `left`/`right`/`ml-`/`pr-` classes** — Tailwind RTL variants (`rtl:`) permitted only where logical property unavailable
- **Canvas coordinate mirroring:** `deltaX = rtlMode ? -rawDeltaX : rawDeltaX`
- **Wire port anchoring:** source port X mirrors in RTL (`node.x` vs `node.x + node.width`)

### Arabic Typography

```css
:lang(ar) {
  font-family: var(--ds-font-arabic, 'IBM Plex Sans Arabic', sans-serif);
  line-height: var(--ds-leading-arabic); /* ≥ 1.4 */
  letter-spacing: 0; /* Arabic does not use letter-spacing */
}
```

---

## 8. Asset Pipeline

```
User drops file
      │
      ▼
/api/assets/upload (POST multipart)
      │
      ├─ MIME type check → reject if not in allowlist
      │
      ├─ SVG: DOMParser → scan for <text> nodes → reject if found
      │
      ├─ PNG/JPG: sharp → convert to WebP (quality 85)
      │
      ├─ WOFF2: passthrough (no processing)
      │
      └─ Save to .nezam/sessions/assets/<uuid>.<ext>
            │
            ▼
      return AssetItem { id, name, mimeType, optimizedUrl, visionStatus: 'pending' }
```

Vision Gate runs asynchronously after upload for image assets. Status updates from `'pending'` → `'valid'` or `'rejected'` via store update.

---

## 9. Local Filesystem Layout

```
.nezam/
├── design/                   ← Brand design profiles
│   ├── nezam-obsidian-cyan-orange/
│   │   └── design.md
│   └── <custom-presets>/
│       └── design.md
├── sessions/                 ← Generated page sessions
│   └── <pageId>/
│       ├── blocks.json       ← Wireframe blocks
│       └── spec.md           ← COMPONENT_SPEC.md
└── memory/                   ← Workspace memory (Claude/Cursor)
```

---

## 10. Performance Architecture

| Concern | Strategy | Target |
|---|---|---|
| CSS hot-reload | `style.setProperty()` direct injection | < 16ms |
| Disk compile | API route filesystem write | < 35ms |
| Canvas render | CSS `matrix()` affine transform, LOD rendering | 60fps p95 @ 50 nodes |
| Vision Gate | Haiku model, 3s timeout + retry | < 3s |
| LLM generation | Context compressed ≤ 32k tokens before call | < 8s round trip |
| Store hydration | Zod `.partial().parse()` with default fallback | < 5ms |
| Bundle size | Next.js code splitting per route | < 250KB initial JS |

### LOD (Level of Detail) Rendering

Canvas nodes switch visual detail based on viewport scale:

```
scale ≥ 0.4  → Full LOD (rounded rect + title + type badge + port handles + overlays)
0.1 ≤ scale < 0.4 → Simplified LOD (colored rect + title only)
scale < 0.1  → Dot LOD (8px circle, node-type color)
```

Implemented via `useMemo` + scale subscription in canvas component.

---

## 11. Security Architecture

| Threat | Mitigation |
|---|---|
| CSS injection via color inputs | Sanitize with CSS.supports() check before setProperty() |
| XSS via SVG ingest | DOMParser + allowlist element stripping |
| SVG `<text>` bypass | Recursive tree walker — reject on ANY text node |
| LLM prompt injection via wire directives | Directives treated as user content, not system prompt |
| Path traversal via asset upload | Filenames sanitized via `path.basename()` + uuid rename |
| Unvalidated state hydration | Zod `.parse()` on localStorage hydration — reset on failure |

---

## 12. Testing Architecture

```
tests/
├── unit/
│   ├── store/                ← Zustand store action tests (Vitest)
│   │   ├── session.store.test.ts
│   │   ├── tokens.store.test.ts
│   │   └── canvas-graph.store.test.ts
│   └── lib/
│       ├── token-injection.test.ts
│       └── context-compression.test.ts
├── integration/
│   ├── api/                  ← API route tests (Vitest + Supertest)
│   │   ├── presets.test.ts
│   │   ├── canvas.test.ts
│   │   └── assets.test.ts
│   └── components/           ← Component integration tests (Testing Library)
│       ├── CanvasWorkspace.test.tsx
│       └── PropertyInspector.test.tsx
└── e2e/                      ← (Phase 2 — Playwright)
```

**Coverage targets:** Store actions 90% · API routes 80% · Critical components 70%

---

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

*Generated: 2026-05-18 | Source: PRD v2.0.0 · PROJECT_PROMPT.md · SPEC-DS-CANVAS-001*
