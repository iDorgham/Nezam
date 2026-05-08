---
name: sdd-hardlock-guide
overview: Implement dual enforcement for SDD development unlock and refine guide responses so lock states are explicit and always end with a copy-ready Prompt, with terminal commands shown only when necessary.
todos:
  - id: define-prompt-artifact-contract
    content: Specify required `prompt.json` + `PROMPT.md` schema, naming, and placement per spec/sub-phase.
    status: completed
  - id: update-command-hardlock-flow
    content: Refine `.cursor/commands/{start,plan,develop,guide}.md` to enforce lock behavior and new guide output format.
    status: completed
  - id: sync-policy-rules
    content: Align `.cursor/rules/*.mdc` hardlock text with artifact-based unlock criteria.
    status: completed
  - id: implement-ci-readiness-gate
    content: Extend readiness script and CI workflow to validate prompt artifact completeness before development unlock.
    status: completed
  - id: update-plan-templates-docs
    content: Document new prompt artifact requirements in `docs/workspace/templates/plan` and `docs/plan` indexes.
    status: completed
  - id: verify-locked-unlocked-paths
    content: Run validation scenarios for locked/unlocked guide responses and develop gating behavior.
    status: completed
  - id: expand-agent-subagent-cooperation
    content: Define orchestrated agent/subagent cooperation contracts for planning, execution, QA, and bug-fix loops.
    status: pending
  - id: add-engineering-db-quality-lanes
    content: Add engineering/database quality gates and workflow checks to SDD unlock criteria.
    status: pending
  - id: expand-template-pack
    content: Add template suite for specs, sub-phases, prompts, handoffs, bug triage, and quality reviews.
    status: pending
  - id: add-github-phase-spec-guardrails
    content: Add mandatory GitHub start/end tasks for every phase/spec with automation diagnostics and remediation flow.
    status: pending
  - id: define-silent-automation-taxonomy
    content: Define categorized silent-automation failure taxonomy with deterministic diagnosis and fix mapping.
    status: pending
  - id: add-gate-manifest-source-of-truth
    content: Add a single JSON gate manifest as canonical source for gate definitions and enforcement mapping.
    status: pending
  - id: add-severity-sla-model
    content: Add severity levels and SLA targets for silent automation failures and enforce escalation windows.
    status: pending
  - id: split-pre-post-merge-gates
    content: Separate gate responsibilities into pre-merge and post-merge checks with explicit ownership.
    status: pending
  - id: add-nightly-self-test-bypass-ban
    content: Add nightly automation self-test workflow and a strict bypass-ban policy for gate evidence omissions.
    status: pending
  - id: define-gate-manifest-schema
    content: Define strict JSON schema for `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` with enums, evidence contract, and examples.
    status: pending
  - id: define-phased-rollout-order
    content: Add P0/P1/P2 implementation order with hard dependencies and safety checks between phases.
    status: pending
isProject: false
---

# SDD Hardlock + Guide Response Refinement

## Goal
Create a strict SDD unlock workflow where development remains hardlocked until required planning artifacts are complete (including spec/sub-phase prompt files), and improve `/guide` responses to clearly explain lock reasons/unlock steps while always ending with a copy-ready Prompt block.

## Scope
- Enforce hardlock in both command/rules guidance and automated checks.
- Require per spec/sub-phase prompt artifacts as the final unlock evidence:
  - structured JSON artifact
  - markdown prompt artifact
- Expand orchestration governance for:
  - agents + subagents cooperation
  - engineering and database quality lanes
  - GitHub workflow and automation quality
  - bugs/fix loops and code-quality enforcement
  - planning quality validation and documentation quality
- Add GitHub lifecycle controls to every phase and spec:
  - start-of-work GitHub readiness tasks
  - end-of-work GitHub integrity tasks
  - silent automation health verification + auto-diagnosis/remediation path
