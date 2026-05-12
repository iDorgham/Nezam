---
name: design-selector
description: Orchestrates the full design selection flow. Detects product type, presents wireframe options sequentially using the wireframe-catalog, saves choices to DESIGN_CHOICES.md, then generates DESIGN.md from confirmed selections.
version: 1.0.0
updated: 2026-05-10
changelog: []
---

# Design Selector Skill

## Purpose

The user controls their design. This skill orchestrates the full selection sequence:

1. Detect product type from PRD.md
2. Present the correct wireframe element sequence for that type
3. User picks one option per element
4. Choices saved to `docs/workspace/plans/04-design/DESIGN_CHOICES.md`
5. User confirms → DESIGN.md generated from choices

This skill calls `wireframe-catalog` for the actual wireframe ASCII art per element.

---

## Trigger

Runs during `/PLAN design` automatically after brand direction is confirmed.
Also triggered by: `/PLAN design wireframes`

---

## Prerequisites

- `docs/prd/PRD.md` must exist and be locked (check `onboarding.yaml` → `prd_locked: true`)
- Product type must be detectable from PRD

If PRD missing → redirect to `/start` Step 3

---

## Step 1 — Detect Product Type and Load Element Sequence

Read `docs/prd/PRD.md`. Detect type:

| PRD signals | Type | Element sequence |
|---|---|---|
| "website", "portfolio", "landing page", "agency" | **website** | Header → Grid/Portfolio → Project Page → Footer → Contact |
| "web app", "dashboard", "tool", "webapp", "SaaS" | **webapp/saas** | App Navigation → Dashboard Layout → Data Table → Modal/Sheet → Auth Flow |
| "mobile", "iOS", "Android", "React Native", "Flutter" | **mobile** | Navigation Pattern → Home Screen → Detail Screen → Bottom Sheet → Onboarding |
| "API", "backend only" | **api** | Skip design selection → go to ARCHITECTURE directly |

Announce detected type before presenting options:

```
Detected: [TYPE] project

I'll walk you through [N] design decisions, one at a time.
For each one, I'll show you options with previews — pick a number.
Your choices will be saved and used to generate DESIGN.md.

Ready? Let's start with Element 1 of [N].
```

---

## Step 2 — Present Elements Sequentially (One at a Time)

**DO NOT present all elements at once.** Show one, wait for choice, then show the next.

For each element:
1. Call the relevant section from `wireframe-catalog/SKILL.md`
2. Show all options for that element with ASCII wireframes
3. Ask: `"Which [element] style fits your project? (type a number)"`
4. Record the choice
5. Confirm: `"✓ [Option name] saved."`
6. Move to next element automatically

---

## WEBSITE Element Sequence

### Element 1 of 5: Header / Main Navigation
→ Pull from wireframe-catalog: ELEMENT 1 (Header/Nav, Options 1–5)
Question: "Which header style fits your project? (1–5)"

### Element 2 of 5: Portfolio / Content Grid
→ Pull from wireframe-catalog: ELEMENT 2 (Portfolio Grid, Options 1–5)
Question: "How should your work/content be displayed? (1–5)"

### Element 3 of 5: Project / Case Study Page
→ Pull from wireframe-catalog: ELEMENT 3 (Project Page, Options 1–4)
Question: "How should individual project pages be laid out? (1–4)"

### Element 4 of 5: Footer
→ Pull from wireframe-catalog: ELEMENT 4 (Footer, Options 1–4)
Question: "Which footer style fits? (1–4)"

### Element 5 of 5: Contact Page
→ Pull from wireframe-catalog: ELEMENT 5 (Contact, Options 1–4)
Question: "How should visitors reach you? (1–4)"

---

## WEBAPP / SAAS Element Sequence

### Element 1 of 4: App Navigation / Sidebar
→ Pull from wireframe-catalog: APP ELEMENT 1 (App Navigation, Options 1–4)
Question: "How should users navigate your app? (1–4)"

### Element 2 of 4: Dashboard Layout
→ Pull from wireframe-catalog: APP ELEMENT 2 (Dashboard, Options 1–4)
Question: "Which dashboard layout fits your data model? (1–4)"

### Element 3 of 4: Data Table / List View

Present these options:

```
Option 1 — Compact Table with Actions
┌─────────────────────────────────────────────────────┐
│ ☐  Name          Status      Date        Actions   │
│────────────────────────────────────────────────────│
│ ☐  Project A    ● Active    Jan 12      Edit  ⋮   │
│ ☐  Project B    ○ Draft     Jan 08      Edit  ⋮   │
│ ☐  Project C    ● Active    Jan 03      Edit  ⋮   │
│ ──────────────────────────────────────────────── │
│ Showing 1–3 of 48        ← Prev  1  2  3  Next → │
└─────────────────────────────────────────────────────┘
Best for: admin panels, CRMs, task managers
```

```
Option 2 — Card Grid List
┌─────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Project A    │  │ Project B    │  │ + New    │ │
│  │ ● Active     │  │ ○ Draft      │  │          │ │
│  │ Jan 12       │  │ Jan 08       │  │          │ │
│  │ Edit  ⋮     │  │ Edit  ⋮     │  │          │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
Best for: project managers, media apps, content tools
```

