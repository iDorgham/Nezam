# Versioning, Tags & Commit Discipline — {{PROJECT_NAME}}

## Semantic versioning rules

MAJOR.MINOR.PATCH meaning for this product:

- **MAJOR**:
- **MINOR**:
- **PATCH**:

## Initial version (locked during Planning)

- **Initial version**: `0.1.0`

## Branch model

- `main`:
- `feature/*`:
- `release/*`:
- `hotfix/*`:

## Conventional commits (enforced at authoring)

Examples:

- `feat(auth): add OIDC login`
- `fix(ui): correct contrast on CTA`
- `docs(seo): refresh keyword map`
- `chore(release): v1.2.0`

## Tag policy

- Format: `vMAJOR.MINOR.PATCH`
- Annotated tag body must include changelog highlights + migration notes

## Automation targets (later)

Describe intended GitHub Actions jobs (CI, release, semantic-release opt-in).

