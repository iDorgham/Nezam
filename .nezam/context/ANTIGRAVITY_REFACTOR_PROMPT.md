# NEZAM Workspace Refactor — Antigravity Execution Prompt

> **Paste this entire document into Antigravity as a single instruction block.**
> Antigravity should execute every numbered item in sequence.
> All paths are relative to the workspace root unless stated otherwise.
> After each item, run `pnpm ai:check` before moving to the next.

---

## Context

You are working inside the NEZAM AI workspace governance system. The canonical source of truth is `.cursor/`. After every structural change, run `pnpm ai:sync` to propagate to all tool mirrors (`.antigravity/`, `.opencode/`, etc.). After sync, run `pnpm ai:check` to verify no drift.

The 20 items below were identified in a comprehensive audit. Execute them top-to-bottom. Items marked **[SCRIPT]** require a new Node/bash script. Items marked **[YAML]** require editing YAML files only. Items marked **[MERGE]** require content consolidation. Items marked **[ARCHIVE]** require file moves only.

---

## ITEM 1 — [SCRIPT] State YAML Auto-Writer

**Problem:** `.cursor/state/onboarding.yaml`, `plan_progress.yaml`, and `develop_phases.yaml` are never written by any automated process. Gates that read these files see stale empty defaults, making hardlock enforcement purely manual.

**Action:**

1. Create `scripts/write-state.js` — a Node script that:
   - Accepts `--file <yaml-path> --key <dot.notation.key> --value <val>` as CLI args
   - Reads the target YAML file
   - Sets the key to the value (supports nested dot notation: `develop_phases.phase_2.status`)
   - Writes the file back atomically (write to `.tmp` then rename)
   - Prints `[state-writer] updated <key> = <value> in <file>`

2. Add to `package.json` scripts:
   ```json
   "state:set": "node scripts/write-state.js"
   ```

3. Edit `.cursor/agents/swarm-leader.md` — in the **Session Start Protocol** section, add:
   ```
   On /start command completion:
   - Run: pnpm state:set --file .cursor/state/onboarding.yaml --key build_mode --value <chosen_mode>
   - Run: pnpm state:set --file .cursor/state/onboarding.yaml --key tone --value <chosen_tone>
   - Run: pnpm state:set --file .cursor/state/onboarding.yaml --key user_mode --value <chosen_mode>
   ```

4. Edit `.cursor/agents/subagent-controller.md` — in **Phase Completion Verification**, replace the instruction "Agent sets `develop_phases.[phase].testing_passed: true`" with:
   ```
   Agent runs: pnpm state:set --file .cursor/state/develop_phases.yaml --key develop_phases.<phase>.testing_passed --value true
   Agent runs: pnpm state:set --file .cursor/state/develop_phases.yaml --key develop_phases.<phase>.status --value complete
   ```

---

## ITEM 2 — [YAML] Enforce Agent Bus in Subagent Controller

**Problem:** `.cursor/state/agent-bus.yaml` has a valid schema but the messages array contains only an empty template entry. No agent is required to write to it.

**Action:**

1. Edit `.cursor/agents/subagent-controller.md` — in the **Standardized Output Bundle** section, add as the first bullet:
   ```
   - **Agent Bus write (MODE B/C mandatory):** For any MODE B or MODE C task assignment, write a message entry to `.cursor/state/agent-bus.yaml` before declaring routing complete. Format:
     ```yaml
     - id: "<task_id>"
       from: "<assigning_agent>"
       to: "<receiving_swarm_lead>"
       type: "task_assignment"
       payload: "<one-line task description>"
       phase: "<phase_N>"
       mode: "<A|B|C>"
       timestamp: "<ISO-8601>"
       status: "sent"
     ```
     MODE A tasks MAY write but are not required to.
   ```

2. Edit `.cursor/rules/workspace-orchestration.mdc` — in the Agent Bus Protocol section, change the enforcement level from "SHOULD" to "MUST" for MODE B/C, and add:
   ```
   Violation: If a MODE B or MODE C handoff has no agent-bus.yaml entry, it is treated as an incomplete handoff. The receiving agent must reject the assignment and return: "Missing agent-bus entry for task <task_id>. Routing agent must log before re-sending."
   ```

