# Design Hub — UX Enhancement & Onboarding Tooltips Plan

> **Version:** 3.0 — skill-assigned, motion-specified, design-law-enforced  
> **Updated:** 2026-06-01  
> **Prerequisite:** `NEZAM_IMPROVEMENT_PLAN.md` Track A complete  
> **Scope:** Design Hub v7 UX layer — spotlight tours, empty states, onboarding polish  
> **Owner:** Dorgham

---

## Design Read (impeccable § 0.B)

> *Reading this as: **product UI** for AI-native developers and solo founders, with a dark-tool / Atlassian-dense language, leaning toward design-system-first components + purposeful micro-interactions + zero decorative motion.*

**Three Dials** (design-taste-frontend § 1):

| Dial | Value | Reason |
|---|---|---|
| `DESIGN_VARIANCE` | 6 | Tool, not marketing. Consistency over artistry. |
| `MOTION_INTENSITY` | 4 | Product register. 150–250ms feedback only. No page choreography. |
| `VISUAL_DENSITY` | 6 | Developer tool. Packed but not claustrophobic. |

**Design system:** Existing `ui/` components (shadcn-based, Tailwind tokens). Do not introduce a new system. Extend in-place.

**Absolute bans enforced on all new UI** (impeccable shared design laws):
- No side-stripe borders on callout bubbles
- No gradient text anywhere
- No glassmorphism as default
- No hero-metric template patterns in empty states
- No identical card grids for tour steps

---

## Reference Load Order

Every agent working this plan loads in this order before writing a single line:

```
1. DESIGN.md (root)                     ← always first — token source of truth
2. impeccable/reference/product.md      ← product register laws
3. impeccable/reference/onboard.md      ← onboarding design principles
4. impeccable/reference/animate.md      ← motion budget and rules
5. impeccable/reference/delight.md      ← only for Launch button + success moments
6. emil-design-eng/SKILL.md             ← animation decision framework
7. design-intelligence-index/SKILL.md   ← conflict resolution priority table
```

`design-taste-frontend` is brand/landing register — not loaded here. This is a product UI.

---

## Agent + Skill Assignment per Task

Each task below lists: **Lead Agent**, **Skill Stack**, and **Reference Files**.

---

## Task 0 — Foundation: `session.store.ts`

> **This is the blocker. Nothing in Tasks 1–6 can be built until this is complete.**

**Lead agent:** `lead-frontend-architect`  
**Support:** `task-state-manager`  
**Skills:** none (pure state logic, no UI)  
**References:** `hub.store.ts` (existing store pattern — match exactly)

### Implementation

Activate the stub at `src/store/session.store.ts`. Full content:

```ts
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type HubSection =
  | 'architecture' | 'wireframes' | 'design'
  | 'components'   | 'theming'    | 'preview'

interface SessionState {
  dismissedSpotlights: string[]
  sectionsEntered: HubSection[]
  hintsEnabled: boolean
  firstLaunchAt: string | null

  dismissSpotlight(id: string): void
  dismissTourForSection(section: HubSection): void
  resetAllSpotlights(): void
  markSectionEntered(section: HubSection): void
  setHintsEnabled(v: boolean): void
  markFirstLaunch(): void
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      dismissedSpotlights: [],
      sectionsEntered: [],
      hintsEnabled: true,
      firstLaunchAt: null,

      dismissSpotlight: (id) =>
        set((s) => ({ dismissedSpotlights: [...new Set([...s.dismissedSpotlights, id])] })),

      dismissTourForSection: (section) => {
        const ids = SECTION_SPOT_IDS[section] ?? []
        set((s) => ({ dismissedSpotlights: [...new Set([...s.dismissedSpotlights, ...ids])] }))
      },

      resetAllSpotlights: () => set({ dismissedSpotlights: [], sectionsEntered: [] }),

      markSectionEntered: (s) =>
        set((st) => ({ sectionsEntered: [...new Set([...st.sectionsEntered, s])] })),

      setHintsEnabled: (v) => set({ hintsEnabled: v }),

      markFirstLaunch: () => {
        if (!get().firstLaunchAt) set({ firstLaunchAt: new Date().toISOString() })
      },
    }),
    { name: 'nezam-dh-session', version: 1 },
  ),
)

export const SECTION_SPOT_IDS: Record<HubSection, string[]> = {
  architecture: ['arch-left-panel', 'arch-canvas', 'arch-profiles', 'arch-right-rail'],
  wireframes:   ['wf-page-tree', 'wf-palette', 'wf-lock-button'],
  design:       ['ds-token-nav', 'ds-color-editor', 'ds-export'],
  components:   ['comp-tabs', 'comp-copy'],
  theming:      ['theme-presets', 'theme-preview'],
  preview:      ['preview-devices', 'preview-export'],
}
```

