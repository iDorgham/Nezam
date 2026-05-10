# NEZAM v2 — Full Upgrade Prompt for Cursor IDE
<!-- Save this file. Paste the prompt blocks into Cursor as directed. -->
<!-- Source of truth: this file. Run `pnpm ai:sync` after editing .cursor/ files. -->

---

## HOW TO USE THIS FILE

Each section below is a self-contained prompt block.
- Blocks marked **[PASTE INTO CURSOR CHAT]** → open Cursor, press `Cmd+L`, paste.
- Blocks marked **[SAVE AS FILE]** → create/replace the file shown in the heading.
- Blocks marked **[TERMINAL]** → run in your project root terminal.

Apply them **in order**. Each block builds on the previous.

---

# ═══════════════════════════════════════════════
# BLOCK 1 — MULTI-TOOL SYNC CONTRACT
# [SAVE AS FILE] → .cursor/rules/multi-tool-sync.mdc
# ═══════════════════════════════════════════════

```mdc
---
description: Cross-tool sync contract — Cursor, Codex, Antigravity, Claude Code, Kilo, OpenCode
alwaysApply: true
---

# Multi-Tool Sync Contract

## Canonical Source of Truth

The `.cursor/` directory is the SINGLE canonical source. All other tool
directories are GENERATED MIRRORS. Never edit mirrors directly.

| Mirror directory   | Target tool           | Sync method         |
|--------------------|----------------------|---------------------|
| `.antigravity/`    | Antigravity IDE      | `pnpm ai:sync`      |
| `.codex/`          | Codex app / Codex CLI| `pnpm ai:sync`      |
| `.claude/`         | Claude Code / CLI    | `pnpm ai:sync`      |
| `.kilocode/`       | Kilo IDE             | `pnpm ai:sync`      |
| `.opencode/`       | OpenCode             | `pnpm ai:sync`      |
| `AGENTS.md`        | Codex CLI (root)     | `pnpm ai:sync`      |
| `CLAUDE.md`        | Claude Code (root)   | `pnpm ai:sync`      |
| `GEMINI.md`        | Gemini CLI (root)    | `pnpm ai:sync`      |

## Sync Rules (enforced)

1. After ANY edit to `.cursor/commands/`, `.cursor/agents/`, `.cursor/skills/`,
   or `.cursor/rules/` — run `pnpm ai:sync` before committing.
2. CI runs `pnpm ai:check` on every PR. Drift fails the build.
3. Root-level `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` are GENERATED from
   `.cursor/` — they contain the command/agent/skill/rule index only.
4. If a tool reads its own mirror (e.g., Claude reads `CLAUDE.md`) it MUST
   follow the rules defined in `.cursor/rules/workspace-orchestration.mdc`.
5. All tools share identical SDD pipeline order, hardlock rules, and
   gate matrix — divergence is a bug.

## Tool-Specific Entrypoints

| Tool              | Start command         | Plan command      | Guide command     |
|-------------------|-----------------------|-------------------|-------------------|
| Cursor IDE        | `/START all`          | `/PLAN all`       | `/GUIDE status`   |
| Antigravity IDE   | `/START all`          | `/PLAN all`       | `/GUIDE status`   |
| Claude Code CLI   | `/START all`          | `/PLAN all`       | `/GUIDE status`   |
| Claude App        | `/START all`          | `/PLAN all`       | `/GUIDE status`   |
| Codex CLI         | `codex "/START all"`  | `codex "/PLAN all"`| `codex "/GUIDE"` |
| Codex App         | `/START all`          | `/PLAN all`       | `/GUIDE status`   |
| Kilo              | `/START all`          | `/PLAN all`       | `/GUIDE status`   |
| OpenCode          | `/START all`          | `/PLAN all`       | `/GUIDE status`   |

## Session Handoff Protocol

When switching tools mid-session:
1. Run `/SAVE log` in current tool to persist session state.
2. The next tool reads `docs/workspace/context/MEMORY.md` on boot.
3. Run `/GUIDE status` in the new tool to confirm sync before continuing.
```

---

# ═══════════════════════════════════════════════
# BLOCK 2 — IDEA-TO-PRD FLOW (New /PLAN idea v2)
# [SAVE AS FILE] → .cursor/commands/plan.md  (REPLACE existing)
# ═══════════════════════════════════════════════

