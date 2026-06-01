'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Plus, LayoutGrid, Undo, Redo } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { MicroServicesServerRack } from '@/components/arch/MicroServicesServerRack'
import { ArchCanvasContextMenu, type ArchCanvasMenuState } from '@/components/arch/ArchCanvasContextMenu'
import { compareSitemapSiblings, getAppRoots } from '@/lib/arch/page-tree'
import { menuPlacementLabel } from '@/lib/arch/migrate-legacy-nav-menus'
import { isEditableTarget } from '@/lib/design-hub/keyboard'
import type { ArchPage, ServiceKind } from '@/types/arch'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onSelectPage: () => void
}

interface TreeNode {
  page: ArchPage
  children: TreeNode[]
  depth: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_SLOT_COLOR: Record<
  ArchPage['navSlot'],
  { bgClass: string; textClass: string; dotClass: string; iconClass: string; label: string; bg: string }
> = {
  topnav: {
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/8',
    textClass: 'text-sky-700 dark:text-sky-300',
    dotClass: 'bg-sky-500 dark:bg-sky-400',
    iconClass: 'text-sky-600 dark:text-sky-400',
    label: 'Top Nav',
    bg: 'rgba(56,189,248,0.08)',
  },
  sidebar: {
    bgClass: 'bg-violet-500/10 dark:bg-violet-500/8',
    textClass: 'text-violet-700 dark:text-violet-300',
    dotClass: 'bg-violet-500 dark:bg-violet-400',
    iconClass: 'text-violet-600 dark:text-violet-400',
    label: 'Sidebar',
    bg: 'rgba(167,139,250,0.08)',
  },
  footer: {
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/8',
    textClass: 'text-amber-700 dark:text-amber-300',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
    iconClass: 'text-amber-600 dark:text-amber-400',
    label: 'Footer',
    bg: 'rgba(251,191,36,0.08)',
  },
  hidden: {
    bgClass: 'bg-slate-500/10 dark:bg-slate-500/8',
    textClass: 'text-slate-600 dark:text-slate-400',
    dotClass: 'bg-slate-500 dark:bg-slate-400',
    iconClass: 'text-slate-600 dark:text-slate-400',
    label: 'Hidden',
    bg: 'rgba(107,114,128,0.05)',
  },
}

const PAGE_TYPE_BADGE: Record<ArchPage['type'], string> = {
  app:      'text-blue-600 dark:text-blue-400',
  navmenu:  'text-violet-600 dark:text-violet-400',
  page:     'text-app-subtle',
  subpage:  'text-slate-500 dark:text-slate-400',
  section:  'text-emerald-600 dark:text-emerald-400',
  service:  'text-cyan-600 dark:text-cyan-400',
  group:    'text-amber-600 dark:text-amber-400',
  modal:    'text-purple-600 dark:text-purple-400',
  redirect: 'text-rose-600 dark:text-rose-400',
}

const LEVEL_STYLES: Record<
  ArchPage['type'],
  { border: string; bg: string; textClass: string; indicatorClass: string }
> = {
  app:      { border: 'border-blue-500/30', bg: 'bg-blue-50/50 dark:bg-blue-950/15', textClass: 'text-blue-700 dark:text-blue-300', indicatorClass: 'bg-blue-500' },
  navmenu:  { border: 'border-violet-500/30', bg: 'bg-violet-50/50 dark:bg-violet-950/15', textClass: 'text-violet-700 dark:text-violet-300', indicatorClass: 'bg-violet-500' },
  page:     { border: 'border-app-border', bg: 'bg-app-surface', textClass: 'text-app-text', indicatorClass: 'bg-slate-300 dark:bg-slate-700' },
  subpage:  { border: 'border-app-border-subtle', bg: 'bg-app-bg/40 dark:bg-white/5', textClass: 'text-app-subtle', indicatorClass: 'bg-slate-200 dark:bg-slate-800' },
  section:  { border: 'border-dashed border-emerald-500/30', bg: 'bg-emerald-50/30 dark:bg-emerald-950/8', textClass: 'text-emerald-700 dark:text-emerald-300', indicatorClass: 'bg-emerald-500' },
  service:  { border: 'border-cyan-500/30', bg: 'bg-cyan-50/40 dark:bg-cyan-950/15', textClass: 'text-cyan-700 dark:text-cyan-300', indicatorClass: 'bg-cyan-500' },
  group:    { border: 'border-amber-500/20', bg: 'bg-amber-50/30 dark:bg-amber-950/10', textClass: 'text-amber-700 dark:text-amber-300', indicatorClass: 'bg-amber-500' },
  modal:    { border: 'border-purple-500/20', bg: 'bg-purple-50/30 dark:bg-purple-950/10', textClass: 'text-purple-700 dark:text-purple-300', indicatorClass: 'bg-purple-500' },
  redirect: { border: 'border-rose-500/20', bg: 'bg-rose-50/30 dark:bg-rose-950/10', textClass: 'text-rose-700 dark:text-rose-300', indicatorClass: 'bg-rose-500' },
}

const SERVICE_METRICS: Record<ServiceKind, { color: string; bg: string; label: string; dot: string }> = {
  api:      { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'API',      dot: '#38bdf8' },
  auth:     { color: '#c084fc', bg: 'rgba(192,132,252,0.12)', label: 'Auth',     dot: '#c084fc' },
  payment:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  label: 'Payment',  dot: '#fbbf24' },
  database: { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  label: 'Database', dot: '#34d399' },
}

