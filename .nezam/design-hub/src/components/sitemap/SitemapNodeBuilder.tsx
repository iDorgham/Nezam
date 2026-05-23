'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertTriangle,
  FileJson,
  LayoutGrid,
} from 'lucide-react'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import { cn } from '@/lib/cn'
import type { SitemapBuilderPage, SitemapBuilderSection } from '@/types'

// ─── Inline editable label ────────────────────────────────────────────────────

function InlineEdit({
  value,
  onSave,
  className,
  placeholder = 'Untitled',
}: {
  value: string
  onSave: (v: string) => void
  className?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const commit = () => {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed) onSave(trimmed)
    else setDraft(value)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setEditing(false); setDraft(value) }
        }}
        className={cn(
          'w-full bg-transparent outline-none border-b border-app-accent leading-tight',
          className,
        )}
      />
    )
  }

  return (
    <span
      className={cn('cursor-text select-none leading-tight', className)}
      onDoubleClick={() => { setDraft(value); setEditing(true) }}
      title="Double-click to rename"
    >
      {value || <span className="opacity-40">{placeholder}</span>}
    </span>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  pageId,
  isOverlay = false,
}: {
  section: SitemapBuilderSection
  pageId: string
  isOverlay?: boolean
}) {
  const renameSection = useSitemapBuilder((s) => s.renameSection)
  const updateDescription = useSitemapBuilder((s) => s.updateDescription)
  const deleteSection = useSitemapBuilder((s) => s.deleteSection)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `sec-${section.id}`,
    disabled: isOverlay,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative flex items-start gap-1.5 rounded-lg border bg-app-elevated px-2.5 py-2 text-left',
        'transition-all duration-150',
        isDragging
          ? 'border-app-accent/30 opacity-40 shadow-none'
          : 'border-app-border hover:border-app-border-strong hover:shadow-app-xs',
        isOverlay && 'rotate-[1.5deg] scale-105 border-app-accent/40 shadow-app-lg',
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-[3px] shrink-0 cursor-grab touch-none text-app-subtle opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag"
      >
        <GripVertical size={12} />
      </button>

      <div className="min-w-0 flex-1">
        <InlineEdit
          value={section.name}
          onSave={(v) => renameSection(pageId, section.id, v)}
          className="block w-full truncate text-[12px] font-semibold text-app-text"
          placeholder="Section name"
        />
        <InlineEdit
          value={section.description}
          onSave={(v) => updateDescription(pageId, section.id, v)}
          className="mt-0.5 block w-full truncate text-[10px] text-app-subtle"
          placeholder="Add description…"
        />
      </div>

      <button
        onClick={() => deleteSection(pageId, section.id)}
        className="mt-[3px] shrink-0 text-app-subtle opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
        aria-label="Delete section"
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}

// ─── Page column ──────────────────────────────────────────────────────────────

