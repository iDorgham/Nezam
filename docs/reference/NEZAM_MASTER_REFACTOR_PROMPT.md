# NEZAM Master Refactor — Cursor Prompt
# Paste into Cursor chat. This is the definitive workspace cleanup and upgrade prompt.
# Canonical source: .cursor/ — run `pnpm ai:sync` after ALL changes are complete.
# Execute tracks in order. Do not begin a track until the previous is confirmed complete.

---

You are operating as **PM-01 Swarm Leader** coordinating a full workspace refactor sprint.

This prompt covers 8 tracks:
- Track 1: Commands — simplify, unify, add subcommands
- Track 2: SDD planning flow — redesign pipeline and docs tree
- Track 3: Task manager — upgrade to comprehensive system
- Track 4: Cleanup — delete dead files, fix empty skill stubs
- Track 5: Skills — strip coi- prefix, rename, reorganize into categories
- Track 6: Agents — rename, consolidate, fix naming consistency
- Track 7: Swarm team communications — improve routing and handoff
- Track 8: /GUIDE — full rewrite

**Hard rule:** Never weaken or delete any existing `.cursor/rules/*.mdc` hardlock. All changes are either additive or reorganizational (rename/move). No hardlock logic is removed.

---

## ════════════════════════════════════════
## TRACK 1 — COMMANDS: SIMPLIFY & UNIFY
## ════════════════════════════════════════

### OBJECTIVE

Keep the same 9 top-level commands but redesign their subcommands to be intuitive, easy to remember, and consistently structured across all commands. Add `/GIT` as a first-class command (currently only as `save` behavior). Remove the `sync.md` command (absorb into `/GIT sync`).

### NEW COMMAND SURFACE

All commands follow pattern: `/COMMAND verb` or `/COMMAND noun`
All subcommands are single, memorable words — no compound phrases.

---

### `.cursor/commands/start.md` — REWRITE

Replace content with:

```
/START — Initialize workspace and check readiness

Subcommands:
  /START repo       → Link or initialize your git repository
  /START docs       → Create required folder structure and context files
  /START gates      → Run all prerequisite checks. Shows ✅/❌ per gate in plain language.
  /START design     → Browse available design profiles, pick one, copy to DESIGN.md
  /START companion  → Generate a briefing you can paste into any external AI (Claude.ai, Gemini, ChatGPT)
  /START all        → Run everything above in sequence (recommended for new projects)

Aliases: /START check → /START gates

Hard blocks: none (START is always available)
Recommendation footer: required
```

---

### `.cursor/commands/plan.md` — REWRITE

Replace content with:

```
/PLAN — Specification-driven planning across all product dimensions

Subcommands (in recommended execution order):
  /PLAN idea        → Guided PRD creation — 7 questions, auto-generates all required planning docs
  /PLAN seo         → Keyword research, search intent mapping, slug rules → SEO_RESEARCH.md
  /PLAN ia          → Information architecture, pages, navigation, URL map → IA_CONTENT.md
  /PLAN content     → Page copy, hero sections, microcopy, voice/tone → CONTENT_MAP.md
  /PLAN design      → Design system contract: tokens, typography, motion, components → DESIGN.md
  /PLAN arch        → System architecture, tech stack decisions, data model → ARCHITECTURE.md
  /PLAN tech        → Technical feasibility, stack evaluation, cost estimate
  /PLAN tasks       → Generate full task breakdown from specs into MASTER_TASKS.md
  /PLAN roadmap     → Milestone timeline, phase dependencies, SemVer bumps
  /PLAN brand       → Brand voice, visual identity direction, tone guidelines
  /PLAN all         → Run complete SDD sequence: seo → ia → content → design → arch → tasks

Aliases: /PLAN menus → /PLAN ia | /PLAN copy → /PLAN content | /PLAN spec → /PLAN arch

Hard block: PRD.md must exist and be non-template before any subcommand runs.
PRD missing → redirect to /PLAN idea
Recommendation footer: required
```

---

### `.cursor/commands/develop.md` — REWRITE

Replace content with:

```
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

Hard block: All 10 SDD prerequisites must pass (PRD, PROJECT_PROMPT, CHANGELOG, VERSIONING,
            ARCHITECTURE, DESIGN.md, GATE_MATRIX, subphase prompt artifacts).
Gate failure → /GUIDE status shows exact unlock steps.
Recommendation footer: required
```

---

### `.cursor/commands/scan.md` — REWRITE

Replace content with:

```
/SCAN — Read-only diagnostic scans. Never modifies files.

Subcommands:
  /SCAN security    → SAST, dependency vulnerabilities, secret detection, threat model check
  /SCAN perf        → Lighthouse CI, Core Web Vitals, bundle size, render blocking
  /SCAN a11y        → WCAG 2.2 AA audit, color contrast, keyboard nav, screen reader labels
  /SCAN seo         → On-page SEO, meta tags, structured data, canonical URLs, sitemap
  /SCAN code        → Code quality: lint, type errors, dead code, complexity metrics
  /SCAN deps        → Dependency audit: outdated packages, license conflicts, vulnerabilities
  /SCAN content     → Content quality: readability, tone consistency, missing copy, broken links
  /SCAN design      → Design token compliance: check for hardcoded px/hex/rem outside tokens
  /SCAN all         → Run all scans in sequence, produce unified report

All scan reports write to docs/reports/<category>/<timestamp>.md
Aliases: /SCAN audit → /SCAN all | /SCAN perf → /SCAN perf

Hard block: none (scans are always safe to run)
Recommendation footer: required
```

---

### `.cursor/commands/fix.md` — REWRITE

Replace content with:

```
/FIX — Triage, patch, and verify issues

Subcommands:
  /FIX auto         → Detect issue type from context, auto-route to correct fix subcommand
  /FIX security     → Patch SAST findings, update vulnerable deps, rotate exposed secrets
  /FIX perf         → Resolve Core Web Vitals failures, optimize images/fonts/bundles
  /FIX a11y         → Fix WCAG violations: contrast, ARIA, focus management, landmark structure
  /FIX lint         → Auto-fix linting and formatting errors
  /FIX types        → Resolve TypeScript type errors
  /FIX test         → Fix failing unit/integration/e2e tests
  /FIX content      → Fix copy errors, broken links, SEO issues flagged by /SCAN content
  /FIX design       → Remove hardcoded design primitives, enforce token compliance
  /FIX triage       → List all known issues prioritized by severity — no fixes applied yet
  /FIX verify       → After a fix, re-run relevant scans to confirm resolution

Loop: /SCAN → /FIX → /FIX verify (repeat until clean)
PM-01 routing authority applies. Each fix follows: triage → patch → verify → log.
Recommendation footer: required
```

---

### `.cursor/commands/git.md` — CREATE NEW (absorbs save.md + sync.md)

Create `.cursor/commands/git.md`:

```
/GIT — Version control, commits, releases, and sync

Subcommands:
  /GIT save         → Stage changes and create a conventional commit with auto-generated message
  /GIT branch       → Create a feature/fix/release branch following naming conventions
  /GIT push         → Push current branch, verify CI status
  /GIT tag          → Create a SemVer release tag (follows VERSIONING.md rules)
  /GIT release      → Full release flow: tag → CHANGELOG update → release notes → push
  /GIT rollback     → Revert last deployment or commit with safe rollback plan
  /GIT sync         → Sync generated AI client surfaces (runs pnpm ai:sync + pnpm ai:check)
  /GIT log          → Save progress log entry to docs/workspace/context/MEMORY.md
  /GIT report       → Generate progress report → docs/reports/progress/PROGRESS_REPORT.latest.md
  /GIT hooks        → Install git hooks for auto-context updates

Commit format enforced: feat|fix|docs|style|refactor|perf|test|chore(scope): description
Aliases: /GIT commit → /GIT save | /GIT checkpoint → /GIT save

Delete: .cursor/commands/save.md and .cursor/commands/sync.md after creating this file.
        Their behaviors are fully absorbed here.
Recommendation footer: required
```

---

### `.cursor/commands/deploy.md` — REWRITE

Replace content with:

```
/DEPLOY — Ship, verify, and monitor releases

Subcommands:
  /DEPLOY staging   → Deploy to staging environment, run smoke tests
  /DEPLOY prod      → Deploy to production (requires staging sign-off)
  /DEPLOY verify    → Post-deploy verification: health checks, error rates, performance
  /DEPLOY rollback  → Revert to last known-good deployment with one command
  /DEPLOY monitor   → Show live deployment metrics and error dashboard
  /DEPLOY rc        → Create a release candidate build for QA sign-off
  /DEPLOY notes     → Generate human-readable release notes from CHANGELOG

Pre-flight: staging sign-off required before /DEPLOY prod.
All deploy events logged to CHANGELOG.md automatically.
Recommendation footer: required
```

---

### `.cursor/commands/guide.md` — DEFER to Track 8 (full rewrite)

---

### `.cursor/commands/create.md` — REWRITE

Replace content with:

```
/CREATE — Scaffold documents, prompts, and workspace artifacts

Subcommands:
  /CREATE prd           → Guided PRD creation with 7-question interview
  /CREATE prompt        → Scaffold PROJECT_PROMPT.md aligned to PRD
  /CREATE spec          → Create a feature spec under docs/core/required/features/<slug>/
  /CREATE task          → Add a task to MASTER_TASKS.md with ID, owner, phase, metric
  /CREATE report        → Initialize a fresh progress report shell
  /CREATE handoff       → Generate AI handoff packet for external AI companion
  /CREATE design        → Create a new design profile in .cursor/design/<name>/design.md
  /CREATE agent         → Scaffold a new agent file with standard frontmatter
  /CREATE skill         → Scaffold a new skill folder with SKILL.md template
  /CREATE changelog     → Initialize CHANGELOG.md at workspace root if missing

Aliases: /CREATE feature → /CREATE spec | /CREATE doc → /CREATE prompt
Recommendation footer: required
```

---

### `.cursor/commands/help.md` — REWRITE

Replace content with a clean one-page command reference:

```
/HELP — Full command reference

WORKFLOW ORDER (follow this sequence):
  1. /START all          → Set up workspace
  2. /PLAN idea          → Describe your product (generates all planning docs)
  3. /PLAN seo           → Audience and keyword research
  4. /PLAN ia            → Pages and navigation structure
  5. /PLAN content       → Words, copy, voice
  6. /PLAN design        → Visual design system
  7. /PLAN arch          → Technical architecture
  8. /DEVELOP start      → Begin building
  9. /DEVELOP feature    → Build each feature
  10. /SCAN all          → Quality check everything
  11. /FIX auto          → Fix any issues
  12. /GIT release       → Tag and document the release
  13. /DEPLOY staging    → Ship to staging
  14. /DEPLOY prod       → Go live

DAILY WORKFLOW:
  Morning:  /DAY start           → Where you are, what to do
  Anytime:  /GUIDE status        → Full pipeline status
  Evening:  /GIT log + /GIT save → Save progress

QUICK REFERENCE:
  /START   repo|docs|gates|design|companion|all
  /PLAN    idea|seo|ia|content|design|arch|tech|tasks|roadmap|brand|all
  /DEVELOP start|ui|api|db|feature|cms|auth|payments|animate|review|audit
  /SCAN    security|perf|a11y|seo|code|deps|content|design|all
  /FIX     auto|security|perf|a11y|lint|types|test|content|design|triage|verify
  /GIT     save|branch|push|tag|release|rollback|sync|log|report|hooks
  /DEPLOY  staging|prod|verify|rollback|monitor|rc|notes
  /CREATE  prd|prompt|spec|task|report|handoff|design|agent|skill|changelog
  /GUIDE   status|next|phase|full|help
  /DAY     start|check|done|stuck|help
  /WHAT    <any term>
  /PLAIN   <natural language>
  /HELP    → this message
```

---

## ════════════════════════════════════════
## TRACK 2 — SDD PLANNING FLOW REDESIGN
## ════════════════════════════════════════

### OBJECTIVE

Redesign the docs tree to match a clear, logical SDD pipeline:
`Define → Research → Design → Content → Build → Harden → Ship`

Rename planning phases to match this flow. Improve all template files. Create missing templates.

---

### NEW DOCS FOLDER STRUCTURE

Rename and restructure `docs/workspace/plans/` to:

```
docs/workspace/plans/
  00-define/              # PRD, PROJECT_PROMPT, scope
    01-product/           # PRD.md, PROJECT_PROMPT.md, SCOPE.md
    02-architecture/      # ARCHITECTURE.md, tech stack decisions
    03-roadmap/           # ROADMAP.md, VERSIONING.md, milestones
  01-research/            # Was: 01-content/01-research
    01-seo/               # SEO_RESEARCH.md, keyword clusters, SERP analysis
    02-audience/          # User personas, jobs-to-be-done
    03-competitive/       # Competitor analysis, positioning
  02-design/              # Was: 02-design (keep structure, improve)
    01-tokens/            # Design tokens, color system, typography scale
    02-flows/             # User journey maps, interaction flows
    03-components/        # Component API specs (was: 03-ui-kit)
    04-pages/             # Page layout specs, responsive breakpoints
    05-motion/            # Animation contracts, reduced-motion specs
  03-content/             # Was: 01-content/02-strategy + 03-create + 04-compliance
    01-strategy/          # Content strategy, IA_CONTENT.md, navigation
    02-copy/              # CONTENT_MAP.md, page copy, microcopy
    03-seo-content/       # On-page SEO, meta tags, structured data
    04-compliance/        # Legal, GDPR, accessibility statements
  04-build/               # Was: 03-build
    01-backend/           # API specs, DB schema, auth flows
    02-frontend/          # Component implementation, routing, state
    03-features/          # Feature slices — one subfolder per feature
    04-integrations/      # Third-party services, CMS, payments
    05-tests/             # Test plans, coverage requirements
  05-harden/              # Was: 04-harden
    01-security/          # Security audit results, threat model
    02-performance/       # Lighthouse targets, optimization plan
    03-a11y/              # WCAG compliance checklist
    04-qa/                # QA test results, regression log
  06-ship/                # Was: 05-ship
    01-staging/           # Staging deployment checklist
    02-production/        # Production release checklist
    03-monitoring/        # Post-launch monitoring setup
  gates/                  # GITHUB_GATE_MATRIX.json (keep as-is)
  templates/              # All templates (keep, improve below)
  MASTER_TASKS.md         # Keep, improve (see Track 3)
  INDEX.md                # Auto-generated traceability index
```

