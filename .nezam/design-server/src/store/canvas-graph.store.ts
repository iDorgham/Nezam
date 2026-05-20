import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { compressPayload, DEFAULT_MAX_TOKENS } from '@/src/lib/context-compression'

// ── Schemas ───────────────────────────────────────────────────────────────────

export const AttachmentPayloadSchema = z.object({
  id: z.string().uuid(),
  parentId: z.string(),
  parentType: z.enum(['node', 'wire']),
  type: z.enum(['image', 'text', 'markdown', 'pdf']),
  url: z.string().url().optional(),
  content: z.string().optional(),
  altText: z.string().optional(),
  visionStatus: z.enum(['pending', 'valid', 'rejected']),
  role: z.enum(['style-reference', 'content-source', 'prd-note']),
  createdAt: z.string().datetime(),
})

export const ContextPayloadSchema = z.object({
  sourceNodeId: z.string(),
  sourceNodeAST: z.record(z.unknown()),
  designTokens: z.record(z.string()),
  attachedAssets: z.array(AttachmentPayloadSchema),
  annotativeDirectives: z.array(z.string()),
  compressedAt: z.string().datetime().optional(),
  tokenCount: z.number().optional(),
})

const HardlockFailureSchema = z.object({
  type: z.enum(['rtl', 'wcag', 'vision']),
  message: z.string(),
})

// F-007 §3 — Editable CSS surface for the Property Inspector. All margins
// and paddings are logical (inline/block), not directional (left/right/top/bottom).
export const NodeStyleSchema = z.object({
  marginInlineStart:  z.number().optional(),
  marginInlineEnd:    z.number().optional(),
  marginBlockStart:   z.number().optional(),
  marginBlockEnd:     z.number().optional(),
  paddingInlineStart: z.number().optional(),
  paddingInlineEnd:   z.number().optional(),
  paddingBlockStart:  z.number().optional(),
  paddingBlockEnd:    z.number().optional(),
  fontFamily:         z.string().optional(),
  fontWeight:         z.number().optional(),
  fontSize:           z.string().optional(),
  lineHeight:         z.number().optional(),
  fgColor:            z.string().optional(),
  bgColor:            z.string().optional(),
  tabIndex:           z.number().optional(),
  ariaRole:           z.string().optional(),
})

export const CanvasNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['page', 'service', 'auth', 'mobile', 'group']),
  title: z.string(),
  route: z.string().optional(),
  x: z.number(),
  y: z.number(),
  width: z.number().default(180),
  height: z.number().default(80),
  rtlCompliant: z.boolean().default(false),
  wcagCompliant: z.boolean().default(false),
  hardlockFailures: z.array(HardlockFailureSchema).default([]),
  locked: z.boolean().default(false),
  attachments: z.array(AttachmentPayloadSchema).default([]),
  generationStatus: z.enum(['idle', 'generating', 'done', 'error']).default('idle'),
  style: NodeStyleSchema.default({}),
})

export const CanvasWireSchema = z.object({
  id: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  type: z.enum(['navigational', 'data', 'auth', 'conditional']),
  contextPayload: ContextPayloadSchema.optional(),
  attachments: z.array(AttachmentPayloadSchema).default([]),
  annotativeDirectives: z.array(z.string()).default([]),
  cp1Offset: z.object({ x: z.number(), y: z.number() }).default({ x: 80, y: 0 }),
  cp2Offset: z.object({ x: z.number(), y: z.number() }).default({ x: -80, y: 0 }),
})

export const CanvasStateSchema = z.object({
  nodes: z.array(CanvasNodeSchema).default([]),
  wires: z.array(CanvasWireSchema).default([]),
  viewport: z.object({
    x: z.number(),
    y: z.number(),
    scale: z.number(),
  }).default({ x: 0, y: 0, scale: 1 }),
  selectedNodeIds: z.array(z.string()).default([]),
  selectedWireId: z.string().nullable().default(null),
  generativeMode: z.enum(['idle', 'validating', 'compressing', 'generating', 'done', 'error']).default('idle'),
  rtlMode: z.boolean().default(false),
})

// ── Derived types ─────────────────────────────────────────────────────────────

export type AttachmentPayload = z.infer<typeof AttachmentPayloadSchema>
export type ContextPayload = z.infer<typeof ContextPayloadSchema>
export type HardlockFailure = z.infer<typeof HardlockFailureSchema>
export type CanvasNode = z.infer<typeof CanvasNodeSchema>
export type NodeStyle  = z.infer<typeof NodeStyleSchema>
export type CanvasWire = z.infer<typeof CanvasWireSchema>
export type CanvasState = z.infer<typeof CanvasStateSchema>
export type GenerativeMode = CanvasState['generativeMode']
export type WireType = CanvasWire['type']
export type NodeType = CanvasNode['type']

