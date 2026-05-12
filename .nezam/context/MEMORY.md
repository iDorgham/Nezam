# Memory Schema and Access Patterns

## 1. Memory schema (types, retention)
- **Short-term Memory**: Session-specific context, erased after session ends.
- **Long-term Memory (Durable)**: Stored in `.nezam/memory/MEMORY.md` and related files. Retained indefinitely until explicitly archived.
- **Types**: Decisions, Glossaries, Glossaries, Architecture Decision Records (ADRs).

## 2. Access patterns
- Agents read `MEMORY.md` at the start of a session.
- Agents append to `MEMORY.md` when a decision is locked or a tradeoff is accepted.
- Agents reference `PHASE_HANDOFF.md` for cross-agent state.

## 3. Where agents read/write
- **Read**: `.nezam/memory/MEMORY.md`, `docs/prd/PRD.md`.
- **Write**: `.nezam/memory/MEMORY.md` (appends only), `.nezam/memory/PHASE_HANDOFF.md` (updates).

## 4. Example entries
```yaml
- [2026-05-12] Added PHASE_HANDOFF template — rationale: fulfill governance requirements — owner: Antigravity
- [2026-05-12] Created SWARM_WORKFLOW template — rationale: fulfill governance requirements — owner: Antigravity
```
