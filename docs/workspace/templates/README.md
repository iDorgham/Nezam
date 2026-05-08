# Core templates

Canonical `/CREATE` sources live here. Templates are grouped **by category**; gate and phase scaffolds stay under [`plan/`](plan/).

## Categories

| Folder | Purpose |
| ------ | ------- |
| [`specs/`](specs/) | Product and delivery artifacts — PRD, feature spec, project prompt, progress report, constitution |
| [`research-design/`](research-design/) | SEO research and `docs/DESIGN.md` scaffolding |
| [`ui-ux/`](ui-ux/) | UI foundation contracts, token starter files, component blueprints, validation checklists, and swarm execution artifacts |
| [`ai-client/`](ai-client/) | Multi-tool memory files (`AGENTS.md`, `CLAUDE.md`, …), agent/skill charters, Claude CLI/Code handoffs |
| [`sdd/`](sdd/) | SDD versioning and related spine fragments |
| [`plan/`](plan/) | Gate matrices, automation checklists, prompt schemas, phase/subphase construction guides |

Exact `/CREATE` mappings: [`.cursor/commands/create.md`](../../../.cursor/commands/create.md).

## UI/UX swarm artifacts

The `ui-ux/` category also includes swarm-ready templates for coordinated execution:

- `SWARM_TASK.template.md`
- `SWARM_HANDOFF.template.md`
- `LIBRARY_DS_MAP.template.md`
- `COLOR_SYNC_REPORT.template.md`
- `SWARM_COMPLETE.template.md`

When used, include `ownerTeam`, `requiredSkills`, and `appliedRules` metadata so leadership ownership and governance tracing stay explicit.
