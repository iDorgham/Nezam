'use client'

import React from 'react'
import { useSessionStore } from '@/lib/store/session.store'

export default function LivePreviewCard() {
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <div 
      className="border rounded-lg p-6 flex flex-col gap-4 shadow-sm"
      style={{ 
        backgroundColor: 'var(--ds-background)', 
        borderColor: 'var(--ds-border)',
        color: 'var(--ds-text-primary)',
        fontFamily: 'var(--ds-font-body)'
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 
          style={{ 
            fontFamily: 'var(--ds-font-heading)', 
            fontSize: 'var(--ds-text-xl)',
            fontWeight: 'bold',
            color: 'var(--ds-text-primary)'
          }}
        >
          {t('Live Preview Component', 'معاينة المكونات')}
        </h2>
        <p style={{ fontSize: 'var(--ds-text-sm)', color: 'var(--ds-text-muted)' }}>
          {t('This card updates in real-time as you tweak tokens.', 'تتحدث هذه البطاقة في الوقت الفعلي أثناء تعديل الرموز.')}
        </p>
      </div>

      <div 
        className="p-4 rounded border"
        style={{ backgroundColor: 'var(--ds-surface)', borderColor: 'var(--ds-border)' }}
      >
        <p style={{ fontSize: 'var(--ds-text-md)' }}>
          {t('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.', 'هذا نص تجريبي باللغة العربية يستخدم في التصميم للتأكد من تناسق الخطوط والأبعاد.')}
        </p>
      </div>

      <div className="flex gap-2">
        <button 
          className="px-4 py-2 rounded font-medium text-sm transition-colors"
          style={{ 
            backgroundColor: 'var(--ds-primary)', 
            color: '#ffffff' 
          }}
        >
          {t('Primary Action', 'إجراء أساسي')}
        </button>
        <button 
          className="px-4 py-2 rounded font-medium text-sm border transition-colors"
          style={{ 
            backgroundColor: 'transparent', 
            borderColor: 'var(--ds-border)',
            color: 'var(--ds-text-primary)'
          }}
        >
          {t('Secondary', 'إجراء ثانوي')}
        </button>
      </div>
    </div>
  )
}
