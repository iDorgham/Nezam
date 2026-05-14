/START — Initialize a new project in this workspace

## Path resolution

Before any file operation, read `.nezam/gates/hardlock-paths.json` and resolve:
- `intake.prd` → default `docs/plan/00-define/01-product/PRD.md`
- `intake.projectPrompt` → default `docs/plan/00-define/01-product/PROJECT_PROMPT.md`
- `planning.changelog` → default `.nezam/CHANGELOG.md`

All path references in this command use these resolved values.

---

## Subcommands

  /START             → Full interactive onboarding flow (use this first)
  /START prd         → Deep-dive PRD creation — guided interview mode
  /START gates       → Run all prerequisite checks. Shows ✅/❌ per gate.
  /START repo        → Link or initialize the git repository
  /START design      → Browse `.nezam/design/<brand>/`, pick one, apply to root DESIGN.md
  /START docs        → Scaffold docs/plan/ and docs/reports/ folder structure
  /START companion   → Generate a briefing to paste into any external AI
  /START all         → Run full sequence: onboarding → prd → design → docs → gates

Aliases: /START check → /START gates

---

## Pre-flight check (every /START invocation)

1. Read `HANDOFF_QUEUE.yaml` at workspace root.
   - If `active_session.session_id` is populated AND any queue item has `status: pending` or `in_progress`, resume from that context immediately. Do not accept new work until the queue item is resolved or explicitly deferred by the user.
   - If queue is empty or all items are `complete`, proceed normally.

---

## Behavior: /START (no subcommand) — Full Onboarding Flow

> This is the entry point for every new project. Run this once. Do it right.
> Do not rush any step. Do not batch questions. One step at a time.

---

### STEP 1 — Workspace Verification

Check that the NEZAM governance layer is intact:
- `.nezam/gates/hardlock-paths.json` exists
- `.nezam/templates/specs/PRD.template.md` exists
- `.nezam/templates/specs/PROMPT_DOCUMENT.template.md` exists
- `.nezam/templates/specs/FEATURE_SPEC.template.md` exists

If any are missing:
> ❌ NEZAM workspace is corrupted. Run `/nezam repair` before proceeding.

If all pass:
> ✅ Workspace verified. Let's set up your project.

---

### STEP 2 — Collect Project Identity (ask ONE at a time, wait for answer)

**Question 1:**
> What is your **product name**?
> (This will be used throughout all specs, files, and commits.)

Store as: `PROJECT_NAME`

**Question 2:**
> What is your **GitHub repository URL**? (or the name you plan to use if not created yet)
> Example: `https://github.com/yourname/your-repo`

Store as: `GITHUB_REPO_URL`

**Question 3:**
> What is your **primary target market**?
>
> A) 🌍 Global (English primary)
> B) 🇸🇦 MENA Arabic (Arabic primary, RTL layout)
> C) 🌐 MENA English (English primary, MENA market)
> D) 🌍 Bilingual (Arabic + English)

Store as: `TARGET_MARKET` and `PRIMARY_LANGUAGE`. If B or D → set RTL flag.

**Question 4:**
> What is your **team size**?
>
> A) Solo (just me)
> B) Small team (2–5)
> C) Larger team (6+)

Store as: `TEAM_SIZE`. Solo → `user_mode: solo`, 2+ → `user_mode: team`.

**Question 5:**
> What **build approach** do you prefer?
>
> A) **SDD** — Specification-Driven: full spec before any code (recommended)
> B) **Lean** — lighter specs, faster to first prototype
> C) **TDD** — test-first approach
> D) **API-first** — contract before UI

Store as: `BUILD_MODE`

After all 5 answers, write to `.cursor/state/onboarding.yaml`:
```yaml
user_mode: "<solo|team>"
tone: "<friendly|structured>"
target_market: "<value>"
build_mode: "<sdd|lean|tdd|api-first>"
user_mode_set_at: "<ISO_TIMESTAMP>"
prd_locked: false
design_locked: false
planning_complete: false
current_phase: 0
```

Show confirmation:
> ✅ Project identity saved.
> **{{PROJECT_NAME}}** | {{GITHUB_REPO_URL}} | {{TARGET_MARKET}} | {{BUILD_MODE}} mode
>
> Next: I need to understand what you're building. Ready?

---

### STEP 3 — Understand the Product (deep intake)

Tell the user:
> Drop your `PRD.md`, brief, or notes into `docs/start/` — then type **READY**.
>
> Or type **INTERVIEW** and I'll ask you questions to build it together.
> Or type **DESCRIBE** and tell me what you want to build in plain language.

#### If user types READY (has a document):
- Verify a `.md` file exists in `docs/start/`
- Read the file completely
- Extract: product concept, target users, core features, constraints, tech hints
- Identify gaps — show using this exact format:
  ```
  ✅ Product name — found
  ✅ Target users — found
  ⚠️  Data model — not described. I'll ask about this.
  ⚠️  Monetization — not mentioned. Add or I'll default to free.
  ❌  Success metrics — required. Please describe what success looks like.
  ```
