'use client'

import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatPaletteCategoryLabel } from '@/lib/wireframe/blockRegistry'
import type { WireframeBlockDescriptor } from '@/lib/wireframe/blockRegistry'
import { cn } from '@/lib/utils'
import { PaletteBlockButton } from './PaletteBlockButton'

type Props = {
  category: string
  blocks: WireframeBlockDescriptor[]
  expanded: boolean
  onToggle: () => void
  onAdd: (block: WireframeBlockDescriptor) => void
}

export function PaletteCategorySection({ category, blocks, expanded, onToggle, onAdd }: Props) {
  const label = formatPaletteCategoryLabel(category)

  return (
    <section aria-labelledby={`palette-cat-${category}`}>
      <button
        type="button"
        id={`palette-cat-${category}`}
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-app-sm px-1 py-2 text-left transition-colors hover:bg-app-surface-2"
        aria-expanded={expanded}
      >
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 text-app-muted transition-transform',
            !expanded && '-rotate-90',
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-wide text-app-text">
          {label}
        </span>
        <Badge variant="muted" className="shrink-0 text-[9px] tabular-nums">
          {blocks.length}
        </Badge>
      </button>

      {expanded ? (
        <div className="mt-2 flex flex-col gap-2 pl-2">
          {blocks.map((block) => (
            <PaletteBlockButton key={block.type} block={block} onAdd={onAdd} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
