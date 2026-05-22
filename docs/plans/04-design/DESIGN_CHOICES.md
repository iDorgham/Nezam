# Design Choices — Nezam Design Server · Ultimate UI Suite

> **Phase:** 04-Design | **Source:** PRD v2.0.0 · DESIGN.md · IA_CONTENT.md
> Records all layout and component variant selections for the SPA shell.

---

## Wireframe Selections

```yaml
wireframe_selections:

  app_shell:
    variant: "obsidian-tricolumn"
    description: "Full-dark 3-column shell — left dock 240px fixed, main content flex-1, right dock 320px context-sensitive"
    grid: "240px + flex-1 + 320px"
    top_nav_height: "48px"
    bottom_dock_height: "240px collapsible"
    components:
      - TopNav (Logo · TabBar · LangToggle · ThemeToggle · SyncStatusPill)
      - LeftDock (context-sensitive by mode)
      - MainContent (mode-specific)
      - RightDock (Wire Inspector / Property Inspector)
      - BottomDock (Motion Studio timeline)

  top_navigation:
    variant: "A — persistent-dark-tabbar"
    description: "Sticky top nav on pitch-black (#09090B), Electric Cyan underline on active tab"
    components:
      - Logo (text mark + icon, 32×32px)
      - TabBar (scrollable, max-width fill, close ×)
      - LangToggle (EN/AR chip)
      - ThemeToggle (icon only)
      - SyncStatusPill (colored dot + text + pulse animation)
    active_indicator: "2px underline var(--ds-color-accent-cyan)"
    tab_close: "× appears on hover only"

  left_dock_token_studio:
    variant: "B — profile-grid + quick-actions"
    description: "Profile cards in 2-col grid, Quick Actions row at bottom"
    sections:
      - Design Profiles (2-col card grid, system vs custom badge)
      - Color Palette (6-swatch quick-access row)
      - Quick Actions (Save Preset · Sync to Disk · Export CSS — icon+label buttons)
    section_separator: "1px var(--ds-color-border-subtle)"

  left_dock_canvas:
    variant: "A — categorized list with collapse"
    description: "Collapsible sections: Pages / Widgets / Services, each with item list"
    sections:
      - Pages (list with route label, pan-to button on hover)
      - Widgets (draggable list: Data Table · Auth Form · Nav Bar · etc.)
      - Services (draggable list: Supabase Auth · Stripe · API Gateway · etc.)
    drag_affordance: "drag handle icon left of label, visible on hover"

  main_token_studio:
    variant: "C — tabbed panel with live preview"
    description: "Tab bar: Colors · Shape · Typography · Component Playground. Live preview column on right of each tab."
    tabs:
      - Colors: color swatches + hex inputs + contrast badge
      - Shape: border-radius slider + token grid + live button/card preview
      - Typography: scale grid (8 rows XS→2XL) + clamp formula chip + Arabic toggle
      - Playground: isolated component sandbox with applied tokens
    live_preview_width: "flex-1 min-w-0"
    editor_width: "360px fixed"

  canvas_workspace:
    variant: "A — full viewport infinite SVG canvas"
    description: "CSS affine transform canvas, floating toolbar bottom-left, right inspector slides in on wire select"
    canvas_bg: "var(--ds-color-background) + subtle dot grid"
    node_style: "6px border-radius, 180×80px default, Electric Cyan border on select"
    wire_style: "bezier SVG path, dash-flow animation, color by wire type"
    toolbar_position: "bottom-left fixed, above bottom dock"
    inspector_enter: "slide-in-from-right 200ms ease-out"

  wire_inspector:
    variant: "B — right dock panel, slide-in"
    description: "Appears when wire selected: Wire type badge + attachment drop zone + directive textarea + Generate button"
    width: "320px"
    sections:
      - Wire Type (badge selector: navigational/data/auth/conditional)
      - Attachments (drop zone + thumbnail grid + Vision Gate status badge)
      - Directives (textarea: 'Replicate the aesthetic of the source navigation')
      - Generate CTA (primary button + hardlock status indicators)
    hardlock_indicators: "inline warning badges below Generate button"

  property_inspector:
    variant: "A — dense tabbed panel"
    description: "4 tabs (Layers · CSS · A11y · Settings), 320px fixed, keyboard-navigable"
    tabs:
      - Layers: element hierarchy tree
      - CSS: Box Model fields (logical properties) + Typography fields
      - A11y: Contrast badge + Tab Index + ARIA Role
      - Settings: element-specific settings
    input_width: "80px mono font"
    debounce: "100ms before commit"

  motion_studio:
    variant: "B — horizontal timeline, collapsible bottom dock"
    description: "240px default height, collapsible. Track list left 200px, timeline ruler + keyframe grid right."
    timeline_header_color: "var(--ds-color-accent-orange)"
    keyframe_marker: "◆ diamond, Electric Cyan fill"
    ruler_ticks: "1px muted lines every 0.1s"
    easing_preview: "SVG cubic-bezier curve, 64×64px"
    reduced_motion_notice: "inline banner at top of panel"

  asset_browser:
    variant: "A — drop zone + grid"
    description: "Left dock secondary tab. Toolbar (upload button + search) + breadcrumb + drop zone overlay + asset grid."
    asset_grid: "3-col @ 240px dock width"
    card_size: "72×72px thumbnail"
    rejected_badge: "red ✗ overlay on card"
    mimes_shown: "SVG · WOFF2 · PNG · JPG · JSON · YAML"

  settings_page:
    variant: "A — single-column form"
    description: "Stacked form sections: Design Profile selector + Workspace settings"
    width: "480px centered in main content"
    sections:
      - Design Profile (active profile card + Change button)
      - Workspace (port input, reset button)
    save_pattern: "auto-save on blur (no explicit Save button)"

  empty_states:
    variant: "A — centered icon + headline + subtext + optional CTA"
    description: "Vertically centered, icon above headline, muted subtext, optional primary CTA"
    icon_size: "48×48px, muted fill"
    headline_size: "text-sm font-medium text-[--ds-color-text-primary]"
    subtext_size: "text-xs text-[--ds-color-text-muted]"

  toast_system:
    variant: "A — top-right stack, auto-dismiss"
    description: "Fixed top-right, stacked vertically, 4s auto-dismiss. Success/Error/Warning variants."
    success_color: "var(--ds-color-accent-cyan)"
    error_color: "var(--ds-color-accent-orange)"
    width: "360px"
    animation: "slide-in-from-right 150ms ease-out, fade-out 150ms on dismiss"
```

