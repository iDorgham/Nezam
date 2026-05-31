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

type Props = {
  /** Grid columns for template cards (onboarding left column → 2). */
  gridColumns?: 2 | 3 | 4
  variant?: 'default' | 'onboarding'
  /** Hide in-panel search and category pills (parent supplies search). */
  hideFilters?: boolean
  /** External search when hideFilters is true. */
  searchQuery?: string
}

export function ArchTemplatesPanel({
  gridColumns = 4,
  variant = 'default',
  hideFilters = false,
  searchQuery = '',
}: Props) {
  const isOnboarding = variant === 'onboarding'
  const archAppendPages  = useHub((s) => s.archAppendPages)
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState<string>('all')
  const [flash, setFlash]       = useState<string | null>(null)
  const effectiveQuery = hideFilters ? searchQuery : query

  const gridClass =
    gridColumns === 2
      ? 'grid-cols-2'
      : gridColumns === 3
        ? 'grid-cols-3'
        : 'grid-cols-4'

  const categories = useMemo(() => {
    const used = new Set(TEMPLATES.map((t) => t.category))
    return TEMPLATE_CATEGORY_ORDER.filter((c) => used.has(c))
  }, [])

  const filtered = useMemo(() => {
    const q = effectiveQuery.trim().toLowerCase()
    return TEMPLATES.filter((t) => {
      const matchCat = hideFilters || category === 'all' || t.category === category
      const matchQ   = !q || t.name.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q))
      return matchCat && matchQ
    })
  }, [effectiveQuery, category, hideFilters])

  function handleImport(template: PageTemplate) {
    archAppendPages(template.pages)
    setFlash(template.id)
    setTimeout(() => setFlash(null), 1600)
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-0 min-w-0 flex-col gap-2 overflow-hidden',
        hideFilters ? 'pt-0' : 'pt-2',
      )}
    >
      {!hideFilters ? (
        <>
          <div className="relative shrink-0 px-2">
            <Search
              size={11}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none',
                isOnboarding ? 'text-white/35' : 'text-app-subtle',
              )}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className={cn(
                'w-full h-8 pl-7 pr-2 rounded-md text-[11px] outline-none transition-colors duration-150',
                'focus-visible:ring-2 focus-visible:ring-offset-0',
                isOnboarding
                  ? 'bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus-visible:border-blue-500/40 focus-visible:ring-blue-500/25'
                  : 'rounded-app-sm bg-app-elevated border border-app-border text-app-text placeholder:text-app-subtle focus:border-app-accent focus:ring-app-accent-subtle',
              )}
            />
          </div>

          <div className="shrink-0 min-w-0 overflow-x-auto app-scroll px-2 pb-0.5">
            <div
              role="tablist"
              aria-label="Page pack categories"
              className="inline-flex w-max max-w-none flex-nowrap items-center gap-1"
            >
              <CategoryPill
                label="All"
                active={category === 'all'}
                onClick={() => setCategory('all')}
                variant={variant}
              />
              {categories.map((c) => (
                <CategoryPill
                  key={c}
                  label={TEMPLATE_CATEGORY_LABELS[c]}
                  active={category === c}
                  onClick={() => setCategory(c)}
                  variant={variant}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}

      <div className={cn('min-h-0 flex-1 overflow-y-auto app-scroll pb-2', hideFilters ? 'px-0' : 'px-2')}>
        {filtered.length === 0 ? (
          <p
            className={cn(
              'text-center text-[11px] py-8',
              isOnboarding ? 'text-white/35' : 'text-app-subtle',
            )}
          >
            No templates found.
          </p>
        ) : (
          <div className={cn('grid gap-2', gridClass)}>
            {filtered.map((t) => {
              const imported = flash === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleImport(t)}
                  className={cn(
                    'relative flex min-w-0 flex-col gap-1.5 p-2 rounded-md border text-left transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    isOnboarding
                      ? cn(
                          'focus-visible:ring-blue-500/35 focus-visible:ring-offset-[#1a1b1e]',
                          imported
                            ? 'border-blue-500/35 bg-blue-600/10'
                            : 'border-white/[0.08] bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]',
                        )
                      : cn(
                          'rounded-app-sm focus-visible:ring-app-accent',
                          imported
                            ? 'border-app-accent bg-app-accent-subtle'
                            : 'border-app-border bg-app-elevated hover:border-app-accent/60 hover:bg-app-elevated',
                        ),
                  )}
                >
                  <div
                    className="h-9 w-full rounded-md flex items-center justify-center shrink-0 overflow-hidden"
                    style={{ background: t.gradient }}
                  >
                    {imported && <Check size={12} className="text-white drop-shadow" />}
                  </div>
                  <p
                    className={cn(
                      'text-[10px] font-semibold leading-tight truncate',
                      isOnboarding ? 'text-white/90' : 'text-app-text',
                    )}
                  >
                    {t.name}
                  </p>
                  <p
                    className={cn(
                      'text-[9px] font-mono',
                      isOnboarding ? 'text-white/35' : 'text-app-subtle',
                    )}
                  >
                    {t.pages.length} pages
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryPill({
  label,
  active,
  onClick,
  variant = 'default',
}: {
  label: string
  active: boolean
  onClick: () => void
  variant?: 'default' | 'onboarding'
}) {
  const isOnboarding = variant === 'onboarding'
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center h-7 px-2.5 rounded-full text-[10px] font-semibold transition-colors duration-150 whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2',
        isOnboarding
          ? cn(
              'focus-visible:ring-blue-500/35',
              active
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white/75 hover:bg-white/[0.06]',
            )
          : cn(
              'focus-visible:ring-app-accent',
              active
                ? 'bg-app-accent text-app-on-accent'
                : 'bg-app-elevated border border-app-border text-app-subtle hover:text-app-muted',
            ),
      )}
    >
      {label}
    </button>
  )
}
