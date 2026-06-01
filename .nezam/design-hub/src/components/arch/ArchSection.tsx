'use client'

import { useHub } from '@/store/hub.store'
import { ArchLeftPanel } from './ArchLeftPanel'
import { SitemapCanvas } from './SitemapCanvas'
import { ArchRightRail } from './ArchRightRail'


export function ArchSection() {
  const selectedPageId = useHub((s) => s.arch.selectedPageId)
  const selectedServiceId = useHub((s) => s.arch.selectedServiceId)
  const archSelectPage = useHub((s) => s.archSelectPage)
  const archSelectService = useHub((s) => s.archSelectService)

  const showDetail = !!selectedPageId || !!selectedServiceId

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Left panel — page tree + profiles */}
      <ArchLeftPanel />

      {/* Main canvas — visual sitemap */}
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <SitemapCanvas onSelectPage={() => {}} />

        {/* Properties/Right-Rail side panel — only shown when a card is selected */}
        {showDetail && (
          <aside
            className={[
              'relative h-full w-72 shrink-0 border-l border-app-border bg-app-surface z-20 flex flex-col shadow-none',
              'transition-transform duration-200 ease-smooth',
            ].join(' ')}
          >
            <ArchRightRail
              onClose={() => {
                archSelectPage(null)
                archSelectService(null)
              }}
            />
          </aside>
        )}
      </div>
    </div>
  )
}
