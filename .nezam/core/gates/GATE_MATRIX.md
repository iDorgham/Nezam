# GATE_MATRIX — NEZAM SDD & CI Gates

| Field | Value |
|---|---|
| Document | Gate matrix v1.0 |
| Status | Active |
| Owner | `swarm-leader` (PM-01) |
| Last updated | 2026-05-28 |
| Machine manifest | `.nezam/core/gates/GITHUB_GATE_MATRIX.json` |
| Path registry | `.nezam/core/gates/hardlock-paths.json` |
| Human checklist templates | `.nezam/templates/plan/GITHUB_*_GATE.template.md` |

This document is the **human-readable** gate source of truth. CI and scripts consume `GITHUB_GATE_MATRIX.json` where structured validation is required.

---

## 1. How to read this matrix

| Column | Meaning |
|---|---|
| **Gate ID** | Stable identifier for logs and PR comments |
| **Stage** | When the gate runs (`start`, `plan`, `develop`, `pre_merge`, `post_merge`, `ship`) |
| **Blocks** | Next action if gate fails |
| **Verifier** | Script, workflow, or command |
| **Artifacts** | Files that must exist and be non-template |

**Severity:** `hard` = no bypass (except `/FIX` with audit trail). `soft` = warning until phase lock.

---

## 2. Pipeline phase gates (SDD)

| Gate ID | Stage | Prerequisite | Blocks | Verifier |
|---|---|---|---|---|
| G-00 | start | Workspace attached; paths resolvable | `/plan` | `/START repo` |
| G-01 | start | PRD filled (no `{{PLACEHOLDER}}`) | `/plan` | `check-onboarding-readiness.sh` |
| G-02 | start | `PROJECT_PROMPT.md` aligned with PRD | `/plan` | `check-onboarding-readiness.sh` |
| G-03 | start | `DESIGN.md` exists at repo root | `/plan` | `onboarding.yaml` → `design_locked: true` |
| G-04 | start | `CHANGELOG.md` + `VERSIONING.md` | `/plan` | `check-onboarding-readiness.sh` |
| G-05 | plan | `prd_locked` + `design_locked` in state | Any `/plan *` | `gate-orchestrator` / `/check` |
| G-06 | plan | ≥1 feature spec (`F-*.md` or equivalent) | `/plan` deep phases | Spec glob in `hardlock-paths.json` |
| G-07 | plan | SEO / IA / content artifacts per product type | `/plan arch` | `plan_progress.yaml` |
| G-08 | plan | `ARCHITECTURE.md` at `.nezam/core/architecture/` | `/plan scaffold` | File presence |
| G-09 | plan | `GATE_MATRIX.md` (this file) | `/develop` | File presence |
| G-10 | plan | `GITHUB_GATE_MATRIX.json` valid structure | CI `readiness` job | `.github/workflows/ci.yml` |
| G-11 | design | Wireframe lock: `wireframes_locked.json` or `.session/` export | `/develop` | `sdd-pipeline-v2` WIREFRAME gate |
| G-12 | plan | `PROJECT_SCAFFOLD.md` + confirmed `scaffold.sh` | `/develop start` | `plan-phase-scaffold.mdc` |
| G-13 | plan | `planning_complete: true` | `/develop` | `plan_progress.yaml` |
| G-14 | develop | Subphase `prompt.json` + `PROMPT.md` per active slice | Slice work | `find …/prompt.json` in onboarding check |
| G-15 | develop | Prior develop phase `testing_passed: true` | Next develop phase | `develop_phases.yaml` |
| G-16 | ship | Security audit + Lighthouse thresholds | `/deploy` | `docs/reports/security/`, `.lighthouserc.json` |

### Product-type ordering (reference)

| Product type | Planning order highlight |
|---|---|
| Website | SEO → IA → Content → Architecture → Design → Wireframe → Scaffold |
| Web app | Architecture → IA → Design → Content → Wireframe → Scaffold |
| SaaS | Architecture + billing → IA → Design → Content → SEO (public) → Wireframe → Scaffold |

Full tables: `.cursor/rules/sdd-pipeline-v2.mdc`.

---

## 3. Design gates (implementation quality)

Enforced before production-facing `/DEVELOP` (see `.cursor/rules/design-gates.mdc`):