```md
/PLAN — Specification-driven planning across all product dimensions

Subcommands (in recommended execution order):
  /PLAN idea        → Idea Workshop: 3-mode entry — describe / upload PRD / live interview
  /PLAN seo         → Keyword research, search intent mapping, slug rules → SEO_RESEARCH.md
  /PLAN ia          → Information architecture, pages, navigation, URL map → IA_CONTENT.md
  /PLAN content     → Page copy, hero sections, microcopy, voice/tone → CONTENT_MAP.md
  /PLAN design      → Design system contract: tokens, typography, motion, components → DESIGN.md
  /PLAN arch        → System architecture, tech stack decisions, data model → ARCHITECTURE.md
  /PLAN tech        → Technical feasibility, stack evaluation, cost estimate
  /PLAN scaffold    → Generate FULL folder + file tree before any code is written → PROJECT_SCAFFOLD.md
  /PLAN tasks       → Generate full task breakdown from specs into MASTER_TASKS.md
  /PLAN roadmap     → Milestone timeline, phase dependencies, SemVer bumps
  /PLAN brand       → Brand voice, visual identity direction, tone guidelines
  /PLAN all         → Run complete SDD sequence: idea → seo → ia → content → design → arch → scaffold → tasks

Aliases: /PLAN menus → /PLAN ia | /PLAN copy → /PLAN content | /PLAN spec → /PLAN arch

Hard block: PRD.md must exist and be non-template before any subcommand EXCEPT /PLAN idea runs.
PRD missing → redirect to /PLAN idea
Recommendation footer: required

---

## /PLAN idea — Idea Workshop (v2 behavior)

### Entry Mode Selection

On `/PLAN idea`, immediately ask:

> How do you want to start?
>
> **A)** I'll describe my idea in free text (quick start)
> **B)** I already have a PRD / brief — I'll paste or attach it
> **C)** Interview me — ask me questions one by one (recommended for new ideas)
>
> Type A, B, or C

---

### Mode A — Free Description

User types a free description. Agent responds with:

1. **Idea Echo** — restate in 2 sentences to confirm understanding
2. **Improvement Suggestions** — 3–5 strategic improvements the user may not have considered:
   - Missing monetization angle
   - Competitive differentiation gap
   - Underserved user segment
   - Technical shortcut that saves 60%+ dev time
   - Viral / growth mechanic
3. **Depth Questions** — ask exactly 3 clarifying questions (not 7, not 10)
4. After answers → generate PRD automatically → save to `docs/core/required/PRD.md`
5. Show PRD summary and ask: "Does this match your vision? Type YES to lock it or tell me what to change."

---

### Mode B — Upload / Paste PRD

User pastes existing PRD or brief. Agent:

1. Parses it and extracts: product name, target users, core problem, monetization, tech hints
2. Identifies GAPS — missing sections flagged with: `⚠️ Missing: [section name] — needed for [reason]`
3. Asks user to fill gaps OR offers to auto-fill based on context
4. Merges into standard PRD format → saves to `docs/core/required/PRD.md`
5. Confirms with summary card

---

### Mode C — Live Interview (Brainstorm Mode)

Agent conducts a structured interview. Questions are ADAPTIVE — later questions are informed by earlier answers.

**Phase 1: Core Idea (always ask)**
1. "What are you building? Describe it like you're explaining to a smart friend."
2. "Who uses it? Be specific — job title, situation, pain they have right now."
3. "What's the main thing it does that nothing else does well?"

**Phase 2: Business (ask based on Phase 1 answers)**
4. "How does money flow? (subscription / one-time / marketplace take / ads / services)"
5. "Who are the 2–3 competitors? What would make someone choose you instead?"

**Phase 3: Scale + Context**
6. "Where are your users? (affects language, payments, legal)"
7. "What's your timeline and team size?"

**After all answers collected:**

→ Agent enters **Brainstorm Mode**:

> "Before I write the PRD, here are ideas to make this stronger:"
>
> 🔵 **Depth Improvement:** [specific feature that dramatically increases retention]
> 🟢 **Growth Mechanic:** [viral or referral angle that fits this product]
> 🟡 **Monetization Upgrade:** [higher-leverage pricing model based on their answers]
> 🔴 **Risk Flag:** [the #1 thing that kills products like this — and how to avoid it]
>
> "Want me to fold any of these into the PRD? Or proceed as described?"

→ User responds → PRD generated → saved → locked

---

### PRD Lock Ceremony

After PRD is written in any mode:

```
✅ PRD locked: docs/core/required/PRD.md

