---
name: prompt-library-and-ethics-swarm
overview: Embed standard + CoT invocation prompt templates into Tier 0/1/2 agents and the named CoT specialists, then add a 13th swarm (AI Ethics & Responsible Development) with 7 new agents fully integrated into the swarm catalog, routing matrix, and 6-phase lifecycle workflow.
todos:
  - id: tier0_prompts
    content: "Embed Standard (and CoT for CPO) prompt templates in Tier 0: cpo.md, deputy-orchestrator.md, knowledge-sharing-agent.md, conflict-resolution-agent.md, daily-sync-agent.md, code-generation-supervisor.md"
    status: pending
  - id: tier1_prompts
    content: Embed Standard prompts on all 12 Swarm Managers; add CoT to lead-solution-architect, lead-frontend-architect, lead-database-architect, lead-security-officer
    status: pending
  - id: tier2_prompts
    content: Embed Standard prompt scaffold on ~32 Team Managers (every *-manager.md not already covered)
    status: pending
  - id: named_cot_specialists
    content: Add Standard + CoT to code-review-specialist, business-analyst, requirements-analysis-manager
    status: pending
  - id: ethics_swarm_files
    content: Create 7 new files for the AI Ethics swarm (lead-ai-ethics-officer + 6 specialists), each with the full prompt + CoT exactly as drafted
    status: pending
  - id: governance_updates
    content: Update README.md, ORCHESTRATION_ALIASES.md (13-swarm matrix), SWARM_WORKFLOW.md (per-phase ethics gates + veto escalation), and orchestration-subagent-controller.md (Swarm 13 boundary + Ethics Activation Triggers)
    status: pending
  - id: verification
    content: "Verification sweep: rg counts for prompt sections, file existence, ref check, ReadLints, no leaked edits to generated mirrors"
    status: pending
isProject: false
---

## Goals

1. Make every leader/manager agent immediately usable as a runnable prompt by embedding `Invocation Prompt Template` (and `CoT Prompt Template` where applicable) sections in their persona files.
2. Add AI Ethics as a first-class 13th swarm with veto-to-CPO semantics and per-phase ethics gates.
3. Keep specialists in their current persona-doc style (no bloat) but expose their invocation templates via a per-swarm index in the new ethics file and via the existing `README.md` index.
4. Preserve generated-mirror discipline: edit only `.cursor/**` and `docs/workspace/context/governance/**`. User runs `pnpm ai:sync` afterwards.

## Standards

Every embedded prompt section follows this shape inside each persona file:

```markdown
## Invocation Prompt Template

You are the <role>. <one-line context>.

Project Context:
- ...
Your responsibilities:
- ...
Output:
1. ...
```

CoT-eligible files additionally get:

```markdown
## Chain-of-Thought Prompt Template

Think step by step. Use this reasoning process:
Step 1: ...
Step 2: ...
Final Output Format:
1. ...
```

All `{placeholder}` variables stay verbatim from your draft so they round-trip into orchestration.

## Files to edit (existing) — embed Standard prompt template

Tier 0:
- [.cursor/agents/cpo.md](.cursor/agents/cpo.md) — Standard + CoT (mirrors your "CPO – CoT Prompt").
- [.cursor/agents/deputy-orchestrator.md](.cursor/agents/deputy-orchestrator.md) — Standard.
- [.cursor/agents/knowledge-sharing-agent.md](.cursor/agents/knowledge-sharing-agent.md) — Standard ("Knowledge Sharing & Documentation Agent" prompt).
- [.cursor/agents/conflict-resolution-agent.md](.cursor/agents/conflict-resolution-agent.md) — Standard.
- [.cursor/agents/daily-sync-agent.md](.cursor/agents/daily-sync-agent.md) — Standard ("Daily Sync Prompt").
- [.cursor/agents/code-generation-supervisor.md](.cursor/agents/code-generation-supervisor.md) — Standard (Code Review variant).

Tier 1 (12 Swarm Managers) — Standard + CoT where you provided one:
- [.cursor/agents/lead-solution-architect.md](.cursor/agents/lead-solution-architect.md) — Standard + CoT.
- [.cursor/agents/lead-uiux-designer.md](.cursor/agents/lead-uiux-designer.md) — Standard.
- [.cursor/agents/lead-frontend-architect.md](.cursor/agents/lead-frontend-architect.md) — Standard + CoT.
- [.cursor/agents/lead-backend-architect.md](.cursor/agents/lead-backend-architect.md) — Standard.
- [.cursor/agents/lead-database-architect.md](.cursor/agents/lead-database-architect.md) — Standard + CoT.
- [.cursor/agents/lead-mobile-architect.md](.cursor/agents/lead-mobile-architect.md) — Standard.
- [.cursor/agents/lead-cms-saas-architect.md](.cursor/agents/lead-cms-saas-architect.md) — Standard.
- [.cursor/agents/lead-analytics-architect.md](.cursor/agents/lead-analytics-architect.md) — Standard.
- [.cursor/agents/lead-security-officer.md](.cursor/agents/lead-security-officer.md) — Standard + CoT (STRIDE).
- [.cursor/agents/lead-devops-performance.md](.cursor/agents/lead-devops-performance.md) — Standard ("Lead Performance Agent").
- [.cursor/agents/lead-qa-architect.md](.cursor/agents/lead-qa-architect.md) — Standard ("QA / Testing Agent").
- [.cursor/agents/lead-maintenance-agent.md](.cursor/agents/lead-maintenance-agent.md) — Standard.

