'use client'

import { create } from 'zustand'

const uid = () => Math.random().toString(36).slice(2, 9)

export type NodeType = 'page' | 'neon' | 'better-auth' | 'redis' | 'cf-workers' | 'gemini'

export interface CanvasNode {
  id: string
  type: NodeType
  label: string
  x: number // world-space px
  y: number
  width: number
  height: number
}

export interface CanvasEdge {
  id: string
  fromNodeId: string
  toNodeId: string
  latency: number // simulated ms for pulse animation
}

/** Stable start position of an in-progress wire drag. toX/toY tracked via direct DOM. */
export interface DraftWire {
  fromNodeId: string
  fromX: number // world space — snapshot of socket pos at drag start
  fromY: number
}

export interface CameraState {
  panX: number
  panY: number
  scale: number
}

export interface ContextMenuState {
  screenX: number
  screenY: number
  worldX: number
  worldY: number
}

interface CanvasGraphState {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  draftWire: DraftWire | null
  camera: CameraState
  selectedNodeId: string | null
  contextMenu: ContextMenuState | null
}

interface CanvasGraphActions {
  setCamera: (c: CameraState) => void
  addNode: (n: Omit<CanvasNode, 'id'>) => string
  updateNodePosition: (id: string, x: number, y: number) => void
  removeNode: (id: string) => void
  addEdge: (fromNodeId: string, toNodeId: string) => void
  removeEdge: (id: string) => void
  setDraftWire: (d: DraftWire | null) => void
  selectNode: (id: string | null) => void
  openContextMenu: (menu: ContextMenuState) => void
  closeContextMenu: () => void
}

type Store = CanvasGraphState & CanvasGraphActions

// Seeded initial sitemap — visible immediately on first open
const INITIAL_NODES: CanvasNode[] = [
  { id: 'home',    type: 'page', label: 'Home',       x: 120, y: 220, width: 180, height: 80 },
  { id: 'about',   type: 'page', label: 'About',      x: 420, y: 100, width: 180, height: 80 },
  { id: 'blog',    type: 'page', label: 'Blog',       x: 420, y: 340, width: 180, height: 80 },
  { id: 'contact', type: 'page', label: 'Contact',    x: 720, y: 220, width: 180, height: 80 },
  { id: 'db',      type: 'neon', label: 'Neon DB',    x: 420, y: 560, width: 180, height: 80 },
]

const INITIAL_EDGES: CanvasEdge[] = [
  { id: 'e1', fromNodeId: 'home',  toNodeId: 'about',   latency: 42 },
  { id: 'e2', fromNodeId: 'home',  toNodeId: 'blog',    latency: 67 },
  { id: 'e3', fromNodeId: 'about', toNodeId: 'contact', latency: 28 },
  { id: 'e4', fromNodeId: 'blog',  toNodeId: 'contact', latency: 94 },
  { id: 'e5', fromNodeId: 'blog',  toNodeId: 'db',      latency: 18 },
]

export const useCanvasGraph = create<Store>()((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  draftWire: null,
  camera: { panX: 80, panY: 80, scale: 1 },
  selectedNodeId: null,
  contextMenu: null,

  setCamera: (c) => set({ camera: c }),

  addNode: (n) => {
    const id = uid()
    set((s) => ({ nodes: [...s.nodes, { ...n, id }] }))
    return id
  },

  updateNodePosition: (id, x, y) =>
    set((s) => ({ nodes: s.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)) })),

  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.fromNodeId !== id && e.toNodeId !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    })),

  addEdge: (fromNodeId, toNodeId) => {
    const { edges } = get()
    if (
      fromNodeId === toNodeId ||
      edges.some((e) => e.fromNodeId === fromNodeId && e.toNodeId === toNodeId)
    ) return
    set((s) => ({
      edges: [
        ...s.edges,
        { id: uid(), fromNodeId, toNodeId, latency: Math.floor(Math.random() * 80) + 20 },
      ],
    }))
  },

  removeEdge: (id) => set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),

  setDraftWire: (d) => set({ draftWire: d }),

  selectNode: (id) => set({ selectedNodeId: id }),

  openContextMenu: (menu) => set({ contextMenu: menu }),

  closeContextMenu: () => set({ contextMenu: null }),
}))
