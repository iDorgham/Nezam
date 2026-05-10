# NEZAM Agent Hierarchy Redesign — Cursor Prompts
> Execute in sequence. Each prompt is a self-contained Cursor task.
> Do not run the next prompt until the previous one outputs "DONE".

---

## PROMPT 01 — Fix the Strategic Layer (Collapse CEO/CPO into Founder Lens)

**Problem:** `executive-director` (CEO) and `product-officer` (CPO) sit above the pipeline with no defined activation trigger. They are philosophical lenses invoked by nobody. `swarm-leader` handles all runtime. The dead strategic layer adds confusion without adding value.

```prompt
You are PM-01 (swarm-leader). Execute the following hierarchy fix for the strategic layer.

CONTEXT:
- `.cursor/agents/executive-director.md` has role: CEO, no swarm assignment, no slash command binding
- `.cursor/agents/product-officer.md` has role: CPO, owns final go/no-go but is never explicitly triggered
- `.cursor/agents/swarm-leader.md` is the actual runtime entry point for all execution
- `.cursor/rules/workspace-orchestration.mdc` defines the pipeline order

TASK — do exactly this, nothing more:

1. Open `.cursor/agents/executive-director.md`
   - Keep the file. Do NOT delete it.
   - Add a frontmatter field: `activation: founder-lens-only`
   - Add a section at the top: `> ⚠️ LENS ONLY — This agent is not a routing hop. Invoke directly when vision, positioning, or risk-appetite decisions are needed. Not part of the standard execution pipeline.`
   - Add explicit activation triggers: `when: ["/FOUNDER vision", "/FOUNDER risk", "strategic pivot decision", "product positioning review"]`

2. Open `.cursor/agents/product-officer.md`
   - Keep the file. Do NOT delete it.
   - Add a frontmatter field: `activation: gate-escalation-only`
   - Add a section at the top: `> ⚠️ ESCALATION ONLY — Invoked by swarm-leader or deputy-swarm-leader when final go/no-go is needed on scope, budget, or timeline. Not a daily routing stop.`
   - Update `when to invoke` to: only at phase gate transitions requiring cross-swarm sign-off or scope changes

3. Open `.cursor/agents/swarm-leader.md`
   - Add a section "Strategic Layer Protocol":
     ```
     ## Strategic Layer Protocol
     - Route to executive-director ONLY for: vision decisions, positioning pivots, risk appetite calls
     - Route to product-officer ONLY for: final go/no-go on scope/budget/timeline at phase gates
     - Default: handle all runtime routing directly without escalating to strategic layer
     - Never route strategic layer agents into normal task execution — they are escalation endpoints only
     ```

4. Run `pnpm ai:sync` after all edits.

OUTPUT: List of files changed + confirmation line "DONE — Strategic layer fixed"
```

---

## PROMPT 02 — Archive Ethics Sub-Specialists (Merge into Lead)

**Problem:** 6 ethics sub-specialist agents exist as separate files but are all listed as subagents of `lead-ai-ethics-officer`. They are never invoked independently — the lead delegates to them as mental model lenses. Separate files add maintenance overhead with zero activation gain.

