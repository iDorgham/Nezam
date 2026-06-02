'use client'

import { useState, useMemo } from 'react'
import { Eye, EyeOff, ChevronDown, Layers, AlertTriangle, Check, Search, Sparkles } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { DESIGN_PROFILES_MAP, DESIGN_PROFILE_GROUPS } from '@/data/design-profiles'
import { TOKEN_CATEGORY_LABELS, TOKEN_CATEGORY_ICONS, TOKEN_CATEGORY_GROUPS } from '@/types/design'
import { IconRenderer } from '@/lib/icons'
import { LeftPanelSearchRow, LeftPanelTabsRow, LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
import { cn } from '@/lib/utils'
import { useSidebarResize } from '@/lib/useSidebarResize'
import type { TokenCategory, DesignProfileId } from '@/types/design'

export function TokenNav() {
  const { width, startResize } = useSidebarResize()
  const category      = useHub((s) => s.design.selectedCategory)
  const activeProfile = useHub((s) => s.design.activeProfileId)
  const showStrip     = useHub((s) => s.design.showPreviewStrip)
  const setCategory   = useHub((s) => s.designSetCategory)
  const applyProfile  = useHub((s) => s.designApplyProfile)
  const toggleStrip   = useHub((s) => s.designTogglePreviewStrip)

  const [activeTab, setActiveTab]       = useState<'tokens' | 'profiles'>('tokens')
  const [selectedId, setSelectedId]     = useState<DesignProfileId>(activeProfile ?? 'minimal')
  const [showWarning, setShowWarning]   = useState(false)
  const [pendingId, setPendingId]       = useState<DesignProfileId | null>(null)
  const [query, setQuery]               = useState('')

  const filteredGroups = useMemo(() => {
    if (!query) return TOKEN_CATEGORY_GROUPS
    const q = query.toLowerCase()
    return TOKEN_CATEGORY_GROUPS.map((group) => {
      const cats = group.categories.filter((cat) => {
        const label = TOKEN_CATEGORY_LABELS[cat] ?? ''
        return label.toLowerCase().includes(q) || cat.toLowerCase().includes(q)
      })
      return { ...group, categories: cats }
    }).filter((group) => group.categories.length > 0)
  }, [query])

  const selectedProfile = DESIGN_PROFILES_MAP[selectedId]
  const brandColor      = selectedProfile?.tokens.colors.brand['500'] ?? '#3b82f6'
  const accentColor     = selectedProfile?.tokens.colors.accent['500'] ?? '#6366f1'
  const hasActiveProfile = activeProfile !== null

  function handleApply() {
    if (hasActiveProfile && activeProfile !== selectedId) {
      setPendingId(selectedId)
      setShowWarning(true)
    } else {
      applyProfile(selectedId)
    }
  }

  function confirmApply() {
    if (pendingId) applyProfile(pendingId)
    setShowWarning(false)
    setPendingId(null)
  }

  function cancelApply() {
    setShowWarning(false)
    setPendingId(null)
  }

  return (
    <aside
      style={{ width }}
      data-spotlight="design-token-nav"
      className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
    >
      <LeftPanelTitleRow title="Design panel" />
      <div className="px-3 pb-2">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-app-subtle">Token controls</p>
      </div>

      <LeftPanelTabsRow role="tablist" aria-label="Design panel tabs" className="px-2 pb-1">
        <PanelTabBtn
          id="token-nav-tab-tokens"
          controls="token-nav-panel-tokens"
          label="Tokens"
          Icon={Layers}
          active={activeTab === 'tokens'}
          onClick={() => {
            setActiveTab('tokens')
            setQuery('')
          }}
        />
        <PanelTabBtn
          id="token-nav-tab-profiles"
          controls="token-nav-panel-profiles"
          label="Profiles"
          Icon={Sparkles}
          active={activeTab === 'profiles'}
          onClick={() => {
            setActiveTab('profiles')
            setQuery('')
          }}
        />
      </LeftPanelTabsRow>

      <LeftPanelSearchRow className="px-2 py-1.5">
        <div className="relative flex items-center h-8 bg-app-elevated/90 border border-app-border rounded-app-sm px-2.5">
          <Search size={11} className="text-app-subtle mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder={activeTab === 'tokens' ? "Search tokens categories..." : "Search profiles..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[11px] text-app-text outline-none placeholder:text-app-subtle"
          />
        </div>
      </LeftPanelSearchRow>

      {/* ── Token category nav ── */}
      {activeTab === 'tokens' && (
        <nav id="token-nav-panel-tokens" role="tabpanel" aria-labelledby="token-nav-tab-tokens" className="flex-1 overflow-y-auto app-scroll py-2">
          {filteredGroups.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-[11px] text-app-subtle">No categories found.</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.label} className="mb-2.5">
                <p className="px-3 pt-2 pb-1 text-[9.5px] font-bold uppercase tracking-[0.13em] text-app-subtle select-none">
                  {group.label}
                </p>
                {group.categories.map((cat) => (
                  <CategoryRow
                    key={cat}
                    cat={cat}
                    active={category === cat}
                    onClick={() => setCategory(cat)}
                  />
                ))}
              </div>
            ))
          )}
        </nav>
      )}

      {/* ── Design profiles tab panel ── */}
      {activeTab === 'profiles' && (
        <div id="token-nav-panel-profiles" role="tabpanel" aria-labelledby="token-nav-tab-profiles" className="flex-1 overflow-y-auto app-scroll p-2.5 flex flex-col gap-3 min-h-0">
          {showWarning && (
            <div className="p-3 rounded-app-sm border border-amber-500/30 bg-amber-500/8 flex flex-col gap-2 shrink-0 animate-in fade-in duration-150">
              <div className="flex items-start gap-1.5">
                <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-amber-300 leading-snug">
                  This will reset all token edits and apply the new profile. Are you sure?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelApply}
                  className="flex-1 rounded border border-app-border bg-app-elevated px-2.5 py-1 text-[10.5px] font-medium text-app-muted hover:text-app-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmApply}
                  className="flex-1 rounded bg-amber-500 px-2.5 py-1 text-[10.5px] font-bold text-black hover:bg-amber-400 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {DESIGN_PROFILE_GROUPS.map((group) => {
            const matchingIds = group.ids.filter((id) => {
              const p = DESIGN_PROFILES_MAP[id]
              if (!p) return false
              const q = query.toLowerCase()
              return !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            })

            if (matchingIds.length === 0) return null

            return (
              <div key={group.label} className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <h4 className="text-[9.5px] font-bold text-app-subtle uppercase tracking-wider mb-0.5">
                  {group.label}
                </h4>
                <div className="flex flex-col gap-2">
                  {matchingIds.map((id) => {
                    const p = DESIGN_PROFILES_MAP[id]
                    if (!p) return null
                    const isActive = activeProfile === id
                    const bColor = p.tokens.colors.brand['500'] ?? '#3b82f6'
                    const aColor = p.tokens.colors.accent['500'] ?? '#6366f1'

                    return (
                        <button
                        key={id}
                        onClick={() => {
                          if (!isActive) {
                            setSelectedId(id)
                            if (activeProfile && activeProfile !== id) {
                              setPendingId(id)
                              setShowWarning(true)
                            } else {
                              applyProfile(id)
                            }
                          }
                        }}
                        type="button"
                        className={cn(
                          'rounded-app-sm border p-2.5 flex flex-col gap-2 transition-all duration-150 cursor-pointer select-none',
                          isActive
                            ? 'border-app-accent bg-app-accent-subtle/10'
                            : 'border-app-border bg-app-elevated/40 hover:border-app-accent/40 hover:bg-app-elevated/80',
                        )}
                      >
                        {/* Swatch gradient bar */}
                        <div
                          className="h-3 w-full rounded-sm"
                          style={{
                            background: `linear-gradient(90deg, ${bColor} 0%, ${aColor} 100%)`,
                          }}
                        />

                        <div className="flex items-start justify-between min-w-0">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-[11.5px] font-semibold text-app-text truncate">
                                {p.emoji ? `${p.emoji} ` : ''}{p.name}
                              </p>
                              {isActive && (
                                <span className="flex items-center gap-0.5 text-[9px] font-semibold text-app-accent bg-app-accent/8 border border-app-accent/20 px-1 rounded-full shrink-0">
                                  <Check size={8} />active
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-app-subtle leading-relaxed mt-0.5 line-clamp-2">
                              {p.description}
                            </p>
                          </div>
                        </div>

                        {/* Palette dots */}
                        <div className="flex items-center gap-1 border-t border-app-border/40 pt-1.5 mt-0.5 shrink-0">
                          {(['500', '400', '300'] as const).map((stop) => (
                            <span
                              key={stop}
                              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                              style={{ backgroundColor: p.tokens.colors.brand[stop] }}
                            />
                          ))}
                          <span className="text-[9px] text-app-subtle select-none">·</span>
                          {(['500', '400'] as const).map((stop) => (
                            <span
                              key={`acc-${stop}`}
                              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                              style={{ backgroundColor: p.tokens.colors.accent[stop] }}
                            />
                          ))}
                          <span className="ml-auto text-[9px] font-mono text-app-subtle uppercase">
                            {p.tokens.colors.mode}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Component preview toggle ── */}
      <div className="border-t border-app-border px-3 py-2.5 shrink-0">
        <button
          onClick={toggleStrip}
          className={cn(
            'flex w-full items-center gap-2 rounded-app-sm px-2 py-1.5 text-[11px] font-medium transition-all duration-100',
            showStrip
              ? 'bg-app-accent-subtle text-app-accent'
              : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/50',
          )}
        >
          {showStrip
            ? <Eye size={12} className="shrink-0" />
            : <EyeOff size={12} className="shrink-0" />
          }
          <span>Component preview</span>
          {showStrip && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-app-accent shrink-0" />
          )}
        </button>
      </div>

      {/* Design profiles accordion removed */}

      {/* Resizer Handle */}
      <div
        onMouseDown={startResize}
        className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
      />
    </aside>
  )
}

// ─── Category row ─────────────────────────────────────────────────────────────

function CategoryRow({
  cat,
  active,
  onClick,
}: {
  cat: TokenCategory
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'relative flex w-full items-center gap-2.5 h-8 px-3 text-[11px] font-medium transition-colors duration-75 select-none rounded-r-app-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
        active
          ? 'bg-app-elevated/80 text-app-text'
          : 'text-app-muted hover:bg-app-elevated/40 hover:text-app-text',
      )}
    >
      {/* Active accent bar */}
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-app-accent" />
      )}
      <span className="shrink-0 w-4 flex items-center justify-center opacity-75">
        <IconRenderer name={TOKEN_CATEGORY_ICONS[cat]} size={13} />
      </span>
      {TOKEN_CATEGORY_LABELS[cat]}
    </button>
  )
}

function PanelTabBtn({ id, controls, label, Icon, active, onClick }: {
  id: string
  controls: string
  label: string
  Icon: React.FC<{ size?: number; className?: string }>
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-controls={controls}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      type="button"
      className={cn(
        'flex-1 flex items-center justify-center gap-1 h-7 rounded-app-sm text-[11px] font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent',
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