// ── Actions ───────────────────────────────────────────────────────────────────

interface CanvasActions {
  // Node CRUD
  addNode: (node: CanvasNode) => void
  updateNode: (id: string, patch: Partial<CanvasNode>) => void
  removeNode: (id: string) => void

  // Wire CRUD
  addWire: (wire: CanvasWire) => void
  removeWire: (id: string) => void
  updateWire: (id: string, patch: Partial<CanvasWire>) => void
  updateWireBezier: (id: string, cp1: { x: number; y: number }, cp2: { x: number; y: number }) => void

  // Attachment management
  attachAsset: (parentId: string, parentType: 'node' | 'wire', asset: AttachmentPayload) => void
  updateAssetVisionStatus: (assetId: string, status: AttachmentPayload['visionStatus']) => void

  // Generative pipeline
  hardlockCheck: (nodeId: string) => HardlockFailure[]
  aggregateContext: (wireId: string) => ContextPayload | null
  compressContext: (wireId: string, maxTokens?: number) => { compressedPayload: ContextPayload; tokenCount: number } | { error: string }
  triggerGeneration: (wireId: string) => Promise<void>

  // Canvas view
  setViewport: (x: number, y: number, scale: number) => void
  setRTLMode: (enabled: boolean) => void

  // Selection
  setSelectedNodeIds: (ids: string[]) => void
  setSelectedWireId: (id: string | null) => void
}

// ── Default state ─────────────────────────────────────────────────────────────