---

## ITEM 3 — [SCRIPT] Agent Bus Watchdog CI Check

**Problem:** No CI check validates agent-bus.yaml entries. Silent skipping has no consequence.

**Action:**

1. Create `scripts/check-agent-bus.js`:
   - Read `.cursor/state/agent-bus.yaml`
   - If messages array is empty or contains only template entries (id === "" or id === null): print warning `[agent-bus] WARNING: No messages logged. Agent Bus appears unused.`
   - For each message: check required fields (id, from, to, type, payload, phase, mode, timestamp, status). Print `[agent-bus] ERROR: Message <index> missing field: <field>` for any missing field.
   - Exit code 1 if any ERROR found, 0 otherwise.

2. Add to `package.json` scripts:
   ```json
   "check:agent-bus": "node scripts/check-agent-bus.js"
   ```

3. Edit `package.json` — append `&& pnpm check:agent-bus` to the `check:all` script.

---

## ITEM 4 — [ARCHIVE] Archive All 19 Tier 3 Agents

**Problem:** 19 agents are documented as dormant/Tier 3 in `.nezam/memory/AGENT_AUDIT.md` but no archive directory exists and files were never moved.

**Tier 3 list (confirmed dormant):**
`android-engineer`, `dependency-update-specialist`, `executive-director`, `feature-flags-specialist`, `ios-engineer`, `mena-payments-specialist`, `mobile-offline-sync-specialist`, `mobile-push-notifications-specialist`, `observability-specialist`, `performance-engineer`, `product-manager`, `real-time-streaming-specialist`, `refactoring-specialist`, `risk-assessment-specialist`, `technology-evaluator`, `threat-modeling-specialist`, `time-series-specialist`, `vector-store-specialist`, `white-label-theming-specialist`

**Action:**

1. Create directory: `.cursor/agents/archive/`

2. Move each of the 19 `.cursor/agents/<name>.md` files to `.cursor/agents/archive/<name>.md`

3. Create `.cursor/agents/archive/ARCHIVE_INDEX.md`:
   ```markdown
   # Archived Agents — NEZAM Workspace

   Archived: 2026-05-12
   Reason: Tier 3 classification — dormant, no activation in 90+ days, functions covered by active Tier 1/2 agents.

   ## Promotion Checklist
   To restore an agent from archive:
   - [ ] Identify active use case requiring this agent's specialty
   - [ ] Verify no active agent covers the same scope
   - [ ] Update AGENT_REGISTRY.yaml: status → active, certified → false, last_eval_date → today
   - [ ] Move file back to `.cursor/agents/`
   - [ ] Run `pnpm ai:sync` and `pnpm ai:check`
   - [ ] Schedule Tier 2 EVAL within 30 days of re-activation

   ## Archived Agent List
   | Agent | Archived | Reason |
   |---|---|---|
   | android-engineer | 2026-05-12 | Covered by lead-mobile-architect + mobile-cross-platform |
   | dependency-update-specialist | 2026-05-12 | No activation triggers in codebase |
   | executive-director | 2026-05-12 | Role superseded by PM-01 swarm-leader |
   | feature-flags-specialist | 2026-05-12 | No feature flag system in active stack |
   | ios-engineer | 2026-05-12 | Covered by lead-mobile-architect + mobile-cross-platform |
   | mena-payments-specialist | 2026-05-12 | No active payments integration in pipeline |
   | mobile-offline-sync-specialist | 2026-05-12 | No offline-first feature in any PRD |
   | mobile-push-notifications-specialist | 2026-05-12 | No push system in active stack |
   | observability-specialist | 2026-05-12 | Covered by devops-manager |
   | performance-engineer | 2026-05-12 | Absorbed into a11y-performance-auditor (see ITEM 14) |
   | product-manager | 2026-05-12 | Merged into product-officer (see ITEM 13) |
   | real-time-streaming-specialist | 2026-05-12 | No real-time streaming in active stack |
   | refactoring-specialist | 2026-05-12 | No dedicated refactoring cycle active |
   | risk-assessment-specialist | 2026-05-12 | Covered by lead-security-officer + EVAL framework |
   | technology-evaluator | 2026-05-12 | Covered by project-architect + technology-evaluator role in lead-solution-architect |
   | threat-modeling-specialist | 2026-05-12 | Covered by app-security-manager |
   | time-series-specialist | 2026-05-12 | No time-series DB in active stack |
   | vector-store-specialist | 2026-05-12 | No vector store in active stack |
   | white-label-theming-specialist | 2026-05-12 | No white-label client in active pipeline |
   ```

