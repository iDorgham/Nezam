'use client'

import React from 'react'
import WireframeEditor from '@/components/wireframe/WireframeEditor'
import { useSessionStore } from '@/lib/store/session.store'

export default function FooterDesignerPage() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ds-text-primary mb-4">{t('Footer Designer', 'مصمم التذييل')}</h1>
      <WireframeEditor pageId="__footer__" />
    </div>
  )
}
