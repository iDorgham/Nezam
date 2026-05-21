# Product Requirements Document — Nezam Design Server · Ultimate UI Suite

> **This document is the single source of truth for what gets built.**
> Every feature, every screen, every data field, every edge case must be defined here
> before any planning or development begins.

---

## 0. Product Identity

| Field | Value |
|---|---|
| Product Name | Nezam Design Server · Ultimate UI Suite |
| Tagline | Infinity canvas, motion studio, token editor, and property inspector — all in one obsidian shell |
| Owner | Nezam Platform Team |
| GitHub Repo | iDorgham/Nezam |
| Target Market | Developers & Designers — Egyptian & Global Web ecosystem |
| Design Profile | `nezam-obsidian-cyan-orange` |
| Status | Draft — Pending Lock |
| PRD Version | 2.0.0 |
| Last Updated | 2026-05-18 |

---

## 0.5 Design Token Contract — `nezam-obsidian-cyan-orange`

All components in this product must use the following W3C/DTCG token set. No hardcoded primitives are permitted in markup or stylesheets.

```yaml
color:
  background:           "#09090B"   # Raw pitch canvas
  surface:
    base:               "#18181B"   # Panels, side docks
    elevated:           "#27272A"   # Drop menus, active elements
  border:
    subtle:             "#27272A"   # Standard structural separation
    muted:              "#3F3F46"   # Grid guides
  accent:
    cyan:               "#06B6D4"   # Electric Cyan — active nodes, tracking, validation pass
    orange:             "#EA580C"   # GateFlow Orange — alerts, timeline headers, hot metrics
  text:
    primary:            "#FAFAFA"   # Headers, crisp typography
    secondary:          "#A1A1AA"   # Microcopy
    muted:              "#71717A"   # Terminal logs, subdued labels

typography:
  family:
    sans:  "Geist, Inter, sans-serif"
    mono:  "JetBrains Mono, monospace"
  letter_spacing:
    label: "0.05em"

spacing:
  baseline: 4px
  scale:    [0, 4, 8, 12, 16, 24, 32, 48, 64, 96]
  inner_breathing: 24px   # space.lg — default panel padding
```

**Hardlock rules enforced on every file sync:**

| Target | Validation | Failure Action |
|---|---|---|
| Typography | All font steps use `clamp()` — no fixed `px`/`rem` | Design gate error thrown |
| Spacing | No hardcoded pixel arrays — must map to `scale[]` | Reverts to nearest 4px baseline |
| Contrast | Foreground/background ≥ 4.5:1 | Restores to secure color primitives |
| Localization | No unidirectional keys (`left`, `right`, `ml-`, `pr-`) | Blocks `/DEVELOP`; forces logical properties |

---

## 1. Problem Statement

### 1.1 The Problem

Visual theme alignment between design specifications and frontend styles is traditionally manual, error-prone, and disconnected. The Nezam Design Server was built to bridge this gap, but it lacks critical capabilities across four dimensions:

1. **No Persistence Layer:** Custom visually-edited design profiles are lost on server reload. No way to save or reload unique brand presets.
2. **Silent Compilation:** Token synchronization to visual layout components is silent — no indicator of success, failure, or out-of-sync state.
3. **Incomplete Shape & Typography Surface:** Shape tokens lack custom inputs for border-radius; typography scale shows numbers only without fluid `clamp()` visualization.
4. **No Spatial Composition Interface:** There is no visual canvas for mapping page architecture, wiring components to services, or building motion timelines. Developers work blind — no sitemap graph, no animation studio, no property inspector unified in one shell.

### 1.2 Why Now

Visual-first developer tools (Lovable, v0, Bolt, Framer) are setting a new standard for high-speed prototyping. A real-time Design Server that links spec files (`DESIGN.md`) directly with responsive mockups, and provides an infinity canvas for spatial reasoning, gives the Nezam engineering pipeline a major velocity boost and locks down design token compliance automatically.

### 1.3 What Happens Without This Product