const defaultCanvasState: CanvasState = {
  nodes: [],
  wires: [],
  viewport: { x: 0, y: 0, scale: 1 },
  selectedNodeIds: [],
  selectedWireId: null,
  generativeMode: 'idle',
  rtlMode: false,
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useCanvasGraphStore = create<CanvasState & CanvasActions>()(
  persist(
    (set, get) => ({
      ...defaultCanvasState,

      // ── Node CRUD ─────────────────────────────────────────────────────────

      addNode: (node) =>
        set((state) => ({ nodes: [...state.nodes, CanvasNodeSchema.parse(node)] })),

      updateNode: (id, patch) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id ? CanvasNodeSchema.parse({ ...n, ...patch }) : n
          ),
        })),

      removeNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          wires: state.wires.filter((w) => w.fromNodeId !== id && w.toNodeId !== id),
          selectedNodeIds: state.selectedNodeIds.filter((sid) => sid !== id),
        })),

      // ── Wire CRUD ─────────────────────────────────────────────────────────

      addWire: (wire) =>
        set((state) => ({ wires: [...state.wires, CanvasWireSchema.parse(wire)] })),

      removeWire: (id) =>
        set((state) => ({
          wires: state.wires.filter((w) => w.id !== id),
          selectedWireId: state.selectedWireId === id ? null : state.selectedWireId,
        })),

      updateWire: (id, patch) =>
        set((state) => ({
          wires: state.wires.map((w) =>
            w.id === id ? CanvasWireSchema.parse({ ...w, ...patch }) : w
          ),
        })),

      updateWireBezier: (id, cp1, cp2) =>
        set((state) => ({
          wires: state.wires.map((w) =>
            w.id === id ? { ...w, cp1Offset: cp1, cp2Offset: cp2 } : w
          ),
        })),

      // ── Attachment management ─────────────────────────────────────────────

      attachAsset: (parentId, parentType, asset) => {
        const validated = AttachmentPayloadSchema.parse(asset)
        set((state) => {
          if (parentType === 'node') {
            return {
              nodes: state.nodes.map((n) =>
                n.id === parentId
                  ? { ...n, attachments: [...n.attachments, validated] }
                  : n
              ),
            }
          }
          return {
            wires: state.wires.map((w) =>
              w.id === parentId
                ? { ...w, attachments: [...w.attachments, validated] }
                : w
            ),
          }
        })
      },

      updateAssetVisionStatus: (assetId, status) =>
        set((state) => ({
          nodes: state.nodes.map((n) => ({
            ...n,
            attachments: n.attachments.map((a) =>
              a.id === assetId ? { ...a, visionStatus: status } : a
            ),
          })),
          wires: state.wires.map((w) => ({
            ...w,
            attachments: w.attachments.map((a) =>
              a.id === assetId ? { ...a, visionStatus: status } : a
            ),
          })),
        })),

      // ── Hardlock gate ─────────────────────────────────────────────────────

      hardlockCheck: (nodeId) => {
        const state = get()
        const node = state.nodes.find((n) => n.id === nodeId)
        if (!node) return []

        const failures: HardlockFailure[] = []

        if (!node.rtlCompliant) {
          failures.push({ type: 'rtl', message: 'RTL parity not verified on source node' })
        }

        if (!node.wcagCompliant) {
          failures.push({ type: 'wcag', message: 'WCAG AA compliance not verified on source node' })
        }

        const hasRejectedAsset = node.attachments.some((a) => a.visionStatus === 'rejected')
        if (hasRejectedAsset) {
          failures.push({ type: 'vision', message: 'One or more attachments failed Vision Gate' })
        }

        if (failures.length > 0) {
          set((s) => ({
            nodes: s.nodes.map((n) =>
              n.id === nodeId ? { ...n, hardlockFailures: failures } : n
            ),
          }))
        }

        return failures
      },

      // ── Context aggregation ───────────────────────────────────────────────

      aggregateContext: (wireId) => {
        const state = get()
        const wire = state.wires.find((w) => w.id === wireId)
        if (!wire) return null

        const sourceNode = state.nodes.find((n) => n.id === wire.fromNodeId)
        if (!sourceNode) return null

        const validWireAttachments = wire.attachments.filter(
          (a) => a.visionStatus === 'valid'
        )
        const validNodeAttachments = sourceNode.attachments.filter(
          (a) => a.visionStatus === 'valid'
        )

        const payload: ContextPayload = {
          sourceNodeId: sourceNode.id,
          sourceNodeAST: { blocks: [], nodeType: sourceNode.type, title: sourceNode.title },
          designTokens: {},
          attachedAssets: [...validNodeAttachments, ...validWireAttachments],
          annotativeDirectives: wire.annotativeDirectives,
        }

        return payload
      },

      // ── Context compression (3-tier) ──────────────────────────────────────

      compressContext: (wireId, maxTokens = DEFAULT_MAX_TOKENS) => {
        const state = get()
        const basePayload = state.aggregateContext(wireId)
        if (!basePayload) return { error: 'Wire or source node not found' }

        const result = compressPayload(basePayload, maxTokens)
        if (!result.ok) return { error: result.error }

        const compressedPayload = result.payload
        set((s) => ({
          wires: s.wires.map((w) =>
            w.id === wireId ? { ...w, contextPayload: compressedPayload } : w
          ),
        }))

        return { compressedPayload, tokenCount: result.tokenCount }
      },

      // ── Generation pipeline ───────────────────────────────────────────────

      triggerGeneration: async (wireId) => {
        const state = get()
        const wire = state.wires.find((w) => w.id === wireId)
        if (!wire) return

        set({ generativeMode: 'validating' })

        // Hardlock check on source node
        const failures = get().hardlockCheck(wire.fromNodeId)
        if (failures.length > 0) {
          set({ generativeMode: 'error' })
          return
        }

        // Check all wire attachments have passed vision gate
        const pendingOrRejected = wire.attachments.filter(
          (a) => a.visionStatus !== 'valid'
        )
        if (pendingOrRejected.length > 0) {
          set({ generativeMode: 'error' })
          return
        }

        set({ generativeMode: 'compressing' })

        const compressionResult = get().compressContext(wireId)
        if ('error' in compressionResult) {
          set({ generativeMode: 'error' })
          return
        }

        const { compressedPayload, tokenCount } = compressionResult
        set({ generativeMode: 'generating' })

        const targetNodeId = wire.toNodeId
        get().updateNode(targetNodeId, { generationStatus: 'generating' })

        try {
          const res = await fetch('/api/ai/generate-node', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wireId, compressedPayload, tokenCount }),
          })

          if (!res.ok) throw new Error(`Generation API returned ${res.status}`)

          const data = await res.json()
          get().updateNode(targetNodeId, {
            generationStatus: 'done',
          })
          set({ generativeMode: 'done' })

          if (data.blocks) {
            const currentNode = get().nodes.find((n) => n.id === targetNodeId)
            if (currentNode) {
              // Persist generated page session
              await fetch('/api/session/save-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageId: targetNodeId, blocks: data.blocks }),
              }).catch(() => {})
            }
          }
        } catch {
          get().updateNode(targetNodeId, { generationStatus: 'error' })
          set({ generativeMode: 'error' })
        }
      },

      // ── Viewport ──────────────────────────────────────────────────────────

      setViewport: (x, y, scale) => set({ viewport: { x, y, scale } }),

      setRTLMode: (enabled) => set({ rtlMode: enabled }),

      // ── Selection ─────────────────────────────────────────────────────────

      setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

      setSelectedWireId: (id) => set({ selectedWireId: id }),
    }),
    {
      name: 'nezam-ds:canvas-graph',
      partialize: (state) => ({
        nodes: state.nodes,
        wires: state.wires,
        viewport: state.viewport,
        rtlMode: state.rtlMode,
      }),
      // Zod parse on hydration — invalid persisted state resets to defaults
      merge: (persisted, current) => {
        try {
          const validated = CanvasStateSchema.partial().parse(persisted)
          return { ...current, ...validated }
        } catch {
          return { ...current, ...defaultCanvasState }
        }
      },
    }
  )
)
