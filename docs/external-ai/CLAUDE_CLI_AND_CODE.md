# Claude CLI and Claude Code (post-onboarding)

Use this flow **after** onboarding gates pass (`/START gates`): PRD, `docs/prompts/PROJECT_PROMPT.md`, context docs, and repo remote are in place.

## Definitions


| Surface         | What it is                                                                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude CLI**  | Terminal `**claude`** in your repo — agent reads/edits files, runs commands. [Overview](https://docs.anthropic.com/en/docs/claude-code/overview), [CLI reference](https://docs.anthropic.com/en/cli-reference). |
| **Claude Code** | Same engine in **VS Code / Cursor / JetBrains** (extension or plugin): inline diffs, plan review, `@` context. Install from Anthropic’s docs for your editor.                                                   |


Both honor root `**CLAUDE.md`** when present ([memory / instructions](https://docs.anthropic.com/en/memory)).

## Generate prompts (Cursor)

Run in Cursor:

```text
/CREATE claude-cli-prompt
/CREATE claude-code-handoff
```

Optional project instructions file for Claude Code / CLI:

```text
/CREATE claude-md
```

That creates `**CLAUDE.md**` from `docs/templates/CLAUDE_MD_AGENT.template.md` only if missing (use `force` to overwrite — see `/CREATE`).

Outputs:


| Path                              | Purpose                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `docs/prompts/CLAUDE_CLI_PLAN.md` | Full paste prompt for **CLI** (mission + SDD order aligned with `/PLAN all` / `plan-full`). |
| `docs/prompts/CLAUDE_CODE_HANDOFF.md`     | Short **Claude Code** handoff; mission body matches the CLI plan file.                          |


## Run Claude CLI

1. `cd` to the repository root (same clone Cursor uses).
2. Start the CLI: `claude` (first run: login per installer docs).
3. Paste the entire contents of `**docs/prompts/CLAUDE_CLI_PLAN.md`** into the session (or use `claude -p` patterns from the [CLI reference](https://docs.anthropic.com/en/cli-reference) if you prefer non-interactive runs).

## Run Claude Code

1. Open this repo in your editor with Claude Code installed.
2. Optional: ensure `**CLAUDE.md**` exists (`/CREATE claude-md`).
3. Follow `**docs/prompts/CLAUDE_CODE_HANDOFF.md**` — it points at the same mission as the CLI prompt file.

## After Claude finishes

Return to Cursor and run `**/PLAN ...**` to refine SDD artifacts, align with SEO→IA→content→design ordering, or catch gaps. Then proceed down the usual pipeline (`DESIGN.md`, `**/DEVELOP**`, etc.).

## Related

- Browser assistants: [GROK_INSTRUCTIONS.md](GROK_INSTRUCTIONS.md)

