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

```bash
git checkout -b feat/your-feature-name
```

Branch naming convention:
- `feat/` — new feature or agent
- `fix/` — bug fix
- `docs/` — documentation update
- `refactor/` — refactoring
- `chore/` — maintenance

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

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

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

### 7. Open a Pull Request

Use the PR template in `.github/`. Include:
- What changed and why
- Which phase/requirement this satisfies (R-XX from PRD)
- Screenshots for UI changes
- Confirmation that all checks pass

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
