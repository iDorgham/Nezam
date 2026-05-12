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

- **Catalog:** `.cursor/design/<brand>/design.md`
- **Contract:** repository root **`DESIGN.md`** — create with `pnpm run design:apply -- <brand>` or follow mirrored `start` / `START` command text from `.cursor/commands/start.md` in your client’s synced commands folder.
- **Cross-client map:** [`docs/nezam/memory/MULTI_TOOL_INDEX.md`](docs/nezam/memory/MULTI_TOOL_INDEX.md)

## SDD hardlock

Do not proceed to development unless all exist:

- `docs/specs/prd/PRD.md`
- `docs/prd/PROJECT_PROMPT.md`
- **`DESIGN.md` at repository root** for UI scopes (from chosen `.cursor/design/<brand>/design.md`)
- `docs/plans/gates/GITHUB_GATE_MATRIX.json`
- `docs/plans/<phase>/<subphase>/{prompt.json,PROMPT.md}`

## Learned User Preferences

- When implementing an attached plan, do not modify the plan file; reuse existing todo items and advance them from in_progress through completed in order instead of recreating them.
- For plan-driven execution, stay within stated scope and constraints, run verification steps the plan lists, and finish with a concise change report that includes touched files and verification outputs.
- For high-impact AI releases, default mandatory approvers to CTO or engineering head, legal or compliance, responsible AI or ethics lead, and security or privacy lead unless the user supplies a different sign-off map.
- When changing agents, commands, rules, or skills, edit `.cursor/` as canonical and run `pnpm ai:sync`; avoid hand-editing generated mirrors for those assets.
- When expanding swarm-style orchestration in this repo, align leadership with PM-01, ARCH-01, DESIGN-01, FE-01, and BE-01 as the primary authorities over specialist agents.
- Add or revise learned memory only in `docs/templates/ai-client/AGENTS.md.template.md`, then run `pnpm ai:sync` so root `AGENTS.md` and `.codex/AGENTS.md` regenerate correctly.
- **Continual Learning defaults off** until **`/START continual-learning`** or `pnpm continual-learning:on` sets `.cursor/hooks/state/continual-learning.json` → `enabled: true`. While off, `pnpm continual-learning` / prepare skip work and do not update transcript indexes. Clear incremental transcript state only with `pnpm continual-learning:reset-memory` (does not remove existing bullets from the template). When enabled, mine Cursor agent transcripts for durable preferences and stable workspace facts, merge net-new bullets only into `docs/templates/ai-client/AGENTS.md.template.md`, bump `.cursor/hooks/state/continual-learning-index.json` for processed transcript files, then run `pnpm ai:sync` so generated AGENTS mirrors stay aligned.
- For NEZAM README work, keep README body copy in English; represent Arabic/MENA agents, skills, and RTL themes with diagrams or structural sections (for example Mermaid) rather than Arabic wording inside README narrative text.
- Keep narrative documentation and doc-only images under `docs/`; place raster assets under `docs/assets/` instead of the repository root.
- When changing shared AI workflows or design-contract text that must match Claude, Codex, Antigravity, Gemini, Qwen, and similar clients, update `docs/templates/ai-client/` and `docs/nezam/memory/MULTI_TOOL_INDEX.md` alongside `.cursor/`, then run `pnpm ai:sync` and `pnpm ai:check`.

## Learned Workspace Facts

- Execution plans and SDD tasks live under `docs/plans/` (and optional local `.cursor/plans/` if your team uses Cursor plan files).
- AI ethics audit outputs and companion operational templates belong under `docs/reports/audits/` per the docs reports placement policy.
- Optional swarm- and skills-oriented Mermaid sources live under `docs/workspace/mermaids/` when that layout is maintained.