```prompt
You are PM-01 (swarm-leader) acting as system consolidator. Execute the following ethics consolidation.

CONTEXT:
- `.cursor/agents/lead-ai-ethics-officer.md` already lists these as subagents:
  bias-fairness-specialist, privacy-data-ethics-specialist, ai-safety-misuse-specialist,
  ip-copyright-ethics-specialist, ai-sustainability-specialist
- Plus: `.cursor/agents/compliance-manager.md` handles regulatory compliance separately (keep active)
- None of the 6 sub-specialist files have independent slash command bindings or swarm assignments

TASK — do exactly this:

1. Create directory `.cursor/agents/archive/` if it does not exist.

2. Move these 6 files to `.cursor/agents/archive/` (move, not delete):
   - `bias-fairness-specialist.md`
   - `privacy-data-ethics-specialist.md`
   - `ai-safety-misuse-specialist.md`
   - `ip-copyright-ethics-specialist.md`
   - `ai-sustainability-specialist.md`
   - `transparency-explainability-specialist.md`

3. Open `.cursor/agents/lead-ai-ethics-officer.md` and add a new section `## Specialist Lenses` after the Charter:
   ```markdown
   ## Specialist Lenses
   > These domains are handled inline by this agent. Archived specialist files remain at `.cursor/agents/archive/` for reference.
   
   | Domain | Key Questions |
   |---|---|
   | Bias & Fairness | Disparate impact, at-risk groups, fairness thresholds |
   | Privacy & Data Ethics | PII flows, retention, consent, data minimization |
   | AI Safety & Misuse | Adversarial inputs, misuse vectors, guardrail sufficiency |
   | IP & Copyright | Training data provenance, output ownership, fair use |
   | AI Sustainability | Compute cost, carbon footprint, efficiency targets |
   | Transparency & Explainability | Model interpretability, audit trails, user disclosure |
   ```

4. Update the `subagents` frontmatter field in `lead-ai-ethics-officer.md` to:
   `subagents: [inline — see Specialist Lenses section]`

5. Run `pnpm ai:sync` after all edits.

OUTPUT: List of files moved + updated lead file confirmation + "DONE — Ethics consolidated"
```

---

## PROMPT 03 — Archive knowledge-sharing-agent (Merge into knowledge-update-manager)

**Problem:** `knowledge-sharing-agent` (cross-swarm propagation) and `knowledge-update-manager` (KB, runbooks, post-mortems) have overlapping memory-sync responsibilities. The sharing agent's `memory-sync` subagent duplicates what the update manager does. `knowledge-update-manager` already references the sharing agent as a dependency — circular and redundant.

```prompt
You are PM-01 (swarm-leader). Execute the following knowledge management consolidation.

CONTEXT:
- `.cursor/agents/knowledge-sharing-agent.md`: cross-swarm coordinator, owns MEMORY.md sync, decision broadcasting, doc-rot watching
- `.cursor/agents/knowledge-update-manager.md`: owns KB articles, runbooks, post-mortems, doc lifecycle
- Both reference each other as dependencies — circular ownership

TASK — do exactly this:

1. Open `.cursor/agents/knowledge-update-manager.md`
   - Absorb the knowledge-sharing-agent's responsibilities by adding a new section `## Cross-Swarm Sync Responsibilities`:
     ```markdown
     ## Cross-Swarm Sync Responsibilities
     > Absorbed from knowledge-sharing-agent (archived).
     
     - Sync `docs/workspace/context/MEMORY.md` and phase logs after substantive decisions.
     - Broadcast new ADRs and architecture decisions to affected swarms.
     - Watch for documentation rot; route stale docs to `docs-hygiene.md`.
     - Coordinate with `deputy-swarm-leader.md` on high-signal decision propagation.
     ```
   - Update `subagents` table to add: `memory-sync | MEMORY.md and phase log updates` and `decision-broadcast | ADR / decision distribution`
   - Update `when to invoke` to include: "New ADR or architecture decision", "Cross-swarm misalignment detected", "Periodic doc-rot sweep (weekly)"
   - Remove the reference to `knowledge-sharing-agent.md` from the Specialists section

2. Move `.cursor/agents/knowledge-sharing-agent.md` to `.cursor/agents/archive/`

3. Search all agent files in `.cursor/agents/` for any reference to `knowledge-sharing-agent` and replace with `knowledge-update-manager`.
   Run: grep -r "knowledge-sharing-agent" .cursor/agents/ to find all references, then update each.

4. Run `pnpm ai:sync` after all edits.

