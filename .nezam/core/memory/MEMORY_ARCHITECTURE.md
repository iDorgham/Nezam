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
| `.nezam/workspace/prd/PRD.md` | Product Requirements Document |
| `.nezam/core/plans/**` | Phase and task execution state |
| `docs/specs/**` | Feature specs and SDD artifacts |
| `.nezam/design/<brand>/design.md` | Active design profile |
| `.nezam/core/memory/CONTEXT.md` | Current project context and active priorities |
| `.nezam/core/memory/WORKSPACE_INDEX.md` | Static workspace map and capability index |
| `.nezam/core/memory/MEMORY.md` | Durable project facts, decisions, scorecards |
| `.nezam/core/memory/PHASE_HANDOFF.md` | Cross-agent brief at phase boundaries |
| `.nezam/core/memory/DECISIONS.md` | Plain-language decision log |
| `.nezam/workspace/reports/progress/PROGRESS_REPORT.latest.md` | Progress snapshot |

---

## Layer 2 — Team Behavior Contracts (Versioned)

| Path | Role |
|---|---|
| `.cursor/agents/**` | Team and persona charters, routing lenses |
| `.cursor/skills/**/SKILL.md` | Deterministic workflows and procedure contracts |
| `.cursor/rules/*.mdc` | Guardrails, hardlocks, and precedence policy |
| `.nezam/core/memory/AGENT_COMM_PROTOCOL.md` | Inter-agent communication standards |
| `.nezam/core/memory/ORCHESTRATION_ALIASES.md` | Command and alias routing governance |
| `.nezam/core/memory/ERROR_HANDLING_PROTOCOL.md` | Error classification and response |
| `.nezam/templates/**` | Reusable scaffolds for generated artifacts |

---

## Layer 3 — Workspace Governance (Root Level)

| Path | Role |
|---|---|
| `CLAUDE.md` | Claude workspace contract |
| `AGENTS.md` | Codex/AGENTS workspace contract |
| `GEMINI.md` | Gemini workspace contract |
| `QWEN.md` | Qwen workspace contract |
| `.nezam/workspace/meta/VERSIONING.md` | Versioning, tag, and release policy |
| `.nezam/core/memory/MCP_REGISTRY.md` | MCP tool registry |
| `.nezam/core/memory/MULTI_TOOL_INDEX.md` | Cross-tool capability map |
| `.nezam/core/memory/CLI_TOOLS_CONTEXT.md` | CLI tool reference |
| `.claude/**`, `.gemini/**`, `.opencode/**`, `.codex/**` | Generated client mirrors synced from `.cursor/` |

---

## Layer Diagram

```
Session Runtime (L0)
      │ captured via capture protocol
      ▼
Project SDD Truth (L1)  ←── git committed, source of truth
  .nezam/core/memory/MEMORY.md
  .nezam/core/plans/
  .nezam/workspace/prd/PRD.md
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
| `.nezam/core/memory/MEMORY.md` | `.nezam/core/memory/MEMORY.md` |
| `.nezam/core/memory/CONTEXT.md` | `.nezam/core/memory/CONTEXT.md` |
| `.nezam/core/memory/PHASE_HANDOFF.md` | `.nezam/core/memory/PHASE_HANDOFF.md` |
| `.nezam/core/memory/WORKSPACE_INDEX.md` | `.nezam/core/memory/WORKSPACE_INDEX.md` |
| `.nezam/core/memory/DECISIONS_PLAIN.md` | `.nezam/core/memory/DECISIONS.md` |
| `.nezam/core/memory/MULTI_TOOL_INDEX.md` | `.nezam/core/memory/MULTI_TOOL_INDEX.md` |
| `.nezam/core/memory/MCP_REGISTRY.md` | `.nezam/core/memory/MCP_REGISTRY.md` |
| `.nezam/core/memory/SKILL_CHANGELOG.md` | `.nezam/core/memory/SKILL_CHANGELOG.md` |
| `.nezam/workspace/prd/PRD.md` | `.nezam/workspace/prd/PRD.md` |
| `.nezam/core/plans/` | `.nezam/core/plans/` |
| `.nezam/workspace/templates/` | `.nezam/templates/` |
