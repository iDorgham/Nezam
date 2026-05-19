'use client'

import React from 'react'
import { Sparkles, Share2, Phone, Compass, Sidebar, Layout, Menu } from 'lucide-react'
import type { TemplateConfig } from '@/lib/store/session.store'

interface HeaderSettingsProps {
  config: TemplateConfig
  onChange: (updates: Partial<TemplateConfig>) => void
  lang: string
}

export default function HeaderSettings({
  config,
  onChange,
  lang,
}: HeaderSettingsProps) {
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const menuModes = [
    {
      value: 'topbar',
      labelEn: 'Top Bar',
      labelAr: 'شريط علوي',
      descEn: 'Classic horizontal header navigation',
      descAr: 'شريط تنقل أفقي علوي كلاسيكي',
      icon: <Layout size={16} />
    },
    {
      value: 'sidebar',
      labelEn: 'Side Panel',
      labelAr: 'شريط جانبي',
      descEn: 'Collapsible left/right sidebar navigation',
      descAr: 'قائمة تنقل رأسية جانبية قابلة للطي',
      icon: <Sidebar size={16} />
    }
  ]

  const styles = [
    {
      value: 'simple',
      labelEn: 'Simple Bar',
      labelAr: 'بار بسيط',
      descEn: 'Clean layout with logo and navigation links',
      descAr: 'تخطيط نظيف يركز على الشعار والروابط',
    },
    {
      value: 'mega',
      labelEn: 'Mega Menu',
      labelAr: 'قائمة ضخمة',
      descEn: 'Wide, feature-rich dropdown navigation panel',
      descAr: 'لوحة منسدلة عريضة تحتوي على أقسام ومجموعات',
    }
  ]

  const positionOptions = [
    { value: 'left', labelEn: 'Left', labelAr: 'يسار' },
    { value: 'center', labelEn: 'Center', labelAr: 'منتصف' },
    { value: 'right', labelEn: 'Right', labelAr: 'يمين' },
  ]

  return (
    <div className="space-y-4">
      {/* 1. Header Layout Style */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">
          {t('Header Navigation Style', 'شكل المنيو العلوي')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => {
            const isSelected = config.headerStyle === style.value
            return (
              <button
                key={style.value}
                onClick={() => onChange({ headerStyle: style.value })}
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

      {/* 2. Main Menu Mode */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">
          {t('Menu Layout Orientation', 'اتجاه القائمة الأساسية')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {menuModes.map((mode) => {
            const isSelected = config.headerMenuMode === mode.value
            return (
              <button
                key={mode.value}
                onClick={() => onChange({ headerMenuMode: mode.value as 'topbar' | 'sidebar' })}
                className={`flex items-start gap-3 p-3 text-start rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-ds-primary bg-ds-primary-subtle text-ds-text-primary'
                    : 'border-ds-border bg-ds-surface hover:border-ds-border-strong text-ds-text-muted'
                }`}
              >
                <div className={`rounded-lg p-1.5 ${isSelected ? 'bg-ds-primary/20 text-ds-primary' : 'bg-ds-surface-hover text-ds-text-muted'}`}>
                  {mode.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold ${isSelected ? 'text-ds-primary' : 'text-ds-text-primary'}`}>
                    {t(mode.labelEn, mode.labelAr)}
                  </div>
                  <div className="mt-0.5 text-[10px] text-ds-text-muted leading-tight">
                    {t(mode.descEn, mode.descAr)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Logo and Menu Alignment */}
      {config.headerMenuMode === 'topbar' && (
        <div className="grid grid-cols-2 gap-3 border-t border-ds-border/60 pt-3">
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-ds-text-muted uppercase">
              {t('Logo Align', 'محاذاة الشعار')}
            </span>
            <div className="flex border border-ds-border rounded-lg p-0.5 bg-ds-surface-subtle">
              {positionOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ headerLogoPosition: opt.value as 'left' | 'center' | 'right' })}
                  className={`flex-1 py-1 text-[10px] font-medium rounded transition-colors ${
                    config.headerLogoPosition === opt.value
                      ? 'bg-ds-surface border border-ds-border text-ds-primary font-semibold'
                      : 'text-ds-text-muted hover:text-ds-text-primary'
                  }`}
                >
                  {t(opt.labelEn, opt.labelAr)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-ds-text-muted uppercase">
              {t('Menu Align', 'محاذاة القائمة')}
            </span>
            <div className="flex border border-ds-border rounded-lg p-0.5 bg-ds-surface-subtle">
              {positionOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ headerMenuPosition: opt.value as 'left' | 'center' | 'right' })}
                  className={`flex-1 py-1 text-[10px] font-medium rounded transition-colors ${
                    config.headerMenuPosition === opt.value
                      ? 'bg-ds-surface border border-ds-border text-ds-primary font-semibold'
                      : 'text-ds-text-muted hover:text-ds-text-primary'
                  }`}
                >
                  {t(opt.labelEn, opt.labelAr)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Extras */}
      <div className="space-y-2 border-t border-ds-border/60 pt-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-ds-text-muted">
          {t('Interactive Extras', 'عناصر إضافية تفاعلية')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              key: 'headerShowCta',
              labelEn: 'CTA Button',
              labelAr: 'زر الاتصال',
              icon: <Sparkles size={14} />
            },
            {
              key: 'headerShowSocials',
              labelEn: 'Social Links',
              labelAr: 'التواصل',
              icon: <Share2 size={14} />
            },
            {
              key: 'headerShowPhone',
              labelEn: 'Contact Info',
              labelAr: 'رقم الهاتف',
              icon: <Phone size={14} />
            }
          ].map((extra) => {
            const isActive = (config as any)[extra.key]
            return (
              <button
                key={extra.key}
                onClick={() => onChange({ [extra.key]: !isActive })}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'border-ds-primary bg-ds-primary-subtle text-ds-primary'
                    : 'border-ds-border bg-ds-surface hover:border-ds-border-strong text-ds-text-muted hover:text-ds-text-primary'
                }`}
              >
                <div className={`mb-1 p-1 rounded-lg ${isActive ? 'bg-ds-primary/20' : 'bg-ds-surface-hover'}`}>
                  {extra.icon}
                </div>
                <span className="text-[10px] font-medium leading-none">
                  {t(extra.labelEn, extra.labelAr)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
