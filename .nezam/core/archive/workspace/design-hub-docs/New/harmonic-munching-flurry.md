# SPEC-DS-CANVAS-001 — Context-Aware Infinity Canvas: Implementation Plan

## Context
The user submitted SPEC-DS-CANVAS-001: a "Context-Aware Infinity Canvas" where bezier wires between page nodes act as **Context Bridges** — structured conduits that aggregate a source node's design tokens, UI state, and attached assets into a compressed LLM context payload, which then auto-generates content and UI for the target node. This is a Generative Spatial Graph, not a drawing board.

The design-server's `src/` scaffold exists but is empty. The existing `CanvasWorkspace.tsx` (pan/zoom/nodes/connections) and `lib/store/` are the operational foundation. The new store, spec, and architecture docs slot into the `src/` tree and the parent workspace `docs/` directory.

**Deliverables** (4 files created/updated):
1. `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md` — 10-section SDD
2. `.nezam/design-server/src/store/canvas-graph.store.ts` — Zustand + Zod graph store
3. `docs/architecture/GENERATIVE_PROPAGATION_FLOW.md` — Mermaid sequence diagram
4. `.cursor/state/plan_progress.yaml` + `HANDOFF_QUEUE.yaml` — state updates

All paths are relative to `/Users/Dorgham/Documents/Work/Devleopment/NEZAM/`.

---

## Deliverable 1 — `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md`

10-section SDD following the same schema as `docs/plans/00-define/01-product/PRD.md`.

### Section 0: Feature Identity
| Field | Value |
| Feature ID | SPEC-DS-CANVAS-001 |
| Feature Name | Context-Aware Infinity Canvas |
| Module | `.nezam/design-server` — Builder Canvas |
| Owner | visual-canvas-architect · prompt-engineer · lead-frontend-architect |
| Status | Architecture Draft |
| SDD Version | 1.0.0 |
| NEZAM Governance | Aligns with `design-server-gates.mdc`, `sdd-pipeline-v2.mdc` |

### Section 1: Problem Statement
- Current `CanvasWorkspace.tsx`: pan/zoom/drag nodes + bezier connections, but wires carry no data
- Target nodes are generated in isolation — no inherited design tokens, no context from source
- No structured flow: asset attachment → validation → context compression → generation
- RTL parity and WCAG AA are unchecked before generation (hardlock missing)

### Section 2: Personas
- **Lina (Product Architect)**: Maps multi-page app graphs, wants one click to generate a consistent Page B from Page A context
- **Rami (MENA Frontend Lead)**: Needs canvas to natively handle `dir="rtl"` coordinate mirroring; generation must maintain Arabic content contracts
- **Nour (AI Orchestrator)**: Needs structured `ContextPayload` schema to route to correct agents/skills; hates untyped prompt strings

### Section 3: Success Metrics
| Metric | Target |
|--------|--------|
| Wire-to-generation round trip | < 8s for 32k-token context window |
| Token overflow incidents | 0 (enforced by context-window-manager) |
| WCAG AA gate false negatives | 0 |
| RTL parity failures post-generation | 0 |
| 60fps canvas at 500 nodes | p95 frame time < 16.7ms |

### Section 4: Feature Registry
| ID | Feature | Priority |
|----|---------|---------|
| F-C01 | Generative Wire / ContextBridge | P0 |
| F-C02 | Attachment ingestion + Vision Gate | P0 |
| F-C03 | Context compression (< 32k tokens) | P0 |
| F-C04 | RTL coordinate mirroring | P0 |
| F-C05 | LOD rendering (occlusion culling) | P1 |
| F-C06 | Hardlock gates (RTL + WCAG) | P0 |
| F-C07 | AttachmentPayload schema | P0 |
| F-C08 | Floating canvas toolbar (zoom/grid/notes) | P1 |

### Section 5: Core User Flows
Three full flows with happy path + error branches:
1. **Wire → Generate**: User creates wire A→B, attaches Stripe screenshot + "replicate aesthetic" directive, clicks Generate → Vision Gate scan → context compress → LLM → B hydrated with Page A tokens
2. **Vision Gate Rejection**: User attaches image with embedded text → Vision Gate detects → "Scanning…" → "Non-compliant: text detected in artwork" banner → Generate blocked until replaced
3. **Hardlock RTL Gate**: User tries to generate B when A has no `dir="rtl"` equivalent components → gate blocks generation → canvas highlights failing nodes in warning color

