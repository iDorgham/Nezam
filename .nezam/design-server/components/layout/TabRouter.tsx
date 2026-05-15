'use client'

import React, { lazy, Suspense } from 'react'
import { useSessionStore } from '@/lib/store/session.store'

// Lazy-load each workspace — only bundled when first opened
const SitemapPage        = lazy(() => import('@/app/sitemap/page'))
const MenusWorkspace     = lazy(() => import('@/components/menus/MenusWorkspace'))
const CanvasWorkspace    = lazy(() => import('@/components/canvas/CanvasWorkspace'))
const TemplateBuilderPage = lazy(() => import('@/app/template-builder/page'))
const WireframesWorkspace = lazy(() => import('@/components/wireframe/WireframesWorkspace'))
const ProfilesPage       = lazy(() => import('@/app/profiles/page'))
const ProfileEditorPage  = lazy(() => import('@/app/profile-editor/page'))
const SettingsPage       = lazy(() => import('@/app/settings/page'))
const AIPage             = lazy(() => import('@/app/ai/page'))
const TokensPage         = lazy(() => import('@/app/tokens/page'))
const LayoutDesignerPage = lazy(() => import('@/app/layout-designer/page'))
const ThemeEditorPage    = lazy(() => import('@/app/theme-editor/page'))
const AssetManagerPage   = lazy(() => import('@/app/asset-manager/page'))
const ExportPage         = lazy(() => import('@/app/export/page'))
const ReviewPage         = lazy(() => import('@/app/review/page'))

function TabFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="text-ds-text-muted text-xs animate-pulse">Loading…</div>
    </div>
  )
}

const TAB_MAP: Record<string, React.LazyExoticComponent<() => JSX.Element>> = {
  sitemap:         SitemapPage,
  menus:           MenusWorkspace,
  canvas:          CanvasWorkspace,
  template:        TemplateBuilderPage,
  wireframes:      WireframesWorkspace,
  profiles:        ProfilesPage,
  'profile-editor': ProfileEditorPage,
  settings:        SettingsPage,
  ai:              AIPage,
  tokens:          TokensPage,
  'layout-designer': LayoutDesignerPage,
  'theme-editor':  ThemeEditorPage,
  'asset-manager': AssetManagerPage,
  export:          ExportPage,
  review:          ReviewPage,
}

interface TabRouterProps {
  /** The page.tsx dashboard content — rendered when activeTabId is 'dashboard' or unrecognised */
  children: React.ReactNode
}

export default function TabRouter({ children }: TabRouterProps) {
  const activeTabId = useSessionStore((s) => s.activeTabId)

  // 'dashboard' or unknown tab → render the Next.js page children as-is
  if (!activeTabId || activeTabId === 'dashboard') {
    return <>{children}</>
  }

  const TabComponent = TAB_MAP[activeTabId]

  if (!TabComponent) {
    // Unrecognised tab — fall back to dashboard
    return <>{children}</>
  }

  return (
    <Suspense fallback={<TabFallback />}>
      <TabComponent />
    </Suspense>
  )
}
