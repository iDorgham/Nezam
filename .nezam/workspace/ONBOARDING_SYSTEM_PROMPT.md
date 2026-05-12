# NEZAM — Onboarding & Hardlock System: Implementation Prompt

**Target tools:** Cursor (primary) or Claude Code  
**Scope:** `/start` command redesign · Design selection · Hardlock gate system · Sequential phase unlocks · Wireframe quality upgrade  
**File this prompt references:** `.cursor/commands/start.md` · `.cursor/commands/plan.md` · `.cursor/commands/develop.md` · `.cursor/rules/design-dev-gates.mdc` · `.cursor/rules/sdd-pipeline-v2.mdc`

---

## Context for the AI

You are working inside the NEZAM workspace — a specification-driven development (SDD) governance system for AI-native builders. NEZAM uses slash commands (`/start`, `/plan`, `/develop`, `/check`, `/deploy`) to guide users through a structured pipeline from idea to production.

**Current state:**
- `docs/` root has `prd/`, `plans/`, `reports/` ready for user project
- `.nezam/workspace/` contains NEZAM's own governance (do not touch)
- `.cursor/commands/start.md` — the `/start` command definition
- `.cursor/commands/plan.md` — the `/plan` command definition  
- `.cursor/commands/develop.md` — the `/develop` command definition
- `.cursor/rules/design-dev-gates.mdc` — design gates before development
- `.cursor/rules/sdd-pipeline-v2.mdc` — the SDD pipeline with hardlock tables
- `.cursor/state/` — where gate state is persisted (JSON files)
- `docs/gates/workspace.paths.yaml` — canonical path config

**Do NOT modify:** `.nezam/workspace/`, `.cursor/agents/`, `.cursor/skills/`, `.cursor/rules/agent-lazy-load.mdc`

---

## The 5 Implementation Tasks

---

### TASK 1 — Redesign `/start` (No Subcommand) into a Full Onboarding Flow

**File to rewrite:** `.cursor/commands/start.md`

#### Step 1: Scaffold docs/ structure first (silent, no user interaction needed)

Create these paths if they don't already exist:
```
docs/prd/PRD.md              ← from .nezam/templates/sdd/PRD_TEMPLATE.md
docs/plans/.gitkeep
docs/reports/progress/.gitkeep
docs/reports/tests/.gitkeep
docs/reports/audits/.gitkeep
docs/reports/a11y/.gitkeep
docs/reports/security/.gitkeep
docs/reports/perf/.gitkeep
docs/reports/lighthouse/.gitkeep
```

#### Step 2: PRD Creation — Present user with 4 choices

Show this exact menu:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEZAM — Let's build your product
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How do you want to start?

  [1] Describe your idea → I'll create the PRD
      Quick start. Tell me what you're building in
      plain language and I'll structure it into a PRD.

  [2] Interview mode → Guided conversation + brainstorm
      I'll ask you 7 focused questions, suggest
      improvements, and write the PRD together.
      Best for new or unvalidated ideas.

  [3] Paste / upload your PRD → I'll review and improve it
      Have a brief, doc, or notes already? I'll
      parse it, flag gaps, suggest improvements,
      and rewrite it in standard NEZAM format.

  [4] Add my PRD directly → No AI editing
      Drop PRD.md into docs/prd/ and I'll accept
      it as-is and move to the next step.

Type 1, 2, 3, or 4:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Mode 1 — Describe your idea:**
- User types free text
- Agent echoes back in 2 sentences to confirm understanding
- Agent presents exactly 3 targeted improvement suggestions (not generic)
- User can say YES to incorporate, NO to skip, or pick specific ones
- Agent writes complete PRD → saves to `docs/prd/PRD.md`
- Shows PRD summary card (product name, type, users, core problem, revenue model)
- Asks: "Looks good? Type YES to lock or tell me what to change."

**Mode 2 — Interview mode:**
Ask ONE question at a time. Wait for the answer before asking the next.