**Why separate from hub.store:** hub.store persists design data across migrations. Mixing dismissal flags into it couples data schema migrations with UI behavior — a maintenance trap.

**Acceptance:** `pnpm --filter design-hub typecheck` passes with zero errors.

---

## Task 1 — `SpotlightTooltip` Primitive

**Lead agent:** `lead-frontend-architect` + `frontend-lead`  
**Skills:** `emil-design-eng`, `impeccable` (animate + onboard references)  
**References:** `impeccable/reference/animate.md`, `impeccable/reference/onboard.md`, `emil-design-eng/SKILL.md`

### Design spec (from skill laws)

**Motion** (emil-design-eng animation decision framework):
- Frequency: rare/first-time → "Can add delight" tier — animation IS appropriate
- Purpose: spatial orientation (where to look) + revelation (new information)
- Enter easing: `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out — "starts fast, feels responsive")
- Duration: 160ms enter, 100ms exit (tooltip tier per emil table: 125–200ms)
- Entry from: `scale(0.95) + opacity: 0` → `scale(1) + opacity: 1` — never from `scale(0)`
- Exit: `opacity: 0` only — no scale on exit (asymmetric enter/exit, impeccable motion law)
- Pulse ring on target: `opacity` + `scale` only — no layout properties. Disabled via `useReducedMotion()`

**Positioning:**
- Portal to `document.body` (not relative parent like `Tooltip.tsx`) — required for cross-DOM targeting
- Target lookup: `document.querySelector('[data-spotlight="<id>"]')` + `getBoundingClientRect()`
- z-index: `1250` — above panels (`1200`), below modals (`1300`)
- RTL: flip `left ↔ right` sides via `useRTL()` hook (already exists)

**Visual design** (impeccable product.md + DESIGN.md tokens):
- Background: `--app-elevated` (existing token)
- Border: `1px solid --app-border-strong`
- Radius: `--radius-app-md`
- Title: `text-[12px] font-bold text-app-text`
- Body: `text-[11px] text-app-subtle leading-relaxed` — max 120 chars enforced in config
- Arrow: 6px triangle, same `--app-elevated` fill — points toward target
- Dismiss X: top-right `IconButton`, 20×20, `text-app-muted hover:text-app-text`
- Step counter: `text-[9.5px] font-bold text-app-muted` — "2 of 4"
- CTA button (optional): 24px height, `rounded-full`, brand gradient — only on final step

**No side-stripe borders. No gradient text. No glassmorphism.**

```ts
// src/components/ui/SpotlightTooltip.tsx
interface SpotlightTooltipProps {
  id: string
  title: string           // max 40 chars
  body: string            // max 120 chars
  side?: 'top' | 'bottom' | 'left' | 'right'
  cta?: { label: string; onClick(): void }
  step?: number           // 1-based
  total?: number
  delayMs?: number        // default 700
  onDismiss(): void
  onNext?(): void
}
```

**Tooltip instant-open on subsequent hovers** (emil-design-eng — "skip delay on subsequent tooltips"): if another spotlight is already open when this mounts, skip the `delayMs` entirely and skip the enter animation (`transition-duration: 0ms`).

**Dismiss triggers:** X button · Escape key · clicking the highlighted target · section change in hub.store

**Accessibility:** `role="tooltip"` · `aria-live="polite"` · focus moves to X button on open · Escape returns focus to trigger element.

---

## Task 2 — `useSpotlightTour` Hook + Config

**Lead agent:** `frontend-lead`  
**Support:** `react-server-components-expert`  
**Skills:** `impeccable` (onboard reference)  
**References:** `impeccable/reference/onboard.md`

### Hook

```ts
// src/hooks/useSpotlightTour.ts
function useSpotlightTour(section: HubSection): {
  activeSpotId: string | null
  activeStep: number      // 1-based
  totalSteps: number
  advance(): void
  skipTour(): void
}
```

Logic: on mount → `session.markSectionEntered(section)` → if `!session.hintsEnabled` return null → find first un-dismissed ID in `SECTION_SPOT_IDS[section]` → that is `activeSpotId`.

### Config — all copy centralized

New file: `src/config/spotlight-tours.config.ts`

**Copy principles** (impeccable clarify.md + onboard.md):
- "Context Over Ceremony" — teach when the user is looking at the thing, not upfront
- "Respect User Intelligence" — no over-explaining standard patterns
- Present tense, imperative verbs, no em dashes, no restated headings
- Every sentence earns its place — if it can be removed without losing meaning, remove it

```ts
// Full tour sequences with exact copy

