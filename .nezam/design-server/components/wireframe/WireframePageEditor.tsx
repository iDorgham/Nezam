'use client'

import React, { useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useWireframeStore, type WireframeSlot } from '@/lib/store/wireframe.store'
import { getBlockById } from '@/lib/wireframe-library/blocks'
import { getBlockSvg } from '@/lib/wireframe-library/svg-previews'
import {
  GripVertical,
  Trash2,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
} from 'lucide-react'

// ─── Breakpoint widths ────────────────────────────────────────────────────────

const BP_WIDTH: Record<string, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
}

// ─── Sortable slot card ───────────────────────────────────────────────────────

interface SlotCardProps {
  slot: WireframeSlot
  index: number
  total: number
  pageId: string
  isSelected: boolean
  breakpointWidth: number
}

function SortableSlotCard({ slot, index, total, pageId, isSelected, breakpointWidth }: SlotCardProps) {
  const {
    setActiveSlot,
    removeSlot,
    toggleSlotApproval,
    duplicateSlot,
    updateSlotVariant,
    reorderSlots,
    updateSlotNotes,
  } = useWireframeStore()

  const block = getBlockById(slot.blockId)
  const svgContent = block ? getBlockSvg(block.svgCategory, slot.variantId) : ''

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slot.instanceId })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  // Scale SVG to fit the current breakpoint preview width
  const previewScale = Math.min(breakpointWidth / 1280, 1)
  const blockHeight = block?.defaultHeight ?? 240
  const scaledHeight = Math.round(blockHeight * previewScale * 0.35)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl overflow-hidden border transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'border-ds-primary bg-ds-surface shadow-[0_0_0_1px_rgba(255,87,1,0.15)]'
          : 'border-ds-border bg-ds-surface hover:border-ds-border'
      } ${isDragging ? 'z-50 shadow-2xl' : ''}`}
      onClick={() => setActiveSlot(isSelected ? null : slot.instanceId)}
    >
      {/* Top bar: drag handle + meta + actions */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#080A12] border-b border-ds-border">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-[#2A2E3F] hover:text-ds-text-muted transition-colors flex-shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>

        {/* Index */}
        <span className="text-[10px] font-mono text-ds-text-muted flex-shrink-0 w-4 text-center">
          {index + 1}
        </span>

        {/* Block name + variant */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-ds-text-muted truncate">{slot.label}</div>
          {block && (
            <div className="text-[10px] text-ds-text-muted truncate">{block.category}</div>
          )}
        </div>

        {/* Variant selector */}
        {block && block.variants.length > 1 && (
          <select
            value={slot.variantId}
            onChange={e => {
              e.stopPropagation()
              updateSlotVariant(pageId, slot.instanceId, e.target.value)
            }}
            onClick={e => e.stopPropagation()}
            className="bg-ds-surface border border-ds-border rounded text-[10px] text-ds-text-muted px-1.5 py-0.5 focus:outline-none focus:border-ds-primary/50 max-w-[100px] cursor-pointer"
          >
            {block.variants.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => { e.stopPropagation(); toggleSlotApproval(pageId, slot.instanceId) }}
            className={`p-1.5 rounded-md transition-colors ${
              slot.approved
                ? 'text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20'
                : 'text-ds-text-muted hover:text-[#10b981] hover:bg-[#10b981]/10'
            }`}
            title={slot.approved ? 'Unapprove' : 'Approve'}
          >
            <Check size={12} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); duplicateSlot(pageId, slot.instanceId) }}
            className="p-1.5 rounded-md text-ds-text-muted hover:text-ds-text-muted hover:bg-ds-surface-hover transition-colors"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); removeSlot(pageId, slot.instanceId) }}
            className="p-1.5 rounded-md text-ds-text-muted hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors"
            title="Remove"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Approved badge */}
        {slot.approved && (
          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#10b981]" />
        )}
      </div>

      {/* SVG preview */}
      <div
        className="w-full overflow-hidden relative bg-[#080A12]"
        style={{ height: scaledHeight }}
      >
        {svgContent ? (
          <div
            className="w-full h-full"
            style={{
              transform: `scale(${previewScale * 0.35})`,
              transformOrigin: 'top left',
              width: `${100 / (previewScale * 0.35)}%`,
              pointerEvents: 'none',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-[#2A2E3F]">
            No preview
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-ds-primary/0 group-hover:bg-ds-primary/3 transition-colors pointer-events-none" />
      </div>

      {/* Notes (visible when selected) */}
      {isSelected && (
        <div className="px-3 py-2 border-t border-ds-border" onClick={e => e.stopPropagation()}>
          <textarea
            value={slot.notes}
            onChange={e => updateSlotNotes(pageId, slot.instanceId, e.target.value)}
            placeholder="Add notes for this block…"
            className="w-full bg-[#080A12] border border-ds-border rounded-lg px-2 py-1.5 text-[11px] text-ds-text-muted placeholder-[#2A2E3F] focus:outline-none focus:border-ds-primary/50 resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  )
}

// ─── Add block hint ───────────────────────────────────────────────────────────

function AddBlockHint() {
  const { setShowLibrary, showLibrary } = useWireframeStore()
  return (
    <button
      onClick={() => setShowLibrary(true)}
      className="w-full py-3 border border-dashed border-ds-border rounded-xl text-[11px] text-ds-text-muted hover:border-ds-primary/30 hover:text-ds-primary/60 transition-colors flex items-center justify-center gap-2"
    >
      <Plus size={13} />
      Add block from library
    </button>
  )
}

// ─── Empty canvas ─────────────────────────────────────────────────────────────

function EmptyCanvas() {
  const { setShowTemplates, setShowLibrary } = useWireframeStore()
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-14 h-14 rounded-2xl bg-ds-surface border border-ds-border flex items-center justify-center mb-4">
        <Layers size={24} className="text-[#2A2E3F]" />
      </div>
      <h3 className="text-sm font-medium text-ds-text-muted mb-1">Empty canvas</h3>
      <p className="text-xs text-ds-text-muted mb-4 max-w-xs leading-relaxed">
        Start with a page template or pick individual blocks from the library.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setShowTemplates(true)}
          className="px-3 py-1.5 bg-ds-primary text-white rounded-lg text-xs font-medium hover:bg-ds-primary/90 transition-colors"
        >
          Choose template
        </button>
        <button
          onClick={() => setShowLibrary(true)}
          className="px-3 py-1.5 bg-ds-surface-hover text-ds-text-muted rounded-lg text-xs font-medium hover:bg-ds-surface-hover hover:text-white transition-colors"
        >
          Browse blocks
        </button>
      </div>
    </div>
  )
}

// ─── Canvas view ──────────────────────────────────────────────────────────────

function CanvasView({ pageId, slots, breakpointWidth }: {
  pageId: string
  slots: WireframeSlot[]
  breakpointWidth: number
}) {
  const { activeSlotInstanceId, reorderSlots } = useWireframeStore()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = slots.findIndex(s => s.instanceId === active.id)
    const newIdx = slots.findIndex(s => s.instanceId === over.id)
    if (oldIdx !== -1 && newIdx !== -1) reorderSlots(pageId, oldIdx, newIdx)
  }, [slots, pageId, reorderSlots])

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={slots.map(s => s.instanceId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {slots.map((slot, idx) => (
            <SortableSlotCard
              key={slot.instanceId}
              slot={slot}
              index={idx}
              total={slots.length}
              pageId={pageId}
              isSelected={activeSlotInstanceId === slot.instanceId}
              breakpointWidth={breakpointWidth}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

// ─── Grid view ────────────────────────────────────────────────────────────────

function GridView({ pageId, slots }: { pageId: string; slots: WireframeSlot[] }) {
  const { activeSlotInstanceId, setActiveSlot, removeSlot, toggleSlotApproval } = useWireframeStore()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {slots.map((slot, idx) => {
        const block = getBlockById(slot.blockId)
        const svg = block ? getBlockSvg(block.svgCategory, slot.variantId) : ''
        const isSelected = activeSlotInstanceId === slot.instanceId

        return (
          <div
            key={slot.instanceId}
            onClick={() => setActiveSlot(isSelected ? null : slot.instanceId)}
            className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
              isSelected ? 'border-ds-primary' : 'border-ds-border hover:border-ds-border'
            }`}
          >
            <div className="h-24 bg-[#080A12] overflow-hidden" dangerouslySetInnerHTML={{ __html: svg }} />
            <div className="px-2 py-1.5 bg-ds-surface border-t border-ds-border flex items-center justify-between">
              <div>
                <div className="text-[10px] font-medium text-ds-text-muted truncate">{slot.label}</div>
                <div className="text-[9px] text-ds-text-muted">#{idx + 1}</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => { e.stopPropagation(); toggleSlotApproval(pageId, slot.instanceId) }}
                  className={`p-1 rounded ${slot.approved ? 'text-[#10b981]' : 'text-ds-text-muted hover:text-[#10b981]'}`}>
                  <Check size={10} />
                </button>
                <button onClick={e => { e.stopPropagation(); removeSlot(pageId, slot.instanceId) }}
                  className="p-1 rounded text-ds-text-muted hover:text-[#dc2626]">
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListView({ pageId, slots }: { pageId: string; slots: WireframeSlot[] }) {
  const { activeSlotInstanceId, setActiveSlot, removeSlot, toggleSlotApproval, updateSlotVariant } = useWireframeStore()

  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-ds-border">
          <th className="text-start py-2 px-3 text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider w-8">#</th>
          <th className="text-start py-2 px-3 text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">Block</th>
          <th className="text-start py-2 px-3 text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">Category</th>
          <th className="text-start py-2 px-3 text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">Variant</th>
          <th className="text-start py-2 px-3 text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">Status</th>
          <th className="py-2 px-3 w-16" />
        </tr>
      </thead>
      <tbody>
        {slots.map((slot, idx) => {
          const block = getBlockById(slot.blockId)
          const isSelected = activeSlotInstanceId === slot.instanceId

          return (
            <tr
              key={slot.instanceId}
              onClick={() => setActiveSlot(isSelected ? null : slot.instanceId)}
              className={`border-b border-ds-border cursor-pointer transition-colors group ${
                isSelected ? 'bg-ds-primary/5' : 'hover:bg-ds-surface'
              }`}
            >
              <td className="py-2 px-3 text-ds-text-muted tabular-nums">{idx + 1}</td>
              <td className="py-2 px-3 text-ds-text-muted font-medium">{slot.label}</td>
              <td className="py-2 px-3">
                <span className="px-1.5 py-0.5 rounded bg-ds-surface-hover text-ds-text-muted text-[9px] uppercase">
                  {block?.category ?? '—'}
                </span>
              </td>
              <td className="py-2 px-3">
                {block && block.variants.length > 1 ? (
                  <select
                    value={slot.variantId}
                    onChange={e => { e.stopPropagation(); updateSlotVariant(pageId, slot.instanceId, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="bg-transparent border-none text-ds-text-muted text-[10px] focus:outline-none cursor-pointer"
                  >
                    {block.variants.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                  </select>
                ) : (
                  <span className="text-ds-text-muted">{block?.variants.find(v => v.id === slot.variantId)?.label ?? slot.variantId}</span>
                )}
              </td>
              <td className="py-2 px-3">
                <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-semibold ${
                  slot.approved ? 'text-[#10b981]' : 'text-ds-text-muted'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${slot.approved ? 'bg-[#10b981]' : 'bg-ds-surface-hover'}`} />
                  {slot.approved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td className="py-2 px-3">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  <button onClick={e => { e.stopPropagation(); toggleSlotApproval(pageId, slot.instanceId) }}
                    className={`p-1 rounded ${slot.approved ? 'text-[#10b981]' : 'text-ds-text-muted hover:text-[#10b981]'}`}>
                    <Check size={11} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); removeSlot(pageId, slot.instanceId) }}
                    className="p-1 rounded text-ds-text-muted hover:text-[#dc2626]">
                    <Trash2 size={11} />
                  </button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Main page editor ─────────────────────────────────────────────────────────

export default function WireframePageEditor({ pageId }: { pageId: string }) {
  const { pages, viewMode, breakpoint } = useWireframeStore()
  const page = pages[pageId]
  const slots = page?.slots ?? []
  const breakpointWidth = BP_WIDTH[breakpoint] ?? 1280

  return (
    <div className="flex flex-col h-full bg-ds-surface">
      {/* Breakpoint container indicator */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-ds-surface border-b border-ds-border flex-shrink-0">
        <div className="flex-1 text-[10px] text-ds-text-muted">
          Canvas · {breakpointWidth}px · {slots.length} block{slots.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Scrollable canvas area */}
      <div className="flex-1 overflow-y-auto">
        {slots.length === 0 ? (
          <EmptyCanvas />
        ) : (
          <div className="p-4 space-y-2">
            {viewMode === 'canvas' && (
              <CanvasView pageId={pageId} slots={slots} breakpointWidth={breakpointWidth} />
            )}
            {viewMode === 'grid' && (
              <GridView pageId={pageId} slots={slots} />
            )}
            {viewMode === 'list' && (
              <ListView pageId={pageId} slots={slots} />
            )}

            {/* Add block hint */}
            <div className="pt-2">
              <AddBlockHint />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
