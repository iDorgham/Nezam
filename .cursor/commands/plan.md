---
description: PLAN — SDD + SEO-first IA/content + DESIGN.md prototyping + versioning plan.
---

You are coordinating **/PLAN**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands** (`help` lists them):  
`sdd | roadmap | seo | ia | content | design | versioning | phases | specs | docs | all`

**Aliases** (user prompts / legacy docs): treat `menus` as **`ia`**, `version` as **`versioning`**, singular **`spec`** as **`specs`**.

## Required preflight (hard block)

Before any `/PLAN` subcommand runs, enforce onboarding gates:

- GitHub repo import/attach confirmed (`git remote -v` shows origin).
- `docs/specs/prd/PRD.md` exists.
- `docs/prompts/PROJECT_PROMPT.md` exists.

If any prerequisite is missing, refuse planning execution and return this recovery path in order:
1. `/START repo`
2. `/CREATE prd`
3. `/CREATE prompt`
4. `/START gates`
5. Retry `/PLAN ...`

## Behaviors

- **`sdd`**: Expand roadmap→phases→specs→docs structure under `docs/specs/sdd/`, aligning with `@plan-full`.
- **`roadmap` / `phases`**: Maintain `ROADMAP.md` milestones + phased deliverables tying to semver bumps.
- **`seo`**: Build keyword/cluster tables, intents, snippets, FAQ seeds, slug rules; save to `docs/specs/sdd/SEO_RESEARCH.md`.
- **`ia`**: Hard-block unless `docs/specs/sdd/SEO_RESEARCH.md` exists. Propose menus, URL map, breadcrumbs, naming driven by SEO tables.
- **`content`**: Hard-block unless IA output is documented in SDD docs. Build voice/tone, page inventories, hero/sections copy blocks, UI microcopy tables.
- **`design`**: Hard-block unless content outlines are documented. Author/refresh root `DESIGN.md` (+ optional `DESIGN_PAGES/`) BEFORE production UI coding; modes include one-page, blog index+detail shell, corporate, portfolio, gallery, storefront, horizontal vs vertical scroll storytelling; include palette + typography + motion + accessibility notes; `@design-md`.
- **`versioning`**: Fill `docs/specs/sdd/VERSIONING.md` with semver rules, changelog policy, tag naming (`vMAJOR.MINOR.PATCH`), **commit message conventions** (Conventional Commits), release branch choreography, semantic release opt-in sketch.
- **`specs` / `docs`**: Generate spec IDs, acceptance criteria, non-functionals including perf/security/CMS/analytics placeholders.
- **`all`**: Enforce strict order `seo -> ia -> content -> design -> versioning -> roadmap/spec scaffolding`, explicitly marking dependencies and blockers.

Do not allow development planning if `DESIGN.md` is missing.

Prefer Plan Mode tooling for exploratory repo reads.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/PLAN` is treated as `<subcommand>`.
- `help` → Output: "Usage: /PLAN <subcommand>\nOptions: sdd | roadmap | seo | ia | content | design | versioning | phases | specs | docs | all\nExamples:\n/PLAN seo\n/PLAN all\nRun without args for default flow."
- `sdd` / `roadmap` / `seo` / `ia` / `content` / `design` / `versioning` / `phases` / `specs` / `docs` / `all` → Execute the corresponding behavior defined above (including all preflight gates).
- *(default)* → Run the primary flow defined above (treat as `/PLAN all` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/PLAN help` for options."
