'use client'

import { History as HistoryIcon } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { EmptyState } from './SavedDesigns'
import { cn } from '@/lib/cn'

/** Time-travel history — jump to any prior design state. */
export function HistoryPanel() {
  const history = useHub((s) => s.history)
  const historyIndex = useHub((s) => s.historyIndex)
  const jumpHistory = useHub((s) => s.jumpHistory)

  if (history.length <= 1) {
    return (
      <EmptyState
        icon={<HistoryIcon size={20} />}
        title="History is quiet"
        body="Switch profiles or generate a system — every change is recorded here to revisit."
      />
    )
  }

  // Newest first.
  const entries = history.map((e, i) => ({ e, i })).reverse()

  return (
    <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">
      <div className="relative space-y-0.5">
        {entries.map(({ e, i }) => {
          const current = i === historyIndex
          const future = i > historyIndex
          return (
            <button
              key={e.id}
              onClick={() => jumpHistory(i)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-app-sm px-2 py-2 text-left transition-colors',
                current ? 'bg-app-accent-subtle' : 'hover:bg-app-elevated',
                future && 'opacity-45',
              )}
            >
              <span
                className={cn(
                  'grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[9px] font-bold',
                  current
                    ? 'border-app-accent bg-app-accent text-app-on-accent'
                    : 'border-app-border-strong text-app-subtle',
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    'truncate text-[11px] font-medium',
                    current ? 'text-app-text' : 'text-app-muted',
                  )}
                >
                  {e.label}
                </div>
                <div className="text-[10px] text-app-subtle">
                  {new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {current && (
                <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-app-accent">
                  now
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
