# Information Architecture — Nezam Design Server · Ultimate UI Suite

> **Phase:** 02-IA | **Source:** PRD v2.0.0 · PROJECT_PROMPT
> Defines all routes, pages, panels, navigation structure, and URL map.

---

## 1. Product Type

**Local Single-Page Application** — runs at `localhost:4000` (or configured port).
No public routes. No authentication. All navigation is client-side within the SPA.

---

## 2. Top-Level Route Map

| Route | Page | Mode | Description |
|---|---|---|---|
| `/` | Main Shell | — | Entry point — defaults to last active mode |
| `/` (mode: `token-studio`) | Token Studio Dashboard | Editor | Color, shape, typography editors |
| `/` (mode: `sitemap`) | Infinity Canvas | Canvas | Spatial sitemap graph + wire inspector |
| `/settings` | Settings | Config | Design profile selector, workspace preferences |
| `/review` | Review & Lock Gateway | Gate | Completion matrix + lock ceremony |
| `/wireframe` | Wireframe Editor | Editor | Per-page wireframe builder (tab-based) |
| `/profiles` | Profile Browser | Browse | List and manage design profiles |
| `/sitemap` | Sitemap Management | Manage | Page list, metadata editing |

---

## 3. Panel Architecture (SPA Shell)

The main shell uses a panel-based layout. Panels persist across mode changes.

```
┌──────────────────────────────────────────────────────────────────────┐
│ TOP NAV                                                               │
│ [Logo] [Tab bar] ────────────────────── [Lang] [Theme] [SyncPill]   │
├──────────────────────────────────────────────────────────────────────┤
│ LEFT DOCK        │ MAIN CONTENT AREA              │ RIGHT DOCK       │
│ (240px fixed)    │ (flex-1, scrollable)           │ (320px, context) │
│                  │                                │                  │
│ Context-sensitive│ Mode-specific UI               │ Context-sensitive │
│ (see §4)         │                                │ (see §5)         │
├──────────────────┴────────────────────────────────┴──────────────────┤
│ BOTTOM DOCK (collapsible, default 240px)                              │
│ Motion Studio timeline                                                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Left Dock Navigation (by mode)

### Mode: Token Studio

| Section | Contents |
|---|---|
| Design Profiles | System profiles + custom presets list |
| Color Palette | Quick-access palette grid |
| Quick Actions | Save Preset · Sync to Disk · Export CSS |

### Mode: Sitemap Graph (Canvas)

| Section | Contents |
|---|---|
| Pages | List of all sitemap pages — click to pan to node |
| Widgets | Draggable widget types (Data Table, Auth Form, etc.) |
| Services | Service nodes (Supabase Auth, Stripe, etc.) |

### Mode: Wireframe Editor

| Section | Contents |
|---|---|
| Block Library | Available wireframe block types |
| Page Structure | Tree of current page blocks |
| Export | Export page wireframe |

---

## 5. Right Dock Navigation (context-sensitive)

| Context | Contents |
|---|---|
| No selection | "Select a component or wire to inspect" |
| Canvas node selected | Property Inspector (Box Model · CSS · A11y tabs) |
| Canvas wire selected | Wire Inspector (attachments, directive input, Generate button) |
| Wireframe block selected | PropsEditorPanel (block-specific prop schema) |

---

## 6. Tab Bar System

Tabs persist in `useSessionStore.tabs`. Tab types and their content:

| Tab Type | `type` value | Content ID | Description |
|---|---|---|---|
| Dashboard | `dashboard` | — | Token Studio home |
| Sitemap | `sitemap` | — | Sitemap page list |
| Template | `template` | `<templateId>` | Template preview |
| Wireframe | `wireframe` | `<pageId>` | Per-page wireframe editor |
| Settings | `settings` | — | Workspace settings |
| Export | `export` | — | Export panel |

**Tab rules:**
- Max concurrent open tabs: unlimited (scrollable tab bar)
- Closing last tab → navigates to Dashboard tab (never truly empty)
- Duplicate tab guard: opening an existing `contentId` focuses existing tab

---

## 7. Full URL / Route Map

| Route | Component | Access | Panel state |
|---|---|---|---|
| `/` | `app/page.tsx` | Always | Left: Profiles / Main: Token Studio |
| `/settings` | `app/settings/page.tsx` | Always | Main: Settings form |
| `/review` | `app/review/page.tsx` | Always | Main: CompletionMatrix + Lock |
| `/wireframe` | `app/wireframe/page.tsx` | Always | Left: BlockLibrary / Main: Editor / Right: PropsPanel |
| `/profiles` | `app/profiles/page.tsx` | Always | Main: Profile grid |
| `/sitemap` | `app/sitemap/page.tsx` | Always | Main: Page list + edit |

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/context` | GET | Fetch project context |
| `/api/profiles` | GET | List design profiles |
| `/api/lock` | POST | Lock design contract |
| `/api/presets` | GET | List saved presets |
| `/api/presets/save` | POST | Save preset to localStorage + disk |
| `/api/presets/sync-to-disk` | POST | Write preset to `.nezam/design/` |
| `/api/canvas` | GET | Fetch canvas nodes + wires |
| `/api/canvas/node` | POST | Create canvas node |
| `/api/assets/upload` | POST | Upload + optimize asset |
| `/api/ai/vision-gate` | POST | Scan image for embedded text |
| `/api/ai/generate-node` | POST | LLM-generate canvas node |
| `/api/session/save-page` | POST | Persist generated page session |

---

## 8. Empty States Inventory

Every panel and mode must handle the empty state:

| Location | Empty trigger | Empty state content |
|---|---|---|
| Canvas | No nodes | Centered "Add your first page" prompt node |
| Preset sidebar | No custom presets | "No custom profiles yet — save a preset to get started" |
| Wire Inspector | No attachments | Drop zone + "Attach image or paste directive" |
| Asset Browser | No assets | Large drop zone with extension list |
| Motion Studio | No keyframes | "Add first keyframe at 0.0s" inline prompt |
| Property Inspector | No selection | "Select a component to inspect" centered |
| Wireframe Editor | No blocks | "Drag a block from the library to start" |

---

## 9. Navigation Flow Diagram

```
App Load
  └─ hydratePreferences() → restore lang/theme
  └─ fetchContext() → load project context
  └─ fetchProfiles() → load design profiles
        │
        ├─ [Tab: Dashboard] ─────► Token Studio (default)
        │   └─ Mode toggle ──────► Sitemap Canvas
        │
        ├─ [Tab: Wireframe] ─────► Wireframe Editor (per page)
        │   └─ openTab({type:'wireframe', contentId: pageId})
        │
        ├─ [Tab: Sitemap]  ──────► Sitemap Management
        │
        ├─ [Tab: Settings] ──────► Settings page
        │
        └─ [Tab: Export]   ──────► Export panel
```

---

## 10. Internationalization Architecture

| Setting | Value |
|---|---|
| Default language | `en` (English) |
| Supported languages | `en`, `ar` |
| Language toggle | `useSessionStore.setLang()` → persisted to localStorage |
| RTL trigger | `lang === 'ar'` → `document.documentElement.dir = 'rtl'` |
| Arabic typography | `line-height: var(--ds-leading-arabic)` ≥ 1.6 |
| Font scaling | Arabic text at ≥ 1.4× line-height vs English baseline |

---

*Generated: 2026-05-18*
