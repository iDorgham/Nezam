# NEZAM — Phase 2 Enhancement Prompt
## Remove /founder · Upgrade /guide · Enhance agents/skills/gates · Refine response style

**For:** Cursor (primary) or Claude Code  
**Run after:** ONBOARDING_SYSTEM_PROMPT.md has been fully implemented  
**Prereq files this prompt modifies:**  
`.cursor/commands/founder.md` · `.cursor/commands/guide.md` · `.cursor/commands/check.md`  
`.cursor/agents/swarm-leader.md` · `.cursor/agents/subagent-controller.md`  
`.cursor/rules/workspace-orchestration.mdc` · `.cursor/rules/design-dev-gates.mdc`  
`.cursor/skills/system/` · `.cursor/skills/design/wireframe-catalog/`  
`.cursor/state/onboarding.yaml` · `.cursor/state/develop_phases.yaml`

---

## Context for the AI

You are working inside the NEZAM workspace — a Specification-Driven Development (SDD) governance system.
The previous implementation prompt already:
- Redesigned `/start` into a full onboarding flow (PRD creation + design selection)
- Added hardlock gates linking `/start` → `/plan` → `/develop`
- Created `.cursor/state/onboarding.yaml`, `plan_progress.yaml`, `develop_phases.yaml`
- Set up sequential phase unlocks in `/develop`

**This prompt handles the next layer:** cleaning up redundant commands, upgrading the intelligence
of `/guide`, reinforcing agents and skills, tightening the hardlock rule layer, and defining a
consistent response style that works for beginners.

**Do NOT touch:** `.nezam/workspace/`, `.nezam/design/` profiles, any file under `.cursor/skills/backend/`,
`.cursor/skills/frontend/`, `.cursor/skills/infrastructure/` unless explicitly listed below.

---

## TASK 1 — Remove /founder command (absorbed by /start)

### 1A. Delete the command file

```bash
rm .cursor/commands/founder.md
```

### 1B. Remove /founder from every mirror client

```bash
rm -f .claude/commands/founder.md
rm -f .gemini/commands/founder.md
rm -f .opencode/commands/founder.md
rm -f .codex/commands/founder.md
rm -f .antigravity/commands/founder.md
rm -f .kilocode/commands/founder.md
rm -f .qwen/commands/founder.md
```

### 1C. Update CLAUDE.md synced command index

In `CLAUDE.md`, find the `## Synced command index` section.
Remove `founder.md` from the list. Do not change anything else.

### 1D. Update workspace-orchestration.mdc

Find any reference to `/FOUNDER` or `founder.md` in `.cursor/rules/workspace-orchestration.mdc`.
Replace with `/start` in each occurrence. Example:
- "route the user to `/FOUNDER idea`" → "route the user to `/start`"
- "/FOUNDER status" → "/start gates"

### 1E. Migrate FOUNDER_MODE into onboarding state

`/FOUNDER` had a solo/team mode toggle. Absorb this into `.cursor/state/onboarding.yaml`.

Add these fields to the file:

```yaml
# User mode — set during /start onboarding
user_mode: ""           # "solo" | "team"
user_mode_set_at: ""

# Tone preference derived from user_mode
# solo  → friendly, plain language, opinionated defaults
# team  → structured, governance-aware, full agent assignment
tone: ""                # "friendly" | "structured"
```

During the `/start` onboarding flow (Step 2, before the PRD menu), add this question FIRST:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEZAM — Welcome. Let's set you up.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Are you building this solo or with a team?

  [S] Solo / Indie builder
      Just you (or you + AI). Plain language,
      fast setup, opinionated defaults.

  [T] Team / Professional
      Structured governance, full agent assignment,
      formal documentation, parallel work streams.

Type S or T:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Save choice to `onboarding.yaml` → `user_mode` and `tone`.
All subsequent responses in the session adapt to this mode (see Task 5 — Response Style).

---

## TASK 2 — Rewrite /guide as an Intelligent Project Navigator

**File:** `.cursor/commands/guide.md`  
**Replace the entire file** with the specification below.

### Philosophy

`/guide` is the user's co-pilot throughout the entire project lifecycle.
It always knows where the user is, what they should do next, and why.
It never gives vague suggestions. Every response ends with something
the user can act on in under 30 seconds — a slash command, a ready-to-paste
prompt, or a terminal command.

For beginners (solo mode), `/guide` explains concepts without jargon.
For teams (structured mode), it shows governance detail and agent assignments.

---

### /guide Command Specification

