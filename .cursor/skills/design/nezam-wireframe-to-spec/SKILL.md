---
name: "nezam-wireframe-to-spec-converter"
description: Convert low-fidelity wireframes into implementation-ready component specifications.
version: 1.0.0
updated: 2026-05-08
changelog: []
---
> [!CAUTION]
> **DEPRECATED**: This skill has been merged into `wireframe-pipeline`.
> Please use `skills/design/wireframe-pipeline/SKILL.md` instead.


# Wireframe to Spec Converter

Use during `/PLAN design` when layouts must be translated into deterministic build specs.

## Objective

Transform wireframes or textual page drafts into explicit component contracts developers can implement without ambiguity.

## Output artifacts

Create or update:
- `docs/plans/04-design/WIREFRAMES.md`
- `docs/workspace/templates/ui-ux/COMPONENT_BLUEPRINT.md` (for reusable API patterns)

For each screen/section include:

```yaml
screen_id: nezam-"home-hero"
layout_intent: "what this section must achieve"
components:
  - name: "Hero"
    variants: ["default", "compact"]
    states: ["default", "loading", "error", "empty"]
    props_contract:
      - "title"
      - "subtitle"
      - "cta"
responsive_rules:
  - "mobile/tablet/desktop behavior"
  - "container-query behavior and media-query fallback"
interaction_notes:
  - "hover/focus/click expectations"
accessibility_notes:
  - "landmarks, labels, keyboard behavior"
direction_notes:
  - "rtl/ltr behavior, mirrored transforms, directional icon handling"
```

## Core rules

- Keep contracts variant-driven and typed.
- Define state handling explicitly (loading/empty/error/success).
- Link every major section to intended user-flow step.
- Avoid visual vagueness that cannot be implemented deterministically.
- Capture direction-aware behaviors using logical properties.

## Dependencies

- `user-flow-mapper`
- `design-md`

## Input Sources

### Mode A — Figma MCP (preferred when Figma is connected)
When `mcp figma` is active in workspace settings:
- Use Figma MCP to read frame data from the provided Figma URL.
- Extract: frame name, child components, layout constraints, text content, auto-layout rules.
- Map Figma component names to NEZAM component vocabulary from `DESIGN.md`.
- Auto-generate the `WIREFRAMES.md` YAML blocks from Figma frame data.
Command: `/Settings mcp on figma` to activate.

### Mode B — Excalidraw / Penpot JSON import
When user uploads or pastes an Excalidraw `.excalidraw` JSON or Penpot export:
- Parse element IDs, labels, groupings, and position relationships.
- Infer layout intent from element spatial arrangement.
- Generate `WIREFRAMES.md` YAML blocks from parsed structure.
- Flag ambiguous elements for user confirmation before generating spec.

### Mode C — Text description (fallback, current behavior)
When no tool is connected:
- Ask user to describe each screen section by section.
- Use structured interview: "What is the top-level layout goal of this section?"
- Generate `WIREFRAMES.md` YAML blocks from interview answers.
- Flag output as: `source: text-interview` so reviewers know it needs visual validation.

