---
description: DEPLOY — release candidate, tags, deployment steps, post-release verification.
---

You are coordinating **COIA /DEPLOY**.

Parse **subcommands**:  
`help | rc | tag | notes | ship | verify | rollback`

- **rc**: Validate branch (`release/*` or tagged candidate), ensure CI green, diff since last tag, confirm migrations/feature flags.
- **tag**: Prepare annotated tag message from `VERSIONING.md` + changelog delta; show exact `git tag -a` / `git push origin` commands (user executes if credentials needed).
- **notes**: Generate user-facing + internal release notes from conventional commits.
- **ship**: Sequence build artifact → registry/hosting → smoke checklist; surface secrets handling without echoing values.
- **verify**: Post-deploy health, SEO sanity (canonical/robots if applicable), analytics spot-check.
- **rollback**: Document safe revert / previous artifact promotion.

Cross-link `@coi-git-workflow` for branch automation expectations.

## Recommendation footer

Obey orchestration Recommendation rules.
