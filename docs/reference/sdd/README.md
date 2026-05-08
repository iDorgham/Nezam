# SDD workspace

Generated/evolved primarily via `/PLAN sdd`.

**External patterns:** [EXTERNAL_PATTERN_INTEGRATION_AUDIT.md](EXTERNAL_PATTERN_INTEGRATION_AUDIT.md) · [CURATED_SKILLS_QUEUE.md](CURATED_SKILLS_QUEUE.md)

## Required files before `/DEVELOP`

- `ROADMAP.md`
- `PHASES.md`
- `SEO_RESEARCH.md`
- `IA_CONTENT.md`
- `VERSIONING.md`
- `docs/DESIGN.md` (repo root when present, generated from design template)
- `docs/workspace/plans/04-harden/perf.md` populated with release budgets and stop conditions
- Architecture/data docs as complexity demands

## Stage exit checklist

| Stage | Required outputs | Gate to continue |
| ----- | ---------------- | ---------------- |
| Planning | Roadmap + phases + scoped spec identifiers | Scope agreed and sequenced |
| SEO / IA | `SEO_RESEARCH.md` + `IA_CONTENT.md` | Labels/routes/content map locked |
| Content | Page/section copy map and metadata stubs | Content map aligns with IA |
| Design | `docs/DESIGN.md` with token/type/motion/3D/component contracts | Design-dev gates satisfied |
| Development | Feature specs + implementation slices | No gate violations in rules |
| Hardening | Perf/a11y evidence in `docs/workspace/plans/04-harden/perf.md` | LCP/CLS/INP and WCAG targets pass |