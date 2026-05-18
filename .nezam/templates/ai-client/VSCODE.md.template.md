# NEZAM — VS Code Workspace Contract

> **`/command` do everything.**

This `VSCODE.md` is generated from `.cursor/` contracts.

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

## How NEZAM works in VS Code

VS Code reads `.vscode/` for workspace settings and extensions. NEZAM mirrors all commands, agents, skills, and rules into `.vscode/nezam/` so the full SDD pipeline, hardlock gates, and swarm architecture are available via GitHub Copilot Chat, Copilot Workspace, or any AI extension that reads workspace context.

**Recommended extensions for full NEZAM support:**
- GitHub Copilot + Copilot Chat
- Continue.dev (reads `.continue/` rules)
- Codeium (reads workspace context)

## Design system (`DESIGN.md`) — parity with Cursor

- **Catalog (pick a profile):** `.nezam/design/<brand>/design.md`
- **This repo's design contract:** repository root **`DESIGN.md`** (preferred SDD path).
- **Apply profile → contract (any terminal):** `pnpm run design:apply -- <brand>`
- **Other tools:** mirrored commands/rules/agents/skills and drift checks are described in [`.nezam/memory/MULTI_TOOL_INDEX.md`](.nezam/memory/MULTI_TOOL_INDEX.md). After editing `.cursor/`, run `pnpm ai:sync` then `pnpm ai:check`.

## Required behavior

- Keep SDD order: Planning -> SEO -> IA -> Content -> Design -> Development -> Release.
- Enforce hardlock prerequisites before implementation.
- Prefer deterministic docs updates in `.nezam/memory/` after substantive changes.

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

## VS Code workspace settings

NEZAM ships a `.vscode/settings.json` with recommended settings for the workspace. Key settings:

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": "VSCODE.md" }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    { "file": "VSCODE.md" }
  ]
}
```

This tells Copilot Chat to read `VSCODE.md` as workspace context for all code generation and review tasks.

## Keeping in sync

```bash
pnpm ai:sync   # sync .cursor/ → .vscode/nezam/ and all other mirrors
pnpm ai:check  # verify no drift
```