4. Update `.cursor/state/AGENT_REGISTRY.yaml` — for each of the 19 agents, set `status: archived`.

5. Run `pnpm ai:sync`.

---

## ITEM 5 — [SCRIPT] Skills Registry + Binding Map

**Problem:** No machine-readable map exists connecting skills to their owning agents. `pnpm ai:check` cannot verify skill↔agent binding drift.

**Action:**

1. Create `scripts/generate-skills-registry.js`:
   - Walk `.cursor/skills/` recursively, find all `SKILL.md` files
   - For each: parse frontmatter (yaml between `---` markers) — extract `skill`, `version`, `agent`, `swarm` if present
   - Walk `.cursor/agents/` (not archive), find all `.md` files, grep for `@skill` references
   - Output `.cursor/state/skills-registry.json`:
     ```json
     {
       "generated": "<ISO-8601>",
       "skills": [
         {
           "path": ".cursor/skills/design/design-tokens/SKILL.md",
           "id": "nezam-pro-design-tokens",
           "version": "x.x",
           "referenced_by": ["swarm-leader", "subagent-controller"],
           "orphaned": false
         }
       ],
       "orphaned_skills": [],
       "unresolved_skill_refs": []
     }
     ```
   - Print `[skills-registry] <N> skills, <M> orphaned, <K> unresolved refs`
   - Exit 1 if any orphaned skills or unresolved refs found

2. Add to `package.json`:
   ```json
   "skills:registry": "node scripts/generate-skills-registry.js"
   ```

3. Append `&& pnpm skills:registry` to `check:all`.

---

## ITEM 6 — [YAML] Add `/scan agents` Command

**Problem:** No command exists to list active agents, their tier, and last eval date in a session.

**Action:**

1. Create `.cursor/commands/scan.md` (add if not already present, or extend if it exists):
   Add a section:
   ```markdown
   ## /scan agents

   Reads `.cursor/state/AGENT_REGISTRY.yaml` and outputs a formatted table:

   | Agent | Tier | Status | Last Eval | Score | Certified |
   |---|---|---|---|---|---|
   | swarm-leader | 1 | active | 2026-05-12 | — | false |
   ...

   Flags:
   - 🔴 agents with status: archived still referenced in active rules
   - 🟡 Tier 1 agents with last_eval_date older than 30 days
   - 🟠 Tier 2 agents with no eval date and MODE C activations in the last sprint
   ```

2. Register in `CLAUDE.md` synced command index if not already listed as `scan.md`.

---

## ITEM 7 — [SCRIPT] Swarm Cost Dashboard

**Problem:** No per-session token or task cost tracking exists at the swarm level.

**Action:**

1. Create `scripts/swarm-cost-report.js`:
   - Read `.cursor/state/agent-bus.yaml` messages
   - Group messages by `assigned_swarm`
   - For each swarm: count messages, count MODE A/B/C splits
   - Output `docs/reports/swarm-cost-<YYYY-MM-DD>.md`:
     ```markdown
     # Swarm Cost Report — <date>

     | Swarm | Tasks | Mode A | Mode B | Mode C | Notes |
     |---|---|---|---|---|---|
     | S1 Architecture | 3 | 2 | 1 | 0 | |
     ...

     **Total tasks routed:** N
     **Heavy swarms (>5 MODE C):** [list]
     ```
   - Print `[swarm-cost] report saved to docs/reports/swarm-cost-<date>.md`

2. Add to `package.json`:
   ```json
   "report:swarm-cost": "node scripts/swarm-cost-report.js"
   ```

3. Add `/report swarm-cost` as a slash command alias in `.cursor/commands/scan.md`.

---

## ITEM 8 — [YAML] Promote S6 Mobile Sub-Leads

**Problem:** Swarm-6 Mobile has only `lead-mobile-architect` + `mobile-cross-platform`. `ios-engineer` and `flutter-specialist` are in Tier 3 archive but mobile projects require native specialists.

