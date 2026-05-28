---
name: shadcn-advisor
description: "Recommends and integrates shadcn/ui components with NEZAM's DESIGN.md token system. Use when selecting, installing, or customizing shadcn/ui components. Provides NEZAM CSS variable overrides, RTL notes, and component decision trees. Works with the awesome-shadcn-ui catalog at docs/reference/awesome-shadcn-ui-main/."
license: MIT
metadata:
  version: "1.0.0"
  source: "docs/reference/awesome-shadcn-ui-main/"
  framework: "Next.js + shadcn/ui"
---

# shadcn/ui Advisor (NEZAM Edition)

Recommends and guides integration of shadcn/ui components within NEZAM's token system. Thin wrapper around the full `shadcn-component-advisor` plugin skill, localized for the workspace.

## Quick Reference

Full catalog: `docs/reference/awesome-shadcn-ui-main/README.md`

## NEZAM Token Map for shadcn

Apply to `globals.css` to override all shadcn CSS variables with NEZAM DESIGN.md values:

```css
:root {
  --background: 218 11% 9%;           /* #161619 surface-bg */
  --foreground: 220 14% 96%;          /* #F4F5F7 text-primary */
  --card: 225 9% 12%;                  /* #1E1F22 surface-panel */
  --card-foreground: 220 14% 96%;
  --popover: 222 9% 17%;              /* #2A2C31 surface-elevated */
  --popover-foreground: 220 14% 96%;
  --primary: 217 100% 50%;            /* #0065FF accent */
  --primary-foreground: 0 0% 100%;
  --secondary: 222 9% 17%;
  --secondary-foreground: 220 14% 96%;
  --muted: 222 9% 17%;
  --muted-foreground: 216 14% 68%;   /* #A5ADBA text-muted */
  --accent: 217 100% 50%;
  --accent-foreground: 0 0% 100%;
  --destructive: 8 95% 46%;           /* #DE350B danger */
  --destructive-foreground: 0 0% 100%;
  --border: 225 6% 19%;              /* #2E3035 border-default */
  --input: 225 6% 6%;                /* #101012 surface-inset */
  --ring: 217 100% 50%;
  --radius: 0.375rem;                /* 6px rounded.sm */
}
```

## Component Decision Tree

```
Need a clickable action?
  Primary → Button (primary)
  Secondary → Button (secondary/ghost)
  Destructive → Button (destructive) + AlertDialog

Need to show data?
  Tabular, sortable → DataTable (tanstack/table)
  Simple → Table
  Status → Badge (use semantic colors only)

Need user input?
  Text → Input / Textarea
  Selection → Select | Combobox (if searchable)
  Multiple → MultiSelect | Checkbox group
  Toggle → Switch | RadioGroup
  Date → DatePicker

Need overlay?
  Confirm only → AlertDialog
  Complex content → Sheet (PREFER over Dialog)
  Contextual info → Popover / HoverCard
  Notification → Sonner toast
  Search → Command (CMDK)

Need navigation?
  App nav → Sidebar
  Sections → Tabs
  Location → Breadcrumb
  Site nav → NavigationMenu
```

## NEZAM-Specific Component Rules

- **Skeleton loading** — Use `Skeleton` component for all loading states. No spinners.
- **Alert component** — Never use `border-left` side-stripe for alerts. Use full-border + background tint semantic colors.
- **Dialog vs. Sheet** — Default to Sheet for any content more complex than a simple confirmation.
- **Badge colors** — Use semantic only: `#00875A` success, `#FFAB00` warning, `#DE350B` danger. No decorative badge colors.
- **Card** — Use sparingly. Not the default layout answer. Nested cards are always wrong.
- **Toast** — Use `Sonner` package (preferred over shadcn built-in Toast) for NEZAM design system compatibility.

## RTL Support

When building RTL-compatible components:
1. Replace `left`/`right` with `start`/`end` in all layout props
2. Mirror directional icons: `transform: scaleX(-1)` on chevrons, arrows
3. Sidebar flips to right side in RTL mode
4. Test with `dir="rtl"` on the root element
5. Consult `rtl-layout-specialist.md` agent for complex layouts

## Installation

```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add data-table

# Add all at once (interactive)
npx shadcn@latest add
```

## Extended Components (awesome-shadcn-ui catalog)

Beyond core shadcn, these packages integrate seamlessly:

| Package | Purpose | NEZAM Use |
|---|---|---|
| `sonner` | Toast notifications | Preferred over shadcn Toast |
| `vaul` | Mobile-optimized drawers | Mobile sheet patterns |
| `cmdk` | Command palette | Design Hub command bar |
| `@tanstack/react-table` | DataTable engine | All data tables |
| `@tanstack/react-virtual` | Virtualization | Long lists performance |
| `embla-carousel-react` | Carousel/slider | Image galleries |
| `tiptap` | Rich text editor | Content editing |
| `react-hook-form` + `zod` | Form validation | All forms |

Full catalog at `docs/reference/awesome-shadcn-ui-main/README.md`
