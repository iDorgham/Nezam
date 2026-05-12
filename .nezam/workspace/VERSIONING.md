# NEZAM — Versioning Policy

## System Version

NEZAM uses Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

| Increment | When |
|-----------|------|
| MAJOR | Breaking changes to gate contracts, state file schemas, or command signatures |
| MINOR | New agents, new skills, new commands, expanded multi-tool support |
| PATCH | Bug fixes, path corrections, documentation improvements |

**Current NEZAM version:** `3.0.0`  
Tracked in: `.cursor/state/AGENT_REGISTRY.yaml` → `nezam_version`

---

## Agent and Skill Versioning

All agents (`.cursor/agents/*.md`) and skills (`.cursor/skills/**/SKILL.md`) carry a version in their frontmatter:

```yaml
---
version: 1.0.0
certified: false
updated: YYYY-MM-DD
changelog: []
---
```

### Certification Levels

| Level | Meaning |
|-------|---------|
| `certified: false` | Draft — functional but not production-validated |
| `certified: true` | Validated against EVAL_FRAMEWORK at Tier 1 and real-project run |

Certified agents are listed in `.cursor/state/AGENT_REGISTRY.yaml` → `certified_agents`.

### Changelog Format (per agent/skill)

```yaml
changelog:
  - version: 1.1.0
    date: 2026-05-12
    changes: "Added build_mode awareness in session start protocol"
  - version: 1.0.0
    date: 2026-05-10
    changes: "Initial version"
```

---

## State File Schema Versioning

State schemas live in `.cursor/state/schemas/`. When a schema changes:
1. Bump `schema_version` in the schema file.
2. Add a migration note: what changed, what old values map to.
3. Run `/check repair` to validate all state files against new schema.

---

## Sync and Distribution

- After any agent/skill/rule change: run `pnpm ai:sync`
- After sync: run `pnpm ai:check` to verify no drift
- Git pre-commit hook auto-runs `pnpm ai:sync` when `.cursor/` files are staged
- Install hook: `bash scripts/setup-hooks.sh`
