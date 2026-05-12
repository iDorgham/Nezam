# Visual Builder Rendering Strategy Specification

## 1. Hybrid Architecture
The builder uses a "Thin Client, Smart Server" model.

- **Server (RSC):** Fetches the graph structure, performs heavy validation, and generates the initial layout.
- **Client (React):** Handles interactive states, real-time panning/zooming, and dragging.

## 2. Layering System
To optimize performance, the canvas is split into multiple DOM/Canvas layers:

| Layer | Technology | Purpose |
|---|---|---|
| Background | CSS Pattern | Grid/Dots (CSS-only for zero JS cost) |
| Edges (Wires) | SVG / Canvas | Dynamic pathing between nodes |
| Nodes | DOM (React) | Interactive elements with rich UI |
| Interaction Overlay | SVG / DOM | Marquee selection, temp wires, ghost nodes |
| UI Panels | DOM | Sidebars, Toolbars, Property Inspectors |

## 3. Viewport Virtualization
The `visual-canvas-architect` manages a "Visible Buffer".

- **Culling:** Nodes outside the viewport + 200px buffer are removed from the DOM.
- **LOD (Level of Detail):** Nodes are rendered as simplified "proxy" boxes when zooming out beyond 0.5x.

## 4. State Synchronization
- **Optimistic Updates:** Drag operations are performed instantly on the client.
- **Debounced Persistence:** Node positions are synced to the backend every 500ms or on "Drag End".
- **CRDT (Optional):** Future-proof for multi-player collaboration.
