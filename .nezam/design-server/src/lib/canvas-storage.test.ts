import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import type { CanvasNode } from '@/src/store/canvas-graph.store'
import { readCanvasState, upsertNode, writeCanvasState } from './canvas-storage'

function makeNode(overrides: Partial<CanvasNode> = {}): CanvasNode {
  return {
    id: 'page-1',
    type: 'page',
    title: 'Dashboard',
    x: 0,
    y: 0,
    width: 180,
    height: 80,
    rtlCompliant: false,
    wcagCompliant: false,
    hardlockFailures: [],
    locked: false,
    attachments: [],
    generationStatus: 'idle',
    ...overrides,
  }
}

describe('canvas-storage', () => {
  let dir: string
  let file: string

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'canvas-storage-'))
    file = join(dir, 'canvas.json')
  })

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  describe('readCanvasState', () => {
    it('returns default state when file does not exist', async () => {
      const state = await readCanvasState(file)
      expect(state).toEqual({
        nodes: [],
        wires: [],
        viewport: { x: 0, y: 0, scale: 1 },
      })
    })

    it('returns default state when JSON is invalid against schema', async () => {
      await writeFile(file, JSON.stringify({ nodes: 'not-an-array' }), 'utf-8')
      const state = await readCanvasState(file)
      expect(state.nodes).toEqual([])
      expect(state.viewport.scale).toBe(1)
    })

    it('round-trips a written state', async () => {
      const node = makeNode({ id: 'p-a', title: 'A', x: 10, y: 20 })
      await writeCanvasState({ nodes: [node], wires: [], viewport: { x: 5, y: 6, scale: 2 } }, file)
      const state = await readCanvasState(file)
      expect(state.nodes).toHaveLength(1)
      expect(state.nodes[0].id).toBe('p-a')
      expect(state.viewport).toEqual({ x: 5, y: 6, scale: 2 })
    })
  })

  describe('upsertNode', () => {
    it('inserts a new node when id does not exist', async () => {
      const node = makeNode({ id: 'p-new' })
      const next = await upsertNode(node, file)
      expect(next.nodes).toHaveLength(1)
      expect(next.nodes[0].id).toBe('p-new')

      const onDisk = JSON.parse(await readFile(file, 'utf-8'))
      expect(onDisk.nodes[0].id).toBe('p-new')
    })

    it('updates an existing node by id and preserves order', async () => {
      const a = makeNode({ id: 'a', title: 'A', x: 0 })
      const b = makeNode({ id: 'b', title: 'B', x: 100 })
      await writeCanvasState({ nodes: [a, b], wires: [], viewport: { x: 0, y: 0, scale: 1 } }, file)

      const updatedA = makeNode({ id: 'a', title: 'A-renamed', x: 42 })
      const next = await upsertNode(updatedA, file)

      expect(next.nodes).toHaveLength(2)
      expect(next.nodes[0]).toMatchObject({ id: 'a', title: 'A-renamed', x: 42 })
      expect(next.nodes[1]).toMatchObject({ id: 'b', title: 'B' })
    })

    it('throws when node fails schema validation', async () => {
      // Missing required `title` field
      const invalid = { id: 'bad', type: 'page', x: 0, y: 0 } as unknown as CanvasNode
      await expect(upsertNode(invalid, file)).rejects.toThrow()
    })
  })
})
