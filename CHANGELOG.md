
# Changelog

All notable changes to this project will be documented in this file.

This changelog follows a **hybrid workflow**:

- Draft entries are generated from completed planning tasks.
- Drafts are finalized during `/SAVE commit` into dated and/or versioned entries.

## [Unreleased]

### Added

- `/nezam certify` command to link `EVAL_FRAMEWORK.md` results to `AGENT_REGISTRY.yaml` for certified status tracking.
- `analytics-observability` skill for telemetry and real-time gate violation logging.
- Mandatory refusal protocols and anti-hallucination anchors added to `AGENT.template.md`.
- PRD §11 release roadmap: canonical `docs/prd/release-roadmap.json` with `pnpm prd:roadmap` / `prd:roadmap:check` and CI drift check.

### Changed

- Merged Gate Validator and Hardlock Manager into a unified `gate-orchestrator` skill.
- Updated `workspace-orchestration.mdc`, `check.md`, `plan.md`, `swarm-leader.md`, and `deputy-swarm-leader.md` for gate orchestration.
- Root `DESIGN.md` applied from `minimal` design profile for design-gate Gate 7.

### Fixed

- NEZAM PR Gates: add `packageManager` and use `pnpm/action-setup@v4` without a conflicting `version` key so `pnpm install` runs on CI.
- Design Gates / Lighthouse: `staticDistDir` points at `docs/lhci-stub` so Gate 6 has a URL to collect (workspace kit has no web app).

### Security

## Drafts (auto-generated — do not edit by hand)

<!--
This section is managed by automation.
If you need to correct a draft, update the source task or plan metadata instead.
-->
