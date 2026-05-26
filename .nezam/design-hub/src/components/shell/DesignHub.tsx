'use client'

import { useEffect } from 'react'
import { useHub } from '@/store/hub.store'
import { TopBar } from './TopBar'
import { Onboarding } from './Onboarding'

// Lazy-import sections to keep initial bundle small
import dynamic from 'next/dynamic'

const ArchSection    = dynamic(() => import('@/components/arch/ArchSection').then(m => ({ default: m.ArchSection })), { ssr: false })
const DesignSection  = dynamic(() => import('@/components/design/DesignSection').then(m => ({ default: m.DesignSection })), { ssr: false })
const PreviewSection = dynamic(() => import('@/components/preview/PreviewSection').then(m => ({ default: m.PreviewSection })), { ssr: false })

export function DesignHub() {
  const section = useHub((s) => s.section)

  // Rehydrate persisted state on mount
  useEffect(() => {
    useHub.persist.rehydrate()
  }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-app-bg">
      {/* Onboarding overlay — shown on first visit */}
      <Onboarding />

      <TopBar />
      <div className="flex min-h-0 flex-1">
        {section === 'architecture' && <ArchSection />}
        {section === 'design'       && <DesignSection />}
        {section === 'preview'      && <PreviewSection />}
      </div>
    </div>
  )
}
