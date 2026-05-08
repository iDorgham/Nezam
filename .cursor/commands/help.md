---
description: HELP — command index + safe routing fallbacks (no gate bypass).
---

# /HELP

You are coordinating **/HELP** — a centralized index/router for this workspace’s command surface.

## Behavior

- If the user asks "what should I run?" or provides unclear intent, output:
  1. A short **routing suggestion** (one best command + subcommand).
  2. A one-line **why**.
  3. A **fallback** if the first choice fails.
- Never bypass SDD gates: if the suggested command has required preflights (e.g. `/START gates`, `/PLAN` prerequisites), point the user to those gates first.

## Command Index

Format: `/<COMMAND> <subcommand>` (use `<subcommand>` = `help` to list options).

| Command | Subcommands (short) | default → |
|---|---|---|
| `/FOUNDER` | `idea, status, help` | `idea` |
| `/START` | `repo, docs, prompts, companion, prd, prompt, gates, report, all` | `all` |
| `/PLAN` | `seo, ia, content, design, versioning, roadmap, phases, specs, docs, all` | `all` (after gates) |
| `/CREATE` | `prd, prompt, design, sdd, seo, spec, report, agent, skill, claude-*` | `all` |
| `/GUIDE` | `next, status, recommend` | navigator |
| `/DEVELOP` | `start, analyze, slice, feature, review, audit, run, test, perf` | `start` |
| `/SCAN` | `security, deps, code, seo, a11y, perf, all` | `all` |
| `/FIX` | `triage, patch, verify, auto, audit, security, perf, lint` | `triage` |
| `/SAVE` | `report, log, commit, branch, sync, push, tagplan, release, hooks` | `report` |
| `/DEPLOY` | `rc, notes, tag, ship, verify, rollback, staging, prod, monitor` | `rc` |

## Fast Fallbacks

- Unknown command → run `/GUIDE next`
- Unsure readiness for planning → run `/START gates`

## Bonus Commands (Delegated Aliases)

Do **not** create new command template files for these. Treat them as user-facing aliases that route to existing flows:

- `/STATUS` → Use `/GUIDE status`, then (if present) read `docs/reports/progress/PROGRESS_REPORT.latest.md`.
- `/PROGRESS` → Use `/SCAN all`, then summarize `docs/reports/progress/PROGRESS_REPORT.latest.md` (or recommend `/SAVE report` to generate it if missing).
- `/REVIEW` → Use `/SCAN code`, then verify planning gates via `/START gates` (and reference `docs/workspace/plans/INDEX.md` if it exists).
- `/STOP` → Confirm pause, then recommend `/SAVE report` (or `/SAVE log`) to avoid losing context.
- `/RESET` → Warn about data loss; require explicit `confirm: true`. Then clear `.cursor/scratch/` **if it exists** (otherwise do nothing) and recommend rerunning `/START gates`.

## Subcommand Routing
User input after `/HELP` is treated as `<subcommand>`.
- `help` → Output: "Usage: /HELP\nExamples:\n/HELP\n/GUIDE next\nRun without args for the index and fallbacks."
- *(default)* → Output the Command Index + Fast Fallbacks.
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/HELP` for the index."
