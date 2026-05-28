'use client'

import {
  ART_SHADCN_BLOCK_PREVIEW_TYPES,
  hasArtShadcnBlockPreview,
  renderArtShadcnBlockPreview,
} from '@/lib/wireframe/art-shadcn-block-previews'
import {
  SHADCN_BLOCK_PREVIEW_TYPES,
  ShadcnBlockPreview,
  hasShadcnBlockPreview,
} from '@/lib/wireframe/shadcn-block-previews'

export const BLOCK_PREVIEW_TYPES = [
  ...SHADCN_BLOCK_PREVIEW_TYPES,
  ...ART_SHADCN_BLOCK_PREVIEW_TYPES,
] as const

export type BlockPreviewType = (typeof BLOCK_PREVIEW_TYPES)[number]

const MERGED_PREVIEW_SET = new Set<string>(BLOCK_PREVIEW_TYPES)

export function hasBlockPreview(blockType: string): boolean {
  return MERGED_PREVIEW_SET.has(blockType)
}

export function BlockPreview({
  blockType,
  compact = false,
  className,
}: {
  blockType: string
  compact?: boolean
  className?: string
}) {
  if (hasArtShadcnBlockPreview(blockType)) {
    const art = renderArtShadcnBlockPreview(blockType, { compact })
    if (art) {
      return <div className={className}>{art}</div>
    }
  }

  if (hasShadcnBlockPreview(blockType)) {
    return <ShadcnBlockPreview blockType={blockType} compact={compact} className={className} />
  }

  return <ShadcnBlockPreview blockType={blockType} compact={compact} className={className} />
}

/** @deprecated Use hasBlockPreview */
export function hasDedicatedPreview(blockType: string): boolean {
  return hasBlockPreview(blockType)
}

export { SHADCN_BLOCK_PREVIEW_TYPES, ART_SHADCN_BLOCK_PREVIEW_TYPES }
