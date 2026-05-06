# Project Prompt — COIA Workspace Kit

## North-star description (paste into external AI + Cursor)

> COIA is a **Cursor orchestration workspace**: specification-driven development with a root `plan/` traceability spine, governed `.cursor` skills and agents, and CI checks that block planning until `PRD.md` and this prompt exist. Differentiation is **discipline by default**—onboarding gates, design/token contracts before UI work, and a test matrix before automated tests—rather than a single framework demo app.

## Voice & guardrails

- Tone: Direct, checklist-oriented, traceable to file paths and phase gates.
- Words to avoid: Vague “best practices” without repo anchors; inventing files or APIs not in the tree.
- Compliance notes: Do not commit secrets; use workspace docs for decisions (`docs/context/MEMORY.md`, phase logs).

## Stack & repo facts

- Frameworks: Toolkit repo—root `package.json` supports semantic-release tooling; **add** app frameworks under future packages when product scope expands.
- Hosting: Documented patterns (e.g. Vercel) via skills; no default production deploy in this kit alone.
- Integrations: GitHub Actions ([`.github/workflows/`](../../.github/workflows/)); optional MCP and external AI handoff docs under [`docs/external-ai/`](../external-ai/).

## Decision rules

- When uncertain, prefer: PRD + committed specs + `plan/INDEX.md` over chat memory.
- Performance budget: When an app exists—LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms on critical routes (per design gates).
- Accessibility target: WCAG 2.2 AA for user-facing surfaces.

## Standing instructions for coding agents

1. Read `DESIGN.md` before UI code.
2. Track spec IDs in branches/commits per [`plan/commit-conventions.md`](../../plan/commit-conventions.md).
3. Update `docs/reports/PROGRESS_REPORT.latest.md` after merges when shipping slices.

### External companion upload checklist

Attach latest PRD excerpt, SEO table, DESIGN summary, PROGRESS_REPORT weekly.

## Site archetype (planning gate)

- **Documentation-first workspace** with optional multi-page marketing or product shell later; scroll paradigm **vertical**; IA driven by `plan/` and future `SEO_RESEARCH.md` when authored.
