/PLAN — Specification-driven planning across all product dimensions

Subcommands (in recommended execution order):
  /PLAN idea        → Idea Workshop: 3-mode entry — describe / upload PRD / live interview + brainstorm
  /PLAN seo         → Keyword research, search intent mapping, slug rules → SEO_RESEARCH.md
  /PLAN ia          → Information architecture, pages, navigation, URL map → IA_CONTENT.md
  /PLAN content     → Page copy, hero sections, microcopy, voice/tone → CONTENT_MAP.md
  /PLAN design      → Design system contract: tokens, typography, motion, components → DESIGN.md
  /PLAN design wireframes → Interactive wireframe selector: pick layout per element → DESIGN_CHOICES.md → DESIGN.md
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

## /PLAN idea — Idea Workshop (v2)

### Entry Mode Selection

On `/PLAN idea`, immediately present:

> How do you want to start?
>
> **A)** I'll describe my idea in free text (quick start)
> **B)** I already have a PRD or brief — I'll paste or attach it
> **C)** Interview me — ask me questions one by one (recommended for new ideas)
>
> Type A, B, or C — or just describe your idea and I'll detect the mode.

---

### Mode A — Free Description

User types a description. Agent responds with:

1. **Idea Echo** — restate in 2 sentences to confirm understanding
2. **Improvement Suggestions** — 3–5 improvements the user may not have considered:
   - Missing monetization angle or upgrade path
   - Competitive differentiation gap
   - Underserved user segment
   - Technical shortcut that reduces build time significantly
   - Viral or growth mechanic
3. **3 Clarifying Questions** (exactly 3, targeted, not generic)
4. After answers → generate PRD → save to `docs/core/required/PRD.md`
5. Show PRD summary card → ask: "Does this match your vision? Type YES to lock or tell me what to change."

---

### Mode B — Upload / Paste PRD

User pastes existing PRD, brief, or notes. Agent:

1. Parses and extracts: product name, target users, core problem, monetization, tech hints
2. Identifies GAPS — flags missing sections:
   `⚠️ Missing: [section] — needed for [reason]`
3. Asks user to fill gaps OR offers to auto-fill based on context clues
4. Merges into standard PRD format → saves to `docs/core/required/PRD.md`
5. Shows summary card → confirms lock

---

### Mode C — Live Interview + Brainstorm (Recommended)

Adaptive interview — later questions informed by earlier answers.

**Phase 1: Core (always ask — 3 questions)**
1. "What are you building? Describe it like explaining to a smart friend."
2. "Who uses it? Be specific — job, situation, pain they have right now."
3. "What does it do that nothing else does well?"

**Phase 2: Business (3 questions, adapted to Phase 1)**
4. "How does money flow? (subscription / one-time / marketplace / ads / services)"
5. "Who are the 2–3 competitors? What makes someone choose you instead?"
6. "Where are your users? (country/region — affects language, payments, legal)"

**Phase 3: Scale (1 question)**
7. "Timeline and team size?"

**Brainstorm Mode (after all answers)**

Before writing the PRD, the agent enters Brainstorm Mode:

```
Before I write your PRD, here are ways to make this stronger:

🔵 DEPTH IMPROVEMENT
   [specific feature that dramatically increases retention or engagement]
   Why it matters: [one sentence]

🟢 GROWTH MECHANIC
   [viral, referral, or network effect that fits this product type]
   Why it matters: [one sentence]

🟡 MONETIZATION UPGRADE
   [higher-leverage pricing or revenue model based on your answers]
   Why it matters: [one sentence]

🔴 RISK FLAG
   [the #1 thing that kills products like this]
   How to avoid it: [one sentence]

Want me to incorporate any of these into the PRD?
Type YES to include all / tell me which ones / or type NO to proceed as described.
```

After user responds → PRD generated → saved → lock ceremony shown.

---

### PRD Lock Ceremony (all modes)

```
✅ PRD locked: docs/core/required/PRD.md

Product:      [name]
Type:         [Web App / SaaS / Mobile App / Website / API]
Users:        [primary persona in one line]
Core Problem: [one sentence]
Revenue:      [model]
Stack Hint:   [detected or stated]
Risks Noted:  [count from brainstorm]

Next: /PLAN seo → or run /PLAN all to complete the full pipeline at once
```

---

## /PLAN scaffold — Full File Tree Generator

Runs AFTER arch, design, and IA are complete. Hard-blocked until all three exist.