architecture: [
  {
    id: 'arch-left-panel',
    targetAttr: 'arch-left-panel',
    title: 'Your sitemap',
    body: 'Pages from your template appear here. Use + to add subpages, groups, or microservice links.',
    side: 'right',
  },
  {
    id: 'arch-canvas',
    targetAttr: 'arch-sitemap-canvas',
    title: 'Pan and inspect',
    body: 'Middle-click or two-finger scroll to pan. Click any card to open its properties on the right.',
    side: 'bottom',
  },
  {
    id: 'arch-profiles',
    targetAttr: 'arch-profiles-picker',
    title: 'Wrong template?',
    body: 'Swap blueprints here. Custom edits you\'ve made are preserved unless you pick a new template.',
    side: 'right',
  },
  {
    id: 'arch-right-rail',
    targetAttr: 'arch-right-rail',
    title: 'Edit page details',
    body: 'Route, type, icon, and microservice wires are here. Changes sync to the wireframe tree immediately.',
    side: 'left',
    cta: { label: 'Got it', action: 'dismiss-tour' },
  },
],

wireframes: [
  {
    id: 'wf-page-tree',
    targetAttr: 'wireframes-page-tree',
    title: 'One canvas per page',
    body: 'Each sitemap page has its own wireframe. Select a page here to start composing its blocks.',
    side: 'right',
  },
  {
    id: 'wf-palette',
    targetAttr: 'wireframes-block-palette',
    title: 'Block library',
    body: 'Drag any block into the canvas. Start every page with a Nav_TopBar block at the top.',
    side: 'right',
  },
  {
    id: 'wf-lock-button',
    targetAttr: 'wireframes-lock-btn',
    title: 'Lock to unblock dev',
    body: 'Once every P0 page has blocks, this activates. Locking writes wireframes_locked.json and starts the SDD pipeline.',
    side: 'top',
    cta: { label: 'Got it', action: 'dismiss-tour' },
  },
],

design: [
  {
    id: 'ds-token-nav',
    targetAttr: 'design-token-nav',
    title: 'Tokens by category',
    body: 'Colors, typography, spacing, radius — each has its own editor. Every edit reflects in Preview instantly.',
    side: 'right',
  },
  {
    id: 'ds-color-editor',
    targetAttr: 'design-color-editor',
    title: 'Roles, not raw values',
    body: 'Each color maps to a semantic role. Your swarm agents read these roles and never hardcode hex.',
    side: 'bottom',
  },
  {
    id: 'ds-export',
    targetAttr: 'design-export-panel',
    title: 'Export writes DESIGN.md',
    body: 'This generates the root DESIGN.md — the contract every agent builds from. Run it when tokens are final.',
    side: 'left',
    cta: { label: 'Got it', action: 'dismiss-tour' },
  },
],

