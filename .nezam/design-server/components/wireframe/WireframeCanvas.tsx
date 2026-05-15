'use client'

import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import BlockSlot from './BlockSlot'
import { useApprovalStore } from '@/lib/store/approval.store'

interface BlockInstance {
  id: string
  type: string
  name: string
}

interface WireframeCanvasProps {
  pageId: string
  blocks: BlockInstance[]
  setBlocks: (blocks: BlockInstance[]) => void
  selectedBlockId: string | null
  setSelectedBlockId: (id: string | null) => void
}

export default function WireframeCanvas({ pageId, blocks, setBlocks, selectedBlockId, setSelectedBlockId }: WireframeCanvasProps) {
  const { approvedBlocks, approveBlock, unapproveBlock } = useApprovalStore()
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((item) => item.id === active.id)
      const newIndex = blocks.findIndex((item) => item.id === over.id)

      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }

  const pageApprovedBlocks = approvedBlocks[pageId] || []

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {blocks.map((block) => (
            <BlockSlot
              key={block.id}
              id={block.id}
              type={block.type}
              name={block.name}
              isSelected={selectedBlockId === block.id}
              isApproved={pageApprovedBlocks.includes(block.id)}
              onSelect={() => setSelectedBlockId(block.id)}
              onDelete={() => setBlocks(blocks.filter(b => b.id !== block.id))}
              onApprove={() => {
                if (pageApprovedBlocks.includes(block.id)) {
                  unapproveBlock(pageId, block.id)
                } else {
                  approveBlock(pageId, block.id)
                }
              }}
            />
          ))}
          
          {blocks.length === 0 && (
            <div className="text-center py-12 text-ds-text-muted bg-ds-surface border border-ds-border border-dashed rounded-lg">
              Drag or add blocks from the library to start building.
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
