# Deployment & CI

## CI/CD Overview

NEZAM uses GitHub Actions for all automated checks. Workflows live in `.github/workflows/`.

## Workflows

### `ci.yml` — Main CI

Runs on every push and PR to `main`.

Steps:
1. Install dependencies (`pnpm install`)
2. Run onboarding readiness check
3. Run AI client sync check (`pnpm ai:check`)
4. Run design token check
5. Run any test suites present

### `design-gates.yml` — Design Gate Enforcement

Runs on changes to `DESIGN.md`, `.nezam/design/`, or UI-related files.

Steps:
1. Check design tokens exist and are valid
2. Check dark mode parity
3. Check RTL token coverage

### `release.yml` — Semantic Release

Runs on push to `main` with conventional commits. Produces:
- CHANGELOG.md update
- Git tag
- GitHub Release

Configured via `release.config.cjs`.

---

## Scripts Reference

| Script | Command | Purpose |
|---|---|---|
| AI sync | `pnpm ai:sync` | Sync `.cursor/` to all client folders |
| AI check | `pnpm ai:check` | Verify no drift between clients |
| Design apply | `pnpm run design:apply -- <brand>` | Apply a design profile |
| Check onboarding | `scripts/checks/check-onboarding-readiness.sh` | Validate workspace setup |
| Check tokens | `scripts/checks/check-design-tokens.sh` | Validate design tokens |

---

## Gate Matrix

The GitHub Gate Matrix at `docs/plans/gates/GITHUB_GATE_MATRIX.json` defines what must pass before each phase transition. Structure:

```json
{
  "gates": [
    {
      "id": "G-00",
      "phase": "00-define",
      "checks": ["prd-exists", "context-exists"],
      "blocks": "01-research"
    }
  ]
}
```

---

## Onboarding Readiness

The `check-onboarding-readiness.sh` script verifies:
- [ ] `docs/prd/PRD.md` exists
- [ ] `.nezam/memory/CONTEXT.md` exists
- [ ] `docs/plans/INDEX.md` exists
- [ ] `.cursor/agents/swarm-leader.md` exists
- [ ] `DESIGN.md` exists (if phase ≥ 02)
- [ ] `docs/reports/tests/TEST_MATRIX.md` exists (if phase ≥ 04)

---

## Release Process

### Manual Release

```bash
# 1. Ensure all checks pass
pnpm run check

# 2. Commit all changes (conventional commit)
git add .
git commit -m "feat(workspace): <description>"

# 3. Push to main — semantic-release handles the tag
git push origin main
```

### Semantic Versioning

NEZAM follows [SemVer](https://semver.org/):
- `feat:` commits → minor bump (0.X.0)
- `fix:` commits → patch bump (0.0.X)
- `BREAKING CHANGE:` → major bump (X.0.0)

Version history is tracked in `docs/core/VERSIONING.md`.

---

## Troubleshooting CI

### AI check fails (`pnpm ai:check`)

```bash
pnpm ai:sync    # Re-sync all clients from .cursor/
pnpm ai:check   # Verify sync
```

### Design gate fails

```bash
pnpm run design:apply -- minimal   # Re-apply current profile
pnpm run check:tokens              # Verify tokens
```

### Onboarding check fails

Check which file is missing and create it using the relevant template in `.nezam/templates/`.
