---
description: PLAN — SDD + SEO-first IA/content + DESIGN.md prototyping + versioning plan.
---

You are coordinating **COIA /PLAN**.

Parse **subcommands** (`help` lists them):  
`sdd | roadmap | seo | ia | content | design | versioning | phases | specs | docs | all`

## Behaviors

- **`sdd`**: Expand roadmap→phases→specs→docs structure under `docs/specs/sdd/`, aligning with `@coi-plan-full`.
- **`roadmap` / `phases`**: Maintain `ROADMAP.md` milestones + phased deliverables tying to semver bumps.
- **`seo`**: Build keyword/cluster tables, intents, snippets, FAQ seeds, slug rules; propagate to IA + content drafts.
- **`ia`**: Propose menus, URL map, breadcrumbs, naming driven by SEO tables.
- **`content`**: Voice/tone, page inventories, hero/sections copy blocks, UI microcopy spreadsheet-style in markdown tables.
- **`design`**: Author/refresh root `DESIGN.md` (+ optional `DESIGN_PAGES/`) BEFORE production UI coding; modes include one-page, blog index+detail shell, corporate, portfolio, gallery, storefront, horizontal vs vertical scroll storytelling; include palette + typography + motion + accessibility notes; `@coi-design-md`.
- **`versioning`**: Fill `docs/specs/sdd/VERSIONING.md` with semver rules, changelog policy, tag naming (`vMAJOR.MINOR.PATCH`), **commit message conventions** (Conventional Commits), release branch choreography, semantic release opt-in sketch.
- **`specs` / `docs`**: Generate spec IDs, acceptance criteria, non-functionals including perf/security/CMS/analytics placeholders.
- **`all`**: Order `seo → ia → content → design → versioning → roadmap/spec scaffolding`, explicitly marking dependencies between sections.

Prefer Plan Mode tooling for exploratory repo reads.

## Recommendation footer

Obey orchestration Recommendation rules.
