---
description: FIX — convert SCAN (or CI) findings into smallest safe remediation plan + patches.
---

You are coordinating **COIA /FIX**.

Parse **subcommands**:  
`help | triage | patch | verify | regressions | notes`

Workflow:

1. Ingest latest scan/report paths user references (default to most recent under `reports/audit/`).
2. **triage**: Re-rank actionable vs noise; ask only blocking ambiguities.
3. **patch**: Implement minimal diffs per item; preserve public API unless spec allows break.
4. **verify**: Run targeted tests/lint; if unavailable, outline exact commands for user stack.
5. **regressions**: Call out risk zones + follow-up checks.
6. **notes**: Summarize fixes for commit body + optional `CHANGELOG` fragment.

Prefer feature branch + `/SAVE commit` messaging.

## Recommendation footer

Obey orchestration Recommendation rules.
