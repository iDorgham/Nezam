'use client'

import { useState, useMemo } from 'react'
import {
  Eye,
  EyeOff,
  Layers,
  AlertTriangle,
  Check,
  Search,
  Sparkles,
  Languages,
  Figma,
  GitCompare,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { DESIGN_PROFILES_MAP, DESIGN_PROFILE_GROUPS } from '@/data/design-profiles'
import { TOKEN_CATEGORY_LABELS, TOKEN_CATEGORY_ICONS, TOKEN_CATEGORY_GROUPS } from '@/types/design'
import { IconRenderer } from '@/lib/icons'
import { LeftPanelSearchRow, LeftPanelTabsRow, LeftPanelTitleRow } from '@/components/ui/LeftPanelHeader'
import { cn } from '@/lib/utils'
import { useSidebarResize } from '@/lib/useSidebarResize'
import { useRTL } from '@/hooks/useRTL'
import { flattenTokens, pathToTokenCategory } from '@/lib/design/token-flattener'
import { getSyncCollectionPreview } from '@/lib/figma-sync'
import {
  ProfileComparatorModal,
  useProfileComparator,
} from '@/components/design/ProfileComparatorModal'
import type { TokenCategory, DesignProfileId } from '@/types/design'

export function TokenNav() {
  const { width, startResize } = useSidebarResize()
  const category = useHub((s) => s.design.selectedCategory)
  const activeProfile = useHub((s) => s.design.activeProfileId)
  const showStrip = useHub((s) => s.design.showPreviewStrip)
  const tokens = useHub((s) => s.design.tokens)
  const figmaSyncedAt = useHub((s) => s.figmaSyncedAt)
  const setFigmaSyncedAt = useHub((s) => s.setFigmaSyncedAt)
  const setCategory = useHub((s) => s.designSetCategory)
  const applyProfile = useHub((s) => s.designApplyProfile)
  const toggleStrip = useHub((s) => s.designTogglePreviewStrip)
  const { rtl, setRtl } = useRTL()
  const profileCompare = useProfileComparator()

  const [activeTab, setActiveTab] = useState<'tokens' | 'profiles'>('tokens')
  const [selectedId, setSelectedId] = useState<DesignProfileId>(activeProfile ?? 'minimal')
  const [showWarning, setShowWarning] = useState(false)
  const [pendingId, setPendingId] = useState<DesignProfileId | null>(null)
  const [query, setQuery] = useState('')
  const [figmaOpen, setFigmaOpen] = useState(false)
  const [figmaBusy, setFigmaBusy] = useState(false)
  const [figmaError, setFigmaError] = useState<string | null>(null)
  const [figmaSuccess, setFigmaSuccess] = useState<string | null>(null)

  const useFlatSearch = activeTab === 'tokens' && query.trim().length > 1
  const flatTokens = useMemo(() => flattenTokens(tokens), [tokens])

  const filteredGroups = useMemo(() => {
    if (useFlatSearch) return []
    if (!query) return TOKEN_CATEGORY_GROUPS
    const q = query.toLowerCase()
    return TOKEN_CATEGORY_GROUPS.map((group) => {
      const cats = group.categories.filter((cat) => {
        const label = TOKEN_CATEGORY_LABELS[cat] ?? ''
        return label.toLowerCase().includes(q) || cat.toLowerCase().includes(q)
      })
      return { ...group, categories: cats }
    }).filter((group) => group.categories.length > 0)
  }, [query, useFlatSearch])

  const flatResults = useMemo(() => {
    if (!useFlatSearch) return []
    const q = query.trim().toLowerCase()
    return flatTokens.filter(
      (row) =>
        row.path.toLowerCase().includes(q) ||
        row.value.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q),
    )
  }, [flatTokens, query, useFlatSearch])

  const figmaPreview = useMemo(() => getSyncCollectionPreview(tokens), [tokens])

  const selectedProfile = DESIGN_PROFILES_MAP[selectedId]
  const hasActiveProfile = activeProfile !== null

  function confirmApply() {
    if (pendingId) applyProfile(pendingId)
    setShowWarning(false)
    setPendingId(null)
  }

  function cancelApply() {
    setShowWarning(false)
    setPendingId(null)
  }

  async function handleFigmaSync() {
    setFigmaBusy(true)
    setFigmaError(null)
    setFigmaSuccess(null)
    try {
      const res = await fetch('/api/figma/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        syncedAt?: string
        message?: string
      }
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'Figma sync failed')
      }
      const at = data.syncedAt ?? new Date().toISOString()
      setFigmaSyncedAt(at)
      setFigmaSuccess(data.message ?? 'Tokens pushed to Figma')
      setFigmaOpen(false)
    } catch (err) {
      setFigmaError(err instanceof Error ? err.message : 'Figma sync failed')
    } finally {
      setFigmaBusy(false)
    }
  }

  return (
    <>
      <aside
        style={{ width }}
        className="relative flex shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden select-none"
      >
        <LeftPanelTitleRow title="Design panel" />
        <div className="px-3 pb-2">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-app-subtle">
            Token controls
          </p>
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
              placeholder={
                activeTab === 'tokens'
                  ? 'Search tokens (2+ chars for deep search)…'
                  : 'Search profiles…'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-[11px] text-app-text outline-none placeholder:text-app-subtle"
            />
          </div>
        </LeftPanelSearchRow>

        {activeTab === 'tokens' && (
          <div className="px-2 pb-2 flex flex-wrap items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setRtl(!rtl)}
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded-app-sm border px-2 text-[10px] font-medium transition-colors',
                rtl
                  ? 'border-app-accent/40 bg-app-accent-subtle text-app-accent'
                  : 'border-app-border bg-app-elevated/40 text-app-subtle hover:text-app-text',
              )}
              aria-pressed={rtl}
            >
              <Languages size={11} />
              RTL
            </button>
            <button
              type="button"
              onClick={() => {
                setFigmaError(null)
                setFigmaSuccess(null)
                setFigmaOpen(true)
              }}
              className="inline-flex h-7 items-center gap-1 rounded-app-sm border border-app-border bg-app-elevated/40 px-2 text-[10px] font-medium text-app-subtle transition-colors hover:text-app-text"
            >
              <Figma size={11} />
              Sync → Figma
            </button>
            {figmaSyncedAt ? (
              <span className="text-[9px] text-app-subtle truncate max-w-[120px]">
                Synced {new Date(figmaSyncedAt).toLocaleDateString()}
              </span>
            ) : null}
          </div>
        )}

        {(figmaSuccess || figmaError) && activeTab === 'tokens' ? (
          <div className="px-3 pb-1 shrink-0">
            {figmaSuccess ? (
              <p className="text-[10px] text-emerald-500">{figmaSuccess}</p>
            ) : null}
            {figmaError ? (
              <p className="text-[10px] text-red-400">{figmaError}</p>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'tokens' && (
          <nav
            id="token-nav-panel-tokens"
            role="tabpanel"
            aria-labelledby="token-nav-tab-tokens"
            className="flex-1 overflow-y-auto app-scroll py-2 min-h-0"
          >
            {useFlatSearch ? (
              flatResults.length === 0 ? (
                <div className="px-3 py-4 text-center">
                  <p className="text-[11px] text-app-subtle">
                    No tokens match &ldquo;{query.trim()}&rdquo;
                  </p>
                </div>
              ) : (
                <ul className="space-y-0.5 px-1">
                  {flatResults.map((row) => (
                    <li key={row.path}>
                      <button
                        type="button"
                        onClick={() => {
                          const cat = pathToTokenCategory(row.path)
                          if (cat) setCategory(cat)
                        }}
                        className="flex w-full flex-col items-start rounded-app-sm px-2 py-1.5 text-left transition-colors hover:bg-app-elevated/60"
                      >
                        <span className="text-[11px] font-medium text-app-text truncate w-full">
                          {row.path}
                        </span>
                        <span className="text-[10px] text-app-subtle truncate w-full">
                          {row.category} · {row.value}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : filteredGroups.length === 0 ? (
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

        {activeTab === 'profiles' && (
          <div
            id="token-nav-panel-profiles"
            role="tabpanel"
            aria-labelledby="token-nav-tab-profiles"
            className="flex-1 overflow-y-auto app-scroll p-2.5 flex flex-col gap-3 min-h-0"
          >
            <button
              type="button"
              onClick={() => profileCompare.setOpen(true)}
              className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-app-sm border border-app-border bg-app-elevated/40 text-[10.5px] font-medium text-app-subtle transition-colors hover:text-app-text shrink-0"
            >
              <GitCompare size={12} />
              Compare profiles
            </button>

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
                                  {p.emoji ? `${p.emoji} ` : ''}
                                  {p.name}
                                </p>
                                {isActive && (
                                  <span className="flex items-center gap-0.5 text-[9px] font-semibold text-app-accent bg-app-accent/8 border border-app-accent/20 px-1 rounded-full shrink-0">
                                    <Check size={8} />
                                    active
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-app-subtle leading-relaxed mt-0.5 line-clamp-2">
                                {p.description}
                              </p>
                            </div>
                          </div>
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
            {showStrip ? (
              <Eye size={12} className="shrink-0" />
            ) : (
              <EyeOff size={12} className="shrink-0" />
            )}
            <span>Component preview</span>
            {showStrip && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-app-accent shrink-0" />
            )}
          </button>
        </div>

        <div
          onMouseDown={startResize}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-app-accent/30 active:bg-app-accent transition-colors z-50 select-none"
        />
      </aside>

      <ProfileComparatorModal
        open={profileCompare.open}
        onClose={() => profileCompare.setOpen(false)}
      />

      {figmaOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="figma-sync-title"
        >
          <div className="w-full max-w-md rounded-app-md border border-app-border bg-app-surface p-4 shadow-lg">
            <h2 id="figma-sync-title" className="text-sm font-semibold text-app-text">
              Sync tokens to Figma
            </h2>
            <p className="mt-1 text-xs text-app-subtle">
              Push color variables to the file configured via{' '}
              <code className="text-[10px]">FIGMA_FILE_KEY</code>. Requires{' '}
              <code className="text-[10px]">FIGMA_ACCESS_TOKEN</code> on the server.
            </p>
            <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto text-xs">
              {figmaPreview.map((row) => (
                <li
                  key={row.id}
                  className="flex justify-between gap-2 rounded border border-app-border/60 px-2 py-1"
                >
                  <span className="font-medium text-app-text">{row.name}</span>
                  <span className="text-app-subtle">{row.variableCount} vars</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={figmaBusy}
                onClick={() => setFigmaOpen(false)}
                className="rounded-app-sm border border-app-border px-3 py-1.5 text-xs text-app-muted hover:text-app-text disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={figmaBusy}
                onClick={() => void handleFigmaSync()}
                className="rounded-app-sm bg-app-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-app-accent/90 disabled:opacity-50"
              >
                {figmaBusy ? 'Syncing…' : 'Push to Figma'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

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

function PanelTabBtn({
  id,
  controls,
  label,
  Icon,
  active,
  onClick,
}: {
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
