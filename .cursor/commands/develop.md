---
description: DEVELOP — implement against signed specs/design prototypes; vertical slices.
---

You are coordinating **/DEVELOP**.

## PM-01 routing authority

PM-01 is the first routing authority for `/DEVELOP`. Run PM-01 hardlock checks before any implementation behavior, then delegate to FE-01/BE-01 and domain specialists as needed.

Execution routing contract:
- Resolve subcommand with `@slash-command-router`.
- Enforce gates with `@sdd-hardlock-manager` before any implementation action.
- For large scopes, apply `@context-window-manager` + `@token-budget-manager`.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | analyze | slice | frontend | backend | cms | animate | perf | test | run | phase | feature | start | review | audit`

## Required preflight (hard block)

Before any implementation-oriented behavior:

- `docs/core/required/PRD.md` exists.
- `docs/core/required/PRD.md` is fully prepared (not template/placeholder).
- `docs/core/required/PROJECT_PROMPT.md` exists.
- `docs/core/required/PROJECT_PROMPT.md` is aligned with PRD scope (same product intent, no conflicting framing).
- `CHANGELOG.md` exists at workspace root (initialized).
- `docs/core/VERSIONING.md` exists and locks SemVer rules + initial version.
- Architecture artifact exists at one of:
  - `docs/03_architecture/ARCHITECTURE.md` (preferred), or
  - `docs/core/required/architecture/ARCHITECTURE.md` (legacy-compatible).
- Design artifact exists at one of:
  - `DESIGN.md` (preferred), or
  - `docs/DESIGN.md` (legacy-compatible).
- `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` exists.
- Every active sub-phase in `docs/workspace/plans/**` contains both:
  - `prompt.json`
  - `PROMPT.md`

If any check fails, halt `/DEVELOP` and route user to `/GUIDE status` with explicit unlock steps.

- **analyze**: Map current tree vs specs; propose task graph + risk hotspots.
- **slice**: Deliver end-to-end vertical slice checklist (routing, UI, wiring, telemetry hooks if spec’d).
- **frontend / backend / cms / animate / perf**: Route change sets through appropriate architectural constraints; summon focused subagent mental model (reactivity, SSR/CSR decision log, animations budget, Lighthouse targets); persona hints under `.cursor/agents/` (e.g. `fe-dev.md`, `be-dev.md`).
- **test**: Outline + implement tests mandated by specs.
- **test**: Include `@regression-detector` for change-impact mapping and uncovered path checks before declaring readiness.
- **run**: Identify exact local commands from repo/package managers; propose background-safe dev invocation patterns.
- **phase**: Scope work to a named plan phase (from `docs/core/required/sdd/PHASES.md` or roadmap); list exit criteria before coding.
- **feature**: Before implementation, pass the natural-language feature request through `@coi-skill-composer` to auto-resolve the skill stack and execution order; then drive a single feature/epic folder under `docs/core/required/features/<id>-<slug>/` end-to-end (implementation + tests + doc touch-ups).
- **start**: Session kickoff checklist — confirm active spec, branch, gate profile from `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`, required `.env` keys, and `/SAVE report` expectation for end-of-day external handoff.
- **start design source selection (required)**: before reporting kickoff readiness, list available design sources under `.cursor/design/*/design.md` and ask the user to choose one profile.
- **start design copy step (required)**: after user selection, copy the selected profile file to root `DESIGN.md` in the workspace. If `DESIGN.md` already exists, confirm overwrite intent; if approved, replace it with the selected profile content. Development kickoff remains blocked until this copy step completes.
- **review**: Merge-readiness pass vs `docs/DESIGN.md` + acceptance criteria; call out drift and missing tests.
- **review**: Run `@reflection-loop-engine` (max 3 loops) for quality/risk self-check before presenting final go/no-go.
- **audit**: Lightweight implementation audit before `/SCAN all` (risk hotspots, TODO debt, env assumptions).

## Team-runtime routing

For non-trivial slices, use fixed-team routing:
- Manager: `manager.md`
- Team leader: `tech-lead.md` (or domain leader such as `dba.md`, `devops.md`, `designer.md`, `security.md`)
- Specialists: domain-specific contributors (`fe-dev`, `be-dev`, `qa`, `gitops`, `content`, etc.)

Runtime requirements:
- Define manager/leader/specialists before execution.
- Use handoff packet requirements from `@coi-multi-agent-handoff`.
- Enforce non-overlapping `allowed_files` across parallel tracks.
- Close each slice with `go` or `no-go` or `replan` and one next legal command.

Strictly reconcile code with **`DESIGN.md` prototype text/layout** unless a decision record amended design.

Upon meaningful progress, refresh `docs/reports/progress/PROGRESS_REPORT.latest.md` via `/SAVE report` pattern (see `@external-ai-report`).

## Library/DS/Content swarm execution extension

For implementation tracks using library/design-system/content swarm routing:

1. Start from approved planning artifacts (`SWARM_TASK`, `LIBRARY_DS_MAP`, `SWARM_HANDOFF`).
2. Enforce ownership metadata per artifact:
   - `ownerTeam`
   - `requiredSkills`
   - `appliedRules`
3. Execute content pipeline in order when content is in scope:
   - Content Bridge emits `ContentSpecSchema`
   - Content Creator emits constrained copy and marks `CONTENT_ADJUSTED: true` if truncation occurred
4. Require validation output on each pass:
   - contrast status
   - RTL/dark-light parity status
   - bundle impact status
   - word-limit compliance status
5. Close execution with `SWARM_COMPLETE` artifact and `go|no-go|replan`.

Generated run outputs must be written to policy paths under `docs/reports/**`.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/DEVELOP` is treated as `<subcommand>`.
- `help` → Output: "Usage: /DEVELOP <subcommand>\nOptions: help | analyze | slice | frontend | backend | cms | animate | perf | test | run | phase | feature | start | review | audit\nExamples:\n/DEVELOP start\n/DEVELOP slice\nRun without args for default flow."
- `analyze` / `slice` / `frontend` / `backend` / `cms` / `animate` / `perf` / `test` / `run` / `phase` / `feature` / `start` / `review` / `audit` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/DEVELOP start` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/DEVELOP help` for options."
