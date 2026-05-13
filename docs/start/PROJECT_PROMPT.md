# NEZAM — Project Prompt

This file is the execution north star for AI agents and humans working in the NEZAM governance repository. It must stay aligned with `docs/core/required/PRD.md` (same product scope, same vocabulary).

## Mission

Ship and maintain a specification-driven workspace kit: commands, agents, skills, rules, and documentation that keep multi-tool AI development deterministic, traceable, and gate-driven from planning through hardening.

## Non-negotiables

- **Governance first:** follow SDD phase order and gate matrix before implementation work.
- **Canonical `.cursor/`:** edit commands, agents, skills, and rules only under `.cursor/`, then run `pnpm ai:sync` and `pnpm ai:check`.
- **Durable memory:** persist decisions in `.nezam/memory/` and plans under `docs/plans/` instead of chat-only state.
- **Workspace parity:** keep Antigravity, Claude, Codex, OpenCode, and Kilo mirrors generated; never treat mirrors as source of truth.

## Delivery posture

Prefer small, reviewable changes with verification commands recorded in handoffs. When scope touches design tokens, performance, or accessibility, run the relevant scans before claiming completion.

## Out of scope (this repo)

Building a separate production customer application inside this tree without its own approved spec and scaffold. NEZAM remains the meta-workspace and toolkit, not a bundled product monolith unless the PRD explicitly expands scope.
