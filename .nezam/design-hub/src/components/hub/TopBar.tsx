'use client'

import { useState } from 'react'
import { Undo2, Redo2, Bookmark, Check } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconButton } from '@/components/ui/IconButton'
import { ExportMenu } from './ExportMenu'
import { cn } from '@/lib/cn'

/** The application's top chrome: identity, history, save, export. */
export function TopBar() {
  const getProfile = useHub((s) => s.getProfile)
  const overrides = useHub((s) => s.overrides)
  const undo = useHub((s) => s.undo)
  const redo = useHub((s) => s.redo)
  const canUndo = useHub((s) => s.canUndo)
  const canRedo = useHub((s) => s.canRedo)
  const saveDesign = useHub((s) => s.saveDesign)
  const setBuilderMode = useHub((s) => s.setBuilderMode)

  const [saved, setSaved] = useState(false)
  const profile = getProfile()
  const edited = Object.keys(overrides).length > 0

  const onSave = () => {
    saveDesign(`${profile.name}${edited ? ' mix' : ''}`)
    setBuilderMode('saved')
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

      {/* History */}
      <div className="flex items-center gap-0.5">
        <IconButton label="Undo" kbd="⌘Z" size="sm" disabled={!canUndo()} onClick={undo}>
          <Undo2 size={15} className={cn(!canUndo() && 'opacity-30')} />
        </IconButton>
        <IconButton label="Redo" kbd="⌘⇧Z" size="sm" disabled={!canRedo()} onClick={redo}>
          <Redo2 size={15} className={cn(!canRedo() && 'opacity-30')} />
        </IconButton>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <button
        onClick={onSave}
        className={cn(
          'focus-ring flex h-8 items-center gap-1.5 rounded-app-sm border px-2.5 text-xs font-medium transition-colors',
          saved
            ? 'border-app-accent text-app-accent'
            : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text',
        )}
      >
        {saved ? <Check size={14} /> : <Bookmark size={14} />}
        {saved ? 'Saved' : 'Save'}
      </button>

      <ExportMenu />
    </header>
  )
}
