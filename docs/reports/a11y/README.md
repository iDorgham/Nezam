# Accessibility reports (`docs/reports/a11y`)

Generated a11y gate outputs and axe summaries for NEZAM Design Hub and related UI work.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm run check:gate-5-a11y` | Read-only gate report (deps, reports dir, optional `test:a11y`) |
| `pnpm run check:gate-5-a11y:report` | Run gate checks + write `gate-5.latest.md` |
| `cd .nezam/design-hub && pnpm test:a11y` | WCAG contrast + axe smoke on `Button` |

## Rolling files

- `gate-5.latest.md` — latest Gate 5 check output (timestamped in front matter)

## Phase 3 (T-Q-001)

Full `@axe-core/playwright` flows across critical Design Hub routes are tracked in Phase 03 Quality (`T-Q-001` → `T-Q-009` in `.nezam/core/plans/MASTER_TASKS.md`). Gate 5 here covers **baseline** contrast math and a **component axe smoke** until E2E is unlocked.
