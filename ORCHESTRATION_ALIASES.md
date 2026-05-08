# Orchestration aliases (prompt ↔ repo)

Maps informal command-matrix names to **actual** skill folders and agent files. Use real paths in automation and docs. Treat `.cursor/**` as canonical and regenerate mirrored surfaces via `pnpm ai:sync`.

Workflow contract: the canonical 6-phase swarm lifecycle (intake, planning/design, sprint development, integration/testing, deploy/launch, maintenance) is defined in [`SWARM_WORKFLOW.md`](SWARM_WORKFLOW.md). All routing decisions below honor that workflow.

## Commands → skills

| Prompt / matrix slug | Repo folder | SKILL.md |
| -------------------- | ----------- | -------- |
| `coi-git-workflow` | [`git-workflow`](../../../.cursor/skills/git-workflow/SKILL.md) | `.cursor/skills/git-workflow/SKILL.md` |
| `coi-plan-full` | [`plan-full`](../../../.cursor/skills/plan-full/SKILL.md) | `.cursor/skills/plan-full/SKILL.md` |
| `coi-design-md` | [`design-md`](../../../.cursor/skills/design-md/SKILL.md) | `.cursor/skills/design-md/SKILL.md` |
| `coi-seo-ia-content` | [`seo-ia-content`](../../../.cursor/skills/seo-ia-content/SKILL.md) | `.cursor/skills/seo-ia-content/SKILL.md` |
| `coi-external-ai-report` | [`external-ai-report`](../../../.cursor/skills/external-ai-report/SKILL.md) | `.cursor/skills/external-ai-report/SKILL.md` |
| `coi-guide-instructor-domains` | [`guide-instructor-domains`](../../../.cursor/skills/guide-instructor-domains/SKILL.md) | `.cursor/skills/guide-instructor-domains/SKILL.md` |
| `arabic_content_master` | [`arabic_content_master`](../../../.cursor/skills/arabic_content_master/skill.md) | `.cursor/skills/arabic_content_master/skill.md` |
| `egyptian_arabic_content_master` | [`egyptian_arabic_content_master`](../../../.cursor/skills/egyptian_arabic_content_master/skill.md) | `.cursor/skills/egyptian_arabic_content_master/skill.md` |

**Upstream library (not coi-prefixed):** `docs/skills/` — especially `nexu_open_design/**`; promote selectively per `docs/INGEST_QUEUE.md`.

## Prompt personas → `.cursor/agents`

| Matrix / informal name | Use agent file | Notes |
| ------------------------ | -------------- | ----- |
| `release-engineer` | [`gitops.md`](../../../.cursor/agents/gitops.md) | Tags, CI, ship cadence |
| `seo-strategist` | [`seo.md`](../../../.cursor/agents/seo.md) | Keywords, SERP, IA hooks |
| `content-architect` | [`content.md`](../../../.cursor/agents/content.md) | Voice, page inventories |
| `a11y-auditor` | [`lead-uiux-designer.md`](../../../.cursor/agents/lead-uiux-designer.md) + [`lead-qa-architect.md`](../../../.cursor/agents/lead-qa-architect.md) | IA/a11y vs test exit criteria |
| `perf-engineer` | [`lead-qa-architect.md`](../../../.cursor/agents/lead-qa-architect.md) + [`lead-solution-architect.md`](../../../.cursor/agents/lead-solution-architect.md) | Budgets, profiling |
| `security-reviewer` | [`lead-security-officer.md`](../../../.cursor/agents/lead-security-officer.md) | Threat model, OWASP-style review |
| `arabic-content` / `mena-arabic-lead` | [`arabic-content-master.md`](../../../.cursor/agents/arabic-content-master.md) | MENA dialect routing; Masri depth via [`masri-content-specialist.md`](../../../.cursor/agents/masri-content-specialist.md) |
| `arabic-seo` / `arabic-aeo` | [`arabic-seo-aeo-specialist.md`](../../../.cursor/agents/arabic-seo-aeo-specialist.md) | Arabic SERP, voice intents, hreflang, structured data |
| `khaleeji-copy` | [`khaleeji-specialist.md`](../../../.cursor/agents/khaleeji-specialist.md) | GCC dialect stub — escalate to vendor |
| `levantine-copy` | [`levantine-specialist.md`](../../../.cursor/agents/levantine-specialist.md) | Levant dialect stub — escalate to vendor |
| `maghrebi-copy` | [`maghrebi-specialist.md`](../../../.cursor/agents/maghrebi-specialist.md) | Maghreb dialect stub — escalate to vendor |
| `msa-formal-copy` | [`msa-formal-specialist.md`](../../../.cursor/agents/msa-formal-specialist.md) | MSA formal routing stub — not counsel |