Product:      [name]
Type:         [Web App / SaaS / Mobile App / Website / API]
Users:        [primary persona]
Core Problem: [one sentence]
Revenue:      [model]
Stack Hint:   [detected or stated]

Next step: /PLAN seo  — or run /PLAN all to complete the full pipeline
```

---

## /PLAN scaffold — Full File Tree Generator (NEW)

Runs AFTER arch is complete. Generates the COMPLETE folder and file structure
before any code is written.

**Behavior:**
1. Reads: PRD.md + ARCHITECTURE.md + DESIGN.md + IA_CONTENT.md
2. Produces `docs/workspace/plans/scaffold/PROJECT_SCAFFOLD.md` with:
   - Full directory tree (every folder and file, including empty stubs)
   - Each file annotated with: purpose / owner agent / phase when created
   - Config files listed (env, tsconfig, package.json, CI, etc.)
   - Database schema files listed
   - Component file list from DESIGN.md component inventory
3. Produces `scripts/scaffold.sh` — runnable bash script that creates all empty files/dirs
4. After user confirms scaffold is correct → run `bash scripts/scaffold.sh`

**Rule:** No developer touches `src/` or `app/` until scaffold is confirmed.
Gate: scaffold must exist before `/DEVELOP start` is allowed.

Output format example:
```
/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          [Phase 1 · auth-security-manager]
│   │   │   └── register/page.tsx       [Phase 1 · auth-security-manager]
│   │   ├── dashboard/
│   │   │   └── page.tsx                [Phase 2 · frontend-lead]
│   ├── components/
│   │   ├── ui/                         [Design System · react-component-lead]
│   │   └── features/                   [Feature Components · frontend-lead]
│   ├── lib/
│   │   ├── db/                         [Database · lead-database-architect]
│   │   └── auth/                       [Auth · auth-security-manager]
├── docs/
│   └── [all planning docs]
├── .cursor/
│   └── [workspace contracts]
└── [config files]
```
```

---

# ═══════════════════════════════════════════════
# BLOCK 3 — SMARTER /GUIDE (v2)
# [SAVE AS FILE] → .cursor/commands/guide.md  (REPLACE existing)
# ═══════════════════════════════════════════════

