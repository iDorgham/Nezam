# Welcome to NEZAM

This guide gets you from zero to your first commit in under 15 minutes.

If you get stuck at any point, type `/GUIDE` in your AI chat — it will tell you exactly what to do next.

---

## Before You Start

Make sure you have these installed:

- **Node.js** v20 or higher → [nodejs.org](https://nodejs.org)
- **pnpm** v9 or higher → `npm install -g pnpm`
- **Git** → [git-scm.com](https://git-scm.com)

Check versions:
```bash
node -v   # should be v20.x or higher
pnpm -v   # should be 9.x or higher
git -v
```

---

## Step 1 — Clone and Install

```bash
git clone https://github.com/iDorgham/Nezam.git
cd Nezam
pnpm install
pnpm hooks:install
```

`pnpm hooks:install` sets up the git pre-commit hook. This hook keeps your AI tools in sync automatically on every commit.

---

## Step 2 — Open in Your AI Tool

Open the `Nezam` folder in **Cursor**, **VS Code**, or **Claude Code**.

Then type this in the AI chat:

```
/START all
```

This will:
- Check your environment
- Lock your product requirements (PRD)
- Set the starting state for your project

If anything is missing, `/START` will tell you what to fix.

---

## Step 3 — Apply a Design Profile

Pick a design profile. This sets your colors, fonts, and spacing for the whole project.

```bash
pnpm run design:apply -- nezam-v3
```

Available profiles are in `.nezam/design-hub/design/`. Each profile has a folder with a `design.md` file. You can also create your own.

---

## Step 4 — Build Your Wireframes

Before you write any code, you need to define your page layouts. This is how NEZAM prevents the AI from guessing your structure.

```bash
pnpm design-hub
```

Open **[http://localhost:4000](http://localhost:4000)** in your browser.

Inside the Design Hub:
1. Go to the **Wireframes** section
2. Add your pages and layouts using the block palette
3. Click **Export** when you are done

This creates `wireframes_locked.json` in your project root. Once this file exists, development is unlocked.

---

## Step 5 — Start Building

Now you can run:
```
/DEVELOP start phase_1
```

The AI will follow your locked wireframes and design profile. It will not invent layouts or styles — it will use exactly what you defined.

---

## The Development Flow

Once you are inside a phase, here is the loop:

```
/develop ui       → build the frontend slice
/develop api      → build the backend logic
/develop review   → run quality checks (a11y, tokens, specs)
/develop complete → lock the phase as done
```

When a phase is complete, the next one unlocks.

---

## Quality Gates

Every merge into `Master` must pass these checks:

| Check | What It Verifies |
|:---|:---|
| `pnpm check:onboarding` | PRD is locked, design profile is set |
| `check-wireframe-schema-v2.js` | Wireframe lock file is schema v2.0 or higher |
| `pnpm check:tokens` | No hardcoded colors or raw pixel values in code |
| `pnpm check:gate-5-a11y` | Accessibility passes WCAG 2.2 AA |

Run all of them at once:
```bash
pnpm check:all
```

---

## Useful Commands

| What You Want | Command |
|:---|:---|
| See what to do next | `/GUIDE` in AI chat |
| Start the design tool | `pnpm design-hub` |
| Run all checks | `pnpm check:all` |
| Sync AI tool mirrors | `pnpm ai:sync` |
| Start a dev phase | `/develop start <phase_name>` |

---

## Common First-Day Problems

**pnpm install fails**
```bash
pnpm config set registry https://registry.npmjs.org/
pnpm install
```

**Git commit is blocked**
The pre-commit hook found a sync issue. Fix it:
```bash
pnpm ai:sync && git add -A && git commit -m "your message"
```

**Design Hub shows a blank page**
Wait a few seconds and refresh. It takes a moment to compile on first load.

**Not sure which phase to start**
Type `/GUIDE` — it reads your project state and tells you exactly what to do next.

---

## Where Things Live

```
.cursor/           ← All agents, commands, skills, rules. Edit here.
.nezam/core/       ← Plans, gates, PRD specs
.nezam/design-hub/ ← The visual design tool
DESIGN.md          ← Your active design contract (auto-generated)
wireframes_locked.json  ← Your layout lock (auto-generated)
```

---

## Need Help?

- Type `/GUIDE` in any AI chat for the next step
- Check [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for common issues
- [Open an issue](https://github.com/iDorgham/Nezam/issues) on GitHub
