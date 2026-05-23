'use client'

/**
 * Sitemap builder — premium redesign.
 * Better than Flowmapp (status badges, flow lines) + Octopus.do (visual wireframe blocks) + Relume (section descriptions).
 */

import {
  useState, useCallback, useRef, useEffect,
  createContext, useContext,
} from 'react'
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCenter,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  horizontalListSortingStrategy, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus, GripVertical, ChevronDown, ChevronRight,
  Trash2, AlertTriangle, FileJson, LayoutGrid, FolderPlus, FilePlus,
  ZoomIn, ZoomOut, Maximize2, CheckSquare, X, MoveRight, CornerUpLeft,
  LayoutList, Layers, Eye,
} from 'lucide-react'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import { cn } from '@/lib/cn'
import type { SitemapBuilderPage, SitemapBuilderSection, PageStatus } from '@/types'

// ── View mode ─────────────────────────────────────────────────────────────────

type CardView = 'compact' | 'list' | 'visual'

const ViewCtx = createContext<CardView>('list')
const useCardView = () => useContext(ViewCtx)

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS: Record<PageStatus, { label: string; dot: string; pill: string }> = {
  'draft':       { label: 'DRAFT',       dot: 'bg-app-subtle',       pill: 'bg-app-elevated text-app-subtle border border-app-border' },
  'in-progress': { label: 'IN PROGRESS', dot: 'bg-blue-500',         pill: 'bg-blue-500/15 text-blue-400 border border-blue-500/25' },
  'review':      { label: 'REVIEW',      dot: 'bg-violet-500',       pill: 'bg-violet-500/15 text-violet-400 border border-violet-500/25' },
  'done':        { label: 'DONE',        dot: 'bg-emerald-500',      pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' },
  'live':        { label: 'LIVE',        dot: 'bg-emerald-400',      pill: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' },
  'attention':   { label: 'ATTENTION',   dot: 'bg-red-500',          pill: 'bg-red-500/15 text-red-400 border border-red-500/25' },
}

const STATUS_ORDER: PageStatus[] = ['draft', 'in-progress', 'review', 'done', 'live', 'attention']

// ── Section color palette ─────────────────────────────────────────────────────

const SECTION_PALETTE: Record<string, string> = {
  nav:          '#3b82f6',
  navbar:       '#3b82f6',
  header:       '#3b82f6',
  hero:         '#8b5cf6',
  feature:      '#22c55e',
  features:     '#22c55e',
  pricing:      '#f59e0b',
  cta:          '#f97316',
  footer:       '#6b7280',
  blog:         '#ec4899',
  article:      '#ec4899',
  stats:        '#06b6d4',
  testimonial:  '#a78bfa',
  faq:          '#84cc16',
  about:        '#14b8a6',
  contact:      '#fb923c',
  dashboard:    '#6366f1',
  auth:         '#f43f5e',
  search:       '#0ea5e9',
  product:      '#10b981',
  vendor:       '#8b5cf6',
}

function sectionColor(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, '')
  for (const [k, v] of Object.entries(SECTION_PALETTE)) {
    if (key.startsWith(k)) return v
  }
  return '#94a3b8'
}

// ── Canvas constants ──────────────────────────────────────────────────────────

const CARD_W: Record<CardView, number> = { compact: 200, list: 248, visual: 220 }
const BASE_GAP = 40  // minimum gap between card edges

/** Total width occupied by page + its full subtree (symmetric, centered). */
function calcSubtreeWidth(page: SitemapBuilderPage, cw: number): number {
  if (!page.children?.length || page.collapsed) return cw
  const inner = page.children.reduce((sum, child, i) => (
    sum + calcSubtreeWidth(child, cw) + (i < page.children!.length - 1 ? BASE_GAP : 0)
  ), 0)
  return Math.max(cw, inner)
}

/** Margin-right needed between card l and card r so their subtrees don't overlap. */
function treeGap(l: SitemapBuilderPage, r: SitemapBuilderPage | undefined, cw: number): number {
  const lOver = Math.max(0, calcSubtreeWidth(l, cw) - cw) / 2
  const rOver = r ? Math.max(0, calcSubtreeWidth(r, cw) - cw) / 2 : 0
  return lOver + BASE_GAP + rOver
}

// ── Selection context ─────────────────────────────────────────────────────────

interface SelectionCtx {
  selectedIds: Set<string>
  toggle: (id: string, additive: boolean) => void
  isSelected: (id: string) => boolean
}
const SelectionContext = createContext<SelectionCtx>({
  selectedIds: new Set(), toggle: () => {}, isSelected: () => false,
})
const useSelection = () => useContext(SelectionContext)

// ── Infinite canvas pan ───────────────────────────────────────────────────────

interface PanState { x: number; y: number; zoom: number }

function useCanvasPan(ref: React.RefObject<HTMLDivElement | null>) {
  const [pan, setPan] = useState<PanState>({ x: 64, y: 64, zoom: 1 })
  const live = useRef(pan); live.current = pan
  const dragging = useRef(false)
  const sp = useRef({ x: 0, y: 0 }), so = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current; if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const f = e.deltaY < 0 ? 1.08 : 0.93
        setPan((p) => ({ ...p, zoom: Math.max(0.25, Math.min(2.5, p.zoom * f)) }))
      } else {
        setPan((p) => ({ ...p, x: p.x - e.deltaX, y: p.y - e.deltaY }))
      }
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 1 && !((e.target as HTMLElement).dataset.canvasPan === 'true')) return
      e.preventDefault(); dragging.current = true
      sp.current = { x: e.clientX, y: e.clientY }; so.current = { ...live.current }
      el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      setPan((p) => ({ ...p, x: so.current.x + e.clientX - sp.current.x, y: so.current.y + e.clientY - sp.current.y }))
    }
    const onUp = () => { dragging.current = false; el.style.cursor = '' }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [ref])

  return {
    pan,
    reset: () => setPan({ x: 64, y: 64, zoom: 1 }),
    zoom:  (d: number) => setPan((p) => ({ ...p, zoom: Math.max(0.25, Math.min(2.5, p.zoom + d)) })),
  }
}

