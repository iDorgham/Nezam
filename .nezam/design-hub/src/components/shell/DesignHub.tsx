'use client'

import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import type { HubSection } from '@/store/hub.store'
import type { ArchPageType, NavSlot } from '@/types/arch'
import { TopBar } from './TopBar'
import { Onboarding } from './Onboarding'
import { ExportSuccessModal } from './ExportSuccessModal'
import { KeyboardShortcutsDialog } from './KeyboardShortcutsDialog'
import { SectionProgressBar } from './SectionProgressBar'
import { PostOnboardingBanner } from './PostOnboardingBanner'
import { useDesignHubShortcuts } from '@/hooks/useDesignHubShortcuts'
import { useSpotlightTour } from '@/hooks/useSpotlightTour'
import { SpotlightTooltip } from '@/components/ui/SpotlightTooltip'
import { SPOTLIGHT_TOURS } from '@/config/spotlight-tours.config'

// Lazy-import sections to keep initial bundle small
import dynamic from 'next/dynamic'

const ArchSection    = dynamic(() => import('@/components/arch/ArchSection').then(m => ({ default: m.ArchSection })), { ssr: false })
const WireframesSection = dynamic(() => import('@/components/wireframes/WireframesSection').then(m => ({ default: m.WireframesSection })), { ssr: false })
const DesignSection  = dynamic(() => import('@/components/design/DesignSection').then(m => ({ default: m.DesignSection })), { ssr: false })
const ThemingSection = dynamic(() => import('@/components/theming/ThemingSection').then(m => ({ default: m.ThemingSection })), { ssr: false })
const ComponentsSection = dynamic(
  () => import('@/components/comp/ComponentsSection').then((m) => ({ default: m.ComponentsSection })),
  { ssr: false },
)
const PreviewSection = dynamic(() => import('@/components/preview/PreviewSection').then(m => ({ default: m.PreviewSection })), { ssr: false })

function SectionTour({ section }: { section: HubSection }) {
  const { activeSpotId, activeStep, totalSteps, advance, skipTour } = useSpotlightTour(section)
  const tours = SPOTLIGHT_TOURS[section] ?? []
  const activeConfig = activeSpotId ? tours.find((t) => t.id === activeSpotId) : null

  if (!activeConfig) return null

  return (
    <SpotlightTooltip
      key={activeSpotId}
      id={activeConfig.targetAttr}
      title={activeConfig.title}
      body={activeConfig.body}
      side={activeConfig.side}
      step={activeStep}
      total={totalSteps}
      cta={activeConfig.cta ? { label: activeConfig.cta.label, onClick: advance } : undefined}
      onDismiss={advance}
      onNext={advance}
    />
  )
}

