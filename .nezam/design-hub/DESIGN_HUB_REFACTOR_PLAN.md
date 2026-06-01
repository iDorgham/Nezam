# Design Hub Refactor Plan

> Generated: 2026-06-01  
> Scope: `.nezam/design-hub/`  
> Version: v7  
> Total phases: 14

---

## Context

Full codebase audit revealed three categories of work:
1. **Dead weight** — files/directories that are orphaned, archived, or superseded
2. **Structural fixes** — rendering patterns, store integrity, init logic
3. **Missing features** — capabilities that the system already has infrastructure for but no UI surface

Phases are ordered by dependency and risk. Phases 1–2 are destructive (removal); do them on a branch with a clean diff. Phases 3–8 are refactors with no new surface area. Phases 9–14 are additive.

---

## Phase 1 — Dead Code Removal

**Tasks:** Remove `/components/` (root) + `/_archive/`

### Why it's safe

`tsconfig.json` maps `@/*` → `./src/*`. The only apparent cross-import is:

```ts
// app/page.tsx
import { DesignHub } from '@/components/shell/DesignHub'
```

This resolves to `src/components/shell/DesignHub.tsx` — **not** the root `/components/` tree. The root `/components/` directory is unreachable by the TypeScript module resolver.

`/_archive/` is explicitly excluded in `tsconfig.json` (`"exclude": ["_archive"]`), confirming it's already treated as dead.

### Steps

```bash
# Verify zero active imports from root /components before deleting
grep -r "from '../../components/\|from '../components/\|from './components/" \
  .nezam/design-hub/app .nezam/design-hub/src --include="*.tsx" --include="*.ts"

# Should return 0 results. Then:
rm -rf .nezam/design-hub/components
rm -rf .nezam/design-hub/_archive

# Run type-check to confirm clean
pnpm type-check
pnpm test
```

### What gets removed

| Directory | Contents | Reason |
|---|---|---|
| `/components/canvas/` | CanvasNode, BezierWire, CanvasWorkspace, WireInspector, FloatingToolbar, HardlockOverlay, VisionGateBadge, GenerateButton | Superseded by `/src/components/arch/SitemapCanvas` |
| `/components/assets/` | AssetBrowser, AssetCard, DropZone, UploadProgress | No active import path |
| `/components/inspector/` | PropertyInspector, A11yTab, BoxModelFields, HardlockError, TypographyFields | No active import path |
| `/components/motion/` | MotionStudio, Timeline, TrackList, KeyframeDiamond, EasingSelector | Superseded by `/src/components/design/editors/MotionEditor` |
| `/components/tokens/` | TokenEditor, ColorEditor, ProfileCard, SyncStatusPill, BorderRadiusEditor, TypographyScaleGrid | Superseded by `/src/components/design/editors/*` |
| `/components/wireframe/` | WireframeEditor, BlockLibrary, BlockRenderer, PropsPanel | Superseded by `/src/components/wireframes/*` |
| `/components/layout/` | AppShell, TopNav, LeftDock, RightDock, BottomDock | Superseded by `/src/components/shell/` |
| `/components/ui/` | Badge, Button, Chip, Input, etc. (PascalCase) | Superseded by `/src/components/ui/` (shadcn lowercase) |
| `/_archive/` | v1 archive | Git history is the archive |

---

## Phase 2 — Canvas API Decision

**Files:** `/app/api/canvas/route.ts`, `/app/api/canvas/node/route.ts`

The root `/components/canvas/` consumed these API routes. With Phase 1 complete, the routes have zero callers. The current hub has no canvas section — `HubSection` is `architecture | wireframes | design | components | theming | preview`.

### Decision required (pick one)

**Option A — Delete (recommended for now)**  
Remove the API routes. If a visual node canvas is desired later, design it purpose-built against the current architecture rather than reusing abandoned v1 infrastructure.

```bash
rm -rf .nezam/design-hub/app/api/canvas
```

**Option B — Promote to a Hub section**  
Add `'canvas'` to `HubSection` type, create `/src/components/canvas/` from scratch using the current design system, wire to the API. This is a significant feature scope — defer to its own project.

> **Recommendation:** Delete now, revisit as a dedicated project. The node-wire canvas concept has architectural value (visual service wiring) but needs a clean-room design.

---

## Phase 3 — Fix Section Mount/Unmount

**File:** `src/components/shell/DesignHub.tsx`

