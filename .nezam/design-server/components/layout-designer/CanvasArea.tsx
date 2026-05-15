'use client'

import React, { useRef } from 'react'
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Lock,
  Unlock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react'
import { COMPONENT_LIBRARY } from '@/lib/layout-designer/component-library'
import { useLayoutStore } from '@/lib/layout-designer/layout.store'
import type { LayoutSlot, PageLayout, Breakpoint } from '@/lib/layout-designer/types'

// ── Block preview SVG wireframe thumbnails ────────────────────────────────────

function BlockPreview({ blockId, variantId, height }: { blockId: string; variantId: string; height: number }) {
  const block = COMPONENT_LIBRARY.find(b => b.id === blockId)
  const h = Math.min(height, 200)

  // Deterministic wireframe pattern based on block category
  const category = block?.category || 'content'

  const patterns: Record<string, React.ReactNode> = {
    navigation: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="16" y="12" width="80" height="16" rx="3" fill="currentColor" />
        <rect x="300" y="14" width="60" height="12" rx="2" fill="currentColor" opacity="0.6" />
        <rect x="380" y="14" width="60" height="12" rx="2" fill="currentColor" opacity="0.6" />
        <rect x="460" y="14" width="60" height="12" rx="2" fill="currentColor" opacity="0.6" />
        <rect x="680" y="10" width="96" height="20" rx="4" fill="currentColor" />
      </svg>
    ),
    hero: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="200" y={h * 0.15} width="400" height="28" rx="4" fill="currentColor" />
        <rect x="240" y={h * 0.15 + 40} width="320" height="14" rx="3" fill="currentColor" opacity="0.6" />
        <rect x="240" y={h * 0.15 + 62} width="320" height="14" rx="3" fill="currentColor" opacity="0.4" />
        <rect x="310" y={h * 0.6} width="90" height="28" rx="5" fill="currentColor" />
        <rect x="410" y={h * 0.6} width="90" height="28" rx="5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    content: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="40" y="24" width="720" height="16" rx="3" fill="currentColor" />
        <rect x="40" y="52" width="680" height="12" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="40" y="72" width="700" height="12" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="40" y="92" width="640" height="12" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="40" y={h * 0.55} width="220" height="120" rx="6" fill="currentColor" opacity="0.2" />
        <rect x="290" y={h * 0.55} width="220" height="120" rx="6" fill="currentColor" opacity="0.2" />
        <rect x="540" y={h * 0.55} width="220" height="120" rx="6" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    forms: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="200" y="24" width="400" height="18" rx="3" fill="currentColor" />
        <rect x="200" y="60" width="400" height="36" rx="5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
        <rect x="200" y="108" width="400" height="36" rx="5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
        <rect x="200" y="156" width="400" height="72" rx="5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
        <rect x="200" y="240" width="400" height="40" rx="6" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    data: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="40" y="20" width="720" height="28" rx="3" fill="currentColor" opacity="0.3" />
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <rect x="40" y={60 + i * 36} width="720" height="28" rx="2" fill="currentColor" opacity={0.1 + i * 0.02} />
            <rect x="50" y={68 + i * 36} width="180" height="12" rx="2" fill="currentColor" opacity="0.4" />
            <rect x="260" y={68 + i * 36} width="120" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="420" y={68 + i * 36} width="100" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <rect x="700" y={63 + i * 36} width="48" height="18" rx="4" fill="currentColor" opacity="0.4" />
          </g>
        ))}
      </svg>
    ),
    layout: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="40" y="20" width="720" height="2" fill="currentColor" opacity="0.4" />
        <rect x="40" y={h / 2} width="720" height="2" fill="currentColor" opacity="0.4" />
        <rect x="40" y={h - 20} width="720" height="2" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    commerce: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        {[0, 1, 2].map(i => (
          <g key={i}>
            <rect x={40 + i * 256} y="20" width="220" height="140" rx="6" fill="currentColor" opacity="0.15" />
            <rect x={40 + i * 256} y="170" width="180" height="12" rx="2" fill="currentColor" opacity="0.4" />
            <rect x={40 + i * 256} y="190" width="100" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <rect x={40 + i * 256} y="210" width="220" height="32" rx="5" fill="currentColor" opacity="0.5" />
          </g>
        ))}
      </svg>
    ),
    feedback: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="100" y={h / 2 - 24} width="600" height="48" rx="8" fill="currentColor" opacity="0.2" />
        <circle cx="128" cy={h / 2} r="12" fill="currentColor" opacity="0.5" />
        <rect x="156" y={h / 2 - 8} width="300" height="12" rx="2" fill="currentColor" opacity="0.4" />
        <rect x="156" y={h / 2 + 8} width="200" height="10" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    ),
    media: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="40" y="20" width="720" height={h - 40} rx="8" fill="currentColor" opacity="0.1" />
        <circle cx="400" cy={h / 2} r="32" fill="currentColor" opacity="0.4" />
        <polygon points={`388,${h / 2 - 16} 388,${h / 2 + 16} 420,${h / 2}`} fill="currentColor" opacity="0.7" />
      </svg>
    ),
    overlay: (
      <svg width="100%" height={h} viewBox={`0 0 800 ${h}`} className="opacity-30">
        <rect x="0" y="0" width="800" height={h} fill="currentColor" opacity="0.05" />
        <rect x="200" y="40" width="400" height={h - 80} rx="12" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1" />
        <rect x="220" y="60" width="360" height="18" rx="3" fill="currentColor" opacity="0.4" />
        <rect x="220" y="90" width="360" height="10" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="220" y="108" width="320" height="10" rx="2" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  }

  return (
    <div className="w-full text-ds-text-muted overflow-hidden rounded">
      {patterns[category] || patterns.content}
    </div>
  )
}

