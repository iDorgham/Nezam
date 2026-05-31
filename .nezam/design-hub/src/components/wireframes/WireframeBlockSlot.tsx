'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
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
  /** Left column in sidebar-shell canvas: preview fills column height. */
  sidebarColumn?: boolean
}

export function WireframeBlockSlot({ section, onRemove, onToggleApproved, sidebarColumn = false }: Props) {
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
        'group',
        sidebarColumn
          ? 'flex h-full min-h-0 flex-col'
          : 'border-b border-app-border/60 pb-4 last:border-b-0 last:pb-0',
        isDragging && 'z-10 opacity-90',
      )}
    >
      <div className="mb-2 flex shrink-0 items-start gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-0.5 flex h-8 w-7 shrink-0 cursor-grab items-center justify-center rounded-app-sm border border-app-border bg-app-surface text-app-muted hover:bg-app-elevated hover:text-app-text active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-[10px] font-mono tabular-nums text-app-subtle">#{section.order + 1}</span>
            <span className="truncate text-sm font-medium text-app-text">{label}</span>
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
          <p className="mt-0.5 truncate font-mono text-[10px] text-app-subtle">{section.block_type}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={section.approved}
              onChange={(e) => onToggleApproved(section.section_id, e.target.checked)}
              className="h-3.5 w-3.5 accent-app-accent"
              title="Approve block"
            />
            <span className="text-[10px] text-app-subtle">Approve</span>
          </label>
          <button
            type="button"
            onClick={() => onRemove(section.section_id)}
            className="h-7 rounded-app-sm border border-app-border bg-app-surface px-2.5 text-[10px] text-app-subtle transition-colors hover:bg-app-elevated hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent"
          >
            Remove
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-app-md border border-app-border bg-app-surface',
          section.approved && 'ring-1 ring-app-success/20',
          sidebarColumn && 'flex min-h-0 flex-1 flex-col',
        )}
      >
        <WireframeBlockPreview
          blockType={section.block_type}
          sidebarColumn={sidebarColumn}
          showCaption={false}
          lazy
          lazyRootMargin="200px"
          className={sidebarColumn ? 'flex min-h-0 flex-1 flex-col' : undefined}
        />
      </div>
    </div>
  )
}