### Problem

Current pattern destroys and recreates section DOM on every tab switch:

```tsx
{section === 'architecture' && <ArchSection />}
{section === 'wireframes' && <WireframesSection />}
// etc.
```

State loss: scroll position, open accordions, search queries, expanded tree nodes — all reset on switch.

### Fix — CSS hidden pattern

```tsx
// DesignHub.tsx — replace conditional rendering with visibility toggle
const sections: HubSection[] = ['architecture', 'wireframes', 'design', 'components', 'theming', 'preview']

return (
  <div className="flex h-screen w-full flex-col overflow-hidden bg-app-bg text-app-text">
    <Onboarding />
    <ExportSuccessModal />
    <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    <TopBar />
    <div className="flex min-h-0 min-w-0 w-full flex-1">
      {sections.map((id) => (
        <div
          key={id}
          id={`topbar-panel-${id}`}
          role="tabpanel"
          aria-labelledby={`topbar-tab-${id}`}
          className="flex min-h-0 min-w-0 w-full flex-1"
          hidden={section !== id}
        >
          {id === 'architecture' && <ArchSection />}
          {id === 'wireframes' && <WireframesSection />}
          {id === 'design' && <DesignSection />}
          {id === 'components' && <ComponentsSection />}
          {id === 'theming' && <ThemingSection />}
          {id === 'preview' && <PreviewSection />}
        </div>
      ))}
    </div>
  </div>
)
```

The `hidden` HTML attribute applies `display: none` natively. React keeps the component tree mounted and all hooks alive. The `dynamic()` imports still lazy-load on first render of each section — subsequent switches are instant with state preserved.

> **Note:** Confirm `display: none` doesn't break any canvas/SVG measurement hooks in `SitemapCanvas` or `WireframesSection`. If it does, use `visibility: hidden; position: absolute; pointer-events: none` instead.

---

## Phase 4 — Extract `useInitHub` Hook

**File:** `src/components/shell/DesignHub.tsx` → `src/hooks/useInitHub.ts`

### Problem

The `importProjectContextIfNeeded` effect in `DesignHub.tsx` is doing async API fetch + state mutation inside the render tree's top-level component. It has no error UI, no loading state, and mixes initialization with rendering.

### Fix

```ts
// src/hooks/useInitHub.ts
import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import type { ArchPageType, NavSlot } from '@/types/arch'

export function useInitHub() {
  const archPages = useHub((s) => s.arch.pages)
  const archHydratePages = useHub((s) => s.archHydratePages)

  // Rehydrate persisted state on mount
  useEffect(() => {
    useHub.persist.rehydrate()
  }, [])

  // Import project_context.json if hub has no existing pages
  useEffect(() => {
    async function importProjectContextIfNeeded() {
      const hasHydrated =
        typeof (useHub.persist as any).hasHydrated === 'function'
          ? (useHub.persist as any).hasHydrated()
          : true
      if (!hasHydrated) return
      if (Object.keys(archPages).length > 0) return

      const res = await fetch('/api/context').catch(() => null)
      if (!res?.ok) return

      const data = await res.json().catch(() => ({}))
      if (!data?.exists || !Array.isArray(data?.data?.pages) || data.data.pages.length === 0) return

      // ... mapping logic (identical to current, extracted verbatim)
      archHydratePages(mapped)
    }
    void importProjectContextIfNeeded()
  }, [archPages, archHydratePages])
}
```

`DesignHub.tsx` becomes:
```tsx
export function DesignHub() {
  useInitHub()  // ← single line
  // ... rest of render
}
```

---

## Phase 5 — Declarative Theme Bridge

**File:** `src/store/hub.store.ts` — `themeApplyToPreview`

### Problem

8 manual `if (vars.xxx)` checks that silently fail when shadcn variable names change:

```ts
if (vars.background) colors.surface.bg = vars.background
if (vars.foreground) colors.text.primary = vars.foreground
if (vars.primary) colors.brand = generateScaleFromHex(vars.primary)
// ... etc.
```

### Fix — Declarative mapping

