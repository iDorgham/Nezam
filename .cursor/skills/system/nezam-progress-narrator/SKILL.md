---
name: "nezam-progress-narrator"
description: Human-readable progress summaries for /guide and /check from NEZAM state files; adapts to solo vs team tone.
version: 1.0.0
updated: 2026-05-11
changelog: []
---
# Progress Narrator Skill

## Purpose

Generate human-readable progress summaries for `/guide` and `/check` commands.
Reads state files and translates them into encouraging, clear, actionable narratives.
Adapts language based on `user_mode` (`solo` / `team`) from `.cursor/state/onboarding.yaml`.

## Inputs

- `.cursor/state/onboarding.yaml`
- `.cursor/state/plan_progress.yaml`
- `.cursor/state/develop_phases.yaml`
- `.nezam/workspace/prd/PRD.md` (for product name and type; respect `project.prd` in paths yaml)

## Output Rules

### Solo / Friendly mode

- Use plain English, avoid technical terms
- When things are blocked: "Before you can [goal], you need to [simple action]"
- Celebrate milestones: "🎉 Planning is complete — time to start building!"
- When a phase unlocks: explain what they're about to work on in product terms

### Team / Structured mode

- Use precise terminology: gate, phase, artifact, SPEC.md, hardlock
- Show agent assignments alongside tasks
- Show gate IDs (G0→G1, G1→G2 etc.) in phase transitions
- Swarm status footer on every substantive reply

## Milestone Messages

### PRD Locked

Solo: "Your product brief is saved. Now let's pick a design direction."  
Team: "PRD locked at .nezam/workspace/prd/PRD.md. Gate G0 prerequisite satisfied. Proceed to design selection."

### Design Locked

Solo: "Design is set. Ready to plan your [product name]."  
Team: "DESIGN.md locked. Gate G0 complete. `/plan` is now available."

### Planning Complete

Solo: "🎉 Your full plan is ready. Time to start building Phase 1: [Foundation]."  
Team: "Planning complete. Gate G1 satisfied. Phase 1 (Foundation) unlocked. `/develop start` available."

### Phase N Unlocked

Solo: "Phase [N] complete ✅ Next: [Phase N+1 name in plain terms — what you'll be building]"  
Team: "Phase [N] testing passed. Gate G[N] satisfied. Phase [N+1] ([name]) unlocked."

### Ship Gate Open

Solo: "🚀 Everything passes. You're ready to launch."  
Team: "Gate G5 satisfied. All harden audits pass. `/deploy` available."
