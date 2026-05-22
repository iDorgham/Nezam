# NEZAM Design Server — Comprehensive Implementation Plan

> **Location:** `.nezam/design-server/` (ships inside the NEZAM kit itself)
> **Start command:** `pnpm design-server` from repo root
> **Access:** `http://localhost:4000`
> **Purpose:** Human-in-the-Loop design decision engine that bridges planning and development. Not just wireframes — a full design orchestration environment where AI prepares, the user decides, and the output is a machine-readable contract that developer agents cannot override.

---

## 1. What This Server Actually Is

The name "wireframe server" undersells it. This is the **NEZAM Design Server** — the design phase made interactive.

It does five things that no existing tool does together:

1. **Design Profile Browser** — 140+ real-world design systems from `.nezam/design/` rendered as live previews. Pick one. It becomes your `DESIGN.md`.

2. **Sitemap & Navigation Builder** — Visual drag-and-drop page hierarchy. AI pre-populates from the PRD. User approves or edits. Navigation labels, icon assignments, access rules — all locked.

3. **Page Wireframe Editor** — Per-page block layout canvas. AI suggests the block sequence. User swaps, reorders, configures. Not pixel-perfect — structural decisions only.

4. **Design Token Studio** — Real-time token editor with live preview. Overrides the chosen design profile's tokens. Every change visible immediately across all blocks.

5. **State Review** — Step through loading / empty / error / populated / offline states per section. Force the user to see and approve them. Agents can't invent states that weren't approved.

When the user clicks **Lock & Export**, the server writes two files:
- `DESIGN.md` (replaces or creates the repo root design contract)
- `wireframes_locked.json` (the structured contract developer agents read)

---

## 2. Location & Integration

```
.nezam/
└── design-server/          ← THE APP LIVES HERE
    ├── PLAN.md             ← this file
    ├── README.md           ← start instructions
    ├── package.json        ← "name": "@nezam/design-server"
    ├── next.config.js
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── app/                ← Next.js 14 App Router
    ├── components/
    ├── lib/
    ├── public/
    └── .session/           ← gitignored session state
```

**Root `package.json` integration:**
```json
{
  "scripts": {
    "design-server": "cd .nezam/design-server && pnpm dev",
    "design-server:build": "cd .nezam/design-server && pnpm build",
    "design-server:install": "cd .nezam/design-server && pnpm install"
  }
}
```

**Why `.nezam/` and not `apps/`?**
- The design server is part of NEZAM infrastructure, not the user's project
- It ships with every NEZAM workspace by default, like `.cursor/` rules do
- It reads from `.nezam/design/` (the 140+ profiles) — co-location makes path resolution trivial
- Users don't need to think about it — it's just there, like any other NEZAM tool

---

## 3. Tech Stack Decisions

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | Consistent with NEZAM's stack; RSC for data loading; no separate API server |
| Styling | Tailwind CSS + CSS custom properties | Tokens as `--ds-*` variables; real-time updates via JS |
| Components | shadcn/ui (customized) | Accessible by default; no ejection; works with Tailwind |
| Drag-and-drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Accessible, maintained, touch support, no canvas dependency |
| State | Zustand | Lightweight, works outside React tree (for token live-preview injection) |
| Schema validation | `zod` | Type-safe parsing of `project_context.json` and `wireframes_locked.json` |
| File I/O | Next.js Route Handlers with Node `fs` | Server-side file reads/writes; no external dependency |
| File watching | `chokidar` | Watch `project_context.json` for changes while server runs |
| Color picker | `react-colorful` | 2.8kb, no dependencies, accessible |
| Font picker | Custom component with Google Fonts API | Preview with real fonts |
| Icons | `lucide-react` | Matches shadcn/ui; 1000+ icons; tree-shakeable |
| Port | 4000 (configurable via `NEZAM_DESIGN_PORT`) | Avoids conflict with Next.js (3000), Vite (5173) |
| Package manager | pnpm | Matches workspace |

**Hard constraints:**
- Zero cloud calls during design session (fully local)
- Zero dependency on the user's project being buildable
- Must work before any user project code exists
- Must start in < 5 seconds on cold boot

---

## 4. Full Feature Map

### 4.1 Module 1 — Design Profile Browser

**What it does:**
Renders all 140+ profiles from `.nezam/design/` as browseable, filterable cards with live preview. User picks one → it seeds the entire token studio.

**UX flow:**
```
/profiles
├── Search bar (filter by name)
├── Category filter chips: SaaS · Dashboard · Marketing · Minimal · Dark · Branded · MENA
├── Grid of profile cards
│   ├── Card: profile name + category tag
│   ├── Mini preview strip (3 color swatches + font sample)
│   ├── "Preview" button → opens full-page preview modal
│   └── "Select" button → loads tokens into studio
└── Currently selected indicator
```

**Profile card preview modal:**
- Shows a live rendering of a sample hero section, nav, card, button, and form using the profile's exact tokens
- Renders as actual HTML/CSS with CSS vars — not a screenshot
- Font loaded from Google Fonts if available

