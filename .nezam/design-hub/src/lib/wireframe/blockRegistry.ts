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

/** Human-readable palette section titles (registry keys stay snake_case). */
export const PALETTE_CATEGORY_LABELS: Record<string, string> = {
  navigation: 'Navigation',
  hero: 'Hero',
  content: 'Content',
  forms: 'Forms',
  data: 'Data & charts',
  layout: 'Layout',
  artistic: 'Marketing (premium)',
}

export function formatPaletteCategoryLabel(category: string): string {
  return PALETTE_CATEGORY_LABELS[category] ?? category.replace(/_/g, ' ')
}

export function getBlocksByCategory(category: string): WireframeBlockDescriptor[] {
  return registry.blocks[category] ?? []
}

const ALL_BLOCKS = BLOCK_CATEGORIES.flatMap((cat) => getBlocksByCategory(cat))

const DESCRIPTOR_BY_TYPE = new Map<string, WireframeBlockDescriptor>(
  ALL_BLOCKS.map((block) => [block.type, block]),
)

export function getAllBlocks(): WireframeBlockDescriptor[] {
  return ALL_BLOCKS
}

export function getBlockDescriptor(type: string): WireframeBlockDescriptor | undefined {
  return DESCRIPTOR_BY_TYPE.get(type)
}

export function getBlocksForProfile(profileId: ArchProfileId | null): WireframeBlockDescriptor[] {
  const mode = inferCanvasMode(profileId)
  return getAllBlocks().filter((block) => {
    const modes = block.canvas_modes ?? registry.canvas_modes ?? ['web', 'saas', 'mobile']
    return modes.includes(mode)
  })
}

export function getPaletteByCategory(
  profileId: ArchProfileId | null,
  options?: { includeAllModes?: boolean },
): Array<{
  category: string
  blocks: WireframeBlockDescriptor[]
}> {
  const allowed = new Set(
    (options?.includeAllModes ? getAllBlocks() : getBlocksForProfile(profileId)).map((b) => b.type),
  )
  return BLOCK_CATEGORIES.map((category) => ({
    category,
    blocks: getBlocksByCategory(category).filter((b) => allowed.has(b.type)),
  })).filter((entry) => entry.blocks.length > 0)
}

export function countPaletteBlocks(
  profileId: ArchProfileId | null,
  options?: { includeAllModes?: boolean },
): number {
  return getPaletteByCategory(profileId, options).reduce((sum, cat) => sum + cat.blocks.length, 0)
}
