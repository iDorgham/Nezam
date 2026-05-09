# Workspace — complete index

Single reference for **what this repository is**, **how it is organized**, and **what has been wired up** (orchestration kit + integrations). For live execution state use `[workspace.md](workspace.md)` and `[project.md](project.md)`; for process contract use `[instructions.md](instructions.md)`. For layered memory theory see `[MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md)`.

---

## What this workspace is

This is a **Cursor workspace orchestration kit**: slash commands, skills, rules, and Markdown templates for **Specification-Driven Development (SDD)** with SEO-first IA/content, design-profile-first implementation via `.cursor/design/<brand>/design.md`, Git/release discipline, and handoffs to external assistants (browser AI and **Claude CLI / Claude Code**).

Root orientation: `[README.md](../../README.md)`.

---

## Required delivery pipeline

Canonical order (do not skip knowingly):

**Planning → SEO research → IA/menus → Content map → UI/design system (`.cursor/design/<brand>/design.md`) → Development → Product hardening/release.**

Spec spine: **roadmap → phases → specs → docs** under `docs/core/required/`.

---

## Slash commands (`.cursor/commands/`)


| Command                                         | Role                                                                                                                                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[/FOUNDER](../../.cursor/commands/founder.md)` | Non-developer onboarding entrypoint (`idea`, `status`, `help`) that converts plain-language product ideas into ready project artifacts. |
| `[/START](../../.cursor/commands/start.md)`     | Onboarding: repo, docs tree, PRD/prompt shortcuts, companion briefing, `**gates`**, optional `**all`**; after gates pass, directs users to Claude CLI/Code prompts then Cursor `**/PLAN**`. |
| `[/CREATE](../../.cursor/commands/create.md)`   | Instantiate templates: PRD, project prompt, DESIGN, SDD, specs, agents, skills, constitution, **Claude handoffs** (`claude-cli-prompt`, `claude-code-handoff`, `claude-md`).                |
| `[/PLAN](../../.cursor/commands/plan.md)`       | SDD + SEO → IA → content → design → versioning; `**all`** enforces dependency order; hard-blocked until onboarding files exist.                                                             |
| `[/DEVELOP](../../.cursor/commands/develop.md)` | Implement against approved specs and the selected design profile; slices, features, tests.                                                                                                                           |
| `[/SCAN](../../.cursor/commands/scan.md)`       | Audits (security, perf, a11y, content, SEO/AEO/GEO, etc.).                                                                                                                                  |
| `[/FIX](../../.cursor/commands/fix.md)`         | Triage scan findings → patches → verify.                                                                                                                                                    |
| `[/SAVE](../../.cursor/commands/save.md)`       | Git hygiene, commits, reports, versioning alignment.                                                                                                                                        |
| `[/DEPLOY](../../.cursor/commands/deploy.md)`   | Release mechanics, tags, deployment checklist.                                                                                                                                              |
| `[/GUIDE](../../.cursor/commands/guide.md)`     | Navigator: where we are, next command; includes **Claude handoff** when gates pass but SDD is thin.                                                                                         |


Aliases listed in `[README.md](../../README.md)` (`/st`, `/pl`, …).

---

## Cursor skills (`.cursor/skills/`)

Long procedures invoked by commands or `@` references:


| Skill                                                                            | Purpose                                                                          |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `[plan-full](../../.cursor/skills/plan-full/SKILL.md)`                   | Full SDD spine: roadmap, phases, architecture, data model, feature spec folders. |
| `[design-md](../../.cursor/skills/design-md/SKILL.md)`                   | Design-profile prototyping discipline and handoff contracts.                                              |
| `[seo-ia-content](../../.cursor/skills/seo-ia-content/SKILL.md)`         | SEO → IA → content sequencing.                                                   |
| `[git-workflow](../../.cursor/skills/git-workflow/SKILL.md)`             | Branching, conventional commits, tags/releases.                                  |
| `[external-ai-report](../../.cursor/skills/external-ai-report/SKILL.md)` | Progress reports for browser companions.                                         |
| `[nezam-testing-automation](../../.cursor/skills/nezam-testing-automation/SKILL.md)` | Deterministic unit/E2E/visual test setup and `/SCAN tests` integration.          |
| `[nezam-scan-fix-loop](../../.cursor/skills/nezam-scan-fix-loop/SKILL.md)` | Structured `/SCAN` → `/FIX` remediation loop with `docs/workspace/plans/INDEX.md` tracking.      |
| `[nezam-github-actions-ci](../../.cursor/skills/nezam-github-actions-ci/SKILL.md)` | GitHub Actions CI/CD hardening, checks, artifacts, release gates.                |
| `[nezam-gh-security-compliance](../../.cursor/skills/nezam-gh-security-compliance/SKILL.md)` | Security compliance workflow for Dependabot, CodeQL, and secret scanning.         |
| `[nezam-repo-file-org](../../.cursor/skills/nezam-repo-file-org/SKILL.md)` | Repository organization workflow with safe file moves and import updates.         |
| `[nezam-docs-context-sync](../../.cursor/skills/nezam-docs-context-sync/SKILL.md)` | Context/index/plan synchronization workflow for doc lifecycle integrity.          |
| `[nezam-founder-onboarding](../../.cursor/skills/nezam-founder-onboarding/SKILL.md)` | Founder interview to artifact generation and plain-language setup guidance. |
| `[nezam-health-score](../../.cursor/skills/nezam-health-score/SKILL.md)` | Generates root `HEALTH.md` 0–100 score across specs, design, security, perf, tests, and content. |
| `[nezam-skill-composer](../../.cursor/skills/nezam-skill-composer/SKILL.md)` | Auto-resolves natural-language tasks to an ordered skill stack with MENA-aware routing. |
| `[nezam-decision-journal](../../.cursor/skills/nezam-decision-journal/SKILL.md)` | Writes founder-readable decisions to `DECISIONS_PLAIN.md`. |


Referenced heavily by `**/PLAN sdd`** / `**/PLAN all`**: `**plan-full**`. Add more skills under `.cursor/skills/**/SKILL.md` over time; this table lists the kit defaults.

### Expanded skill suite

Comprehensive `coi-*` suite covering planning, SEO/AEO/GEO, content, frontend, backend, cloud, security, and testing/observability. Every skill follows the mandatory 8-section format (`Purpose`, `Inputs`, `Step-by-Step Workflow`, `Validation & Metrics`, `Output Format`, `Integration Hooks`, `Anti-Patterns`, `External Reference`).

#### Planning & project execution

| Skill | Purpose |
| --- | --- |
| `[nezam-strategic-planning](../../.cursor/skills/nezam-strategic-planning/SKILL.md)` | Roadmap alignment, milestone gating, scope control, resource mapping. |
| `[nezam-phase-gating-roadmap](../../.cursor/skills/nezam-phase-gating-roadmap/SKILL.md)` | SDD phase transitions, hard-block criteria, versioning triggers. |
| `[nezam-task-decomposition](../../.cursor/skills/nezam-task-decomposition/SKILL.md)` | Epic → feature → task breakdown, dependency mapping, slice sizing. |
| `[nezam-risk-mitigation](../../.cursor/skills/nezam-risk-mitigation/SKILL.md)` | Tech-debt tracking, FMEA, fallback planning, observability hooks. |

#### SEO, GEO & AEO

| Skill | Purpose |
| --- | --- |
| `[seo-ia-content](../../.cursor/skills/seo-ia-content/SKILL.md)` | SEO fundamentals + IA + content sequencing (canonical, sitemap, robots, titles/metas). |
| `[nezam-geo-optimization](../../.cursor/skills/nezam-geo-optimization/SKILL.md)` | Generative Engine Optimization — entity mapping, AI-citation readiness. |
| `[nezam-aeo-answer-engines](../../.cursor/skills/nezam-aeo-answer-engines/SKILL.md)` | Answer Engine Optimization — concise Q&A, voice/assistant formatting. |
| `[nezam-structured-data-schema](../../.cursor/skills/nezam-structured-data-schema/SKILL.md)` | JSON-LD, schema.org validation, rich-snippet targeting. |
| `[nezam-topical-authority](../../.cursor/skills/nezam-topical-authority/SKILL.md)` | Hub-and-spoke clusters, semantic linking, click depth. |
| `[nezam-serp-feature-targeting](../../.cursor/skills/nezam-serp-feature-targeting/SKILL.md)` | Featured snippets, PAA, local pack, image/video carousels. |

#### Content & information architecture

| Skill | Purpose |
| --- | --- |
| `[nezam-ia-taxonomy](../../.cursor/skills/nezam-ia-taxonomy/SKILL.md)` | Navigation, URL hierarchy, breadcrumbs, taxonomy. |
| `[nezam-content-modeling](../../.cursor/skills/nezam-content-modeling/SKILL.md)` | Content types, fields, blocks, preview/revision. |
| `[nezam-editorial-workflows](../../.cursor/skills/nezam-editorial-workflows/SKILL.md)` | Draft → review → publish, role permissions, audit trail. |
| `[nezam-cms-integration](../../.cursor/skills/nezam-cms-integration/SKILL.md)` | Headless CMS APIs, webhooks, ISR/preview, fallback rendering. |

#### Frontend, UI/UX & design systems

| Skill | Purpose |
| --- | --- |
| `[nezam-react-architecture](../../.cursor/skills/nezam-react-architecture/SKILL.md)` | React 19 / Next.js 15 — RSC split, Server Actions, state strategy. |
| `[nezam-component-library-api](../../.cursor/skills/nezam-component-library-api/SKILL.md)` | Typed, variant-driven React components with Storybook + a11y. |
| `[nezam-ui-ux-design](../../.cursor/skills/nezam-ui-ux-design/SKILL.md)` | User flows, interaction states, microcopy, WCAG 2.2 AA mapping. |
| `[nezam-dashboard-patterns](../../.cursor/skills/nezam-dashboard-patterns/SKILL.md)` | Dense data layouts, filtering/sorting UX, KPI cards, responsive tables. |
| `[nezam-pro-design-tokens](../../.cursor/skills/nezam-pro-design-tokens/SKILL.md)` | W3C tokens, theme switching, fluid typography (design-system core). |
| `[token-grid-typography](../../.cursor/skills/token-grid-typography/SKILL.md)` | CSS Grid/Flex, container queries, `clamp()`, breakpoint matrix. |
| `[nezam-motion-3d-progressive](../../.cursor/skills/nezam-motion-3d-progressive/SKILL.md)` | Framer Motion / GSAP, GPU compositing, `prefers-reduced-motion`, R3F fallbacks. |
| `[nezam-a11y-automation](../../.cursor/skills/nezam-a11y-automation/SKILL.md)` | axe-core, keyboard-nav, screen-reader audits, contrast checks. |

#### Backend, data & APIs

| Skill | Purpose |
| --- | --- |
| `[nezam-api-design](../../.cursor/skills/nezam-api-design/SKILL.md)` | OpenAPI 3.1, REST/GraphQL, versioning, idempotency, RFC 9457. |
| `[nezam-api-gateway](../../.cursor/skills/nezam-api-gateway/SKILL.md)` | Rate limits, auth middleware, transformation, resilience controls. |
| `[nezam-supabase-architect](../../.cursor/skills/nezam-supabase-architect/SKILL.md)` | Postgres RLS, Auth, Realtime, Edge Functions, schema management. |
| `[nezam-prisma-orm](../../.cursor/skills/nezam-prisma-orm/SKILL.md)` | Prisma 6 schema, migrations, type-safe client, seeding. |
| `[nezam-database-optimization](../../.cursor/skills/nezam-database-optimization/SKILL.md)` | Indexes, query planning, connection pooling, replicas. |
| `[nezam-cache-strategies](../../.cursor/skills/nezam-cache-strategies/SKILL.md)` | HTTP, Redis, edge cache, tag-based invalidation. |

#### Cloud, DevOps & infrastructure

| Skill | Purpose |
| --- | --- |
| `[nezam-vercel-deploy](../../.cursor/skills/nezam-vercel-deploy/SKILL.md)` | Vercel CLI, vercel.json, Edge Config, ISR/SSR, deployment hooks. |
| `[nezam-aws-infra](../../.cursor/skills/nezam-aws-infra/SKILL.md)` | AWS CDK v2, IAM least-privilege, S3/CloudFront, Secrets Manager. |
| `[nezam-cloudflare-edge](../../.cursor/skills/nezam-cloudflare-edge/SKILL.md)` | Workers, KV/D1/R2, Pages, cache rules, geographic routing. |
| `[nezam-devops-pipeline](../../.cursor/skills/nezam-devops-pipeline/SKILL.md)` | CI/CD pipelines, env promotion, artifact versioning, rollback. |
| `[git-workflow](../../.cursor/skills/git-workflow/SKILL.md)` | Branching, conventional commits, PR checks, branch protection, Dependabot. |
| `[nezam-cdn-optimization](../../.cursor/skills/nezam-cdn-optimization/SKILL.md)` | Image optimization, prefetch/preload, cache tags, edge routing. |

#### Security, auth & compliance

| Skill | Purpose |
| --- | --- |
| `[nezam-auth-workflows](../../.cursor/skills/nezam-auth-workflows/SKILL.md)` | OAuth 2.1 / OIDC, JWT vs session, MFA, RBAC, token rotation. |
| `[nezam-security-hardening](../../.cursor/skills/nezam-security-hardening/SKILL.md)` | OWASP Top 10, CSP, dependency scanning, SAST/DAST. |
| `[nezam-secret-management](../../.cursor/skills/nezam-secret-management/SKILL.md)` | Vault / AWS SM / Vercel / Doppler, OIDC federation, rotation. |
| `[nezam-privacy-compliance](../../.cursor/skills/nezam-privacy-compliance/SKILL.md)` | GDPR / CCPA, consent gating, audit logging, right-to-delete. |

#### Testing, quality & observability

| Skill | Purpose |
| --- | --- |
| `[nezam-testing-strategy](../../.cursor/skills/nezam-testing-strategy/SKILL.md)` | Unit / integration / E2E / visual regression with Playwright + Vitest. |
| `[nezam-performance-optimization](../../.cursor/skills/nezam-performance-optimization/SKILL.md)` | Core Web Vitals budgets, code splitting, bundle analysis, lazy loading. |
| `[nezam-monitoring-observability](../../.cursor/skills/nezam-monitoring-observability/SKILL.md)` | OpenTelemetry, structured logging, distributed tracing, alerting. |
| `[nezam-error-tracking](../../.cursor/skills/nezam-error-tracking/SKILL.md)` | Sentry / Logtail, source maps, release correlation, alert routing. |

---

## Cursor rules (`.cursor/rules/`)


| Rule                                                                   | Purpose                                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `[workspace-orchestration.mdc](../../.cursor/rules/workspace-orchestration.mdc) ` | Pipeline order, memory layers, Recommendation footer, companion briefing pointers. |
| `[design-dev-gates.mdc](../../.cursor/rules/design-dev-gates.mdc)`       | Hard pre-`/DEVELOP` design gates: tokens, fluid type, motion/3D, component API, perf+a11y budgets. |
| `[sdd-design.mdc](../../.cursor/rules/sdd-design.mdc)`       | Supplemental docs/design sequencing gate for SEO/IA/design artifacts.                            |


---

## Agents (`.cursor/agents/`)

Named persona lenses (`*.md`) plus `[README.md](../../.cursor/agents/README.md)` index — use as reasoning charters, not mandatory every turn.

| Agent | Focus |
| ----- | ----- |
| `[agent-qa-test-lead](../../.cursor/agents/agent-qa-test-lead.md)` | Testing strategy, coverage thresholds, `/SCAN tests` and `/FIX tests` routing. |
| `[agent-security-auditor](../../.cursor/agents/agent-security-auditor.md)` | Security/compliance gates, secret scanning, dependency/code scanning governance. |
| `[agent-ci-automation](../../.cursor/agents/agent-ci-automation.md)` | CI/CD workflow resilience, artifact lifecycle, release gating and check enforcement. |
| `[agent-docs-hygiene](../../.cursor/agents/agent-docs-hygiene.md)` | File organization, context synchronization, index/spec freshness and doc governance. |

---

## Templates (`docs/workspace/templates/`)

Index and categories: `[README.md](../templates/README.md)`. Source files for `**/CREATE**` (typically `*.template.md`):


| Template | Typical destination |
| -------- | ------------------- |
| `specs/PRD.template.md` | `docs/core/required/prd/PRD.md` |
| `specs/PROMPT_DOCUMENT.template.md` | `docs/core/required/PROJECT_PROMPT.md` |
| `research-design/DESIGN.template.md` | `.cursor/design/<brand>/design.md` |
| `research-design/SEO_RESEARCH.template.md` | `docs/core/required/sdd/SEO_RESEARCH.md` |
| `specs/FEATURE_SPEC.template.md` | `docs/core/required/features/...` |
| `sdd/SDD_VERSIONING.template.md` | `docs/core/required/sdd/VERSIONING.md` (+ SDD README scaffolding via `/CREATE sdd`) |
| `specs/PROGRESS_REPORT.template.md` | `docs/reports/progress/PROGRESS_REPORT.latest.md` |
| `specs/CONSTITUTION.template.md` | `docs/CONSTITUTION.md` |
| `ai-client/AGENT.template.md` | `.cursor/agents/<slug>.md` |
| `ai-client/SKILL.template.md` | `.cursor/skills/<name>/SKILL.md` |
| `ai-client/SKILL_VERSION_HEADER.template.md` | Version/frontmatter scaffold for skill metadata and changelog tracking. |
| `ai-client/CLAUDE_CLI_PLAN_PROMPT.template.md` | `docs/core/required/CLAUDE_CLI_PLAN.md` via `/CREATE claude-cli-prompt` |
| `ai-client/CLAUDE_CODE_HANDOFF.template.md` | `docs/core/required/CLAUDE_CODE_HANDOFF.md` via `/CREATE claude-code-handoff` |
| `ai-client/CLAUDE_MD_AGENT.template.md` | Root `CLAUDE.md` via `/CREATE claude-md` |
| `ai-client/AGENTS.md.template.md` | Root `AGENTS.md` via `/CREATE agents-md` |
| `ai-client/GEMINI.md.template.md` | Root `GEMINI.md` via `/CREATE gemini-md` |
| `ai-client/QWEN.md.template.md` | Root `QWEN.md` via `/CREATE qwen-md` |
| `plan/**` | Gate schemas, automation checklists, prompt scaffolds (`docs/workspace/templates/plan/`) |


Exact mappings and `**force**` behavior: `[.cursor/commands/create.md](../../.cursor/commands/create.md)`.

---

## Prompts (`docs/core/required/`)


| File                      | Role                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `PROJECT_PROMPT.md`       | North-star + guardrails for Cursor / generic agents (`/CREATE prompt`).                     |
| `CLAUDE_CLI_PLAN.md` | Paste into **Claude CLI** (`claude` at repo root) for SDD planning parity with `/PLAN all`. |
| `CLAUDE_CODE_HANDOFF.md`     | Handoff for **Claude Code** (IDE extension); same mission as CLI plan file.                 |


See `[README.md](../prompts/README.md)` and `[docs/workspace/context/CONTEXT.md](../external-ai/CLAUDE_CLI_AND_CODE.md)`.

---

## Docs layout (`docs/`)


| Area                                                            | Role                                                                                                                                                                                                      |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[specs/prd/](../required/prd/)`                                   | Product requirements (`PRD.md`).                                                                                                                                                                          |
| `[specs/sdd/](../required/sdd/)`                                   | SDD spine: roadmap, phases, SEO, versioning, architecture, data model.                                                                                                                                    |
| `[specs/features/](../required/features/)`                         | Feature specs (`SPEC.md`, tests, APIs).                                                                                                                                                                   |
| `**context/`**                                                  | **This folder** — canonical assistant context (`instructions`, `workspace`, `project`, `MEMORY`, architecture, **this index**).                                                                           |
| `[external-ai/](../external-ai/)`                               | Browser `[GROK_INSTRUCTIONS.md](../external-ai/GROK_INSTRUCTIONS.md)` + [brief ~1k](../external-ai/GROK_INSTRUCTIONS_BRIEF.md); Claude `[CLAUDE_CLI_AND_CODE.md](../external-ai/CLAUDE_CLI_AND_CODE.md)`. |
| `[REFERENCES_EXTERNAL_KITS.md](../reference/external-kits/CATALOG.md)` | Curated external references.                                                                                                                                                                              |


Optional: `[CONSTITUTION.md](../CONSTITUTION.md)` (`/CREATE constitution`).

---

## Root planning scaffold (`docs/workspace/plans/`)

Structured execution board for phased delivery with explicit task IDs and gate controls:

- `docs/workspace/plans/MASTER_TASKS.md`: Master outcomes, metrics, and risk summary.
- `docs/workspace/plans/INDEX.md`: MT/PT traceability matrix and phase gate map.
- `docs/workspace/plans/commit-conventions.md`: Commit prefixes aligned to phase ownership.
- `docs/workspace/plans/tag-version-plan.md`: SemVer policy and release tag trigger points.
- `docs/workspace/plans/01-content/` through `docs/workspace/plans/05-ship/`: phase task boards and placeholder spec notes.

Use `docs/workspace/plans/*/TASKS.md` as the operational tracker when running phased work.

---

## Scripts (`scripts/`)


| Script                                                                         | Role                                                                                                  |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `[check-onboarding-readiness.sh](../../scripts/checks/check-onboarding-readiness.sh)` | CI-oriented check: `docs/core/required/prd/PRD.md` + `docs/core/required/PROJECT_PROMPT.md` (see script for exact list). |
| `[workspace-tui.sh](../../scripts/ui/workspace-tui.sh)`                                     | TUI formatting helpers (badges, banners) aligned with command output conventions.                     |
| `[install-context-hooks.sh](../../scripts/context/install-context-hooks.sh)`           | Hooks to refresh context docs.                                                                        |
| `[auto-memory-hooks.sh](../../scripts/context/auto-memory-hooks.sh)`           | Post-commit memory/health updates and companion bundle generation.                                                                        |
| `[check-design-tokens.sh](../../scripts/checks/check-design-tokens.sh)`           | Token-first CSS gate check for local and CI use (`pnpm run check:tokens`).                                                                        |
| `[check-skill-frontmatter.js](../../scripts/check-skill-frontmatter.js)`           | Warning-only check for skill version metadata completeness.                                                                        |
| `[update-context-docs.py](../../scripts/context/update-context-docs.py)`               | Updates auto-managed sections in context files.                                                       |
| `[version-plan.sh](../../scripts/release/version-plan.sh)`                       | SemVer planning helper.                                                                               |
| `[test-tui.sh](../../scripts/testing/test-tui.sh)`                                     | Optional TUI smoke test.                                                                              |


---

## GitHub automation (`.github/workflows/`)

CI includes branch naming (PRs), conventional commits, onboarding readiness, and design gate readiness — see `[ci.yml](../../.github/workflows/ci.yml)`. Dedicated design CI enforcement lives in `[design-gates.yml](../../.github/workflows/design-gates.yml)` (token-first CSS, Lighthouse budgets, DESIGN.md non-template checks). Additional workflows: release, git-automation dispatcher, optional semantic-release (`[README.md](../../README.md)` automation section).

---

## Onboarding → Claude → Cursor planning (integrated flow)

What the kit encodes end-to-end:

1. **Repo + docs** — `/START repo`, `/START docs`.
2. **PRD + project prompt** — `/CREATE prd`, `/CREATE prompt`.
3. **Gates** — `/START gates` (remote, PRD, PROJECT_PROMPT, archetype, context files).
4. **Claude handoff** — `/CREATE claude-cli-prompt`, `/CREATE claude-code-handoff`, optional `/CREATE claude-md`; user runs planning in **Claude CLI** or **Claude Code** using `docs/core/required/CLAUDE_*.md`.
5. **Cursor planning** — `/PLAN ...` to refine or align SDD artifacts with the pipeline.
6. **Build** — `/DEVELOP` after selected design profile and spec readiness.

Commands `[start.md](../../.cursor/commands/start.md)`, `[create.md](../../.cursor/commands/create.md)`, `[guide.md](../../.cursor/commands/guide.md)`, and `[README.md](../../README.md)` reflect this sequence.

---

## External assistants

- **Browser** (Grok, Qwen, Gemini, Claude web): `[GROK_INSTRUCTIONS.md](../external-ai/GROK_INSTRUCTIONS.md)`; compact paste `[GROK_INSTRUCTIONS_BRIEF.md](../external-ai/GROK_INSTRUCTIONS_BRIEF.md)`.
- **Claude CLI / Claude Code**: `[CLAUDE_CLI_AND_CODE.md](../external-ai/CLAUDE_CLI_AND_CODE.md)` — install pointers, prompt paths, `CLAUDE.md` merge guidance.

---

## What to read next

- Day-to-day state: `[workspace.md](workspace.md)`, `[project.md](project.md)`.
- Process rules: `[instructions.md](instructions.md)`.
- Theory: `[MEMORY_ARCHITECTURE.md](MEMORY_ARCHITECTURE.md)`.
- Human durable bullets: `[MEMORY.md](MEMORY.md)` (when maintained).

---

*This index describes the kit as committed in-repo; update it when you add commands, skills, or major workflow changes.*