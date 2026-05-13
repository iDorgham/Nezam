---
name: nezam-vercel-deploy
description: Vercel CLI, vercel.json, Edge Config, ISR/SSR, and deployment hooks for Next.js and framework-aware projects.
version: 1.0.0
updated: 2026-05-08
breaking_changes: false
changelog:
  - version: 1.0.0
    date: 2026-05-08
    notes: "Initial version metadata added."
compatible_with:
  - react: ">=18"
  - next: ">=14"
  - node: ">=20"
---
# Purpose

Specify Vercel deployment topology: project linking, env vars, build config, runtimes (Edge/Node), preview/production promotion, and rollback. Single-responsibility: Vercel deploy contract.

# Inputs

- React/Next.js architecture from `@.cursor/skills/nezam-react-architecture/SKILL.md`.
- Cache strategy from `@.cursor/skills/nezam-cache-strategies/SKILL.md`.
- Secrets policy from `@.cursor/skills/nezam-secret-management/SKILL.md`.
- CI pipeline from `@.cursor/skills/nezam-devops-pipeline/SKILL.md`.

# Step-by-Step Workflow

1. Link project: `vercel link`; commit `.vercel/project.json` is git-ignored.
2. Configure env vars per scope (Development, Preview, Production); pull with `vercel env pull`; never commit `.env.local`.
3. Author `vercel.json` for routes, headers, redirects, rewrites, function runtimes; prefer framework defaults.
4. Configure Functions: choose Node vs Edge runtime, regions, memory, max duration; document in spec.
5. Cache & ISR: pair with `revalidateTag` and Runtime Cache; set deployment cache hit % targets.
6. Build pipeline: install/build/output via `vercel build --prebuilt`; promote with `vercel deploy --prebuilt --prod`.
7. Rollback path: `vercel rollback <deployment-url>`; document in runbook.

# Validation & Metrics

- Preview deployment per PR with check status surfaced in GitHub.
- Production deploy < 10 min build time on average.
- Zero secrets in commits; `vercel env` is the source of truth.
- Function cold-start within budget per region.
- Rollback time-to-recovery ≤ 2 min.

# Output Format

- `vercel.json` (routes, headers, functions config).
- Env-var manifest (`docs/specs/ENV_VARS.md`).
- Deployment runbook (deploy, rollback, env rotation).
- Function topology table (route → runtime → region).

# Integration Hooks

- `/DEPLOY` triggers Vercel deploy (with explicit user approval).
- `/SAVE branch` triggers preview deploys via Git integration.
- Pairs with `@.cursor/skills/nezam-devops-pipeline/SKILL.md`, `@.cursor/skills/nezam-cache-strategies/SKILL.md`, `@.cursor/skills/nezam-cdn-optimization/SKILL.md`, `@.cursor/skills/nezam-secret-management/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- `.env.production` committed to repo.
- All routes set to `runtime: 'edge'` without measuring cold-start.
- Skipping preview deploys for "small" PRs.
- Force-promoting without rollback verification.
- `vercel.json` rewrites masking actual route structure.

# External Reference

- Vercel CLI docs (https://vercel.com/docs/cli) — current.
- Vercel Functions (https://vercel.com/docs/functions) — current.
- Vercel Edge Config (https://vercel.com/docs/edge-config) — current.
- Next.js 15 deployment notes (https://nextjs.org/docs/app/building-your-application/deploying).
- Closest skills.sh/official analog: vercel-deploy / nextjs-deploy.