- Expand template coverage so SDD planning outputs are standardized across phases/specs/sub-phases.
- Refine `/guide` output contract:
  - Always show warning + reason + unlock path when locked.
  - Always end with a copy-ready Prompt.
  - Include copy-ready terminal commands only when materially useful.

## Files To Update
- Command behavior docs:
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/guide.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/guide.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/plan.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/plan.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/develop.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/develop.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/start.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/commands/start.md)
- Orchestration/alias visibility (if needed for discoverability only):
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/ORCHESTRATION_ALIASES.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/ORCHESTRATION_ALIASES.md)
- Gate policy docs:
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/workspace-orchestration.mdc](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/workspace-orchestration.mdc)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/design-dev-gates.mdc](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/rules/design-dev-gates.mdc)
- Automation checks:
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/scripts/checks/check-onboarding-readiness.sh](/Users/Dorgham/Documents/Work/Devleopment/COIA/scripts/checks/check-onboarding-readiness.sh)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.github/workflows/ci.yml](/Users/Dorgham/Documents/Work/Devleopment/COIA/.github/workflows/ci.yml)
- Prompt artifact templates and plan package conventions:
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/plan/README.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/templates/plan/README.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/plans/INDEX.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/plans/INDEX.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/plans/MASTER_TASKS.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/docs/workspace/plans/MASTER_TASKS.md)
- Agent + skill governance and orchestration docs:
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/agents/README.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/agents/README.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/skills/README.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/skills/README.md)
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/agents/orchestration-subagent-controller.md](/Users/Dorgham/Documents/Work/Devleopment/COIA/.cursor/agents/orchestration-subagent-controller.md)
- GitHub automation and release checks:
  - [/Users/Dorgham/Documents/Work/Devleopment/COIA/.github/workflows/release.yml](/Users/Dorgham/Documents/Work/Devleopment/COIA/.github/workflows/release.yml)

## Artifact Contract (Unlock Criteria)
For each spec/sub-phase unit under `docs/workspace/plans/**`, require both:
- `prompt.json` (structured fields: spec ID, phase/sub-phase, objectives, constraints, acceptance checks, dependencies, unlock status)
- `PROMPT.md` (copy-ready operational prompt for that specific unit)

Development unlock condition:
- All required spec/sub-phase units have both files present and validated.
- Global onboarding prerequisites remain satisfied (`PRD`, `PROJECT_PROMPT`, and existing required docs).
- Agent/subagent orchestration prerequisites are present for each spec package:
  - assigned agent lane
  - subagent delegation checklist
  - verification owner + signoff path
- Engineering quality prerequisites are green:
  - code quality checks
  - test/readiness checks
  - documentation completeness checks

## Guide Response Contract
When lock exists, `/guide` must output in this order:
1. Warning header indicating hardlock is active.
2. Why locked (missing/invalid artifacts listed explicitly).
3. How to unlock (step-by-step command/prompt path).
4. Copy-ready Prompt block (always present; primary focus).
5. Copy-ready Terminal command block (only if necessary for immediate progress).

When unlocked, `/guide` still ends with:
- Copy-ready Prompt block (always)
- Optional terminal command block only when high-value.

Guide formatting policy:
- Prompt is always primary and positioned at the end for copy-first execution.
- Terminal command appears only when execution materially depends on shell action.
- Lock warnings must include actionable, minimal unlock instructions and direct artifact references.

Guide reminder policy:
- `/guide` must proactively remind about missed prerequisites before each recommended next action.
- Reminder categories include:
  - missing steps in current phase/sub-phase flow
  - incomplete tasks from active task files/checklists
  - missing required edits (including `.env`/environment variable setup when relevant)
  - missing verification steps (tests/checks/quality gates)
- Reminder output should be concise and actionable:
  - `Forgotten items` list (what is missing)
  - `Why it matters` (risk/block reason)
  - `Fix now` (smallest next action)
- When `.env` or secret configuration is relevant, `/guide` should explicitly include:
  - required variable names (without exposing secret values)
  - where to set them
  - how to verify they are loaded

