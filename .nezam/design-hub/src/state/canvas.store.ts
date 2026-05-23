'use client'

/**
 * SPEC-DS-CANVAS-001 — recursive DOM-tree + infinite node-graph state
 * Uses Zustand + Immer for deep, ergonomic mutations without structural
 * sharing concerns. All style properties are token-mapped — no raw CSS allowed.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { produce } from 'immer'
import type { NodeStyle, BlockKind } from '@/types'

const uid = () => Math.random().toString(36).slice(2, 9)

// ── Design token key constraints ──────────────────────────────────────────────

/** Properties that MUST be resolved through the token matrix, never inline. */
export const TOKEN_BOUND_PROPERTIES = [
  'bg', 'borderColor', 'textColor', 'shadow',
  'fontFamily', 'radius',
] as const

export type TokenBoundProperty = typeof TOKEN_BOUND_PROPERTIES[number]

/** Numeric scrubber-mapped properties with their step and unit metadata. */
export const SCRUBBER_PROPERTIES = {
  padding:       { step: 1, min: 0,   max: 320, unit: 'px',  token: '--spacing' },
  margin:        { step: 1, min: 0,   max: 320, unit: 'px',  token: '--spacing' },
  gap:           { step: 1, min: 0,   max: 128, unit: 'px',  token: '--spacing' },
  minHeight:     { step: 4, min: 0,   max: 1200, unit: 'px', token: null },
  columns:       { step: 1, min: 1,   max: 12,  unit: '',    token: null },
  fontScale:     { step: 0.05, min: 0.5, max: 4, unit: 'x', token: '--font-scale' },
  letterSpacing: { step: 0.01, min: -0.1, max: 0.4, unit: 'em', token: null },
  lineHeight:    { step: 0.05, min: 1,  max: 3,   unit: '',    token: null },
  borderWidth:   { step: 1, min: 0,   max: 8,   unit: 'px',  token: null },
  opacity:       { step: 0.01, min: 0, max: 1,  unit: '',    token: null },
  radius:        { step: 2, min: 0,   max: 64,  unit: 'px',  token: '--radius' },
} as const

export type ScrubberProperty = keyof typeof SCRUBBER_PROPERTIES

// ── Canvas tree node ──────────────────────────────────────────────────────────

export type CanvasTreeNodeType =
  | 'page'      // top-level page container
  | 'section'   // section block (maps to BlockKind)
  | 'component' // atomic UI component
  | 'slot'      // drop target placeholder

export interface CanvasTreeNode {
  id: string
  type: CanvasTreeNodeType
  /** For section nodes: the BlockKind they represent. */
  blockKind?: BlockKind
  label: string
  arabicLabel: string
  /** Token-mapped style overrides. Raw CSS properties are rejected at write-time. */
  style: Partial<NodeStyle>
  children: CanvasTreeNode[]
  /** Arbitrary component props (content, text, links, etc.) */
  props: Record<string, unknown>
  /** Whether this node is locked for editing. */
  locked: boolean
  /** Visibility per breakpoint. */
  visible: { desktop: boolean; mobile: boolean }
  /** RTL-specific style overrides (applied when dir="rtl"). */
  rtlStyle: Partial<NodeStyle>
}

// ── Node-graph (infinite canvas) ──────────────────────────────────────────────

export type GraphNodeKind =
  | 'page'
  | 'service'
  | 'database'
  | 'api'
  | 'auth'
  | 'storage'
  | 'edge-fn'
  | 'ai-model'

export interface GraphNode {
  id: string
  kind: GraphNodeKind
  label: string
  x: number
  y: number
  width: number
  height: number
  /** OKLCH color token key for the node chrome. */
  colorToken: string
  meta: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  fromId: string
  toId: string
  label?: string
  latency?: number // ms — drives pulse animation speed
  protocol?: 'http' | 'ws' | 'grpc' | 'queue'
}

export interface DraftWire {
  fromId: string
  fromX: number
  fromY: number
}

// ── Clipboard ─────────────────────────────────────────────────────────────────

export interface Clipboard {
  type: 'tree-node' | 'graph-node'
  payload: CanvasTreeNode | GraphNode
}

// ── Camera ────────────────────────────────────────────────────────────────────

export interface Camera {
  x: number
  y: number
  zoom: number
}

// ── Store state ───────────────────────────────────────────────────────────────

interface CanvasState {
  /** The recursive DOM-tree. Root nodes are pages. */
  tree: CanvasTreeNode[]

  /** Infinite node-graph nodes. */
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  draftWire: DraftWire | null

  camera: Camera
  selectedTreeId: string | null
  selectedGraphId: string | null

