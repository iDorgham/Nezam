'use client'

import { useState } from 'react'
import { ChevronDown, Plus, AlertTriangle, Check, FileText, LayoutTemplate, Network, Layers } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { ARCH_PROFILES_MAP, ARCH_PROFILE_GROUPS } from '@/data/arch-profiles'
import { PageTreeItem } from './PageTreeItem'
import { ArchTemplatesPanel } from './ArchTemplatesPanel'
import { IconRenderer } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ArchPage, ArchProfileId } from '@/types/arch'

type PanelTab = 'pages' | 'profiles' | 'templates'

function getTree(pages: Record<string, ArchPage>) {
  return Object.values(pages)
    .filter((p) => p.parentId === null)
    .sort((a, b) => a.order - b.order)
}

function matchesSearch(page: ArchPage, pages: Record<string, ArchPage>, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  if (page.name.toLowerCase().includes(q) || page.route.toLowerCase().includes(q)) {
    return true
  }
  const children = Object.values(pages).filter((p) => p.parentId === page.id)
  return children.some((child) => matchesSearch(child, pages, query))
}

// ─── Pages panel (existing sitemap with search) ────────────────────────────────

function PagesPanel() {
  const pages       = useHub((s) => s.arch.pages)
  const archAddPage = useHub((s) => s.archAddPage)

  const [searchQuery, setSearchQuery] = useState('')

  const roots     = getTree(pages).filter((root) => matchesSearch(root, pages, searchQuery))
  const isEmpty   = roots.length === 0

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Page-tree header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-app-border shrink-0">
        <span className="text-xs font-semibold text-app-text">Sitemap</span>
        <Button variant="ghost" size="xs" onClick={() => archAddPage(null)} title="Add root page">
          <Plus size={11} className="mr-0.5" />
          Add
        </Button>
      </div>

      {/* Page tree search input */}
      <div className="px-2 pb-2 pt-1 border-b border-app-border shrink-0">
        <input
          id="sitemap-search-input"
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-[11px] font-medium text-app-text focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30 placeholder-app-subtle transition-colors"
        />
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto app-scroll py-1 min-h-0">
        {isEmpty ? (
          <div className="px-3 py-6 text-center flex flex-col items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl opacity-50"
              style={{ background: 'rgba(38,128,235,0.1)', border: '1px solid rgba(38,128,235,0.15)' }}
            >
              <FileText size={16} className="text-app-accent" />
            </div>
            <p className="text-[11px] text-app-subtle">No pages yet.</p>
            <p className="text-[10px] text-app-subtle leading-relaxed opacity-80">
              Start from a blueprint profile or use the Templates tab.
            </p>
          </div>
        ) : (
          roots.map((root) => (
            <PageTreeItem key={root.id} page={root} allPages={pages} depth={0} searchQuery={searchQuery} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Profiles Panel (collapsing all blueprint presets) ────────────────────────

function ProfilesPanel() {
  const pages            = useHub((s) => s.arch.pages)
  const activeProfile    = useHub((s) => s.arch.activeProfileId)
  const archApplyProfile = useHub((s) => s.archApplyProfile)

  const [query, setQuery] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [pendingId, setPendingId] = useState<ArchProfileId | null>(null)

  const pageCount = Object.keys(pages).length
  const isEmpty   = pageCount === 0

  function handleApply(id: ArchProfileId) {
    if (!isEmpty) {
      setPendingId(id)
      setShowWarning(true)
    } else {
      archApplyProfile(id)
    }
  }

  function confirmApply() {
    if (pendingId) {
      archApplyProfile(pendingId)
    }
    setShowWarning(false)
    setPendingId(null)
  }

  const q = query.toLowerCase()

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Header with Search */}
      <div className="flex flex-col shrink-0 px-3 py-2 border-b border-app-border gap-2 bg-app-bg/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-app-text font-mono">Site Blueprints</span>
        </div>
        <input
          type="text"
          placeholder="Search profiles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-[11px] font-medium text-app-text focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30 placeholder-app-subtle transition-colors"
        />
      </div>

      {/* Warning popup */}
      {showWarning && (
        <div className="m-3 p-3 rounded-app-sm border border-amber-500/30 bg-amber-500/8 flex flex-col gap-2 shrink-0 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-start gap-1.5">
            <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-amber-300 leading-snug">
              Applying this blueprint will replace your {pageCount} active {pageCount === 1 ? 'page' : 'pages'}. Are you sure?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowWarning(false); setPendingId(null) }}
              className="flex-1 rounded border border-app-border bg-app-elevated px-2.5 py-1 text-[10.5px] font-medium text-app-muted hover:text-app-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmApply}
              className="flex-1 rounded bg-amber-500 px-2.5 py-1 text-[10.5px] font-bold text-black hover:bg-amber-400 transition-colors"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Blueprint list */}
      <div className="flex-1 overflow-y-auto app-scroll p-3 flex flex-col gap-4 min-h-0">
        {ARCH_PROFILE_GROUPS.map((group) => {
          const matchingIds = group.ids.filter((id) => {
            const p = ARCH_PROFILES_MAP[id]
            if (!p) return false
            return !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          })

          if (matchingIds.length === 0) return null

          return (
            <div key={group.label} className="flex flex-col gap-1.5">
              <h4 className="text-[9.5px] font-bold text-app-subtle uppercase tracking-wider mb-0.5">
                {group.label}
              </h4>
              <div className="flex flex-col gap-1.5">
                {matchingIds.map((id) => {
                  const p = ARCH_PROFILES_MAP[id]
                  if (!p) return null
                  const isActive = activeProfile === id

                  return (
                    <div
                      key={id}
                      className={cn(
                        'rounded-app-sm border px-3 py-2.5 flex flex-col gap-2 transition-all duration-150',
                        isActive
                          ? 'border-app-accent bg-app-accent-subtle/10'
                          : 'border-app-border bg-app-elevated/40 hover:border-app-accent/40 hover:bg-app-elevated/80',
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-colors',
                            isActive ? 'bg-app-accent text-white' : 'bg-app-elevated border border-app-border text-app-accent',
                          )}
                        >
                          <IconRenderer name={p.icon} size={13} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[11.5px] font-semibold text-app-text truncate">{p.name}</p>
                            {isActive && (
                              <span className="flex items-center gap-0.5 text-[9px] font-semibold text-app-accent bg-app-accent/8 border border-app-accent/20 px-1 rounded-full shrink-0">
                                <Check size={8} />active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-app-subtle leading-relaxed mt-0.5">{p.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-app-border/40 pt-2 mt-1 shrink-0">
                        <span className="text-[9.5px] text-app-subtle font-mono">{p.pages.length} pages</span>
                        {!isActive && (
                          <button
                            onClick={() => handleApply(id)}
                            className="rounded bg-app-accent hover:bg-app-accent-hover text-app-on-accent text-[9.5px] font-semibold px-2.5 py-1 transition-colors active:scale-[0.98]"
                          >
                            Apply Profile
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Empty search state */}
        {query && !ARCH_PROFILE_GROUPS.some((g) => g.ids.some((id) => {
          const p = ARCH_PROFILES_MAP[id]
          return p && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
        })) && (
          <p className="text-center text-[10.5px] text-app-subtle py-8">No blueprints match your search.</p>
        )}
      </div>
    </div>
  )
}

// ─── Root panel with tab switcher ─────────────────────────────────────────────

export function ArchLeftPanel() {
  const [activeTab, setActiveTab] = useState<PanelTab>('pages')

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden">
      {/* Tab bar */}
      <div className="shrink-0 flex items-center gap-0.5 px-2 py-1.5 border-b border-app-border bg-app-bg">
        <PanelTabBtn
          label="Sitemap"
          Icon={Network}
          active={activeTab === 'pages'}
          onClick={() => setActiveTab('pages')}
        />
        <PanelTabBtn
          label="Profiles"
          Icon={Layers}
          active={activeTab === 'profiles'}
          onClick={() => setActiveTab('profiles')}
        />
        <PanelTabBtn
          label="Templates"
          Icon={LayoutTemplate}
          active={activeTab === 'templates'}
          onClick={() => setActiveTab('templates')}
        />
      </div>

      {/* Panel content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'pages'     && <PagesPanel />}
        {activeTab === 'profiles'  && <ProfilesPanel />}
        {activeTab === 'templates' && <ArchTemplatesPanel />}
      </div>
    </aside>
  )
}

function PanelTabBtn({ label, Icon, active, onClick }: {
  label: string
  Icon: React.FC<{ size?: number; className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1 h-7 rounded-app-sm text-[11px] font-medium transition-colors duration-100',
        active
          ? 'bg-app-surface text-app-text border border-app-border'
          : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/40',
      )}
    >
      <Icon size={11} className={active ? 'text-app-accent' : ''} />
      {label}
    </button>
  )
}
