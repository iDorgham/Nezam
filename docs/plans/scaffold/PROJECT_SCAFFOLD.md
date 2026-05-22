# Project Scaffold

> **Domain:** Nezam Platform Scaffold + Egypt Nightclub System Spec  
> **Phase:** Scaffold | **Source:** ARCHITECTURE.md · IA_CONTENT.md · PRD v2.0.0
> Complete directory and file tree maps for the workspace components.

---

# Part 1: Nezam Design Server Platform UI Suite

> Complete directory and file tree for the design-server application.
> All paths relative to `.nezam/design-server/`.

## Design-Server Root

```
.nezam/design-server/
├── app/                                        [Next.js App Router root]
│   ├── layout.tsx                              [Root layout — ThemeProvider, RTL dir, font injection]
│   ├── page.tsx                                [/ — Token Studio Dashboard (default mode)]
│   ├── globals.css                             [CSS custom property definitions, @theme for Tailwind v4]
│   ├── settings/
│   │   └── page.tsx                            [/settings — Settings page]
│   ├── profiles/
│   │   └── page.tsx                            [/profiles — Profile browser]
│   ├── sitemap/
│   │   └── page.tsx                            [/sitemap — Sitemap management]
│   ├── review/
│   │   └── page.tsx                            [/review — Review & Lock gateway]
│   ├── wireframe/
│   │   └── page.tsx                            [/wireframe — Wireframe editor]
│   ├── tokens/
│   │   └── page.tsx                            [/tokens — Token Studio standalone]
│   └── api/
│       ├── context/
│       │   └── route.ts                        [GET /api/context — project context]
│       ├── profiles/
│       │   └── route.ts                        [GET /api/profiles — list design profiles]
│       ├── lock/
│       │   └── route.ts                        [POST /api/lock — lock design contract]
│       ├── presets/
│       │   ├── route.ts                        [GET /api/presets — list presets]
│       │   ├── save/
│       │   │   └── route.ts                    [POST /api/presets/save]
│       │   └── sync-to-disk/
│       │       └── route.ts                    [POST /api/presets/sync-to-disk]
│       ├── canvas/
│       │   ├── route.ts                        [GET /api/canvas — fetch nodes + wires]
│       │   └── node/
│       │       └── route.ts                    [POST /api/canvas/node — create node]
│       ├── assets/
│       │   └── upload/
│       │       └── route.ts                    [POST /api/assets/upload — ingest + optimize]
│       ├── ai/
│       │   ├── vision-gate/
│       │   │   └── route.ts                    [POST /api/ai/vision-gate — scan for embedded text]
│       │   └── generate-node/
│       │       └── route.ts                    [POST /api/ai/generate-node — LLM generate]
│       └── session/
│           └── save-page/
│               └── route.ts                    [POST /api/session/save-page — persist generated page]
│
├── src/                                        [Application source]
│   ├── store/
│   │   ├── session.store.ts                    [useSessionStore — lang, theme, tabs, sync status]
│   │   ├── tokens.store.ts                     [useTokenStore — design tokens, presets, dirty flag]
│   │   └── canvas-graph.store.ts               [useCanvasGraphStore — nodes, wires, viewport, generation]
│   ├── types/
│   │   ├── tokens.types.ts                     [DesignPreset, DesignTokens, TypographyStep, etc.]
│   │   ├── canvas.types.ts                     [CanvasNode, CanvasWire, AttachmentPayload, ContextPayload]
│   │   ├── motion.types.ts                     [MotionTrack, Keyframe, EasingPreset]
│   │   └── asset.types.ts                      [AssetItem, MimeType, UploadResult]
│   ├── config/
│   │   └── design-tokens.config.ts             [Token CSS variable name map: --ds-* and --dv-* prefixes]
│   ├── hooks/
│   │   ├── useRTL.ts                           [RTL mode detection + dir injection]
│   │   ├── useTokenInjection.ts                [CSS setProperty hot-reload]
│   │   ├── useSyncStatus.ts                    [Sync state machine + debounce]
│   │   ├── useCanvasViewport.ts                [Pan/zoom + coordinate transforms]
│   │   └── useReducedMotion.ts                 [prefers-reduced-motion media query]
│   ├── lib/
│   │   ├── token-injection.ts                  [injectTokens(tokens) → CSS custom properties]
│   │   ├── context-compression.ts              [compressContext(payload, maxTokens) — 3-tier]
│   │   ├── canvas-math.ts                      [screenToCanvas, canvasToScreen, bezierControl]
│   │   ├── hardlock-check.ts                   [checkRTLGate, checkWCAGGate → HardlockFailure[]]
│   │   ├── svg-sanitizer.ts                    [stripSVGText, allowlistElements]
│   │   └── asset-optimizer.ts                  [convertToWebP, extractAltText]
│   └── styles/
│       ├── tokens.css                          [@theme { } — Tailwind v4 token integration]
│       └── canvas.css                          [Canvas-specific styles, LOD transitions]
│
├── components/                                 [UI components]
│   ├── layout/
│   │   ├── AppShell.tsx                        [3-column shell — TopNav + LeftDock + Main + RightDock]
│   │   ├── TopNav.tsx                          [Navbar — logo, tabs, lang, theme, sync pill]
│   │   ├── LeftDock.tsx                        [Context-sensitive left sidebar]
│   │   ├── RightDock.tsx                       [Context-sensitive right inspector]
│   │   └── BottomDock.tsx                      [Motion Studio collapsible dock]
│   ├── tokens/
│   │   ├── ColorEditor.tsx                     [F-001/F-002: color pickers + hex inputs]
│   │   ├── BorderRadiusEditor.tsx              [F-003: slider + token grid]
│   │   ├── TypographyScaleGrid.tsx             [F-004: 8-step clamp() scale grid]
│   │   ├── ProfileCard.tsx                     [Design profile card (system/custom)]
│   │   ├── ProfileSelector.tsx                 [Profile picker sidebar]
│   │   ├── SyncStatusPill.tsx                  [F-002: sync state indicator]
│   │   └── TokenEditor.tsx                     [Main token editor tabs]
│   ├── canvas/
│   │   ├── CanvasWorkspace.tsx                 [F-005: main canvas container, pan/zoom]
│   │   ├── CanvasNode.tsx                      [Node rendering — all 3 LOD variants]
│   │   ├── BezierWire.tsx                      [SVG bezier wire + dash-flow animation]
│   │   ├── FloatingToolbar.tsx                 [Canvas floating action bar]
│   │   ├── WireInspector.tsx                   [Right dock wire inspector panel]
│   │   ├── VisionGateBadge.tsx                 [Attachment scan status badge]
│   │   ├── HardlockOverlay.tsx                 [Node orange border + failure badges]
│   │   └── GenerateButton.tsx                  [Generate CTA with state machine]
│   ├── inspector/
│   │   ├── PropertyInspector.tsx               [F-007: main inspector panel]
│   │   ├── BoxModelFields.tsx                  [Logical property inputs]
│   │   ├── TypographyFields.tsx                [Font/weight/size/leading editors]
│   │   ├── A11yTab.tsx                         [Contrast badge + ARIA + tab order]
│   │   └── HardlockError.tsx                   [Inline error message for blocked inputs]
│   ├── motion/
│   │   ├── MotionStudio.tsx                    [F-006: main motion studio dock]
│   │   ├── Timeline.tsx                        [Timeline ruler + keyframe grid]
│   │   ├── TrackList.tsx                       [Property track rows]
│   │   ├── KeyframeDiamond.tsx                 [◆ draggable keyframe marker]
│   │   └── EasingSelector.tsx                  [Easing preset picker + curve preview]
│   ├── assets/
│   │   ├── AssetBrowser.tsx                    [F-008: asset grid + upload]
│   │   ├── AssetCard.tsx                       [Asset thumbnail card]
│   │   ├── DropZone.tsx                        [Drag + drop upload zone]
│   │   └── UploadProgress.tsx                  [Per-file upload progress bar]
│   ├── ui/
│   │   ├── Button.tsx                          [Primary / Ghost / Danger variants]
│   │   ├── Input.tsx                           [Text input with token label]
│   │   ├── Badge.tsx                           [Status / Type badges]
│   │   ├── Chip.tsx                            [Small interactive label]
│   │   ├── Separator.tsx                       [Section separator]
│   │   ├── Toast.tsx                           [System notification toast]
│   │   ├── EmptyState.tsx                      [Centered icon + headline + CTA]
│   │   ├── Tooltip.tsx                         [Hover detail tooltip]
│   │   └── TabBar.tsx                          [Scrollable tab container]
│   └── wireframe/
│       ├── WireframeEditor.tsx                 [Wireframe editor container]
│       ├── BlockLibrary.tsx                    [Block type library panel]
│       ├── BlockRenderer.tsx                   [Block-specific renderers]
│       └── PropsPanel.tsx                      [Block property editor]
│
├── public/                                     [Static assets]
│   ├── fonts/                                  [Self-hosted Geist + JetBrains Mono]
│   └── icons/                                  [App icon, favicon]
│
├── tests/                                      [Test suite]
│   ├── unit/
│   │   ├── store/
│   │   │   ├── session.store.test.ts
│   │   │   ├── tokens.store.test.ts
│   │   │   └── canvas-graph.store.test.ts
│   │   └── lib/
│   │       ├── token-injection.test.ts
│   │       ├── context-compression.test.ts
│   │       ├── canvas-math.test.ts
│   │       └── hardlock-check.test.ts
│   └── integration/
│       ├── api/
│       │   ├── presets.test.ts
│       │   ├── canvas.test.ts
│       │   └── assets.test.ts
│       └── components/
│           ├── CanvasWorkspace.test.tsx
│           └── PropertyInspector.test.tsx
│
├── package.json                                [dependencies: next, zustand, zod, motion, @tanstack/react-query, @anthropic-ai/sdk]
├── tsconfig.json                               [strict: true, paths: { "@/*": ["./src/*"] }]
├── tailwind.config.ts                          [v4 config — CSS variables mode]
├── next.config.js                              [port: 4000, typescript.ignoreBuildErrors: false]
├── postcss.config.js                           [tailwind + autoprefixer]
└── .env.local                                  [ANTHROPIC_API_KEY]
```

