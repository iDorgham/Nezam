# {{PROJECT_NAME}} — Claude Code / Claude CLI context (workspace)

This repository follows workspace orchestration: Specification-Driven Development, SEO-first IA/content, `DESIGN.md` prototype-before-code, and disciplined Git/versioning (see workspace `README.md`).

## Read first

- `docs/context/instructions.md`
- `docs/context/workspace.md`
- `docs/context/project.md`
- `docs/specs/prd/PRD.md`
- `docs/prompts/PROJECT_PROMPT.md`

## Planning behavior

When asked to **plan** the project (initial or major replan):

1. Follow the mission and ordering in `docs/prompts/CLAUDE_CLI_PLAN.md` (SEO -> IA -> content -> design -> versioning -> roadmap/specs).
2. Prefer editing markdown under `docs/specs/sdd/` and `docs/specs/features/` over jumping to production UI code until `DESIGN.md` exists for user-facing work.
3. Do not override committed specs silently — use Decision Log sections when changing course.

## Cursor parity

The human may use Cursor slash commands **`/PLAN`**, **`/DEVELOP`**, **`/SAVE`** — keep repo artifacts compatible with that workflow.
