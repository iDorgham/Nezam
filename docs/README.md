# Project Docs

> This folder is where your project lives. Run `/start` to initialize.

---

## Structure

```
docs/
├── prd/          ← Product Requirements Documents
│   └── PRD.md    ← Add your PRD here (or let /start generate it)
├── plans/        ← AI-generated execution plans (created by /plan)
│   └── ...
└── reports/      ← CI and audit reports (generated automatically)
    └── ...
```

---

## How to Start

1. **Add your PRD** — drop a `PRD.md` in `.nezam/workspace/prd/`, or run `/start` and Claude will guide you through creating one.
2. **Generate a plan** — run `/plan` once your PRD is ready. Claude will scaffold `docs/plans/` with phase folders.
3. **Track progress** — reports land in `docs/reports/` as phases complete.

---

## Status

| Folder | Status |
|--------|--------|
| `prd/` | ⬜ Awaiting PRD |
| `plans/` | ⬜ Pending (requires PRD) |
| `reports/` | ⬜ Pending (generated during execution) |

> Run `/start` to begin.
