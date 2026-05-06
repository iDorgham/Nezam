# Orchestration aliases (prompt ↔ repo)

Maps informal command-matrix names to **actual** skill folders and agent files. Use real paths in automation and docs.

## Commands → skills

| Prompt / matrix slug | Repo folder | SKILL.md |
| -------------------- | ----------- | -------- |
| `coi-git-workflow` | [`git-workflow`](skills/git-workflow/SKILL.md) | `.cursor/skills/git-workflow/SKILL.md` |
| `coi-plan-full` | [`plan-full`](skills/plan-full/SKILL.md) | `.cursor/skills/plan-full/SKILL.md` |
| `coi-design-md` | [`design-md`](skills/design-md/SKILL.md) | `.cursor/skills/design-md/SKILL.md` |
| `coi-seo-ia-content` | [`seo-ia-content`](skills/seo-ia-content/SKILL.md) | `.cursor/skills/seo-ia-content/SKILL.md` |
| `coi-external-ai-report` | [`external-ai-report`](skills/external-ai-report/SKILL.md) | `.cursor/skills/external-ai-report/SKILL.md` |
| `coi-guide-instructor-domains` | [`guide-instructor-domains`](skills/guide-instructor-domains/SKILL.md) | `.cursor/skills/guide-instructor-domains/SKILL.md` |

**Upstream library (not coi-prefixed):** [`docs/reference/skills/`](../../docs/reference/skills/) — especially `nexu_open_design/**`; promote selectively per [`docs/reference/INGEST_QUEUE.md`](../../docs/reference/INGEST_QUEUE.md).

## Prompt personas → `.cursor/agents`

| Matrix / informal name | Use agent file | Notes |
| ------------------------ | -------------- | ----- |
| `release-engineer` | [`gitops.md`](agents/gitops.md) | Tags, CI, ship cadence |
| `seo-strategist` | [`seo.md`](agents/seo.md) | Keywords, SERP, IA hooks |
| `content-architect` | [`content.md`](agents/content.md) | Voice, page inventories |
| `a11y-auditor` | [`designer.md`](agents/designer.md) + [`qa.md`](agents/qa.md) | IA/a11y vs test exit criteria |
| `perf-engineer` | [`qa.md`](agents/qa.md) + [`tech-lead.md`](agents/tech-lead.md) | Budgets, profiling |
| `security-reviewer` | [`security.md`](agents/security.md) | Threat model, OWASP-style review |

Canonical index: [`.cursor/agents/README.md`](agents/README.md).

## `docs/reference/agents` (traceability)

Registry-style upstream personas live under [`docs/reference/agents/`](../../docs/reference/agents/) (`core/`, `specialized/`). They map to COIA lenses in [`agents/README.md`](agents/README.md) (*Reference agents catalog* section)—upstream bodies are mostly placeholders; **do not** treat them as overrides to `.cursor/agents/*.md` unless explicitly merged.