---

## Token-to-Component Mapping

| Component | Token used |
|---|---|
| SyncStatusPill (synced) | `--ds-color-accent-cyan` |
| SyncStatusPill (failed) | `--ds-color-accent-orange` |
| Active tab underline | `--ds-color-accent-cyan` |
| Canvas wire (navigational) | `--dv-wire-navigational` = Electric Cyan |
| Canvas node selected border | `--ds-color-accent-cyan` |
| Canvas node hardlock border | `--ds-color-accent-orange` |
| Timeline header | `--ds-color-accent-orange` |
| Keyframe diamond | `--ds-color-accent-cyan` |
| Error toast | `--ds-color-accent-orange` |
| Section separators | `--ds-color-border-subtle` |
| Panel backgrounds | `--ds-color-surface-base` |
| Elevated surfaces | `--ds-color-surface-elevated` |

---

## Responsive Strategy

This is a developer tool — it runs locally and targets a single viewport. Breakpoint targets:

| Breakpoint | Behavior |
|---|---|
| > 1280px | Full 3-column layout — all panels visible |
| 1024–1280px | Right dock collapses to icon rail (expand on click) |
| < 1024px | Left dock collapses; main content full-width; right dock as modal sheet |

---

*Generated: 2026-05-18 | Source: PRD v2.0.0 · DESIGN.md · IA_CONTENT.md*
