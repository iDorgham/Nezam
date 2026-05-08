# Context Pack

This is the primary upload/briefing document for AI assistants when file-count limits are strict.

## Pipeline Contract

Planning -> SEO -> IA -> Content -> Design -> Development -> Hardening/Release.

Use Specification-Driven Development with repository docs as source of truth.

## Core Paths

- Product requirements (contract): `docs/core/required/prd/PRD.md`
- Product requirements (current workspace): `docs/reference/prd/PRD.md`
- SDD docs: `docs/core/required/sdd/`
- Feature specs: `docs/core/required/features/`
- Design authority (selected profile): `.cursor/design/<brand>/design.md`
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
- Last updated UTC: 2026-05-08T11:10:00+00:00
- Current git branch: template-prep
- Last commit: 260950f reorganize docs and scripts into category folders; update references
- Current phase guess: planning/design governance
- PRD present: yes
- Design present: yes
- Progress report present: yes
AUTO-MANAGED:END
