# NEZAM Hardening Prompt — For Cursor

> Paste this entire prompt into Cursor. It is self-contained. Do not split it.

---

## CONTEXT

You are working inside the NEZAM workspace — a Specification-Driven Development (SDD)
orchestration system built on top of Cursor. The canonical source of truth is `.cursor/`.
Generated mirrors (`CLAUDE.md`, `AGENTS.md`, etc.) are produced by `pnpm ai:sync`.

This prompt instructs you to execute a structured hardening pass across 9 specific weaknesses
and implement all changes in the correct canonical locations. Do NOT hand-edit generated mirrors.
Edit `.cursor/` only. Run `pnpm ai:sync` at the end.

---

## EXECUTION RULES

- Plan Mode ON before any multi-file change.
- Edit canonical `.cursor/` files only — never generated mirrors.
- After all changes: run `pnpm ai:sync` then `pnpm ai:check`.
- For each task below: confirm the file exists first, then write/update.
- Use `## Decision Amendments` log format if updating an existing locked artifact.
- Every new file must have a YAML front-matter header with `created`, `version`, `owner`.

---

## TASK GROUP 1 — CRITICAL FIXES

### TASK 1.1 · Context Window Pressure — Lazy-Load Agent System

**Problem:** 100+ `.cursor/agents/*.md` files all compete for context at session start
because `alwaysApply: true` rules reference the entire agents catalog.

**What to build:**

1. Create `.cursor/state/AGENT_REGISTRY.yaml` — a compact registry of all agents
   with just their name, tier, swarm, and one-line summary. No full content.

2. Create `.cursor/rules/agent-lazy-load.mdc` with `alwaysApply: true` containing
   this protocol:

   ```
   ## Agent Lazy-Load Protocol

   At session start, DO NOT load full agent files.
   Load ONLY:
   - .cursor/state/AGENT_REGISTRY.yaml (compact summaries)
   - The agent file(s) for the ACTIVE swarm detected from MEMORY.md or user intent.
   - .cursor/agents/swarm-leader.md (always — CPO context)
   - .cursor/agents/deputy-swarm-leader.md (always — coordination context)

   Active swarm detection:
   1. Read docs/workspace/context/MEMORY.md → "Active Swarm" field.
   2. If absent, infer from user message (e.g. "frontend" → load Swarm 3 agents only).
   3. If still unclear, ask once: "Which swarm are we working in today?"

   Swarm → agent file map:
   - Swarm 1 (Architecture): lead-solution-architect, requirements-analysis-manager
   - Swarm 2 (Design): lead-uiux-designer, design-systems-token-architect
   - Swarm 3 (Frontend): lead-frontend-architect, react-component-lead
   - Swarm 4 (Backend): lead-backend-architect, api-logic-manager
   - Swarm 5 (Data/DB): lead-database-architect, database-design-manager
   - Swarm 6 (Mobile): lead-mobile-architect
   - Swarm 7 (CMS/SaaS): lead-cms-saas-architect, saas-platform-manager
   - Swarm 8 (Analytics): lead-analytics-architect
   - Swarm 9 (Security): lead-security-officer, app-security-manager
   - Swarm 10 (DevOps): lead-devops-performance, devops-manager
   - Swarm 11 (QA): lead-qa-architect, testing-manager
   - Swarm 12 (Maintenance): lead-maintenance-agent
   - Swarm 13 (Ethics): lead-ai-ethics-officer

   Load additional agents only when:
   - User explicitly names a task requiring a specialist.
   - A handoff packet names the next agent.
   - An escalation path is triggered.
   ```

3. Update `docs/workspace/context/MEMORY.md` to add a top-level field:
   ```yaml
   ## Session State
   active_swarm: ""          # Fill at session start: Swarm N — [name]
   active_agent: ""          # Currently active agent file name
   session_context_loaded:   # List of agent files loaded this session
     - []
   ```

**Expected outcome:** Context window load drops 80-90% at session start.
Token efficiency score target: ≥ 80.

---

### TASK 1.2 · Sync Drift — Wave 2 Wiring into .mdc Rule Files

**Problem:** Wave 2 audit (`docs/reports/audits/skills-wave2-wiring.latest.md`) found
that `.cursor/commands/plan.md` and `.cursor/commands/develop.md` were updated with
`wireframe-to-spec-converter` and `design-system-builder` wiring, but the always-apply
`.mdc` rule files were NOT updated to enforce this at rule level.

