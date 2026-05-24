'use client'

import { Network, LayoutGrid, Shapes, Wand2 } from 'lucide-react'
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
import { DesignSystemPanel } from './panels/DesignSystemPanel'
import { ThemePanel } from './panels/ThemePanel'
import { PanelHeader } from '@/components/ui/Panel'
import { ProfileGallery } from '@/components/sidebar/ProfileGallery'
import { SitemapPanel } from '@/components/sidebar/SitemapPanel'

/** The right adaptive builder — vertical icon rail + the active mode panel. */
export function RightBuilder() {
  const builderMode = useHub((s) => s.builderMode)

  return (
    <div className="flex h-full">
      <IconTabBar />
      <div className="flex min-w-0 flex-1 flex-col">
        {builderMode === 'sitemap' && (
          <Wrapped icon={<Network size={15} />} title="Structure" subtitle="Apps, pages, menus & services">
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
        {builderMode === 'design-system' && (
          <Wrapped icon={<Shapes size={15} />} title="Design System" subtitle="Colors, type, spacing & components">
            <DesignSystemPanel />
          </Wrapped>
        )}
        {builderMode === 'theme' && (
          <Wrapped icon={<Wand2 size={15} />} title="Theme" subtitle="Layout styles & page templates">
            <ThemePanel />
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