components: [
  {
    id: 'comp-tabs',
    targetAttr: 'components-category-tabs',
    title: '80+ components',
    body: 'Filter by type. Every component shows all 7 states: default, hover, focus, active, disabled, loading, error.',
    side: 'bottom',
  },
  {
    id: 'comp-copy',
    targetAttr: 'components-copy-button',
    title: 'Token-aware code',
    body: 'Copy outputs Tailwind using your current tokens — not hardcoded values. Ready to paste into any component.',
    side: 'left',
    cta: { label: 'Got it', action: 'dismiss-tour' },
  },
],

theming: [
  {
    id: 'theme-presets',
    targetAttr: 'theming-presets-panel',
    title: 'Presets layer on top',
    body: 'Presets apply aesthetic themes on top of your token values — they don\'t replace them.',
    side: 'right',
  },
  {
    id: 'theme-preview',
    targetAttr: 'theming-preview-pane',
    title: 'Live preview',
    body: 'This panel renders your components in real time as you adjust. What you see here is what agents build.',
    side: 'left',
    cta: { label: 'Got it', action: 'dismiss-tour' },
  },
],

preview: [
  {
    id: 'preview-devices',
    targetAttr: 'preview-device-switcher',
    title: 'All breakpoints',
    body: 'Switch between mobile (375px), tablet (768px), and desktop (1440px). Fluid tokens adapt to each.',
    side: 'bottom',
  },
  {
    id: 'preview-export',
    targetAttr: 'preview-export-btn',
    title: 'Download for handoff',
    body: 'Exports a ZIP with tokens.css, DESIGN.md, and wireframes_locked.json — everything agents need.',
    side: 'left',
    cta: { label: 'Done', action: 'dismiss-tour' },
  },
],
```

---

## Task 3 — Shell Layer

### 3A — `SectionProgressBar`

**Lead agent:** `lead-frontend-architect`  
**Skills:** `impeccable` (layout reference)  
**References:** `impeccable/reference/product.md`, `DESIGN.md`

`visitedSections` is already tracked in hub.store. This surfaces it.

**Visual spec:**
- Height: `2px` strip, full width, sits flush below the TopBar border
- Segments: one per tab, same pixel width as the tab button above it (match via `getBoundingClientRect` or matching flex width)
- Active section: `background: var(--ds-color-secondary)` (indigo `#4F46E5` from DESIGN.md)
- Visited, not active: `background: rgba(255,255,255,0.18)`
- Never visited: `background: rgba(255,255,255,0.05)`
- Transition: `background-color 200ms ease-out` — the only animation, composited
- Hidden entirely when `session.hintsEnabled === false`
- Accessibility: `role="progressbar"` · `aria-label="Section progress"` · `aria-valuenow={visitedSections.length}` · `aria-valuemax={6}`

**No height transition. No slide-in. This is status, not spectacle.**

---

### 3B — `PostOnboardingBanner`

**Lead agent:** `frontend-lead`  
**Skills:** `impeccable` (onboard reference), `emil-design-eng`  
**References:** `impeccable/reference/onboard.md`, `impeccable/reference/delight.md`

Fires once after `onboardingComplete()`. Auto-dismisses after 6000ms. Never shown again (persisted via `session.dismissSpotlight('post-onboarding-banner')`).

**Visual spec:**
- Height: `h-8` (32px), sits below the progress bar, above section panels
- Background: `rgba(var(--ds-color-secondary-rgb), 0.08)` — a barely-there tint
- Border-bottom: `1px solid rgba(var(--ds-color-secondary-rgb), 0.2)`
- Left icon: `✅` Check icon, `text-emerald-400`, 14px
- Copy: `text-[11px] text-app-subtle`
- Dismiss ×: right-aligned `IconButton`
- Enter: `translateY(-100%) → translateY(0)`, `160ms ease-out` (from off-screen above)
- Exit: `opacity: 1 → 0`, `100ms ease-out` — no position change on exit
- Reduced motion: skip enter animation, fade only

**Copy:**
```
✅  Setup complete — start in Architecture, then Wireframes, then lock to preview.    ×
```

**hub.store addition required:**
```ts
postOnboardingBannerVisible: boolean
setPostOnboardingBannerVisible(v: boolean): void
// Set true inside onboardingComplete(), auto-set false after 6000ms via setTimeout
```

---

### 3C — `HelpMenu`

