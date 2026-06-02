---
skill_id: nezam-security-hardening
name: "nezam-Security Hardening"
description: "Layered security hardening protocol: input validation, auth hardening, dependency audit, secret management, container security, and pre-release security gate."
version: 1.0.0
updated: 2026-05-12
owner: "lead-security-officer"
tier: 1
sdd_phase: "Quality"
certified: false
changelog:
dependencies: ["quality/sast-security", "quality/gh-security-compliance"]
---

# Security Hardening Skill

## Purpose
Apply a layered, systematic hardening protocol to any NEZAM codebase surface before the Phase 4 / pre-release gate passes. Covers application layer, auth, dependencies, secrets, infrastructure, and mobile-specific concerns.

## Trigger Conditions
- Pre-release gate (Phase 5 entry)
- Any PR touching auth, payment, data access, or AI inference surfaces
- Any new third-party dependency introduction
- S13 Ethics sign-off flagged a security concern

## Layer 1 — Input Validation and Output Encoding
1. Audit all user-facing inputs: SQL injection, XSS, path traversal, command injection
2. Enforce parameterized queries or ORM-enforced binding throughout
3. Sanitize and encode all dynamic output: HTML context, JSON context, URL context
4. Validate file upload types, sizes, and storage paths
5. Rate-limit all public endpoints: 429 on abuse, exponential backoff

## Layer 2 — Authentication and Session Hardening
1. Verify MFA is available on all privileged routes
2. Confirm JWT/session tokens: short expiry, rotation on privilege escalation, revocation list
3. Enforce RBAC: no role can access resources above its clearance
4. Audit OAuth flows: PKCE enforced, state param validated, redirect URIs allowlisted
5. Confirm password policy: bcrypt/argon2, minimum entropy, breach-check integration

## Layer 3 — Dependency and Supply Chain
1. Run `pnpm audit --audit-level=high` — zero critical/high issues before release
2. Verify Dependabot is configured and enabled
3. Pin all third-party dependencies to exact versions in lockfile
4. Audit transitive dependencies for known CVEs
5. Review any new dependency for license compatibility

## Layer 4 — Secrets and Configuration
1. Confirm zero hardcoded secrets in codebase (`git grep` + Gitleaks scan)
2. Verify all secrets via environment variables only — no `.env` committed
3. Confirm secrets are stored in vault (Infisical, Doppler, or Vercel env)
4. Rotate any secret that was ever logged, printed, or exposed in a PR diff
5. Enforce least-privilege API keys: scoped, not root keys

## Layer 5 — Infrastructure and Container Security
1. Containers: non-root user, read-only filesystem, no privileged flag
2. Network policies: zero trust between services, explicit allowlist only
3. Verify HTTPS everywhere: HSTS headers, no mixed content
4. CSP header: strict policy, no `unsafe-eval`, `unsafe-inline` scoped to minimum
5. Confirm security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`

## Layer 6 — Mobile-Specific (activate when product_type = mobile)
1. Certificate pinning on all API calls
2. Keychain/Keystore for credential storage — no plaintext
3. Jailbreak/root detection for sensitive operations
4. Obfuscate reverse-engineering surfaces in release builds
5. Verify deep link validation against allowlist

## Validation Gate

All 6 layers must pass before Phase 5 entry. Output a `SECURITY_HARDENING_REPORT.md`:
- Layer status: pass / warn / fail
- CVE count: 0 critical, 0 high required
- Secrets scan: clean
- Headers audit: all required headers present
- Sign-off agent: `lead-security-officer`

## Output Artifacts
- `docs/reports/security/SECURITY_HARDENING_REPORT.md`
- Updated `.github/workflows/security.yml` if gaps found
