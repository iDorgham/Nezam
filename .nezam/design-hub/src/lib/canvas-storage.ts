import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname } from 'path'
import {
  CanvasNodeSchema,
  CanvasStateSchema,
  type CanvasNode,
  type CanvasState,
} from '@/src/store/canvas-graph.store'
import { getCanvasSessionPath } from '@/lib/paths'

const defaultPersistedState: Pick<CanvasState, 'nodes' | 'wires' | 'viewport'> = {
  nodes: [],
  wires: [],
  viewport: { x: 0, y: 0, scale: 1 },
}

const PersistedCanvasSchema = CanvasStateSchema.pick({
  nodes: true,
  wires: true,
  viewport: true,
})

export type PersistedCanvasState = typeof defaultPersistedState

export async function readCanvasState(
  filePath: string = getCanvasSessionPath(),
): Promise<PersistedCanvasState> {
  let raw: string
  try {
    raw = await readFile(filePath, 'utf-8')
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return { ...defaultPersistedState }
    }
    throw err
  }

  const parsed = PersistedCanvasSchema.safeParse(JSON.parse(raw))
  return parsed.success ? parsed.data : { ...defaultPersistedState }
}

export async function writeCanvasState(
  state: PersistedCanvasState,
  filePath: string = getCanvasSessionPath(),
): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(state, null, 2), 'utf-8')
}

export async function upsertNode(
  node: CanvasNode,
  filePath: string = getCanvasSessionPath(),
): Promise<PersistedCanvasState> {
  const validated = CanvasNodeSchema.parse(node)
  const current = await readCanvasState(filePath)

  const idx = current.nodes.findIndex((n) => n.id === validated.id)
  const nodes =
    idx === -1
      ? [...current.nodes, validated]
      : current.nodes.map((n, i) => (i === idx ? validated : n))

  const next: PersistedCanvasState = { ...current, nodes }
  await writeCanvasState(next, filePath)
  return next
}
