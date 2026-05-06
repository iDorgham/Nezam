# COIA — Cursor workspace orchestration kit

Composable **slash commands**, **skills**, **rules**, and **templates** for Specification-Driven Development with SEO-first wording, prototype-first `DESIGN.md`, disciplined Git versioning, and browser-based “outside brain” assistants (**Grok**, **Qwen**, **Gemini**, etc.). Companion briefing: [docs/external-ai/GROK_INSTRUCTIONS.md](docs/external-ai/GROK_INSTRUCTIONS.md).

## Quick orientation


| Command    | Role                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| `/START`   | Onboarding: clone/link repo, scaffold PRD/Prompt/`DESIGN.md`, external-AI briefing |
| `/PLAN`    | SDD: roadmap→phases→specs→docs; SEO→IA→content; release/version/tag plan           |
| `/DEVELOP` | Implement from approved specs/design prototypes                                    |
| `/DEPLOY`  | Release mechanics, tagging, deployment checklist                                   |
| `/CREATE`  | Instantiate templates/doc shells                                                   |
| `/SCAN`    | Security/perf/accessibility/content/SEO-AEO-GEO auditing                           |
| `/FIX`     | Triage findings and produce minimal safe patches                                   |
| `/SAVE`    | Git hygiene: branching, commits, checkpoints, versioning alignment                 |
| `/GUIDE`   | “Best friend”: where am I, what next, unblock copy-pastes                          |


### Quick reference card (aliases)

Optional shorthand (same commands): `/START` → `/st`, `/PLAN` → `/pl`, `/DEVELOP` → `/dv`, `/DEPLOY` → `/dp`, `/CREATE` → `/cr`, `/SCAN` → `/sc`, `/FIX` → `/fx`, `/SAVE` → `/sv`, `/GUIDE` → `/gd`.

**Team & memory:** Personas live in `[.cursor/agents/README.md](.cursor/agents/README.md)`. Layered memory model: `[docs/context/MEMORY_ARCHITECTURE.md](docs/context/MEMORY_ARCHITECTURE.md)`.

Skills hold long procedures (`/.cursor/skills/<name>/SKILL.md`). Rules inject short guardrails (`/.cursor/rules/*.mdc`).

## TUI Features

Structured output (banners, badges, collapsible sections, box-drawing ASCII tables, optional live progress bar) is implemented in `[scripts/ui/workspace-tui.sh](scripts/ui/workspace-tui.sh)` and documented for every slash command.

- `**--format=auto|markdown|terminal`:** Set `COIA_TUI_FORMAT` when sourcing the script, or ask the agent for a profile in chat. `**auto`** selects **markdown** when `CURSOR_CHAT=1` or stdout is not a TTY (CI logs, Cursor chat); otherwise **terminal** (ANSI when supported).
- **Preferences:** [.cursor/tui.json](.cursor/tui.json) — colours, progress bar, compact layout hooks.
- **Local check:** `bash scripts/testing/test-tui.sh` (optional `COIA_TUI_TEST_SLEEP=0.1` for faster runs).

## Trusted external lists (skills & agents)

