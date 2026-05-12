# NEZAM — Getting Started with Antigravity

> **Tier 1 tool.** Antigravity reads `.antigravity/` for full NEZAM support.

## How NEZAM works in Antigravity

Antigravity reads `.antigravity/` which mirrors all NEZAM commands, agents, skills, and rules from `.cursor/`. The pipeline, gates, and swarm architecture work identically to Cursor.

## First-time setup

```bash
# 1. Clone and install
git clone <repo-url>
cd your-project
pnpm install

# 2. Install git hook
bash scripts/setup-hooks.sh

# 3. Sync mirrors (ensure .antigravity/ is current)
pnpm ai:sync

# 4. Open in Antigravity
```

## Starting a new project

```
/start all
```

## Known behavior differences

### Response style

Antigravity has its own `guide-response-style.mdc` and `guide-handoff-footer.mdc` files in `docs/rules/`. These prescribe alternate reply shells (`### What to do next`, horizontal rules) that differ from the unified NEZAM Response Style System (which uses `━` borders and the 3 Action Block Types).

**Resolution:** The NEZAM Response Style System in `workspace-orchestration.mdc` takes precedence. The Antigravity guide rules in `docs/rules/` are **not activated globally** — they apply only when working on Antigravity-specific fork work. Do not stack both rule sets simultaneously.

If you need Antigravity-parity behavior for a specific workflow, maintain a separate `antigravity-guide.md` variant and activate it explicitly.

### Slash command syntax

Antigravity accepts NEZAM slash commands with the same syntax as Cursor. If a command doesn't trigger, try prefixing with `@nezam` or typing the full intent.

## All commands available

Same as Cursor — see [CURSOR.md](CURSOR.md) for the full command list.

## Keeping in sync

```bash
pnpm ai:sync   # sync .cursor/ → .antigravity/ and all other mirrors
pnpm ai:check  # verify no drift
```
