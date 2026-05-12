---
name: kanban-pipeline-ui
description: UI/UX patterns for drag-and-drop sales pipelines and Kanban boards.
---

# Kanban Pipeline UI

## Purpose
Provides a highly interactive drag-and-drop interface for managing deals across different stages of a sales pipeline.

## Inputs
- `docs/DESIGN.md` (Kanban/Board design).
- Pipeline stage definitions and deal metadata.

## Step-by-Step Workflow
1. Implement the Kanban board grid with column-based stages.
2. Integrate a drag-and-drop library (e.g., dnd-kit or react-beautiful-dnd).
3. Handle stage-transition logic and update the backend on drop.
4. Implement RTL mirroring for columns and card text.

## Examples
```jsx
// Drag End Handler
const onDragEnd = (result) => {
  const { source, destination, draggableId } = result;
  if (destination.droppableId !== source.droppableId) {
    updateDealStage(draggableId, destination.droppableId);
  }
};
```

## Validation & Metrics
- Performance: Drag-and-drop interactions at 60fps.
- RTL Parity: Column order and scroll direction correctly reversed in RTL.

## Output Format
- React/Vue Kanban Components
- Board State Management Logic

## Integration Hooks
- `/DEVELOP` for CRM frontend implementation.
- Design System interaction gates.
