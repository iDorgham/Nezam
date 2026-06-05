# NEZAM CI/CD Pipeline Failure & Recovery Guide

This guide provides troubleshooting procedures and recovery runbooks for all 20+ CI/CD pipeline gate failures, release pipeline blockages, and performance regression scenarios in the NEZAM workspace.

---

## 🔍 Navigation Matrix

| Gate Code | Gate Name | Classification | Severity | Primary Troubleshooting Script |
|---|---|---|---|---|
| **G-01** | Onboarding Readiness | SDD Pipeline | Hard | `bash .nezam/core/scripts/checks/check-onboarding-readiness.sh` |
| **G-04** | PRD Release Roadmap Sync | Release | Hard | `node .nezam/core/scripts/prd/render-release-roadmap.mjs --check` |
| **G-08** | Architecture Contract | SDD Pipeline | Hard | `test -f .nezam/core/architecture/ARCHITECTURE.md` |
| **G-09** | Human Gate Matrix | SDD Pipeline | Hard | `test -f .nezam/core/gates/GATE_MATRIX.md` |
| **DG-01**| Design Token Validation | Design Quality | Hard | `bash .nezam/core/scripts/checks/check-design-tokens.sh` |
| **G-10** | AI Client Sync Integrity | Multi-client | Hard | `pnpm ai:check` |
| **G-13** | SDD State Integrity | SDD Pipeline | Hard | `bash .nezam/core/scripts/checks/sdd-gate-validator.sh` |
| **G-11** | Wireframe Lock | Design Quality | Hard | `node .nezam/core/scripts/checks/check-wireframes-lock.js` |
| **G-14** | PR Quality Bundle | CI / Quality | Hard | `pnpm check:all` |
| **NIGHT** | Nightly Performance / Drift | Continuous | Soft | `pnpm perf:lhci` / `pnpm ai:check` |

---

## 🚨 Section I: Start Phase Gates (G-01 to G-09)

### Scenario 1: G-01 Onboarding Readiness fails due to missing `PRD.md`
*   **Error Message**: `docs/start/PRD.md not found in repository root or docs/start/`
*   **Root Cause**: The Product Requirement Document has not been initialized or is in the wrong directory.
*   **Recovery Action**:
    1. Verify if `PRODUCT.md` exists and rename/move to `docs/start/PRD.md`.
    2. Run synchronization of PRD copies:
       ```bash
       cp docs/start/PRD.md .nezam/core/prd/PRD.md
       ```
    3. Re-run `pnpm check:onboarding`.

### Scenario 2: G-01 Onboarding Readiness fails due to missing `PROJECT_PROMPT.md`
*   **Error Message**: `docs/start/PROJECT_PROMPT.md is missing`
*   **Root Cause**: The workspace bootstrapper skipped the baseline project prompt definition.
*   **Recovery Action**:
    1. Create a minimal bootstrap spec at `docs/start/PROJECT_PROMPT.md`.
    2. Add standard metadata: Project Title, Target Brand, and Tech Stack details.
    3. Re-run verification.

### Scenario 3: G-01 Onboarding Readiness fails due to missing `CHANGELOG.md`
*   **Error Message**: `CHANGELOG.md is missing from workspace root`
*   **Root Cause**: Git history metadata initialization was omitted.
*   **Recovery Action**:
    1. Create an empty `CHANGELOG.md` with standard Keep-a-Changelog headings.
    2. Run task draft generator:
       ```bash
       pnpm run changelog:draft
       ```

### Scenario 4: G-04 PRD Release Roadmap Sync fails
*   **Error Message**: `PRD §11 Release Table does not match release-roadmap.json`
*   **Root Cause**: Manual additions to the PRD file decoupled the Markdown representation from the JSON backend schema.
*   **Recovery Action**:
    1. Generate the synchronized markdown table from JSON schema:
       ```bash
       pnpm run prd:roadmap
       ```
    2. Verify changes with git diff. Commit and push the updated PRD table.

### Scenario 5: G-08 Architecture Contract fails
*   **Error Message**: `Missing ARCHITECTURE.md contract file`
*   **Root Cause**: Entering development phase before planning/architecture is locked.
*   **Recovery Action**:
    1. Run planning orchestrator to generate architecture diagrams and specs:
       ```bash
       pnpm run agy:plan -- "Project Specification"
       ```
    2. Commit the generated `.nezam/core/architecture/ARCHITECTURE.md`.

