# Wireframes — Nezam Design Server · Ultimate UI Suite

> **Phase:** 04-Design | **Source:** DESIGN_CHOICES.md · IA_CONTENT.md
> Full ASCII wireframes for every screen. Each map to their screen ID from IA_CONTENT.md.

---

## Screen 1: Token Studio Dashboard (/)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Token Studio Dashboard     ID: screen-token-studio                  │
│  Journey: Default entry point — design token editor                          │
│  Breakpoint: Desktop 1440px                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

DESKTOP LAYOUT — 3-column shell, full-dark, 48px top nav

┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP NAV (48px, bg: --ds-color-background)                                    │
│ [◈ Nezam]  [Dashboard ×] [Sitemap ×] [+ New Tab]    [EN/AR] [☀] [● CSS Sync]│
│            ↑ active tab: 2px cyan underline                    ↑ synced=cyan  │
├─────────────────────┬───────────────────────────────┬────────────────────────┤
│ LEFT DOCK (240px)   │ MAIN CONTENT (flex-1)          │ RIGHT DOCK (320px)     │
│                     │                                │                        │
│ ▼ Design Profiles   │ ┌──────────────────────────┐  │  [ No selection ]      │
│                     │ │ [Colors] [Shape] [Typo]   │  │                        │
│ ┌───────┐ ┌───────┐ │ │ [Playground]              │  │  ╔══════════════════╗  │
│ │ Sys   │ │ Sys   │ │ │ ── active tab: Colors ──  │  │  ║                  ║  │
│ │Obsidian││Agentic│ │ │                            │  │  ║  Select a        ║  │
│ └───────┘ └───────┘ │ │ PRIMARY        ACCENT      │  │  ║  component to    ║  │
│ ┌───────┐ ┌───────┐ │ │ [████ #06B6D4] [████ ...]  │  │  ║  inspect         ║  │
│ │Custom │ │  + ↓  │ │ │                            │  │  ║                  ║  │
│ │Sahel  │ │  Add  │ │ │ BACKGROUND     SURFACE     │  │  ╚══════════════════╝  │
│ └───────┘ └───────┘ │ │ [████ #09090B] [████ ...]  │  │                        │
│                     │ │                            │  │                        │
│ ▼ Color Palette     │ │ BORDER         TEXT        │  │                        │
│ [●][●][●][●][●][●]  │ │ [████ #27272A] [████ ...]  │  │                        │
│                     │ │                            │  │                        │
│ ── Quick Actions ── │ │ Contrast: 7.2:1 ✅ AA pass  │  │                        │
│ [💾 Save Preset  ]  │ │                            │  │                        │
│ [⟳ Sync to Disk  ]  │ │ ────────────────────────── │  │                        │
│ [↑ Export CSS    ]  │ │ LIVE PREVIEW               │  │                        │
│                     │ │                            │  │                        │
│                     │ │ ┌──────────────────────┐   │  │                        │
│                     │ │ │ Button Primary        │   │  │                        │
│                     │ │ │ Card / Chip / Dialog  │   │  │                        │
│                     │ │ └──────────────────────┘   │  │                        │
│                     │ └──────────────────────────┘  │  │                        │
├─────────────────────┴───────────────────────────────┴────────────────────────┤
│ BOTTOM DOCK — Motion Studio (collapsed, 40px handle)                          │
│ [▲ Motion Studio ─────────────────────────────────────────────────────────]  │
└──────────────────────────────────────────────────────────────────────────────┘

STATES:
  Default:  As above — presets loaded, color tab active
  Loading:  Dark skeleton bars in preset grid + editor area
  Empty:    Preset grid shows only System profiles; "Save Preset" CTA highlighted
  Error:    Toast top-right: "Sync failed — check file permissions" (orange)

COMPONENT INVENTORY:
  • TopNav (tabs: scrollable, active: cyan underline)
  • ProfileCard (variant: system/custom, grid: 2-col)
  • ColorPalette (swatch row, 6 items)
  • QuickActionsBar (icon + label buttons)
  • TabBar (Colors/Shape/Typography/Playground)
  • ColorInput (hex field + swatch square)
  • ContrastBadge (pass=cyan, fail=orange)
  • LivePreview (token-injected sandbox)
  • SyncStatusPill (dot + text + animation)
  • SidePanel placeholder (right dock empty state)

ACCESSIBILITY:
  Tab order:   TopNav tabs → LeftDock sections → MainContent tabs → ColorInputs
  Landmarks:   <header>, <nav aria-label="Left dock">, <main>, <aside aria-label="Inspector">
  Focus rings: 2px var(--ds-color-accent-cyan) offset 2px
```

---

## Screen 2: Infinity Canvas (Sitemap Graph Mode)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Infinity Canvas     ID: screen-sitemap-canvas                       │
│  Journey: Dashboard → mode toggle "Sitemap Graph"                            │
│  Breakpoint: Desktop 1440px                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

DESKTOP LAYOUT — full-viewport canvas, left dock, right inspector on wire select

┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP NAV (48px)                                                                │
│ [◈ Nezam]  [Sitemap ×]                              [EN/AR] [☀] [● Synced]  │
├─────────────────────┬───────────────────────────────────────────────────────┤
│ LEFT DOCK (240px)   │ CANVAS (flex-1, full-height)                           │
│                     │                                                         │
│ ▼ Pages (3)         │  · · · · · · · · · · · · · · · · · · · · · · · · · ·  │
│  / (Dashboard)      │                                                         │
│  /canvas →          │   ┌────────────────┐                                   │
│  /settings          │   │ / Dashboard    │──────────────────►┌────────────┐  │
│                     │   │ [page] [RTL✓] │   Electric Cyan   │ /canvas    │  │
│ ▼ Widgets           │   └────────────────┘   bezier wire    │ [page]     │  │
│  Data Table         │          │                             └────────────┘  │
│  Auth Form          │          │ data wire (blue)                             │
│  Navigation         │          ▼                                              │
│  Card Grid          │   ┌──────────────┐                                     │
│                     │   │ Supabase     │                                     │
│ ▼ Services          │   │ [service]    │                                     │
│  Supabase Auth      │   └──────────────┘                                     │
│  Stripe             │                                                         │
│  API Gateway        │  · · · · · · · · · · · · · · · · · · · · · · · · · ·  │
│                     │                                                         │
│                     │ ┌─────────────────────────────────────┐                │
│                     │ │ [+] [🔲] [↕ zoom] [W wire] [0 reset]│                │
│                     │ └─────────────────────────────────────┘                │
├─────────────────────┴───────────────────────────────────────────────────────┤
│ RIGHT DOCK (320px, slides in when wire selected)                               │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ WIRE INSPECTOR                                                            │ │
│ │ Wire Type: [navigational ▾]  ──────────────────────────────────────────  │ │
│ │                                                                           │ │
│ │ Attachments:                                                              │ │
│ │ ┌──────────────────────────────┐                                          │ │
│ │ │  Drop image or paste         │                                          │ │
│ │ │  directive here              │                                          │ │
│ │ └──────────────────────────────┘                                          │ │
│ │                                                                           │ │
│ │ Directive: ┌───────────────────────────────────────────┐                  │ │
│ │            │ Replicate the Obsidian nav aesthetic…    │                  │ │
│ │            └───────────────────────────────────────────┘                  │ │
│ │                                                                           │ │
│ │ ⚠ RTL gate: source node not RTL-compliant                                │ │
│ │                                                                           │ │
│ │ [ Generate /canvas ] ← disabled (orange warning border)                  │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

STATES:
  Empty:      "Add your first page" centered prompt node
  Populated:  Nodes + bezier wires as above
  Generating: Target node shows spinner overlay + generating status
  Gate fail:  Source node orange border + inline badge + Generate disabled
  LOD 0.4+:   Full node (title, badge, port handles, overlays)
  LOD 0.1–0.4: Colored rect + title only
  LOD < 0.1:  8px colored dot

COMPONENT INVENTORY:
  • CanvasWorkspace (CSS matrix transform, pan/zoom)
  • CanvasNode (3 LOD variants)
  • BezierWire (SVG path + dash-flow animation)
  • FloatingToolbar (absolute positioned)
  • WireInspector (right dock, slide-in)
  • VisionGateBadge (pending/valid/rejected states)
  • HardlockGateBadge (inline warning)
  • GenerateButton (state: idle/generating/done/disabled)

ACCESSIBILITY:
  Canvas: aria-label="Sitemap canvas"
  Nodes: role="button" tabIndex={0} aria-label="Page: [title] — [route]"
  Wires: keyboard-selectable via Tab
  Wiring mode: announced via aria-live="polite"
```

---

## Screen 3: Motion Studio (Bottom Dock)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Motion Studio     ID: screen-motion-studio                          │
│  Journey: Any mode → select motion-enabled component → expand bottom dock    │
│  Breakpoint: Desktop 1440px (expanded state, 240px height)                   │
└──────────────────────────────────────────────────────────────────────────────┘

BOTTOM DOCK (240px, expanded)

┌──────────────────────────────────────────────────────────────────────────────┐
│ [▼ Motion Studio — Component_Hero_01]                          [⟳] [▶] [×]  │
│ header: bg var(--ds-color-accent-orange) 36px                                │
├─────────────────────┬────────────────────────────────────────────────────────┤
│ TRACKS (200px)      │ TIMELINE (ruler + keyframe grid)                       │
│                     │ ┌───┬─────────────────────────────────────────────┐   │
│ opacity ──────────  │ │ 0 │  0.1  0.2  0.3  0.4  0.5  0.6  0.7  0.8  │   │
│ translateY ────────  │ │   │       ◆                         ◆          │   │
│ scale ─────────────  │ │   │  ◆                                         │   │
│                     │ │   │                    ◆              ◆         │   │
│ [+ Track]           │ └───┴─────────────────────────────────────────────┘   │
│                     │                                                         │
│                     │ Easing: [ease-out ▾]   Duration: [300ms]  Loop: [off]  │
│                     │ ┌─────────────┐                                        │
│                     │ │    ╱        │  cubic-bezier preview                  │
│                     │ │   ╱         │  64×64px SVG                           │
│                     │ │  ╱          │                                        │
│                     │ └─────────────┘                                        │
└─────────────────────┴────────────────────────────────────────────────────────┘

STATES:
  Empty:    "Add first keyframe at 0.0s" centered in timeline area
  Populated: Diamond markers (◆) on timeline ruler
  Scrubbing: Playhead (1px cyan line) moves with cursor
  Reduced:  "prefers-reduced-motion active — all durations 0ms" banner in orange

COMPONENT INVENTORY:
  • MotionDock (collapsible, 240px default)
  • TrackList (property rows: opacity/translateY/scale/stagger_delay)
  • TimelineRuler (SVG ruler, 0.1s ticks)
  • KeyframeDiamond (◆ drag handle, cyan fill)
  • EasingSelector (dropdown + cubic-bezier SVG preview)
  • ReducedMotionBanner (orange inline notice)
```

---

## Screen 4: Property Inspector (Right Dock — CSS Tab)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Property Inspector     ID: screen-property-inspector                │
│  Journey: Any mode → canvas node selected → right dock activates            │
│  Breakpoint: Desktop (320px fixed right dock)                                │
└──────────────────────────────────────────────────────────────────────────────┘

RIGHT DOCK (320px)

┌────────────────────────────────────────────┐
│ PROPERTY INSPECTOR                         │
├────────────────────────────────────────────┤
│ [ Layers ]  [ CSS ]  [ A11y ]  [ Settings ]│
│ ── active: CSS tab ─────────────────────── │
├────────────────────────────────────────────┤
│ ▽ BOX MODEL                               │
│                                            │
│  Margin Inline Start    [ 12 ] px space.sm │
│  Margin Inline End      [ 12 ] px space.sm │
│  Padding Block Start    [ 24 ] px space.lg │
│  Padding Block End      [ 24 ] px space.lg │
│  Block Size             [ auto    ]        │
│  Inline Size            [ auto    ]        │
│                                            │
├────────────────────────────────────────────┤
│ ▽ TYPOGRAPHY                              │
│                                            │
│  Font Family  [ Geist, Inter, sans-serif ] │
│  Weight       [ 500 — Medium ▾          ]  │
│  Size         [ clamp(0.875rem,2vw,1rem)]  │
│               (base — fluid)               │
│  Leading      [ 1.5                     ]  │
│                                            │
│  [Error] ─── margin-left blocked ──────── │
│  ⚠ Use logical: margin-inline-start       │
└────────────────────────────────────────────┘

A11Y TAB STATE:

┌────────────────────────────────────────────┐
│ PROPERTY INSPECTOR                         │
├────────────────────────────────────────────┤
│ [ Layers ]  [ CSS ]  [[ A11y ]]  [ Settings│
├────────────────────────────────────────────┤
│ ▽ CONTRAST                                │
│  Foreground  [████ #FAFAFA]               │
│  Background  [████ #09090B]               │
│  Ratio:  ✅ 7.2:1  (AA pass)              │
│                                            │
│ ▽ ROLES & STRUCTURE                       │
│  Tab Index:  3                            │
│  ARIA Role:  region                       │
│  ARIA Label: [Main canvas area     ]      │
│                                            │
│ ▽ KEYBOARD                               │
│  Focus indicator: visible (2px)           │
│  Tab sequence:    in order                │
└────────────────────────────────────────────┘

STATES:
  No selection:    "Select a component to inspect" centered placeholder
  Single selected: Box Model + Typography tabs populated
  Multiple:        "(multiple selected) — showing shared properties" banner
  Hardlock error:  Red "Use logical properties" inline below offending field

COMPONENT INVENTORY:
  • InspectorPanel (tabbed, 320px, keyboard-navigable)
  • BoxModelField (label + input[80px] + token label)
  • TypographyField (font selector + weight + clamp display)
  • ContrastBadge (ratio + AA/AAA pass/fail)
  • HardlockError (inline orange message below field)
  • EmptyState (no selection)

ACCESSIBILITY:
  Tabs: aria-role="tablist", keyboard: arrow keys
  Inputs: aria-label="[field name]"
  Hardlock errors: aria-live="assertive"
```

---

## Screen 5: Asset Browser (Left Dock Tab)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Asset Browser     ID: screen-asset-browser                          │
│  Journey: Left dock → Asset Browser tab                                      │
│  Breakpoint: 240px left dock                                                 │
└──────────────────────────────────────────────────────────────────────────────┘

LEFT DOCK (240px, asset tab active)

┌──────────────────────────┐
│ [Profiles] [Assets]      │
│ ────── active: Assets ── │
│                          │
│ [↑ Upload] [🔍 Search]   │
│                          │
│ ── Populated state ───── │
│ ┌──────┐ ┌──────┐ ┌────┐ │
│ │ SVG  │ │ PNG  │ │ W2 │ │
│ │ logo │ │ hero │ │ Gei│ │
│ │ .svg │ │ .png │ │ st │ │
│ └──────┘ └──────┘ └────┘ │
│ ┌──────┐ ┌──────┐        │
│ │  ✗   │ │ JSON │        │
│ │ bad  │ │ toke │        │
│ │ .svg │ │ .json│        │
│ └──────┘ └──────┘        │
│ ↑ red ✗ = text detected  │
│                          │
│ ── Empty state ─────── │
│                          │
│  ┌──────────────────┐    │
│  │                  │    │
│  │  Drop files here │    │
│  │  SVG · PNG · W2  │    │
│  │  JSON · YAML     │    │
│  │                  │    │
│  └──────────────────┘    │
└──────────────────────────┘

STATES:
  Empty:     Full drop zone overlay with extension list
  Uploading: Progress indicator per file (animated bar)
  Populated: 3-col grid of asset cards
  Rejected:  Red ✗ overlay on card + "Text layer detected"
  Searching: Filter applied to asset grid

COMPONENT INVENTORY:
  • AssetBrowserTab (left dock tab)
  • AssetGrid (3-col, 72px cards)
  • AssetCard (thumbnail + name + mime badge)
  • RejectedBadge (red ✗ overlay)
  • DropZone (full-width, dashed border on drag-over)
  • UploadProgress (animated bar per file)
```

---

## Screen 6: Settings Page (/settings)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Settings     ID: screen-settings                                    │
│  Journey: Tab bar → Settings tab                                             │
│  Breakpoint: Desktop 1440px                                                  │
└──────────────────────────────────────────────────────────────────────────────┘

MAIN CONTENT (centered, 480px max-width)

┌────────────────────────────────────────────────────────────────┐
│ Settings                                                       │
│                                                                │
│ ── Design Profile ──────────────────────────────────────────── │
│                                                                │
│  Active Profile                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ ● nezam-obsidian-cyan-orange                            │  │
│  │   Dark · Electric Cyan · GateFlow Orange                │  │
│  │                               [ Change Profile ]        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│ ── Workspace ───────────────────────────────────────────────── │
│                                                                │
│  Development Port                                              │
│  [ 4000             ]                                          │
│                                                                │
│  Language    [ EN ▾ ]    Theme  [ Dark ▾ ]                    │
│                                                                │
│ ──────────────────────────────────────────────────────────── │
│                                                                │
│  [ Reset to Defaults ]                                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

*Generated: 2026-05-18 | Source: DESIGN_CHOICES.md · IA_CONTENT.md · PRD v2.0.0*
