---
name: "nezam-design-token-architecture"
description: High-level governance for token hierarchy, naming conventions, and multi-platform synchronization (web, mobile, email).
version: 1.0.0
updated: 2026-05-12
changelog:
  - 1.0.0: Initial release as part of the Design Skill Gap Fill.
---

# Design Token Architecture Skill

## Purpose

Define the structural integrity and naming governance for the design system's token library. This skill ensures tokens are scalable, predictable, and platform-agnostic, enabling consistent branding across different tech stacks and devices.

## Procedure

### 1. Hierarchy Definition
- **Primitive Tokens (Base)**: Raw values (e.g., `blue-500`, `spacing-16`). No meaning, just values.
- **Semantic Tokens (Alias)**: Meaningful names (e.g., `action-primary-bg`, `surface-default-padding`).
- **Component Tokens (Override)**: Specific to a UI component (e.g., `button-primary-shadow`, `input-border-focus`).

### 2. Naming Governance
- Follow the `[Category]-[Property]-[Concept]-[Variant]-[State]` pattern.
- Example: `color-background-primary-hover`.
- Enforce lowercase and hyphenated strings.

### 3. Multi-Platform Strategy
- Map CSS Variables for Web.
- Map XML/JSON for Android/iOS.
- Map inline styles/table-constants for Email.
- Ensure all platforms sync from a single source of truth (e.g., `tokens.json`).

## Output Artifacts

1. `docs/plans/design/TOKEN_NAMING_CONVENTION.md`: The rulebook for naming new tokens.
2. `docs/plans/design/PLATFORM_MAPPING.yaml`: How tokens translate across different environments.
3. Updated root `DESIGN.md`: Reflecting the architectural tiers.

## Validation Checklist

- [ ] Every Semantic token maps to a Primitive token.
- [ ] No hardcoded values exist in the Component library.
- [ ] Naming follows the prescribed BEM-like token structure.
- [ ] Platform mapping covers all targets in the PRD.
