---
name: swarm-prompt-integration
overview: Integrate the extended Library+DesignSystem+Content swarm contract into canonical .cursor governance and add reusable scaffold artifacts for tasking, handoff, mapping, color sync, and completion reports.
todos:
  - id: add-swarm-rule
    content: Create canonical .cursor rule for Library/DesignSystem/Color/Content swarm orchestration and gates
    status: completed
  - id: create-swarm-templates
    content: Add SWARM_TASK/HANDOFF/LIBRARY_DS_MAP/COLOR_SYNC_REPORT/SWARM_COMPLETE templates under docs/workspace/templates/ui-ux
    status: completed
  - id: wire-command-guidance
    content: Update plan/develop command docs with swarm execution and artifact expectations
    status: completed
  - id: update-template-index
    content: Update templates README to include new swarm templates and usage references
    status: completed
  - id: publish-integration-audit
    content: Write integration audit report under docs/reports/audits and define validation steps
    status: completed
isProject: false
---

# Extended Swarm Integration Plan

## Goal
Operationalize your extended prompt as canonical workspace governance under `.cursor/`, with explicit alignment to all swarm leadership teams, specialist agents, existing skills, and always-on rules/hardlocks, plus reusable scaffolds for execution artifacts (`SWARM_TASK`, `SWARM_HANDOFF`, `LIBRARY_DS_MAP`, `COLOR_SYNC_REPORT`, `SWARM_COMPLETE`).

## Current-State Findings
- Canonical governance already lives in `.cursor/rules/` and is propagated by `pnpm ai:sync` (`scripts/sync-ai-folders.js`).
- Existing rules enforce hardlocks, design gates, reports policy, and orchestration order; no dedicated swarm-library/design-system/content rule exists yet.
- Template system exists under `docs/workspace/templates/` and already includes a new `ui-ux` category, so scaffold placement can align there.
- No existing tracked artifacts named `SWARM_TASK.md`, `SWARM_HANDOFF.md`, `LIBRARY_DS_MAP.md`, `COLOR_SYNC_REPORT.md`, or `SWARM_COMPLETE.md` were found in current canonical templates.

## Swarm-Wide Alignment Matrix

### Leadership teams (primary ownership)
- `PM-01-Swarm-Leader`: routing policy, backlog sequencing, acceptance criteria wiring.
- `ARCH-01-Project-Architect`: architecture compatibility, canonical-path enforcement, sync/governance integrity.
- `DESIGN-01-UIUX-Lead`: library/design-system contracts, token and motion quality.
- `FE-01-Frontend-Lead`: component architecture, bundle constraints, implementation handoff quality.
- `BE-01-Backend-Lead`: data/API contract touchpoints for content and dashboard component dependencies.

### Existing specialist agent/skill alignment
- `.cursor/skills/03-ui-ux/*`: use as implementation substrate for DS, wireframe/spec, user flow, and micro-interactions.
- `.cursor/skills/01-foundation/*`: enforce hardlock-first and command routing consistency.
- `.cursor/skills/16-qa/*` and `.cursor/skills/19-memory/*`: regression protection and quality consistency for large swarm runs.

### Rules and hardlocks that must remain authoritative
- `.cursor/rules/workspace-orchestration.mdc`
- `.cursor/rules/sdd-design.mdc`
- `.cursor/rules/design-dev-gates.mdc`
- `.cursor/rules/coia-design-gates-pro.mdc`
- `.cursor/rules/docs-reports-policy.mdc`
- `.cursor/rules/workspace-client-onboarding-gate.mdc`

## Artifact Ownership (Strict RACI)

Use this ownership contract when creating and reviewing each scaffold artifact.

### `SWARM_TASK.template.md`
- Responsible: `PM-01-Swarm-Leader`
- Accountable: `ARCH-01-Project-Architect`
- Consulted: `DESIGN-01-UIUX-Lead`, `FE-01-Frontend-Lead`, `BE-01-Backend-Lead`
- Informed: Specialist subagents executing assigned lanes
- Required skills/rules tag fields:
  - `requiredSkills`: include at least one of `slash-command-router`, `design-system-builder`, `user-flow-mapper` when UI scope exists
  - `appliedRules`: must include `workspace-orchestration.mdc` and relevant design-gate rules

### `SWARM_HANDOFF.template.md`
- Responsible: lane owner receiving the handoff (`DESIGN-01` or `FE-01` by default for UI tasks)
- Accountable: `PM-01-Swarm-Leader`
- Consulted: `ARCH-01-Project-Architect` for contract/risk checks
- Informed: remaining leadership roles and affected specialists
- Required skills/rules tag fields:
  - `requiredSkills`: include `context-window-manager` and `regression-detector` for high-change handoffs
  - `appliedRules`: include `workspace-orchestration.mdc`, plus any active gate rule references

### `LIBRARY_DS_MAP.template.md`
- Responsible: `DESIGN-01-UIUX-Lead`
- Accountable: `ARCH-01-Project-Architect`
- Consulted: `FE-01-Frontend-Lead` and library/domain specialists
- Informed: `PM-01-Swarm-Leader`, `BE-01-Backend-Lead`
- Required skills/rules tag fields:
  - `requiredSkills`: include `design-system-builder`, `wireframe-to-spec-converter`, `token-budget-manager`
  - `appliedRules`: include `design-dev-gates.mdc` and `coia-design-gates-pro.mdc`

