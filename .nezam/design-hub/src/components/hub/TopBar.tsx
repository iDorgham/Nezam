'use client'

import { useState } from 'react'
import { Undo2, Redo2, Check, Save, Monitor, Tablet, Smartphone, Sun, Moon, Languages } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconButton } from '@/components/ui/IconButton'
import { ExportMenu } from './ExportMenu'
import { cn } from '@/lib/cn'

/** The application's top chrome: identity, history, device controls, theme, save, export. */
export function TopBar() {
  const getProfile = useHub((s) => s.getProfile)
  const overrides = useHub((s) => s.overrides)
  const undo = useHub((s) => s.undo)
  const redo = useHub((s) => s.redo)
  const canUndo = useHub((s) => s.canUndo)
  const canRedo = useHub((s) => s.canRedo)
  const saveDesign = useHub((s) => s.saveDesign)
  const setBuilderMode = useHub((s) => s.setBuilderMode)

  const device = useHub((s) => s.device)
  const setDevice = useHub((s) => s.setDevice)
  const theme = useHub((s) => s.theme)
  const toggleTheme = useHub((s) => s.toggleTheme)
  const dir = useHub((s) => s.dir)
  const toggleDir = useHub((s) => s.toggleDir)
  const activePageId = useHub((s) => s.activePageId)
  const pages = useHub((s) => s.pages)

  const [saved, setSaved] = useState(false)
  const profile = getProfile()
  const edited = Object.keys(overrides).length > 0
  const activePageName = pages.find((p) => p.id === activePageId)?.name ?? 'Home'

  const onSave = () => {
    saveDesign(`${profile.name}${edited ? ' mix' : ''}`)
    setBuilderMode('saved')
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-app-border bg-app-surface px-4 shadow-app-sm">
      {/* Left: Identity & History */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-app-sm bg-gradient-to-br from-app-accent to-[#4f46e5] text-app-on-accent shadow-app-glow">
            <span className="text-[15px] font-bold leading-none">ن</span>
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight text-app-text">
              Nezam <span className="text-app-subtle font-normal">Design Hub</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-app-subtle">
              <span className="truncate max-w-[80px]">{profile.name}</span>
              <span className="text-app-border">/</span>
              <span className="font-medium text-app-text">{activePageName}</span>
              {edited && (
                <span className="flex items-center gap-1 text-app-accent">
                  <span className="h-1 w-1 rounded-full bg-app-accent animate-ping" />
                  edited
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-app-border" />

        {/* History */}
        <div className="flex items-center gap-0.5">
          <IconButton label="Undo" kbd="⌘Z" size="sm" disabled={!canUndo()} onClick={undo}>
            <Undo2 size={14} className={cn(!canUndo() && 'opacity-30')} />
          </IconButton>
          <IconButton label="Redo" kbd="⌘⇧Z" size="sm" disabled={!canRedo()} onClick={redo}>
            <Redo2 size={14} className={cn(!canRedo() && 'opacity-30')} />
          </IconButton>
        </div>
      </div>

      {/* Center: Device mode toggles */}
      <div className="flex items-center gap-0.5 rounded-app bg-app-inset/80 p-0.5 border border-app-border shadow-app-inner">
        <button
          onClick={() => setDevice('desktop')}
          className={cn(
            'flex h-7 w-8 items-center justify-center rounded-app-sm transition-all duration-200 active:scale-90',
            device === 'desktop'
              ? 'bg-app-surface text-app-text shadow-app-sm scale-105 font-bold'
              : 'text-app-subtle hover:text-app-text hover:bg-app-elevated/40'
          )}
          title="Desktop mode"
        >
          <Monitor size={14} />
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={cn(
            'flex h-7 w-8 items-center justify-center rounded-app-sm transition-all duration-200 active:scale-90',
            device === 'tablet'
              ? 'bg-app-surface text-app-text shadow-app-sm scale-105 font-bold'
              : 'text-app-subtle hover:text-app-text hover:bg-app-elevated/40'
          )}
          title="Tablet mode"
        >
          <Tablet size={14} />
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={cn(
            'flex h-7 w-8 items-center justify-center rounded-app-sm transition-all duration-200 active:scale-90',
            device === 'mobile'
              ? 'bg-app-surface text-app-text shadow-app-sm scale-105 font-bold'
              : 'text-app-subtle hover:text-app-text hover:bg-app-elevated/40'
          )}
          title="Mobile mode"
        >
          <Smartphone size={14} />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Light/Dark Toggle switch */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          className="focus-ring relative flex h-7 w-12 shrink-0 items-center rounded-full border border-app-border bg-app-inset p-0.5 transition-colors duration-300 hover:border-app-border-strong"
        >
          <span
            className={cn(
              'grid h-5 w-5 place-items-center rounded-full bg-app-surface text-app-text shadow-app-sm transition-transform duration-300 ease-smooth',
              theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
            )}
          >
            {theme === 'light' ? (
              <Sun size={11} className="text-amber-500" />
            ) : (
              <Moon size={11} className="text-indigo-400" />
            )}
          </span>
        </button>

        {/* Language switch */}
        <button
          onClick={toggleDir}
          className="focus-ring flex h-7 items-center gap-1 rounded-app-sm border border-app-border px-2 text-[11px] font-semibold text-app-text bg-app-surface hover:bg-app-elevated transition-colors duration-200 active:scale-95"
          title={dir === 'ltr' ? 'Switch to Arabic (RTL)' : 'Switch to English (LTR)'}
        >
          <Languages size={12} className="text-app-subtle" />
          <span>{dir === 'ltr' ? 'AR' : 'EN'}</span>
        </button>

        {/* Save changes (Icon-only) */}
        <button
          onClick={onSave}
          className={cn(
            'focus-ring flex h-8 w-8 items-center justify-center rounded-app-sm border transition-all duration-200 active:scale-90',
            saved
              ? 'border-green-500 bg-green-500/10 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.2)] animate-pulse'
              : 'border-app-border text-app-muted hover:border-app-border-strong hover:text-app-text bg-app-surface hover:bg-app-elevated'
          )}
          title={saved ? 'Saved!' : 'Save design'}
        >
          {saved ? <Check size={14} className="stroke-[3px]" /> : <Save size={14} />}
        </button>

        {/* Export menu */}
        <ExportMenu />
      </div>
    </header>
  )
}
