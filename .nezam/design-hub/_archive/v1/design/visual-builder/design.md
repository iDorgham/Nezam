# Visual Builder Design System (v1)

> Profile: Professional, Functional, Tech-First
> Specialized tokens for canvas-based interfaces and node-graph orchestration.

## 1. Canvas Tokens
- **Canvas-BG:** `#F4F4F1` (Minimal Surface)
- **Grid-Dot:** `#D1D1CB`
- **Grid-Line:** `#E5E5E0`
- **Selection-Area:** `rgba(12, 12, 9, 0.05)` (Minimal Primary @ 5%)
- **Selection-Border:** `#0C0C09` (Minimal Primary)

## 2. Node Tokens
- **Node-Base-BG:** `#FFFFFF`
- **Node-Header-BG:** `#F9F9F7`
- **Node-Border:** `#0C0C09` (Minimal Primary)
- **Node-Radius:** `4px`
- **Node-Shadow:** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`

## 3. Port & Edge Tokens
- **Port-Default:** `#0C0C09`
- **Port-Hover:** `#312C85` (Minimal Secondary)
- **Edge-Stroke:** `#0C0C09` (2px Width)
- **Edge-Selected:** `#312C85` (3px Width)
- **Edge-Animation:** `dash-offset` (Purposeful movement)

## 4. Hierarchy & Layout
- **Sidebar-Width:** `280px`
- **Toolbar-Height:** `56px`
- **Z-Indices:**
  - Canvas: 0
  - Edges: 10
  - Nodes: 20
  - UI-Panels: 100
  - Overlays/Modals: 1000

## 5. Interaction States
- **Dragging:** Opacity 80%, Z-Index +100
- **Connecting:** Highlight compatible ports with `#16A34A` (Minimal Success)
- **Error-State:** Border `#DC2626` (Minimal Danger)