**Behavior:**
1. Reads: PRD.md + ARCHITECTURE.md + DESIGN.md + IA_CONTENT.md
2. Detects product type (SaaS, website, mobile, API)
3. Produces `docs/workspace/plans/scaffold/PROJECT_SCAFFOLD.md` with:
   - Complete directory tree (every folder and file, including empty stubs)
   - Each file annotated: purpose / owner agent / SDD phase when created
   - Config file inventory (env, tsconfig, CI configs, package.json, etc.)
   - Database schema and migration file locations
   - Component file list from DESIGN.md component inventory
   - Test file locations mirroring source structure
4. Produces `scripts/scaffold.sh` — idempotent bash script (mkdir -p + touch)
5. Shows tree in chat for review
6. Asks: "Does this structure look right? Type YES to run the scaffold script."
7. On YES → runs `bash scripts/scaffold.sh` → confirms files created

**Rule:** No developer touches `src/` or `app/` until scaffold is confirmed.
**Gate:** scaffold must exist before `/DEVELOP start` is allowed.

Example output format:
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
│   │   ├── ui/                         [Design System · frontend-framework-manager]
│   │   └── features/                   [Feature Components · frontend-lead]
│   ├── lib/
│   │   ├── db/                         [Database · lead-database-architect]
│   │   └── auth/                       [Auth · auth-security-manager]
├── docs/                               [Planning docs — all phases]
├── .cursor/                            [Workspace contracts — do not edit mirrors]
└── scripts/                            [Build and scaffold scripts]
```

---

## /PLAN design — Design System + Layout Selection

Two modes available:

### /PLAN design (standard)
Runs after IA is complete. Generates DESIGN.md covering:
- Design tokens (color, spacing, typography scale, motion)
- Component inventory (derived from IA page list)
- Brand direction (minimal / editorial / bold / technical)

### /PLAN design wireframes (interactive)
User-controlled design selection. Runs `design-selector` skill.

**Behavior:**
1. Reads PRD.md to detect product type (website / webapp / saas / mobile)
2. Presents wireframe options ONE ELEMENT AT A TIME — never all at once
3. Each element shows ASCII wireframe previews with labels and best-for notes
4. User picks a number → choice recorded → next element shown
5. After all elements: confirmation summary shown
6. Type YES → writes `DESIGN_CHOICES.md` → generates `DESIGN.md` from choices
7. Type `CHANGE [element]` → revise that element only

**Element sequence by product type:**

| Website | Webapp / SaaS | Mobile |
|---|---|---|
| 1. Header / Nav | 1. App Navigation | 1. Navigation Pattern |
| 2. Portfolio Grid | 2. Dashboard Layout | 2. Home Screen |
| 3. Project Page | 3. Data Table/List | 3. Detail Screen |
| 4. Footer | 4. Empty State | 4. Onboarding Flow |
| 5. Contact Page | | |

**Output files:**
- `docs/workspace/plans/04-design/DESIGN_CHOICES.md` — locked YAML of all selections
- `docs/workspace/plans/04-design/DESIGN.md` — full design contract generated from choices

**Hard rule:** DESIGN.md generated this way cannot be manually overridden without re-running `/PLAN design wireframes`. Edit the choices, regenerate the doc.

**Gate:** Both files must exist before `/PLAN scaffold` can run.

---

## /PLAN tasks — Settings-Aware Task Tool Tagging

When generating `docs/workspace/plans/MASTER_TASKS.md`, apply routing metadata when
`tools.routing.auto_assign_tasks: true` in `.cursor/workspace.settings.yaml`.

### Task Tool Tagging

Before writing tasks:
1. Read `.cursor/workspace.settings.yaml` (`tools` activation state + routing toggles).
2. Read `docs/workspace/context/CLI_TOOLS_CONTEXT.md` (task-to-tool routing matrix + deactivation chains).
3. For each task, compute:
   - `type`
   - `assigned_tool` (primary route if active)
   - `fallback_tool` (next active fallback from chain)
   - `security` (`true` for security-sensitive scopes, which stay on primary reasoning lanes)
4. If preferred tool is inactive, reassign to the first active fallback and log a reroute note.
5. If no active fallback exists, set task to blocked with reason `NO_ACTIVE_TOOL`.

### Task Re-routing on Tool Deactivation

When `/Settings ai-tools off <tool>` is executed:
1. Scan `MASTER_TASKS.md` for tasks with `assigned_tool: <tool>`.
2. Re-route each to the first active fallback from `CLI_TOOLS_CONTEXT.md`.
3. Preserve audit trace via `original_tool: <tool>` until reactivation.
4. For `security: true` tasks, if no valid primary lane exists, mark blocked with
   `SECURITY_TOOL_INACTIVE`.
5. Output a rerouting summary by tool.