**Data flow:**
- On startup: scan `.nezam/design/*/design.md` and parse all profiles into a normalized token object
- Profiles with rich color data (like `linear-app`) parsed fully; minimal profiles use what they have

---

### 4.2 Module 2 — Sitemap & Navigation Builder

**What it does:**
Visual tree editor for the page hierarchy. AI pre-populates from `project_context.json`. User can add, remove, rename, reorder, set page type and access rules, and configure navigation.

**UX layout:**
```
/sitemap
├── Left: page tree (drag to reorder/nest)
│   ├── Each node: icon + label + route + type badge (public/auth/admin)
│   ├── Drag handle at left edge
│   ├── Right-click context menu: rename, delete, add child, change type
│   └── "+ Add Page" button at bottom
├── Right panel: selected page properties
│   ├── Title (editable)
│   ├── Route (editable, slug-validated)
│   ├── Page type (public / auth / admin / modal / embed)
│   ├── Access roles (multi-select from persona list)
│   ├── Show in nav (toggle)
│   ├── Nav label (separate from page title)
│   ├── Nav icon (icon picker)
│   ├── Nav position (drag-sort in preview)
│   ├── Priority (P0 / P1 / P2)
│   └── Feature IDs (readonly, from context)
└── Bottom: Navigation Preview
    ├── "How it looks" — renders a mini sidebar/topbar/tab-bar
    └── Switches between desktop and mobile view
```

**Validation:**
- Duplicate routes → red highlight + tooltip
- P0 page being removed → warning dialog
- Route must start with `/`
- Nav label max 24 characters

---

### 4.3 Module 3 — Page Wireframe Editor

**What it does:**
Per-page block layout canvas. Shows the page as a vertical stack of blocks. User can reorder, swap, configure, and approve each block. State switcher lets user step through all 5 states per block.

**UX layout:**
```
/:page_id
├── Top bar: breadcrumb + viewport toggle (desktop/tablet/mobile) + RTL toggle + Approve button
├── Left sidebar: page list (quick navigation)
├── Center canvas (scrollable)
│   ├── Blocks stacked vertically
│   ├── Each block:
│   │   ├── Label strip (top): block type name + drag handle + settings icon + delete icon
│   │   ├── Wireframe placeholder (visual representation of block layout)
│   │   ├── State tabs (bottom of block): Loaded | Empty | Error | Offline
│   │   └── Approved checkmark (top-right, green when user clicks "Approve state")
│   └── "+ Add Block" button between any two blocks
├── Right panel (context-sensitive)
│   ├── No selection: block library (searchable, filtered by canvas_mode)
│   ├── Block selected: props editor
│   │   ├── Most-impactful props (top 5) with live controls
│   │   ├── "Advanced" toggle → shows all props
│   │   ├── AI rationale (collapsible ℹ card)
│   │   └── "Swap block type" button
│   └── State selected: state content editor
│       ├── Headline text (for empty/error states)
│       ├── Body text
│       ├── CTA label + action
│       └── "Mark as approved" button
```

**Block wireframe placeholders:**
Each block type has a visual schematic — not a real component, but a structural representation using grey boxes, placeholder text lines, and color-coded zones. Implemented as inline SVG or styled divs. Examples:
- `Hero_Centered`: large center rectangle (headline zone) + two button shapes + small text strips
- `Dashboard_StatsRow`: four equal cards in a row, each with a large number zone and sparkline area
- `Table_Data`: header row + 5 data rows with column separators
- `Nav_Sidebar`: vertical strip with 6 nav item rows + bottom user zone

**Block library panel:**
```
Search: [           ]
Canvas mode filter: [active]

Navigation (3)
  Nav_TopBar        [+ Add]
  Nav_Sidebar       [+ Add]
  Nav_Drawer        [+ Add]

Heroes (2)
  Hero_Centered     [+ Add]
  Hero_Split        [+ Add]

Sections (7)
  Section_Features3Col  [+ Add]
  ...
```

---

### 4.4 Module 4 — Design Token Studio

**What it does:**
Visual token editor. Pre-seeded from the selected design profile. Every token change propagates to the canvas in real time via CSS custom properties. 

