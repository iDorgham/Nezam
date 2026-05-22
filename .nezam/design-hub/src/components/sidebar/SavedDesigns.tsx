'use client'

import { Bookmark, Trash2, Clock } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/cn'

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

/** Saved design snapshots — load or delete. */
export function SavedDesigns() {
  const savedDesigns = useHub((s) => s.savedDesigns)
  const loadSaved = useHub((s) => s.loadSaved)
  const deleteSaved = useHub((s) => s.deleteSaved)

  if (savedDesigns.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark size={20} />}
        title="No saved designs yet"
        body="Tune a profile, then hit Save in the top bar to keep a snapshot here."
      />
    )
  }

  return (
    <div className="app-scroll flex-1 overflow-y-auto px-3 py-3">
      <div className="space-y-1.5">
        {savedDesigns.map((d) => (
          <div
            key={d.id}
            className="group flex items-center gap-2.5 rounded-app border border-app-border bg-app-elevated p-2 transition-colors hover:border-app-border-strong"
          >
            <button
              onClick={() => loadSaved(d.id)}
              className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
            >
              <div className="flex shrink-0 overflow-hidden rounded-app-sm border border-app-border">
                {d.swatch.map((c, i) => (
                  <span key={i} className="h-9 w-3.5" style={{ background: c }} />
                ))}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-app-text">{d.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-app-subtle">
                  <Clock size={10} />
                  {timeAgo(d.createdAt)} · {d.theme}
                </div>
              </div>
            </button>
            <button
              onClick={() => deleteSaved(d.id)}
              aria-label={`Delete ${d.name}`}
              className={cn(
                'focus-ring grid h-7 w-7 shrink-0 place-items-center rounded-app-sm text-app-subtle opacity-0',
                'transition-all hover:bg-app-inset hover:text-app-danger group-hover:opacity-100',
              )}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-app-lg border border-app-border bg-app-inset text-app-subtle">
        {icon}
      </div>
      <div className="text-xs font-semibold text-app-text">{title}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-app-subtle">{body}</p>
    </div>
  )
}
