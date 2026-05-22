# NEZAM — Windsurf Workspace Contract

> **`/command` do everything.**

This `WINDSURF.md` is generated from `.cursor/` contracts.

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

## How NEZAM works in Windsurf

Windsurf reads `WINDSURF.md` at repo root on every session. This file contains the full NEZAM command index, agent index, skill index, and required behavior rules. The `.windsurf/` directory mirrors all `.cursor/` commands, agents, skills, and rules.

## Design system (`DESIGN.md`) — parity with Cursor

- **Catalog (pick a profile):** `.nezam/design-hub/design/<brand>/design.md`
- **This repo's design contract:** repository root **`DESIGN.md`** (preferred SDD path).
- **Apply profile → contract (any terminal):** `pnpm run design:apply -- <brand>`
- **Other tools:** mirrored commands/rules/agents/skills and drift checks are described in [`.nezam/core/memory/MULTI_TOOL_INDEX.md`](.nezam/core/memory/MULTI_TOOL_INDEX.md). After editing `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check`.

## Required behavior

- Keep SDD order: Planning -> SEO -> IA -> Content -> Design -> Development -> Release.
- Enforce hardlock prerequisites before implementation.
- Prefer deterministic docs updates in `.nezam/core/memory/` after substantive changes.

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
pnpm ai:sync   # sync .cursor/ → .windsurf/ and all other mirrors
pnpm ai:check  # verify no drift
```