**Action:**

1. Move `.cursor/agents/archive/ios-engineer.md` back to `.cursor/agents/ios-engineer.md`
   - Update AGENT_REGISTRY.yaml: `ios-engineer.status` → `active`, `tier` → `2`

2. Edit `.cursor/agents/flutter-specialist.md` (confirm it exists as active or restore from archive if needed):
   - Ensure it is in `.cursor/agents/` (not archive)
   - Update AGENT_REGISTRY.yaml: `flutter-specialist.status` → `active`, `tier` → `2`

3. Edit `.cursor/agents/subagent-controller.md` — in the Swarm 6 entry, update the specialist list:
   ```
   6. Mobile (`lead-mobile-architect`) — specialists: mobile-cross-platform (RN/Expo), flutter-specialist (Flutter), ios-engineer (Swift/UIKit)
   ```

4. Add conditional routing note:
   ```
   Mobile task routing:
   - React Native / Expo → mobile-cross-platform
   - Flutter → flutter-specialist
   - Native iOS → ios-engineer
   - Android (no archived android-engineer active) → mobile-cross-platform with platform flag
   ```

5. Update `.nezam/memory/AGENT_AUDIT.md` — move `ios-engineer` and `flutter-specialist` from Tier 3 to Tier 2.

---

## ITEM 9 — [YAML] Arabic SEO Conditional Hardlock

**Problem:** No hardlock enforces Arabic SEO/AEO review for MENA-targeted projects. Arabic content layer agents exist but are never gated.

**Action:**

1. Edit `.cursor/rules/sdd-pipeline-v2.mdc` — in the RESEARCH phase hardlock table for `website` and `webapp` product types, add:

   ```
   | arabic_seo_hardlock | IF onboarding.yaml:target_market contains "mena" OR "ar" THEN arabic-seo-aeo-specialist MUST produce docs/seo/arabic-seo-brief.md before RESEARCH phase completes | CONDITIONAL |
   ```

2. Edit `.cursor/state/onboarding.yaml` — add field:
   ```yaml
   target_market: ""       # "global" | "mena" | "ar" | "en" — set during /start Step 2
   ```

3. Edit `.cursor/agents/swarm-leader.md` — in the /start onboarding flow, add Step 2.3:
   ```
   Step 2.3 — Target market:
   "Is this project targeting MENA/Arabic-speaking users? (yes/no)"
   If yes: set onboarding.yaml:target_market = "mena"
   If yes: announce "Arabic SEO hardlock is ACTIVE. arabic-seo-aeo-specialist required in RESEARCH phase."
   ```

---

## ITEM 10 — [MERGE] Merge 3 Design Gate Rules → Single File

**Problem:** `.cursor/rules/design-dev-gates.mdc`, `.cursor/rules/nezam-design-gates-pro.mdc`, and `.cursor/rules/sdd-design.mdc` all have `alwaysApply: true` and cover overlapping design gate logic. This wastes tokens every session.

**Action:**

1. Read all three files in full.

2. Create `.cursor/rules/design-gates.mdc` with:
   ```yaml
   ---
   description: "NEZAM Unified Design Gates — Token-First, Typography, Grid, Animation, 3D, Component Architecture, Perf/a11y"
   globs: ["**/*.css","**/*.scss","**/*.tsx","**/*.ts","**/*.md","**/DESIGN.md","**/design.md"]
   alwaysApply: true
   ---
   ```
   Consolidate all unique gate rules from all three source files. Deduplicate — keep the most specific/strict version of any duplicated gate. Preserve all 7 gates, expand any that differ between files by taking the stricter constraint.

3. Delete `.cursor/rules/design-dev-gates.mdc`
4. Delete `.cursor/rules/nezam-design-gates-pro.mdc`
5. Delete `.cursor/rules/sdd-design.mdc`

6. Update `CLAUDE.md` synced rule sources list — remove the 3 deleted files, add `design-gates.mdc`.

7. Run `pnpm ai:sync`.

---

## ITEM 11 — [MERGE] Merge 3 Token Skills → `design-token-system`

