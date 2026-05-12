---
name: visual-canvas-engine
description: Orchestrates high-performance infinite canvas systems, viewport transforms, and spatial indexing.
---

# Visual Canvas Engine

## Purpose
Provides a deterministic workflow for designing and implementing infinite canvas systems with optimized rendering and viewport management.

## Inputs
- `docs/specs/canvas-requirements.md`
- Performance budgets (FPS, memory).
- Coordinate system requirements.

## Step-by-Step Workflow
1. **Viewport Setup:** Define the visible window and coordinate transform logic (Pan/Zoom).
2. **Spatial Indexing:** Implement a Quadtree or R-Tree to manage element visibility.
3. **Grid Orchestration:** Design an infinite grid system with dynamic subdivisions based on zoom level.
4. **Rendering Optimization:** Implement culling and virtualization to only render visible elements.
5. **Coordinate Translation:** Define the mapping between screen coordinates and world coordinates.

## Examples
```typescript
// Example viewport transform calculation
const screenToWorld = (screenX, screenY, viewport) => {
  return {
    x: (screenX - viewport.offset.x) / viewport.zoom,
    y: (screenY - viewport.offset.y) / viewport.zoom
  };
};
```

## Validation & Metrics
- FPS: > 60fps during continuous pan/zoom.
- Memory: < 5MB for the spatial index of 10,000 nodes.
- Latency: Transform calculation < 1ms.

## Output Format
- `spatial-index-config.json`
- `viewport-transform-logic.ts`
- `infinite-grid-specs.md`

## Integration Hooks
- `/PLAN design` for canvas-based apps.
- `visual-canvas-architect` persona activation.
