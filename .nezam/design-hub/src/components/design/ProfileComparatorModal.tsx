'use client'

import { useMemo, useRef, useState } from 'react'
import { X, GitCompare } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { DESIGN_PROFILES_MAP, DESIGN_PROFILE_GROUPS } from '@/data/design-profiles'
import type { DesignProfileId } from '@/types/design'
import { flattenTokens, diffFlatTokens } from '@/lib/design/token-flattener'
import { cn } from '@/lib/utils'

interface ProfileComparatorModalProps {
  open: boolean
  onClose: () => void
}

export function ProfileComparatorModal({ open, onClose }: ProfileComparatorModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [leftId, setLeftId] = useState<DesignProfileId>('minimal')
  const [rightId, setRightId] = useState<DesignProfileId>('corporate')
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all')

  const profileIds = useMemo(
    () => DESIGN_PROFILE_GROUPS.flatMap((g) => g.ids).filter((id) => DESIGN_PROFILES_MAP[id]),
    [],
  )

  const diff = useMemo(() => {
    const left = DESIGN_PROFILES_MAP[leftId]?.tokens
    const right = DESIGN_PROFILES_MAP[rightId]?.tokens
    if (!left || !right) return null
    return diffFlatTokens(flattenTokens(left), flattenTokens(right))
  }, [leftId, rightId])

  const rows = useMemo(() => {
    if (!diff) return []
    const all = [
      ...diff.changed.map((e) => ({ ...e, kind: 'changed' as const })),
      ...diff.added.map((e) => ({ ...e, kind: 'added' as const })),
      ...diff.removed.map((e) => ({ ...e, kind: 'removed' as const })),
    ]
    if (categoryFilter === 'all') return all
    return all.filter((r) => r.category === categoryFilter)
  }, [diff, categoryFilter])

  const categories = useMemo(() => {
    if (!diff) return []
    const set = new Set<string>()
    for (const e of [...diff.changed, ...diff.added, ...diff.removed]) {
      set.add(e.category)
    }
    return Array.from(set).sort()
  }, [diff])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-compare-title"
    >
      <div className="relative flex w-full max-w-3xl flex-col rounded-app-lg border border-app-border bg-app-surface shadow-2xl max-h-[85vh]">
        <div className="flex items-center gap-2 border-b border-app-border px-4 py-3">
          <GitCompare size={16} className="text-app-accent" />
          <h2 id="profile-compare-title" className="text-sm font-bold text-app-text flex-1">
            Compare design profiles
          </h2>
          <button type="button" onClick={onClose} className="rounded-app-sm p-1 text-app-subtle hover:bg-app-elevated">
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-app-border px-4 py-3 text-[11px]">
          <label className="flex items-center gap-2">
            <span className="text-app-subtle">A</span>
            <select
              value={leftId}
              onChange={(e) => setLeftId(e.target.value as DesignProfileId)}
              className="rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-app-text"
            >
              {profileIds.map((id) => (
                <option key={id} value={id}>
                  {DESIGN_PROFILES_MAP[id]?.name ?? id}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-app-subtle">B</span>
            <select
              value={rightId}
              onChange={(e) => setRightId(e.target.value as DesignProfileId)}
              className="rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-app-text"
            >
              {profileIds.map((id) => (
                <option key={id} value={id}>
                  {DESIGN_PROFILES_MAP[id]?.name ?? id}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 ml-auto">
            <span className="text-app-subtle">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-app-sm border border-app-border bg-app-elevated px-2 py-1 text-app-text"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto app-scroll p-4">
          {rows.length === 0 ? (
            <p className="text-center text-[11px] text-app-subtle py-8">No differences in this filter.</p>
          ) : (
            <table className="w-full text-[10px]">
              <thead>
                <tr className="text-left text-app-subtle border-b border-app-border">
                  <th className="pb-2 pr-2 font-medium">Token</th>
                  <th className="pb-2 pr-2 font-medium">A</th>
                  <th className="pb-2 font-medium">B</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.key}-${row.kind}`} className="border-b border-app-border/40">
                    <td className="py-1.5 pr-2 font-mono text-app-text align-top">{row.key}</td>
                    <td className="py-1.5 pr-2 text-app-muted align-top">
                      <CellValue value={row.before} path={row.key} />
                    </td>
                    <td className="py-1.5 text-app-muted align-top">
                      <CellValue value={row.after} path={row.key} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function CellValue({ value, path }: { value: string | null; path: string }) {
  if (value === null) return <span>—</span>
  if (value.startsWith('#') && path.includes('color')) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="h-3 w-3 rounded-sm ring-1 ring-black/10" style={{ backgroundColor: value }} />
        {value}
      </span>
    )
  }
  return <span className="break-all">{value}</span>
}

/** Profiles tab entry: compare button state lives in TokenNav. */
export function useProfileComparator() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}