## Agent/Subagent Cooperation Contract
- Define cooperation levels:
  - agent-only (single-lane tasks)
  - subagent-assisted (parallel independent tasks)
  - mixed orchestration (planning + implementation + review lanes)
- For each spec/sub-phase, require:
  - primary agent role
  - optional subagent roles (research, QA, security, docs, CI)
  - handoff packet template (context, constraints, acceptance, expected output)
  - completion and review checkpoints
- Add explicit co-operation matrices for:
  - agents co-operetta
  - sub-agents co-operetta
  - agents + subagents co-operetta

## Quality Lanes (Planning + Engineering)
- Planning quality:
  - scope clarity, dependency traceability, acceptance criteria completeness
  - phase/sub-phase gate evidence before unlock
- Code quality:
  - lint/type/test policy, regression checks, risk notes
- Database quality:
  - schema/migration safety checklist, rollback notes, data integrity checks
- Bug/Fix quality:
  - bug triage template, reproduction template, fix verification checklist
- Documentation quality:
  - required docs updated per spec/sub-phase with cross-links to prompts
- GitHub workflow quality:
  - CI policy alignment, release gates, automation checks consistency
  - mandatory start/end checks for branch/commit/push/tag/version/action health

## GitHub Start/End Gate Tasks (Per Phase + Per Spec)
- Start gate (before any implementation in a phase/spec):
  - verify current branch naming/status matches plan policy
  - verify working tree state is valid for starting slice work
  - verify remote tracking/upstream status
  - verify silent GitHub automation baseline is healthy (Actions/workflow triggers expected)
  - if automation baseline is unhealthy, run diagnosis checklist and block progression
- End gate (before phase/spec can be marked done):
  - verify commit integrity and expected commit grouping for slice
  - verify push status and remote branch synchronization
  - verify versioning artifacts and tags policy (when applicable)
  - verify required Actions workflows completed successfully
  - verify release automation path integrity (for release-affecting phases)
  - if any check fails, run remediation checklist, re-verify, and only then close gate

GitHub reliability target:
- enforce deterministic checks to ensure versioning, branching, tags, push, and Actions remain healthy and smooth across the full SDD lifecycle.

## Canonical Gate Manifest (Source of Truth)
- Add canonical manifest file:
  - `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`
- This JSON is the authoritative source for:
  - gate IDs
  - gate stage (`start`, `end`, `pre_merge`, `post_merge`)
  - required checks
  - applicable scopes (phase/spec/sub-phase/release-affecting)
  - evidence schema
  - owner/escalation references
  - pass/fail policy flags
- Command docs, templates, and CI/readiness checks must read/align to this manifest.
- Any gate definition outside manifest is non-authoritative and must be treated as documentation-only.

### `GITHUB_GATE_MATRIX.json` Strict Schema Contract
- Required top-level keys:
  - `manifestVersion` (string, semver)
  - `generatedAt` (ISO-8601 datetime)
  - `owners` (array of owner records)
  - `gateProfiles` (array)
  - `gates` (array of gate definitions)
  - `taxonomy` (silent automation category mapping)
  - `severityModel` (sev1/sev2/sev3 SLA model)
  - `bypassBanRules` (array)
- Owner record required fields:
  - `ownerId`, `primary`, `backup`, `escalationPath`
- `gateProfiles` required enums:
  - `spec_only`, `subphase`, `phase`, `release_affecting`
- Gate definition required fields:
  - `gateId` (unique string)
  - `stage` (enum: `start`, `end`, `pre_merge`, `post_merge`, `nightly_self_test`)
  - `scope` (enum: `spec`, `subphase`, `phase`, `release`)
  - `profile` (must match `gateProfiles`)
  - `requiredChecks` (non-empty array)
  - `passPolicy` (object)
  - `failPolicy` (object)
  - `evidenceSchemaRef` (string path/id)
  - `ownerRef` (must match `owners.ownerId`)
  - `automation` (object: `enabled`, `workflowRefs`, `blocking`)