### Scenario 6: G-09 Human Gate Matrix fails
*   **Error Message**: `Missing GATE_MATRIX.md spec file`
*   **Root Cause**: Gate matrix document deleted or misplaced.
*   **Recovery Action**:
    1. Copy `.nezam/core/gates/GATE_MATRIX.md` back to path or regenerate from JSON:
       ```bash
       cp .nezam/core/gates/GATE_MATRIX.md docs/start/
       ```

---

## 🎨 Section II: Design & Token Gates (DG-01 to G-11)

### Scenario 7: DG-01 Design Token Validation fails (Hardcoded Hex Colors)
*   **Error Message**: `DG-01 Token Violation: Hardcoded hex color [#xxxxxx] found in file [...]`
*   **Root Cause**: A style rule uses raw hex triplets instead of mapped Tailwind/CSS variables.
*   **Recovery Action**:
    1. Locate the file and line number in the error output.
    2. Replace the hex code with its mapped utility theme token (e.g. `var(--color-primary)` or Tailwind `text-primary`).
    3. Re-run token sweep locally:
       ```bash
       pnpm run check:tokens
       ```

### Scenario 8: DG-01 Design Token Validation fails (Hardcoded Pixels)
*   **Error Message**: `DG-01 Token Violation: Raw pixel value [XXpx] found in layout [...]`
*   **Root Cause**: Absolute spacing or font dimensions used instead of relative font/rem tokens.
*   **Recovery Action**:
    1. Replace `px` dimensions with relative spacing variables or Tailwind scales (e.g., `h-4` or `p-6` instead of `height: 16px`, `padding: 24px`).
    2. For custom components, declare layout container queries rather than static pixel widths.

### Scenario 9: DG-01 Design Token Validation fails (Inline CSS Violation)
*   **Error Message**: `DG-01 Token Violation: Inline style tag or attribute found`
*   **Root Cause**: Quick layout mockups utilizing the `style="..."` HTML property.
*   **Recovery Action**:
    1. Extract all style declarations to global stylesheet (`index.css`) or use governed utility classes.
    2. Re-verify the file.

### Scenario 10: G-11 Wireframe Lock not found
*   **Error Message**: `G-11 Failure: wireframes_locked.json missing from root or .session/`
*   **Root Cause**: Attempted frontend scaffolding or development without locking wireframe page nodes.
*   **Recovery Action**:
    1. Launch the Design Hub visual server:
       ```bash
       pnpm run design-hub
       ```
    2. Open wireframe editor, draw layout blocks for target pages, and click **Lock & Export Session**.
    3. Commit the updated `wireframes_locked.json` to repository root.

### Scenario 11: G-11 Wireframe validation structural mismatch
*   **Error Message**: `wireframes_locked.json check failed: pages must be non-empty`
*   **Root Cause**: Empty pages array or corrupt JSON content.
*   **Recovery Action**:
    1. Restore fallback lock file from `.session/pages/` history.
    2. Re-run schema verification:
       ```bash
       node .nezam/core/scripts/checks/check-wireframes-lock.js
       ```

---

## 🤖 Section III: AI Sync & State Gates (G-10 to G-13)

### Scenario 12: G-10 Client Sync Integrity Drift
*   **Error Message**: `G-10 AI Client Sync Drift detected between .cursor and mirror directories`
*   **Root Cause**: Manual file changes inside `.antigravity/`, `.antigravitycli/`, `.claude/`, `.vscode/nezam/`, or `.windsurf/` instead of editing the canonical `.cursor/` source directory.
*   **Recovery Action**:
    1. **NEVER** edit mirror directories directly.
    2. Apply sync command to overwrite mirrors with canonical sources:
       ```bash
       pnpm run ai:sync
       ```
    3. Run verification to confirm the diff is zero:
       ```bash
       pnpm run ai:check
       ```

### Scenario 13: G-10 Sync failed due to ENOENT (Broken symlink)
*   **Error Message**: `ENOENT: no such file or directory, lstat [...]`
*   **Root Cause**: Stale or circular references in the mirrored vendor folder.
*   **Recovery Action**:
    1. Manually remove the target broken symlink.
    2. Re-sync with a clean state:
       ```bash
       rm -rf .claude/skills/*
       pnpm run ai:sync
       ```