### `COLOR_SYNC_REPORT.template.md`
- Responsible: `DESIGN-01-UIUX-Lead`
- Accountable: `FE-01-Frontend-Lead`
- Consulted: accessibility/performance specialists and `ARCH-01`
- Informed: `PM-01`, `BE-01`
- Required skills/rules tag fields:
  - `requiredSkills`: include `micro-interaction-designer` when motion tokens are impacted
  - `appliedRules`: include `design-dev-gates.mdc`, `coia-design-gates-pro.mdc`

### `SWARM_COMPLETE.template.md`
- Responsible: `PM-01-Swarm-Leader`
- Accountable: `ARCH-01-Project-Architect`
- Consulted: `DESIGN-01`, `FE-01`, `BE-01`
- Informed: all specialist lanes involved in execution
- Required skills/rules tag fields:
  - `requiredSkills`: include `reflection-loop-engine` and `regression-detector`
  - `appliedRules`: include all governing rules applied during execution and any hardlock checks referenced

## Implementation Plan

### 1) Add canonical swarm rule in `.cursor/rules/`
Create a new rule file to encode your prompt as enforceable policy:
- New file: [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/ui-ux-swarm-library-ds-content.mdc`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/ui-ux-swarm-library-ds-content.mdc)
- Include:
  - Explicit delegation model from PM/ARCH/DESIGN/FE/BE leaders to library/DS/color/content subagents
  - Manager and subagent roles (Library/DS/Color/Bridge/Creator)
  - Top-library and top-design-system coverage contract
  - Dynamic lookup protocol (`@workspace` detection and scoped loading)
  - Content pipeline contract (`ContentSpecSchema`, min/max words, tone, RTL/a11y constraints)
  - Quality gates (contrast, RTL/dark parity, bundle budget)
  - Standard output sections per agent pass
  - Non-conflict precedence with existing hardlock rules (new rule extends, never weakens them).

### 2) Add artifact templates for swarm workflow
Add reusable templates under `docs/workspace/templates/ui-ux/`:
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/SWARM_TASK.template.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/SWARM_TASK.template.md)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/SWARM_HANDOFF.template.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/SWARM_HANDOFF.template.md)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/LIBRARY_DS_MAP.template.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/LIBRARY_DS_MAP.template.md)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/COLOR_SYNC_REPORT.template.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/COLOR_SYNC_REPORT.template.md)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/SWARM_COMPLETE.template.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/ui-ux/SWARM_COMPLETE.template.md)

These will enforce consistent fields for routing, deps, DIFF/RATIONALE/VALIDATION/NEXT_TRIGGER, word-count audits, and contrast/bundle checks.
They will also include explicit fields for `ownerTeam` (`PM|ARCH|DESIGN|FE|BE`), `requiredSkills`, and `appliedRules`.

### 3) Wire command/routing guidance to new swarm artifacts
Update command docs so operators know where to instantiate these templates and when:
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/develop.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/develop.md)
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/plan.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/plan.md)

Add a concise section for:
- Running Library-DS alignment phase
- Emitting `ContentSpecSchema`
- Producing report artifacts under `docs/reports/` categories.
- Routing ownership to leadership and specialist lanes (including fallback lane when stack detection is inconclusive).

### 4) Align template index and governance docs
Update template index so the new swarm templates are discoverable:
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/README.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/README.md)

Add a short reference block in workspace docs (if needed) to document this pipeline entrypoint and expected outputs.

Also add a cross-reference section that maps:
- each new swarm artifact template -> responsible leadership team
- each execution step -> governing rules and required skills.

### 5) Add initial integration audit report
Produce a generated audit under policy-compliant reports path:
- [`/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/reports/audits/swarm-library-ds-content-integration.latest.md`](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/reports/audits/swarm-library-ds-content-integration.latest.md)

Include:
- Rule coverage matrix (prompt section -> file/section)
- Artifact template readiness
- Swarm-team alignment status (PM/ARCH/DESIGN/FE/BE + specialists)
- Remaining optional follow-ups.

## Validation Plan
- Run drift-safe sync workflow:
  - `pnpm ai:sync`
  - `pnpm ai:check`
- Confirm no policy violations:
  - generated reports only under `docs/reports/**`
  - canonical edits only under `.cursor/**` and approved template docs.
- Spot-check content schema constraints in templates (word limits, tone, RTL/a11y fields).
- Verify rule precedence: new swarm rule does not bypass or weaken any existing SDD/design/dev gate constraints.
- Verify routing completeness: each artifact template references leadership owner + specialist agent lane + required skills.

## Deliverables
- New canonical swarm rule in `.cursor/rules/`
- Five reusable swarm artifact templates in `docs/workspace/templates/ui-ux/`
- Updated command guidance for planning/development usage
- Explicit swarm-team/agent/skill/rule mapping references in governance docs
- Integration audit report in `docs/reports/audits/`
- Synced generated AI surfaces via existing `ai:sync` pipeline