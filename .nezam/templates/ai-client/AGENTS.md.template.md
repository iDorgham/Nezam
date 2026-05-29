# NEZAM — Workspace AI Instructions

> **`/command` do everything.**

This file is generated from `.cursor/` governance.

## Canonical source of truth

- Commands: `.cursor/commands/`
- Agents: `.cursor/agents/`
- Skills: `.cursor/skills/`
- Rules: `.cursor/rules/`

Do not edit generated per-tool files directly.
Update `.cursor/` and run `pnpm ai:sync`.

## Core pipeline

Planning -> SEO -> IA -> Content -> Design (**root `DESIGN.md`**) -> Development -> Hardening -> Ship.  
(Optional legacy mirror: `docs/DESIGN.md` — keep in sync only if your team still references that path.)

## Design system (`DESIGN.md`) — parity with Cursor

- **Catalog:** `.nezam/design-hub/design/<brand>/design.md`
- **Contract:** repository root **`DESIGN.md`** — create with `pnpm run design:apply -- <brand>` or follow mirrored `start` / `START` command text from `.cursor/commands/start.md` in your client’s synced commands folder.
- **Cross-client map:** [`.nezam/core/memory/MULTI_TOOL_INDEX.md`](.nezam/core/memory/MULTI_TOOL_INDEX.md)

## SDD hardlock

Do not proceed to development unless all exist:

- `.nezam/core/prd/PRD.md`
- `docs/start/PROJECT_PROMPT.md`
- **`DESIGN.md` at repository root** for UI scopes (from chosen `.nezam/design-hub/design/<brand>/design.md`)
- `.nezam/core/gates/GITHUB_GATE_MATRIX.json`
- `.nezam/core/plans/<phase>/<subphase>/{prompt.json,PROMPT.md}`

## Learned User Preferences

- When implementing an attached plan, do not modify the plan file; reuse existing todo items and advance them from in_progress through completed in order; stay in scope, run listed verification, and report touched files plus verification outputs.
- For high-impact AI releases, default mandatory approvers to CTO or engineering head, legal or compliance, responsible AI or ethics lead, and security or privacy lead unless the user supplies a different sign-off map.
- Edit `.cursor/` as the sole canonical source for agents, commands, rules, and skills. Tier-1 `.agents/` mirrors (`.agents/rules/`, `.agents/skills/nezam-*`) and other tool directories (`.claude/`, `.antigravitycli/`, etc.) are generated—never edit or commit them as source. Non-`nezam-*` skills belong only under `.cursor/skills/`. Revise learned memory in `.nezam/templates/ai-client/AGENTS.md.template.md` only; update `.nezam/core/memory/MULTI_TOOL_INDEX.md` when cross-client workflow text changes; then run `pnpm ai:sync` (and `pnpm ai:check` when touching shared contracts).
- When expanding swarm-style orchestration, align leadership with PM-01, ARCH-01, DESIGN-01, FE-01, and BE-01 as primary authorities over specialist agents.
- **Continual Learning defaults off** until **`/START continual-learning`** or `pnpm continual-learning:on` sets `.cursor/hooks/state/continual-learning.json` → `enabled: true`. While off, `pnpm continual-learning` / prepare skip work and do not update transcript indexes. Clear incremental transcript state only with `pnpm continual-learning:reset-memory` (does not remove existing bullets from the template). When enabled, mine Cursor agent transcripts for durable preferences and stable workspace facts, merge net-new bullets only into `.nezam/templates/ai-client/AGENTS.md.template.md`, bump `.cursor/hooks/state/continual-learning-index.json` for processed transcript files, then run `pnpm ai:sync` so generated AGENTS mirrors stay aligned.
- Keep README narrative in English; represent Arabic/MENA agents, skills, and RTL themes with diagrams or structural sections rather than Arabic prose in README body text. Keep narrative docs under `docs/` and raster assets under `docs/assets/`, not the repository root.
- **Arabic Language Preference:** When Arabic is chosen or required, default to **Egyptian Arabic** (Masri) for this project's Cairo/Sahel context, not MSA. Planning agents enforce SDD hardlocks, `.nezam/core/plans/INDEX.md` traceability, and `masri-content-specialist` review when MENA content applies.
- **Token economy:** Lead prompts with static contracts (`AGENTS.md`, `CLAUDE.md`, `DESIGN.md`); reference paths and line ranges instead of pasting full files; compress handoffs via compact YAML in `.cursor/state/agent-bus.yaml`.
- **Search and Index Hygiene:** Keep synced client directories (`.claude/**`, `.gemini/**`, `.antigravity/**`, `.antigravitycli/**`, `.agents/skills/nezam-commands/**`, `.agents/skills/nezam-sync/**`, etc.) in workspace `search.exclude` and `files.exclude` to avoid double indexing.
- **Design Hub UI:** Treat Architecture `page`/`subpage` nodes as wireframe source of truth (1:1 sessions, Save before lock/export); wireframe block stacks mirror Preview sections; use shared `LeftPanelHeader` (Title → Tabs → Search → content, `h-10` title row) and matching sidebar `p-4` + `-mx-4` bleed; use semantic `app-*` tokens (light/dark) mapped in `tailwind.config.ts`, theme on `document.documentElement`, `tailwindcss-animate` for overlays.
- **External design skills:** Vendor third-party UI skills (Emil Kowalski motion, Taste v2 anti-slop, Impeccable critique, Google Stitch `DESIGN.md`) under `.cursor/skills/` with a governed manifest and `pnpm ai:sync`—not registry-only. Use opt-in `designSkillStack` in `prompt.json` so prompt/design agents assemble per phase from PRD + root `DESIGN.md`; never inject the full design skill library into every prompt by default.