```
/guide                → defaults to /guide status
/guide status         → full pipeline status: done / active / blocked / next
/guide next           → single recommended next action only
/guide phase          → deep dive on the current active phase
/guide full           → complete project health across all phases
/guide explain        → zero-jargon plain English summary
/guide help           → usage reference
/guide prompt         → generate a ready-to-use prompt for the next step
/guide terminal       → generate the next terminal command to run
```

Aliases: `/guide` → `/guide status`

---

### /guide status — Full Pipeline Status

Read these files before responding (in order):
1. `.cursor/state/onboarding.yaml` — check prd_locked, design_locked, planning_complete, user_mode
2. `.cursor/state/plan_progress.yaml` — which plan phases are done
3. `.cursor/state/develop_phases.yaml` — which dev phases are done/locked
4. `.cursor/state/agent-status.yaml` — last active agent and output (if exists)
5. `docs/prd/PRD.md` — detect product name and type
6. `DESIGN.md` — detect design profile

Output in this exact order:

#### Section 0 — Session Resume Card (only if agent-status.yaml has active content)

```
┌─────────────────────────────────────────────────┐
│  📍 Resuming: [agent] on [active task]          │
│  📦 Last output: [summary] — [status]           │
│  🔄 Handoff pending: [from] → [to]              │
│  ❌ Blockers: [list or "none"]                  │
└─────────────────────────────────────────────────┘
```

If no active session → skip this section entirely.

#### Section 1 — Pipeline Progress Bar

Show the full pipeline as a single bar with named segments:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Project: [product name from PRD]
  Mode: [Solo / Team]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Pipeline  ████████░░░░░░░░░░░░░░░░  3/8 phases
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ 1 · Onboarding    ✅ 2 · Planning    ⚡ 3 · Build
  🔒 4 · Polish        🔒 5 · Harden      🔒 6 · Ship
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Legend: ✅ complete · ⚡ active · 🔒 locked · ○ not started

#### Section 2 — Where You Are (2 sentences max)

- Sentence 1: plain English — what stage you're in
- Sentence 2: what you need to do to advance

Solo mode: "You're in the planning phase — mapping out your app's pages and structure."
Team mode: "Active phase: 01-Research. SEO_RESEARCH.md is pending. Gate requires keyword
            cluster completion before IA phase can begin."

#### Section 3 — Active Phase Detail

```
┌─────────────────────────────────────────────────┐
│  Phase: [name]                                  │
│  Progress: ████████░░░░  4 of 6 steps done      │
│                                                 │
│  ✅ Step 1: [done]                              │
│  ✅ Step 2: [done]                              │
│  ✅ Step 3: [done]                              │
│  ✅ Step 4: [done]                              │
│  ⏳ Step 5: [in progress or pending]           │
│  🔒 Step 6: [locked until step 5 done]          │
└─────────────────────────────────────────────────┘
```

#### Section 4 — Blockers (only if any exist)

```
❌ [plain English description of what's missing]
   Why it matters: [one sentence]
   Fix:
```

Then show the fix in the appropriate fenced block (see Response Style section below).
If no blockers → show: `✅ No blockers — ready to proceed.`

#### Section 5 — Next Action (always last, always actionable)

This is the most important section. Make it impossible to miss.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▶  YOUR NEXT STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [What this does in one plain sentence]
```

Then show either a prompt block, terminal block, or slash command — see Response Style rules below.

---

### /guide next — Single Action Mode

Read state files → determine the single best next action → output ONLY:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Phase [X/8] · [Phase Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [One plain sentence — what this action does and why now]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then show the action in the correct fenced block (see Response Style below).
Nothing else. No explanation. No headers. No extra content.

---

### /guide phase — Active Phase Deep Dive

Show:
1. Phase name and goal (one sentence)
2. Required artifacts — what must exist when this phase is done
3. Each artifact status: ✅ exists and complete · ⚠️ exists but incomplete · ❌ missing
4. Steps to complete this phase (numbered, each step shows exact command)
5. What unlocks when this phase completes
6. Next action block (same format as `/guide next`)

---

### /guide full — Complete Project Health

Everything from `/guide status` PLUS a full phases table:

```
┌──────────────┬──────────┬──────────────┬───────────────────────┐
│ Phase        │ Status   │ Artifacts    │ Next Action           │
├──────────────┼──────────┼──────────────┼───────────────────────┤
│ 1 Onboarding │ ✅ Done  │ PRD + DESIGN │ —                     │
│ 2 Planning   │ ⚡ Active│ 3/6 done     │ /plan arch            │
│ 3 Build P1   │ 🔒 Locked│ 0/4 done     │ Complete planning     │
│ 4 Build P2   │ 🔒 Locked│ —            │ Complete Phase 1      │
│ 5 Build P3   │ 🔒 Locked│ —            │ Complete Phase 2      │
│ 6 Polish     │ 🔒 Locked│ —            │ Complete Phase 3      │
│ 7 Harden     │ 🔒 Locked│ —            │ Complete Polish       │
│ 8 Ship       │ 🔒 Locked│ —            │ Complete Hardening    │
└──────────────┴──────────┴──────────────┴───────────────────────┘
```

If MASTER_TASKS.md exists, also show:
- Open tasks count by phase
- Blocked tasks with reason

---

### /guide explain — Zero Jargon Mode

Translate everything to plain English. Rules:
- No file paths shown (say "your requirements doc" not "docs/prd/PRD.md")
- No gate names, hardlock, SDD, artifact, subphase, prompt artifact
- No agent names or internal routing
- No version numbers

Format:
```
  Where you are:   [plain sentence]
  What's done:     [bullet list]
  What's next:     [one sentence + action]
  What's blocking: [plain sentence + fix]
