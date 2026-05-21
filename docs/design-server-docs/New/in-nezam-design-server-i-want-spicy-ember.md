# NEZAM Infinity Canvas Builder — Architecture & Implementation Plan

> Scope: `.nezam/design-server` — evolve the current Next.js app into a Webflow/Divhunt-class visual builder with infinite sitemap canvas, page DOM tree editing, advanced design tokens, AI-assisted section generation, and agent-routed export handoff. Plan-only document — no edits performed.

---

## 1. Context

### Why this change

`.nezam/design-server` today has the right **bones** but the wrong **shape** for the workflow the user described:

- **Three disconnected canvas implementations** exist in parallel: `components/canvas/CanvasWorkspace.tsx` (hand-rolled SVG sitemap with straight-line connections, no zoom, no bezier), `components/layout-designer/CanvasArea.tsx` (flat vertical slot stack — not a real DOM tree), and `components/wireframe/WireframeCanvas.tsx` (a third surface). Users get lost because the same concepts live in three places.
- **Sitemap is a flat list with indent/outdent** (`components/sitemap/SitemapTree.tsx`) — no graph, no wires between Page ↔ Service ↔ DB ↔ Auth nodes, no double-click "dive in" to a page.
- **Page design is slot-based, not tree-based**: `LayoutSlot` is one level deep (`lib/layout-designer/types.ts`). The user wants to "drop components or elements like text or paragraphs into empty sections" — that requires a recursive node tree.
- **Right panel is two-tab placeholder** (`components/layout/GlobalRightPanel.tsx`: Properties / Settings, only renders on `/sitemap`). User wants Layers + Page Settings + Meta Tags + CSS + Typography + Background & Borders + Effects & Animation — a context-aware inspector engine.
- **No animation timeline, no value-scrubbing, no Google Fonts loader, no AI section generator, no onboarding flow.**
- **Export routes to one file** (`wireframes_locked.json` via `/api/export-wireframes`) — the user wants exports split per-agent so `design-server-sitemap`, `design-server-tokens`, `design-server-wireframe`, and `design-server-specialist` each pick up the slice they own from `.nezam/HANDOFF_QUEUE.yaml`.

### Intended outcome

One unified shell with:
- **One canvas engine** that switches between **Sitemap Mode** (graph: page nodes wired with bezier curves to other pages, services, auth, DB) and **Page Mode** (recursive DOM tree editor with layers/inspector).
- **One state model** (`CanvasNode` recursive tree, `BezierWire` typed connections, `PageMeta`, `ComponentStyles`) with Zustand + Immer + Zundo undo stack.
- **One context-aware right inspector** with 7 tabs that re-render based on selection.
- **One export pipeline** that compiles the canvas AST and routes per-slice payloads to the four design-server agents via `HANDOFF_QUEUE.yaml`.
- **First-time onboarding + tooltips + autosave + resizable/collapsible panels** so the user "is not lost".

### Hardlocks the plan must respect

Verified from `.cursor/rules/design-server-gates.mdc` and `.cursor/rules/sdd-pipeline-v2.mdc`:
- `wireframes_locked.json` must remain the gate artifact for `/DEVELOP`. The new export must continue writing this file (extended schema, backward-compatible).
- WCAG 2.2 AA contrast must hold in light + dark (token studio already validates — extend on color picks).
- RTL/MENA: keep CSS logical properties (`padding-inline-start`, `text-start`, `margin-inline-end`) — existing `layout.tsx` already toggles `dir`. Inspector inputs must remain logical, never `left/right`.
- Zero-text constraint for placeholder artwork: AI-generated SVG placeholders may contain shapes only — no rasterized text. Lint on export rejects `<text>` inside placeholder SVGs.

---

## 2. Architectural decisions

### 2.1 Library additions (minimal, opinionated)

| Capability | Pick | Reason |
|---|---|---|
| Infinite pan/zoom + bezier wires | **`@xyflow/react`** (v12+) | Industry standard for node graphs, React 19 + App Router compatible (client component), built-in minimap/controls/snap-to-grid, custom node + custom edge support. Replaces hand-rolled SVG in `CanvasWorkspace`. |
| Nested DOM-tree state updates | **`immer`** as Zustand middleware | Already-installed Zustand 5 supports middleware; recursive `CanvasNode` updates become readable. |
| Undo / redo | **`zundo`** (Zustand temporal) | Drop-in middleware, ~1KB, plays well with Immer. |
| Layers tree drag-reorder | Keep **`@dnd-kit/sortable`** (installed) + custom tree adapter | Already used in `SitemapTree` and `CanvasArea`. No new dep. |
| Animation timeline runtime | **`theatre.js`** (`@theatre/core` + `@theatre/studio` in dev) | Mature keyframe + easing-curve editor; studio is a thin overlay we can host inside our timeline panel. |
| Google Fonts at runtime | **Manual `<link>` injection** (not `next/font/google` — build-time only) | Loader util + curated 100-font shortlist. |
| AI section generation | **`ai` + `@ai-sdk/react`** via **Vercel AI Gateway** (`provider/model` strings) | App Router streaming, no provider lock-in. |
| Color picker | Keep **`react-colorful`** (installed) | Already used in token studio. |

No `craft.js`, no `puck`, no `react-flow` (old name), no `tldraw`. We own the inspector and library panel ourselves.

### 2.2 Mode switching — one canvas, two modes

```
┌─ /canvas                        SITEMAP MODE   (xyflow graph)
│   ├─ Page nodes (with route + nav badge)
│   ├─ Service nodes (DB, cache, auth, AI, mail, CRM)
│   ├─ Bezier wires typed: nav | data | auth | api
│   └─ Double-click page node → push /canvas/[pageId]
│
└─ /canvas/[pageId]              PAGE MODE      (DOM tree editor)
    ├─ Header / Footer / Sections / Empty Section / Elements
    ├─ Layers tree (recursive)
    ├─ Inspector (7 tabs, context-aware)
    └─ ESC → pop back to /canvas
```

The mode is a derived value from the URL; one Zustand store holds both the graph AND the tree. App Router `[pageId]` provides shareable deep links.

### 2.3 Folder layout