**UX layout:**
```
/design-tokens
├── Left: token category navigation
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Borders & Shadows
│   ├── Motion
│   └── Grid & Layout
├── Center: token editor (changes by category)
│   
│   [Colors tab]
│   ├── Color palette matrix
│   │   ├── Each token: name + swatch + hex input + "From profile" / "Modified" badge
│   │   ├── Click swatch → inline color picker (react-colorful)
│   │   ├── Dark mode overrides (expandable per token)
│   │   └── "Reset to profile default" link
│   
│   [Typography tab]
│   ├── Heading font (searchable font picker with preview)
│   ├── Body font
│   ├── Mono font
│   ├── Arabic font (shown only if rtl: true)
│   ├── Base size (px slider: 14–20)
│   ├── Scale ratio selector (minor-third / major-third / perfect-fourth)
│   │   └── Shows computed sizes: xs/sm/md/lg/xl/2xl/3xl
│   ├── Line height (slider: 1.2–1.8)
│   ├── Heading weight (select)
│   └── Font load strategy (Google Fonts / Local / System)
│   
│   [Spacing tab]
│   ├── Base unit (4px / 8px toggle)
│   ├── Density (compact / default / comfortable)
│   └── Scale preview table: xs through 3xl with px values
│   
│   [Borders & Shadows]
│   ├── Radius style (sharp / subtle / rounded / pill) — live preview
│   ├── Shadow depth (flat / subtle / medium / elevated) — live preview
│   └── Border width (1px / 2px)
│
│   [Motion]
│   ├── Preset (none / subtle / standard / expressive)
│   ├── Duration (50ms–600ms slider)
│   ├── Easing (select with curve preview)
│   └── Respect prefers-reduced-motion (always on, info only)
│
│   [Grid]
│   ├── Column system (12-column / flexbox / masonry)
│   ├── Max width (px input)
│   └── Gutter (px input)
│
└── Right: Live Preview Card
    ├── Sample button (primary)
    ├── Sample card (with title, body, badge, action)
    ├── Sample input + label + error
    ├── Sample nav item (active + inactive)
    └── Typography specimen (all heading levels + body)
    All updating live as tokens change.
```

---

### 4.5 Module 5 — State Review Dashboard

**What it does:**
Forces the user to consciously review all 5 states (loading / empty / error / populated / offline) across all sections on all P0 pages. The export gate won't open until this is done.

**UX layout:**
```
/states
├── Progress: "12 / 37 states approved" (progress bar)
├── Page list (left sidebar)
├── Per-page state grid (center)
│   ├── Section name + block type
│   ├── 5 state columns: Loading | Empty | Error | Populated | Offline
│   ├── Each cell: thumbnail preview + "Approve" button
│   └── Approved cells: green checkmark
└── Quick actions:
    ├── "Approve all loading states" (bulk action for trivial state)
    └── "Auto-approve all offline states with default fallback"
```

---

### 4.6 Module 6 — Lock & Export

**What it does:**
Pre-flight checklist, then generates `DESIGN.md` and `wireframes_locked.json`.

**UX layout:**
```
/export
├── Checklist (must all be green to export)
│   ├── ✅ Design profile selected
│   ├── ✅ Sitemap has at least 1 P0 page
│   ├── ✅ All P0 pages have approved layouts
│   ├── ✅ All required color tokens have values
│   ├── ⚠️  3 P0 pages have unapproved state views (warning, not block)
│   └── ✅ Navigation structure defined
├── Export options
│   ├── ☑ Overwrite DESIGN.md (recommended)
│   ├── ☑ Write wireframes_locked.json
│   └── ☑ Update onboarding.yaml (wireframe_complete: true)
├── "Lock & Export" button (primary, large)
└── Export result
    ├── Success: file paths written + "Return to terminal and run /DEVELOP"
    └── Error: exact error with file path and permission hint
```

**What gets written:**

`DESIGN.md` (repo root) — regenerated from finalized tokens. Uses the same structure as `.nezam/design/*/design.md` profiles but with the user's exact overrides applied. This file is what developer agents and the `/START design` command refer to.

`wireframes_locked.json` (repo root) — the full structured contract following `wireframes_locked.schema.json`. Developer agents read this before building any UI component.

---

## 5. Top Navigation Structure

```
┌─────────────────────────────────────────────────────────────┐
│ ◆ NEZAM Design  [ProjectName]  [canvas_mode badge]  [RTL]  │
│                                                    [Export] │
├──────────────────────────────────────────────────────────────┤
│ Design Profiles │ Sitemap │ Pages ▾ │ Tokens │ States │     │
└─────────────────────────────────────────────────────────────┘
```

- **Design Profiles** — browse and select from 140+ profiles
- **Sitemap** — page hierarchy and navigation builder
- **Pages** — dropdown listing all pages (shortcut to /:page_id)
- **Tokens** — design token studio
- **States** — state review dashboard
- **Export** (top right, always visible) — lock progress indicator + export button

Progress indicator in the top bar: `[██████░░░░] 14 / 22 approved`

---

## 6. Data Flow Architecture

```
BOOT
│
├─ Read .nezam/templates/wireframe-server/block_registry.json
├─ Read .nezam/design/catalog.json (profile list)
├─ Read project_context.json (if exists)
│   ├─ Validate against project_context.schema.json
│   ├─ Load: pages, sections, design tokens, sitemap
│   └─ Merge with block_registry defaults
├─ Read .session/autosave.json (if newer than project_context.json)
│   └─ Prompt user: "Restore previous session?"
└─ Render UI with pre-populated state

EDITING SESSION
│
├─ All edits → Zustand store (in-memory)
├─ CSS custom properties updated via JS (real-time token preview)
├─ Autosave: Zustand → .session/autosave.json every 30s
└─ File watcher: if project_context.json changes → toast + reload prompt

EXPORT
│
├─ Validate all P0 pages approved (hard gate)
├─ Validate all required tokens have values
├─ Generate DESIGN.md from token state
├─ Generate wireframes_locked.json from full canvas state
├─ Write both files
├─ Write .cursor/state/onboarding.yaml: wireframe_complete: true
└─ Show success screen with next steps
```