```

---

### /guide prompt — Generate Next Step Prompt

Read state → determine what the user needs to do next → generate a complete,
ready-to-use prompt they can paste into Cursor, Claude, or any AI tool.

The prompt must:
- Be self-contained (include all context needed — project name, phase, goal)
- Have no placeholders — fill everything from state files
- Include exact file paths the AI should write to
- State what a good output looks like
- End with acceptance criteria

Show it as a PROMPT block (see Response Style below).

---

### /guide terminal — Generate Next Terminal Command

Read state → determine the next terminal action → output the exact command.
Show it as a TERMINAL block (see Response Style below).
Include a one-sentence explanation of what it does.

---

## TASK 3 — Upgrade Agents

### 3A. Update swarm-leader.md

**File:** `.cursor/agents/swarm-leader.md`

Replace the `## Session Start Protocol` section with:

```markdown
## Session Start Protocol

At session start:
1. Read `docs/gates/workspace.paths.yaml` → resolve all paths
2. Read `.cursor/state/onboarding.yaml`:
   - If prd_locked: false → route user to `/start` immediately
   - If design_locked: false → route user to `/start` (design step)
   - If planning_complete: false → tell user to run `/plan [next incomplete phase]`
   - If planning_complete: true → check develop_phases.yaml for current unlock
3. Read `.cursor/state/agent-status.yaml` → resume any pending handoffs
4. Read `docs/prd/PRD.md` → load product context (name, type, users, revenue)
5. Adapt tone based on `onboarding.yaml` → `tone`:
   - "friendly" → plain language, no jargon, explain decisions simply
   - "structured" → governance-aware, show agent assignments and gate IDs
6. Announce session context in a brief card (2–4 lines max)

## Gate Enforcement (every command)

Before routing ANY command to any agent:
1. Read `.cursor/state/onboarding.yaml`
2. Check which hardlock applies to the requested command:
   - `/plan` → requires prd_locked: true AND design_locked: true
   - `/develop` → requires planning_complete: true
   - `/deploy` → requires develop_phases.phase_5.status == "complete"
3. If gate fails → output exact gate failure message (format below) → STOP
4. Never partially execute a command that fails a gate check

## Gate Failure Message Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔒  [COMMAND] IS LOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Missing: [plain English — what is not yet done]
  Why it matters: [one sentence]

  ▶  To unlock, run:
[show the fix as a slash command, prompt, or terminal block]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Routing Logic (updated)

| User says / types              | Route to                          |
|-------------------------------|-----------------------------------|
| /start                        | Start onboarding flow directly    |
| /plan [any subcommand]        | Check onboarding gate → plan.md   |
| /develop [any subcommand]     | Check planning gate → develop.md  |
| /guide [any subcommand]       | guide.md (always available)       |
| /check [any subcommand]       | check.md (always available)       |
| /nezam [any subcommand]       | nezam.md (workspace management)   |
| /deploy                       | Check hardening gate → deploy.md  |
| /fix                          | fix.md (always available)         |
| /scan                         | scan.md (always available)        |
| Anything vague or unclear     | → /guide status first             |
| Anything about founder/FOUNDER| → "Use /start instead"            |
```

### 3B. Update subagent-controller.md

**File:** `.cursor/agents/subagent-controller.md`

Add this section after `## Core Principles`:

