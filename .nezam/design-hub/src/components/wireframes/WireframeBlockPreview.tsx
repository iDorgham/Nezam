'use client'

import { getBlockDescriptor } from '@/lib/wireframe/blockRegistry'
import { BlockPreview } from '@/lib/wireframe/block-preview-registry'
import { cn } from '@/lib/utils'

interface Props {
  blockType: string
  compact?: boolean
  className?: string
  /** When false, hide caption under preview (canvas slots show footer label instead). */
  showCaption?: boolean
}

export function WireframeBlockPreview({
  blockType,
  compact = false,
  className,
  showCaption = true,
}: Props) {
  const descriptor = getBlockDescriptor(blockType)

  return (
    <div className={cn('w-full', className)}>
      <BlockPreview blockType={blockType} compact={compact} />
      {showCaption && descriptor ? (
        <div className="mt-1 px-1 text-[9px] text-app-subtle truncate">{descriptor.name}</div>
      ) : null}
    </div>
  )
}
