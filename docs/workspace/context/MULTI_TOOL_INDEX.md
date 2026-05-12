# Workspace context — multi-tool & specifications

This file is the **workspace-context** companion to the full client sync matrix.

- **Full multi-tool client map** (Cursor, Claude, Codex, Gemini, Qwen, etc.): [`docs/nezam/memory/MULTI_TOOL_INDEX.md`](../../nezam/memory/MULTI_TOOL_INDEX.md)

## Canonical specifications (`docs/specs/`)

SDD-aligned specs produced by the **spec-writing** skill live under:

```
docs/specs/<type>/<slug>.md
```

Where `<type>` is one of: `prd`, `ia`, `content`, `design`, `api`, `agent`.

| Skill | Location |
| ----- | -------- |
| Spec writing procedure | [`.cursor/skills/system/spec-writing/SKILL.md`](../../../.cursor/skills/system/spec-writing/SKILL.md) |
| Feature slice generator (10-field SPEC) | [`.cursor/skills/system/spec-generator/SKILL.md`](../../../.cursor/skills/system/spec-generator/SKILL.md) |

When a new spec file is added, append its path under this section for discoverability.

## Sync discipline

- Edit commands, agents, skills, and rules only under `.cursor/`.
- Run `pnpm ai:sync` then `pnpm ai:check` after registry or skill changes.
