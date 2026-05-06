# TEST_MATRIX.md

**[PHASE: workspace-kit]** **[TASK: alignment-baseline]**

## Trace header

| Field | Value |
| ----- | ----- |
| Resolved `DESIGN.md` | [`DESIGN.md`](DESIGN.md) (root) |
| Active brand design file | [`.cursor/design/default/design.md`](.cursor/design/default/design.md) |
| Brand catalog | [`.cursor/design/`](.cursor/design/) (`<brand>/design.md`) |
| Token summary | Semantic CSS vars: `--color-bg`, `--color-fg`, `--color-accent`, `--color-muted`, `--color-border`, `--color-surface`, `--color-success`, `--color-warn`, `--color-danger`; `--font-sans`, `--font-mono`; breakpoints `mobile` / `tablet` / `desktop` / `wide` |
| Active lenses (alignment) | [SKILL: `git-workflow`] [SKILL: `design-md`] [SKILL: `plan-full`] [AGENT: `gitops`] [AGENT: `qa`] |

## BLOCKERS (do not guess past these)

| ID | Blocker | Unblocks when |
| -- | ------- | ------------- |
| B1 | No `docs/specs/features/<id>/SPEC.md` files yet — only [`docs/specs/features/README.md`](docs/specs/features/README.md) | First feature epic scoped + SPEC written |
| B2 | No application package at repo root (`package.json` is toolkit-only) — no runnable UI/E2E target | App/framework chosen under `apps/` or root scope expanded |
| B3 | [`docs/specs/sdd/SEO_RESEARCH.md`](docs/specs/sdd/SEO_RESEARCH.md) missing | `/CREATE seo` or authored research doc |
| B4 | [`docs/specs/sdd/ROADMAP.md`](docs/specs/sdd/ROADMAP.md) missing | Roadmap slice authored under SDD |

---

## Matrix entries

Each row lists the ten required fields as numbered bullets.

### TM-ONB-001 — PRD + prompt onboarding

1. **Source:** [`docs/specs/prd/PRD.md`](docs/specs/prd/PRD.md) requirement R1; [`scripts/checks/check-onboarding-readiness.sh`](scripts/checks/check-onboarding-readiness.sh).
2. **Test type:** Integration (shell / CI).
3. **Acceptance:** Script exits 0 when PRD and `docs/prompts/PROJECT_PROMPT.md` exist.
4. **Mocking:** None; filesystem-only.
5. **SEO:** N/A (infra check).
6. **A11y:** N/A.
7. **Perf:** N/A.
8. **Design token fidelity:** N/A.
9. **Pass/fail & coverage:** Pass = exit 0; coverage target N/A for shell script (document in CI log).
10. **Plan alignment:** Supports all PT rows — prerequisite **Phase 00 onboarding**.

### TM-ONB-002 — Context artifact presence

1. **Source:** [`docs/context/project.md`](docs/context/project.md), [`docs/context/workspace.md`](docs/context/workspace.md), [`docs/context/instructions.md`](docs/context/instructions.md).
2. **Test type:** Manual / doc audit (future: markdown link checker in CI).
3. **Acceptance:** Companion upload paths (`DESIGN.md`, progress report) referenced and files exist where marked present.
4. **Mocking:** None.
5. **SEO:** N/A.
6. **A11y:** N/A.
7. **Perf:** N/A.
8. **Design token fidelity:** `DESIGN.md` lists semantic tokens (audit that components later map to vars).
9. **Pass/fail:** Pass when AUTO-Managed sections contain no false “present” links.
10. **Plan alignment:** **MT-001** readiness (content foundation handoff).

### TM-PLAN-001 — Plan traceability index

1. **Source:** [`plan/INDEX.md`](plan/INDEX.md); [`plan/MASTER_TASKS.md`](plan/MASTER_TASKS.md).
2. **Test type:** Manual / static integrity (future: unit test parsing MT/PT tables).
3. **Acceptance:** Every PT-ID in INDEX maps to a SPEC path or plan markdown that exists on disk.
4. **Mocking:** None.
5. **SEO:** N/A for index file; future web IA must mirror plan phases (defer).
6. **A11y:** N/A.
7. **Perf:** N/A.
8. **Design token fidelity:** N/A.
9. **Pass/fail:** Pass when all linked paths resolve.
10. **Plan alignment:** **PT-01-01-001** through **PT-05-001** (cross-cutting).