```
Option 3 — Feed / Activity List
┌─────────────────────────────────────────────────────┐
│  ● Jan 12  Project A updated          [View →]     │
│  ─────────────────────────────────────────────────  │
│  ○ Jan 08  Project B created          [View →]     │
│  ─────────────────────────────────────────────────  │
│  ● Jan 03  Project C completed        [View →]     │
└─────────────────────────────────────────────────────┘
Best for: feeds, logs, activity streams, timelines
```

Question: "How should lists and data tables look in your app? (1–3)"

### Element 4 of 4: Empty State / Onboarding First Screen

```
Option 1 — Centered Illustration + CTA
┌─────────────────────────────────────────────────────┐
│                                                     │
│                   [  Illustration  ]                │
│                                                     │
│              No projects yet                        │
│         Start by creating your first one            │
│                                                     │
│               [ + Create Project ]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

```
Option 2 — Checklist / Setup Steps
┌─────────────────────────────────────────────────────┐
│  Get started                                        │
│  ─────────────────────────────────────────────────  │
│  ✓  1. Connect your account                        │
│  ○  2. Add your first project    [ Start → ]       │
│  ○  3. Invite your team          [ Skip  ]         │
│  ○  4. Set up notifications      [ Skip  ]         │
└─────────────────────────────────────────────────────┘
```

```
Option 3 — Minimal Text Only
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Nothing here yet.                                  │
│                                                     │
│  [ + Add your first item ]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Question: "What should users see when they first arrive with no data? (1–3)"

---

## MOBILE Element Sequence

### Element 1 of 4: Navigation Pattern
→ Pull from wireframe-catalog: APP ELEMENT 1 (App Navigation, Options 1–4)
Note: Focus on Option 4 (Bottom Tab Bar) as primary recommendation for mobile.
Question: "How should users navigate your mobile app? (1–4)"

### Element 2 of 4: Home / Feed Screen

```
Option 1 — Card Feed (social / news style)
┌─────────────────┐
│ ≡  App Name  🔔 │
│─────────────────│
│ ┌─────────────┐ │
│ │  [Image]    │ │
│ │  Title      │ │
│ │  Subtitle   │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │  [Image]    │ │
│ │  Title      │ │
│ └─────────────┘ │
│ 🏠  🔍  ➕  💬  👤 │
└─────────────────┘
```

```
Option 2 — Grid / Gallery Home
┌─────────────────┐
│ ≡  App Name  🔍 │
│─────────────────│
│ ┌─────┐ ┌─────┐│
│ │ [A] │ │ [B] ││
│ └─────┘ └─────┘│
│ ┌─────┐ ┌─────┐│
│ │ [C] │ │ [D] ││
│ └─────┘ └─────┘│
│ 🏠  🔍  ➕  💬  👤 │
└─────────────────┘
```

```
Option 3 — Sectioned List
┌─────────────────┐
│ Good morning ☀️  │
│─────────────────│
│ Recent          │
│ ▸ Item A        │
│ ▸ Item B        │
│─────────────────│
│ Featured        │
│ ──────────────  │
│ [Featured card] │
│ 🏠  🔍  ➕  💬  👤 │
└─────────────────┘
```

Question: "How should the home screen be laid out? (1–3)"

### Element 3 of 4: Detail / Profile Screen

```
Option 1 — Hero Image + Content
┌─────────────────┐
│ ← Back      ⋮  │
│█████████████████│
│█  [Hero Image] █│
│█████████████████│
│ Title           │
│ Subtitle / Meta │
│─────────────────│
│ Section 1       │
│ Content...      │
│─────────────────│
│ Section 2       │
└─────────────────┘
```

```
Option 2 — Clean Text Detail
┌─────────────────┐
│ ← Back          │
│                 │
│ Title           │
│ ── Metadata ──  │
│ Description     │
│ text content... │
│                 │
│ [Action Button] │
└─────────────────┘
```

Question: "How should individual item/detail pages look? (1–2)"

### Element 4 of 4: Onboarding Flow

```
Option 1 — Step-by-step slides
┌─────────────────┐
│        2/4      │
│                 │
│  [Illustration] │
│                 │
│  Step Title     │
│  Description    │
│                 │
│  ●  ●  ○  ○    │
│  [Next →]       │
│  Skip           │
└─────────────────┘
```

```
Option 2 — Permission / value cards
┌─────────────────┐
│  Why we need    │
│  your location  │
│                 │
│  [Map icon]     │
│                 │
│  To show you    │
│  nearby results │
│                 │
│  [Allow]        │
│  [Not now]      │
└─────────────────┘
```

```
Option 3 — Single sign-up first
┌─────────────────┐
│                 │
│  Welcome to     │
│  App Name       │
│                 │
│  [Sign up free] │
│  [Log in]       │
│                 │
│  ─── or ───     │
│  [Continue with │
│   Google]       │
└─────────────────┘
```

Question: "How should new users be onboarded? (1–3)"

---

