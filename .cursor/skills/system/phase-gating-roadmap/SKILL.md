---
name: coi-phase-gating-roadmap
description: Enforce SDD phase transitions with hard-block exit criteria, versioning triggers, and traceable evidence.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Govern transitions across the canonical SDD pipeline (Planning → SEO/AEO/GEO → IA → Content → DESIGN → Development → Hardening) so that each gate has explicit, auditable pass/fail evidence and a versioning trigger. Single-responsibility: pipeline phase governance.

# Inputs

- Strategic roadmap from `@.cursor/skills/coi-strategic-planning/SKILL.md`.
- `docs/workspace/plans/INDEX.md` traceability matrix.
- Existing artifacts under `docs/core/required/sdd/`, `docs/core/required/features/`, `docs/DESIGN.md`.
- Versioning policy `docs/core/required/sdd/VERSIONING.md`.
- Active rules: `[.cursor/rules/sdd-design.mdc](.cursor/rules/sdd-design.mdc)`, `[.cursor/rules/design-dev-gates.mdc](.cursor/rules/design-dev-gates.mdc)`.

# Step-by-Step Workflow

1. For each phase, list required artifacts (e.g., SEO_RESEARCH.md, IA_CONTENT.md, DESIGN.md, SPEC.md, tokens.json).
2. Define hard-block criteria per phase (token-first, fluid type, motion budget, 3D fallback, component API, perf+a11y, design alignment, editorial discipline).
3. Run readiness probe: locate each artifact, validate frontmatter, check cross-references.
4. Run gate evidence collection: lint, type-check, perf budget, axe-core, contrast, schema validation.
5. Decide go/no-go per phase; emit explicit blocker list when no-go.
6. Tag versioning trigger when phase closes (semver bump, conventional commit prefix, changelog section).
7. Update `docs/workspace/plans/INDEX.md` with phase status; surface next legal `/COMMAND`.

# Validation & Metrics

- Every phase exit produces a written go/no-go decision with evidence list.
- Hard-block violations (Gate 1–7) cause immediate halt with remediation route.
- Versioning trigger fires only after gate green; pre-release tags only when phase incomplete.
- LCP < 2.5s, CLS < 0.1, INP < 200ms verified at hardening exit.
- WCAG 2.2 AA contrast & focus-state evidence stored.

# Output Format

- Phase gate report: phase name, required artifacts, evidence links, status, blockers.
- Versioning intent statement (semver bump rationale).
- `docs/workspace/plans/INDEX.md` status update (markdown table).
- Conventional-commit prefix recommendation per phase boundary.

# Integration Hooks

- `/PLAN all` triggers full gate sweep.
- `/SCAN a11y perf` and `/SCAN code` collect evidence.
- `/SAVE log` records phase closure; `/DEPLOY tag` honors versioning trigger.
- Pairs with `@.cursor/skills/coi-strategic-planning/SKILL.md` upstream and `@.cursor/skills/coi-task-decomposition/SKILL.md` downstream.
- Enforces `[.cursor/rules/coia-design-gates-pro.mdc](.cursor/rules/coia-design-gates-pro.mdc)` Gates 1–7.

# Anti-Patterns

- Closing a phase with unverified gate evidence.
- Mixing pre-release and stable semver bumps in the same gate.
- Relying on visual approval alone without token/a11y/perf checks.
- Conventional-commit drift (e.g., `feat:` for hardening hot-fixes).
- Running `/DEVELOP` while DESIGN gate is amber/red.

# External Reference

- Stage-Gate® methodology (Cooper) for gate criteria framing.
- Conventional Commits 1.0.0 (https://www.conventionalcommits.org/en/v1.0.0/).
- Semantic Versioning 2.0.0 (https://semver.org/).
- Closest skills.sh/official analog: phase-gating / release-gates.
