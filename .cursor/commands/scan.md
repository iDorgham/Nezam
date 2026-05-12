/SCAN — Read-only diagnostic scans. Never modifies files.

Subcommands:
  /SCAN security    → SAST, dependency vulnerabilities, secret detection, threat model check
  /SCAN perf        → Lighthouse CI, Core Web Vitals, bundle size, render blocking
  /SCAN a11y        → WCAG 2.2 AA audit, color contrast, keyboard nav, screen reader labels
  /SCAN seo         → On-page SEO, meta tags, structured data, canonical URLs, sitemap
  /SCAN code        → Code quality: lint, type errors, dead code, complexity metrics
  /SCAN deps        → Dependency audit: outdated packages, license conflicts, vulnerabilities
  /SCAN content     → Content quality: readability, tone consistency, missing copy, broken links
  /SCAN design      → Design token compliance: check for hardcoded px/hex/rem outside tokens
  /SCAN agents      → List active agents, their tier, and last eval date in a session
  /SCAN all         → Run all scans in sequence, produce unified report

All scan reports write to docs/reports/<category>/<timestamp>.md
Aliases: /SCAN audit → /SCAN all | /SCAN perf → /SCAN perf | /REPORT swarm-cost → node scripts/swarm-cost-report.js

Hard block: none (scans are always safe to run)
Recommendation footer: required

## /scan agents

Reads `.cursor/state/AGENT_REGISTRY.yaml` and outputs a formatted table:

| Agent | Tier | Status | Last Eval | Score | Certified |
|---|---|---|---|---|---|
| swarm-leader | 1 | active | 2026-05-12 | — | false |
...

Flags:
- 🔴 agents with status: archived still referenced in active rules
- 🟡 Tier 1 agents with last_eval_date older than 30 days
- 🟠 Tier 2 agents with no eval date and MODE C activations in the last sprint