## Step 3 — Confirmation Summary

After all elements are selected, display a summary:

```
Design choices locked — here's your summary:

[WEBSITE]
  Header:        Option [N] — [name]
  Grid:          Option [N] — [name]
  Project Page:  Option [N] — [name]
  Footer:        Option [N] — [name]
  Contact:       Option [N] — [name]

[WEBAPP/SAAS]
  Navigation:    Option [N] — [name]
  Dashboard:     Option [N] — [name]
  Data Table:    Option [N] — [name]
  Empty State:   Option [N] — [name]

Type YES to generate DESIGN.md from these choices.
Type CHANGE [element] to revise one (e.g. CHANGE header).
```

---

## Step 4 — Write DESIGN_CHOICES.md

On YES, write to `docs/workspace/plans/04-design/DESIGN_CHOICES.md`:

```yaml
# DESIGN_CHOICES.md
# Generated by design-selector skill
# Date: [today]
# Product Type: [type]
# Status: CONFIRMED

product_type: [website | webapp | saas | mobile]

choices:
  # WEBSITE
  header:
    option: [1-5]
    name: "[option name]"
    description: "[one line]"
  
  grid:
    option: [1-5]
    name: "[option name]"
    description: "[one line]"
  
  project_page:
    option: [1-4]
    name: "[option name]"
    description: "[one line]"
  
  footer:
    option: [1-4]
    name: "[option name]"
    description: "[one line]"
  
  contact:
    option: [1-4]
    name: "[option name]"
    description: "[one line]"

  # WEBAPP/SAAS
  app_navigation:
    option: [1-4]
    name: "[option name]"
    description: "[one line]"
  
  dashboard:
    option: [1-4]
    name: "[option name]"
    description: "[one line]"
  
  data_table:
    option: [1-3]
    name: "[option name]"
    description: "[one line]"
  
  empty_state:
    option: [1-3]
    name: "[option name]"
    description: "[one line]"

  # MOBILE
  navigation_pattern:
    option: [1-4]
    name: "[option name]"
    description: "[one line]"
  
  home_screen:
    option: [1-3]
    name: "[option name]"
    description: "[one line]"
  
  detail_screen:
    option: [1-2]
    name: "[option name]"
    description: "[one line]"
  
  onboarding:
    option: [1-3]
    name: "[option name]"
    description: "[one line]"
```

---

## Step 5 — Generate DESIGN.md

After writing DESIGN_CHOICES.md, generate `docs/workspace/plans/04-design/DESIGN.md` with:

```markdown
# DESIGN.md — [Product Name]
# Generated from DESIGN_CHOICES.md
# Date: [today]
# Status: LOCKED

## Layout Architecture

### [Header Option Name]
[Description + implementation notes derived from chosen option]
- Pattern: [layout description]
- Behavior: [scroll behavior, sticky/fixed notes]
- Components needed: [list]

### [Grid/Navigation Option Name]
[Description + implementation notes]

### [Other chosen elements...]

## Component Inventory

Based on your chosen layouts, these components are required:

| Component | Source | Priority |
|---|---|---|
| Header/Nav | design-system | P0 |
| [Grid/Layout component] | design-system | P0 |
| [etc.] | | |

## Design Tokens Required

```tokens
--spacing-unit: 8px
--header-height: [derived from choice]
--sidebar-width: [derived from choice, if applicable]
--grid-cols-desktop: [derived from choice]
--grid-cols-mobile: 1
```

## Responsive Breakpoints

| Breakpoint | Width | Layout Change |
|---|---|---|
| mobile | 0–767px | [stacking behavior from choice] |
| tablet | 768–1023px | [mid-state behavior] |
| desktop | 1024px+ | [full layout from choice] |

## Motion / Interaction Notes

- Navigation transitions: [derived from nav choice]
- Page transitions: [standard or custom]
- Hover states: [derived from grid choice]

## Implementation Order

Phase 1 — Shell (Scaffold)
  [Header component]
  [Navigation/Sidebar component]
  [Layout wrapper]

Phase 2 — Content Views
  [Grid/List components]
  [Detail page layout]

Phase 3 — Supporting
  [Footer]
  [Contact/Forms]
  [Empty states]
```

---

## Error States

**If user types a number out of range:**
> "That option doesn't exist for this element. Please type a number between [min] and [max]."

**If user types CHANGE [element] after confirmation:**
> Show only that element's wireframe options again → update choice → return to confirmation.

**If PRD type is ambiguous:**
> Ask: "Is this primarily a (1) Website, (2) Web App/SaaS, or (3) Mobile App?"

---

## Files Written

| File | When |
|---|---|
| `docs/workspace/plans/04-design/DESIGN_CHOICES.md` | After YES confirmation |
| `docs/workspace/plans/04-design/DESIGN.md` | After DESIGN_CHOICES.md is written |

Both files must exist before `/PLAN scaffold` can run.

---

## Recommendation Footer

Required on all responses:

```
─────────────────────────────────────────────────
Next: /PLAN scaffold → generate full file tree
Or: /PLAN content → write page copy
─────────────────────────────────────────────────
```
