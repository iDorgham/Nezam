# Claude Workspace Contract

This `CLAUDE.md` is generated from `.cursor/` contracts.

## Canonical source

- `.cursor/commands/`
- `.cursor/agents/`
- `.cursor/skills/`
- `.cursor/rules/`

When conflicts appear, follow:

1. `.cursor/rules/*.mdc`
2. `.cursor/skills/**/SKILL.md`
3. `.cursor/agents/*.md`

## Required behavior

- Keep SDD order: Planning -> SEO -> IA -> Content -> Design -> Development -> Release.
- Enforce hardlock prerequisites before implementation.
- Preserve recommendation footer behavior for Cursor-compatible flows.
- Prefer deterministic docs updates in `docs/workspace/context/` after substantive changes.
