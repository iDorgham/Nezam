'use client'

import dynamic from 'next/dynamic'
import { useHub } from '@/store/hub.store'
import { DesignSubTabs } from './DesignSubTabs'
import { TokensView }    from './TokensView'

const ComponentsSection = dynamic(
  () => import('@/components/comp/ComponentsSection').then(m => ({ default: m.ComponentsSection })),
  { ssr: false },
)
const SectionsSection = dynamic(
  () => import('@/components/design/SectionsSection').then(m => ({ default: m.SectionsSection })),
  { ssr: false },
)
const ThemingSection = dynamic(
  () => import('@/components/theming/ThemingSection').then(m => ({ default: m.ThemingSection })),
  { ssr: false },
)

export function DesignSection() {
  const subTab = useHub((s) => s.design.subTab)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <DesignSubTabs />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {subTab === 'tokens'     && <TokensView />}
        {subTab === 'components' && <ComponentsSection />}
        {subTab === 'sections'   && <SectionsSection />}
        {subTab === 'theming'    && <ThemingSection />}
      </div>
    </div>
  )
}