**Migration instructions:**
- Move `docs/workspace/plans/01-content/01-research/` → `docs/workspace/plans/01-research/01-seo/`
- Move `docs/workspace/plans/01-content/02-strategy/` → `docs/workspace/plans/03-content/01-strategy/`
- Move `docs/workspace/plans/01-content/03-create/` → `docs/workspace/plans/03-content/02-copy/`
- Move `docs/workspace/plans/01-content/04-compliance/` → `docs/workspace/plans/03-content/04-compliance/`
- Move `docs/workspace/plans/02-design/*` → `docs/workspace/plans/02-design/*` (keep, just add 05-motion)
- Move `docs/workspace/plans/03-build/*` → `docs/workspace/plans/04-build/*`
- Move `docs/workspace/plans/04-harden/*` → `docs/workspace/plans/05-harden/*`
- Move `docs/workspace/plans/05-ship/*` → `docs/workspace/plans/06-ship/*`
- Create new `docs/workspace/plans/00-define/` with placeholder TASKS.md

---

### IMPROVED TEMPLATES

**Update `docs/workspace/templates/sdd/PRD_TEMPLATE.md`** — ensure it contains:

```markdown
# Product Requirements Document
**Project:** [name]
**Version:** 0.1.0
**Date:** [date]
**Status:** Draft | Review | Approved

## 1. Problem Statement
[What problem does this solve and for whom?]

## 2. Target Users
[Who will use this? Include region, technical level, language]

## 3. Product Vision
[One sentence: what this product is and what it does]

## 4. MVP Scope
[What is included in version 1.0]

## 5. Out of Scope
[What is explicitly NOT included]

## 6. User Stories
[As a [user], I want [action] so that [benefit]]

## 7. Success Metrics
[How will we know this is working? Measurable outcomes]

## 8. Technical Constraints
[Stack requirements, budget, platform, compliance]

## 9. Market Context
[Competitors, inspiration, differentiation]

## 10. Risks
[What could go wrong and how we'll mitigate it]

## 11. Timeline
[Rough phases and target dates]
```

**Create `docs/workspace/templates/sdd/FEATURE_SPEC_TEMPLATE.md`**:

```markdown
# Feature Spec: [Feature Name]
**ID:** FEAT-[number]
**Phase:** [04-build/03-features/feat-[number]-[slug]]
**Status:** Draft | Review | Approved | In Progress | Done
**Owner:** [agent or team]
**SemVer bump:** patch | minor | major

## Purpose
[Why does this feature exist? What user problem does it solve?]

## Acceptance Criteria
- [ ] [Specific, testable condition 1]
- [ ] [Specific, testable condition 2]
- [ ] [Specific, testable condition 3]

## User Flow
[Step-by-step description of the happy path]

## Edge Cases
[What happens when things go wrong?]

## UI Spec
[Link to design file or describe layout/components needed]

## API Contract
[Endpoints, request/response shapes, auth requirements]

## Data Model
[Tables/collections affected, field changes]

## Test Requirements
- Unit: [what to test]
- Integration: [what to test]
- E2E: [what to test]

## Dependencies
[Other features, services, or APIs this depends on]

## Security Considerations
[Auth, data privacy, input validation requirements]

## Accessibility Requirements
[WCAG criteria that apply to this feature]
```

**Create `docs/workspace/templates/sdd/DESIGN_SPRINT_TEMPLATE.md`**:

```markdown
# Design Sprint: [Phase Name]
**Phase:** 02-design/[subphase]
**Status:** Draft | In Progress | Approved

## Design Tokens Defined
- [ ] Color system (semantic aliases, dark/light)
- [ ] Typography scale (clamp-based fluid sizes)
- [ ] Spacing grid (4px base unit)
- [ ] Motion tokens (duration, easing, reduced-motion)
- [ ] Shadow/elevation system
- [ ] Border radius scale

## Component Contracts
[For each component: variants, props API, states, a11y behavior]

## Page Layouts
[Breakpoint matrix: mobile → tablet → desktop → wide]

## Approval Gates
- [ ] Token-First CSS gate: zero hardcoded px/hex
- [ ] Fluid typography verified
- [ ] Dark/light parity confirmed
- [ ] WCAG AA contrast verified
- [ ] RTL layout verified (if applicable)
```

---

### UPDATE `docs/workspace/plans/gates/GITHUB_GATE_MATRIX.json`

Ensure the JSON reflects the new 7-phase structure (00-define through 06-ship) with updated phase names and gate IDs. Update all phase references from old numbering to new numbering.

---

## ════════════════════════════════════════
## TRACK 3 — TASK MANAGER UPGRADE
## ════════════════════════════════════════

### OBJECTIVE

Replace the basic MASTER_TASKS.md table with a comprehensive task management system that supports status tracking, assignees, priorities, and daily workflows.

---

### Rewrite `docs/workspace/plans/MASTER_TASKS.md`

