# Project Context (Canonical)

This file stores durable product truth and progress checkpoints for assistants.

## Product Mission (Human)

- Define the target user, JTBD, and differentiated value proposition.

## Delivery Model (Human)

- Planning style: SDD
- Sequencing: SEO-first, design-prototype before production UI

## Architecture & Scope Notes (Human)

- **Active design brand:** `default` (Neutral Modern). Canonical file: [`.cursor/design/default/design.md`](../../.cursor/design/default/design.md). Full catalog: [`.cursor/design/README.md`](../../.cursor/design/README.md).
- **Switching brands:** set `Active design brand` to another folder name under `.cursor/design/` (each folder name is the brand), then reconcile root [`DESIGN.md`](../../DESIGN.md) with that brand’s `design.md`.
- Add major decisions and links to specs here.
- Execution planning baseline is tracked in `plan/`:
  - `plan/MASTER_TASKS.md` for master outcomes.
  - `plan/INDEX.md` for MT-to-PT traceability and phase gates.
  - Phase and sub-phase `TASKS.md` files for delivery sequencing.
- Scope progression is currently modeled as:
  - content foundation -> design system -> build -> harden -> ship.

## Companion Upload Pack (Human + Auto)

- Upload this file together with `docs/reports/PROGRESS_REPORT.latest.md`.
- Include `DESIGN.md` and `docs/specs/sdd/SEO_RESEARCH.md` whenever available.

AUTO-MANAGED:BEGIN
## Auto-Managed Progress Index

- Last updated UTC: 2026-05-06T14:21:13+00:00
- Active branch: template-prep
- Latest tracked phase: SEO

## Auto-Managed Artifact Links

- PRD: `docs/specs/prd/PRD.md` (present)
- Roadmap: `docs/specs/sdd/ROADMAP.md` (missing)
- Versioning: `docs/specs/sdd/VERSIONING.md` (present)
- SEO research: `docs/specs/sdd/SEO_RESEARCH.md` (missing)
- Design doc: `DESIGN.md` (present)
- Latest report: `docs/reports/PROGRESS_REPORT.latest.md` (present)

## Auto-Managed Prompt Snippets

```prompt
Upload docs/reports/PROGRESS_REPORT.latest.md + key docs (DESIGN.md, SEO_RESEARCH.md, active SPEC) and critique gaps by phase.
```
AUTO-MANAGED:END