# NEZAM — Claude Workspace Contract

> **`/command` do everything.**

This `CLAUDE.md` is generated from `.cursor/` contracts.

## Canonical source

- `.cursor/commands/`
- `.cursor/agents/`
- `.cursor/skills/`
- `.cursor/rules/`

When conflicts appear, follow:

1. `.cursor/rules/*.mdc`
2. `.cursor/skills/**/SKILL.md`
3. `.cursor/agents/*.md`

## Design system (`DESIGN.md`) — parity with Cursor

- **Catalog (pick a profile):** `.cursor/design/<brand>/design.md`
- **This repo’s design contract:** repository root **`DESIGN.md`** (preferred SDD path). Optional legacy mirror: `docs/DESIGN.md`.
- **Apply profile → contract (any terminal):** `pnpm run design:apply -- <brand>` (example: `pnpm run design:apply -- minimal`)
- **Cursor slash command equivalent:** `/START design` (see `.cursor/commands/start.md`).
- **Other tools:** mirrored commands/rules/agents/skills and drift checks are described in [`docs/nezam/memory/MULTI_TOOL_INDEX.md`](docs/nezam/memory/MULTI_TOOL_INDEX.md). After editing `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check`.

## Required behavior

- Keep SDD order: Planning -> SEO -> IA -> Content -> Design -> Development -> Release.
- Enforce hardlock prerequisites before implementation.
- Preserve recommendation footer behavior for Cursor-compatible flows.
- Prefer deterministic docs updates in `docs/nezam/memory/` after substantive changes.