- Ask the user to resolve each gap before proceeding to STEP 4

#### If user types INTERVIEW:
→ Execute `/START prd` deep interview flow (see below)

#### If user types DESCRIBE (or just types a description):
- Echo back the idea in 2 sentences to confirm understanding
- Ask exactly 3 targeted clarifying questions based on what they said
- After answers, proceed to STEP 4

---

### STEP 4 — Generate Deep PRD

> Do NOT skip this step. Do NOT write a short PRD.
> This step is slow by design. Depth here prevents rewrites during development.

**Before writing anything, the agent must internally enumerate (do not show to user yet):**

1. Every feature implied by the product description — core to edge cases
2. Every user type and their distinct permissions
3. Every user flow — happy path AND every error/edge branch
4. Every data entity — every field, every relationship
5. Every screen — every state (loading / empty / error / populated / offline)
6. Every external integration required
7. Every non-functional requirement (performance, security, a11y, localization)
8. Every constraint and out-of-scope item

Then show the user a scope preview:
> Before I write the full PRD, here's the scope I'm planning:
> [show feature list with F-ID and priorities]
> Does this match your vision? Anything to add, remove, or change priority on?

After user confirms (or adjusts):

Generate the full PRD using `.nezam/templates/specs/PRD.template.md` as structure.

**PRD quality gate — MUST pass before saving:**
- Section 0: all fields filled — no blanks, no `{{PLACEHOLDER}}` tokens
- Section 2: at least 2 complete personas with JTBD statements
- Section 4: every P0 feature listed with spec file path
- Section 5: at least 3 user flows with error paths documented
- Section 6: every data entity with every field typed and validated
- Section 7: every API endpoint listed with request/response shapes
- Section 8: every screen listed with all 5 states (loading/empty/populated/error/offline)
- Section 9: full navigation structure
- Section 10: complete permissions table
- Section 12: all non-functional requirements filled — no TBD
- Section 14: explicit out-of-scope list
- Zero `{{PLACEHOLDER}}` tokens remaining

Save to: `docs/plan/00-define/01-product/PRD.md`

Show summary card:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋  PRD GENERATED — {{PROJECT_NAME}}