```
.nezam/design-server/
├── app/
│   ├── canvas/
│   │   ├── page.tsx              ← SITEMAP MODE entry (replaces components/canvas/CanvasWorkspace.tsx wrapper)
│   │   └── [pageId]/page.tsx     ← PAGE MODE entry (consolidates layout-designer + wireframe routes)
│   ├── canvas-onboarding/
│   │   └── page.tsx              ← first-run 5-step tour (or inline overlay)
│   └── api/
│       ├── export-wireframes/    ← (existing) — extend writer to split per agent
│       ├── export-sitemap/       ← NEW: writes sitemap.json
│       ├── export-tokens/        ← NEW: writes tokens.json + DESIGN.md tokens block
│       ├── export-meta/          ← NEW: writes meta.json
│       ├── handoff/              ← NEW: append entry to .nezam/HANDOFF_QUEUE.yaml
│       ├── ai-section/           ← NEW: streaming section generator (AI SDK v6)
│       └── fonts/                ← NEW: Google Fonts catalog proxy + on-demand injector
│
├── components/
│   ├── builder/                  ← NEW unified shell — replaces fragmented per-route shells
│   │   ├── BuilderShell.tsx      ← Top + Left + Center + Right + Bottom layout
│   │   ├── TopBar.tsx            ← Save/Undo/Redo/Preview/Export + mode breadcrumb
│   │   ├── LeftDock.tsx          ← Components / Sections / Assets / Pages tabs
│   │   ├── RightInspector.tsx    ← 7-tab dynamic engine
│   │   ├── BottomTimeline.tsx    ← collapsible animation timeline (theatre.js)
│   │   ├── OnboardingTour.tsx    ← first-run 5-step overlay
│   │   └── KeyboardShortcuts.tsx ← keymap provider (Cmd+Z, Cmd+S, Esc, Space-drag, etc.)
│   │
│   ├── canvas/
│   │   ├── SitemapCanvas.tsx     ← xyflow graph wrapper (renames CanvasWorkspace responsibility)
│   │   ├── PageCanvas.tsx        ← recursive DOM tree renderer with selection overlay
│   │   ├── nodes/
│   │   │   ├── PageNode.tsx      ← custom xyflow node for pages
│   │   │   ├── ServiceNode.tsx   ← DB/cache/auth/AI nodes
│   │   │   └── GroupNode.tsx     ← container/grouping
│   │   ├── edges/
│   │   │   └── BezierWire.tsx    ← custom typed edge with animated dash
│   │   ├── Minimap.tsx
│   │   ├── SnapGrid.tsx
│   │   └── SelectionOverlay.tsx  ← page-mode selection box + resize handles
│   │
│   ├── inspector/                ← NEW — replaces GlobalRightPanel
│   │   ├── tabs/
│   │   │   ├── LayersTab.tsx
│   │   │   ├── PageSettingsTab.tsx
│   │   │   ├── MetaTagsTab.tsx
│   │   │   ├── CssVisualTab.tsx
│   │   │   ├── TypographyTab.tsx
│   │   │   ├── BackgroundBordersTab.tsx
│   │   │   └── EffectsAnimationTab.tsx
│   │   ├── controls/
│   │   │   ├── NumberScrubber.tsx       ← drag-on-label value scrubbing
│   │   │   ├── ColorWell.tsx            ← react-colorful + token suggestion
│   │   │   ├── TokenPicker.tsx          ← pick existing token vs custom value
│   │   │   ├── BezierCurveEditor.tsx    ← in/out/inout easing visualiser
│   │   │   ├── FontPicker.tsx           ← Google Fonts + local + variable axes
│   │   │   └── ResponsiveToggle.tsx     ← per-breakpoint override
│   │   └── InspectorTabEngine.tsx       ← which tabs render given current selection+mode
│   │
│   ├── library/                  ← NEW — replaces LibraryPanel + wireframe gallery duplicates
│   │   ├── ComponentsTab.tsx     ← primitives (Box, Text, Image, Button, Input, Video, Icon, Shape)
│   │   ├── SectionsTab.tsx       ← ready-made sections with dummy data (re-use existing block library)
│   │   ├── AssetsTab.tsx         ← existing AssetManagerOverlay collapsed into a tab
│   │   ├── PagesTab.tsx          ← list of pages with quick jump
│   │   └── DragSource.tsx        ← unified HTML5 + dnd-kit drag source
│   │
│   ├── hero-tool/                ← NEW — dedicated hero/typography/graphics animator
│   │   ├── HeroComposer.tsx
│   │   ├── TimelineTrack.tsx
│   │   └── EasingPresets.tsx     ← in/out + 14 named curves
│   │
│   └── ai/                       ← extend existing AICommandBar
│       ├── AICommandBar.tsx      ← (existing) — wire to streaming section gen
│       └── SectionGenerator.tsx  ← NEW — modal that emits CanvasNode subtree
│
└── lib/
    ├── canvas/
    │   ├── canvas.store.ts       ← NEW unified Zustand store w/ immer + zundo
    │   ├── canvas.types.ts       ← CanvasNode / BezierWire / PageMeta / ComponentStyles
    │   ├── canvas.selectors.ts   ← memoised graph + tree derivations
    │   ├── canvas.serialize.ts   ← AST ↔ wireframes_locked.json (recursive)
    │   ├── canvas.history.ts     ← zundo wrapper + command labelling for undo UI
    │   └── canvas.compat.ts      ← shim: read legacy LayoutSlot[] → CanvasNode tree
    │
    ├── tokens/                   ← consolidate existing tokens.store + token-injector
    │   ├── tokens.css-vars.ts    ← live --ds-* writer (extracted from token-injector.ts)
    │   ├── tokens.contrast.ts    ← WCAG 2.2 AA validator
    │   └── tokens.profile.ts     ← unified token profile JSON
    │
    ├── fonts/
    │   ├── google-fonts.ts       ← runtime <link> injector + LRU
    │   └── catalog.ts            ← curated 100-font shortlist
    │
    ├── ai/
    │   ├── ai-gateway.ts         ← AI SDK v6 client w/ provider/model strings
    │   └── section-prompts.ts    ← templated prompts per section category
    │
    ├── handoff/
    │   ├── handoff.queue.ts      ← read/append .nezam/HANDOFF_QUEUE.yaml
    │   ├── handoff.routes.ts     ← which agent receives which slice
    │   └── handoff.schemas.ts    ← Zod schemas for each agent's payload
    │
    └── autosave/
        └── autosave.ts           ← (existing) — extend: debounced + multi-tier (local + remote)
```

### 2.4 What gets deleted / superseded (carefully — see verification)

- `components/canvas/CanvasWorkspace.tsx` → replaced by `SitemapCanvas` (port useful node-state shape).
- `components/layout/GlobalRightPanel.tsx` → replaced by `RightInspector`.
- `components/layout-designer/{LibraryPanel,InspectorPanel,CanvasArea}.tsx` → folded into `LeftDock` / `RightInspector` / `PageCanvas`. Keep `lib/layout-designer/` intact during transition via `canvas.compat.ts`.
- Per-route designer pages (`app/header-designer/`, `app/footer-designer/`, `app/side-panel-designer/`, `app/layout-designer/`) → become **modes inside `/canvas/[pageId]`** (Header / Footer / Body / Side filter chips on the page node). Keep the routes redirecting for one release to avoid breaking the `Sidebar.tsx` deep links.

---

## 3. Component architecture (deliverable #1)

