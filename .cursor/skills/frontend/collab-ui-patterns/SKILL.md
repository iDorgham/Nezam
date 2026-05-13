---
name: collab-ui-patterns
description: UI/UX patterns and frontend logic for real-time collaboration.
version: 1.0.0
updated: 2026-05-13
changelog:
  - 2026-05-13: Initial version
---

# Collaboration UI Patterns

## Purpose
Provides reusable frontend components and state-sync logic for collaborative features like comments, mentions, and activity feeds.

## Inputs
- `docs/DESIGN.md` (Interaction patterns).
- WebSocket/SSE endpoints for real-time updates.

## Step-by-Step Workflow
1. Implement the comment/activity feed UI with RTL support.
2. Integrate the mention-autocomplete logic (e.g., triggered by '@').
3. Connect the UI to real-time sync streams for live updates.
4. Add optimistic UI updates for comment submission and likes.

## Examples
```jsx
// Mention Autocomplete Trigger
const handleKeyDown = (e) => {
  if (e.key === '@') {
    showMentionDropdown(true);
  }
};
```

## Validation & Metrics
- Latency: Optimistic UI updates < 50ms.
- Accessibility: Mention dropdown must be screen-reader accessible.
- RTL Parity: Comment bubble alignment correctly mirrors in RTL.

## Output Format
- React/Vue Components
- State Sync Hooks

## Integration Hooks
- `/DEVELOP` for frontend feature implementation.
- Design System token check.