```md
/GUIDE — Intelligent project navigator. Always available. SDD-first.

Subcommands:
  /GUIDE status     → Full pipeline status: what's done, what's next, what's blocked
  /GUIDE next       → Single recommended next action (one thing, clearly stated)
  /GUIDE phase      → Deep dive on the current active phase
  /GUIDE full       → Complete project health: all phases, all gates, all open items
  /GUIDE explain    → Plain English — no jargon, no file paths
  /GUIDE help       → Usage reference

Aliases: /GUIDE → defaults to /GUIDE status

---

## GUIDE PRIME DIRECTIVE

/GUIDE's job is ONE thing: **help the user get their idea done**.

It does this by always knowing where the user is in the SDD pipeline and
giving them exactly the right next action — whether that's a slash command,
a ready-to-paste prompt, or a terminal command to run.

GUIDE never gives vague suggestions. Every response ends with something
the user can act on in under 30 seconds.

---

## SDD Pipeline Reference (GUIDE always follows this order)

```
Phase 0: Define     → PRD + PROJECT_PROMPT + ARCHITECTURE
Phase 1: Research   → SEO_RESEARCH.md
Phase 2: Design     → DESIGN.md (tokens, components, motion)
Phase 3: Content    → CONTENT_MAP.md + IA_CONTENT.md
Phase 4: Scaffold   → PROJECT_SCAFFOLD.md + scripts/scaffold.sh
Phase 5: Build      → Feature implementation (vertical slices)
Phase 6: Harden     → a11y + perf + security + SEO audits
Phase 7: Ship       → CI/CD + production deploy
```

GUIDE detects current phase by checking which artifacts exist.
GUIDE never suggests skipping a phase. If a gate is missing, GUIDE explains why it matters.

---

## Response Structure for /GUIDE status

Output exactly in this order. No deviation.

### 1. Pipeline Bar

Render the 8-segment pipeline bar:
  Define · Research · Design · Content · Scaffold · Build · Harden · Ship

Segment = filled (█) when phase artifacts are confirmed present.

  Pipeline  [████████░░░░░░░░░░░░░░░░]  3/8

### 2. Current Stage (2 sentences max)

Where you are + what you need to do to advance.

### 3. Active Phase Progress

  Phase: [name]  [████████░░] 4/8 steps done

### 4. Blockers (only if any)

  ❌ [plain description]
  → Fix with: [exact command or terminal command in code block]

  ```bash
  pnpm ai:sync
  ```

  If no blockers: ✅ No blockers — ready to proceed.

### 5. Next Action (bold, decisive)

  **→ [Exact command] — [one sentence what it does]**

  If next action is a prompt to paste into an AI tool:
  ```prompt
  [paste-ready prompt text here]
  ```

  If next action is a terminal command:
  ```bash
  [command here]
  ```

  If next action is a slash command: write it exactly as typed.

### 6. Quick Health Snapshot (3 lines, emoji + plain English)

  ✅ [status]
  ⚠️ [warning]
  ❌ [blocker]

### 7. Recommendation footer (required, always last)

---

## /GUIDE next — Single Action Mode

Output ONLY:

**Current phase:** [phase name]
**Your next action:**

[One of the following formats — pick the most appropriate:]

→ Slash command:
  `/PLAN seo` — generates keyword research and maps search intent to pages

→ Paste prompt:
  ```prompt
  [full ready-to-paste prompt the user can copy directly into Cursor/Claude/Codex]
  ```

→ Terminal:
  ```bash
  pnpm run design:apply -- minimal
  ```

**Why:** [one sentence explanation of why this is the right next step]

---

## /GUIDE explain — Zero Jargon Mode

Translate everything to plain English:
- No file paths
- No gate names
- No "hardlock", "SDD", "artifact", "subphase"
- No internal tool references

Format:
  Where you are:   [plain sentence]
  What's finished: [bullet list, plain English]
  What's next:     [plain sentence + exact command]
  What's blocking: [plain English + fix command]

---

## Tone and Format Rules (all /GUIDE subcommands)

- Decisive — never leave user not knowing what to type next
- When suggesting a prompt for any AI tool → write the FULL prompt, ready to copy
- When suggesting a terminal command → write the FULL command in a code block
- When suggesting a slash command → write it exactly as typed
- Never show raw file paths in main body (collapsible only)
- Maximum 2 seconds to understand the most important thing on the page
- Always end with Recommendation footer
```

---

# ═══════════════════════════════════════════════
# BLOCK 4 — IMPROVED /FOUNDER (Indie + Pro modes)
# [SAVE AS FILE] → .cursor/commands/founder.md  (REPLACE existing)
# ═══════════════════════════════════════════════

