# Multi-tool AI client index

This workspace supports multiple AI clients while keeping `.cursor/` as the canonical source.

## Canonical rule

- Edit only `.cursor/commands`, `.cursor/agents`, `.cursor/skills`, `.cursor/rules`.
- Regenerate client surfaces with:

```sh
pnpm ai:sync
```

- Validate drift:

```sh
pnpm ai:check
```

## Supported clients

| Client | Runtime files | Status |
| ------ | ------------- | ------ |
| Cursor IDE | `.cursor/**` | Canonical |
| Claude Code | `CLAUDE.md`, `.claude/**` | Synced |
| Claude CLI | `CLAUDE.md`, `.claude/**` | Synced |
| Codex app | `AGENTS.md`, `.codex/AGENTS.md` | Synced |
| Codex CLI | `AGENTS.md`, `.codex/AGENTS.md` | Synced |
| Copilot CLI | `AGENTS.md` | Synced |
| Opencode CLI | `AGENTS.md`, `.opencode/**` | Synced |
| Antigravity IDE | `.antigravity/**` | Generated (tier-2 fidelity) |
| Gemini CLI | `GEMINI.md`, `.gemini/commands/*.toml` | Generated (tier-2 fidelity) |
| Qwen CLI | `QWEN.md`, `.qwen/commands/*.toml` | Generated (tier-2 fidelity) |
| Kilo Code CLI | `.kilocode/rules/**` | Generated (tier-2 fidelity) |

## Mapping summary

- `.cursor/commands/*.md` -> `.claude/commands/*.md`, `.opencode/command/*.md`, `.antigravity/commands/*.md`, `.gemini/commands/*.toml`, `.qwen/commands/*.toml`
- `.cursor/agents/*.md` -> `.claude/agents/*.md`, `.opencode/agent/*.md`, `.antigravity/agents/*.md`
- `.cursor/skills/**` -> `.claude/skills/**`, `.antigravity/skills/**`
- `.cursor/rules/*.mdc` -> memory injection (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `QWEN.md`) and rules copy (`.antigravity/rules/**`, `.kilocode/rules/**`)

## Operational notes

- Generated artifacts are tracked in Git for reviewability.
- Never hand-edit generated surfaces; drift will fail CI.
- CI enforcement lives in `.github/workflows/ci.yml` job `ai-sync-drift`.
- Generated scan/test/audit outputs must be stored under `docs/reports/<category>/`.
