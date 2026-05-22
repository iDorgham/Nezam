# SPEC-DS-CANVAS-001 — Context-Aware Infinity Canvas

> **Feature Specification Document (SDD)**
> This document is the single source of truth for the Context-Aware Infinity Canvas module.
> No implementation begins until this spec is approved and locked.

---

## 0. Feature Identity

| Field | Value |
|---|---|
| Feature ID | SPEC-DS-CANVAS-001 |
| Feature Name | Context-Aware Infinity Canvas |
| Module | `.nezam/design-server` — Builder Canvas |
| Parent Product | NEZAM Design Server |
| Owner | `visual-canvas-architect` · `prompt-engineer` · `lead-frontend-architect` |
| Status | **Architecture Draft** |
| SDD Version | 1.0.0 |
| Created | 2026-05-18 |
| Last Updated | 2026-05-18 |
| NEZAM Governance | `design-server-gates.mdc` · `sdd-pipeline-v2.mdc` · `workspace-orchestration.mdc` |
| Hardlock Prerequisite | RTL parity ✓ · WCAG AA ✓ · Vision Gate pass ✓ |

---

## 1. Problem Statement

### 1.1 The Problem

The existing `CanvasWorkspace.tsx` provides a functional pan/zoom/drag canvas with node cards and SVG bezier connections. However, **the wires carry no semantic data**. Connections between page nodes are purely visual — they convey no information about the relationship, data dependencies, or design intent between connected pages.

This creates three compounding gaps:

1. **Isolated Generation**: When the AI assistant generates a target page (Page B), it has no awareness of the source page (Page A) it connects to. Generated content is incoherent, repeats design patterns independently, and cannot inherit the source's design tokens, routing context, or content structure.

2. **Missing Attachment Pipeline**: Users cannot anchor assets (reference images, PRD notes, markdown directives) to specific wires or nodes and have those assets structurally influence what gets generated. The current Asset Manager is an unstructured media browser, not a contextual attachment system.

3. **No Hardlock Gate at Generation**: The system allows generation of target nodes even when source nodes fail RTL parity checks or WCAG AA contrast requirements. Generated output therefore inherits and propagates non-compliant design patterns downstream.

### 1.2 Why Now

Visual-first AI builders (Lovable, v0, Bolt, Cursor Composer) have established a new baseline for speed-to-prototype. The canvas is NEZAM's competitive moat — but only if spatial relationships between nodes directly encode generative intelligence. Without **Context Bridges**, the canvas is a drawing board. With them, it becomes a **visual programming interface for AI context**.

### 1.3 What Happens Without This Feature

- Multi-page AI generation produces incoherent page families with drift in typography, spacing, and interaction patterns
- Users manually copy-paste design directives between generation sessions — high cognitive load, high error rate
- Non-compliant source pages propagate RTL/a11y failures downstream silently
- The NEZAM SDD pipeline lacks a visual IDE layer — design decisions exist only as text files, not spatial graphs

---

## 2. Users & Personas

### Persona 1: Lina — Product Architect
- **Role**: Maps full application flows, oversees multi-page consistency
- **Job to be done**: When I plan a 12-page SaaS dashboard, I want to draw the flow once on the canvas, wire the pages together, and generate each page with automatic context inheritance from its upstream neighbor
- **Current frustration**: Switching between the sitemap, wireframe editor, and AI assistant requires constant context re-entry. Page B has no idea what Page A looks like.
- **Success looks like**: Wire Page A → Page B, attach a Stripe dashboard screenshot to the wire, type "replicate the data-density pattern," click Generate — Page B scaffolds with the right layout, token usage, and component vocabulary
- **Technical comfort**: High
- **Usage frequency**: Daily during project setup phases

