'use client'

import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import { TopBar } from './TopBar'
import { Onboarding } from './Onboarding'
import { ExportSuccessModal } from './ExportSuccessModal'
import { ExportPanel } from './ExportPanel'
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog'
import { TokenDiffModal } from '@/components/design/TokenDiffModal'
import { useDesignHubShortcuts } from '@/hooks/useDesignHubShortcuts'
import { useInitHub } from '@/hooks/useInitHub'

import dynamic from 'next/dynamic'

const ArchSection = dynamic(
  () => import('@/components/arch/ArchSection').then((m) => ({ default: m.ArchSection })),
  { ssr: false },
)
const WireframesSection = dynamic(
  () => import('@/components/wireframes/WireframesSection').then((m) => ({ default: m.WireframesSection })),
  { ssr: false },
)
const DesignSection = dynamic(
  () => import('@/components/design/DesignSection').then((m) => ({ default: m.DesignSection })),
  { ssr: false },
)
const ThemingSection = dynamic(
  () => import('@/components/theming/ThemingSection').then((m) => ({ default: m.ThemingSection })),
  { ssr: false },
)
const ComponentsSection = dynamic(
  () => import('@/components/comp/ComponentsSection').then((m) => ({ default: m.ComponentsSection })),
  { ssr: false },
)
const PreviewSection = dynamic(
  () => import('@/components/preview/PreviewSection').then((m) => ({ default: m.PreviewSection })),
  { ssr: false },
)

export function DesignHub() {
  const section = useHub((s) => s.section)
  const hubTheme = useHub((s) => s.hubTheme)
  const { shortcutsOpen, setShortcutsOpen } = useDesignHubShortcuts()

  useInitHub()

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(hubTheme)
    root.style.colorScheme = hubTheme
  }, [hubTheme])

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-app-bg text-app-text">
      <Onboarding />
      <ExportSuccessModal />
      <ExportPanel />
      <TokenDiffModal />
      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      <TopBar />
      <div className="flex min-h-0 min-w-0 w-full flex-1">
        <div
          id="topbar-panel-architecture"
          role="tabpanel"
          aria-labelledby="topbar-tab-architecture"
          hidden={section !== 'architecture'}
          className="flex min-h-0 min-w-0 w-full flex-1 data-[hidden=true]:hidden"
          data-hidden={section !== 'architecture'}
        >
          <ArchSection />
        </div>
        <div
          id="topbar-panel-wireframes"
          role="tabpanel"
          aria-labelledby="topbar-tab-wireframes"
          hidden={section !== 'wireframes'}
          className="flex min-h-0 min-w-0 w-full flex-1 data-[hidden=true]:hidden"
          data-hidden={section !== 'wireframes'}
        >
          <WireframesSection />
        </div>
        <div
          id="topbar-panel-design"
          role="tabpanel"
          aria-labelledby="topbar-tab-design"
          hidden={section !== 'design'}
          className="flex min-h-0 min-w-0 w-full flex-1 data-[hidden=true]:hidden"
          data-hidden={section !== 'design'}
        >
          <DesignSection />
        </div>
        <div
          id="topbar-panel-components"
          role="tabpanel"
          aria-labelledby="topbar-tab-components"
          hidden={section !== 'components'}
          className="flex min-h-0 min-w-0 w-full flex-1 data-[hidden=true]:hidden"
          data-hidden={section !== 'components'}
        >
          <ComponentsSection />
        </div>
        <div
          id="topbar-panel-theming"
          role="tabpanel"
          aria-labelledby="topbar-tab-theming"
          hidden={section !== 'theming'}
          className="flex min-h-0 min-w-0 w-full flex-1 data-[hidden=true]:hidden"
          data-hidden={section !== 'theming'}
        >
          <ThemingSection />
        </div>
        <div
          id="topbar-panel-preview"
          role="tabpanel"
          aria-labelledby="topbar-tab-preview"
          hidden={section !== 'preview'}
          className="flex min-h-0 min-w-0 w-full flex-1 data-[hidden=true]:hidden"
          data-hidden={section !== 'preview'}
        >
          <PreviewSection />
        </div>
      </div>
    </div>
  )
}