| Gate | ID | Requirement | CI / local |
|---|---|---|---|
| Token-first CSS | DG-01 | No hardcoded px/rem/hex outside token sources | `pnpm run check:tokens` |
| Fluid type & grid | DG-02 | `clamp()` typography; grid gaps from tokens | Design review |
| Motion budget | DG-03 | Composited props only; `prefers-reduced-motion` | Design review |
| 3D fallback chain | DG-04 | 3D → SVG/Canvas → static | Spec review |
| Component API | DG-05 | Typed variants, `forwardRef`, Storybook-ready | PR review |
| Perf + a11y | DG-06 | LCP, CLS, INP, WCAG 2.2 AA | Lighthouse workflow |
| Alignment | DG-07 | PRD, DESIGN, wireframes, specs aligned | `/check` |

---

## 4. Swarm governance gates (GATE-001 … 007)

| Gate | Rule | Enforced by |
|---|---|---|
| GATE-001 | No task without `SPEC.md` reference | PM-01 / `subagent-controller` |
| GATE-002 | Handoffs need confidence + verification + auditor | `agent-bus.yaml` |
| GATE-003 | P0/P1 dual-agent validation before `/develop` | Swarm policy |
| GATE-004 | MENA content → `arabic-specialist` + RTL parity | Conditional on `target_market` |
| GATE-005 | Escalations logged to `DECISIONS_PLAIN.md` | `SWARM_DECISION_LOG` |
| GATE-006 | Traceability PRD → SPEC → DESIGN → test (AC-IDs) | Commit + spec tags |
| GATE-007 | WCAG, privacy, MENA sensitivity; ethics veto | `lead-ai-ethics-officer` |

---

## 5. CI workflow map

| Workflow | Gates exercised |
|---|---|
| `ci.yml` | Onboarding readiness, gate manifest structure, roadmap sync, wireframe lock JSON |
| `design-gates.yml` | Token check, design contract |
| `nezam-pr-gates.yml` | `check:tokens`, `ai:check`, spec versions, SDD validator |
| `sync-and-drift-check.yml` | Mirror drift |
| `sdd-gate-enforcement.yml` | SDD hardlocks |

---

## 6. Machine manifest (`GITHUB_GATE_MATRIX.json`)

**Current status:** Minimal manifest present (`manifestVersion`, `gates[]`, `matrix{}`). CI expects additional keys: `generatedAt`, `owners`, `gateProfiles`, `taxonomy`, `severityModel`, `bypassBanRules`, and per-gate `stage` covering `start`, `end`, `pre_merge`, `post_merge`, `nightly_self_test`.

| Action | Owner |
|---|---|
| Expand JSON to full schema | `/FIX gates` or follow-up `/plan gates` revision |
| Validate locally | `python3` block in `ci.yml` (readiness job) or `/check` |

Until expanded, treat **this markdown matrix** as authoritative for humans; treat CI validation as the forcing function to complete the JSON.

### Planned JSON gate profiles

| Profile | Use |
|---|---|
| `spec_only` | Doc-only changes |
| `subphase` | Single plan subfolder |
| `phase` | Full SDD phase transition |
| `release_affecting` | Version bump + changelog |

---

## 7. `/DEVELOP` prerequisite bundle (quick reference)

All must pass before `/DEVELOP start`:

1. `.nezam/core/prd/PRD.md` (or resolved intake path)
2. `docs/start/PROJECT_PROMPT.md` or plan prompt path
3. `CHANGELOG.md`
4. `.nezam/core/specs/VERSIONING.md`
5. `.nezam/core/architecture/ARCHITECTURE.md`
6. `DESIGN.md` (root)
7. `.nezam/core/gates/GATE_MATRIX.md` (this file)
8. `GITHUB_GATE_MATRIX.json`
9. Subphase `prompt.json` + `PROMPT.md` where `TASKS.md` exists
10. `wireframes_locked.json` when UI is in scope

---

## 8. Unlock commands

| Situation | Command |
|---|---|
| Don't know current gate status | `/guide status` or `/check` |
| Gate failure remediation | `/FIX gates` |
| Planning blocked | `/START` then `/plan <phase>` |
| Design drift | `/SCAN a11y perf` then update `DESIGN.md` |
| Forward work blocked by missing wireframes | `/wireframe` + Design Hub lock |

---

## Decision amendments

| Date | Field | Previous | New | Reason | Approved by |
|---|---|---|---|---|---|
| 2026-05-28 | Canonical human matrix | (none) | `.nezam/core/gates/GATE_MATRIX.md` | `/PLAN gates` deliverable | PM-01 |

---

*Cross-reference: `workspace-orchestration.mdc` · `design-gates.mdc` · `nezam-gate-orchestrator` skill*