export function DesignHub() {
  const section = useHub((s) => s.section)
  const hubTheme = useHub((s) => s.hubTheme)
  const archPages = useHub((s) => s.arch.pages)
  const archHydratePages = useHub((s) => s.archHydratePages)
  const { shortcutsOpen, setShortcutsOpen } = useDesignHubShortcuts()

  // Rehydrate persisted state on mount
  useEffect(() => {
    useHub.persist.rehydrate()
  }, [])

  // Apply hub theme tokens at the document root so portals/modals inherit app-* colors.
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(hubTheme)
    root.style.colorScheme = hubTheme
  }, [hubTheme])

  useEffect(() => {
    // Phase 3 import: bring in `project_context.json` into the v7 Architecture tree
    // if the hub is opened fresh (no existing pages yet).
    async function importProjectContextIfNeeded() {
      const hasHydrated =
        typeof (useHub.persist as any).hasHydrated === 'function'
          ? (useHub.persist as any).hasHydrated()
          : true
      if (!hasHydrated) return

      if (Object.keys(archPages).length > 0) return

      const res = await fetch('/api/context').catch(() => null)
      if (!res || !res.ok) return

      const data = (await res.json().catch(() => ({}))) as any
      if (!data?.exists || !Array.isArray(data?.data?.pages) || data.data.pages.length === 0) return

      const ctxPages = data.data.pages as any[]

      const toArchType = (raw: any): ArchPageType => {
        const t = String(raw ?? '').toLowerCase()
        if (t === 'subpage') return 'subpage'
        if (t === 'page') return 'page'
        if (t === 'section') return 'section'
        if (t === 'modal') return 'modal'
        if (t === 'app') return 'app'
        if (t === 'navmenu') return 'navmenu'
        if (t === 'service') return 'service'
        return 'page'
      }

      const iconFor = (type: ArchPageType) => {
        const def = ({
          app: 'Layers',
          navmenu: 'Menu',
          page: 'FileText',
          subpage: 'CornerDownRight',
          section: 'LayoutGrid',
          modal: 'Layers',
          redirect: 'CornerDownRight',
          group: 'FolderOpen',
          redirect_: 'CornerDownRight',
          service: 'Server',
        } as Record<string, string | undefined>)[type]
        return def ?? 'FileText'
      }

      const mapped = ctxPages.map((p, idx) => {
        const type = toArchType(p?.type ?? p?.kind ?? p?.level)
        return {
          id: `ctx-${String(idx + 1).padStart(3, '0')}`,
          name: String(p?.name ?? p?.title ?? p?.nav_label ?? `Imported Page ${idx + 1}`),
          route: String(p?.route ?? p?.path ?? p?.slug ?? '/'),
          parentId: null,
          order: idx,
          type,
          navSlot: (type === 'app' || type === 'navmenu' ? 'hidden' : 'sidebar') as NavSlot,
          icon: p?.icon ? String(p.icon) : iconFor(type),
          description: String(p?.description ?? p?.summary ?? ''),
          services: undefined,
        }
      })

      archHydratePages(mapped)
    }

    void importProjectContextIfNeeded()
  }, [archPages, archHydratePages])

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-app-bg text-app-text">
      {/* Onboarding overlay — shown on first visit */}
      <Onboarding />

      {/* Post-export next steps modal */}
      <ExportSuccessModal />

      <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      <TopBar onOpenShortcuts={() => setShortcutsOpen(true)} />
      <SectionProgressBar />
      <PostOnboardingBanner />
      <SectionTour section={section} />
      <div className="flex min-h-0 min-w-0 w-full flex-1">
        {section === 'architecture' && (
          <div id="topbar-panel-architecture" role="tabpanel" aria-labelledby="topbar-tab-architecture" className="flex min-h-0 min-w-0 w-full flex-1">
            <ArchSection />
          </div>
        )}
        {section === 'wireframes' && (
          <div id="topbar-panel-wireframes" role="tabpanel" aria-labelledby="topbar-tab-wireframes" className="flex min-h-0 min-w-0 w-full flex-1">
            <WireframesSection />
          </div>
        )}
        {section === 'design' && (
          <div id="topbar-panel-design" role="tabpanel" aria-labelledby="topbar-tab-design" className="flex min-h-0 min-w-0 w-full flex-1">
            <DesignSection />
          </div>
        )}
        {section === 'components' && (
          <div id="topbar-panel-components" role="tabpanel" aria-labelledby="topbar-tab-components" className="flex min-h-0 min-w-0 w-full flex-1">
            <ComponentsSection />
          </div>
        )}
        {section === 'theming' && (
          <div id="topbar-panel-theming" role="tabpanel" aria-labelledby="topbar-tab-theming" className="flex min-h-0 min-w-0 w-full flex-1">
            <ThemingSection />
          </div>
        )}
        {section === 'preview' && (
          <div id="topbar-panel-preview" role="tabpanel" aria-labelledby="topbar-tab-preview" className="flex min-h-0 min-w-0 w-full flex-1">
            <PreviewSection />
          </div>
        )}
      </div>
    </div>
  )
}

