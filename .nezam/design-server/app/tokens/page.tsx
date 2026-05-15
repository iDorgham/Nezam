'use client'

import React from 'react'
import TokenStudio from '@/components/tokens/TokenStudio'
import { useSessionStore } from '@/lib/store/session.store'

export default function TokensPage() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 text-ds-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{t('Design Token Studio', 'استوديو رموز التصميم')}</h1>
          <p className="text-sm text-[#8a8f98]">{t('Fine-tune your design system tokens with real-time feedback.', 'قم بضبط رموز نظام التصميم الخاص بك مع تعليقات في الوقت الفعلي.')}</p>
        </div>
      </div>
      
      <TokenStudio />
    </div>
  )
}
