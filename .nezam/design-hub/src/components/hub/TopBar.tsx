'use client'

import { useState, useRef, useEffect } from 'react'
import { Undo2, Redo2, Check, History, Save } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconButton } from '@/components/ui/IconButton'
import { ExportMenu } from './ExportMenu'
import { cn } from '@/lib/cn'

/** Inline history dropdown shown in the top chrome. */
function HistoryDropdown() {
  const history      = useHub((s) => s.history)
  const historyIndex = useHub((s) => s.historyIndex)
  const jumpHistory  = useHub((s) => s.jumpHistory)

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const entries = history.map((e, i) => ({ e, i })).reverse()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'focus-ring flex h-8 items-center gap-1.5 rounded-app-sm border px-2.5 text-xs font-medium transition-colors',
          open
            ? 'border-app-accent text-app-accent bg-app-accent/5'
            : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
        )}
        title="Design history"
      >
        <History size={13} />
        <span className="hidden sm:inline">History</span>
        {history.length > 1 && (
          <span className="grid h-4 min-w-4 place-items-center rounded-full bg-app-elevated px-1 text-[9px] font-bold text-app-muted">
            {history.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-app-xl">
          <div className="border-b border-app-border px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-app-subtle">Design History</p>
          </div>
          <div className="app-scroll max-h-72 overflow-y-auto">
            {history.length <= 1 ? (
              <p className="px-3 py-4 text-center text-[11px] text-app-subtle">
                No history yet — switch profiles or make design changes.
              </p>
            ) : (
              <div className="py-1">
                {entries.map(({ e, i }) => {
                  const current = i === historyIndex
                  const future  = i > historyIndex
                  return (
                    <button
                      key={e.id}
                      onClick={() => { jumpHistory(i); setOpen(false) }}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors',
                        current ? 'bg-app-accent/8' : 'hover:bg-app-elevated',
                        future && 'opacity-45',
                      )}
                    >
                      <span className={cn(
                        'grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[9px] font-bold',
                        current
                          ? 'border-app-accent bg-app-accent text-app-on-accent'
                          : 'border-app-border-strong text-app-subtle',
                      )}>
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn('truncate text-[11px] font-medium', current ? 'text-app-text' : 'text-app-muted')}>
                          {e.label}
                        </p>
                        <p className="text-[10px] text-app-subtle">
                          {new Date(e.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {current && (
                        <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide text-app-accent">now</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** The application's top chrome: identity, undo/redo, history, save, export. */
export function TopBar() {
  const getProfile  = useHub((s) => s.getProfile)
  const overrides   = useHub((s) => s.overrides)
  const undo        = useHub((s) => s.undo)
  const redo        = useHub((s) => s.redo)
  const canUndo     = useHub((s) => s.canUndo)
  const canRedo     = useHub((s) => s.canRedo)
  const saveDesign  = useHub((s) => s.saveDesign)

  const [saved, setSaved] = useState(false)
  const profile = getProfile()
  const edited  = Object.keys(overrides).length > 0

  const onSave = () => {
    saveDesign(`${profile.name}${edited ? ' mix' : ''}`)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <header className="flex h-[52px] shrink-0 items-center gap-3 border-b border-app-border bg-app-surface px-3">
      {/* Identity */}
      <div className="flex items-center gap-2.5 pl-1">
        <div className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-app-sm bg-gradient-to-br from-app-accent to-[#4f46e5] text-app-on-accent shadow-app-glow">
          <span className="text-[15px] font-bold leading-none">ن</span>
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight text-app-text">
            NEZAM <span className="text-app-subtle">Design Hub</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-app-subtle">
            <span className="truncate">{profile.name}</span>
            {edited && (
              <span className="flex items-center gap-1 text-app-accent">
                <span className="h-1 w-1 rounded-full bg-app-accent" />
                edited
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-1 h-6 w-px bg-app-border" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
        <IconButton label="Undo" kbd="⌘Z" size="sm" disabled={!canUndo()} onClick={undo}>
          <Undo2 size={15} className={cn(!canUndo() && 'opacity-30')} />
        </IconButton>
        <IconButton label="Redo" kbd="⌘⇧Z" size="sm" disabled={!canRedo()} onClick={redo}>
          <Redo2 size={15} className={cn(!canRedo() && 'opacity-30')} />
        </IconButton>
      </div>

      <div className="flex-1" />

      {/* History dropdown */}
      <HistoryDropdown />

      {/* Save */}
      <button
        onClick={onSave}
        className={cn(
          'focus-ring flex h-8 items-center gap-1.5 rounded-app-sm border px-2.5 text-xs font-medium transition-colors',
          saved
            ? 'border-app-accent text-app-accent'
            : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
        )}
      >
        {saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved' : 'Save'}
      </button>

      <ExportMenu />
    </header>
  )
}