**What to build:**

1. Open `.cursor/rules/workspace-orchestration.mdc`.
   In the **SDD hardlock prerequisites for development** section, add item 11:
   ```
   11. `docs/core/required/sdd/WIREFRAMES.md` must exist when any
       screen-level component is being developed (enforced by wireframe-to-spec skill).
   ```

2. Open `.cursor/rules/design-dev-gates.mdc`.
   In the **Pre-Develop Checklist** section, add step 6:
   ```
   6. Confirm wireframe-to-spec conversion is complete:
      - `docs/core/required/sdd/WIREFRAMES.md` exists and is non-template.
      - Each screen has a `screen_id`, `components`, `states`, and `accessibility_notes`.
      - Run: `grep -c "screen_id" docs/core/required/sdd/WIREFRAMES.md` to verify count > 0.
   ```

3. Create `.husky/pre-commit` (or update if exists) to add:
   ```bash
   #!/bin/sh
   # NEZAM: Block commit if ai:check fails (sync drift guard)
   echo "🔍 Checking AI tool sync drift..."
   pnpm ai:check
   if [ $? -ne 0 ]; then
     echo "❌ ai:check FAILED — sync drift detected between .cursor/ and generated mirrors."
     echo "   Run: pnpm ai:sync"
     echo "   Then re-stage and commit."
     exit 1
   fi
   echo "✅ Sync check passed."
   ```

4. Update `docs/reports/audits/skills-wave2-wiring.latest.md` — append:
   ```markdown
   ## Wave 2 Enforcement Closure (2026-05-10)
   - workspace-orchestration.mdc: updated with wireframe prerequisite (item 11)
   - design-dev-gates.mdc: updated with wireframe checklist step (step 6)
   - pre-commit hook: installed to block commits on ai:check failure
   - Status: CLOSED
   ```

---

### TASK 1.3 · Wireframe Gap — Connect Wireframe Layer to Real Tool

**Problem:** `wireframe-to-spec` skill converts wireframes to spec but inputs are
text descriptions only. No real wireframe tool is connected.

**What to build:**

1. Update `.cursor/skills/design/wireframe-to-spec/SKILL.md`:
   - Add a new section: `## Input Sources` with these three modes:
     ```markdown
     ## Input Sources

     ### Mode A — Figma MCP (preferred when Figma is connected)
     When `mcp figma` is active in workspace settings:
     - Use Figma MCP to read frame data from the provided Figma URL.
     - Extract: frame name, child components, layout constraints, text content, auto-layout rules.
     - Map Figma component names to NEZAM component vocabulary from DESIGN.md.
     - Auto-generate the WIREFRAMES.md YAML blocks from Figma frame data.
     Command: `/Settings mcp on figma` to activate.

     ### Mode B — Excalidraw / Penpot JSON import
     When user uploads or pastes an Excalidraw `.excalidraw` JSON or Penpot export:
     - Parse element IDs, labels, groupings, and position relationships.
     - Infer layout intent from element spatial arrangement.
     - Generate WIREFRAMES.md YAML blocks from parsed structure.
     - Flag ambiguous elements for user confirmation before generating spec.

     ### Mode C — Text description (fallback, current behavior)
     When no tool is connected:
     - Ask user to describe each screen section by section.
     - Use structured interview: "What is the top-level layout goal of this section?"
     - Generate WIREFRAMES.md YAML blocks from interview answers.
     - Flag output as: `source: text-interview` so reviewers know it needs visual validation.
     ```

2. Update `.cursor/rules/workspace-orchestration.mdc`:
   Add to **MCP Usage Policy** section:
   ```markdown
   ### Wireframe MCP Policy
   When `/PLAN design wireframes` is invoked:
   1. Check `docs/workspace/context/MCP_REGISTRY.md` for active Figma MCP.
   2. If active → use Mode A (Figma MCP) automatically.
   3. If inactive → check for uploaded Excalidraw/Penpot file → Mode B.
   4. If neither → Mode C (text interview fallback).
   5. Always write source mode to WIREFRAMES.md front-matter: `wireframe_source: figma|excalidraw|text`.
   ```

3. Update `/Settings mcp` command in `.cursor/commands/settings.md`:
   In the MCP dashboard table, add a row:
   ```
   figma         ❌ OFF   ⚠️ missing FIGMA_ACCESS_TOKEN   lead-uiux-designer
   excalidraw    ✅ NO_MCP  (upload .excalidraw file directly)
   ```