```ts
// src/lib/theme-bridge-map.ts
import type { DesignTokens } from '@/types/design'

type VarApplicator = (tokens: DesignTokens, value: string) => void

export const THEME_VAR_MAP: Record<string, VarApplicator> = {
  'background':         (t, v) => { t.colors.surface.bg = v },
  'foreground':         (t, v) => { t.colors.text.primary = v },
  'primary':            (t, v) => { t.colors.brand = generateScaleFromHex(v) },
  'accent':             (t, v) => { t.colors.accent = generateScaleFromHex(v) },
  'card':               (t, v) => { t.colors.surface.panel = v },
  'border':             (t, v) => { t.colors.surface.border = v },
  'muted':              (t, v) => { t.colors.text.muted = v },
  'accent-foreground':  (t, v) => { t.colors.text.secondary = v },
  // Adding a new mapping = adding one line here
}
```

Store usage becomes:
```ts
themeApplyToPreview: (override) =>
  set((state) => {
    state.theme.previewOverride = override
    const vars = override[override.mode]
    if (vars) {
      state.design.tokens.colors.mode = override.mode
      Object.entries(vars).forEach(([key, value]) => {
        THEME_VAR_MAP[key]?.(state.design.tokens, value)
      })
    }
  }),
```

---

## Phase 6 — Store Integrity Fixes

**File:** `src/store/hub.store.ts`

### 6a — Clamp sidebarWidth in store

```ts
const SIDEBAR_MIN = 160
const SIDEBAR_MAX = 480

setSidebarWidth: (width) =>
  set((state) => {
    state.sidebarWidth = Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, width))
  }),
```

### 6b — Persist comp grid/scale preferences

In `partialize`:
```ts
partialize: (s) => ({
  // ... existing
  comp: {
    gridColumns: s.comp.gridColumns,
    cardScale: s.comp.cardScale,
    // selectedGroup and query intentionally not persisted (session-only)
  },
})
```

Add to `migrate` (v6):
```ts
if (version < 6 && !persisted.comp) {
  persisted.comp = {
    gridColumns: COMP_GRID_COLUMNS_DEFAULT,
    cardScale: COMP_CARD_SCALE_DEFAULT,
  }
}
```

Bump store version to 6, bump `HUB_VERSION` to `v8`.

---

## Phase 7 — Visited vs Completed Progress

**File:** `src/store/hub.store.ts` + `src/components/shell/TopBar.tsx`

### Problem

`visitedSections` only tracks that a section was opened — not that meaningful work was done. The progress bar is decorative noise.

### Fix

Add `completedSections: HubSection[]` with explicit completion criteria:

```ts
// In store
completedSections: [] as HubSection[],

markSectionComplete: (section: HubSection) =>
  set((state) => {
    if (!state.completedSections.includes(section)) {
      state.completedSections.push(section)
    }
  }),
```

Completion triggers (call `markSectionComplete` from existing actions):

| Section | Trigger |
|---|---|
| `architecture` | `archAddNode` or `archApplyProfile` called (has pages) |
| `wireframes` | `setLockedAt` called (wireframes locked) |
| `design` | `designApplyProfile` called |
| `components` | User visits section (intent = browse, not produce) |
| `theming` | `themeSaveProfile` called |
| `preview` | `previewSetDevice` called (user interacted) |

TopBar reads `completedSections.length / SECTION_ORDER.length` for the progress ratio. `visitedSections` remains for the visited-tab underline styling.

---

## Phase 8 — Lock State in TopBar

**File:** `src/components/shell/TopBar.tsx`

```tsx
const lockedAt = useHub((s) => s.lockedAt)

// In the TopBar header, next to version badge:
{lockedAt ? (
  <button
    onClick={() => setExportModalOpen(true)}
    title={`Locked ${new Date(lockedAt).toLocaleDateString()}`}
    className="flex items-center gap-1 text-[9.5px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-1.5 py-0.5 rounded-full hover:bg-emerald-900/40 transition-colors"
  >
    <Lock className="h-2.5 w-2.5" />
    Locked
  </button>
) : (
  <span className="text-[9.5px] text-app-subtle">Unlocked</span>
)}
```

This gives developers and agents a persistent signal: green lock = design is frozen and safe to build from.

---

## Phase 9 — RTL Toggle in Design + Components

**File:** `src/hooks/useRTL.ts` already exists. Wire it to two more sections.

### Design section

In `src/components/design/DesignSection.tsx` (or `TokensView.tsx`), add to the toolbar:

```tsx
const { rtl, toggleRtl } = useRTL()

<button onClick={toggleRtl} title="Toggle RTL preview">
  <Languages className="h-3.5 w-3.5" />
  {rtl ? 'RTL' : 'LTR'}
</button>
```