---

## 7. File Structure (Complete)

```
.nezam/design-server/
│
├── PLAN.md                         ← this file
├── README.md                       ← quick start
├── package.json                    ← @nezam/design-server
├── next.config.js                  ← server-side file access config
├── tsconfig.json
├── tailwind.config.ts              ← imports shared .nezam tokens
├── postcss.config.js
├── .gitignore                      ← ignores .session/
│
├── app/                            ← Next.js 14 App Router
│   ├── layout.tsx                  ← root layout, top nav, token CSS vars
│   ├── page.tsx                    ← redirect to /profiles or /sitemap
│   ├── profiles/
│   │   └── page.tsx                ← Module 1: Design Profile Browser
│   ├── sitemap/
│   │   └── page.tsx                ← Module 2: Sitemap Builder
│   ├── pages/
│   │   └── [page_id]/
│   │       └── page.tsx            ← Module 3: Wireframe Editor
│   ├── tokens/
│   │   └── page.tsx                ← Module 4: Token Studio
│   ├── states/
│   │   └── page.tsx                ← Module 5: State Review
│   ├── export/
│   │   └── page.tsx                ← Module 6: Lock & Export
│   └── api/
│       ├── context/route.ts        ← GET: read project_context.json
│       ├── profiles/route.ts       ← GET: list + parse design profiles
│       ├── profiles/[name]/route.ts ← GET: single profile tokens
│       ├── session/route.ts        ← GET/POST: autosave
│       ├── export/route.ts         ← POST: write DESIGN.md + wireframes_locked.json
│       └── watch/route.ts          ← SSE: file watcher events
│
├── components/
│   ├── layout/
│   │   ├── TopNav.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── ExportButton.tsx
│   │
│   ├── profiles/
│   │   ├── ProfileGrid.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── ProfilePreviewModal.tsx  ← live HTML/CSS render of profile
│   │   └── ProfileSearch.tsx
│   │
│   ├── sitemap/
│   │   ├── SitemapTree.tsx          ← dnd-kit sortable tree
│   │   ├── PageNode.tsx
│   │   ├── PagePropsPanel.tsx
│   │   ├── NavPreview.tsx           ← live mini sidebar/topbar render
│   │   └── IconPicker.tsx
│   │
│   ├── wireframe/
│   │   ├── WireframeCanvas.tsx
│   │   ├── BlockSlot.tsx            ← individual draggable block
│   │   ├── BlockPlaceholder.tsx     ← SVG/div wireframe schematic per type
│   │   ├── BlockLibraryPanel.tsx
│   │   ├── PropsEditorPanel.tsx
│   │   ├── StateTabStrip.tsx
│   │   ├── StateEditorPanel.tsx
│   │   ├── ViewportToggle.tsx
│   │   └── ApproveButton.tsx
│   │
│   ├── tokens/
│   │   ├── TokenStudio.tsx
│   │   ├── ColorTokenRow.tsx        ← swatch + hex + picker
│   │   ├── FontPicker.tsx
│   │   ├── ScaleRatioSelector.tsx   ← shows computed values
│   │   ├── SpacingPreview.tsx
│   │   ├── BorderStylePicker.tsx    ← visual radius/shadow selectors
│   │   ├── MotionPreset.tsx
│   │   └── LivePreviewCard.tsx      ← real-time token preview
│   │
│   ├── states/
│   │   ├── StateMatrix.tsx
│   │   ├── StateCellPreview.tsx
│   │   └── BulkApproveBar.tsx
│   │
│   ├── export/
│   │   ├── ExportChecklist.tsx
│   │   ├── ExportOptions.tsx
│   │   └── ExportResult.tsx
│   │
│   └── ui/                          ← shadcn/ui components (subset)
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── dialog.tsx
│       ├── tooltip.tsx
│       ├── sheet.tsx
│       ├── tabs.tsx
│       ├── toggle.tsx
│       ├── progress.tsx
│       └── toast.tsx
│
├── lib/
│   ├── store/
│   │   ├── session.store.ts         ← main Zustand store (all session state)
│   │   ├── tokens.store.ts          ← design token state + CSS var injection
│   │   └── approval.store.ts        ← page/section/state approval tracking
│   │
│   ├── parsers/
│   │   ├── profile.parser.ts        ← parse design.md → normalized token object
│   │   ├── context.parser.ts        ← parse + validate project_context.json
│   │   └── export.generator.ts      ← generate DESIGN.md + wireframes_locked.json
│   │
│   ├── schema/
│   │   ├── project_context.schema.ts   ← Zod schema (mirrors JSON schema)
│   │   └── wireframes_locked.schema.ts ← Zod schema
│   │
│   ├── blocks/
│   │   ├── registry.ts              ← load + query block_registry.json
│   │   └── placeholders/            ← wireframe SVG/JSX per block type
│   │       ├── Nav_TopBar.tsx
│   │       ├── Nav_Sidebar.tsx
│   │       ├── Hero_Centered.tsx
│   │       ├── Hero_Split.tsx
│   │       ├── Dashboard_StatsRow.tsx
│   │       ├── Dashboard_MainChart.tsx
│   │       ├── Table_Data.tsx
│   │       ├── Form_Auth.tsx
│   │       ├── Card_StatKPI.tsx
│   │       └── ... (one per block type)
│   │
│   ├── fonts/
│   │   └── google-fonts.ts          ← Google Fonts API client (fetch + cache)
│   │
│   ├── token-injector.ts            ← inject CSS vars into :root at runtime
│   ├── autosave.ts                  ← autosave logic + restore prompt
│   ├── export-validator.ts          ← pre-flight checklist logic
│   └── paths.ts                     ← resolve .nezam/ paths relative to CWD
│
├── public/
│   └── fonts/                       ← cached font files (optional, for offline)
│
└── .session/                        ← gitignored
    ├── autosave.json                ← session autosave
    ├── analytics.jsonl              ← session events (local only)
    └── profile-cache/               ← parsed profile cache (speeds up boot)
```