**Lead agent:** `lead-frontend-architect`  
**Skills:** `impeccable` (clarify reference)  
**References:** `impeccable/reference/clarify.md`

`?` `IconButton` in TopBar right side, uses existing `ui/dropdown-menu.tsx`.

**Menu items (exact copy):**
```
↺  Restart setup
⌨  Keyboard shortcuts
💡 Replay this section's tour
○  Hide all hints          (toggles to "Show hints" when hidden)
```

**Actions:**
- **Restart setup:** `hub.onboardingReset()` + `session.resetAllSpotlights()`
- **Keyboard shortcuts:** opens existing `KeyboardShortcutsDialog`
- **Replay section tour:** `session.dismissedSpotlights = dismissedSpotlights.filter(id => !SECTION_SPOT_IDS[hub.section].includes(id))` — triggers re-render of active spotlight
- **Hide/show hints:** `session.setHintsEnabled(!session.hintsEnabled)`

---

## Task 4 — Section Instrumentation

**Lead agent:** `wireframe-renderer-agent` + `page-block-composer`  
**Skills:** `impeccable` (onboard reference)  
**References:** `impeccable/reference/onboard.md`

Add `data-spotlight="<value>"` attributes to target elements in each section. Zero logic changes — purely additive attributes.

| File | Attribute to add |
|---|---|
| `arch/ArchLeftPanel.tsx` | `data-spotlight="arch-left-panel"` on root panel div |
| `arch/SitemapCanvas.tsx` | `data-spotlight="arch-sitemap-canvas"` on canvas root |
| `arch/ArchProfilesPicker.tsx` | `data-spotlight="arch-profiles-picker"` on container |
| `arch/ArchRightRail.tsx` | `data-spotlight="arch-right-rail"` on root aside |
| `wireframes/WireframePageTree.tsx` | `data-spotlight="wireframes-page-tree"` on root |
| `wireframes/PaletteCategorySection.tsx` | `data-spotlight="wireframes-block-palette"` on first category |
| `wireframes/WireframesSection.tsx` | `data-spotlight="wireframes-lock-btn"` on lock button |
| `design/TokenNav.tsx` | `data-spotlight="design-token-nav"` on nav root |
| `design/editors/ColorEditor.tsx` | `data-spotlight="design-color-editor"` on editor root |
| `design/ExportPanel.tsx` | `data-spotlight="design-export-panel"` on panel root |
| `comp/ComponentsCategoryTabs.tsx` | `data-spotlight="components-category-tabs"` on tab bar |
| `comp/ComponentsSection.tsx` | `data-spotlight="components-copy-button"` on first copy button |
| `theming/ThemingSection.tsx` | `data-spotlight="theming-presets-panel"` on presets panel |
| `theming/ThemingPreview.tsx` | `data-spotlight="theming-preview-pane"` on preview root |
| `preview/PreviewSection.tsx` | `data-spotlight="preview-device-switcher"` + `data-spotlight="preview-export-btn"` |

Wire `useSpotlightTour` into `DesignHub.tsx` — mount once per section render, pass `activeSpotId` down.

---

## Task 5 — Empty State Guidance

**Lead agent:** `lead-uiux-designer`  
**Support:** `page-block-composer`  
**Skills:** `impeccable` (onboard + clarify references)  
**References:** `impeccable/reference/onboard.md`, `impeccable/reference/clarify.md`, `design-intelligence-index` (empty states row → `impeccable reference/onboard.md`)

**Design principles** (impeccable onboard.md — "Empty states are onboarding opportunities"):
- No repeated headings — the icon IS the heading
- One CTA maximum per empty state
- Copy tells the user what to DO, not what's missing
- No large illustrations — product register, not brand register

**Visual pattern** (consistent across all empty states):
- Centered vertically + horizontally in the available space
- Icon: 32px, `text-app-muted`, lucide icon appropriate to context
- Heading: `text-[13px] font-semibold text-app-text`
- Body: `text-[11.5px] text-app-muted leading-relaxed`, max 2 lines
- CTA: `h-7 px-4 rounded-full text-[11px] font-bold` with secondary button style (not primary)
- Max width: `280px` — don't stretch across the full canvas