```
<RootLayout>                         app/layout.tsx (existing — keep RTL/theme wiring)
  └─ <BuilderShell>                  components/builder/BuilderShell.tsx
       ├─ <TopBar>                   Save/Undo/Redo/Preview/Export/Lock + breadcrumb + lang+theme
       ├─ <LeftDock collapsible>     Tabs: Components | Sections | Assets | Pages
       │     └─ <DragSource>         emits CanvasNode payload on drop
       ├─ <CanvasEngine>             switches by route
       │     ├─ /canvas              <SitemapCanvas>  (xyflow)
       │     │                          ├─ <PageNode/> <ServiceNode/> <GroupNode/>
       │     │                          ├─ <BezierWire/>
       │     │                          ├─ <Minimap/>  <Controls/>  <SnapGrid/>
       │     │                          └─ on dbl-click page → router.push(/canvas/[id])
       │     │
       │     └─ /canvas/[pageId]     <PageCanvas>     (recursive DOM tree)
       │                                ├─ <NodeRenderer node={root}/>  (recursive)
       │                                ├─ <SelectionOverlay/>
       │                                └─ <DropZone/>  between siblings
       │
       ├─ <RightInspector collapsible>
       │     └─ <InspectorTabEngine>  picks visible tabs based on (mode, selection.kind)
       │           ├─ <LayersTab/>
       │           ├─ <PageSettingsTab/>
       │           ├─ <MetaTagsTab/>
       │           ├─ <CssVisualTab/>
       │           ├─ <TypographyTab/>
       │           ├─ <BackgroundBordersTab/>
       │           └─ <EffectsAnimationTab/>
       │
       ├─ <BottomTimeline collapsible> visible when EffectsAnimationTab active or hero-tool open
       │
       ├─ <OnboardingTour/>           first-run only — Radix Dialog stack
       ├─ <KeyboardShortcuts/>
       └─ <Toaster/>                  Radix Toast for autosave/handoff feedback
```

All panels are `Resizable` (custom split-pane using pointer events + `padding-inline-start` to respect RTL). Collapsed widths persist in `localStorage` (key: `nezam.builder.panels`).

---

## 4. State interfaces (deliverable #2)

Lives at `lib/canvas/canvas.types.ts`.

```ts
// ── Atoms ────────────────────────────────────────────────────────────────────

export type NodeId       = string  // nanoid(10)
export type Breakpoint   = 'mobile' | 'tablet' | 'desktop'
export type SpacingKey   = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
export type DisplayMode  = 'block' | 'flex' | 'grid' | 'inline-flex' | 'hidden'
export type StateKey     = 'normal' | 'hover' | 'focus' | 'active' | 'disabled'

// Token-or-literal — every style value can resolve a --ds-* token or be a raw CSS value.
export type TokenRef<T = string> =
  | { kind: 'token'; tokenId: string }    // 'color.primary' / 'spacing.md' / 'typography.size.lg'
  | { kind: 'literal'; value: T }

// ── ComponentStyles — per-state, per-breakpoint ──────────────────────────────

export interface BoxModel {
  marginInline?: TokenRef<string>     // logical — never margin-left/right
  marginBlock?:  TokenRef<string>
  paddingInline?: TokenRef<string>
  paddingBlock?:  TokenRef<string>
  width?:  string  // '100%' | '320px' | 'auto'
  height?: string
  zIndex?: number
}

export interface LayoutBox {
  display?: DisplayMode
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: TokenRef<string>
  gridTemplateColumns?: string        // 'repeat(12, 1fr)' etc.
  gridColumnSpan?: number             // 1..12
}

export interface Typography {
  fontFamily?: TokenRef<string>       // resolves Google Font slug or token
  fontSize?: TokenRef<string>
  fontWeight?: number
  lineHeight?: string
  letterSpacing?: string
  textAlign?: 'start' | 'center' | 'end' | 'justify'   // logical — not left/right
  textTransform?: 'none' | 'upper' | 'lower' | 'capitalize'
  fontVariationSettings?: string       // for variable fonts
}

export interface BackgroundFill {
  type: 'color' | 'gradient' | 'image' | 'video'
  color?: TokenRef<string>
  gradient?: { angle: number; stops: Array<{ offset: number; color: TokenRef<string> }> }
  imageAssetId?: string
  videoAssetId?: string
  blendMode?: string
}

export interface Borders {
  inlineStartWidth?: string
  inlineEndWidth?:   string
  blockStartWidth?:  string
  blockEndWidth?:    string
  color?: TokenRef<string>
  style?: 'solid' | 'dashed' | 'dotted'
  radiusTopStart?: TokenRef<string>
  radiusTopEnd?:   TokenRef<string>
  radiusBottomStart?: TokenRef<string>
  radiusBottomEnd?:   TokenRef<string>
  outlineColor?: TokenRef<string>
  outlineWidth?: string
}

export interface Effects {
  opacity?: number                    // 0..1
  filter?: string                     // 'blur(4px)' etc.
  backdropFilter?: string
  boxShadow?: TokenRef<string>
  mixBlendMode?: string
  transform?: string                  // 'translate3d(...) scale(...)'
  transformOrigin?: string
  cursor?: string
}

export interface AnimationTrack {
  id: string
  property: 'opacity' | 'transform' | 'filter' | 'color' | 'backgroundColor'
  keyframes: Array<{
    t: number                          // 0..1 normalised time
    value: string | number
    easing: BezierCurve               // see below
  }>
  trigger: 'mount' | 'inView' | 'hover' | 'focus' | 'scroll' | 'click'
  duration: number                    // ms
  delay: number                       // ms
  loop?: 'none' | 'infinite' | { count: number }
  direction?: 'normal' | 'reverse' | 'alternate'
}

export interface BezierCurve {
  // cubic-bezier(p1x, p1y, p2x, p2y) — visualised in BezierCurveEditor
  p1x: number; p1y: number; p2x: number; p2y: number
  preset?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring' | 'bounce' | string
}

export interface ComponentStyles {
  // Per-state, per-breakpoint. Cascade: normal → hover overrides → focus overrides...
  // Per-breakpoint: mobile is the base, tablet/desktop are overrides.
  base: {
    box?:        BoxModel
    layout?:     LayoutBox
    typography?: Typography
    background?: BackgroundFill
    borders?:    Borders
    effects?:    Effects
  }
  states?: Partial<Record<Exclude<StateKey, 'normal'>, Partial<ComponentStyles['base']>>>
  breakpoints?: Partial<Record<Exclude<Breakpoint, 'mobile'>, Partial<ComponentStyles['base']>>>
  animations?: AnimationTrack[]
}

// ── CanvasNode (recursive) ───────────────────────────────────────────────────

export type NodeKind =
  | 'page-root'      // top of a page — also carries PageMeta
  | 'section'        // header/hero/footer/content/empty
  | 'container'      // generic grouping (flex/grid)
  | 'text'           // <p>/<span> with rich-text token
  | 'heading'        // <h1>..<h6>
  | 'image'
  | 'video'
  | 'button'
  | 'input'
  | 'icon'
  | 'shape'          // SVG primitive (rect/circle/path) — for zero-text artwork
  | 'embed'          // raw HTML / iframe
  | 'slot'           // back-compat shim wrapping a legacy LibraryBlock variant

export interface CanvasNode {
  id: NodeId
  kind: NodeKind
  label: string                       // user-editable layer name
  componentRef?: string               // when kind='slot' — points to LibraryBlock.id
  variantRef?: string                 // and variant
  props?: Record<string, unknown>     // arbitrary per-kind props (text content, src, href, etc.)
  styles: ComponentStyles
  children?: CanvasNode[]             // recursive — only for container/section/page-root
  locked?: boolean
  hidden?: boolean
  approvedBy?: 'user' | 'ai' | 'agent'
  notes?: string
  createdAt: string
  updatedAt: string
}

// ── BezierWire (sitemap graph edge) ──────────────────────────────────────────

export type WireKind = 'nav' | 'data' | 'auth' | 'api' | 'redirect'
export type WireDirection = 'in' | 'out' | 'both'

export interface BezierWire {
  id: string
  fromNodeId: NodeId
  toNodeId:   NodeId
  fromHandle?: 'top' | 'bottom' | 'inline-start' | 'inline-end'
  toHandle?:   'top' | 'bottom' | 'inline-start' | 'inline-end'
  kind: WireKind
  direction: WireDirection
  label?: string
  animated?: boolean
}

// ── PageMeta (lives on page-root nodes; SEO + routing) ───────────────────────

export interface PageMeta {
  pageId: string
  route: string                                 // '/about'
  title: string
  description: string
  type: 'public' | 'auth' | 'admin' | 'modal' | 'embed'
  navLabel?: string
  navIcon?: string
  showInNav: boolean
  parentId?: NodeId
  // SEO
  og: {
    title?: string
    description?: string
    imageAssetId?: string
    twitterCard?: 'summary' | 'summary_large_image'
  }
  headTags: Array<{ tag: 'meta' | 'link' | 'script'; attrs: Record<string, string> }>
  canonical?: string
  robots?: string                               // 'index,follow' etc.
  // i18n
  altLocales?: Record<string, string>           // { ar: '/ar/about' }
  dir?: 'ltr' | 'rtl' | 'auto'
}

// ── SitemapGraph (xyflow-compatible) ─────────────────────────────────────────

export interface SitemapGraphNode {
  id: NodeId
  type: 'page' | 'service' | 'group' | 'auth' | 'db' | 'ai' | 'note'
  position: { x: number; y: number }
  data: {
    label: string
    subType?: string                            // 'database' | 'cache' | 'mobile' | 'web' | ...
    color?: string
    icon?: string
    pageMeta?: PageMeta                         // only when type='page'
    locked?: boolean
  }
}

export interface SitemapGraph {
  nodes: SitemapGraphNode[]
  wires: BezierWire[]
  viewport: { x: number; y: number; zoom: number }
}

// ── Root document — what the store holds, what gets serialised ───────────────

export interface BuilderDocument {
  $schemaVersion: '3.0.0'
  documentId: string
  projectContextRef?: string                   // pointer back to .nezam/...
  sitemap: SitemapGraph
  pages: Record<NodeId, CanvasNode>            // page-root nodes keyed by id; subtree = page DOM
  tokens: import('@/lib/tokens/tokens.profile').TokenProfile
  lockedAt: string | null
  exportedAt: string | null
  history: { undoCount: number; redoCount: number }
}
```

