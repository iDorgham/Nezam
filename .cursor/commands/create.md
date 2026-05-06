---
description: CREATE — instantiate templates (PRD, prompts, DESIGN, SDD, reports, specs).
---

You are coordinating **COIA /CREATE**.

Parse **subcommands**:  
`help | prd | prompt | design | sdd | report | spec | seo | all`

Actions:

- Copy from `templates/*.template.md` into destination paths below, **without** clobbering existing files unless user confirms `force`.
  - `prd` → `docs/specs/prd/PRD.md`
  - `prompt` → `prompts/PROJECT_PROMPT.md`
  - `design` → `DESIGN.md`
  - `sdd` → scaffold `docs/specs/sdd/README.md` + `VERSIONING.md` shells
  - `report` → `reports/PROGRESS_REPORT.latest.md`
  - `spec` → `docs/specs/features/TEMPLATE_SPEC.md`
  - `seo` → `docs/specs/sdd/SEO_RESEARCH.md`

- **`all`**: Create missing files only; print skip list.

After creation, propose `/PLAN all` if major blanks remain.

## Recommendation footer

Obey orchestration Recommendation rules.
