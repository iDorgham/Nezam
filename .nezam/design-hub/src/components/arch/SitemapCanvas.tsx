'use client'

import { useState, useRef, useCallback } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Plus, LayoutGrid, Undo, Redo } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { useEffect } from 'react'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'

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

const NAV_SLOT_COLOR: Record<ArchPage['navSlot'], { ring: string; bg: string; text: string; dot: string; label: string }> = {
  topnav:  { ring: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  text: '#7dd3fc', dot: '#38bdf8', label: 'Top Nav'  },
  sidebar: { ring: '#a78bfa', bg: 'rgba(167,139,250,0.08)', text: '#c4b5fd', dot: '#a78bfa', label: 'Sidebar'  },
  footer:  { ring: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  text: '#fde68a', dot: '#fbbf24', label: 'Footer'   },
  hidden:  { ring: '#6b7280', bg: 'rgba(107,114,128,0.05)', text: '#9ca3af', dot: '#6b7280', label: 'Hidden'   },
}

const PAGE_TYPE_BADGE: Record<ArchPage['type'], string> = {
  page:     'text-app-subtle',
  group:    'text-amber-400',
  modal:    'text-purple-400',
  redirect: 'text-rose-400',
}

const ZOOM_MIN = 0.4
const ZOOM_MAX = 2.0
const ZOOM_STEP = 0.15

// ─── Tree builder ─────────────────────────────────────────────────────────────

function buildTree(pages: Record<string, ArchPage>, parentId: string | null, depth: number): TreeNode[] {
  return Object.values(pages)
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((page) => ({
      page,
      children: buildTree(pages, page.id, depth + 1),
      depth,
    }))
}

// ─── Page card ────────────────────────────────────────────────────────────────

