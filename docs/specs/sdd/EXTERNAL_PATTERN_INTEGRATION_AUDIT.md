# External pattern integration audit (COIA)

**Purpose:** Map professional agent/skill/design patterns from public ecosystems into COIA’s SDD pipeline without bypassing gates. **Pipeline:** Planning → SEO/IA → Content → `DESIGN.md` → Development → Hardening.

**Related:** [WORKSPACE_INDEX.md](../../context/WORKSPACE_INDEX.md), [instructions.md](../../context/instructions.md), `.cursor/rules/design-dev-gates.mdc`, `.cursor/rules/workspace-orchestration.mdc`.

---

## 1. Local governance map (integration surfaces)

| Layer | COIA paths | Role for external patterns |
| ----- | ---------- | --------------------------- |
| Hard gates | `.cursor/rules/design-dev-gates.mdc`, `.cursor/rules/sdd-design.mdc` | Token-first, motion/3D, component API, perf/a11y thresholds — external UI skills must be normalized here or they fail the gate. |
| Orchestration | `.cursor/rules/workspace-orchestration.mdc` | Pipeline order, memory layers, Recommendation footer — append subagent handoff protocol here (do not replace). |
| Commands | `.cursor/commands/create.md`, `.cursor/commands/plan.md`, `.cursor/commands/scan.md`, `.cursor/commands/develop.md` | Remote skill fetch (`skills.sh` / GitHub URL), `/SCAN` trust signals, `/CREATE skill` quality checklist. |
| Skills | `.cursor/skills/**/SKILL.md` | Deterministic procedures; `@skill` references in agents (`design-md`, `plan-full`, token/motion/component skills). |
| Agents | `.cursor/agents/*.md`, `.cursor/agents/README.md` | Personas with Activation Triggers + escalation; VoltAgent-style supervisor routing described as **charter**, not a second runtime. |
| Templates | `docs/templates/SKILL.template.md`, `docs/templates/DESIGN.template.md`, `docs/templates/AGENT.template.md`, Claude handoff templates under `docs/templates/` | Anthropic-style `SKILL.md` frontmatter; Stitch-parity `DESIGN.md`; handoff preconditions for Claude CLI/Code. |
| Specs & plan | `docs/specs/**`, `plan/**` | Phase gates (`plan/INDEX.md`), hardening budgets (`plan/04-harden/perf.md`), traceability for promoted external skills. |

**Legacy note:** `coia-orchestration.mdc` / `coia-sdd-design.mdc` are superseded in-repo by `workspace-orchestration.mdc` and `sdd-design.mdc` (see [WORKSPACE_INDEX.md](../../context/WORKSPACE_INDEX.md)).

---

## 2. External sources — adoption & maintenance signals

