import { getAllBlocks } from '@/lib/wireframe/blockRegistry'
import {
  BLOCK_PREVIEW_TYPES,
  hasBlockPreview,
} from '@/lib/wireframe/block-preview-registry'

/** Block types with dedicated shadcn miniature preview renderers */
export const BLOCK_TYPES_WITH_PREVIEW = BLOCK_PREVIEW_TYPES

export type BlockTypeWithPreview = (typeof BLOCK_TYPES_WITH_PREVIEW)[number]

export function hasDedicatedPreview(blockType: string): boolean {
  return hasBlockPreview(blockType)
}

export function getAllRegistryBlockTypes(): string[] {
  return getAllBlocks().map((b) => b.type)
}