---

### 5A — Architecture: empty canvas

**Condition:** `Object.keys(hub.arch.pages).length === 0`  
**Location:** Center of `SitemapCanvas.tsx`

```
[Network icon 32px]

No sitemap yet

Pick a template on the left to populate pages,
or add your first page with +.

[ Browse Templates ]
```

CTA calls `setSection('architecture')` and focuses the profiles picker.

---

### 5B — Wireframes: no page selected

**Condition:** Section active, no page selected in tree  
**Location:** Canvas center

```
← Select a page from the panel to place wireframe blocks.
   No pages yet? Build your sitemap in Architecture first.
```

No icon, no card, no CTA. Two lines of secondary text only. Directional, not remedial.

---

### 5C — Wireframes: page selected, zero blocks

**Condition:** Page selected, `sections.length === 0` for that page session  
**Location:** Drop zone center

```
[LayoutGrid icon 32px]

Empty page

Drag a block from the palette on the left.
Start with Nav_TopBar at the top of every page.
```

No CTA — the action is drag, not a button click.

---

### 5D — Preview: wireframes not locked

**Condition:** `hub.lockedAt === null`  
**Location:** Center of `PreviewSection.tsx`

```
[Eye icon 32px]

Nothing to preview yet

Complete your wireframes and lock them
to render a live preview here.

[ Go to Wireframes ]
```

CTA: `hub.setSection('wireframes')`.

---

### 5E — Design: first-visit hint banner

**Condition:** `design` in `session.sectionsEntered` AND `'design-first-edit'` not in `session.dismissedSpotlights`  
**Location:** Slim banner below `TokenNav.tsx`, above the active editor  
**Dismiss:** Automatically on first token value change — call `session.dismissSpotlight('design-first-edit')` from any token editor's `onChange`

```
ℹ  Token values came from your design profile. Edit any value to customise — changes save automatically.
```

Style: `text-[10.5px] text-app-muted bg-app-inset border border-app-border px-3 py-1.5 rounded-md`. No icon needed.

---

## Task 6 — Onboarding Modal Polish

**Lead agent:** `lead-uiux-designer`  
**Support:** `design-systems-token-architect`  
**Skills:** `impeccable` (onboard + delight references), `emil-design-eng`  
**References:** `impeccable/reference/onboard.md`, `impeccable/reference/delight.md`, `DESIGN.md`

**Ground rule (impeccable onboard.md — "Time to Value"):** These changes make setup faster and clearer. No new steps. No added friction. The `590px` fixed height is non-negotiable — no layout shift.

---

### Change A — Step 0 (Welcome): workflow order strip

**Location:** Between the feature grid and the action buttons row  
**Type:** Static informational strip — no interaction

```
Recommended flow:
Architecture  →  Wireframes  →  Design System  →  Preview  →  Export
```

Style: `text-[9.5px] text-white/30 text-center`. Section labels separated by `→` in `text-white/15`. Fits within existing `my-2` margin on the feature grid (reduce to `my-1` + strip + `my-1`).

**No motion, no hover states** — this is metadata, not a feature.

---

### Change B — Step 1 (Architecture): page count quality signal

**Location:** Below the "X of Y selected" counter in `ArchSitemapPagesPanel`  
**Type:** Conditional text — purely reactive to `selectedPages.length`

```ts
const hint =
  selectedPages.length === 0
    ? { text: 'Select at least one page to continue.', color: 'text-red-400/80' }
    : selectedPages.length <= 3
    ? { text: 'Good start — you can add more pages later.', color: 'text-white/35' }
    : selectedPages.length <= 8
    ? { text: 'Solid foundation.', color: 'text-emerald-400/60' }
    : { text: 'Large project — consider splitting into phases after setup.', color: 'text-amber-400/60' }
```

One line, `text-[9.5px]`, `px-0.5`. No icon. The Continue button already disables at 0 selected — this copy explains why.

---

### Change C — Step 2 (Design): richer token preview

**Location:** Expand the right panel in `DesignStep` — below the existing "Interactive Card Demo"  
**Type:** Two new rows, using only values already present in `DesignTokens` type  
**Goal** (impeccable onboard.md — "Show, Don't Tell"): users see 3 of the most-used component types rendered in the selected profile before committing

