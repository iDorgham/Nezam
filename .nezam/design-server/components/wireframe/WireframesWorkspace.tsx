'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { useRouter } from 'next/navigation'

export default function WireframesWorkspace() {
  const { sitemap, lang, openTab } = useSessionStore()
  const router = useRouter()

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div className="p-6 w-full space-y-6 text-ds-text-primary">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t('Wireframes Builder', 'باني هياكل العمل')}</h1>
        <p className="text-[#8a8f98] text-sm">{t('Select a page to start wireframing.', 'اختر صفحة لبدء بناء هيكل العمل.')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sitemap.map((page) => (
          <div
            key={page.id}
            onClick={() => router.push(`/pages/${page.id}`)}
            className="p-4 bg-ds-surface border border-ds-border rounded-xl hover:border-[#FF5701] transition-colors cursor-pointer"
          >
            <div className="font-medium text-ds-text-primary mb-1">{page.title}</div>
            <div className="text-xs text-[#8a8f98]">{page.type || 'Page'}</div>
          </div>
        ))}

        {sitemap.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-ds-surface border border-ds-border rounded-xl">
            <div className="text-[#8a8f98] mb-4">{t('No pages found in sitemap.', 'لم يتم العثور على صفحات في خريطة الموقع.')}</div>
            <button
              onClick={() => openTab({ id: 'sitemap', title: t('Sitemap', 'خريطة الموقع'), type: 'sitemap' })}
              className="px-4 py-2 bg-[#FF5701] text-white rounded-lg text-sm font-medium hover:bg-[#e04e00] transition-colors"
            >
              {t('Go to Sitemap', 'انتقل إلى خريطة الموقع')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
