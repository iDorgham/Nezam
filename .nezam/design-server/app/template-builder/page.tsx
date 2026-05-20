'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import RightPanel from './components/RightPanel'
import PreviewCanvas from './components/PreviewCanvas'
import { websiteContent, fontOptions } from './components/config'
import type { WebsiteType, RadiusScale, TopBarTheme } from './components/config'
import type { DesignSystemState } from './components/LeftPanel'
import { Badge } from './components/primitives'

const STORAGE_KEY = 'nezam.ds.template-config'

export default function TemplateBuilderPage() {
  const { templateConfig, updateTemplateConfig, profiles, fetchProfiles, lang, addLog, openAssetManager, setSelectedProfile } = useSessionStore()
  const t = useCallback((en: string, ar: string) => lang === 'ar' ? ar : en, [lang])

  const [websiteType,  setWebsiteType]  = useState<WebsiteType>('saas')
  const [showTopBar,   setShowTopBar]   = useState(true)
  const [topBarTheme,  setTopBarTheme]  = useState<TopBarTheme>('orange')
  const [topBarText,   setTopBarText]   = useState(websiteContent.saas.announcement)
  const [radius,       setRadius]       = useState<RadiusScale>('md')
  const [ds, setDs] = useState<DesignSystemState>({
    font: 'inter', colorPalette: 'orange',
    buttonStyle: 'solid', buttonWeight: 'semibold',
    inputVariant: 'outlined', inputSize: 'md',
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    const c = websiteContent[websiteType]
    setTopBarText(lang === 'ar' ? c.announcementAr : c.announcement)
  }, [websiteType, lang])

  useEffect(() => {
    fetchProfiles()
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) updateTemplateConfig(JSON.parse(raw))
    } catch { localStorage.removeItem(STORAGE_KEY) }
  }, [fetchProfiles, updateTemplateConfig])

  const handleSave = () => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templateConfig))
    setTimeout(() => {
      setSaving(false); setSaved(true)
      addLog(t('Template configuration saved.', 'تم حفظ إعدادات القالب.'))
      setTimeout(() => setSaved(false), 1500)
    }, 350)
  }

  const handleProfileClick = (name: string) => {
    updateTemplateConfig({ colorProfile: name })
    setSelectedProfile(name)
  }

  const activeFontStack = fontOptions.find(f => f.value === ds.font)?.stack ?? '"Inter", system-ui, sans-serif'

  return (
    <div className="h-full flex flex-col overflow-hidden bg-ds-background text-ds-text-primary">

      {/* ── Page header — matches other DS pages ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-ds-border bg-ds-background shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-ds-text-primary">{t('Template Builder', 'باني القوالب')}</h1>
          <p className="text-xs text-ds-text-muted mt-0.5">{t('Configure layout, design tokens, and see live changes instantly.', 'اضبط التخطيط ورموز التصميم وشاهد التغييرات فوراً.')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="success">Live</Badge>
          <Badge color="muted">{websiteType}</Badge>
          <Badge color="muted">{ds.font}</Badge>
          <Badge color="primary">{radius}px</Badge>
        </div>
      </div>

      {/* ── Canvas + Right panel ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Preview canvas — dark stage background */}
        <div className="flex-1 min-w-0 overflow-hidden bg-[#09090b] p-4 flex items-stretch">
          <div className="flex-1 min-w-0 overflow-hidden rounded-xl ring-1 ring-white/5 shadow-2xl">
            <PreviewCanvas
              templateConfig={templateConfig}
              websiteType={websiteType}
              showTopBar={showTopBar}
              topBarText={topBarText}
              topBarTheme={topBarTheme}
              radius={radius}
              lang={lang} t={t}
              fontStack={activeFontStack}
              buttonStyle={ds.buttonStyle}
              buttonWeight={ds.buttonWeight}
              inputVariant={ds.inputVariant}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[380px] xl:w-[420px] shrink-0 h-full overflow-hidden">
          <RightPanel
            templateConfig={templateConfig}
            update={updateTemplateConfig}
            profiles={profiles}
            onProfileClick={handleProfileClick}
            lang={lang} t={t}
            saving={saving} saved={saved} onSave={handleSave}
            openAssetManager={openAssetManager}
            websiteType={websiteType} setWebsiteType={setWebsiteType}
            showTopBar={showTopBar} setShowTopBar={setShowTopBar}
            topBarText={topBarText} setTopBarText={setTopBarText}
            topBarTheme={topBarTheme} setTopBarTheme={setTopBarTheme}
            radius={radius} setRadius={setRadius}
            ds={ds} setDs={setDs}
          />
        </div>
      </div>
    </div>
  )
}
