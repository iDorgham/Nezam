# Feature Spec — F-WF-001: NEZAM Wireframe Server

> **Agents must read this entire file before writing a single line of code for this feature.**
> Implementation that doesn't match this spec is a bug, not a feature.

---

## Meta

| Field | Value |
|---|---|
| Feature ID | F-WF-001 |
| Feature Name | NEZAM Wireframe Server |
| Priority | P0 |
| Personas affected | Dorgham (NEZAM builder), all NEZAM project users |
| PRD section | NEZAM Core — Design Phase Gate |
| Status | approved |
| Spec author | NEZAM Planning Agent |
| Last updated | 2026-05-14 |

---

## 1. User Story

**As a** product builder using NEZAM SDD,
**I want to** run a local wireframe server that shows me AI-suggested page layouts I can review and modify,
**so that** developer agents receive a locked, human-approved UI specification — not an AI guess — before writing a single component.

### 1.1 Detailed Narrative

Today in NEZAM, the planning agent generates a PRD and feature specs, then developer agents immediately start building. The missing step is **human UI approval**. Developers build what the AI assumes the user wants — which leads to wrong nav structures, wrong page hierarchy, wrong component choices, and expensive refactors.

The wireframe server is a **Human-in-the-Loop design engine** that sits between `/PLAN design` and `/DEVELOP`. The planning agent writes `project_context.json` (its best interpretation of the PRD into page layouts and design tokens). The wireframe server reads this file, launches on `localhost:4000`, and presents:

1. A sitemap builder — the user approves or edits the page hierarchy and navigation structure
2. Per-page wireframe editor — AI-suggested block layout, user can swap blocks, reorder, configure props
3. Design token panel — AI-suggested color profile, typography, spacing, the user finalizes values
4. State review — the user steps through loading / empty / error / populated states per section

When the user clicks **Lock & Export**, the server writes `wireframes_locked.json`. This file becomes the **authoritative source of truth** for all developer agents — nothing in the UI may deviate from it without re-running the wireframe session.

---

## 2. Acceptance Criteria

- [ ] **AC-001:** Given a valid `project_context.json`, when the server starts, then it reads the file and pre-populates all pages, sections, and design tokens within 3 seconds
- [ ] **AC-002:** Given the server is running, when the user visits `localhost:4000`, then they see a sidebar with all sitemap pages listed and can click any page to preview its wireframe
- [ ] **AC-003:** Given a page wireframe is open, when the user drags a block to reorder it, then the new order is immediately reflected in the canvas and persisted to session state
- [ ] **AC-004:** Given a page wireframe is open, when the user clicks a block, then a right-panel shows the block's configurable props with the current values pre-filled
- [ ] **AC-005:** Given the user opens the block library, when they select a new block type, then the block is inserted at the cursor position with AI-suggested default props
- [ ] **AC-006:** Given the user is on the design token panel, when they change a color value, then all blocks on the canvas that reference that token update in real time
- [ ] **AC-007:** Given the user has reviewed all P0 pages and clicked Approve on each, when they click "Lock & Export", then `wireframes_locked.json` is written to the project root within 5 seconds
- [ ] **AC-008:** Given `wireframes_locked.json` is written, when a developer agent reads it, then it can reconstruct the full page hierarchy, every block with its props, every design token value, and every navigation item
- [ ] **AC-009:** Given RTL is true in `project_context.json`, when the server starts, then the canvas renders in RTL mode and all layout decisions default to RTL
- [ ] **AC-010:** Given the user has not approved all P0 pages, when they click "Lock & Export", then the export is blocked and the unapproved pages are highlighted
- [ ] **AC-011:** Given the user switches between canvas modes (web-marketing / saas-dashboard / mobile-app), then the block library filters to only show mode-appropriate blocks

### 2.1 Out of Scope for This Feature

- ❌ Real-time collaboration (multi-user editing) — tracked as F-WF-004
- ❌ Figma export — tracked as F-WF-005
- ❌ Cloud-hosted server (always local only for v1) — tracked as F-WF-006
- ❌ Actual CSS/component code generation from wireframes — developer agents handle this using `wireframes_locked.json`
- ❌ Pixel-perfect design tools (this is wireframing, not Figma)
- ❌ Image uploading or asset management

---

## 3. UI Specification

### 3.1 Screens Involved

| Screen | Route | New or Modified |
|---|---|---|
| Main Canvas | `/` | New |
| Page Wireframe | `/:page_id` | New |
| Sitemap Builder | `/sitemap` | New |
| Design Tokens | `/design-tokens` | New |
| Block Library | `[right-panel]` | New |
| Props Editor | `[right-panel]` | New |
| Lock & Export | `[modal]` | New |