---

## 5. Right panel implementation — dynamic tab engine (deliverable #3)

Lives at `components/inspector/InspectorTabEngine.tsx`. Uses **Radix `Tabs`** (already installed).

### 5.1 Visible-tab matrix

| Mode \ Selection | Layers | PageSettings | MetaTags | CSS | Typography | Bg/Borders | Effects/Anim |
|---|---|---|---|---|---|---|---|
| Sitemap, no selection           | — | — | — | — | — | — | — |
| Sitemap, page node selected     | ● | ● | ● | — | — | — | — |
| Sitemap, service/db node sel.   | — | ● (Service) | — | — | — | — | — |
| Sitemap, wire selected          | — | ● (Routing) | — | — | — | — | — |
| Page, no selection (page-root)  | ● | ● | ● | ● | ● | ● | ● |
| Page, container/section sel.    | ● | — | — | ● | ● | ● | ● |
| Page, text/heading sel.         | ● | — | — | ● | ● | ● | ● |
| Page, image/video sel.          | ● | — | — | ● | — | ● | ● |
| Page, button/input sel.         | ● | — | — | ● | ● | ● | ● |

### 5.2 Engine sketch

```tsx
'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { useCanvasStore } from '@/lib/canvas/canvas.store'
import { useSelection } from '@/lib/canvas/canvas.selectors'
import { usePathname, useParams } from 'next/navigation'
import {
  Layers, FileCog, Globe, Code2, Type, Image as ImageIcon, Wand2,
} from 'lucide-react'

import LayersTab            from './tabs/LayersTab'
import PageSettingsTab      from './tabs/PageSettingsTab'
import MetaTagsTab          from './tabs/MetaTagsTab'
import CssVisualTab         from './tabs/CssVisualTab'
import TypographyTab        from './tabs/TypographyTab'
import BackgroundBordersTab from './tabs/BackgroundBordersTab'
import EffectsAnimationTab  from './tabs/EffectsAnimationTab'

type TabId =
  | 'layers' | 'page' | 'meta' | 'css' | 'typo' | 'bg' | 'fx'

const TAB_DEFS: Record<TabId, { label: string; labelAr: string; icon: React.ComponentType<any> }> = {
  layers: { label: 'Layers',     labelAr: 'الطبقات',    icon: Layers    },
  page:   { label: 'Page',       labelAr: 'الصفحة',     icon: FileCog   },
  meta:   { label: 'Meta',       labelAr: 'البيانات',   icon: Globe     },
  css:    { label: 'CSS',        labelAr: 'سي اس اس',  icon: Code2     },
  typo:   { label: 'Typography', labelAr: 'الخط',       icon: Type      },
  bg:     { label: 'BG/Borders', labelAr: 'الخلفية',    icon: ImageIcon },
  fx:     { label: 'Effects',    labelAr: 'التأثيرات',  icon: Wand2     },
}

function pickVisibleTabs(mode: 'sitemap' | 'page', sel: ReturnType<typeof useSelection>): TabId[] {
  if (mode === 'sitemap') {
    if (!sel) return []
    if (sel.kind === 'graph-page')    return ['layers', 'page', 'meta']
    if (sel.kind === 'graph-service') return ['page']
    if (sel.kind === 'graph-wire')    return ['page']
    return []
  }
  // page mode
  if (!sel || sel.kind === 'page-root') return ['layers', 'page', 'meta', 'css', 'typo', 'bg', 'fx']
  if (sel.node?.kind === 'image' || sel.node?.kind === 'video') {
    return ['layers', 'css', 'bg', 'fx']
  }
  return ['layers', 'css', 'typo', 'bg', 'fx']
}

export default function InspectorTabEngine() {
  const pathname = usePathname()
  const params = useParams<{ pageId?: string }>()
  const mode: 'sitemap' | 'page' = params.pageId ? 'page' : 'sitemap'

  const sel  = useSelection()
  const lang = useCanvasStore(s => s.lang)
  const visible = pickVisibleTabs(mode, sel)

  const active = useCanvasStore(s => s.inspectorActiveTab)
  const setActive = useCanvasStore(s => s.setInspectorActiveTab)

  // Auto-fallback if current tab disappears for new selection
  const safeActive = visible.includes(active as TabId) ? active : visible[0]

  if (visible.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <div className="text-xs text-ds-text-muted">
          {lang === 'ar' ? 'اختر عنصرًا لعرض خصائصه' : 'Select an item to inspect'}
        </div>
      </div>
    )
  }

  return (
    <Tabs.Root
      value={safeActive ?? visible[0]}
      onValueChange={(v) => setActive(v as TabId)}
      className="flex h-full min-h-0 flex-col"
      orientation="horizontal"
    >
      <Tabs.List
        aria-label="Inspector tabs"
        className="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-ds-border bg-ds-surface-subtle px-1"
      >
        {visible.map(id => {
          const def = TAB_DEFS[id]
          const Icon = def.icon
          return (
            <Tabs.Trigger
              key={id}
              value={id}
              title={lang === 'ar' ? def.labelAr : def.label}
              className="inline-flex shrink-0 items-center gap-1.5 px-2 py-2 text-[11px] text-ds-text-muted
                         data-[state=active]:text-ds-text-primary
                         data-[state=active]:border-b-2 data-[state=active]:border-ds-primary
                         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-border-focus"
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">{lang === 'ar' ? def.labelAr : def.label}</span>
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Tabs.Content value="layers" className="p-3"><LayersTab /></Tabs.Content>
        <Tabs.Content value="page"   className="p-3"><PageSettingsTab mode={mode} selection={sel} /></Tabs.Content>
        <Tabs.Content value="meta"   className="p-3"><MetaTagsTab /></Tabs.Content>
        <Tabs.Content value="css"    className="p-3"><CssVisualTab /></Tabs.Content>
        <Tabs.Content value="typo"   className="p-3"><TypographyTab /></Tabs.Content>
        <Tabs.Content value="bg"     className="p-3"><BackgroundBordersTab /></Tabs.Content>
        <Tabs.Content value="fx"     className="p-3"><EffectsAnimationTab /></Tabs.Content>
      </div>
    </Tabs.Root>
  )
}
```

