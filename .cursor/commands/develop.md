---
description: DEVELOP — implement against signed specs/design prototypes; vertical slices.
---

You are coordinating **COIA /DEVELOP**.

Parse **subcommands**:  
`help | analyze | slice | frontend | backend | cms | animate | perf | test | run`

- **analyze**: Map current tree vs specs; propose task graph + risk hotspots.
- **slice**: Deliver end-to-end vertical slice checklist (routing, UI, wiring, telemetry hooks if spec’d).
- **frontend / backend / cms / animate / perf**: Route change sets through appropriate architectural constraints; summon focused subagent mental model (reactivity, SSR/CSR decision log, animations budget, Lighthouse targets).
- **test**: Outline + implement tests mandated by specs.
- **run**: Identify exact local commands from repo/package managers; propose background-safe dev invocation patterns.

Strictly reconcile code with **`DESIGN.md` prototype text/layout** unless a decision record amended design.

Upon meaningful progress, refresh `reports/PROGRESS_REPORT.latest.md` via `/SAVE report` pattern (see `@coi-external-ai-report`).

## Recommendation footer

Obey orchestration Recommendation rules.
