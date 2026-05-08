---
description: START — Onboard repo/docs + external companion (GROK/Qwen) handoff scaffolding.
---

You are coordinating **/START**.

**Output formats:** Respect `--format=auto|markdown|terminal` when the user sets it (`auto`: `CURSOR_CHAT=1` or non-TTY stdout → markdown profile; interactive TTY → terminal). Substantive summaries should mirror `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)`: banner header/footer with wall-clock duration; `✅ PASS   │ …` / `⚠️ WARN` / `❌ FAIL` / `ℹ️ INFO`; two blank lines between major sections; `<details>` collapsibles (markdown) or `[+]` + four-space indent (terminal); box-drawing ASCII tables for tabular output. Optional: `source scripts/ui/workspace-tui.sh` in shell; preferences in [.cursor/tui.json](.cursor/tui.json). When orchestration requires **Recommendation**, keep it the **final** section **after** any TUI-framed block.

Parse **subcommands**:  
`help | repo | docs | prompts | companion | prd | prompt | gates | report | mena | all`

- **repo**: Guide user to attach/clone/import Git repo first; propose `git status`, default branch protections, upstream remote. If absent, scripted init path (no secrets).
- **docs**: Ensure tree `docs/core/required/`, `docs/reference/`, `docs/workspace/context/`, and `docs/workspace/templates/` exists; keep `docs/core/required/` intake-only with `README.md`.
- **docs**: Ensure canonical context docs exist:
  - `docs/workspace/context/CONTEXT.md`
  - `docs/workspace/context/CONTEXT.md`
  - `docs/workspace/context/CONTEXT.md`
- **prompts**: Bootstrap `docs/core/required/PROJECT_PROMPT.md` + link to PRD; define hand-off language for external AI.
- **companion**: Summarize `docs/workspace/context/CONTEXT.md` so user can paste into browser AI; stress uploading latest `docs/reports/progress/PROGRESS_REPORT.latest.md` plus `docs/workspace/context/CONTEXT.md`.
- **prd**: Shortcut — same outcome as `/CREATE prd` (scaffold `docs/core/required/PRD.md` from template when missing).
- **prompt**: Shortcut — same outcome as `/CREATE prompt` (scaffold `docs/core/required/PROJECT_PROMPT.md` when missing).
- **gates**: Hard-block `/PLAN` readiness unless all checks pass:
  1. GitHub repo import/attach is complete (remote exists; run `git remote -v` to verify).
  2. `docs/core/required/PRD.md` exists and is not template/placeholder content.
  3. `docs/core/required/PROJECT_PROMPT.md` exists and is aligned with PRD scope.
  3.1 `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` exists.
  4. Site archetype decision exists (one-page/blog/company/portfolio/gallery/store + scroll paradigm).
  5. `docs/workspace/context/CONTEXT.md`, `docs/workspace/context/MEMORY.md`, and `docs/workspace/context/WORKSPACE_INDEX.md` exist.
  6. AI client sync tier passes (`pnpm ai:check`) so generated `.claude/`, `.antigravity/`, `.gemini/`, `.qwen/`, `.codex/`, `.opencode/`, `.kilocode/` and root memory files are in sync with `.cursor/`.
  When any check fails, stop and print exact remediation (`/CREATE prd`, `/CREATE prompt`, repo attach/import guidance), then ask user to rerun `/START gates`.

  **When every gate passes**, print an explicit **Claude handoff** block before suggesting `/PLAN`:
  1. Run **`/CREATE claude-cli-prompt`** and **`/CREATE claude-code-handoff`** (optional **`/CREATE claude-md`** for root `CLAUDE.md`).
  2. **Claude CLI:** `cd` to repo root, run `claude` (see [Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)), paste the contents of **`docs/core/required/CLAUDE_CLI_PLAN.md`** into the session (or pipe/`claude -p` per [CLI reference](https://docs.anthropic.com/en/cli-reference) if appropriate).
  3. **Claude Code:** open this repo in the IDE extension; follow **`docs/core/required/CLAUDE_CODE_HANDOFF.md`** (same mission as the CLI prompt file).
  4. More detail: [`docs/workspace/context/CONTEXT.md`](../../docs/workspace/context/CONTEXT.md).
  5. After Claude finishes planning work in-repo, continue with **`/PLAN ...`** in Cursor for refinement or parity checks.
- **report**: Initialize `docs/reports/progress/PROGRESS_REPORT.latest.md` shell with timestamp + phase.
- **mena**: Activate MENA onboarding mode:
  1. Set `RTL_REQUIRED: true` in `docs/workspace/context/CONTEXT.md`.
  2. Ask: "Which Arabic dialect is your primary audience? Options: Egyptian Arabic (most widely understood online), Gulf Arabic (Khaleeji), Levantine (Syria/Lebanon/Jordan/Palestine), Moroccan (Darija), Modern Standard Arabic (formal content), or Mixed (auto-select per content type)."
  3. Store answer in `docs/workspace/context/CONTEXT.md` as `arabic_dialect_primary`.
  4. Prefer design profiles with RTL support signals (`rtl`/`arabic`) and safe defaults: `default`, `minimal`, `clean`, `professional`, `corporate`, `enterprise`.
  5. Surface these as required/priority capabilities:
     - `arabic_content_master`
     - `egyptian_arabic_content_master`
     - `mena_payment_routing` for payment features
     - `arabic-seo-aeo-specialist` during SEO phase
  6. Run standard `/START gates`.
  7. Output this card:
     ```
     ✅ MENA mode activated.

     Your workspace is now configured for:
     • [Selected Arabic dialect] content generation
     • RTL layout requirements
     • MENA payment options (Fawry, Paymob, Tabby, Tamara, STCPay, etc.)
     • Arabic SEO and AEO optimization

     Next: /PLAN seo — to start keyword research in Arabic and English
     ```
- **all**: Run order `repo → docs → prompts → companion → report → gates`, listing blockers. When **`gates`** passes, include the same **Claude handoff** steps as above plus Recommendation to run **`/CREATE claude-cli-prompt`** / **`claude-code-handoff`** if those prompt files are still missing.
- **all**: Run order `repo → docs → prompts → companion → report → gates`, listing blockers. When **`gates`** passes, include the same **Claude handoff** steps as above plus Recommendation to run **`/CREATE claude-cli-prompt`** / **`claude-code-handoff`** if those prompt files are still missing. Also remind users that `/DEVELOP` remains hardlocked until each sub-phase has `prompt.json` + `PROMPT.md`.

When running `all`, also recommend hook setup for auto-updating context docs:

```sh
bash scripts/context/install-context-hooks.sh
```

Invoke mental **team roles** only as labels for thoroughness: CEO/GM (prioritization), PM (phases), SEO (keywords), Content, UI/UX, Brand, Frontend, Backend, DB, CMS, Animation, Security, DevOps, Audit, Performance, Program Manager for dependencies.

## Recommendation footer

Obey orchestration Recommendation rules.

## Subcommand Routing
User input after `/START` is treated as `<subcommand>`.
- `help` → Output: "Usage: /START <subcommand>\nOptions: help | repo | docs | prompts | companion | prd | prompt | gates | report | mena | all\nExamples:\n/START gates\n/START mena\n/START all\nRun without args for default flow."
- `repo` / `docs` / `prompts` / `companion` / `prd` / `prompt` / `gates` / `report` / `mena` / `all` → Execute the corresponding behavior defined above.
- *(default)* → Run the primary flow defined above (treat as `/START all` unless the file’s logic specifies otherwise).
If `<subcommand>` is unrecognized: "Unknown subcommand. Run `/START help` for options."