OUTPUT: List of files changed + moved file confirmation + "DONE — Knowledge management consolidated"
```

---

## PROMPT 04 — Archive data-engineer (Covered by data-pipeline-manager)

**Problem:** `data-engineer` is a free-floating persona with no swarm assignment, no `reports-to`, no frontmatter structure. `data-pipeline-manager` owns the same ELT/ETL, schema contracts, warehouse layers scope but with full swarm anchoring under `lead-database-architect`.

```prompt
You are PM-01 (swarm-leader). Execute the following data layer consolidation.

CONTEXT:
- `.cursor/agents/data-engineer.md`: no frontmatter, no swarm assignment, no reports-to — free-floating persona
- `.cursor/agents/data-pipeline-manager.md`: full Team Manager file, swarm: data-database, reports-to: lead-database-architect
- Both own: ELT/ETL pipelines, schema contracts, warehouse layers, PII tagging

TASK — do exactly this:

1. Open `.cursor/agents/data-pipeline-manager.md`
   - Add a section `## Inherited Responsibilities (from data-engineer)`:
     ```markdown
     ## Inherited Responsibilities
     > Absorbed from data-engineer (archived).
     
     - Source-system schema changes are contracts; breaking changes require versioning and a deprecation window.
     - Pipelines are idempotent, restartable, and observable end-to-end (lineage + freshness + volume).
     - Warehouse layers follow raw → staging → marts with explicit ownership per layer.
     - Cost and performance are first-class: query plans and partitioning are reviewed at design time.
     - PII flows are tagged at ingest and respected through every downstream model.
     ```
   - Add to `activation triggers`: `"/PLAN data"`, `"schema change review"`, `"pipeline freshness incident"`, `"warehouse cost spike"`

2. Move `.cursor/agents/data-engineer.md` to `.cursor/agents/archive/`

3. Run `pnpm ai:sync` after all edits.

OUTPUT: Files changed + moved file confirmation + "DONE — Data layer consolidated"
```

---

## PROMPT 05 — Archive react-component-lead (Merge into frontend-framework-manager)

**Problem:** `react-component-lead` owns component API and variants. `frontend-framework-manager` owns React 19 + Next.js architecture, rendering, and state. In a single-founder context these are the same person making the same decisions in the same session. Separate files create false context boundaries.

```prompt
You are PM-01 (swarm-leader). Execute the following frontend consolidation.

CONTEXT:
- `.cursor/agents/react-component-lead.md`: owns typed component architecture, variant APIs, token-driven styles, a11y DOM output
- `.cursor/agents/frontend-framework-manager.md`: owns React 19 + Next.js 15, routing, rendering modes, state architecture, data-fetching

TASK — do exactly this:

1. Open `.cursor/agents/frontend-framework-manager.md`
   - Add a section `## Component Architecture Responsibilities` after the existing Team Leader Scope:
     ```markdown
     ## Component Architecture Responsibilities
     > Absorbed from react-component-lead (archived).
     
     - Strongly typed props with exhaustive variant and state modeling.
     - Composition-first component APIs with semantic, accessible DOM output.
     - Tree-shakeable exports; reusable primitives architecture.
     - Token-driven styles only — no ad-hoc primitive values in components.
     - API consistency across page, section, and primitive component layers.
     - Component taxonomy and ownership boundaries documented per feature slice.
     ```
   - Update `subagents` table to add: `component-architecture | Typed variants, composition APIs, token-driven styling`
   - Add to activation triggers: `"component review"`, `"variant API review"`, `"/PLAN design"`

2. Move `.cursor/agents/react-component-lead.md` to `.cursor/agents/archive/`

3. Run `pnpm ai:sync` after all edits.

OUTPUT: Files changed + moved file confirmation + "DONE — Frontend consolidated"
```

---

## PROMPT 06 — Archive prototyping-design-system-manager (Merge into design-systems-token-architect)

**Problem:** `prototyping-design-system-manager` and `design-systems-token-architect` both live in the design swarm under `design-lead`. Their scopes — prototyping UI patterns vs. defining design tokens — are artificially split. For a single active design system, both are the same workflow.

```prompt
You are PM-01 (swarm-leader). Execute the following design system consolidation.

