---
name: nezam-privacy-compliance
description: GDPR / CCPA patterns — consent gating, audit logging, right-to-delete, and data residency.
version: 1.0.0
updated: 2026-05-08
changelog: []
---

# Purpose

Specify privacy controls so the application meets GDPR, CCPA/CPRA, and similar regimes: lawful basis, consent UX, DSR fulfillment (access, delete, port), audit logging, and data residency. Single-responsibility: privacy contract.

# Inputs

- Data inventory + flow map from `docs/specs/`.
- Auth + access controls from `@.cursor/skills/nezam-auth-workflows/SKILL.md`.
- Editorial workflows for privacy-sensitive content from `@.cursor/skills/nezam-editorial-workflows/SKILL.md`.
- Hosting/regions from cloud skills.

# Step-by-Step Workflow

1. Build data inventory: data class (PII, PHI, sensitive), source, processor, retention, region; document in `docs/specs/DATA_INVENTORY.md`.
2. Determine lawful basis per data class (consent, contract, legitimate interest); record DPIA where required.
3. Implement consent management: granular categories (necessary, analytics, marketing), pre-load gating, no dark patterns, easy withdrawal.
4. Provide Data Subject Request (DSR) flows: access, rectify, delete, port; document SLA (≤ 30 days for GDPR).
5. Audit logging: tamper-evident logs of access to personal data, retained per policy, restricted access.
6. Data residency: route storage to appropriate region; document cross-border transfer mechanism (SCCs, adequacy).
7. Vendor governance: DPAs in place with sub-processors; sub-processor list published.

# Validation & Metrics

- Data inventory current within 30 days of last review.
- Consent banner respects "do not track" and stores granular choices.
- DSR fulfillment median ≤ 14 days; 100% within 30.
- No analytics/marketing tags fire before consent.
- Audit log access controlled and reviewed.

# Output Format

- `docs/specs/DATA_INVENTORY.md`.
- `docs/specs/PRIVACY_POLICY_INPUTS.md` (legal-ready draft).
- DPIA worksheet (when required).
- DSR runbook.
- Sub-processor register.

# Integration Hooks

- `/PLAN security` consumes the contract.
- `/SCAN security` validates consent + tag firing order.
- `/FIX` consumes DSR backlog.
- Pairs with `@.cursor/skills/nezam-auth-workflows/SKILL.md`, `@.cursor/skills/nezam-editorial-workflows/SKILL.md`, `@.cursor/skills/nezam-monitoring-observability/SKILL.md`, `@.cursor/skills/nezam-secret-management/SKILL.md`.
- Honors `[.cursor/rules/workspace-orchestration.mdc](.cursor/rules/workspace-orchestration.mdc)`.

# Anti-Patterns

- "Accept all" defaults that pre-tick non-essential cookies.
- Dark-pattern reject flows (multi-click maze).
- Analytics scripts loading before consent decision.
- DSR processed manually without an SLA.
- Sub-processors used without DPA in place.

# External Reference

- GDPR (https://gdpr-info.eu/) — current.
- CCPA/CPRA (https://oag.ca.gov/privacy/ccpa) — current.
- ePrivacy guidance (EU) — current.
- IAB TCF v2.2 / Google Consent Mode v2 — current.
- ISO 27701 Privacy Information Management.
- Closest skills.sh/official analog: privacy-compliance / consent-management.
