# NEZAM — Getting Started with Codex

> **Tier 1 tool.** Codex CLI reads `AGENTS.md`; Codex App reads `.codex/`.

## How NEZAM works in Codex

**Codex CLI:** Reads `AGENTS.md` at repo root. This file contains the full agent index and NEZAM command routing. Pass NEZAM commands as quoted arguments.

**Codex App:** Reads `.codex/` which mirrors all NEZAM commands, agents, skills, and rules from `.cursor/`.

## First-time setup

```bash
# 1. Clone and install
git clone <repo-url>
cd your-project
pnpm install

# 2. Install git hook
bash scripts/hooks/setup-hooks.sh

# 3. Sync mirrors
pnpm ai:sync
```

## Starting a new project (Codex CLI)

```bash
codex "/start all"
```

## Starting a new project (Codex App)

```
/start all
```

## Running NEZAM commands via Codex CLI

```bash
codex "/start all"
codex "/guide status"
codex "/plan seo"
codex "/plan arch"
codex "/develop start"
codex "/check output"
codex "/check gate"
codex "/scan all"
```

## Agentic mode

Codex is well-suited for long-running NEZAM tasks (full planning phases, scaffold generation). Use agentic mode for multi-step operations:

```bash
codex --agentic "/plan all"
codex --agentic "/develop phase 1"
```

Note: Always run `/check gate` before starting a new phase in agentic mode to confirm prerequisites.

## AGENTS.md

`AGENTS.md` is auto-generated from `.cursor/agents/` by `pnpm ai:sync`. It contains:
- Full agent roster with code-names, roles, and swarm assignments
- Routing table for NEZAM commands
- Session start protocol

Do not edit `AGENTS.md` directly — edit `.cursor/agents/` and run `pnpm ai:sync`.

## Keeping in sync

```bash
pnpm ai:sync   # sync .cursor/ → AGENTS.md + .codex/ and all other mirrors
pnpm ai:check  # CI drift check
```