**Problem:** Three overlapping skills exist in `.cursor/skills/design/`:
- `design-tokens/SKILL.md` — token values
- `design-token-architecture/SKILL.md` — token structure
- `token-grid-typography/SKILL.md` — token application

**Action:**

1. Read all three `SKILL.md` files in full.

2. Create `.cursor/skills/design/design-token-system/SKILL.md`:
   - Frontmatter:
     ```yaml
     ---
     skill: nezam-design-token-system
     version: 1.0.0
     replaces: [nezam-pro-design-tokens, nezam-token-architecture, nezam-token-grid-typography]
     scope: [css, scss, tsx, ts, design]
     ---
     ```
   - Structure: Part 1 — Token Architecture (structure, naming, tiers); Part 2 — Token Values (primitives, semantic, component tokens); Part 3 — Application (grid, fluid typography, spacing application, dark mode parity)
   - Merge all unique rules from the three source files. Keep the strictest constraint where they conflict.

3. Delete `.cursor/skills/design/design-tokens/` directory
4. Delete `.cursor/skills/design/design-token-architecture/` directory
5. Delete `.cursor/skills/design/token-grid-typography/` directory

6. In all agent files that reference `@nezam-pro-design-tokens`, `@nezam-token-architecture`, or `@nezam-token-grid-typography`, replace with `@nezam-design-token-system`.

7. Run `pnpm ai:sync`.

---

## ITEM 12 — [MERGE] Merge Neon Postgres Skills

**Problem:** Two separate Neon skills exist: `neon-postgres` and `neon-advanced`. These should be one tiered skill.

**Action:**

1. Read both SKILL.md files.

2. Create `.cursor/skills/backend/neon/SKILL.md`:
   - Part 1 — Core (connection, basic queries, schema, migrations from neon-postgres)
   - Part 2 — Advanced (branching, serverless edge patterns, connection pooling, performance from neon-advanced)

3. Delete source directories.

4. Update all agent `@skill` references from `@nezam-neon-postgres` and `@nezam-neon-advanced` to `@nezam-neon`.

5. Run `pnpm ai:sync`.

---

## ITEM 13 — [MERGE] Merge `product-manager` → `product-officer`

**Problem:** `product-manager.md` is in Tier 3 archive (moved in ITEM 4). Its remaining unique content should be absorbed into the active `product-officer.md`.

**Action:**

1. Read `.cursor/agents/archive/product-manager.md` and `.cursor/agents/product-officer.md`.

2. In `product-officer.md`, add a section **"Absorbed from product-manager"** with any unique capabilities, decision frameworks, or escalation protocols that exist in product-manager but not product-officer.

3. Do not duplicate content that already exists in product-officer.

4. Archive entry in `ARCHIVE_INDEX.md` already covers this (ITEM 4).

---

## ITEM 14 — [MERGE] Absorb `performance-engineer` → `a11y-performance-auditor`

**Problem:** `performance-engineer.md` is in Tier 3 archive (moved in ITEM 4). Performance audit scope belongs in `a11y-performance-auditor.md`.

**Action:**

1. Read `.cursor/agents/archive/performance-engineer.md` and `.cursor/agents/a11y-performance-auditor.md`.

2. In `a11y-performance-auditor.md`:
   - Add **"Performance Engineering Scope"** section with any performance-engineer capabilities not already covered (Core Web Vitals thresholds, bundle analysis, render profiling, memory leak detection protocols)
   - Update the agent's `@skill Dependencies` to include any skills performance-engineer referenced that are not already listed

3. Update AGENT_REGISTRY.yaml: `a11y-performance-auditor.tier` → `1` if not already.

---

## ITEM 15 — [YAML] Extend EVAL Framework

**Problem:** EVAL framework covers Tier 1 only, quarterly (90-day) cycle. Tier 2 Security/QA/Data agents have no eval requirement. 90 days is too slow for a rapidly evolving workspace.

**Action:**

