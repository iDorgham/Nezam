# RELEASE-APPROVAL-PROTOCOL.md

Version: 1.0  
Last Updated: 2026-05-08  
Owner: PM-01 (Swarm Leader)

This document defines the mandatory approval process for all high-impact releases in the AI Swarm development workspace.

---

## 1. What is a High-Impact Release?

A release is considered high-impact if it meets any of the following criteria:

- Major new features or modules
- Changes to authentication, authorization, or user data handling
- Payment, billing, or subscription logic
- Multi-tenancy or tenant isolation changes
- Database schema migrations or data model changes
- Performance-critical paths or high-traffic endpoints
- Security-related changes
- UI/UX changes affecting core user flows
- Infrastructure, deployment, or CI/CD modifications
- Any release going to production or staging (customer-facing)
- Version bumps (v1.x.x, major feature releases)

---

## 2. Mandatory Approvers (The Release Council)

All high-impact releases require unanimous approval from the following five mandatory roles:

| # | Agent Role | Responsibility | Veto Power | Must Review |
|---|---|---|---|---|
| 1 | PM-01 (Swarm Leader) | Business alignment, PRD compliance, priorities | Yes | Required |
| 2 | ARCH-01 (Project Architect) | Architecture integrity, scalability, tech debt | Yes | Required |
| 3 | SEC-01 (Security Lead) | Security, compliance, threat modeling | Yes | Required |
| 4 | QA-01 (Quality Assurance Lead) | Test coverage, stability, regression risks | Yes | Required |
| 5 | SUP-01 (Code Review Supervisor) | Code quality, standards, maintainability | Yes | Required |

### Contextual Mandatory Approvers (Add when relevant)

- PERF-01 - performance or scalability changes
- DEVOPS-01 - infrastructure or deployment changes
- DESIGN-01 - user-facing UI/UX changes
- DB-01 - database migrations or data changes

---

## 3. Release Approval Workflow

1. Preparation  
   Developer/feature team runs `/release prepare <version>`.

2. Automated Gates (must all pass)  
   - All tests passing (unit + E2E)  
   - Security scan clean  
   - Performance benchmarks within baseline  
   - Reflection loops completed  
   - Changelog updated  
   - Silent Git branch -> `release/vX.Y.Z`

3. Parallel Review  
   PM-01 notifies the five mandatory approvers.

4. Individual Approvals  
   Each approver reviews changes and submits approval.

5. Final Sign-off  
   PM-01 gives final approval only after all five have approved.

6. Deployment  
   DevOps agent proceeds with deployment and tagging.

---

## 4. Approval Format (Required)

Every approver must reply using this exact format:

```md
APPROVAL - v1.3.0 (High-Impact Release)

Agent: SEC-01
Status: APPROVED / APPROVED WITH COMMENTS / REJECTED
Conditions (if any):
Comments:
Risk Level: Low / Medium / High
Reviewed Files: [list or "All changed files"]
```

Rejections must include clear reasons and suggested fixes.

---

## 5. Hard Rules (Non-Negotiable)

- No high-impact release may be deployed without unanimous approval from all five mandatory approvers.
- PM-01 has final veto power even if others approve.
- All approvals must be documented in the PR or release ticket.
- Attempting to bypass this protocol triggers a hardlock enforced by PM-01 and MEM-01.
- All high-impact releases must create a git tag (`vX.Y.Z`) and update changelog.

---

## 6. Emergency Release Exception

In true emergencies (critical security hotfix):

- PM-01 + SEC-01 + one other approver (minimum three total) can fast-track.
- A post-mortem is required within 24 hours.

---

## 7. Responsibility Summary

- PM-01: orchestrates the entire process and final decision.
- ARCH-01: ensures long-term system health.
- SEC-01: protects users and company from security risks.
- QA-01: guarantees stability and quality.
- SUP-01: maintains code standards.

---

Approval of this protocol: by using this workspace, all agents agree to follow this release approval process.
