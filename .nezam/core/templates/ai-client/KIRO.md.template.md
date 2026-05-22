# NEZAM — Kiro Workspace Contract

> **`/command` do everything.**

This `KIRO.md` is generated from `.cursor/` contracts.

## Canonical source

- `.cursor/commands/`
- `.cursor/agents/`
- `.cursor/skills/`
- `.cursor/rules/`

When conflicts appear, follow:

1. `.cursor/rules/*.mdc`
2. `.cursor/skills/**/SKILL.md`
3. `.cursor/agents/*.md`

Do not edit generated per-tool files directly.
Update `.cursor/` and run `pnpm ai:sync`.

## How NEZAM works in Kiro

Kiro reads `.kiro/steering/` for workspace-level instructions that are automatically included in every session. NEZAM mirrors all commands, agents, skills, and rules into `.kiro/steering/` so the full SDD pipeline, hardlock gates, and swarm architecture are available natively.

Kiro also supports:
- **Steering files** (`.kiro/steering/*.md`) — always-on workspace context
- **Hooks** (`.kiro/hooks/`) — automated agent actions on IDE events
- **Specs** (`.kiro/specs/`) — structured requirements → design → tasks workflow

## Design system (`DESIGN.md`) — parity with Cursor

- **Catalog (pick a profile):** `.nezam/design-hub/design/<brand>/design.md`
- **This repo's design contract:** repository root **`DESIGN.md`** (preferred SDD path).
- **Apply profile → contract (any terminal):** `pnpm run design:apply -- <brand>`
- **Other tools:** mirrored commands/rules/agents/skills and drift checks are described in [`.nezam/core/memory/MULTI_TOOL_INDEX.md`](.nezam/core/memory/MULTI_TOOL_INDEX.md). After editing `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check`.

## Required behavior

- Keep SDD order: Planning -> SEO -> IA -> Content -> Design -> Development -> Release.
- Enforce hardlock prerequisites before implementation.
- Respect all gates defined in `.kiro/steering/rules/`.
- Prefer deterministic docs updates in `.nezam/core/memory/` after substantive changes.

## Kiro-specific features

### Steering files
NEZAM rules are mirrored into `.kiro/steering/rules/` as always-on steering files. Kiro loads them automatically on every session — no manual activation needed.

### Hooks
NEZAM ships a set of Kiro hooks under `.kiro/hooks/` for:
- Auto-syncing `.cursor/` changes to all mirrors on file save
- Running gate checks before write operations
- Enforcing SDD pipeline order

### Specs (Kiro Spec mode)
Use Kiro's Spec session type for structured NEZAM planning phases. Each SDD phase maps naturally to a Kiro spec:
- Requirements → PRD + planning docs
- Design → DESIGN.md + wireframes
- Tasks → implementation slices

## Session start

At session open in Kiro:
1. Kiro auto-loads all `.kiro/steering/` files — NEZAM rules are active immediately.
2. Run `/guide status` to see current project state.
3. If starting fresh, run `/start all`.

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

## Keeping in sync

```bash
pnpm ai:sync   # sync .cursor/ → .kiro/ and all other mirrors
pnpm ai:check  # verify no drift
```
