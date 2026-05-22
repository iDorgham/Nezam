'use client'

import React, { useEffect, useState } from 'react'
import { useTokensStore } from '@/lib/store/tokens.store'
import { injectTokens } from '@/lib/token-injector'
import ColorStudio from './ColorStudio'
import ScaleRatioSelector from './ScaleRatioSelector'
import LivePreviewCard from './LivePreviewCard'
import RadiusStudio from './RadiusStudio'
import { useSessionStore } from '@/lib/store/session.store'
import { 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Trash2, 
  RefreshCw, 
  Database, 
  Sparkles, 
  Globe 
} from 'lucide-react'

export default function TokenStudio() {
  const { tokens, updateColor, updateTypography } = useTokensStore()
  const { 
    profiles, 
    selectedProfile, 
    setSelectedProfile, 
    fetchProfiles, 
    fetchContext, 
    sitemap, 
    lang 
  } = useSessionStore()
  
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  // Save profile state
  const [profileName, setProfileName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Sync state
  const [syncStatus, setSyncStatus] = useState<'checking' | 'synced' | 'out-of-sync' | 'error'>('checking')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  // Init fetch
  useEffect(() => {
    fetchProfiles()
    fetchContext()
  }, [fetchProfiles, fetchContext])

  // Inject tokens on change
  useEffect(() => {
    injectTokens(tokens)
  }, [tokens])

  // Debounced check for sync status
  useEffect(() => {
    let active = true
    const checkSync = async () => {
      try {
        const res = await fetch('/api/lock/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokens }),
        })
        if (!res.ok) throw new Error('Status check failed')
        const data = await res.json()
        if (active) {
          if (data.synced) {
            setSyncStatus('synced')
            setSyncMessage(t('Active design tokens are in sync with globals.css on disk.', 'رموز التصميم النشطة متوافقة مع ملف globals.css.'))
          } else {
            setSyncStatus('out-of-sync')
            setSyncMessage(t('Active design tokens have unsaved changes not compiled to globals.css.', 'توجد تغييرات نشطة لم يتم حفظها وتجميعها في ملف globals.css.'))
          }
        }
      } catch (err) {
        if (active) {
          setSyncStatus('error')
          setSyncMessage(t('Could not verify CSS synchronization status.', 'تعذر التحقق من حالة مزامنة ملفات الـ CSS.'))
        }
      }
    }

    setSyncStatus('checking')
    const timer = setTimeout(() => {
      checkSync()
    }, 600) // 600ms debounce

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [tokens, lang])

  const handleForceSync = async () => {
    setIsSyncing(true)
    try {
      const requestSitemap = sitemap && sitemap.length > 0
        ? sitemap
        : [{ id: 'home', title: 'Home', route: '/', type: 'modal' }]

      const res = await fetch('/api/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          sitemap: requestSitemap,
          profileName: selectedProfile || 'custom',
          rtl: lang === 'ar'
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to sync design system')
      }

      setSyncStatus('synced')
      setSyncMessage(t('Design successfully compiled and pushed to globals.css!', 'تم بنجاح تجميع وحفظ استايل التصميم في globals.css!'))
    } catch (err: any) {
      alert(t(`Sync Failed: ${err.message}`, `فشل المزامنة: ${err.message}`))
    } finally {
      setIsSyncing(false)
    }
  }

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
    <div className="flex flex-col">
      {/* Premium CSS Synchronization Banner */}
      <div className="mb-6 relative overflow-hidden bg-ds-surface/80 backdrop-blur-md border border-ds-border rounded-xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Absolute decorative glow circles */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#D05A3F]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#D4AF37]/8 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-3.5 z-10">
          <div className="mt-1 flex-shrink-0">
            {syncStatus === 'synced' ? (
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
            ) : syncStatus === 'out-of-sync' ? (
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D05A3F]"></span>
              </div>
            ) : syncStatus === 'checking' ? (
              <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ds-text-muted">
                {t('CSS Engine Sync', 'حالة مزامنة الـ CSS')}
              </span>
              <span className={`text-2xs px-2 py-0.5 rounded-full font-bold uppercase ${
                syncStatus === 'synced' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                  : syncStatus === 'out-of-sync'
                  ? 'bg-[#D05A3F]/15 text-[#D05A3F] border border-[#D05A3F]/30'
                  : 'bg-ds-surface-subtle text-ds-text-disabled border border-ds-border'
              }`}>
                {syncStatus === 'synced' ? t('Synced', 'متزامن') : syncStatus === 'out-of-sync' ? t('Out of Sync', 'غير متزامن') : t('Checking', 'جاري التحقق')}
              </span>
            </div>
            <p className="text-xs text-ds-text-primary mt-1 font-medium leading-relaxed">
              {syncMessage || t('Verifying stylesheet connection...', 'جاري التحقق من اتصال ملف التنسيقات...')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 z-10 self-end sm:self-center">
          <button
            onClick={handleForceSync}
            disabled={isSyncing || syncStatus === 'checking'}
            className={`h-9 px-4 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 shadow-sm ${
              syncStatus === 'synced'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer'
                : 'bg-gradient-to-r from-[#D05A3F] to-[#D4AF37] text-white hover:shadow-[0_0_15px_rgba(208,90,63,0.4)] cursor-pointer'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t('Compiling...', 'جاري التجميع...')}</span>
              </>
            ) : (
              <>
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{t('Push to CSS', 'تحديث ملف الـ CSS')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Colors Section */}
        <ColorStudio />

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

        {/* Saved Design Profiles Vault */}
        <div className="bg-ds-surface border border-ds-border rounded-lg p-5 relative overflow-hidden shadow-md">
          {/* Subtle Sahara Gold atmospheric aura */}
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-ds-border pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h2 className="text-sm font-semibold text-ds-text-primary">
                  {t('Saved Design Profiles Vault', 'خزانة استايلات التصميم المحفوظة')}
                </h2>
                <p className="text-xs text-ds-text-muted mt-0.5">
                  {t('Quick-apply or delete saved design system configurations stored in the workspace.', 'استعرض وطبق استايلات التصميم المحفوظة في مساحة عملك أو احذفها بضغطة واحدة.')}
                </p>
              </div>
            </div>
            
            <span className="text-2xs bg-ds-surface-subtle border border-ds-border px-2 py-0.5 rounded-full text-ds-text-muted font-mono">
              {profiles.length} {t('Profiles', 'استايلات')}
            </span>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-ds-border rounded-lg bg-ds-surface-subtle/50">
              <Sparkles className="w-8 h-8 text-ds-text-disabled mx-auto mb-2.5 animate-pulse" />
              <p className="text-xs text-ds-text-muted font-medium">
                {t('No saved profiles found.', 'لا توجد استايلات تصميم محفوظة بعد.')}
              </p>
              <p className="text-2xs text-ds-text-disabled mt-1 px-4">
                {t('Save your current customizations below to see them here.', 'قم بحفظ تعديلاتك الحالية بالأسفل لتظهر هنا.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => {
                const colors = profile.colorProfile || {}
                const isSelected = selectedProfile === profile.name

                return (
                  <div
                    key={profile.name}
                    onClick={() => setSelectedProfile(profile.name)}
                    className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-[#D05A3F] bg-[#D05A3F]/5 shadow-[0_0_15px_rgba(208,90,63,0.15)]'
                        : 'border-ds-border bg-ds-surface-subtle hover:border-[#D4AF37]/50 hover:bg-ds-surface/50'
                    }`}
                  >
                    {/* Selected Active border/indicator glow */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[#D05A3F] text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider">
                        {t('Active', 'نشط')}
                      </div>
                    )}

                    <div>
                      {/* Title & Metadata */}
                      <div className="flex items-center justify-between gap-2 mb-2 pr-6">
                        <div className="font-semibold text-xs text-ds-text-primary truncate uppercase tracking-wide">
                          {profile.name.replace(/-/g, ' ')}
                        </div>
                        
                        {profile.rtl && (
                          <span className="flex-shrink-0 flex items-center gap-0.5 text-[9px] text-[#D4AF37] font-semibold bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-1 py-0.2 rounded font-mono">
                            <Globe className="w-2.5 h-2.5" />
                            RTL
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-2xs text-ds-text-muted mb-3 font-mono line-clamp-1">
                        {profile.category === 'mena' 
                          ? t('Egyptian Sahel Aesthetic', 'طراز الساحل الشمالي المصري') 
                          : profile.description || t('Custom Design Workspace Profile', 'ملف تصميم مخصص لمساحة العمل')}
                      </p>

                      {/* Premium Multi-Fidelity Visual Preview */}
                      <div 
                        className="w-full h-28 rounded-lg overflow-hidden border mb-3.5 relative p-2.5 flex flex-col justify-between transition-all duration-300"
                        style={{ 
                          backgroundColor: colors.background || '#090A0F', 
                          borderColor: colors.border || 'rgba(255, 255, 255, 0.08)',
                          direction: profile.rtl ? 'rtl' : 'ltr'
                        }}
                      >
                        {/* Grid decorative dots */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '8px 8px' }} />
                        
                        {/* Mock Widget Header */}
                        <div className="flex items-center justify-between gap-1.5 z-10">
                          <div className="flex items-center gap-1.5">
                            {/* Dot indicator */}
                            <span 
                              className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" 
                              style={{ backgroundColor: colors.primary || '#FF5701' }}
                            />
                            {/* Title */}
                            <span 
                              className="font-semibold tracking-wide truncate"
                              style={{ 
                                fontSize: Math.max(9, Math.min(13, (profile.typography?.baseSize || 16) * 0.75)) + 'px',
                                color: colors.text || colors.text_primary || '#F7F8F8'
                              }}
                            >
                              {profile.rtl ? 'إحصائيات النظام' : 'System Health'}
                            </span>
                          </div>
                          
                          {/* Mini Badge */}
                          <span 
                            className="px-1.5 py-0.5 rounded font-mono font-bold leading-none select-none text-[8px]"
                            style={{ 
                              backgroundColor: (colors.primary || '#FF5701') + '15',
                              color: colors.primary || '#FF5701',
                              borderColor: (colors.primary || '#FF5701') + '25',
                              borderWidth: '1px',
                              borderRadius: profile.borders?.sm || '4px'
                            }}
                          >
                            {profile.rtl ? 'نشط' : 'LIVE'}
                          </span>
                        </div>

                        {/* Card Content (mock dashboard stats component) */}
                        <div 
                          className="flex-1 my-2 p-2 border flex items-center justify-between gap-2 z-10"
                          style={{
                            backgroundColor: colors.surface || '#0F111A',
                            borderColor: colors.border || 'rgba(255, 255, 255, 0.08)',
                            borderRadius: profile.borders?.md || '8px'
                          }}
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span 
                              className="font-bold leading-none tracking-tight"
                              style={{ 
                                fontSize: Math.max(12, Math.min(20, (profile.typography?.baseSize || 16) * 1.1)) + 'px',
                                color: colors.text || colors.text_primary || '#F7F8F8'
                              }}
                            >
                              {profile.rtl ? '٩٤.٢٪' : '94.2%'}
                            </span>
                            <span 
                              className="truncate text-[8px]"
                              style={{ color: colors.text_muted || colors.neutral || '#8A8F98' }}
                            >
                              {profile.rtl ? 'معدل التوافق' : 'Sync Coverage'}
                            </span>
                          </div>

                          {/* Mini visual bar chart or slider indicator */}
                          <div className="flex items-end gap-0.5 h-6 shrink-0">
                            <div className="w-1.5 h-3 opacity-40" style={{ backgroundColor: colors.primary || '#FF5701', borderRadius: profile.borders?.sm || '4px' }} />
                            <div className="w-1.5 h-4 opacity-65" style={{ backgroundColor: colors.primary || '#FF5701', borderRadius: profile.borders?.sm || '4px' }} />
                            <div className="w-1.5 h-6" style={{ backgroundColor: colors.primary || '#FF5701', borderRadius: profile.borders?.sm || '4px' }} />
                          </div>
                        </div>

                        {/* Interactive Footer element */}
                        <div className="flex justify-between items-center z-10 text-[8px] leading-none">
                          <span style={{ color: colors.text_muted || colors.neutral || '#8A8F98' }}>
                            {profile.rtl ? 'مستوى الثقة:' : 'Confidence:'}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span className="font-semibold uppercase tracking-wider" style={{ color: colors.primary || '#FF5701' }}>
                              {profile.confidence}
                            </span>
                          </div>
                        </div>
                      </div>


                      {/* Stats Indicators: Typography Scale & Border Radii */}
                      <div className="grid grid-cols-2 gap-2 text-2xs text-ds-text-muted font-mono mt-2 bg-ds-surface/40 p-2 rounded-lg border border-ds-border/40">
                        <div className="flex items-center gap-1">
                          <span className="text-ds-text-disabled uppercase">T:</span>
                          <span className="text-ds-text-primary font-bold">
                            {profile.typography?.baseSize || 16}px
                          </span>
                          <span className="text-ds-text-disabled">({profile.typography?.scale || '1.2'})</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-ds-text-disabled uppercase">R:</span>
                          <span className="text-ds-text-primary font-bold">
                            {profile.borders?.md || '8px'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer card actions (Delete button with custom confirmation click prevention) */}
                    <div className="mt-3.5 pt-2 border-t border-ds-border/40 flex justify-between items-center">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        profile.confidence === 'rich' ? 'text-emerald-400' : 'text-[#D4AF37]'
                      }`}>
                        {profile.confidence}
                      </span>
                      
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (confirm(t(
                            `Are you sure you want to permanently delete profile "${profile.name}"? This cannot be undone.`,
                            `هل أنت متأكد من حذف استايل "${profile.name}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`
                          ))) {
                            try {
                              const res = await fetch(`/api/profiles/${profile.name}`, { method: 'DELETE' })
                              if (!res.ok) {
                                const err = await res.json()
                                throw new Error(err.error || 'Failed to delete profile')
                              }
                              if (selectedProfile === profile.name) {
                                setSelectedProfile(null)
                              }
                              await fetchProfiles()
                            } catch (err: any) {
                              alert(err.message)
                            }
                          }
                        }}
                        className="p-1.5 rounded-md text-ds-text-disabled hover:text-[#D05A3F] hover:bg-[#D05A3F]/10 border border-transparent hover:border-[#D05A3F]/25 transition-all cursor-pointer"
                        title={t('Delete Profile', 'حذف الاستايل')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

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
    </div>
  )
}