CONTEXT:
- `.cursor/agents/prototyping-design-system-manager.md`: prototyping patterns, rapid iteration, handoff to token system
- `.cursor/agents/design-systems-token-architect.md`: design tokens, typography scale, spacing contracts, component API tokens
- Both report to design-lead and are invoked during the same design phase

TASK — do exactly this:

1. Open `.cursor/agents/design-systems-token-architect.md`
   - Add a section `## Prototyping Responsibilities` (absorbed from prototyping-design-system-manager):
     ```markdown
     ## Prototyping Responsibilities
     > Absorbed from prototyping-design-system-manager (archived).
     
     - Own rapid prototype cycles to validate design decisions before token lock-in.
     - Translate approved prototypes into token definitions and component contracts.
     - Gate: no token is promoted to the design system without a validated prototype.
     - Maintain prototype → token → component decision trail in DESIGN.md.
     ```
   - Add to `when to invoke`: "New component pattern to prototype", "Design system iteration cycle", "Pre-token validation"

2. Move `.cursor/agents/prototyping-design-system-manager.md` to `.cursor/agents/archive/`

3. Run `pnpm ai:sync` after all edits.

OUTPUT: Files changed + moved file confirmation + "DONE — Design system consolidated"
```

---

## PROMPT 07 — Create spec-writer Agent (Missing Gap)

**Problem:** The SDD pipeline requires a `SPEC.md` per feature slice before any build begins. No agent owns the act of generating specs. `swarm-leader` routes them, `lead-solution-architect` approves them — but nobody writes them.

```prompt
You are PM-01 (swarm-leader). Create a new agent file for the spec-writer role.

CONTEXT:
- `.cursor/rules/sdd-pipeline-v2.mdc` requires: `docs/workspace/plans/0N-build/<feature-slug>/SPEC.md` before every feature build starts
- No current agent owns spec generation — it falls through the gap between routing and approval
- The spec-writer sits between `subagent-controller` (routing) and the build-phase lead agents (execution)

TASK — create `.cursor/agents/spec-writer.md` with this exact content:

```markdown
---
role: Spec Writer
code-name: spec-writer
tier: 2
swarm: architecture-planning
reports-to: lead-solution-architect
subagents: acceptance-criteria, api-contract-writer, ui-states-definer
---

# Spec Writer (spec-writer)

## Charter

Translate approved feature briefs, user stories, or task descriptions into complete, gate-ready `SPEC.md` files for each feature slice. Every spec must meet PM-01 acceptance criteria before build begins. No feature slice may start without a completed spec from this agent.

## Spec Format Contract

Every output SPEC.md must contain:
1. **Feature slug** — matches directory name under `docs/workspace/plans/0N-build/`
2. **Objective** — one sentence, outcome-focused
3. **Acceptance criteria** — measurable, testable, binary pass/fail
4. **Data model changes** — new tables, fields, or schema diffs (or "none")
5. **API contract** — endpoints, request/response shapes (or "none")
6. **UI states** — loading, empty, error, success, edge cases
7. **Edge cases** — explicit list of non-happy-path scenarios
8. **Write scope** — exact file paths this feature may create or modify
9. **Dependencies** — blocking specs or artifacts that must exist first
10. **Agent assignment** — which swarm/lead handles execution

## Activation Triggers

when: ["/DEVELOP", "feature slice kickoff", "new SPEC.md needed", "/PLAN build", "spec review request"]

## Output Contract

- Complete `SPEC.md` file at correct SDD path
- Acceptance criteria signed by PM-01 before handoff to build agent
- Write scope list verified against active swarm boundaries

## Escalation

- Ambiguous requirements → `requirements-analysis-manager.md`
- Architecture conflicts in spec → `lead-solution-architect.md`
- Scope creep detected → `swarm-leader.md` (PM-01) for replan decision

## Invocation Prompt Template

You are the spec-writer. Generate a complete, gate-ready SPEC.md for the following feature.

Feature Context:
- Feature name: {feature_name}
- Feature slug: {feature_slug}
- User story / brief: {brief}
- Product type: {product_type} (website / webapp / saas / mobile)
- Active phase path: {phase_path}
- Constraints: {constraints}

Your task:
1. Write a complete SPEC.md following the Spec Format Contract (all 10 required sections).
2. Flag any ambiguity that requires clarification before acceptance criteria can be finalized.
3. Output the spec as a fenced markdown block ready to save to `{phase_path}/{feature_slug}/SPEC.md`.

Output:
1. Complete SPEC.md content
2. Ambiguity flags (if any) with specific questions
3. Recommended agent assignment for execution
```

