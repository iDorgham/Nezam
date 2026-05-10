# NEZAM — Context Pack

> **`/command` do everything.**

This is the primary upload/briefing document for AI assistants when file-count limits are strict.

## Token Cache Hint
> These files are re-read every session and are prime candidates for prompt caching:
> 1. `docs/workspace/context/CONTEXT.md` (this file)
> 2. `docs/workspace/context/MEMORY.md`
> 3. `docs/workspace/context/PHASE_HANDOFF.md`
> 4. Active SPEC.md for current feature
> Load via path reference, not content paste.

## Pipeline Contract

Planning → SEO → IA → Content → Design → Development → Hardening/Release.

Use Specification-Driven Development with repository docs as source of truth.

## Core Paths

- Product requirements (contract): `docs/core/required/prd/PRD.md`
- Product requirements (reference copy when used): `docs/reference/prd/PRD.md`
- SDD docs: `docs/core/required/sdd/`
- Feature specs: `docs/core/required/features/`
- Design catalog: `.cursor/design/<brand>/design.md` — **project design system:** root `DESIGN.md` (copy chosen profile with `/START design` or `pnpm run design:apply -- <brand>`)
- Tech stack reference: `docs/reference/developer-tech-stack-2026.md` — BaaS, AI, auth, payments, media, infra, observability catalog with CLI/MCP availability
- AI tools context: `docs/workspace/context/CLI_TOOLS_CONTEXT.md` — routing matrix, profiles, fallback chains
- Workspace settings: `.cursor/workspace.settings.yaml` — active tools, routing switches, onboarding state
- Test matrix: `docs/reports/tests/TEST_MATRIX.md`
- Progress report: `docs/reports/progress/PROGRESS_REPORT.latest.md`
- Prompt docs: `docs/core/required/` (or active planning package under `docs/workspace/plans/`)

## AI Upload Bundle (1-4 Files)

Default minimal pack:

1. `docs/workspace/context/CONTEXT.md`
2. `docs/core/required/prd/PRD.md`
3. `docs/reports/progress/PROGRESS_REPORT.latest.md`

Optional fourth file:

4. `docs/DESIGN.md` (for UI work) or active spec from `docs/core/required/features/`

## External Assistant Guidance

- Never assume unseen files.
- Work from uploaded docs only.
- Prioritize actionable next steps.
- Keep recommendations aligned with the pipeline order.
- For Claude CLI/Code usage, rely on prompt files under `docs/core/required/`.

## Working Notes

- Active design brand is managed under `.cursor/design/`.
- Keep durable decisions in `docs/workspace/context/MEMORY.md`.
- **Drift recovery:** after local edits to mirrored AI client folders outside `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check` before commit.
- Keep generated outputs in `docs/reports/<category>/` only.

AUTO-MANAGED:BEGIN
## Auto-Managed Snapshot
P26-05-10T12:32:50Z
- Current git branch: template-prep
- Last commit: 0786529 chore(workspace): sync context docs and continual-learning hook state
- Current phase guess: Onboarding
- PRD present: no
- Design present: no
- Progress report present: yes
- Tech stack reference: `docs/reference/developer-tech-stack-2026.md` (use when wired in PU-03)
- Memory (v2): `docs/workspace/context/MEMORY.md`
- Phase handoff: `docs/workspace/context/PHASE_HANDOFF.md`
- Agents (approx.): `.cursor/agents/` ~117 active markdown charters; `archive/` ~10 archived
AUTO-MANAGED:END
