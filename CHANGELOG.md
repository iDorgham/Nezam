# CHANGELOG

All notable changes to NEZAM are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · SemVer.

## [Unreleased]

### Added
- `docs/architecture/ARCHITECTURE.md` — system overview, storage decision (Vercel Blob), AI integration decision (Vercel AI Gateway), and §12 API contract table covering Phase 2 routes.
- Property Inspector (F-007) — 4-tab panel (Layers/Settings/CSS/A11y), logical box-model fields, fluid typography with hardlock, live WCAG contrast badge, multi-select with `(mixed)` placeholders, RTL-aware label annotations. 83 unit tests passing.

### Notes
- Phase 1 (Foundation) marked complete 2026-05-19.
- Phase 2 (Core Features) unlocked 2026-05-19; Phase 2A — Motion Studio ✅, Phase 2B — Asset Browser ⬜ (8 tasks).

## [0.1.0] — Design server scaffold

### Added
- `.nezam/design-server` Next.js 16 App Router workspace
- Canvas graph store (Zustand) — `SPEC-DS-CANVAS-001` v1.0.0
- Token Studio (F-001..F-004) and Infinity Canvas (F-005)
- Generative propagation flow doc

---

*Sub-project changelog: `.nezam/CHANGELOG.md`. This root changelog tracks repo-wide releases.*
