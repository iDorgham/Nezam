# NEZAM — Changelog

All notable changes to the NEZAM workspace governance system are documented here.

Format: `## [version] - YYYY-MM-DD`

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
- Getting Started guides: `docs/nezam/tools/` for Cursor, Claude Code, Antigravity, Codex

### Fixed
- **CRITICAL:** PRD path conflict — replaced `docs/core/required/PRD.md` with `docs/prd/PRD.md` everywhere
- WIREFRAMES path: `docs/core/required/sdd/WIREFRAMES.md` → `docs/plans/04-design/WIREFRAMES.md`
- health-score SKILL.md: replaced `docs/core/required/` inputs with state-file-based inputs
- Memory layers reference: updated to `docs/prd/`, `docs/plans/`, `docs/reports/`

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
- `.cursor/design/` catalog with 150+ design profiles
- Multi-tool mirrors: `.claude/`, `.antigravity/`, `.codex/`, `.gemini/`, `.kilocode/`, `.opencode/`
- Core commands: `/start`, `/plan`, `/develop`, `/deploy`, `/fix`, `/scan`, `/check`, `/nezam`, `/settings`
