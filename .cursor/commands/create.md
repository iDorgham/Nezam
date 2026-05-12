/CREATE — Scaffold documents, prompts, and workspace artifacts

Subcommands:
  /CREATE prd           → Guided PRD creation with 7-question interview
  /CREATE prompt        → Scaffold PROJECT_PROMPT.md aligned to PRD
  /CREATE spec          → Create a feature spec under docs/specs/features/<slug>/
  /CREATE task          → Add a task to MASTER_TASKS.md with ID, owner, phase, metric
  /CREATE report        → Initialize a fresh progress report shell
  /CREATE handoff       → Generate AI handoff packet for external AI companion
  /CREATE design        → Create a new design profile in .cursor/design/<name>/design.md
  /CREATE agent         → Scaffold a new agent file with standard frontmatter
  /CREATE skill         → Scaffold a new skill folder with SKILL.md template
  /CREATE changelog     → Initialize CHANGELOG.md at workspace root if missing

Aliases: /CREATE feature → /CREATE spec | /CREATE doc → /CREATE prompt
Recommendation footer: required

---

## /CREATE task — Tool Tagging Rules

When creating a task entry in `docs/plans/MASTER_TASKS.md`, include routing fields:

1. Determine task `type` (for example: `documentation`, `scan`, `boilerplate`, `architecture-decision`).
2. Read active tool state from `.cursor/workspace.settings.yaml`.
3. Read routing matrix from `docs/nezam/memory/CLI_TOOLS_CONTEXT.md`.
4. Assign:
   - `assigned_tool` from the matching task-type lane.
   - `fallback_tool` from deactivation chain.
   - `security` flag (true for security-sensitive work).
5. If assigned tool is inactive, auto-apply fallback and keep `original_tool`.
6. If no fallback is active, write task as blocked with reason `NO_ACTIVE_TOOL`.
