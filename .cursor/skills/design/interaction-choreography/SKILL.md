---
name: interaction-choreography
description: Orchestrating motion, transitions, and micro-interactions to create a cohesive and premium user experience.
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release as part of the Design Skill Gap Fill.
---

# Interaction Choreography Skill

## Purpose

Define how elements move and interact over time. This skill focuses on the "feeling" of the interface, ensuring transitions are purposeful, performant, and delightful without being distracting.

## Procedure

### 1. Motion Principles
- Define the "Brand Physics" (e.g., snappy/energetic vs smooth/liquid).
- Establish duration tokens (fast: 150ms, medium: 300ms, slow: 500ms).
- Standardize easing curves (standard, decelerate, accelerate).

### 2. Micro-interactions
- Define state transitions for buttons (hover, active, loading).
- Orchestrate list entry/exit animations.
- Define feedback loops (success checkmarks, error shakes).

### 3. Page Transitions
- Define how routes change (fade, slide, shared element transition).
- Ensure loading states (shimmer/skeleton) are part of the motion sequence.
- Respect `prefers-reduced-motion` settings.

## Output Artifacts

1. `docs/plans/design/MOTION_CONTRACT.md`: Duration, easing, and transition rules.
2. `docs/plans/design/INTERACTION_STATES.md`: Visual and motion specs for all interactive components.
3. Updated root `DESIGN.md`: Motion primitives section.

## Validation Checklist

- [ ] All animations use hardware-accelerated properties (`transform`, `opacity`).
- [ ] No layout shifts (CLS) caused by animations.
- [ ] Reduced-motion fallback is implemented for all critical motion.
- [ ] Motion durations align with the defined tokens.
