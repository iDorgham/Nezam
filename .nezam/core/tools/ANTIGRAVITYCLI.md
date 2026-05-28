# NEZAM — Getting Started with Antigravity CLI (`agy`)

> **Tier 1 tool.** The CLI discovers workspace skills under `.agents/skills/` and governance mirrors under `.antigravitycli/`.

## Two surfaces (do not confuse)

| Surface | Path | Purpose |
|--------|------|---------|
| **Antigravity IDE** | `.antigravity/` | IDE mirror of `.cursor/` commands, agents, skills, rules |
| **Antigravity CLI** | `.antigravitycli/` + `.agents/skills/nezam-*` | CLI mirror + `agy`-native skill folders |

Edit **only** `.cursor/`; run `pnpm ai:sync` to refresh both.

## CLI discovery layout (generated)

After `pnpm ai:sync`:

- `.antigravitycli/commands|agents|skills|rules/` — full markdown mirrors (same as IDE)
- `.agents/skills/nezam-commands/<command>/SKILL.md` — each NEZAM slash command as an `agy` skill (YAML frontmatter added automatically)
- `.agents/skills/nezam-sync/**` — mirrored `.cursor/skills/**` (namespaced; does **not** overwrite hand-maintained `.agents/skills/design/`)
- `.agents/rules/**` — mirrored `.cursor/rules/*.mdc`
- `AGENTS.md` — root contract (shared with Codex/Copilot; run sync to update)

Optional project metadata may live at `.antigravitycli/*.json` (e.g. Gemini project link). Sync does not remove those files.

## Install CLI

Install Google's Antigravity CLI and ensure `agy` is on your `PATH` (see official Antigravity CLI docs).

```bash
agy inspect   # verify .agents/, AGENTS.md, and loaded skills
```

## First-time setup in this repo

```bash
pnpm install
bash .nezam/core/scripts/hooks/setup-hooks.sh
pnpm ai:sync
pnpm ai:check
```

## Starting work

Use natural language or invoke a generated skill (e.g. `nezam-start`, `nezam-plan`) after sync. NEZAM slash intents match Cursor:

- `/start all` — onboarding
- `/plan all` — SDD planning
- `/guide status` — progress

Root `AGENTS.md` and `.agents/rules/` carry the same hardlocks and pipeline order as `.cursor/rules/`.

## Keeping in sync

```bash
pnpm ai:sync   # .cursor/ → .antigravitycli/, .agents/skills/nezam-*, etc.
pnpm ai:check  # drift gate (CI uses the same)
```

After editing `.cursor/commands/`, `.cursor/agents/`, `.cursor/skills/`, or `.cursor/rules/`, always sync before committing (pre-commit hook runs sync when `.cursor/` is staged).

## IDE vs CLI handoff

1. Run `/SAVE log` (or equivalent) in the tool you are leaving.
2. Run `pnpm ai:sync` if `.cursor/` changed.
3. In the new tool, read `.nezam/core/memory/MEMORY.md` and run `/guide status`.

See also [ANTIGRAVITY.md](./ANTIGRAVITY.md) for the IDE-specific guide.
