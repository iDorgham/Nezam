# NEZAM — Product Requirements Document

> **Status:** Living document — updated as the product evolves.
> **Version:** 2.0.0
> **Last updated:** 2026-05-18

---

## 0. Executive Summary

NEZAM is a **production-grade AI workspace kit** that transforms any AI coding tool into a structured, governed development environment. It solves the core problem of AI-generated code being inconsistent, ungoverned, and disconnected from product intent.

**The product:** A workspace governance layer that sits on top of any AI tool (Cursor, Claude, Kiro, Windsurf, VS Code, Copilot, etc.) and enforces Specification-Driven Development (SDD) — a pipeline that ensures every line of code traces back to a locked spec, a design token, and a measurable acceptance criterion.

**Primary market:** MENA-first product teams building SaaS, web apps, and mobile applications — with Egyptian Arabic (Masri) as the primary content depth path.

---

## 1. Problem Statement

### The AI Coding Problem

AI coding tools are powerful but ungoverned. Teams using them face:

1. **Inconsistent output** — the same prompt produces different results across sessions and tools
2. **No pipeline enforcement** — developers skip planning, design, and architecture phases
3. **Design-to-code gap** — AI generates code that ignores the design system
4. **Multi-tool chaos** — switching between Cursor, Claude, Copilot, and Kiro loses context
5. **MENA blind spot** — no AI workspace has first-class Arabic/RTL/MENA support

### The NEZAM Solution

NEZAM is the governance layer that fixes all five problems:

1. **SDD hardlocks** enforce pipeline order — you cannot code before planning is complete
2. **13 specialist swarms** with 155+ agents cover every domain from SEO to security
3. **Token-first design gates** block development until design contracts are locked
4. **Single canonical source** (`.cursor/`) syncs to 15+ tools automatically
5. **Egyptian Arabic (Masri) default** with full RTL support and MENA payment routing

---

## 2. Target Users

### Persona 1: Solo Founder (Primary)

- **Who:** Technical founder building a MENA-focused SaaS or web app
- **Tools:** Cursor or VS Code + Copilot
- **Pain:** Spends 60% of time on boilerplate, governance, and context-switching
- **Job to be done:** Ship a production-ready product in weeks, not months
- **NEZAM value:** `/start all` → full onboarding in one command; SDD pipeline prevents costly rework

### Persona 2: Small Team (2–5 developers)

- **Who:** Early-stage startup with a mixed AI tool stack
- **Tools:** Mix of Cursor, Claude, Kiro, Windsurf
- **Pain:** Different developers use different tools, producing inconsistent code
- **Job to be done:** Maintain code quality and design consistency across the team
- **NEZAM value:** Single `.cursor/` source syncs to all tools; every developer follows the same pipeline

### Persona 3: MENA Product Agency

- **Who:** Agency building Arabic-first products for Egyptian, Gulf, or Levant markets
- **Tools:** Cursor + Claude + Antigravity
- **Pain:** No AI tool understands Egyptian Arabic, RTL layouts, or MENA payment gateways
- **Job to be done:** Deliver culturally accurate, technically sound products for MENA clients
- **NEZAM value:** Masri content specialist, RTL-first design system, MENA payment routing

---

## 3. Core Features

### F-001: Multi-Tool Sync Engine (P0)

**What:** Single `.cursor/` canonical source that syncs to 15+ AI tools via `pnpm ai:sync`.

**Supported tools:**
- Tier 1 (full parity): Cursor, Claude Code, Codex, Copilot, Antigravity
- Tier 2 (best-effort): Kiro, Windsurf, VS Code, Gemini CLI, Qwen CLI, Kilo Code, OpenCode, Roo Code

**Acceptance criteria:**
- `pnpm ai:sync` completes in < 30 seconds for all tools
- `pnpm ai:check` returns zero drift after sync
- CI fails on drift (`.github/workflows/ci.yml` job `ai-sync-drift`)

### F-002: SDD Pipeline (P0)

**What:** 11-phase Specification-Driven Development pipeline with hardlock gates.

**Phases:** IDEA → VALIDATE → RESEARCH → IA → CONTENT → ARCHITECTURE → DESIGN → WIREFRAME → SCAFFOLD → BUILD → HARDEN → SHIP

**Acceptance criteria:**
- `/develop` is blocked until all 6 planning phases are complete
- Each phase gate validates required artifacts exist and are non-template
- Gate failures produce actionable error messages with exact fix commands

### F-003: Design System (P0)

**What:** 150+ brand profiles, token-first CSS, 7 design gates, RTL/Arabic support.

**Acceptance criteria:**
- `pnpm run design:apply -- <brand>` copies profile to root `DESIGN.md` in < 1 second
- Design gates block `/develop` until all 7 gates pass
- Zero hardcoded hex/px/rem values in component styles (enforced by `pnpm check:tokens`)

### F-004: Visual Builder & Infinite Canvas (P1)

**What:** Canvas-based visual builder with node-graph logic, drag-and-drop, and state management.

**Acceptance criteria:**
- 60fps during pan/zoom with 5,000+ nodes
- Undo/redo stack with zero data loss
- RTL canvas direction support for Arabic-first products

### F-005: MENA/Arabic Support (P0)

**What:** Egyptian Arabic (Masri) as primary content depth, full RTL layout, MENA payment routing.

**Acceptance criteria:**
- `masri-content-specialist` agent produces copy that scores ≥ 17/20 on Masri rubric
- All components validated in RTL mode before merge
- MENA payment routing covers Fawry, Paymob, Tabby, STC Pay, Mada

### F-006: Wireframe Server (P1)

**What:** Interactive local wireframe server (localhost:4000) for human-in-the-loop design approval.

**Acceptance criteria:**
- Agent writes `project_context.json` → user approves in browser → server exports `wireframes_locked.json`
- `/scaffold` is blocked until `wireframes_locked.json` exists
- All P0 pages have `layout_approved: true` before export

---

## 4. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Sync speed | `pnpm ai:sync` < 30s for all tools |
| LCP | < 2.5s on all generated pages |
| CLS | < 0.1 on all generated pages |
| INP | < 200ms on all interactive surfaces |
| WCAG | 2.2 AA on all UI components |
| Canvas FPS | 60fps with 5,000+ nodes |
| Agent load time | Lazy-load; only active swarm agents at session start |
| Drift detection | `pnpm ai:check` < 10s |

---

## 5. Out of Scope (v2)

- Real-time collaborative editing (planned for v3)
- Native mobile app for NEZAM itself
- Paid cloud sync service
- Custom LLM fine-tuning on workspace data

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tool coverage | 15+ tools supported | `pnpm ai:status` |
| Sync reliability | 0 drift failures in CI | GitHub Actions |
| Design gate pass rate | 100% before `/develop` | `/check gates` |
| MENA content quality | ≥ 17/20 Masri rubric | `evaluation/rubric_masri.md` |
| Canvas performance | 60fps @ 5k nodes | DevTools FPS |
| Onboarding time | < 5 min from clone to `/start all` | Manual timing |
