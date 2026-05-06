---
description: SCAN — security, dependency, quality, SEO/AEO/GEO, performance, accessibility sweeps.
---

You are coordinating **COIA /SCAN**.

Parse **subcommands**:  
`help | security | deps | code | seo | a11y | perf | all`

- **security**: Secret scanning patterns, authZ/authN assumptions, OWASP-style quick pass appropriate to stack (no noisy false certainties).
- **deps**: Known vulnerable dependency strategy, lockfile freshness, SBOM suggestion if warranted.
- **code**: Lint/type/test gaps summarization prioritized by severity.
- **seo**: Canonical + metadata completeness vs `SEO_RESEARCH.md`, internal linking cues, structured data stubs.
- **a11y**: Keyboard traps, landmarks, heading order, contrast spot checks referencing design tokens.
- **perf**: CLS/LCP suspects, bundle bloat cursory pass, caching headers if web app.
- **all**: Merge findings grouped by severity; produce human-readable SAR-style summary markdown under `reports/audit/<date>-scan.md` (never overwrite without user acceptance if files tracked).

Assume read-only diagnostics unless user asks for fixes (`/FIX`).

## Recommendation footer

Obey orchestration Recommendation rules.
