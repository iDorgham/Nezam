'use client'

/**
 * Sitemap — full professional 3-panel layout
 *
 * Left panel   : Page tree grouped by type, with add/delete/nest controls
 * Center panel : Visual flow diagram (pure CSS/SVG, no external lib)
 * Right panel  : Page property inspector (title, route, type, nav settings)
 */

import React, { useState, useCallback, useRef } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import type { Page } from '@/lib/store/session.store'
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Globe,
  Lock,
  Shield,
  Layers,
  Code2,
  Link2,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  Map,
  FileText,
  Settings,
  Home,
  ArrowRight,
  Copy,
  CornerDownRight,
  Check,
  X,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).substring(2, 10)

const PAGE_TYPE_META: Record<Page['type'], { icon: React.FC<any>; color: string; label: string }> = {
  public:  { icon: Globe,  color: '#3b82f6', label: 'Public'  },
  auth:    { icon: Lock,   color: '#f59e0b', label: 'Auth'    },
  admin:   { icon: Shield, color: '#ef4444', label: 'Admin'   },
  modal:   { icon: Layers, color: '#8b5cf6', label: 'Modal'   },
  embed:   { icon: Code2,  color: '#10b981', label: 'Embed'   },
}

// ─── Left panel: Page tree ────────────────────────────────────────────────────

interface TreeNodeProps {
  page: Page
  depth: number
  children: Page[]
  allPages: Page[]
  selectedId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onAddChild: (parentId: string) => void
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
}

