# NEZAM — Getting Started with Cursor

> **Tier 1 tool.** Cursor is the primary NEZAM development environment. Full feature parity.

## How NEZAM works in Cursor

Cursor reads `.cursor/` natively. All NEZAM commands, agents, skills, and rules are loaded automatically by Cursor's AI context system.

## First-time setup

```bash
# 1. Clone the repo and install dependencies
git clone <repo-url>
cd your-project
pnpm install

# 2. Install the git pre-commit hook
bash scripts/setup-hooks.sh

# 3. Open in Cursor
cursor .
```

## Starting a new project

In the Cursor chat panel:

```
/start all
```

This runs the full NEZAM onboarding: team setup → build method → PRD creation → design selection → planning unlock.

## Key commands

| Command | What it does |
|---------|-------------|
| `/start all` | Full onboarding — start here |
| `/guide status` | See where you are and what's next |
| `/guide next` | Get the single most important next step |
| `/plan seo` | Run the SEO research phase |
| `/plan arch` | Run the architecture phase |
| `/develop start` | Begin development (requires planning complete) |
| `/check output` | Score the last output |
| `/check gate` | Verify all gate prerequisites |
| `/fix` | Fix any issue (never hardlocked) |
| `/scan all` | Run full project health scan |

## Design profiles

```
/start design
```

Browse 150+ curated design profiles in `.nezam/design/`. Each profile sets colors, typography, spacing, and component style.

## Multi-swarm architecture

NEZAM routes work to 13 specialist swarms automatically. You don't need to invoke agents directly — `/guide` and phase commands handle routing.

## Sync with other tools

```bash
pnpm ai:sync   # sync .cursor/ → all mirror directories
pnpm ai:check  # verify no drift
```

## Troubleshooting

- **Gate fails unexpectedly** → run `/check repair` to validate state files
- **Design not applying** → confirm `DESIGN.md` exists at repo root
- **PRD not found** → check `docs/prd/PRD.md` exists and has content