```markdown
## State-Aware Routing Protocol

Before assigning any task to a swarm:
1. Read `.cursor/state/develop_phases.yaml`
2. Identify which phase is currently "in_progress" or "unlocked"
3. ONLY assign tasks that belong to the active phase
4. For any task belonging to a locked phase:
   - Do NOT assign it to a swarm
   - Log it to the task backlog with status: PHASE_LOCKED
   - Tell the requesting agent: "Phase [N] is locked. Complete Phase [N-1] first."
5. When a phase completes (all tasks done + testing_passed: true):
   - Update develop_phases.yaml for that phase: status → "complete"
   - Set next phase: status → "unlocked"
   - Announce unlock to the swarm

## Task Assignment Format

Every task assigned to a swarm must include:

```yaml
task_id: "[phase]-[sequence]-[slug]"
phase: "phase_[N]"
phase_status: "[unlocked|in_progress]"
assigned_swarm: "[swarm name]"
assigned_lead: "[lead agent name]"
write_scope: ["list of allowed file paths/globs"]
acceptance_criteria:
  - "[measurable criterion 1]"
  - "[measurable criterion 2]"
depends_on: "[task_id or null]"
gate_check_command: "[command to verify completion]"
```

## Phase Completion Verification

A phase is ONLY complete when ALL of:
1. All tasks in that phase have status: done in MASTER_TASKS.md
2. All acceptance criteria verified (not just "I think it's done")
3. Tests written and passing (check docs/reports/tests/)
4. `/check output` score ≥ 70% for the last artifact
5. No TODO or FIXME in any file written in this phase
6. DESIGN.md compliance: zero hardcoded values in any file
7. a11y gate: WCAG 2.2 AA passes on all new UI
8. Agent sets develop_phases.[phase].testing_passed: true
```

---

## TASK 4 — Upgrade Skills

### 4A. Upgrade wireframe-catalog skill

**File:** `.cursor/skills/design/wireframe-catalog/SKILL.md`
**Action:** If the file exists, add the following sections. If it doesn't exist, create it with this content.

```markdown
# Wireframe Catalog Skill

## Purpose

Generate precise, high-fidelity ASCII wireframes that serve as implementation contracts.
Not sketches — spatial specifications that developers can build from directly.

## Quality Standard

Every wireframe produced by this skill must include:

1. Grid structure — column count, named zones (sidebar/content/aside)
2. Component slots — every UI piece named with variant
3. Content hierarchy — H1/H2/H3/body/caption zones labeled
4. All interaction states — default, hover, focus, active, loading, empty, error
5. Spacing annotations — named tokens (xs/sm/md/lg/xl), not px values
6. Responsive pair — desktop (1440px) + mobile (390px) always
7. Navigation context — where in user flow, breadcrumb
8. Accessibility map — tab order, landmarks, ARIA roles

## Output Format

For each screen, produce in this exact structure:

```
╔══════════════════════════════════════════════════════════════════╗
║  SCREEN: [Name]              ID: [screen_id]                    ║
║  Route: [url path]           Type: [auth/public/admin]          ║
║  User: [who sees this]       Flow: [step N of N]                ║
╚══════════════════════════════════════════════════════════════════╝

─── DESKTOP — 12 col · 1440px ────────────────────────────────────

┌──────────────────────────────────────────────────────────────────┐
│ NAVIGATION [col 1–12]                              gap: none     │
│ ┌──────────┐ ┌─────────────────────────┐ ┌────────────────────┐ │
│ │ Logo     │ │ Home · About · Pricing  │ │ Login  [Sign Up ▶] │ │
│ │ [brand]  │ │ gap: lg between items   │ │                    │ │
│ └──────────┘ └─────────────────────────┘ └────────────────────┘ │
│ col: 2       col: 6                       col: 4                │
│ State: default / scrolled (shadow + bg-surface)                  │
│ Mobile: hamburger menu [≡], drawer slides from right             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ HERO [col 1–12]                            padding: xl top/bottom│
│ ┌────────────────────────────┐ ┌─────────────────────────────┐  │
│ │ [BADGE] New — v2 launch    │ │                             │  │
│ │                            │ │   [Illustration / Video]    │  │
│ │ H1: [Main headline text]   │ │   ratio: 16:9               │  │
│ │ max-width: 560px           │ │   bg: gradient-subtle       │  │
│ │                            │ │                             │  │
│ │ Body: [Supporting text]    │ │   Loading state:            │  │
│ │ max-width: 480px           │ │   → skeleton rect           │  │
│ │ color: text-muted          │ │                             │  │
│ │                            │ └─────────────────────────────┘  │
│ │ [Primary CTA  →]  [Demo]   │ col: 5                           │
│ │ gap: sm between CTAs       │                                  │
│ └────────────────────────────┘                                  │
│ col: 7                                                           │
│ States: default · hover-cta (scale 1.02) · loading (skeleton)   │
└──────────────────────────────────────────────────────────────────┘

─── MOBILE — 4 col · 390px ───────────────────────────────────────

[Reflow to single column — show nav → badge → H1 → body → CTA → image]
[Image moves below CTA on mobile]
[CTA becomes full-width button]

