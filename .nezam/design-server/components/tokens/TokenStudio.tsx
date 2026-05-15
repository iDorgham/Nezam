'use client'

import React, { useEffect } from 'react'
import { useTokensStore } from '@/lib/store/tokens.store'
import { injectTokens } from '@/lib/token-injector'
import ColorTokenRow from './ColorTokenRow'
import ScaleRatioSelector from './ScaleRatioSelector'
import LivePreviewCard from './LivePreviewCard'
import { useSessionStore } from '@/lib/store/session.store'

export default function TokenStudio() {
  const { tokens, updateColor, updateTypography } = useTokensStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  // Inject tokens on change
  useEffect(() => {
    injectTokens(tokens)
  }, [tokens])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Colors Section */}
        <div className="bg-ds-surface border border-ds-border rounded-lg p-4">
          <h2 className="text-lg font-medium text-ds-text-primary mb-4">{t('Colors', 'الألوان')}</h2>
          <div className="space-y-1">
            <ColorTokenRow label="Primary" value={tokens.colors.primary} onChange={(c) => updateColor('primary', c)} />
            <ColorTokenRow label="Secondary" value={tokens.colors.secondary} onChange={(c) => updateColor('secondary', c)} />
            <ColorTokenRow label="Accent" value={tokens.colors.accent} onChange={(c) => updateColor('accent', c)} />
            <ColorTokenRow label="Background" value={tokens.colors.background} onChange={(c) => updateColor('background', c)} />
            <ColorTokenRow label="Surface" value={tokens.colors.surface} onChange={(c) => updateColor('surface', c)} />
            <ColorTokenRow label="Text Primary" value={tokens.colors.textPrimary} onChange={(c) => updateColor('textPrimary', c)} />
            <ColorTokenRow label="Text Muted" value={tokens.colors.textMuted} onChange={(c) => updateColor('textMuted', c)} />
            <ColorTokenRow label="Border" value={tokens.colors.border} onChange={(c) => updateColor('border', c)} />
          </div>
        </div>

        {/* Typography Section */}
        <div className="bg-ds-surface border border-ds-border rounded-lg p-4">
          <h2 className="text-lg font-medium text-ds-text-primary mb-4">{t('Typography', 'الطباعة')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8a8f98] uppercase block mb-1">{t('Base Size (px)', 'الحجم الأساسي (بكسل)')}</label>
              <input
                type="number"
                value={tokens.typography.baseSize}
                onChange={(e) => updateTypography('baseSize', parseInt(e.target.value))}
                className="w-full bg-white/[0.03] border border-ds-border rounded px-3 py-2 text-ds-text-primary focus:border-[#5e6ad2] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#8a8f98] uppercase block mb-1">{t('Scale Ratio', 'نسبة القياس')}</label>
              <input
                type="number"
                step="0.05"
                value={tokens.typography.scale}
                onChange={(e) => updateTypography('scale', parseFloat(e.target.value))}
                className="w-full bg-white/[0.03] border border-ds-border rounded px-3 py-2 text-ds-text-primary focus:border-[#5e6ad2] focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <ScaleRatioSelector baseSize={tokens.typography.baseSize} scale={tokens.typography.scale} />
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-ds-text-primary mb-4">{t('Real-Time Preview', 'معاينة في الوقت الحقيقي')}</h2>
        <LivePreviewCard />
        
        <div className="text-xs text-[#8a8f98] bg-ds-surface border border-ds-border rounded p-4">
          {t('Changing tokens updates CSS custom properties on `:root` instantly without React re-renders.', 'يؤدي تغيير الرموز إلى تحديث خصائص CSS المخصصة على `:root` فورًا دون إعادة عرض React.')}
        </div>
      </div>
    </div>
  )
}