### 3.2 Screen States

#### Main Canvas (`/`)

**Loading state**
- Trigger: server has started, reading `project_context.json`
- Show: full-screen spinner with "Loading your project..." message
- Duration: should complete in < 3 seconds
- If file not found: show "No project_context.json found" error with path instruction

**Empty state**
- Trigger: `project_context.json` found but has zero pages
- Headline: "No pages found in project context"
- Body: "Run /PLAN design to generate the project context file first."
- CTA: "Open Documentation"

**Populated state**
- Three-panel layout: left sidebar (sitemap tree) + center canvas + right panel (context-sensitive)
- Sticky top bar: project name, canvas mode badge, "Lock & Export" button, approval progress indicator
- Approval progress: "3 / 7 pages approved" shown in top bar

**Error state**
- Trigger: `project_context.json` exists but fails JSON schema validation
- Show: validation error list with field paths
- Recovery: "Fix the file and refresh"

#### Page Wireframe (`/:page_id`)

**Loading state**
- Show: skeleton blocks matching the section count from `project_context.json`

**Populated state**
- Center canvas: blocks stacked vertically, matching viewport of canvas_mode (desktop / mobile / tablet)
- Each block: labeled with block type, hover reveals drag handle (top-left) and settings button (top-right)
- Active block: blue outline, right panel shows props editor
- Block with AI rationale: small ℹ icon — hover shows the agent's rationale string

**State Switcher** (per section)
- Small tab bar on each section block: "Loaded | Empty | Error | Offline"
- Clicking switches the block preview to that state
- User must review and mark each state as approved separately

**Error state**
- Trigger: block type in context file not found in block registry
- Show: "Unknown block type: [type]" placeholder with red border
- Recovery: user can swap to a known block type

#### Design Tokens Panel

**Populated state**
- Left: token categories (Colors, Typography, Spacing, Borders, Motion)
- Center: token value editor — color swatches, font pickers, sliders
- Right: live preview card showing a sample button, text, and card with current tokens
- "Suggested by AI" badge on tokens that weren't changed from the context file
- "Modified" badge on tokens the user changed

#### Lock & Export Modal

**States:**
- Pre-check: shows checklist of all P0 pages and their approval status
- All approved: green checkmarks, "Export" button enabled
- Some unapproved: list of unapproved pages, "Export" button disabled with tooltip "Approve all P0 pages to export"
- Exporting: progress indicator "Writing wireframes_locked.json..."
- Success: "Export complete. Return to your terminal and run /DEVELOP."

### 3.3 Component Inventory

| Component | Type | Props | Notes |
|---|---|---|---|
| `SitemapTree` | New | `pages[]`, `activePageId`, `onSelect` | Collapsible tree, drag to reorder |
| `WireframeCanvas` | New | `sections[]`, `canvasMode`, `rtl` | Center panel, renders blocks |
| `BlockRenderer` | New | `blockType`, `props`, `state`, `approved` | Renders individual block wireframes |
| `PropsEditor` | New | `blockType`, `lockedProps`, `flexibleProps`, `onChange` | Right-panel form for block props |
| `DesignTokenPanel` | New | `colorProfile`, `typography`, `spacing`, `onChange` | Token editor with live preview |
| `BlockLibrary` | New | `canvasMode`, `onInsert` | Searchable block catalog |
| `ApprovalBadge` | New | `approved: boolean` | Green check or grey pending |
| `StateSwitcher` | New | `states[]`, `activeState`, `onSwitch` | Per-section state tab strip |
| `LockExportModal` | New | `pages[]`, `onExport` | Pre-flight checklist + export |
| `TopBar` | New | `projectName`, `canvasMode`, `approvedCount`, `totalCount` | Sticky header |

### 3.4 Interaction Specification

#### Block drag-to-reorder
- Handle: appears on hover at top-left of each block
- Drag: visual ghost follows cursor, other blocks shift to make room
- Drop: section order updates in session state immediately
- Keyboard: Alt+Up / Alt+Down to move block without mouse

#### Block swap
- Click block → right panel opens
- Top of right panel: "Change block type" button
- Opens block library drawer (filtered to compatible blocks)
- Selecting replaces block in place, inheriting any compatible props

#### Design token color picker
- Click color swatch → opens color picker inline
- Supports HEX input directly
- "Reset to AI suggestion" link below each token
- Changes apply to canvas in real time (no save button — continuous)

