# Reference ingest queue (incremental)

Large trees live under `docs/reference/` (agents, skills, design-systems, external kits). **Do not bulk-copy** into `.cursor/` without PRD scope.

## Procedure

1. Pick a slice tied to the active milestone (see [`plan/INDEX.md`](../../plan/INDEX.md) and [`docs/specs/prd/PRD.md`](../specs/prd/PRD.md)).
2. Diff reference folder vs [`.cursor/skills/`](../../.cursor/skills/) / [`.cursor/agents/`](../../.cursor/agents/) for namesakes or overlapping intent.
3. Prefer **upgrading** an existing `SKILL.md` / agent charter when the reference adds stricter validation or newer standards.
4. Scaffold **new** skills/agents only via [`docs/templates/SKILL.template.md`](../templates/SKILL.template.md) / [`AGENT.template.md`](../templates/AGENT.template.md) and register in the respective README index.
5. Log decisions in [`docs/context/MEMORY.md`](../context/MEMORY.md) when governance changes.

## Priority hints

- **Design brands:** live under [`.cursor/design/<brand>/design.md`](../../.cursor/design/) (see [stub](design/README.md)). Former `docs/reference/design/` paths redirect conceptually there.
- Design tokens: reconcile with root [`DESIGN.md`](../../DESIGN.md) before adding conflicting CSS guidance.
- Testing kits: align with [`TEST_MATRIX.md`](../../TEST_MATRIX.md) before generating test files.