### Persona 2: Rami — MENA Frontend Lead
- **Role**: Implements RTL-first UI for Arabic-market SaaS products
- **Job to be done**: When I map a bilingual app flow, I need the canvas coordinate system to natively mirror in RTL mode — pan direction, wire attachment points, and node order must all flip correctly without layout hacks
- **Current frustration**: The canvas does not respond to `dir="rtl"` — panning feels reversed, bezier curves attach on wrong sides, and generated content has no Arabic content context
- **Success looks like**: Toggle `dir=rtl`, canvas flips coordinate logic, all wires redraw from mirrored ports, and generation output includes `dir="rtl"` wrappers and Arabic-first content ordering
- **Technical comfort**: Very High
- **Usage frequency**: Daily

### Persona 3: Nour — AI Orchestrator
- **Role**: Routes generation requests to the correct agent/skill combinations
- **Job to be done**: When a wire triggers generation, I need a structured, typed `ContextPayload` schema I can decompose into agent-specific sub-tasks — not an untyped prompt string
- **Current frustration**: The current `/api/ai/generate` route receives a raw text prompt with no structure. I cannot reliably route to `rtl-specialist`, `design-lead`, or `prompt-engineer` based on unstructured input.
- **Success looks like**: The `ContextPayload` schema contains explicit fields: `sourceNodeAST`, `designTokens`, `attachedAssets[{role, content, visionStatus}]`, `annotativeDirectives[]`. Each field maps directly to a NEZAM agent skill.
- **Technical comfort**: Expert
- **Usage frequency**: Every generation event

---

## 3. Success Metrics

| Metric | Baseline (Current) | 30-Day Target | 90-Day Target | Source |
|---|---|---|---|---|
| Wire-to-generation round trip | N/A (not implemented) | < 8s at 32k tokens | < 5s at 32k tokens | Browser performance trace |
| Token overflow incidents | N/A | 0 (hard block) | 0 | API error log |
| WCAG AA gate false negatives | N/A (no gate) | 0 | 0 | A11y audit runs |
| RTL parity failures post-generation | Unchecked | 0 (gate blocks) | 0 | RTL specialist sign-off |
| Canvas 60fps @ 50 nodes | ~55fps (unoptimized) | 60fps p95 | 60fps p99 | Chrome DevTools perf trace |
| Canvas 60fps @ 500 nodes | ~12fps | 30fps p95 (LOD) | 60fps p95 (LOD+culling) | Chrome DevTools perf trace |
| Vision Gate scan latency | N/A | < 3s per asset | < 2s per asset | API timing log |
| Generated node design-token inheritance rate | 0% | 100% (enforced by schema) | 100% | Token audit post-generation |

---

## 4. Feature Registry

| ID | Feature Name | Priority | Persona | Phase | Spec Ref |
|---|---|---|---|---|---|
| F-C01 | Generative Wire / ContextBridge | P0 — Critical | Lina, Nour | Phase 1 | §6 Wire schema |
| F-C02 | Attachment Ingestion Pipeline | P0 — Critical | Lina, Nour | Phase 1 | §6 AttachmentPayload |
| F-C03 | NEZAM Vision Gate (Zero-Text Policy) | P0 — Critical | Nour | Phase 1 | §8 Gate protocol |
| F-C04 | Context Compression (< 32k tokens) | P0 — Critical | Nour | Phase 1 | §7 context-window-manager |
| F-C05 | RTL Coordinate Mirroring | P0 — Critical | Rami | Phase 1 | §7 RTL math |
| F-C06 | Hardlock Gates (RTL + WCAG AA) | P0 — Critical | Rami, Nour | Phase 1 | §8 Hardlock |
| F-C07 | LOD Rendering (Occlusion Culling) | P1 — High | All | Phase 2 | §7 LOD |
| F-C08 | Floating Canvas Toolbar | P1 — High | Lina | Phase 2 | §5 Flow 1 |
| F-C09 | Notes Overlay System | P1 — High | Lina | Phase 2 | §5 Flow 1 |
| F-C10 | Bezier Anchor Drag (cp1/cp2 handles) | P2 — Medium | Lina | Phase 2 | §7 Port math |
| F-C11 | WebGL Rendering Engine | P3 — Low | All (500+ nodes) | Phase 3 | §7 Rendering |
| F-C12 | Worker Thread Delta Sync | P3 — Low | All | Phase 3 | §7 State sync |