Apply to the component preview strip:
```tsx
<div dir={rtl ? 'rtl' : 'ltr'} className="...">
  <ComponentStrip />
</div>
```

### Components section

In `src/components/comp/ComponentsSection.tsx`, wrap the card grid:
```tsx
<div dir={rtl ? 'rtl' : 'ltr'} className="grid ...">
  {filteredComponents.map(c => <ComponentCard key={c.id} {...c} />)}
</div>
```

Add the toggle button to `ComponentsGridControls.tsx`.

> RTL state should be **global** (already in `preview.rtl` in the store). Promote it to a top-level store field so all sections share it, or add a dedicated `globalRtl` field.

---

## Phase 10 — Global Token Search

**File:** `src/components/design/TokenNav.tsx` + new `src/lib/design/token-flattener.ts`

### Flattener

```ts
// src/lib/design/token-flattener.ts
import type { DesignTokens, TokenCategory } from '@/types/design'

export interface FlatToken {
  key: string        // e.g. "colors.brand.500"
  value: string
  category: TokenCategory
  label: string      // human display
}

export function flattenTokens(tokens: DesignTokens): FlatToken[] {
  const results: FlatToken[] = []
  
  function walk(obj: unknown, path: string[], category: TokenCategory) {
    if (typeof obj === 'string' || typeof obj === 'number') {
      results.push({ key: path.join('.'), value: String(obj), category, label: path.at(-1) ?? '' })
      return
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const [k, v] of Object.entries(obj)) {
        walk(v, [...path, k], category)
      }
    }
  }

  for (const [cat, subtree] of Object.entries(tokens)) {
    walk(subtree, [cat], cat as TokenCategory)
  }
  return results
}
```

### TokenNav search UI

```tsx
const [search, setSearch] = useState('')
const allTokens = useMemo(() => flattenTokens(tokens), [tokens])
const results = useMemo(() =>
  search.trim().length > 1
    ? allTokens.filter(t => t.key.includes(search) || t.value.includes(search))
    : [],
  [search, allTokens]
)

// Render: if results.length > 0, show flat list with category breadcrumb
// Otherwise, render normal category tabs
```

---

## Phase 11 — Token Diff View

**Store changes:** Add `tokenDiff: TokenDiff | null` as non-persisted state.

```ts
interface TokenDiff {
  changed: Array<{ key: string; before: string; after: string }>
  added: string[]
  removed: string[]
  profileId: string
}
```

**In `designApplyProfile`:**

```ts
designApplyProfile: (profileId) =>
  set((state) => {
    const before = flattenTokens(state.design.tokens)
    const profile = DESIGN_PROFILES_MAP[profileId]
    if (!profile) return
    
    // Apply profile (existing logic)
    state.design.tokens = profile.tokens
    state.design.activeProfileId = profileId
    // ... theme bridge
    
    const after = flattenTokens(profile.tokens)
    const beforeMap = Object.fromEntries(before.map(t => [t.key, t.value]))
    const afterMap = Object.fromEntries(after.map(t => [t.key, t.value]))
    
    state.tokenDiff = {
      profileId,
      changed: after.filter(t => beforeMap[t.key] && beforeMap[t.key] !== t.value)
                    .map(t => ({ key: t.key, before: beforeMap[t.key], after: t.value })),
      added: after.filter(t => !beforeMap[t.key]).map(t => t.key),
      removed: before.filter(t => !afterMap[t.key]).map(t => t.key),
    }
  }),

clearTokenDiff: () => set((state) => { state.tokenDiff = null }),
```

**UI:** `TokenDiffModal` — triggered automatically when `tokenDiff !== null`. Shows:
- Profile name applied
- N tokens changed (collapsible list with color swatches for color tokens)
- Added/removed count
- "Dismiss" button → `clearTokenDiff()`

---

## Phase 12 — Profile Comparison View

**Location:** New modal accessible from the Profiles tab in Design section or Theming section.

```tsx
// ProfileComparatorModal.tsx
// Props: profileA: DesignProfileId, profileB: DesignProfileId

const tokensA = flattenTokens(DESIGN_PROFILES_MAP[profileA].tokens)
const tokensB = flattenTokens(DESIGN_PROFILES_MAP[profileB].tokens)

// Build diff table — only rows where values differ
const diffRows = tokensA
  .map(t => ({
    key: t.key,
    category: t.category,
    a: t.value,
    b: tokensB.find(b => b.key === t.key)?.value ?? '—'
  }))
  .filter(r => r.a !== r.b)
```

