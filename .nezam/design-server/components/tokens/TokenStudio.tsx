'use client'

import React, { useEffect, useState } from 'react'
import { useTokensStore } from '@/lib/store/tokens.store'
import { injectTokens } from '@/lib/token-injector'
import ColorTokenRow from './ColorTokenRow'
import ScaleRatioSelector from './ScaleRatioSelector'
import LivePreviewCard from './LivePreviewCard'
import RadiusStudio from './RadiusStudio'
import { useSessionStore } from '@/lib/store/session.store'
import { Save, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'

export default function TokenStudio() {
  const { tokens, updateColor, updateTypography } = useTokensStore()
  const { lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  // Save profile state
  const [profileName, setProfileName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Inject tokens on change
  useEffect(() => {
    injectTokens(tokens)
  }, [tokens])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileName.trim()) return

    const sanitizedName = profileName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage('')

    try {
      const res = await fetch(`/api/profiles/${sanitizedName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to save')
      }

      setSaveStatus('success')
      setProfileName('')
      
      // Refresh the profiles sidebar in the session store
      const sessionStore = useSessionStore.getState()
      await sessionStore.fetchProfiles()
      
      // Clear success notification after 4 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 4000)
    } catch (err: any) {
      setSaveStatus('error')
      setErrorMessage(err.message || 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Colors Section */}
        <div className="bg-ds-surface border border-ds-border rounded-lg p-4">
          <h2 className="text-lg font-medium text-ds-text-primary mb-4">{t('Colors', 'الألوان')}</h2>
          <div className="space-y-1">
            <ColorTokenRow 
              label={t('Primary', 'أساسي')} 
              value={tokens.colors.primary} 
              onChange={(c) => updateColor('primary', c)} 
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
            <ColorTokenRow 
              label={t('Background', 'الخلفية')} 
              value={tokens.colors.background} 
              onChange={(c) => updateColor('background', c)} 
            />
            <ColorTokenRow 
              label={t('Surface', 'السطح')} 
              value={tokens.colors.surface} 
              onChange={(c) => updateColor('surface', c)} 
            />
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
              label={t('Border', 'الحدود')} 
              value={tokens.colors.border} 
              onChange={(c) => updateColor('border', c)} 
            />
          </div>
        </div>

        {/* Typography Section */}
        <div className="bg-ds-surface border border-ds-border rounded-lg p-4">
          <h2 className="text-lg font-medium text-ds-text-primary mb-4">{t('Typography', 'الطباعة')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-ds-text-muted uppercase block mb-1">{t('Base Size (px)', 'الحجم الأساسي (بكسل)')}</label>
              <input
                type="number"
                value={tokens.typography.baseSize}
                onChange={(e) => updateTypography('baseSize', parseInt(e.target.value))}
                className="w-full bg-ds-surface-subtle border border-ds-border rounded px-3 py-2 text-ds-text-primary focus:border-ds-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-ds-text-muted uppercase block mb-1">{t('Scale Ratio', 'نسبة القياس')}</label>
              <input
                type="number"
                step="0.05"
                value={tokens.typography.scale}
                onChange={(e) => updateTypography('scale', parseFloat(e.target.value))}
                className="w-full bg-ds-surface-subtle border border-ds-border rounded px-3 py-2 text-ds-text-primary focus:border-ds-primary/50 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <ScaleRatioSelector baseSize={tokens.typography.baseSize} scale={tokens.typography.scale} />
          </div>
        </div>

        {/* Proportional fluid scaling Border Radius Studio */}
        <RadiusStudio />

        {/* Save Current Design Profile Vault */}
        <div className="bg-ds-surface border border-ds-border rounded-lg p-5 relative overflow-hidden shadow-md">
          {/* Subtle desert-warm terracotta and sahara gold Cairo style gradients */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#D05A3F]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2.5 border-b border-ds-border pb-3 mb-4">
            <Save className="w-5 h-5 text-ds-primary" />
            <div>
              <h2 className="text-sm font-semibold text-ds-text-primary">
                {t('Save Custom Design System', 'حفظ استايل التصميم الجديد')}
              </h2>
              <p className="text-xs text-ds-text-muted mt-0.5">
                {t('Persist your current color palette, typography scales, and border radius rules directly to the workspace design vault.', 'احفظ كل الألوان والخطوط والزوايا اللي عدلتها في ملفات المشروع مباشرة.')}
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-ds-text-muted uppercase tracking-wider block">
                  {t('Profile Name', 'اسم الاستايل')}
                </label>
                <input
                  type="text"
                  placeholder={t('e.g., Cairo Terracotta, Sahel Glass', 'مثلاً: terracotta-cairo أو sahel-glass')}
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-ds-surface-subtle border border-ds-border rounded-lg px-3 py-2 text-ds-text-primary text-sm focus:border-ds-primary/50 focus:outline-none transition-all placeholder:text-ds-text-disabled"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving || !profileName.trim()}
                className="w-full md:w-auto h-10 px-5 rounded-lg font-medium text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer select-none bg-ds-primary hover:bg-ds-primary/95 hover:shadow-[0_0_15px_rgba(208,90,63,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('Saving...', 'بنحفظ...')}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t('Save Profile', 'حفظ الاستايل')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Slug Preview */}
            {profileName.trim() && (
              <div className="text-[10px] text-ds-text-muted flex items-center gap-1 font-mono">
                <span className="text-[#D4AF37]/80">{t('Slug Preview:', 'الاسم في الرابط:')}</span>
                <span className="bg-ds-surface-subtle px-1.5 py-0.5 rounded border border-ds-border text-ds-text-primary">
                  {profileName.toLowerCase().replace(/[^a-z0-9-_]/g, '-')}
                </span>
                <span className="text-2xs text-ds-text-disabled">.md</span>
              </div>
            )}

            {/* Elegant Feedback Notifications */}
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 text-xs transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">{t('Success!', 'تم الحفظ!')}</span>{' '}
                  {t('The design system profile has been successfully saved to disk.', 'تم حفظ بروفايل التصميم بنجاح وتحديث القائمة.')}
                </div>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-xs transition-all duration-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold">{t('Error!', 'مشكلة في الحفظ!')}</span>{' '}
                  {errorMessage}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-ds-text-primary mb-4">{t('Real-Time Preview', 'معاينة في الوقت الحقيقي')}</h2>
        <LivePreviewCard />
        
        <div className="text-xs text-ds-text-muted bg-ds-surface border border-ds-border rounded p-4">
          {t('Changing tokens updates CSS custom properties on `:root` instantly without React re-renders.', 'يؤدي تغيير الرموز إلى تحديث خصائص CSS المخصصة على `:root` فورًا دون إعادة عرض React.')}
        </div>
      </div>
    </div>
  )
}