const ZOOM_MIN = 0.4
const ZOOM_MAX = 2.0
const ZOOM_STEP = 0.15

// ─── Tree builder ─────────────────────────────────────────────────────────────

function buildAppTree(
  pages: Record<string, ArchPage>,
  parentId: string,
  depth: number,
): TreeNode[] {
  return Object.values(pages)
    .filter((p) => p.parentId === parentId && p.type !== 'service')
    .sort(compareSitemapSiblings)
    .map((page) => ({
      page,
      children: buildAppTree(pages, page.id, depth + 1),
      depth,
    }))
}

/** Application roots (app + group) for sitemap canvas — matches left tree. */
function buildAppForest(pages: Record<string, ArchPage>): TreeNode[] {
  return getAppRoots(pages).map((page) => ({
    page,
    children: buildAppTree(pages, page.id, 1),
    depth: 0,
  }))
}

// ─── Wired service bubbles ───────────────────────────────────────────────────

function WiredServiceBubbles({ page }: { page: ArchPage }) {
  const pages = useHub((s) => s.arch.pages)
  const wired = page.wiredServiceIds ?? []
  if (wired.length === 0 && page.services?.length) {
    return (
      <div className="absolute -top-2 right-2 flex gap-0.5">
        {page.services.map((svc) => {
          const spec = SERVICE_METRICS[svc]
          if (!spec) return null
          return (
            <span
              key={svc}
              className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7.5px] font-bold border font-mono tracking-wide shadow-app-sm bg-app-surface"
              style={{ borderColor: spec.dot, color: spec.color }}
              title={`${spec.label} (legacy wire)`}
            >
              {spec.label[0]}
            </span>
          )
        })}
      </div>
    )
  }
  if (!wired.length) return null
  return (
    <div className="absolute -top-2 right-2 flex gap-0.5 max-w-[72px] flex-wrap justify-end">
      {wired.map((id) => {
        const svcPage = pages[id]
        if (!svcPage) return null
        const kind = svcPage.serviceKind ?? 'api'
        const spec = SERVICE_METRICS[kind]
        return (
          <span
            key={id}
            className="flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full text-[7px] font-bold border font-mono tracking-wide shadow-app-sm bg-app-surface"
            style={{ borderColor: spec.dot, color: spec.color }}
            title={svcPage.name}
          >
            {svcPage.name.charAt(0).toUpperCase()}
          </span>
        )
      })}
    </div>
  )
}

// ─── Page card ────────────────────────────────────────────────────────────────