Developers hand-tweak CSS values, creating styling drift, broken alignments, and values that bypass design gates. Without a spatial canvas, every page relationship must be mentally modeled. Without a motion studio, animation timing is guesswork.

---

## 2. Users & Personas

### Persona 1: Amina — Senior Frontend Engineer

- **Who they are:** Lead UI developer implementing pixel-perfect screens and maintaining design system integrity.
- **JTBD:** When I update a brand layout, I want to tweak tokens visually and see them sync instantly, so I can ensure all pages adhere to our design token values.
- **Current frustration:** Copy-pasting hex values between files; design server breaks leave hours of style discrepancy hunting.
- **Success looks like:** "CSS Synchronized" pill in header, one-click profile save/swap, zero drift incidents per sprint.
- **Technical comfort:** High · **Usage frequency:** Daily

### Persona 2: Tarek — Creative Director

- **Who they are:** Directs aesthetic feeling, spacing, and typographic quality across products.
- **JTBD:** When I test a brand theme, I want to preview typographic sizes alongside border-radius and see motion timelines, so I can guarantee the layout looks premium and balanced.
- **Current frustration:** Has to ask a developer to compile just to see if a font or corner radius fits the luxury aesthetic.
- **Success looks like:** Fluid typography clamp visualizer, live canvas with animated bezier wires, motion easing scrubber.
- **Technical comfort:** Medium · **Usage frequency:** Weekly

### Persona 3: Rami — MENA Frontend Lead

- **Who they are:** Leads RTL/bilingual implementation for Arabic-facing products.
- **JTBD:** When I switch the canvas to `dir="rtl"`, I want all layout wires, panel margins, and property inspector values to mirror correctly without script overrides.
- **Success looks like:** Logical-property-only inspector, RTL-mirrored canvas coordinate system, Arabic typography preview at 1.4×–1.6× expanded line-height.
- **Technical comfort:** High · **Usage frequency:** Weekly

---

## 3. Success Metrics

| Metric | Baseline | 30-day Target | 90-day Target | Source |
|---|---|---|---|---|
| Profile Save/Load Reliability | 0% | 100% (zero lost profiles) | 100% | Integration tests / localStorage |
| Token Sync Latency | — | < 50ms | < 25ms | Chrome Perf Audit |
| Design Drift Incidents | 12/sprint | < 2/sprint | 0 | PR reviews + design gate audits |
| Canvas frame rate (50 nodes) | — | 60fps p95 | 60fps p95 | RAF profiler |
| RTL layout breakage incidents | — | 0 | 0 | Axe + manual RTL audit |
| WCAG AA gate false negatives | — | 0 | 0 | Axe-core CI |

---

## 4. Feature Registry

| ID | Feature Name | Priority | Persona | Phase | Spec File |
|---|---|---|---|---|---|
| F-001 | Design Profile Persistence Layer | P0 | Amina, Tarek | Build | `docs/plans/00-define/specs/F-001-profile-persistence.md` |
| F-002 | UI CSS Sync Status Indicators | P0 | Amina | Build | `docs/plans/00-define/specs/F-002-css-sync-status.md` |
| F-003 | Border Radius Custom Token Editors | P0 | Tarek | Build | `docs/plans/00-define/specs/F-003-border-radius.md` |
| F-004 | Typography Scale Visualizer Grid | P0 | Tarek | Build | `docs/plans/00-define/specs/F-004-typo-scale-preview.md` |
| F-005 | Infinity Canvas & Sitemap Graph Shell | P0 | Amina, Rami | Build | `docs/plans/00-define/specs/F-005-infinity-canvas.md` |
| F-006 | Motion Studio — Timeline & Keyframe Tracker | P1 | Tarek | Build | `docs/plans/00-define/specs/F-006-motion-studio.md` |
| F-007 | Property Inspector — CSS Layer Panel | P0 | Amina, Rami | Build | `docs/plans/00-define/specs/F-007-property-inspector.md` |
| F-008 | Asset Browser & Import Terminal | P1 | Amina | Build | `docs/plans/00-define/specs/F-008-asset-browser.md` |

---

## 5. Core User Flows

