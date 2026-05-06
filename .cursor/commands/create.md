---
description: CREATE — instantiate templates (PRD, prompts, DESIGN, SDD, reports, specs).
---

You are coordinating **/CREATE**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | prd | prompt | design | sdd | report | spec | seo | all | agent | skill | constitution | component | page | pages | claude-cli-prompt | claude-code-handoff | claude-md`

Actions:

- Copy from `docs/templates/*.template.md` into destination paths below, **without** clobbering existing files unless user confirms `force`.
  - `prd` → `docs/specs/prd/PRD.md`
  - `prompt` → `docs/prompts/PROJECT_PROMPT.md`
  - `design` → `DESIGN.md`
  - `sdd` → scaffold `docs/specs/sdd/README.md` + `VERSIONING.md` shells
  - `report` → `docs/reports/PROGRESS_REPORT.latest.md`
  - `spec` → `docs/specs/features/TEMPLATE_SPEC.md`
  - `seo` → `docs/specs/sdd/SEO_RESEARCH.md`
  - `constitution` → `docs/CONSTITUTION.md` from `docs/templates/CONSTITUTION.template.md`
  - `agent` → `.cursor/agents/<slug>.md` from `docs/templates/AGENT.template.md` (prompt for `<slug>` if omitted)
  - `skill` → `.cursor/skills/<skill-name>/SKILL.md` from `docs/templates/SKILL.template.md` (follow existing skills’ YAML frontmatter pattern)
  - `component` / `page` / **pages**: **Advisory only** — do not assume stack paths. Propose likely targets (e.g. Next.js `app/`, `pages/`, `src/components/`) from repo detection; scaffold markdown spec stub next to feature spec if code path unknown.
  - `claude-cli-prompt` → `docs/prompts/CLAUDE_CLI_PLAN.md` from `docs/templates/CLAUDE_CLI_PLAN_PROMPT.template.md`
  - `claude-code-handoff` → `docs/prompts/CLAUDE_CODE_HANDOFF.md` from `docs/templates/CLAUDE_CODE_HANDOFF.template.md`
  - `claude-md` → root `CLAUDE.md` from `docs/templates/CLAUDE_MD_AGENT.template.md`

- Enforce onboarding dependency order in guidance:
  1. GitHub repo import/attach first (`/START repo`)
  2. Create PRD (`/CREATE prd`)
  3. Create project prompt (`/CREATE prompt`)
  4. Validate with `/START gates`
  5. After gates pass: **`/CREATE claude-cli-prompt`**, **`/CREATE claude-code-handoff`**, optional **`/CREATE claude-md`** — then plan the project in **Claude CLI** or **Claude Code** using those prompts (see [`docs/external-ai/CLAUDE_CLI_AND_CODE.md`](../../docs/external-ai/CLAUDE_CLI_AND_CODE.md)).
  6. Run **`/PLAN ...`** in Cursor (refine / continue SDD work).

- **`all`**: Create missing files only; print skip list — includes **`claude-cli-prompt`**, **`claude-code-handoff`**, and **`claude-md`** targets when absent (same non-clobber rules).

After creation, never suggest `/PLAN` until both `docs/specs/prd/PRD.md` and `docs/prompts/PROJECT_PROMPT.md` exist and `/START gates` has passed.

When generating **`claude-cli-prompt`** or **`claude-code-handoff`**, replace template placeholder **`{{PROJECT_NAME}}`** from `docs/specs/prd/PRD.md` title line or `docs/prompts/PROJECT_PROMPT.md` heading when obvious; otherwise leave `TODO`.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/CREATE` is treated as `<subcommand>`.
- `help` → Output: "Usage: /CREATE <subcommand>\nOptions: help | prd | prompt | design | sdd | report | spec | seo | all | agent | skill | constitution | component | page | pages | claude-cli-prompt | claude-code-handoff | claude-md\nExamples:\n/CREATE prd\n/CREATE prompt\nRun without args for default flow."
- `prd` / `prompt` / `design` / `sdd` / `report` / `spec` / `seo` / `all` / `agent` / `skill` / `constitution` / `component` / `page` / `pages` / `claude-cli-prompt` / `claude-code-handoff` / `claude-md` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/CREATE all` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/CREATE help` for options."
