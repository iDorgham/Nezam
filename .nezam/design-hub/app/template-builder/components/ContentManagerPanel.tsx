'use client'

import React, { useState } from 'react'
import { FileText, Plus, Trash2, Search, ChevronRight, ChevronDown, Circle } from 'lucide-react'
import { PT, PanelHeader, PanelButton, EmptyState } from './panel-primitives'

type Status = 'draft' | 'review' | 'published' | 'archived'

interface PageItem {
  id: string
  title: string
  slug: string
  status: Status
  version: number
  editedMinsAgo: number
  children?: PageItem[]
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  draft:     { label: 'Draft',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  review:    { label: 'Review',    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  published: { label: 'Published', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  archived:  { label: 'Archived',  color: '#71717a', bg: 'rgba(113,113,122,0.1)', border: 'rgba(113,113,122,0.25)' },
}

const INITIAL_PAGES: PageItem[] = [
  {
    id: '1', title: 'Home', slug: '/', status: 'published', version: 5, editedMinsAgo: 12,
    children: [
      { id: '1-1', title: 'Hero Section', slug: '/hero', status: 'published', version: 2, editedMinsAgo: 45 },
    ],
  },
  { id: '2', title: 'About', slug: '/about', status: 'published', version: 3, editedMinsAgo: 120 },
  {
    id: '3', title: 'Blog', slug: '/blog', status: 'published', version: 8, editedMinsAgo: 5,
    children: [
      { id: '3-1', title: 'Getting Started', slug: '/blog/getting-started', status: 'published', version: 1, editedMinsAgo: 360 },
      { id: '3-2', title: 'Advanced Tips', slug: '/blog/advanced-tips', status: 'draft', version: 1, editedMinsAgo: 30 },
      { id: '3-3', title: 'Case Study Q1', slug: '/blog/case-study-q1', status: 'review', version: 2, editedMinsAgo: 90 },
    ],
  },
  { id: '4', title: 'Products', slug: '/products', status: 'draft', version: 1, editedMinsAgo: 8 },
  { id: '5', title: 'Contact', slug: '/contact', status: 'archived', version: 4, editedMinsAgo: 1440 },
]

function timeAgo(mins: number) {
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`
  return `${Math.round(mins / 1440)}d ago`
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="inline-flex items-center text-[8px] font-bold px-1.5 py-px rounded border tracking-wide uppercase"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}>
      {cfg.label}
    </span>
  )
}

function PageRow({
  page, depth, selected, onSelect, onDelete,
}: {
  page: PageItem
  depth: number
  selected: Set<string>
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const [hovered, setHovered] = useState(false)
  const hasChildren = (page.children?.length ?? 0) > 0

  return (
    <>
      <div
        className="group flex items-center gap-1.5 px-2 py-1.5 cursor-pointer transition-colors rounded-md mx-1"
        style={{
          paddingInlineStart: `${8 + depth * 14}px`,
          background: hovered ? PT.bgHover : 'transparent',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelect(page.id)}
      >
        {/* Checkbox — appears on hover */}
        <div className={`w-3.5 h-3.5 shrink-0 transition-opacity ${hovered || selected.has(page.id) ? 'opacity-100' : 'opacity-0'}`}>
          <input
            type="checkbox"
            checked={selected.has(page.id)}
            onChange={() => onSelect(page.id)}
            onClick={e => e.stopPropagation()}
            className="w-3.5 h-3.5 accent-[var(--ds-primary)] cursor-pointer"
            aria-label={`Select ${page.title}`}
          />
        </div>

        {/* Expand chevron */}
        <button
          className="w-3.5 h-3.5 shrink-0 flex items-center justify-center"
          style={{ color: PT.textMuted, visibility: hasChildren ? 'visible' : 'hidden' }}
          onClick={e => { e.stopPropagation(); setExpanded(v => !v) }}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>

        {/* Icon */}
        <FileText size={11} style={{ color: PT.textMuted, flexShrink: 0 }} />

        {/* Title + slug */}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-medium truncate" style={{ color: PT.textPrimary }}>{page.title}</div>
          <div className="text-[8px] truncate" style={{ color: PT.textLabel }}>{page.slug}</div>
        </div>

        <StatusBadge status={page.status} />

        {/* Delete on hover */}
        {hovered && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(page.id) }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-500/10 transition-colors"
            style={{ color: '#ef4444' }}
            aria-label={`Delete ${page.title}`}
            title="Delete page"
          >
            <Trash2 size={10} />
          </button>
        )}
      </div>

      {/* Footer meta */}
      <div className="px-2 pb-1" style={{ paddingInlineStart: `${8 + depth * 14 + 34}px` }}>
        <span className="text-[8px]" style={{ color: PT.textMuted }}>
          v{page.version} · {timeAgo(page.editedMinsAgo)}
        </span>
      </div>

      {/* Children */}
      {hasChildren && expanded && page.children!.map(child => (
        <PageRow key={child.id} page={child} depth={depth + 1} selected={selected} onSelect={onSelect} onDelete={onDelete} />
      ))}
    </>
  )
}

export default function ContentManagerPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en
  const [pages, setPages] = useState<PageItem[]>(INITIAL_PAGES)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function deletePage(id: string) {
    function remove(items: PageItem[]): PageItem[] {
      return items
        .filter(p => p.id !== id)
        .map(p => ({ ...p, children: p.children ? remove(p.children) : undefined }))
    }
    setPages(prev => remove(prev))
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  function deleteSelected() {
    selected.forEach(id => deletePage(id))
    setSelected(new Set())
  }

  function addPage() {
    const newPage: PageItem = {
      id: Date.now().toString(),
      title: t('New Page', 'صفحة جديدة'),
      slug: '/new-page',
      status: 'draft',
      version: 1,
      editedMinsAgo: 0,
    }
    setPages(prev => [...prev, newPage])
  }

  function filterPages(items: PageItem[], q: string): PageItem[] {
    if (!q) return items
    return items.flatMap(p => {
      const match = p.title.toLowerCase().includes(q.toLowerCase()) || p.slug.includes(q.toLowerCase())
      const filteredChildren = p.children ? filterPages(p.children, q) : []
      if (match) return [{ ...p, children: p.children }]
      if (filteredChildren.length) return [{ ...p, children: filteredChildren }]
      return []
    })
  }

  const visible = filterPages(pages, query)

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<FileText size={12} />}
        title={t('Content Manager', 'مدير المحتوى')}
        subtitle={t(`${pages.length} pages`, `${pages.length} صفحات`)}
        actions={
          <PanelButton variant="primary" size="xs" icon={<Plus size={10} />} onClick={addPage}>
            {t('New', 'جديد')}
          </PanelButton>
        }
      />

      {/* Search */}
      <div className="px-2 py-1.5 border-b shrink-0" style={{ borderColor: PT.border }}>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border" style={{ background: PT.bgElevated, borderColor: PT.border }}>
          <Search size={10} style={{ color: PT.textMuted }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('Search pages…', 'بحث عن الصفحات…')}
            className="flex-1 bg-transparent outline-none text-[10px]"
            style={{ color: PT.textPrimary }}
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="px-2 py-1 flex items-center justify-between shrink-0 border-b" style={{ background: 'rgba(6,182,212,0.06)', borderColor: PT.border }}>
          <span className="text-[9px] font-medium" style={{ color: 'var(--ds-primary)' }}>
            {selected.size} {t('selected', 'محدد')}
          </span>
          <button
            onClick={deleteSelected}
            className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded hover:bg-red-500/10 transition-colors"
            style={{ color: '#ef4444' }}
            aria-label="Delete selected pages"
          >
            <Trash2 size={9} />
            {t('Delete', 'حذف')}
          </button>
        </div>
      )}

      {/* Page tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Circle size={18} />}
            title={t('No pages found', 'لا توجد صفحات')}
            desc={query ? t('Try a different search', 'جرب بحثًا مختلفًا') : t('Add your first page', 'أضف أول صفحة')}
            action={!query ? <PanelButton variant="primary" size="xs" onClick={addPage}>{t('New Page', 'صفحة جديدة')}</PanelButton> : undefined}
          />
        ) : (
          visible.map(page => (
            <PageRow key={page.id} page={page} depth={0} selected={selected} onSelect={toggleSelect} onDelete={deletePage} />
          ))
        )}
      </div>

      {/* Footer stats */}
      <div className="shrink-0 px-3 py-1.5 border-t flex items-center gap-3" style={{ borderColor: PT.border }}>
        {(['published', 'draft', 'review', 'archived'] as Status[]).map(s => {
          const count = pages.flatMap(p => [p, ...(p.children ?? [])]).filter(p => p.status === s).length
          return (
            <div key={s} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_CONFIG[s].color }} />
              <span className="text-[8px]" style={{ color: PT.textMuted }}>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
