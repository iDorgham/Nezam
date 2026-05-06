# COIA agent personas

Lightweight **role lenses** for `/GUIDE`, `/DEVELOP`, and `/PLAN`. Each file is a charter + triggers—not an autonomous runtime. Invoke one persona when you need a consistent viewpoint (priorities, UX, SEO, security, release).

Orchestration prompt aliases (`coi-*` skills, informal persona names) map to real paths in [`.cursor/ORCHESTRATION_ALIASES.md`](../ORCHESTRATION_ALIASES.md).

## Governance precedence

When guidance overlaps, resolve conflicts in this order:

1. `.cursor/rules/*.mdc` (hard policy and gate contracts)
2. `.cursor/skills/**/SKILL.md` (deterministic execution workflow + artifacts)
3. `.cursor/agents/*.md` (advisory reasoning lens and trade-off framing)

Agents should not redefine hard gate thresholds or mandatory artifact requirements already defined by rules/skills.

## Index

| Code        | File             | Focus                                      |
| ----------- | ---------------- | ------------------------------------------ |
| `manager`   | [manager.md](manager.md) | Orchestration, sequencing, unblockers |
| `ceo`       | [ceo.md](ceo.md) | Strategy, bets, differentiation            |
| `pm`        | [pm.md](pm.md)   | Milestones, scope, acceptance               |
| `designer`  | [designer.md](designer.md) | UX, IA, accessibility, `DESIGN.md` |
| `fe-dev`    | [fe-dev.md](fe-dev.md) | Frontend implementation, SSR/CSR      |
| `be-dev`    | [be-dev.md](be-dev.md) | APIs, auth, services                     |
| `security`  | [security.md](security.md) | Threat model, OWASP-style review   |
| `devops`    | [devops.md](devops.md) | CI/CD, envs, deploy, observability       |
| `seo`       | [seo.md](seo.md) | Keywords, intents, metadata, IA hooks      |
| `content`   | [content.md](content.md) | Voice, copy blocks, page inventories   |
| `gitops`    | [gitops.md](gitops.md) | Branching, tags, releases               |
| `qa`        | [qa.md](qa.md)   | Test plans, regression, exit criteria      |
| `tech-lead` | [tech-lead.md](tech-lead.md) | Architecture, tradeoffs, review bar |
| `dba`       | [dba.md](dba.md) | Schema, migrations, query performance      |
| `aeo`       | [aeo.md](aeo.md) | Answer-engine / snippet-oriented surfaces   |

## How to use

1. **Lost on next step** → `/GUIDE next` (reads `docs/context/instructions.md`, `workspace.md`, `project.md`).
2. **Deep work** → Pick a persona above and ask the assistant to **stay in character** for that turn or slice.
3. **Cross-links** → Memory layers live in [docs/context/MEMORY_ARCHITECTURE.md](../../docs/context/MEMORY_ARCHITECTURE.md); durable decisions in [docs/context/MEMORY.md](../../docs/context/MEMORY.md).

## Reference agents catalog (`docs/reference/agents`)

Upstream files are **registry stubs** (minimal responsibilities). Use this table for traceability—prefer the COIA charter when behavior diverges.

| Reference path | Primary COIA lens | Notes |
| -------------- | ----------------- | ----- |
| `core/antigravity.md` | `tech-lead` | IDE/MCP bridge patterns |
| `core/factory_orchestrator.md` | `manager` | Orchestration metaphors |
| `core/healing_bot_v2.md` | `qa` | Recovery / triage framing |
| `core/library_curator.md` | `tech-lead` | Skill/corpus hygiene |
| `core/master_guide.md` | `manager` | Teaching router |
| `core/registry_guardian.md` | `security` | Registry integrity |
| `core/swarm_router_v3.md` | `manager` | Multi-agent routing |
| `core/teaching.md` | `manager` | Instructor mode |
| `specialized/brainstorm.md` | `manager` | Divergent ideation |
| `specialized/brand.md` | `designer` | Brand voice |
| `specialized/content_planner.md` | `content` | Editorial calendar |
| `specialized/creator.md` | `fe-dev` | Asset/build metaphors |
| `specialized/dependency_resolver.md` | `tech-lead` | Graph-style deps |
| `specialized/deployment_specialist.md` | `devops` | Ship path |
| `specialized/documentation_architect.md` | `content` | Doc IA |
| `specialized/integrity_auditor.md` | `qa` | Consistency checks |
| `specialized/legal_content_writer.md` | `content` | Compliance copy |
| `specialized/memory_manager.md` | `gitops` | Release memory / tagging metaphor |
| `specialized/migration_upgrader.md` | `dba` | Schema moves |
| `specialized/neural_fabric_sync.md` | `ceo` | Strategy metaphor |
| `specialized/profile_architect.md` | `pm` | Personas / JTBD |
| `specialized/research.md` | `seo` | Discovery |
| `specialized/revenue_orchestrator.md` | `ceo` | Commercial framing |
| `specialized/scraper.md` | `fe-dev` | Data acquisition |
| `specialized/security_auditor.md` | `security` | Audit lens |
| `specialized/seo.md` | `seo` | Duplicate name — COIA file wins |
| `specialized/seo_research.md` | `seo` | Research variant |
| `specialized/source_sync_manager.md` | `devops` | Mirror / sync |
| `specialized/spec_architect.md` | `pm` | Spec decomposition |
| `specialized/validation_auditor.md` | `qa` | Gate checks |
| `specialized/workflow.md` | `manager` | Process glue |
| `specialized/workspace_composer.md` | `manager` | Workspace layout |

## Adding a persona

Copy [AGENT.template.md](../../docs/templates/AGENT.template.md) into this folder or run `/CREATE agent` when wired in `create` command.
