# NEZAM — Qwen CLI Workspace Contract

> **`/command` do everything.**

Generated guidance for Qwen CLI based on `.cursor/`.

## Canonical source

Edit `.cursor/` artifacts and run `pnpm ai:sync`.

## Design system (`DESIGN.md`) — parity with Cursor

- **Catalog:** `.cursor/design/<brand>/design.md` — **contract:** repository root **`DESIGN.md`**
- **Shell:** `pnpm run design:apply -- <brand>`
- **Cross-client sync:** [`docs/workspace/context/MULTI_TOOL_INDEX.md`](docs/workspace/context/MULTI_TOOL_INDEX.md) — after `.cursor/` edits run `pnpm ai:sync` then `pnpm ai:check`

## Workflow guardrails

- Respect SDD sequencing and planning-first execution.
- Treat development as hardlocked until required planning/design gates pass.
- Use generated `.qwen/commands/*.toml` command prompts as the command surface (same intent as `.cursor/commands/*.md`, TOML-wrapped).