### Flow 1: Save and Apply Custom Brand Profile (F-001, F-002)

```
Step 1: User opens Nezam Design Server.
  → [Happy path]: App loads current profile from localStorage, "CSS Synchronized" pill active.

Step 2: User tweaks primary color, border-radius (12px), increases base typography.
  → [Happy path]: Sync pill → "Syncing..." → "CSS Synchronized" (< 50ms).
  → [Error]: Disk write failure → "Sync Failed" badge with tooltip + retry button.

Step 3: User enters name "Sahel Sunset" → clicks "Save Preset".
  → [Happy path]: Preset saved to localStorage + written to .nezam/design/ on "Sync to Disk".
  → [Validation error]: Empty name → input border glows orange, "Preset name required".
  → [Edge case]: Name collision → "Preset 'Sahel Sunset' already exists — overwrite?" modal.
```

### Flow 2: Configure Shape and Typography Scale (F-003, F-004)

```
Step 1: User opens "Shape & Typo" tab in Token Studio.
  → [Happy path]: clamp() scale grid renders live text previews XS → 2XL.

Step 2: User drags Border Radius slider from 4px → 16px.
  → [Happy path]: Buttons, Cards, Dialogs instantly animate to new corner rounding.
  → [Error]: Invalid CSS unit typed manually → reverts to previous value, shows "Invalid unit".

Step 3: User changes font family to "Outfit", increases scale ratio.
  → [Happy path]: Typography scale grid recalculates. Hover → detailed px metrics tooltip.
  → [Offline]: localStorage read fails → frozen preview with "Cannot sync — offline" badge.
```

### Flow 3: Wire Sitemap Nodes on Infinity Canvas (F-005)

```
Step 1: User opens "Sitemap Graph" mode.
  → [Happy path]: Canvas loads existing pages as nodes at stored coordinates.
  → [Empty]: No pages yet → "Add your first page" prompt node centered on canvas.

Step 2: User drags wire from /index port → /dashboard port.
  → [Happy path]: Bezier wire renders with var(--color-accent-cyan) stroke + dash-flow animation.
  → [RTL mode]: Source/target port positions mirror; pan delta X negated.

Step 3: User clicks wire → Wire Inspector opens in right dock.
  → [Happy path]: Attach image, type directive, click "Generate /dashboard".
  → [Hardlock fail]: Source node has RTL or WCAG gate failure → orange border overlay, generate blocked.
  → [Vision Gate reject]: Attached image has embedded text → red ✗ badge, generate blocked.
```

### Flow 4: Set Motion Keyframes in Motion Studio (F-006)

```
Step 1: User selects Component_Hero_01 → opens Motion Studio dock.
  → [Happy path]: Timeline renders opacity and translate3d tracks with existing keyframes.
  → [Empty]: No keyframes → "Add first keyframe" prompt at 0.0s.

Step 2: User drags keyframe [◆] along timeline ruler.
  → [Happy path]: Duration matrix recalculates. Easing curve preview updates.
  → [prefers-reduced-motion]: All durations set to 0ms; static fallback shown with label.

Step 3: User selects "spring(100, 10)" easing preset.
  → [Happy path]: Curve updates; velocity and loop controls activate.
```

### Flow 5: Inspect & Edit CSS Properties (F-007)

```
Step 1: User selects a node on canvas → Property Inspector activates.
  → [Happy path]: Box Model tab shows logical property values (margin-inline-start, padding-block).

Step 2: User changes margin-inline-start value from 12px → 24px.
  → [Happy path]: Canvas node updates live. Token label shows "(space.lg)".
  → [Hardlock fail]: User types "margin-left" in raw CSS tab → blocked with error: "Use logical properties".

Step 3: User opens A11y tab.
  → [Happy path]: Contrast ratio badge shows 4.5:1 ✅ or flagged ❌ with suggested fix.
```

---

## 6. Data Model

### Entity: `DesignPreset`

