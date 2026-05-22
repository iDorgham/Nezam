# GENERATIVE_PROPAGATION_FLOW — Context-Aware Infinity Canvas

> Architecture document for SPEC-DS-CANVAS-001.
> Describes the full data flow from wire creation to AI-generated target node.

---

## 1. Primary Flow: Wire → Asset Attachment → Validate → Generate

```mermaid
sequenceDiagram
    participant U as User
    participant CV as Canvas UI<br/>(CanvasWorkspace)
    participant ST as canvas-graph.store<br/>(Zustand + Zod)
    participant VG as Vision Gate<br/>(/api/ai/vision-gate)
    participant CW as context-window-manager<br/>(compressContext)
    participant PE as prompt-engineer<br/>(buildPrompt)
    participant LLM as claude-haiku-4-5<br/>(/api/ai/generate-node)
    participant FS as File System<br/>(.session/)

    %% ── Wire Creation ─────────────────────────────────────────────
    U->>CV: Activates Wiring Mode (W key)
    CV-->>U: Cursor changes to crosshair; node ports appear

    U->>CV: Drags wire from [Page A] port → [Page B] port
    CV->>ST: addWire({ fromNodeId, toNodeId, type: 'navigational', attachments: [] })
    CV-->>U: Wire Inspector panel opens (right sidebar)

    %% ── Asset Attachment ───────────────────────────────────────────
    U->>CV: Drops Stripe screenshot image onto Wire Inspector drop zone
    CV->>ST: attachAsset(wireId, 'wire', { type:'image', visionStatus:'pending', role:'style-reference' })
    CV-->>U: Asset card renders with grey spinner "Scanning…"

    CV->>VG: POST /api/ai/vision-gate { image: base64, mimeType: 'image/png' }
    Note over VG: claude-haiku inspects for<br/>embedded text (Zero-Text Policy)

    alt Asset is compliant (no text detected)
        VG-->>ST: updateAssetVisionStatus(assetId, 'valid')
        ST-->>CV: Asset card shows green ✓
        CV-->>U: Generate button becomes active
    else Asset rejected (text detected)
        VG-->>ST: updateAssetVisionStatus(assetId, 'rejected')
        ST-->>CV: generativeMode = 'error', red ✗ on asset
        CV-->>U: "Non-compliant: text detected. Replace asset to generate."
        Note over U: Flow terminates until user replaces asset
    end

    U->>CV: Types directive: "Replicate Stripe data-density card grid"
    CV->>ST: updateWire(wireId, { annotativeDirectives: ['Replicate Stripe...'] })

    %% ── Hardlock Gate Check ────────────────────────────────────────
    U->>CV: Clicks "Generate [Page B]"
    CV->>ST: triggerGeneration(wireId)
    ST->>ST: generativeMode = 'validating'
    ST->>ST: hardlockCheck(fromNodeId)

    alt Source node fails RTL parity gate
        ST-->>CV: failures = [{ type: 'rtl', message: 'RTL parity not verified' }]
        ST->>ST: generativeMode = 'error'
        CV-->>U: Page A renders orange border + "⚠ RTL Parity Required" badge
        CV-->>U: Generate blocked — "Fix 1 RTL issue on [Dashboard] first"
        Note over U: Flow terminates until rtlCompliant: true on source node
    else Source node fails WCAG AA gate
        ST-->>CV: failures = [{ type: 'wcag', message: 'WCAG AA not verified' }]
        ST->>ST: generativeMode = 'error'
        CV-->>U: Page A renders orange border + "⚠ WCAG AA Required" badge
        Note over U: Flow terminates until wcagCompliant: true on source node
    else All gates pass
        ST->>ST: generativeMode = 'compressing'
    end

    %% ── Context Aggregation & Compression ─────────────────────────
    ST->>ST: aggregateContext(wireId)
    Note over ST: Builds ContextPayload:<br/>• sourceNodeAST (wireframe blocks JSON)<br/>• designTokens (snapshot from tokens.store)<br/>• attachedAssets (visionStatus: 'valid' only)<br/>• annotativeDirectives

    ST->>CW: compressContext(payload, maxTokens=32000)
    Note over CW: Tiered reduction if over budget:<br/>T1: Drop block prop details (keep types only)<br/>T2: Drop low-priority attachments<br/>T3: Truncate directives to 3

    alt Token count still exceeds 32,000 after all tiers
        CW-->>ST: { error: 'Context too large' }
        ST->>ST: generativeMode = 'error'
        CV-->>U: "Context too large — remove attachments or simplify source"
        Note over U: Flow terminates
    else Compression successful
        CW-->>ST: { compressedPayload, tokenCount }
        ST->>ST: generativeMode = 'generating'
        CV-->>U: Status bar: "Generating… (12,847 / 32,000 tokens)"
    end

    %% ── LLM Generation ─────────────────────────────────────────────
    ST->>PE: buildPrompt(compressedPayload)
    Note over PE: Constructs system + user prompt:<br/>• System: NEZAM block registry types<br/>• User: AST summary + tokens + assets + directives

    PE->>LLM: POST /api/ai/generate-node { system, messages }
    Note over LLM: claude-haiku-4-5 generates:<br/>• wireframe blocks JSON array<br/>• COMPONENT_SPEC.md content

    alt LLM API error (5xx or timeout)
        LLM-->>PE: Error response
        PE-->>ST: generativeMode = 'error'
        CV-->>U: "Generation failed — retry or check API key"
        Note over U: Flow terminates; user can retry
    else LLM success
        LLM-->>PE: { blocks: [...], spec: '...' }
        PE-->>ST: updateNode(targetNodeId, { generationStatus: 'done', blocks })
        ST->>ST: generativeMode = 'done'
    end

    %% ── Persistence & Render ───────────────────────────────────────
    ST->>FS: writeFile(.session/pages/[targetId].json, blocks)
    ST->>FS: writeFile(.session/specs/[targetId]-spec.md, spec)
    ST-->>CV: Target node [Page B] re-renders: spinner → green ✓ "Generated"
    CV-->>U: Toast: "Page B generated ✓ — click to open in Wireframe Editor"
    U->>CV: Clicks Page B node → opens wireframe tab
```