─── STATES ───────────────────────────────────────────────────────

  Default:  [as wireframe above]
  Loading:  Nav intact · Hero: skeleton (title/body/cta blocks) · Image: shimmer
  Empty:    N/A for landing
  Error:    Toast notification: "[Error description]" · Retry link

─── COMPONENT INVENTORY ──────────────────────────────────────────

  NavBar         variant: transparent · scrolled: solid + shadow
  Badge          variant: info · size: sm
  Heading        level: h1 · size: display-lg · weight: bold
  BodyText       size: body-lg · color: text-muted
  CTAButton      variant: primary · size: lg · icon: arrow-right
  CTAButton      variant: ghost · size: lg
  HeroMedia      type: illustration · loading: skeleton

─── ACCESSIBILITY ────────────────────────────────────────────────

  Landmarks:   <header> nav · <main> · <section aria-label="Hero">
  Tab order:   Logo → Nav links → Login → Sign Up → Hero CTA → Demo
  Focus rings: 2px solid · color: primary-500 · offset: 2px
  Heading:     H1 is first and unique on page
  Images:      descriptive alt · decorative → alt=""
  Motion:      hero animation respects prefers-reduced-motion
```

## Element Sequence by Product Type

Present elements ONE AT A TIME. User picks variant before next element appears.

### Website / Landing Page
1. Navigation / Header (3 variants: centered logo / left logo + nav / transparent hero-overlap)
2. Hero / Above-fold (3 variants: split / centered / full-bleed)
3. Feature Grid (3 variants: 3-col icons / alternating / bento)
4. Social Proof (3 variants: logo row / testimonial cards / metrics bar)
5. Pricing (3 variants: 2-tier / 3-tier / usage-based)
6. CTA Section (3 variants: centered / split / sticky-bar)
7. Footer (3 variants: 4-col / minimal / with newsletter)

### Web App / SaaS
1. App Shell (3 variants: top nav / sidebar / hybrid)
2. Dashboard Layout (3 variants: metric cards / data tables / activity feed)
3. Data Table / List (3 variants: full table / card list / kanban)
4. Detail / Edit View (3 variants: side panel / full page / modal)
5. Empty States (show 3 types: first-use / no-results / error)
6. Onboarding Flow (3 variants: checklist / wizard / interactive tour)
7. Settings Page (3 variants: vertical tabs / horizontal / sections)
8. Modal / Drawer (3 variants: centered modal / right drawer / bottom sheet)

### Mobile App
1. Navigation Pattern (3 variants: bottom tab / top tab / gesture-drawer)
2. Home Screen (3 variants: feed / dashboard / map)
3. List / Feed (3 variants: cards / rows / story)
4. Detail Screen (3 variants: hero image / info card / split)
5. Onboarding (3 variants: swipe cards / illustration / progress bar)
6. Profile / Settings (3 variants: header card / sections list / edit inline)

## Output Files (after all selections made)

1. `docs/plans/04-design/DESIGN_CHOICES.yaml` — locked YAML of every selection
2. Updated root `DESIGN.md` — full token contract + component specs
3. `docs/core/required/sdd/WIREFRAMES.md` — all screens with full wireframes
4. `docs/plans/04-design/COMPONENT_INVENTORY.md` — every component, variant, state
```

### 4B. Create new skill: `sdd-gate-validator`

**File:** `.cursor/skills/system/sdd-gate-validator/SKILL.md`
**Action:** Create this file.

