'use client'

import { useState } from 'react'
import { Eye, EyeOff, ChevronDown, Layers, AlertTriangle, Check } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { DESIGN_PROFILES_MAP, DESIGN_PROFILE_GROUPS } from '@/data/design-profiles'
import { TOKEN_CATEGORY_LABELS, TOKEN_CATEGORY_ICONS, TOKEN_CATEGORY_GROUPS } from '@/types/design'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { TokenCategory, DesignProfileId } from '@/types/design'

export function TokenNav() {
  const category      = useHub((s) => s.design.selectedCategory)
  const activeProfile = useHub((s) => s.design.activeProfileId)
  const showStrip     = useHub((s) => s.design.showPreviewStrip)
  const setCategory   = useHub((s) => s.designSetCategory)
  const applyProfile  = useHub((s) => s.designApplyProfile)
  const toggleStrip   = useHub((s) => s.designTogglePreviewStrip)

  const [profilesOpen, setProfilesOpen] = useState(true)
  const [selectedId, setSelectedId]     = useState<DesignProfileId>(activeProfile ?? 'minimal')
  const [showWarning, setShowWarning]   = useState(false)
  const [pendingId, setPendingId]       = useState<DesignProfileId | null>(null)

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
    <aside className="flex w-52 shrink-0 flex-col border-r border-app-border bg-app-surface overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-app-border shrink-0">
        <Layers size={12} className="text-app-subtle shrink-0" />
        <span className="text-[11px] font-semibold text-app-text flex-1">Design Tokens</span>
      </div>

      {/* ── Token category nav ── */}
      <nav className="flex-1 overflow-y-auto app-scroll py-1.5">
        {TOKEN_CATEGORY_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
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
        ))}
      </nav>

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

      {/* ── Design profiles ── */}
      <div className="border-t border-app-border shrink-0">
        <button
          className="flex w-full items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-app-subtle hover:text-app-muted transition-colors"
          onClick={() => setProfilesOpen(!profilesOpen)}
        >
          <span className="flex-1 text-left">Profiles</span>
          <ChevronDown
            size={11}
            className={cn('transition-transform duration-150', profilesOpen ? 'rotate-180' : '')}
          />
        </button>

        {profilesOpen && (
          <div className="px-2 pb-2.5 flex flex-col gap-2">

            {/* Grouped select */}
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value as DesignProfileId)
                  setShowWarning(false)
                }}
                className={cn(
                  'w-full appearance-none rounded-app-sm border border-app-border bg-app-elevated',
                  'px-2.5 py-1.5 pr-7 text-[11px] font-medium text-app-text',
                  'focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent/30',
                  'cursor-pointer transition-colors',
                )}
              >
                {DESIGN_PROFILE_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.ids.map((id) => {
                      const p = DESIGN_PROFILES_MAP[id as DesignProfileId]
                      return p ? (
                        <option key={id} value={id}>
                          {p.emoji ? `${p.emoji} ` : ''}{p.name}
                        </option>
                      ) : null
                    })}
                  </optgroup>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-app-subtle"
              />
            </div>

            {/* Profile preview swatch card */}
            {selectedProfile && (
              <div className="rounded-app-sm border border-app-border overflow-hidden">
                {/* Gradient swatch bar */}
                <div
                  className="h-6 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${brandColor} 0%, ${accentColor} 100%)`,
                  }}
                />
                <div className="px-2.5 py-2 bg-app-elevated flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-app-text flex-1 truncate">
                      {selectedProfile.emoji} {selectedProfile.name}
                    </p>
                    {activeProfile === selectedId && (
                      <span className="flex items-center gap-0.5 text-[9px] font-medium text-app-accent shrink-0">
                        <Check size={8} />active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-app-subtle leading-snug line-clamp-2">
                    {selectedProfile.description}
                  </p>
                  {/* Palette dots */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {(['500', '400', '300'] as const).map((stop) => (
                      <span
                        key={stop}
                        className="h-3 w-3 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: selectedProfile.tokens.colors.brand[stop] }}
                      />
                    ))}
                    <span className="mx-0.5 text-app-border select-none">·</span>
                    {(['500', '400'] as const).map((stop) => (
                      <span
                        key={`acc-${stop}`}
                        className="h-3 w-3 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: selectedProfile.tokens.colors.accent[stop] }}
                      />
                    ))}
                    <span className="ml-auto text-[9px] text-app-subtle font-mono">
                      {selectedProfile.tokens.colors.mode}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            {showWarning && (
              <div className="rounded-app-sm border border-amber-500/30 bg-amber-500/8 px-2.5 py-2 flex flex-col gap-2">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle size={11} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-300 leading-snug">
                    This will reset all token edits and apply the new profile.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={cancelApply}
                    className="flex-1 rounded-md border border-app-border bg-app-elevated px-2 py-1 text-[10px] font-medium text-app-muted hover:text-app-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmApply}
                    className="flex-1 rounded-md bg-amber-500 px-2 py-1 text-[10px] font-bold text-black hover:bg-amber-400 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Apply button */}
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
      className={cn(
        'relative flex w-full items-center gap-2.5 h-8 px-3 text-[11px] font-medium transition-colors duration-75 select-none',
        active
          ? 'bg-app-elevated text-app-text'
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
