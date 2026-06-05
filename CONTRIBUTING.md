# Contributing to NEZAM

Welcome to the NEZAM workspace kit! Follow these guidelines to set up your environment, synchronize AI agent definitions, and ensure your contributions pass validation.

---

## 1. Initial Setup

Before working on any task, install dependencies and initialize git hooks:

```bash
# Install dependencies
pnpm install

# Initialize Husky pre-commit hooks
npx husky install
pnpm hooks:install
```

---

## 2. Syncing Agent Mirrors

NEZAM supports multiple AI tools and client environments. To ensure consistency, all client mirrors (located in `.claude/`, `.windsurf/`, etc.) must match the canonical configurations in `.cursor/`.

The Husky pre-commit hook is configured to run `pnpm ai:sync` and stage the synchronized mirror files automatically upon commit.

If you ever need to manually synchronize files:

```bash
pnpm ai:sync
```

---

## 3. Running Validation Checks

Before pushing any commits to the remote repository, ensure all verification suites pass:

```bash
# Check YAML state files syntax
pnpm verify:yaml

# Verify no mirror drift and audit swarm integrity
pnpm ai:check
```
