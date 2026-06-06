# NEZAM Developer Onboarding Guide

Welcome to the NEZAM engineering team! This guide will walk you through setting up your local environment, understanding our Specification-Driven Development (SDD) process, and working with our quality control and automation tools.

---

## 🏁 1. Quick Start

### Prerequisites
- **Node.js**: `v20.x` or higher
- **pnpm**: `v9.x` or higher
- **Git**: installed and configured

### Installation
1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/iDorgham/Nezam.git
   cd Nezam
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up Husky git hooks:
   ```bash
   pnpm hooks:install
   ```

---

## 📐 2. The SDD Pipeline & State Flow

NEZAM enforces **Specification-Driven Development (SDD)**. You must not jump straight to writing code without completing the planning and design gates.

```
┌────────────────┐      ┌─────────────────┐      ┌──────────────┐      ┌────────────┐
│ 1. Onboarding  │ ───> │   2. Planning   │ ───> │  3. Design   │ ───> │ 4. Develop │
│ (/START state) │      │  (/PLAN specs)  │      │ (/DESIGN lock)      │ (/DEVELOP) │
└────────────────┘      └─────────────────┘      └──────────────┘      └────────────┘
```

Every development session follows these phase constraints:
1. **Kickoff**: Initiate a phase using `/develop start <phase_name>`. This marks the phase as `in_progress` in `.cursor/state/develop_phases.yaml`.
2. **Implementation**: Implement tasks slice-by-slice using `/develop ui` (frontend) and `/develop api` (backend).
3. **Review**: Run `/develop review` to execute quality checks (accessibility, token compliance, specifications).
4. **Completion**: Lock the phase as `complete` by running `/develop complete <phase_name>`.

---

## 🔒 3. Commit Guidelines & Husky hooks

To maintain repository hygiene and avoid architectural drift across multiple AI clients, we utilize strict pre-commit checks managed by Husky.

### Pre-commit Verification Flow
When you run `git commit`, our Husky hooks automatically run the following checks:
1. **`pnpm ai:sync`**: Automatically synchronizes configuration and instruction contracts from `.cursor/` to the mirror folders (`.agents/`, `.claude/`, `.gemini/`, etc.).
2. **`pnpm ai:check`**: Verifies that no sync drift exists between canonical settings and mirrors.
3. **Attribution Tags**: Ensure your commit messages reference task IDs (e.g., `feat(ci): T-V32-2-005: message`) to maintain requirements traceability from PRD to code.

> [!WARNING]
> **Never bypass Husky hooks.** If a hook fails, run `pnpm check:all` locally to debug and fix the specific gate errors.

---

## 🚀 4. Quality Control & Gates

All code merged into the `Master` branch must satisfy the following automated gating criteria:

| Gate ID | Check Area | Checker Script | Threshold / Criteria |
|---|---|---|---|
| **G-01** | Onboarding | `pnpm check:onboarding` | PRD locked, design profile configured. |
| **G-WF-02** | Wireframe Schema | `check-wireframe-schema-v2.js` | Schema must be version `2.0.0` or higher. |
| **DG-01** | Design Tokens | `pnpm check:tokens` | No hardcoded RGB/HEX values or raw px heights/sizes. |
| **A11Y** | Accessibility | `pnpm check:gate-5-a11y` | Compliance with WCAG 2.2 AA standard. |

---

## 💬 5. Useful Commands

| Command | Action |
|---|---|
| `/start all` | Onboard workspace and boot environment. |
| `/guide` | Display project pipeline status and next recommended steps. |
| `/develop start <phase>` | Kick off a new development phase. |
| `pnpm check:all` | Run all token, spec, sync, and state verification checks locally. |
| `pnpm design-hub` | Start the local visual Design Hub server. |
