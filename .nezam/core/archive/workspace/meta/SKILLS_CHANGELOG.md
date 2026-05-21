# NEZAM Skills Changelog

All notable changes to the NEZAM skill library are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Skills follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## 2026-05-12 — Priority 7 & 8: AI/LLM Skills + External Skills Audit

### Added (system/)

- **`llm-integration`** `v1.0.0` — LLM provider routing, prompt engineering contract, context assembly (chunking), response validation, and call logging. Supports OpenAI, Anthropic, Gemini, Mistral, Ollama.
- **`ai-safety-guardrails`** `v1.0.0` — Pre/post LLM call safety filters. PII detection (including MENA-specific patterns), jailbreak/injection resistance, toxicity scoring, output sanitization, safety event audit log.
- **`ai-ux-patterns`** `v1.0.0` — UX design patterns for AI-powered features: streaming output, loading states, confidence indicators, error recovery, transparency labels, and MENA-specific RTL/cultural considerations.
- **`agent-eval`** `v1.0.0` — 5-dimension evaluation framework (Accuracy, Compliance, Quality, Tone, Hallucination) for NEZAM agents and product agents. Includes manual rubrics, automated checks, regression detection, and monthly health reports.
- **`prompt-audit`** `v1.0.0` — Systematic audit of all agent and product prompts: quality scoring (5 criteria), injection vulnerability scanning, drift detection, MENA/Arabic prompt review, and improvement recommendations.
- **`cost-monitor`** `v1.0.0` — LLM cost tracking by task type, model, provider. Budget alert/block logic, model optimization recommendations, and monthly cost reports in `docs/reports/ai/COST_REPORT.md`.

### Added (external/)

- **`api-testing`** `v1.0.0` — Contract testing, integration test scaffolding, Bruno/Postman collection management, mock server setup (Prism/WireMock), CI integration.
- **`deployment-checklist`** `v1.0.0` — Pre/post deployment gates, environment validation, rollback plan documentation, observability confirmation, go/no-go decision framework.
- **`handoff-report`** `v1.0.0` — Structured session/agent/human transition documentation: state capture, decisions log, open items, and single next-action brief. Triggered by `/SAVE log`.

### Added (indexes)

- **`skills/external/SKILLS_INDEX.md`** — First full index of all 7 external skills with categories, trigger mapping, and instructions for adding new skills.
- **`.nezam/workspace/meta/SKILLS_CHANGELOG.md`** — This file. Central changelog for all skill additions, updates, and deprecations.

---

## 2026-05-10 — Priority 5 & 6: Design Skills + Arabic/MENA Skills

### Added (design/)

- `wireframe-pipeline` — Merge of `wireframe-catalog` + `wireframe-to-spec` (consolidated pipeline).
- `ux-research-protocol` — User research methods, participant recruiting, synthesis templates.
- `design-token-contract` — Token naming, documentation, and cross-tool export standards.
- `component-library-spec` — Component API contracts, accessibility requirements, Storybook integration.
- `motion-design-system` — Animation principles, reduced-motion, performance budgets.
- `brand-identity-system` — Logo, color, typography governance for brand-consistent products.

### Added (system — Arabic/MENA)

- `arabic-typography` — Arabic typeface selection, diacritics handling, OpenType feature mapping.
- `moroccan-darija` — Moroccan Arabic dialect guidance with French-loanword handling.
- `register-detection` — Automatic Arabic register detection (MSA vs. dialect classification).
- `levantine-content` — Levantine dialect content production for Syrian, Lebanese, Palestinian, Jordanian.
- `khaleeji-content` — Gulf Arabic content production with regional vocabulary.

### Deprecated (design/)

- `wireframe-catalog` — Superseded by `wireframe-pipeline`. Deprecated header added.
- `wireframe-to-spec` — Superseded by `wireframe-pipeline`. Deprecated header added.

---

## 2026-05-08 — Phase 2: Foundation Skills

### Added (system/)

- `sdd-gate-validator` — Gate enforcement for SDD pipeline transitions.
- `progress-narrator` — Milestone narrative for solo (friendly) and team (structured) modes.
- `health-score` — 6-dimension project health scorecard, writes `HEALTH.md`.
- `build-modes` — SDD/Lean/TDD/API-First overlay system for `/start`.
- `context-window-manager` — Token budget management for large context operations.
- `decision-journal` — Structured decision capture with ADR format.
- `reflection-loop-engine` — Agent self-review and improvement cycle.
- `multi-agent-handoff` — Structured state passing between swarm agents.
- `task-decomposition` — Complex task breakdown into atomic subtasks.

### Added (external/)

- `git-workflow` — Branching, commits, tags, PR gates, branch protection, Dependabot.
- `plan-full` — Full SDD planning spine.
- `external-ai-report` — Cross-tool AI progress reports.
- `guide-instructor-domains` — Teaching and explanation scaffolding.

---

## Versioning Policy

- **MAJOR** (`x.0.0`): Breaking change — removes or renames sections other skills depend on.
- **MINOR** (`1.x.0`): New sections or capabilities added without breaking existing callers.
- **PATCH** (`1.0.x`): Clarifications, typo fixes, example updates; no behavior change.

Skills at `v1.0.0` are stable and production-ready.
Skills at `v0.x.x` are experimental and may change without notice.
