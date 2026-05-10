# NEZAM MCP Registry
> Official MCP servers available for IDE integration. Prefer MCP over CLI when both exist.
> Source: `docs/reference/developer-tech-stack-2026.md`
> Update quarterly with `developer-tech-stack-2026.md` review.

## Active MCP Servers (confirmed available)

| Service | MCP Available | Agent Owner | Activation Command | Notes |
|---|---|---|---|---|
| Supabase | ✅ Yes | lead-database-architect | auto | DB, Auth, Storage, Realtime |
| Neon | ✅ Yes | lead-database-architect | auto | Serverless Postgres branching |
| Clerk | ✅ Yes | auth-security-manager | auto | Auth + org management |
| Stripe | ✅ Yes | payments-lead | auto | Billing, subscriptions |
| GitHub | ✅ Yes | gitops-engineer | auto | PRs, issues, Actions |
| Vercel | ✅ Yes | lead-devops-performance | auto | Deployments, logs |
| Cloudflare | ✅ Yes | lead-devops-performance | auto | CDN, Workers, R2 |
| Sentry | ✅ Yes | observability-specialist | auto | Error tracking |
| PostHog | ✅ Yes | lead-analytics-architect | auto | Product analytics |
| Datadog | ✅ Yes | observability-specialist | on-demand | APM, logs |
| Firebase | ✅ Yes | lead-backend-architect | on-demand | Mobile/web BaaS |
| Auth0 | ✅ Yes | auth-security-manager | on-demand | Enterprise IAM |
| OpenRouter | ✅ Yes | prompt-engineer | auto | Multi-model routing |

## MCP-First Policy
When an agent needs to interact with a service that has an MCP server:
1. Use MCP first — never fall back to manual API calls if MCP is available
2. MCP calls are cheaper in tokens than describing API calls in prose
3. MCP results are structured — parse them directly without reformatting

## Setup Notes
- Cursor: configure MCP servers in `.cursor/mcp.json` (create if missing)
- Claude Code: configure in `~/.claude/mcp.json`
- Run `pnpm ai:sync` after adding new MCP configurations
