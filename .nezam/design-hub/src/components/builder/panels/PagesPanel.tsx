'use client'

import { useState } from 'react'
import { Plus, X, Copy, Edit2, FileText, Check } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PanelBody, Section } from '@/components/ui/Panel'
import { cn } from '@/lib/cn'

export function PagesPanel() {
  const pages = useHub((s) => s.pages)
  const activePageId = useHub((s) => s.activePageId)
  const addPage = useHub((s) => s.addPage)
  const closePage = useHub((s) => s.closePage)
  const duplicatePage = useHub((s) => s.duplicatePage)
  const renamePage = useHub((s) => s.renamePage)
  const setActivePage = useHub((s) => s.setActivePage)

  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameVal, setRenameVal] = useState('')

  const handleStartRename = (id: string, name: string) => {
    setRenamingId(id)
    setRenameVal(name)
  }

  const handleFinishRename = (id: string) => {
    if (renameVal.trim()) {
      renamePage(id, renameVal.trim())
    }
    setRenamingId(null)
  }

  return (
    <PanelBody>
      <div className="flex items-center justify-between px-3 py-2 border-b border-app-border bg-app-inset/30">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-app-subtle">Active pages</span>
        <button
          onClick={() => addPage()}
          className="focus-ring flex items-center gap-1 rounded bg-app-accent px-2 py-1 text-[10px] font-bold text-app-on-accent hover:opacity-90 active:scale-95 transition-all shadow-app-glow"
        >
          <Plus size={10} />
          Add Page
        </button>
      </div>

      <div className="p-3 space-y-1">
        {pages.map((p) => {
          const isActive = p.id === activePageId
          const isRename = renamingId === p.id

          return (
            <div
              key={p.id}
              className={cn(
                'group flex items-center gap-2.5 rounded-app border px-3 py-2 transition-all duration-200',
                isActive
                  ? 'border-app-accent/60 bg-app-accent-subtle/30 shadow-sm'
                  : 'border-app-border bg-app-inset/40 hover:border-app-border-strong hover:bg-app-surface'
              )}
            >
              <FileText size={13} className={isActive ? 'text-app-accent' : 'text-app-subtle'} />
              
              {isRename ? (
                <input
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={() => handleFinishRename(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishRename(p.id)
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                  className="flex-1 bg-app-inset border border-app-accent rounded px-1.5 py-0.5 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-app-accent"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setActivePage(p.id)}
                  className={cn(
                    'min-w-0 flex-1 truncate text-left text-xs',
                    isActive ? 'font-semibold text-app-text' : 'text-app-muted hover:text-app-text'
                  )}
                >
                  {p.name}
                  {p.isUnsaved && (
                    <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-app-accent" />
                  )}
                </button>
              )}

              {isActive && <Check size={11} className="text-app-accent shrink-0" />}

              {/* Action buttons revealed on hover */}
              {!isRename && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => handleStartRename(p.id, p.name)}
                    className="focus-ring grid h-5 w-5 place-items-center rounded-sm text-app-subtle hover:bg-app-elevated hover:text-app-text transition-colors"
                    title="Rename"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => duplicatePage(p.id)}
                    className="focus-ring grid h-5 w-5 place-items-center rounded-sm text-app-subtle hover:bg-app-elevated hover:text-app-text transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={11} />
                  </button>
                  <button
                    onClick={() => closePage(p.id)}
                    disabled={pages.length <= 1}
                    className="focus-ring grid h-5 w-5 place-items-center rounded-sm text-app-subtle disabled:opacity-30 hover:bg-app-elevated hover:text-app-danger transition-colors"
                    title="Delete Page"
                  >
                    <X size={11} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </PanelBody>
  )
}
