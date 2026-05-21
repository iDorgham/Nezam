# NEZAM Builder — Claude CLI Polish Prompt

## Context

You are working on the NEZAM Design Server — an advanced all-in-one website builder tool built with Next.js 15 + Tailwind CSS. The builder uses a dark-first, high-density UI ("Blender-style") with charcoal-obsidian colors.

### Design Tokens

```
bg:             #181819
bgElevated:     #1e1e1f  
surface:        #232324
border:         #2a2a2c
borderHover:    #3a3a3c
primary:        var(--ds-primary, #06b6d4)
textPrimary:    #e8e8ed
textSecondary:  #8e8e93
textMuted:      #48484a
textLabel:      #636366
```

### Files Structure

```
.nezam/design-server/app/template-builder/
├── page.tsx                    # Main layout: N-logo header, canvas, right panel
├── components/
│   ├── panel-primitives.tsx    # ← Shared design system for all panels
│   ├── RightPanel.tsx          # Icon rail + panel host
│   ├── PreviewCanvas.tsx       # Live website preview
│   ├── LayersPanel.tsx         # Section layer order
│   ├── CategoriesPanel.tsx     # Section template library
│   ├── GeneralSettingsPanel.tsx # SEO/Domain/Analytics
│   ├── AutomationPanel.tsx     # AI workflows
│   ├── PagesPanel.tsx          # Page manager
│   ├── MenusPanel.tsx          # Nav builder
│   └── AppSettingsPanel.tsx    # Global app config
```

---

## Polishing Tasks for Each Panel

### 1. `GeneralSettingsPanel.tsx` — SEO/Domain/Analytics/Security/Social/Advanced

**Goal:** Refactor to use `panel-primitives.tsx` components throughout.

Tasks:
- Replace all custom field wrappers with `<PanelField>` + `<PanelInput>` / `<PanelTextarea>`
- Replace custom toggle divs with `<PanelToggle>`
- Replace raw `<select>` elements with `<PanelSelect>`
- Replace section headers with `<PanelSection defaultOpen>` collapsibles
- Add character counters for SEO title (60 char) and meta description (155 char) — show progress bar turning amber at 80% and red at 100%
- Add domain validation regex for the custom domain field
- Make the Analytics section show a "Copy snippet" button next to each tracking ID
- Ensure consistent 12px padding, 10px text, 9px labels throughout

### 2. `AutomationPanel.tsx` — AI Workflow & Agent Scheduling

**Goal:** Make automation flows feel alive and interactive.

Tasks:
- Use `<PanelHeader>` and `<PanelSection>` from panel-primitives
- Add a "running" state to AI tasks (pulse animation on icon, disabled button)
- Add a "Last run" timestamp below each task card
- Add a `<PanelSelect>` for schedule frequency: Manual / Hourly / Daily / Weekly
- Add a log output area (last 5 lines, monospace font, dark bg) that shows simulated output when task is run
- Wire "Run Now" to append a line to the log
- Make the model selector a proper `<PanelSelect>`

### 3. `LayersPanel.tsx` — Section Order & Visibility

**Goal:** Make drag-and-drop feel native and add more controls.

Tasks:
- Add a section type badge (e.g. "Nav" / "Hero" / "CTA") next to each layer name
- Add an edit-name inline action (click pencil → contentEditable layer name)
- Add keyboard shortcut hint: "↑↓ to reorder" in the footer
- Improve the drop-target highlight: full-width 2px primary-color line between items
- Add "Add blank section" button at the bottom that opens CategoriesPanel

### 4. `CategoriesPanel.tsx` — Section Template Library

**Goal:** Better visual hierarchy and faster browsing.

Tasks:
- Add a "Recently Added" row at the top showing last 3 added sections
- Add keyboard navigation: arrow keys to browse cards, Enter to add
- Improve section card hover state: scale-[1.02] + primary border glow
- Add a difficulty filter pill row: All / Simple / Medium / Complex
- Show a count badge on each category button

### 5. `PagesPanel.tsx` — Page Manager

**Goal:** Full-featured page tree with status management.

Tasks:
- Add a "Publish All Drafts" button in the header
- Add bulk select checkboxes (appears on hover of each row)
- Add keyboard shortcut: N to add new page, Delete to delete selected
- Show the page tree in hierarchical order with indentation for sub-pages
- Add a "SEO score" badge (mock: 60–100%) next to each page with color coding

### 6. `MenusPanel.tsx` — Navigation Builder

**Goal:** More intuitive menu item management.

Tasks:
- Add drag-and-drop visual affordance on the left side of each item
- Add an "Add child item" button that appears on row hover (indent chevron)
- Show a live preview of how the nav will look (tiny nav mockup at the bottom of the panel)
- Add a "Sort Alphabetically" quick action button in the header
- Support emoji/icon prefix for nav labels (icon picker popover)

### 7. `AppSettingsPanel.tsx` — Global Configuration

**Goal:** Make it feel like a proper admin settings page.

Tasks:
- Add a "Saved" toast confirmation when any setting is changed
- Add a visual preview of the logo in the Brand tab
- Add a "Copy to clipboard" button next to the API key
- Add a favicon preview (16×16 box showing the current favicon)
- Add a color-coded connection status indicator next to each integration

---

## Style Rules to Enforce in Every Panel

1. **No inline color strings** — always use PT tokens from `panel-primitives.tsx`
2. **Font size hierarchy**: section title = 9px bold uppercase, field label = 9px semibold, body text = 10px, hint = 8px
3. **Spacing**: 12px horizontal padding (`px-3`), 8–10px vertical (`py-2`/`py-2.5`), 8px gap between fields
4. **Borders**: always `PT.border` (#2a2a2c), never hardcode border colors
5. **Focus states**: always add `onFocus` / `onBlur` to toggle border to `PT.primary`
6. **Interactive states**: hover = `PT.bgHover` (#232324), active = primary tint
7. **RTL support**: use `gap-start`/`gap-end`, `ms-*`/`me-*` instead of `ml-*`/`mr-*`
8. **Accessibility**: all interactive elements must have `title` or `aria-label`

---

## Verification Checklist

After polishing each panel, verify:
- [ ] `pnpm run type-check` passes (zero errors)
- [ ] All tokens imported from `panel-primitives.tsx` (no duplicate definitions)
- [ ] All panels render without console errors
- [ ] Light mode doesn't break (check `isDark` or theme vars instead of hardcoded dark colors)
- [ ] RTL mode doesn't break layout
- [ ] Each panel loads in < 50ms (no heavy computations in render)

---

## Command to run

```bash
cd /Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server
pnpm run type-check && pnpm dev
```
