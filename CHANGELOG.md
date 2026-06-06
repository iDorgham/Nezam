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

## [0.3.6] - 2026-06-06

Milestone: **v0.3.6 Health Acceleration Release** — 6-phase governance hardening cycle targeting system health 65 → 100. Covers sync integrity, CI/CD pipelines, security scanning, design system bridge, observability, content ops, and full release documentation (38 tasks, 0 open blockers).

### Added

- **Foundation Hardening (P1):** Orphaned skill audit — 21 skills archived, `DEPRECATED.md` created, 16 agent refs fixed. `verify:yaml` now validates 44 schema files and exits clean. `agent-status.yaml` promoted to schema v2.0.0 with `last_sync`, `certified_agents`, `sync_drift_threshold`, and `drift_check_interval` fields. Weekly sync-drift CI gate (`sync-drift-check.yml`) promoted to blocking PR check with Slack alert on >1% drift. `SYNC_RUNBOOK.md` written (10 sections: recovery, rollback, drift response, certified agents, archive). Husky pre-commit verified executable — runs `ai:sync` + re-stages mirrors + `ai:check`. `CONTRIBUTING.md` expanded.
- **CI/CD Pipeline (P2):** Tier-1 gate validation on every PR. Release workflow smoke-tested end-to-end. CodeQL analysis integrated into the main CI matrix. Lighthouse CI performance budget enforced (`lhci` config + RSC guard). Weekly `ci-health-check` cron wired. `CI_FAILURE_GUIDE.md` authored.
- **Security Scanning (P3):** CodeQL setup and integration verified. Dependabot configured with weekly intervals across all dependency ecosystems. Push protection and secret scanning guidelines documented. `SECURITY_AUDIT_v3.2.md` generated with full threat modeling. `SECURITY_RUNBOOK.md` with secrets rotation schedule and incident response procedures. `SECURITY_BASELINE.md` snapshot captured. OWASP ZAP DAST action automated on weekly schedule. postcss XSS vulnerability overrides validated.
- **Design System + Wireframe Bridge (P4):** Empty-blocks registry validation script (`validate-blocks.mjs`). Wireframe lock schema promoted to v2.0 (`$schemaVersion: "2.0"`, `meta.validated_at`). `GATE-WF-02` gate wired into CI via `check-wireframe-schema-v2.js`. Three-mode lock-unlock cycle test (`test-lock-cycle.mjs`) validates `saas-dashboard`, `web-marketing`, and `mobile-app` canvases. `DESIGN_TO_CODE.md` bridge guide published to `docs/design/`. Design token compliance audit report (`token-audit.md`).
- **Observability + Content Ops (P5):** Sentry SDK configured for client, server, and edge runtimes. `useReportWebVitals` telemetry hook + `/api/vitals` ingestion endpoint. `PERF_BASELINE.md` capturing Core Web Vitals targets. `OBSERVABILITY_RUNBOOK.md` for Sentry/vitals operations. `SEO_BASELINE.md` with AEO audit results. Four content brief templates (blog post, landing page, release note, email). `CONTENT_OPS.md` lifecycle operations guide.
- **Docs, QA + Release (P6):** Master runbook index (`RUNBOOKS.md`). `TROUBLESHOOTING.md` FAQ guide. `ONBOARDING.md` developer onboarding guide. Full system regression run (`pnpm check:all` passes). CI load test verified. Staging/production readiness report (`readiness.md`). `v0.3.6` release tag cut on `Master`.

## [0.3.5] - 2026-06-06

Milestone: **v0.3.5 Polish Release** (Production-ready release with Gemini 3.5 Flash agents and rebranded phase prefixes).

### Added
- **AI Agents Swarm:** Built and integrated 11 specialized planning and execution agents (Gemini 3.5 Flash) into the `/plan` command structure.
- **SDD Automation:** Added FlowOrchestrator and SilentOpsExecutor for parallel execution and zero-friction git automation.
- **Rebranding:** Completed rebranding of legacy `v3.2` / `3.2.0` references to `v0.3.2` / `0.3.2` across the documentation suite.

### Changed
- Promoted `/plan` subcommand architecture to support parallel lanes and type detection.

## [0.3.2] - 2026-06-06

Milestone: **v3.2 Stabilization and Integration Release** (Integration of all stabilization cycles from Phase 1 to Phase 6).

### Added
- **Design System & Wireframes:** Created layout block validation checks (`validate-blocks.mjs`), promoted wireframe lock format to schema v2.0, added schema verification gate G-WF-02 to the gate matrix and CI pipelines, and documented layout locking workflows (`DESIGN_TO_CODE.md`).
- **Observability & Telemetry:** Configured Sentry client, server, and edge runtime integration, implemented Web Vitals (`useReportWebVitals` telemetry + `/api/vitals` endpoint), and added structured JSON logger for production.
- **Runbooks & Guides:** Created master runbook index (`RUNBOOKS.md`), troubleshooting/FAQ manual (`TROUBLESHOOTING.md`), developer onboarding guide (`ONBOARDING.md`), and deployment/rollback runbook (`DEPLOYMENT_RUNBOOK.md`).
- **QA & Verification:** Implemented multi-mode lock-unlock verification cycles for `saas-dashboard`, `web-marketing`, and `mobile-app` project canvas configurations. Added Percy visual regression testing configuration.

### Changed
- Promoted GITHUB_GATE_MATRIX.json to enforce v2.0 schema locks on `/develop start`.
- Configured client root layouts to automatically load and render Web Vitals performance reporting hooks.

## [0.3.1] - 2026-06-05

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