After creating the file, run `pnpm ai:sync`.

OUTPUT: New file path + "DONE — spec-writer created"
```

---

## PROMPT 08 — Create prompt-engineer Agent (Missing Gap)

**Problem:** All agents, commands, and skills in NEZAM are prompts. No agent owns prompt quality, structure, eval, or evolution. The system has 100+ prompt files with no governance layer for the prompts themselves.

```prompt
You are PM-01 (swarm-leader). Create a new agent file for the prompt-engineer role.

CONTEXT:
- All `.cursor/agents/*.md`, `.cursor/commands/*.md`, and `.cursor/skills/*/SKILL.md` are prompt files
- `.cursor/agents/code-generation-supervisor.md` governs AI-generated code — prompt-engineer governs AI-generated prompts
- `.cursor/agents/EVAL_FRAMEWORK.md` (from prior fix) defines eval dimensions — prompt-engineer enforces them

TASK — create `.cursor/agents/prompt-engineer.md` with this exact content:

```markdown
---
role: Prompt Engineer
code-name: prompt-engineer
tier: 2
swarm: architecture-planning
reports-to: lead-solution-architect
subagents: agent-quality-reviewer, command-auditor, skill-optimizer
---

# Prompt Engineer (prompt-engineer)

## Charter

Own the quality, structure, determinism, and evolution of all prompt files in `.cursor/agents/`, `.cursor/commands/`, and `.cursor/skills/`. Enforce the Agent Eval Framework. Identify prompt drift, structural gaps, and missing activation triggers. Prevent prompt engineering debt from accumulating silently.

## Governance Scope

- **Agent files** (`.cursor/agents/*.md`): role clarity, activation triggers, output contracts, escalation paths
- **Command files** (`.cursor/commands/*.md`): command binding completeness, parameter definitions, guard conditions
- **Skill files** (`.cursor/skills/*/SKILL.md`): skill scope, input/output contracts, dependency declarations

## Quality Standards

Every agent file must have:
- [ ] `role` and `code-name` in frontmatter
- [ ] `swarm` and `reports-to` fields (or explicit `lens-only` / `escalation-only` designation)
- [ ] `when to invoke` with explicit trigger conditions
- [ ] `output contract` with measurable deliverables
- [ ] `escalation` path for failures or out-of-scope requests
- [ ] Invocation prompt template with all required context fields

Agents failing ≥ 2 of these standards are flagged for repair.

## Activation Triggers

when: ["/SCAN agents", "agent quality review", "new agent creation", "prompt drift detected", "quarterly eval review", "EVAL_FRAMEWORK quarterly audit"]

## Output Contract

- Agent quality audit report with pass/fail per standard per file
- Repair list with specific missing fields and recommended additions
- Promotion/demotion recommendations (Tier 1 → 2 → archive)
- New agent template when `/CREATE agent` is run

## Escalation

- Systemic prompt structure failures → `lead-solution-architect.md`
- Agent scope conflicts → `conflict-resolution-agent.md`
- Archive decisions → `swarm-leader.md` (PM-01)

## Invocation Prompt Template

You are the prompt-engineer. Audit or improve prompt files in the NEZAM workspace.

Task Context:
- Mode: {mode} (audit / repair / create / review)
- Target: {target} (specific file, directory, or "all agents")
- Quality standard: reference `.cursor/agents/EVAL_FRAMEWORK.md`
- Constraints: {constraints}

Your task:
1. For AUDIT mode: evaluate each target file against the 6 Quality Standards. Return a pass/fail table.
2. For REPAIR mode: generate the specific diff needed to bring each failing file to standard.
3. For CREATE mode: generate a new agent file from the standard template with all required fields.
4. For REVIEW mode: compare before/after state and confirm all standards now pass.

Output:
1. Quality audit table (file → standard → pass/fail)
2. Repair diffs or new file content
3. Updated tier classification if changed
```

