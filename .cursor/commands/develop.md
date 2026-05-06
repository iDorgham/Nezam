---
description: DEVELOP — implement against signed specs/design prototypes; vertical slices.
---

You are coordinating **/DEVELOP**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | analyze | slice | frontend | backend | cms | animate | perf | test | run | phase | feature | start | review | audit`

- **analyze**: Map current tree vs specs; propose task graph + risk hotspots.
- **slice**: Deliver end-to-end vertical slice checklist (routing, UI, wiring, telemetry hooks if spec’d).
- **frontend / backend / cms / animate / perf**: Route change sets through appropriate architectural constraints; summon focused subagent mental model (reactivity, SSR/CSR decision log, animations budget, Lighthouse targets); persona hints under `.cursor/agents/` (e.g. `fe-dev.md`, `be-dev.md`).
- **test**: Outline + implement tests mandated by specs.
- **run**: Identify exact local commands from repo/package managers; propose background-safe dev invocation patterns.
- **phase**: Scope work to a named plan phase (from `docs/specs/sdd/PHASES.md` or roadmap); list exit criteria before coding.
- **feature**: Drive a single feature/epic folder under `docs/specs/features/<id>-<slug>/` end-to-end (implementation + tests + doc touch-ups).
- **start**: Session kickoff checklist — confirm active spec, branch, and `/SAVE report` expectation for end-of-day external handoff.
- **review**: Merge-readiness pass vs `DESIGN.md` + acceptance criteria; call out drift and missing tests.
- **audit**: Lightweight implementation audit before `/SCAN all` (risk hotspots, TODO debt, env assumptions).

Strictly reconcile code with **`DESIGN.md` prototype text/layout** unless a decision record amended design.

Upon meaningful progress, refresh `docs/reports/PROGRESS_REPORT.latest.md` via `/SAVE report` pattern (see `@external-ai-report`).

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/DEVELOP` is treated as `<subcommand>`.
- `help` → Output: "Usage: /DEVELOP <subcommand>\nOptions: help | analyze | slice | frontend | backend | cms | animate | perf | test | run | phase | feature | start | review | audit\nExamples:\n/DEVELOP start\n/DEVELOP slice\nRun without args for default flow."
- `analyze` / `slice` / `frontend` / `backend` / `cms` / `animate` / `perf` / `test` / `run` / `phase` / `feature` / `start` / `review` / `audit` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/DEVELOP start` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/DEVELOP help` for options."