4. Create `docs/workspace/context/WIREFRAME_BRIDGE.md`:
   ```markdown
   # Wireframe Bridge — Tool Connection Guide

   ## Option 1: Figma (recommended)
   1. Get your Figma Personal Access Token: figma.com → Account Settings → Access Tokens
   2. Set env var: `FIGMA_ACCESS_TOKEN=your_token`
   3. Activate: `/Settings mcp on figma`
   4. Use: `/PLAN design wireframes figma <figma-url>`

   ## Option 2: Excalidraw (free, no account needed)
   1. Draw wireframes at excalidraw.com
   2. Export: Hamburger menu → Export to file → .excalidraw
   3. Upload the file to this Cursor session
   4. Use: `/PLAN design wireframes` — Cursor will detect the uploaded file

   ## Option 3: Penpot (open source, self-hosted option)
   1. Draw wireframes at penpot.app
   2. Export frames as JSON
   3. Upload and use same flow as Excalidraw Mode B

   ## Wireframe integration score target: ≥ 60
   Achieved when any Mode A or Mode B input source is connected and producing WIREFRAMES.md
   with `screen_id` blocks that map to actual DESIGN.md component vocabulary.
   ```

---

## TASK GROUP 2 — MAJOR ENHANCEMENTS

### TASK 2.1 · Agent State Persistence

**Problem:** Sessions restart cold. Agents have no memory of what was last active,
what the last output was, or what handoff is pending.

**What to build:**

1. Create `.cursor/state/agent-status.yaml`:
   ```yaml
   # NEZAM Agent State — updated automatically at session end
   # Do not edit manually. Updated by /GUIDE and swarm commands.
   # Source of truth for session resume.

   last_updated: ""           # ISO datetime
   active_swarm: ""           # e.g. "Swarm 3 — Frontend"
   active_agent: ""           # e.g. "lead-frontend-architect"
   active_phase: ""           # e.g. "05-build"
   active_feature_slice: ""   # e.g. "auth-login"
   active_spec: ""            # e.g. "docs/workspace/plans/05-build/auth-login/SPEC.md"

   last_output:
     type: ""                 # "spec" | "design" | "component" | "decision" | "audit"
     artifact_path: ""        # path to last produced artifact
     status: ""               # "draft" | "approved" | "in-review"
     summary: ""              # one sentence of what was produced

   pending_handoff:
     from_agent: ""
     to_agent: ""
     handoff_packet_path: ""
     status: ""               # "pending" | "delivered" | "none"

   open_blockers:
     - ""

   session_resume_prompt: ""  # Auto-generated sentence to paste at next session start
   ```

2. Update `.cursor/rules/workspace-orchestration.mdc`:
   Add to **Session Start Checklist** section:
   ```markdown
   6. Read `.cursor/state/agent-status.yaml` — if `pending_handoff.status: pending`,
      deliver the handoff before any new work begins.
   7. If `active_spec` is set, confirm with user: "Last session left off at [spec].
      Resume? Y/N"
   8. Print `session_resume_prompt` from agent-status.yaml as the first message.
   ```

3. Update `.cursor/rules/workspace-orchestration.mdc`:
   Add to **Memory Capture Protocol** section:
   ```markdown
   | Session end | Write to `.cursor/state/agent-status.yaml`: last agent, last output, pending handoff, one-sentence resume prompt |
   ```

4. Add to `.cursor/commands/guide.md` in the `## /GUIDE status` section:
   ```markdown
   ### 0. Session Resume Card (shown FIRST if agent-status.yaml has content)

     📍 Last session: [active_agent] working on [active_spec]
     📦 Last output: [last_output.summary] → [status]
     🔄 Pending handoff: [from_agent] → [to_agent] ([status])
     ❌ Open blockers: [list]

     → Resume: [session_resume_prompt]
   ```

---

### TASK 2.2 · Spec Versioning

**Problem:** SPEC.md files exist but have no semantic version tracking.
Hard to know which version of a spec was actually built.

**What to build:**