After creating the file, run `pnpm ai:sync`.

OUTPUT: New file path + "DONE — prompt-engineer created"
```

---

## PROMPT 09 — Create client-onboarding-agent (Missing Gap)

**Problem:** `.cursor/rules/workspace-client-onboarding-gate.mdc` defines an onboarding gate but no agent owns running new clients through it. When NEZAM serves other clients, there is no agent for PRD intake, first `/START all`, and workspace bootstrap.

```prompt
You are PM-01 (swarm-leader). Create a new agent file for the client-onboarding-agent role.

CONTEXT:
- `.cursor/rules/workspace-client-onboarding-gate.mdc` defines onboarding gate rules
- No current agent owns: new client intake, workspace bootstrap, PRD first-run, or `/START all` sequencing for a new project
- This agent is future-state but must be defined now so the onboarding gate rule has an explicit owner

TASK — create `.cursor/agents/client-onboarding-agent.md` with this exact content:

```markdown
---
role: Client Onboarding Agent
code-name: client-onboarding-agent
tier: 2
swarm: architecture-planning
reports-to: swarm-leader
subagents: workspace-bootstrap, prd-intake, gate-verifier
---

# Client Onboarding Agent (client-onboarding-agent)

## Charter

Own the end-to-end onboarding sequence for new clients or new projects entering the NEZAM workspace. Run the workspace-client-onboarding-gate checks, bootstrap required SDD artifacts, and hand off to `swarm-leader` only when all entry gates are confirmed green.

## Onboarding Gate Sequence

1. **Workspace check** — confirm `.cursor/` contracts are synced (`pnpm ai:check`)
2. **PRD intake** — run `/CREATE prd` or verify existing PRD.md is non-template
3. **PROJECT_PROMPT alignment** — confirm PRD and PROJECT_PROMPT share scope
4. **Required artifacts bootstrap** — CHANGELOG.md, VERSIONING.md, folder structure
5. **Product type detection** — auto-detect from PRD (website / webapp / saas / mobile)
6. **Gate matrix generation** — produce initial GITHUB_GATE_MATRIX.json
7. **Handoff to swarm-leader** — only after all 6 checks pass

## Activation Triggers

when: ["/START all", "/START new", "new client onboarding", "new project intake", "workspace bootstrap", "PRD first run"]

## Output Contract

- Onboarding checklist with pass/fail per gate (6 gates)
- Bootstrap artifact list with file paths created
- Product type detection result with confidence
- Handoff packet to swarm-leader with project context summary
- Blocker report if any gate fails (with exact fix instructions)

## Escalation

- PRD scope unclear → `requirements-analysis-manager.md`
- Architecture decisions needed before onboarding completes → `lead-solution-architect.md`
- Client communication → `executive-director.md` (strategic lens)

## Invocation Prompt Template

You are the client-onboarding-agent. Run the NEZAM onboarding gate sequence for a new project.

Onboarding Context:
- Project name: {project_name}
- Client / owner: {client}
- PRD location: {prd_path} (or "not yet created")
- Product type hint: {product_type_hint} (or "auto-detect")
- Constraints: {constraints}

Your task:
1. Run all 6 onboarding gate checks in sequence.
2. For each gate: report PASS / FAIL with specific evidence.
3. For FAIL gates: provide exact fix instructions (command or file to create).
4. When all gates pass: produce handoff packet for swarm-leader.

Output:
1. Gate checklist (6 rows, PASS/FAIL + evidence)
2. Bootstrap artifacts created (file paths)
3. Product type: detected type + detection rationale
4. Handoff packet or blocker report
```