```markdown
# SDD Gate Validator Skill

## Purpose

Validate that all hardlock prerequisites are met before a phase transition.
Called by swarm-leader and subagent-controller before every gate crossing.

## Gate Definitions

### Gate 0 → 1: Onboarding → Planning

All must be true:
- [ ] `docs/prd/PRD.md` exists and has >10 non-comment lines
- [ ] `DESIGN.md` exists at repo root and is not a blank template
- [ ] `.cursor/state/onboarding.yaml` → `prd_locked: true`
- [ ] `.cursor/state/onboarding.yaml` → `design_locked: true`

### Gate 1 → 2: Planning → Development

All must be true:
- [ ] `.cursor/state/plan_progress.yaml` → `planning_complete: true`
- [ ] All 6 plan phases have their output artifact:
  - `seo: true` → `docs/plans/01-research/SEO_RESEARCH.md` exists
  - `ia: true` → `docs/plans/02-ia/IA_CONTENT.md` exists
  - `content: true` → `docs/plans/03-content/CONTENT_MAP.md` exists
  - `arch: true` → `docs/plans/04-arch/ARCHITECTURE.md` exists
  - `design_wireframes: true` → `docs/plans/04-design/DESIGN_CHOICES.yaml` + `docs/core/required/sdd/WIREFRAMES.md` exist
  - `scaffold: true` → `docs/plans/scaffold/PROJECT_SCAFFOLD.md` + `scripts/scaffold.sh` exist

### Gate N → N+1: Development Phase Transitions

All must be true for phase_N to be marked complete:
- [ ] All tasks in MASTER_TASKS.md tagged [phase_N] have status: done
- [ ] `/check output` returns score ≥ 70%
- [ ] `docs/reports/tests/` has at least one test report for this phase
- [ ] No TODO / FIXME in any file written in this phase
- [ ] Zero hardcoded design values (px literals, hex colors outside token files)
- [ ] WCAG 2.2 AA passes on all new UI surfaces
- [ ] `.cursor/state/develop_phases.yaml` → `phase_N.testing_passed: true`

### Gate 5 → 6: Hardening → Ship

All must be true:
- [ ] `docs/reports/security/SECURITY_AUDIT.md` exists and passes
- [ ] `docs/reports/perf/LIGHTHOUSE_REPORT.md` shows LCP <2.5s, CLS <0.1, INP <200ms
- [ ] `docs/reports/a11y/A11Y_AUDIT.md` passes WCAG 2.2 AA
- [ ] `docs/reports/tests/COVERAGE_REPORT.md` shows ≥80% on critical paths

## Validator Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Gate Check: [Gate Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ [requirement met]
  ✅ [requirement met]
  ❌ [requirement not met] → [exact fix command]
  ⚠️  [partial] → [what's missing]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Result: PASS / FAIL
  [If FAIL]: Cannot proceed. Fix the ❌ items above.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
```

### 4C. Create new skill: `progress-narrator`

**File:** `.cursor/skills/system/progress-narrator/SKILL.md`
**Action:** Create this file.

```markdown
# Progress Narrator Skill

## Purpose

Generate human-readable progress summaries for /guide and /check commands.
Reads state files and translates them into encouraging, clear, actionable narratives.
Adapts language based on user_mode (solo/team) from onboarding.yaml.

## Inputs

- `.cursor/state/onboarding.yaml`
- `.cursor/state/plan_progress.yaml`
- `.cursor/state/develop_phases.yaml`
- `docs/prd/PRD.md` (for product name and type)

## Output Rules

### Solo / Friendly mode
- Use plain English, avoid technical terms
- When things are blocked: "Before you can [goal], you need to [simple action]"
- Celebrate milestones: "🎉 Planning is complete — time to start building!"
- When a phase unlocks: explain what they're about to work on in product terms

### Team / Structured mode
- Use precise terminology: gate, phase, artifact, SPEC.md, hardlock
- Show agent assignments alongside tasks
- Show gate IDs (G0→G1, G1→G2 etc.) in phase transitions
- Swarm status footer on every substantive reply

## Milestone Messages

### PRD Locked
Solo: "Your product brief is saved. Now let's pick a design direction."
Team: "PRD locked at docs/prd/PRD.md. Gate G0 prerequisite satisfied. Proceed to design selection."

### Design Locked
Solo: "Design is set. Ready to plan your [product name]."
Team: "DESIGN.md locked. Gate G0 complete. /plan is now available."

### Planning Complete
Solo: "🎉 Your full plan is ready. Time to start building Phase 1: [Foundation]."
Team: "Planning complete. Gate G1 satisfied. Phase 1 (Foundation) unlocked. /develop start available."

### Phase N Unlocked
Solo: "Phase [N] complete ✅ Next: [Phase N+1 name in plain terms — what you'll be building]"
Team: "Phase [N] testing passed. Gate G[N] satisfied. Phase [N+1] ([name]) unlocked."

### Ship Gate Open
Solo: "🚀 Everything passes. You're ready to launch."
Team: "Gate G5 satisfied. All harden audits pass. /deploy available."
```

---

## TASK 5 — Response Style System

Add this to `.cursor/rules/workspace-orchestration.mdc` as a new section titled `## Response Style System`.

