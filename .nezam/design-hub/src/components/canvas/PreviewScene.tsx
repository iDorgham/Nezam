'use client'

import { useState } from 'react'
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
      {/* Drag handle — floats top-left on hover */}
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

/** The preview composition — renders the active archetype's ordered blocks with viewport drag-and-drop. */
export function PreviewScene() {
  const blocks = useHub((s) => s.blocks)
  const pageStyle = useHub((s) => s.pageStyle)
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
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div
          data-anim-root
          data-node="page"
          className="mx-auto w-full"
          style={{
            maxWidth: pageStyle.width,
            padding: pageStyle.padding,
            background: pageStyle.bg,
            display: 'grid',
          }}
        >
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
