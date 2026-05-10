# Versioning and Release Policy

This repository uses SemVer (`MAJOR.MINOR.PATCH`) with annotated Git tags and GitHub Releases.

## Branching Model

- `main`: protected, always deployable.
- `feature/<spec-id-or-topic>`: short-lived feature work branches.
- `release/<x.y.z>`: release preparation branches.
- `hotfix/<x.y.z>`: urgent production fixes.

All pull requests to `main` must originate from one of the allowed branch prefixes above.

## Commit Convention

Commits must follow Conventional Commits:

- `feat(scope): summary`
- `fix(scope): summary`
- `docs(scope): summary`
- `chore(scope): summary`

Allowed types:
`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Breaking changes are declared with `!`:

- `feat(api)!: remove legacy endpoint`

## SemVer Planning Rules

- `MAJOR`: breaking change in behavior or contract.
- `MINOR`: backward-compatible feature additions.
- `PATCH`: backward-compatible fixes and internal improvements.

Before a release:

1. Confirm version bump rationale.
2. Confirm CI is green.
3. Confirm merged PRs are reflected in release notes/changelog context.
4. Run `scripts/release/version-plan.sh`.

## Tags and GitHub Releases

- Tag format: `vMAJOR.MINOR.PATCH` (example: `v1.4.2`).
- Tags must be annotated, never lightweight.
- Tags are created by `.github/workflows/release.yml` from `workflow_dispatch`.
- Every release tag creates a GitHub Release with generated notes.

## Recommended Protection Settings (GitHub UI)

Configure branch protection for `main`:

- Require pull request before merging.
- Require status checks to pass:
  - `branch-policy`
  - `conventional-commits`
  - `readiness`
  - `placeholder` (replace with real build/test job when ready)
- Require linear history.
- Restrict force pushes and branch deletion.
