# Feature Spec — F-002: Multi-Client AI Sync

## Meta

| Field | Value |
|---|---|
| Feature ID | F-002 |
| Priority | P0 |
| Status | approved |
| Last updated | 2026-05-29 |

## 1. User Story

**As a** maintainer,
**I want** `.cursor/` changes mirrored to Claude, Codex, Gemini, and other clients,
**so that** every tool follows the same commands, agents, and rules.

## 2. Acceptance Criteria

- [ ] **AC-001:** `pnpm ai:sync` completes without ENOENT on skill symlinks.
- [ ] **AC-002:** `pnpm ai:check` passes on CI for Tier-1 mirrors.
- [ ] **AC-003:** Editing only `.claude/commands/` without sync fails review policy.

## 3. Definition of Done

- [ ] Pre-commit hook documented in README
- [ ] `multi-tool-sync.mdc` rules reflected in generated `AGENTS.md`