---

## 2. LOD Rendering Decision Tree

```mermaid
flowchart TD
    A[Node render requested] --> B{canvas scale}
    B -->|scale >= 0.4| C[Full Detail\nTitle + Type badge\nPort handles\nAttachment dots\nHardlock overlays\nGeneration spinner]
    B -->|0.1 <= scale < 0.4| D[Simplified\nColored rectangle\nTitle text only\nNo ports / handles]
    B -->|scale < 0.1| E[Dot Mode\n8px filled circle\nNode-type color only\nNo text]
    C --> F[Wire rendered as full bezier\nwith label on hover]
    D --> G[Wire rendered as thin line\nno label]
    E --> H[Wire rendered as 1px line\nno interaction]
```

---

## 3. Hardlock Gate Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant ST as canvas-graph.store
    participant RS as rtl-specialist agent
    participant A11Y as a11y-performance-auditor

    U->>ST: triggerGeneration(wireId)
    ST->>ST: hardlockCheck(fromNodeId)

    ST->>ST: Check rtlCompliant flag
    alt rtlCompliant === false AND wire.type === 'navigational'
        ST->>RS: Emit: rtl_parity_required(nodeId)
        RS-->>ST: failures: [{ type:'rtl', message }]
        ST-->>U: Block generation + orange border on source node
    end

    ST->>ST: Check wcagCompliant flag
    alt wcagCompliant === false AND target is page/UI node
        ST->>A11Y: Emit: wcag_check_required(nodeId)
        A11Y-->>ST: failures: [{ type:'wcag', message }]
        ST-->>U: Block generation + orange border on source node
    end

    ST->>ST: Check all wire attachments visionStatus
    alt any attachment has visionStatus !== 'valid'
        ST-->>U: Block generation + red ✗ on attachment
    end

    alt All gates pass
        ST->>ST: generativeMode = 'compressing'
        Note over ST: Proceed to context aggregation
    end
```

---

## 4. Coordinate System & RTL Mirroring

```mermaid
flowchart LR
    subgraph LTR ["LTR Mode (default)"]
        L1["Source port = node.x + node.width"]
        L2["Target port = node.x"]
        L3["Pan delta X: +rawDeltaX"]
        L4["Bezier: left-to-right arc"]
    end

    subgraph RTL ["RTL Mode (dir='rtl')"]
        R1["Source port = node.x"]
        R2["Target port = node.x + node.width"]
        R3["Pan delta X: -rawDeltaX (inverted)"]
        R4["Bezier: right-to-left arc"]
    end

    Toggle["rtlMode toggle\n(canvas-graph.store)"] -->|"setRTLMode(true)"| RTL
    Toggle -->|"setRTLMode(false)"| LTR
```

---

## 5. Context Payload Schema Flow

```mermaid
flowchart TD
    A["User triggers Generate"] --> B["aggregateContext(wireId)"]
    B --> C["sourceNodeAST\n(wireframe blocks JSON)"]
    B --> D["designTokens\n(token store snapshot)"]
    B --> E["attachedAssets\n(visionStatus: valid only)"]
    B --> F["annotativeDirectives\n(wire inspector textarea)"]

    C & D & E & F --> G["ContextPayload assembled"]
    G --> H["compressContext(payload, 32000)"]
    H --> I{tokenCount <= 32000?}

    I -->|Yes| J["buildPrompt(compressedPayload)"]
    I -->|No - Tier 1| K["Drop AST prop details\nKeep block type/name only"]
    K --> H
    I -->|No - Tier 2| L["Drop lowest-priority attachments\nprd-note first, then content-source"]
    L --> H
    I -->|No - Tier 3| M["Truncate directives to 3"]
    M --> H
    I -->|Still over 32k| N["Error: Context too large"]

    J --> O["POST /api/ai/generate-node"]
    O --> P["LLM response: blocks[] + spec"]
    P --> Q["updateNode(targetId, {blocks, generationStatus:'done'})"]
    Q --> R["savePageSession(targetId, blocks)"]
```

---

## 6. Related Files

| File | Role |
|------|------|
| `docs/plans/05-design-uiux/SPEC-DS-CANVAS-001.md` | Full SDD — source of truth for this architecture |
| `.nezam/design-server/src/store/canvas-graph.store.ts` | Zustand + Zod implementation of all schemas in §3–5 |
| `.nezam/design-server/components/canvas/CanvasWorkspace.tsx` | React canvas component — consumes canvas-graph.store |
| `.nezam/design-server/app/api/ai/vision-gate/route.ts` | Vision Gate API endpoint (Phase 2 implementation) |
| `.nezam/design-server/app/api/ai/generate-node/route.ts` | Node generation API endpoint (Phase 2 implementation) |
| `.cursor/state/plan_progress.yaml` | Gates tracking — `canvas_graph_spec: true` |
| `.cursor/state/HANDOFF_QUEUE.yaml` | Handoff to `frontend-lead` for Phase 2 integration |
