# Visual Builder Core Architecture Specification

## 1. Executive Summary
The Visual Builder is a platform-agnostic, infinite-canvas system designed to orchestrate complex node-based graphs, visual flows, and interactive layouts. It leverages modern frontend rendering strategies (React Server Components, Vite) and a performant graph-logic engine to ensure sub-100ms interaction latency even with thousands of nodes.

## 2. System Components

### 2.1 Visual Canvas Engine (Swarm-17)
- **Deterministic Viewport Orchestration:** Handles zooming, panning, and spatial indexing.
- **Infinite Grid System:** A coordinate-independent grid for node placement.
- **Selection & Interaction Layer:** Manages click, drag, and multi-select behaviors.

### 2.2 Graph Logic Engine (Swarm-17 + Swarm-20)
- **Node-Link Integrity:** Validates connections based on port compatibility and cycle detection.
- **Serialization:** Compact JSON representation of the graph state.
- **Persistence:** Real-time sync with Neon database via RLS-protected Data API.

### 2.3 Rendering Strategy (Swarm-18)
- **Hybrid Rendering:** RSC for static node data, client-side rendering for interaction states.
- **Virtualization:** Only render nodes within or near the active viewport.
- **Layering:** Separate layers for canvas, nodes, connections, and UI overlays.

## 3. Technology Stack
- **Framework:** Next.js 15 (App Router).
- **Rendering:** React Server Components + Framer Motion for canvas interactions.
- **Logic:** Custom graph-theory implementation (deterministic).
- **Database:** Neon (PostgreSQL) with pgvector for spatial node indexing.
- **Styling:** CSS Variables + Design Tokens (NEZAM Minimal v2).

## 4. Governance & Gates
- **Design Gate:** Every component must have a `DESIGN.md` contract.
- **Performance Gate:** Core interactions must stay below 16ms (60fps).
- **Compliance Gate:** All data operations must use RLS and audit logging.
