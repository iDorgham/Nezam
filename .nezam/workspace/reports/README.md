# Generated reports

All machine- or assistant-generated **reports** live under `docs/reports/<category>/`.

Approved categories:

| Folder | Purpose |
| --- | --- |
| `a11y/` | Accessibility scans and audits |
| `audits/` | Fix triage, combined reviews |
| `coverage/` | Test coverage summaries |
| `lighthouse/` | Lighthouse / CWV exports |
| `perf/` | Profiling, bundle analysis |
| `progress/` | Progress reports, handoffs |
| `security/` | Security scan summaries |
| `tests/` | Test matrices, failure digests |
| `html/` | Static HTML exports (reference packs, snapshots) |

Rolling health snapshots live under `progress/` (for example `HEALTH.latest.md`), not at `docs/reports/` root.

Canonical working docs (PRD, SDD, plans, templates) live under [`docs/core/`](../core/).

See each category `README.md` for naming and ownership.