## File Creation Priority

| Priority | Files | Phase |
|---|---|---|
| P0 — Foundation | `layout.tsx`, `globals.css`, `tokens.css`, `session.store.ts`, `tokens.store.ts`, `canvas-graph.store.ts` | Phase 1 |
| P0 — Core Features | `ColorEditor.tsx`, `BorderRadiusEditor.tsx`, `TypographyScaleGrid.tsx`, `SyncStatusPill.tsx`, `CanvasWorkspace.tsx`, `CanvasNode.tsx`, `BezierWire.tsx` | Phase 1 |
| P0 — Inspector | `PropertyInspector.tsx`, `BoxModelFields.tsx`, `A11yTab.tsx` | Phase 1 |
| P0 — API Routes | All routes under `app/api/` | Phase 1 |
| P0 — Lib | `token-injection.ts`, `canvas-math.ts`, `hardlock-check.ts`, `svg-sanitizer.ts` | Phase 1 |
| P1 — Motion | All `components/motion/` files | Phase 2 |
| P1 — Assets | All `components/assets/` files | Phase 2 |
| P1 — Tests | All `tests/` files | Phase 2 |

---

# Part 2: Nightclub Reservation System Application

> Complete directory and file tree for the Web Dashboard and Flutter mobile components.
> All paths relative to the workspace root `/`.

