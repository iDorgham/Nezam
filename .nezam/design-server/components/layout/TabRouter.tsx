'use client'

import React, { lazy, Suspense } from 'react'
import { useSessionStore } from '@/lib/store/session.store'

// Lazy-load each workspace — only bundled when first opened
const SitemapPage           = lazy(() => import('@/components/canvas/CanvasWorkspace'))
const TemplateBuilderPage    = lazy(() => import('@/app/template-builder/page'))
const SectionsBuilderWorkspace = lazy(() => import('@/components/sections/SectionsBuilderWorkspace'))
const PageBuilderWorkspace   = lazy(() => import('@/components/page-builder/PageBuilderWorkspace'))

function TabFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="text-ds-text-muted text-xs animate-pulse">Loading…</div>
    </div>
  )
}

const TAB_MAP: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  sitemap:        SitemapPage,
  template:       TemplateBuilderPage,
  sections:       SectionsBuilderWorkspace,
  'page-builder': PageBuilderWorkspace,
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