Canonical index: [`.cursor/agents/README.md`](../../../.cursor/agents/README.md).

## Legacy code-name aliases

Existing prompts and historical references continue to resolve via this alias table. Prefer the new code-name in all new authoring; the legacy column is for backward compatibility only.

| Legacy code-name | New code-name (canonical) | New file path |
| ---------------- | ------------------------- | ------------- |
| `manager` | `cpo` | [`.cursor/agents/cpo.md`](../../../.cursor/agents/cpo.md) |
| `tech-lead` | `lead-solution-architect` | [`.cursor/agents/lead-solution-architect.md`](../../../.cursor/agents/lead-solution-architect.md) |
| `designer` | `lead-uiux-designer` | [`.cursor/agents/lead-uiux-designer.md`](../../../.cursor/agents/lead-uiux-designer.md) |
| `fe-dev` | `lead-frontend-architect` | [`.cursor/agents/lead-frontend-architect.md`](../../../.cursor/agents/lead-frontend-architect.md) |
| `be-dev` | `lead-backend-architect` | [`.cursor/agents/lead-backend-architect.md`](../../../.cursor/agents/lead-backend-architect.md) |
| `dba` | `lead-database-architect` | [`.cursor/agents/lead-database-architect.md`](../../../.cursor/agents/lead-database-architect.md) |
| `mobile-lead` | `lead-mobile-architect` | [`.cursor/agents/lead-mobile-architect.md`](../../../.cursor/agents/lead-mobile-architect.md) |
| `data-lead` | `lead-analytics-architect` | [`.cursor/agents/lead-analytics-architect.md`](../../../.cursor/agents/lead-analytics-architect.md) |
| `security` | `lead-security-officer` | [`.cursor/agents/lead-security-officer.md`](../../../.cursor/agents/lead-security-officer.md) |
| `devops` | `lead-devops-performance` | [`.cursor/agents/lead-devops-performance.md`](../../../.cursor/agents/lead-devops-performance.md) |
| `qa` | `lead-qa-architect` | [`.cursor/agents/lead-qa-architect.md`](../../../.cursor/agents/lead-qa-architect.md) |

## Swarm routing tiers (13-swarm runtime)

Use this matrix for coordinator decisions when work spans one or more swarms. Each row maps a work type to its primary swarm path through the 4 tiers.

