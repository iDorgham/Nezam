# Documentation hub

Canonical documentation for this workspace lives under `docs/`. Start with **[START.md](START.md)** for onboarding and command flow.

## Common entrypoints

| Area | Path |
|------|------|
| Onboarding and commands | [START.md](START.md) |
| AI companion context pack | [workspace/context/CONTEXT.md](workspace/context/CONTEXT.md) |
| Durable decisions / memory | [workspace/context/MEMORY.md](workspace/context/MEMORY.md) |
| Workspace capability index | [workspace/context/WORKSPACE_INDEX.md](workspace/context/WORKSPACE_INDEX.md) |
| SDD phase plans and tasks | [workspace/plans/](workspace/plans/) |
| Design profile catalog (source) | [../.cursor/design/README.md](../.cursor/design/README.md) — copy chosen profile to repo root `DESIGN.md` via `/START design` or `pnpm run design:apply -- <brand>` |
| Multi-client sync (Claude, Codex, Antigravity, Gemini, Qwen, …) | [workspace/context/MULTI_TOOL_INDEX.md](workspace/context/MULTI_TOOL_INDEX.md) |
| Developer stack catalog (2026) | [reference/developer-tech-stack-2026.md](reference/developer-tech-stack-2026.md) |
| Core required specs (PRD, SDD) | [core/required/](core/required/) |
| Generated scan and progress reports | [reports/](reports/) |
| Images for docs | [assets/](assets/) |

## Repository root

The repository root stays lean: `README.md`, package manifests, `scripts/`, and generated AI client stubs (`CLAUDE.md`, and so on). Do not add long-form docs at root; put them here under `docs/`.
