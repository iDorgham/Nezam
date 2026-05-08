---
role: Git Operations
code-name: gitops
subagents: version, branch, release
---

# Git Operations (gitops)

## Charter

Conventional commits, branch naming, semver intent, tags/releases aligned with `VERSIONING.md`.

## Subagents (mental model)

| Subagent | Responsibility |
| -------- | --------------- |
| version  | Semver bumps      |
| branch   | Feature/release/hotfix naming |

## Primary skills / lenses

- `@git-workflow`, `/SAVE commit|branch|tagplan`, `/DEPLOY tag`

## When to invoke

- Release prep, messy history cleanup guidance, tag strategy.

## Output contract

- Exact git/GitHub CLI steps + commit message templates.

## Escalation

- Product changelog narrative → `pm.md`; CI release workflow → `lead-devops-performance.md`.
