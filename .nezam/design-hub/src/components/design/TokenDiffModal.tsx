'use client'

import { useRef } from 'react'
import { X } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'

function isColorKey(key: string) {
  return key.includes('colors') || key.includes('brand') || key.includes('accent')
}

function Swatch({ value }: { value: string | null }) {
  if (!value || !value.startsWith('#')) {
    return <span className="font-mono text-[10px] text-app-muted">{value ?? '—'}</span>
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-3.5 w-3.5 rounded-sm ring-1 ring-black/10 shrink-0"
        style={{ backgroundColor: value }}
      />
      <span className="font-mono text-[10px] text-app-muted">{value}</span>
    </span>
  )
}

export function TokenDiffModal() {
  const tokenDiff = useHub((s) => s.tokenDiff)
  const clearTokenDiff = useHub((s) => s.clearTokenDiff)
  const overlayRef = useRef<HTMLDivElement>(null)

  if (!tokenDiff) return null

  const total =
    tokenDiff.changed.length + tokenDiff.added.length + tokenDiff.removed.length

  if (total === 0) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) clearTokenDiff()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="token-diff-title"
    >
      <div className="relative w-full max-w-lg rounded-app-lg border border-app-border bg-app-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-app-border px-4 py-3">
          <h2 id="token-diff-title" className="text-sm font-bold text-app-text">
            Profile token changes
          </h2>
          <button
            type="button"
            onClick={() => clearTokenDiff()}
            className="rounded-app-sm p-1 text-app-subtle hover:bg-app-elevated"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto app-scroll p-4 space-y-4 text-[11px]">
          {tokenDiff.changed.length > 0 && (
            <DiffSection title="Changed" entries={tokenDiff.changed} variant="changed" />
          )}
          {tokenDiff.added.length > 0 && (
            <DiffSection title="Added" entries={tokenDiff.added} variant="added" />
          )}
          {tokenDiff.removed.length > 0 && (
            <DiffSection title="Removed" entries={tokenDiff.removed} variant="removed" />
          )}
        </div>

        <div className="border-t border-app-border px-4 py-3 flex justify-end">
          <button
            type="button"
            onClick={() => clearTokenDiff()}
            className="rounded-app-sm bg-app-accent px-3 py-1.5 text-[11px] font-semibold text-app-on-accent"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

function DiffSection({
  title,
  entries,
  variant,
}: {
  title: string
  entries: { key: string; category: string; before: string | null; after: string | null }[]
  variant: 'changed' | 'added' | 'removed'
}) {
  return (
    <section>
      <h3
        className={cn(
          'text-[10px] font-bold uppercase tracking-wider mb-2',
          variant === 'changed' && 'text-amber-400',
          variant === 'added' && 'text-emerald-400',
          variant === 'removed' && 'text-red-400',
        )}
      >
        {title} ({entries.length})
      </h3>
      <ul className="space-y-1.5">
        {entries.slice(0, 24).map((entry) => (
          <li
            key={entry.key}
            className="rounded-app-sm border border-app-border/60 bg-app-elevated/30 px-2.5 py-1.5"
          >
            <p className="font-mono text-[10px] text-app-text truncate">{entry.key}</p>
            <p className="text-[9px] text-app-subtle">{entry.category}</p>
            {variant === 'changed' && (
              <div className="mt-1 flex flex-wrap gap-2">
                {isColorKey(entry.key) ? (
                  <>
                    <Swatch value={entry.before} />
                    <span className="text-app-muted">→</span>
                    <Swatch value={entry.after} />
                  </>
                ) : (
                  <span className="text-app-muted">
                    {entry.before} → {entry.after}
                  </span>
                )}
              </div>
            )}
            {variant === 'added' && (
              <div className="mt-1">
                {isColorKey(entry.key) ? <Swatch value={entry.after} /> : entry.after}
              </div>
            )}
            {variant === 'removed' && (
              <div className="mt-1">
                {isColorKey(entry.key) ? <Swatch value={entry.before} /> : entry.before}
              </div>
            )}
          </li>
        ))}
        {entries.length > 24 && (
          <li className="text-[10px] text-app-subtle">+{entries.length - 24} more</li>
        )}
      </ul>
    </section>
  )
}
