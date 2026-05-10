# NEZAM — Durable Project Memory

> Source of truth for decisions that must survive session resets.  
> Update after every phase gate, architecture decision, design lock, or stack selection.

## Layer Reference

- Full model: [`MEMORY_ARCHITECTURE.md`](./MEMORY_ARCHITECTURE.md)
- Cross-agent boundary handoff: [`PHASE_HANDOFF.md`](./PHASE_HANDOFF.md)

## Active Stack Decisions

_(Append dated bullets when stack choices are locked.)_

- Format: `[YYYY-MM-DD] <decision> — rationale: <why> — owner: <agent>`
- [2026-05-10] NEZAM workspace upgraded — skills consolidated, 10 new tech stack skills, MCP registry, CLI orchestration, memory layers v2, token optimization, agent/skill alignment complete — rationale: execute v2 governance and routing upgrade baseline — owner: PM-01
- [2026-05-10] Phase 2 upgrades complete — settings-driven tool activation, `/Settings` command surface wiring, task routing fallback protocol, and end-to-end verification closed — rationale: finish PU-11..PU-15 routing system rollout — owner: PM-01

## Locked Architecture Decisions

_(Append ADRs as one-liners; full ADRs live under [`docs/03_architecture/`](../03_architecture/) or documented architecture paths.)_

## Locked Design Decisions

_(Typography scale, token names, breakpoints — anything agents must not override without an amendment trail.)_

## Accepted Tradeoffs

_(Intentional compromises and when to revisit.)_

## Naming Glossary

- **MT-ID**: master task identifier (format: `MT-###`)
- **PT-ID**: phase task identifier (format: `PT-<phase>-<subphase>-<seq>`)
- **Phase gate**: readiness control before a phase transition
- **PU-ID**: pending upgrade checklist item (`PU-01` … in `PENDING_UPGRADE_TASKS.md`)

## Release Posture

_(SemVer trajectory, ship criteria, rollout notes when known.)_

## Agent Scorecards (Tier-1 Eval)

_(After Tier-1 agent work, append summaries per [.cursor/agents/EVAL_FRAMEWORK.md](../../.cursor/agents/EVAL_FRAMEWORK.md).)_

## Tooling

- **Drift recovery:** run `pnpm ai:sync`; verify with `pnpm ai:check` before relying on routed commands across clients.
- **Agent evaluation:** [.cursor/agents/EVAL_FRAMEWORK.md](../../.cursor/agents/EVAL_FRAMEWORK.md) — tiered personas, confidence thresholds, remediation triggers.

## External Companion Notes

_(Strategy summaries pasted from companion sessions.)_

- [2026-05-10] Workspace v2 upgrade complete:
  - Skills: merged 3, added 10, archived 3.
  - Agents: added spec-writer, prompt-engineer, client-onboarding-agent; archived 10 legacy specialists.
  - Systems: MCP registry, CLI orchestration, memory layers v2, token audit process.
  - Tech stack references are now wired through primary agent and skill lanes.

When using external chats (Grok/Qwen/Gemini/etc.), keep rolling progress suitable for uploads in [`docs/reports/progress/PROGRESS_REPORT.latest.md`](../../reports/progress/PROGRESS_REPORT.latest.md) and brief companions from [`CONTEXT.md`](./CONTEXT.md).

- **Companion chat pattern:** Paste `CONTEXT.md` + `MEMORY.md` (this file) + `PRD.md` excerpts + current phase prompt for continuity.