---

## 8. Block Placeholder System

Each block type in the registry has a corresponding React component in `lib/blocks/placeholders/`. These are purely visual schematics — grey boxes, text-line shapes, and color zones — that communicate the block's layout intent without being real components.

**Design principles for placeholders:**
- Use `--ds-surface`, `--ds-border`, `--ds-text-muted` CSS vars so they respond to the token studio
- Fixed aspect ratios matching the block's real viewport behavior
- Labeled zones (e.g. "Headline", "CTA", "Chart area") using small `text-xs text-muted` labels
- Interaction hints: show which zones are configurable (dashed border on hover)

**Example — `Hero_Centered.tsx` placeholder:**
```
┌─────────────────────────────────────────────────────┐
│                    [NAV AREA]                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│              ████████████████████                  │
│              [BADGE · optional]                     │
│                                                     │
│    ████████████████████████████████████████         │
│    [HEADLINE]                                       │
│    ████████████████████                             │
│                                                     │
│    ██████████████████████████████                   │
│    [SUBHEADLINE / BODY]                             │
│                                                     │
│         [PRIMARY CTA]    [SECONDARY CTA]            │
│                                                     │
│    ██  ██  ██  [SOCIAL PROOF / LOGOS]               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 9. Design Profile Parser

The 140+ profiles in `.nezam/design/*/design.md` have varying structure. The parser extracts what it can and fills gaps with sensible defaults.

**Parser strategy:**

```typescript
// lib/parsers/profile.parser.ts

type ParsedProfile = {
  name: string
  category: string
  description: string
  colorProfile: ColorTokens
  typography: TypographyTokens
  spacing: SpacingTokens
  borders: BorderTokens
  motion: MotionTokens
  confidence: 'rich' | 'partial' | 'minimal'
}

// Rich profiles (like linear-app): extract exact hex values from code blocks
// Partial profiles (like minimal): extract what exists, fill gaps with category defaults
// Minimal profiles: use name-based heuristics (dark/light/warm/cool)
```

**Category detection** (from profile content):
- Contains "dark" / "#0" backgrounds → `dark-mode`
- Contains "dashboard" / "SaaS" → `dashboard`
- Contains "MENA" / "Arabic" / "RTL" → `mena`
- Contains "minimal" / "clean" / "white" → `minimal`
- Named after real brands (stripe, linear, notion...) → `branded`

---

## 10. CSS Custom Properties System

The token studio doesn't re-render the page when tokens change. It injects `--ds-*` CSS custom properties directly into `:root` via JavaScript. All block placeholders and the live preview card reference these variables.

**Token namespace: `--ds-*`** (Design Server — avoids conflicts with user project)

```css
:root {
  /* Colors */
  --ds-primary: #5e6ad2;
  --ds-secondary: #8a8f98;
  --ds-accent: #7170ff;
  --ds-background: #08090a;
  --ds-surface: #0f1011;
  --ds-surface-raised: #191a1b;
  --ds-text-primary: #f7f8f8;
  --ds-text-secondary: #d0d6e0;
  --ds-text-muted: #8a8f98;
  --ds-text-on-primary: #ffffff;
  --ds-success: #27a644;
  --ds-warning: #d97706;
  --ds-error: #dc2626;
  --ds-border: rgba(255,255,255,0.08);
  
  /* Typography */
  --ds-font-heading: 'Inter Variable', system-ui;
  --ds-font-body: 'Inter Variable', system-ui;
  --ds-font-mono: 'Berkeley Mono', ui-monospace;
  --ds-base-size: 16px;
  --ds-scale: 1.25;
  
  /* Computed type scale */
  --ds-text-xs: calc(var(--ds-base-size) / var(--ds-scale) / var(--ds-scale));
  --ds-text-sm: calc(var(--ds-base-size) / var(--ds-scale));
  --ds-text-md: var(--ds-base-size);
  --ds-text-lg: calc(var(--ds-base-size) * var(--ds-scale));
  --ds-text-xl: calc(var(--ds-base-size) * var(--ds-scale) * var(--ds-scale));
  --ds-text-2xl: calc(var(--ds-base-size) * var(--ds-scale) * var(--ds-scale) * var(--ds-scale));
  
  /* Spacing */
  --ds-space-xs: 4px;
  --ds-space-sm: 8px;
  --ds-space-md: 16px;
  --ds-space-lg: 24px;
  --ds-space-xl: 32px;
  --ds-space-2xl: 48px;
  
  /* Borders */
  --ds-radius-sm: 4px;
  --ds-radius-md: 8px;
  --ds-radius-lg: 12px;
  --ds-radius-full: 9999px;
  
  /* Shadows */
  --ds-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --ds-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --ds-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

