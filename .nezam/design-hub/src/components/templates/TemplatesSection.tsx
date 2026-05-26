'use client'

import { useState } from 'react'
import { Plus, Check, Search } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import {
  TEMPLATES,
  TEMPLATE_CATEGORY_LABELS,
  TEMPLATE_CATEGORY_ORDER,
  type PageTemplate,
  type TemplateCategory,
} from '@/data/templates-library'

export function TemplatesSection() {
  const [selectedCat, setSelectedCat] = useState<TemplateCategory | null>(null)
  const [query, setQuery]             = useState('')
  const [recentlyApplied, setRecentlyApplied] = useState<string | null>(null)

  const archAppendPages = useHub((s) => s.archAppendPages)
  const setSection      = useHub((s) => s.setSection)

  const q = query.trim().toLowerCase()
  const filtered = TEMPLATES.filter((t) => {
    if (selectedCat && t.category !== selectedCat) return false
    if (!q) return true
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  })

  function handleApply(template: PageTemplate) {
    archAppendPages(template.pages)
    setRecentlyApplied(template.id)
    setTimeout(() => setRecentlyApplied(null), 1800)
  }

  const cats: Array<TemplateCategory | null> = [null, ...TEMPLATE_CATEGORY_ORDER]

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Sidebar — categories */}
      <aside className="shrink-0 w-56 flex flex-col gap-1 p-3 border-r border-app-border bg-app-surface overflow-y-auto app-scroll">
        <p className="px-2 pt-1 pb-2 text-[10px] font-semibold text-app-subtle uppercase tracking-wider">Categories</p>
        {cats.map((cat) => {
          const active = selectedCat === cat
          const label  = cat === null ? 'All Templates' : TEMPLATE_CATEGORY_LABELS[cat]
          const count  = cat === null ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat).length
          return (
            <button
              key={cat ?? 'all'}
              onClick={() => setSelectedCat(cat)}
              className={cn(
                'flex items-center justify-between px-2.5 py-1.5 rounded-app-sm text-[11.5px] font-medium transition-colors duration-100 text-left',
                active
                  ? 'bg-app-accent-subtle text-app-accent'
                  : 'text-app-muted hover:bg-app-elevated hover:text-app-text',
              )}
            >
              <span>{label}</span>
              <span className={cn('text-[10px]', active ? 'text-app-accent' : 'text-app-subtle')}>{count}</span>
            </button>
          )
        })}
      </aside>

      {/* Main — gallery */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Search bar */}
        <div className="shrink-0 flex items-center gap-2 px-6 h-12 border-b border-app-border bg-app-surface">
          <Search size={13} className="text-app-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates…"
            className="flex-1 bg-transparent text-[12px] text-app-text placeholder:text-app-subtle outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[10px] text-app-subtle hover:text-app-text">Clear</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto app-scroll p-6">
          {/* Banner */}
          <div className="mb-6 rounded-app-lg border border-app-border bg-app-surface p-4">
            <p className="text-sm font-semibold text-app-text mb-1">Page-Layout Templates</p>
            <p className="text-xs text-app-subtle leading-relaxed max-w-2xl">
              Curated starter templates for common product surfaces. Applying a template appends its pages
              to your active architecture — you can rename and re-nest them later.
            </p>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-medium text-app-text mb-1">No templates match</p>
              <p className="text-xs text-app-subtle">Try a different category or search term.</p>
            </div>
          )}

          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onApply={() => handleApply(template)}
                onView={() => setSection('architecture')}
                justApplied={recentlyApplied === template.id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onApply,
  onView,
  justApplied,
}: {
  template: PageTemplate
  onApply(): void
  onView(): void
  justApplied: boolean
}) {
  return (
    <div className="group flex flex-col rounded-app-lg border border-app-border bg-app-surface overflow-hidden transition-colors duration-150 hover:border-app-border-strong">
      {/* Thumbnail */}
      <div
        className="relative h-32 overflow-hidden"
        style={{ background: template.gradient }}
      >
        {/* Mock browser chrome */}
        <div className="absolute top-2 left-2 right-2 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        </div>
        {/* Mock layout strokes */}
        <div className="absolute inset-x-3 top-6 bottom-3 grid grid-cols-4 gap-1.5">
          <div className="col-span-1 rounded bg-white/15" />
          <div className="col-span-3 flex flex-col gap-1.5">
            <div className="h-3 rounded bg-white/25" />
            <div className="grid grid-cols-3 gap-1.5 flex-1">
              <div className="rounded bg-white/15" />
              <div className="rounded bg-white/15" />
              <div className="rounded bg-white/15" />
            </div>
            <div className="h-6 rounded bg-white/10" />
          </div>
        </div>
        {/* Big icon */}
        <div
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
        >
          <IconRenderer name={template.icon} size={16} className="text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold text-app-text">{template.name}</p>
          <span className="shrink-0 text-[9.5px] font-semibold text-app-subtle uppercase tracking-wider">
            {template.pages.length} pages
          </span>
        </div>
        <p className="text-[11px] text-app-subtle leading-relaxed line-clamp-2 min-h-[2.4em]">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9.5px] font-medium text-app-muted px-1.5 py-0.5 rounded bg-app-elevated border border-app-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={onApply}
            className={cn(
              'flex items-center justify-center gap-1.5 flex-1 h-7 px-3 rounded-app-sm text-[11px] font-semibold transition-colors duration-150',
              justApplied
                ? 'bg-app-success/15 text-app-success'
                : 'bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active',
            )}
          >
            {justApplied ? <Check size={11} /> : <Plus size={11} />}
            {justApplied ? 'Added to sitemap' : 'Use template'}
          </button>
          <button
            onClick={onView}
            className="h-7 px-3 rounded-app-sm text-[11px] font-medium text-app-muted hover:text-app-text hover:bg-app-elevated transition-colors duration-150"
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}
