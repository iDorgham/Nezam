---
name: nezam-auth-workflows
description: OAuth 2.1 / OIDC, JWT vs session, MFA, RBAC, and token rotation patterns for production auth.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
# Purpose

Specify authentication and authorization: identity provider, session strategy, token lifecycle, MFA, and RBAC/ABAC. Single-responsibility: identity & access contract.

# Inputs

- Identity provider choice (Auth0, Clerk, Supabase Auth, Cognito, custom OIDC).
- API contract from `@.cursor/skills/nezam-api-design/SKILL.md`.
- Compliance constraints from `@.cursor/skills/nezam-privacy-compliance/SKILL.md`.
- Secrets policy from `@.cursor/skills/nezam-secret-management/SKILL.md`.

# Step-by-Step Workflow

1. Choose protocol: OAuth 2.1 + OIDC for federated; passkeys (WebAuthn) for passwordless; magic links only as supplement.
2. Decide session strategy: opaque-session cookie (HttpOnly, Secure, SameSite=Lax/Strict) for browsers; short-lived JWTs for service-to-service.
3. Enforce MFA: TOTP, WebAuthn, or push; require for admin and high-risk operations.
4. RBAC: define roles + permission catalogue; ABAC for tenant- or row-scoped checks (Postgres RLS or policy engine like Cerbos/OPA).
5. Token lifecycle: short access tokens (≤ 15 min), refresh tokens with rotation + reuse detection, bind tokens (DPoP, mTLS) for high security.
6. Logout: revoke refresh tokens server-side; clear cookies; honor SLO across federated apps.
7. Audit: log auth events (login, MFA, role change, logout, failed attempts) with sufficient context (without secrets).

# Validation & Metrics

- 100% of mutation endpoints require authentication.
- All admin routes enforce MFA.
- Refresh-token rotation tested; reuse detection triggers session revoke.
- Brute-force protection (rate limit, lockout, CAPTCHA escalation).
- Auth event log retained per compliance policy.

# Output Format

- `docs/specs/AUTH_WORKFLOWS.md` (protocol, sessions, tokens, MFA, RBAC).
- Permission catalogue (role × resource × action).
- Token lifecycle diagram (mermaid).
- IdP configuration checklist.

# Integration Hooks

- `/PLAN security` consumes the contract.
- `/DEVELOP` builds against the spec (without writing app code here).
- `/SCAN security` validates flows and headers.
- Pairs with `@.cursor/skills/nezam-security-hardening/SKILL.md`, `@.cursor/skills/nezam-secret-management/SKILL.md`, `@.cursor/skills/nezam-supabase-architect/SKILL.md`, `@.cursor/skills/nezam-api-gateway/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- Storing JWT in `localStorage` (XSS exfiltration).
- Long-lived access tokens without rotation.
- Role checks done only on the client.
- "Remember me" without rotating refresh token.
- MFA bypass via password-reset flow.

# External Reference

- OAuth 2.1 draft (https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/) — current.
- OpenID Connect Core 1.0 (https://openid.net/specs/openid-connect-core-1_0.html).
- WebAuthn Level 3 (https://www.w3.org/TR/webauthn-3/) — current.
- OWASP ASVS v4 / Authentication Cheat Sheet (current).
- RFC 9449 OAuth 2.0 DPoP (current).
- Closest skills.sh/official analog: auth / oauth-oidc.