**Token injection function:**
```typescript
// lib/token-injector.ts
export function injectTokens(tokens: DesignTokens): void {
  const root = document.documentElement
  Object.entries(flattenTokens(tokens)).forEach(([key, value]) => {
    root.style.setProperty(`--ds-${key}`, value)
  })
}
```

This runs on every token change — instant, no re-render, no layout shift.

---

## 11. Export: DESIGN.md Generator

The export writes a `DESIGN.md` that matches the structure of the existing `.nezam/design/*/design.md` profiles but reflects the user's exact decisions.

**Template structure:**
```markdown
# Design System — {{project_name}}

> Generated by NEZAM Design Server on {{date}}
> Profile base: {{selected_profile}}
> Canvas mode: {{canvas_mode}}

## 1. Visual Theme & Atmosphere
[AI-generated paragraph from profile + user customizations]

## 2. Color Palette & Roles
[Full color table with all --ds-* token values]

## 3. Typography Rules
[Font families, scale, weights, line heights]

## 4. Spacing & Grid
[Base unit, density, scale table]

## 5. Borders & Shadows
[Radius style + values, shadow depth + values]

## 6. Motion & Interaction
[Preset, duration, easing, reduced-motion rule]

## 7. Navigation Rules
[From sitemap builder decisions]

## 8. Component Defaults
[From wireframe session block selections]

## 9. RTL Rules
[If rtl: true]

---
*This file was generated by NEZAM Design Server. To modify, re-run `/wireframe`.*
*Source: wireframes_locked.json ({{date}})*
```

---

## 12. Session Persistence

**Autosave:** Every 30 seconds, Zustand store serializes to `.session/autosave.json`. On crash/restart, if autosave exists and is newer than `project_context.json`, show restore prompt.

**Session file structure:**
```json
{
  "version": "1.0.0",
  "saved_at": "2026-05-14T10:30:00Z",
  "project_context_mtime": "2026-05-14T09:00:00Z",
  "selected_profile": "linear-app",
  "token_overrides": {},
  "sitemap_edits": {},
  "page_layouts": {},
  "approvals": {},
  "design_decisions": {}
}
```

---

## 13. Build Phases

### Phase 1 — Foundation (3–4 days)

**Goal:** Server boots, reads `project_context.json`, renders sitemap and basic page list.

Deliverables:
- [ ] `package.json` + Next.js 14 setup inside `.nezam/design-server/`
- [ ] Root `package.json` `"design-server"` script
- [ ] `lib/paths.ts` — resolve all `.nezam/` paths relative to CWD
- [ ] `app/api/context/route.ts` — read + validate `project_context.json`
- [ ] `app/api/profiles/route.ts` — list all `.nezam/design/*/design.md` files
- [ ] `lib/parsers/profile.parser.ts` — parse profiles into normalized tokens
- [ ] `lib/parsers/context.parser.ts` — Zod validation
- [ ] `components/layout/TopNav.tsx` — static structure
- [ ] `app/sitemap/page.tsx` — basic tree render (no drag yet)
- [ ] `lib/store/session.store.ts` — Zustand store skeleton

**Gate:** `pnpm design-server` starts without error. Sitemap renders with pages from `project_context.json`.

---

### Phase 2 — Sitemap Builder (2–3 days)

**Goal:** Full interactive sitemap with drag-and-drop and nav preview.

Deliverables:
- [ ] `components/sitemap/SitemapTree.tsx` — `@dnd-kit/sortable` tree
- [ ] `components/sitemap/PagePropsPanel.tsx` — full page properties form
- [ ] `components/sitemap/NavPreview.tsx` — live mini nav render
- [ ] `components/sitemap/IconPicker.tsx` — lucide-react icon search
- [ ] Route validation + duplicate detection
- [ ] P0 page removal warning
- [ ] `lib/autosave.ts` — autosave implementation

**Gate:** User can drag pages, edit properties, and see nav preview update live.

---

### Phase 3 — Design Profile Browser (2–3 days)

**Goal:** Browse, preview, and select from all 140+ design profiles.

Deliverables:
- [ ] `components/profiles/ProfileGrid.tsx` — filtered card grid
- [ ] `components/profiles/ProfileCard.tsx` — color swatches + font sample
- [ ] `components/profiles/ProfilePreviewModal.tsx` — live HTML/CSS preview
- [ ] `components/profiles/ProfileSearch.tsx` — search + category filter
- [ ] `app/api/profiles/[name]/route.ts` — single profile tokens
- [ ] Profile category auto-detection
- [ ] Profile cache in `.session/profile-cache/`