- Required check object fields:
  - `checkId`, `description`, `required`, `evidenceRequired`, `autoFailOnMissingEvidence`
- Pass/fail policy required flags:
  - `allChecksMustPass` (bool, true for blocking gates)
  - `singleFailBlocksGate` (bool)
  - `missingEvidenceAutoFail` (bool, must be true)
  - `exceptionPolicy` (object with explicit approver requirements)
- Taxonomy mapping fields:
  - `categoryId` (must map to documented taxonomy keys)
  - `defaultSeverity`
  - `diagnoseChecklistRef`
  - `fixChecklistRef`
- Severity model required fields:
  - `severity` (enum: `sev1`, `sev2`, `sev3`)
  - `triageSlaMinutes`
  - `remediationStartSlaMinutes`
  - `resolveOrEscalateSlaMinutes`
- Validation rules:
  - unknown enum values are invalid
  - duplicate `gateId` invalid
  - missing required fields invalid
  - dangling `ownerRef` invalid
  - gates lacking required checks invalid
- Manifest example requirement:
  - include at least one example gate per stage (`start`, `end`, `pre_merge`, `post_merge`, `nightly_self_test`).

## Silent Automation Failure Taxonomy + Fix Mapping
Use this taxonomy for all "silent automation not working" incidents.

- `triggerMissing`
  - Signal: expected workflow did not start after qualifying event.
  - Likely causes: missing `on:` event, path filters exclude change, branch filter mismatch.
  - Fix mapping: validate workflow trigger config, adjust branch/path filters, re-run qualifying event.
- `workflowDisabledOrPaused`
  - Signal: workflow exists but is disabled/paused or not allowed to run.
  - Likely causes: repository workflow disabled state, org policy block.
  - Fix mapping: enable workflow, align org/repo policy, validate permissions.
- `permissionDenied`
  - Signal: workflow starts then fails due to token/repo/environment permission errors.
  - Likely causes: insufficient `GITHUB_TOKEN` scopes, environment protection mismatch.
  - Fix mapping: update permissions block, align environment rules, re-run runbook checks.
- `secretOrEnvMissing`
  - Signal: workflow starts but silently exits/fails due to missing secret/env/config.
  - Likely causes: missing required secret or env var in target environment.
  - Fix mapping: add required secret/env key, verify environment selection, re-run validation.
- `runnerUnavailable`
  - Signal: queued or stuck runs; no execution on expected runner.
  - Likely causes: no hosted capacity, self-hosted runner offline/label mismatch.
  - Fix mapping: restore runner availability/labels or switch runner strategy.
- `jobDependencyDeadlock`
  - Signal: jobs skipped/waiting due to invalid `needs` graph.
  - Likely causes: cyclic or impossible dependency graph, conditional mismatch.
  - Fix mapping: repair DAG dependencies and conditions; validate with dry-run matrix.
- `externalServiceFailure`
  - Signal: workflow fails due to GitHub API or third-party outage/rate limit.
  - Likely causes: API quota exhaustion, service outage, transient transport errors.
  - Fix mapping: add retry/backoff, reduce API burst, failover path, and status-aware retries.
- `logicRegression`
  - Signal: workflow executes but behavior no longer matches expected gate contract.
  - Likely causes: recent workflow edit broke checks, stale action version, script drift.
  - Fix mapping: diff against last known-good workflow, pin/fix action versions, restore contract tests.
- `reportingGap`
  - Signal: automation ran but no observable evidence produced (appears silent).
  - Likely causes: missing artifact/log upload, notification path broken.
  - Fix mapping: enforce mandatory evidence artifact upload and gate summary emission.

Diagnosis protocol:
- classify failure into exactly one primary category plus optional secondary category.
- attach category-specific fix checklist.
- record evidence before/after fix.
- re-run required checks and mark resolved only when pass criteria are met.

