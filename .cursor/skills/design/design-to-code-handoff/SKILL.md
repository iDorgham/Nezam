---
name: design-to-code-handoff
description: Streamlining the transition from UI design to production code through automated spec generation and developer checklists.
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release as part of the Design Skill Gap Fill.
---

# Design to Code Handoff Skill

## Purpose

Minimize the "Lost in Translation" gap between design and development. This skill ensures that every design decision is documented in a format that developers can implement with 100% fidelity and zero guesswork.

## Procedure

### 1. Asset Preparation
- Ensure all icons/images are exported in the correct formats (SVG, WebP).
- Verify all fonts are licensed and paths are provided.
- Check that all design assets follow the token naming convention.

### 2. Specification Generation
- Generate component-level specs (spacing, typography, colors).
- Document responsive breakpoints and behavior (grid vs flex).
- Detail all edge states (empty, error, loading).

### 3. Handoff Meeting / Review
- Walk through the `DESIGN.md` with the engineering lead.
- Identify potential technical constraints or performance risks.
- Finalize the `COMPONENT_INVENTORY.md`.

## Output Artifacts

1. `docs/plans/design/HANDOFF_CHECKLIST.md`: Verification list for developers.
2. `docs/plans/design/COMPONENT_INVENTORY.md`: All UI pieces with implementation notes.
3. Root `DESIGN.md`: Finalized and signed-off version.

## Validation Checklist

- [ ] All components in the wireframes exist in the inventory.
- [ ] Responsive behavior is explicitly defined for all screens.
- [ ] Developers have access to all required tokens and assets.
- [ ] No ambiguous visual styles remain.
