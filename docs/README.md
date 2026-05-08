# Docs Structure

This `docs/` layout is optimized for easy-to-remember paths.

## Main folders

- `docs/process/` — process and release protocols
- `docs/workspace/` — workspace internals
  - `docs/workspace/context/` — memory, context, governance docs
  - `docs/workspace/plans/` — SDD plans, gates, task trees
  - `docs/workspace/templates/` — reusable templates
- `docs/reference/` — archived reference material moved from old required archive
- `docs/reports/` — generated reports (audits, tests, progress, etc.)
- `docs/core/required/` — intake-only hardlock files (`PRD.md`, `PROJECT_PROMPT.md`, `README.md`)

## Compatibility paths kept

To avoid breaking existing scripts and rules, these legacy paths are still available as symlinks:

- `docs/workspace/context` -> `docs/workspace/context`
- `docs/workspace/plans` -> `docs/workspace/plans`
- `docs/workspace/templates` -> `docs/workspace/templates`
- `docs/reference` -> `docs/reference`
- `docs/process` -> `docs/process`

Use the new paths for future docs updates.
# Documentation

The `docs/` root stays small: only **`core/`** (canonical working docs) and **`reports/`** (generated scan/test/progress outputs).

## `docs/core/` — canonical source

| Path | Purpose |
| --- | --- |
| [`core/context/`](core/context/) | Memory, workspace index, CONTEXT, governance aliases |
| [`core/plan/`](core/plan/) | SDD phase plans, gates manifest, MASTER_TASKS |
| [`core/required/`](core/required/) | PRD, PROJECT_PROMPT, SDD outputs, handoff prompts |
| [`core/templates/`](core/templates/) | Templates consumed by `/CREATE` and generators |

**Hardlock anchors (examples):**

- `docs/core/required/prd/PRD.md`
- `docs/core/required/PROJECT_PROMPT.md`
- `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`
- Root `docs/DESIGN.md` (design contract; stays at repo root by convention)

## `docs/reports/` — generated artifacts only

| Path | Purpose |
| --- | --- |
| [`reports/README.md`](reports/README.md) | Index and policy |
| [`reports/progress/`](reports/progress/) | `PROGRESS_REPORT.latest.md`, dated snapshots |
| [`reports/tests/`](reports/tests/) | `TEST_MATRIX.md`, test digests |
| [`reports/a11y/`](reports/a11y/) | Accessibility scan outputs |
| [`reports/perf/`](reports/perf/) | Performance / profiling notes |
| [`reports/lighthouse/`](reports/lighthouse/) | Lighthouse / CWV summaries |
| [`reports/security/`](reports/security/) | Security / dependency audit summaries |
| [`reports/coverage/`](reports/coverage/) | Coverage summaries |
| [`reports/audits/`](reports/audits/) | Combined `/SCAN all`, `/FIX` triage logs |

Do **not** hand-edit generated client mirrors (`AGENTS.md`, `CLAUDE.md`, `.claude/`, etc.) — run `pnpm ai:sync` from `.cursor/` sources.

## Layout enforcement

CI runs `scripts/checks/docs-layout-policy.sh` to block legacy paths (`docs/context/`, `docs/plan/` at top level, etc.).

## Quick links

- Multi-tool client map: [`core/context/MULTI_TOOL_INDEX.md`](core/context/MULTI_TOOL_INDEX.md)
- Orchestration aliases: [`core/context/governance/ORCHESTRATION_ALIASES.md`](core/context/governance/ORCHESTRATION_ALIASES.md)