### 5.3 Per-tab notes

- **LayersTab** — recursive tree rendered with `@dnd-kit/sortable` + `dnd-kit-sortable-tree` pattern (same approach as `SitemapTree.tsx`, depth via `marginInlineStart`). Each node has show/hide, lock, rename. Selecting a layer also selects on canvas (single source of truth: `canvasStore.selectedNodeId`).
- **PageSettingsTab** — In page-root: route, title, type, parent, navLabel/navIcon, container max-width, grid cols. In service node: subType + connection labels.
- **MetaTagsTab** — Title, description, canonical, robots, OG title/description/image, Twitter card, custom `<head>` tags (key/value list with Add).
- **CssVisualTab** — Box model (padding/margin logical, drag-on-edge), Layout (display/flex/grid with visual picker), Position (z-index scrubber, transform shortcuts).
- **TypographyTab** — `FontPicker` (Google Fonts + variable axes), size scrubber, weight, line-height scrubber, letter-spacing, text-align (logical), text-transform, RTL preview toggle.
- **BackgroundBordersTab** — Fill type (color/gradient/image/video), per-corner radius (token or px), per-side border width/colour/style (logical sides), outline.
- **EffectsAnimationTab** — Opacity slider, blur/backdrop-filter sliders, box-shadow presets, transform shortcuts, **per-state overrides** (normal/hover/focus/active), then an **Animations list** that opens the bottom timeline for keyframe editing on the selected track.

### 5.4 NumberScrubber (value scrubbing pattern)

```tsx
'use client'
import { useRef, useState } from 'react'

interface Props {
  value: number
  onChange: (next: number) => void
  step?: number
  min?: number
  max?: number
  unit?: string                  // 'px' | '%' | 'ms'
  label: string
  precision?: number             // decimals
}

export function NumberScrubber({ value, onChange, step = 1, min = -Infinity, max = Infinity, unit, label, precision = 0 }: Props) {
  const startRef = useRef<{ x: number; v: number } | null>(null)
  const [scrubbing, setScrubbing] = useState(false)

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId)
    startRef.current = { x: e.clientX, v: value }
    setScrubbing(true)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!startRef.current) return
    const dx = e.clientX - startRef.current.x
    const fine = e.shiftKey ? 0.1 : e.altKey ? 10 : 1     // shift = fine, alt = coarse
    const next = clamp(startRef.current.v + dx * step * fine, min, max)
    onChange(round(next, precision))
  }
  function onPointerUp(e: React.PointerEvent) {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId)
    startRef.current = null
    setScrubbing(false)
  }

  return (
    <label className="flex items-center gap-1.5">
      <span
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className={`select-none cursor-ew-resize text-[10px] uppercase tracking-wide text-ds-text-muted ${scrubbing ? 'text-ds-primary' : ''}`}
        title="Drag to scrub — Shift = fine, Alt = coarse"
      >{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={e => onChange(clamp(parseFloat(e.target.value || '0'), min, max))}
        className="w-16 bg-ds-background border border-ds-border rounded px-1.5 py-0.5 text-[11px] text-ds-text-primary focus-visible:outline-none focus-visible:border-ds-border-focus"
      />
      {unit && <span className="text-[10px] text-ds-text-muted">{unit}</span>}
    </label>
  )
}

const clamp = (n: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, n))
const round = (n: number, p: number) => Math.round(n * 10 ** p) / 10 ** p
```

---

## 6. CSS architecture snippet (deliverable #4)

Extends existing `app/globals.css` and `tailwind.config.ts` (already CSS-var-driven). The new pieces are: **glassmorphism panels**, **builder-specific tokens** for the canvas surface, and **RTL-aware collapsible mechanics**.

