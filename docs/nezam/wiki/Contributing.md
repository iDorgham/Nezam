# Contributing

## Philosophy

NEZAM is a governance workspace. Contributions should strengthen the delivery spine — not introduce ad-hoc complexity. Every change should have a traceable spec, follow the SDD pipeline, and pass all gates.

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/iDorgham/Nezam.git
cd Nezam
pnpm install
```

### 2. Initialize Workspace

Open in Cursor and run:
```
/START
```

This loads context, checks prerequisites, and identifies the current phase.

### 3. Create a Branch

Pull requests are validated by the **`branch-policy`** job in [`.github/workflows/ci.yml`](https://github.com/iDorgham/Nezam/blob/main/.github/workflows/ci.yml) (`branch-policy`). The **head branch name** must match:

```text
feature/<slug>
release/<slug>
hotfix/<slug>
```

`<slug>` is lowercase letters, digits, and `.`, `_`, `-` only (examples: `feature/onboarding-gate`, `release/1.2.0`, `hotfix/1.2.1`).

```bash
git checkout -b feature/your-topic-or-spec-id
```

**If `branch-policy` fails on your PR:** rename the head branch, then push (or open a new PR from a compliant branch):

```bash
git branch -m feature/my-topic
git push -u origin HEAD
# If the old branch already existed on the remote, delete it after the PR is updated or recreated.
```

### 4. Follow SDD Order

**Do not skip phases.** The hardlock system will tell you if you're trying to build before spec is done.

For significant changes:
1. Write or update the spec in `docs/specs/`
2. Update `docs/plans/INDEX.md`
3. Get design approval if UI is involved
4. Implement
5. Add/update tests
6. Update `docs/memory/MEMORY.md` with any decisions

### 5. Commit Convention

NEZAM uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert` (see `conventional-commits` in `.github/workflows/ci.yml`)

**Scopes:** `agents`, `skills`, `rules`, `commands`, `docs`, `memory`, `ci`, `design`, `scripts`

Examples:
```
feat(agents): add arabic-seo-aeo-specialist agent
fix(rules): correct hardlock path for design gate
docs(memory): update MEMORY.md with v2 stack decisions
chore(ci): update design-gates workflow
```

Or use `/GIT` in Cursor to generate the commit message.

### 6. Run Checks

```bash
pnpm ai:check          # Verify AI client sync
pnpm run check         # Run all workspace checks
```

**PRD release roadmap (§11):** Milestones live in [`docs/prd/release-roadmap.json`](../prd/release-roadmap.json). After you change that JSON, run **`pnpm prd:roadmap`** so the markdown table in [`docs/prd/PRD.md`](../prd/PRD.md) stays in sync—otherwise CI **`readiness`** fails on **`pnpm prd:roadmap:check`**. You can run **`pnpm prd:roadmap:check`** locally before pushing.

### 7. Open a Pull Request

CI **`policy-gate`** waits on **`branch-policy`**, **`conventional-commits`**, **`readiness`**, and other checks defined in `.github/workflows/ci.yml`. Use a compliant branch name (see §3) before opening the PR.

Use the PR template in `.github/`. Include:
- What changed and why
- Which phase/requirement this satisfies (R-XX from PRD)
- Screenshots for UI changes
- Confirmation that all checks pass

#### Branch protection on `main`

If **required status checks** on `main` list **`automation-smoke`** (or other `ci` jobs), GitHub expects those checks to succeed before the ref updates. Pushes that use **administrator bypass** may still land; GitHub can warn that a required check was bypassed or not yet reported.

**Context:** **`policy-gate`** runs only on **`pull_request`**, not on **`push`**. So for **direct pushes** to `main`, required checks must be jobs that actually run on `push` (for example **`readiness`**, **`automation-smoke`**, **`design-gate-readiness`**). For **PR merges**, requiring **`policy-gate`** is enough to indirectly require **`automation-smoke`**, because `policy-gate` lists it under **`needs`**.

**Practical options:**

1. **Prefer a PR into `main`** from a `feature/…` branch so PR-only jobs (**`branch-policy`**, **`conventional-commits`**, **`policy-gate`**) run and merge stays aligned with governance.
2. If you want a **single** required name on PRs, require **`policy-gate`** only; you do not also need **`automation-smoke`** as a separate required check unless you want that badge explicitly.
3. If **bypass** is allowed for emergencies, use it sparingly; afterward confirm the latest **`ci`** run on `main` in the Actions tab.

For routine work, open a PR from a **`feature/…`** branch and merge after **`policy-gate`** (and the rest of **`ci`**) is green.

---

## Adding a New Agent

1. Create `your-agent-name.md` in `.cursor/agents/`
2. Follow the agent format (see [Agent Map](./Agent-Map))
3. Run `pnpm ai:sync` to distribute to all clients
4. Add the agent to `CLAUDE.md`, `AGENTS.md`, and `GEMINI.md` indexes
5. Update `docs/memory/WORKSPACE_INDEX.md`

## Adding a New Skill

1. Create a folder in `.cursor/skills/<domain>/`
2. Add `SKILL.md` as the entry point
3. Run `pnpm ai:sync`
4. Update `docs/memory/SKILL_CHANGELOG.md`

## Adding a New Command

1. Create `your-command.md` in `.cursor/commands/`
2. Run `pnpm ai:sync`
3. Add to the Commands index in `CLAUDE.md`

## Updating the Design System

1. Edit the relevant profile in `.cursor/design/<brand>/design.md`
2. Re-apply: `pnpm run design:apply -- <brand>`
3. Run `pnpm run check:tokens`
4. Update `docs/memory/MEMORY.md` under Locked Design Decisions

---

## Code of Conduct

- Be explicit about tradeoffs — don't hide complexity
- Document decisions, not just code
- Respect the SDD phase order
- Keep agents focused — one clear responsibility per agent
- Never edit synced client folders directly (`.claude/`, `.gemini/`, etc.)
