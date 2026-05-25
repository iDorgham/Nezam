'use client'

import { useState } from 'react'
import { useHub } from '@/store/hub.store'
import { ArchLeftPanel } from './ArchLeftPanel'
import { SitemapCanvas } from './SitemapCanvas'
import { PageDetail } from './PageDetail'

export function ArchSection() {
  const selectedId = useHub((s) => s.arch.selectedPageId)
  const [detailOpen, setDetailOpen] = useState(false)

  const showDetail = !!selectedId

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left panel — page tree + profiles */}
      <ArchLeftPanel />

      {/* Main canvas — visual sitemap */}
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <SitemapCanvas onSelectPage={() => setDetailOpen(true)} />

        {/* Page detail side panel */}
        <div
          className={[
            'absolute inset-y-0 right-0 w-72 border-l border-app-border bg-app-surface shadow-app-lg',
            'transition-transform duration-200 ease-smooth',
            showDetail ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {showDetail && <PageDetail onClose={() => useHub.getState().archSelectPage(null)} />}
        </div>
      </div>
    </div>
  )
}
