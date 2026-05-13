# Extended ASCII Wireframe Catalog Specification

| Canvas | ASCII Zones | Interaction Specs | MENA/RTL Notes | Framework Routing |
|---|---|---|---|---|
| **Visual Builder Canvas** | Toolbar, Canvas, Inspector, Layers | Snap-to-grid, multi-select, undo stack, live preview sync | RTL canvas toggle, Arabic font fallback zones, right-to-left drag constraints | Next.js `/app/builder/[slug]` |
| **Node Graph Editor** | Nodes, Ports, Flow Lines, Debugger | Pan/zoom, port validation, cycle detection, JSON export | Bidi node labels, Hijri date node presets, Arabic-Indic numeral inputs | Vue `/graph-editor.vue` |
| **Component Palette** | Search, Categories, Variants, Preview | Drag-drop injection, variant picker, template slots | Arabic dialect search, RTL icon mirroring, localized placeholder text | SvelteKit `/palette/+page.svelte` |
| **CRM Pipeline Board** | Columns, Cards, Filters, Bulk Actions | Drag reassign, inline edit, stage validation, audit log | Arabic card labels, RTL column order, Hijri date filters | Astro `/crm/pipeline.astro` |
| **Task Kanban** | Backlog, Doing, Review, Done | WIP limits, dependency links, auto-assign, focus traps | RTL board layout, Arabic task summaries, keyboard nav parity | Next.js `/tasks/[board]` |
| **Dashboard IA Grid** | KPI Cards, Charts, Table, Filters | Drill-down, virtual scroll, export, breakpoint switch | Arabic-Indic numerals, RTL chart orientation, localized tooltips | Vue `/dashboard/+page.vue` |
| **Billing & Subscriptions** | Plan Cards, Usage Meter, Invoice, Settings | Proration preview, toggle billing cycle, download PDF | MENA payment badges, RTL form layout, Arabic tax labels | Next.js `/billing/+page.tsx` |
| **CMS Headless Editor** | Content Tree, Editor Pane, Preview, Meta | Inline validation, draft/publish toggle, webhook trigger | Arabic text shaping preview, bidi metadata, dialect routing | Astro `/cms/edit/[id].astro` |
| **Rich Text Toolbar** | Formatting, Insert, Alignment, Collaboration | Inline toolbar, comment threads, cursor sync, conflict resolve | Arabic ligature support, RTL text direction toggle, Hijri date picker | Tiptap plugin architecture |
| **Theme & Token Editor** | Color Swatches, Typography, Spacing, Export | Live theme toggle, JSON export, contrast checker, preset save | Arabic font stacks, RTL spacing overrides, numeral system toggle | CSS-in-JS runtime config |

**Interaction Specs Standard**:
- `Drag-Drop`: 8px snap grid, collision bounds, haptic feedback hooks
- `Undo/Redo`: 50-step stack, JSON Patch deltas, conflict merge UI
- `Keyboard Nav`: `Tab`/`Shift+Tab` focus traps, `Space`/`Enter` activation, `Esc` cancel
- `Multi-Select`: `Shift+Click` range, `Ctrl/Cmd+Click` toggle, group ungroup
- `Bulk Actions`: Checkbox header, progress toast, rollback confirmation

**Data Density Tiers**:
- `Executive`: 4 KPI cards, sparklines, trend arrows, minimal controls
- `Manager`: Filters, bulk ops, export, pagination, inline edit
- `Developer`: JSON schema viewer, raw logs, debug toggle, API mock
- `Ops`: Real-time stream, alert thresholds, health score, incident timeline