### Section 6: Data Model
Full TypeScript interfaces for: `CanvasNode`, `CanvasWire`, `AttachmentPayload`, `ContextPayload`, `CanvasViewport`, `CanvasState`. These mirror the Zod schemas in the store.

Key fields:
- `CanvasWire.contextPayload?: ContextPayload` — populated when user triggers Generate
- `AttachmentPayload.visionStatus: 'pending'|'valid'|'rejected'` — Vision Gate result
- `AttachmentPayload.role: 'style-reference'|'content-source'|'prd-note'`
- `CanvasNode.hardlockFailures: HardlockFailure[]` — surfaced as node overlay badges

### Section 7: Technical Architecture
- **Rendering**: CSS `transform: matrix(a,b,c,d,tx,ty)` affine transform on canvas div (Phase 1, works for 500 nodes). WebGL path (Pixi.js or raw WebGL2) deferred to Phase 3.
- **Coordinate system**: `screenToCanvas(x,y) = (x - pan.x) / scale`, `canvasToScreen = x*scale + pan.x`. RTL mirroring: negate `pan.x` delta when `dir=rtl`.
- **LOD**: Nodes < 0.4 scale render as colored rectangle + title only (no port handles, no inner content). Nodes < 0.1 render as 8px dot. Threshold checked each frame via `scale` Zustand value.
- **Port anchor math**: Wire source port = `{x: node.x + nodeWidth, y: node.y + nodeHeight/2}` in canvas coords. Bezier control points: `cp1 = {x: src.x + 80, y: src.y}`, `cp2 = {x: tgt.x - 80, y: tgt.y}`. Recalculates on every `nodes` state change.
- **State sync**: Zustand store is the single source of truth. Canvas reads nodes/wires via selector subscriptions. Worker threads deferred to Phase 3 (delta compression).

### Section 8: State Machine & Hardlock Gates
Generation state machine: `idle → validating → compressing → generating → done | error`

**Vision Gate protocol**:
1. Asset uploaded → status = `'pending'`, spinner on thumbnail
2. POST `/api/ai/vision-gate` with base64 image → check for embedded text
3. `'valid'` → asset usable in context; `'rejected'` → Generate button disabled, red badge
4. Latency target: < 3s (haiku model)

**Hardlock gates** (checked before compressing context):
- RTL parity: source node must have `rtlCompliant: true` OR the wire type is non-navigational
- WCAG AA: source node `wcagCompliant: true` OR generation type is not UI-generating
- Failures render as orange border on source node card + disabled Generate button

### Section 9: NEZAM Agent Routing
| Operation | Agent | Skill | Escalation |
|-----------|-------|-------|------------|
| Context aggregation | `prompt-engineer` | `context-window-manager` | `conflict-resolution-agent` |
| Vision Gate scan | `visual-asset-manager` | `vercel-ai-sdk` → haiku | `lead-security-officer` |
| UI code generation | `frontend-lead` + `design-lead` | `react-architecture` | `project-architect` |
| RTL parity check | `rtl-specialist` | `design-tokens` | `arabic-content-master` |
| WCAG audit | `a11y-performance-auditor` | `a11y-automation` | `lead-qa-architect` |

### Section 10: Validation Checklist
- [ ] Wire carries typed `ContextPayload` — no untyped strings
- [ ] Vision Gate blocks generation on rejected assets
- [ ] Hardlock blocks generation on WCAG / RTL failure
- [ ] Context compressed to < 32k tokens before LLM call
- [ ] Generated node inherits source token namespace (no new colors invented)
- [ ] RTL: pan direction inverted when `dir="rtl"`; wire ports mirrored
- [ ] LOD renders at scale < 0.4 without crashing
- [ ] 60fps maintained at 50 nodes (≥ 500 node target deferred to Phase 3 WebGL)
- [ ] `canvas-graph.store.ts` Zod schemas validate all state mutations
- [ ] `plan_progress.yaml` updated; HANDOFF_QUEUE populated

---

## Deliverable 2 — `.nezam/design-server/src/store/canvas-graph.store.ts`

**Creates `src/store/` directory** (currently missing, `src/` scaffold exists).

### Zod Schemas