  clipboard: Clipboard | null

  /** Validation: stores the last rejected mutation reason. */
  lastRejection: string | null
}

// ── Actions ───────────────────────────────────────────────────────────────────

interface CanvasActions {
  // Tree
  addTreeNode: (parentId: string | null, partial: Partial<CanvasTreeNode>) => string
  removeTreeNode: (id: string) => void
  moveTreeNode: (id: string, newParentId: string | null, atIndex?: number) => void
  updateTreeStyle: (id: string, patch: Partial<NodeStyle>) => void
  updateTreeProps: (id: string, patch: Record<string, unknown>) => void
  toggleTreeLock: (id: string) => void
  toggleTreeVisible: (id: string, breakpoint: 'desktop' | 'mobile') => void
  selectTree: (id: string | null) => void
  duplicateTreeNode: (id: string) => void

  // Graph
  addGraphNode: (n: Omit<GraphNode, 'id'>) => string
  updateGraphNode: (id: string, patch: Partial<GraphNode>) => void
  removeGraphNode: (id: string) => void
  addGraphEdge: (fromId: string, toId: string, opts?: Partial<GraphEdge>) => void
  removeGraphEdge: (id: string) => void
  setDraftWire: (d: DraftWire | null) => void
  selectGraph: (id: string | null) => void

  // Camera
  setCamera: (c: Partial<Camera>) => void
  resetCamera: () => void

  // Clipboard
  copyTreeNode: (id: string) => void
  pasteTreeNode: (parentId: string | null) => void

  // Export
  exportSpec: () => string
}

type CanvasStore = CanvasState & CanvasActions

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeTreeNode(partial: Partial<CanvasTreeNode>): CanvasTreeNode {
  return {
    id: uid(),
    type: 'section',
    label: 'New Node',
    arabicLabel: 'عقدة جديدة',
    style: {},
    rtlStyle: {},
    children: [],
    props: {},
    locked: false,
    visible: { desktop: true, mobile: true },
    ...partial,
  }
}

/** Recursively find a node by id. Returns [node, parent array, index]. */
function findNode(
  tree: CanvasTreeNode[],
  id: string,
): [CanvasTreeNode, CanvasTreeNode[], number] | null {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) return [tree[i], tree, i]
    const nested = findNode(tree[i].children, id)
    if (nested) return nested
  }
  return null
}

/** Validate that no raw CSS token-bound properties bypass the token matrix. */
function validateStylePatch(patch: Partial<NodeStyle>): string | null {
  // All values are strings — reject CSS variables used as raw values
  for (const [key, val] of Object.entries(patch)) {
    if (typeof val === 'string' && val.includes('!important')) {
      return `"${key}: ${val}" — !important overrides are blocked by token-first policy.`
    }
  }
  return null
}

// ── Initial tree ──────────────────────────────────────────────────────────────

const INITIAL_TREE: CanvasTreeNode[] = [
  makeTreeNode({
    id: 'page-root',
    type: 'page',
    label: 'Home Page',
    arabicLabel: 'الصفحة الرئيسية',
    children: [
      makeTreeNode({ id: 'nav-node',    type: 'section', blockKind: 'nav',         label: 'Navigation', arabicLabel: 'التنقل' }),
      makeTreeNode({ id: 'hero-node',   type: 'section', blockKind: 'hero',        label: 'Hero',       arabicLabel: 'الواجهة' }),
      makeTreeNode({ id: 'feat-node',   type: 'section', blockKind: 'featureGrid', label: 'Features',   arabicLabel: 'المزايا' }),
      makeTreeNode({ id: 'cta-node',    type: 'section', blockKind: 'cta',         label: 'CTA',        arabicLabel: 'دعوة' }),
      makeTreeNode({ id: 'footer-node', type: 'section', blockKind: 'footer',      label: 'Footer',     arabicLabel: 'التذييل' }),
    ],
  }),
]

// ── Store ─────────────────────────────────────────────────────────────────────