function PageCard({
  node,
  onSelect,
  onContextMenu,
}: {
  node: TreeNode
  onSelect: () => void
  onContextMenu: (pageId: string, e: React.MouseEvent) => void
}) {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archAddPage    = useHub((s) => s.archAddPage)

  const isSelected  = selectedId === node.page.id
  const hasChildren = node.children.length > 0
  const slotStyle   = NAV_SLOT_COLOR[node.page.navSlot]
  const levelStyle  = LEVEL_STYLES[node.page.type] || LEVEL_STYLES.page

  function handleClick() {
    archSelectPage(isSelected ? null : node.page.id)
    onSelect()
  }

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onContextMenu(node.page.id, e)
        }}
        data-page-id={node.page.id}
        className={cn(
          'group relative flex w-40 cursor-pointer flex-col gap-2 rounded-app border p-3.5 transition-all duration-150 select-none',
          levelStyle.border,
          isSelected
            ? 'shadow-app border-app-accent bg-app-accent-subtle/10'
            : cn('hover:border-app-border-strong hover:shadow-app-sm', levelStyle.bg),
        )}
        style={
          isSelected
            ? {
                background: `linear-gradient(145deg, ${slotStyle.bg}, rgba(38,128,235,0.12))`,
                borderColor: 'var(--app-accent)',
                boxShadow: '0 0 0 2px rgba(38,128,235,0.25), 0 4px 16px rgba(0,0,0,0.3)',
              }
            : undefined
        }
      >
        {/* Left accent bar (level indicator color) */}
        <div
          className={cn("absolute left-0 top-3 bottom-3 w-0.5 rounded-full", levelStyle.indicatorClass)}
        />

        {/* Dynamic Microservice Bindings indicator bubbles */}
        <WiredServiceBubbles page={node.page} />

        {/* Icon + type badge */}
        <div className="flex items-center justify-between pl-1">
          <div
            className={cn("flex h-7 w-7 items-center justify-center rounded-app-sm", slotStyle.bgClass)}
          >
            <IconRenderer
              name={node.page.icon}
              size={13}
              className={cn("opacity-80", slotStyle.iconClass)}
            />
          </div>
          <span className={cn('text-[9px] font-semibold uppercase tracking-wider', PAGE_TYPE_BADGE[node.page.type])}>
            {node.page.type}
          </span>
        </div>

        {/* Name */}
        <p className="text-[12px] font-semibold text-app-text leading-tight pl-1 truncate">
          {node.page.name}
        </p>

        {/* Route */}
        <p className="text-[10px] font-mono text-app-subtle truncate pl-1">
          {node.page.route}
        </p>

        {/* Nav menu placement vs page shell slot */}
        {node.page.type === 'navmenu' ? (
          <div
            className="flex items-center gap-1 pl-1"
            title="Menu drives header and/or sidebar from one tree"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
            <span className="text-[9.5px] font-medium text-violet-700 dark:text-violet-300">
              {menuPlacementLabel(node.page.menuPlacement)}
            </span>
          </div>
        ) : (
          <div
            className="flex items-center gap-1 pl-1"
            title={`Shell placement: ${slotStyle.label}`}
          >
            <span
              className={cn('inline-block h-1.5 w-1.5 rounded-full', slotStyle.dotClass)}
            />
            <span className={cn('text-[9.5px] font-medium', slotStyle.textClass)}>
              {slotStyle.label}
            </span>
          </div>
        )}

        {/* Add child button — appears on hover */}
        {node.page.type !== 'section' && (
          <button
            className="absolute -bottom-3 left-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-app-accent text-white shadow-app transition-transform hover:scale-110 group-hover:flex"
            title={`Add a new child page nested under ${node.page.name}`}
            onClick={(e) => {
              e.stopPropagation()
              archAddPage(node.page.id)
            }}
          >
            <Plus size={10} />
          </button>
        )}
      </div>

      {/* Connector line down to children */}
      {hasChildren && <div className="w-px h-5" />}

      {/* Children subtree */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          {/* Children row */}
          <div className="flex items-start gap-4">
            {node.children.map((child) => (
              <div key={child.page.id} className="flex flex-col items-center">
                <div className="w-px h-5" />
                <PageCard node={child} onSelect={onSelect} onContextMenu={onContextMenu} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Canvas toolbar ───────────────────────────────────────────────────────────

function CanvasToolbar({
  zoom,
  pageCount,
  onZoomIn,
  onZoomOut,
  onFit,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: {
  zoom: number
  pageCount: number
  onZoomIn(): void
  onZoomOut(): void
  onFit(): void
  canUndo: boolean
  canRedo: boolean
  onUndo(): void
  onRedo(): void
}) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-app border border-app-border bg-app-surface/90 px-2 py-1.5 shadow-app">
      {/* Zoom out */}
      <ToolBtn onClick={onZoomOut} disabled={zoom <= ZOOM_MIN} title="Zoom out to view more of the architecture sitemap canvas">
        <ZoomOut size={12} />
      </ToolBtn>

      {/* Zoom level */}
      <button
        onClick={onFit}
        title="Reset sitemap canvas zoom scale to 100%"
        className="min-w-[44px] text-center text-[11px] font-semibold text-app-muted hover:text-app-text transition-colors px-1.5"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom in */}
      <ToolBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in to inspect sitemap page card configurations">
        <ZoomIn size={12} />
      </ToolBtn>

      <div className="w-px h-4 bg-app-border mx-1" />

      {/* Undo */}
      <ToolBtn onClick={onUndo} disabled={!canUndo} title="Undo last architecture canvas modification (⌘Z)">
        <Undo size={12} />
      </ToolBtn>

      {/* Redo */}
      <ToolBtn onClick={onRedo} disabled={!canRedo} title="Redo last reverted architecture canvas modification (⌘Y)">
        <Redo size={12} />
      </ToolBtn>

      <div className="w-px h-4 bg-app-border mx-1" />

      {/* Fit to screen */}
      <ToolBtn onClick={onFit} title="Reset zoom and center sitemap canvas to workspace boundaries">
        <Maximize2 size={12} />
      </ToolBtn>

      <div className="w-px h-4 bg-app-border mx-1" />

      {/* Page count */}
      <div className="flex items-center gap-1.5 px-1.5" title="Total active pages and nested route groups currently defined in your sitemap">
        <LayoutGrid size={11} className="text-app-subtle" />
        <span className="text-[11px] text-app-subtle font-medium">
          {pageCount} {pageCount === 1 ? 'node' : 'nodes'}
        </span>
      </div>
    </div>
  )
}

function ToolBtn({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode
  onClick(): void
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-app-sm text-app-muted transition-all duration-150',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:text-app-text hover:bg-app-elevated',
      )}
    >
      {children}
    </button>
  )
}

