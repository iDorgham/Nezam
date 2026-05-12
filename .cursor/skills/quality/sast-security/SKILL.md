---
skill_id: "quality/sast-security"
name: "sast-security"
description: "Implements SAST tooling and proactive scanning workflows using Semgrep for code and LLM security."
version: 1.0.0
updated: 2026-05-12
changelog:
  - version: 1.0.0
    date: 2026-05-12
    notes: "Initial Wave 2 implementation."
owner: "security-auditor"
tier: 1
sdd_phase: "Quality"
rtl_aware: false
certified: true
dependencies: ["quality/security-hardening"]
---

# SAST Security

## Purpose

Implement Static Application Security Testing (SAST) using Semgrep to enforce secure coding patterns, detect vulnerabilities, and secure LLM interactions.

## Trigger Conditions

- CI/CD pipeline execution for pull requests or commits.
- Manual security audits or vulnerability triage.
- Implementation of new LLM prompts or AI features.

## Prerequisites

- Semgrep CLI installed in the environment or pipeline.
- Defined security baseline from `quality/security-hardening`.

## Procedure

1. **Rule Configuration:** Configure Semgrep with the 28 core rule categories and language-specific priority rules for the project stack (e.g., Next.js, Node.js).
2. **LLM Security:** Apply Semgrep LLM-specific rules to detect prompt injection vulnerabilities and validate LLM outputs.
3. **Integration:** Integrate SAST scanning into the CI/CD pipeline (`quality/github-actions-ci`) to block PRs with high-severity findings.
4. **Triage:** Establish a proactive scanning workflow where findings are triaged, ignored via code comments with justification, or routed for immediate remediation.

## Output Artifacts

- `.semgrep.yml` configuration file.
- SAST scan reports and CI artifacts.

## Validation Checklist

- [ ] Semgrep rules cover language-specific and framework-specific vulnerabilities.
- [ ] LLM-specific security rules are active.
- [ ] High-severity findings fail the CI build.
- [ ] Ignored rules have explicit justifications in code comments.

## Handoff Target

`/FIX` for remediating findings, or `external/deployment-checklist` for release validation.