#### Lock & Export button
- Disabled state: grey, tooltip "X pages still need approval"
- Enabled state: primary color, hover darkens
- Click → opens Lock & Export modal, not immediate action

### 3.5 Responsive Behavior

The wireframe server itself is desktop-only (developer tool). The canvas viewport previews different breakpoints:

| Canvas viewport mode | Toggle location | Preview size |
|---|---|---|
| Desktop (default) | Top bar toggle | 1280px wide |
| Tablet | Top bar toggle | 768px wide |
| Mobile | Top bar toggle | 390px wide |

RTL mode: top bar toggle — flips the canvas direction and all block layouts.

### 3.6 Motion & Reduced-Motion Contract

| Interaction | Animation | Duration | Reduced-motion fallback |
|---|---|---|---|
| Block drag | Smooth translate | 150ms | instant |
| Panel open/close | Slide in from right | 200ms | instant |
| Token change live preview | Fade transition | 100ms | instant |
| Lock export success | Confetti burst | 600ms | simple checkmark only |

---

## 4. Data Specification

### 4.1 Data Required

**Reads:**
- `project_context.json` — full context file on server boot
- `block_registry.json` — available blocks per canvas mode
- Session state (in-memory) — current canvas state during editing

**Writes:**
- `wireframes_locked.json` — final export on Lock & Export
- Session autosave: `.wireframe-session/autosave.json` — every 30 seconds, prevents data loss

### 4.2 Validation Rules

| Field | Rule | Error |
|---|---|---|
| `project_context.json` | Must validate against `project_context.schema.json` | "Project context is invalid: [field path]" |
| Block `block_type` | Must exist in `block_registry.json` for this canvas_mode | "Unknown block '[type]' for [canvas_mode]" |
| Color token values | Must be valid hex `#RRGGBB` | "Enter a valid hex color (e.g. #1A2B3C)" |
| Export | All P0 pages must be approved | "Approve all P0 pages before exporting" |

### 4.3 Data Transformations

- `project_context.json` design tokens (partial/suggested) → merged with block_registry defaults → full token set written to `wireframes_locked.json`
- Section `order` integers → re-indexed 1..N after any drag operation (no gaps)

---

## 5. API Specification

The wireframe server is a local Next.js or Vite app with no external network calls. All APIs are localhost-only.

### `GET /api/project-context`
- **Purpose:** Returns the parsed and validated project_context.json
- **Auth required:** No (localhost only)
- **Success (200):** Full project_context object
- **Errors:**
  | Code | Condition | Response |
  |---|---|---|
  | 404 | File not found | `{"error": "project_context.json not found", "code": "FILE_NOT_FOUND"}` |
  | 422 | Schema validation failure | `{"error": "Invalid context", "code": "SCHEMA_INVALID", "fields": [...]}` |

### `GET /api/blocks`
- **Purpose:** Returns filtered block registry for current canvas_mode
- **Success (200):** `{"data": {"blocks": {...}, "canvas_mode_defaults": {...}}}`

### `POST /api/session/save`
- **Purpose:** Autosave current canvas state to `.wireframe-session/autosave.json`
- **Request:** Full canvas state object
- **Success (200):** `{"data": {"saved_at": "ISO_TIMESTAMP"}}`

### `POST /api/export`
- **Purpose:** Validate and write `wireframes_locked.json`
- **Request:** Full canvas state + design_system decisions
- **Pre-flight check:** All P0 pages must have `layout_approved: true`
- **Success (200):** `{"data": {"path": "wireframes_locked.json", "locked_at": "ISO_TIMESTAMP"}}`
- **Errors:**
  | Code | Condition | Response |
  |---|---|---|
  | 400 | P0 pages not all approved | `{"error": "Unapproved P0 pages", "pages": ["PAGE-001", "PAGE-003"]}` |
  | 500 | File write failure | `{"error": "Failed to write output", "code": "WRITE_ERROR"}` |

---

## 6. Business Logic

### 6.1 Core Rules

1. **Canvas mode filtering:** The block library only shows blocks valid for the current `canvas_mode`. Blocks from other modes are hidden, not just greyed out.
2. **P0 gate on export:** Export is blocked unless every page with `priority: "P0"` has `layout_approved: true`. P1 and P2 pages can be deferred.
3. **Design token immutability after export:** Once `wireframes_locked.json` is written, the file must not be modified by agents. A new wireframe session is required to change design decisions.
4. **Locked props vs flexible props:** Props the user explicitly set go to `locked_props` — agents must not override these. Props left at AI defaults go to `flexible_props` — agents have discretion.
5. **RTL enforcement:** If `meta.rtl` is `true`, all block layout decisions default to RTL. The user must explicitly switch to LTR to override.
6. **Autosave:** Session state autosaves every 30 seconds to `.wireframe-session/autosave.json`. On server restart, if autosave exists and is newer than `project_context.json`, prompt user to restore.

