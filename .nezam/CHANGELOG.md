# NEZAM — Changelog

All notable changes to the NEZAM workspace governance system are documented here.

Format: `## [version] - YYYY-MM-DD`

---

## [3.1.0] - 2026-05-14

### Added — Deep SDD Overhaul + Wireframe Server

**Specification Quality (Kiro-inspired)**
- `PRD.template.md` — complete rewrite from 54 lines to 17-section comprehensive template. Enforces: all personas with JTBD statements, all user flows with error branches, full data model with every field typed, all API endpoints with request/response shapes, every screen × 5 states (loading/empty/error/populated/offline), explicit out-of-scope list, risks register
- `PROMPT_DOCUMENT.template.md` — complete rewrite from 15 lines to 15-section agent contract. Key addition: Section 6 Agent Decision Rules with explicit forbidden patterns (`any` types, hardcoded colors, inline styles, direct DB calls from frontend, etc.)
- `FEATURE_SPEC.template.md` — new deep per-feature spec template (Kiro-style). Includes: Given/When/Then acceptance criteria, 5-state screen spec per section, component inventory, interaction spec, responsive breakpoints, motion contract, validation rules table, all API error codes, edge cases table, analytics events, 15-item Definition of Done

**Onboarding + Planning Commands**
- `/START` command — complete rewrite. Now enforces 5 identity questions (product name, GitHub repo, target market with RTL flag, team size, build mode) asked one at a time. Added Deep PRD step with mandatory internal enumeration before writing. Added FEATURE_SPEC generation step for all P0 features. Path resolution reads from `hardlock-paths.json`.
- `/PLAN idea` — added mandatory Deep Thinking Phase before any output: feature map, permission matrix, all user flows with failures, all entities, all screens × 5 states, all integrations, all edge cases, all NFRs → scope preview → user confirms → then writes

**Wireframe Server Architecture**
- `.nezam/templates/wireframe-server/project_context.schema.json` — JSON Schema v7 for agent→server communication contract (meta, canvas_mode, sitemap, pages, design_system, component_library, ai_notes)
- `.nezam/templates/wireframe-server/wireframes_locked.schema.json` — JSON Schema v7 for server→agent output contract (design_decisions, locked/flexible props, content_slots, navigation_map, implementation_contract, session_stats)
- `.nezam/templates/wireframe-server/block_registry.json` — full catalog of 40+ UI blocks across 4 canvas modes (web-marketing, saas-dashboard, mobile-app, tui) with props, defaults, and canvas_mode_defaults
- `.nezam/templates/wireframe-server/F-WF-001-wireframe-server.spec.md` — full Feature Spec for the wireframe server: 12 sections, 11 acceptance criteria, complete API spec (4 endpoints), 8 business logic rules, 6 edge cases, 5-screen state specs, testing requirements, definition of done
- `/wireframe` command — new SDD pipeline command: generates `project_context.json` from PRD/IA/DESIGN → instructs user to run server → validates `wireframes_locked.json` after session → unlocks SCAFFOLD

**Pipeline Gate Updates**
- `sdd-pipeline-v2.mdc` — added WIREFRAME gate between DESIGN and SCAFFOLD for all 3 product types (website, webapp, saas). Gate requires `wireframes_locked.json` before SCAFFOLD unlocks. All mirrors synced.

### Fixed
- `hardlock-paths.json` — fixed `intake.prd` path to `docs/plan/00-define/01-product/PRD.md` (was pointing to wrong location), added `intake.projectPrompt` path
- `ensure-changelog-initialized.js` — fixed critical bug: was reading hardlock registry from `docs/gates/hardlock-paths.json` (wrong path), now reads from `.nezam/gates/hardlock-paths.json`. Fixed duplicate template candidate entry.
- `GITHUB_GATE_MATRIX.json` — added missing `"manifestVersion": "1.0.0"` field required by gate check script
- `check-onboarding-readiness.sh` — updated failure messages to reflect new onboarding flow (user drops PRD to `docs/start/`, agent processes from there)
- `CHANGELOG.md` — moved from `.nezam/workspace/meta/CHANGELOG.md` to `.nezam/CHANGELOG.md` (canonical location). Root `CHANGELOG.md` reserved for project changelog.

