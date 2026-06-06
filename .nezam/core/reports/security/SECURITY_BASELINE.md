# Nezam Security Baseline Snapshot

| Metric / Configuration | Current Baseline State | Status | Owner |
|---|---|---|---|
| **CodeQL SAST Analysis** | JS/TS scanning active in `.github/workflows/codeql-analysis.yml`. Runs on push/PR to Master/main and weekly on Sundays. Sets `fail-on-severity: error`. | Active | Security Officer |
| **Dependabot Cadence** | Configured in `.github/dependabot.yml`. Weekly schedule for root directory package ecosystem (npm/pnpm workspaces) and GitHub Actions. | Active | Security Officer |
| **Secret Scanning** | Configured at repository settings level. Push Protection enabled to block high-entropy secrets in pushes. | Enabled | Security Officer |
| **High/Critical CVEs** | Remediation overrides present in root `package.json` for `postcss` and `zod`. Resolved to zero high/critical CVEs. | Resolved | Security Officer |
| **DAST Scanning** | OWASP ZAP integrated via `.github/workflows/dast-scan.yml` running weekly and on manual dispatch. | Active | App Security Manager |

---

## 1. CodeQL Analysis Profile
- **Languages:** `javascript-typescript`
- **Queries:** `security-extended`, `security-and-quality`
- **Failure Threshold:** `error` (High and Critical severity alerts block PR merges).

## 2. Dependabot Cadence Settings
- **npm / workspaces:** Weekly scans, limit 10 open PRs, auto-labeled with `dependencies` and `security`.
- **GitHub Actions:** Weekly scans for actions updates.

## 3. Dependency Security Status
As of June 6, 2026, the postcss vulnerability (GHSA-qx2v-qp2m-jg93) is mitigated across workspaces by pinning `postcss` to `>=8.5.10` via overrides.
All workspaces resolve to safe dependency versions.
- Root `postcss` override: `postcss@8.5.15` resolved.
- Root `zod` override: `zod@4.4.3` resolved.