Severity + SLA model:
- `sev1` (critical path blocked):
  - SLA: triage immediate, remediation start within 15 minutes, resolution or escalation within 60 minutes.
- `sev2` (partial degradation):
  - SLA: triage within 60 minutes, remediation within 4 hours, resolution or escalation within 1 business day.
- `sev3` (non-blocking defect):
  - SLA: triage within 1 business day, remediation in planned backlog window.
- Severity assignment is required in every incident record; missing severity is auto-fail for gate closure.

Escalation policy:
- If SLA window is exceeded, escalation is mandatory and gate remains blocked.
- Escalation record must include owner, timestamp, blocker reason, and next action.

## Pre-Merge vs Post-Merge Gate Split
- Pre-merge gates (must pass before merge):
  - branch policy and commit integrity
  - required quality/test checks
  - required workflow run success for merge safety
  - required evidence block completeness
- Post-merge gates (must pass after merge where applicable):
  - release/promotion checks
  - deployment-linked automation checks
  - post-merge verification workflows
  - version/tag propagation validation
- A phase/spec cannot be marked complete unless both applicable pre-merge and post-merge gates are satisfied.

## Nightly Automation Self-Test + Bypass Ban List
- Add nightly self-test automation to validate:
  - workflow trigger health
  - runner availability
  - evidence publication pipeline
  - notification/reporting path integrity
- Self-test failures must open/append to automation incident tracking and map to taxonomy category.

Bypass ban list:
- Forbidden actions:
  - closing phase/spec with missing gate evidence
  - skipping required pre-merge gate checks
  - suppressing failed required workflows without documented approved exception
  - marking silent automation incidents resolved without re-check evidence
- Any bypass-ban violation is treated as hard fail and re-opens the gate.

## Strict GitHub Gate Pass/Fail Criteria
Apply these criteria to every phase and spec gate.

Start gate pass/fail:
- Branch naming/status
  - Pass: current branch exists, is not detached HEAD, and matches workspace branch policy.
  - Fail: detached HEAD, invalid name, or branch policy mismatch.
  - Fail action: stop phase/spec start; create/switch to compliant branch.
- Working tree readiness
  - Pass: no unintended dirty state for gate start (or only explicitly allowed files listed in gate context).
  - Fail: unexpected modified/untracked files that are not acknowledged by gate context.
  - Fail action: stop start gate; reconcile changes before proceeding.
- Remote/upstream tracking
  - Pass: branch has upstream configured and fetch/pull state is known (ahead/behind/diverged explicitly reported).
  - Fail: no upstream, unknown remote state, or remote access failure.
  - Fail action: configure upstream/fix remote access and re-run gate.
- Silent automation baseline
  - Pass: required workflows are present and trigger expectations are valid for this phase/spec.
  - Fail: missing required workflow, disabled/broken trigger path, or baseline check unavailable.
  - Fail action: run diagnose-fix checklist; block phase/spec until baseline is healthy.

End gate pass/fail:
- Commit integrity
  - Pass: expected work is committed in scoped commits with no unresolved partial state.
  - Fail: missing commits, mixed unrelated changes, or unresolved partial work.
  - Fail action: re-scope commits, complete missing work, then re-check.
- Push and sync
  - Pass: branch is pushed and remote reflects intended HEAD state.
  - Fail: unpushed commits, remote mismatch, or push failure.
  - Fail action: resolve push/sync issue and re-verify remote HEAD.
- Versioning and tags (when applicable)
  - Pass: version bump/tag policy for phase/spec is satisfied and tag references correct commit.
  - Fail: missing/incorrect version update, missing/incorrect tag, or tag mismatch.
  - Fail action: correct version/tag artifacts and re-validate.
- Actions workflow status
  - Pass: all required workflow runs for this gate are successful (or explicitly approved exceptions recorded).
  - Fail: failed/cancelled/missing required runs without approved exception.
  - Fail action: diagnose failure root cause, apply fix, re-run checks to green.
