'use client'

import { Network, LayoutGrid, History, Bookmark } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { IconTabBar } from './IconTabBar'
import { BrandPanel } from './panels/BrandPanel'
import { StylesPanel } from './panels/StylesPanel'
import { LayoutPanel } from './panels/LayoutPanel'
import { InteractionsPanel } from './panels/InteractionsPanel'
import { AIPanel } from './panels/AIPanel'
import { InspectorPanel } from './panels/InspectorPanel'
import { LayersPanel } from './panels/LayersPanel'
import { CommentsPanel } from './panels/CommentsPanel'
import { PanelHeader } from '@/components/ui/Panel'
import { ProfileGallery } from '@/components/sidebar/ProfileGallery'
import { SitemapPanel } from '@/components/sidebar/SitemapPanel'
import { SavedDesigns } from '@/components/sidebar/SavedDesigns'
import { HistoryPanel } from '@/components/sidebar/HistoryPanel'

/** The right adaptive builder — vertical icon rail + the active mode panel. */
export function RightBuilder() {
  const builderMode = useHub((s) => s.builderMode)

  return (
    <div className="flex h-full">
      <IconTabBar />
      <div className="flex min-w-0 flex-1 flex-col">
        {builderMode === 'sitemap' && (
          <Wrapped icon={<Network size={15} />} title="Sitemap" subtitle="Project page structure">
            <SitemapPanel />
          </Wrapped>
        )}
        {builderMode === 'profiles' && (
          <Wrapped
            icon={<LayoutGrid size={15} />}
            title="Profiles"
            subtitle="Curated & generated systems"
          >
            <ProfileGallery />
          </Wrapped>
        )}
        {builderMode === 'brand' && <BrandPanel />}
        {builderMode === 'styles' && <StylesPanel />}
        {builderMode === 'layout' && <LayoutPanel />}
        {builderMode === 'inspector' && <InspectorPanel />}
        {builderMode === 'layers' && <LayersPanel />}
        {builderMode === 'comments' && <CommentsPanel />}
        {builderMode === 'interactions' && <InteractionsPanel />}
        {builderMode === 'ai' && <AIPanel />}
        {builderMode === 'saved' && (
          <Wrapped icon={<Bookmark size={15} />} title="Saved" subtitle="Your design snapshots">
            <SavedDesigns />
          </Wrapped>
        )}
        {builderMode === 'history' && (
          <Wrapped
            icon={<History size={15} />}
            title="History"
            subtitle="Travel to any prior state"
          >
            <HistoryPanel />
          </Wrapped>
        )}
      </div>
    </div>
  )
}

function Wrapped({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon={icon} title={title} subtitle={subtitle} />
      {children}
    </div>
  )
}
