'use client'

import type { KeyboardEvent } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { BlockPreview } from '@/lib/wireframe/block-preview-registry'
import type { WireframeBlockDescriptor } from '@/lib/wireframe/blockRegistry'
import { useDesignPreviewScopeStyle } from '@/lib/use-design-preview-scope'
import { cn } from '@/lib/utils'
import { LazyMountWhenVisible } from './LazyMountWhenVisible'

type Props = {
  block: WireframeBlockDescriptor
  onAdd: (block: WireframeBlockDescriptor) => void
}

export function PaletteBlockButton({ block, onAdd }: Props) {
  const palettePreviewScopeStyle = useDesignPreviewScopeStyle({ fillHeight: false, matchHubChrome: true })
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${block.type}`,
    data: { type: 'palette-block', blockType: block.type },
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex w-full gap-2.5 rounded-app-md border border-app-border bg-app-surface p-2 text-left transition-colors',
        'hover:border-app-accent/40 hover:bg-app-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent/50',
        isDragging && 'opacity-50',
      )}
      onClick={() => onAdd(block)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onAdd(block)
        }
      }}
      title={block.description ?? block.name}
      {...listeners}
      {...attributes}
    >
      <div
        className="h-[76px] w-[92px] shrink-0 overflow-hidden rounded-app-sm border border-app-border/80 bg-app-deep"
        style={palettePreviewScopeStyle}
      >
        <LazyMountWhenVisible rootMargin="120px" className="h-full w-full">
          <div className="h-[180px] w-[220px] origin-top-left scale-[0.42]">
            <BlockPreview blockType={block.type} compact className="h-full w-full" />
          </div>
        </LazyMountWhenVisible>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
        <span className="line-clamp-2 text-xs font-medium leading-snug text-app-fg">{block.name}</span>
        {block.description ? (
          <span className="line-clamp-2 text-[10px] leading-snug text-app-muted">{block.description}</span>
        ) : (
          <span className="truncate font-mono text-[10px] text-app-subtle">{block.type}</span>
        )}
      </div>
    </div>
  )
}
