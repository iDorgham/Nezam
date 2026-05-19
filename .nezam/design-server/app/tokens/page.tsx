'use client'

import React, { useState } from 'react'
import TokenStudio from '@/components/tokens/TokenStudio'
import ProfileSelector from '@/components/tokens/ProfileSelector'
import SavePresetModal from '@/components/tokens/SavePresetModal'
import SyncStatusPill from '@/components/tokens/SyncStatusPill'
import BorderRadiusEditor from '@/components/tokens/BorderRadiusEditor'
import TypographyScaleGrid from '@/components/tokens/TypographyScaleGrid'
import { useSessionStore } from '@/lib/store/session.store'
import type { DesignPreset } from '@/src/types/tokens.types'

export default function TokensPage() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const [modalOpen, setModalOpen] = useState(false)

  const handleSaveNew    = ()                  => setModalOpen(true)
  const handleEditPreset = (_p: DesignPreset)  => setModalOpen(true)
  const handleSaved      = (_p: DesignPreset)  => { /* ProfileSelector re-fetches on next open */ }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-ds-text-primary">
      {/* Page header */}
      <div className="flex items-start justify-between gap-x-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('Design Token Studio', 'استوديو رموز التصميم')}</h1>
          <p className="text-sm text-ds-text-muted mt-1">
            {t(
              'Fine-tune your design system tokens with real-time feedback.',
              'قم بضبط رموز نظام التصميم الخاص بك مع تعليقات في الوقت الفعلي.',
            )}
          </p>
        </div>
        <SyncStatusPill />
      </div>

      {/* Two-panel layout: preset sidebar + token editor */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Preset sidebar — sticky so it stays visible while scrolling the editor */}
        <aside className="lg:sticky lg:top-6">
          <div className="bg-ds-surface border border-ds-border rounded-ds-lg p-4">
            <ProfileSelector
              onSaveNew={handleSaveNew}
              onEditPreset={handleEditPreset}
            />
          </div>
        </aside>

        {/* Token editor */}
        <div className="min-w-0 space-y-6">
          <BorderRadiusEditor />
          <TypographyScaleGrid />
          <TokenStudio />
        </div>
      </div>

      {/* Save preset modal — mounts when open, unmounts when closed */}
      <SavePresetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
