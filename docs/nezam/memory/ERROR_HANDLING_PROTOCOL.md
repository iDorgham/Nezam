# Error Handling and Self-Healing Protocol

This protocol defines shared error reporting, escalation, and recovery behavior for swarm execution.

## Error classification

| Category | Severity | Typical examples | Primary owner |
| --- | --- | --- | --- |
| Hard Errors | Critical | Hardlock violation, missing required spec | PM-01 |
| Task Failures | High | Build failure, failing tests, contract mismatch | FE-01 / BE-01 / QA |
| Performance Issues | Medium | Query latency, CWV regression | PERF specialists |
| Security Issues | Critical | Auth bypass, secret exposure | Security specialists |
| Design Drift | Medium | UI diverges from approved design tokens | DESIGN-01 + FE-01 |
| Communication Errors | Low-Medium | Missing protocol footer, unclear handover | PM-01 |
| Token/Context Errors | Medium | Context overflow, runaway usage | PM-01 memory function |

## Required error report format

```markdown
🚨 **ERROR REPORT**

**Error Type**: [Category] - [Severity]
**Description**: [one sentence]
**Impact**: [what is blocked]
**Root Cause**: [if known]
**Files Involved**: [list]
**Reproduction Steps**: [numbered]
**Proposed Fix**: [action or command]

**Agent**: [Name]
**Status**: Error
**Next Agents**: [PM-01 or specific agent]
**Escalation Level**: [1-3]
---
```

## Tiered recovery ladder

1. **Level 1 - Self-heal**: agent retries with constrained refinement.
2. **Level 2 - Swarm fix**: PM-01 assigns domain specialists and `/FIX` track.
3. **Level 3 - User escalation**: PM-01 reports options and requests decision.
4. **Level 4 - Rollback path**: revert to last stable checkpoint/branch state.

## /FIX integration

- `/FIX security` routes to security-first remediation.
- `/FIX perf` routes to performance-first remediation.
- `/FIX lint` routes to static quality remediation.
- `/FIX audit` routes to aggregate report remediation.

## Learning loop

After resolution:

1. Capture root cause and prevention note.
2. Update durable memory artifact (`docs/memory/MEMORY.md` or equivalent governed memory file).
3. Propose new guardrail/rule when recurrence risk is high.