**Gate:** All 140+ profiles browseable. Selecting one loads its tokens.

---

### Phase 4 — Design Token Studio (3–4 days)

**Goal:** Full token editor with real-time preview.

Deliverables:
- [ ] `lib/token-injector.ts` — CSS var injection
- [ ] `components/tokens/TokenStudio.tsx` — all tabs
- [ ] `components/tokens/ColorTokenRow.tsx` — swatch + react-colorful
- [ ] `components/tokens/FontPicker.tsx` — Google Fonts search + preview
- [ ] `components/tokens/ScaleRatioSelector.tsx` — computed scale table
- [ ] `components/tokens/LivePreviewCard.tsx` — live component previews
- [ ] `lib/fonts/google-fonts.ts` — font API client
- [ ] Dark mode override section per color token
- [ ] `lib/store/tokens.store.ts` — token state

**Gate:** Changing any token updates the live preview card within 50ms.

---

### Phase 5 — Wireframe Editor (4–5 days)

**Goal:** Per-page block canvas with full editing capabilities.

Deliverables:
- [ ] `lib/blocks/registry.ts` — load block_registry.json
- [ ] `lib/blocks/placeholders/*.tsx` — all block type schematics (40+)
- [ ] `components/wireframe/WireframeCanvas.tsx` — sortable block list
- [ ] `components/wireframe/BlockSlot.tsx` — individual draggable block
- [ ] `components/wireframe/BlockLibraryPanel.tsx` — filtered block catalog
- [ ] `components/wireframe/PropsEditorPanel.tsx` — per-block prop forms
- [ ] `components/wireframe/StateTabStrip.tsx` — 5-state switcher per block
- [ ] `components/wireframe/ViewportToggle.tsx` — desktop/tablet/mobile
- [ ] RTL toggle (flips canvas direction)
- [ ] `lib/store/approval.store.ts` — approval tracking

**Gate:** User can view, reorder, swap, and configure blocks on any page.

---

### Phase 6 — State Review + Export (2–3 days)

**Goal:** State review dashboard and complete export pipeline.

Deliverables:
- [ ] `components/states/StateMatrix.tsx` — all pages × all states grid
- [ ] `components/states/StateCellPreview.tsx` — state-specific block preview
- [ ] `components/states/BulkApproveBar.tsx`
- [ ] `lib/export-validator.ts` — pre-flight checklist logic
- [ ] `lib/parsers/export.generator.ts` — generate DESIGN.md + wireframes_locked.json
- [ ] `app/api/export/route.ts` — write files
- [ ] `components/export/ExportChecklist.tsx`
- [ ] `components/export/ExportResult.tsx`
- [ ] onboarding.yaml update on successful export
- [ ] File watch SSE endpoint + toast notification

**Gate:** Full session → Lock & Export → `DESIGN.md` and `wireframes_locked.json` written correctly.

---

### Phase 7 — Polish + DX (1–2 days)

**Goal:** Excellent developer experience for the person running this tool.