```ts
// AttachmentPayloadSchema
z.object({
  id: z.string().uuid(),
  parentId: z.string(),           // nodeId or wireId
  parentType: z.enum(['node', 'wire']),
  type: z.enum(['image', 'text', 'markdown', 'pdf']),
  url: z.string().url().optional(),
  content: z.string().optional(),
  altText: z.string().optional(),
  visionStatus: z.enum(['pending', 'valid', 'rejected']),
  role: z.enum(['style-reference', 'content-source', 'prd-note']),
  createdAt: z.string().datetime(),
})

// ContextPayloadSchema
z.object({
  sourceNodeId: z.string(),
  sourceNodeAST: z.record(z.unknown()),   // wireframe blocks JSON
  designTokens: z.record(z.string()),      // token key→value snapshot
  attachedAssets: z.array(AttachmentPayloadSchema),
  annotativeDirectives: z.array(z.string()),
  compressedAt: z.string().datetime().optional(),
  tokenCount: z.number().optional(),
})

// CanvasNodeSchema
z.object({
  id: z.string(),
  type: z.enum(['page', 'service', 'auth', 'mobile', 'group']),
  title: z.string(),
  route: z.string().optional(),
  x: z.number(), y: z.number(),
  width: z.number().default(180), height: z.number().default(80),
  rtlCompliant: z.boolean().default(false),
  wcagCompliant: z.boolean().default(false),
  hardlockFailures: z.array(z.object({
    type: z.enum(['rtl', 'wcag', 'vision']),
    message: z.string(),
  })),
  locked: z.boolean().default(false),
  attachments: z.array(AttachmentPayloadSchema).default([]),
  generationStatus: z.enum(['idle','generating','done','error']).optional(),
})

// CanvasWireSchema
z.object({
  id: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  type: z.enum(['navigational','data','auth','conditional']),
  contextPayload: ContextPayloadSchema.optional(),
  attachments: z.array(AttachmentPayloadSchema).default([]),
  cp1Offset: z.object({x: z.number(), y: z.number()}).default({x:80, y:0}),
  cp2Offset: z.object({x: z.number(), y: z.number()}).default({x:-80, y:0}),
})

// CanvasStateSchema
z.object({
  nodes: z.array(CanvasNodeSchema),
  wires: z.array(CanvasWireSchema),
  viewport: z.object({ x: z.number(), y: z.number(), scale: z.number() }),
  selectedNodeIds: z.array(z.string()),
  selectedWireId: z.string().nullable(),
  generativeMode: z.enum(['idle','validating','compressing','generating','done','error']),
  rtlMode: z.boolean(),
})
```

### Zustand Store Actions
- `addNode(node)` / `updateNode(id, patch)` / `removeNode(id)`
- `addWire(wire)` / `removeWire(id)` / `updateWireBezier(id, cp1, cp2)`
- `attachAsset(parentId, parentType, asset)` / `updateAssetVisionStatus(assetId, status)`
- `aggregateContext(wireId)` → builds `ContextPayload` from source node + wire attachments
- `compressContext(wireId, maxTokens: 32000)` → truncates AST fields to fit token budget
- `triggerGeneration(wireId)` → validates hardlocks → fires `/api/ai/generate-node`
- `setViewport(x, y, scale)` / `setRTLMode(v)`
- `hardlockCheck(nodeId)` → returns `HardlockFailure[]`, updates node in place

### Persistence
- Persists to `localStorage('nezam-ds:canvas-graph')` via Zustand `persist` middleware
- Zod `.parse()` on hydration — invalid state resets to empty default (no silent corruption)

---

## Deliverable 3 — `docs/architecture/GENERATIVE_PROPAGATION_FLOW.md`

Mermaid `sequenceDiagram` covering the full wire→generation flow:

```
participant U as User
participant CV as Canvas UI
participant ST as canvas-graph.store
participant VG as Vision Gate (/api/ai/vision-gate)
participant CW as context-window-manager
participant PE as prompt-engineer
participant LLM as claude-haiku-4-5
participant FS as File System (.session/)

U->>CV: Creates wire A→B, attaches image + directive
CV->>ST: attachAsset(wireId, 'wire', asset{status:'pending'})
CV->>VG: POST /api/ai/vision-gate {image: base64}
VG-->>ST: updateAssetVisionStatus(assetId, 'valid'|'rejected')
alt Asset rejected
  ST-->>CV: generativeMode = 'error', hardlockFailures
  CV-->>U: "Non-compliant asset — replace before generating"
end
U->>CV: Clicks "Generate Page B"
CV->>ST: hardlockCheck(sourceNodeId)
alt Hardlock fails (RTL/WCAG)
  ST-->>CV: failures[] returned
  CV-->>U: Generate button disabled + node highlighted orange
end
ST->>ST: aggregateContext(wireId) → ContextPayload
ST->>CW: compressContext(payload, maxTokens=32000)
CW-->>ST: compressed ContextPayload {tokenCount}
ST->>PE: buildPrompt(compressedPayload)
PE->>LLM: POST /api/ai/generate-node {system, userPrompt}
LLM-->>PE: COMPONENT_SPEC.md + wireframe blocks JSON
PE-->>ST: updateNode(targetNodeId, {generationStatus:'done', blocks})
ST-->>CV: node re-renders with generated content
CV-->>FS: savePageSession(targetNodeId, blocks)
CV-->>U: "Page B generated ✓" toast
```

Also includes: LOD rendering decision tree (Mermaid `flowchart TD`) and Hardlock gate sequence.

---

## Deliverable 4 — State File Updates

### `.cursor/state/plan_progress.yaml`
Append:
```yaml
canvas_graph_spec: true
canvas_graph_spec_version: "SPEC-DS-CANVAS-001-v1.0.0"
canvas_graph_spec_date: "2026-05-18"
```

### `.cursor/state/HANDOFF_QUEUE.yaml`
Add to `queue[]`:
```yaml
- id: "HO-CANVAS-001"
  from: "visual-canvas-architect"
  to: "frontend-lead"
  type: "handoff"
  timestamp: "2026-05-18T00:00:00Z"
  payload:
    subject: "SPEC-DS-CANVAS-001 architecture complete — begin canvas-graph store integration"
    artifact_path: "docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md"
    summary: "Context-Aware Infinity Canvas spec, Zod store, and propagation flow diagram ready. Next: wire canvas-graph.store into CanvasWorkspace.tsx, implement Vision Gate API route, and build GenerativeEdge UI."
    action_required: "integrate canvas-graph.store.ts into CanvasWorkspace, add Vision Gate route at /api/ai/vision-gate, add GenerateButton to wire selection panel"
  status: "pending"
```

---

## Execution Order

1. Create `docs/plans/05-design-uiux/` directory + write `SPEC-DS-CANVAS-001.md` (full 10 sections)
2. Create `docs/architecture/` directory + write `GENERATIVE_PROPAGATION_FLOW.md`
3. Create `.nezam/design-server/src/store/` + write `canvas-graph.store.ts`
4. Update `.cursor/state/plan_progress.yaml` (append 3 lines)
5. Update `.cursor/state/HANDOFF_QUEUE.yaml` (add queue entry)
6. `npx tsc --noEmit` in design-server to verify store compiles

## Files Modified/Created

| File | Action | Location |
|------|---------|---------|
| `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md` | Create | NEZAM workspace root |
| `docs/architecture/GENERATIVE_PROPAGATION_FLOW.md` | Create | NEZAM workspace root |
| `.nezam/design-server/src/store/canvas-graph.store.ts` | Create | design-server src |
| `.cursor/state/plan_progress.yaml` | Edit (append) | NEZAM workspace root |
| `.cursor/state/HANDOFF_QUEUE.yaml` | Edit (append queue item) | NEZAM workspace root |

## Existing Code Reused
- `lib/store/session.store.ts` — Zustand pattern reference (same `create()` + `persist()` pattern)
- `app/api/ai/generate/route.ts` — `callAnthropic()` pattern reused for Vision Gate and generate-node routes (not created this session, documented for Phase 2)
- Zod already installed (`zod ^3.25.28` in package.json)
- `zustand ^5.0.5` with `zustand/middleware` (`persist`) already available

## Verification
1. `npx tsc --noEmit` from `.nezam/design-server/` → 0 errors (store uses strict typing)
2. `SPEC-DS-CANVAS-001.md` has exactly 10 numbered sections (0–9)
3. Mermaid diagram renders (paste into mermaid.live) without syntax errors
4. `plan_progress.yaml` still valid YAML after append
5. `HANDOFF_QUEUE.yaml` queue array has 1 entry with all required fields
