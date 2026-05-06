---
description: START — Onboard repo/docs + external companion (GROK/Qwen) handoff scaffolding.
---

You are coordinating **/START**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | repo | docs | prompts | companion | prd | prompt | gates | report | all`

- **repo**: Guide user to attach/clone/import Git repo first; propose `git status`, default branch protections, upstream remote. If absent, scripted init path (no secrets).
- **docs**: Ensure tree `docs/specs/prd/`, `docs/specs/sdd/`, `docs/context/`, `docs/prompts/`, `docs/reports/`, `docs/templates/` exists; copy templates when missing.
- **docs**: Ensure canonical context docs exist:
  - `docs/context/instructions.md`
  - `docs/context/workspace.md`
  - `docs/context/project.md`
- **prompts**: Bootstrap `docs/prompts/PROJECT_PROMPT.md` + link to PRD; define hand-off language for external AI.
- **companion**: Summarize `docs/external-ai/GROK_INSTRUCTIONS.md` so user can paste into browser AI; stress uploading latest `docs/reports/PROGRESS_REPORT.latest.md` plus `docs/context/workspace.md` and `docs/context/project.md`.
- **prd**: Shortcut — same outcome as `/CREATE prd` (scaffold `docs/specs/prd/PRD.md` from template when missing).
- **prompt**: Shortcut — same outcome as `/CREATE prompt` (scaffold `docs/prompts/PROJECT_PROMPT.md` when missing).
- **gates**: Hard-block `/PLAN` readiness unless all checks pass:
  1. GitHub repo import/attach is complete (remote exists; run `git remote -v` to verify).
  2. `docs/specs/prd/PRD.md` exists.
  3. `docs/prompts/PROJECT_PROMPT.md` exists.
  4. Site archetype decision exists (one-page/blog/company/portfolio/gallery/store + scroll paradigm).
  5. `docs/context/instructions.md`, `docs/context/workspace.md`, and `docs/context/project.md` exist.
  When any check fails, stop and print exact remediation (`/CREATE prd`, `/CREATE prompt`, repo attach/import guidance), then ask user to rerun `/START gates`.

  **When every gate passes**, print an explicit **Claude handoff** block before suggesting `/PLAN`:
  1. Run **`/CREATE claude-cli-prompt`** and **`/CREATE claude-code-handoff`** (optional **`/CREATE claude-md`** for root `CLAUDE.md`).
  2. **Claude CLI:** `cd` to repo root, run `claude` (see [Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)), paste the contents of **`docs/prompts/CLAUDE_CLI_PLAN.md`** into the session (or pipe/`claude -p` per [CLI reference](https://docs.anthropic.com/en/cli-reference) if appropriate).
  3. **Claude Code:** open this repo in the IDE extension; follow **`docs/prompts/CLAUDE_CODE_HANDOFF.md`** (same mission as the CLI prompt file).
  4. More detail: [`docs/external-ai/CLAUDE_CLI_AND_CODE.md`](../../docs/external-ai/CLAUDE_CLI_AND_CODE.md).
  5. After Claude finishes planning work in-repo, continue with **`/PLAN ...`** in Cursor for refinement or parity checks.
- **report**: Initialize `docs/reports/PROGRESS_REPORT.latest.md` shell with timestamp + phase.
- **all**: Run order `repo → docs → prompts → companion → report → gates`, listing blockers. When **`gates`** passes, include the same **Claude handoff** steps as above plus Recommendation to run **`/CREATE claude-cli-prompt`** / **`claude-code-handoff`** if those prompt files are still missing.

When running `all`, also recommend hook setup for auto-updating context docs:

```sh
bash scripts/context/install-context-hooks.sh
```

Invoke mental **team roles** only as labels for thoroughness: CEO/GM (prioritization), PM (phases), SEO (keywords), Content, UI/UX, Brand, Frontend, Backend, DB, CMS, Animation, Security, DevOps, Audit, Performance, Program Manager for dependencies.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/START` is treated as `<subcommand>`.
- `help` → Output: "Usage: /START <subcommand>\nOptions: help | repo | docs | prompts | companion | prd | prompt | gates | report | all\nExamples:\n/START gates\n/START all\nRun without args for default flow."
- `repo` / `docs` / `prompts` / `companion` / `prd` / `prompt` / `gates` / `report` / `all` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/START all` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/START help` for options."