---

## 5. Core User Flows

### Flow 1: Wire → Generate (Happy Path)

```
Step 1: User opens Canvas at /canvas or via Dashboard tab "Canvas"
  → Canvas renders with existing nodes from canvas-graph.store
  → Floating toolbar visible: [−] [100%] [+] [Grid] [Snap] [Notes] [Wiring]
  → Minimap (Phase 2) in bottom-right corner

Step 2: User selects "Wiring Mode" (toolbar or keyboard W)
  → Cursor changes to crosshair; node ports appear as green dots on node edges
  → Tooltip: "Click a source port to begin drawing a wire"

Step 3: User clicks source port on [Page A: Dashboard] and drags to [Page B: User Profile]
  → Animated bezier curve follows cursor during drag
  → On release at target port: wire created; Wire Inspector panel opens on right

Step 4: Wire Inspector Panel shows:
  - Wire type selector: [Navigational | Data | Auth | Conditional]
  - Attachment drop zone: "Drop images, markdown, or text files here"
  - Annotative directive textarea: "Describe what should be generated…"
  - Generate button (disabled until ≥1 valid attachment OR directive entered)

Step 5: User drags a Stripe dashboard screenshot from Asset Browser → wire attachment zone
  → Asset card appears with "Scanning…" spinner
  → POST /api/ai/vision-gate → response: valid
  → Asset card shows green ✓ badge; wire attachment dot on canvas turns green

Step 6: User types directive: "Replicate the data-density and card grid pattern from Stripe"

Step 7: User clicks "Generate Page B"
  → canvas-graph.store.hardlockCheck(sourceNodeId) runs
  → Source node has rtlCompliant: true, wcagCompliant: true → gate passes
  → canvas-graph.store.aggregateContext(wireId) builds ContextPayload
  → compressContext(payload, 32000) → tokenCount returned
  → Status bar shows: "Compressing context… (12,847 / 32,000 tokens)"
  → POST /api/ai/generate-node → LLM streams wireframe blocks JSON + COMPONENT_SPEC.md
  → Target node [Page B] card updates: spinner → ✓ "Generated"
  → savePageSession(targetNodeId, blocks) writes to .session/pages/[id].json

Step 8: User clicks Page B node → opens in Wireframe Editor tab
  → Blocks match the Stripe data-density pattern
  → Design tokens inherited from Page A (same fontBody, colorPrimary, spacing scale)
```

### Flow 2: Vision Gate Rejection

```
Step 1: User attaches an image containing visible text ("Q3 Revenue: $4.2M")
  → Asset card shows "Scanning…" spinner (< 3s)
  → POST /api/ai/vision-gate detects embedded text in image

Step 2: Vision Gate rejects attachment
  → Asset card shows red ✗ badge: "Non-compliant: text detected in artwork (Zero-Text Policy)"
  → Wire attachment zone shows warning banner: "Replace non-compliant assets before generating"
  → Generate button remains disabled

Step 3: User replaces image with a clean layout screenshot (no embedded text)
  → New Vision Gate scan → valid
  → Generate button becomes active
```

### Flow 3: Hardlock RTL Gate Block

```
Step 1: User tries to generate Page B from Page A (Navigational wire type)
  → canvas-graph.store.hardlockCheck(pageA.id) runs
  → Finds: rtlCompliant: false (Page A wireframe has no RTL-equivalent block variants)

Step 2: Generation blocked
  → Page A node renders with orange border overlay: "⚠ RTL Parity Required"
  → Wire Generate button shows tooltip: "Source page must pass RTL parity check"
  → Notification panel: "Fix 1 RTL issue on [Dashboard] before generating downstream pages"

Step 3: User navigates to Page A wireframe, adds RTL-compatible block variants
  → Marks rtlCompliant: true in node panel
  → Orange border clears; Generate button activates
```