- Release path integrity (release-affecting phases/specs)
  - Pass: release workflow prerequisites and promotion checks are complete.
  - Fail: missing prerequisites, failed promotion checks, or unsafe release state.
  - Fail action: block completion until release path is healthy.

Evidence requirements (mandatory for pass):
- Gate output must include:
  - timestamp
  - phase/spec identifier
  - check results per item (pass/fail)
  - reason for any fail
  - remediation steps executed
  - final re-check result
- Any gate item without evidence is auto-fail.

Blocking policy:
- Any single fail item blocks gate completion.
- Phase/spec cannot start (start gate) or close (end gate) until all required items pass.
- Approved exceptions must be explicit, documented, and linked to responsible owner.

## Enforcement Layers
- Behavioral layer (commands + rules): documents and command contracts explicitly block `/DEVELOP` until prompt artifacts are complete.
- Automation layer (script + CI): readiness script verifies required artifact matrix and fails CI if incomplete.

## Rollout Steps
1. Define the prompt artifact schema and file naming/location convention for each spec/sub-phase.
2. Update command docs (`/START`, `/PLAN`, `/DEVELOP`, `/GUIDE`) to use the new lock/unlock protocol and response format.
3. Update rules to mirror the same hardlock criteria and keep policy text consistent.
4. Extend readiness script and CI jobs to validate prompt artifact completeness.
5. Update plan documentation and template README so future plans are generated with required JSON+MD prompt artifacts by default.
6. Validate with sample locked and unlocked scenarios to confirm `/guide` behavior and `/DEVELOP` gating.
7. Add cooperation contracts for agents/subagents in planning and execution flows.
8. Add quality-lane gates (planning, code, DB, bugs, docs, CI) and map each to enforcement points.
9. Expand template library and wire templates to `/PLAN` and `/GUIDE` outputs.
10. Add GitHub start/end gate task blocks to all phase/spec templates and indexes.
11. Add silent automation health checks with diagnose-and-fix playbook and escalation path.
12. Add silent-automation taxonomy identifiers and category-specific fix mappings to templates and validation docs.
13. Introduce `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json` and migrate gate definitions to it.
14. Implement severity + SLA enforcement and escalation tracking for automation incidents.
15. Split enforcement into pre-merge and post-merge gate tracks.
16. Add nightly automation self-test and enforce bypass-ban policy in gate validation.
17. Define and validate strict schema for `GITHUB_GATE_MATRIX.json`.
18. Validate all command/docs/check integrations consume canonical manifest fields consistently.

## Phased Execution Order (P0/P1/P2)
### P0 - Foundations (non-negotiable before hard enforcement)
- Deliverables:
  - canonical gate manifest + schema contract
  - taxonomy + severity/SLA model
  - template pack baseline (gate + prompt + evidence templates)
  - `/guide` reminder contract finalized
- Exit criteria:
  - schema validated
  - no unresolved contradictions in command/rule language
  - dry-run gate reports available

### P1 - Controlled Enforcement
- Deliverables:
  - pre-merge and start/end gates enabled for selected pilot scopes
  - CI readiness checks integrated with manifest lookups
  - diagnose-fix flow active for silent automation failures
- Exit criteria:
  - pilot scopes pass repeated gate cycles
  - failures map cleanly to taxonomy with evidence + remediation records
  - no bypass-ban violations in pilot window

### P2 - Full Enforcement and Operations
- Deliverables:
  - post-merge and nightly self-test enforcement enabled for all required scopes
  - escalation workflows and SLA monitoring active
  - gate evidence retention and reporting stabilized
- Exit criteria:
  - all required scopes green under full gating
  - nightly self-test stable
  - release-affecting flows pass pre/post merge obligations

Dependency chain:
- P1 depends on complete P0 exit criteria.
- P2 depends on complete P1 exit criteria.
- Any failed exit criterion blocks promotion to next phase.

