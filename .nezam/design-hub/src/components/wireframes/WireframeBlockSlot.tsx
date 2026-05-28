'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WireframeBlockPreview } from './WireframeBlockPreview'
import { getBlockDescriptor } from '@/lib/wireframe/blockRegistry'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type PageSessionSection = {
  section_id: string
  block_type: string
  order: number
  approved: boolean
}

interface Props {
  section: PageSessionSection
  onRemove: (sectionId: string) => void
  onToggleApproved: (sectionId: string, nextApproved: boolean) => void
}

export function WireframeBlockSlot({ section, onRemove, onToggleApproved }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.section_id,
  })

  const descriptor = getBlockDescriptor(section.block_type)
  const label = descriptor?.name ?? section.block_type

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative z-[1] rounded-app-md border border-app-border/80 bg-app-surface/40 overflow-hidden',
        isDragging && 'opacity-90 shadow-md ring-2 ring-app-accent/20 z-10',
        section.approved && 'ring-1 ring-app-success/25',
        !section.approved && !isDragging && 'opacity-90',
      )}
    >
      <div className="relative px-3 pt-3 pb-3">
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={section.approved}
              onChange={(e) => onToggleApproved(section.section_id, e.target.checked)}
              className="h-3.5 w-3.5 accent-app-accent"
              title="Approve block"
            />
            <span className="sr-only">Approve block</span>
          </label>
          <button
            type="button"
            onClick={() => onRemove(section.section_id)}
            className="h-7 px-2.5 rounded-app-sm border border-app-border bg-app-surface text-[10px] text-app-subtle hover:text-app-text hover:bg-app-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          >
            Remove
          </button>
        </div>

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing select-none rounded-app-sm border border-app-border bg-app-surface px-2 py-1 text-[10px] text-app-muted hover:text-app-text hover:bg-app-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          title="Drag to reorder"
        >
          ⋮⋮
        </button>

        <div className="pt-7">
          <WireframeBlockPreview
            blockType={section.block_type}
            showCaption={false}
            className="opacity-[0.98]"
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 px-1">
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-[9px] font-mono text-app-subtle tabular-nums shrink-0">
              #{section.order + 1}
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-app-text truncate">{label}</div>
              <div className="text-[9px] text-app-subtle font-mono truncate">{section.block_type}</div>
            </div>
          </div>
          {section.approved ? (
            <Badge variant="success" className="shrink-0 text-[8px]">
              Approved
            </Badge>
          ) : (
            <Badge variant="muted" className="shrink-0 text-[8px]">
              Draft
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