| Swarm | Swarm Manager | Team Manager(s) | Specialist Lenses | Required completion checks |
| ----- | ------------- | --------------- | ----------------- | -------------------------- |
| 1. Architecture & Planning | `lead-solution-architect` | `requirements-analysis-manager`, `solution-design-manager`, `integration-architecture-manager` | `business-analyst`, `scalability-resilience-architect`, `technical-feasibility-analyst`, `integration-specialist`, `cost-optimization-analyst`, `risk-assessment-specialist`, `technology-evaluator`, `pm` | ADR + architecture diagram + backlog approved |
| 2. UI/UX Design | `lead-uiux-designer` | `ux-research-strategy-manager`, `visual-design-manager`, `prototyping-design-system-manager` | `art-director-brand`, `design-systems-token-architect`, `motion-3d-choreographer`, `a11y-performance-auditor` | `docs/DESIGN.md` updated + a11y posture + token deltas documented |
| 3. Frontend | `lead-frontend-architect` | `frontend-framework-manager`, `ui-component-manager`, `frontend-performance-manager` | `react-component-lead` | CWV thresholds met + Storybook coverage for new primitives |
| 4. Backend | `lead-backend-architect` | `api-logic-manager`, `services-microservices-manager`, `auth-security-manager` | `payments-lead`, `payments-integration`, `payments-mena-routing`, `billing-platform`, `integration-specialist` | OpenAPI spec + validation + observability map |
| 5. Data & Database | `lead-database-architect` | `database-design-manager`, `data-pipeline-manager`, `search-cache-manager` | `sql-expert`, `nosql-expert`, `time-series-specialist`, `vector-store-specialist`, `data-engineer`, `analytics-engineer` | DDL + rollback + index plan + verification queries |
| 6. Mobile | `lead-mobile-architect` | `ios-manager`, `android-manager`, `cross-platform-manager` | `mobile-ios`, `mobile-android`, `mobile-cross-platform`, `flutter-specialist`, `mobile-offline-sync-specialist`, `mobile-push-notifications-specialist` | Parity matrix + store readiness + crash-free target |
| 7. CMS & SaaS | `lead-cms-saas-architect` | `cms-manager`, `saas-platform-manager`, `content-workflow-manager` | `headless-cms-specialist`, `multi-tenancy-architect`, `feature-flags-specialist`, `white-label-theming-specialist`, `content`, `localization-lead`, `masri-content-specialist` | Content model + tenancy isolation + entitlement matrix |
| 8. Analytics & Dashboard | `lead-analytics-architect` | `dashboard-manager`, `kpi-reporting-manager`, `data-visualization-manager` | `data-visualization-specialist`, `real-time-streaming-specialist`, `experimentation-lead` | Event taxonomy + KPI catalog + access map |
| 9. Security | `lead-security-officer` | `app-security-manager`, `infra-security-manager`, `compliance-manager` | `encryption-privacy-specialist`, `threat-modeling-specialist`, `agent-security-auditor` | `/SCAN security` clean or accepted-risk register signed |
| 10. Performance & DevOps | `lead-devops-performance` | `performance-manager`, `infrastructure-manager`, `devops-manager` | `docker-k8s-specialist`, `observability-specialist`, `sre-incident-specialist`, `gitops`, `agent-ci-automation` | Pipeline + capacity plan + rollback lever |
| 11. Quality Assurance | `lead-qa-architect` | `testing-manager`, `automation-manager`, `performance-load-manager` | `agent-qa-test-lead`, `a11y-performance-auditor` | Test matrix + coverage / flake / pass-rate trend |
| 12. Maintenance & Support | `lead-maintenance-agent` | `bug-triage-manager`, `tech-debt-manager`, `knowledge-update-manager` | `code-review-specialist`, `refactoring-specialist`, `dependency-update-specialist`, `agent-docs-hygiene` | Triage digest + debt register + KB delta |
| 13. AI Ethics & Responsible Development | `lead-ai-ethics-officer` | _specialist pod_ | `bias-fairness-specialist`, `privacy-data-ethics-specialist`, `transparency-explainability-specialist`, `ai-safety-misuse-specialist`, `ip-copyright-ethics-specialist`, `ai-sustainability-specialist` | Ethics review completed + high-risk AI/data scope sign-off (veto path to `cpo`) |

Cross-swarm coordination is owned by `deputy-orchestrator` with help from `daily-sync-agent`, `knowledge-sharing-agent`, `code-generation-supervisor`, and `conflict-resolution-agent`. Final go/no-go is `cpo`.

### Routing guardrails

- Prefer a single specialist when scope is narrow and self-contained.
- Use parallel specialists only for independent domains with isolated write scope.
- When quality/speed/cost conflict: quality first, speed second, cost third.
- Every routed task must include a handoff packet from `coi-multi-agent-handoff`.
- Every routed task must name `Swarm Manager`, `Team Manager`, and `specialists` before execution begins.
- Honor phase gates from [`SWARM_WORKFLOW.md`](SWARM_WORKFLOW.md); do not bypass.

