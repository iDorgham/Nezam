# NEZAM — Getting Started with Claude Code

> **Tier 1 tool.** Claude Code CLI reads `CLAUDE.md` and `.claude/` for full NEZAM support.

## How NEZAM works in Claude Code

Claude Code reads `CLAUDE.md` at repo root on every session. This file contains the full NEZAM command index, agent index, skill index, and required behavior rules. The `.claude/` directory mirrors all `.cursor/` commands, agents, skills, and rules.

## First-time setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd your-project
pnpm install

# 2. Install the git pre-commit hook
bash scripts/setup-hooks.sh

# 3. Start Claude Code in your project
claude .
# or just: claude
```

## Starting a new project

In the Claude Code terminal:

```
/start all
```

## Key commands

All NEZAM slash commands work identically in Claude Code as in Cursor:

```
/start all          → onboarding
/guide status       → project overview
/guide next         → next step
/plan seo           → SEO research phase
/develop start      → begin development
/check output       → score last output
/check repair       → fix corrupt state files
/scan all           → full health scan
```

## How state persists between sessions

NEZAM state lives in `.cursor/state/*.yaml` — these files persist between Claude Code sessions. Claude Code reads them on every session start via the swarm-leader's Session Start Protocol (defined in `.claude/agents/swarm-leader.md`).

## Cowork mode (Claude desktop)

When using NEZAM through the Claude desktop app's Cowork feature, the workspace folder at `docs/` is your project space. Claude reads `CLAUDE.md` for all NEZAM governance rules.

## Known differences vs. Cursor

- **No native slash command UI** — type commands as natural language or use `/command` syntax directly in the prompt
- **No file tree sidebar** — use `ls` or the Read tool to explore
- **Design profiles** — Claude Code can generate the design profile selection list from `.cursor/design/catalog.json`

## Keeping in sync

```bash
pnpm ai:sync   # after editing .cursor/ files
pnpm ai:check  # CI drift check
```