```markdown
# Master Tasks — NEZAM Project

> Source of truth for all project tasks. Updated by /PLAN tasks and /CREATE task.
> Do not edit manually — use /CREATE task or /GIT log to add entries.

## Task Status Legend
| Status | Meaning |
|---|---|
| 🔲 not-started | Work not yet begun |
| 🔄 in-progress | Currently being worked on |
| 🔍 in-review | Complete, awaiting review |
| ✅ done | Verified complete |
| ❌ blocked | Cannot proceed — see Blocked By |
| ⏸ deferred | Intentionally postponed |

## Priority Legend
| Priority | Meaning |
|---|---|
| P0 | Blocker — must be done before anything else in this phase |
| P1 | High — required for phase gate to pass |
| P2 | Medium — important but not blocking |
| P3 | Low — nice to have, can slip to next phase |

---

## Phase 0 — Define

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-000-001 | Write and approve PRD | P0 | 🔲 not-started | founder | 00-define/01-product | PRD non-template, approved | — |
| T-000-002 | Write PROJECT_PROMPT | P0 | 🔲 not-started | PM-01 | 00-define/01-product | Aligned with PRD scope | T-000-001 |
| T-000-003 | Define ARCHITECTURE.md | P1 | 🔲 not-started | ARCH-01 | 00-define/02-architecture | Tech stack documented | T-000-001 |
| T-000-004 | Create ROADMAP.md | P1 | 🔲 not-started | PM-01 | 00-define/03-roadmap | Milestones + SemVer defined | T-000-001 |

## Phase 1 — Research

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-001-001 | SEO keyword research | P0 | 🔲 not-started | seo-specialist | 01-research/01-seo | ≥50 keywords clustered | T-000-001 |
| T-001-002 | SERP intent mapping | P1 | 🔲 not-started | seo-specialist | 01-research/01-seo | Intent mapped per cluster | T-001-001 |
| T-001-003 | User persona definition | P1 | 🔲 not-started | ux-researcher | 01-research/02-audience | 2-3 personas documented | T-000-001 |
| T-001-004 | Competitive analysis | P2 | 🔲 not-started | business-analyst | 01-research/03-competitive | 3+ competitors analyzed | T-000-001 |

## Phase 2 — Design

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-002-001 | Define design tokens | P0 | 🔲 not-started | design-token-architect | 02-design/01-tokens | All primitives tokenized, no hardcoded values | T-000-001 |
| T-002-002 | Create user flow maps | P1 | 🔲 not-started | ux-designer | 02-design/02-flows | All core journeys documented | T-001-003 |
| T-002-003 | Define component APIs | P1 | 🔲 not-started | frontend-lead | 02-design/03-components | All core components spec'd | T-002-001 |
| T-002-004 | Design page layouts | P1 | 🔲 not-started | ui-designer | 02-design/04-pages | All pages × breakpoints spec'd | T-002-003 |
| T-002-005 | Define motion contracts | P2 | 🔲 not-started | motion-designer | 02-design/05-motion | Duration/easing tokens defined | T-002-001 |
| T-002-006 | Approve DESIGN.md | P0 | 🔲 not-started | DESIGN-01 | 02-design | DESIGN.md signed off | T-002-004 |

## Phase 3 — Content

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-003-001 | IA and navigation plan | P0 | 🔲 not-started | ia-architect | 03-content/01-strategy | IA_CONTENT.md complete | T-001-001 |
| T-003-002 | Page copy writing | P1 | 🔲 not-started | content-writer | 03-content/02-copy | All pages in CONTENT_MAP.md | T-003-001 |
| T-003-003 | SEO meta + structured data | P1 | 🔲 not-started | seo-specialist | 03-content/03-seo-content | All pages have meta + schema | T-003-002 |
| T-003-004 | Legal and compliance copy | P1 | 🔲 not-started | compliance-manager | 03-content/04-compliance | Privacy policy, ToS drafted | T-003-002 |

## Phase 4 — Build

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-004-001 | Backend API implementation | P0 | 🔲 not-started | BE-01 | 04-build/01-backend | All CRUD endpoints + auth tested | T-000-003, T-002-006 |
| T-004-002 | Frontend implementation | P0 | 🔲 not-started | FE-01 | 04-build/02-frontend | All pages built, token-compliant | T-002-006 |
| T-004-003 | Feature slices | P1 | 🔲 not-started | FE-01 + BE-01 | 04-build/03-features | Priority journeys demoable | T-004-001, T-004-002 |
| T-004-004 | Third-party integrations | P2 | 🔲 not-started | integration-specialist | 04-build/04-integrations | All integrations tested | T-004-001 |
| T-004-005 | Test suite | P1 | 🔲 not-started | qa-lead | 04-build/05-tests | ≥80% coverage on core paths | T-004-003 |

## Phase 5 — Harden

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-005-001 | Security audit | P0 | 🔲 not-started | security-auditor | 05-harden/01-security | Zero P0/P1 findings | T-004-005 |
| T-005-002 | Performance optimization | P0 | 🔲 not-started | performance-lead | 05-harden/02-performance | LCP<2.5s, CLS<0.1, INP<200ms | T-004-005 |
| T-005-003 | Accessibility audit | P0 | 🔲 not-started | a11y-auditor | 05-harden/03-a11y | WCAG 2.2 AA compliant | T-004-005 |
| T-005-004 | QA sign-off | P0 | 🔲 not-started | qa-lead | 05-harden/04-qa | All acceptance criteria met | T-005-001, T-005-002, T-005-003 |

## Phase 6 — Ship

| ID | Task | Priority | Status | Owner | Phase | Metric | Blocked By |
|---|---|---|---|---|---|---|---|
| T-006-001 | Staging deployment | P0 | 🔲 not-started | devops-lead | 06-ship/01-staging | Staging smoke tests pass | T-005-004 |
| T-006-002 | Production deployment | P0 | 🔲 not-started | devops-lead | 06-ship/02-production | Zero deploy errors | T-006-001 |
| T-006-003 | Monitoring setup | P1 | 🔲 not-started | devops-lead | 06-ship/03-monitoring | Error alerts + uptime monitoring active | T-006-002 |

---

## How to add a task
Run: /CREATE task
Or append a row manually following the table format above.

## How to update task status
Run: /GIT log   → prompts for status update
Or edit the Status column directly.
```

---

## ════════════════════════════════════════
## TRACK 4 — WORKSPACE CLEANUP
## ════════════════════════════════════════

### OBJECTIVE

Delete dead files, fix empty skill stubs, remove orphaned duplicates, clean root.

---

### DELETES

Execute these deletions:

```bash
# Remove empty skill stub folders that have no SKILL.md and are just numeric groupings
# (their sub-skills will be reorganized in Track 5)
# DO NOT delete yet — these are reorganized in Track 5 first
# 01-foundation, 03-ui-ux, 16-qa, 19-memory — addressed in Track 5

# Remove duplicate skills that exist both as coi- AND without prefix
# Keep the coi- version (will be renamed in Track 5), delete the bare duplicate
rm -rf .cursor/skills/component-library-api
rm -rf .cursor/skills/motion-3d-progressive

# Remove old commands absorbed by /GIT
rm -f .cursor/commands/save.md
rm -f .cursor/commands/sync.md

# Remove root-level prompt files generated by previous sessions (not canonical source)
# Keep: CLAUDE.md, README.md, AGENTS.md, GEMINI.md, QWEN.md, CONTEXT.md, HEALTH.md
# Keep: SWARM_WORKFLOW.md, WORKSPACE_INDEX.md, ORCHESTRATION_ALIASES.md, ERROR_HANDLING_PROTOCOL.md
# Remove: session-specific prompt files we created (not part of canonical workspace)
rm -f NEZAM_WEAKNESS_FIX_PROMPT.md
rm -f NEZAM_NONDEVELOPER_DAILY_GUIDE.md
# NOTE: their contents are now integrated into the proper command files above

# Remove the numeric group folders AFTER their contents are moved to proper skill folders in Track 5
# These will be deleted at the END of Track 5:
# 01-foundation → contents moved to skills/foundation/
# 03-ui-ux → contents moved to skills/design/
# 16-qa → contents moved to skills/quality/
# 19-memory → contents moved to skills/system/
```

### ARABIC SKILL STUBS — FIX

The `arabic_content_master`, `egyptian_arabic_content_master`, and `mena_payment_routing` folders have content but use `skill.md` (lowercase) instead of `SKILL.md`. Fix this:

```bash
# Fix case on arabic_content_master
mv .cursor/skills/arabic_content_master/skill.md .cursor/skills/arabic_content_master/SKILL.md

# Fix case on egyptian_arabic_content_master
mv .cursor/skills/egyptian_arabic_content_master/skill.md .cursor/skills/egyptian_arabic_content_master/SKILL.md

# Fix case on mena_payment_routing
mv .cursor/skills/mena_payment_routing/skill.md .cursor/skills/mena_payment_routing/SKILL.md
```

---