### Changed
- `hardlock-paths.json` — `planning.changelog` now points to `.nezam/CHANGELOG.md`
- `CLAUDE.md` — added `wireframe.md` to synced command index
- All command mirrors (`.claude/`, `.antigravity/`, `.opencode/`) — synced with new `wireframe.md` and updated `sdd-pipeline-v2.mdc`

---

## [3.0.0] - 2026-05-12

### Added
- Multi-tool support: Tier 1 (Cursor, Claude Code, Antigravity, Codex) + Tier 2 (Windsurf, Roo, Kilo, OpenCode, Qwen, Gemini)
- Build method overlays: `sdd` (default), `lean`, `tdd`, `api-first` via `build_mode` in onboarding.yaml
- Agent/skill versioning: SemVer frontmatter + certification flags + changelog arrays
- State schema validation: `.cursor/state/schemas/` with 3 schema files
- Git pre-commit hook: auto-runs `pnpm ai:sync` when `.cursor/` files staged
- `/check repair` subcommand for state file recovery
- `/check score` subcommand for point-breakdown health scores
- Output scoring engine: 6-dimension point-breakdown in health-score SKILL.md
- `VERSIONING.md` and `CHANGELOG.md` governance docs
- AGENT_REGISTRY.yaml: `nezam_version`, `last_sync`, `certified_agents` fields
- Getting Started guides: `.nezam/workspace/tools/` for Cursor, Claude Code, Antigravity, Codex

### Fixed
- **CRITICAL:** PRD path conflict — replaced `.nezam/workspace/prd/PRD.md` with `.nezam/workspace/prd/PRD.md` everywhere
- WIREFRAMES path: `.nezam/workspace/prd/sdd/WIREFRAMES.md` → `docs/plans/04-design/WIREFRAMES.md`
- health-score SKILL.md: replaced `.nezam/workspace/prd/` inputs with state-file-based inputs
- Memory layers reference: updated to `.nezam/workspace/prd/`, `docs/plans/`, `docs/reports/`

### Changed
- `workspace-orchestration.mdc`: legacy Planning hardlock section preserved as comment, superseded by state-file-aware section
- `sdd-gate-validator/SKILL.md`: added Pre-Gate State File Validation section
- `health-score/SKILL.md`: upgraded to point-breakdown scoring system
- `swarm-leader.md`: added `build_mode` awareness in session start protocol, version frontmatter
- `subagent-controller.md`: added version frontmatter

---

## [2.0.0] - 2026-05-11

### Added
- `/guide` command with 7 subcommands (next, status, phase, map, why, how, stuck)
- 3 Action Block Types: PROMPT, TERMINAL, SLASH COMMAND
- Response Style System in workspace-orchestration.mdc
- `sdd-gate-validator` skill
- `progress-narrator` skill
- `wireframe-catalog` skill upgrade
- `/check` gate validation command

### Removed
- `/founder` command (replaced by `/start`)

### Changed
- `/start` command: full onboarding flow with 4 PRD modes, 2 design paths, hardlock chain
- State files: `onboarding.yaml`, `plan_progress.yaml`, `develop_phases.yaml`

---

## [1.0.0] - 2026-05-10

### Added
- Initial NEZAM workspace governance system
- 13-swarm architecture with 100+ agents
- SDD pipeline (6 phases + gates)
- `.nezam/design/` catalog with 150+ design profiles
- Multi-tool mirrors: `.claude/`, `.antigravity/`, `.codex/`, `.gemini/`, `.kilocode/`, `.opencode/`
- Core commands: `/start`, `/plan`, `/develop`, `/deploy`, `/fix`, `/scan`, `/check`, `/nezam`, `/settings`