// ── Sortable Slot ─────────────────────────────────────────────────────────────

interface SlotCardProps {
  slot: LayoutSlot
  pageId: string
  isSelected: boolean
  onSelect: () => void
  breakpoint: Breakpoint
  showLabels: boolean
}

function SlotCard({ slot, pageId, isSelected, onSelect, breakpoint, showLabels }: SlotCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slot.id })
  const { updateSlot, removeSlot, moveSlotUp, moveSlotDown, duplicateSlot, approveSlot, unapproveSlot, getActivePage } = useLayoutStore()

  const block = COMPONENT_LIBRARY.find(b => b.id === slot.blockId)
  const variant = block?.variants.find(v => v.id === slot.variantId)

  const page = getActivePage()
  const slotIdx = page?.slots.findIndex(s => s.id === slot.id) ?? 0
  const isFirst = slotIdx === 0
  const isLast = page ? slotIdx === page.slots.length - 1 : false

  const bpOverrides = slot.breakpoints[breakpoint] || {}
  const effectiveColSpan = (bpOverrides.colSpan ?? slot.colSpan) as number
  const effectiveDisplay = bpOverrides.display ?? slot.display

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const colWidthPercent = (effectiveColSpan / 12) * 100

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`relative group rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'border-ds-primary bg-ds-primary-subtle ring-1 ring-ds-primary/20'
          : slot.locked
          ? 'border-amber-500/30 bg-amber-500/5'
          : slot.approved
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-ds-border bg-ds-surface hover:border-ds-primary/40 hover:bg-ds-surface-hover'
      }`}
    >
      {/* Width indicator */}
      <div
        className="absolute top-0 start-0 h-0.5 bg-ds-primary/30 rounded-t-lg transition-all"
        style={{ width: `${colWidthPercent}%` }}
      />

      {/* Header row */}
      <div className="flex items-center gap-2 px-2 py-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-ds-text-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        {/* Status icon */}
        {slot.approved ? (
          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
        ) : slot.locked ? (
          <Lock className="w-3 h-3 text-amber-500 shrink-0" />
        ) : (
          <Circle className="w-3 h-3 text-ds-text-muted shrink-0 opacity-40" />
        )}

        {/* Block info */}
        <div className="flex-1 min-w-0">
          {showLabels && (
            <div className="text-[11px] font-semibold text-ds-text-primary truncate">
              {slot.label || block?.name}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-ds-text-muted font-mono truncate">{slot.blockId}</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-ds-surface-subtle text-ds-text-muted shrink-0">
              {variant?.label || slot.variantId}
            </span>
          </div>
        </div>

        {/* Col span badge */}
        <div className="text-[9px] text-ds-text-muted shrink-0 font-mono">
          {effectiveColSpan}<span className="opacity-50">/12</span>
          {effectiveDisplay === 'hidden' && (
            <span className="ms-1 text-amber-500">hidden</span>
          )}
        </div>

        {/* Actions — show on select */}
        <div className={`flex items-center gap-1 shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button
            onClick={e => { e.stopPropagation(); moveSlotUp(pageId, slot.id) }}
            disabled={isFirst}
            className="p-0.5 text-ds-text-muted hover:text-ds-text-primary disabled:opacity-20 transition-colors"
            title="Move up"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); moveSlotDown(pageId, slot.id) }}
            disabled={isLast}
            className="p-0.5 text-ds-text-muted hover:text-ds-text-primary disabled:opacity-20 transition-colors"
            title="Move down"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); duplicateSlot(pageId, slot.id) }}
            className="p-0.5 text-ds-text-muted hover:text-ds-text-primary transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          {slot.approved ? (
            <button
              onClick={e => { e.stopPropagation(); unapproveSlot(pageId, slot.id) }}
              className="p-0.5 text-green-500 hover:text-green-400 transition-colors"
              title="Unapprove"
            >
              <CheckCircle2 className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); approveSlot(pageId, slot.id) }}
              className="p-0.5 text-ds-text-muted hover:text-green-500 transition-colors"
              title="Approve block"
            >
              <CheckCircle2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); updateSlot(pageId, slot.id, { locked: !slot.locked }) }}
            className={`p-0.5 transition-colors ${slot.locked ? 'text-amber-500 hover:text-amber-400' : 'text-ds-text-muted hover:text-amber-500'}`}
            title={slot.locked ? 'Unlock' : 'Lock'}
          >
            {slot.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); removeSlot(pageId, slot.id) }}
            className="p-0.5 text-ds-text-muted hover:text-red-500 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Preview wireframe */}
      <div className="px-2 pb-2">
        <div
          className={`rounded border border-ds-border-subtle overflow-hidden bg-ds-background/40 transition-all ${
            isSelected ? 'border-ds-primary/30' : ''
          }`}
          style={{ height: Math.min(block?.canvasHeight || 80, 160) }}
        >
          <BlockPreview blockId={slot.blockId} variantId={slot.variantId} height={160} />
        </div>
      </div>

      {/* Notes indicator */}
      {slot.notes && (
        <div className="px-2 pb-1.5 flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5 text-ds-primary/60 shrink-0" />
          <span className="text-[10px] text-ds-text-muted truncate">{slot.notes}</span>
        </div>
      )}
    </div>
  )
}

// ── Canvas Drop Zone ──────────────────────────────────────────────────────────

interface CanvasAreaProps {
  page: PageLayout | null
  onDropBlock: (blockId: string, variantId: string) => void
}

export default function CanvasArea({ page, onDropBlock }: CanvasAreaProps) {
  const {
    selectedSlotId,
    selectSlot,
    activeBreakpoint,
    showGrid,
    showLabels,
    canvasZoom,
    reorderSlots,
  } = useLayoutStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const canvasRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    if (!page) return
    const { active, over } = event
    if (over && active.id !== over.id) {
      const fromIdx = page.slots.findIndex(s => s.id === active.id)
      const toIdx = page.slots.findIndex(s => s.id === over.id)
      if (fromIdx !== -1 && toIdx !== -1) reorderSlots(page.pageId, fromIdx, toIdx)
    }
  }

  function handleDropFromLibrary(e: React.DragEvent) {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (data.blockId) onDropBlock(data.blockId, data.variantId)
    } catch { /* ignore */ }
  }

  // Breakpoint width indicators
  const bpWidths: Record<string, { label: string; width: string; px: number }> = {
    mobile: { label: t('Mobile', 'جوال'), width: '375px', px: 375 },
    tablet: { label: t('Tablet', 'تابلت'), width: '768px', px: 768 },
    desktop: { label: t('Desktop', 'مكتب'), width: '1280px', px: 1280 },
  }
  const bpInfo = bpWidths[activeBreakpoint]

  if (!page) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-ds-background text-ds-text-muted">
        <div className="text-4xl mb-3 opacity-20">◻</div>
        <div className="text-sm">{t('Select a page to start designing', 'اختر صفحة لبدء التصميم')}</div>
        <div className="text-xs mt-1 opacity-60">{t('Use the Sitemap tab to create pages first', 'استخدم علامة تبويب خريطة الموقع لإنشاء الصفحات أولاً')}</div>
      </div>
    )
  }

  const sortedSlots = [...page.slots].sort((a, b) => a.order - b.order)

  return (
    <div
      className="flex-1 overflow-auto bg-ds-background relative"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDropFromLibrary}
    >
      {/* Canvas inner — scaled & centered */}
      <div
        className="min-h-full px-8 py-6 transition-transform origin-top"
        style={{ transform: `scale(${canvasZoom})`, transformOrigin: 'top center' }}
      >
        {/* Grid overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {/* Page container simulation */}
        <div
          className="mx-auto"
          style={{ maxWidth: bpInfo.px > 800 ? page.containerMaxWidth : bpInfo.width }}
          ref={canvasRef}
        >
          {/* Page header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-ds-border">
            <div>
              <div className="text-[11px] font-semibold text-ds-text-primary">{page.pageName}</div>
              <div className="text-[10px] text-ds-text-muted font-mono">{page.pageRoute}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] px-2 py-0.5 rounded bg-ds-surface-subtle text-ds-text-muted">
                {sortedSlots.filter(s => s.approved).length}/{sortedSlots.length} {t('approved', 'تمت الموافقة')}
              </div>
              {page.lockedAt && (
                <div className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  {t('Locked', 'مغلق')}
                </div>
              )}
            </div>
          </div>

          {/* Slots */}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedSlots.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {sortedSlots.map(slot => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    pageId={page.pageId}
                    isSelected={selectedSlotId === slot.id}
                    onSelect={() => selectSlot(selectedSlotId === slot.id ? null : slot.id)}
                    breakpoint={activeBreakpoint}
                    showLabels={showLabels}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Drop zone */}
          {sortedSlots.length === 0 && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-ds-border-subtle rounded-xl py-16 text-center">
              <div className="text-3xl mb-3 opacity-20">+</div>
              <div className="text-sm text-ds-text-muted">{t('Drop components here', 'قم بإفلات المكونات هنا')}</div>
              <div className="text-xs text-ds-text-muted mt-1 opacity-60">
                {t('Drag from the library panel or click a variant to add', 'اسحب من لوحة المكتبة أو انقر فوق متغير للإضافة')}
              </div>
            </div>
          )}

          {sortedSlots.length > 0 && (
            <div className="mt-2 flex items-center justify-center border-2 border-dashed border-ds-border-subtle rounded-xl py-4 text-center hover:border-ds-primary/30 transition-colors">
              <span className="text-xs text-ds-text-muted opacity-60">{t('Drop to add below', 'قم بالإفلات للإضافة أدناه')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
