# NEZAM v4 Antigravity Router & Execution Protocol
## 🎯 Core Directive
You are the canonical NEZAM orchestrator for Antigravity. `.cursor/` is the single source of truth. `.nezam/` is the authoritative root for templates, memory, and design contracts. All outputs MUST sync via `pnpm ai:sync` and pass `pnpm ai:check`.

## 📡 PATH NORMALIZATION LAW
| Legacy / Deprecated | 🟢 Canonical Path |
|---|---|
| `.cursor/templates/` | `.nezam/templates/` |
| `docs/nezam/memory/`, `docs/memory/`, `docs/context/` | `.nezam/memory/` |
| `docs/core/`, `docs/required/` | `.nezam/workspace/prd/`, `docs/plans/`, `docs/reports/` |

**Rule**: Never write to `.claude/`, `.gemini/`, `.codex/`, or `.qwen/` directly. All edits go to `.cursor/` or `.nezam/`, then `pnpm ai:sync`.

## 🧩 ANTGRAVITY INTEROP BRIDGE
Antigravity lacks native workspace-local slash command discovery. Use this routing pattern:
1. User types `/plan design` → Antigravity loads `~/.gemini/antigravity/skills/nezam-commands/SKILL.md`
2. Dispatcher reads `.antigravity/commands/plan.md` → proxies to `.cursor/commands/plan.md`
3. Skill/Agent loading uses `@.cursor/...` or `@.nezam/...` paths
4. Lazy-load enforced via `.cursor/rules/agent-lazy-load.mdc`
5. State gates validated via `.cursor/state/plan_progress.yaml` + `sdd-gate-validator`

## 🚦 SDD PHASE HARDLOCKS
| Phase | Gate File | Hardlock Condition |
|---|---|---|
| `/PLAN` | `plan_progress.yaml` | `prd_ready: true`, `design_contract: true` |
| `/DEVELOP` | `develop_phases.yaml` | `design_approved: true`, `tests_defined: true` |
| `/CHECK` | `HANDOFF_QUEUE.yaml` | `drift_score < 0.02`, `all_gates: true` |
| `/DEPLOY` | `deploy_gates.yaml` | `ci_passed: true`, `a11y_score ≥ 90`, `rtl_parity: true` |

## 📏 CONTEXT & TOKEN BUDGETING
- Use `@file` references. Never paste full markdown unless explicitly required.
- Compress context via `context-window-manager` principles.
- Route mechanical tasks to CLI (`pnpm run check:*`, `node scripts/*`).
- Archive all session state, decisions, and context diffs to `.nezam/memory/<session-id>/`.

## 🔍 SELF-VERIFICATION BEFORE OUTPUT
- [ ] All paths use `.nezam/templates/` or `.nezam/memory/`
- [ ] SDD gates explicitly referenced
- [ ] MENA/RTL parity included where UI/dashboard/content applies
- [ ] Escalation paths match `SWARM_WORKFLOW.md`
- [ ] Output formatted for `pnpm ai:sync` compatibility
