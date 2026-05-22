'use client'

import React from 'react'
import { useTokensStore, DesignTokens } from '@/lib/store/tokens.store'
import { useSessionStore } from '@/lib/store/session.store'
import { Palette, RefreshCw } from 'lucide-react'
import ColorTokenRow from './ColorTokenRow'

export default function ColorStudio() {
  const { tokens, updateColor } = useTokensStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const handleReset = () => {
    // Default brand tokens or current system defaults
    const defaults: Record<keyof DesignTokens['colors'], string> = {
      primary: '#FF5701',
      primaryHover: '#e04e00',
      secondary: '#8a8f98',
      accent: '#FF5701',
      interactive: '#FF5701',
      destructive: '#dc2626',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      background: '#090A0F',
      surface: '#0F111A',
      surfaceElevated: '#191a1b',
      overlay: 'rgba(0,0,0,0.5)',
      textPrimary: '#F7F8F8',
      textSecondary: '#d1d5db',
      textMuted: '#8A8F98',
      textDisabled: '#6b7280',
      textInverse: '#08090a',
      border: 'rgba(255, 255, 255, 0.08)',
      borderStrong: 'rgba(255, 255, 255, 0.15)',
      borderFocus: '#FF5701'
    }

    Object.entries(defaults).forEach(([key, val]) => {
      updateColor(key as keyof DesignTokens['colors'], val)
    })
  }

  return (
    <div className="bg-ds-surface border border-ds-border rounded-lg p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-ds-border pb-3">
        <h2 className="text-lg font-medium text-ds-text-primary flex items-center gap-2">
          <Palette className="w-5 h-5 text-ds-primary" />
          {t('Color Customization Studio', 'استوديو تخصيص الألوان')}
        </h2>
        <button
          onClick={handleReset}
          className="text-xs text-ds-text-muted hover:text-ds-primary flex items-center gap-1.5 transition-colors"
          title={t('Reset to Defaults', 'إعادة تعيين إلى الافتراضي')}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('Reset', 'إعادة ضبط')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Colors Group */}
        <div className="space-y-3 bg-ds-background/20 border border-ds-border/50 rounded-xl p-4">
          <span className="text-xs font-semibold text-ds-primary uppercase tracking-wider block border-b border-ds-border/40 pb-2">
            {t('Brand Colors', 'ألوان الهوية التجارية')}
          </span>
          <div className="space-y-1">
            <ColorTokenRow 
              label={t('Primary', 'أساسي')} 
              value={tokens.colors.primary} 
              onChange={(c) => updateColor('primary', c)} 
            />
            <ColorTokenRow 
              label={t('Primary Hover', 'مرور مؤشر الأساسي')} 
              value={tokens.colors.primaryHover} 
              onChange={(c) => updateColor('primaryHover', c)} 
            />
            <ColorTokenRow 
              label={t('Secondary', 'ثانوي')} 
              value={tokens.colors.secondary} 
              onChange={(c) => updateColor('secondary', c)} 
            />
            <ColorTokenRow 
              label={t('Accent', 'مميز')} 
              value={tokens.colors.accent} 
              onChange={(c) => updateColor('accent', c)} 
            />
          </div>
        </div>

        {/* Semantic Colors Group */}
        <div className="space-y-3 bg-ds-background/20 border border-ds-border/50 rounded-xl p-4">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block border-b border-ds-border/40 pb-2">
            {t('Semantic Status', 'الحالة والدلالات')}
          </span>
          <div className="space-y-1">
            <ColorTokenRow 
              label={t('Interactive', 'تفاعلي')} 
              value={tokens.colors.interactive} 
              onChange={(c) => updateColor('interactive', c)} 
            />
            <ColorTokenRow 
              label={t('Destructive', 'تدميري / حذف')} 
              value={tokens.colors.destructive} 
              onChange={(c) => updateColor('destructive', c)} 
            />
            <ColorTokenRow 
              label={t('Success', 'ناجح')} 
              value={tokens.colors.success} 
              onChange={(c) => updateColor('success', c)} 
            />
            <ColorTokenRow 
              label={t('Warning', 'تحذير')} 
              value={tokens.colors.warning} 
              onChange={(c) => updateColor('warning', c)} 
            />
            <ColorTokenRow 
              label={t('Info', 'معلومات')} 
              value={tokens.colors.info} 
              onChange={(c) => updateColor('info', c)} 
            />
          </div>
        </div>

        {/* Surface Colors Group */}
        <div className="space-y-3 bg-ds-background/20 border border-ds-border/50 rounded-xl p-4">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block border-b border-ds-border/40 pb-2">
            {t('Surfaces & Backgrounds', 'الأسطح والخلفيات')}
          </span>
          <div className="space-y-1">
            <ColorTokenRow 
              label={t('Background', 'الخلفية الكلية')} 
              value={tokens.colors.background} 
              onChange={(c) => updateColor('background', c)} 
            />
            <ColorTokenRow 
              label={t('Surface Card', 'سطح الكروت')} 
              value={tokens.colors.surface} 
              onChange={(c) => updateColor('surface', c)} 
            />
            <ColorTokenRow 
              label={t('Surface Elevated', 'سطح مرتفع')} 
              value={tokens.colors.surfaceElevated} 
              onChange={(c) => updateColor('surfaceElevated', c)} 
            />
            <ColorTokenRow 
              label={t('Overlay Mask', 'قناع التغطية')} 
              value={tokens.colors.overlay} 
              onChange={(c) => updateColor('overlay', c)} 
            />
          </div>
        </div>

        {/* Typography & Borders Group */}
        <div className="space-y-3 bg-ds-background/20 border border-ds-border/50 rounded-xl p-4">
          <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider block border-b border-ds-border/40 pb-2">
            {t('Typography & Borders', 'الخطوط والحدود')}
          </span>
          <div className="space-y-1">
            <ColorTokenRow 
              label={t('Text Primary', 'النص الأساسي')} 
              value={tokens.colors.textPrimary} 
              onChange={(c) => updateColor('textPrimary', c)} 
            />
            <ColorTokenRow 
              label={t('Text Muted', 'النص الباهت')} 
              value={tokens.colors.textMuted} 
              onChange={(c) => updateColor('textMuted', c)} 
            />
            <ColorTokenRow 
              label={t('Border default', 'الحد الافتراضي')} 
              value={tokens.colors.border} 
              onChange={(c) => updateColor('border', c)} 
            />
            <ColorTokenRow 
              label={t('Border Strong', 'الحد القوي')} 
              value={tokens.colors.borderStrong} 
              onChange={(c) => updateColor('borderStrong', c)} 
            />
            <ColorTokenRow 
              label={t('Border Focus', 'حد التركيز')} 
              value={tokens.colors.borderFocus} 
              onChange={(c) => updateColor('borderFocus', c)} 
            />
          </div>
        </div>
      </div>

      {/* Real-time Color Testing Strip */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-semibold text-ds-text-muted uppercase tracking-wider block">
          {t('Visual Palette Preview', 'معاينة الباليتة البصرية')}
        </span>
        <div className="grid grid-cols-5 gap-2 h-10 rounded-lg overflow-hidden border border-ds-border shadow-sm">
          <div className="flex items-center justify-center text-[10px] text-white font-semibold transition-all" style={{ backgroundColor: tokens.colors.primary }}>
            {t('Primary', 'أساسي')}
          </div>
          <div className="flex items-center justify-center text-[10px] text-white font-semibold transition-all" style={{ backgroundColor: tokens.colors.secondary }}>
            {t('Secondary', 'ثانوي')}
          </div>
          <div className="flex items-center justify-center text-[10px] text-white font-semibold transition-all" style={{ backgroundColor: tokens.colors.background }}>
            {t('Bg', 'خلفية')}
          </div>
          <div className="flex items-center justify-center text-[10px] text-white font-semibold transition-all" style={{ backgroundColor: tokens.colors.surface }}>
            {t('Surface', 'سطح')}
          </div>
          <div className="flex items-center justify-center text-[10px] text-white font-semibold transition-all" style={{ backgroundColor: tokens.colors.accent }}>
            {t('Accent', 'مميز')}
          </div>
        </div>
      </div>
    </div>
  )
}