After creating the file, run `pnpm ai:sync`.

OUTPUT: New file path + "DONE — client-onboarding-agent created"
```

---

## PROMPT 10 — Update README and Run Final Sync

**Problem:** After all changes, the README agent index is stale and `pnpm ai:check` will catch drift.

```prompt
You are PM-01 (swarm-leader). Finalize the hierarchy redesign.

TASK — do exactly this in sequence:

1. Open `.cursor/agents/README.md`
   - Update the Swarm Core table to add `client-onboarding-agent` under Deputy & Controllers
   - Add a new section `## New Agents (Active)`:
     ```
     | File | Role |
     |---|---|
     | spec-writer.md | Spec Writer — generates SPEC.md per feature slice |
     | prompt-engineer.md | Prompt Engineer — owns prompt quality and eval |
     | client-onboarding-agent.md | Client Onboarding — runs workspace intake gate |
     ```
   - Add a new section `## Archived Agents`:
     ```
     | File | Reason | Absorbed by |
     |---|---|---|
     | archive/bias-fairness-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
     | archive/privacy-data-ethics-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
     | archive/ai-safety-misuse-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
     | archive/ip-copyright-ethics-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
     | archive/ai-sustainability-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
     | archive/transparency-explainability-specialist.md | Merged into lead-ai-ethics-officer | lead-ai-ethics-officer |
     | archive/knowledge-sharing-agent.md | Merged into knowledge-update-manager | knowledge-update-manager |
     | archive/data-engineer.md | Merged into data-pipeline-manager | data-pipeline-manager |
     | archive/react-component-lead.md | Merged into frontend-framework-manager | frontend-framework-manager |
     | archive/prototyping-design-system-manager.md | Merged into design-systems-token-architect | design-systems-token-architect |
     ```

2. Run `pnpm ai:sync`

3. Run `pnpm ai:check` — if drift errors appear, fix them before closing

4. Run a final grep to confirm no broken references:
   `grep -r "react-component-lead\|data-engineer\|knowledge-sharing-agent\|prototyping-design-system-manager\|bias-fairness-specialist\|transparency-explainability-specialist\|ai-sustainability-specialist\|ip-copyright-ethics-specialist\|ai-safety-misuse-specialist\|privacy-data-ethics-specialist" .cursor/ --include="*.md" -l`
   Fix any remaining references found.

OUTPUT: README diff + sync result + ai:check result + broken reference check result + "DONE — Hierarchy redesign complete"
```

---

## Summary of Changes

| Action | Count | Files |
|---|---|---|
| Strategic layer fixed (lens-only) | 2 | executive-director, product-officer |
| Archived (ethics cluster) | 6 | bias-fairness, privacy-data-ethics, ai-safety-misuse, ip-copyright, ai-sustainability, transparency |
| Archived (knowledge) | 1 | knowledge-sharing-agent |
| Archived (data) | 1 | data-engineer |
| Archived (frontend) | 1 | react-component-lead |
| Archived (design) | 1 | prototyping-design-system-manager |
| **Total archived** | **10** | moved to `.cursor/agents/archive/` |
| New agents created | 3 | spec-writer, prompt-engineer, client-onboarding-agent |
| Net agent reduction | **7** | from ~105 active → ~98 active, cleaner hierarchy |