---

## 6. Data Model

### 6.1 Entity: `AttachmentPayload`

| Field | Type | Required | Default | Validation | Notes |
|---|---|---|---|---|---|
| id | string (uuid) | yes | auto | uuid format | Primary key |
| parentId | string | yes | — | non-empty | nodeId or wireId this is bound to |
| parentType | `'node' \| 'wire'` | yes | — | enum | Determines where attachment renders on canvas |
| type | `'image' \| 'text' \| 'markdown' \| 'pdf'` | yes | — | enum | Drives ingestion pipeline |
| url | string (url) | no | — | valid URL | Used for image assets |
| content | string | no | — | — | Raw text/markdown content |
| altText | string | no | — | — | AI-generated via Vision model |
| visionStatus | `'pending' \| 'valid' \| 'rejected'` | yes | `'pending'` | enum | Drives UI state |
| role | `'style-reference' \| 'content-source' \| 'prd-note'` | yes | — | enum | Contextual role in generation |
| createdAt | string (datetime) | yes | now | ISO 8601 | — |

### 6.2 Entity: `ContextPayload`

| Field | Type | Required | Notes |
|---|---|---|---|
| sourceNodeId | string | yes | ID of the wire's fromNodeId |
| sourceNodeAST | Record\<string, unknown\> | yes | Full wireframe blocks JSON of source node |
| designTokens | Record\<string, string\> | yes | Snapshot of current token contract (from tokens.store) |
| attachedAssets | AttachmentPayload[] | yes | Only `visionStatus: 'valid'` assets included |
| annotativeDirectives | string[] | yes | Free-text directives entered by user on wire |
| compressedAt | string (datetime) | no | Set when context-window-manager runs |
| tokenCount | number | no | Estimated token count after compression |

### 6.3 Entity: `CanvasNode`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | yes | — | Matches sitemap Page.id where applicable |
| type | `'page' \| 'service' \| 'auth' \| 'mobile' \| 'group'` | yes | — | Determines node color and port layout |
| title | string | yes | — | Displayed on node card |
| route | string | no | — | URL path, e.g. `/dashboard` |
| x, y | number | yes | — | Canvas coordinate in virtual space |
| width, height | number | yes | 180, 80 | Node card dimensions |
| rtlCompliant | boolean | yes | false | Set to true after RTL specialist review |
| wcagCompliant | boolean | yes | false | Set to true after a11y audit passes |
| hardlockFailures | HardlockFailure[] | yes | [] | Surfaced as orange overlay badges |
| locked | boolean | yes | false | Locked nodes block all edits |
| attachments | AttachmentPayload[] | yes | [] | Node-level attachments |
| generationStatus | `'idle' \| 'generating' \| 'done' \| 'error'` | no | `'idle'` | Drives spinner/check UI on node card |

### 6.4 Entity: `CanvasWire`

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| id | string | yes | — | — |
| fromNodeId | string | yes | — | Source node |
| toNodeId | string | yes | — | Target node |
| type | `'navigational' \| 'data' \| 'auth' \| 'conditional'` | yes | — | Color codes wire on canvas |
| contextPayload | ContextPayload | no | — | Populated when Generate is triggered |
| attachments | AttachmentPayload[] | yes | [] | Wire-level asset attachments |
| cp1Offset | `{x, y}` | yes | `{x:80, y:0}` | Bezier control point 1 offset from source port |
| cp2Offset | `{x, y}` | yes | `{x:-80, y:0}` | Bezier control point 2 offset from target port |

### 6.5 Entity: `HardlockFailure`

| Field | Type | Notes |
|---|---|---|
| type | `'rtl' \| 'wcag' \| 'vision'` | Failure category |
| message | string | Human-readable description |

### 6.6 Entity: `CanvasState`