### 6.2 Edge Cases

| Situation | Expected behavior |
|---|---|
| `project_context.json` not found on boot | Show setup screen with exact file path and command to generate it |
| Block type in context file not in registry | Render "Unknown block" placeholder, allow user to swap |
| User adds more pages than in context file | Allowed — new pages start with empty sections, no AI suggestions |
| User removes a P0 page from the sitemap | Warning: "This is a P0 page. Mark as Deferred instead of removing." |
| Canvas mode changed mid-session | Incompatible blocks get flagged with "This block is not available in [new mode]" — user must swap or remove |
| Session autosave file is corrupt | Silently ignore, start fresh from `project_context.json` |
| Export file write permission denied | Show "Cannot write to [path]. Check file permissions." with exact path |
| User double-clicks export | Debounce — ignore second click within 2 seconds |

### 6.3 Permissions

This is a local dev tool — no user roles. All operations are permitted.

---

## 7. Notifications & Side Effects

| Trigger | Side effect | Channel | Notes |
|---|---|---|---|
| Successful export | NEZAM gate updated: `wireframe_complete: true` in `onboarding.yaml` | File write | Unlocks `/DEVELOP` |
| Page approved | Progress counter in top bar increments | UI update | Real-time |
| Autosave | Silent | Background | No UI indicator unless it fails |
| Autosave failure | Warning toast: "Autosave failed — your work is not saved" | In-app toast | |

---

## 8. Analytics Events

| Event Name | Trigger | Properties |
|---|---|---|
| `wireframe_session_started` | Server boot with valid context | `{projectName, canvasMode, pageCount}` |
| `wireframe_page_approved` | User approves a page | `{pageId, pageTitle, blockCount, timeSpentMs}` |
| `wireframe_block_swapped` | User replaces a block type | `{pageId, oldBlockType, newBlockType}` |
| `wireframe_token_changed` | User modifies a design token | `{tokenName, oldValue, newValue}` |
| `wireframe_exported` | Lock & Export completed | `{pagesApproved, pagesDeferred, tokensChanged, sessionDurationMs}` |

Analytics written to `.wireframe-session/analytics.jsonl` (append-only). No external calls.

---

## 9. Implementation Notes

### 9.1 Recommended Approach

**Stack:** Next.js 14 App Router + Tailwind CSS + shadcn/ui. Run locally on port 4000.

**Rendering engine:** Use `@dnd-kit/core` for drag-and-drop block reordering — lightweight, accessible, no canvas dependency.

**No Puck or Craft.js:** These are full no-code builders. The wireframe server is a structured wireframe tool, not a drag-and-drop page builder. Block rendering is simplified (visual placeholders representing real components, not real components themselves).

**Block rendering:** Each block type renders a wireframe placeholder SVG/div that communicates the block's visual weight, layout, and content slots — not a pixel-perfect design. Think: grey rectangles, placeholder text, structural layout cues.

**File watching:** Use `chokidar` to watch `project_context.json` — if the file changes while the server is running, show a toast: "Project context updated. Reload to apply changes."

**Design token live preview:** Use CSS custom properties (`--color-primary`, etc.) updated via JavaScript on token change. All block placeholders reference these CSS vars.

### 9.2 File structure

```
apps/wireframe-server/
├── app/
│   ├── page.tsx                    ← Redirects to /sitemap on first load
│   ├── sitemap/page.tsx
│   ├── design-tokens/page.tsx
│   ├── [page_id]/page.tsx          ← Per-page wireframe canvas
│   └── api/
│       ├── project-context/route.ts
│       ├── blocks/route.ts
│       ├── session/save/route.ts
│       └── export/route.ts
├── components/
│   ├── canvas/
│   │   ├── WireframeCanvas.tsx
│   │   ├── BlockRenderer.tsx
│   │   └── StateSwitcher.tsx
│   ├── sidebar/
│   │   └── SitemapTree.tsx
│   ├── panels/
│   │   ├── PropsEditor.tsx
│   │   ├── BlockLibrary.tsx
│   │   └── DesignTokenPanel.tsx
│   └── modals/
│       └── LockExportModal.tsx
├── lib/
│   ├── schema-validator.ts         ← Validates context file against JSON schema
│   ├── block-registry.ts           ← Loads and filters block_registry.json
│   ├── session-state.ts            ← In-memory session state + autosave
│   └── exporter.ts                 ← Generates wireframes_locked.json
├── public/
│   └── block-placeholders/         ← SVG wireframe placeholders per block type
├── .wireframe-session/             ← Gitignored — autosave, analytics
├── package.json
└── next.config.js
```

