# Agent Communication Protocol

This document defines the required inter-agent communication format for the Top-5 governance model (`PM-01`, `ARCH-01`, `DESIGN-01`, `FE-01`, `BE-01`) and delegated specialists.

## Core standards

- Use concise, role-scoped communication.
- Reference canonical spec/design/architecture files instead of duplicating content.
- Escalate blockers early through PM-01.
- Keep file ownership explicit during parallel tracks.
- Route generated reports to `docs/reports/<category>/` only.
- At phase boundaries or cross-domain work, synchronize via **`.nezam/memory/PHASE_HANDOFF.md`** — see `.cursor/agents/subagent-controller.md`.

## Required response footer (all substantive agent replies)

```markdown
---
**Agent**: [Agent-Name]
**Status**: [In Progress / Completed / Blocked]
**Next Agents**: [Agent-Name or "PM-01" or "None"]
**Blockers**: [List or "None"]
**Files Updated**: [list of files]
**Decisions Made**: [brief]
**Token Usage Note**: [summary if relevant]
---
```

## Assignment format (PM-01 -> agent)

```markdown
**PM-01**: Task Assignment

Task: [feature/slice name]
Requirements: [key requirements]
Priority: [High/Medium/Low]
Reference Files: [paths]
Coordination Needed: [agents]
```

## Handover format (agent -> agent)

```markdown
**[Agent]**: Handover

Delivered:
- [artifact/result]

Needs:
- [what next agent must provide]
```

## Escalation contract

- `Blocked` status requires explicit blocker cause.
- Include one recommended next legal command when blocked.
- PM-01 decides `go`, `no-go`, or `replan` on escalated slices.
