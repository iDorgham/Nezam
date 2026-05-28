import BLOCK_REGISTRY from '../../../../templates/wireframe-server/block_registry.json'
import type { ArchProfileId } from '@/types/arch'
import { inferCanvasMode } from '@/lib/wireframe/canvas-mode'

export type WireframeBlockDescriptor = {
  type: string
  name: string
  description?: string
  canvas_modes?: string[]
  props?: Record<string, unknown>
}

export type WireframeBlockRegistry = {
  $schemaVersion?: string
  description?: string
  canvas_modes?: string[]
  blocks: Record<string, WireframeBlockDescriptor[]>
}

const registry = BLOCK_REGISTRY as WireframeBlockRegistry

export const BLOCK_CATEGORIES: string[] = Object.keys(registry.blocks)

export function getBlocksByCategory(category: string): WireframeBlockDescriptor[] {
  return registry.blocks[category] ?? []
}

export function getAllBlocks(): WireframeBlockDescriptor[] {
  return BLOCK_CATEGORIES.flatMap((cat) => getBlocksByCategory(cat))
}

export function getBlockDescriptor(type: string): WireframeBlockDescriptor | undefined {
  return getAllBlocks().find((b) => b.type === type)
}

export function getBlocksForProfile(profileId: ArchProfileId | null): WireframeBlockDescriptor[] {
  const mode = inferCanvasMode(profileId)
  return getAllBlocks().filter((block) => {
    const modes = block.canvas_modes ?? registry.canvas_modes ?? ['web', 'saas', 'mobile']
    return modes.includes(mode)
  })
}

export function getPaletteByCategory(profileId: ArchProfileId | null): Array<{
  category: string
  blocks: WireframeBlockDescriptor[]
}> {
  const allowed = new Set(getBlocksForProfile(profileId).map((b) => b.type))
  return BLOCK_CATEGORIES.map((category) => ({
    category,
    blocks: getBlocksByCategory(category).filter((b) => allowed.has(b.type)),
  })).filter((entry) => entry.blocks.length > 0)
}
