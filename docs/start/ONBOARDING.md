# NEZAM Developer Onboarding Guide

Welcome to the NEZAM visual design hub development team! This guide walks you through setting up your local workspace, understanding our workflow, and committing code in compliance with our quality gates.

---

## 1. Local Workspace Setup

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js:** v20 or v24
- **pnpm:** v9.15.9 (Package Manager)
- **Git**

### Installation
Clone the repository and install all workspace dependencies:
```bash
pnpm install
```
This command initializes all monorepo packages (including `.nezam/design-hub` and `.nezam/docs-site`).

---

## 2. Developer Workflow

### Branching Strategy
We follow a strict SDD-aligned branching model:
- `Master`: The canonical stable production-ready branch. All changes are merged here via approved Pull Requests.
- Feature branches: Created for individual tasks or phases. Named in the format: `feature/phase[N]-[description]` or `feature/r[N]-[fix]`.

### Starting a Design Session
To run the Design Hub locally to modify sitemaps or wireframe block stacks:
```bash
pnpm design-hub
```
Open your browser to `http://localhost:4000`. Once you finish layout modifications, click the **Lock & Export** button to generate the new `wireframes_locked.json` file.

---

## 3. Local Verification & Quality Gates

Before pushing changes to GitHub, you must verify your modifications pass all automated gates:

### Run All Validation Gates
```bash
pnpm check:all
```
This runs:
1. **Token check:** `pnpm check:tokens` (Verifies no hardcoded style primitives).
2. **Schema version check:** `node .nezam/core/scripts/checks/check-wireframe-schema-v2.js` (Verifies lock format 2.0.0 compliance).
3. **Drift check:** `pnpm ai:check` (Verifies zero sync drift across client mirror directories).

---

## 4. Submitting a Pull Request

1. **Commit:** Commits are governed by Husky. The pre-commit hook runs `ai:check` automatically.
2. **Open PR:** Target the `Master` branch.
3. **CI Execution:** GitHub actions run all gate validations (`nezam-pr-gates.yml`). The PR cannot be merged if any gate fails.
4. **Staging Deploy:** Once merged, staging is deployed automatically. Production deploy is triggered manually via tagging.
