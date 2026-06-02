'use client'

import { useState } from 'react'
import { AlertTriangle, Check } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { ARCH_PROFILES_MAP, ARCH_PROFILE_GROUPS } from '@/data/arch-profiles'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { ArchProfileId } from '@/types/arch'

interface Props {
  compact?: boolean
}

export function ArchProfilesPicker({ compact }: Props) {
  const pages = useHub((s) => s.arch.pages)
  const activeProfile = useHub((s) => s.arch.activeProfileId)
  const archApplyProfile = useHub((s) => s.archApplyProfile)

  const [query, setQuery] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [pendingId, setPendingId] = useState<ArchProfileId | null>(null)

  const pageCount = Object.keys(pages).length
  const isEmpty = pageCount === 0

  function handleApply(id: ArchProfileId) {
    if (!isEmpty) {
      setPendingId(id)
      setShowWarning(true)
    } else {
      archApplyProfile(id)
    }
  }

  function confirmApply() {
    if (pendingId) archApplyProfile(pendingId)
    setShowWarning(false)
    setPendingId(null)
  }

  const q = query.toLowerCase()

  return (
    <div data-spotlight="arch-profiles-picker" className={cn('flex flex-col min-h-0', compact ? 'gap-2' : 'flex-1')}>
      {!compact && (
        <input
          type="text"
          placeholder="Search blueprints…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-7 rounded-app-sm border border-app-border bg-app-elevated px-2 text-[11px] text-app-text"
        />
      )}
      <div className={cn('overflow-y-auto app-scroll space-y-3', compact ? 'max-h-48' : 'flex-1')}>
        {ARCH_PROFILE_GROUPS.map((group) => {
          const profiles = group.ids.filter((id) => {
            const p = ARCH_PROFILES_MAP[id]
            if (!p) return false
            if (!q) return true
            return (
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
            )
          })
          if (profiles.length === 0) return null
          return (
            <div key={group.label}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-app-subtle mb-1">
                {group.label}
              </p>
              <div className="space-y-1">
                {profiles.map((id) => {
                  const profile = ARCH_PROFILES_MAP[id]
                  const isActive = activeProfile === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleApply(id)}
                      className={cn(
                        'w-full flex items-center gap-2 rounded-app-sm border px-2 py-1.5 text-left transition-colors',
                        isActive
                          ? 'border-app-accent bg-app-accent-subtle/20'
                          : 'border-app-border hover:bg-app-elevated/60',
                      )}
                    >
                      <IconRenderer name={profile.icon} size={14} className="shrink-0 text-app-muted" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-app-text truncate">{profile.name}</p>
                        {!compact && (
                          <p className="text-[9px] text-app-subtle truncate">{profile.description}</p>
                        )}
                      </div>
                      {isActive && <Check size={12} className="text-app-accent shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {showWarning && (
        <div className="rounded-app border border-amber-500/30 bg-amber-500/10 p-2 text-[10px]">
          <div className="flex gap-2">
            <AlertTriangle size={14} className="text-amber-500 shrink-0" />
            <p className="text-app-text">Replace current sitemap with this blueprint?</p>
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <button type="button" className="text-app-subtle" onClick={() => setShowWarning(false)}>
              Cancel
            </button>
            <button type="button" className="font-semibold text-app-accent" onClick={confirmApply}>
              Replace
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