| Field | Type | Required | Unique | Default | Validation | Notes |
|---|---|---|---|---|---|---|
| id | string (uuid) | yes | yes | auto | uuid | Primary key |
| name | string | yes | yes | — | minLength: 1 | Display name |
| colors | object | yes | no | default tokens | valid CSS hex/hsl | primary, secondary, neutral, bg |
| borderRadius | string | yes | no | "8px" | CSS length unit | Corner radius |
| typography | object | yes | no | default fonts | font-size definitions | fontFamily, baseSize, scale |
| isCustom | boolean | yes | no | true | — | Custom vs core brand preset |
| updatedAt | string (ISO) | yes | no | auto | ISO datetime | Last edit timestamp |

### Entity: `CanvasNode`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | yes | auto | Unique node ID |
| type | enum | yes | 'page' | page / service / auth / mobile / group |
| title | string | yes | — | Display label |
| route | string | no | — | URL route (page nodes) |
| x, y | number | yes | 0 | Canvas coordinates |
| width, height | number | yes | 180, 80 | Node dimensions |
| rtlCompliant | boolean | yes | false | Hardlock gate flag |
| wcagCompliant | boolean | yes | false | Hardlock gate flag |
| generationStatus | enum | no | 'idle' | idle / generating / done / error |

### Entity: `CanvasWire`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | yes | auto | — |
| fromNodeId | string | yes | — | Source node |
| toNodeId | string | yes | — | Target node |
| type | enum | yes | 'navigational' | navigational / data / auth / conditional |
| contextPayload | object | no | null | Compressed LLM context (≤ 32k tokens) |
| attachments | array | yes | [] | AttachmentPayload[] |

### Entity: `MotionTrack`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | yes | auto | — |
| componentId | string | yes | — | Target component |
| property | string | yes | — | opacity / translate3d / stagger_delay |
| keyframes | array | yes | [] | [{time, value, easing}] |
| reducedMotionFallback | string | yes | 'instant' | Fallback when prefers-reduced-motion |

### Entity: `AssetItem`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | yes | auto | — |
| name | string | yes | — | Display filename |
| mimeType | string | yes | — | image/svg+xml / font/woff2 / application/json etc. |
| optimizedUrl | string | yes | — | WebP/AVIF/cleaned SVG path |
| altText | string | no | '' | Auto-generated on ingest |
| visionStatus | enum | yes | 'pending' | pending / valid / rejected |

---

## 7. API Surface

### Token & Profile APIs

#### `GET /api/presets`
- **Purpose:** Fetch all stored design presets.
- **Success (200):**
  ```json
  [{ "id": "sahel-sunset", "name": "Sahel Sunset", "colors": {}, "borderRadius": "12px", "typography": {}, "isCustom": true }]
  ```

#### `POST /api/presets/save`
- **Request:** `{ name, colors, borderRadius, typography }`
- **Success (200):** `{ "success": true, "presetId": "sahel-sunset" }`
- **Error (400):** `{ "error": "Preset name required" }`
- **Error (409):** `{ "error": "Preset already exists", "existingId": "..." }`

#### `POST /api/presets/sync-to-disk`
- **Purpose:** Write active preset to `.nezam/design/<name>/design.md`.
- **Success (200):** `{ "success": true, "path": ".nezam/design/sahel-sunset/design.md" }`
- **Error (500):** `{ "error": "Write failed: Permission denied" }`

### Canvas APIs

#### `GET /api/canvas`
- **Purpose:** Fetch all nodes and wires for the current project.
- **Success (200):** `{ "nodes": [...], "wires": [...], "viewport": { x, y, scale } }`

#### `POST /api/canvas/node`
- **Request:** `{ type, title, route, x, y }`
- **Success (201):** `{ "node": CanvasNode }`

#### `POST /api/ai/vision-gate`
- **Purpose:** Scan attached image for embedded text (Zero-Text Policy).
- **Request:** `{ "image": "<base64>", "mimeType": "image/png" }`
- **Success (200):** `{ "status": "valid" | "rejected", "reason"?: "..." }`

#### `POST /api/ai/generate-node`
- **Purpose:** LLM-generate target node from compressed context payload.
- **Request:** `{ wireId, compressedPayload, tokenCount }`
- **Success (200):** `{ "blocks": [...], "spec": "<COMPONENT_SPEC.md content>" }`
- **Error (500):** `{ "error": "Generation failed" }`

