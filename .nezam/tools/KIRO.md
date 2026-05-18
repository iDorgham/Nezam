# NEZAM — Getting Started with Kiro

> **Tier 2 tool.** Kiro reads `.kiro/steering/` for workspace context and `KIRO.md` at repo root.

## How NEZAM works in Kiro

Kiro reads `.kiro/steering/` natively. NEZAM mirrors all commands, agents, skills, and rules from `.cursor/` into `.kiro/steering/` so the full SDD pipeline, hardlock gates, and swarm architecture are available in every Kiro session automatically.

Kiro also supports:
- **Steering files** (`.kiro/steering/*.md`) — always-on workspace context loaded every session
- **Hooks** (`.kiro/hooks/`) — automated agent actions triggered by IDE events
- **Specs** (`.kiro/specs/`) — structured requirements → design → tasks workflow (Spec session type)

## First-time setup

```bash
# 1. Clone the repo and install dependencies
git clone <repo-url>
cd your-project
pnpm install

# 2. Install the git pre-commit hook
bash scripts/hooks/setup-hooks.sh

# 3. Sync mirrors (generates .kiro/ from .cursor/)
pnpm ai:sync

# 4. Open in Kiro
```

## Starting a new project

In the Kiro chat panel:

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

## Kiro-specific features

### Steering files (`.kiro/steering/`)
NEZAM rules are mirrored into `.kiro/steering/rules/` as always-on steering files. Kiro loads them automatically — no manual activation needed. The full SDD pipeline, design gates, and hardlock rules are active from the first message.

### Hooks (`.kiro/hooks/`)
NEZAM ships Kiro hooks for common automation:
- **`ai-sync-on-cursor-edit`** — runs `pnpm ai:sync` when `.cursor/` files are saved
- **`gate-check-before-write`** — enforces SDD gate checks before write operations

### Spec mode
Use Kiro's Spec session type for structured NEZAM planning phases. Each SDD phase maps to a Kiro spec:
- **Requirements** → PRD + planning docs
- **Design** → DESIGN.md + wireframes
- **Tasks** → implementation slices with acceptance criteria

### Autopilot vs Supervised mode
- **Autopilot** (default) — Kiro works end-to-end autonomously. Best for full planning phases and scaffold generation.
- **Supervised** — Kiro yields for approval after each file edit. Best for sensitive changes (auth, billing, infra).

## Design profiles

```
/start design
```

Browse 150+ curated design profiles in `.nezam/design/`. Each profile sets colors, typography, spacing, and component style.

## Multi-swarm architecture

NEZAM routes work to 13 specialist swarms automatically. You don't need to invoke agents directly — `/guide` and phase commands handle routing.

## Keeping in sync

```bash
pnpm ai:sync   # sync .cursor/ → .kiro/ and all other mirrors
pnpm ai:check  # verify no drift
```

## Troubleshooting

- **Gate fails unexpectedly** → run `/check repair` to validate state files
- **Design not applying** → confirm `DESIGN.md` exists at repo root
- **PRD not found** → check `.nezam/workspace/prd/PRD.md` exists and has content
- **Steering not loading** → confirm `.kiro/steering/` files exist (run `pnpm ai:sync` if missing)
