# NEZAM — Pending upgrade tasks (workspace v2)

**Primary playbooks**

| Playbook | Scope |
| --- | --- |
| [`PENDING_UPGRADE_PROMPTS.md`](PENDING_UPGRADE_PROMPTS.md) | PU-01–10 execution text (duplicate of older master prompt set) |
| [`MASTER_UPGRADE_PROMPTS.md`](MASTER_UPGRADE_PROMPTS.md) | Full prompt text incl. PU-11–15 (settings / tool routing Phase 2) |

**Task ID prefix:** `PU-##` (Pending Upgrade). Run **PU-01 → PU-10** first unless you are explicitly doing Phase 2 settings work (**PU-11 → PU-15**).  
**Per task:** Paste the matching ` ```prompt ` block from the playbook, complete work, check boxes, run `pnpm ai:sync` when specified.

**Document map** (read for context; optional / separate tracks — not all are in the PU checklist)

| Doc | Role |
| --- | --- |
| [`CONTEXT.md`](CONTEXT.md) | Companion / upload briefing |
| [`MEMORY.md`](MEMORY.md) | Durable decisions (`MEMORY_ARCHITECTURE.md` for layers) |
| [`PHASE_HANDOFF.md`](PHASE_HANDOFF.md) | Cross-agent boundary packet |
| [`MCP_REGISTRY.md`](MCP_REGISTRY.md) | MCP-first table + policy (orchestration rule points here) |
| [`CLI_TOOLS_CONTEXT.md`](CLI_TOOLS_CONTEXT.md) | CLI profiles + routing (PU-06 / PU-14 / PU-15) |
| [`MULTI_TOOL_INDEX.md`](MULTI_TOOL_INDEX.md) | Cross-client commands + sync |
| [`WORKSPACE_INDEX.md`](WORKSPACE_INDEX.md) | Capability index (PU-08 / PU-10 refresh) |
| [`SKILL_CHANGELOG.md`](SKILL_CHANGELOG.md) | Skill version notes (update after major skill changes) |
| [`AGENT_COMM_PROTOCOL.md`](AGENT_COMM_PROTOCOL.md) | Handover + response footer contract |
| [`ERROR_HANDLING_PROTOCOL.md`](ERROR_HANDLING_PROTOCOL.md) | Error report + `/FIX` ladder |
| [`AGENT_AUDIT.md`](AGENT_AUDIT.md) | Tier classification (SWARM_FIX 03 output) |
| [`DECISIONS_PLAIN.md`](DECISIONS_PLAIN.md) | Founder-readable decision log |
| [`CURSOR-PROMPT-SDD-V3.md`](CURSOR-PROMPT-SDD-V3.md) | Session card: load SDD v3 + orchestration rules |
| [`CURSOR-PROMPT-DESIGN-WIREFRAMES.md`](CURSOR-PROMPT-DESIGN-WIREFRAMES.md) | Design / wireframe phase paste |
| [`NEZAM-V2-UPGRADE-PROMPT.md`](NEZAM-V2-UPGRADE-PROMPT.md) | Block-by-block v2 (multi-tool, plan, gates) |
| [`HIERARCHY_REDESIGN_PROMPTS.md`](HIERARCHY_REDESIGN_PROMPTS.md) | Strategic layer, ethics archive, hierarchy fixes |
| [`SWARM_FIX_PROMPTS.md`](SWARM_FIX_PROMPTS.md) | Routing, PHASE_HANDOFF, agent audit methodology |
| [`NEZAM_MASTER_REFACTOR_PROMPT.md`](../../reference/NEZAM_MASTER_REFACTOR_PROMPT.md) | 8-track major refactor — **separate scope** from PU-* |

---

## Progress summary

| ID | Phase | Est. | Status |
|----|--------|------|--------|
| PU-01 | Skills audit (merge + archive) | ~5 min | ✅ Complete |
| PU-02 | 10 tech-stack skills | ~10 min | ✅ Complete |
| PU-03 | Wire `developer-tech-stack-2026.md` into context | ~5 min | ✅ Complete |
| PU-04 | Memory layers v2 | ~5 min | ✅ Complete |
| PU-05 | MCP registry + policy | ~5 min | ✅ Complete |
| PU-06 | CLI orchestration | ~8 min | ✅ Complete |
| PU-07 | Token optimization v2 | ~5 min | ✅ Complete |
| PU-08 | Agent + skill alignment | ~8 min | ✅ Complete |
| PU-09 | Verification pass | ~5 min | ✅ Complete |
| PU-10 | README / index polish | ~8 min | ✅ Complete |
| PU-11 | Wire `workspace.settings.yaml` into agent layer | ~10 min | ✅ Complete |
| PU-12 | Settings-aware task tagging in `/PLAN` | ~8 min | ✅ Complete |
| PU-13 | Tool deactivation + reactivation protocol | ~8 min | ✅ Complete |
| PU-14 | Register `/Settings` across help + context docs | ~8 min | ✅ Complete |
| PU-15 | Phase 2 routing verification | ~10 min | ✅ Complete |

✅ All listed PU tasks are complete (PU-01 through PU-15). Keep this file as the execution log and reference for follow-on tracks.

---

## PU-01 — Skills audit: merge, archive, consolidate

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 01](PENDING_UPGRADE_PROMPTS.md#prompt-01--skills-audit-merge-archive-consolidate)

- [x] **PU-01.1** Merge `context-compressor` → `context-window-manager` (`## Compression Mode`); archive `context-compressor/`
- [x] **PU-01.2** Merge `design-system-builder` → `design-tokens` (`## System Build Mode`); archive `design-system-builder/`
- [x] **PU-01.3** Merge `frontend-design-pro` → `design-tokens` (`## Frontend Integration Mode`); repoint `@nezam-frontend-design-pro` → `@nezam-pro-design-tokens` + path `design/design-tokens/SKILL.md`; archive `frontend-design-pro/`
- [x] **PU-01.4** Arabic content: Egyptian routing → sibling `egyptian-arabic-content` pack; removed `dialect_modules/egyptian.md`; updated `SKILL.md` JSON, `dialect_router.yaml`, README, `arabic_content_master.md`
- [x] **PU-01.5** Update `.cursor/skills/README.md` counts + Archive table
- [x] **PU-01.6** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Skills audit complete`

---

## PU-02 — New skills from tech stack

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 02](PENDING_UPGRADE_PROMPTS.md#prompt-02--new-skills-from-tech-stack-missing-coverage)  
**Reference:** [`docs/reference/developer-tech-stack-2026.md`](../../reference/developer-tech-stack-2026.md)

Create each under `.cursor/skills/` with template in playbook:

- [x] **PU-02.1** `backend/drizzle-orm/SKILL.md`
- [x] **PU-02.2** `backend/neon-postgres/SKILL.md`
- [x] **PU-02.3** `backend/background-jobs/SKILL.md`
- [x] **PU-02.4** `backend/vercel-ai-sdk/SKILL.md`
- [x] **PU-02.5** `backend/clerk-auth/SKILL.md`
- [x] **PU-02.6** `backend/resend-email/SKILL.md`
- [x] **PU-02.7** `backend/typesense-search/SKILL.md`
- [x] **PU-02.8** `infrastructure/product-analytics/SKILL.md`
- [x] **PU-02.9** `infrastructure/llm-observability/SKILL.md`
- [x] **PU-02.10** `backend/openrouter/SKILL.md`
- [x] **PU-02.11** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Tech stack skills created`