## Template Expansion Pack
- Add/extend templates under `docs/workspace/templates/plan` for:
  - `SPEC_PROMPT.template.md`
  - `SUBPHASE_PROMPT.template.md`
  - `PROMPT_SCHEMA.template.json`
  - `AGENT_HANDOFF_PACKET.template.md`
  - `SUBAGENT_HANDOFF_PACKET.template.md`
  - `AGENT_SUBAGENT_COOP_MATRIX.template.md`
  - `BUG_TRIAGE.template.md`
  - `FIX_VERIFICATION.template.md`
  - `CODE_QUALITY_REVIEW.template.md`
  - `PLANNING_QUALITY_REVIEW.template.md`
  - `DB_CHANGE_REVIEW.template.md`
  - `GITHUB_AUTOMATION_CHECKLIST.template.md`
  - `GITHUB_START_GATE.template.md`
  - `GITHUB_END_GATE.template.md`
  - `GITHUB_AUTOMATION_DIAGNOSE_FIX.template.md`
  - `GITHUB_VERSION_BRANCH_TAG_POLICY.template.md`
  - `SILENT_AUTOMATION_FAILURE_TAXONOMY.template.md`
  - `SILENT_AUTOMATION_FIX_MAPPING.template.md`
  - `GITHUB_GATE_MATRIX.template.json`
  - `SILENT_AUTOMATION_SEVERITY_SLA.template.md`
  - `PRE_MERGE_GATE_CHECKLIST.template.md`
  - `POST_MERGE_GATE_CHECKLIST.template.md`
  - `NIGHTLY_AUTOMATION_SELF_TEST.template.md`
  - `BYPASS_BAN_POLICY.template.md`
  - `GITHUB_GATE_MATRIX_SCHEMA.template.json`
  - `GATE_PROFILE_MAPPING.template.md`
  - `P0_P1_P2_ROLLOUT_CHECKLIST.template.md`

## Validation Checklist
- Locked scenario:
  - `/guide` shows warning, reason, unlock steps, and ends with copy-ready Prompt.
  - `/guide` reminds user of forgotten steps/tasks/config before suggesting next action.
  - `/DEVELOP` remains blocked.
- Unlock scenario:
  - All required `prompt.json` + `PROMPT.md` files present.
  - readiness check passes in CI.
  - `/guide` still ends with copy-ready Prompt and only includes terminal commands when needed.
- Cooperation scenario:
  - Each spec/sub-phase has assigned agent/subagent lanes and handoff packet artifacts.
  - Co-operetta matrices are complete and linked from plan docs.
- Quality scenario:
  - Planning quality checks pass.
  - Code/DB/bug/doc/CI quality checks pass before unlock.
  - `.env`/environment setup reminders trigger when required variables are missing from expected setup state.
- GitHub gate scenario:
  - Each phase/spec includes both GitHub start and end tasks.
  - Silent automation health is verified at start and end.
  - On automation failure, reason analysis + fix workflow runs before gate completion.
  - Branching/versioning/tags/push/actions checks pass before completion.
  - Each gate item enforces strict pass/fail criteria with evidence; missing evidence is auto-fail.
  - Silent automation incidents are categorized by taxonomy and resolved with mapped fix playbook before gate close.
  - Canonical JSON gate manifest is present and used as source of truth by docs/checks.
  - Every automation incident has severity and SLA-tracked handling.
  - Pre-merge vs post-merge gate obligations are both satisfied per scope.
  - Nightly automation self-test passes, and bypass-ban violations trigger hard fail.
- Schema + rollout scenario:
  - Manifest schema validation passes with no enum/reference/required-field errors.
  - P0/P1/P2 transitions happen only after phase exit criteria are satisfied.

## Risks And Mitigations
- Drift between rules and command docs: update all lock wording from one canonical checklist in command/rule text.
- Overly strict CI causing false negatives: add clear error messages listing exactly which files are missing.
- Prompt quality inconsistency: enforce minimal required keys in `prompt.json` and a fixed `PROMPT.md` template footer.