## Directory Tree

```text
/
├── src/                                [Web Dashboard - Next.js]
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                [Landing Page]
│   │   │   └── book/[club-slug]/page.tsx [Table Booking Page]
│   │   ├── admin/
│   │   │   ├── owner/page.tsx          [Owner Dashboard]
│   │   │   ├── manager/page.tsx        [Manager Dashboard]
│   │   │   ├── accountant/page.tsx     [Accountant Dashboard]
│   │   │   └── tables/page.tsx         [Floor Plan Editor]
│   │   └── layout.tsx                  [Root Layout]
│   ├── components/
│   │   ├── ui/                         [Base UI Components]
│   │   └── features/                   [Feature Components]
│   └── lib/
│       ├── supabase/                   [Supabase Client]
│       └── utils/                      [Helper Functions]
├── mobile/                             [Mobile Apps - Flutter]
│   ├── lib/
│   │   ├── sales/
│   │   │   ├── dashboard.dart          [Sales Dashboard]
│   │   │   └── reservations.dart       [Reservations List]
│   │   ├── security/
│   │   │   ├── scanner.dart            [QR Scanner]
│   │   │   └── list.dart               [Guest List]
│   │   └── main.dart                   [Entry Point]
│   └── pubspec.yaml                    [Flutter Config]
├── docs/
│   ├── plan/                           [Planning Docs]
│   └── start/                          [PRD]
└── scripts/
    └── scaffold.sh                     [Scaffold Script]
```

## Config File Inventory
- `src/package.json` (Next.js dependencies)
- `mobile/pubspec.yaml` (Flutter dependencies)
- `.gitignore`
- `README.md`

## Database Schema
- Managed via Supabase (PostgreSQL). Migrations are placed in `supabase/migrations/` under local development.

---

*Generated: 2026-05-18 | Source: ARCHITECTURE.md · IA_CONTENT.md · PRD v2.0.0 · new-planning merge*