Deliverables:
- [ ] `README.md` with start instructions + screenshots
- [ ] Error boundaries on every panel (server doesn't crash from bad context file)
- [ ] Keyboard shortcuts: `Cmd+S` force autosave, `Cmd+E` open export, `←/→` navigate pages, `A` approve current page
- [ ] Empty state: no `project_context.json` found → helpful setup screen with exact command
- [ ] RTL preview: full server UI flips to RTL when designing RTL projects
- [ ] Schema version mismatch warning
- [ ] Progress indicator persists across refreshes (from autosave)
- [ ] `pnpm design-server:build` for CI validation
- [ ] First-run onboarding overlay (shown once, then dismissed)

---

## 14. Start Instructions (README.md content)

```
# NEZAM Design Server

The Human-in-the-Loop design gate between /PLAN and /DEVELOP.

## Prerequisites
- Node.js 20+
- pnpm 9+
- A NEZAM project with planning phase complete

## Install (once)
pnpm design-server:install

## Start
pnpm design-server

Opens at http://localhost:4000

## What to do
1. Browse design profiles → pick the one closest to your vision
2. Tweak color tokens and typography in the token studio
3. Review the sitemap → approve or edit pages and navigation
4. Go through each page → approve the AI-suggested block layout (or swap blocks)
5. Review loading/empty/error states for each section
6. Click Lock & Export

## After exporting
Return to your terminal. DESIGN.md and wireframes_locked.json are now in your project root.
Run /DEVELOP to start building.

## Port
Default: 4000. Override: NEZAM_DESIGN_PORT=5000 pnpm design-server
```

---

## 15. Agent Implementation Prompt

When NEZAM's build agent scaffolds this server, provide this prompt:

```
You are building the NEZAM Design Server — a Next.js 14 App Router application 
that lives at .nezam/design-server/ within the NEZAM workspace kit.

MANDATORY reading before writing any code:
1. .nezam/design-server/PLAN.md — this is the complete architectural spec
2. .nezam/templates/wireframe-server/block_registry.json — block catalog
3. .nezam/templates/wireframe-server/project_context.schema.json — input contract
4. .nezam/templates/wireframe-server/wireframes_locked.schema.json — output contract
5. .nezam/design/linear-app/design.md — example of a rich design profile (parsing target)
6. .nezam/design/minimal/design.md — example of a minimal design profile

CONSTRAINTS:
- App lives entirely within .nezam/design-server/. Never write outside this folder except 
  to repo root (DESIGN.md, wireframes_locked.json) and .cursor/state/onboarding.yaml on export.
- All .nezam/ paths resolved relative to process.cwd() (the repo root), NOT relative to 
  the app's own directory. Use lib/paths.ts for all path resolution.
- Zero external API calls during session. Google Fonts requests happen once (with cache).
- Must start with: cd .nezam/design-server && pnpm dev (port 4000)
- TypeScript strict mode. No `any` types. No hardcoded colors.
- All CSS via CSS custom properties (--ds-*). Tailwind for layout only.
- Use @dnd-kit/core + @dnd-kit/sortable for all drag-and-drop. Nothing else.
- shadcn/ui components only from the subset listed in PLAN.md Section 7.
- Zod for all runtime data validation.

BUILD SEQUENCE:
Phase 1 first. Each phase has a gate — confirm it passes before starting the next.
Do not skip phases. Do not build Phase 4 before Phase 2 is gated.

START with Phase 1:
1. Create .nezam/design-server/package.json
2. Create next.config.js with serverExternalPackages: ['fs', 'path', 'chokidar']
3. Create lib/paths.ts that resolves all .nezam/ paths from process.cwd()
4. Create app/api/context/route.ts that reads project_context.json
5. Create app/api/profiles/route.ts that lists .nezam/design/ profiles
6. Create lib/parsers/profile.parser.ts
7. Create lib/parsers/context.parser.ts with Zod validation
8. Create app/layout.tsx + app/sitemap/page.tsx with basic page tree render
9. Create lib/store/session.store.ts as Zustand skeleton
10. Test: pnpm design-server starts, /sitemap renders, /api/context returns valid data
```

---

## 16. Dependencies (package.json)

```json
{
  "name": "@nezam/design-server",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port ${NEZAM_DESIGN_PORT:-4000}",
    "build": "next build",
    "start": "next start --port ${NEZAM_DESIGN_PORT:-4000}",
    "typecheck": "tsc --noEmit",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.29",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "zustand": "^4.5.4",
    "zod": "^3.23.8",
    "chokidar": "^3.6.0",
    "lucide-react": "^0.383.0",
    "react-colorful": "^5.6.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.4",
    "postcss": "^8",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.2.29"
  }
}
```

**Total bundle size target:** < 200KB initial JS (no heavy chart libs, no canvas libraries)

---

## 17. Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + S` | Force autosave |
| `Cmd/Ctrl + E` | Open export panel |
| `←` / `→` | Navigate to previous/next page in wireframe editor |
| `A` | Approve current page (when in wireframe editor) |
| `B` | Toggle block library panel |
| `T` | Jump to token studio |
| `Esc` | Close any open panel/modal |
| `Alt + ↑` / `Alt + ↓` | Move selected block up/down |
| `?` | Show shortcut reference overlay |

---

## 18. Success Metrics

The design server is successful if:

1. A user with no wireframing experience can complete a full session in under 30 minutes
2. The exported `wireframes_locked.json` gives developer agents enough information to build the correct nav structure, page hierarchy, and component choices without asking the user any follow-up questions
3. The exported `DESIGN.md` is production-quality — developer agents can derive all CSS custom property values from it directly
4. `pnpm design-server` cold-starts in under 5 seconds
5. The server never crashes from a malformed `project_context.json` — it shows a helpful error instead

---

## 19. What's NOT in v1

- ❌ Pixel-perfect design (this is structural, not Figma)
- ❌ Real component rendering (placeholders only)
- ❌ Image upload / asset management
- ❌ Multi-user collaboration
- ❌ Cloud hosting / remote access
- ❌ Figma import / export
- ❌ Git integration (no auto-commit on export)
- ❌ Custom block creation
- ❌ Animation preview
- ❌ Accessibility audit

All tracked as future work in `F-WF-002` through `F-WF-010`.

---

## 20. Relation to Existing NEZAM Files

| Existing file | How this server uses it |
|---|---|
| `.nezam/design/*/design.md` | Design Profile Browser reads and parses all 140+ profiles |
| `.nezam/design/catalog.json` | Profile metadata (name, tier, license) for the grid |
| `.nezam/templates/wireframe-server/block_registry.json` | Block catalog for the wireframe editor |
| `.nezam/templates/wireframe-server/project_context.schema.json` | Input validation (Zod) |
| `.nezam/templates/wireframe-server/wireframes_locked.schema.json` | Output validation (Zod) |
| `.nezam/gates/hardlock-paths.json` | Path resolution for project files |
| `.cursor/state/onboarding.yaml` | Updated with `wireframe_complete: true` on export |
| `.cursor/commands/wireframe.md` | Agent command that generates `project_context.json` and starts this server |
| `DESIGN.md` (repo root) | Overwritten by export |
| `wireframes_locked.json` (repo root) | Written by export |
