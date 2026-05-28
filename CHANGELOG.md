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

This section is managed by automation (`pnpm changelog:draft`, finalize via `/SAVE commit`).
To correct a draft entry, update the source task in `.nezam/core/plans/` or plan metadata.
