---
name: nezam-secret-management
description: Secret stores (Vault / AWS SM / Vercel / Doppler), env injection, rotation policies, and least-privilege access.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Specify how secrets are stored, injected, rotated, and accessed across environments — with auditable least-privilege access and zero plaintext in repo. Single-responsibility: secret lifecycle.

# Inputs

- Hosting target(s) from cloud skills (`nezam-vercel-deploy`, `nezam-aws-infra`, `nezam-cloudflare-edge`).
- Auth contract from `@.cursor/skills/nezam-auth-workflows/SKILL.md`.
- Compliance regime from `@.cursor/skills/nezam-privacy-compliance/SKILL.md`.
- DevOps pipeline from `@.cursor/skills/nezam-devops-pipeline/SKILL.md`.

# Step-by-Step Workflow

1. Choose secret store per env: Vercel Env / Cloudflare Secrets for app secrets, AWS Secrets Manager / HashiCorp Vault / Doppler for cross-cloud, OIDC federation for CI.
2. Categorize secrets: app-runtime, signing keys, db credentials, third-party API tokens; assign owner per category.
3. Apply least-privilege: per-service IAM, scoped tokens; never share secrets across services without rationale.
4. Rotation policy: 90 days max for static secrets; immediate rotation on suspected exposure; auto-rotation where supported.
5. CI/CD: use OIDC to assume cloud roles instead of long-lived keys; ephemeral credentials per job.
6. Local dev: `.env.local` git-ignored; sample `.env.example` committed with placeholder values; never commit `.env*` except `.env.example`.
7. Audit: log secret access where possible; alert on out-of-pattern reads.

# Validation & Metrics

- Secret-scanning (gitleaks) clean on every PR.
- 100% of CI jobs use OIDC where supported (no long-lived keys).
- Rotation log shows compliance with policy.
- No secrets in logs (scrubber configured).
- Access reviews quarterly; least-privilege drift caught.

# Output Format

- `docs/core/required/sdd/SECRET_MANAGEMENT.md` (stores, categories, owners, rotation).
- `.env.example` template.
- IAM/role policy stubs for OIDC federation.
- Rotation runbook + access-review checklist.

# Integration Hooks

- `/SCAN security` runs secret scanners.
- `/SAVE log` records rotations.
- Pairs with `@.cursor/skills/nezam-auth-workflows/SKILL.md`, `@.cursor/skills/nezam-security-hardening/SKILL.md`, `@.cursor/skills/nezam-devops-pipeline/SKILL.md`, `@.cursor/skills/nezam-aws-infra/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- `.env.production` checked into git (even encrypted, without explicit policy).
- Long-lived AWS access keys for CI.
- Sharing the same secret across all environments.
- Secrets logged via `console.log` or APM payloads.
- Manual rotation only when a breach is suspected.

# External Reference

- HashiCorp Vault (https://developer.hashicorp.com/vault) — current.
- AWS Secrets Manager (https://docs.aws.amazon.com/secretsmanager/) — current.
- Doppler / Infisical docs — current.
- GitHub OIDC for cloud (https://docs.github.com/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect).
- gitleaks (https://github.com/gitleaks/gitleaks) — current.
- Closest skills.sh/official analog: secret-management / kms.
