# Architecture — NEZAM (Planning mirror)

| Field | Value |
|---|---|
| Document | ARCHITECTURE.md (planning copy) |
| Canonical source | `.nezam/core/architecture/ARCHITECTURE.md` |
| Status | Amended (v3.2) |
| Last updated | 2026-06-05 |

> **Single source of truth:** `.nezam/core/architecture/ARCHITECTURE.md`  
> This file exists under `.nezam/core/plans/04-arch/` for SDD pipeline traceability. On conflict, follow the canonical file.

---

## Summary

NEZAM is a **workspace governance layer**, not a hosted product:

| Layer | Technology | Location |
|---|---|---|
| Governance | Markdown + YAML + Node scripts | `.cursor/`, `.nezam/core/` |
| Design Hub | Next.js 15, React 19, Tailwind | `.nezam/design-hub/` |
| State | YAML | `.cursor/state/` |
| Session | JSON | `.session/`, `wireframes_locked.json` |
| CI | GitHub Actions | `.github/workflows/` |

## Data entities (governance)

| Entity | Storage | Notes |
|---|---|---|
| PRD | `.nezam/core/prd/PRD.md` | Intake mirror in `.nezam/core/plans/00-define/` |
| Plans | `.nezam/core/plans/` | Phase folders + INDEX |
| Feature specs | `.nezam/core/plans/00-define/specs/F-*.md` | AC-IDs trace to develop |
| Design contract | `DESIGN.md` | Root; token export target |
| Wireframe lock | `wireframes_locked.json` | Root or `.session/` |
| Agent bus | `.cursor/state/agent-bus.yaml` | Handoffs between agents |
| Gate matrix | `.nezam/core/gates/GITHUB_GATE_MATRIX.json` | 13 gates |

## Integrations

| Integration | Role |
|---|---|
| Git / GitHub | Source of truth, CI, releases |
| pnpm | Workspaces, `ai:sync`, `ai:check` |
| Cursor (+ mirrors) | Primary agent runtime |
| Optional: Neon/Vercel | Only for user apps built *with* NEZAM, not core kit |

## Security

- No production secrets in repo; `.env.example` only
- `security: true` tasks stay on primary reasoning lanes (never free CLI)
- Pre-commit: `pnpm ai:sync` when `.cursor/` changes

## ADRs

Architecture decisions: `.nezam/core/architecture/decisions/`

---

*For diagrams, stack tables, and Design Hub module map, read the canonical architecture document.*