Tier 2 (~32 Team Managers) — Standard prompt scaffold derived from each manager's existing scope/escalation sections; placeholders stay generic so per-task callers can fill them in. Files: every `*-manager.md` in `.cursor/agents/` not already listed above.

Tier 3 named specialists getting CoT — explicit from your message:
- [.cursor/agents/code-review-specialist.md](.cursor/agents/code-review-specialist.md) — Standard + CoT.
- [.cursor/agents/business-analyst.md](.cursor/agents/business-analyst.md) — Standard + CoT (Requirements Analyst).
- [.cursor/agents/requirements-analysis-manager.md](.cursor/agents/requirements-analysis-manager.md) — also gets CoT (it's the Tier 2 home of requirements work).

All other Tier 3 specialists are unchanged in this plan (kept persona-doc style, per default scope).

## New 13th swarm — files to create

New swarm: **AI Ethics & Responsible Development** (`lead-ai-ethics-officer`).

Create under `.cursor/agents/`:

- `lead-ai-ethics-officer.md` (Swarm Manager, frontmatter-leader style; subagents: bias-fairness, privacy-data-ethics, transparency-explainability, ai-safety-misuse, ip-copyright-ethics, ai-sustainability). Includes Standard + CoT templates exactly as drafted.
- `bias-fairness-specialist.md`
- `privacy-data-ethics-specialist.md`
- `transparency-explainability-specialist.md`
- `ai-safety-misuse-specialist.md`
- `ip-copyright-ethics-specialist.md`
- `ai-sustainability-specialist.md`

Each specialist gets persona-doc style + the CoT prompt you authored, and reports to `lead-ai-ethics-officer.md` with veto path to `cpo.md`.

## Governance updates

- [.cursor/agents/README.md](.cursor/agents/README.md):
  - Add Swarm 13 row to the Index and the Catalog.
  - Note "Invocation prompts embedded in leader/manager personas (search `## Invocation Prompt Template`)".
  - Update tier counts.
- [docs/workspace/context/governance/ORCHESTRATION_ALIASES.md](docs/workspace/context/governance/ORCHESTRATION_ALIASES.md):
  - Add row 13 to "Swarm routing tiers (12-swarm runtime)" — rename header to "13-swarm runtime".
  - Add `lead-ai-ethics-officer` to required completion checks for high-risk AI/data/user-facing scope.
- [docs/workspace/context/governance/SWARM_WORKFLOW.md](docs/workspace/context/governance/SWARM_WORKFLOW.md):
  - Add an "Ethics gate" callout to Phase 1 (intake AI scope), Phase 2 (design ethics review), Phase 3 (implementation guardrails), Phase 4 (red-team / fairness checks), Phase 5 (launch ethics sign-off), Phase 6 (drift/abuse monitoring).
  - Add Ethics veto-to-CPO escalation row and "Documentation: ethics review log via `knowledge-sharing-agent`" handoff.
- [.cursor/agents/orchestration-subagent-controller.md](.cursor/agents/orchestration-subagent-controller.md):
  - Add Swarm 13 to the boundary list.
  - Add an `## Ethics Activation Triggers` micro-section (AI features, user-facing AI, AI-generated code, sensitive data flows, model deployment).

## Out of scope (explicit)

- Not adding `## Invocation Prompt Template` to ~80 persona-doc specialists (per default scope).
- Not editing generated mirrors (`.claude/**`, `.antigravity/**`, `CLAUDE.md`, `AGENTS.md`).
- Not creating chained per-feature workflow examples (e.g., "User Login System") — can be a follow-up.
- Not exporting prompts to JSON/Notion — can be a follow-up.

## Verification (post-edit, pre-handoff)

- `rg "## Invocation Prompt Template" .cursor/agents` returns ~50 hits (Tier 0 + Tier 1 + ~32 Tier 2 + 1 ethics manager + 6 ethics specialists).
- `rg "## Chain-of-Thought Prompt Template" .cursor/agents` returns ≥10 hits (CPO, 4 named leads, code-review, business-analyst, requirements-analysis-manager, ethics manager, 6 ethics specialists).
- New swarm: `ls .cursor/agents/{lead-ai-ethics-officer,bias-fairness-specialist,privacy-data-ethics-specialist,transparency-explainability-specialist,ai-safety-misuse-specialist,ip-copyright-ethics-specialist,ai-sustainability-specialist}.md` all exist.
- `rg "Swarm 13|13-swarm|lead-ai-ethics-officer" docs/workspace/context/governance/` non-empty.
- `git diff -- .claude .antigravity CLAUDE.md AGENTS.md` empty.
- `ReadLints` clean on every touched file.

## Followups (offer after this plan completes)

1. Generate one chained example (e.g., User Login System) wiring outputs across Requirements → Solution Architect → Security → Backend → Frontend → Ethics → Code Review → QA → CPO.
2. Export the embedded prompt library to a single `docs/reference/prompt-library.md` (build script, deterministic from persona frontmatter).
3. Add JSON-output variants for orchestration framework consumption (CrewAI/LangGraph).