function PageColumn({ page }: { page: SitemapBuilderPage }) {
  const renamePage = useSitemapBuilder((s) => s.renamePage)
  const deletePage = useSitemapBuilder((s) => s.deletePage)
  const toggleCollapsed = useSitemapBuilder((s) => s.toggleCollapsed)
  const addSection = useSitemapBuilder((s) => s.addSection)
  const [deleteBlocked, setDeleteBlocked] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `pg-${page.id}`,
  })

  const sectionIds = page.sections.map((s) => `sec-${s.id}`)

  const handleDeletePage = () => {
    const ok = deletePage(page.id)
    if (!ok) {
      setDeleteBlocked(true)
      setTimeout(() => setDeleteBlocked(false), 2500)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex w-[220px] shrink-0 flex-col',
        isDragging && 'opacity-30',
      )}
    >
      {/* ── Page header card ── */}
      <div
        className={cn(
          'rounded-xl border bg-app-surface shadow-app-sm transition-shadow',
          deleteBlocked ? 'border-red-500/50' : 'border-app-border',
        )}
      >
        <div className="flex items-center gap-1.5 px-3 pb-3 pt-3">
          {/* Page drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 cursor-grab touch-none text-app-subtle transition-opacity hover:text-app-muted active:cursor-grabbing"
            aria-label="Drag page"
          >
            <GripVertical size={13} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-app-subtle">
              Page
            </div>
            <InlineEdit
              value={page.name}
              onSave={(v) => renamePage(page.id, v)}
              className="block w-full truncate text-[13px] font-semibold text-app-text"
              placeholder="Page name"
            />
          </div>

          <button
            onClick={() => toggleCollapsed(page.id)}
            className="shrink-0 rounded-app-sm p-1 text-app-subtle transition-colors hover:bg-app-elevated hover:text-app-text"
            aria-label={page.collapsed ? 'Expand' : 'Collapse'}
          >
            {page.collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
          </button>

          <button
            onClick={handleDeletePage}
            className={cn(
              'shrink-0 rounded-app-sm p-1 transition-colors',
              deleteBlocked
                ? 'text-red-500'
                : 'text-app-subtle hover:bg-app-elevated hover:text-red-500',
            )}
            aria-label="Delete page"
          >
            {deleteBlocked ? <AlertTriangle size={13} /> : <Trash2 size={13} />}
          </button>
        </div>

        {deleteBlocked && (
          <p className="border-t border-red-500/20 px-3 pb-2.5 text-[10px] leading-snug text-red-500">
            Move or delete all sections first.
          </p>
        )}

        {/* Section count badge (when collapsed) */}
        {page.collapsed && page.sections.length > 0 && (
          <div className="border-t border-app-border px-3 py-1.5">
            <span className="text-[10px] text-app-subtle">
              {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* ── Connector stem + sections ── */}
      {!page.collapsed && (
        <>
          {/* Vertical stem from header */}
          <div className="mx-auto h-4 w-px bg-app-border" />

          {/* Sections with their own trunk line */}
          <div className="relative">
            {/* Left trunk */}
            {page.sections.length > 0 && (
              <div
                className="pointer-events-none absolute left-[10px] top-0 w-px bg-app-border"
                style={{ height: `calc(100% - 20px)` }}
              />
            )}

            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1.5">
                {page.sections.map((section) => (
                  <div key={section.id} className="relative flex items-start gap-2">
                    {/* Horizontal elbow connector */}
                    <div className="relative mt-[14px] flex shrink-0 items-center">
                      <div className="h-px w-[10px] bg-app-border" />
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full border border-app-border bg-app-surface" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <SectionCard section={section} pageId={page.id} />
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>

            {/* Add section */}
            <button
              onClick={() => addSection(page.id)}
              className={cn(
                'mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-[11px]',
                'border-app-border text-app-subtle transition-colors',
                'hover:border-app-accent hover:text-app-accent',
              )}
            >
              <Plus size={11} />
              Add Section
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Root builder ─────────────────────────────────────────────────────────────

export function SitemapNodeBuilder() {
  const pages = useSitemapBuilder((s) => s.pages)
  const addPage = useSitemapBuilder((s) => s.addPage)
  const reorderPages = useSitemapBuilder((s) => s.reorderPages)
  const reorderSections = useSitemapBuilder((s) => s.reorderSections)
  const moveSectionToPage = useSitemapBuilder((s) => s.moveSectionToPage)
  const exportJSON = useSitemapBuilder((s) => s.exportJSON)

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const pageIds = pages.map((p) => `pg-${p.id}`)

  // Find the active dragged item for the overlay
  const activeDragItem = useCallback((): { type: 'page' | 'section'; page?: SitemapBuilderPage; section?: SitemapBuilderSection; pageId?: string } | null => {
    if (!activeId) return null
    if (activeId.startsWith('pg-')) {
      const page = pages.find((p) => `pg-${p.id}` === activeId)
      return page ? { type: 'page', page } : null
    }
    if (activeId.startsWith('sec-')) {
      const secId = activeId.replace('sec-', '')
      for (const page of pages) {
        const section = page.sections.find((s) => s.id === secId)
        if (section) return { type: 'section', section, pageId: page.id }
      }
    }
    return null
  }, [activeId, pages])

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return

    const activeIdStr = String(active.id)
    const overIdStr = String(over.id)

    if (activeIdStr.startsWith('pg-') && overIdStr.startsWith('pg-')) {
      const fromIdx = pages.findIndex((p) => `pg-${p.id}` === activeIdStr)
      const toIdx = pages.findIndex((p) => `pg-${p.id}` === overIdStr)
      if (fromIdx !== -1 && toIdx !== -1) reorderPages(fromIdx, toIdx)
      return
    }

    if (activeIdStr.startsWith('sec-')) {
      const secId = activeIdStr.replace('sec-', '')
      const fromPage = pages.find((p) => p.sections.some((s) => s.id === secId))
      if (!fromPage) return

      if (overIdStr.startsWith('sec-')) {
        const toSecId = overIdStr.replace('sec-', '')
        const toPage = pages.find((p) => p.sections.some((s) => s.id === toSecId))
        if (!toPage) return

        if (fromPage.id === toPage.id) {
          const fromIdx = fromPage.sections.findIndex((s) => s.id === secId)
          const toIdx = toPage.sections.findIndex((s) => s.id === toSecId)
          reorderSections(fromPage.id, fromIdx, toIdx)
        } else {
          const toIdx = toPage.sections.findIndex((s) => s.id === toSecId)
          moveSectionToPage(secId, fromPage.id, toPage.id, toIdx)
        }
      } else if (overIdStr.startsWith('pg-')) {
        const toPageId = overIdStr.replace('pg-', '')
        if (fromPage.id !== toPageId) {
          moveSectionToPage(secId, fromPage.id, toPageId, Infinity)
        }
      }
    }
  }

  const handleExport = () => {
    const json = exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const dragItem = activeDragItem()

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-app-deep">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--app-border-strong) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          opacity: 0.45,
        }}
      />

      {/* ── Top toolbar ── */}
      <div className="relative z-10 flex items-center gap-2 border-b border-app-border bg-app-surface/80 px-4 py-2 backdrop-blur">
        <LayoutGrid size={14} className="text-app-subtle" />
        <span className="text-[12px] font-semibold text-app-text">Sitemap</span>
        <span className="text-[11px] text-app-subtle">
          {pages.length} page{pages.length !== 1 ? 's' : ''} ·{' '}
          {pages.reduce((n, p) => n + p.sections.length, 0)} sections
        </span>

        <div className="flex-1" />

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-app-sm border border-app-border bg-app-elevated px-2.5 py-1.5 text-[11px] font-medium text-app-text transition-colors hover:border-app-border-strong hover:bg-app-surface"
        >
          <FileJson size={12} />
          Export JSON
        </button>

        <button
          onClick={addPage}
          className="flex items-center gap-1.5 rounded-app-sm bg-app-accent px-2.5 py-1.5 text-[11px] font-semibold text-app-on-accent transition-opacity hover:opacity-90"
        >
          <Plus size={12} />
          New Page
        </button>
      </div>

      {/* ── Canvas ── */}
      <div className="relative flex-1 overflow-auto">
        <div className="flex min-h-full items-start gap-6 p-10">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={pageIds} strategy={horizontalListSortingStrategy}>
              {pages.map((page) => (
                <PageColumn key={page.id} page={page} />
              ))}
            </SortableContext>

            <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
              {dragItem?.type === 'section' && dragItem.section && dragItem.pageId && (
                <SectionCard section={dragItem.section} pageId={dragItem.pageId} isOverlay />
              )}
              {dragItem?.type === 'page' && dragItem.page && (
                <div className="w-[220px] rounded-xl border border-app-accent/40 bg-app-surface shadow-app-lg opacity-95 rotate-[0.8deg] scale-[1.02]">
                  <div className="flex items-center gap-2 px-3 py-3">
                    <GripVertical size={13} className="text-app-subtle" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-app-subtle">Page</div>
                      <span className="block truncate text-[13px] font-semibold text-app-text">
                        {dragItem.page.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>

          {/* Add page ghost card */}
          <button
            onClick={addPage}
            className={cn(
              'flex h-[72px] w-[220px] shrink-0 flex-col items-center justify-center gap-2',
              'rounded-xl border-2 border-dashed border-app-border text-app-subtle',
              'transition-all duration-150 hover:border-app-accent hover:text-app-accent',
            )}
          >
            <Plus size={16} />
            <span className="text-[11px] font-medium">New Page</span>
          </button>
        </div>

        {/* Empty state */}
        {pages.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
            <LayoutGrid size={32} className="text-app-subtle/40" />
            <p className="text-[13px] text-app-subtle">No pages yet — click New Page to start</p>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <p className="whitespace-nowrap rounded-full border border-app-border bg-app-elevated/80 px-4 py-1 text-[10px] text-app-subtle backdrop-blur">
          <kbd className="font-mono">Double-click</kbd> to rename ·{' '}
          <kbd className="font-mono">Drag</kbd> to reorder · sections can move between pages
        </p>
      </div>
    </div>
  )
}