function TreeNode({
  page, depth, children, allPages, selectedId, onSelect,
  onDelete, onAddChild, expandedIds, toggleExpanded,
}: TreeNodeProps) {
  const meta = PAGE_TYPE_META[page.type]
  const Icon = meta.icon
  const hasChildren = children.length > 0
  const isExpanded = expandedIds.has(page.id)
  const isSelected = selectedId === page.id

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer group transition-colors ${
          isSelected
            ? 'bg-ds-primary/10 text-ds-text-primary'
            : 'text-ds-text-muted hover:bg-ds-surface-hover hover:text-ds-text-primary'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => onSelect(page.id)}
      >
        {/* Expand toggle */}
        <button
          className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-ds-text-muted hover:text-ds-text-muted transition-colors"
          onClick={e => { e.stopPropagation(); if (hasChildren) toggleExpanded(page.id) }}
        >
          {hasChildren
            ? (isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />)
            : <span className="w-1.5 h-1.5 rounded-full bg-ds-surface-hover inline-block" />}
        </button>

        {/* Page type icon */}
        <Icon size={12} style={{ color: meta.color }} className="flex-shrink-0" />

        {/* Title */}
        <span className="flex-1 text-xs truncate">{page.title}</span>

        {/* Route pill */}
        <span className="text-[9px] text-ds-text-muted font-mono truncate max-w-[80px] hidden group-hover:block">
          {page.route}
        </span>

        {/* Nav indicator */}
        {page.showInNav && (
          <Eye size={10} className="text-ds-text-muted flex-shrink-0" />
        )}

        {/* Action buttons — appear on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onAddChild(page.id) }}
            className="p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-ds-primary transition-colors"
            title="Add child page"
          >
            <Plus size={10} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(page.id) }}
            className="p-0.5 rounded hover:bg-ds-surface-hover text-ds-text-muted hover:text-[#ef4444] transition-colors"
            title="Delete page"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-2 w-px bg-ds-surface-hover rounded-full"
            style={{ left: `${8 + depth * 16 + 6}px` }}
          />
          {children.map(child => (
            <TreeNode
              key={child.id}
              page={child}
              depth={depth + 1}
              children={allPages.filter(p => p.parentId === child.id)}
              allPages={allPages}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onAddChild={onAddChild}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PageTree({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { sitemap, setSitemap, addLog } = useSessionStore()
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleAddRoot = (type: Page['type'] = 'public') => {
    const newPage: Page = {
      id: uid(), title: 'New Page', route: '/new-page', type,
      showInNav: true, navPosition: sitemap.filter(p => !p.parentId).length,
    }
    setSitemap([...sitemap, newPage])
    onSelect(newPage.id)
    addLog(`Created page: ${newPage.title}`)
  }

  const handleAddChild = (parentId: string) => {
    const parent = sitemap.find(p => p.id === parentId)
    const newPage: Page = {
      id: uid(), title: 'Child Page', route: `${parent?.route ?? ''}/child`,
      type: parent?.type ?? 'public', parentId, showInNav: false,
    }
    setSitemap([...sitemap, newPage])
    setExpandedIds(prev => new Set(prev).add(parentId))
    onSelect(newPage.id)
  }

  const handleDelete = (id: string) => {
    // Remove page and all descendants
    const toRemove = new Set<string>()
    const collect = (pid: string) => {
      toRemove.add(pid)
      sitemap.filter(p => p.parentId === pid).forEach(p => collect(p.id))
    }
    collect(id)
    setSitemap(sitemap.filter(p => !toRemove.has(p.id)))
    addLog(`Deleted page: ${id}`)
  }

  const filtered = search
    ? sitemap.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.route.toLowerCase().includes(search.toLowerCase())
      )
    : sitemap

  const roots = filtered.filter(p => !p.parentId)

  const groupedRoots = {
    public: roots.filter(p => p.type === 'public'),
    auth:   roots.filter(p => p.type === 'auth'),
    admin:  roots.filter(p => p.type === 'admin'),
    modal:  roots.filter(p => p.type === 'modal'),
    embed:  roots.filter(p => p.type === 'embed'),
  }

  return (
    <div className="w-[240px] min-w-[240px] bg-ds-surface border-e border-ds-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ds-border flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-ds-text-primary">Site Pages</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-ds-text-muted tabular-nums">{sitemap.length}</span>
            <button
              onClick={() => handleAddRoot()}
              className="p-1 rounded-lg bg-ds-primary/10 text-ds-primary hover:bg-ds-primary/20 transition-colors"
              title="Add page"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={11} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted" />
          <input
            type="text"
            placeholder="Search pages…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-ds-surface border border-ds-border rounded-lg ps-7 pe-3 py-1.5 text-[11px] text-ds-text-primary placeholder-[#3A3E4F] focus:outline-none focus:border-ds-primary/50"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {sitemap.length === 0 ? (
          <div className="py-8 text-center">
            <Map size={24} className="mx-auto text-[#2A2E3F] mb-3" />
            <p className="text-xs text-ds-text-muted mb-4">No pages yet</p>
            <div className="grid grid-cols-2 gap-1.5">
              {(['public', 'auth', 'admin', 'modal'] as Page['type'][]).map(type => {
                const meta = PAGE_TYPE_META[type]
                const Icon = meta.icon
                return (
                  <button
                    key={type}
                    onClick={() => handleAddRoot(type)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-ds-surface border border-ds-border hover:border-ds-primary/40 transition-colors text-start"
                  >
                    <Icon size={10} style={{ color: meta.color }} />
                    <span className="text-[10px] text-ds-text-muted">{meta.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          Object.entries(groupedRoots).map(([groupKey, groupPages]) => {
            if (groupPages.length === 0) return null
            const meta = PAGE_TYPE_META[groupKey as Page['type']]
            const Icon = meta.icon
            return (
              <div key={groupKey} className="mb-2">
                <div className="flex items-center gap-1.5 px-2 py-1 mb-0.5">
                  <Icon size={10} style={{ color: meta.color }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                  <span className="text-[9px] text-ds-text-muted ms-auto">{groupPages.length}</span>
                </div>
                {groupPages.map(page => (
                  <TreeNode
                    key={page.id}
                    page={page}
                    depth={0}
                    children={sitemap.filter(p => p.parentId === page.id)}
                    allPages={sitemap}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    onDelete={handleDelete}
                    onAddChild={handleAddChild}
                    expandedIds={expandedIds}
                    toggleExpanded={toggleExpanded}
                  />
                ))}
              </div>
            )
          })
        )}
      </div>

      {/* Footer: Add page type buttons */}
      <div className="px-3 py-3 border-t border-ds-border flex-shrink-0">
        <div className="grid grid-cols-5 gap-1">
          {(Object.keys(PAGE_TYPE_META) as Page['type'][]).map(type => {
            const meta = PAGE_TYPE_META[type]
            const Icon = meta.icon
            return (
              <button
                key={type}
                onClick={() => handleAddRoot(type)}
                title={`Add ${meta.label} page`}
                className="flex flex-col items-center gap-1 py-1.5 rounded-lg bg-ds-surface border border-ds-border hover:border-ds-primary/40 transition-colors"
              >
                <Icon size={11} style={{ color: meta.color }} />
                <span className="text-[8px] text-ds-text-muted">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Center: Visual diagram ───────────────────────────────────────────────────

interface DiagramNode {
  page: Page
  x: number
  y: number
  width: number
  height: number
  children: DiagramNode[]
}

const NODE_W = 140
const NODE_H = 52
const H_GAP = 20
const V_GAP = 48

function layoutTree(page: Page, allPages: Page[], x: number, y: number): DiagramNode {
  const children = allPages.filter(p => p.parentId === page.id)
  const childNodes = children.map((child, i) => {
    return layoutTree(child, allPages, 0, y + NODE_H + V_GAP)
  })

  // Recompute x positions for children
  let totalWidth = childNodes.reduce((acc, n) => acc + n.width, 0) + Math.max(0, childNodes.length - 1) * H_GAP
  let cx = x + (NODE_W - totalWidth) / 2
  const repositioned = childNodes.map(n => {
    const repositioned = { ...n, x: cx }
    cx += n.width + H_GAP
    return repositioned
  })

  const width = Math.max(NODE_W, totalWidth)
  return { page, x, y, width, height: NODE_H, children: repositioned }
}

function flattenNodes(node: DiagramNode): DiagramNode[] {
  return [node, ...node.children.flatMap(flattenNodes)]
}

function DiagramNodeCard({
  node,
  isSelected,
  onSelect,
}: {
  node: DiagramNode
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const meta = PAGE_TYPE_META[node.page.type]
  const Icon = meta.icon

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onSelect(node.page.id)}
      className="cursor-pointer"
    >
      {/* Card background */}
      <rect
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={isSelected ? '#FF5701' : '#0D0F18'}
        stroke={isSelected ? '#FF5701' : '#1E2130'}
        strokeWidth={isSelected ? 1.5 : 1}
        className="transition-all"
      />

      {/* Type color accent strip */}
      <rect
        width={3}
        height={NODE_H}
        rx={2}
        fill={meta.color}
        opacity={0.8}
      />

      {/* Icon */}
      <foreignObject x={10} y={(NODE_H - 14) / 2} width={14} height={14}>
        <Icon size={12} style={{ color: isSelected ? '#fff' : meta.color }} />
      </foreignObject>

      {/* Title */}
      <text
        x={30}
        y={NODE_H / 2 - 3}
        fill={isSelected ? '#fff' : '#e5e7eb'}
        fontSize={10}
        fontWeight={600}
        fontFamily="system-ui, sans-serif"
      >
        {node.page.title.length > 14 ? node.page.title.substring(0, 13) + '…' : node.page.title}
      </text>

      {/* Route */}
      <text
        x={30}
        y={NODE_H / 2 + 9}
        fill={isSelected ? 'rgba(255,255,255,0.7)' : '#4B5563'}
        fontSize={8}
        fontFamily="monospace, monospace"
      >
        {node.page.route.length > 18 ? node.page.route.substring(0, 17) + '…' : node.page.route}
      </text>

      {/* Nav eye icon */}
      {node.page.showInNav && (
        <circle cx={NODE_W - 10} cy={10} r={4} fill={meta.color} opacity={0.5} />
      )}
    </g>
  )
}

function SitemapDiagram({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { sitemap } = useSessionStore()
  const roots = sitemap.filter(p => !p.parentId)

  // Lay out all root trees side by side
  let allNodes: DiagramNode[] = []
  let cx = 30
  roots.forEach(root => {
    const node = layoutTree(root, sitemap, cx, 30)
    allNodes.push(node)
    cx += node.width + 40
  })

  const flat = allNodes.flatMap(flattenNodes)
  const maxX = Math.max(60, ...flat.map(n => n.x + NODE_W + 30))
  const maxY = Math.max(120, ...flat.map(n => n.y + NODE_H + 30))

  // Build edges (parent → child center-bottom to center-top)
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = []
  const collectEdges = (node: DiagramNode) => {
    node.children.forEach(child => {
      edges.push({
        x1: node.x + NODE_W / 2,
        y1: node.y + NODE_H,
        x2: child.x + NODE_W / 2,
        y2: child.y,
      })
      collectEdges(child)
    })
  }
  allNodes.forEach(collectEdges)

  if (sitemap.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-ds-surface">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-ds-surface border border-ds-border flex items-center justify-center mx-auto mb-4">
            <Map size={28} className="text-ds-primary" />
          </div>
          <p className="text-sm text-ds-text-primary font-medium mb-1">No Pages Yet</p>
          <p className="text-xs text-ds-text-muted">Add pages from the left panel to visualize your site structure</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-ds-surface relative">
      {/* Dot grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="sitemap-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="var(--ds-text-muted)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sitemap-dots)" />
      </svg>

      <svg
        width={maxX}
        height={maxY}
        viewBox={`0 0 ${maxX} ${maxY}`}
        className="relative z-10"
        style={{ minWidth: maxX, minHeight: maxY }}
      >
        {/* Edges */}
        {edges.map((e, i) => {
          const mx = (e.x1 + e.x2) / 2
          const my = (e.y1 + e.y2) / 2
          return (
            <path
              key={i}
              d={`M ${e.x1} ${e.y1} C ${e.x1} ${my}, ${e.x2} ${my}, ${e.x2} ${e.y2}`}
              fill="none"
              stroke="var(--ds-border)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          )
        })}

        {/* Nodes */}
        {flat.map(node => (
          <DiagramNodeCard
            key={node.page.id}
            node={node}
            isSelected={selectedId === node.page.id}
            onSelect={onSelect}
          />
        ))}
      </svg>
    </div>
  )
}

// ─── Right panel: Page inspector ─────────────────────────────────────────────

function PageInspector({ selectedId }: { selectedId: string | null }) {
  const { sitemap, updatePage, setSitemap } = useSessionStore()
  const [copied, setCopied] = useState(false)

  const page = selectedId ? sitemap.find(p => p.id === selectedId) : null

  if (!page) {
    return (
      <div className="w-[260px] min-w-[260px] bg-ds-surface border-s border-ds-border flex flex-col items-center justify-center h-full">
        <Settings size={24} className="text-[#2A2E3F] mb-2" />
        <p className="text-xs text-ds-text-muted text-center px-4">Select a page to inspect its properties</p>
      </div>
    )
  }

  const meta = PAGE_TYPE_META[page.type]

  const handleCopyId = () => {
    navigator.clipboard.writeText(page.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDuplicate = () => {
    const dupe: Page = {
      ...page,
      id: uid(),
      title: `${page.title} (copy)`,
      route: `${page.route}-copy`,
    }
    setSitemap([...sitemap, dupe])
  }

  return (
    <div className="w-[260px] min-w-[260px] bg-ds-surface border-s border-ds-border flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ds-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <meta.icon size={14} style={{ color: meta.color }} />
          <span className="text-xs font-semibold text-ds-text-primary truncate flex-1">{page.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${meta.color}20`, color: meta.color }}
          >
            {meta.label}
          </span>
          <button
            onClick={handleCopyId}
            className="text-[9px] text-ds-text-muted hover:text-ds-text-muted flex items-center gap-0.5 transition-colors"
          >
            {copied ? <Check size={9} /> : <Copy size={9} />}
            {page.id.slice(0, 8)}
          </button>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Title */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={page.title}
            onChange={e => updatePage(page.id, { title: e.target.value })}
            className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-2 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50 transition-colors"
          />
        </div>

        {/* Route */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Route
          </label>
          <div className="relative">
            <Link2 size={11} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted" />
            <input
              type="text"
              value={page.route}
              onChange={e => updatePage(page.id, { route: e.target.value })}
              className="w-full bg-ds-surface border border-ds-border rounded-lg ps-7 pe-3 py-2 text-xs text-ds-text-primary font-mono focus:outline-none focus:border-ds-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Page Type
          </label>
          <div className="grid grid-cols-1 gap-1">
            {(Object.keys(PAGE_TYPE_META) as Page['type'][]).map(type => {
              const m = PAGE_TYPE_META[type]
              const MIcon = m.icon
              return (
                <button
                  key={type}
                  onClick={() => updatePage(page.id, { type })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-start text-xs transition-all border ${
                    page.type === type
                      ? 'border-ds-primary bg-ds-primary/5 text-ds-text-primary'
                      : 'border-ds-border bg-ds-surface text-ds-text-muted hover:border-ds-border'
                  }`}
                >
                  <MIcon size={11} style={{ color: m.color }} />
                  <span>{m.label}</span>
                  {page.type === type && <Check size={10} className="ms-auto text-ds-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Nav Settings */}
        <div>
          <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
            Navigation
          </label>
          <div className="space-y-2">
            {/* Show in nav toggle */}
            <button
              onClick={() => updatePage(page.id, { showInNav: !page.showInNav })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                page.showInNav
                  ? 'border-[#10b981]/40 bg-[#10b981]/5 text-[#10b981]'
                  : 'border-ds-border bg-ds-surface text-ds-text-muted'
              }`}
            >
              {page.showInNav ? <Eye size={12} /> : <EyeOff size={12} />}
              {page.showInNav ? 'Visible in nav' : 'Hidden from nav'}
            </button>

            {/* Nav label */}
            {page.showInNav && (
              <div>
                <label className="block text-[10px] text-ds-text-muted mb-1">Nav Label (optional)</label>
                <input
                  type="text"
                  value={page.navLabel ?? ''}
                  placeholder={page.title}
                  onChange={e => updatePage(page.id, { navLabel: e.target.value || undefined })}
                  className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary placeholder-[#3A3E4F] focus:outline-none focus:border-ds-primary/50"
                />
              </div>
            )}

            {/* Nav position */}
            {page.showInNav && (
              <div>
                <label className="block text-[10px] text-ds-text-muted mb-1">Nav Order</label>
                <input
                  type="number"
                  value={page.navPosition ?? 0}
                  min={0}
                  onChange={e => updatePage(page.id, { navPosition: Number(e.target.value) })}
                  className="w-full bg-ds-surface border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary focus:outline-none focus:border-ds-primary/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Parent */}
        {page.parentId && (
          <div>
            <label className="block text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider mb-1.5">
              Parent Page
            </label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ds-surface border border-ds-border">
              <CornerDownRight size={11} className="text-ds-text-muted" />
              <span className="text-xs text-ds-text-muted truncate">
                {sitemap.find(p => p.id === page.parentId)?.title ?? page.parentId}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-ds-border flex gap-2 flex-shrink-0">
        <button
          onClick={handleDuplicate}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-ds-surface-hover text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover transition-colors border border-ds-border"
        >
          <Copy size={12} />
          Duplicate
        </button>
        <button
          onClick={() => {
            const { setSitemap, sitemap: sm } = useSessionStore.getState()
            setSitemap(sm.filter(p => p.id !== page.id))
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors border border-[#ef4444]/20"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function SitemapToolbar({
  view,
  setView,
}: {
  view: 'diagram' | 'list'
  setView: (v: 'diagram' | 'list') => void
}) {
  const { sitemap } = useSessionStore()
  const totalPages = sitemap.length
  const publicPages = sitemap.filter(p => p.type === 'public').length
  const authPages  = sitemap.filter(p => p.type === 'auth').length
  const adminPages = sitemap.filter(p => p.type === 'admin').length

  return (
    <div className="h-11 border-b border-ds-border bg-ds-surface flex items-center px-5 gap-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Map size={14} className="text-ds-primary" />
        <span className="text-sm font-semibold text-ds-text-primary">Sitemap</span>
      </div>

      {/* Stats */}
      <div className="w-px h-4 bg-ds-surface-hover" />
      <div className="flex items-center gap-3 text-[11px] text-ds-text-muted">
        <span><span className="text-ds-text-primary font-medium">{totalPages}</span> pages</span>
        {publicPages > 0 && <span style={{ color: PAGE_TYPE_META.public.color }}>{publicPages} public</span>}
        {authPages > 0  && <span style={{ color: PAGE_TYPE_META.auth.color  }}>{authPages} auth</span>}
        {adminPages > 0 && <span style={{ color: PAGE_TYPE_META.admin.color }}>{adminPages} admin</span>}
      </div>

      <div className="flex-1" />

      {/* View toggle */}
      <div className="flex items-center bg-ds-surface border border-ds-border rounded-lg p-0.5 gap-0.5">
        <button
          onClick={() => setView('diagram')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
            view === 'diagram' ? 'bg-ds-surface-hover text-ds-text-primary' : 'text-ds-text-muted hover:text-ds-text-primary'
          }`}
        >
          <Map size={12} />
          Diagram
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
            view === 'list' ? 'bg-ds-surface-hover text-ds-text-primary' : 'text-ds-text-muted hover:text-ds-text-primary'
          }`}
        >
          <FileText size={12} />
          List
        </button>
      </div>
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListRow({ page, onSelect, isSelected }: { page: Page; onSelect: (id: string) => void; isSelected: boolean }) {
  const meta = PAGE_TYPE_META[page.type]
  const Icon = meta.icon
  return (
    <tr
      onClick={() => onSelect(page.id)}
      className={`cursor-pointer transition-colors ${
        isSelected ? 'bg-ds-primary/5' : 'hover:bg-ds-surface-hover/50'
      }`}
    >
      <td className="px-4 py-3 text-xs text-ds-text-primary font-medium">{page.title}</td>
      <td className="px-4 py-3 font-mono text-[11px] text-ds-text-muted">{page.route}</td>
      <td className="px-4 py-3">
        <span
          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit"
          style={{ background: `${meta.color}20`, color: meta.color }}
        >
          <Icon size={9} />
          {meta.label}
        </span>
      </td>
      <td className="px-4 py-3 text-[11px] text-ds-text-muted">
        {page.showInNav ? (
          <span className="flex items-center gap-1 text-[#10b981]"><Eye size={10} /> Yes</span>
        ) : (
          <span className="flex items-center gap-1 text-ds-text-muted"><EyeOff size={10} /> No</span>
        )}
      </td>
      <td className="px-4 py-3 text-[10px] text-ds-text-muted font-mono">{page.id.slice(0, 8)}</td>
    </tr>
  )
}

function SitemapListView({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const { sitemap } = useSessionStore()
  return (
    <div className="flex-1 overflow-auto bg-ds-surface">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-ds-border">
            {['Title', 'Route', 'Type', 'In Nav', 'ID'].map(h => (
              <th key={h} className="px-4 py-2.5 text-start text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sitemap.map(page => (
            <ListRow key={page.id} page={page} onSelect={onSelect} isSelected={selectedId === page.id} />
          ))}
        </tbody>
      </table>
      {sitemap.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-xs text-ds-text-muted">No pages yet. Add pages from the left panel.</p>
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function SitemapPage() {
  const { fetchContext } = useSessionStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'diagram' | 'list'>('diagram')

  React.useEffect(() => {
    fetchContext()
  }, [fetchContext])

  return (
    <div className="flex flex-col h-[calc(100vh-40px)] overflow-hidden bg-ds-surface">
      <SitemapToolbar view={view} setView={setView} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: page tree */}
        <PageTree selectedId={selectedId} onSelect={setSelectedId} />

        {/* Center: diagram or list */}
        {view === 'diagram'
          ? <SitemapDiagram selectedId={selectedId} onSelect={setSelectedId} />
          : <SitemapListView selectedId={selectedId} onSelect={setSelectedId} />
        }

        {/* Right: inspector */}
        <PageInspector selectedId={selectedId} />
      </div>
    </div>
  )
}