Show filterable by category. Color token rows show color swatches inline.

---

## Phase 13 — Export Formats UI Surface

**Problem:** `export-formats.ts` defines 12 formats with full `generateExportContent()` but the export UI is buried in the lock flow.

### Solution: Standalone Export Panel

Add a `<Download />` icon button to the TopBar (between theme toggle and lock). Opens `ExportPanel` modal.

```tsx
// ExportPanel.tsx (standalone, not the one in src/components/design)
// Shows 12 format cards in a 3-column grid:

const FORMAT_ICONS: Record<ExportFormatId, LucideIcon> = {
  css:          FileCode,
  json:         Braces,
  tailwind:     Wind,
  figma:        Figma,
  shadcn:       Layers,
  storybook:    BookOpen,
  nextjs:       Globe,
  mermaid:      GitBranch,
  sitemap_json: Map,
  rbac:         Shield,
  markdown_map: FileText,
  github_gate:  Github,
}

// Each card: icon, label, description, extension badge, Download button
// Download triggers generateExportContent(id, pages, tokens) → file download
```

The lock flow CTA becomes "Lock + Export" → opens this panel post-lock rather than a separate modal.

---

## Phase 14 — Figma Token Sync

**Prerequisites:** Figma MCP connected (available in plugin list).

**Scope:** Push-only sync (Design Hub → Figma Variables).

### Mapping

| Design Hub token | Figma construct |
|---|---|
| `colors.brand.*` | Color Variable collection "Brand" |
| `colors.accent.*` | Color Variable collection "Accent" |
| `colors.neutral.*` | Color Variable collection "Neutral" |
| `typography.sans` | Text style "Font / Sans" |
| `typography.scale.*` | Text style per scale step |
| `spacing.base` | Number variable "Spacing Base" |

### UI

Button in Design section toolbar: "Sync → Figma". Opens a confirmation dialog showing what will be pushed. On confirm, calls Figma MCP tools to create/update variables.

### Implementation note

Use Figma MCP's variable creation APIs. Map hex colors to Figma RGBA format. Handle rate limiting. Store last sync timestamp in hub store as `figmaSyncedAt: string | null`.

---

## Execution Order

```
Phase 1  ──┐
Phase 2  ──┤  (do on branch, verify with type-check + tests)
           │
Phase 3  ──┤  (safe, pure rendering refactor)
Phase 4  ──┤  (safe, extraction only)
Phase 5  ──┤  (safe, behavior-preserving refactor)
Phase 6  ──┘
           │
Phase 7  ──┤  (store additions)
Phase 8  ──┤  (UI additive)
Phase 9  ──┘
           │
Phase 10 ──┐  (new features, parallel-capable)
Phase 11 ──┤
Phase 12 ──┤
Phase 13 ──┤
Phase 14 ──┘  (last, requires external MCP dependency)
```

Phases 1–6 can be batched into one PR. Phases 7–9 in a second. Phases 10–14 each as their own PR.

---

## Files Changed Summary

| File | Phase | Change type |
|---|---|---|
| `/components/` (entire dir) | 1 | Delete |
| `/_archive/` (entire dir) | 1 | Delete |
| `/app/api/canvas/` | 2 | Delete |
| `src/components/shell/DesignHub.tsx` | 3, 4 | Refactor |
| `src/hooks/useInitHub.ts` | 4 | New |
| `src/lib/theme-bridge-map.ts` | 5 | New |
| `src/store/hub.store.ts` | 5, 6, 7, 11 | Refactor + additions |
| `src/components/shell/TopBar.tsx` | 7, 8 | Addition |
| `src/hooks/useRTL.ts` | 9 | Use in new locations |
| `src/components/design/TokenNav.tsx` | 10 | Addition |
| `src/lib/design/token-flattener.ts` | 10, 11, 12 | New (shared utility) |
| `src/components/design/TokenDiffModal.tsx` | 11 | New |
| `src/components/design/ProfileComparatorModal.tsx` | 12 | New |
| `src/components/shell/ExportPanel.tsx` | 13 | New (standalone) |
| `src/lib/figma-sync.ts` | 14 | New |