Features:    {{N}} ({{N_P0}} P0 · {{N_P1}} P1 · {{N_P2}} P2)
Personas:    {{N}}
User flows:  {{N}} (with error paths)
Entities:    {{N}} ({{N_FIELDS}} fields total)
Screens:     {{N}} × 5 states each
Endpoints:   {{N}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask: **"Does this PRD match your vision? Type YES to lock it, or tell me what to change."**

On YES → set `prd_locked: true` in `.cursor/state/onboarding.yaml`

---

### STEP 5 — Choose Design System

List available designs from `.nezam/design/` with a one-line description each.

Ask:
> Which design system fits your product? Type the brand name.
> Or type CUSTOM to describe your visual direction and I'll generate DESIGN.md.

When user selects:
- Existing brand → run `pnpm run design:apply -- <brand>` → copies to root `DESIGN.md`
- CUSTOM → ask: primary color, accent color, typography style, mood (minimal / bold / warm / professional) → generate `DESIGN.md`

Verify `DESIGN.md` exists and has content.
Set `design_locked: true` in `.cursor/state/onboarding.yaml`.

---

### STEP 6 — Generate PROJECT_PROMPT.md

> This is the specification contract that every AI agent reads before doing anything.
> It must be comprehensive — a rulebook, not a summary.

Using the completed PRD and design system, generate `PROJECT_PROMPT.md` using `.nezam/templates/specs/PROMPT_DOCUMENT.template.md`.

**PROJECT_PROMPT quality gate — MUST pass before saving:**
- Section 1 north star: complete, no placeholder tokens
- Section 3 tech stack: every choice explicit — no "TBD" entries
- Section 4 data architecture: all entities and relationships mapped
- Section 5 feature index: links to all feature spec files
- Section 6 decision rules: minimum 3 concrete "when uncertain, prefer X" rules specific to this project
- Section 7 UI/UX contract: design token rules, nav rules, form rules, empty states all defined
- Section 8 API contract: error format, auth, pagination fully defined
- Section 9 acceptance criteria: summary for every P0 feature
- Section 13 conventions: complete file/folder structure
- Zero `{{PLACEHOLDER}}` tokens remaining

Save to: `docs/plan/00-define/01-product/PROJECT_PROMPT.md`

---

### STEP 7 — Generate Feature Specs (P0 features)

For every P0 feature in the PRD Feature Registry:
- Copy `.nezam/templates/specs/FEATURE_SPEC.template.md`
- Fill in every section completely — no placeholder tokens
- Every screen state defined
- Every API endpoint specified
- Every edge case listed
- Definition of Done checklist populated
- Save to: `docs/plan/00-define/specs/{{FEATURE_ID}}-{{slug}}.md`

Show progress per feature. Do not move on until all P0 specs are complete.

---

### STEP 8 — Scaffold Folder Structure

Create:
```
docs/
├── plan/
│   ├── 00-define/
│   │   ├── 01-product/   ← PRD.md + PROJECT_PROMPT.md
│   │   ├── 02-architecture/
│   │   └── specs/        ← feature specs
│   ├── 01-research/
│   ├── 02-ia/
│   ├── 03-content/
│   ├── 04-design/
│   ├── 05-build/
│   └── 06-ship/
└── reports/
    ├── progress/
    ├── tests/
    ├── audits/
    ├── a11y/
    ├── security/
    ├── perf/
    └── lighthouse/
```

---

### STEP 9 — Initialize CHANGELOG

Run: `node .nezam/scripts/changelog/ensure-changelog-initialized.js`

Verify `.nezam/CHANGELOG.md` exists. If not, create from `.nezam/templates/specs/CHANGELOG.template.md`.

Note: `.nezam/CHANGELOG.md` = NEZAM system changelog.
`CHANGELOG.md` at repo root = project changelog (created during `/develop`).

---

### STEP 10 — Run Gate Check & Unlock Planning

Run: `bash .nezam/scripts/checks/check-onboarding-readiness.sh`

If passes:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  ONBOARDING COMPLETE — {{PROJECT_NAME}}

✅  PRD              → docs/plan/00-define/01-product/PRD.md
✅  PROJECT_PROMPT   → docs/plan/00-define/01-product/PROJECT_PROMPT.md
✅  Feature Specs    → docs/plan/00-define/specs/ ({{N}} specs)
✅  Design Contract  → DESIGN.md
✅  CHANGELOG        → .nezam/CHANGELOG.md

🔓  /PLAN → UNLOCKED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Run /plan all to generate your complete execution plan.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Behavior: /START prd — Deep Interview Mode

Ask one question at a time. Each answer informs the next question.

### Phase 1 — Core (always ask)
1. "What are you building? Describe it like explaining to a smart friend."
2. "Who is your primary user? Their job, their daily frustration, the moment your product helps them."
3. "What does your product do that nothing else does well?"

### Phase 2 — Business (adapt to Phase 1 answers)
4. "How does money flow? (subscription / one-time / marketplace / free)"
5. "Name 2–3 competitors. Why would someone choose you instead?"
6. "Where are your users — country/region? Affects language, payments, compliance."

### Phase 3 — Technical Reality
7. "Preferred tech stack, or should I recommend one?"
8. "Non-negotiable integrations? (payments, auth, email, SMS, storage, etc.)"
9. "Timeline and team size?"

### Phase 4 — Edge Cases & Constraints (always ask)
10. "What happens if a user loses their data? What's the recovery story?"
11. "What's the worst thing that could go wrong with this product at scale?"
12. "What are you explicitly NOT building in v1?"

After all answers → trigger STEP 4 (deep PRD generation).

---

## Behavior: /START gates

Run checks and report ✅ / ❌:

| Gate | Check |
|---|---|
| NEZAM workspace | `.nezam/gates/hardlock-paths.json` exists |
| PRD | `docs/plan/00-define/01-product/PRD.md` — exists, populated, no placeholder tokens |
| PROJECT_PROMPT | `docs/plan/00-define/01-product/PROJECT_PROMPT.md` — exists, populated |
| Feature Specs | At least 1 `.md` file in `docs/plan/00-define/specs/` |
| Design contract | `DESIGN.md` exists at repo root |
| onboarding.yaml | `prd_locked: true` AND `design_locked: true` |
| CHANGELOG | `.nezam/CHANGELOG.md` exists |
| Git initialized | `.git/` exists |

If any gate fails → show exact command to fix it.

---

## Folder Separation Rule

```
.nezam/                     ← NEZAM system — DO NOT MODIFY during /start
.nezam/CHANGELOG.md         ← NEZAM system changelog
docs/plan/                  ← User's project plans
docs/plan/00-define/        ← PRD, PROJECT_PROMPT, feature specs
docs/reports/               ← User's project reports
DESIGN.md                   ← User's design contract (root)
CHANGELOG.md (root)         ← User's project changelog (created during /develop)
```

---

## Hard blocks

- `/plan` blocked until: `prd_locked: true` AND `design_locked: true`
- `/develop` blocked until: `planning_complete: true`

---

## Session Closure

[LAST STEP] Write to `HANDOFF_QUEUE.yaml`:

```yaml
session_history:
  - session_id: "<date>-onboarding-<project_slug>"
    summary: "Completed onboarding for {{PROJECT_NAME}}. PRD, PROJECT_PROMPT, and {{N}} feature specs generated."
    phases_advanced: ["onboarding"]
    artifacts_created:
      - docs/plan/00-define/01-product/PRD.md
      - docs/plan/00-define/01-product/PROJECT_PROMPT.md
      - docs/plan/00-define/specs/*.md
      - DESIGN.md
    ended_at: "<ISO_TIMESTAMP>"
```
