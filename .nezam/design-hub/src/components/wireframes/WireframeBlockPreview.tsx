'use client'

import { memo } from 'react'
import { getBlockDescriptor } from '@/lib/wireframe/blockRegistry'
import { BlockPreview } from '@/lib/wireframe/block-preview-registry'
import { useDesignPreviewScopeStyle } from '@/lib/use-design-preview-scope'
import { cn } from '@/lib/utils'
import { LazyMountWhenVisible } from './LazyMountWhenVisible'

interface Props {
  blockType: string
  compact?: boolean
  className?: string
  /** Wireframes split layout: left column shows Nav_Sidebar strip at full column height. */
  sidebarColumn?: boolean
  /** When false, hide caption under preview (canvas slots show footer label instead). */
  showCaption?: boolean
  /** Defer mounting heavy preview until near viewport (palette + long canvases). */
  lazy?: boolean
  lazyRootMargin?: string
}

function WireframeBlockPreviewInner({
  blockType,
  compact = false,
  className,
  sidebarColumn = false,
  showCaption = true,
  lazy = false,
  lazyRootMargin,
}: Props) {
  const descriptor = getBlockDescriptor(blockType)
  const previewScopeStyle = useDesignPreviewScopeStyle({
    fillHeight: sidebarColumn,
    matchHubChrome: true,
  })

  const preview = (
    <div
      className={cn('w-full', sidebarColumn && 'flex min-h-0 flex-1 flex-col')}
      style={previewScopeStyle}
    >
      <BlockPreview
        blockType={blockType}
        compact={compact}
        sidebarColumn={sidebarColumn}
        className={sidebarColumn ? 'flex min-h-0 flex-1 flex-col' : undefined}
      />
    </div>
  )

  return (
    <div className={cn('w-full', sidebarColumn && 'flex min-h-0 flex-1 flex-col', className)}>
      {lazy ? (
        <LazyMountWhenVisible
          rootMargin={lazyRootMargin}
          className={sidebarColumn ? 'flex min-h-0 flex-1 flex-col' : undefined}
          placeholder={
            sidebarColumn ? (
              <div
                className="min-h-0 flex-1 w-full rounded-app-md border border-app-border/60 bg-app-bg/80 animate-pulse"
                aria-hidden
              />
            ) : undefined
          }
        >
          {preview}
        </LazyMountWhenVisible>
      ) : (
        preview
      )}
      {showCaption && descriptor ? (
        <div className="mt-1 px-1 text-[9px] text-app-subtle truncate">{descriptor.name}</div>
      ) : null}
    </div>
  )
}

export const WireframeBlockPreview = memo(WireframeBlockPreviewInner)
