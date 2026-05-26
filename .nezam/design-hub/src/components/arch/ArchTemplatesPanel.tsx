'use client'

import { useState, useMemo } from 'react'
import { Search, Check } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import {
  TEMPLATES,
  TEMPLATE_CATEGORY_LABELS,
  TEMPLATE_CATEGORY_ORDER,
  type PageTemplate,
} from '@/data/templates-library'

export function ArchTemplatesPanel() {
  const archAppendPages  = useHub((s) => s.archAppendPages)
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState<string>('all')
  const [flash, setFlash]       = useState<string | null>(null)

  const categories = useMemo(() => {
    const used = new Set(TEMPLATES.map((t) => t.category))
    return TEMPLATE_CATEGORY_ORDER.filter((c) => used.has(c))
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return TEMPLATES.filter((t) => {
      const matchCat = category === 'all' || t.category === category
      const matchQ   = !q || t.name.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchCat && matchQ
    })
  }, [query, category])

  function handleImport(template: PageTemplate) {
    archAppendPages(template.pages)
    setFlash(template.id)
    setTimeout(() => setFlash(null), 1600)
  }

  return (
    <div className="flex flex-col gap-2 h-full overflow-hidden pt-2">
      {/* Search */}
      <div className="relative shrink-0 px-2">
        <Search size={11} className="absolute left-4 top-1/2 -translate-y-1/2 text-app-subtle pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          className="w-full h-7 pl-7 pr-2 rounded-app-sm bg-app-elevated border border-app-border text-[11px] text-app-text placeholder:text-app-subtle outline-none focus:border-app-accent"
        />
      </div>

      {/* Category filter — horizontal scroll */}
      <div className="shrink-0 flex items-center gap-1 px-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        <CategoryPill label="All" active={category === 'all'} onClick={() => setCategory('all')} />
        {categories.map((c) => (
          <CategoryPill
            key={c}
            label={TEMPLATE_CATEGORY_LABELS[c]}
            active={category === c}
            onClick={() => setCategory(c)}
          />
        ))}
      </div>

      {/* Cards — compact 2-column grid */}
      <div className="flex-1 overflow-y-auto app-scroll px-2 pb-2">
        {filtered.length === 0 ? (
          <p className="text-center text-[11px] text-app-subtle py-6">No templates found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {filtered.map((t) => {
              const imported = flash === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => handleImport(t)}
                  className={cn(
                    'relative flex flex-col gap-1.5 p-2 rounded-app-sm border text-left transition-all duration-150',
                    imported
                      ? 'border-app-accent bg-app-accent-subtle'
                      : 'border-app-border bg-app-elevated hover:border-app-accent/60 hover:bg-app-elevated',
                  )}
                >
                  {/* Gradient thumbnail */}
                  <div
                    className="h-10 w-full rounded flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: t.gradient }}
                  >
                    {imported && <Check size={14} className="text-white drop-shadow" />}
                  </div>
                  <p className="text-[10px] font-semibold text-app-text leading-tight truncate">{t.name}</p>
                  <p className="text-[9.5px] text-app-subtle font-mono">{t.pages.length} pages</p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 h-5 px-2 rounded-full text-[9.5px] font-medium transition-colors duration-100 whitespace-nowrap',
        active
          ? 'bg-app-accent text-app-on-accent'
          : 'bg-app-elevated border border-app-border text-app-subtle hover:text-app-muted',
      )}
    >
      {label}
    </button>
  )
}
