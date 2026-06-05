# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Workspace governance releases are tracked here. NEZAM meta-kit history also lives in `.nezam/core/meta/CHANGELOG.md`.

## [Unreleased]

### Added

### Changed

### Fixed

### Security

## [0.3.2] - 2026-06-05

Milestone: **v3.2 Health Hardening** (strategic plan for 100/100 system health, CI/CD automation, and multi-client parity).

### Added

- Comprehensive `ROADMAP_v3.2_HEALTH_100.md` planning framework, index, release plan, and RICE prioritized backlog.
- Release checklists, executive briefs, post-release checkups, and sync analysis reports under `.nezam/core/reports/`.
- `.nezam/core/tools/antigravity-phase2-branching.md` and Phase 2 setup documentation.
- Client agent mappings and commands for `.gemini/`, `.qwen/`, `.kiro/`, `.kilocode/`, `.opencode/`, and `.codex/`.
- New scripts including `create-phase-branch.sh` and `phase2-orchestrate.sh` for branch automation and Phase 2 orchestration.
- Phase-gating automation workflows (`sdd-phase-automation.yml` and `sdd-phase-gates.yml`) in GitHub actions.

### Changed

- Unified the plans tree directory: moved plans, roadmaps, specs, and checklists to `.nezam/core/plans/` and `.nezam/core/gates/`.
- Updated `.github/workflows/` (sync, lint, test, release, CI, and PR gates) to align with unified paths.
- Synchronized all workspace client contracts across Claude, Copilot, VS Code, and Windsurf, resolving sync drift.

### Fixed

- Hardlock and spec version paths in `check-sdd-integrity.sh` and other core validation scripts.
- Registry paths inside changelog automation scripts (`draft-from-tasks.js` and `finalize-from-commit.js`) to point to `.nezam/core/gates/hardlock-paths.json`.

## [0.3.0] - 2026-06-04

Foundation milestone: R1 path unification + R2 performance & branch-policy enforcement. Dependency stack fully updated.

### Added

- Release planning and audit documentation under `docs/reports/` (release plan, pre/post-release task checklists, follow-up audit, task index).

### Changed

- **R1:** Unified SDD path structure, deduplicated skill registrations, migrated plan tree to `.nezam/core/plans/` (#65).
- **R2:** Branch policy enforcement via `pre-push` hook and CI; performance pass reducing cold-start overhead (#66).
- Dependency upgrades: `typescript` 5→6, `@types/node` 22→25, `react-dom` 19.2.6→19.2.7, `ai` 6.0.195→6.0.196, `zod` 4.3.6→4.4.3, `playwright` 1.51→1.60, `happy-dom` 20.9→20.10, `js-yaml` 4.1.1→4.2.0, `axe-core` 4.11→4.12, `actions/checkout` 4→6, `actions/setup-node` 4→6.

### Fixed

- Legacy-path CI failures and stray submodule gitlink (#52).
- Branch policy regex now enforced pre-push so feature/release/hotfix naming is blocked at the client (#66).

### Security

- (none beyond inherited 0.2.0 CVE remediations)

## [0.2.0] - 2026-06-03

Design Hub quality, hardening, and polish milestone (develop phases 3–5). 180 tests green, type-check clean.

### Added

- **Quality (Phase 3):** test suites for a11y (axe), RTL audit, motion/scheduler, API integration, AI-route security, session store; implemented `hardlock-check`, `context-compression`, `svg-sanitizer` modules (specs SPEC-QA-001..009).
- **Polish (Phase 4):** axe coverage for Radix Dialog/Tabs/DropdownMenu/Tooltip/Select; App Router `loading.tsx`/`error.tsx`/`not-found.tsx`; `EmptyState` primitive; Lighthouse budget validation + RSC-boundary guard; `perf:lhci` script (specs SPEC-AX/PERF/UX-001).
- **Hardening (Phase 5):** path-traversal regression tests; dependency CVE audit report + `security:audit` script; error/secret-leakage sweep; security-module fuzzing (specs SPEC-SEC-001..004).

### Changed

- a11y gate (`test:a11y`) extended to cover UI primitives and Radix components.
- Test setup adds in-memory `localStorage` + Radix-friendly polyfills (ResizeObserver, pointer-capture, scrollIntoView, matchMedia).

### Fixed

- Associated unlabeled `Input` and `Select` labels (`useId`/`htmlFor`) — WCAG label violations.
- `release.config.cjs` / `release.yml` now target the real default branch `Master` (was `main`).

### Security

- Documented 2 moderate dependency CVEs (postcss `<8.5.10` → next) with a CI-verified remediation plan in `docs/reports/security/dependency-audit.md`.

## [0.1.0] - 2026-05-28

Workspace Kit baseline — onboarding gates, design contract, and core planning artifacts.

### Added

- Canonical SDD planning outputs: `.nezam/core/architecture/ARCHITECTURE.md`, `.nezam/core/gates/GATE_MATRIX.md`
- Root `CHANGELOG.md` initialized with SemVer **0.1.0** per PRD release roadmap
- Design Hub package (`.nezam/design-hub/`) — Architecture, Wireframes, Preview, Components, Tokens
- Multi-client sync entrypoints: `pnpm ai:sync`, `pnpm ai:check`, pre-commit hook source in `.nezam/core/scripts/hooks/`
- Gate registry: `.nezam/core/gates/hardlock-paths.json`, `.nezam/core/gates/GITHUB_GATE_MATRIX.json`
- Onboarding readiness script: `pnpm run check:onboarding`
- Active design contract at repository root: `DESIGN.md`

### Changed

- Architecture canonical path prefers `.nezam/core/architecture/ARCHITECTURE.md` (registered in `hardlock-paths.json`)

### Fixed

- (none in this baseline tag)

### Security

- Reports policy: generated outputs under `docs/reports/<category>/` only

---

## Drafts (auto-generated — do not edit by hand)

<!--
This section is managed by automation.
If you need to correct a draft, update the source task or plan metadata instead.
-->

_No drafts yet._