### TM-DES-001 — DESIGN.md structure gate

1. **Source:** [`DESIGN.md`](DESIGN.md); rule [`.cursor/rules/sdd-design.mdc`](.cursor/rules/sdd-design.mdc).
2. **Test type:** Manual checklist (future: lint rule or MD frontmatter schema).
3. **Acceptance:** Sections present: brand, layout archetype, navigation model, color tokens, typography, motion, imagery, breakpoints, example pages, component inventory.
4. **Mocking:** None.
5. **SEO:** Example pages include heading hierarchy placeholders for future routes.
6. **A11y:** WCAG pairing called out for fg/bg and accent buttons.
7. **Perf:** Hero height guidelines align with LCP budgeting when implemented.
8. **Design token fidelity:** All colors expressed as semantic tokens in DESIGN table; implementation must use vars only.
9. **Pass/fail:** Pass when checklist complete; **target** 100% sections for workspace gate.
10. **Plan alignment:** **PT-02-01-001** … **PT-02-04-001** (design system phase).

### TM-PRD-002 — Plan + SDD discovery (PRD R2)

1. **Source:** [`docs/specs/prd/PRD.md`](docs/specs/prd/PRD.md) R2.
2. **Test type:** Manual audit.
3. **Acceptance:** `plan/INDEX.md` lists MT/PT rows with gate IDs; phase TASKS files exist under `plan/*/TASKS.md`.
4. **Mocking:** None.
5. **SEO:** Deferred until `SEO_RESEARCH.md` exists (**BLOCKER B3**).
6. **A11y:** N/A.
7. **Perf:** N/A.
8. **Design token fidelity:** N/A.
9. **Pass/fail:** Pass when audit confirms tree; coverage N/A.
10. **Plan alignment:** **MT-001–MT-006** trace rows.

### TM-PRD-004 — Test matrix before automated tests (PRD R4)

1. **Source:** PRD R4; this file.
2. **Test type:** Process gate (meta).
3. **Acceptance:** No new `*.test.*` / Playwright specs until this matrix is reviewed for that scope.
4. **Mocking:** N/A.
5. **SEO:** Matrix rows require SEO field when feature touches public routes.
6. **A11y:** Matrix rows require a11y field when feature touches UI.
7. **Perf:** Matrix lists LCP/CLS/INP thresholds for critical routes when app exists.
8. **Design token fidelity:** Row field 8 populated for UI slices.
9. **Pass/fail:** Pass = stakeholders approve matrix for next slice; coverage targets set per row.
10. **Plan alignment:** **PT-03-05-001** … **PT-03-05-003** (build/test sub-phase).

### TM-FUT-001 — CI onboarding workflow

1. **Source:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) job `readiness`; `scripts/checks/check-onboarding-readiness.sh`.
2. **Test type:** CI integration.
3. **Acceptance:** `readiness` job runs `./scripts/checks/check-onboarding-readiness.sh` on push/PR/workflow_dispatch and exits 0.
4. **Mocking:** None for CI; optional act-cli locally.
5. **SEO:** N/A.
6. **A11y:** N/A.
7. **Perf:** Job duration within CI budget (informational).
8. **Design token fidelity:** N/A.
9. **Pass/fail:** Pass when CI green on sample PR; coverage target N/A.
10. **Plan alignment:** **PT-04-harden** preparatory.

---

## Status legend

| Status | Meaning |
| ------ | ------- |
| drafted | Matrix row defined; automation not implemented |
| blocked | Depends on BLOCKERS section |
| ready | Can implement automated test when stack exists |

---

## Review gate

**Do not generate automated test files until this matrix is explicitly approved for the next implementation slice.** Approved by: _pending_