Phase 1 — Core (3 questions):
1. "What are you building? Describe it like explaining to a smart friend."
2. "Who uses it? Be specific — job title, situation, pain they have right now."
3. "What does it do that nothing else does well today?"

Phase 2 — Business (3 questions, adapted based on Phase 1 answers):
4. "How does money flow? (subscription / one-time / marketplace / ads / services)"
5. "Who are the main competitors, and why would someone choose you over them?"
6. "What country/region are your users in? (affects language, payments, legal)"

Phase 3 — Scale (1 question):
7. "What's your timeline and team size?"

After all 7 answers, enter **Brainstorm Mode** — show this block:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  💡 Brainstorm — Ways to make this stronger
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵  DEPTH IMPROVEMENT
    [specific feature that increases engagement/retention]
    Why: [one sentence specific to their product]

🟢  GROWTH MECHANIC
    [viral, referral, or network effect that fits]
    Why: [one sentence]

🟡  MONETIZATION UPGRADE
    [higher-leverage pricing model based on their answers]
    Why: [one sentence]

🔴  RISK FLAG
    [the #1 thing that kills products like this]
    How to avoid: [one sentence]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Include any in your PRD? (YES for all / pick numbers / NO)
```

After response → write PRD → save → show lock ceremony.

**Mode 3 — Paste or upload existing PRD:**
- User pastes or attaches their document
- Agent extracts: product name, target users, core problem, revenue model, tech hints
- Flags missing sections with: `⚠️ Missing: [section] — needed because [reason]`
- Presents 3–5 specific improvement suggestions (not generic)
- User picks which to incorporate
- Agent rewrites the PRD in standard NEZAM format → saves
- Shows PRD summary card → lock ceremony

**Mode 4 — Add PRD directly:**
- Tell user: "Drop your PRD.md into `docs/prd/` then type READY."
- When they type READY → read the file → validate it has content (not just template)
- Accept as-is → skip to Step 3 (Design selection)

**PRD Lock Ceremony (all modes):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  PRD LOCKED: docs/prd/PRD.md

Product:      [name]
Type:         [Web App / SaaS / Mobile / Website / API]
Users:        [one-line persona]
Core Problem: [one sentence]
Revenue:      [model]
Risks noted:  [count]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Write to `.cursor/state/onboarding.yaml`:
```yaml
prd_locked: true
prd_path: "docs/prd/PRD.md"
prd_locked_at: "[timestamp]"
design_locked: false
planning_complete: false
```

---

#### Step 3: Design Selection — Two Paths

After PRD is locked, immediately present:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP 2 — Choose your design direction
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [A] Pick a design profile
      Browse 100+ curated profiles (minimal, stripe,
      linear, notion, shadcn, glassmorphism, etc.)
      I'll copy it to DESIGN.md and configure it
      for your product type.

  [B] Describe your design vision
      Tell me your desired look, feel, and references.
      I'll interview you and create a custom DESIGN.md.

Type A or B:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Path A — Pick a design profile:**
- Read all folder names from `.nezam/design/` (excluding README.md and catalog.json)
- Group them into visual categories:
  ```
  Minimal & Clean:     minimal, clean, simple, sleek, refined, mono
  Premium & Luxury:    luxury, premium, ferrari, bmw, bmw-m, bugatti, tesla
  SaaS & Product:      linear-app, notion, vercel, stripe, supabase, shadcn, posthog
  Bold & Expressive:   bold, dramatic, vibrant, expressive, colorful, gradient
  Editorial:           editorial, publication, wired, warm-editorial, storytelling
  Futuristic & Sci-fi: futuristic, cosmic, neon, spacex, nvidia
  Playful:             friendly, doodle, duolingo, pacman, tetris
  Corporate:           corporate, enterprise, ibm, professional
  Design Systems:      material, ant, figma, apple, airbnb
  Glassmorphism/Neo:   glassmorphism, neumorphism, neobrutalism, brutalism, claymorphism
  ```
- Show the grouped list and ask user to type the profile name
- Read `.nezam/design/[chosen]/design.md`
- Copy to root `DESIGN.md`
- Confirm: "✅ Design profile `[name]` applied → DESIGN.md created"

**Path B — Describe your vision:**
Ask these 5 questions ONE AT A TIME:
1. "Describe the vibe in 3 words (e.g. 'clean, powerful, trustworthy')"
2. "Any products or websites whose design you admire? (name them)"
3. "Primary colors you have in mind? Or should I pick based on your brand?"
4. "Who are your users — consumers or professionals? (affects density and complexity)"
5. "Any design elements you definitely DON'T want? (e.g. 'no dark backgrounds', 'no animations')"

After answers → generate a complete `DESIGN.md` at the repo root covering:
- Color system (primary, secondary, accent, semantic, neutral scale)
- Typography scale (display, heading, body, code, caption — with fluid clamp values)
- Spacing system (4px base grid, named steps: xs/sm/md/lg/xl/2xl)
- Border radius and elevation tokens
- Motion/animation guidelines (duration, easing, reduced-motion rules)
- Component list derived from PRD (what UI pieces this product needs)
- Dark/light mode parity requirements
- RTL requirements if MENA detected in PRD

Confirm: "✅ Custom DESIGN.md created based on your vision"

**Design Lock Ceremony:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  DESIGN LOCKED: DESIGN.md

Profile:    [chosen profile name OR "Custom"]
Style:      [detected style summary]
Colors:     [primary / secondary / accent]
Typography: [detected font family or style]
Mode:       [light / dark / both]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Update `.cursor/state/onboarding.yaml`:
```yaml
design_locked: true
design_profile: "[name or custom]"
design_locked_at: "[timestamp]"
```

---

#### Step 4: Final Gate Check + Unlock /plan

After PRD and DESIGN are both locked, show:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ONBOARDING COMPLETE — Gates Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅  docs/prd/PRD.md     → Locked
✅  DESIGN.md           → Locked
✅  docs/plans/         → Ready
✅  docs/reports/       → Ready (7 categories)
🔓  /plan               → UNLOCKED — ready to use

🔒  /develop            → Locked until /plan is complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next step: Run /plan to generate your execution roadmap
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### TASK 2 — Hardlock: /plan blocked until PRD + DESIGN exist

**File to update:** `.cursor/commands/plan.md` (top section only — add to existing hard block line)

Replace the existing hard block rule with:

```
Hard block:
  /plan (any subcommand) requires ALL of:
  1. docs/prd/PRD.md exists and is not a blank template
     (check: file has >10 non-comment lines)
  2. DESIGN.md exists at repo root and is not a blank template
  3. .cursor/state/onboarding.yaml has prd_locked: true AND design_locked: true

If any check fails:
  → Read .cursor/state/onboarding.yaml to detect which step is missing
  → Tell user exactly which step is missing and how to fix it
  → Do NOT run any /plan subcommand
  → Redirect to /start

Example gate failure message:
  ❌ /plan is locked.
     PRD is complete but DESIGN.md is missing.
     → Run /start and choose a design profile to unlock /plan.
```

---

### TASK 3 — Hardlock: /plan is a sequential pipeline that MUST run to completion before /develop unlocks

**File to update:** `.cursor/commands/plan.md` (add new section at bottom)

Add this section:

```markdown
## Planning Completion Gate

While /plan is active, /develop is HARDLOCKED.

The planning pipeline must complete ALL of these phases in order:
1. /plan seo        → SEO_RESEARCH.md
2. /plan ia         → IA_CONTENT.md  
3. /plan content    → CONTENT_MAP.md
4. /plan arch       → ARCHITECTURE.md
5. /plan design wireframes → DESIGN_CHOICES.md + updated DESIGN.md
6. /plan scaffold   → PROJECT_SCAFFOLD.md + scripts/scaffold.sh

State is tracked in .cursor/state/plan_progress.yaml:

```yaml
seo: false
ia: false
content: false
arch: false
design_wireframes: false
scaffold: false
planning_complete: false
```

After each phase completes, set its flag to true.
When ALL flags are true, set planning_complete: true.

When planning_complete becomes true, show:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  PLANNING COMPLETE

✅  SEO Research      → docs/plans/01-research/SEO_RESEARCH.md
✅  Info Architecture → docs/plans/02-ia/IA_CONTENT.md
✅  Content Map       → docs/plans/03-content/CONTENT_MAP.md
✅  Architecture      → docs/plans/04-arch/ARCHITECTURE.md
✅  Design Wireframes → docs/plans/04-design/DESIGN_CHOICES.md
✅  Project Scaffold  → docs/plans/scaffold/PROJECT_SCAFFOLD.md

🔓  /develop  → UNLOCKED — ready to use

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Run /develop start to begin Phase 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**DURING PLANNING: if user tries to run /develop:**
Show this message:
```
🔒  /develop is locked during planning.

Planning is still in progress. Complete all plan phases first:
[show current plan_progress.yaml status with ✅/⏳ per phase]

Continue with: /plan [next incomplete phase]
```

Do NOT execute any /develop action. Do NOT show partial results. Full stop.
```

---

### TASK 4 — Sequential Phase Hardlock for /develop

**File to update:** `.cursor/commands/develop.md`

#### Phase State File

Create and maintain `.cursor/state/develop_phases.yaml`:

```yaml
phases:
  phase_1:
    name: "Foundation"
    description: "Core architecture, auth, database schema, base UI"
    status: "unlocked"          # unlocked | in_progress | testing | complete | locked
    testing_passed: false
    unlocked_at: ""
    completed_at: ""

  phase_2:
    name: "Core Features"
    description: "Primary user-facing features from MASTER_TASKS.md"
    status: "locked"
    testing_passed: false
    depends_on: "phase_1"
    unlocked_at: ""
    completed_at: ""

  phase_3:
    name: "Secondary Features"
    description: "Supporting features, integrations, admin"
    status: "locked"
    testing_passed: false
    depends_on: "phase_2"
    unlocked_at: ""
    completed_at: ""

  phase_4:
    name: "Polish & Optimization"
    description: "Performance, a11y, SEO, UX refinement"
    status: "locked"
    testing_passed: false
    depends_on: "phase_3"
    unlocked_at: ""
    completed_at: ""

  phase_5:
    name: "Hardening"
    description: "Security audit, load testing, monitoring, edge cases"
    status: "locked"
    testing_passed: false
    depends_on: "phase_4"
    unlocked_at: ""
    completed_at: ""

  phase_6:
    name: "Ship"
    description: "Staging deploy, QA sign-off, production release"
    status: "locked"
    testing_passed: false
    depends_on: "phase_5"
    unlocked_at: ""
    completed_at: ""
```

#### Phase Gate Rules (add to develop.md)

```markdown
## Sequential Phase Hardlock

Before ANY /develop action, check .cursor/state/develop_phases.yaml.

RULE: Only ONE phase can be in_progress or testing at any time.
RULE: A phase can only start when the previous phase status is "complete".
RULE: A phase moves to "complete" only when testing_passed is true.
RULE: Phases 2–6 remain "locked" until their depends_on phase is "complete".

### Phase Transition Protocol

When user runs /develop start (at beginning of each phase):
1. Read develop_phases.yaml
2. Identify the current active phase (status: unlocked)
3. Set it to in_progress
4. Show phase brief: name, description, tasks for this phase from MASTER_TASKS.md
5. Begin implementation

When user runs /develop review (signals phase work is done):
1. Run the following checks automatically:
   - All acceptance criteria for phase tasks are met
   - Tests written and passing (check docs/reports/tests/)
   - No TODO or FIXME comments in phase files
   - DESIGN.md compliance (tokens used, no hardcoded values)
   - a11y gate passes (WCAG 2.2 AA)
2. If all pass → set status: "testing", show testing checklist
3. If any fail → list exactly what failed → do NOT advance

When user runs /develop complete [phase_n]:
1. Verify testing checklist is signed off
2. Set current phase: status: "complete", testing_passed: true
3. Set next phase: status: "unlocked"
4. Write unlock ceremony to chat

### Unlock Ceremony (between phases)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉  PHASE [N] COMPLETE — [Phase Name]

Tests passed:    ✅
Design gates:    ✅  
A11y gates:      ✅
TODOs cleared:   ✅

🔓  PHASE [N+1] UNLOCKED — [Next Phase Name]
    [brief description of what's next]

🔒  PHASES [N+2] through 6 → Still locked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Run /develop start to begin Phase [N+1]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Attempt to Access Locked Phase

If user tries to work on a locked phase:
```
🔒  Phase [N] is locked.

Phase [N-1] must be complete first.
Current status: [phase name] is [status]

[If in_progress]: Continue with /develop feature or /develop ui or /develop api
[If testing]:     Complete testing checklist → run /develop complete phase_[n-1]
[If unlocked]:    Run /develop start to begin Phase [N-1]
```

### Phase Content (generated from MASTER_TASKS.md)

When generating phases, read docs/plans/MASTER_TASKS.md and split tasks by:
- Phase 1: Tasks tagged [P0] foundation, auth, database, base-ui
- Phase 2: Tasks tagged [P1] core-feature
- Phase 3: Tasks tagged [P1] secondary, integration, admin
- Phase 4: Tasks tagged [P2] polish, performance, seo, a11y
- Phase 5: Tasks tagged [P2] security, hardening, monitoring
- Phase 6: Tasks tagged [P3] deploy, release, ship

If MASTER_TASKS.md doesn't have phase tags, assign automatically based on dependency order.
```

---

### TASK 5 — Improve Wireframes in /plan design wireframes

**File to update:** `.cursor/commands/plan.md` — update the `/PLAN design wireframes` section

Replace the existing wireframes section with:

```markdown
### /PLAN design wireframes — High-Fidelity ASCII Wireframe System

Activated by: `/plan design wireframes`
Hard block: IA_CONTENT.md must exist (has list of pages/screens)

**Philosophy:**
Every wireframe must be a precise spatial contract — not a sketch. 
It defines layout, hierarchy, spacing rhythm, component slots, 
interaction states, and content areas. It is the bridge between 
IA and implementation. Developers should be able to implement from 
wireframes alone without guessing anything.

#### Wireframe Quality Standards

Each wireframe MUST include:
1. **Exact grid structure** — column count, sidebar widths, content zones
2. **Component slots** — every UI component labeled with its name and variant
3. **Content hierarchy** — H1/H2/body/caption zones clearly marked
4. **Interactive states** — default, hover, active, empty, loading, error
5. **Spacing annotations** — gap sizes labeled (sm/md/lg using token names)
6. **Navigation context** — where this screen sits in the user journey
7. **Responsive breakpoints** — show mobile and desktop versions
8. **Accessibility notes** — tab order, focus zones, landmark roles

#### Wireframe Format (use this exact structure)

```
┌─────────────────────────────────────────────────────────────┐
│  SCREEN: [Screen Name]     ID: [screen_id]                  │
│  Journey: [where in user flow]    Type: [page type]         │
│  Breakpoint: [Desktop 1440px / Mobile 390px]                │
└─────────────────────────────────────────────────────────────┘

DESKTOP LAYOUT — 12-column grid, 1440px
┌──────────────────────────────────────────────────────────────┐
│ [NAV] ← Logo [3col]  Navigation [6col]   CTA + Avatar [3col] │
│  gap: lg between nav items                                    │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│                    [HERO SECTION]                             │
│  ┌─────────────────────────┐  ┌────────────────────────┐    │
│  │  Heading H1             │  │  [Image / Illustration] │    │
│  │  Subheading / tagline   │  │   ratio: 16:9           │    │
│  │  ──────────────────     │  │                        │    │
│  │  [Primary CTA Button]   │  │   State: default        │    │
│  │  [Secondary Link]       │  │   Loading: skeleton     │    │
│  └─────────────────────────┘  └────────────────────────┘    │
│  Content zone: 7col           Image zone: 5col               │
│  padding: xl top/bottom, container max-width: 1280px         │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│                [FEATURES GRID]                                │
│  Title H2 — centered, max-width 600px                        │
│  Subtitle — centered, color: muted                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ [Icon]   │  │ [Icon]   │  │ [Icon]   │                   │
│  │ Title    │  │ Title    │  │ Title    │                   │
│  │ Body text│  │ Body text│  │ Body text│                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│  3-col grid, gap: lg, card padding: md                       │
│  States: hover → card elevation-2, border-color: primary     │
└──────────────────────────────────────────────────────────────┘

MOBILE LAYOUT — 4-column grid, 390px
[Show mobile stack — components in single column, nav → hamburger]

STATES TO SHOW:
  Default:  [as above]
  Loading:  [skeleton placeholders in same layout]
  Empty:    [empty state component + prompt]
  Error:    [error banner + retry action]

COMPONENT INVENTORY:
  • NavBar (variant: transparent-on-scroll)
  • HeroSection (variant: split-image)
  • FeatureCard (variant: icon-top, hover: elevated)
  • CTAButton (variant: primary, size: lg)
  • CTAButton (variant: ghost, size: lg)

ACCESSIBILITY:
  Tab order:   Logo → Nav items → CTA → Hero CTA → Feature cards
  Landmarks:   <header>, <main>, <section aria-label="Features">
  Focus rings: visible, 2px offset, color: primary-500
  Screen reader: hero image has descriptive alt text
```

#### Element Selection Flow

Present wireframes ONE ELEMENT AT A TIME. For each:
1. Show the wireframe preview above
2. Show 3 variant options labeled A/B/C
3. Wait for user to pick
4. Confirm pick → show next element

**Element sequence (adapt by product type):**

| # | Website | Webapp/SaaS | Mobile |
|---|---------|-------------|--------|
| 1 | Navigation / Header | App Shell + Navigation | Bottom Nav / Tab Bar |
| 2 | Hero / Above-fold | Dashboard Layout | Home Screen |
| 3 | Feature/Content Grid | Data Table or Card List | List / Feed Screen |
| 4 | Pricing / CTA Section | Detail / Edit View | Detail Screen |
| 5 | Social Proof / Testimonials | Empty States | Onboarding Flow |
| 6 | Footer | Settings Page | Profile Screen |

For Webapp/SaaS also add:
- Sidebar navigation (collapsible vs. persistent)
- Modal / Drawer pattern
- Notification system (toast / banner / badge)
- Form layout (single column vs. multi-step)

#### After All Elements Selected

Generate:

**1. `docs/plans/04-design/DESIGN_CHOICES.md`** — YAML of all selections:
```yaml
wireframe_selections:
  navigation:
    variant: "A"
    description: "Sticky top nav with transparent scroll"
    components: ["Logo", "NavLinks", "CTAButton", "MobileHamburger"]
  hero:
    variant: "B"
    description: "Split layout — text left, visual right"
    components: ["Heading", "Subheading", "CTAPrimary", "CTASecondary", "HeroImage"]
  # ... etc for each element
```

**2. Updated `DESIGN.md`** — full design contract including:
- All tokens with values (not just names)
- Component specifications for every selected component
- Layout grid documentation  
- Animation/motion spec (duration, easing, reduced-motion alternatives)
- Dark mode token overrides
- Each screen mapped to its wireframe selection

**3. `docs/prd/sdd/WIREFRAMES.md`** — complete wireframe doc:
- All screens with full ASCII wireframes as shown above
- Every screen_id mapped to its page from IA_CONTENT.md
- States documented (default, hover, loading, empty, error)
- Accessibility notes per screen
- Component inventory per screen

Show all three outputs in chat → ask: "Does this match what you want? Type YES to lock or tell me what to change."

On YES → set design_wireframes: true in .cursor/state/plan_progress.yaml
```

---

### TASK 6 — Create State Files and Gate Check Logic

**Create:** `.cursor/state/onboarding.yaml`

```yaml
# NEZAM Project State — managed by /start and gate checks
# Do not edit manually. Use /start, /plan, /develop commands.

prd_locked: false
prd_path: "docs/prd/PRD.md"
prd_locked_at: ""

design_locked: false  
design_profile: ""
design_locked_at: ""

planning_complete: false
planning_completed_at: ""

current_phase: 0
```

**Create:** `.cursor/state/plan_progress.yaml`

```yaml
# /plan phase completion state — managed by /plan command
# Set by agent after each phase completes.

seo: false
ia: false
content: false
arch: false
design_wireframes: false
scaffold: false
planning_complete: false
```

**Create:** `.cursor/state/develop_phases.yaml`

```yaml
# /develop phase state — managed by /develop command
# Phases unlock sequentially. Do not manually edit.

phases:
  phase_1:
    name: "Foundation"
    description: "Core architecture, auth, database schema, base UI components"
    status: "locked"
    testing_passed: false
    depends_on: null
    unlocked_at: ""
    completed_at: ""

  phase_2:
    name: "Core Features"
    description: "Primary user-facing features from MASTER_TASKS.md [P1]"
    status: "locked"
    testing_passed: false
    depends_on: "phase_1"
    unlocked_at: ""
    completed_at: ""

  phase_3:
    name: "Secondary Features"
    description: "Supporting features, third-party integrations, admin surfaces"
    status: "locked"
    testing_passed: false
    depends_on: "phase_2"
    unlocked_at: ""
    completed_at: ""

  phase_4:
    name: "Polish & Optimization"
    description: "Performance, a11y, SEO refinement, UX polish"
    status: "locked"
    testing_passed: false
    depends_on: "phase_3"
    unlocked_at: ""
    completed_at: ""

  phase_5:
    name: "Hardening"
    description: "Security audit, load testing, monitoring, edge case coverage"
    status: "locked"
    testing_passed: false
    depends_on: "phase_4"
    unlocked_at: ""
    completed_at: ""

  phase_6:
    name: "Ship"
    description: "Staging deploy, QA sign-off, production release"
    status: "locked"
    testing_passed: false
    depends_on: "phase_5"
    unlocked_at: ""
    completed_at: ""
```

**Update:** `.cursor/rules/workspace-client-onboarding-gate.mdc`

Add these gate checks at the top of the rule:

```
## Global Hardlock Gate (reads .cursor/state/onboarding.yaml)

Before any /plan subcommand:
  1. Read .cursor/state/onboarding.yaml
  2. If prd_locked is false → block /plan → redirect to /start
  3. If design_locked is false → block /plan → redirect to /start, tell user to pick design profile

Before any /develop subcommand:
  1. Read .cursor/state/onboarding.yaml
  2. If planning_complete is false → block /develop → read plan_progress.yaml → show which plan phases are incomplete
  3. Read .cursor/state/develop_phases.yaml
  4. Identify which phase is "unlocked" (at most one)
  5. If user is attempting work in a phase that is "locked" → show lock message → stop

Before /deploy:
  1. develop_phases.phase_5.status must be "complete"
  2. If not → block → redirect to complete Phase 5 (Hardening)
```

---

## Implementation Order for Cursor / Claude Code

Execute in this sequence — do NOT skip ahead:

**Step 1:** Create `.cursor/state/` directory and all three YAML state files  
**Step 2:** Rewrite `.cursor/commands/start.md` (Task 1 above)  
**Step 3:** Update `.cursor/commands/plan.md` — add hard block rules + planning completion gate (Task 2 + 3)  
**Step 4:** Update `.cursor/commands/develop.md` — add sequential phase hardlock (Task 4)  
**Step 5:** Update the `/PLAN design wireframes` section in `plan.md` (Task 5)  
**Step 6:** Update `.cursor/rules/workspace-client-onboarding-gate.mdc` — add global gate checks (Task 6)  
**Step 7:** Sync all changes to mirror clients: run `pnpm ai:sync` or manually copy to `.claude/commands/`, `.gemini/commands/`, `.opencode/commands/`

---

## Validation Checklist (run after implementation)

Test these flows manually:

- [ ] `/start` with no subcommand shows the 4-choice PRD menu
- [ ] Mode 1 (describe) → writes PRD → shows lock ceremony → shows design choice menu
- [ ] Mode 2 (interview) → asks questions one by one → brainstorm block → writes PRD
- [ ] Mode 3 (paste/upload) → parses content → flags gaps → improves → rewrites
- [ ] Mode 4 (direct add) → waits for READY → accepts file as-is
- [ ] After PRD lock → design menu appears (A or B)
- [ ] Design A → lists profiles by category → user picks → copies to DESIGN.md
- [ ] Design B → asks 5 questions → generates custom DESIGN.md
- [ ] After design lock → shows gate status → /plan unlocked message
- [ ] `/plan` before PRD → blocked with clear message
- [ ] `/plan` after PRD but before design → blocked with clear message
- [ ] `/plan seo` → creates SEO_RESEARCH.md → sets plan_progress.seo: true
- [ ] All 6 plan phases complete → planning_complete: true → /develop unlocked
- [ ] `/develop` during planning → blocked with plan progress shown
- [ ] `/develop start` → begins Phase 1 → sets status: in_progress
- [ ] `/develop review` in Phase 1 → runs gate checks → sets status: testing
- [ ] `/develop complete phase_1` → sets phase_1 complete → unlocks phase_2
- [ ] Attempt Phase 3 work during Phase 2 → blocked with unlock message
- [ ] `/plan design wireframes` → shows one element at a time → high-fidelity ASCII wireframes
- [ ] Wireframe selection generates DESIGN_CHOICES.md + DESIGN.md + WIREFRAMES.md

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `.cursor/state/onboarding.yaml` | CREATE |
| `.cursor/state/plan_progress.yaml` | CREATE |
| `.cursor/state/develop_phases.yaml` | CREATE |
| `.cursor/commands/start.md` | REWRITE |
| `.cursor/commands/plan.md` | UPDATE (hard block + completion gate + wireframes section) |
| `.cursor/commands/develop.md` | UPDATE (sequential phase hardlock) |
| `.cursor/rules/workspace-client-onboarding-gate.mdc` | UPDATE (global gate checks) |
| `.claude/commands/start.md` | SYNC (copy from .cursor/) |
| `.claude/commands/plan.md` | SYNC (copy from .cursor/) |
| `.claude/commands/develop.md` | SYNC (copy from .cursor/) |

---

## Tone and Behavior Notes

- All gate failure messages must say EXACTLY what's missing and EXACTLY how to fix it. No vague errors.
- User-facing menus use `━` borders for visual separation. Consistent formatting throughout.
- Brainstorm suggestions must be product-specific — no generic advice.
- Wireframes must be precise enough to hand to a developer without design meetings.
- Every hardlock has a clear unlock path. Users should never feel stuck without knowing why or what to do next.
- The system is designed for beginners — assume the user doesn't know the SDD pipeline. Explain each gate when it appears.
