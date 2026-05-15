'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Check, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import { getBlockById } from '@/lib/wireframe-library/blocks'

interface BlockSlotProps {
  id: string
  blockId?: string       // optional: wireframe library block id
  type: string           // fallback: legacy block type string
  name: string
  variantId?: string
  isSelected: boolean
  isApproved: boolean
  onSelect: () => void
  onDelete: () => void
  onApprove: () => void
  onDuplicate?: () => void
  onVariantChange?: (variantId: string) => void
  breakpointWidth?: number
}

export default function BlockSlot({
  id,
  blockId,
  type,
  name,
  variantId,
  isSelected,
  isApproved,
  onSelect,
  onDelete,
  onApprove,
  onDuplicate,
  onVariantChange,
  breakpointWidth = 1280,
}: BlockSlotProps) {
  const [expanded, setExpanded] = useState(true)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  // Resolve block definition from wireframe library
  const resolvedBlockId = blockId || type
  const block = getBlockById(resolvedBlockId)
  const activeVariantId = variantId || block?.variants[0]?.id || 'default'
  const svgContent = block
    ? getBlockSvg(block.svgCategory, activeVariantId)
    : null

  const previewScale = Math.min(breakpointWidth / 1280, 1)
  const blockHeight = block?.defaultHeight ?? 200
  const scaledHeight = Math.max(Math.round(blockHeight * previewScale * 0.3), 60)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl overflow-hidden border transition-all ${
        isSelected
          ? 'border-ds-primary shadow-[0_0_0_1px_rgba(255,87,1,0.1)]'
          : 'border-ds-border hover:border-ds-border'
      } ${isDragging ? 'z-50 shadow-xl' : ''} bg-ds-surface group`}
      onClick={onSelect}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#080A12] border-b border-ds-border">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#2A2E3F] hover:text-ds-text-muted transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>

        {/* Name + type */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-ds-text-muted truncate group-hover:text-white transition-colors">
            {name}
          </div>
          {block && (
            <div className="text-[9px] text-ds-text-muted uppercase tracking-wider">{block.category}</div>
          )}
        </div>

        {/* Variant selector */}
        {block && block.variants.length > 1 && onVariantChange && (
          <select
            value={activeVariantId}
            onChange={e => { e.stopPropagation(); onVariantChange(e.target.value) }}
            onClick={e => e.stopPropagation()}
            className="bg-ds-surface border border-ds-border rounded text-[10px] text-ds-text-muted px-1.5 py-0.5 focus:outline-none focus:border-ds-primary/50 max-w-[90px] cursor-pointer"
          >
            {block.variants.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); onApprove() }}
            title={isApproved ? 'Unapprove' : 'Approve'}
            className={`p-1.5 rounded-md transition-colors ${
              isApproved
                ? 'text-[#10b981] bg-[#10b981]/10'
                : 'text-ds-text-muted hover:text-[#10b981] hover:bg-[#10b981]/10'
            }`}
          >
            <Check size={12} />
          </button>
          {onDuplicate && (
            <button
              onClick={e => { e.stopPropagation(); onDuplicate() }}
              title="Duplicate"
              className="p-1.5 rounded-md text-ds-text-muted hover:text-ds-text-muted hover:bg-ds-surface-hover transition-colors"
            >
              <Copy size={12} />
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); setExpanded(p => !p) }}
            title={expanded ? 'Collapse' : 'Expand'}
            className="p-1.5 rounded-md text-ds-text-muted hover:text-ds-text-muted hover:bg-ds-surface-hover transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            title="Delete"
            className="p-1.5 rounded-md text-ds-text-muted hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {isApproved && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] flex-shrink-0" />
        )}
      </div>

      {/* SVG preview */}
      {expanded && (
        <div
          className="relative bg-[#080A12] overflow-hidden"
          style={{ height: scaledHeight }}
        >
          {svgContent ? (
            <div
              className="pointer-events-none"
              style={{
                transform: `scale(${previewScale * 0.3})`,
                transformOrigin: 'top left',
                width: `${100 / (previewScale * 0.3)}%`,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[10px] text-[#2A2E3F]">
              {type}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
