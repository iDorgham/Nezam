# Design Choices — NEZAM (Wireframe selections)

| Field | Value |
|---|---|
| Document | DESIGN_CHOICES.md |
| Status | Locked |
| Profile | `nezam-v3` (from `DESIGN.md`) |
| Wireframe source | `wireframes_locked.json` |
| Locked at | 2026-05-27T08:59:11.418Z |
| Last updated | 2026-05-29 |

---

## wireframe_selections

```yaml
wireframe_selections:
  product_context:
    description: "NEZAM Design Hub — SaaS dashboard shell for governance UI"
    canvas_mode: saas-dashboard
    profile: minimal

  navigation:
    variant: A
    description: "Left rail — Architecture, Wireframes, Preview, Components; shared LeftPanelHeader"
    components:
      - LeftPanelHeader
      - SectionTabs
      - AppShell

  app_shell:
    variant: B
    description: "Three-column Design Hub — nav | canvas | right rail (tokens/services)"
    components:
      - DesignHubLayout
      - ArchRightRail
      - MicroServicesServerRack

  architecture_tree:
    variant: A
    description: "Application → menu → page hierarchy; services in rack above tree"
    components:
      - ArchitectureTree
      - ServiceCatalogPicker
      - ArchNodeDetailPanel

  wireframe_canvas:
    variant: B
    description: "Layout shell first, then ShadcnBlockPreview blocks; caption in WireframeBlockSlot only"
    components:
      - WireframePageTree
      - WireframeBlockSlot
      - ShadcnBlockPreview
      - layout-catalog.json shells

  hero_section:  # PAGE-001 marketing/reference
    variant: B
    description: "Split layout — governance copy left, visual right (locked in wireframes)"
    components:
      - Hero
      - CTAPrimary
      - HeroImage

  tokens_theme:
    variant: A
    description: "Semantic app-* tokens; theme on document.documentElement; light/dark pairs"
    components:
      - TokenPanel
      - ThemeToggle
      - design:apply CLI

  export_lock:
    variant: A
    description: "Export hub writes wireframes_locked.json; maps archPageId → PAGE-xxx"
    components:
      - ExportHub
      - arch-page-map.ts
      - session-resolver.ts
```

---

## Rationale

| Choice | Why |
|---|---|
| SaaS dashboard shell | Design Hub is a dense tool UI, not a marketing site |
| Left rail IA | Matches PRD §12 and existing implementation |
| Shadcn block previews | ~28 block types from `block_registry.json` — dev handoff fidelity |
| Minimal profile | Aligns with developer-tool aesthetic; high contrast for long sessions |
| Lock file at repo root | CI and `/develop` gate discover `wireframes_locked.json` without `.session/` path ambiguity |

---

## Alignment checklist

- [x] `DESIGN.md` at repository root — non-template
- [x] `wireframes_locked.json` exists
- [x] `design_wireframes: true` in `.cursor/state/plan_progress.yaml`
- [x] Token gate: `pnpm run check:tokens` in CI

---

## Decision Amendments

| Date | Changed field | Previous | New | Reason | Approved by |
|---|---|---|---|---|---|
| 2026-05-29 | Documented existing lock | — | YAML from wireframes_locked + DESIGN | /plan all completion | PM-01 |
