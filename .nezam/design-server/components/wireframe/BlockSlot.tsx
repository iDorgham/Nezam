'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Settings, Check } from 'lucide-react'

interface BlockSlotProps {
  id: string
  type: string
  name: string
  isSelected: boolean
  isApproved: boolean
  onSelect: () => void
  onDelete: () => void
  onApprove: () => void
}

export default function BlockSlot({ id, type, name, isSelected, isApproved, onSelect, onDelete, onApprove }: BlockSlotProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#0f1011] border ${
        isSelected ? 'border-[#5e6ad2]' : 'border-[#ffffff14]'
      } rounded-lg overflow-hidden group hover:border-[#ffffff24] transition-colors`}
      onClick={onSelect}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-[#8a8f98] hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </div>
          <div>
            <div className="font-medium text-white">{name}</div>
            <div className="text-xs text-[#8a8f98] font-mono">{type}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className={`p-1.5 rounded hover:bg-[#ffffff0a] ${isApproved ? 'text-[#10b981]' : 'text-[#8a8f98]'}`}
            title={isApproved ? 'Approved' : 'Approve'}
          >
            <Check size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="p-1.5 rounded hover:bg-[#ffffff0a] text-[#8a8f98] hover:text-white"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded hover:bg-[#ffffff0a] text-[#8a8f98] hover:text-[#dc2626]"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Placeholder for block content */}
      <div className="px-4 pb-4">
        <div className="h-20 bg-[#08090a] rounded border border-[#ffffff05] flex items-center justify-center text-xs text-[#8a8f98]">
          Wireframe placeholder for {type}
        </div>
      </div>
    </div>
  )
}