```md
/FOUNDER — Plain-language onboarding. Works for indie developers and professionals.

Subcommands:
  /FOUNDER idea     → Guided idea workshop (same as /PLAN idea Mode C)
  /FOUNDER status   → Plain-language project health check
  /FOUNDER pro      → Professional mode: structured PRD + architecture sprint
  /FOUNDER help     → Usage reference

Default: /FOUNDER → /FOUNDER idea

---

## Mode detection

Ask on first run (or detect from PRD content):

> "Are you building this solo or with a team?"
>
> **Solo / Indie** → conversational, plain language, opinionated defaults
> **Team / Professional** → structured, formal, full governance mode

This choice affects:
- Language complexity in responses
- Whether governance docs (GATE_MATRIX, VERSIONING) are auto-generated or explained first
- Whether agent assignments are shown or hidden

---

## /FOUNDER idea behavior

Runs /PLAN idea Mode C (live interview + brainstorm).
See plan.md for full spec.

Additional behavior for FOUNDER context:
- After PRD locked, auto-suggest a design profile from `.cursor/design/*/design.md`
- Show 3 profile options with: name + one-sentence plain-English rationale + best-for use case
- After profile chosen → copy to DESIGN.md + confirm
- Auto-run `/START gates` silently → report in plain language

Closing card:
```
✅ Your project is ready to plan.

What we'll build, in order:
1. Map your site/app structure and pages
2. Lock the design look and feel
3. Build feature by feature, tested as we go

Type /PLAN all to start the full planning sequence.
Or type /GUIDE next for just one step at a time.
```

---

## /FOUNDER pro behavior

For professionals / teams. Runs:
1. /PLAN idea Mode C (interview)
2. Auto-generates: PRD + PROJECT_PROMPT + ARCHITECTURE outline + GATE_MATRIX stub
3. Assigns lead agents to each domain (ARCH-01, PM-01, etc.)
4. Outputs swarm status card with assigned agents and first parallel work streams

---

## Output style

- Indie mode: friendly, plain language, no jargon
- Pro mode: structured, precise, governance-aware
- Never show "hardlock", "subphase", "SDD", "artifact" in user-facing text
- Technical details always in collapsible: `Technical detail (for developers)`
- Recommendation footer: required
```

---

# ═══════════════════════════════════════════════
# BLOCK 5 — PLAN-PHASE FILE SCAFFOLDING RULE
# [SAVE AS FILE] → .cursor/rules/plan-phase-scaffold.mdc  (NEW)
# ═══════════════════════════════════════════════

```mdc
---
description: Enforce full folder+file scaffolding before development begins
alwaysApply: true
---

# Plan-Phase Scaffold Gate

## Rule

Before any `/DEVELOP` command runs, the following must exist:

1. `docs/workspace/plans/scaffold/PROJECT_SCAFFOLD.md` — full annotated file tree
2. `scripts/scaffold.sh` — runnable script that creates the tree
3. The scaffold script must have been run: `src/` or `app/` directory exists

## Why This Rule Exists

Building without a scaffold causes:
- Files created in wrong locations
- Inconsistent naming across agents
- Missing config files discovered late
- Architectural drift between planning docs and actual structure

## Scaffold Completeness Requirements

PROJECT_SCAFFOLD.md must contain:
- Every directory the project will use
- Every file that will exist at completion (stubs are fine, paths are not)
- Owner agent annotation per directory
- Phase annotation (which phase creates each file)
- Config file inventory (env files, tsconfig, CI config, package.json, etc.)
- Database migration file locations
- Test file locations

## Enforcement

`/DEVELOP start` checks for scaffold existence.
If missing → halt + redirect to `/PLAN scaffold`

## Scaffold-First Benefits (explain to user when they ask why)

- Any AI tool (Cursor, Codex, Antigravity, Claude Code) can navigate the full
  structure from day one — no guessing where files go
- Parallel agent work streams don't collide
- Onboarding a new developer takes minutes, not hours
- Refactoring is planned, not accidental
```

---

# ═══════════════════════════════════════════════
# BLOCK 6 — IMPROVED SDD PIPELINE RULE
# [SAVE AS FILE] → .cursor/rules/sdd-pipeline-v2.mdc  (NEW, extends existing)
# ═══════════════════════════════════════════════

```mdc
---
description: SDD v2 pipeline — logical order with explicit entry modes per product type
alwaysApply: true
---

# SDD Pipeline v2

## Universal Pipeline (all product types)

```
Step 0: IDEA        → Free desc / Upload PRD / Live Interview → PRD.md
Step 1: VALIDATE    → Agent improves idea + flags risks → PRD locked
Step 2: RESEARCH    → SEO + market + competitor → SEO_RESEARCH.md
Step 3: ARCHITECTURE → Tech stack + data model + API design → ARCHITECTURE.md
Step 4: DESIGN      → Tokens + components + motion + DESIGN.md
Step 5: IA + CONTENT → Pages + nav + copy → IA_CONTENT.md + CONTENT_MAP.md
Step 6: SCAFFOLD    → Full file tree confirmed → PROJECT_SCAFFOLD.md
Step 7: BUILD       → Feature slices (vertical, tested) → src/
Step 8: HARDEN      → a11y + perf + security + SEO audit passes
Step 9: SHIP        → CI/CD + deploy + monitoring live
```

## Product-Type Variations

### Web App / SaaS
Pipeline order: 0→1→2→3→4→5→6→7→8→9
Architecture focus: auth, multi-tenancy, billing, API design
Design focus: dashboard patterns, onboarding flow, empty states
Scaffold must include: `/app`, `/api`, `/components/ui`, `/lib/db`, `/lib/auth`

### Website / Landing Page
Pipeline order: 0→1→2→5→4→6→7→8→9 (IA before design is critical)
Architecture focus: CMS, SSG/SSR, performance
Design focus: hero, sections, CTAs, typography hierarchy
Scaffold must include: `/app`, `/components/sections`, `/content`, `/public`

### Mobile App
Pipeline order: 0→1→2→3→4→5→6→7→8→9
Architecture focus: offline sync, push notifications, native APIs, app stores
Design focus: navigation patterns, touch targets, gesture design
Scaffold must include: `/screens`, `/components`, `/hooks`, `/services`, `/navigation`

### API / Backend
Pipeline order: 0→1→3→6→7→8→9 (skip design/IA phases)
Architecture focus: endpoints, data model, auth, rate limiting, versioning
Scaffold must include: `/routes`, `/controllers`, `/services`, `/models`, `/middleware`, `/tests`

## Hardlock Upgrade (v2)

In addition to existing hardlocks, add:

- Step 6 (SCAFFOLD) is hardlocked until Steps 3+4+5 artifacts exist
- Step 7 (BUILD) is hardlocked until Step 6 scaffold is confirmed
- Each feature slice in BUILD must have a spec at:
  `docs/workspace/plans/04-build/<feature-slug>/SPEC.md`
  before any implementation begins for that slice

## Agent Routing by Phase

| Phase      | Lead Agent                  | Support Agents                           |
|------------|----------------------------|------------------------------------------|
| Idea       | product-officer             | business-analyst, requirements-analysis  |
| Validate   | product-officer + PM-01     | technical-feasibility-analyst            |
| Research   | seo-specialist              | aeo-specialist, content-strategist       |
| Architecture| lead-solution-architect    | lead-backend-architect, lead-database    |
| Design     | lead-uiux-designer          | design-systems-token-architect, a11y     |
| IA+Content | content-strategist          | seo-specialist, arabic-content-master    |
| Scaffold   | project-architect + PM-01   | all leads confirm their directories      |
| Build      | swarm-leader (PM-01)        | feature-specific agents per slice        |
| Harden     | lead-qa-architect           | a11y-auditor, perf-engineer, security    |
| Ship       | lead-devops-performance     | gitops-engineer, ci-automation           |
```

---

# ═══════════════════════════════════════════════
# BLOCK 7 — PASTE THIS INTO CURSOR CHAT NOW
# [PASTE INTO CURSOR CHAT] — applies all 6 blocks + syncs tools
# ═══════════════════════════════════════════════

```
I am upgrading the NEZAM workspace. Please execute the following sequence exactly:

## Step 1: Read and apply all new rule files

Read these new files I've added to .cursor/:
- .cursor/rules/multi-tool-sync.mdc
- .cursor/rules/plan-phase-scaffold.mdc
- .cursor/rules/sdd-pipeline-v2.mdc
- .cursor/commands/plan.md (updated)
- .cursor/commands/guide.md (updated)
- .cursor/commands/founder.md (updated)

Then confirm: "NEZAM v2 rules loaded."

## Step 2: Sync all tool mirrors

Run in terminal:
```bash
pnpm ai:sync
```

If pnpm ai:sync fails because the script doesn't exist yet, create it:
```bash
node scripts/sync-ai-folders.js
```

## Step 3: Validate sync

Run:
```bash
pnpm ai:check
```

Report which tool mirrors were updated: .antigravity/, .codex/, .claude/, .kilocode/, .opencode/

## Step 4: Run workspace gate check

/START gates

Report results. Fix any failing gates before proceeding.

## Step 5: Confirm upgrade

Output this confirmation card:

```
✅ NEZAM v2 Upgrade Complete

Tools synced:   Cursor · Codex · Antigravity · Claude Code · Kilo · OpenCode
New commands:   /PLAN scaffold · /FOUNDER pro · /GUIDE next (upgraded)
New rules:      multi-tool-sync · plan-phase-scaffold · sdd-pipeline-v2
SDD pipeline:   8 phases (added Scaffold between Content and Build)
Idea flow:      3 entry modes (describe / upload PRD / live interview)
Guide upgrade:  SDD-first, outputs copy-ready prompts and terminal commands

Type /PLAN idea to start a new project.
Type /GUIDE status to check an existing project.
```
```

---

# ═══════════════════════════════════════════════
# BLOCK 8 — NEW PROJECT QUICK START PROMPT
# For starting any NEW project after upgrade is applied
# [PASTE INTO CURSOR CHAT] when starting a new idea
# ═══════════════════════════════════════════════

```
/FOUNDER idea

I want to build [YOUR IDEA HERE]. 
Walk me through the full idea workshop.
After the interview, brainstorm improvements I haven't thought of.
Then generate the PRD, lock it, and give me the next step.
```

---

# ═══════════════════════════════════════════════
# BLOCK 9 — DIAGNOSTIC: WHAT TO FIX IN CURRENT PROJECTS
# [PASTE INTO CURSOR CHAT] to audit an existing project
# ═══════════════════════════════════════════════

```
/SCAN full

Audit this project against NEZAM v2 standards. Check:

1. SDD Pipeline gaps — which phases have missing artifacts?
2. Multi-tool sync — are .cursor/, .claude/, .codex/, .antigravity/ in sync?
3. Scaffold completeness — does PROJECT_SCAFFOLD.md exist? Is the folder structure correct?
4. PRD quality — is PRD.md fully filled or still template/placeholder?
5. Design system — are all components using design tokens? Any hardcoded values?
6. Agent coverage — which phases have no assigned lead agent?
7. Guide accuracy — does /GUIDE status reflect reality?

For each gap found:
- State what is missing (one sentence)
- State why it matters (one sentence)  
- Give the exact command or file to fix it

Output as a prioritized fix list: Critical → Important → Nice to have
```

---

# ═══════════════════════════════════════════════
# BLOCK 10 — CODEX CLI / CLAUDE CODE SPECIFIC PROMPT
# For users running Codex CLI or Claude Code in terminal
# [PASTE INTO TERMINAL / CLI SESSION]
# ═══════════════════════════════════════════════

```bash
# For Codex CLI — start a NEZAM session
codex "You are operating inside the NEZAM workspace. Read AGENTS.md for the full command index and workspace contract. Run /GUIDE status to show current project state, then wait for my instructions."

# For Claude Code CLI — start a NEZAM session  
claude "You are operating inside the NEZAM workspace. Read CLAUDE.md for the full command index and workspace contract. The canonical rules are in .cursor/rules/ — read workspace-orchestration.mdc and sdd-pipeline-v2.mdc first. Run /GUIDE status to show current project state, then wait for my instructions."
```

---

# ═══════════════════════════════════════════════
# APPENDIX: WHAT WAS FIXED AND WHY
# ═══════════════════════════════════════════════

## Problems fixed in this upgrade

### 1. Multi-tool sync was implicit, not enforced
**Before:** Tools diverged silently. Edits in Cursor didn't reach Claude Code.
**Fix:** Explicit mirror table + `pnpm ai:sync` mandate + CI drift check.

### 2. /PLAN idea had no idea improvement step
**Before:** 7 questions → PRD. No agent pushback, no suggestions.
**Fix:** 3-mode entry + mandatory Brainstorm Mode that proposes improvements before PRD is written.

### 3. No PRD upload path existed
**Before:** Users with existing briefs had to reformulate from scratch.
**Fix:** Mode B — paste or upload existing brief → agent parses, fills gaps, converts to PRD.

### 4. /GUIDE gave file paths instead of actionable outputs
**Before:** GUIDE showed pipeline bars and mentioned file names. Users still didn't know what to type.
**Fix:** GUIDE now outputs copy-ready prompts, exact terminal commands, or exact slash commands — never vague suggestions.

### 5. No full scaffold step before development
**Before:** Developers started creating files ad-hoc. Structure drifted from planning docs.
**Fix:** /PLAN scaffold generates the complete file tree. BUILD is hardlocked until scaffold confirmed.

### 6. SDD pipeline didn't account for product type
**Before:** Same 7-phase pipeline for website, SaaS, and mobile app.
**Fix:** Product-type variations with different phase orders and scaffold requirements.

### 7. /FOUNDER was indie-only
**Before:** Plain language only. Professional teams had no governance-aware onboarding.
**Fix:** /FOUNDER pro mode activates full governance: agent assignment, parallel work streams, gate matrix.

### 8. Codex CLI and Claude Code had no explicit session start protocol
**Before:** CLI users pasted random instructions. No workspace context loaded.
**Fix:** Explicit CLI start commands in Block 10 that load the workspace contract on session open.
```