function PageCard({ node, onSelect }: { node: TreeNode; onSelect: () => void }) {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archAddPage    = useHub((s) => s.archAddPage)

  const isSelected  = selectedId === node.page.id
  const hasChildren = node.children.length > 0
  const slotStyle   = NAV_SLOT_COLOR[node.page.navSlot]

  function handleClick() {
    archSelectPage(isSelected ? null : node.page.id)
    onSelect()
  }

  return (
    <div className="flex flex-col items-center">
      {/* Card */}
      <div
        onClick={handleClick}
        className={cn(
          'group relative flex w-40 cursor-pointer flex-col gap-2 rounded-xl border p-3.5 transition-all duration-150 select-none',
          isSelected
            ? 'shadow-lg'
            : 'hover:border-app-border-strong hover:shadow-md',
        )}
        style={{
          background: isSelected
            ? `linear-gradient(145deg, ${slotStyle.bg}, rgba(38,128,235,0.12))`
            : 'var(--app-elevated)',
          borderColor: isSelected ? 'var(--app-accent)' : 'var(--app-border)',
          boxShadow: isSelected
            ? '0 0 0 2px rgba(38,128,235,0.25), 0 4px 16px rgba(0,0,0,0.3)'
            : undefined,
        }}
      >
        {/* Left accent bar (nav slot color) */}
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ backgroundColor: slotStyle.ring }}
        />

        {/* Icon + type badge */}
        <div className="flex items-center justify-between pl-1">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: slotStyle.bg }}
          >
            <IconRenderer
              name={node.page.icon}
              size={13}
              className="opacity-80"
              style={{ color: slotStyle.ring }}
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

        {/* Nav slot badge */}
        <div
          className="flex items-center gap-1 pl-1"
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: slotStyle.dot }}
          />
          <span className="text-[9.5px] font-medium" style={{ color: slotStyle.text }}>
            {slotStyle.label}
          </span>
        </div>

        {/* Add child button — appears on hover */}
        <button
          className="absolute -bottom-3 left-1/2 z-10 hidden h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-app-accent text-white shadow-lg transition-transform hover:scale-110 group-hover:flex"
          title="Add child page"
          onClick={(e) => {
            e.stopPropagation()
            archAddPage(node.page.id)
          }}
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Connector line down to children */}
      {hasChildren && <div className="w-px h-5 bg-app-border" />}

      {/* Children subtree */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          {/* Horizontal connector bar across children */}
          {node.children.length > 1 && (
            <div
              className="h-px bg-app-border"
              style={{ width: `${node.children.length * 176 - 16}px` }}
            />
          )}
          {/* Children row */}
          <div className="flex items-start gap-4">
            {node.children.map((child) => (
              <div key={child.page.id} className="flex flex-col items-center">
                <div className="w-px h-5 bg-app-border" />
                <PageCard node={child} onSelect={onSelect} />
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
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-xl border border-app-border bg-app-surface/90 px-2 py-1.5 shadow-lg backdrop-blur-md">
      {/* Zoom out */}
      <ToolBtn onClick={onZoomOut} disabled={zoom <= ZOOM_MIN} title="Zoom out">
        <ZoomOut size={12} />
      </ToolBtn>

      {/* Zoom level */}
      <button
        onClick={onFit}
        title="Reset zoom"
        className="min-w-[44px] text-center text-[11px] font-semibold text-app-muted hover:text-app-text transition-colors px-1.5"
      >
        {Math.round(zoom * 100)}%
      </button>

      {/* Zoom in */}
      <ToolBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in">
        <ZoomIn size={12} />
      </ToolBtn>

      <div className="w-px h-4 bg-app-border mx-1" />

      {/* Undo */}
      <ToolBtn onClick={onUndo} disabled={!canUndo} title="Undo (⌘Z)">
        <Undo size={12} />
      </ToolBtn>

      {/* Redo */}
      <ToolBtn onClick={onRedo} disabled={!canRedo} title="Redo (⌘Y)">
        <Redo size={12} />
      </ToolBtn>

      <div className="w-px h-4 bg-app-border mx-1" />

      {/* Fit to screen */}
      <ToolBtn onClick={onFit} title="Fit to screen">
        <Maximize2 size={12} />
      </ToolBtn>

      <div className="w-px h-4 bg-app-border mx-1" />

      {/* Page count */}
      <div className="flex items-center gap-1.5 px-1.5">
        <LayoutGrid size={11} className="text-app-subtle" />
        <span className="text-[11px] text-app-subtle font-medium">
          {pageCount} {pageCount === 1 ? 'page' : 'pages'}
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
        'flex h-6 w-6 items-center justify-center rounded-lg text-app-muted transition-all duration-100',
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
    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-xl border border-app-border bg-app-surface/90 px-3 py-2 shadow-lg backdrop-blur-md">
      {Object.values(NAV_SLOT_COLOR).map((slot) => (
        <div key={slot.label} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slot.dot }} />
          <span className="text-[10px] text-app-subtle font-medium">{slot.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd(): void }) {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        {/* Icon */}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: 'rgba(38,128,235,0.1)', border: '1px solid rgba(38,128,235,0.2)' }}
        >
          <LayoutGrid size={28} className="text-app-accent opacity-70" />
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-app-text">No pages yet</p>
          <p className="text-xs text-app-subtle leading-relaxed">
            Pick a profile from the left panel to start with a pre-built structure,
            or add pages manually.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 h-8 px-4 rounded-app-sm text-xs font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover transition-colors"
        >
          <Plus size={12} />
          Add first page
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
  const contentRef      = useRef<HTMLDivElement>(null)

  const roots    = buildTree(pages, null, 0)
  const isEmpty  = roots.length === 0
  const pageCount = Object.keys(pages).length

  const zoomIn  = useCallback(() => setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX)), [])
  const zoomOut = useCallback(() => setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN)), [])
  const fitZoom = useCallback(() => setZoom(1), [])

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
      const activeEl = document.activeElement
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return
      }

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
    <div className="canvas-grid flex-1 overflow-hidden relative" onWheel={handleWheel}>
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

      {/* Scrollable zoom container */}
      <div className="h-full overflow-auto app-scroll">
        <div
          style={{
            transformOrigin: 'top center',
            transform: `scale(${zoom})`,
            transition: 'transform 0.15s ease',
            padding: '64px 48px 48px',
            minHeight: '100%',
          }}
          ref={contentRef}
        >
          {isEmpty ? (
            <EmptyState onAdd={() => archAddPage(null)} />
          ) : (
            <div className="flex flex-wrap gap-16 justify-start items-start">
              {roots.map((root) => (
                <PageCard key={root.page.id} node={root} onSelect={onSelectPage} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav slot legend */}
      {!isEmpty && <NavLegend />}
    </div>
  )
}