### 9.3 Dependencies

- **Depends on:** F-001 (PRD generation), F-WF-000 (project_context.json generation by planning agent) — wireframe server is useless without the context file
- **Blocks:** `/DEVELOP` — developer agents must not start until `wireframes_locked.json` exists
- **Shares data contracts with:** Planning agent (reads `project_context.json`), developer agents (read `wireframes_locked.json`)

### 9.4 Known Risks & Gotchas

- **Port conflict** — port 4000 may be in use. Add `--port` flag to start script, default 4000.
- **Large projects** — projects with 30+ pages may make the sitemap tree unwieldy. Implement page search/filter in sidebar.
- **Block prop complexity** — some blocks have many configurable props. Limit the props editor to the 5 most impactful props per block. Full props are accessible via "Advanced" toggle.
- **JSON schema drift** — `project_context.schema.json` and `wireframes_locked.schema.json` must be versioned. If a schema version mismatch is detected, warn the user before loading.

---

## 10. Testing Requirements

### Unit Tests
- [ ] `schema-validator.ts` — rejects invalid `project_context.json` with correct field paths
- [ ] `block-registry.ts` — returns only mode-appropriate blocks for each canvas_mode
- [ ] `exporter.ts` — writes valid `wireframes_locked.json` matching schema
- [ ] `exporter.ts` — throws if any P0 page lacks `layout_approved: true`
- [ ] `session-state.ts` — autosave round-trips without data loss

### Integration Tests
- [ ] `GET /api/project-context` — returns 404 when file missing
- [ ] `GET /api/project-context` — returns 422 when file fails schema validation
- [ ] `POST /api/export` — returns 400 when P0 pages unapproved
- [ ] `POST /api/export` — writes valid JSON file on success
- [ ] `POST /api/session/save` — saves to `.wireframe-session/autosave.json`

### E2E Tests
- [ ] Happy path: load context → approve all P0 pages → export → `wireframes_locked.json` valid
- [ ] Block swap: replace Nav_TopBar with Nav_Sidebar → block type updates in export
- [ ] Token change: change primary color → export reflects new hex value
- [ ] RTL: set rtl true in context → canvas renders RTL, export preserves `layout_direction: "rtl"`

### Accessibility Tests
- [ ] All interactive elements reachable by keyboard alone
- [ ] Block drag-and-drop has keyboard alternative (Alt+Up / Alt+Down)
- [ ] Screen reader announces block type and approval state
- [ ] Color picker accessible to keyboard users

---

## 11. Definition of Done

- [ ] All acceptance criteria in Section 2 pass
- [ ] Server starts in < 3 seconds with a valid `project_context.json`
- [ ] All 4 canvas modes render correct block libraries
- [ ] `wireframes_locked.json` validates against `wireframes_locked.schema.json` on export
- [ ] Autosave working — data survives server restart
- [ ] RTL mode fully functional
- [ ] Lock gate working — export blocked until all P0 pages approved
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Accessibility checklist passed
- [ ] `tsc --noEmit` passes — zero TypeScript errors
- [ ] No hardcoded colors, spacing, or font values
- [ ] `README.md` in `apps/wireframe-server/` with start instructions
- [ ] NEZAM `onboarding.yaml` updated with `wireframe_complete: true` on export
- [ ] CHANGELOG.md updated

---

## 12. Decision Log

| Date | Decision | Reason | Alternatives rejected |
|---|---|---|---|
| 2026-05-14 | Next.js 14 + Tailwind over raw Vite | Consistent with main app stack, shadcn/ui available | Vite-only (fewer component options), Electron (overkill for local tool) |
| 2026-05-14 | @dnd-kit over react-beautiful-dnd | Actively maintained, accessible by default | react-beautiful-dnd (archived), Puck (too opinionated for our block model) |
| 2026-05-14 | Wireframe placeholders (not real components) | Real components require running the full app stack locally | Full component preview (requires all deps, auth, DB, too heavy for planning phase) |
| 2026-05-14 | Port 4000 as default | Avoids conflicts with common dev servers (3000 Next.js, 5173 Vite, 8080 common API) | 3000 (conflicts with Next.js default) |
| 2026-05-14 | No cloud hosting in v1 | Local tool = no auth, no data privacy concerns, no infra cost | Cloud version (tracked as F-WF-006 for future) |