**Row 2 — Badge strip** (status color preview):
```tsx
<div className="flex items-center gap-2 flex-wrap">
  {[
    { label: 'Active',   bg: tokens.colors.brand['50'],    color: tokens.colors.brand['600']   },
    { label: 'Draft',    bg: tokens.colors.neutral['100'], color: tokens.colors.text.secondary },
    { label: 'Archived', bg: 'rgba(255,255,255,0.06)',     color: tokens.colors.text.muted     },
  ].map(({ label, bg, color }) => (
    <span key={label}
      className="text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wide"
      style={{ background: bg, color, borderRadius: tokens.radius.full }}>
      {label}
    </span>
  ))}
</div>
```

**Row 3 — Input field** (radius + border preview):
```tsx
<input
  readOnly value="user@example.com"
  className="w-full text-[10px] px-2.5 py-1.5 outline-none transition-none"
  style={{
    background:   tokens.colors.surface.input ?? tokens.colors.surface.bg,
    border:       `1px solid ${tokens.colors.surface.border}`,
    borderRadius: tokens.radius.sm,
    color:        tokens.colors.text.primary,
  }}
/>
```

No `transition` on these elements — they're a preview, not interactive UI. Adding motion here would violate "do not animate static previews."

Add a section label above both rows: `<p className="text-[8.5px] font-bold text-white/30 uppercase tracking-wider">Additional components</p>`

---

### Change D — Step 2 (Design): staggered profile list entry

**Reference:** `emil-design-eng` — stagger animations, 30–80ms delays  
**Condition:** Apply stagger when the design profile list first renders on step mount

Each profile button: `opacity: 0 → 1` + `translateY(6px) → 0`, `200ms ease-out`, delay `index * 40ms`.