- [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — curated Cursor rules ecosystem
- [spencerpauly/awesome-cursor-skills](https://github.com/spencerpauly/awesome-cursor-skills) — `SKILL.md` patterns
- [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) — large multi-tool skill collections (Cursor + others)
- [babysor/awesome-agent-skills](https://github.com/babysor/awesome-agent-skills) — vendor + community skill index

Bring in third-party snippets deliberately: review licensing, shrink to project needs, cite sources in commit messages.

## Minimum manual setup

1. Import/attach GitHub repo (or `git init` / clone) and open in Cursor
2. Run `/START repo` then scaffold docs (`/START docs`)
3. Create PRD at `docs/specs/prd/PRD.md` (`/CREATE prd`)
4. Create prompt doc at `docs/prompts/PROJECT_PROMPT.md` (`/CREATE prompt`)
5. Run `/START gates` (hard requirement before planning)
6. Generate Claude handoff prompts: `/CREATE claude-cli-prompt` and `/CREATE claude-code-handoff` (optional `/CREATE claude-md` for root `CLAUDE.md`). Open **Claude CLI** (`claude` in the repo root) or **Claude Code** in your editor and run planning using `docs/prompts/CLAUDE_CLI_PLAN.md` / `docs/prompts/CLAUDE_CODE_HANDOFF.md` — details in `[docs/external-ai/CLAUDE_CLI_AND_CODE.md](docs/external-ai/CLAUDE_CLI_AND_CODE.md)`.
7. Run `/PLAN sdd seo ia content design versioning` in Cursor (refine / align SDD outputs).
8. After `DESIGN.md` sign-off analog in docs, `/DEVELOP feature ...`

## GitHub automation baseline

To guarantee automation starts from day zero:

1. Add/import the GitHub repository first (`/START repo`).
2. Complete planning gates before implementation.
3. Define version/tag intent in `docs/specs/sdd/VERSIONING.md`.
4. Use branch names `feature/`*, `release/`*, or `hotfix/*`.
5. Use Conventional Commits so release automation stays deterministic.

Current automation scaffolding:

- CI policy checks: `.github/workflows/ci.yml`
- Release/tag workflow: `.github/workflows/release.yml` (`workflow_dispatch` + annotated tag + GitHub release)
- Convenience dispatcher (tag/release only; rejects branch/commit): `.github/workflows/git-automation.yml`
- **Semantic-release (opt-in):** `.github/workflows/semantic-release.yml` — `workflow_dispatch` only; uses `[release.config.cjs](release.config.cjs)` + `[package.json](package.json)`. Do **not** combine blindly with `[release.yml](.github/workflows/release.yml)` on the same release line (duplicate tags risk).
- SemVer helper: `scripts/release/version-plan.sh`

## Context auto-sync setup

Canonical assistant context docs live in:

- `docs/context/instructions.md`
- `docs/context/workspace.md`
- `docs/context/project.md`

Install local hooks once per clone:

```sh
bash scripts/context/install-context-hooks.sh
```

Manual refresh (dry-run friendly):

```sh
python3 scripts/context/update-context-docs.py
```

Recommended operating loop:

1. `/START all`
2. `/CREATE claude-cli-prompt` (and `claude-code-handoff` / `claude-md` as needed); plan once in **Claude CLI** or **Claude Code** per `[docs/external-ai/CLAUDE_CLI_AND_CODE.md](docs/external-ai/CLAUDE_CLI_AND_CODE.md)`
3. `/PLAN all`
4. Work in `/DEVELOP ...`
5. `/SAVE report` after milestones
6. Upload `docs/reports/PROGRESS_REPORT.latest.md` + `docs/context/workspace.md` + `docs/context/project.md` to your external AI

## Recommended workflows

**Daily development**

1. `/GUIDE next` (or `/DEVELOP start`) — confirm branch + active spec.
2. `/DEVELOP slice` or `/DEVELOP feature <id>` — vertical slice.
3. `/DEVELOP test` — tests mandated by spec.
4. `/SAVE commit` then `/SAVE push` — conventional commits only.

**Release**

1. `/SCAN security` and `/SCAN all` as appropriate.
2. `/SAVE tagplan` → `/DEPLOY tag` (or GitHub **Actions → git-automation → tag/release** to dispatch `release.yml`).
3. `/DEPLOY verify` after ship; `/DEPLOY rollback` plan if needed.

**Troubleshooting**

1. `/SCAN perf` or `/SCAN code` — narrow signal.
2. `/FIX triage` → `/FIX patch` → `/FIX verify`.
3. `/GUIDE recommend` — unblock with one next command.

## Phase checklist (first-time)

**Before starting**

- GitHub repo attached or created; `git remote -v` shows `origin`
- External companion brief reviewed: `[docs/external-ai/GROK_INSTRUCTIONS.md](docs/external-ai/GROK_INSTRUCTIONS.md)`
- Cursor + git installed

**Phase 1 — Planning**

- `/START repo` / `/START docs` as needed
- `/CREATE prd` + `/CREATE prompt`; `/START gates` passes
- `/CREATE claude-cli-prompt` + `/CREATE claude-code-handoff` (optional `/CREATE claude-md`); plan in **Claude CLI** or **Claude Code** — `[docs/external-ai/CLAUDE_CLI_AND_CODE.md](docs/external-ai/CLAUDE_CLI_AND_CODE.md)`
- `/PLAN seo` → `/PLAN ia` → `/PLAN content` → `/PLAN design` → `/CREATE design` if missing
- `/PLAN versioning`; `/PLAN specs` or `/PLAN sdd` for full spine

**Phase 2 — Development**

- `/DEVELOP` aligned with `DESIGN.md`
- `/SAVE commit` per logical slice; `/SAVE report` for external handoff

**Phase 3–5 — Hardening & ship**

- `/SCAN all`; `/FIX` as needed
- `/DEPLOY rc` → `/DEPLOY tag` / release workflow
- `/DEPLOY verify` on staging/production targets

