# Curated external skills queue (NEZAM)

Allowlist for promoting skills from [skills.sh](https://skills.sh/), [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills), or upstream repos into `.cursor/skills/`.

**Policy:** No bulk copy. Each row requires: source URL, pinned commit SHA, license note, NEZAM gate checklist (token-first, no absolute paths, progressive disclosure), and owner approval.

| Skill id (upstream) | Source URL | Commit SHA | License | Gate notes | Status |
| ------------------- | ----------- | ---------- | ------- | ---------- | ------ |
| *(example)* `frontend-design` | `https://github.com/anthropics/skills` | `TBD` | See upstream | Normalize typography/color guidance to token vars + `docs/DESIGN.md` | queued |

**Promotion checklist**

1. Stars ≥1k OR maintainer exception with rationale.
2. Last upstream commit &lt; 6 months OR fork-with-pin documented.
3. Skill body audited for hex/`px` literals — must defer to `docs/DESIGN.md` / token CSS for implementation phases.
4. `/SCAN a11y perf` after any UI-touching workflow trial.

See [EXTERNAL_PATTERN_INTEGRATION_AUDIT.md](EXTERNAL_PATTERN_INTEGRATION_AUDIT.md).