## Learned Workspace Facts

- Execution plans and SDD tasks live under `.nezam/core/plans/` (optional `.cursor/plans/` for Cursor plan files). Locked PRD path: `.nezam/core/prd/PRD.md`—when editing PRD, keep `docs/plan/00-define/01-product/PRD.md` and `docs/start/PRD.md` copies aligned. Develop hardlock requires `wireframes_locked.json` at repo root or `.session/`.
- AI ethics audit outputs belong under `.nezam/core/reports/audits/` per docs reports policy. Optional swarm Mermaid sources: `.nezam/core/architecture/mermaids/`.
- **Design Hub (v2) Architecture:** `+ Add` creates `application` | `menu` | `page` | `service` with type-specific detail panels; `MicroServicesServerRack` sits above the app tree—catalog services in the rack, apps below, nav menus inside apps; developer catalog (~80 providers) at `.nezam/design-hub/src/data/design-hub/developer-services-catalog.json` with Simple Icons via `BrandIcon`, pick via `ServiceCatalogPicker`, wire with `wiredServiceIds`; `ArchRightRail` hosts `ServiceIntegrationGuide` plus theme/design-system panels (not under the rack).
- **Design Hub Wireframes:** Sessions persist as `.session/pages/{archPageId}.json` keyed by stable Architecture IDs; lock export maps to `PAGE-001`… via `arch_page_id` (`arch-page-map.ts`, `session-resolver.ts`). Editor canvas renders blocks via `ShadcnBlockPreview` in `shadcn-block-previews.tsx` (~28 types from `block_registry.json`, routed by `block-preview-map.ts`); canvas slots pass `showCaption={false}` on `WireframeBlockPreview` so only `WireframeBlockSlot` footer shows the label. UI: `WireframePageTree`, palette + `seed-page-session` for empty pages; apply `layout-catalog.json` shells before blocks fill the content slot.
- **Design Hub app:** Package at `.nezam/design-hub/` (Next.js); run `pnpm test` / `pnpm build` there for wireframe and lock-path changes. Top-level **Components** (`ComponentsSection`) browses `shadcn-component-registry.json`—not a Preview sub-tab; Preview keeps **Pages** + **Sections** only.
- **Multi-tool sync mirrors:** `.agents/rules/` and `.agents/skills/nezam-*` are generated by `pnpm ai:sync`; broken symlinks in mirror skill dirs (e.g. stale `impeccable` links under `.claude/skills/`) can fail sync with ENOENT—remove broken links before re-sync.
- **Skill integrity:** `.cursor/skills/**/SKILL.md` frontmatter must include `tier` (1|2|3) and `version` for `pnpm ai:check`.
- **Antigravity CLI:** Tier 1 tool id `antigravitycli`; sync outputs `.antigravitycli/` plus `.agents/skills/nezam-commands/` and `.agents/skills/nezam-sync/` for `agy` discovery.
- **Gate and canonical paths:** `.nezam/core/gates/hardlock-paths.json` resolves intake/planning paths for `/START`; canonical architecture is `.nezam/core/architecture/ARCHITECTURE.md`; CI gate manifest is `.nezam/core/gates/GITHUB_GATE_MATRIX.json` (full schema with 13 gates).