```css
/* app/globals.css (additions) ─────────────────────────────────────────────── */

:root {
  /* — Builder shell surfaces (DevFlow aesthetic) ─────────────────────────── */
  --bld-canvas-bg:         radial-gradient(rgba(138,143,152,0.18) 1.5px, transparent 1.5px) 0 0 / 24px 24px,
                           var(--ds-background);
  --bld-canvas-grid-color: color-mix(in oklab, var(--ds-text-muted) 14%, transparent);

  /* — Glassmorphism panels — built on token surface, not hardcoded ────────── */
  --bld-panel-bg:        color-mix(in oklab, var(--ds-surface) 78%, transparent);
  --bld-panel-border:    color-mix(in oklab, var(--ds-border) 80%, transparent);
  --bld-panel-blur:      14px;
  --bld-panel-elevation: var(--ds-elevation-lg);

  /* — Inspector value-scrubber accent ─────────────────────────────────────── */
  --bld-scrub-accent:    var(--ds-primary);

  /* — Animation curve presets (cubic-bezier) ──────────────────────────────── */
  --bld-ease-linear:      cubic-bezier(0,0,1,1);
  --bld-ease-out:         cubic-bezier(0.16,1,0.3,1);
  --bld-ease-in:          cubic-bezier(0.7,0,0.84,0);
  --bld-ease-inout:       cubic-bezier(0.83,0,0.17,1);
  --bld-ease-spring:      cubic-bezier(0.34,1.56,0.64,1);
  --bld-ease-bounce:      cubic-bezier(0.68,-0.55,0.27,1.55);

  /* — Layout sizing (overridable via JS for resizable panels) ─────────────── */
  --bld-left-dock-w:      280px;
  --bld-right-insp-w:     320px;
  --bld-bottom-time-h:    180px;
  --bld-topbar-h:         48px;
  --bld-collapse-w:       40px;
}

/* Dark mode overrides driven by [data-theme="dark"] (existing convention) */
[data-theme="dark"] {
  --bld-panel-bg:        color-mix(in oklab, var(--ds-surface) 60%, transparent);
  --bld-canvas-grid-color: color-mix(in oklab, #ffffff 6%, transparent);
}

/* — Panel primitive ──────────────────────────────────────────────────────── */
.bld-panel {
  background-color:        var(--bld-panel-bg);
  -webkit-backdrop-filter: blur(var(--bld-panel-blur)) saturate(140%);
          backdrop-filter: blur(var(--bld-panel-blur)) saturate(140%);
  border:                  1px solid var(--bld-panel-border);
  box-shadow:              var(--bld-panel-elevation);
  border-radius:           var(--ds-radius-lg);
}

/* — Logical-only borders for RTL safety — never *-left / *-right ─────────── */
.bld-panel--leading  { border-inline-end: 1px solid var(--bld-panel-border); border-inline-start: 0; }
.bld-panel--trailing { border-inline-start: 1px solid var(--bld-panel-border); border-inline-end: 0; }

/* — Collapsible widths (driven by data-collapsed on the parent) ──────────── */
[data-bld-dock]            { transition: width var(--ds-duration-normal) var(--bld-ease-out); }
[data-bld-dock="left"]     { width: var(--bld-left-dock-w);  }
[data-bld-dock="right"]    { width: var(--bld-right-insp-w); }
[data-bld-dock][data-collapsed="true"] { width: var(--bld-collapse-w); }

/* — Canvas surface ───────────────────────────────────────────────────────── */
.bld-canvas {
  background: var(--bld-canvas-bg);
  position: relative;
  overflow: hidden;
  inset-inline: 0;                    /* logical, RTL-safe */
}

/* — Selection overlay ────────────────────────────────────────────────────── */
.bld-selection {
  position: absolute;
  outline: 1.5px solid var(--ds-primary);
  outline-offset: -1px;
  pointer-events: none;
  border-radius: var(--ds-radius-sm);
}
.bld-selection::after {                       /* corner handles */
  content: '';
  position: absolute;
  inset-block-start: -4px;
  inset-inline-start: -4px;
  width: 8px; height: 8px;
  background: var(--ds-primary);
  border-radius: 2px;
}

/* — Value-scrubber cursor + active state ─────────────────────────────────── */
.bld-scrub-label              { cursor: ew-resize; user-select: none; }
.bld-scrub-label--active      { color: var(--bld-scrub-accent); }

/* — Focus visibility: WCAG 2.2 AA non-text contrast ≥ 3:1 ────────────────── */
.bld-focus-ring:focus-visible {
  outline: 2px solid var(--ds-border-focus);
  outline-offset: 1px;
}

/* — Reduced motion ───────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  [data-bld-dock], .bld-panel, .bld-selection { transition: none; }
}
```

```ts
// tailwind.config.ts — additions (merge into existing extend.* objects)
{
  backdropBlur: { 'bld-panel': '14px' },
  transitionTimingFunction: {
    'bld-out':    'cubic-bezier(0.16,1,0.3,1)',
    'bld-spring': 'cubic-bezier(0.34,1.56,0.64,1)',
  },
  zIndex: { 'bld-inspector': '40', 'bld-modal': '60', 'bld-toast': '70' },
}
```

Logical-property hygiene rule for the team: an ESLint rule (`eslint-plugin-tailwindcss` + custom regex) blocks `ml-/mr-/pl-/pr-/text-left/text-right` in `components/builder/**` and `components/inspector/**` — must use `ms-/me-/ps-/pe-/text-start/text-end`.

---

## 7. Build phases (incremental, shippable per phase)

Each phase ends with a working app that can be merged. No phase requires the next to be useful.

### Phase A — Foundation (1 sprint)
1. Add deps: `@xyflow/react`, `immer`, `zundo`, `@theatre/core`, `@theatre/studio`, `ai`, `@ai-sdk/react`.
2. Create `lib/canvas/canvas.types.ts`, `canvas.store.ts` (Zustand + immer + zundo), `canvas.compat.ts` (read legacy `LayoutSlot[]` from `useLayoutStore` → recursive `CanvasNode`).
3. Scaffold `components/builder/BuilderShell.tsx` with resizable/collapsible panels — empty stubs for LeftDock, CanvasEngine, RightInspector, BottomTimeline, TopBar.
4. Wire BuilderShell into `app/canvas/page.tsx` and `app/canvas/[pageId]/page.tsx`.
5. Port `app/layout.tsx` RTL + theme behavior into BuilderShell (it stays — BuilderShell mounts inside root `<body>`).
6. Verify: existing routes still work; new `/canvas` renders empty shell with collapsible panels.

### Phase B — Sitemap mode via xyflow (1 sprint)
1. `components/canvas/SitemapCanvas.tsx` wraps `<ReactFlow>` with custom nodes (`PageNode`, `ServiceNode`, `GroupNode`) and custom edge `BezierWire` (animated dash matching current style).
2. Toolbar: Add Page / Add Service / Add Group / Create Wire / Snap-to-grid / Minimap toggle.
3. Double-click page node → `router.push('/canvas/' + pageId)`.
4. Inspector `PageSettingsTab` + `MetaTagsTab` working for selected nodes.
5. Migrate state from `useSessionStore.sitemap` and `CanvasWorkspace` local state into `useCanvasStore.sitemap`.
6. Keep `app/sitemap/page.tsx` rendering legacy `SitemapTree` as a read-only fallback that shares state via `canvas.compat`.
7. Verify: pan/zoom/wire/dive-in works; existing `wireframes_locked.json` still produced.