1. Create `docs/workspace/templates/plan/SPEC_TEMPLATE.md`:
   ```markdown
   ---
   spec_id: ""                    # e.g. SPEC-005
   spec_version: "0.1.0"          # SemVer: major.minor.patch
   feature_slug: ""               # e.g. auth-login
   phase: ""                      # e.g. 05-build
   created: ""                    # YYYY-MM-DD
   last_amended: ""               # YYYY-MM-DD
   built_at_version: ""           # App SemVer when this spec was implemented (fill at merge)
   status: "draft"                # draft | approved | in-progress | built | deprecated
   owner_agent: ""                # e.g. lead-frontend-architect
   changelog_ref: ""              # CHANGELOG.md entry e.g. "v0.3.0 — 2026-05-10"
   ---

   # [Feature Name] Spec

   ## Acceptance Criteria
   - [ ]

   ## Data Model Changes
   -

   ## API Contract
   -

   ## UI States
   - loading:
   - empty:
   - error:
   - success:

   ## Edge Cases
   -

   ## Dependencies
   -

   ## Validation Command
   ```bash
   # Command to verify this spec is built correctly
   ```

   ## Decision Amendments
   | Date | Changed field | Previous value | New value | Reason | Approved by |
   |------|--------------|----------------|-----------|--------|-------------|
   ```

2. Update `.cursor/rules/workspace-orchestration.mdc`:
   In the **SDD hardlock prerequisites for development** section, add item 12:
   ```
   12. Every SPEC.md under `docs/workspace/plans/<phase>/<feature>/` must use the
       SPEC_TEMPLATE format with `spec_version`, `status`, and `spec_id` fields present.
       Specs with `status: draft` may NOT have BUILD work begun.
       Specs require `status: approved` before any implementation.
   ```

3. Add a `/DEVELOP review` spec version check to `.cursor/commands/develop.md`:
   ```markdown
   ### Spec Version Check (runs before every /DEVELOP feature)
   1. Read the SPEC.md for the target feature.
   2. Confirm `status: approved` — if `draft`, halt and ask user to approve first.
   3. Record `built_at_version` in SPEC.md from current CHANGELOG.md top version.
   4. Bump `spec_version` patch on any amendment (e.g. 0.1.0 → 0.1.1).
   5. Bump `spec_version` minor on acceptance criteria changes (e.g. 0.1.0 → 0.2.0).
   6. Bump `spec_version` major on scope changes that require design rework (e.g. 0.1.0 → 1.0.0).
   ```

4. Create `scripts/check-spec-versions.sh`:
   ```bash
   #!/bin/bash
   # NEZAM: Check all SPEC.md files have required version fields
   echo "Checking spec version compliance..."
   FAIL=0
   for spec in $(find docs/workspace/plans -name "SPEC.md"); do
     if ! grep -q "spec_version:" "$spec"; then
       echo "❌ Missing spec_version: $spec"
       FAIL=1
     fi
     if ! grep -q "spec_id:" "$spec"; then
       echo "❌ Missing spec_id: $spec"
       FAIL=1
     fi
     if ! grep -q "status:" "$spec"; then
       echo "❌ Missing status: $spec"
       FAIL=1
     fi
   done
   if [ $FAIL -eq 0 ]; then
     echo "✅ All specs have version fields."
   fi
   exit $FAIL
   ```

5. Update `package.json` scripts section to add:
   ```json
   "check:specs": "bash scripts/check-spec-versions.sh",
   "check:all": "pnpm check:tokens && pnpm check:specs && pnpm ai:check"
   ```

**Expected outcome:** Spec versioning score target: ≥ 75.

---

### TASK 2.3 · Silent Automation Triggers

**Problem:** `pnpm ai:sync` runs manually. No automated drift detection.
No nightly tech-stack review. Automations are declared in `/Settings` but not wired.

**What to build:**

1. Create `.github/workflows/nezam-nightly.yml`:
   ```yaml
   name: NEZAM Nightly Automation
   on:
     schedule:
       - cron: '0 2 * * *'   # 2am UTC daily
     workflow_dispatch:       # allow manual trigger

   jobs:
     sync-check:
       runs-on: ubuntu-latest
       name: Sync Drift Check
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v3
         - run: pnpm install --frozen-lockfile
         - run: pnpm ai:check
         - name: Write sync status
           run: |
             echo "## Sync Check — $(date -u +%Y-%m-%d)" >> docs/reports/audits/sync-status.md
             echo "Status: passed" >> docs/reports/audits/sync-status.md
           if: success()
         - name: Alert on drift
           if: failure()
           run: echo "::warning::Sync drift detected — run pnpm ai:sync"

     spec-version-check:
       runs-on: ubuntu-latest
       name: Spec Version Compliance
       steps:
         - uses: actions/checkout@v4
         - run: bash scripts/check-spec-versions.sh
   ```

