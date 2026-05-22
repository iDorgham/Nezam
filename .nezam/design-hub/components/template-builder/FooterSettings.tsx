'use client'

import React from 'react'
import { Share2, Phone, LayoutGrid, Compass } from 'lucide-react'
import type { TemplateConfig } from '@/lib/store/session.store'

interface FooterSettingsProps {
  config: TemplateConfig
  onChange: (updates: Partial<TemplateConfig>) => void
  lang: string
}

export default function FooterSettings({
  config,
  onChange,
  lang,
}: FooterSettingsProps) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const styles = [
    {
      value: 'simple',
      labelEn: 'Simple Footer',
      labelAr: 'فوتر بسيط',
      descEn: 'Minimal single-row with copy-rights and compact links',
      descAr: 'صف واحد صغير ومباشر لحفظ الحقوق وبعض الروابط البسيطة',
    },
    {
      value: 'big',
      labelEn: 'Big Footer',
      labelAr: 'فوتر كبير',
      descEn: 'Robust navigation layout with organized multiple columns',
      descAr: 'تخطيط قوي ومنظم يحتوي على عدة أعمدة للروابط الكثيرة',
    }
  ]

  const columnOptions = [
    { value: 3, labelEn: '3 Columns', labelAr: '٣ أعمدة' },
    { value: 4, labelEn: '4 Columns', labelAr: '٤ أعمدة' },
    { value: 5, labelEn: '5 Columns', labelAr: '٥ أعمدة' }
  ]

  return (
    <div className="space-y-4">
      {/* 1. Footer Layout Style */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">
          {t('Footer Layout Style', 'شكل الفوتر')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => {
            const isSelected = config.footerStyle === style.value
            return (
              <button
                key={style.value}
                onClick={() => onChange({ footerStyle: style.value })}
                className={`flex flex-col items-start p-3 text-start rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-ds-primary bg-ds-primary-subtle text-ds-text-primary'
                    : 'border-ds-border bg-ds-surface hover:border-ds-border-strong text-ds-text-muted'
                }`}
              >
                <span className={`font-semibold ${isSelected ? 'text-ds-primary' : 'text-ds-text-primary'}`}>
                  {t(style.labelEn, style.labelAr)}
                </span>
                <span className="mt-1 text-[10px] text-ds-text-muted leading-tight">
                  {t(style.descEn, style.descAr)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Column Configurations (shown if "big") */}
      {config.footerStyle === 'big' && (
        <div className="space-y-2 border-t border-ds-border/60 pt-3">
          <div className="flex items-center gap-2 mb-1.5">
            <LayoutGrid size={13} className="text-ds-primary" />
            <span className="text-[11px] font-semibold text-ds-text-muted uppercase">
              {t('Structure Columns', 'عدد أعمدة الروابط')}
            </span>
          </div>
          <div className="flex border border-ds-border rounded-lg p-0.5 bg-ds-surface-subtle">
            {columnOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ footerColumns: opt.value as 3 | 4 | 5 })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                  config.footerColumns === opt.value
                    ? 'bg-ds-surface border border-ds-border text-ds-primary font-semibold'
                    : 'text-ds-text-muted hover:text-ds-text-primary'
                }`}
              >
                {t(opt.labelEn, opt.labelAr)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Footer Widgets */}
      <div className="space-y-2 border-t border-ds-border/60 pt-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">
          {t('Footer Widgets', 'أدوات الفوتر')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              key: 'footerShowSocials',
              labelEn: 'Show Social Media',
              labelAr: 'روابط السوشيال ميديا',
              icon: <Share2 size={14} />,
              descEn: 'Icons for social profiles',
              descAr: 'أيقونات للتواصل الاجتماعي'
            },
            {
              key: 'footerShowPhone',
              labelEn: 'Show Phone Contact',
              labelAr: 'رقم تواصل مباشر',
              icon: <Phone size={14} />,
              descEn: 'Direct support line',
              descAr: 'خط دعم فني مباشر'
            }
          ].map((widget) => {
            const isActive = (config as any)[widget.key]
            return (
              <button
                key={widget.key}
                onClick={() => onChange({ [widget.key]: !isActive })}
                className={`flex items-start gap-3 p-3 text-start rounded-xl border text-xs transition-all ${
                  isActive
                    ? 'border-ds-primary bg-ds-primary-subtle text-ds-text-primary'
                    : 'border-ds-border bg-ds-surface hover:border-ds-border-strong text-ds-text-muted'
                }`}
              >
                <div className={`mt-0.5 rounded-lg p-1.5 ${isActive ? 'bg-ds-primary/20 text-ds-primary' : 'bg-ds-surface-hover text-ds-text-muted'}`}>
                  {widget.icon}
                </div>
                <div>
                  <div className={`font-semibold ${isActive ? 'text-ds-primary' : 'text-ds-text-primary'}`}>
                    {t(widget.labelEn, widget.labelAr)}
                  </div>
                  <div className="mt-0.5 text-[9px] text-ds-text-muted leading-tight">
                    {t(widget.descEn, widget.descAr)}
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
