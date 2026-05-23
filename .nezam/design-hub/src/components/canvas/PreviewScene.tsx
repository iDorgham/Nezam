'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { RenderBlock } from './blocks'
import { cn } from '@/lib/cn'
import type { Block } from '@/types'

const pageGridStyle = (pageStyle: { width: number; padding: number; bg?: string }) => ({
  maxWidth: pageStyle.width,
  padding: pageStyle.padding,
  background: pageStyle.bg,
  display: 'grid' as const,
})

// ── Static block (no DnD) — used for SSR ─────────────────────────────────────

function StaticBlock({ block }: { block: Block }) {
  return (
    <div className="group relative">
      <RenderBlock block={block} />
    </div>
  )
}

// ── Draggable block (DnD) — client-only ──────────────────────────────────────

function DraggableBlock({ block, isOverlay = false }: { block: Block; isOverlay?: boolean }) {
  const meta = useHub((s) => s.getBlockMeta(block.id))
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: meta.locked,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('group relative', isDragging && 'opacity-40')}
    >
      {!meta.locked && (
        <button
          {...attributes}
          {...listeners}
          className={cn(
            'absolute left-2 top-2 z-10 flex h-7 w-7 cursor-grab touch-none items-center justify-center rounded-md bg-app-surface/80 text-app-subtle shadow-app-sm backdrop-blur-sm transition-opacity active:cursor-grabbing',
            isOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
          aria-label="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>
      )}
      <RenderBlock block={block} />
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

/** Renders blocks during SSR without any DnD context to avoid aria-describedby hydration mismatches. */
function StaticScene({ blocks, pageStyle }: { blocks: Block[]; pageStyle: { width: number; padding: number; bg?: string } }) {
  return (
    <div data-anim-root data-node="page" className="mx-auto w-full" style={pageGridStyle(pageStyle)}>
      {blocks.map((block) => (
        <StaticBlock key={block.id} block={block} />
      ))}
    </div>
  )
}

/** Full DnD-enabled scene — only rendered after client hydration. */
function DndScene({ blocks, pageStyle }: { blocks: Block[]; pageStyle: { width: number; padding: number; bg?: string } }) {
  const reorderBlocks = useHub((s) => s.reorderBlocks)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const activeBlock = blocks.find((b) => b.id === activeId) ?? null
  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const fromIdx = blocks.findIndex((b) => b.id === active.id)
    const toIdx = blocks.findIndex((b) => b.id === over.id)
    if (fromIdx !== -1 && toIdx !== -1) reorderBlocks(fromIdx, toIdx)
  }

  return (
    <DndContext
      id="preview-scene"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div data-anim-root data-node="page" className="mx-auto w-full" style={pageGridStyle(pageStyle)}>
          {blocks.map((block) => (
            <DraggableBlock key={block.id} block={block} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
        {activeBlock && <DraggableBlock block={activeBlock} isOverlay />}
      </DragOverlay>
    </DndContext>
  )
}

export function PreviewScene() {
  const blocks = useHub((s) => s.blocks)
  const pageStyle = useHub((s) => s.pageStyle)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted
    ? <DndScene blocks={blocks} pageStyle={pageStyle} />
    : <StaticScene blocks={blocks} pageStyle={pageStyle} />
}