## ════════════════════════════════════════
## TRACK 5 — SKILLS REORGANIZATION
## ════════════════════════════════════════

### OBJECTIVE

1. Strip `coi-` prefix from all skill folder names
2. Reorganize flat list into logical category subfolders
3. Fix naming: use `kebab-case` consistently (no underscores)
4. Move subskills from numeric stub folders into proper category folders
5. Ensure every skill folder has a `SKILL.md`

---

### NEW SKILLS FOLDER STRUCTURE

Reorganize `.cursor/skills/` into this category tree:

```
.cursor/skills/
  system/                     # Core workspace system skills
    slash-command-router/     # (from 01-foundation)
    sdd-hardlock-manager/     # (from 01-foundation)
    context-window-manager/   # (from 19-memory)
    token-budget-manager/     # (from 19-memory)
    context-compressor/       # (from 19-memory)
    reflection-loop-engine/   # (from 19-memory)
    skill-composer/           # (was nezam-skill-composer)
    task-decomposition/       # (was nezam-task-decomposition)
    multi-agent-handoff/      # (was nezam-multi-agent-handoff)
    docs-context-sync/        # (was nezam-docs-context-sync)
    phase-gating-roadmap/     # (was nezam-phase-gating-roadmap)
    health-score/             # (was nezam-health-score)
    decision-journal/         # (was nezam-decision-journal)
    strategic-planning/       # (was nezam-strategic-planning)
    repo-file-org/            # (was nezam-repo-file-org)
    founder-onboarding/       # (was nezam-founder-onboarding)
    risk-mitigation/          # (was nezam-risk-mitigation)

  research/                   # SEO, AEO, audience, competitive
    seo-ia-content/           # (was seo-ia-content)
    serp-feature-targeting/   # (was nezam-serp-feature-targeting)
    topical-authority/        # (was nezam-topical-authority)
    aeo-answer-engines/       # (was nezam-aeo-answer-engines)
    ia-taxonomy/              # (was nezam-ia-taxonomy)
    geo-optimization/         # (was nezam-geo-optimization)
    structured-data-schema/   # (was nezam-structured-data-schema)

  design/                     # Design system, tokens, motion, UI
    design-tokens/            # (was nezam-pro-design-tokens)
    token-grid-typography/    # (was token-grid-typography)
    brand-visual-direction/   # (was brand-visual-direction)
    ui-ux-design/             # (was nezam-ui-ux-design)
    frontend-design-pro/      # (was nezam-frontend-design-pro)
    component-library-api/    # (was nezam-component-library-api)
    motion-3d/                # (was nezam-motion-3d-progressive)
    css-architecture/         # (was css-architecture-runtime)
    design-md/                # (was design-md)
    design-system-builder/    # (from 03-ui-ux)
    micro-interaction-designer/ # (from 03-ui-ux)
    wireframe-to-spec/        # (from 03-ui-ux)
    user-flow-mapper/         # (from 03-ui-ux)
    dashboard-patterns/       # (was nezam-dashboard-patterns)

  content/                    # Content creation, editorial, Arabic
    editorial-workflows/      # (was nezam-editorial-workflows)
    content-modeling/         # (was nezam-content-modeling)
    arabic-content/           # (was arabic_content_master — fix snake_case)
    egyptian-arabic-content/  # (was egyptian_arabic_content_master — fix snake_case)

  frontend/                   # React, Next.js, component implementation
    react-architecture/       # (was nezam-react-architecture)

  backend/                    # API, DB, auth, integrations
    api-design/               # (was nezam-api-design)
    api-gateway/              # (was nezam-api-gateway)
    auth-workflows/           # (was nezam-auth-workflows)
    supabase-architect/       # (was nezam-supabase-architect)
    prisma-orm/               # (was nezam-prisma-orm)
    database-optimization/    # (was nezam-database-optimization)
    cache-strategies/         # (was nezam-cache-strategies)
    cms-integration/          # (was nezam-cms-integration)
    mena-payment-routing/     # (was mena_payment_routing — fix snake_case)

  infrastructure/             # DevOps, cloud, CDN, monitoring
    devops-pipeline/          # (was nezam-devops-pipeline)
    vercel-deploy/            # (was nezam-vercel-deploy)
    aws-infra/                # (was nezam-aws-infra)
    cdn-optimization/         # (was nezam-cdn-optimization)
    cloudflare-edge/          # (was nezam-cloudflare-edge)
    monitoring-observability/ # (was nezam-monitoring-observability)
    error-tracking/           # (was nezam-error-tracking)
    secret-management/        # (was nezam-secret-management)

  quality/                    # Security, testing, performance, a11y
    security-hardening/       # (was nezam-security-hardening)
    gh-security-compliance/   # (was nezam-gh-security-compliance)
    github-actions-ci/        # (was nezam-github-actions-ci)
    privacy-compliance/       # (was nezam-privacy-compliance)
    testing-automation/       # (was nezam-testing-automation)
    testing-strategy/         # (was nezam-testing-strategy)
    performance-optimization/ # (was nezam-performance-optimization)
    a11y-automation/          # (was nezam-a11y-automation)
    scan-fix-loop/            # (was nezam-scan-fix-loop)
    regression-detector/      # (from 16-qa)

  external/                   # External AI, reporting, git workflow
    external-ai-report/       # (was external-ai-report)
    git-workflow/             # (was git-workflow)
    guide-instructor-domains/ # (was guide-instructor-domains)
    plan-full/                # (was plan-full)
```

### RENAME EXECUTION

Execute all moves as bash commands:

```bash
cd .cursor/skills

# --- SYSTEM ---
mkdir -p system
mv nezam-skill-composer system/skill-composer
mv nezam-task-decomposition system/task-decomposition
mv nezam-multi-agent-handoff system/multi-agent-handoff
mv nezam-docs-context-sync system/docs-context-sync
mv nezam-phase-gating-roadmap system/phase-gating-roadmap
mv nezam-health-score system/health-score
mv nezam-decision-journal system/decision-journal
mv nezam-strategic-planning system/strategic-planning
mv nezam-repo-file-org system/repo-file-org
mv nezam-founder-onboarding system/founder-onboarding
mv nezam-risk-mitigation system/risk-mitigation
# Move subskills from 01-foundation stub
mv 01-foundation/slash-command-router system/slash-command-router
mv 01-foundation/sdd-hardlock-manager system/sdd-hardlock-manager
# Move subskills from 19-memory stub
mv 19-memory/context-window-manager system/context-window-manager
mv 19-memory/token-budget-manager system/token-budget-manager
mv 19-memory/context-compressor system/context-compressor
mv 19-memory/reflection-loop-engine system/reflection-loop-engine

# --- RESEARCH ---
mkdir -p research
mv seo-ia-content research/seo-ia-content
mv nezam-serp-feature-targeting research/serp-feature-targeting
mv nezam-topical-authority research/topical-authority
mv nezam-aeo-answer-engines research/aeo-answer-engines
mv nezam-ia-taxonomy research/ia-taxonomy
mv nezam-geo-optimization research/geo-optimization
mv nezam-structured-data-schema research/structured-data-schema

# --- DESIGN ---
mkdir -p design
mv nezam-pro-design-tokens design/design-tokens
mv token-grid-typography design/token-grid-typography
mv brand-visual-direction design/brand-visual-direction
mv nezam-ui-ux-design design/ui-ux-design
mv nezam-frontend-design-pro design/frontend-design-pro
mv nezam-component-library-api design/component-library-api
mv nezam-motion-3d-progressive design/motion-3d
mv css-architecture-runtime design/css-architecture
mv design-md design/design-md
mv nezam-dashboard-patterns design/dashboard-patterns
# Move subskills from 03-ui-ux stub
mv 03-ui-ux/design-system-builder design/design-system-builder
mv 03-ui-ux/micro-interaction-designer design/micro-interaction-designer
mv 03-ui-ux/wireframe-to-spec-converter design/wireframe-to-spec
mv 03-ui-ux/user-flow-mapper design/user-flow-mapper

# --- CONTENT ---
mkdir -p content
mv nezam-editorial-workflows content/editorial-workflows
mv nezam-content-modeling content/content-modeling
mv arabic_content_master content/arabic-content
mv egyptian_arabic_content_master content/egyptian-arabic-content

# --- FRONTEND ---
mkdir -p frontend
mv nezam-react-architecture frontend/react-architecture

# --- BACKEND ---
mkdir -p backend
mv nezam-api-design backend/api-design
mv nezam-api-gateway backend/api-gateway
mv nezam-auth-workflows backend/auth-workflows
mv nezam-supabase-architect backend/supabase-architect
mv nezam-prisma-orm backend/prisma-orm
mv nezam-database-optimization backend/database-optimization
mv nezam-cache-strategies backend/cache-strategies
mv nezam-cms-integration backend/cms-integration
mv mena_payment_routing backend/mena-payment-routing

# --- INFRASTRUCTURE ---
mkdir -p infrastructure
mv nezam-devops-pipeline infrastructure/devops-pipeline
mv nezam-vercel-deploy infrastructure/vercel-deploy
mv nezam-aws-infra infrastructure/aws-infra
mv nezam-cdn-optimization infrastructure/cdn-optimization
mv nezam-cloudflare-edge infrastructure/cloudflare-edge
mv nezam-monitoring-observability infrastructure/monitoring-observability
mv nezam-error-tracking infrastructure/error-tracking
mv nezam-secret-management infrastructure/secret-management

# --- QUALITY ---
mkdir -p quality
mv nezam-security-hardening quality/security-hardening
mv nezam-gh-security-compliance quality/gh-security-compliance
mv nezam-github-actions-ci quality/github-actions-ci
mv nezam-privacy-compliance quality/privacy-compliance
mv nezam-testing-automation quality/testing-automation
mv nezam-testing-strategy quality/testing-strategy
mv nezam-performance-optimization quality/performance-optimization
mv nezam-a11y-automation quality/a11y-automation
mv nezam-scan-fix-loop quality/scan-fix-loop
mv 16-qa/regression-detector quality/regression-detector

# --- EXTERNAL ---
mkdir -p external
mv external-ai-report external/external-ai-report
mv git-workflow external/git-workflow
mv guide-instructor-domains external/guide-instructor-domains
mv plan-full external/plan-full

# --- CLEANUP: remove empty numeric stub folders ---
rmdir 01-foundation 03-ui-ux 16-qa 19-memory 2>/dev/null || true

# --- CLEANUP: remove duplicate bare folders (already done in Track 4) ---
# component-library-api and motion-3d-progressive already removed
```

### UPDATE SKILL.md FILES — STRIP PREFIX FROM INTERNAL REFERENCES

After moving, update any SKILL.md that references `coi-` prefixed paths in its Integration Hooks or External Reference sections. Run a search-replace:

```bash
find .cursor/skills -name "SKILL.md" -exec sed -i 's/nezam-skill-composer/system\/skill-composer/g' {} \;
find .cursor/skills -name "SKILL.md" -exec sed -i 's/@coi-/@ /g' {} \;
```

### CREATE SKILLS README

Create `.cursor/skills/README.md`:

```markdown
# Skills Directory

Skills are organized into 9 categories. Each skill folder contains a `SKILL.md`
with: Purpose, Inputs, Step-by-Step Workflow, Validation, Output Format,
Integration Hooks, Anti-Patterns, External References.

## Categories

| Category | Description | Skills |
|---|---|---|
| system/ | Workspace orchestration, routing, memory, gating | ~17 |
| research/ | SEO, AEO, IA, audience, competitive | ~7 |
| design/ | Tokens, typography, UI, motion, components | ~13 |
| content/ | Editorial, content modeling, Arabic content | ~4 |
| frontend/ | React, Next.js, component implementation | ~1 |
| backend/ | API, DB, auth, payments, CMS | ~9 |
| infrastructure/ | DevOps, cloud, CDN, monitoring | ~8 |
| quality/ | Security, testing, performance, a11y | ~10 |
| external/ | External AI, git, reporting | ~4 |

## Naming Convention

All skill folders use `kebab-case`. No prefixes. No underscores.
Format: `<category>/<descriptive-name>/SKILL.md`

## Adding a new skill

Run: /CREATE skill
Or copy from docs/workspace/templates/skill-template/ and fill in SKILL.md.
```

---

## ════════════════════════════════════════
## TRACK 6 — AGENTS RENAME & CONSOLIDATE
## ════════════════════════════════════════

### OBJECTIVE

Enforce a single consistent naming convention for all agents.
Current problems: mix of `UPPER-01-Name`, `agent-name`, `lead-name`, bare single words (`seo`, `pm`, `content`, `aeo`, `gitops`)

### TARGET NAMING CONVENTION

All agent files use: `role-descriptor.md` in `kebab-case`
No UPPER-CASE prefixes. No numeric codes. No bare single words.

**Core swarm leads** (keep position clarity via descriptor, not code):
- `PM-01-Swarm-Leader.md` → `swarm-leader.md`
- `ARCH-01-Project-Architect.md` → `project-architect.md`
- `DESIGN-01-UIUX-Lead.md` → `design-lead.md`
- `FE-01-Frontend-Lead.md` → `frontend-lead.md`
- `BE-01-Backend-Lead.md` → `backend-lead.md`

**Lead architects** (already have `lead-` prefix, keep):
- `lead-ai-ethics-officer.md` → keep
- `lead-analytics-architect.md` → keep
- `lead-backend-architect.md` → keep
- `lead-cms-saas-architect.md` → keep
- `lead-database-architect.md` → keep
- `lead-devops-performance.md` → keep
- `lead-frontend-architect.md` → keep
- `lead-maintenance-agent.md` → keep
- `lead-mobile-architect.md` → keep
- `lead-qa-architect.md` → keep
- `lead-security-officer.md` → keep
- `lead-solution-architect.md` → keep
- `lead-uiux-designer.md` → keep

**Agents with `agent-` prefix** — standardize:
- `agent-ci-automation.md` → `ci-automation.md`
- `agent-docs-hygiene.md` → `docs-hygiene.md`
- `agent-qa-test-lead.md` → `qa-test-lead.md`
- `agent-security-auditor.md` → `security-auditor.md`

