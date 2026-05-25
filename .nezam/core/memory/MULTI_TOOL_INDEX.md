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
| Kiro IDE | `KIRO.md`, `.kiro/steering/**` | Generated (tier-2 fidelity) |
| Windsurf IDE | `WINDSURF.md`, `.windsurf/**` | Generated (tier-2 fidelity) |
| VS Code + Copilot | `VSCODE.md`, `.vscode/nezam/**` | Generated (tier-2 fidelity) |
| Copilot CLI | `AGENTS.md` | Synced |

## Mapping summary

- `.cursor/commands/*.md` -> `.claude/commands/*.md`, `.opencode/command/*.md`, `.antigravity/commands/*.md`, `.gemini/commands/*.toml`, `.qwen/commands/*.toml`, `.windsurf/commands/*.md`, `.vscode/nezam/commands/*.md`
- `.cursor/agents/*.md` -> `.claude/agents/*.md`, `.opencode/agent/*.md`, `.antigravity/agents/*.md`, `.windsurf/agents/*.md`, `.vscode/nezam/agents/*.md`
- `.cursor/skills/**` -> `.claude/skills/**`, `.antigravity/skills/**`, `.windsurf/skills/**`, `.vscode/nezam/skills/**`
- `.cursor/rules/*.mdc` -> memory injection (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `QWEN.md`, `KIRO.md`, `WINDSURF.md`, `VSCODE.md`) and rules copy (`.antigravity/rules/**`, `.kilocode/rules/**`, `.kiro/steering/rules/**`, `.windsurf/rules/**`, `.vscode/nezam/rules/**`)

## Design system contract (same in every client)

Orchestration treats **repository root `DESIGN.md`** as the primary design artifact (legacy: `docs/DESIGN.md`).

| Step | What to do (any tool / terminal) |
|------|-----------------------------------|
| Browse profiles | Folders under `.nezam/design-hub/design/<brand>/` each contain `design.md` (see [`.nezam/design-hub/_archive/v1/design/README.md`](../../design-hub/_archive/v1/design/README.md)). |
| Lock the contract | `pnpm run design:apply -- <brand>` copies the chosen file to **`DESIGN.md`** at repo root. |
| Cursor shortcut | `/START design` mirrors the same intent (see `.cursor/commands/start.md`). |
| After changing commands/agents/skills/rules | `pnpm ai:sync` then `pnpm ai:check` so Claude, Codex, Antigravity, Gemini, Qwen, Opencode, Kilo, Kiro, Windsurf, VS Code, and Copilot stay aligned. |

### Clients without a root “memory” file

**Antigravity** and **Kilo** do not receive a generated `CLAUDE.md`-style bundle at repo root. Use:

- Mirrored **commands** (`.antigravity/commands/`, or rules under `.kilocode/rules/`)
- Human-readable onboarding: **[`docs/start.md`](../../../docs/start.md)**, **[`.nezam/memory/CONTEXT.md`](CONTEXT.md)**, and this file

So design selection and `pnpm run design:apply` work the same from any terminal; only the *slash command* UX is Cursor-native.

## Operational notes

- Generated artifacts are tracked in Git for reviewability.
- Never hand-edit generated surfaces; drift will fail CI.
- CI enforcement lives in `.github/workflows/ci.yml` job `ai-sync-drift`.
- Generated scan/test/audit outputs must be stored under `docs/reports/<category>/`.

## Settings Sync Note

After any `/Settings` change, run `pnpm ai:sync` to propagate updated command/routing contracts
across synced clients. Treat `.cursor/workspace.settings.yaml` as canonical source and avoid
hand-editing mirrored client surfaces for settings behavior.

## Canonical specifications (SDD)

- **Procedure:** [`.cursor/skills/system/nezam-spec-generator/SKILL.md`](../../../.cursor/skills/system/nezam-spec-generator/SKILL.md)
- **Output tree:** `docs/specs/<type>/<slug>.md` (see [`.nezam/specs/README.md`](../specs/README.md))
- **Design template:** [`.nezam/templates/research-design/DESIGN.template.md`](../../templates/research-design/DESIGN.template.md)