Snapshot source: GitHub REST `repos/{owner}/{repo}` (stars, forks, `pushed_at`). Skills leaderboard: [skills.sh](https://skills.sh/) (install telemetry; ranks vary over time).

| Source | Stars | Forks | Last push (UTC) | Notes |
| ------ | ----- | ----- | ---------------- | ----- |
| [anthropics/skills](https://github.com/anthropics/skills) | ~128.8k | ~15.2k | 2026-05-03 | Official Agent Skills examples + `template/`; Apache/reference mix; high determinism varies by skill. |
| [obra/superpowers](https://github.com/obra/superpowers) | ~179.9k | ~16.0k | 2026-05-06 | Verification loops, subagent-driven-development, TDD — strong fit for pre-`/DEVELOP` evidence. |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | ~71.8k | ~8.8k | 2026-05-02 | Stitch-format `DESIGN.md` + `preview.html` / `preview-dark.html` convention. |
| [nexu-io/open-design](https://github.com/nexu-io/open-design) | ~28.9k | ~3.2k | active | Local-first design loop; borrows awesome-design-md schema; heavy runtime — COIA uses **patterns only** (discovery form, critique). |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | ~20.4k | ~2.2k | active | Curated index + links to officialskills.sh; use as catalog, not blind copy. |
| [VoltAgent/voltagent](https://github.com/VoltAgent/voltagent) | ~8.6k | ~866 | 2026-04-28 | TS agent framework: supervisors, memory, RAG, guardrails, workflows — map to docs/agents, not embed runtime in COIA kit. |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | ~42.7k | ~3.6k | 2026-04-27 | Ecosystem index; reference-only for COIA. |
| [skills.sh](https://skills.sh/) | n/a | n/a | live | Leaderboard + `npx skills add` installs; pin URLs/commits when importing. |

**Quality policy (aligned with user criteria):** Flag skills/repos **&lt;1k stars** or **no commit in &gt;6 months** for manual review before promotion to `.cursor/skills/`. Prefer entries with CI, tests, or contribution guidelines when choosing between equivalents.

---

## 3. Priority integration matrix

Columns match the requested audit format.

| Priority | External Pattern | COIA Target Path | Integration Action | Rationale | Validation Step | Next Command |
| -------- | ---------------- | ---------------- | ------------------- | --------- | ---------------- | ------------ |
| P0 | `anthropics/skills` — `SKILL.md` (`name` + `description` + body) | [`docs/templates/SKILL.template.md`](../../templates/SKILL.template.md) | Extend template with optional `license`, `paths`, progressive-disclosure sections; align with Anthropic template-skill | Canonical Agent Skills shape; improves loader compatibility and clarity | Diff template against upstream `anthropics/skills/template/SKILL.md`; ensure existing skills still validate | `/CREATE skill <slug>` then spot-check one generated file |
| P0 | `anthropics/skills` — progressive disclosure / scripts pattern | `.cursor/skills/**/SKILL.md` (guideline) | Document convention: keep heavy detail in `references/` subfolders where used; avoid absolute paths in committed skills | Reduces context bloat; matches Anthropic multi-file skills | Grep new skills for `/Users/` or `C:\\` style paths | `/SCAN code` + manual grep |
| P0 | `obra/superpowers` — `verification-before-completion` | [`.cursor/rules/design-dev-gates.mdc`](../../../.cursor/rules/design-dev-gates.mdc) | Append bullet under Pre-Develop Checklist: “No completion claims for gate items without evidence (commands run, outputs cited)” | Closes gap between “claims pass” and proof before `/DEVELOP` | Pre-`/DEVELOP` dry-run: checklist + cited outputs | `/PLAN design` then `/SCAN a11y perf` |
| P0 | `obra/superpowers` — two-stage review (spec then quality) | [`.cursor/agents/README.md`](../../../.cursor/agents/README.md) + [`docs/templates/AGENT.template.md`](../../templates/AGENT.template.md) | Add “Handoff protocol” subsection: fresh context package, required artifacts (`DESIGN.md`, active SPEC), stop conditions (`BLOCKED`) | Matches subagent clarity criterion without importing Superpowers runtime | Peer review: agent file contains triggers + escalation target | `/CREATE agent <slug>` |
| P0 | `VoltAgent/awesome-design-md` — Stitch sections 1–9 + previews | [`docs/templates/DESIGN.template.md`](../../templates/DESIGN.template.md) | Add/adjust headings to match Stitch numbered sections (Visual Theme, Color Roles, Typography, Components, Layout, Depth, Do/Don’t, Responsive, Agent Prompt Guide); keep COIA tables for tokens/`clamp`/motion/3D/a11y | Parity with Stitch + existing COIA gates | `/SCAN a11y` + contrast spot-check vs tokens | `/CREATE design` |
| P0 | `VoltAgent/awesome-design-md` — `preview.html` / `preview-dark.html` | [`.cursor/skills/design-md/SKILL.md`](../../../.cursor/skills/design-md/SKILL.md) | Add optional output step: generate or sync preview artifacts beside `DESIGN.md` when prototyping | Faster visual verification; aligns with awesome-design-md repo layout | Open previews locally; confirm no hardcoded hex outside `DESIGN.md` exceptions | `/PLAN design` |
| P1 | `VoltAgent/voltagent` — supervisor + sub-agents | [`.cursor/agents/README.md`](../../../.cursor/agents/README.md) | Document mapping: “supervisor” = human + `/GUIDE`; specialized personas = `.cursor/agents/*.md`; no duplicate gate thresholds | Clarifies agent/subagent architecture without adding VoltAgent server | Trace a `/PLAN design` session to listed personas | `/GUIDE next` |
| P1 | `VoltAgent/voltagent` — memory / RAG / guardrails (conceptual) | `.cursor/agents/*.md` (e.g. [`design-systems-token-architect.md`](../../../.cursor/agents/design-systems-token-architect.md)) | Add `@skill` / spec pointers for “grounding sources” (`docs/specs/sdd`, `DESIGN.md`) in Expected Outputs | Keeps RAG metaphor as **repo docs**, not external vector DB | Confirm outputs cite spec paths | `/PLAN sdd` |
| P1 | `skills.sh` — install UX (`npx skills add` pattern) | [`.cursor/commands/create.md`](../../../.cursor/commands/create.md) | Document optional flow: user runs vendor CLI outside repo; curated skills copied into `.cursor/skills/<name>/` after review | Matches VoltAgent ecosystem install pattern safely | Manual: install count / pinned commit recorded in git message | `/CREATE skill` |
| P1 | `skills.sh` — top leaderboard entries (e.g. `frontend-design`, `web-design-guidelines`, `shadcn`, `find-skills`) | `docs/specs/sdd/CURATED_SKILLS_QUEUE.md` *(new companion list)* | Maintain allowlist: source URL, commit SHA, license, COIA gate notes; promote one skill at a time | Top installs ≠ automatic COIA safety; queue prevents sprawl | Each import: token lint + `/SCAN perf` where UI touched | `/CREATE skill` after queue approval |
| P1 | `VoltAgent/awesome-agent-skills` — catalog | [`docs/reference/external-kits/CATALOG.md`](../../reference/external-kits/CATALOG.md) | Add row linking awesome-agent-skills + officialskills.sh; “scout only until allowlisted” | High signal discovery; avoid unvetted bulk copy | N/A (reference) | Browse then file queue entry |
| P1 | `nexu-io/open-design` — turn-1 discovery / critique | [`.cursor/skills/design-md/SKILL.md`](../../../.cursor/skills/design-md/SKILL.md) + [`brand-visual-direction/SKILL.md`](../../../.cursor/skills/brand-visual-direction/SKILL.md) | Optional bullets: brief intake questions before pixels; 5-dim critique as **optional** review pass | Reduces design rework; stays markdown-native | User signs off on direction before `/DEVELOP` | `/PLAN design` |
| P2 | `hesreallyhim/awesome-claude-code` | [`docs/reference/external-kits/CATALOG.md`](../../reference/external-kits/CATALOG.md) | Link only; periodic review for hooks/commands overlap with COIA | Broad index; maintain separation from kit defaults | Spot-check duplicates vs `.cursor/commands` | `/GUIDE` |
| P2 | GitHub metadata (stars, forks, last commit, issue velocity) | [`.cursor/commands/scan.md`](../../../.cursor/commands/scan.md) | Add subcommand spec `deps-trust` or `external`: given URL(s), report GitHub stats + staleness warn | Operationalizes “professional quality signals” | Manual script or `gh api` until automated | `/SCAN deps` *(extend behavior when implemented)* |
| P2 | `anthropics/skills` multi-agent / plugin install docs | [`docs/templates/CLAUDE_CODE_HANDOFF.template.md`](../../templates/CLAUDE_CODE_HANDOFF.template.md) | Note optional `/plugin marketplace add anthropics/skills` for Claude Code users; COIA remains filesystem-first | Handoff parity for dual-harness users | Claude Code session loads marketplace skills | `/CREATE claude-code-handoff` |
| P2 | VoltAgent docs MCP (`@voltagent/mcp-docs-server`) | `docs/context/instructions.md` *(one-line pointer)* | Optional: “If using VoltAgent runtime, wire MCP per upstream docs” — **does not apply** to COIA-only workflows | Avoids implying COIA requires VoltAgent | N/A | Optional MCP setup |

---

## 4. Top skills.sh names (reference queue — verify before import)

Leaderboard entries shift; typical high-install families include **`frontend-design`**, **`web-design-guidelines`**, **`shadcn`**, **`find-skills`**, **`vercel-react-best-practices`**, **`next-best-practices`**, **`brainstorming`**, **`writing-plans`**, **`test-driven-development`**, **`systematic-debugging`**. Treat as **candidates** — each needs COIA normalization (tokens, gates, no absolute paths) before landing under `.cursor/skills/`.

---

## 5. Recommendation (single primary)

Run onboarding + SDD spine before importing external skills at scale: `/START all` → `/PLAN all` → extend [`DESIGN.template.md`](../../templates/DESIGN.template.md) and [`SKILL.template.md`](../../templates/SKILL.template.md) per matrix P0 rows, then `/SCAN a11y perf`.

```prompt
Implement P0 rows only from docs/specs/sdd/EXTERNAL_PATTERN_INTEGRATION_AUDIT.md: update DESIGN.template.md and SKILL.template.md, append verification + handoff bullets to design-dev-gates.mdc and AGENT.template.md, extend design-md SKILL with optional preview step. Do not bulk-copy vendor skills without CURATED_SKILLS_QUEUE approval.
```