## Legacy matrix (deprecated)

The 18-row "fixed functional team" matrix used before the 12-swarm taxonomy is retained for archaeology only. Equivalent paths now resolve via the swarm matrix above. Examples:

| Legacy work type | Legacy manager / leader / specialists | New swarm path |
| ---------------- | ------------------------------------- | -------------- |
| SDD planning | `manager` / `pm` / `seo`, `content`, `tech-lead` | `cpo` -> Swarm 1 (`lead-solution-architect` -> `requirements-analysis-manager`) |
| Architecture design | `manager` / `tech-lead` / `designer`, `fe-dev`, `be-dev` | `cpo` -> Swarm 1 (`lead-solution-architect` -> `solution-design-manager`) |
| UI/UX design | `manager` / `designer` / `fe-dev`, `qa` | `cpo` -> Swarm 2 (`lead-uiux-designer` -> `prototyping-design-system-manager`) |
| Database design | `manager` / `dba` / `be-dev`, `qa` | `cpo` -> Swarm 5 (`lead-database-architect` -> `database-design-manager`) |
| DevOps | `manager` / `devops` / `gitops`, `security`, `qa` | `cpo` -> Swarm 10 (`lead-devops-performance` -> `devops-manager`) |
| Security | `manager` / `security` / `devops`, `be-dev`, `qa` | `cpo` -> Swarm 9 (`lead-security-officer` -> `app-security-manager`) |
| Performance | `manager` / `tech-lead` / `qa`, `fe-dev`, `be-dev` | `cpo` -> Swarm 10 (`lead-devops-performance` -> `performance-manager`) + Swarm 3 (`frontend-performance-manager`) |
| Test | `manager` / `qa` / `fe-dev`, `be-dev`, `dba` | `cpo` -> Swarm 11 (`lead-qa-architect` -> `testing-manager`) |
| Mobile | `manager` / `mobile-lead` / `mobile-ios`, `mobile-android`, `mobile-cross-platform` | `cpo` -> Swarm 6 (`lead-mobile-architect`) |
| Data and Analytics | `manager` / `data-lead` / `data-engineer`, `analytics-engineer`, `experimentation-lead` | `cpo` -> Swarm 5 (`lead-database-architect`) + Swarm 8 (`lead-analytics-architect`) |

## Per-tool generated surfaces

Generated via `pnpm ai:sync` from canonical `.cursor/` sources.

| Tool surface | Generated path(s) | Canonical source |
| ------------ | ----------------- | ---------------- |
| Claude Code / Claude CLI | `CLAUDE.md`, `.claude/commands/**`, `.claude/agents/**`, `.claude/skills/**` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Codex app / Codex CLI | `AGENTS.md`, `.codex/AGENTS.md` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Copilot CLI | `AGENTS.md` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Opencode CLI | `AGENTS.md`, `.opencode/command/**`, `.opencode/agent/**` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Antigravity IDE | `.antigravity/commands/**`, `.antigravity/agents/**`, `.antigravity/skills/**`, `.antigravity/rules/**` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Gemini CLI | `GEMINI.md`, `.gemini/commands/*.toml` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Qwen CLI | `QWEN.md`, `.qwen/commands/*.toml` | `.cursor/commands/**`, `.cursor/agents/**`, `.cursor/skills/**`, `.cursor/rules/**` |
| Kilo Code CLI | `.kilocode/rules/**` | `.cursor/rules/**` |

## `docs/agents` (traceability)

Registry-style upstream personas live under `docs/agents/` (`core/`, `specialized/`). They map to COIA lenses in `.cursor/agents/README.md` (*Reference agents catalog* section)—upstream bodies are mostly placeholders; **do not** treat them as overrides to `.cursor/agents/*.md` unless explicitly merged.
