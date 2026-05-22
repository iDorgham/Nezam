'use client'
import React from 'react'
import WireframeEditor from '@/components/wireframe/WireframeEditor'
import { useSessionStore } from '@/lib/store/session.store'

export default function HeaderDesignerPage() {
  const lang = useSessionStore((state) => state.lang)
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-ds-text-primary mb-4">
        {t('Header Designer', 'مصمم الترويسة (Header)')}
      </h1>
      <WireframeEditor pageId="__header__" />
    </div>
  )
}
