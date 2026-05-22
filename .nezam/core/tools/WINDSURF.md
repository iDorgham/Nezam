# NEZAM — Getting Started with Windsurf

> **Tier 2 tool.** Windsurf reads `WINDSURF.md` at repo root and `.windsurf/` for workspace context.

## How NEZAM works in Windsurf

Windsurf reads `WINDSURF.md` at repo root on every session. NEZAM mirrors all commands, agents, skills, and rules from `.cursor/` into `.windsurf/` so the full SDD pipeline, hardlock gates, and swarm architecture are available automatically.

## First-time setup

```bash
# 1. Clone the repo and install dependencies
git clone <repo-url>
cd your-project
pnpm install

# 2. Install the git pre-commit hook
bash .nezam/scripts/hooks/setup-hooks.sh

# 3. Sync mirrors (generates .windsurf/ from .cursor/)
pnpm ai:sync

# 4. Open in Windsurf
windsurf .
```

## Starting a new project

In the Windsurf chat panel:

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

## Windsurf-specific notes

- Windsurf's Cascade AI reads `WINDSURF.md` as the primary workspace context file.
- All NEZAM slash commands work identically to Cursor. If a command doesn't trigger, type the full intent in natural language.
- The `.windsurf/` directory mirrors `.cursor/` commands, agents, skills, and rules.

## Design profiles

```
/start design
```

Browse 150+ curated design profiles in `.nezam/design/`. Each profile sets colors, typography, spacing, and component style.

## Keeping in sync

```bash
pnpm ai:sync   # sync .cursor/ → .windsurf/ and all other mirrors
pnpm ai:check  # verify no drift
```

## Troubleshooting

- **Gate fails unexpectedly** → run `/check repair` to validate state files
- **Design not applying** → confirm `DESIGN.md` exists at repo root
- **PRD not found** → check `.nezam/workspace/prd/PRD.md` exists and has content
- **Context not loading** → confirm `WINDSURF.md` exists at repo root (run `pnpm ai:sync` if missing)
