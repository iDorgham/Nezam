# Changelog

All notable changes to this project will be documented in this file.

This changelog follows a **hybrid workflow**:

- Draft entries are generated from completed planning tasks.
- Drafts are finalized during `/SAVE commit` into dated and/or versioned entries.

## [Unreleased]

### Added

- PRD §11 release roadmap: canonical `docs/prd/release-roadmap.json` with `pnpm prd:roadmap` / `prd:roadmap:check` and CI drift check.

### Changed

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

