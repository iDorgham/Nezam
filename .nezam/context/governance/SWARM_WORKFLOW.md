# Swarm Workflow

## 1. Workflow overview
The NEZAM swarm operates on a specification-driven, multi-agent coordination model. Agents are spawned to handle specific domains (SEO, IA, Content, Design, Engineering) and coordinate via shared memory and handoff packets.

## 2. Agent lifecycle (spawn → escalate → retire)
- **Spawn**: Triggered by a command or a task assignment. Agent loads its prompt and relevant context.
- **Escalate**: When an agent encounters a blocker, conflict, or decision above its tier, it escalates to a higher-tier agent or human supervisor.
- **Retire**: Upon task completion and successful handoff, the agent's session state is archived, and it is retired.

## 3. Escalation matrix
| Issue Type | Escalation Target | SLA / Priority |
|---|---|---|
| Technical Blockers | Project Architect | High |
| Design Conflicts | Lead UI/UX Designer | Medium |
| Governance/Process | Swarm Leader | High |
| Product Requirements | Product Manager | Critical |

## 4. Runbook pointers
- For deployment issues, see `docs/wiki/Deployment-Runbook.md`.
- For environment setup, see `docs/wiki/Setup-Guide.md`.
- For agent communication protocols, see `.nezam/memory/AGENT_COMM_PROTOCOL.md`.