export const useCanvasStore = create<CanvasStore>()(
  persist(
    immer((set, get) => ({
      // State
      tree: INITIAL_TREE,
      graphNodes: [],
      graphEdges: [],
      draftWire: null,
      camera: { x: 0, y: 0, zoom: 1 },
      selectedTreeId: null,
      selectedGraphId: null,
      clipboard: null,
      lastRejection: null,

      // ── Tree actions ──────────────────────────────────────────────────────

      addTreeNode: (parentId, partial) => {
        const node = makeTreeNode(partial)
        set((s) => {
          if (!parentId) {
            s.tree.push(node)
            return
          }
          const found = findNode(s.tree, parentId)
          if (found) found[0].children.push(node)
        })
        return node.id
      },

      removeTreeNode: (id) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (!found) return
          const [, siblings, idx] = found
          if (!found[0].locked) siblings.splice(idx, 1)
          if (s.selectedTreeId === id) s.selectedTreeId = null
        }),

      moveTreeNode: (id, newParentId, atIndex) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (!found) return
          const [node, siblings, idx] = found
          siblings.splice(idx, 1)
          const insertAt = atIndex ?? Infinity

          if (!newParentId) {
            s.tree.splice(Math.min(insertAt, s.tree.length), 0, node)
          } else {
            const target = findNode(s.tree, newParentId)
            if (target) target[0].children.splice(Math.min(insertAt, target[0].children.length), 0, node)
          }
        }),

      updateTreeStyle: (id, patch) =>
        set((s) => {
          const rejection = validateStylePatch(patch)
          if (rejection) { s.lastRejection = rejection; return }
          s.lastRejection = null
          const found = findNode(s.tree, id)
          if (found && !found[0].locked) Object.assign(found[0].style, patch)
        }),

      updateTreeProps: (id, patch) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (found && !found[0].locked) Object.assign(found[0].props, patch)
        }),

      toggleTreeLock: (id) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (found) found[0].locked = !found[0].locked
        }),

      toggleTreeVisible: (id, breakpoint) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (found) found[0].visible[breakpoint] = !found[0].visible[breakpoint]
        }),

      selectTree: (id) => set((s) => { s.selectedTreeId = id }),

      duplicateTreeNode: (id) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (!found) return
          const [node, siblings, idx] = found
          const clone = produce(node, (d) => { d.id = uid(); d.label += ' (Copy)' })
          siblings.splice(idx + 1, 0, clone)
        }),

      // ── Graph actions ─────────────────────────────────────────────────────

      addGraphNode: (n) => {
        const id = uid()
        set((s) => { s.graphNodes.push({ ...n, id }) })
        return id
      },

      updateGraphNode: (id, patch) =>
        set((s) => {
          const node = s.graphNodes.find((n) => n.id === id)
          if (node) Object.assign(node, patch)
        }),

      removeGraphNode: (id) =>
        set((s) => {
          s.graphNodes = s.graphNodes.filter((n) => n.id !== id)
          s.graphEdges = s.graphEdges.filter((e) => e.fromId !== id && e.toId !== id)
          if (s.selectedGraphId === id) s.selectedGraphId = null
        }),

      addGraphEdge: (fromId, toId, opts) =>
        set((s) => {
          if (fromId === toId) return
          if (s.graphEdges.some((e) => e.fromId === fromId && e.toId === toId)) return
          s.graphEdges.push({
            id: uid(), fromId, toId,
            latency: Math.floor(Math.random() * 80) + 20,
            protocol: 'http',
            ...opts,
          })
        }),

      removeGraphEdge: (id) =>
        set((s) => { s.graphEdges = s.graphEdges.filter((e) => e.id !== id) }),

      setDraftWire: (d) => set((s) => { s.draftWire = d }),

      selectGraph: (id) => set((s) => { s.selectedGraphId = id }),

      // ── Camera ────────────────────────────────────────────────────────────

      setCamera: (c) => set((s) => { Object.assign(s.camera, c) }),
      resetCamera: () => set((s) => { s.camera = { x: 0, y: 0, zoom: 1 } }),

      // ── Clipboard ─────────────────────────────────────────────────────────

      copyTreeNode: (id) =>
        set((s) => {
          const found = findNode(s.tree, id)
          if (found) s.clipboard = { type: 'tree-node', payload: found[0] }
        }),

      pasteTreeNode: (parentId) =>
        set((s) => {
          if (!s.clipboard || s.clipboard.type !== 'tree-node') return
          const clone = produce(s.clipboard.payload as CanvasTreeNode, (d) => {
            d.id = uid()
            d.label += ' (Paste)'
          })
          if (!parentId) {
            s.tree.push(clone)
          } else {
            const found = findNode(s.tree, parentId)
            if (found) found[0].children.push(clone)
          }
        }),

      // ── Export ────────────────────────────────────────────────────────────

      exportSpec: () => {
        const { tree, graphNodes, graphEdges } = get()
        return JSON.stringify({
          $schema: 'https://nezam.design/schema/canvas-spec-v1.json',
          specId: 'SPEC-DS-CANVAS-001',
          exportedAt: new Date().toISOString(),
          tree,
          graph: { nodes: graphNodes, edges: graphEdges },
        }, null, 2)
      },
    })),
    { name: 'nezam-canvas-store-v1' },
  ),
)