```markdown
## Response Style System

All agent and command responses must follow this style contract.
Read `tone` from `.cursor/state/onboarding.yaml` at session start.

### Visual Structure

Use `━` borders for section dividers (not `---` or `===`).
Use `┌┐└┘│` box characters for cards and status panels.
Use emoji sparingly: ✅ ❌ ⚠️ 🔒 ⚡ ▶ only — no decorative emoji.

### The Three Action Block Types

Every response that suggests an action MUST use one of these three fenced blocks.

**Block Type 1: PROMPT**
Use when the next step is something to paste into an AI tool (Cursor, Claude, Codex, etc.)

````markdown
**PROMPT** — [one sentence: what this prompt does]

```prompt
[Complete, self-contained prompt. No placeholders. All context filled in.
Include: what the AI should do, what files to read/write, what a good
output looks like, and acceptance criteria. Ready to paste immediately.]
```
````

**Block Type 2: TERMINAL**
Use when the next step is a shell command.

````markdown
**TERMINAL** — [one sentence: what this command does]

```bash
[exact command — no placeholders]
```
````

**Block Type 3: SLASH COMMAND**
Use when the next step is a NEZAM slash command.

````markdown
**COMMAND** — [one sentence: what this does]

```
/plan arch
```
````

### When to Use Each Block Type

| Situation | Block Type |
|-----------|-----------|
| Next step is AI generation work | PROMPT |
| Next step is running a script | TERMINAL |
| Next step is a NEZAM command | SLASH COMMAND |
| Next step involves multiple tools | Show primary block + note secondary |

### Tone by User Mode

**Solo / Friendly mode:**
- Short sentences. No jargon.
- Explain what a step does before showing the command.
- No file paths in main body — use natural language references.
- "Your PRD" not "docs/prd/PRD.md"
- "Pick your design" not "copy DESIGN profile"

**Team / Structured mode:**
- Precise terminology is fine.
- Show file paths, gate IDs, agent assignments.
- Swarm footer on every substantive reply.
- Governance-style — structured, audit-ready.

### Response Length

- `/guide next` → max 8 lines + one action block
- `/guide status` → max 40 lines total
- `/check output` → max 20 lines
- Phase unlock ceremonies → max 12 lines
- Gate failure messages → max 10 lines
- Never pad with filler. Every line earns its place.

### Recommendation Footer

Required on all substantive replies from any command. Format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  💡 /guide next — see your next step
  📋 /guide status — full project overview
  🔍 /check output — score last output
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
```

---

## TASK 6 — Update /check to use new gate validator

**File:** `.cursor/commands/check.md`

Add this section after the existing `/CHECK gates` section:

```markdown
## /CHECK gates — Updated Gate Check Order

Before running gate checks, read:
1. `.cursor/state/onboarding.yaml`
2. `.cursor/state/plan_progress.yaml`
3. `.cursor/state/develop_phases.yaml`

Run checks in this order using the `sdd-gate-validator` skill:

**Gate 0 (Onboarding → Planning):**
- PRD exists and non-template
- DESIGN.md exists and non-template
- onboarding.yaml: prd_locked: true AND design_locked: true

**Gate 1 (Planning → Development):**
- All plan_progress flags are true
- All 6 planning artifacts exist at expected paths

**Gate N (Phase N → Phase N+1):**
- All MASTER_TASKS.md tasks for phase N are done
- /check output passes (≥70%)
- Test report exists for phase N
- No TODOs in phase N files
- No hardcoded design values
- WCAG 2.2 AA passes

**Gate 5 (Hardening → Ship):**
- Security audit passes
- Lighthouse: LCP <2.5s, CLS <0.1, INP <200ms
- A11y audit passes WCAG 2.2 AA
- Test coverage ≥80% on critical paths

Show results using validator output format from `sdd-gate-validator` skill.
```

---

## TASK 7 — Update workspace-orchestration.mdc hardlock list

**File:** `.cursor/rules/workspace-orchestration.mdc`

Find the `## SDD hardlock prerequisites for development` section.
Replace the numbered list with this updated version that aligns with the new state files:

```markdown
## SDD hardlock prerequisites (updated — reads state files)

### Hardlock: /plan requires

Read `.cursor/state/onboarding.yaml` before any /plan subcommand:
1. `prd_locked: true` — docs/prd/PRD.md is filled in (not template)
2. `design_locked: true` — DESIGN.md exists and is not blank template

If either is false → block /plan → redirect to /start with specific reason.

### Hardlock: /develop requires

Read `.cursor/state/plan_progress.yaml`:
1. `planning_complete: true` — all 6 planning phases done
2. All artifact files exist at their expected paths (validate via sdd-gate-validator skill)
3. PROJECT_SCAFFOLD.md confirmed and scaffold.sh run

If any are false → block /develop → show plan progress status → tell user which phase to complete.

### Hardlock: phase N+1 requires phase N complete

Read `.cursor/state/develop_phases.yaml`:
1. Phase N must have `status: "complete"` AND `testing_passed: true`
2. Phase N+1 must have `status: "unlocked"` (not "locked")

If phase N is not complete → block work on phase N+1 → tell user to finish phase N.

### Hardlock: /deploy requires

1. `develop_phases.phase_5.status == "complete"` (Hardening phase done)
2. `develop_phases.phase_5.testing_passed: true`
3. Security audit exists: `docs/reports/security/SECURITY_AUDIT.md`
4. Lighthouse report passes all thresholds

### Non-bypass rule (unchanged)

Hardlocks block starting dependent forward work.
They do NOT block backward amendments (use decision amendment protocol).
The `/fix` command is always available and never hardlocked.
The `/guide` command is always available and never hardlocked.
The `/check` command is always available and never hardlocked.
The `/nezam` command is always available and never hardlocked.
```

