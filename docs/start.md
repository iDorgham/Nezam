# 🚀 Getting Started with NEZAM

Welcome to **NEZAM**, the operating system for AI-native software development. This guide will walk you through the onboarding process, from your initial idea to full execution using our Specification-Driven Development (SDD) pipeline.

---

## 🛠️ Onboarding Process

### 1. Initialize the Workspace
Run the `/start` command in your chat client. This will:
- Verify that your environment is ready.

### 2. Define Your Product (PRD)
Drop your `PRD.md` file into `docs/start/` to begin. This file will be the execution north star for your project.

### 3. Choose Your Design System
NEZAM requires a design contract at the repository root. Once your PRD is defined:
- Run `pnpm run design:apply -- <brand>` to apply a brand design from `.nezam/design/<brand>/design.md` to the root `DESIGN.md`.

### 4. Scaffold Folders
Copy the required folder templates (`plan/` and `reports/`) from `.nezam/templates/folders` to your `docs/` directory.

### 5. Generate the Execution Plan
Once your PRD is approved and your design system is selected, run the `/plan` command. This will scaffold your execution roadmap under `docs/plan/`:
- It creates folders for all 7 phases (00-Define to 06-Ship).
- Generates `INDEX.md` and `MASTER_TASKS.md` in the root of `docs/plan/`.

---

## 📊 The SDD Pipeline (Specification-Driven Development)

NEZAM enforces a strict, gate-driven pipeline to ensure quality and prevent hallucination. You will progress through these phases:

1. **Phase 00: Define** — Lock in scope and architecture.
2. **Phase 01: Research** — SEO, competitor analysis, and feasibility.
3. **Phase 02: Design** — Tokens, wireframes, and components.
4. **Phase 03: Content** — Strategy, copy, and compliance.
5. **Phase 04: Build** — Backend, frontend, and features.
6. **Phase 05: Harden** — Security, performance, and accessibility.
7. **Phase 06: Ship** — Staging and production deployment.

Each phase has **Gates** defined in `.nezam/gates/GITHUB_GATE_MATRIX.json`. You cannot proceed to the next phase until the current phase's gates are satisfied and signed off.

---

## 💻 Developing Your Idea

Once planning is complete and you are in the **Build** phase:
- Use `/develop` to start building features.
- Use `/scan` to check for quality, security, and performance.
- Use `/fix` to automatically address issues found during scans.

---

## 🤖 AI Swarm & Skills
You are assisted by a swarm of specialized agents and specific skills located in `.cursor/skills/`.
- Always respect the **Governance First** rule.
- Keep your changes traceable and follow the commit conventions.

---

> Ready to build? Type `/start` to begin your journey.