// ─── Nav slot legend ─────────────────────────────────────────────────────────

function NavLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-app border border-app-border bg-app-surface/90 px-3 py-2 shadow-app">
      {Object.values(NAV_SLOT_COLOR).map((slot) => (
        <div key={slot.label} className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", slot.dotClass)} />
          <span className={cn("text-[10px] font-medium", slot.textClass)}>{slot.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd(): void }) {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        {/* Icon */}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-app-lg"
          style={{ background: 'rgba(38,128,235,0.1)', border: '1px solid rgba(38,128,235,0.2)' }}
        >
          <LayoutGrid size={28} className="text-app-accent opacity-70" />
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-app-text">Initialize Architecture Canvas</p>
          <p className="text-xs text-app-subtle leading-relaxed">
            Select a predefined blueprint profile from the left sidebar to populate a starter structure instantly, 
            or click below to build your canvas nodes manually.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 h-8 px-4 rounded-app-sm text-xs font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover transition-colors"
        >
          <Plus size={12} />
          Create First Canvas Node
        </button>
      </div>
    </div>
  )
}

// ─── Main canvas ──────────────────────────────────────────────────────────────

export function SitemapCanvas({ onSelectPage }: Props) {
  const pages      = useHub((s) => s.arch.pages)
  const archAddPage = useHub((s) => s.archAddPage)

  const [zoom, setZoom] = useState(1)
  const [connections, setConnections] = useState<Array<{ fromX: number; fromY: number; toX: number; toY: number; color: string; serviceKind: ServiceKind }>>([])
  const [treeLines, setTreeLines] = useState<Array<{ pathD: string }>>([])
  const [hoveredService, setHoveredService] = useState<ServiceKind | null>(null)
  const [contextMenu, setContextMenu] = useState<ArchCanvasMenuState>(null)

  const contentRef   = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const appRoots = buildAppForest(pages)
  const isEmpty =
    appRoots.length === 0 &&
    getAppRoots(pages).length === 0 &&
    Object.keys(pages).length === 0
  const pageCount = Object.values(pages).filter((p) => p.type !== 'service').length

  const zoomIn  = useCallback(() => setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX)), [])
  const zoomOut = useCallback(() => setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN)), [])
  const fitZoom = useCallback(() => setZoom(1), [])

  const openPageContextMenu = useCallback((pageId: string, e: React.MouseEvent) => {
    setContextMenu({ kind: 'page', pageId, x: e.clientX, y: e.clientY })
  }, [])

  const openCanvasContextMenu = useCallback((e: React.MouseEvent) => {
    setContextMenu({ kind: 'canvas', x: e.clientX, y: e.clientY })
  }, [])

  // Dynamic service and tree connections calculations
  const updateWires = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    const newConnections: typeof connections = []
    const newTreeLines: Array<{ pathD: string }> = []

    // Helper to get unscaled coordinates relative to content container
    const getUnscaledCoords = (rect: DOMRect) => {
      return {
        left: (rect.left - contentRect.left) / zoom,
        top: (rect.top - contentRect.top) / zoom,
        width: rect.width / zoom,
        height: rect.height / zoom,
      }
    }

    // 1. Tree connections
    const childrenByParent: Record<string, ArchPage[]> = {}
    Object.values(pages).forEach((pg) => {
      if (pg.parentId) {
        if (!childrenByParent[pg.parentId]) {
          childrenByParent[pg.parentId] = []
        }
        childrenByParent[pg.parentId].push(pg)
      }
    })

    Object.entries(childrenByParent).forEach(([parentId, children]) => {
      const parentEl = contentRef.current?.querySelector(`[data-page-id="${parentId}"]`)
      if (!parentEl) return

      // Sort children by order
      children.sort((a, b) => a.order - b.order)

      // Find children card elements
      const childCoordsList: Array<{ id: string; centerX: number; topY: number }> = []
      children.forEach((c) => {
        const el = contentRef.current?.querySelector(`[data-page-id="${c.id}"]`)
        if (el) {
          const rect = el.getBoundingClientRect()
          const coords = getUnscaledCoords(rect)
          childCoordsList.push({
            id: c.id,
            centerX: coords.left + coords.width / 2,
            topY: coords.top,
          })
        }
      })

      if (childCoordsList.length === 0) return

      const parentRect = parentEl.getBoundingClientRect()
      const parentCoords = getUnscaledCoords(parentRect)
      const parentCenterX = parentCoords.left + parentCoords.width / 2
      const parentBottomY = parentCoords.top + parentCoords.height

      // Find minimum child top Y to set connection hub height
      const minChildTopY = Math.min(...childCoordsList.map((c) => c.topY))
      
      // Vertical space buffer for drawing right angles nicely
      const verticalGap = minChildTopY - parentBottomY
      const midY = parentBottomY + Math.max(verticalGap / 2, 8)

      if (childCoordsList.length === 1) {
        const child = childCoordsList[0]
        // Single child tree connection (straight vertical or simple step path)
        if (Math.abs(parentCenterX - child.centerX) < 2) {
          newTreeLines.push({
            pathD: `M ${parentCenterX} ${parentBottomY} L ${parentCenterX} ${child.topY}`,
          })
        } else {
          newTreeLines.push({
            pathD: `M ${parentCenterX} ${parentBottomY} L ${parentCenterX} ${midY} L ${child.centerX} ${midY} L ${child.centerX} ${child.topY}`,
          })
        }
      } else {
        // Multi-child tree connection
        // A vertical drop from parent
        newTreeLines.push({
          pathD: `M ${parentCenterX} ${parentBottomY} L ${parentCenterX} ${midY}`,
        })

        // A horizontal bar at midY spanning from the leftmost to the rightmost child
        const centerXs = childCoordsList.map((c) => c.centerX)
        const minX = Math.min(...centerXs)
        const maxX = Math.max(...centerXs)
        newTreeLines.push({
          pathD: `M ${minX} ${midY} L ${maxX} ${midY}`,
        })

        // A vertical drop from midY to each child
        childCoordsList.forEach((child) => {
          newTreeLines.push({
            pathD: `M ${child.centerX} ${midY} L ${child.centerX} ${child.topY}`,
          })
        })
      }
    })

    // 2. Microservice connections (instance ids)
    Object.values(pages).forEach((pg) => {
      if (pg.type === 'service') return
      const wireIds =
        pg.wiredServiceIds && pg.wiredServiceIds.length > 0
          ? pg.wiredServiceIds
          : []
      if (!wireIds.length) return

      const cardEl = contentRef.current?.querySelector(`[data-page-id="${pg.id}"]`)
      if (!cardEl) return

      const cardRect = cardEl.getBoundingClientRect()
      const fromX = cardRect.left + cardRect.width / 2 - containerRect.left
      const fromY = cardRect.bottom - containerRect.top

      wireIds.forEach((svcId) => {
        const svcPage = pages[svcId]
        const svcEl = containerRef.current?.querySelector(`[data-service-id="${svcId}"]`)
        if (!svcEl || !svcPage) return
        const svcRect = svcEl.getBoundingClientRect()
        const toX = svcRect.left + svcRect.width / 2 - containerRect.left
        const toY = svcRect.top - containerRect.top
        const kind = svcPage.serviceKind ?? 'api'
        const color = SERVICE_METRICS[kind]?.color ?? '#38bdf8'
        newConnections.push({ fromX, fromY, toX, toY, color, serviceKind: kind })
      })
    })

    setConnections(newConnections)
    setTreeLines(newTreeLines)
  }, [pages, zoom])

  const hubSection = useHub((s) => s.section)

  useEffect(() => {
    // Run update logic after layouts settle
    const timer = setTimeout(updateWires, 150)
    window.addEventListener('resize', updateWires)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateWires)
    }
  }, [pages, updateWires, zoom])

  // Hidden tabpanels use display:none — recalc wire geometry when architecture becomes visible
  useEffect(() => {
    if (hubSection !== 'architecture') return
    const raf = requestAnimationFrame(() => {
      updateWires()
      setTimeout(updateWires, 150)
    })
    return () => cancelAnimationFrame(raf)
  }, [hubSection, updateWires])

  // Scroll-wheel zoom
  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    if (e.deltaY < 0) zoomIn()
    else zoomOut()
  }

  const selectedPageId = useHub((s) => s.arch.selectedPageId)
  const canUndo        = useHub((s) => s.archPast.length > 0)
  const canRedo        = useHub((s) => s.archFuture.length > 0)
  const undo           = useHub((s) => s.archUndo)
  const redo           = useHub((s) => s.archRedo)
  const archDeletePage = useHub((s) => s.archDeletePage)

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isEditableTarget(document.activeElement)) return

      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          if (canRedo) redo()
        } else {
          if (canUndo) undo()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        if (canRedo) redo()
      }

      // N: Add child page under selected (or root if none)
      if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        archAddPage(selectedPageId)
        if (onSelectPage) onSelectPage()
      }

      // Del / Backspace: Delete selected page
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPageId) {
        e.preventDefault()
        archDeletePage(selectedPageId)
      }

      // /: Focus search
      if (e.key === '/') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPageId, canUndo, canRedo, undo, redo, archAddPage, archDeletePage, onSelectPage])

  return (
    <div
      ref={containerRef}
      className="canvas-grid flex-1 overflow-hidden relative"
      onWheel={handleWheel}
    >
      {/* Dynamic glow styles */}
      <style>{`
        @keyframes dynamicDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .wire-path-glow {
          stroke-dasharray: 5 3;
          animation: dynamicDash 1.2s linear infinite;
        }
        .wire-path-glow-fast {
          stroke-dasharray: 8 4;
          animation: dynamicDash 0.5s linear infinite;
        }
      `}</style>

      {/* Toolbar */}
      {!isEmpty && (
        <CanvasToolbar
          zoom={zoom}
          pageCount={pageCount}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFit={fitZoom}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
        />
      )}

      {/* SVG Connection Layer */}
      {!isEmpty && connections.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-10">
          {connections.map((c, i) => {
            const isHighlighted = hoveredService === null || hoveredService === c.serviceKind
            const isDirectHover = hoveredService === c.serviceKind
            // Cubic bezier anchor points calculations for smooth curves
            const controlY = c.fromY + (c.toY - c.fromY) * 0.5
            const pathD = `M ${c.fromX} ${c.fromY} C ${c.fromX} ${controlY}, ${c.toX} ${controlY}, ${c.toX} ${c.toY}`
            return (
              <g key={i} className={cn("transition-all duration-200", isHighlighted ? "opacity-90" : "opacity-15")}>
                {/* Background Shadow line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth={isDirectHover ? 6 : 4}
                />
                {/* Base color line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={isDirectHover ? 2.5 : 1.5}
                  className="opacity-45"
                />
                {/* Glow dash line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={c.color}
                  strokeWidth={isDirectHover ? 2.5 : 1.5}
                  className={cn("wire-path-glow", isDirectHover ? "wire-path-glow-fast" : "")}
                />
              </g>
            )
          })}
        </svg>
      )}

      <ArchCanvasContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />

      {/* Scrollable zoom container */}
      <div
        className="h-full overflow-auto app-scroll"
        onScroll={updateWires}
        onContextMenu={(e) => {
          if ((e.target as HTMLElement).closest('[data-page-id]')) return
          e.preventDefault()
          openCanvasContextMenu(e)
        }}
      >
        <div
          style={{
            position: 'relative',
            transformOrigin: 'top center',
            transform: `scale(${zoom})`,
            transition: 'transform 0.15s ease',
            padding: '64px 48px 120px',
            minHeight: '100%',
          }}
          ref={contentRef}
        >
          <MicroServicesServerRack onSelectPage={onSelectPage} />
          {isEmpty ? (
            <EmptyState onAdd={() => archAddPage(null)} />
          ) : appRoots.length === 0 ? (
            <div className="rounded-app border border-dashed border-app-border px-6 py-8 text-center">
              <p className="text-[11px] text-app-subtle">No applications yet.</p>
              <button
                type="button"
                className="mt-2 text-[11px] font-semibold text-app-accent hover:underline"
                onClick={() => archAddPage(null)}
              >
                + Add application
              </button>
            </div>
          ) : (
            <>
              <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
                {treeLines.map((line, idx) => (
                  <path
                    key={idx}
                    d={line.pathD}
                    fill="none"
                    stroke="var(--app-border)"
                    strokeWidth={1.5}
                    className="transition-all duration-150"
                  />
                ))}
              </svg>
              <div className="flex flex-wrap gap-16 justify-start items-start relative z-10">
                {appRoots.map((root) => (
                  <PageCard
                    key={root.page.id}
                    node={root}
                    onSelect={onSelectPage}
                    onContextMenu={openPageContextMenu}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nav slot legend */}
      {!isEmpty && <NavLegend />}
    </div>
  )
}