| Field | Type | Notes |
|---|---|---|
| nodes | CanvasNode[] | Full node graph |
| wires | CanvasWire[] | Full wire graph |
| viewport | `{x, y, scale}` | Pan and zoom state |
| selectedNodeIds | string[] | Multi-select |
| selectedWireId | string \| null | Wire Inspector activation |
| generativeMode | `'idle' \| 'validating' \| 'compressing' \| 'generating' \| 'done' \| 'error'` | Global generation state machine |
| rtlMode | boolean | Drives coordinate mirroring |

---

## 7. Technical Architecture

### 7.1 Rendering Engine (Phase 1 — CSS Affine Transform)

The canvas root div uses CSS `transform` for pan and zoom. This avoids canvas/WebGL complexity for Phase 1 and supports up to ~200 nodes at 60fps.

**Affine transform math:**
```
// Pan + zoom combined as CSS matrix
transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
transform-origin: 0 0
```

**Screen → Canvas coordinate conversion:**
```ts
screenToCanvas(sx: number, sy: number) = {
  x: (sx - pan.x) / scale,
  y: (sy - pan.y) / scale,
}

canvasToScreen(cx: number, cy: number) = {
  x: cx * scale + pan.x,
  y: cy * scale + pan.y,
}
```

**RTL mirroring:** When `rtlMode: true`, negate the `x` delta on pan events:
```ts
const panDeltaX = rtlMode ? -rawDeltaX : rawDeltaX
```
Wire ports mirror: `sourcePort.x = rtlMode ? node.x : node.x + node.width`

### 7.2 LOD Rendering (Phase 1 — CSS-based)

Three detail levels based on `scale`:

| Scale | Render Mode | Components Shown |
|---|---|---|
| ≥ 0.4 | Full | Node title, type badge, port handles, attachment indicators, hardlock overlays |
| 0.1–0.4 | Simplified | Colored rectangle + title text only. No ports, no handles. |
| < 0.1 | Dot | 8px filled circle in node-type color. No text. |

Switch via `useMemo` on `scale` — React skips re-render for unchanged LOD tier.

### 7.3 Port Anchor Math (Bezier Wire Calculation)

**Port positions (canvas coordinates):**
```ts
sourcePort = { x: node.x + node.width, y: node.y + node.height / 2 }
targetPort = { x: wire.toNode.x,        y: wire.toNode.y + wire.toNode.height / 2 }

// RTL: swap port x positions
if (rtlMode) {
  sourcePort.x = node.x
  targetPort.x = wire.toNode.x + wire.toNode.width
}
```

