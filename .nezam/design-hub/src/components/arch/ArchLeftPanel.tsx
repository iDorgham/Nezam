'use client'

import { useState } from 'react'
import { ChevronDown, Plus, AlertTriangle, Check, FileText, LayoutTemplate, Network } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { ARCH_PROFILES_MAP, ARCH_PROFILE_GROUPS } from '@/data/arch-profiles'
import { PageTreeItem } from './PageTreeItem'
import { ArchTemplatesPanel } from './ArchTemplatesPanel'
import { IconRenderer } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ArchPage, ArchProfileId } from '@/types/arch'

type PanelTab = 'pages' | 'templates'

function getTree(pages: Record<string, ArchPage>) {
  return Object.values(pages)
    .filter((p) => p.parentId === null)
    .sort((a, b) => a.order - b.order)
}

// ─── Pages panel (existing sitemap + profiles) ────────────────────────────────

function PagesPanel() {
  const pages            = useHub((s) => s.arch.pages)
  const activeProfile    = useHub((s) => s.arch.activeProfileId)
  const archAddPage      = useHub((s) => s.archAddPage)
  const archApplyProfile = useHub((s) => s.archApplyProfile)

  const [profilesOpen, setProfilesOpen]   = useState(Object.keys(pages).length === 0)
  const [selectedId, setSelectedId]       = useState<ArchProfileId>(activeProfile ?? 'saas')
  const [showWarning, setShowWarning]     = useState(false)
  const [pendingId, setPendingId]         = useState<ArchProfileId | null>(null)

  const roots     = getTree(pages)
  const isEmpty   = roots.length === 0
  const pageCount = Object.keys(pages).length
  const selectedProfile = ARCH_PROFILES_MAP[selectedId]

  function handleApply() {
    if (!isEmpty) {
      setPendingId(selectedId)
      setShowWarning(true)
    } else {
      archApplyProfile(selectedId)
    }
  }

  function confirmApply() {
    if (pendingId) {
      archApplyProfile(pendingId)
      setSelectedId(pendingId)
    }
    setShowWarning(false)
    setPendingId(null)
  }

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
              Start from a profile or use Templates tab.
            </p>
          </div>
        ) : (
          roots.map((root) => (
            <PageTreeItem key={root.id} page={root} allPages={pages} depth={0} />
          ))
        )}
      </div>

      {/* ── Quick profiles section ── */}
      <div className="border-t border-app-border shrink-0">
        <button
          className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-app-subtle hover:text-app-muted transition-colors"
          onClick={() => setProfilesOpen(!profilesOpen)}
        >
          <span>Quick profiles</span>
          <ChevronDown size={11} className={cn('transition-transform duration-150', profilesOpen ? 'rotate-180' : '')} />
        </button>

        {profilesOpen && (
          <div className="px-2 pb-2.5 flex flex-col gap-2">
            {/* Grouped select */}
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value as ArchProfileId)
                  setShowWarning(false)
                }}
                className={cn(
                  'w-full appearance-none rounded-app-sm border border-app-border bg-app-elevated',
                  'px-2.5 py-1.5 pr-7 text-[11px] font-medium text-app-text',
                  'focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30 cursor-pointer transition-colors',
                )}
              >
                {ARCH_PROFILE_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.ids.map((id) => {
                      const p = ARCH_PROFILES_MAP[id as ArchProfileId]
                      return p ? <option key={id} value={id}>{p.name}</option> : null
                    })}
                  </optgroup>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-app-subtle" />
            </div>

            {/* Profile preview card */}
            {selectedProfile && (
              <div
                className="rounded-app-sm border border-app-border bg-app-elevated px-2.5 py-2 flex items-start gap-2"
                style={{ background: 'rgba(38,128,235,0.03)' }}
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: 'rgba(38,128,235,0.1)' }}>
                  <IconRenderer name={selectedProfile.icon} size={13} className="text-app-accent opacity-80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-app-text truncate">{selectedProfile.name}</p>
                    {activeProfile === selectedId && (
                      <span className="flex items-center gap-0.5 text-[9px] font-medium text-app-accent shrink-0">
                        <Check size={8} />active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-app-subtle leading-snug mt-0.5 line-clamp-2">{selectedProfile.description}</p>
                  <p className="text-[9.5px] text-app-subtle mt-1 font-medium">{selectedProfile.pages.length} pages</p>
                </div>
              </div>
            )}

            {showWarning && (
              <div className="rounded-app-sm border border-amber-500/30 bg-amber-500/8 px-2.5 py-2 flex flex-col gap-2">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle size={11} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-300 leading-snug">
                    This will replace your {pageCount} existing {pageCount === 1 ? 'page' : 'pages'}.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setShowWarning(false); setPendingId(null) }}
                    className="flex-1 rounded-md border border-app-border bg-app-elevated px-2 py-1 text-[10px] font-medium text-app-muted hover:text-app-text transition-colors">
                    Cancel
                  </button>
                  <button onClick={confirmApply}
                    className="flex-1 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold text-black hover:bg-amber-400 transition-colors">
                    Replace
                  </button>
                </div>
              </div>
            )}

            {!showWarning && (
              <button
                onClick={handleApply}
                disabled={activeProfile === selectedId}
                className={cn(
                  'w-full rounded-app-sm px-3 py-1.5 text-[11px] font-semibold transition-all duration-100',
                  activeProfile === selectedId
                    ? 'bg-app-elevated border border-app-border text-app-subtle cursor-not-allowed'
                    : 'bg-app-accent text-white hover:bg-app-accent-hover active:scale-[0.98]',
                )}
              >
                {activeProfile === selectedId ? 'Already applied' : 'Apply Profile'}
              </button>
            )}
          </div>
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
          label="Templates"
          Icon={LayoutTemplate}
          active={activeTab === 'templates'}
          onClick={() => setActiveTab('templates')}
        />
      </div>

      {/* Panel content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'pages'     && <PagesPanel />}
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
        'flex-1 flex items-center justify-center gap-1.5 h-7 rounded-app-sm text-[11px] font-medium transition-colors duration-100',
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
