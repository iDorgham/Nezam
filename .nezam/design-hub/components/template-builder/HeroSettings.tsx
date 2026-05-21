'use client'

import React from 'react'
import { Layout, Monitor, Film } from 'lucide-react'
import type { TemplateConfig } from '@/lib/store/session.store'

interface HeroSettingsProps {
  config: TemplateConfig
  onChange: (updates: Partial<TemplateConfig>) => void
  lang: string
}

export default function HeroSettings({
  config,
  onChange,
  lang,
}: HeroSettingsProps) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const styles = [
    {
      value: 'centered',
      labelEn: 'Centered Title',
      labelAr: 'عنوان متمركز',
      descEn: 'Symmetrical layout with centered typography and CTA',
      descAr: 'تنسيق متناسق يركز على المحتوى في المنتصف مع زر الاتصال',
      icon: <Layout size={16} />
    },
    {
      value: 'split',
      labelEn: 'Split Screen',
      labelAr: 'شاشة مقسومة',
      descEn: 'Left/Right divided layout for text and side visual assets',
      descAr: 'تخطيط مقسم يعرض النصوص على جانب والصور أو العناصر على جانب آخر',
      icon: <Monitor size={16} />
    },
    {
      value: 'video',
      labelEn: 'Video Loop BG',
      labelAr: 'خلفية فيديو متحركة',
      descEn: 'Cinematic layout with a subtle auto-playing background loop',
      descAr: 'تأثير سينمائي رائع يعرض فيديو هادئ ومستمر في الخلفية',
      icon: <Film size={16} />
    }
  ]

  return (
    <div className="space-y-4">
      {/* 1. Hero Layout Style */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">
          {t('Hero Presentation Style', 'أسلوب عرض الهيرو')}
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {styles.map((style) => {
            const isSelected = config.heroStyle === style.value
            return (
              <button
                key={style.value}
                onClick={() => onChange({ heroStyle: style.value as 'centered' | 'split' | 'video' })}
                className={`flex items-start gap-3.5 p-3.5 text-start rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-ds-primary bg-ds-primary-subtle text-ds-text-primary'
                    : 'border-ds-border bg-ds-surface hover:border-ds-border-strong text-ds-text-muted'
                }`}
              >
                <div className={`mt-0.5 rounded-lg p-2 ${isSelected ? 'bg-ds-primary/20 text-ds-primary' : 'bg-ds-surface-hover text-ds-text-muted'}`}>
                  {style.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-bold ${isSelected ? 'text-ds-primary' : 'text-ds-text-primary'}`}>
                    {t(style.labelEn, style.labelAr)}
                  </div>
                  <div className="mt-0.5 text-[10px] text-ds-text-muted leading-relaxed">
                    {t(style.descEn, style.descAr)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