Cap at 8 items visible — beyond that, no stagger (list items below fold don't need it).

```css
.design-profile-item {
  animation: profileFadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1) both;
}
@keyframes profileFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Reduced motion: skip the translate, keep the `opacity` fade at 100ms.

**Why here:** Frequency = once per session (step 2 only appears during setup) → "rare/first-time → Can add delight" per emil's framework. This is the right moment for stagger.

---

## Motion Constraint Summary

All motion in this plan must pass the emil-design-eng animation decision framework:

| Element | Frequency | Decision | Duration | Easing |
|---|---|---|---|---|
| SpotlightTooltip enter | First-time per section | ✅ Appropriate | 160ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| SpotlightTooltip exit | Same frequency | ✅ Appropriate | 100ms | `ease-out` — asymmetric, faster |
| Subsequent spotlight open | Tens/day potentially | Skip animation | 0ms | — |
| Target pulse ring | First-time per section | ✅ Appropriate | infinite at 2s interval | `ease-in-out`, composited only |
| PostOnboardingBanner enter | Once ever | ✅ Appropriate | 160ms | `cubic-bezier(0.23, 1, 0.32, 1)` |
| PostOnboardingBanner exit | Once ever | ✅ Appropriate | 100ms | `ease-out` |
| SectionProgressBar color | Dozens/session | ✅ State indication | 200ms | `ease-out` |
| Design profile stagger | Once per setup | ✅ Rare/first-time | 200ms + 40ms stagger | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Empty states | Static | ❌ No animation | — | — |
| Token preview rows (Step 2) | Static preview | ❌ No animation | — | — |
| Help menu open | Occasional | ✅ Standard | 150ms | `ease-out` (existing dropdown) |

**Never animate:** `height`, `width`, `padding`, `margin`, `top`, `left` — layout-triggering properties (impeccable motion law + emil performance rules).

---

## Acceptance Criteria

### Task 0 — Session Store
- [ ] `dismissedSpotlights` persists across browser refreshes
- [ ] `resetAllSpotlights()` fully clears state — verified by "Restart setup" test
- [ ] No circular import with `hub.store.ts`
- [ ] TypeScript strict mode — zero `any`

### Task 1 — SpotlightTooltip
- [ ] Appears after 700ms on first section entry, never on repeat visits (after dismiss)
- [ ] Enter: `scale(0.95)+opacity:0 → scale(1)+opacity:1`, 160ms
- [ ] Exit: `opacity:0` only, 100ms
- [ ] Subsequent spotlight opens skip animation entirely (0ms)
- [ ] Pulse ring: only `opacity` + `scale` — no layout properties
- [ ] Pulse ring absent when `useReducedMotion()` returns true
- [ ] RTL: `left/right` sides inverted correctly via `useRTL()`
- [ ] Escape dismisses, focus returns to trigger element
- [ ] z-index 1250 — verified against existing modal stack

### Task 3 — Shell
- [ ] SectionProgressBar: correct segment color per visited/active/unvisited state
- [ ] SectionProgressBar: hidden when `session.hintsEnabled === false`
- [ ] PostOnboardingBanner: visible 6000ms then fades, never shown again after dismiss
- [ ] HelpMenu: "Restart setup" clears both hub + session state
- [ ] HelpMenu: "Replay" only clears current section's spots, not other sections

### Task 5 — Empty States
- [ ] Architecture empty state: renders when `Object.keys(arch.pages).length === 0`
- [ ] Wireframes empty page: renders when page selected + zero blocks
- [ ] Preview empty state: renders when `hub.lockedAt === null`
- [ ] Design hint banner: dismisses on first token value change, never re-shows
- [ ] All CTAs route to correct section via `hub.setSection()`
- [ ] No animation on any empty state

### Task 6 — Onboarding
- [ ] Step 0 workflow strip visible, fits in `590px` without layout shift
- [ ] Step 1 count hint changes reactively across all 4 ranges
- [ ] Step 2 badge strip + input field render for all 13 design profiles (no undefined tokens)
- [ ] Step 2 profile list stagger: plays on mount, skips on reduced motion (opacity-only fallback)
- [ ] Fixed `590px` card height maintained — measure in DevTools

---

## Build Order

```
Task 0  session.store.ts                  ← BLOCKER. Nothing else starts until this typechecks.

Task 1  SpotlightTooltip.tsx              ← Primitive. Build and test in isolation.
Task 2  useSpotlightTour.ts               ← Hook. Unit test with mock session store.
        spotlight-tours.config.ts         ← Config. Copy-edit pass before any code touches it.

Task 3A SectionProgressBar.tsx
Task 3B PostOnboardingBanner.tsx          ← + hub.store postOnboardingBannerVisible
Task 3C HelpMenu.tsx
        Edit TopBar.tsx + DesignHub.tsx   ← Mount all three shell additions

Task 4  data-spotlight attrs              ← Arch first. Wire tour. Full test.
        Remaining 5 sections             ← Wire tours. Verify all dismiss/persist.

Task 5  Empty states                      ← All 5, in order listed above

Task 6A–D  Onboarding changes             ← Each change is independent. Ship separately.

QA pass:
  pnpm --filter design-hub typecheck
  pnpm --filter design-hub test
  pnpm run check:gate-5-a11y
  Manual: fresh session → full flow → all tours dismissed → restart → replays
  Manual: RTL mode active → all tooltips invert
  Manual: reduced motion OS setting → no translate animations anywhere
```

---

## What NOT to Build

- **No tour library** — Shepherd.js, Driver.js, Intro.js introduce their own style system. Extend `Tooltip.tsx`.
- **No blocking overlays** — every spotlight is skippable, nothing gates the UI
- **No analytics on dismissals** — out of scope
- **No auto-replay of tours** — only via explicit "Replay" in Help menu
- **No tooltip on every element** — 3–4 highest-value entry points per section only. Density kills the signal.
- **No changes to `ExportSuccessModal.tsx`** — already has correct NEZAM next-step commands
- **No gradient text on spotlight bubbles** — impeccable absolute ban
- **No side-stripe borders on empty state cards** — impeccable absolute ban

---

*Follows: `NEZAM_IMPROVEMENT_PLAN.md`*  
*Skill stack: `design-intelligence-index` · `impeccable` · `emil-design-eng` · `design-taste-frontend` (not used — product register)*  
*Start: Task 0. Everything depends on the session store.*
