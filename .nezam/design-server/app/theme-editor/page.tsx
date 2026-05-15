'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'

export default function ThemeEditorPage() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className="h-full flex flex-col bg-ds-surface text-ds-text-primary p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('Theme Editor', 'محرر الألوان')}</h1>
      </div>

      <div className="flex-1 bg-black/20 rounded-lg border border-ds-border p-6">
        <div className="text-ds-text-muted">
          {t('Theme settings and color palettes will be configured here.', 'إعدادات الألوان والقوالب سيتم تكوينها هنا.')}
        </div>
      </div>
    </div>
  )
}
