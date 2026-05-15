'use client'

import React, { useCallback } from 'react'
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
import { Layers } from 'lucide-react'

interface BlockInstance {
  id: string
  type: string
  name: string
  variantId?: string
  blockId?: string
}

interface WireframeCanvasProps {
  pageId: string
  blocks: BlockInstance[]
  setBlocks: (blocks: BlockInstance[]) => void
  selectedBlockId: string | null
  setSelectedBlockId: (id: string | null) => void
  breakpointWidth?: number
}

export default function WireframeCanvas({
  pageId,
  blocks,
  setBlocks,
  selectedBlockId,
  setSelectedBlockId,
  breakpointWidth = 1280,
}: WireframeCanvasProps) {
  const { approvedBlocks, approveBlock, unapproveBlock } = useApprovalStore()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(item => item.id === active.id)
      const newIndex = blocks.findIndex(item => item.id === over.id)
      setBlocks(arrayMove(blocks, oldIndex, newIndex))
    }
  }, [blocks, setBlocks])

  const handleVariantChange = useCallback((blockId: string, variantId: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, variantId } : b))
  }, [blocks, setBlocks])

  const handleDuplicate = useCallback((blockId: string) => {
    const idx = blocks.findIndex(b => b.id === blockId)
    if (idx === -1) return
    const original = blocks[idx]
    const dupe = { ...original, id: Math.random().toString(36).substring(2, 10) }
    const next = [...blocks]
    next.splice(idx + 1, 0, dupe)
    setBlocks(next)
  }, [blocks, setBlocks])

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
        <div className="space-y-3">
          {blocks.map((block) => (
            <BlockSlot
              key={block.id}
              id={block.id}
              blockId={block.blockId || block.type}
              type={block.type}
              name={block.name}
              variantId={block.variantId}
              isSelected={selectedBlockId === block.id}
              isApproved={pageApprovedBlocks.includes(block.id)}
              onSelect={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}
              onDelete={() => setBlocks(blocks.filter(b => b.id !== block.id))}
              onApprove={() => {
                if (pageApprovedBlocks.includes(block.id)) {
                  unapproveBlock(pageId, block.id)
                } else {
                  approveBlock(pageId, block.id)
                }
              }}
              onDuplicate={() => handleDuplicate(block.id)}
              onVariantChange={(variantId) => handleVariantChange(block.id, variantId)}
              breakpointWidth={breakpointWidth}
            />
          ))}

          {blocks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-[#0D0F18] border border-dashed border-[#1E2130] rounded-xl">
              <Layers size={28} className="text-[#2A2E3F] mb-3" />
              <p className="text-xs text-[#6B7280]">Drop blocks here to start building</p>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