### Asset APIs

#### `POST /api/assets/upload`
- **Purpose:** Ingest and optimize uploaded asset (auto-converts to WebP/AVIF, strips SVG text layers).
- **Request:** multipart form-data
- **Success (201):** `{ "asset": AssetItem }`
- **Error (422):** `{ "error": "Unsupported MIME type" }`

---

## 8. UI Screens & States

### Screen 1: Token Studio Dashboard

- **Route:** `/` (main entry)
- **Layout:** Full dark shell — left sidebar (240px), main token editor, right status dock

| State | Trigger | What user sees | Action |
|---|---|---|---|
| Loading | App init | Dark skeleton screens | — |
| Empty | No presets | Sidebar with Default + Agentic system profiles | "Create Preset" CTA |
| Populated | Presets loaded | Color selectors, radius slider, typography scale grid, component playground | Apply/edit/export |
| Error | Write failure | Toast: "Failed to write DESIGN.md: Permission Denied" | Retry sync |

### Screen 2: Infinity Canvas (Sitemap Graph)

- **Route:** `/` → [Sitemap Graph] mode toggle
- **Layout:** Full viewport SVG canvas — left page dock (240px), floating toolbar, right wire inspector (opens on wire select)

| State | Trigger | What user sees | Action |
|---|---|---|---|
| Loading | Canvas init | Spinner → fades to empty grid | — |
| Empty | No pages | Single "Add your first page" node centered | Add node |
| Populated | Pages exist | Nodes as rounded boxes (6px radius), bezier wires (Electric Cyan stroke), dash-flow animation | Wire / generate |
| Generating | Generate clicked | Target node shows spinner overlay | Cancel |
| Error | Gate failure / API fail | Source node orange border, inline badge, generate blocked | Fix gate / retry |

**LOD rendering contract:**
- Scale ≥ 0.4 → Full node (title, type badge, port handles, hardlock overlays)
- 0.1 ≤ scale < 0.4 → Simplified (colored rect + title only)
- Scale < 0.1 → Dot mode (8px filled circle, node-type color)

### Screen 3: Motion Studio

- **Route:** Bottom dock panel (collapsible) — appears when motion-enabled component selected
- **Layout:** Timeline ruler header + track/layer list (200px) + keyframe grid

| State | Trigger | What user sees | Action |
|---|---|---|---|
| Empty | No keyframes | "Add first keyframe" prompt at 0.0s | Add keyframe |
| Populated | Keyframes exist | [◆] markers on timeline ruler, easing curve preview | Drag / scrub |
| Reduced-motion | OS preference | All durations collapse to 0ms label | Static fallback |

### Screen 4: Property Inspector

- **Route:** Right dock panel — appears when canvas node or component selected
- **Tabs:** Layers · Settings · CSS · A11y · SEO
- **Layout:** Dense, 320px fixed width, scrollable

| State | Trigger | What user sees | Action |
|---|---|---|---|
| No selection | Canvas blur | "Select a component to inspect" empty state | — |
| Box Model | Element selected | Logical property fields (margin-inline-start, padding-block) | Edit value |
| Typography | Text element | clamp() formula display + weight/family dropdowns | Edit |
| A11y tab | A11y selected | Contrast ratio badge ✅/❌, tab order list, ARIA role | Fix suggestion |

### Screen 5: Asset Browser

- **Route:** Left dock panel, secondary tab
- **Layout:** Toolbar + breadcrumb path + drop zone + asset grid

| State | Trigger | What user sees | Action |
|---|---|---|---|
| Empty | No assets | Drop zone with supported extension list | Drag files |
| Uploading | File dropped | Progress indicator per file | Cancel |
| Populated | Assets exist | Asset grid with type icons, name, mime badge | Select / delete |
| Rejected | SVG has `<text>` | Asset card shows red ✗ "Text layer detected — blocked" | Replace |

---

## 9. Navigation Structure