### Scenario 14: G-13 SDD State file missing
*   **Error Message**: `G-13 State Integrity Check failed: missing onboarding.yaml`
*   **Root Cause**: State tracking was initialized but files were excluded or git-ignored.
*   **Recovery Action**:
    1. Re-initialize state files using state utilities:
       ```bash
       pnpm run state:set -- onboarding status="complete"
       ```
    2. Commit new state YAML files to `.cursor/state/`.

### Scenario 15: G-13 YAML State File Validation Failure
*   **Error Message**: `G-13 Validation failed: develop_phases.yaml has invalid YAML structure`
*   **Root Cause**: Manual edit resulting in spaces vs tabs indentation errors.
*   **Recovery Action**:
    1. Run the custom linting utility for state YAML files:
       ```bash
       pnpm run verify:yaml
       ```
    2. Fix the syntax errors highlighted in the output.

---

## 💻 Section IV: PR & Release Actions (G-14 to Release)

### Scenario 16: G-14 PR Quality Bundle CodeQL failure
*   **Error Message**: `CodeQL Analysis failed on severity error: [...]`
*   **Root Cause**: High or critical security vulnerabilities detected (e.g. path traversal, SQL injection, prototype pollution).
*   **Recovery Action**:
    1. Read the CodeQL Actions tab report to find the vulnerable file and data flow path.
    2. Apply sanitization libraries (e.g., path normalization, validation layers).
    3. Re-run CodeQL check locally or push verification commits.

### Scenario 17: G-14 PR Lint/Typecheck fails
*   **Error Message**: `tsc exited with non-zero code` or `eslint check failed`
*   **Root Cause**: Missing type exports or syntax issues in recent code.
*   **Recovery Action**:
    1. Run local compiler:
       ```bash
       npx tsc --noEmit
       ```
    2. Fix TypeScript compiler warnings. Run `pnpm lint --fix` for minor linting failures.

### Scenario 18: Lighthouse Performance Budget Exceeded
*   **Error Message**: `LHCI assertion failed: largest-contentful-paint value > 2500`
*   **Root Cause**: Heavy JS imports, unoptimized images, or lack of code splitting in the bundle.
*   **Recovery Action**:
    1. Enable lazy-loading on images and heavy dynamic UI components.
    2. Inline critical CSS rules.
    3. Run build to check bundle size:
       ```bash
       pnpm run build
       ```

### Scenario 19: Release Workflow Tag Conflict
*   **Error Message**: `Tag already exists: vX.Y.Z` or `Remote tag already exists: vX.Y.Z`
*   **Root Cause**: Manually pushing tags without incrementing version fields.
*   **Recovery Action**:
    1. Check git remote tags:
       ```bash
       git ls-remote --tags origin
       ```
    2. Run release dispatch with a clean, incremented semver value.

### Scenario 20: Release Rollback Procedure
*   **Error Message**: Release failed mid-deploy or contains fatal bugs.
*   **Recovery Action**:
    1. Delete local and remote git tag:
       ```bash
       git tag -d vX.Y.Z
       git push origin --delete vX.Y.Z
       ```
    2. Revert the commit that updated the version mapping.
    3. Update `release-roadmap.json` and reset stage in `CHANGELOG.md`.

### Scenario 21: Nightly AI Sync Drift alerts
*   **Error Message**: `::warning::Sync drift detected — run pnpm ai:sync`
*   **Root Cause**: Automated background bot pushed code changes or third party updates modified files.
*   **Recovery Action**:
    1. Checkout the broken branch.
    2. Run sync:
       ```bash
       pnpm run ai:sync
       ```
    3. Push changes back to verify green nightly checks.

### Scenario 22: Dependency Caching fails in CI runner
*   **Error Message**: `pnpm-lock.yaml hash mismatch, skipping restore`
*   **Root Cause**: Lockfile generated on a different OS (e.g., Windows vs Linux line endings) causing cache key mismatch.
*   **Recovery Action**:
    1. Regenerate lockfile using clean unix endings:
       ```bash
       pnpm install --no-frozen-lockfile
       ```
    2. Commit the new lockfile.