1. Edit `.cursor/agents/EVAL_FRAMEWORK.md`:

   **Change review cycle:**
   - Tier 1 agents: quarterly → **30-day** review cycle
   - Add: Tier 2 agents (Security, QA, Data leads minimum): **60-day** review cycle with 3-dimension eval (Accuracy, Scope, Evidence — skip Determinism for advisory roles)

   **Add Tier 2 mandatory eval list:**
   ```
   Tier 2 agents subject to 60-day EVAL (minimum):
   - lead-security-officer
   - lead-qa-architect
   - lead-analytics-architect
   - lead-database-architect
   - app-security-manager
   - auth-security-manager
   ```

   **Add demotion trigger for Tier 2:**
   ```
   Tier 2 demotion to Tier 3 (archive candidate):
   - Two consecutive eval cycles with score < 60%
   - Zero activations in 60-day window during active MODE C sprints
   ```

2. Update `.cursor/state/AGENT_REGISTRY.yaml` — add `eval_cycle_days` field to each agent entry: `30` for Tier 1, `60` for Tier 2 security/QA/data, `null` for others.

---

## ITEM 16 — [YAML] Build Mode Announcement at Session Start

**Problem:** The active build_mode (sdd/lean/tdd/api-first) is never surfaced at session start. Agents don't know which mode they're operating in.

**Action:**

1. Edit `.cursor/agents/swarm-leader.md` — in the **Session Start Protocol**, add after the state YAML reads:
   ```
   Build Mode Announcement (required at every session start):
   Read .cursor/state/onboarding.yaml:build_mode
   If empty: print "⚠️ BUILD MODE NOT SET. Run /start to configure."
   If set: print "🔧 Build Mode: <BUILD_MODE> | Tone: <TONE> | PRD: <prd_locked> | Design: <design_locked>"
   ```

2. Add build_mode behavior summary to swarm-leader.md in a **Build Mode Behavior Matrix** section:
   ```
   | Mode | Gate strictness | Agent depth | Phase order |
   |---|---|---|---|
   | sdd | Full hardlocks, all gates mandatory | Full 4-tier routing | Strict SDD order |
   | lean | Soft gates only, skip non-critical | MODE A preferred | Compressed phases |
   | tdd | Tests required before implementation | QA swarm elevated | TDD-first ordering |
   | api-first | API spec before any UI work | Backend swarm first | API → Frontend |
   ```

---

## ITEM 17 — [YAML] CEO/CPO Escalation SLA

**Problem:** No SLA exists for escalating unresolved cross-swarm conflicts or blocked phases to PM-01 or CPO layer. Silent stalls have no auto-escalation.

**Action:**

1. Edit `.cursor/agents/subagent-controller.md` — in the **Escalation Tiers** section, add after tier 4:
   ```
   ## Auto-Escalation SLA

   If a routing decision remains in `replan` status for 2 consecutive agent sessions without resolution:
   - Auto-escalate to PM-01 (`swarm-leader`) with status: `SLA_BREACH`
   - Include: blocker description, sessions elapsed, last attempted resolution, recommended unblock action
   - PM-01 must make a `go` / `no-go` / `scope-change` decision before any further routing is attempted

   If PM-01 cannot resolve within 1 additional session:
   - Escalate to CPO layer with `EXEC_ESCALATION` flag
   - Log escalation in `docs/workspace/context/MEMORY.md` with timestamp
   ```

2. Edit `.cursor/agents/deputy-swarm-leader.md` — add a **Stall Detection** section that monitors for replan status across sessions.

---

## ITEM 18 — [YAML] Add S8 Analytics Skills

**Problem:** Swarm 8 (Analytics & Dashboard) has a lead agent but no dedicated skills for event schema, funnel analysis, retention, or growth analytics.

**Action:**

Create the following 4 skill files under `.cursor/skills/system/analytics/`:

**1. `event-schema/SKILL.md`**
```yaml
---
skill: nezam-analytics-event-schema
version: 1.0.0
scope: [analytics, typescript, json]
swarm: S8
---
```
Content: Event naming conventions (object_action pattern), required properties (user_id, session_id, timestamp, platform), schema validation approach, taxonomy governance, versioning strategy.

**2. `funnel-analysis/SKILL.md`**
```yaml
---
skill: nezam-analytics-funnel
version: 1.0.0
scope: [analytics, sql, dashboard]
swarm: S8
---
```
Content: Conversion funnel definition, step sequencing, drop-off identification, cohort segmentation, funnel query patterns for PostgreSQL/Neon.

