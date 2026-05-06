# Workspace Context (Canonical)

This file tracks execution state for assistants and humans during delivery.

## Human-Edited Notes

- Use this area for ad-hoc constraints, temporary priorities, and callouts.
- Do not place volatile runtime metadata here.
- Planning scaffold exists at root `plan/` and is now the active execution tracker for phased delivery.
- Treat `plan/*/TASKS.md` gate rows as advancement controls; do not mark later phase tasks done before upstream phase gate completion.

## Active Workflow

- Required pipeline: Planning -> SEO -> IA -> Content -> Design -> Development -> Product
- Method: Specification-Driven Development (SDD)
- Current planning execution artifact: root `plan/` tree with MT/PT traceability and SemVer trigger mapping.

## Current Blockers (Human)

- None recorded.

AUTO-MANAGED:BEGIN
## Auto-Managed Runtime Snapshot

- Last updated UTC: 2026-05-06T14:21:13+00:00
- Current git branch: template-prep
- Last commit: 66b8e35 chore: bootstrap COIA Cursor orchestration kit
- Last tag: unknown
- Repo has remote origin: no
- Current phase guess: SEO

## Auto-Managed Artifact Status

- PRD: `docs/specs/prd/PRD.md` (present)
- Project prompt: `docs/prompts/PROJECT_PROMPT.md` (present)
- SEO research: `docs/specs/sdd/SEO_RESEARCH.md` (missing)
- Design prototype: `DESIGN.md` (present)
- Progress report: `docs/reports/PROGRESS_REPORT.latest.md` (present)

## Auto-Managed Next Checkpoint

- Suggested next command: `/PLAN all`
- Reason: continue phase progression with dependency checks
AUTO-MANAGED:END