---

## TASK 8 — Sync all changes to mirror clients

After implementing all tasks above, run:

```bash
pnpm ai:sync
pnpm ai:check
```

If `pnpm` scripts don't exist, manually copy these files to each mirror client:

```bash
# Files to copy to .claude/commands/, .gemini/commands/, .opencode/commands/, etc.
cp .cursor/commands/guide.md .claude/commands/guide.md
cp .cursor/commands/check.md .claude/commands/check.md
cp .cursor/commands/start.md .claude/commands/start.md

# Remove founder from mirrors (already done in Task 1B)
# Verify:
ls .claude/commands/ | grep founder  # should return nothing
```

---

## Implementation Order

Execute tasks in this exact sequence. Do not start the next until the previous is verified.

| Step | Task | Verify |
|------|------|--------|
| 1 | Delete founder.md from all mirrors | `ls .cursor/commands/ | grep founder` returns empty |
| 2 | Add user_mode to onboarding.yaml | File has `user_mode: ""` and `tone: ""` fields |
| 3 | Rewrite guide.md | File has all 7 subcommands + response sections |
| 4 | Update swarm-leader.md | Has new Session Start Protocol + Gate Enforcement |
| 5 | Update subagent-controller.md | Has State-Aware Routing Protocol + Phase Completion Verification |
| 6 | Create sdd-gate-validator/SKILL.md | File exists with all 6 gate definitions |
| 7 | Create progress-narrator/SKILL.md | File exists with milestone messages |
| 8 | Upgrade wireframe-catalog/SKILL.md | Has updated format + element sequence tables |
| 9 | Add Response Style System to workspace-orchestration.mdc | Section exists with 3 block types |
| 10 | Update check.md with new gate order | Has all 6 gate checks using validator skill |
| 11 | Update workspace-orchestration.mdc hardlock list | References state files not raw file paths |
| 12 | Run pnpm ai:sync + pnpm ai:check | Output shows ✓ in sync for all clients |

---

## Validation Checklist

After implementation, test these scenarios:

**founder removed:**
- [ ] `/founder` in Cursor shows "unknown command" or routes to `/start`
- [ ] No reference to FOUNDER_MODE.md in active commands

**user_mode:**
- [ ] `/start` asks S or T before PRD menu
- [ ] Choosing S makes all subsequent responses plain English
- [ ] Choosing T shows governance detail and agent assignments

**guide:**
- [ ] `/guide` shows pipeline bar with correct segment states
- [ ] `/guide next` shows ONE action in correct block type, nothing else
- [ ] `/guide explain` shows zero file paths or internal terms
- [ ] `/guide prompt` generates complete, paste-ready prompt
- [ ] `/guide terminal` generates exact bash command

**gate enforcement:**
- [ ] `/plan` before PRD locked → gate failure message with fix
- [ ] `/develop` during planning → shows plan progress + next plan command
- [ ] Attempt Phase 3 work in Phase 1 → blocked with clear unlock path
- [ ] `/deploy` before hardening complete → blocked with specific reason

**response style:**
- [ ] All action suggestions use PROMPT / TERMINAL / COMMAND blocks
- [ ] Recommendation footer appears on every substantive reply
- [ ] Solo mode responses have no file paths or jargon
- [ ] Team mode shows agent names and gate IDs

**skills:**
- [ ] sdd-gate-validator SKILL.md exists with all 6 gate definitions
- [ ] progress-narrator SKILL.md exists with solo/team message variants
- [ ] wireframe-catalog SKILL.md shows updated high-fidelity format

---

## What NOT to change in this implementation

- Any file inside `.nezam/design/` (100+ design profiles — do not touch)
- `.cursor/skills/backend/` — all backend skills unchanged
- `.cursor/skills/frontend/react-architecture/` — unchanged
- `.cursor/skills/infrastructure/` — unchanged
- `.nezam/workspace/` — workspace governance docs — read only
- `docs/prd/PRD.md` — user's project file — do not reset
- `DESIGN.md` at repo root — user's chosen design — do not reset
- `.cursor/state/develop_phases.yaml` — do not reset if phases already in progress