```
Nezam Design Server — Ultimate UI Suite
├── Dashboard (/)
│   ├── [Mode: Page Builder]  ← Token Studio panels
│   │   ├── Color Palette Selector
│   │   ├── Shape Editor (Border Radius)
│   │   └── Typographic Scale Grid
│   └── [Mode: Sitemap Graph]  ← Infinity Canvas
│       ├── Left Dock: Page List / Widget Library / Service List
│       ├── Canvas: Infinite SVG coordinate space
│       ├── Right Dock: Wire Inspector / Property Inspector
│       └── Bottom Dock: Motion Studio (collapsible)
├── Asset Browser  (left dock tab)
└── Settings (/settings)
    └── Design Profile selector
```

---

## 10. Non-Functional Requirements

### 10.1 Performance

- CSS custom property hot-reload: < 16ms
- Disk compilation: < 35ms
- Canvas frame rate: 60fps p95 at 50 nodes; 500-node target deferred to Phase 3 (WebGL)
- Wire-to-generation round trip: < 8s for 32k-token context

### 10.2 Accessibility

- WCAG 2.2 Level AA — all interactive elements
- Contrast ratio ≥ 4.5:1 on all structural typography (axe-core CI enforcement)
- `prefers-reduced-motion` — all animated components fall back to `duration: 0ms`
- RTL parity: canvas coordinate mirroring, logical-property-only inspector
- Arabic typography preview: line-height ≥ 1.4× expanded

### 10.3 Token & Style Governance

- All spacing must map to `scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96]`
- Inner panel breathing: minimum `space.lg (24px)` padding
- Typography: all font steps use `clamp(min, preferred, max)`
- Zero hardcoded hex, px, or rem in component markup
- Zero `<text>` elements inside SVG placeholder artwork
- Zero directional CSS keys (`left`, `right`, `ml-`, `pr-`) — logical properties only

### 10.4 Security & Sandbox Integrity

- Storage confined to browser localStorage and local project directories
- Hex/color inputs sanitized (CSS injection prevention)
- SVG ingest strips unsafe inline parameters and `<text>` layers
- Asset MIME type verified on ingest

---

## 11. Constraints

- Single-Page Application: runs as a standalone frontend dashboard on the developer's local machine.
- Phase 1 rendering: CSS `transform: matrix()` affine canvas (not WebGL).
- LLM context compressed to ≤ 32,000 tokens before any generation call.
- Asset browser accepts: `.json`, `.yaml`, `.svg`, `.woff2`, `.txt`, `.png`, `.jpg`.

---

## 12. Out of Scope (v1)

- ❌ Cloud preset sharing — all presets are workspace-local
- ❌ Third-party component library compiler (Radix, MUI, DaisyUI)
- ❌ WebGL canvas renderer — deferred to Phase 3
- ❌ Multi-user collaborative canvas — deferred to v2
- ❌ Real-time WebSocket sync — Phase 2+

---

## 13. Open Questions

| # | Question | Owner | Deadline | Decision |
|---|---|---|---|---|
| Q1 | Preset storage: localStorage only vs. Sync-to-Disk hybrid? | ARCH-01 | 2026-05-18 | Combined: localStorage for sessions + "Sync to Disk" writes to `.nezam/design/` |
| Q2 | Motion Studio: integrate Motion.dev or Framer Motion? | ARCH-01 | 2026-05-20 | TBD |
| Q3 | Asset Vision Gate: run on every save or only on generate trigger? | ARCH-01 | 2026-05-20 | TBD |

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Browser sandbox blocks filesystem writes | Low | High | Next.js API routes handle local filesystem safely |
| 60fps canvas degradation at high node count | Medium | Medium | LOD rendering + Phase 3 WebGL fallback |
| LLM Vision Gate latency spikes | Low | Medium | 3s timeout + user-visible spinner; retry on fail |
| SVG ingestion misses nested `<text>` | Low | High | Recursive parser; reject on any text node depth |
| RTL coordinate edge cases in bezier math | Medium | Medium | Unit test port-anchor math for both LTR and RTL |
