/DEVELOP — Build, implement, and iterate on features

Subcommands:
  /DEVELOP start    → Session kickoff: confirm branch, spec, design profile, env keys
  /DEVELOP ui       → Build frontend components, pages, layouts (uses design tokens, RSC)
  /DEVELOP api      → Build backend routes, services, data access layer
  /DEVELOP db       → Schema migrations, Supabase RLS, Prisma models
  /DEVELOP feature  → Implement a full vertical feature slice end-to-end
  /DEVELOP cms      → Headless CMS integration and content modeling
  /DEVELOP auth     → Authentication and authorization flows
  /DEVELOP payments → Payment gateway integration (Stripe, MENA regional providers)
  /DEVELOP animate  → Motion and micro-interaction implementation
  /DEVELOP review   → Pre-merge readiness check against DESIGN.md + acceptance criteria
  /DEVELOP audit    → Lightweight implementation audit: TODOs, debt, env assumptions

Aliases: /DEVELOP fe → /DEVELOP ui | /DEVELOP be → /DEVELOP api | /DEVELOP slice → /DEVELOP feature

### Phase State File

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

### Sequential Phase Hardlock

Before ANY /develop action, check `.cursor/state/develop_phases.yaml`.

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

Hard block: All 10 SDD prerequisites must pass (PRD, PROJECT_PROMPT, CHANGELOG, VERSIONING,
            ARCHITECTURE, DESIGN.md, GATE_MATRIX, subphase prompt artifacts).
Gate failure → /GUIDE status shows exact unlock steps.
Recommendation footer: required

### Spec Version Check (runs before every /DEVELOP feature)
1. Read the `SPEC.md` for the target feature.
2. Confirm `status: approved` — if `draft`, halt and ask user to approve first.
3. Record `built_at_version` in `SPEC.md` from current `CHANGELOG.md` top version.
4. Bump `spec_version` patch on any amendment (e.g. 0.1.0 → 0.1.1).
5. Bump `spec_version` minor on acceptance criteria changes (e.g. 0.1.0 → 0.2.0).
6. Bump `spec_version` major on scope changes that require design rework (e.g. 0.1.0 → 1.0.0).
