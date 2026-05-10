# Memory Architecture (Workspace)

Four conceptual memory layers. Nothing here replaces git history; committed specs and docs remain the source of truth.

## Layer 0 — Session Runtime (Ephemeral)

| What | Lifetime | Examples |
|---|---|---|
| Cursor chat and open buffers | Until session ends | Current thread, temporary assumptions |

**Practice:** Before ending a session, run `/SCAN` and persist anything important to Layer 1.

### Capture Protocol

When any of these events occur in chat, assistants must persist outcomes into documented layers before ending the reply:

| Trigger | Persist to |
|---|---|
| Stack/library choice locked | [`MEMORY.md`](./MEMORY.md) → **Active Stack Decisions** |
| Architecture pattern chosen | [`MEMORY.md`](./MEMORY.md) → **Locked Architecture Decisions** (link full ADR) |
| Design token/grid/motion locked | [`MEMORY.md`](./MEMORY.md) → **Locked Design Decisions** |
| Intentional compromise accepted | [`MEMORY.md`](./MEMORY.md) → **Accepted Tradeoffs** |
| Agent evaluation completed | [`MEMORY.md`](./MEMORY.md) → **Agent Scorecards** |
| Phase boundary crossed | [`PHASE_HANDOFF.md`](./PHASE_HANDOFF.md) |

---

## Layer 1 — Project SDD Truth (Durable, Committed to Git)

| Path | Role |
|---|---|
| `docs/prd/PRD.md` | Product Requirements Document |
| `docs/plans/**` | Phase and task execution state |
| `docs/specs/**` | Feature specs and SDD artifacts |
| `.cursor/design/<brand>/design.md` | Active design profile |
| `docs/memory/CONTEXT.md` | Current project context and active priorities |
| `docs/memory/WORKSPACE_INDEX.md` | Static workspace map and capability index |
| `docs/memory/MEMORY.md` | Durable project facts, decisions, scorecards |
| `docs/memory/PHASE_HANDOFF.md` | Cross-agent brief at phase boundaries |
| `docs/memory/DECISIONS.md` | Plain-language decision log |
| `docs/reports/progress/PROGRESS_REPORT.latest.md` | Progress snapshot |

---

## Layer 2 — Team Behavior Contracts (Versioned)

| Path | Role |
|---|---|
| `.cursor/agents/**` | Team and persona charters, routing lenses |
| `.cursor/skills/**/SKILL.md` | Deterministic workflows and procedure contracts |
| `.cursor/rules/*.mdc` | Guardrails, hardlocks, and precedence policy |
| `docs/memory/AGENT_COMM_PROTOCOL.md` | Inter-agent communication standards |
| `docs/memory/ORCHESTRATION_ALIASES.md` | Command and alias routing governance |
| `docs/memory/ERROR_HANDLING_PROTOCOL.md` | Error classification and response |
| `docs/templates/**` | Reusable scaffolds for generated artifacts |

---

## Layer 3 — Workspace Governance (Root Level)

| Path | Role |
|---|---|
| `CLAUDE.md` | Claude workspace contract |
| `AGENTS.md` | Codex/AGENTS workspace contract |
| `GEMINI.md` | Gemini workspace contract |
| `QWEN.md` | Qwen workspace contract |
| `docs/core/VERSIONING.md` | Versioning, tag, and release policy |
| `docs/memory/MCP_REGISTRY.md` | MCP tool registry |
| `docs/memory/MULTI_TOOL_INDEX.md` | Cross-tool capability map |
| `docs/memory/CLI_TOOLS_CONTEXT.md` | CLI tool reference |
| `.claude/**`, `.gemini/**`, `.opencode/**`, `.codex/**` | Generated client mirrors synced from `.cursor/` |

---

## Layer Diagram

```
Session Runtime (L0)
      │ captured via capture protocol
      ▼
Project SDD Truth (L1)  ←── git committed, source of truth
  docs/memory/MEMORY.md
  docs/plans/
  docs/prd/PRD.md
      │ governs behavior via
      ▼
Team Behavior Contracts (L2)
  .cursor/agents/
  .cursor/rules/
  .cursor/skills/
      │ broadcast to all clients via
      ▼
Workspace Governance (L3)
  CLAUDE.md · AGENTS.md · GEMINI.md · QWEN.md
  pnpm ai:sync → .claude/ .gemini/ .opencode/ .codex/
```

---

## Path Quick Reference

| Old Path | New Path |
|---|---|
| `docs/memory/MEMORY.md` | `docs/memory/MEMORY.md` |
| `docs/memory/CONTEXT.md` | `docs/memory/CONTEXT.md` |
| `docs/memory/PHASE_HANDOFF.md` | `docs/memory/PHASE_HANDOFF.md` |
| `docs/memory/WORKSPACE_INDEX.md` | `docs/memory/WORKSPACE_INDEX.md` |
| `docs/memory/DECISIONS_PLAIN.md` | `docs/memory/DECISIONS.md` |
| `docs/memory/MULTI_TOOL_INDEX.md` | `docs/memory/MULTI_TOOL_INDEX.md` |
| `docs/memory/MCP_REGISTRY.md` | `docs/memory/MCP_REGISTRY.md` |
| `docs/memory/SKILL_CHANGELOG.md` | `docs/memory/SKILL_CHANGELOG.md` |
| `docs/prd/PRD.md` | `docs/prd/PRD.md` |
| `docs/plans/` | `docs/plans/` |
| `docs/workspace/templates/` | `docs/templates/` |