### Phase C — Page mode + Recursive editor (2 sprints)
1. `components/canvas/PageCanvas.tsx` recursive `NodeRenderer` — selection, drop-zones between siblings, resize handles.
2. `components/library/ComponentsTab.tsx` — primitives (Text, Heading, Image, Button, etc.) — drag into PageCanvas.
3. `components/library/SectionsTab.tsx` — re-use existing `lib/wireframe-library/blocks.ts` + `page-templates.ts`; sections are pre-built `CanvasNode` subtrees with dummy data.
4. `components/inspector/tabs/LayersTab.tsx` — recursive tree with `dnd-kit/sortable`.
5. `components/inspector/tabs/CssVisualTab.tsx` + `NumberScrubber` + Box / Layout / Position groups.
6. `components/inspector/tabs/BackgroundBordersTab.tsx` (logical sides only).
7. `components/inspector/tabs/TypographyTab.tsx` + `FontPicker` with curated catalog.
8. Verify: drop a Hero section, edit padding via scrubber, change font, change colour — preview live.

### Phase D — Design profile / tokens unification (0.5 sprint)
1. Move `lib/store/tokens.store.ts` → `lib/tokens/tokens.profile.ts` (no API change, just relocation).
2. Extract live `--ds-*` CSS-var writer from `lib/token-injector.ts` → `lib/tokens/tokens.css-vars.ts`.
3. New `lib/tokens/tokens.contrast.ts` — WCAG 2.2 AA validator; integrate into `TokenStudio` color rows (already exists at `components/tokens/ColorTokenRow.tsx`).
4. Profile JSON saved to `.nezam/design-server/.session/tokens.json` + mirrored into `DESIGN.md` tokens block by `/api/export-tokens`.

### Phase E — Effects, animation, hero tool (1 sprint)
1. `EffectsAnimationTab` with per-state overrides UI and Animations list.
2. `BottomTimeline` with theatre.js studio embedded; keyframe scrub, easing curve editor (`BezierCurveEditor`).
3. `components/hero-tool/HeroComposer.tsx` — dedicated typography + graphics + timeline composer; emits an `AnimationTrack[]` on the selected hero `CanvasNode`.
4. Easing-preset library (14 named curves) with visual previews.

### Phase F — Assets, fonts, AI generation (1 sprint)
1. `lib/fonts/google-fonts.ts` runtime `<link>` injector + LRU; `FontPicker` becomes async-searchable.
2. `components/library/AssetsTab.tsx` — collapse existing `AssetManagerOverlay` into a left-dock tab with upload/popup chooser preserved.
3. `app/api/ai-section/route.ts` — streaming AI generator using AI SDK v6 via `ai-gateway.ts`; prompts in `lib/ai/section-prompts.ts`.
4. `components/ai/SectionGenerator.tsx` — modal; user picks "Generate hero / features / pricing / FAQ"; result is a streamed `CanvasNode` subtree that drops into the selected container.
5. AI edits flag `approvedBy: 'ai'` and enqueue a review-handoff to `design-server-specialist`.

### Phase G — Agent-routed export + handoff (0.5 sprint)
1. `lib/handoff/handoff.routes.ts` — pure function `splitDocumentForAgents(doc) → { sitemap, tokens, wireframes, meta }`.
2. `lib/handoff/handoff.schemas.ts` — Zod schemas per agent payload.
3. Four `/api/export-*` endpoints write into `.nezam/design-server/.session/` and copy critical artifacts (`wireframes_locked.json`, `DESIGN.md` tokens block, `sitemap.json`).
4. `lib/handoff/handoff.queue.ts` reads/appends `.nezam/HANDOFF_QUEUE.yaml` — one entry per agent, status `pending`.
5. `TopBar` Lock & Export button orchestrates: validate → split → write files → enqueue handoffs → toast.

### Phase H — Onboarding, tooltips, autosave, polish (0.5 sprint)
1. `components/builder/OnboardingTour.tsx` — first-run 5-step Radix Dialog: Sitemap → Style (Header/Footer or Side-menu) → Pages → AI → Export. Skippable, replayable from `Settings`.
2. Wrap every interactive icon button in `RadixTooltip` (the dep is installed).
3. `lib/autosave/autosave.ts` upgrade: debounced (1s) local + every-30s remote sync; visual indicator in TopBar.
4. Resizable splits + collapsed states persisted in `localStorage`.

### Phase I — MCP plugin (deferred, optional)
Sketch only — not blocking initial ship.

A standalone MCP server (`mcp-nezam-design-server`) that lets Claude and Codex drive the builder remotely. Lives at `.nezam/design-server/mcp/`.

Surface (initial):
- `nezam_canvas_list_pages()` → `PageMeta[]`
- `nezam_canvas_open_page(pageId)` → focuses page in UI
- `nezam_canvas_get_tree(pageId)` → `CanvasNode`
- `nezam_canvas_apply_patch(pageId, jsonPatch)` → applies RFC-6902 patch to the tree (validated against Zod)
- `nezam_canvas_apply_token(tokenId, value)` → writes through `tokens.profile`
- `nezam_canvas_generate_section(pageId, parentNodeId, prompt)` → calls `ai-section` and inserts result
- `nezam_canvas_export()` → triggers Phase G pipeline
- All writes are logged into `HANDOFF_QUEUE.yaml` so the change is attributable.

Plugin form for Claude/Codex: a thin wrapper packaging the MCP server config + a "Connect to NEZAM Design Server" command.

---

## 8. Files to be modified (critical path)

**Created**
- `app/canvas/page.tsx`
- `app/canvas/[pageId]/page.tsx`
- `app/api/export-sitemap/route.ts`
- `app/api/export-tokens/route.ts`
- `app/api/export-meta/route.ts`
- `app/api/handoff/route.ts`
- `app/api/ai-section/route.ts`
- `app/api/fonts/route.ts`
- `components/builder/{BuilderShell,TopBar,LeftDock,RightInspector,BottomTimeline,OnboardingTour,KeyboardShortcuts}.tsx`
- `components/canvas/{SitemapCanvas,PageCanvas,SelectionOverlay,Minimap,SnapGrid}.tsx`
- `components/canvas/nodes/{PageNode,ServiceNode,GroupNode}.tsx`
- `components/canvas/edges/BezierWire.tsx`
- `components/inspector/InspectorTabEngine.tsx`
- `components/inspector/tabs/{LayersTab,PageSettingsTab,MetaTagsTab,CssVisualTab,TypographyTab,BackgroundBordersTab,EffectsAnimationTab}.tsx`
- `components/inspector/controls/{NumberScrubber,ColorWell,TokenPicker,BezierCurveEditor,FontPicker,ResponsiveToggle}.tsx`
- `components/library/{ComponentsTab,SectionsTab,AssetsTab,PagesTab,DragSource}.tsx`
- `components/hero-tool/{HeroComposer,TimelineTrack,EasingPresets}.tsx`
- `components/ai/SectionGenerator.tsx`
- `lib/canvas/{canvas.types,canvas.store,canvas.selectors,canvas.serialize,canvas.history,canvas.compat}.ts`
- `lib/tokens/{tokens.profile,tokens.css-vars,tokens.contrast}.ts`
- `lib/fonts/{google-fonts,catalog}.ts`
- `lib/ai/{ai-gateway,section-prompts}.ts`
- `lib/handoff/{handoff.queue,handoff.routes,handoff.schemas}.ts`