**Bezier control points (with draggable offsets from CanvasWireSchema):**
```ts
cp1 = { x: sourcePort.x + wire.cp1Offset.x, y: sourcePort.y + wire.cp1Offset.y }
cp2 = { x: targetPort.x + wire.cp2Offset.x, y: targetPort.y + wire.cp2Offset.y }

// SVG path
d = `M ${sourcePort.x} ${sourcePort.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${targetPort.x} ${targetPort.y}`
```

Wire color by type:
- `navigational` → `--dv-wire-route` (#3ECF8E)
- `data` → `--dv-wire-data` (#5A94F5)
- `auth` → `--dv-wire-auth` (#A78BFA)
- `conditional` → `--dv-wire-condition` (#E6A31D)

### 7.4 State Management

`canvas-graph.store.ts` (Zustand + Zod) is the single source of truth. React components subscribe via selectors — no prop drilling.

**Key subscriptions pattern:**
```ts
const nodes = useCanvasStore(s => s.nodes)       // re-renders on node changes only
const viewport = useCanvasStore(s => s.viewport) // re-renders on pan/zoom only
```

**Delta update discipline:** Store actions only call `set()` with the minimum changed slice. Viewport pan calls `setViewport()` on every `mousemove` — this must NOT trigger full node re-renders.

**Persistence:** `persist` middleware serializes to `localStorage('nezam-ds:canvas-graph')`. On hydration, Zod `.parse()` validates the stored value — invalid/stale state resets to `defaultCanvasState` rather than throwing.

### 7.5 Context Compression (context-window-manager logic)

Before firing LLM generation, `compressContext(wireId, maxTokens)` reduces the `ContextPayload`:

1. **Estimate tokens**: `Math.ceil(JSON.stringify(payload).length / 4)` (approximation)
2. **If over budget**: apply tiered reduction:
   - Tier 1: Drop `sourceNodeAST` block prop details (keep block types/names only)
   - Tier 2: Drop oldest/lowest-priority attachments (sort by `role` priority: style-reference > content-source > prd-note)
   - Tier 3: Truncate `annotativeDirectives` to first 3 entries
3. **Set** `compressedAt` timestamp and `tokenCount` on payload
4. **Block generation** if still over budget after all tiers — surface error: "Context too large — remove attachments or simplify source page"

### 7.6 WebGL Path (Phase 3 — Deferred)

Pixi.js v8 or raw WebGL2 for 500+ node graphs. Node cards rendered as GPU sprites with texture atlas. Wire beziers rendered as WebGL line strips with anti-aliasing. Required when p95 frame time exceeds 16.7ms at 100+ nodes under CSS rendering.

---

## 8. State Machine & Hardlock Gates

### 8.1 Generation State Machine

```
┌─────────┐   triggerGeneration()   ┌────────────┐
│  idle   │ ──────────────────────> │ validating │
└─────────┘                         └────────────┘
                                          │
                        hardlockCheck passes │ fails → error
                                          ▼
                                    ┌─────────────┐
                                    │ compressing │
                                    └─────────────┘
                                          │
                        compressContext() │ token overflow → error
                                          ▼
                                    ┌─────────────┐
                                    │ generating  │
                                    └─────────────┘
                                          │
                        LLM responds  │ API error → error
                                          ▼
                                    ┌──────┐
                                    │ done │
                                    └──────┘
```

UI mapping: `validating` → spinner, `compressing` → progress bar, `generating` → streaming indicator, `done` → green checkmark, `error` → red badge with message.

### 8.2 Vision Gate Protocol

**Endpoint:** `POST /api/ai/vision-gate`

**Request:**
```json
{ "image": "<base64-encoded>", "mimeType": "image/png" }
```

**System prompt:** `"Inspect the provided image. Reply only with JSON: { compliant: boolean, reason: string }. compliant must be false if the image contains visible text, numbers, screenshots of text-heavy interfaces, or UI mockups with readable labels."`

**Model:** `claude-haiku-4-5-20251001` (< 3s target latency)

**Response handling:**
- `compliant: true` → `updateAssetVisionStatus(assetId, 'valid')`
- `compliant: false` → `updateAssetVisionStatus(assetId, 'rejected')`, reason displayed in UI
- API error → status stays `'pending'`, retry button shown

**UI states:**
- `pending` → gray spinner on asset thumbnail
- `valid` → green ✓ badge, asset usable in context
- `rejected` → red ✗ badge, tooltip with reason, Generate blocked

### 8.3 Hardlock Gates

Checked synchronously in `hardlockCheck(nodeId)` before any generation:

| Gate | Condition to Pass | Failure UI |
|---|---|---|
| RTL Parity | `node.rtlCompliant === true` OR `wire.type !== 'navigational'` | Orange border on source node + "⚠ RTL Parity Required" badge |
| WCAG AA | `node.wcagCompliant === true` OR generation is non-UI (service/data node) | Orange border + "⚠ WCAG AA Required" badge |
| Vision Gate | All `wire.attachments` have `visionStatus: 'valid'` | Red badge on wire + Generate disabled |

**Override policy:** No overrides. Gates are non-negotiable per `design-server-gates.mdc`. Product Architect may mark `rtlCompliant: true` manually only after RTL specialist sign-off recorded in `.cursor/state/agent-status.yaml`.

---

## 9. NEZAM Agent Routing

| Canvas Operation | Primary Agent | Swarm | Skill Invoked | Escalation | MCP Namespace |
|---|---|---|---|---|---|
| Context aggregation | `prompt-engineer` | swarm-3 | `context-window-manager` | `conflict-resolution-agent` | `/mcp/design/canvas/context` |
| Vision Gate scan | `visual-asset-manager` | swarm-2 | `vercel-ai-sdk` → haiku | `lead-security-officer` | `/mcp/design/assets/vision` |
| UI code generation | `frontend-lead` + `design-lead` | swarm-3 | `react-architecture`, `design-tokens` | `project-architect` | `/mcp/design/generate` |
| RTL parity check | `rtl-specialist` | swarm-4 | `design-tokens`, `rtl-layout` | `arabic-content-master` | `/mcp/design/parity/rtl` |
| WCAG audit | `a11y-performance-auditor` | swarm-4 | `a11y-automation` | `lead-qa-architect` | `/mcp/design/parity/wcag` |
| Wire bezier math | `frontend-framework-manager` | swarm-3 | `react-architecture` | `motion-3d-choreographer` | `/mcp/design/canvas/wiring` |
| LOD rendering | `frontend-performance-manager` | swarm-3 | `performance-optimization` | `lead-devops-performance` | `/mcp/design/canvas/render` |
| Token snapshot | `design-systems-token-architect` | swarm-2 | `design-tokens`, `dtcg` | `design-lead` | `/mcp/design/tokens` |

**Lifecycle:**
- Canvas init → agents spawn on first user interaction, retire on tab close
- Generation → agents spawn on `triggerGeneration()`, retire on `done` or `error`
- Hardlock gate check → synchronous (no agent spawn), results surface immediately

**Escalation Matrix:**
- Performance < 30fps at 50 nodes → `frontend-performance-manager` (High)
- RTL gate false positive → `rtl-specialist + arabic-content-master` (High)
- Vision Gate false negative (text image passes) → `lead-security-officer` (Critical)
- Generated node token drift → `design-systems-token-architect` (Medium)
- LLM generation error → `prompt-engineer → conflict-resolution-agent` (High)

---

## 10. Validation Checklist

### Architecture
- [ ] `canvas-graph.store.ts` Zod schemas validate 100% of state mutations — no untyped writes
- [ ] Store `persist` hydration runs Zod `.parse()` — invalid state resets to default (no crash)
- [ ] `CanvasWire.contextPayload` is typed `ContextPayload | undefined` — no raw prompt strings
- [ ] `aggregateContext()` only includes `visionStatus: 'valid'` assets in payload

### Hardlock Gates
- [ ] RTL gate: generation blocked when `node.rtlCompliant === false` AND `wire.type === 'navigational'`
- [ ] WCAG gate: generation blocked when `node.wcagCompliant === false` AND target is UI node
- [ ] Vision gate: Generate button disabled while any attachment has `visionStatus: 'pending' | 'rejected'`
- [ ] No generation proceeds past `validating` state until all gates pass

### Context & Generation
- [ ] `compressContext()` enforces hard 32,000 token limit — blocks if unreducible
- [ ] Generated node inherits `designTokens` snapshot from source — no new colors invented
- [ ] `savePageSession(targetNodeId, blocks)` writes to `.session/pages/[id].json` after generation
- [ ] COMPONENT_SPEC.md artifact written to `.session/specs/[id]-spec.md`

### Canvas Interaction
- [ ] RTL mode: `pan.x` delta negated; wire source/target ports mirrored horizontally
- [ ] LOD: nodes render as dot at scale < 0.1, simplified at scale 0.1–0.4, full at ≥ 0.4
- [ ] 60fps maintained at 50 nodes — viewport pan does not trigger full node re-render
- [ ] Bezier control points recalculate on every `nodes` state change (not throttled)

### Compliance & State
- [ ] `plan_progress.yaml` updated with `canvas_graph_spec: true`
- [ ] `HANDOFF_QUEUE.yaml` populated with `HO-CANVAS-001` pending entry
- [ ] `npx tsc --noEmit` exits 0 after all deliverables written
- [ ] Mermaid diagram in `GENERATIVE_PROPAGATION_FLOW.md` renders without syntax errors