**Bare single-word files** — give proper names:
- `seo.md` → `seo-specialist.md`
- `pm.md` → `product-manager.md`
- `content.md` → `content-strategist.md`
- `aeo.md` → `aeo-specialist.md`
- `gitops.md` → `gitops-engineer.md`
- `ceo.md` → `executive-director.md`
- `cpo.md` → `product-officer.md`

**`deputy-orchestrator.md`** → `deputy-swarm-leader.md`
**`orchestration-subagent-controller.md`** → `subagent-controller.md`

**Redundant / overlapping agents to consolidate:**
- `data-visualization-manager.md` + `data-visualization-specialist.md` → merge into `data-visualization.md`
- `performance-load-manager.md` + `performance-manager.md` → merge into `performance-engineer.md`
- `payments-integration.md` + `payments-lead.md` + `payments-mena-routing.md` → merge into `payments-lead.md` + `mena-payments-specialist.md`
- `mobile-android.md` + `android-manager.md` → keep `android-engineer.md`
- `mobile-ios.md` + `ios-manager.md` → keep `ios-engineer.md`
- `mobile-cross-platform.md` + `cross-platform-manager.md` → keep `mobile-cross-platform.md`

### RENAME EXECUTION

```bash
cd .cursor/agents

# Core swarm leads
mv PM-01-Swarm-Leader.md swarm-leader.md
mv ARCH-01-Project-Architect.md project-architect.md
mv DESIGN-01-UIUX-Lead.md design-lead.md
mv FE-01-Frontend-Lead.md frontend-lead.md
mv BE-01-Backend-Lead.md backend-lead.md

# Remove agent- prefix
mv agent-ci-automation.md ci-automation.md
mv agent-docs-hygiene.md docs-hygiene.md
mv agent-qa-test-lead.md qa-test-lead.md
mv agent-security-auditor.md security-auditor.md

# Fix bare single-word files
mv seo.md seo-specialist.md
mv pm.md product-manager.md
mv content.md content-strategist.md
mv aeo.md aeo-specialist.md
mv gitops.md gitops-engineer.md
mv ceo.md executive-director.md
mv cpo.md product-officer.md

# Fix deputy and orchestration
mv deputy-orchestrator.md deputy-swarm-leader.md
mv orchestration-subagent-controller.md subagent-controller.md

# Fix mobile duplicates
mv android-manager.md android-engineer.md
mv ios-manager.md ios-engineer.md

# Consolidate overlapping agents
# (merge content of data-visualization-manager into data-visualization-specialist, then rename)
# Manual merge required — see note below
mv data-visualization-specialist.md data-visualization.md
rm data-visualization-manager.md  # after merging content

mv performance-manager.md performance-engineer.md
rm performance-load-manager.md  # after merging content

mv payments-lead.md payments-lead.md  # keep as-is
mv payments-mena-routing.md mena-payments-specialist.md
rm payments-integration.md  # after merging content into payments-lead.md
```

**For each merged agent:** read both files, write the merged version to the target filename with a combined capabilities section. Keep all unique information from both files.

### CREATE `agents/README.md`

```markdown
# Agents Directory

All agents use `kebab-case` naming. No prefixes, no numeric codes.

## Swarm Core (5 leads)
| File | Role |
|---|---|
| swarm-leader.md | PM-01: task routing, acceptance gates, handoff sequencing |
| project-architect.md | ARCH-01: architectural governance, canonical-path enforcement |
| design-lead.md | DESIGN-01: design-system, token, a11y, motion quality |
| frontend-lead.md | FE-01: component implementation, UI library integration |
| backend-lead.md | BE-01: API contracts, data, integrations |

## Deputy & Controllers
deputy-swarm-leader.md, subagent-controller.md

## Lead Architects
All files prefixed with `lead-`: 12 senior domain architects

## Specialists
Domain specialists organized alphabetically. All use `<domain>-<role>.md` pattern.

## Adding a new agent
Run: /CREATE agent
```

---

## ════════════════════════════════════════
## TRACK 7 — SWARM COMMUNICATIONS
## ════════════════════════════════════════

### OBJECTIVE

Improve how agents communicate with each other. Add structured handoff protocol, clear escalation paths, and better focus on design → content → development flow.

---

### UPDATE `SWARM_WORKFLOW.md`

Add this section after the existing Phase definitions:

```markdown
## Swarm Communication Protocol

### Handoff Packet (required between every phase)

Every agent that completes a phase must emit a handoff packet before the next agent begins:

```yaml
handoff:
  from_agent: [agent name]
  to_agent: [next agent name]
  phase_completed: [phase ID]
  phase_started: [next phase ID]
  artifacts_produced:
    - path: [file path]
      status: approved | draft | pending-review
  gates_passed:
    - gate: [gate name]
      evidence: [brief description]
  open_items:
    - [Any unresolved items the next agent must know about]
  plain_language_summary:
    what_happened: [1 sentence]
    what_the_next_agent_needs_to_do: [1 sentence]
  escalation_required: false | true
  escalation_reason: [if true, why]
```

### Design → Content Communication Contract

Design lead MUST emit before content work begins:
- Approved DESIGN.md with typography scale
- Component vocabulary (names and variants) for copy consistency
- Voice/tone guidance integration points (where microcopy appears in components)
- RTL readiness confirmation (if applicable)

Content team MUST emit before development begins:
- CONTENT_MAP.md with all page copy finalized
- SEO meta titles and descriptions per page
- All microcopy strings (button labels, error messages, empty states, loading states)
- Structured data schema per page type

### Content → Development Communication Contract

Frontend lead receives from content:
- All copy strings in structured format (page → section → element)
- Character/word limits per UI context
- Localization requirements (if multilingual)

### Design → Development Communication Contract

Frontend lead receives from design:
- DESIGN.md (authoritative)
- Component API specs with prop types and variants
- Motion tokens (duration, easing, reduced-motion alternatives)
- Responsive breakpoint matrix
- Token references for all style decisions

### Escalation Paths

| Situation | Escalate to |
|---|---|
| Gate blocked, no clear path forward | swarm-leader.md |
| Architecture conflict between agents | project-architect.md |
| Design token violation in implementation | design-lead.md |
| Security issue found during development | security-auditor.md |
| Performance budget exceeded | performance-engineer.md |
| Accessibility violation discovered | a11y-performance-auditor.md |
| Content-design mismatch | design-lead.md + content-strategist.md |

### Daily Sync Format

Each active agent emits a brief status at end of session:

```yaml
daily_sync:
  agent: [name]
  date: [YYYY-MM-DD]
  completed_today:
    - [task or artifact]
  in_progress:
    - [task]
  blocked_by:
    - [blocker] | none
  tomorrow_priority:
    - [task]
```
```

---

## ════════════════════════════════════════
## TRACK 8 — /GUIDE FULL REWRITE
## ════════════════════════════════════════

### OBJECTIVE

Rewrite `/GUIDE` to be smarter, cleaner, and more useful. It should be the single source of truth for "where am I and what do I do next" — clear for both developers and non-developers.

---

### Rewrite `.cursor/commands/guide.md`

