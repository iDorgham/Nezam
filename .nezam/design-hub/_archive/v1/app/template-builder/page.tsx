'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  RotateCcw, RotateCw, Save, Check, Maximize2, Minimize2,
  Monitor, Tablet, Smartphone, Pen, PenOff, PanelRightClose, PanelRightOpen,
} from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'
import RightPanel from './components/RightPanel'
import PreviewCanvas from './components/PreviewCanvas'
import SectionAdder from './components/SectionAdder'
import BuilderOnboarding from './components/BuilderOnboarding'
import { websiteContent, fontOptions } from './components/config'
import { DEFAULT_LAYERS, type SectionLayer } from './components/LayersPanel'
import type { WebsiteType, RadiusScale, TopBarTheme, AnimationStyle, TransitionSpeed, ColorPalette } from './components/config'
import type { DesignSystemState } from './components/LeftPanel'
import { DEFAULT_STYLE } from './components/styleRandomizer'

const STORAGE_KEY = 'nezam.ds.template-config'

type Viewport = 'desktop' | 'tablet' | 'mobile'

export default function TemplateBuilderPage() {
  const {
    templateConfig, updateTemplateConfig, profiles, fetchProfiles,
    lang, addLog, openAssetManager, setSelectedProfile,
    configHistory, configFuture, undo, redo,
    theme, setTheme, setLang,
  } = useSessionStore()

  const t = useCallback((en: string, ar: string) => lang === 'ar' ? ar : en, [lang])

  // ── Design system state ──────────────────────────────────────────────────
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
  const [animation,       setAnimation]       = useState<AnimationStyle>('fade')
  const [transitionSpeed, setTransitionSpeed] = useState<TransitionSpeed>('normal')
  const [styleName,       setStyleName]       = useState(DEFAULT_STYLE.name)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  // ── Layout state ─────────────────────────────────────────────────────────
  const [rightWidth,      setRightWidth]      = useState(420)
  const [isDraggingRight, setIsDraggingRight] = useState(false)
  const [rightCollapsed,  setRightCollapsed]  = useState(false)
  const [zenMode,         setZenMode]         = useState(false)
  const [viewport,        setViewport]        = useState<Viewport>('desktop')

  // ── Animation state ──────────────────────────────────────────────────────
  const [animationDelay,          setAnimationDelay]          = useState(0)
  const [animationDuration,       setAnimationDuration]       = useState(800)
  const [animationTimingFunction, setAnimationTimingFunction] = useState<'ease' | 'linear' | 'ease-in-out' | 'cubic-bezier'>('ease')
  const [animationCustomCubic,    setAnimationCustomCubic]    = useState('0.4, 0, 0.2, 1')
  const [animationIterationCount, setAnimationIterationCount] = useState<'once' | 'infinite'>('once')
  const [googleFontName,          setGoogleFontName]          = useState('')
  const [googleFontUrl,           setGoogleFontUrl]           = useState('')
  const [iconPack,                setIconPack]                = useState<'lucide' | 'material'>('lucide')
  const [animateTrigger,          setAnimateTrigger]          = useState(0)

  // ── Layers / section ordering ─────────────────────────────────────────────
  const [layers, setLayers] = useState<SectionLayer[]>(DEFAULT_LAYERS)

  // Sync layer visibility → templateConfig section visibility flags
  const prevLayersRef = useRef(layers)
  useEffect(() => {
    const prev = prevLayersRef.current
    prevLayersRef.current = layers
    const changes: Record<string, boolean> = {}
    const KEY_MAP: Record<string, keyof typeof templateConfig> = {
      features:     'showFeatures',
      stats:        'showStats',
      pricing:      'showPricing',
      testimonials: 'showTestimonials',
      team:         'showTeam',
      form:         'showForm',
    }
    for (const layer of layers) {
      const key = KEY_MAP[layer.id]
      if (!key) continue
      const prevLayer = prev.find(l => l.id === layer.id)
      if (prevLayer && prevLayer.visible !== layer.visible) {
        changes[key] = layer.visible
      }
    }
    if (Object.keys(changes).length > 0) updateTemplateConfig(changes as any)
  }, [layers, updateTemplateConfig])

  // ── Edit mode (direct preview editing) ───────────────────────────────────
  const [isEditMode,  setIsEditMode]  = useState(false)
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({})

  const canUndo = configHistory.length > 0
  const canRedo = configFuture.length > 0

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return
      const key = e.key.toLowerCase()
      if (key === '`') { e.preventDefault(); setZenMode(v => !v) }
      else if (key === 'e' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setIsEditMode(v => !v) }
      else if ((key === 'r' || key === 'f') && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setRightCollapsed(v => !v) }
      else if (key === 'escape') { setRightCollapsed(false); setZenMode(false); setIsEditMode(false) }
      else if (key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) { e.preventDefault(); undo() }
      else if ((key === 'z' && (e.metaKey || e.ctrlKey) && e.shiftKey) || (key === 'y' && e.ctrlKey)) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  // ── Right-panel drag resize ───────────────────────────────────────────────
  const handleRightDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDraggingRight(true)
    const startX = e.clientX
    const startW = rightWidth
    const isRtl  = lang === 'ar'
    const onMove = (ev: MouseEvent) => {
      const delta = isRtl ? ev.clientX - startX : startX - ev.clientX
      setRightWidth(Math.max(320, Math.min(640, startW + delta)))
    }
    const onUp = () => { setIsDraggingRight(false); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

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
    // Hydrate theme
    const savedTheme = (localStorage.getItem('theme') ?? 'dark') as 'dark' | 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [fetchProfiles, updateTemplateConfig, setTheme])

  const handleSave = () => {
    setSaving(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templateConfig))
    setTimeout(() => {
      setSaving(false); setSaved(true)
      addLog(t('Configuration saved.', 'تم حفظ الإعدادات.'))
      setTimeout(() => setSaved(false), 1600)
    }, 350)
  }

  const handleProfileClick = (name: string) => {
    updateTemplateConfig({ colorProfile: name })
    setSelectedProfile(name)
  }

  const activeFontStack = googleFontName
    ? `"${googleFontName}", ${fontOptions.find(f => f.value === ds.font)?.stack ?? 'sans-serif'}`
    : (fontOptions.find(f => f.value === ds.font)?.stack ?? '"Inter", system-ui, sans-serif')

  const showRight  = !zenMode && !rightCollapsed
  const isCustomized = ds.colorPalette !== 'orange' || googleFontName !== '' || (templateConfig as any).colorProfile

  // Viewport constraint widths
  const vpMaxW: number | string = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : '100%'

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0f0f10] text-[#e1e1e6]" style={{ height: '100dvh' }}>

      {/* ══════════════════════════════════════════
          TOP HEADER — Logo + Title + Controls
      ══════════════════════════════════════════ */}
      <header className="h-11 shrink-0 flex items-center px-3 gap-2 border-b border-[#1f1f21] bg-[#121213] z-10">

        {/* ── Logo + wordmark ── */}
        <div className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[13px] text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)' }}>
            N
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-black tracking-tight text-white">NEZAM</span>
            <span className="text-[8px] font-medium text-[#48484a] tracking-wider uppercase">Builder</span>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-[#2a2a2c] shrink-0 mx-1" />

        {/* ── Undo / Redo ── */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={undo} disabled={!canUndo} title={t('Undo ⌘Z', 'تراجع')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#636366] hover:text-[#e8e8ed] hover:bg-[#232324] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
            <RotateCcw size={12} />
          </button>
          <button onClick={redo} disabled={!canRedo} title={t('Redo ⌘⇧Z', 'إعادة')}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#636366] hover:text-[#e8e8ed] hover:bg-[#232324] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
            <RotateCw size={12} />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-[#2a2a2c] shrink-0 mx-1" />

        {/* ── Viewport toggle ── */}
        <div className="flex items-center bg-[#1c1c1e] border border-[#2a2a2c] rounded-lg p-0.5 gap-0.5 shrink-0">
          {([
            { id: 'desktop', icon: <Monitor    size={11} />, title: 'Desktop (full width)' },
            { id: 'tablet',  icon: <Tablet     size={11} />, title: 'Tablet (768px)'       },
            { id: 'mobile',  icon: <Smartphone size={11} />, title: 'Mobile (390px)'       },
          ] as const).map(v => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
              title={v.title}
              className="w-7 h-6 flex items-center justify-center rounded-md transition-all"
              style={{
                background: viewport === v.id ? '#3a3a3c' : 'transparent',
                color:      viewport === v.id ? '#e8e8ed' : '#636366',
              }}
            >
              {v.icon}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Right controls ── */}
        <div className="flex items-center gap-0.5 shrink-0">

          {/* Edit mode */}
          <button
            onClick={() => setIsEditMode(v => !v)}
            title={t('Edit text inline (E)', 'تعديل النص')}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{
              background: isEditMode ? 'rgba(245,158,11,0.15)' : 'transparent',
              color:      isEditMode ? '#f59e0b' : '#636366',
              outline:    isEditMode ? '1px solid rgba(245,158,11,0.3)' : 'none',
            }}
          >
            {isEditMode ? <Pen size={12} /> : <PenOff size={12} />}
          </button>

          {/* Separator */}
          <div className="w-px h-4 bg-[#2a2a2c] mx-1 shrink-0" />

          {/* Zen / full preview */}
          <button
            onClick={() => setZenMode(v => !v)}
            title={t('Full preview (`)', 'معاينة كاملة')}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{ color: zenMode ? 'var(--ds-primary,#06b6d4)' : '#636366' }}
          >
            {zenMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>

          {/* Panel toggle */}
          {!zenMode && (
            <button
              onClick={() => setRightCollapsed(v => !v)}
              title={t('Toggle panel (R)', 'إخفاء/إظهار اللوحة')}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{ color: rightCollapsed ? '#636366' : 'var(--ds-primary,#06b6d4)' }}
            >
              {rightCollapsed ? <PanelRightOpen size={12} /> : <PanelRightClose size={12} />}
            </button>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            title={saved ? t('Saved!', 'تم الحفظ!') : t('Save ⌘S', 'حفظ')}
            className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-[11px] font-bold text-white transition-all ms-2 shadow-sm"
            style={{
              background: saved ? '#16a34a' : 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              boxShadow:  saved ? '0 4px 12px rgba(22,163,74,0.4)' : '0 4px 12px rgba(6,182,212,0.3)',
            }}
          >
            {saved ? <Check size={11} /> : <Save size={11} />}
            {saved ? t('Saved', 'تم') : t('Save', 'حفظ')}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MAIN WORKSPACE — Canvas + Right Panel
      ══════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Preview canvas area ── */}
        <div className="flex-1 overflow-auto flex items-start justify-center min-w-0"
          style={{ background: '#dfe1e8' }}>

          {/* Viewport frame */}
          <div
            className="relative shadow-2xl min-h-full transition-all duration-300 overflow-hidden"
            style={{
              width: vpMaxW,
              maxWidth: viewport !== 'desktop' ? vpMaxW : '100%',
              background: isCustomized ? undefined : '#ffffff',
            }}
          >
            {/* Viewport label */}
            {viewport !== 'desktop' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider select-none pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}>
                {viewport === 'mobile' ? '390px — Mobile' : '768px — Tablet'}
              </div>
            )}

            <PreviewCanvas
              templateConfig={templateConfig}
              websiteType={websiteType}
              showTopBar={showTopBar}
              topBarText={topBarText}
              topBarTheme={topBarTheme}
              radius={radius}
              lang={lang}
              t={t}
              fontStack={activeFontStack}
              buttonStyle={ds.buttonStyle}
              buttonWeight={ds.buttonWeight}
              inputVariant={ds.inputVariant}
              colorPalette={isCustomized ? (ds.colorPalette as ColorPalette) : 'white'}
              animationDelay={animationDelay}
              animationDuration={animationDuration}
              animationTimingFunction={animationTimingFunction}
              animationCustomCubic={animationCustomCubic}
              animationIterationCount={animationIterationCount}
              googleFontName={googleFontName}
              googleFontUrl={googleFontUrl}
              animateTrigger={animateTrigger}
              animation={animation}
              isEditMode={isEditMode}
              customTexts={customTexts}
              onTextEdit={(key, val) => setCustomTexts(prev => ({ ...prev, [key]: val }))}
            />

            {/* Section adder */}
            <SectionAdder templateConfig={templateConfig} update={updateTemplateConfig} lang={lang} t={t} />

            {/* Drag shield while resizing */}
            {isDraggingRight && <div className="absolute inset-0 z-30 cursor-col-resize" />}
          </div>
        </div>

        {/* ── Drag handle ── */}
        {showRight && (
          <div
            onMouseDown={handleRightDragStart}
            className="w-[4px] shrink-0 relative z-20 cursor-col-resize group transition-colors duration-150 h-full"
            style={{ background: isDraggingRight ? 'var(--ds-primary,#06b6d4)' : 'transparent' }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-colors"
              style={{ background: isDraggingRight ? 'transparent' : '#1f1f21' }} />
          </div>
        )}

        {/* ── Right panel ── */}
        <div
          style={{ width: showRight ? rightWidth : 0, transition: rightCollapsed ? 'width 0.2s ease' : 'width 0.2s ease' }}
          className="shrink-0 h-full overflow-hidden"
        >
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
            styleName={styleName}
            animation={animation} setAnimation={v => setAnimation(v as AnimationStyle)}
            transitionSpeed={transitionSpeed} setTransitionSpeed={v => setTransitionSpeed(v as TransitionSpeed)}
            animationDelay={animationDelay} setAnimationDelay={setAnimationDelay}
            animationDuration={animationDuration} setAnimationDuration={setAnimationDuration}
            animationTimingFunction={animationTimingFunction} setAnimationTimingFunction={setAnimationTimingFunction}
            animationCustomCubic={animationCustomCubic} setAnimationCustomCubic={setAnimationCustomCubic}
            animationIterationCount={animationIterationCount} setAnimationIterationCount={setAnimationIterationCount}
            googleFontName={googleFontName} setGoogleFontName={setGoogleFontName}
            googleFontUrl={googleFontUrl} setGoogleFontUrl={setGoogleFontUrl}
            iconPack={iconPack} setIconPack={setIconPack}
            animateTrigger={animateTrigger} setAnimateTrigger={setAnimateTrigger}
            layers={layers} setLayers={setLayers}
            theme={theme} setTheme={(t: string) => setTheme(t as 'dark' | 'light')}
          />
        </div>
      </div>

      {/* ══ Onboarding overlay ══ */}
      <BuilderOnboarding lang={lang} t={t} />
    </div>
  )
}
