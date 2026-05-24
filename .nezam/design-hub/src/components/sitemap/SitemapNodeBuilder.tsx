'use client'

/**
 * Sitemap builder — 5-level hierarchy.
 * App → NavMenu → Page → Sub-page → Section
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
  Trash2, AlertTriangle, FileJson, LayoutGrid, FilePlus,
  ZoomIn, ZoomOut, Maximize2, X,
  LayoutList, Layers, Eye,
  Globe, LayoutDashboard, Shield, Smartphone, Monitor, Zap, Box,
  Navigation2, PanelBottom, PanelLeft, Settings2, Menu as MenuIcon,
  ChevronUp,
} from 'lucide-react'
import { useSitemapBuilder } from '@/store/sitemap-builder.store'
import { cn } from '@/lib/cn'
import type {
  AppKind, NavMenuKind,
  SitemapBuilderApp, SitemapBuilderNavMenu,
  SitemapBuilderPage, SitemapBuilderSection,
  PageStatus,
} from '@/types'

// ── View mode ─────────────────────────────────────────────────────────────────

type CardView = 'compact' | 'list' | 'visual'
const ViewCtx = createContext<CardView>('list')
const useCardView = () => useContext(ViewCtx)

// ── Status ────────────────────────────────────────────────────────────────────

const STATUS: Record<PageStatus, { label: string; dot: string; pill: string }> = {
  draft:        { label: 'DRAFT',       dot: 'bg-app-subtle',   pill: 'bg-app-elevated text-app-subtle border border-app-border' },
  'in-progress':{ label: 'IN PROGRESS', dot: 'bg-blue-500',     pill: 'bg-blue-500/15 text-blue-400 border border-blue-500/25' },
  review:       { label: 'REVIEW',      dot: 'bg-violet-500',   pill: 'bg-violet-500/15 text-violet-400 border border-violet-500/25' },
  done:         { label: 'DONE',        dot: 'bg-emerald-500',  pill: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' },
  live:         { label: 'LIVE',        dot: 'bg-emerald-400',  pill: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' },
  attention:    { label: 'ATTENTION',   dot: 'bg-red-500',      pill: 'bg-red-500/15 text-red-400 border border-red-500/25' },
}
const STATUS_ORDER: PageStatus[] = ['draft', 'in-progress', 'review', 'done', 'live', 'attention']

// ── App kind config ────────────────────────────────────────────────────────────

const APP_CFG: Record<AppKind, {
  label: string
  color: string
  border: string
  headerBg: string
  iconBg: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}> = {
  marketing:          { label: 'MARKETING',   color: 'text-blue-400',    border: 'border-blue-500/30',    headerBg: 'bg-blue-500/8',    iconBg: 'bg-blue-500/15',    Icon: Globe },
  'dashboard-client': { label: 'CLIENT APP',  color: 'text-emerald-400', border: 'border-emerald-500/30', headerBg: 'bg-emerald-500/8', iconBg: 'bg-emerald-500/15', Icon: LayoutDashboard },
  'dashboard-admin':  { label: 'ADMIN',       color: 'text-orange-400',  border: 'border-orange-500/30',  headerBg: 'bg-orange-500/8',  iconBg: 'bg-orange-500/15',  Icon: Shield },
  mobile:             { label: 'MOBILE',      color: 'text-violet-400',  border: 'border-violet-500/30',  headerBg: 'bg-violet-500/8',  iconBg: 'bg-violet-500/15',  Icon: Smartphone },
  desktop:            { label: 'DESKTOP',     color: 'text-cyan-400',    border: 'border-cyan-500/30',    headerBg: 'bg-cyan-500/8',    iconBg: 'bg-cyan-500/15',    Icon: Monitor },
  api:                { label: 'API',         color: 'text-yellow-400',  border: 'border-yellow-500/30',  headerBg: 'bg-yellow-500/8',  iconBg: 'bg-yellow-500/15',  Icon: Zap },
  custom:             { label: 'APP',         color: 'text-app-muted',   border: 'border-app-border',     headerBg: 'bg-app-elevated',  iconBg: 'bg-app-elevated',   Icon: Box },
}

// ── NavMenu kind config ────────────────────────────────────────────────────────

const MENU_CFG: Record<NavMenuKind, {
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}> = {
  main:    { label: 'MAIN NAV', Icon: Navigation2 },
  footer:  { label: 'FOOTER',   Icon: PanelBottom },
  sidebar: { label: 'SIDEBAR',  Icon: PanelLeft },
  utility: { label: 'UTILITY',  Icon: Settings2 },
  custom:  { label: 'MENU',     Icon: MenuIcon },
}

// ── Section color palette ─────────────────────────────────────────────────────

const SECTION_PALETTE: Record<string, string> = {
  nav: '#3b82f6', navbar: '#3b82f6', header: '#3b82f6',
  hero: '#8b5cf6',
  feature: '#22c55e', features: '#22c55e',
  pricing: '#f59e0b',
  cta: '#f97316', 'call to action': '#f97316',
  footer: '#6b7280',
  blog: '#ec4899', article: '#ec4899',
  stats: '#06b6d4', kpi: '#06b6d4',
  testimonial: '#a78bfa', faq: '#84cc16',
  about: '#14b8a6', contact: '#fb923c',
  dashboard: '#6366f1', overview: '#6366f1', chart: '#6366f1',
  auth: '#f43f5e', search: '#0ea5e9',
  product: '#10b981', vendor: '#8b5cf6',
  arabic: '#f59e0b',
}

function sectionColor(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, '')
  for (const [k, v] of Object.entries(SECTION_PALETTE)) {
    if (key.startsWith(k.replace(/\s+/g, ''))) return v
  }
  return '#94a3b8'
}

// ── Canvas constants ──────────────────────────────────────────────────────────

const CARD_W: Record<CardView, number> = { compact: 192, list: 236, visual: 216 }
const BASE_GAP = 36

function calcSubtreeWidth(page: SitemapBuilderPage, cw: number): number {
  if (!page.subPages?.length || page.collapsed) return cw
  const inner = page.subPages.reduce((sum, child, i) =>
    sum + calcSubtreeWidth(child, cw) + (i < page.subPages!.length - 1 ? BASE_GAP : 0), 0)
  return Math.max(cw, inner)
}

function treeGap(l: SitemapBuilderPage, r: SitemapBuilderPage | undefined, cw: number): number {
  const lOver = Math.max(0, calcSubtreeWidth(l, cw) - cw) / 2
  const rOver = r ? Math.max(0, calcSubtreeWidth(r, cw) - cw) / 2 : 0
  return lOver + BASE_GAP + rOver
}

// ── Infinite canvas pan/zoom ──────────────────────────────────────────────────

interface PanState { x: number; y: number; zoom: number }

function useCanvasPan(ref: React.RefObject<HTMLDivElement | null>) {
  const [pan, setPan] = useState<PanState>({ x: 48, y: 48, zoom: 1 })
  const live = useRef(pan); live.current = pan
  const dragging = useRef(false)
  const sp = useRef({ x: 0, y: 0 }), so = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current; if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        const f = e.deltaY < 0 ? 1.08 : 0.93
        setPan((p) => ({ ...p, zoom: Math.max(0.2, Math.min(2.5, p.zoom * f)) }))
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
    reset: () => setPan({ x: 48, y: 48, zoom: 1 }),
    zoom:  (d: number) => setPan((p) => ({ ...p, zoom: Math.max(0.2, Math.min(2.5, p.zoom + d)) })),
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
  const commit = () => {
    setEditing(false)
    const t = draft.trim()
    if (t) onSave(t); else setDraft(value)
  }
  if (editing) return (
    <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setDraft(value) } }}
      className={cn('w-full bg-transparent outline-none border-b border-app-accent leading-tight', className)}
      onClick={(e) => e.stopPropagation()}
    />
  )
  return (
    <span className={cn('cursor-text leading-tight', className)}
      onDoubleClick={(e) => { e.stopPropagation(); setDraft(value); setEditing(true) }}
      title="Double-click to rename"
    >
      {value || <span className="opacity-40">{placeholder}</span>}
    </span>
  )
}

// ── Status picker ─────────────────────────────────────────────────────────────

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
                <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />{c.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Section row ───────────────────────────────────────────────────────────────

function SectionRow({ section, pageId, isOverlay }: {
  section: SitemapBuilderSection; pageId: string; isOverlay?: boolean
}) {
  const renameSection     = useSitemapBuilder((s) => s.renameSection)
  const updateDescription = useSitemapBuilder((s) => s.updateDescription)
  const deleteSection     = useSitemapBuilder((s) => s.deleteSection)
  const color = sectionColor(section.name)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: `sec-${section.id}`, disabled: isOverlay, data: { type: 'section', pageId, sectionId: section.id } })

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-stretch gap-0 rounded-md overflow-hidden border transition-all',
        isDragging ? 'opacity-40 border-app-accent/30' : 'border-app-border hover:border-app-border-strong',
        isOverlay && 'rotate-1 shadow-app-md',
      )}
    >
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

// ── Section visual block (Octopus mode) ───────────────────────────────────────

const VISUAL_HEIGHTS: Record<string, number> = {
  nav: 28, navbar: 28, header: 28,
  hero: 56, feature: 48, features: 48,
  pricing: 52, stats: 40, testimonial: 44, faq: 44,
  cta: 32, footer: 28, blog: 44, dashboard: 60, overview: 48,
}
function sectionHeight(name: string): number {
  const k = name.toLowerCase()
  for (const [key, h] of Object.entries(VISUAL_HEIGHTS)) { if (k.startsWith(key)) return h }
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
      <div className="mr-2 flex flex-col gap-0.5 opacity-40">
        <div className="h-px w-10 rounded-full" style={{ background: color }} />
        {h > 32 && <div className="h-px w-7 rounded-full" style={{ background: color }} />}
        {h > 44 && <div className="h-px w-8 rounded-full" style={{ background: color }} />}
      </div>
    </div>
  )
}

// ── Page card ─────────────────────────────────────────────────────────────────

function PageNode({ page, depth = 0, isOverlay = false, appId, menuId }: {
  page: SitemapBuilderPage
  depth?: number
  isOverlay?: boolean
  appId: string
  menuId: string
}) {
  const renamePage        = useSitemapBuilder((s) => s.renamePage)
  const deletePage        = useSitemapBuilder((s) => s.deletePage)
  const togglePageCollapsed = useSitemapBuilder((s) => s.togglePageCollapsed)
  const addSection        = useSitemapBuilder((s) => s.addSection)
  const addSubPage        = useSitemapBuilder((s) => s.addSubPage)
  const reorderSections   = useSitemapBuilder((s) => s.reorderSections)
  const view = useCardView()

  const [deleteBlocked, setDeleteBlocked] = useState(false)

  const hasSubPages  = (page.subPages?.length ?? 0) > 0
  const hasSections  = page.sections.length > 0
  const sectionIds   = page.sections.map((s) => `sec-${s.id}`)
  const w            = CARD_W[view]
  const isExpanded   = !page.collapsed
  const pageType     = depth === 0 ? 'Page' : 'Sub'

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: `pg-${page.id}`,
      disabled: isOverlay || depth > 0,
      data: { type: 'page', appId, menuId, pageId: page.id, depth },
    })

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!deletePage(page.id)) { setDeleteBlocked(true); setTimeout(() => setDeleteBlocked(false), 2500) }
  }

  return (
    <div ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, width: w }}
      className={cn('shrink-0 flex flex-col', isDragging && 'opacity-25')}
    >
      {/* Card */}
      <div className={cn(
        'relative rounded-2xl border bg-app-surface shadow-app-sm transition-all duration-150 overflow-hidden',
        deleteBlocked ? 'border-red-500/60' : depth === 0
          ? 'border-app-border hover:border-app-border-strong'
          : 'border-app-border/60 bg-app-elevated/80 hover:border-app-border',
        isOverlay && 'rotate-1 scale-[1.02] border-app-accent/50 shadow-app-xl',
      )}>
        {/* Header */}
        <div className="flex items-start gap-2 px-3 pt-3 pb-2.5">
          <button {...attributes} {...listeners}
            className="mt-0.5 shrink-0 cursor-grab touch-none text-app-subtle opacity-0 hover:text-app-muted active:cursor-grabbing transition-opacity"
            onClick={(e) => e.stopPropagation()} aria-label="Drag"
          ><GripVertical size={13} /></button>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-widest text-app-subtle">{pageType}</span>
              <StatusPicker pageId={page.id} status={page.status} />
            </div>
            <InlineEdit value={page.name} onSave={(v) => renamePage(page.id, v)}
              className="block w-full truncate text-[14px] font-semibold text-app-text" placeholder="Page name" />
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <button onClick={(e) => { e.stopPropagation(); togglePageCollapsed(page.id) }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-app-subtle transition-colors hover:bg-app-elevated hover:text-app-text"
            >{page.collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}</button>
            <button onClick={handleDelete}
              className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                deleteBlocked ? 'text-red-400' : 'text-app-subtle hover:bg-app-elevated hover:text-red-400')}
            >{deleteBlocked ? <AlertTriangle size={13} /> : <Trash2 size={13} />}</button>
          </div>
        </div>

        {/* Delete error */}
        {deleteBlocked && (
          <p className="border-t border-red-500/20 px-3 pb-2.5 text-[10px] text-red-400 leading-snug">
            Remove sections and sub-pages first.
          </p>
        )}

        {/* Collapsed summary */}
        {page.collapsed && (hasSections || hasSubPages) && (
          <div className="border-t border-app-border/60 px-3 py-2">
            {hasSections && (
              <div className="mb-1.5 flex gap-0.5 overflow-hidden rounded-full" style={{ height: 4 }}>
                {page.sections.map((s) => (
                  <div key={s.id} className="flex-1" style={{ background: sectionColor(s.name) }} />
                ))}
              </div>
            )}
            <div className="flex gap-3 text-[10px] text-app-subtle">
              {hasSections && <span>{page.sections.length} section{page.sections.length !== 1 ? 's' : ''}</span>}
              {hasSubPages && <span>{page.subPages!.length} sub-page{page.subPages!.length !== 1 ? 's' : ''}</span>}
            </div>
          </div>
        )}

        {/* Expanded: sections */}
        {isExpanded && hasSections && view !== 'compact' && (
          <div className="border-t border-app-border/60 px-3 pb-2 pt-2">
            {view === 'visual' ? (
              <div className="flex flex-col gap-0.5">
                {page.sections.map((s) => <SectionBlock key={s.id} section={s} />)}
              </div>
            ) : (
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

        {/* Action strip */}
        {isExpanded && view !== 'compact' && (
          <div className="flex gap-1.5 border-t border-app-border/40 px-3 pb-3 pt-2">
            <button onClick={(e) => { e.stopPropagation(); addSection(page.id) }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-dashed border-app-border py-1.5 text-[10px] text-app-subtle transition-colors hover:border-app-accent hover:text-app-accent"
            ><Plus size={10} /> Section</button>
            <button onClick={(e) => { e.stopPropagation(); addSubPage(page.id) }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-dashed border-app-border py-1.5 text-[10px] text-app-subtle transition-colors hover:border-app-accent hover:text-app-accent"
            ><FilePlus size={10} /> Sub-page</button>
          </div>
        )}
      </div>

      {/* Sub-tree */}
      {isExpanded && hasSubPages && (
        <>
          <div className="mx-auto w-px bg-gradient-to-b from-app-border to-transparent" style={{ height: 20 }} />
          <SubPageRow pages={page.subPages!} depth={depth + 1} appId={appId} menuId={menuId} />
        </>
      )}
    </div>
  )
}

// ── Sub-page row ──────────────────────────────────────────────────────────────

function SubPageRow({ pages, depth, appId, menuId }: {
  pages: SitemapBuilderPage[]; depth: number; appId: string; menuId: string
}) {
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

  const cw = CARD_W[view]

  return (
    <div className="relative flex flex-col items-center">
      {pages.length > 1 && (
        <div className="h-px bg-app-border" style={{ width: Math.max(0, lineWidth - cw) }} />
      )}
      <div ref={containerRef} className="flex items-start">
        {pages.map((child, i) => (
          <div key={child.id} className="flex shrink-0 flex-col items-center"
            style={{ marginRight: i < pages.length - 1 ? treeGap(child, pages[i + 1], cw) : 0 }}
          >
            <div className="w-px bg-gradient-to-b from-app-border to-transparent" style={{ height: 20 }} />
            <PageNode page={child} depth={depth} appId={appId} menuId={menuId} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── NavMenu block ─────────────────────────────────────────────────────────────

function NavMenuBlock({ menu, appId }: { menu: SitemapBuilderNavMenu; appId: string }) {
  const addPage           = useSitemapBuilder((s) => s.addPage)
  const renameNavMenu     = useSitemapBuilder((s) => s.renameNavMenu)
  const deleteNavMenu     = useSitemapBuilder((s) => s.deleteNavMenu)
  const toggleMenuCollapsed = useSitemapBuilder((s) => s.toggleMenuCollapsed)
  const reorderPages      = useSitemapBuilder((s) => s.reorderPages)
  const view = useCardView()

  const cfg = MENU_CFG[menu.kind]
  const MenuIcon = cfg.Icon
  const pageIds = menu.pages.map((p) => `pg-${p.id}`)
  const cw = CARD_W[view]

  return (
    <div className="flex flex-col gap-2">
      {/* Menu label row */}
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-app-elevated text-app-subtle">
          <MenuIcon size={11} />
        </div>
        <span className="text-[9px] font-bold tracking-widest text-app-subtle uppercase">{cfg.label}</span>
        <span className="text-app-subtle/40 text-[9px]">·</span>
        <InlineEdit value={menu.name} onSave={(v) => renameNavMenu(appId, menu.id, v)}
          className="text-[11px] font-semibold text-app-text" placeholder="Menu name" />
        <div className="flex-1" />
        <button
          onClick={() => addPage(appId, menu.id)}
          className="flex h-5 items-center gap-1 rounded-md border border-dashed border-app-border px-1.5 text-[10px] text-app-subtle transition-colors hover:border-app-accent hover:text-app-accent"
        ><Plus size={9} /> Page</button>
        <button
          onClick={() => toggleMenuCollapsed(appId, menu.id)}
          className="flex h-5 w-5 items-center justify-center rounded-md text-app-subtle hover:bg-app-elevated hover:text-app-text"
        >{menu.collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}</button>
        <button
          onClick={() => deleteNavMenu(appId, menu.id)}
          className="flex h-5 w-5 items-center justify-center rounded-md text-app-subtle hover:bg-app-elevated hover:text-red-400"
        ><Trash2 size={11} /></button>
      </div>

      {/* Pages row */}
      {!menu.collapsed && (
        <div className="pl-7">
          <SortableContext items={pageIds} strategy={horizontalListSortingStrategy}>
            <div className="flex items-start">
              {menu.pages.map((page, i) => (
                <div key={page.id} className="shrink-0"
                  style={{ marginRight: treeGap(page, menu.pages[i + 1], cw) }}
                >
                  <PageNode page={page} depth={0} appId={appId} menuId={menu.id} />
                </div>
              ))}
              {/* Ghost add page */}
              <button
                onClick={() => addPage(appId, menu.id)}
                className="flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-app-border/60 text-app-subtle transition-all hover:border-app-accent/60 hover:text-app-accent"
                style={{ width: cw, height: 72, marginLeft: menu.pages.length > 0 ? BASE_GAP : 0 }}
              >
                <FilePlus size={14} />
                <span className="text-[10px] font-medium">New Page</span>
              </button>
            </div>
          </SortableContext>
        </div>
      )}
    </div>
  )
}

// ── App block ─────────────────────────────────────────────────────────────────

const APP_KIND_OPTIONS: { kind: AppKind; label: string }[] = [
  { kind: 'marketing', label: 'Marketing' },
  { kind: 'dashboard-client', label: 'Client App' },
  { kind: 'dashboard-admin', label: 'Admin' },
  { kind: 'mobile', label: 'Mobile' },
  { kind: 'desktop', label: 'Desktop' },
  { kind: 'api', label: 'API' },
  { kind: 'custom', label: 'Custom' },
]
const MENU_KIND_OPTIONS: { kind: NavMenuKind; label: string }[] = [
  { kind: 'main', label: 'Main Nav' },
  { kind: 'footer', label: 'Footer' },
  { kind: 'sidebar', label: 'Sidebar' },
  { kind: 'utility', label: 'Utility' },
  { kind: 'custom', label: 'Custom' },
]

function AppBlock({ app }: { app: SitemapBuilderApp }) {
  const renameApp         = useSitemapBuilder((s) => s.renameApp)
  const deleteApp         = useSitemapBuilder((s) => s.deleteApp)
  const toggleAppCollapsed = useSitemapBuilder((s) => s.toggleAppCollapsed)
  const addNavMenu        = useSitemapBuilder((s) => s.addNavMenu)

  const cfg = APP_CFG[app.kind]
  const AppIcon = cfg.Icon
  const [menuPickerOpen, setMenuPickerOpen] = useState(false)
  const totalPages = app.navMenus.reduce((n, m) => n + m.pages.length, 0)

  return (
    <div className={cn(
      'flex flex-col rounded-3xl border-2 overflow-visible',
      cfg.border,
    )} style={{ minWidth: 360 }}>
      {/* App header */}
      <div className={cn('flex items-center gap-3 rounded-t-[22px] px-4 py-3', cfg.headerBg)}>
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', cfg.iconBg)}>
          <AppIcon size={16} className={cfg.color} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={cn('text-[9px] font-bold tracking-widest uppercase', cfg.color)}>{cfg.label}</div>
          <InlineEdit value={app.name} onSave={(v) => renameApp(app.id, v)}
            className="text-[14px] font-bold text-app-text" placeholder="App name" />
        </div>
        <div className="flex items-center gap-1 text-[10px] text-app-subtle">
          <span>{app.navMenus.length} menu{app.navMenus.length !== 1 ? 's' : ''}</span>
          <span className="opacity-50">·</span>
          <span>{totalPages} page{totalPages !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {/* + Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuPickerOpen((v) => !v)}
              className="flex h-7 items-center gap-1 rounded-lg border border-app-border/50 bg-app-surface/50 px-2 text-[10px] font-medium text-app-text hover:bg-app-surface"
            ><Plus size={11} /> Menu</button>
            {menuPickerOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-xl" style={{ minWidth: 140 }}>
                {MENU_KIND_OPTIONS.map((o) => (
                  <button key={o.kind}
                    onClick={() => { addNavMenu(app.id, o.kind); setMenuPickerOpen(false) }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-app-text hover:bg-app-elevated"
                  >
                    {(() => { const MI = MENU_CFG[o.kind].Icon; return MI ? <span className="text-app-subtle"><MI size={11} /></span> : null })()}
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => toggleAppCollapsed(app.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-app-subtle hover:bg-app-surface/50 hover:text-app-text"
          >{app.collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}</button>
          <button
            onClick={() => deleteApp(app.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-app-subtle hover:bg-app-surface/50 hover:text-red-400"
          ><Trash2 size={13} /></button>
        </div>
      </div>

      {/* Nav menus */}
      {!app.collapsed && (
        <div className="flex flex-col gap-5 p-4">
          {app.navMenus.length === 0 ? (
            <p className="text-center text-[11px] text-app-subtle py-4">
              No menus — click <strong>+ Menu</strong> above
            </p>
          ) : (
            app.navMenus.map((menu, i) => (
              <div key={menu.id}>
                {i > 0 && <div className="mb-5 h-px bg-app-border/60" />}
                <NavMenuBlock menu={menu} appId={app.id} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── DnD overlay helpers ────────────────────────────────────────────────────────

function findPageAnywhere(apps: SitemapBuilderApp[], pgId: string): { page: SitemapBuilderPage; appId: string; menuId: string } | null {
  for (const a of apps) {
    for (const m of a.navMenus) {
      function search(pages: SitemapBuilderPage[]): SitemapBuilderPage | null {
        for (const p of pages) {
          if (p.id === pgId) return p
          if (p.subPages) { const f = search(p.subPages); if (f) return f }
        }
        return null
      }
      const found = search(m.pages)
      if (found) return { page: found, appId: a.id, menuId: m.id }
    }
  }
  return null
}

function findSectionAnywhere(apps: SitemapBuilderApp[], secId: string): { section: SitemapBuilderSection; pageId: string } | null {
  for (const a of apps) {
    for (const m of a.navMenus) {
      function search(pages: SitemapBuilderPage[]): { section: SitemapBuilderSection; pageId: string } | null {
        for (const p of pages) {
          const sec = p.sections.find((s) => s.id === secId)
          if (sec) return { section: sec, pageId: p.id }
          if (p.subPages) { const f = search(p.subPages); if (f) return f }
        }
        return null
      }
      const found = search(m.pages)
      if (found) return found
    }
  }
  return null
}

// ── Root ──────────────────────────────────────────────────────────────────────

export function SitemapNodeBuilder() {
  const apps              = useSitemapBuilder((s) => s.apps)
  const addApp            = useSitemapBuilder((s) => s.addApp)
  const reorderPages      = useSitemapBuilder((s) => s.reorderPages)
  const reorderSections   = useSitemapBuilder((s) => s.reorderSections)
  const moveSectionToPage = useSitemapBuilder((s) => s.moveSectionToPage)
  const exportJSON        = useSitemapBuilder((s) => s.exportJSON)

  const [view, setView] = useState<CardView>('list')
  const [appPickerOpen, setAppPickerOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { pan, reset, zoom } = useCanvasPan(containerRef)
  const [spaceHeld, setSpaceHeld] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) { e.preventDefault(); setSpaceHeld(true) }
    }
    const up = (e: KeyboardEvent) => { if (e.code === 'Space') setSpaceHeld(false) }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // ── DnD ───────────────────────────────────────────────────────────────────
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeDragItem = useCallback(() => {
    if (!activeId) return null
    if (activeId.startsWith('pg-')) {
      const r = findPageAnywhere(apps, activeId.replace('pg-', ''))
      return r ? { type: 'page' as const, ...r } : null
    }
    if (activeId.startsWith('sec-')) {
      const r = findSectionAnywhere(apps, activeId.replace('sec-', ''))
      return r ? { type: 'section' as const, ...r } : null
    }
    return null
  }, [activeId, apps])

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const a = String(active.id), o = String(over.id)

    // Page reorder within same menu
    if (a.startsWith('pg-') && o.startsWith('pg-')) {
      const aData = active.data.current as { appId: string; menuId: string; depth: number } | undefined
      const oData = over.data.current as { appId: string; menuId: string; depth: number } | undefined
      if (!aData || !oData) return
      if (aData.depth > 0 || oData.depth > 0) return // only root-level pages reorder
      if (aData.appId === oData.appId && aData.menuId === oData.menuId) {
        const menu = apps.find((ap) => ap.id === aData.appId)?.navMenus.find((m) => m.id === aData.menuId)
        if (!menu) return
        const fi = menu.pages.findIndex((p) => `pg-${p.id}` === a)
        const ti = menu.pages.findIndex((p) => `pg-${p.id}` === o)
        if (fi !== -1 && ti !== -1) reorderPages(aData.appId, aData.menuId, fi, ti)
      }
      return
    }

    // Section DnD
    if (a.startsWith('sec-')) {
      const secId = a.replace('sec-', '')
      const aData = active.data.current as { pageId: string } | undefined
      if (!aData) return
      const fromPageId = aData.pageId

      if (o.startsWith('sec-')) {
        const oData = over.data.current as { pageId: string; sectionId: string } | undefined
        if (!oData) return
        const toPageId = oData.pageId

        if (fromPageId === toPageId) {
          // Reorder within same page
          const page = findPageAnywhere(apps, fromPageId)?.page
          if (!page) return
          const fi = page.sections.findIndex((s) => s.id === secId)
          const ti = page.sections.findIndex((s) => s.id === oData.sectionId)
          if (fi !== -1 && ti !== -1) reorderSections(fromPageId, fi, ti)
        } else {
          // Move to different page
          const toPage = findPageAnywhere(apps, toPageId)?.page
          if (!toPage) return
          const atIdx = toPage.sections.findIndex((s) => s.id === oData.sectionId)
          moveSectionToPage(secId, fromPageId, toPageId, atIdx)
        }
      } else if (o.startsWith('pg-')) {
        const toPageId = o.replace('pg-', '')
        if (fromPageId !== toPageId) moveSectionToPage(secId, fromPageId, toPageId, Infinity)
      }
    }
  }

  const handleExport = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const el = document.createElement('a'); el.href = url; el.download = 'sitemap.json'; el.click()
    URL.revokeObjectURL(url)
  }

  const dragItem = activeDragItem()

  // Stats
  let totalApps = apps.length, totalMenus = 0, totalPages = 0, totalSections = 0
  for (const a of apps) {
    totalMenus += a.navMenus.length
    for (const m of a.navMenus) {
      function countPages(pages: SitemapBuilderPage[]) {
        for (const p of pages) {
          totalPages++; totalSections += p.sections.length
          if (p.subPages) countPages(p.subPages)
        }
      }
      countPages(m.pages)
    }
  }

  const VIEW_ICONS: Record<CardView, React.ReactNode> = {
    compact: <Layers size={13} />,
    list:    <LayoutList size={13} />,
    visual:  <Eye size={13} />,
  }

  return (
    <ViewCtx.Provider value={view}>
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-app-deep">

        {/* ── Toolbar ── */}
        <div className="relative z-10 flex items-center gap-2 border-b border-app-border bg-app-surface/80 px-4 py-2 backdrop-blur">
          <LayoutGrid size={14} className="text-app-subtle" />
          <span className="text-[12px] font-semibold text-app-text">Sitemap</span>
          <span className="text-[11px] text-app-subtle">
            {totalApps} app{totalApps !== 1 ? 's' : ''} · {totalMenus} menu{totalMenus !== 1 ? 's' : ''} · {totalPages} page{totalPages !== 1 ? 's' : ''} · {totalSections} section{totalSections !== 1 ? 's' : ''}
          </span>
          <div className="flex-1" />

          {/* View mode */}
          <div className="flex items-center gap-0.5 rounded-lg border border-app-border bg-app-elevated p-0.5">
            {(['compact', 'list', 'visual'] as CardView[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn('flex h-6 w-6 items-center justify-center rounded-md transition-colors',
                  view === v ? 'bg-app-surface shadow-app-sm text-app-text' : 'text-app-subtle hover:text-app-text')}
                title={v}
              >{VIEW_ICONS[v]}</button>
            ))}
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-0.5 rounded-lg border border-app-border bg-app-elevated px-1">
            <button onClick={() => zoom(-0.1)} className="flex h-6 w-6 items-center justify-center text-app-subtle hover:text-app-text"><ZoomOut size={12} /></button>
            <span className="min-w-[36px] text-center text-[11px] tabular-nums text-app-subtle">{Math.round(pan.zoom * 100)}%</span>
            <button onClick={() => zoom(0.1)} className="flex h-6 w-6 items-center justify-center text-app-subtle hover:text-app-text"><ZoomIn size={12} /></button>
            <button onClick={reset} className="flex h-6 w-6 items-center justify-center text-app-subtle hover:text-app-text"><Maximize2 size={11} /></button>
          </div>

          <button onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-app-border bg-app-elevated px-2.5 py-1.5 text-[11px] font-medium text-app-text transition-colors hover:border-app-border-strong"
          ><FileJson size={12} /> Export JSON</button>

          {/* + New App */}
          <div className="relative">
            <button onClick={() => setAppPickerOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg bg-app-accent px-2.5 py-1.5 text-[11px] font-semibold text-app-on-accent transition-opacity hover:opacity-90"
            ><Plus size={12} /> New App</button>
            {appPickerOpen && (
              <div className="absolute top-full right-0 mt-1 z-50 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-xl" style={{ minWidth: 160 }}>
                {APP_KIND_OPTIONS.map((o) => {
                  const c = APP_CFG[o.kind]
                  return (
                    <button key={o.kind}
                      onClick={() => { addApp(o.kind); setAppPickerOpen(false) }}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[11px] text-app-text hover:bg-app-elevated"
                    >
                      <c.Icon size={13} className={c.color} />
                      {o.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Canvas ── */}
        <div
          ref={containerRef}
          className={cn('relative flex-1 overflow-hidden select-none', spaceHeld && 'cursor-grab')}
        >
          <DotGrid {...pan} />

          <div data-canvas-pan="true" className="absolute inset-0" style={{ cursor: spaceHeld ? 'grab' : 'default' }}>
            <div style={{
              transform: `translate(${pan.x}px,${pan.y}px) scale(${pan.zoom})`,
              transformOrigin: '0 0',
              willChange: 'transform',
            }}>
              <DndContext
                id="sitemap-builder"
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                {/* Apps row */}
                <div className="flex items-start gap-8">
                  {apps.map((app) => (
                    <AppBlock key={app.id} app={app} />
                  ))}

                  {/* Ghost add app */}
                  <div className="relative">
                    <button
                      onClick={() => setAppPickerOpen((v) => !v)}
                      className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-app-border text-app-subtle transition-all hover:border-app-accent/60 hover:text-app-accent"
                      style={{ width: 200, height: 120 }}
                    >
                      <Plus size={18} />
                      <span className="text-[11px] font-medium">New App</span>
                    </button>
                  </div>
                </div>

                <DragOverlay dropAnimation={{ duration: 160, easing: 'ease' }}>
                  {dragItem?.type === 'section' && (
                    <SectionRow section={dragItem.section} pageId={dragItem.pageId} isOverlay />
                  )}
                  {dragItem?.type === 'page' && (
                    <PageNode page={dragItem.page} depth={0} isOverlay appId={dragItem.appId} menuId={dragItem.menuId} />
                  )}
                </DragOverlay>
              </DndContext>
            </div>
          </div>

          {apps.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
              <LayoutGrid size={32} className="text-app-subtle/40" />
              <p className="text-[13px] text-app-subtle">No apps — click New App or pick an archetype →</p>
            </div>
          )}
        </div>

        {/* ── Hint bar ── */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <p className="whitespace-nowrap rounded-full border border-app-border bg-app-elevated/80 px-4 py-1 text-[10px] text-app-subtle backdrop-blur">
            <kbd className="font-mono">Middle-drag</kbd> pan ·{' '}
            <kbd className="font-mono">Ctrl+scroll</kbd> zoom ·{' '}
            <kbd className="font-mono">Space+drag</kbd> pan ·{' '}
            Double-click names to rename
          </p>
        </div>
      </div>
    </ViewCtx.Provider>
  )
}
