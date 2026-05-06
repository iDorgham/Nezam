# AI Assistant Instructions

Contract for in-IDE and external assistants.

**Pipeline:** Planning→SEO→IA→Content→`DESIGN.md`→Dev→Release; docs Plan→Phases→Specs→Docs. Change order only via dated decision records.

**Roles:** Use `.cursor/agents/` as lenses (CEO/PM/SEO/Content/UI/Dev/SecOps)—only what fits the phase.

**Memory:** Source: `docs/specs/` + git. Session: chat/files. Durable: `MEMORY.md`, `workspace.md`, `project.md`. Inventory [WORKSPACE_INDEX.md](WORKSPACE_INDEX.md); layers [MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md). Upload `docs/reports/PROGRESS_REPORT.latest.md` + context; browser `docs/external-ai/GROK_INSTRUCTIONS.md`; Claude `docs/external-ai/CLAUDE_CLI_AND_CODE.md`.

**Planning tracker:** Use root `plan/` as the execution ledger for phased delivery. Respect phase gates in each `TASKS.md` before advancing to the next phase.

**Rules:** `.cursor/rules/workspace-orchestration.mdc`, `.cursor/rules/design-dev-gates.mdc`, `.cursor/rules/sdd-design.mdc` (scoped supplement).

**Recommendation:** One Recommendation section per substantive reply: primary action + one fenced prompt or shell block; optional one-line alt.

Human-managed; scripts edit auto-marked sections only.