**Modified**
- `app/layout.tsx` — keep RTL/theme; remove direct `Sidebar` / `ConsolePanel` / `TabRouter` once `BuilderShell` owns layout; add `OnboardingTour` mount.
- `app/page.tsx` — guided steps re-target the new `/canvas` flow.
- `app/globals.css` — add the CSS in §6.
- `tailwind.config.ts` — add transition/zIndex extensions in §6.
- `package.json` — add deps listed in §2.1.
- `lib/store/session.store.ts` — keep, but `sitemap` becomes a derived selector from `canvasStore.sitemap` for the duration of the migration.
- `lib/autosave.ts` — extend to multi-tier.

**Reuse without modification** (already production-quality)
- `lib/wireframe-library/{blocks,page-templates,svg-previews}.ts` — section library is fine, becomes `SectionsTab` source.
- `lib/layout-designer/component-library.ts` — primitives library; `canvas.compat` consumes it.
- `lib/parsers/{context.parser,profile.parser}.ts` — project context + profile import unchanged.
- `lib/schema/{project-context,wireframes-locked}.schema.ts` — extend `wireframes-locked` to v3 in a backward-compatible way; v2 readers keep working.
- `lib/assets.ts` — asset model unchanged.
- `components/tokens/{TokenStudio,ColorTokenRow,ScaleRatioSelector,LivePreviewCard}.tsx` — kept; embedded inside the Design Profile area.
- `components/layout/{AssetManagerOverlay,ConsolePanel,ThemeLanguageToggles}.tsx` — kept; `AssetManagerOverlay` is collapsed into `AssetsTab` rendering.
- `app/api/{export-wireframes,export-design-layout,context,profiles,lock,cli}/route.ts` — kept; new endpoints sit alongside.
- `.nezam/HANDOFF_QUEUE.yaml` + `.cursor/state/schemas/HANDOFF_QUEUE.schema.yaml` — schema already supports per-agent entries with `from_agent`/`to_agent`/`artifacts_produced`; just append.

**Deprecated (one-release migration window, then deleted)**
- `components/canvas/CanvasWorkspace.tsx` — replaced by `SitemapCanvas`.
- `components/layout/GlobalRightPanel.tsx` — replaced by `RightInspector`.
- `app/sitemap/page.tsx` legacy tree — keep as `?legacy=1` route during migration; remove next release.

---

## 9. Hardlocks the implementation must enforce (audit table)

| # | Hardlock | Where it's enforced |
|---|---|---|
| 1 | `wireframes_locked.json` must be writable from new pipeline, schema-compatible with v2 readers | `lib/canvas/canvas.serialize.ts` exports a v3 doc and a v2-compat doc. `/api/export-wireframes` writes both. |
| 2 | WCAG 2.2 AA contrast on text + non-text | `lib/tokens/tokens.contrast.ts` runs on every token edit; `ColorWell` shows a red badge below 4.5:1 / 3:1 thresholds. Export rejects if locked tokens fail. |
| 3 | RTL via logical properties only | ESLint rule in `components/builder/**` + visual flip in `app/layout.tsx` (already wired). All inspector inputs emit logical-side keys (`paddingInlineStart`, not `paddingLeft`). |
| 4 | Zero-text artwork | AI-generated SVG placeholders pass through a sanitiser that strips `<text>` elements. Lint check on export fails if any placeholder SVG contains text. |
| 5 | One source of truth for active document | `lib/canvas/canvas.store.ts`. Legacy stores (`useLayoutStore`, `useWireframeStore`, partial `useSessionStore.sitemap`) become read-through selectors via `canvas.compat`. |
| 6 | Autosave must not block UI | All writes go through a debounced queue (`lib/autosave/autosave.ts`); the UI optimistically updates and the toast surfaces failures. |
| 7 | Undo/redo coverage | `zundo` history wraps the whole `canvas.store`; every command is named for the Undo dropdown. Selection changes are excluded from history. |

---

## 10. Verification

End-to-end manual smoke (after Phase G):

```bash
cd .nezam/design-server
pnpm dev          # starts on http://localhost:4000
```

1. Open `http://localhost:4000/canvas` — verify pan/zoom/minimap/snap.
2. Add a `Page` node, set route `/about`, attach to an existing Auth node via `auth` wire. Inspector tabs should switch to Layers/Page/Meta only.
3. Double-click the page node → `/canvas/about_<id>`. Verify dive-in animation; 7 inspector tabs appear.
4. From LeftDock → Sections → drag a Hero section in. Inspect — open EffectsAnimationTab → add an Animation Track → BottomTimeline opens → drop a keyframe → easing curve editor visualises.
5. From ComponentsTab drop a Text node inside a Container. NumberScrubber: drag the `padding-inline-start` label → live update. Shift = fine. Alt = coarse.
6. TypographyTab → FontPicker → search "Cairo" (Arabic-friendly) → live `<link>` injection → text re-renders.
7. Lang toggle → `ar` → verify whole UI flips, text-start logical, sitemap canvas Minimap still in canvas-end corner.
8. AICommandBar → "generate a 3-tier pricing section" → streaming subtree drops in.
9. TopBar `Lock & Export` → confirm:
   - `wireframes_locked.json` exists in repo root, v3 schema with a v2 fallback shape valid.
   - `.nezam/design-server/.session/{sitemap.json,tokens.json,meta.json}` exist.
   - `.nezam/HANDOFF_QUEUE.yaml` has four new pending entries (`to_agent: design-server-sitemap` / `design-server-tokens` / `design-server-wireframe` / `design-server-specialist`).
10. Close the tab, reopen — autosave restored state. Undo with `Cmd+Z` walks back to before AI generation.
11. Run `pnpm type-check && pnpm lint && pnpm build` — green.

Type contract check:

```bash
pnpm type-check    # canvas.types + Zod inferences align
pnpm lint          # logical-property rule fires on accidental left/right
```

Agent-side gate check:

```bash
# from repo root
grep -q '"\$schemaVersion": "3.0.0"' wireframes_locked.json && echo "✅ v3 lock present"
# Then have design-server-wireframe pick up its queue entry and confirm read-success.
```

---

## 11. Out of scope (explicit)

- Real-time multi-user collaboration (yjs). Single-author for now.
- Server-side rendering of the canvas (canvas is `'use client'`).
- Custom code generation. Export is data → downstream agents own codegen (existing NEZAM contract).
- A full storybook of generated React/Vue/Svelte components. The existing `WireframeExport.blocks[].shadcnComponents` payload remains the implementation contract; framework adaptors live downstream.
- Theatre.js studio bundle in production — it's dev-only; runtime uses `@theatre/core` projections.