```
/GUIDE — Intelligent project navigator. Always available.

Subcommands:
  /GUIDE status     → Full pipeline status: what's done, what's next, what's blocked
  /GUIDE next       → Single recommended next action (one thing, clearly stated)
  /GUIDE phase      → Deep dive on the current active phase
  /GUIDE full       → Complete project health: all phases, all gates, all open items
  /GUIDE explain    → Explain current state in plain English (no jargon)
  /GUIDE help       → This message

Aliases: /GUIDE → defaults to /GUIDE status

---

## Response structure for /GUIDE status (required)

Output exactly in this order. No deviation.

### 1. Pipeline Bar (required)

Render the 7-segment macro pipeline bar using these UPDATED segment names:

  Define · Research · Design · Content · Build · Harden · Ship

Segment = filled (█) when:
  Define    → docs/workspace/plans/00-define/ has PRD + PROJECT_PROMPT + ARCHITECTURE
  Research  → docs/workspace/plans/01-research/ has SEO_RESEARCH.md
  Design    → docs/workspace/plans/02-design/ gate passed + DESIGN.md exists
  Content   → docs/workspace/plans/03-content/ has CONTENT_MAP.md + IA_CONTENT.md
  Build     → docs/workspace/plans/04-build/ has at least one completed feature
  Harden    → docs/workspace/plans/05-harden/ all 4 audits complete
  Ship      → docs/workspace/plans/06-ship/ production deployed

Example output:
  Pipeline  [████░░░░░░░░░░░░░░░░]  2/7  Define ✓ · Research ✓ · Design ○ · Content ○ · Build ○ · Harden ○ · Ship ○

### 2. Current Stage Summary (required)

Two sentences max:
- Sentence 1: Where you are (plain English, then technical reference in parens)
- Sentence 2: What you need to do to advance

### 3. Active Phase Progress (required)

Show only the current active phase. Count subphases that have both prompt.json + PROMPT.md.

  Phase: [name]  [████████░░░░░░░░░░░░] 8/12 subphases ready

### 4. Blockers (required — show only if any exist)

List all hardlock failures as:
  ❌ [plain description] → Fix with: [exact command]

If no blockers: ✅ No blockers — you can proceed.

### 5. Next Action (required)

Bold, single line:
  **→ [Exact command] — [one sentence description of what it does]**

Optional secondary action:
  Alternative: [command] — [why you might choose this instead]

### 6. Quick Health Snapshot (required)

Three lines max, emoji + plain English, no file paths:
  ✅ Design system locked in
  ⚠️ Content not started yet
  ✅ Architecture documented

### 7. Recommendation (required — must be last)

Standard recommendation footer per workspace-orchestration.mdc rules.

---

## /GUIDE full response additions

When /GUIDE full is run, add after item 6:

### All Phases Status Table

| Phase | Status | Gates | Next action |
|---|---|---|---|
| 0 — Define | [status emoji] | [pass/fail count] | [command] |
| 1 — Research | [status emoji] | [pass/fail count] | [command] |
| 2 — Design | [status emoji] | [pass/fail count] | [command] |
| 3 — Content | [status emoji] | [pass/fail count] | [command] |
| 4 — Build | [status emoji] | [pass/fail count] | [command] |
| 5 — Harden | [status emoji] | [pass/fail count] | [command] |
| 6 — Ship | [status emoji] | [pass/fail count] | [command] |

### Open Tasks (from MASTER_TASKS.md)

Show tasks with status = in-progress or blocked:
  🔄 [Task ID] [Task name] — Owner: [name]
  ❌ [Task ID] [Task name] — Blocked by: [blocker]

### Full Plan Progress Bar (subphase prompt artifacts)

  Full plan [████████░░░░░░░░░░░░] R/S subphases with prompt artifacts

---

## /GUIDE explain behavior

When /GUIDE explain is run, output the same information as /GUIDE status
but with zero technical terms. No file paths, no gate names, no "hardlock",
no "SDD", no "artifact". Every item translated to plain English.

Format:
  Where you are:  [plain sentence]
  What's done:    [bullet list, plain English]
  What's next:    [plain sentence + exact command]
  What's blocked: [plain English description + fix command]

---

## Tone and format rules (all /GUIDE subcommands)

- Decisive and scannable — use tables and bars where they clarify
- Never leave the user not knowing what to type next
- Never show a raw file path in the main body (only in details/collapsibles)
- Always end with Recommendation footer
- Maximum 2 seconds to understand the most important thing on the page
```

---

## ════════════════════════════════════════
## POST-EXECUTION CHECKLIST
## ════════════════════════════════════════

After completing all 8 tracks, verify:

- [ ] All 9 commands exist in `.cursor/commands/` with new subcommand structure
- [ ] `save.md` and `sync.md` deleted — behaviors absorbed into `git.md`
- [ ] `docs/workspace/plans/` restructured to 00–06 phases
- [ ] `MASTER_TASKS.md` rewritten with 7-phase task table
- [ ] Duplicate skills (`component-library-api`, `motion-3d-progressive`) deleted
- [ ] All `coi-*` skill folders renamed and moved into category subfolders
- [ ] `01-foundation`, `03-ui-ux`, `16-qa`, `19-memory` stub folders deleted
- [ ] Arabic skill folder names fixed to kebab-case
- [ ] All agents renamed to `kebab-case` — no `UPPER-01-Code` style
- [ ] Bare single-word agent files renamed (`seo.md`, `pm.md`, `content.md`, etc.)
- [ ] Duplicate agents merged (`data-visualization`, `performance`, `payments`)
- [ ] `SWARM_WORKFLOW.md` has new communication protocol section
- [ ] `guide.md` fully rewritten with 7-segment pipeline using new phase names
- [ ] `.cursor/skills/README.md` created
- [ ] `.cursor/agents/README.md` created
- [ ] `pnpm ai:sync` completed with zero errors
- [ ] `pnpm ai:check` reports zero drift
- [ ] `CLAUDE.md` regenerated (auto by sync) with updated skill + agent index

---

## RUN AFTER ALL TRACKS COMPLETE

```bash
pnpm ai:sync   # propagate everything to .antigravity/, .claude/, .gemini/, .qwen/, .opencode/, .kilocode/
pnpm ai:check  # confirm zero drift
```

---

## CONVENTIONAL COMMIT

```
feat(workspace): complete master refactor — commands, skills, agents, SDD pipeline

TRACK 1: Commands unified with logical subcommands; /GIT absorbs save+sync
TRACK 2: SDD pipeline redesigned 00-define→06-ship; templates improved
TRACK 3: MASTER_TASKS.md upgraded to 7-phase comprehensive task manager
TRACK 4: Dead files and duplicate skills removed; Arabic skill names fixed
TRACK 5: Skills reorganized into 9 categories; coi- prefix stripped; kebab-case enforced
TRACK 6: Agents renamed to kebab-case; overlapping agents merged; README added
TRACK 7: Swarm handoff protocol + design→content→dev communication contracts
TRACK 8: /GUIDE fully rewritten with 7-segment pipeline and dual developer/plain-English modes

No hardlocks weakened. All changes additive or reorganizational.
```