// ── Dot grid ──────────────────────────────────────────────────────────────────

function DotGrid({ x, y, zoom }: PanState) {
  const sz = 24 * zoom
  return (
    <div className="pointer-events-none absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle, var(--app-border-strong) 1px, transparent 1px)',
      backgroundSize: `${sz}px ${sz}px`,
      backgroundPosition: `${x % sz}px ${y % sz}px`,
      opacity: 0.4,
    }} />
  )
}

// ── Inline edit ───────────────────────────────────────────────────────────────

function InlineEdit({ value, onSave, className, placeholder = 'Untitled' }: {
  value: string; onSave: (v: string) => void; className?: string; placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const commit = () => { setEditing(false); const t = draft.trim(); if (t) onSave(t); else setDraft(value) }
  if (editing) return (
    <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft(value) } }}
      className={cn('w-full bg-transparent outline-none border-b border-app-accent leading-tight', className)}
      onClick={(e) => e.stopPropagation()}
    />
  )
  return (
    <span className={cn('cursor-text select-none leading-tight', className)}
      onDoubleClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true) }}
      title="Double-click to rename"
    >
      {value || <span className="opacity-40">{placeholder}</span>}
    </span>
  )
}

// ── Status picker popover ─────────────────────────────────────────────────────

function StatusPicker({ pageId, status }: { pageId: string; status?: PageStatus }) {
  const setPageStatus = useSitemapBuilder((s) => s.setPageStatus)
  const [open, setOpen] = useState(false)
  const cfg = status ? STATUS[status] : null

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className={cn(
          'flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide transition-all',
          cfg ? cfg.pill : 'border border-dashed border-app-border text-app-subtle hover:border-app-border-strong',
        )}
      >
        {cfg && <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />}
        {cfg ? cfg.label : '+ STATUS'}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-lg" style={{ minWidth: 140 }}>
          {status && (
            <button
              onClick={(e) => { e.stopPropagation(); setPageStatus(pageId, undefined); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-app-subtle hover:bg-app-elevated"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-app-border" /> Clear
            </button>
          )}
          {STATUS_ORDER.map((s) => {
            const c = STATUS[s]
            return (
              <button key={s}
                onClick={(e) => { e.stopPropagation(); setPageStatus(pageId, s); setOpen(false) }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-app-text hover:bg-app-elevated"
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
                {c.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Section row — list mode ───────────────────────────────────────────────────

function SectionRow({ section, pageId, isOverlay }: {
  section: SitemapBuilderSection; pageId: string; isOverlay?: boolean
}) {
  const renameSection      = useSitemapBuilder((s) => s.renameSection)
  const updateDescription  = useSitemapBuilder((s) => s.updateDescription)
  const deleteSection      = useSitemapBuilder((s) => s.deleteSection)
  const color = sectionColor(section.name)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `sec-${section.id}`, disabled: isOverlay })

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('group flex items-stretch gap-0 rounded-md overflow-hidden border transition-all',
        isDragging ? 'opacity-40 border-app-accent/30' : 'border-app-border hover:border-app-border-strong',
        isOverlay && 'rotate-1 shadow-app-md',
      )}
    >
      {/* Color bar */}
      <div className="w-1 shrink-0" style={{ background: color }} />

      <div className="flex flex-1 items-center gap-1.5 bg-app-elevated px-2 py-1.5">
        <button {...attributes} {...listeners}
          className="shrink-0 cursor-grab touch-none text-app-subtle opacity-0 group-hover:opacity-100 active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        ><GripVertical size={11} /></button>

        <div className="min-w-0 flex-1">
          <InlineEdit value={section.name} onSave={(v) => renameSection(pageId, section.id, v)}
            className="block w-full truncate text-[11px] font-medium text-app-text" placeholder="Section" />
          {section.description && (
            <p className="mt-0.5 truncate text-[9px] text-app-subtle">{section.description}</p>
          )}
        </div>

        <button onClick={(e) => { e.stopPropagation(); deleteSection(pageId, section.id) }}
          className="shrink-0 text-app-subtle opacity-0 group-hover:opacity-100 hover:text-red-400"
        ><Trash2 size={10} /></button>
      </div>
    </div>
  )
}

// ── Section block — visual (Octopus) mode ─────────────────────────────────────

const VISUAL_HEIGHTS: Record<string, number> = {
  nav: 28, navbar: 28, header: 28,
  hero: 56, 'hero section': 56,
  feature: 48, features: 48, 'feature grid': 48,
  pricing: 52, stats: 40, testimonial: 44, faq: 44,
  cta: 32, footer: 28, blog: 44, dashboard: 60,
}

function sectionHeight(name: string): number {
  const k = name.toLowerCase()
  for (const [key, h] of Object.entries(VISUAL_HEIGHTS)) {
    if (k.startsWith(key)) return h
  }
  return 36
}

function SectionBlock({ section }: { section: SitemapBuilderSection }) {
  const color = sectionColor(section.name)
  const h = sectionHeight(section.name)

  return (
    <div className="flex items-center overflow-hidden rounded-sm" style={{ height: h, background: `${color}22`, borderLeft: `3px solid ${color}` }}>
      <div className="flex flex-1 items-center px-2">
        <span className="truncate text-[10px] font-medium" style={{ color }}>{section.name}</span>
      </div>
      {/* Wireframe lines */}
      <div className="mr-2 flex flex-col gap-0.5 opacity-40">
        <div className="h-px w-10 rounded-full" style={{ background: color }} />
        {h > 32 && <div className="h-px w-7 rounded-full" style={{ background: color }} />}
        {h > 44 && <div className="h-px w-8 rounded-full" style={{ background: color }} />}
      </div>
    </div>
  )
}

// ── Page node card ────────────────────────────────────────────────────────────

function PageNode({ page, depth = 0, isOverlay = false }: {
  page: SitemapBuilderPage; depth?: number; isOverlay?: boolean
}) {
  const renamePage      = useSitemapBuilder((s) => s.renamePage)
  const deletePage      = useSitemapBuilder((s) => s.deletePage)
  const toggleCollapsed = useSitemapBuilder((s) => s.toggleCollapsed)
  const addSection      = useSitemapBuilder((s) => s.addSection)
  const addChildPage    = useSitemapBuilder((s) => s.addChildPage)
  const reorderSections = useSitemapBuilder((s) => s.reorderSections)
  const { selectedIds, toggle, isSelected } = useSelection()
  const view = useCardView()

  const [deleteBlocked, setDeleteBlocked] = useState(false)

  const hasChildren  = (page.children?.length ?? 0) > 0
  const hasSections  = page.sections.length > 0
  const sectionIds   = page.sections.map((s) => `sec-${s.id}`)
  const w            = CARD_W[view]
  const selected     = isSelected(page.id)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `pg-${page.id}`, disabled: isOverlay })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!deletePage(page.id)) { setDeleteBlocked(true); setTimeout(() => setDeleteBlocked(false), 2500) }
  }

  const handleSelectClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select')) return
    toggle(page.id, e.shiftKey || e.metaKey || e.ctrlKey)
  }

  const isExpanded = !page.collapsed
  const pageType = depth === 0 ? 'Page' : 'Sub'

  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, width: w }}
      className={cn('shrink-0 flex flex-col', isDragging && 'opacity-25')}
    >
      {/* ── Main card ── */}
      <div
        onClick={handleSelectClick}
        className={cn(
          'relative rounded-2xl border bg-app-surface shadow-app-sm transition-all duration-150 cursor-pointer overflow-hidden',
          selected
            ? 'border-app-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--app-accent)_20%,transparent)]'
            : deleteBlocked
              ? 'border-red-500/60'
              : depth === 0
                ? 'border-app-border hover:border-app-border-strong'
                : 'border-app-border/60 bg-app-elevated/80 hover:border-app-border',
          isOverlay && 'rotate-1 scale-[1.02] border-app-accent/50 shadow-app-xl',
        )}
      >
        {/* Selection tick badge */}
        {selected && !isOverlay && (
          <div className="absolute -top-1.5 -right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-app-accent shadow-app-sm">
            <CheckSquare size={11} className="text-app-on-accent" />
          </div>
        )}

        {/* ── Card header ── */}
        <div className="flex items-start gap-2 px-3 pt-3 pb-2.5">
          {/* Drag handle */}
          <button {...attributes} {...listeners}
            className="mt-0.5 shrink-0 cursor-grab touch-none text-app-subtle opacity-0 hover:text-app-muted active:cursor-grabbing group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()} aria-label="Drag"
          ><GripVertical size={13} /></button>

          {/* Title block */}
          <div className="min-w-0 flex-1">
            {/* Row 1: page type + status */}
            <div className="mb-1 flex items-center gap-1.5">
              <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-widest text-app-subtle">{pageType}</span>
              <StatusPicker pageId={page.id} status={page.status} />
            </div>
            {/* Row 2: page name */}
            <InlineEdit value={page.name} onSave={(v) => renamePage(page.id, v)}
              className="block w-full truncate text-[14px] font-semibold text-app-text" placeholder="Page name" />
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-0.5">
            <button onClick={(e) => { e.stopPropagation(); toggleCollapsed(page.id) }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-app-subtle transition-colors hover:bg-app-elevated hover:text-app-text"
              aria-label={page.collapsed ? 'Expand' : 'Collapse'}
            >{page.collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}</button>
            <button onClick={handleDelete}
              className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                deleteBlocked ? 'text-red-400' : 'text-app-subtle hover:bg-app-elevated hover:text-red-400')}
              aria-label="Delete"
            >{deleteBlocked ? <AlertTriangle size={13} /> : <Trash2 size={13} />}</button>
          </div>
        </div>

        {/* Delete error */}
        {deleteBlocked && (
          <p className="border-t border-red-500/20 px-3 pb-2.5 text-[10px] text-red-400 leading-snug">
            Remove sections and sub-pages first.
          </p>
        )}

        {/* ── Collapsed summary ── */}
        {page.collapsed && (hasSections || hasChildren) && (
          <div className="border-t border-app-border/60 px-3 py-2">
            {/* Mini section color bar */}
            {hasSections && (
              <div className="mb-1.5 flex gap-0.5 overflow-hidden rounded-full" style={{ height: 4 }}>
                {page.sections.map((s) => (
                  <div key={s.id} className="flex-1" style={{ background: sectionColor(s.name) }} />
                ))}
              </div>
            )}
            <div className="flex gap-3 text-[10px] text-app-subtle">
              {hasSections && <span>{page.sections.length} section{page.sections.length !== 1 ? 's' : ''}</span>}
              {hasChildren && <span>{page.children!.length} sub-page{page.children!.length !== 1 ? 's' : ''}</span>}
            </div>
          </div>
        )}

        {/* ── Expanded: sections ── */}
        {isExpanded && hasSections && view !== 'compact' && (
          <div className="border-t border-app-border/60 px-3 pb-2 pt-2">
            {view === 'visual' ? (
              /* Octopus-style wireframe blocks */
              <div className="flex flex-col gap-0.5">
                {page.sections.map((s) => <SectionBlock key={s.id} section={s} />)}
              </div>
            ) : (
              /* Relume-style list rows */
              <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-1">
                  {page.sections.map((s) => (
                    <SectionRow key={s.id} section={s} pageId={page.id} isOverlay={isOverlay} />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        )}

        {/* ── Action strip ── */}
        {isExpanded && view !== 'compact' && (
          <div className="flex gap-1.5 border-t border-app-border/40 px-3 pb-3 pt-2">
            <button onClick={(e) => { e.stopPropagation(); addSection(page.id) }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-dashed border-app-border py-1.5 text-[10px] text-app-subtle transition-colors hover:border-app-accent hover:text-app-accent"
            ><Plus size={10} /> Section</button>
            <button onClick={(e) => { e.stopPropagation(); addChildPage(page.id) }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-dashed border-app-border py-1.5 text-[10px] text-app-subtle transition-colors hover:border-app-accent hover:text-app-accent"
            ><FilePlus size={10} /> Sub-page</button>
          </div>
        )}
      </div>

      {/* ── Sub-tree ── */}
      {isExpanded && (
        <>
          {(hasSections || hasChildren) && (
            <div className="mx-auto w-px bg-gradient-to-b from-app-border to-transparent" style={{ height: 20 }} />
          )}
          {hasChildren && (
            <>
              <ChildRow pages={page.children!} depth={depth + 1} />
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── Multi-drag overlay ────────────────────────────────────────────────────────

function MultiDragOverlay({ count, topPage }: { count: number; topPage: SitemapBuilderPage }) {
  const w = CARD_W.list
  return (
    <div className="relative" style={{ width: w }}>
      {count > 2 && <div className="absolute left-3 top-3 w-full rounded-2xl border border-app-border bg-app-elevated" style={{ height: 68 }} />}
      {count > 1 && <div className="absolute left-1.5 top-1.5 w-full rounded-2xl border border-app-border bg-app-surface" style={{ height: 68 }} />}
      <div className="relative rounded-2xl border-2 border-app-accent bg-app-surface shadow-app-xl px-3 py-3">
        <div className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-app-accent">Moving {count} pages</div>
        <div className="text-[14px] font-semibold text-app-text">{topPage.name}</div>
        <div className="absolute right-3 top-3 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-app-accent px-1.5 text-[11px] font-bold text-app-on-accent">{count}</div>
      </div>
    </div>
  )
}

// ── Selection action bar ──────────────────────────────────────────────────────

function SelectionBar({ selectedIds, pages, onClear, onMoveToRoot, onMoveTo }: {
  selectedIds: Set<string>; pages: SitemapBuilderPage[]
  onClear: () => void; onMoveToRoot: () => void; onMoveTo: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const count = selectedIds.size

  function collectTargets(list: SitemapBuilderPage[], ancestorSelected: boolean): SitemapBuilderPage[] {
    const result: SitemapBuilderPage[] = []
    for (const p of list) {
      const isSel = selectedIds.has(p.id)
      if (!isSel && !ancestorSelected) result.push(p)
      if (p.children) result.push(...collectTargets(p.children, ancestorSelected || isSel))
    }
    return result
  }
  const targets = collectTargets(pages, false)

  return (
    <div className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-app-accent/30 bg-app-surface/95 px-3 py-2 shadow-app-xl backdrop-blur-md">
        <div className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-app-accent px-2 text-[11px] font-bold text-app-on-accent">{count}</div>
        <span className="text-[12px] font-medium text-app-text">page{count !== 1 ? 's' : ''} selected</span>
        <div className="mx-1 h-4 w-px bg-app-border" />
        <button onClick={() => { onMoveToRoot(); setOpen(false) }}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-app-subtle transition-colors hover:bg-app-elevated hover:text-app-text"
        ><CornerUpLeft size={12} /> To root</button>
        <div className="relative">
          <button onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded-lg bg-app-accent px-2.5 py-1 text-[11px] font-semibold text-app-on-accent transition-opacity hover:opacity-90"
          ><MoveRight size={12} /> Move to…</button>
          {open && (
            <div className="absolute bottom-full left-0 mb-2 z-40 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-xl" style={{ minWidth: 180 }}>
              {targets.length === 0
                ? <p className="px-3 py-2 text-[11px] text-app-subtle">No valid targets</p>
                : <div className="max-h-60 overflow-y-auto py-1">
                    {targets.map((t) => (
                      <button key={t.id} onClick={() => { onMoveTo(t.id); setOpen(false) }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-app-elevated"
                      >
                        {t.status && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', STATUS[t.status].dot)} />}
                        <span className="truncate text-[12px] text-app-text">{t.name}</span>
                      </button>
                    ))}
                  </div>
              }
            </div>
          )}
        </div>
        <div className="mx-1 h-4 w-px bg-app-border" />
        <button onClick={onClear}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-app-subtle transition-colors hover:bg-app-elevated hover:text-app-text"
        ><X size={13} /></button>
      </div>
    </div>
  )
}

// ── Connector SVG ─────────────────────────────────────────────────────────────

/** Bezier curves connecting parent to each child — drawn in a sibling SVG layer */
function Connectors({ childCount, lineWidth, depth }: { childCount: number; lineWidth: number; depth: number }) {
  if (childCount <= 1) return null
  const w = lineWidth
  return (
    <svg className="pointer-events-none absolute top-0 left-0 overflow-visible" width={w} height={20} style={{ left: 0 }}>
      <path d={`M${w / 2},0 H${w / 2}`} stroke="var(--app-border)" strokeWidth="1" fill="none" />
    </svg>
  )
}

// ── Child row ─────────────────────────────────────────────────────────────────

function ChildRow({ pages, depth }: { pages: SitemapBuilderPage[]; depth: number }) {
  const view = useCardView()
  const containerRef = useRef<HTMLDivElement>(null)
  const [lineWidth, setLineWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const update = () => setLineWidth(el.scrollWidth)
    update()
    const ro = new ResizeObserver(update); ro.observe(el)
    return () => ro.disconnect()
  }, [pages.length])

  const pageIds = pages.map((p) => `pg-${p.id}`)
  const cw = CARD_W[view]

  return (
    <div className="relative flex flex-col items-center">
      {/* Horizontal wire */}
      {pages.length > 1 && (
        <div className="h-px bg-app-border" style={{ width: Math.max(0, lineWidth - cw) }} />
      )}
      <SortableContext items={pageIds} strategy={horizontalListSortingStrategy}>
        <div ref={containerRef} className="flex items-start">
          {pages.map((child, i) => (
            <div key={child.id} className="flex shrink-0 flex-col items-center"
              style={{ marginRight: i < pages.length - 1 ? treeGap(child, pages[i + 1], cw) : 0 }}
            >
              <div className="w-px bg-gradient-to-b from-app-border to-transparent" style={{ height: 20 }} />
              <PageNode page={child} depth={depth} />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

// ── Root row ──────────────────────────────────────────────────────────────────

function RootRow({ pages, addPage }: { pages: SitemapBuilderPage[]; addPage: () => void }) {
  const view = useCardView()
  const cw = CARD_W[view]
  const pageIds = pages.map((p) => `pg-${p.id}`)
  return (
    <SortableContext items={pageIds} strategy={horizontalListSortingStrategy}>
      <div className="flex items-start">
        {pages.map((page, i) => (
          <div key={page.id} style={{ marginRight: treeGap(page, pages[i + 1], cw) }}>
            <PageNode page={page} depth={0} />
          </div>
        ))}
        {/* Ghost add */}
        <button onClick={addPage}
          className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-app-border text-app-subtle transition-all hover:border-app-accent hover:text-app-accent"
          style={{ width: cw, height: 80 }}
        >
          <FolderPlus size={16} />
          <span className="text-[11px] font-medium">New Page</span>
        </button>
      </div>
    </SortableContext>
  )
}

// ── Minimap ───────────────────────────────────────────────────────────────────

function Minimap({ pages, pan, totalPages }: { pages: SitemapBuilderPage[]; pan: PanState; totalPages: number }) {
  if (totalPages < 3) return null
  const W = 120, H = 70
  function renderDots(list: SitemapBuilderPage[], x: number, y: number, spacing: number): React.ReactNode[] {
    return list.flatMap((p, i) => {
      const cx = x + i * spacing
      const color = p.status ? STATUS[p.status].dot.replace('bg-', '') : 'app-border'
      return [
        <circle key={p.id} cx={cx} cy={y} r={3}
          fill={p.status ? `var(--${color.replace('bg-', '')})` : 'var(--app-border-strong)'}
          opacity={0.8}
        />,
        ...(p.children ? renderDots(p.children, cx - ((p.children.length - 1) * 10) / 2, y + 16, 10) : []),
      ]
    })
  }
  const dots = renderDots(pages, W / 2 - ((pages.length - 1) * 20) / 2, 12, 20)

  return (
    <div className="absolute bottom-14 right-4 z-20 overflow-hidden rounded-xl border border-app-border bg-app-surface/90 shadow-app-md backdrop-blur-sm">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {dots}
      </svg>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function SitemapNodeBuilder() {
  const pages             = useSitemapBuilder((s) => s.pages)
  const addChildPage      = useSitemapBuilder((s) => s.addChildPage)
  const reorderPages      = useSitemapBuilder((s) => s.reorderPages)
  const reorderSections   = useSitemapBuilder((s) => s.reorderSections)
  const moveSectionToPage = useSitemapBuilder((s) => s.moveSectionToPage)
  const moveMultiplePages = useSitemapBuilder((s) => s.moveMultiplePages)
  const exportJSON        = useSitemapBuilder((s) => s.exportJSON)

  // ── View mode ───────────────────────────────────────────────────────────────
  const [view, setView] = useState<CardView>('list')

  // ── Selection ───────────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const toggleSelect = useCallback((id: string, additive: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (additive) { if (next.has(id)) next.delete(id); else next.add(id) }
      else { if (next.size === 1 && next.has(id)) next.clear(); else { next.clear(); next.add(id) } }
      return next
    })
  }, [])
  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])
  const selCtx: SelectionCtx = { selectedIds, toggle: toggleSelect, isSelected: (id) => selectedIds.has(id) }

  // ── Pan ─────────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const { pan, reset, zoom } = useCanvasPan(containerRef)

  const [spaceHeld, setSpaceHeld] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setSpaceHeld(true) }
      if (e.key === 'Escape') clearSelection()
    }
    const up = (e: KeyboardEvent) => { if (e.code === 'Space') setSpaceHeld(false) }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [clearSelection])

  // ── DnD ─────────────────────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const pageIds = pages.map((p) => `pg-${p.id}`)

  const activeDragItem = useCallback(() => {
    if (!activeId) return null
    function findPage(list: SitemapBuilderPage[]): SitemapBuilderPage | null {
      for (const p of list) { if (`pg-${p.id}` === activeId) return p; if (p.children) { const f = findPage(p.children); if (f) return f } }
      return null
    }
    function findSection(list: SitemapBuilderPage[]): { section: SitemapBuilderSection; pageId: string } | null {
      for (const p of list) {
        const sec = p.sections.find((s) => `sec-${s.id}` === activeId); if (sec) return { section: sec, pageId: p.id }
        if (p.children) { const f = findSection(p.children); if (f) return f }
      }
      return null
    }
    if (activeId.startsWith('pg-')) { const p = findPage(pages); return p ? { type: 'page' as const, page: p } : null }
    if (activeId.startsWith('sec-')) { const r = findSection(pages); return r ? { type: 'section' as const, ...r } : null }
    return null
  }, [activeId, pages])

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const a = String(active.id), o = String(over.id)

    if (a.startsWith('pg-') && o.startsWith('pg-')) {
      const aId = a.replace('pg-', ''), oId = o.replace('pg-', '')
      if (selectedIds.has(aId) && selectedIds.size > 1) { moveMultiplePages(Array.from(selectedIds), oId); clearSelection(); return }
      const fi = pages.findIndex((p) => `pg-${p.id}` === a), ti = pages.findIndex((p) => `pg-${p.id}` === o)
      if (fi !== -1 && ti !== -1) reorderPages(fi, ti)
      return
    }

    if (a.startsWith('sec-')) {
      const secId = a.replace('sec-', '')
      function findPageOf(list: SitemapBuilderPage[], sid: string): SitemapBuilderPage | null {
        for (const p of list) { if (p.sections.some((s) => s.id === sid)) return p; if (p.children) { const f = findPageOf(p.children, sid); if (f) return f } }
        return null
      }
      const fp = findPageOf(pages, secId); if (!fp) return
      if (o.startsWith('sec-')) {
        const tid = o.replace('sec-', ''), tp = findPageOf(pages, tid); if (!tp) return
        if (fp.id === tp.id) reorderSections(fp.id, fp.sections.findIndex((s) => s.id === secId), tp.sections.findIndex((s) => s.id === tid))
        else moveSectionToPage(secId, fp.id, tp.id, tp.sections.findIndex((s) => s.id === tid))
      } else if (o.startsWith('pg-')) {
        const tpId = o.replace('pg-', ''); if (fp.id !== tpId) moveSectionToPage(secId, fp.id, tpId, Infinity)
      }
    }
  }

  const handleExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a')
    a.href = url; a.download = 'sitemap.json'; a.click(); URL.revokeObjectURL(url)
  }

  const dragItem = activeDragItem()
  const totalSections = pages.reduce((n, p) => n + p.sections.length, 0)
  const totalPages = (function count(list: SitemapBuilderPage[]): number {
    return list.reduce((n, p) => n + 1 + count(p.children ?? []), 0)
  })(pages)

  const VIEW_ICONS: Record<CardView, React.ReactNode> = {
    compact: <Layers size={13} />,
    list:    <LayoutList size={13} />,
    visual:  <Eye size={13} />,
  }

  return (
    <ViewCtx.Provider value={view}>
      <SelectionContext.Provider value={selCtx}>
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-app-deep">

          {/* ── Toolbar ── */}
          <div className="relative z-10 flex items-center gap-2 border-b border-app-border bg-app-surface/80 px-4 py-2 backdrop-blur">
            <LayoutGrid size={14} className="text-app-subtle" />
            <span className="text-[12px] font-semibold text-app-text">Sitemap</span>
            <span className="text-[11px] text-app-subtle">
              {totalPages} page{totalPages !== 1 ? 's' : ''} · {totalSections} section{totalSections !== 1 ? 's' : ''}
            </span>
            {selectedIds.size > 0 && (
              <span className="ml-1 flex items-center gap-1 rounded-full bg-app-accent/15 px-2 py-0.5 text-[10px] font-semibold text-app-accent">
                <CheckSquare size={10} /> {selectedIds.size} selected
              </span>
            )}
            <div className="flex-1" />

            {/* View mode */}
            <div className="flex items-center gap-0.5 rounded-lg border border-app-border bg-app-elevated p-0.5">
              {(['compact', 'list', 'visual'] as CardView[]).map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                    view === v ? 'bg-app-surface shadow-app-sm text-app-text' : 'text-app-subtle hover:text-app-text')}
                  title={v} aria-label={v}
                >{VIEW_ICONS[v]}</button>
              ))}
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-0.5 rounded-lg border border-app-border bg-app-elevated px-1">
              <button onClick={() => zoom(-0.1)} className="flex h-6 w-6 items-center justify-center text-app-subtle hover:text-app-text" aria-label="Zoom out"><ZoomOut size={12} /></button>
              <span className="min-w-[36px] text-center text-[11px] tabular-nums text-app-subtle">{Math.round(pan.zoom * 100)}%</span>
              <button onClick={() => zoom(0.1)} className="flex h-6 w-6 items-center justify-center text-app-subtle hover:text-app-text" aria-label="Zoom in"><ZoomIn size={12} /></button>
              <button onClick={reset} className="flex h-6 w-6 items-center justify-center text-app-subtle hover:text-app-text" aria-label="Reset view"><Maximize2 size={11} /></button>
            </div>

            <button onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-app-border bg-app-elevated px-2.5 py-1.5 text-[11px] font-medium text-app-text transition-colors hover:border-app-border-strong"
            ><FileJson size={12} /> Export JSON</button>
            <button onClick={() => addChildPage(null)}
              className="flex items-center gap-1.5 rounded-lg bg-app-accent px-2.5 py-1.5 text-[11px] font-semibold text-app-on-accent transition-opacity hover:opacity-90"
            ><Plus size={12} /> New Page</button>
          </div>

          {/* ── Canvas ── */}
          <div
            ref={containerRef}
            className={cn('relative flex-1 overflow-hidden select-none', spaceHeld && 'cursor-grab')}
            onClick={(e) => { if ((e.target as HTMLElement).dataset.canvasPan === 'true') clearSelection() }}
          >
            <DotGrid {...pan} />

            <div data-canvas-pan="true" className="absolute inset-0" style={{ cursor: spaceHeld ? 'grab' : 'default' }}>
              <div style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${pan.zoom})`, transformOrigin: '0 0', willChange: 'transform' }}>
                <DndContext id="sitemap-builder" sensors={sensors} collisionDetection={closestCenter}
                  onDragStart={onDragStart} onDragEnd={onDragEnd}
                >
                  <RootRow pages={pages} addPage={() => addChildPage(null)} />

                  <DragOverlay dropAnimation={{ duration: 160, easing: 'ease' }}>
                    {dragItem?.type === 'section' && (
                      <SectionRow section={dragItem.section} pageId={dragItem.pageId} isOverlay />
                    )}
                    {dragItem?.type === 'page' && dragItem.page && (
                      selectedIds.has(dragItem.page.id) && selectedIds.size > 1
                        ? <MultiDragOverlay count={selectedIds.size} topPage={dragItem.page} />
                        : <PageNode page={dragItem.page} depth={0} isOverlay />
                    )}
                  </DragOverlay>
                </DndContext>
              </div>
            </div>

            {pages.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
                <LayoutGrid size={32} className="text-app-subtle/40" />
                <p className="text-[13px] text-app-subtle">No pages — click New Page or pick an archetype →</p>
              </div>
            )}
          </div>

          {/* ── Multi-select action bar ── */}
          {selectedIds.size > 0 && (
            <SelectionBar selectedIds={selectedIds} pages={pages} onClear={clearSelection}
              onMoveToRoot={() => { moveMultiplePages(Array.from(selectedIds), null); clearSelection() }}
              onMoveTo={(id) => { moveMultiplePages(Array.from(selectedIds), id); clearSelection() }}
            />
          )}

          {/* ── Minimap ── */}
          <Minimap pages={pages} pan={pan} totalPages={totalPages} />

          {/* ── Hint bar ── */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
            <p className="whitespace-nowrap rounded-full border border-app-border bg-app-elevated/80 px-4 py-1 text-[10px] text-app-subtle backdrop-blur">
              <kbd className="font-mono">Click</kbd> select ·{' '}
              <kbd className="font-mono">Shift/⌘</kbd> multi-select ·{' '}
              <kbd className="font-mono">Middle-drag</kbd> pan ·{' '}
              <kbd className="font-mono">Ctrl+scroll</kbd> zoom ·{' '}
              <kbd className="font-mono">Esc</kbd> deselect
            </p>
          </div>
        </div>
      </SelectionContext.Provider>
    </ViewCtx.Provider>
  )
}
