'use client'

import { Focus, Layers, Network, Menu, Settings } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { InspectorPanel } from './panels/InspectorPanel'
import { PagesPanel } from './panels/PagesPanel'
import { SitemapPanel } from '@/components/sidebar/SitemapPanel'
import { MenusPanel } from './panels/MenusPanel'
import { SettingsPanel } from './panels/SettingsPanel'
import { PanelHeader } from '@/components/ui/Panel'

/** The right adaptive builder panel container — coordinates selected vertical modes. */
export function RightBuilder() {
  const builderMode = useHub((s) => s.builderMode)

  return (
    <div className="flex h-full min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        {builderMode === 'inspector' && <InspectorPanel />}
        {builderMode === 'pages' && (
          <Wrapped icon={<Layers size={15} />} title="Pages" subtitle="Workspace pages & open tabs">
            <PagesPanel />
          </Wrapped>
        )}
        {builderMode === 'sitemap' && (
          <Wrapped icon={<Network size={15} />} title="Sitemap" subtitle="Project archetype structure">
            <SitemapPanel />
          </Wrapped>
        )}
        {builderMode === 'menus' && (
          <Wrapped icon={<Menu size={15} />} title="Menus" subtitle="Manage header and footer navigation links">
            <MenusPanel />
          </Wrapped>
        )}
        {builderMode === 'settings' && <SettingsPanel />}
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
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader icon={icon} title={title} subtitle={subtitle} />
      {children}
    </div>
  )
}