2. Create `.github/workflows/nezam-pr-gates.yml`:
   ```yaml
   name: NEZAM PR Gates
   on:
     pull_request:
       branches: [main, develop]

   jobs:
     design-tokens:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v3
         - run: pnpm install --frozen-lockfile
         - run: pnpm run check:tokens
         - run: pnpm ai:check
         - run: bash scripts/check-spec-versions.sh
   ```

3. Update `.cursor/commands/settings.md` in `## /Settings automations` section,
   replace the placeholder entries with:
   ```markdown
   /Settings automations scheduled sync-check      → daily 2am UTC via nezam-nightly.yml
   /Settings automations scheduled spec-check      → on every PR via nezam-pr-gates.yml
   /Settings automations scheduled nightly-report  → writes to docs/reports/perf/nightly.md
   ```

4. Create `docs/workspace/plans/templates/NIGHTLY_AUTOMATION_SELF_TEST.template.md`
   (update the existing template if it's still a placeholder):
   ```markdown
   # Nightly Automation Self-Test — {{ date }}

   ## Sync Check
   - Status: [ pass | fail ]
   - Drift files: []

   ## Spec Version Check
   - Total specs: N
   - Compliant: N
   - Non-compliant: []

   ## Agent Status
   - Last active swarm: []
   - Pending handoffs: []

   ## Next recommended action
   - []
   ```

---

### TASK 2.4 · /CHECK Command — Agent Output Quality Scoring

**Problem:** `EVAL_FRAMEWORK.md` exists but there is no command wired to it.
The command must be a single short word matching the NEZAM command pattern.

**Command name: `/CHECK`**

Rationale: Short, one word, matches `/SCAN`, `/FIX`, `/GUIDE`, `/PLAN` pattern.
Semantically clear — "check the quality of this output."

**What to build:**

Create `.cursor/commands/check.md`:

```markdown
/CHECK — Agent output quality scorer and drift detector

Subcommands:
  /CHECK output     → Score the last agent output: correctness, scope, quality, slop
  /CHECK spec <slug>→ Verify a SPEC.md is complete, versioned, and approved
  /CHECK agent <name>→ Score a named agent's last known output from agent-status.yaml
  /CHECK gates      → Run all gate checks: tokens, specs, sync, a11y, perf
  /CHECK drift      → Detect drift between .cursor/ canonical and generated mirrors
  /CHECK swarm      → Show current swarm health: active agents, pending handoffs, blockers
  /CHECK all        → Run complete quality check: output + spec + gates + drift + swarm

Aliases: /CHECK → defaults to /CHECK output | /CHECK q → /CHECK output

Hard blocks: none — /CHECK is always available
Recommendation footer: required

---

## /CHECK output — Agent Output Quality Score

Score the most recently produced artifact or agent reply on these dimensions:

| Dimension        | Weight | What it checks                                              |
|-----------------|--------|-------------------------------------------------------------|
| Scope accuracy  | 25%    | Did the agent stay within its assigned task?                |
| Spec fidelity   | 25%    | Does the output match the relevant SPEC.md acceptance criteria? |
| Design compliance | 20%  | Token-first? No hardcoded values? Correct component naming? |
| Completeness    | 15%    | All required states covered? No "TODO" or placeholder left? |
| Slop detection  | 15%    | AI filler phrases, vague statements, unreferenced claims    |

Output format:
```
╔══════════════════════════════════════════════╗
║  /CHECK Output Score                         ║
╠══════════════════════════════════════════════╣
║  Scope accuracy    [████████░░]  80%          ║
║  Spec fidelity     [█████████░]  90%          ║
║  Design compliance [██████░░░░]  60% ⚠️       ║
║  Completeness      [████████░░]  80%          ║
║  Slop detection    [█████████░]  90%          ║
╠══════════════════════════════════════════════╣
║  TOTAL SCORE: 80% — PASS                     ║
╠══════════════════════════════════════════════╣
║  Issues found:                               ║
║  ⚠️  Design: hardcoded color #333 in line 42  ║
║  ⚠️  Design: px value 16px not using token    ║
╠══════════════════════════════════════════════╣
║  Fix: /FIX design tokens                     ║
╚══════════════════════════════════════════════╝
```

Pass threshold: ≥ 70% total.
Fail threshold: < 70% OR any Spec fidelity score < 60%.
On fail: route to `/FIX` automatically with the specific issue list.

---

## /CHECK spec <feature-slug>

Check a SPEC.md for completeness and version compliance.

Steps:
1. Load `docs/workspace/plans/<active-phase>/<feature-slug>/SPEC.md`.
2. Verify presence of: `spec_id`, `spec_version`, `status`, `owner_agent`, `built_at_version` (if status: built).
3. Verify acceptance criteria are non-empty and specific (not "it should work").
4. Verify all states are defined: loading, empty, error, success.
5. Verify no pending `## Decision Amendments` that aren't recorded.
6. Check if `status: approved` — warn if `draft` and BUILD has been started.

Output:
```
SPEC: auth-login (SPEC-005)
Version: 0.2.1  Status: approved  Owner: lead-frontend-architect

✅ spec_id present
✅ spec_version present
✅ status: approved
✅ All 4 UI states defined
⚠️  Acceptance criteria #3 is vague: "User should see a success state"
    → Suggest: "On successful auth, user redirects to /dashboard within 500ms"
✅ No pending amendments

Score: 92% — PASS
→ Ready for /DEVELOP feature auth-login
```

---

## /CHECK gates

Run all workspace gates in sequence. Same as pre-/DEVELOP checklist but callable anytime.

Order:
1. `pnpm check:tokens`     — Gate 1: Token-first CSS
2. `pnpm check:specs`      — Spec versioning compliance
3. `pnpm ai:check`         — Sync drift check
4. Check DESIGN.md non-template
5. Check GITHUB_GATE_MATRIX.json exists
6. Check PRD.md non-template
7. Check active subphase has prompt.json + PROMPT.md

Output: gate-by-gate ✅/❌ + overall pass/fail.

---

## /CHECK drift

Detect drift between `.cursor/` canonical files and generated mirrors.
Runs: `pnpm ai:check` under the hood.

On drift detected:
```
❌ Drift detected in 2 files:
   CLAUDE.md: out of sync with .cursor/commands/guide.md
   AGENTS.md: missing agent deputy-swarm-leader (added in .cursor/agents/ but not synced)

→ Fix: pnpm ai:sync
→ Then: pnpm ai:check to verify
```

---

## /CHECK swarm

Show current swarm health snapshot from `.cursor/state/agent-status.yaml`.

Output:
```
Swarm Health Snapshot — [datetime]

Active swarm:    [Swarm N — name]
Active agent:    [agent name]
Active phase:    [phase]
Active spec:     [spec path] (status: [status])

Last output:     [summary] → [status]
Pending handoff: [from] → [to] ([status])
Open blockers:   [list or "none"]

→ /CHECK output to score last output
→ /CHECK spec [slug] to verify active spec
→ /GUIDE next for recommended next action
```
```

5. Update `CLAUDE.md` sync template to include `/CHECK` in the synced command index.
   Add to `.cursor/commands/` index: `check.md`

6. Update `docs/workspace/context/ORCHESTRATION_ALIASES.md`:
   Add to the Commands → skills table:
   ```
   | `/CHECK output` | `check-output` | `.cursor/commands/check.md` |
   | `/CHECK spec`   | `check-spec`   | `.cursor/commands/check.md` |
   | `/CHECK gates`  | `check-gates`  | `.cursor/commands/check.md` |
   ```

---

## TASK GROUP 3 — FEATURE ADDITIONS

### TASK 3.1 · Swarm Decision Log — Auto-Append on Every Go/No-Go

**Problem:** `SWARM_DECISION_RECORD.template.md` exists but nothing writes to it automatically.
Every go/no-go decision evaporates unless manually logged.

**What to build:**

1. Create `docs/workspace/decisions/SWARM_DECISION_LOG.md`:
   ```markdown
   # Swarm Decision Log

   This file is append-only. Every go/no-go/replan decision must be recorded here.
   Template: docs/workspace/plans/templates/SWARM_DECISION_RECORD.template.md

   ---
   ```

2. Update `.cursor/rules/workspace-orchestration.mdc`:
   Add to **Memory Capture Protocol**:
   ```markdown
   | Go/no-go decision | Append to `docs/workspace/decisions/SWARM_DECISION_LOG.md`
     using SWARM_DECISION_RECORD.template.md format. Include: objective, status,
     rationale, blockers, next_legal_command, approved_by. |
   ```

3. Update `.cursor/rules/workspace-orchestration.mdc`:
   Add to **Session Start Checklist** item 9:
   ```
   9. Check docs/workspace/decisions/SWARM_DECISION_LOG.md for any pending decisions
      with `status: replan` — surface them before starting new work.
   ```

4. Update `docs/workspace/context/governance/SWARM_WORKFLOW.md`:
   In the **Go/no-go rubric** section, add:
   ```markdown
   ### Decision logging (mandatory)
   Every go/no-go/replan decision MUST be appended to
   `docs/workspace/decisions/SWARM_DECISION_LOG.md` before the next phase begins.
   The Deputy Orchestrator is responsible for ensuring this happens at phase boundaries.
   Missing log entry = decision didn't happen (treat as replan).
   ```

---

### TASK 3.2 · Runtime Agent Communication Bridge (Simulated Bus)

**Problem:** Agents communicate through files (documents) not a real message bus.
This is correct for a doc-driven system, but handoffs are too slow and error-prone.

**What to build — a fast handoff file protocol:**

1. Create `.cursor/state/agent-bus.yaml`:
   ```yaml
   # NEZAM Agent Communication Bus
   # Simulated message passing via file. Agents write here; next agent reads here on start.
   # Cleared after handoff is delivered.

   messages:
     - id: ""
       from: ""
       to: ""
       type: ""           # "handoff" | "escalation" | "blocker" | "decision-request"
       timestamp: ""
       payload:
         subject: ""
         artifact_path: ""
         summary: ""
         action_required: ""
       status: ""          # "pending" | "read" | "actioned"
   ```

2. Update `.cursor/rules/workspace-orchestration.mdc`:
   Add section **Agent Bus Protocol**:
   ```markdown
   ## Agent Bus Protocol

   When one agent completes a task and must hand off to another:
   1. Write a message to `.cursor/state/agent-bus.yaml` with type: "handoff".
   2. Set `to:` to the receiving agent's file name.
   3. Fill `payload.summary` and `payload.action_required`.
   4. Set `status: pending`.

   When an agent starts work:
   1. Check `.cursor/state/agent-bus.yaml` for messages addressed to it (`to: <agent-name>`).
   2. If any `status: pending` messages exist → read them before starting new work.
   3. Mark message `status: read` after reading.
   4. Mark `status: actioned` after completing the requested action.

   Escalation messages:
   - Use type: "escalation" with `to:` set to the escalation target.
   - Deputy Orchestrator reads all escalation messages at daily sync.

   Decision requests:
   - Use type: "decision-request" with `to: "cpo"`.
   - CPO must action or decline before any further work in that scope proceeds.
   ```

3. Update `/GUIDE status` in `.cursor/commands/guide.md`:
   Add to **Quick Health Snapshot**:
   ```markdown
   ### Agent Bus Status
   - Pending messages: [count from agent-bus.yaml where status=pending]
   - Unread escalations: [count where type=escalation and status=pending]
   → /CHECK swarm to view all
   ```

**Expected outcome:** Real-time agent comms score target: ≥ 70.
(Real-time remains simulated via files — true async bus requires external tooling.
This closes the largest gap in the simulation layer.)

---

### TASK 3.3 · Progress Report Population

**Problem:** `docs/reports/progress/PROGRESS_REPORT.latest.md` is still a template
with placeholder content.

**What to build:**

1. Populate `docs/reports/progress/PROGRESS_REPORT.latest.md` with real current state:
   ```markdown
   # Progress Report

   Date (UTC): 2026-05-10
   Branch: main
   Phase: 00-define — Workspace hardening pass

   ## Snapshot

   NEZAM workspace has completed initial architecture setup.
   Current pass: hardening session — closing 9 identified weaknesses.

   ## Done since last report

   - SDD pipeline v3 implemented (4 product types with correct pipeline orders)
   - 13-swarm agent hierarchy defined with 100+ specialist agents
   - 7-gate design system (token-first, motion budget, perf thresholds)
   - Hardlock system implemented in workspace-orchestration.mdc
   - CLI orchestration rules for multi-tool routing (9 tools)
   - /GUIDE command implemented (status/next/phase/full/explain)
   - /Settings command implemented (full control plane)
   - Wave 1 + Wave 2 skills wired into /PLAN and /DEVELOP commands
   - MENA/Arabic layer: 5 dialect specialists + Arabic SEO/AEO agents

   ## In flight (this session)

   - Agent lazy-load system (.cursor/state/AGENT_REGISTRY.yaml)
   - Sync drift closure (workspace-orchestration.mdc + design-dev-gates.mdc)
   - Wireframe MCP bridge (Figma/Excalidraw/Penpot modes)
   - Agent state persistence (.cursor/state/agent-status.yaml)
   - Spec versioning template + check script
   - Silent automation triggers (GitHub Actions workflows)
   - /CHECK command (agent output quality scoring)
   - Swarm decision log (append-only SWARM_DECISION_LOG.md)
   - Agent bus protocol (.cursor/state/agent-bus.yaml)

   ## Risks / questions

   - Figma MCP requires FIGMA_ACCESS_TOKEN — user must provision.
   - Husky must be initialized (`npx husky install`) for pre-commit hook to activate.
   - pnpm ai:sync script must exist and be correctly implemented for sync checks to pass.

   ## Next three actions

   1. Run: `pnpm ai:sync && pnpm ai:check` to verify all changes propagated.
   2. Provision FIGMA_ACCESS_TOKEN and run `/Settings mcp on figma` to activate wireframe Mode A.
   3. Run `/CHECK gates` to verify all hardlock prerequisites are passing.

   ## Files companion should read next

   - `.cursor/state/agent-status.yaml`
   - `.cursor/state/agent-bus.yaml`
   - `docs/workspace/decisions/SWARM_DECISION_LOG.md`
   - `.cursor/commands/check.md`
   ```

---

## TASK GROUP 4 — FINAL SYNC AND VERIFICATION

### TASK 4.1 · Update CLAUDE.md Command Index

Update `CLAUDE.md` synced command index to include `check.md`:

```markdown
## Synced command index
- `check.md`       ← ADD THIS
- `create.md`
- `deploy.md`
- `develop.md`
- `fix.md`
- `founder.md`
- `git.md`
- `guide.md`
- `help.md`
- `plan.md`
- `scan.md`
- `settings.md`
- `start.md`
```

### TASK 4.2 · Verify package.json Scripts

Confirm `package.json` has these scripts (add any missing):
```json
{
  "scripts": {
    "ai:sync": "node scripts/sync-ai-folders.js",
    "ai:check": "node scripts/check-ai-sync.js",
    "check:tokens": "bash scripts/checks/check-design-tokens.sh",
    "check:specs": "bash scripts/check-spec-versions.sh",
    "check:all": "pnpm check:tokens && pnpm check:specs && pnpm ai:check",
    "design:apply": "node scripts/apply-design-profile.js"
  }
}
```

### TASK 4.3 · Final Run

After all tasks above are complete, run in sequence:
```bash
npx husky install                     # activate pre-commit hooks
pnpm ai:sync                          # propagate .cursor/ to all mirrors
pnpm ai:check                         # verify no drift
pnpm check:all                        # run all quality checks
```

Then run `/CHECK gates` inside Cursor to confirm all hardlock prerequisites pass.

---

## SUCCESS CRITERIA

After this prompt executes completely, these scores should be achievable:

| Metric                  | Before | Target | How achieved |
|------------------------|--------|--------|--------------|
| Token / cost efficiency | 78%    | ≥ 80%  | Agent lazy-load (Task 1.1) |
| Spec versioning         | 55%    | ≥ 75%  | Version template + check script (Task 2.2) |
| Real-time agent comms   | 35%    | ≥ 70%  | Agent bus protocol + state file (Tasks 2.1, 3.2) |
| Wireframe integration   | 30%    | ≥ 60%  | 3-mode wireframe bridge (Task 1.3) |
| Sync drift              | ⚠️ gap  | ✅ closed | .mdc updates + pre-commit hook (Task 1.2) |
| Swarm decisions logged  | ❌ none | ✅ enforced | SWARM_DECISION_LOG.md + rule (Task 3.1) |

---

## RECOMMENDATION FOOTER

After completing all tasks, run:
```bash
pnpm ai:sync && pnpm ai:check
```
Then type `/CHECK gates` to verify all hardlocks are satisfied.
Then type `/GUIDE status` to get your updated pipeline position.