---

## PU-03 — Tech stack as context documentation

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 03](PENDING_UPGRADE_PROMPTS.md#prompt-03--add-tech-stack-as-context-documentation)

- [x] **PU-03.1** `docs/workspace/context/CONTEXT.md` — Core Paths bullet for tech stack file
- [x] **PU-03.2** `.cursor/agents/lead-solution-architect.md` — lens + “verify in tech stack reference” rule
- [x] **PU-03.3** `.cursor/agents/lead-backend-architect.md` — same
- [x] **PU-03.4** `.cursor/agents/subagent-controller.md` — `tech_stack_constraints` input
- [x] **PU-03.5** `docs/reference/developer-tech-stack-2026.md` — Maintenance / NEZAM policy bullets
- [x] **PU-03.6** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Tech stack context wired`

---

## PU-04 — Memory layers v2

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 04](PENDING_UPGRADE_PROMPTS.md#prompt-04--improve-memory-layers)

- [x] **PU-04.1** Replace `docs/workspace/context/MEMORY.md` with v2 structure (sections per playbook)
- [x] **PU-04.2** `MEMORY_ARCHITECTURE.md` — Layer 0 Capture Protocol + `PHASE_HANDOFF.md` row in Layer 1 table
- [x] **PU-04.3** `.cursor/rules/workspace-orchestration.mdc` — `## Memory Capture Protocol`
- [x] **PU-04.4** `CONTEXT.md` — AUTO-MANAGED snapshot lines (tech stack, memory, phase handoff, agent counts)
- [x] **PU-04.5** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Memory layers upgraded`

---

## PU-05 — MCP usage improvement

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 05](PENDING_UPGRADE_PROMPTS.md#prompt-05--mcp-usage-improvement)

- [x] **PU-05.1** Create `docs/workspace/context/MCP_REGISTRY.md` (table + MCP-first policy)
- [x] **PU-05.2** Create or update `.cursor/mcp.json` (servers per playbook JSON)
- [x] **PU-05.3** `.cursor/rules/workspace-orchestration.mdc` — `## MCP Usage Policy`
- [x] **PU-05.4** Add MCP registry lens to: `lead-solution-architect`, `lead-backend-architect`, `lead-database-architect`, `lead-devops-performance`, `observability-specialist`
- [x] **PU-05.5** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — MCP governance layer created`

---

## PU-06 — CLI orchestration

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 06](PENDING_UPGRADE_PROMPTS.md#prompt-06--free-cli-orchestration-silent-multi-model-pipeline)

- [x] **PU-06.1** Create `.cursor/skills/system/cli-orchestration/SKILL.md`
- [x] **PU-06.2** Create `.cursor/rules/cli-orchestration.mdc`
- [x] **PU-06.3** `.cursor/skills/system/multi-agent-handoff/SKILL.md` — CLI Delegation Protocol section
- [x] **PU-06.4** `.cursor/skills/system/token-budget-manager/SKILL.md` — CLI Offload Budget Strategy section
- [x] **PU-06.5** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — CLI orchestration system built`

---

## PU-07 — Token optimization v2

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 07](PENDING_UPGRADE_PROMPTS.md#prompt-07--token-optimization-for-claude-cursor-antigravity-codex)

- [x] **PU-07.1** Replace/upgrade `.cursor/skills/system/token-budget-manager/SKILL.md` to v2 body in playbook
- [x] **PU-07.2** `CONTEXT.md` — Token Cache Hint block at top (before Pipeline Contract)
- [x] **PU-07.3** `.cursor/rules/workspace-orchestration.mdc` — `## Token Economy Rules`
- [x] **PU-07.4** Token audit log — playbook uses `docs/reports/token-audit/TOKEN_AUDIT.md`; **this repo’s reports policy** approves [`docs/reports/perf/`](../../reports/perf/) for profiling/token-spend notes. Prefer **`docs/reports/perf/TOKEN_AUDIT.latest.md`** (or `perf-token-audit-<YYYYMMDD>.md` per [perf README](../../reports/perf/README.md)); if you strictly follow PROMPT 07 path, add a `README.md` under a new folder only after confirming policy with maintainer.
- [x] **PU-07.5** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Token optimization complete`

---

## PU-08 — Agent + skill alignment

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 08](PENDING_UPGRADE_PROMPTS.md#prompt-08--final-agent--skill-alignment-wire-everything-together)

- [x] **PU-08.1** Link PU-02 skills to agents per mapping in playbook (drizzle → `lead-database-architect`, …)
- [x] **PU-08.2** Link `cli-orchestration` to `subagent-controller.md` + `swarm-leader.md`
- [x] **PU-08.3** `subagent-controller.md` — Pre-Routing CLI Check section
- [x] **PU-08.4** `.cursor/skills/README.md` — updated category counts
- [x] **PU-08.5** `docs/workspace/context/WORKSPACE_INDEX.md` — skills count, MCP_REGISTRY, token audit path (e.g. `docs/reports/perf/TOKEN_AUDIT.latest.md`), cli-orchestration rule
- [x] **PU-08.6** Add `spec-generator` skill if missing; reference from `spec-writer.md`
- [x] **PU-08.7** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Agent/skill alignment complete`

---

## PU-09 — Verification

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 09](PENDING_UPGRADE_PROMPTS.md#prompt-09--verify-everything-syncs-and-works)

- [x] **PU-09.1** `pnpm ai:sync`
- [x] **PU-09.2** `pnpm ai:check`
- [x] **PU-09.3** Grep archived skill refs: `@nezam-frontend-design-pro`, `@nezam-design-system-builder`, `@nezam-context-compressor` → fix hits
- [x] **PU-09.4** Grep stale agent refs: `knowledge-sharing-agent`, `data-engineer`, `react-component-lead`, `prototyping-design-system-manager`, `bias-fairness-specialist` → fix hits
- [x] **PU-09.5** Confirm 10 skill directories exist (`ls` paths from playbook)
- [x] **PU-09.6** Confirm `spec-writer`, `prompt-engineer`, `client-onboarding-agent` exist
- [x] **PU-09.7** Confirm `MCP_REGISTRY.md` and `cli-orchestration` skill present
- [x] **PU-09.8** Final `pnpm ai:sync` + `pnpm ai:check`
- [x] **PU-09.9** Append upgrade line to `MEMORY.md` Active Stack Decisions (date-stamp update if upgrading later than 2026-05-10)
- [x] **PU-09.10** Spot-check: `AGENT_COMM_PROTOCOL.md` footer + `ERROR_HANDLING_PROTOCOL.md` formats still match `subagent-controller.md` / `/FIX` docs
- [x] **Acceptance:** `DONE — Full workspace verified`

---

## PU-10 — README and documentation finale

**Playbook:** [PENDING_UPGRADE_PROMPTS.md § PROMPT 10](PENDING_UPGRADE_PROMPTS.md#prompt-10--final-readme-and-documentation-update)

- [x] **PU-10.1** `.cursor/skills/README.md` — counts, Archive section, “New in v2” ten skills
- [x] **PU-10.2** `.cursor/agents/README.md` — align with hierarchy (new + archived table if still accurate)
- [x] **PU-10.3** `WORKSPACE_INDEX.md` — MCP, TOKEN_AUDIT, CLI rule, counts
- [x] **PU-10.4** `MULTI_TOOL_INDEX.md` — CLI matrix note + MCP-first policy pointer
- [x] **PU-10.5** `MEMORY.md` External Companion Notes — workspace v2 completion summary (adjust date if needed)
- [x] **PU-10.6** `SKILL_CHANGELOG.md` — add row if any PU skill version bump is material
- [x] **PU-10.7** `DECISIONS_PLAIN.md` — one plain-language line for “workspace v2 shipped” if founders use this log
- [x] **PU-10.8** `pnpm ai:sync` then `pnpm ai:check`
- [x] **Acceptance:** `DONE — Workspace v2 upgrade complete`

---

## Optional / separate tracks (not PU-01–15)

Use when the numbered queue is done or when scope explicitly includes hierarchy / swarm / mega-refactor work.

| ID | When to use | Primary doc |
| --- | --- | --- |
| **OPT-A** | After `.cursor/` rollback — re-run sync + gates | [`NEZAM-V2-UPGRADE-PROMPT.md`](NEZAM-V2-UPGRADE-PROMPT.md) Block 7 |
| **OPT-B** | Onboarding CLI one-liners | [`NEZAM-V2-UPGRADE-PROMPT.md`](NEZAM-V2-UPGRADE-PROMPT.md) Block 10 |
| **OPT-C** | New session — load SDD v3 rules card | [`CURSOR-PROMPT-SDD-V3.md`](CURSOR-PROMPT-SDD-V3.md) |
| **OPT-D** | Design / wireframe phase paste | [`CURSOR-PROMPT-DESIGN-WIREFRAMES.md`](CURSOR-PROMPT-DESIGN-WIREFRAMES.md) |
| **OPT-E** | Strategic layer, ethics archive, hierarchy sequencing | [`HIERARCHY_REDESIGN_PROMPTS.md`](HIERARCHY_REDESIGN_PROMPTS.md) (run in order; each ends with **DONE**) |
| **OPT-F** | Routing bottlenecks, PHASE_HANDOFF, tier audit refresh | [`SWARM_FIX_PROMPTS.md`](SWARM_FIX_PROMPTS.md) |
| **OPT-G** | Full 8-track command/skill/agent refactor | [`NEZAM_MASTER_REFACTOR_PROMPT.md`](../../reference/NEZAM_MASTER_REFACTOR_PROMPT.md) — **do not** mix with PU-* without explicit scope |
| **OPT-H** | Re-classify agents only (no file moves) | Update [`AGENT_AUDIT.md`](AGENT_AUDIT.md) per SWARM_FIX 03 |

---

---

## PU-11 — Wire workspace.settings.yaml into agent layer

**Playbook:** MASTER_UPGRADE_PROMPTS.md § PROMPT 11

- [x] **PU-11.1** `.cursor/rules/workspace-orchestration.mdc` — add `## Settings-Driven Routing` section
- [x] **PU-11.2** `.cursor/agents/subagent-controller.md` — replace Pre-Routing CLI Check with Settings-Aware Pre-Routing Protocol
- [x] **PU-11.3** `.cursor/agents/swarm-leader.md` — add Session Start Protocol (load settings + verify tools)
- [x] **PU-11.4** `.cursor/agents/client-onboarding-agent.md` — add Step 2: Tool Selection gate
- [x] **PU-11.5** `.cursor/commands/start.md` — add `/Settings ai-tools setup` to `/START all` sequence + `/START settings` alias
- [x] **PU-11.6** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Settings wired into agent layer`

---

## PU-12 — Settings-aware task tagging in /PLAN tasks

**Playbook:** MASTER_UPGRADE_PROMPTS.md § PROMPT 12

- [x] **PU-12.1** `.cursor/commands/plan.md` — add Task Tool Tagging section to `/PLAN tasks`
- [x] **PU-12.2** `.cursor/commands/plan.md` — add Task Re-routing on Tool Deactivation section
- [x] **PU-12.3** `.cursor/commands/create.md` — add tool-tagging logic to `/CREATE task`
- [x] **PU-12.4** Verify MASTER_TASKS.md schema includes `assigned_tool` + `fallback_tool` + `security` + `original_tool` fields
- [x] **PU-12.5** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Task tool tagging implemented`

---

## PU-13 — Graceful deactivation + reactivation protocol

**Playbook:** MASTER_UPGRADE_PROMPTS.md § PROMPT 13

- [x] **PU-13.1** `.cursor/rules/workspace-orchestration.mdc` — add `## Tool Deactivation Protocol` section
- [x] **PU-13.2** `.cursor/commands/settings.md` — update `/Settings ai-tools on <tool>` with Reactivation Restore logic
- [x] **PU-13.3** `.cursor/rules/workspace-orchestration.mdc` — add Session Start Checklist to Memory Capture Protocol
- [x] **PU-13.4** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — Deactivation protocol complete`

---

## PU-14 — Register /Settings command everywhere

**Playbook:** MASTER_UPGRADE_PROMPTS.md § PROMPT 14

- [x] **PU-14.1** `.cursor/commands/help.md` — add `/Settings` to QUICK REFERENCE + WORKFLOW ORDER
- [x] **PU-14.2** `CLAUDE.md` — add `settings.md` to synced command index
- [x] **PU-14.3** `docs/workspace/context/CONTEXT.md` — add CLI_TOOLS_CONTEXT.md + workspace.settings.yaml to Core Paths
- [x] **PU-14.4** `docs/workspace/context/WORKSPACE_INDEX.md` — add CLI_TOOLS_CONTEXT.md, workspace.settings.yaml, settings.md
- [x] **PU-14.5** `docs/workspace/context/MULTI_TOOL_INDEX.md` — add Settings Sync Note
- [x] **PU-14.6** Run `pnpm ai:sync`
- [x] **Acceptance:** `DONE — /Settings command registered everywhere`

---

## PU-15 — End-to-end verification of tool routing system

**Playbook:** MASTER_UPGRADE_PROMPTS.md § PROMPT 15

- [x] **PU-15.1** Verify `workspace.settings.yaml` exists and is valid YAML
- [x] **PU-15.2** Verify `CLI_TOOLS_CONTEXT.md` exists
- [x] **PU-15.3** Verify `settings.md` command file exists
- [x] **PU-15.4** Verify `settings.md` in CLAUDE.md command index
- [x] **PU-15.5** Verify `workspace-orchestration.mdc` has Settings-Driven Routing section
- [x] **PU-15.6** Verify `subagent-controller.md` has Settings-Aware Pre-Routing Protocol
- [x] **PU-15.7** Verify `swarm-leader.md` has Session Start Protocol
- [x] **PU-15.8** Verify `/HELP` shows `/Settings`
- [x] **PU-15.9** Simulate routing decision for 3 task types (documentation, architecture-decision, arabic-translation)
- [x] **PU-15.10** Run `pnpm ai:sync && pnpm ai:check`
- [x] **PU-15.11** Append Phase 2 completion note to `MEMORY.md`
- [x] **Acceptance:** `DONE — Phase 2 complete`

---

## References (playbooks + paths)

| Doc | Role |
|-----|------|
| [PENDING_UPGRADE_PROMPTS.md](PENDING_UPGRADE_PROMPTS.md) | PU-01–10 prompt text |
| [MASTER_UPGRADE_PROMPTS.md](MASTER_UPGRADE_PROMPTS.md) | PU-01–15 + extended prompts |
| [CLI_TOOLS_CONTEXT.md](CLI_TOOLS_CONTEXT.md) | Tool profiles + routing (Phase 2) |
| [workspace.settings.yaml](../../../.cursor/workspace.settings.yaml) | Persistent tool enablement (PU-11–15) |
| [developer-tech-stack-2026.md](../../reference/developer-tech-stack-2026.md) | Service catalog (PU-02/03) |
| [MCP_REGISTRY.md](MCP_REGISTRY.md) | MCP servers + MCP-first policy (PU-05) |
| [MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md) / [MEMORY.md](MEMORY.md) | Memory layers + capture (PU-04) |
| [PHASE_HANDOFF.md](PHASE_HANDOFF.md) | Cross-agent handoff template |
| [WORKSPACE_INDEX.md](WORKSPACE_INDEX.md) / [MULTI_TOOL_INDEX.md](MULTI_TOOL_INDEX.md) | Index + multi-tool map (PU-08/10/14) |
| [AGENT_COMM_PROTOCOL.md](AGENT_COMM_PROTOCOL.md) / [ERROR_HANDLING_PROTOCOL.md](ERROR_HANDLING_PROTOCOL.md) | Comms + errors |
| [AGENT_AUDIT.md](AGENT_AUDIT.md) | Tier table (SWARM_FIX 03) |
| [SKILL_CHANGELOG.md](SKILL_CHANGELOG.md) / [DECISIONS_PLAIN.md](DECISIONS_PLAIN.md) | Skill / founder logs (PU-10) |
