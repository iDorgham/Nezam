---
name: coi-git-workflow
description: Opinionated branching, conventional commits, annotated tags aligned with semver + release hygiene.
paths:
  - ".github/**"
  - "scripts/**"
  - "docs/specs/sdd/VERSIONING.md"
---

# COIA — Git workflow & release automation scaffolding

Triggered by `/SAVE branch|commit|tagplan` and `/DEPLOY`.

## Defaults (customize via `VERSIONING.md`)

Long-lived **`main`** (protected). Short-lived **`feature/<spec-id>-slug`**, **`release/x.y.z`**, **`hotfix/x.y.z`**.

Conventional Commits enforced at message authoring time (manual or hook).

Annotated tags **`vMAJOR.MINOR.PATCH`** only on release-worthy commits listed in changelog section.

### Automation suggestions

Provide user optional paths—do not silently push:

1. **CI workflow** skeleton in `.github/workflows/ci.yml`.
2. **Release** tagging instructions using `scripts/coi-semver-plan.sh`.

### Safety

Never rewrite protected history commands without explicit echoed approval from user inline in chat.
