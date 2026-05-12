# Agent Map

NEZAM includes 100+ specialized agents organized in a strict hierarchy. All agents are lazy-loaded — only agents relevant to the current task are loaded into context.

## Hierarchy

```
executive-director
│   Strategic oversight, cross-domain decisions
│
└── swarm-leader
    │   Orchestrates multi-agent workflows
    │   Routes tasks, resolves conflicts
    │
    └── deputy-swarm-leader
        │   Backup orchestrator, parallel stream management
        │
        └── subagent-controller
            │   Executes tasks, coordinates specialists
            │
            ├── LEAD ARCHITECTS
            │   ├── lead-backend-architect
            │   ├── lead-frontend-architect
            │   ├── lead-mobile-architect
            │   ├── lead-database-architect
            │   ├── lead-devops-performance
            │   ├── lead-security-officer
            │   ├── lead-solution-architect
            │   ├── lead-analytics-architect
            │   ├── lead-ai-ethics-officer
            │   ├── lead-cms-saas-architect
            │   ├── lead-maintenance-agent
            │   ├── lead-qa-architect
            │   └── lead-uiux-designer
            │
            ├── BACKEND DOMAIN
            │   ├── backend-lead · api-logic-manager · database-design-manager
            │   ├── sql-expert · nosql-expert · data-engineer
            │   ├── data-pipeline-manager · real-time-streaming-specialist
            │   ├── time-series-specialist · vector-store-specialist
            │   └── search-cache-manager
            │
            ├── FRONTEND DOMAIN
            │   ├── frontend-lead · react-component-lead · ui-component-manager
            │   ├── frontend-framework-manager · frontend-performance-manager
            │   ├── design-lead · design-systems-token-architect
            │   ├── visual-design-manager · prototyping-design-system-manager
            │   └── motion-3d-choreographer
            │
            ├── MOBILE DOMAIN
            │   ├── ios-engineer · android-engineer · flutter-specialist
            │   ├── mobile-cross-platform · mobile-offline-sync-specialist
            │   └── mobile-push-notifications-specialist
            │
            ├── INFRASTRUCTURE & DEVOPS
            │   ├── infrastructure-manager · devops-manager · gitops-engineer
            │   ├── docker-k8s-specialist · observability-specialist
            │   ├── sre-incident-specialist · performance-engineer
            │   └── cost-optimization-analyst
            │
            ├── SECURITY & COMPLIANCE
            │   ├── app-security-manager · auth-security-manager
            │   ├── infra-security-manager · security-auditor
            │   ├── encryption-privacy-specialist · compliance-manager
            │   └── threat-modeling-specialist
            │
            ├── PRODUCT & CONTENT
            │   ├── product-manager · product-officer · business-analyst
            │   ├── content-strategist · content-workflow-manager
            │   ├── cms-manager · headless-cms-specialist
            │   └── seo-specialist · aeo-specialist
            │
            ├── QUALITY & TESTING
            │   ├── qa-test-lead · testing-manager · code-review-specialist
            │   ├── a11y-performance-auditor · rtl-specialist
            │   └── bug-triage-manager
            │
            ├── AI & ETHICS
            │   ├── ai-safety-misuse-specialist · ai-sustainability-specialist
            │   ├── bias-fairness-specialist · transparency-explainability-specialist
            │   ├── privacy-data-ethics-specialist · ip-copyright-ethics-specialist
            │   └── prompt-engineer
            │
            └── ARABIC / MENA SPECIALISTS
                ├── arabic-content-master · arabic-seo-aeo-specialist
                ├── khaleeji-specialist · levantine-specialist
                ├── masri-content-specialist · maghrebi-specialist
                └── msa-formal-specialist
```

## Support Agents

| Agent | Role |
|---|---|
| `analytics-engineer` | Data instrumentation, tracking plans |
| `automation-manager` | CI/CD, workflow automation |
| `billing-platform` | Payment integration, subscription logic |
| `ci-automation` | GitHub Actions, test automation |
| `client-onboarding-agent` | Workspace bootstrapping for new projects |
| `conflict-resolution-agent` | Resolves agent disagreements |
| `daily-sync-agent` | Session start/end ritual |
| `dashboard-manager` | Analytics dashboards |
| `dependency-update-specialist` | Dependency audits and upgrades |
| `docs-hygiene` | Documentation quality enforcement |
| `experimentation-lead` | A/B testing, feature flags |
| `feature-flags-specialist` | Feature toggle management |
| `i18n-engineer` | Internationalization |
| `integration-architecture-manager` | Third-party integrations |
| `integration-specialist` | Specific integration implementations |
| `knowledge-sharing-agent` | Cross-agent knowledge transfer |
| `knowledge-update-manager` | Keeps workspace docs current |
| `kpi-reporting-manager` | Metrics and reporting |
| `localization-lead` | Multi-language strategy |
| `mena-payments-specialist` | MENA-specific payment providers |
| `multi-tenancy-architect` | SaaS multi-tenant patterns |
| `payments-lead` | Payment system architecture |
| `privacy-data-ethics-specialist` | GDPR, data governance |
| `project-architect` | Per-project architecture decisions |
| `refactoring-specialist` | Technical debt reduction |
| `requirements-analysis-manager` | Requirements gathering and analysis |
| `risk-assessment-specialist` | Risk identification and mitigation |
| `saas-platform-manager` | SaaS-specific platform concerns |
| `scalability-resilience-architect` | High availability patterns |
| `services-microservices-manager` | Service decomposition |
| `solution-design-manager` | Solution architecture |
| `spec-writer` | Feature spec authoring |
| `tech-debt-manager` | Technical debt tracking |
| `technical-feasibility-analyst` | Feasibility assessments |
| `technology-evaluator` | Technology selection |
| `ux-research-strategy-manager` | User research |
| `white-label-theming-specialist` | Multi-brand theming |

## Lazy Loading

Agents are loaded on-demand via the `agent-lazy-load.mdc` rule. This prevents context overload. The rule activates agents based on:

1. The current phase of the SDD pipeline
2. The task type detected in the prompt
3. Explicit agent mentions

## Agent File Format

All agent files follow this structure:

```markdown
# [Agent Name]
Role: [one-line role]
Domain: [domain]
Tier: [1 = lead | 2 = specialist | 3 = support]

## Responsibilities
...

## Interaction Protocol
...

## Output Standards
...
```
