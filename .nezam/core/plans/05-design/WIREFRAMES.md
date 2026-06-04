---
wireframe_source: json_server
locked_file: wireframes_locked.json
profile: nezam-v3
---

# Wireframes — NEZAM Design Hub

| Field | Value |
|---|---|
| Document | WIREFRAMES.md |
| Status | Locked |
| screen_count | 1 (PAGE-001) + 4 hub panels |
| Last updated | 2026-05-29 |

---

## SCREEN: Design Hub Shell — ID: DH-SHELL

**Journey:** Local design approval before `/develop`  
**Type:** Application shell  
**Breakpoint:** Desktop 1440px

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Design Hub Shell          ID: DH-SHELL                             │
│  Journey: Open after /plan ia          Type: tool                           │
│  Breakpoint: Desktop 1440px                                                 │
└─────────────────────────────────────────────────────────────────────────────┘

DESKTOP LAYOUT — 12-column grid
┌──────────┬──────────────────────────────────────────────┬─────────────────┐
│ LEFT     │ MAIN CANVAS                                   │ RIGHT RAIL      │
│ NAV      │                                               │                 │
│ ───────  │  [Section content: Arch / Wire / Preview]    │ Theme · Tokens  │
│ Arch     │                                               │ Service guide   │
│ Wire     │  gap: lg · padding: md                       │                 │
│ Preview  │                                               │ width: 3col     │
│ Compon.  │                                               │                 │
│ (3col)   │  (6col)                                       │                 │
└──────────┴──────────────────────────────────────────────┴─────────────────┘

COMPONENT INVENTORY:
  • DesignHubLayout · LeftPanelHeader · SectionTabs
  • ArchRightRail · ServiceIntegrationGuide

ACCESSIBILITY:
  Landmarks: <nav>, <main>, <aside>
  Tab order: Nav sections → canvas → right rail controls
```

---

## SCREEN: Home — ID: PAGE-001

**Journey:** Reference / lock export sample  
**Route:** `/`  
**Source:** `wireframes_locked.json`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SCREEN: Home                      ID: PAGE-001                               │
│  canvas_mode: saas-dashboard       priority: P0                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ [NAV] Logo · Sections · CTA                                    [3col]        │
├──────────────────────────────────────────────────────────────────────────────┤
│                         [HERO — SEC-001]                                     │
│  ┌─────────────────────────────┐  ┌────────────────────────────────────┐   │
│  │ H1 — Governance headline    │  │ Illustration / product visual       │   │
│  │ Subhead — SDD pipeline        │  │ ratio 16:9                        │   │
│  │ [Primary CTA] [Secondary]     │  │                                   │   │
│  └─────────────────────────────┘  └────────────────────────────────────┘   │
│  7col text / 5col visual · padding: xl                                     │
└──────────────────────────────────────────────────────────────────────────────┘

STATES:
  Default: as above
  Loading: skeleton hero + nav placeholders
  Empty:   "Apply a design profile" prompt

COMPONENT INVENTORY:
  • Hero · Nav_TopBar (implicit) · CTAPrimary · CTASecondary

ACCESSIBILITY:
  Hero image: descriptive alt
  Focus: Logo → nav links → CTAs
```

---

## SCREEN: Wireframe Editor — ID: DH-WF

**Journey:** Per architecture page — save session before lock

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAGE TREE (archPageId)  │  CANVAS (layout shell + blocks)  │  PALETTE      │
│  ─────────────────────   │  ─────────────────────────────    │  block types  │
│  ▶ Home (PAGE-001)       │  [Header slot]                    │  Hero         │
│    Dashboard             │  [Content slot — Shadcn previews] │  Features     │
│                          │  [Footer slot]                    │  CTA          │
└─────────────────────────────────────────────────────────────────────────────┘

States: empty page (seed suggested blocks) · saved · validation error on export
```

---

## screen_id index

| screen_id | Title | Route / panel | components | accessibility_notes |
|---|---|---|---|---|
| PAGE-001 | Home | `/` | Hero, CTA | Landmarks in marketing shell |
| DH-SHELL | Design Hub Shell | `/` app | DesignHubLayout | nav/main/aside |
| DH-ARCH | Architecture | `/architecture` | ArchitectureTree, ServiceRack | tree keyboard nav |
| DH-WF | Wireframes | `/wireframes` | WireframeBlockSlot, ShadcnBlockPreview | block labels in footer slot only |
| DH-EXPORT | Export | export hub | ExportHub | confirm dialog before lock |

---

## Verification

```bash
grep -c "screen_id" .nezam/core/plans/04-design/WIREFRAMES.md
# Expect: ≥1 (PAGE-001 + DH-* entries)
```

## Design skill stack (wireframe phase)

For wireframe authoring prompts, use manifest phase `wireframe` (see [`../design/DESIGN_SKILLS.md`](../design/DESIGN_SKILLS.md)):

```bash
pnpm skills:assemble-design-prompt --phase wireframe --write --dir .nezam/core/plans/04-design/wireframes
```
