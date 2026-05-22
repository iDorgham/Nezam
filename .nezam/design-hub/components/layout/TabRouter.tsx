'use client'

import React, { lazy, Suspense } from 'react'
import { useSessionStore } from '@/lib/store/session.store'

// All routes resolve to the All-in-One Builder
const TemplateBuilderPage = lazy(() => import('@/app/template-builder/page'))

function TabFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px] bg-[#0f0f10]">
      <div className="text-[#48484a] text-xs animate-pulse">Loading builder…</div>
    </div>
  )
}

interface TabRouterProps {
  children: React.ReactNode
}

export default function TabRouter({ children }: TabRouterProps) {
  const activeTabId = useSessionStore((s) => s.activeTabId)

  // Everything routes to the builder
  return (
    <Suspense fallback={<TabFallback />}>
      <TemplateBuilderPage />
    </Suspense>
  )
}
