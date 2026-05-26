'use client'

import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import { ArchLeftPanel } from './ArchLeftPanel'
import { SitemapCanvas } from './SitemapCanvas'
import { PageDetail } from './PageDetail'

export function ArchSection() {
  const selectedId     = useHub((s) => s.arch.selectedPageId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archUndo       = useHub((s) => s.archUndo)
  const archRedo       = useHub((s) => s.archRedo)

  const showDetail = !!selectedId

  // Keyboard shortcuts: ⌘Z / Ctrl+Z = undo, ⌘⇧Z / Ctrl+Y = redo
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); archUndo() }
      if ((e.key === 'z' && e.shiftKey) || e.key === 'y') { e.preventDefault(); archRedo() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [archUndo, archRedo])

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left panel — page tree + profiles */}
      <ArchLeftPanel />

      {/* Main canvas — visual sitemap */}
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <SitemapCanvas onSelectPage={() => {}} />

        {/* Page detail side panel */}
        <div
          className={[
            'absolute inset-y-0 right-0 w-72 border-l border-app-border bg-app-surface shadow-app-lg',
            'transition-transform duration-200 ease-smooth',
            showDetail ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {showDetail && <PageDetail onClose={() => archSelectPage(null)} />}
        </div>
      </div>
    </div>
  )
}