**3. `retention-analysis/SKILL.md`**
```yaml
---
skill: nezam-analytics-retention
version: 1.0.0
scope: [analytics, sql, dashboard]
swarm: S8
---
```
Content: Day-N retention definitions, rolling retention windows, churn cohort analysis, re-engagement triggers, retention SQL patterns.

**4. `growth-dashboard/SKILL.md`**
```yaml
---
skill: nezam-analytics-growth
version: 1.0.0
scope: [analytics, dashboard, reporting]
swarm: S8
---
```
Content: North Star metric definition, leading vs lagging indicators, growth accounting (new/retained/resurrected/churned), KPI reporting cadence, dashboard layout standards.

After creating all 4, add `@nezam-analytics-event-schema`, `@nezam-analytics-funnel`, `@nezam-analytics-retention`, `@nezam-analytics-growth` to `lead-analytics-architect.md` `@skill Dependencies`.

---

## ITEM 19 — [MERGE] Remove Legacy Hardlock from workspace-orchestration

**Problem:** `.cursor/rules/workspace-orchestration.mdc` contains a legacy hardlock section marked "preserved for historical reference" that contradicts the active hardlock logic in `sdd-pipeline-v2.mdc`. Loading both creates conflicting gate truth.

**Action:**

1. Read `.cursor/rules/workspace-orchestration.mdc` in full.

2. Locate the legacy hardlock section (identified by the "historical reference" comment).

3. Delete that entire section from the file. Do not replace with anything — `sdd-pipeline-v2.mdc` is the authoritative gate source.

4. Add a single comment at the top of the hardlock-adjacent section:
   ```
   <!-- Hardlock gates are defined exclusively in sdd-pipeline-v2.mdc. Do not duplicate here. -->
   ```

5. Run `pnpm ai:check` to confirm no other rule references the deleted section.

---

## ITEM 20 — [CLEANUP] Resolve .nezam/workspace/RF/ Dead Reference Tree

**Problem:** `.nezam/workspace/RF/` contains ~100+ vendor skill references (Vercel, Trigger.dev, WordPress, Tinybird, etc.) that are disconnected from the active `.cursor/skills/` tree. They are never loaded by any agent and cause confusion about what's actually active.

**Action:**

**Option A (recommended if RF content is outdated):**
1. Move `.nezam/workspace/RF/` to `.nezam/workspace/archive/RF-<date>/`
2. Create `.nezam/workspace/archive/RF-<date>/README.md`:
   ```markdown
   # Archived RF (Reference) Skill Tree

   Archived: 2026-05-12
   Reason: Disconnected from active .cursor/skills/ tree. Not loaded by any agent.
   
   To restore a skill: migrate content to .cursor/skills/<domain>/<skill>/SKILL.md with proper frontmatter, then run pnpm ai:sync.
   ```

**Option B (if RF content is still valuable):**
1. Audit each RF skill: check if a corresponding active skill exists in `.cursor/skills/`
2. For skills with no active counterpart: migrate to `.cursor/skills/external/<vendor>/SKILL.md`
3. For skills with active counterparts: merge unique content and delete RF copy

**Recommendation:** Execute Option A first (zero risk, immediate cleanup). Schedule Option B as a separate task if specific RF skills are needed.

---

## Post-Execution Checklist

After all 20 items are complete:

```bash
pnpm ai:sync         # propagate all .cursor/ changes to tool mirrors
pnpm ai:check        # verify no drift between canonical and mirrors
pnpm check:all       # run full check suite (tokens + specs + agent-bus + skills registry)
```

Then verify:
- [ ] `.cursor/agents/archive/` directory exists with 19 files + ARCHIVE_INDEX.md
- [ ] `.cursor/rules/` contains `design-gates.mdc` (unified) — old 3 gate files deleted
- [ ] `.cursor/skills/design/design-token-system/SKILL.md` exists — old 3 token skill dirs deleted
- [ ] `.cursor/state/skills-registry.json` exists and has zero orphaned skills
- [ ] `docs/reports/` directory has at least one swarm-cost report template
- [ ] `pnpm ai:check` exits with code 0
- [ ] `pnpm check:all` exits with code 0

---

*Generated by NEZAM workspace audit — 2026-05-12. All file paths confirmed against live workspace state.*
