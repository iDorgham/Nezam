'use client'

import { useState, useMemo } from 'react'
import { Search, Check, FolderOpen, Map, ChevronDown } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import {
  TEMPLATES,
  PROJECT_PROFILES,
  TEMPLATE_CATEGORY_LABELS,
  TEMPLATE_CATEGORY_ORDER,
  type PageTemplate,
  type ProjectProfile,
} from '@/data/templates-library'

type View = 'pages' | 'projects'

// ─── Page templates tab ───────────────────────────────────────────────────────

function PageTemplatesView() {
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
    <div className="flex flex-col gap-2 h-full overflow-hidden">
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

// ─── Project profiles tab ─────────────────────────────────────────────────────

function ProjectProfilesView() {
  const archAppendPages  = useHub((s) => s.archAppendPages)
  const archApplyProfile = useHub((s) => s.archApplyProfile)
  const pages            = useHub((s) => s.arch.pages)

  const [flash, setFlash]       = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<string | null>(null)

  const isEmpty = Object.keys(pages).length === 0

  function handleImport(profile: ProjectProfile) {
    if (!isEmpty && !showConfirm) {
      setShowConfirm(profile.id)
      return
    }
    // Use archAppendPages (merge) — non-destructive by default
    archAppendPages(profile.pages)
    setFlash(profile.id)
    setShowConfirm(null)
    setTimeout(() => setFlash(null), 1800)
  }

  return (
    <div className="flex-1 overflow-y-auto app-scroll px-2 pb-2 flex flex-col gap-2">
      {PROJECT_PROFILES.map((profile) => {
        const isOpen    = expanded === profile.id
        const imported  = flash === profile.id
        const confirming = showConfirm === profile.id

        return (
          <div
            key={profile.id}
            className={cn(
              'rounded-app-sm border overflow-hidden transition-colors duration-150',
              isOpen ? 'border-app-accent/60' : 'border-app-border',
              'bg-app-elevated',
            )}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 px-2.5 py-2 cursor-pointer"
              onClick={() => setExpanded(isOpen ? null : profile.id)}
            >
              {/* Mini gradient stripe */}
              <div className="h-7 w-7 rounded shrink-0" style={{ background: profile.gradient }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-app-text truncate">{profile.name}</p>
                <p className="text-[9.5px] text-app-subtle font-mono">{profile.pages.length} pages</p>
              </div>
              <ChevronDown
                size={11}
                className={cn('text-app-subtle transition-transform duration-150 shrink-0', isOpen && 'rotate-180')}
              />
            </div>

            {/* Expanded detail */}
            {isOpen && (
              <div className="px-2.5 pb-2.5 flex flex-col gap-2 border-t border-app-border/60">
                <p className="text-[10px] text-app-subtle leading-snug pt-2">{profile.description}</p>

                {/* Nav items preview */}
                <div>
                  <p className="text-[9.5px] font-bold text-app-subtle uppercase tracking-wide mb-1">Top nav</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.navItems.map((n) => (
                      <span key={n} className="text-[9.5px] bg-app-bg border border-app-border rounded px-1.5 py-0.5 text-app-muted">{n}</span>
                    ))}
                  </div>
                </div>

                {/* Page count by section */}
                {profile.sidebarSections && (
                  <div>
                    <p className="text-[9.5px] font-bold text-app-subtle uppercase tracking-wide mb-1">Sidebar sections</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.sidebarSections.map((s) => (
                        <span key={s} className="text-[9.5px] bg-app-bg border border-app-border rounded px-1.5 py-0.5 text-app-muted">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9.5px] font-medium rounded-full px-1.5 py-0.5"
                      style={{ background: profile.accent + '22', color: profile.accent }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Confirm overwrite */}
                {confirming && !isEmpty && (
                  <div className="rounded-app-sm bg-amber-500/8 border border-amber-500/30 p-2 text-[10px] text-amber-300">
                    Pages will be merged with your existing sitemap.
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => setShowConfirm(null)}
                        className="flex-1 rounded border border-app-border bg-app-bg py-1 text-app-muted hover:text-app-text transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleImport(profile)}
                        className="flex-1 rounded bg-amber-500 py-1 font-bold text-black hover:bg-amber-400 transition-colors"
                      >
                        Merge
                      </button>
                    </div>
                  </div>
                )}

                {/* Import button */}
                {!confirming && (
                  <button
                    onClick={() => handleImport(profile)}
                    className={cn(
                      'flex items-center justify-center gap-1.5 h-7 rounded-app-sm text-[11px] font-semibold transition-colors',
                      imported
                        ? 'bg-app-success text-white'
                        : 'bg-app-accent text-app-on-accent hover:bg-app-accent-hover',
                    )}
                  >
                    {imported ? <><Check size={11} /> Imported!</> : `Import ${profile.pages.length} pages`}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Root panel ───────────────────────────────────────────────────────────────

export function ArchTemplatesPanel() {
  const [view, setView] = useState<View>('pages')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* View toggle */}
      <div className="shrink-0 flex items-center gap-0.5 p-1.5 mx-2 mt-2 mb-0 rounded-app-sm bg-app-elevated border border-app-border">
        <ViewTab id="pages"    label="Pages"    Icon={FolderOpen} active={view === 'pages'}    onClick={() => setView('pages')} />
        <ViewTab id="projects" label="Projects" Icon={Map}        active={view === 'projects'} onClick={() => setView('projects')} />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col pt-2">
        {view === 'pages'    && <PageTemplatesView />}
        {view === 'projects' && <ProjectProfilesView />}
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ViewTab({ id, label, Icon, active, onClick }: {
  id: string; label: string; Icon: React.FC<{ size?: number; className?: string }>
  active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1 h-6 rounded text-[10.5px] font-medium transition-colors duration-100',
        active ? 'bg-app-surface text-app-text' : 'text-app-subtle hover:text-app-muted',
      )}
    >
      <Icon size={10} />
      {label}
    </button>
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
