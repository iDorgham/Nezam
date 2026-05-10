# NEZAM — Context Pack

> **`/command` do everything.**

This is the primary upload/briefing document for AI assistants when file-count limits are strict.

## Token Cache Hint
> These files are re-read every session and are prime candidates for prompt caching:
> 1. `docs/memory/CONTEXT.md` (this file)
> 2. `docs/memory/MEMORY.md`
> 3. `docs/memory/PHASE_HANDOFF.md`
> 4. Active SPEC.md for current feature
> Load via path reference, not content paste.

## Pipeline Contract

Planning → SEO → IA → Content → Design → Development → Hardening/Release.

Use Specification-Driven Development with repository docs as source of truth.

## Core Paths

- Product requirements (contract): `docs/core/required/prd/PRD.md`
- Product requirements (reference copy when used): `docs/prd/PRD.md`
- SDD docs: `docs/core/required/sdd/`
- Feature specs: `docs/core/required/features/`
- Design catalog: `.cursor/design/<brand>/design.md` — **project design system:** root `DESIGN.md` (copy chosen profile with `/START design` or `pnpm run design:apply -- <brand>`)
- Tech stack reference: `docs/reference/developer-tech-stack-2026.md` — BaaS, AI, auth, payments, media, infra, observability catalog with CLI/MCP availability
- AI tools context: `docs/memory/CLI_TOOLS_CONTEXT.md` — routing matrix, profiles, fallback chains
- Workspace settings: `.cursor/workspace.settings.yaml` — active tools, routing switches, onboarding state
- Test matrix: `docs/reports/tests/TEST_MATRIX.md`
- Progress report: `docs/reports/progress/PROGRESS_REPORT.latest.md`
- Prompt docs: `docs/core/required/` (or active planning package under `docs/plans/`)

## AI Upload Bundle (1-4 Files)

Default minimal pack:

1. `docs/memory/CONTEXT.md`
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
- Keep durable decisions in `docs/memory/MEMORY.md`.
- **Drift recovery:** after local edits to mirrored AI client folders outside `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check` before commit.
- Keep generated outputs in `docs/reports/<category>/` only.

AUTO-MANAGED:BEGIN
## Auto-Managed Snapshot
P26-05-10T15:10:26Z
- Current git branch: template-prep
- Last commit: 30d7b1c chore(workspace): finalize phase-2 routing and README polish
- Current phase guess: Onboarding
- PRD present: no
- Design present: no
- Progress report present: yes
AUTO-MANAGED:END
