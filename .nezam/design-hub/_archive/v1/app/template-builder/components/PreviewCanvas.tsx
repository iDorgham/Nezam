'use client'
import React, { useState, useEffect } from 'react'
import {
  Phone, Share2, ChevronDown, X, Search, Bell, User, Star,
  Check, Zap, Activity, Terminal, ArrowUpRight, Shield, Cpu, Layers, Play
} from 'lucide-react'
import { websiteContent, radiusClassMap, paletteTokens } from './config'
import type { TemplateConfig } from '@/lib/store/session.store'
import type { WebsiteType, RadiusScale, TopBarTheme, ColorPalette, AnimationStyle } from './config'

interface Props {
  templateConfig: TemplateConfig
  websiteType: WebsiteType
  showTopBar: boolean
  topBarText: string
  topBarTheme: TopBarTheme
  radius: RadiusScale
  lang: string
  t: (en: string, ar: string) => string
  fontStack?: string
  buttonStyle?: string
  buttonWeight?: string
  inputVariant?: string
  colorPalette?: ColorPalette

  // Custom advanced animation props
  animationDelay?: number
  animationDuration?: number
  animationTimingFunction?: 'ease' | 'linear' | 'ease-in-out' | 'cubic-bezier'
  animationCustomCubic?: string
  animationIterationCount?: 'once' | 'infinite'
  googleFontName?: string
  googleFontUrl?: string
  animateTrigger?: number
  animation?: AnimationStyle

  // Direct-edit mode
  isEditMode?: boolean
  customTexts?: Record<string, string>
  onTextEdit?: (key: string, value: string) => void
}

export default function PreviewCanvas({
  templateConfig,
  websiteType,
  showTopBar,
  topBarText,
  topBarTheme,
  radius,
  lang,
  t,
  fontStack,
  buttonStyle = 'solid',
  buttonWeight = 'semibold',
  inputVariant = 'outlined',
  colorPalette = 'orange',

  animationDelay = 0,
  animationDuration = 800,
  animationTimingFunction = 'ease',
  animationCustomCubic = '0.4, 0, 0.2, 1',
  animationIterationCount = 'once',
  googleFontName = '',
  googleFontUrl = '',
  animateTrigger = 0,
  animation = 'fade',
  isEditMode = false,
  customTexts = {},
  onTextEdit,
}: Props) {
  // ── Editable text helper ──────────────────────────────────────────────────
  const EditableText = React.useCallback(({ editKey, children, className, as: Tag = 'span' }: {
    editKey: string; children: string; className?: string; as?: keyof React.JSX.IntrinsicElements
  }) => {
    const value = customTexts[editKey] ?? children
    if (!isEditMode) return React.createElement(Tag as any, { className }, value)
    return React.createElement(Tag as any, {
      className: `${className ?? ''} outline outline-2 outline-amber-400/60 rounded-sm cursor-text bg-amber-400/5`,
      contentEditable: true,
      suppressContentEditableWarning: true,
      title: `Edit: ${editKey}`,
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent ?? ''
        onTextEdit?.(editKey, text)
      },
    }, value)
  }, [isEditMode, customTexts, onTextEdit])
  const pal = paletteTokens[colorPalette] || paletteTokens.orange
  const primary = pal.primary
  const isLight = colorPalette === 'white'
  const [megaOpen, setMegaOpen] = useState(false)
  const content = websiteContent[websiteType] || websiteContent.saas
  const rc = radiusClassMap[radius]

  const isDark  = !isLight
  const pageBg  = isLight ? '#f8fafc' : pal.bg
  const surfBg  = isLight ? '#ffffff' : pal.surface
  const surfElBg = isLight ? '#f1f5f9' : pal.surfaceElevated
  const hdrBg   = isLight ? 'rgba(255,255,255,0.97)' : `${pal.surface}ee`
  const hdrBorder = isDark ? 'border-b border-white/[0.06]' : 'border-b border-slate-200'
  const textMain  = isDark ? 'text-slate-100' : 'text-slate-900'
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500'
  const cardBg    = isDark ? 'bg-white/5 border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-sm'
  const urlBg     = isDark ? 'bg-slate-950/70 border border-white/[0.08]' : 'bg-slate-100 border border-slate-200'

  const fontFamily = fontStack ?? '"Inter", system-ui, sans-serif'

  // Dynamic Google Font Loader Hook
  useEffect(() => {
    if (googleFontUrl && googleFontName) {
      const id = `google-font-${googleFontName.replace(/\s+/g, '-').toLowerCase()}`
      if (!document.getElementById(id)) {
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = googleFontUrl
        document.head.appendChild(link)
      }
    }
  }, [googleFontUrl, googleFontName])

  // Google Material Icons Symbols Loader Hook
  useEffect(() => {
    const id = 'google-material-symbols'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24..48,100..700,0..1,-50..200'
      document.head.appendChild(link)
    }
  }, [])

  const animationTiming = animationTimingFunction === 'cubic-bezier' 
    ? `cubic-bezier(${animationCustomCubic})` 
    : animationTimingFunction

  const animationStyle: React.CSSProperties = {
    animationDuration: `${animationDuration}ms`,
    animationDelay: `${animationDelay}ms`,
    animationTimingFunction: animationTiming,
    animationIterationCount: animationIterationCount === 'infinite' ? 'infinite' : 1,
    animationFillMode: 'both',
  }

  const animationClass = animation === 'none' ? ''
    : animation === 'fade' ? 'animate-custom-fade'
    : animation === 'slide' ? 'animate-custom-slide-up'
    : animation === 'spring' ? 'animate-custom-spring'
    : animation === 'zoom' ? 'animate-custom-zoom-in'
    : animation === 'bounce' ? 'animate-custom-bounce'
    : animation === 'pulse' ? 'animate-custom-pulse'
    : animation === 'float' ? 'animate-custom-float'
    : animation === 'glitch' ? 'animate-custom-glitch'
    : animation === 'reveal-left' ? 'animate-custom-reveal-left'
    : animation === 'reveal-right' ? 'animate-custom-reveal-right'
    : animation === 'flip-3d' ? 'animate-custom-flip-3d'
    : animation === 'shimmer' ? 'animate-custom-shimmer'
    : animation === 'blur-reveal' ? 'animate-custom-blur-reveal'
    : animation === 'cosmic-spin' ? 'animate-custom-cosmic-spin'
    : animation === 'elastic-boing' ? 'animate-custom-elastic-boing'
    : animation === 'rgb-jitter' ? 'animate-custom-rgb-jitter'
    : animation === 'slide-fade-left' ? 'animate-custom-slide-fade-left'
    : animation === 'slide-fade-right' ? 'animate-custom-slide-fade-right'
    : 'animate-custom-fade'

  const styleTag = (
    <style>{`
      @keyframes customFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes customSlideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes customSpring {
        0% { opacity: 0; transform: scale(0.92) translateY(16px); }
        60% { opacity: 1; transform: scale(1.03) translateY(-4px); }
        80% { transform: scale(0.98) translateY(2px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes customZoomIn {
        from { opacity: 0; transform: scale(0.94); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes customBounce {
        0% { opacity: 0; transform: translateY(-28px); }
        55% { opacity: 1; transform: translateY(8px); }
        75% { transform: translateY(-4px); }
        90% { transform: translateY(2px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes customPulse {
        0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
        50% { transform: scale(1.015); opacity: 0.95; box-shadow: 0 0 20px 6px rgba(249, 115, 22, 0.2); }
      }
      @keyframes customFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes customGlitch {
        0%, 100% { clip-path: inset(0 0 0 0); transform: skew(0deg); }
        20% { clip-path: inset(8% 0 86% 0); transform: skew(-2deg); text-shadow: -1.5px 0 #ff00c1, 1.5px 0 #00fff0; }
        40% { clip-path: inset(78% 0 6% 0); transform: skew(2deg); text-shadow: -1.5px 0 #00fff0, 1.5px 0 #ff00c1; }
        60% { clip-path: inset(28% 0 64% 0); transform: skew(-1deg); }
        80% { clip-path: inset(48% 0 46% 0); transform: skew(1deg); text-shadow: -1.5px 0 #ff00c1, 1.5px 0 #00fff0; }
      }
      @keyframes customRevealLeft {
        from { clip-path: inset(0 100% 0 0); transform: translateX(-20px); opacity: 0; }
        to { clip-path: inset(0 0 0 0); transform: translateX(0); opacity: 1; }
      }
      @keyframes customRevealRight {
        from { clip-path: inset(0 0 0 100%); transform: translateX(20px); opacity: 0; }
        to { clip-path: inset(0 0 0 0); transform: translateX(0); opacity: 1; }
      }
      @keyframes customFlip3d {
        from { opacity: 0; transform: perspective(800px) rotateY(-90deg); }
        to { opacity: 1; transform: perspective(800px) rotateY(0deg); }
      }
      @keyframes customShimmerSweep {
        0% { opacity: 0; background-position: -150% 0; filter: brightness(1.2); }
        50% { opacity: 1; }
        100% { opacity: 1; background-position: 150% 0; filter: brightness(1); }
      }
      @keyframes customBlurReveal {
        0% { filter: blur(20px); opacity: 0; transform: scale(0.96); }
        100% { filter: blur(0px); opacity: 1; transform: scale(1); }
      }
      @keyframes customCosmicSpin {
        0% { opacity: 0; transform: rotate(-8deg) scale(0.95); }
        100% { opacity: 1; transform: rotate(0deg) scale(1); }
      }
      @keyframes customElasticBoing {
        0% { opacity: 0; transform: scale(0.65); }
        40% { opacity: 1; transform: scale(1.12); }
        65% { transform: scale(0.94); }
        85% { transform: scale(1.03); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes customRgbJitter {
        0%, 100% { opacity: 1; transform: translate(0); text-shadow: none; }
        10% { transform: translate(-2px, 1px); text-shadow: -2px 0 #ff0055, 2px 0 #00ffaa; }
        20% { transform: translate(1px, -1px); text-shadow: 1px -1px #ff0055, -2px 2px #00ffaa; }
        30% { transform: translate(0); text-shadow: none; }
        70% { transform: translate(2px, -1px); text-shadow: 2px -1px #ff0055, -1px 2px #00ffaa; }
        80% { transform: translate(-1px, 1px); text-shadow: -1px 1px #ff0055, 1px -1px #00ffaa; }
        90% { transform: translate(0); text-shadow: none; }
      }
      @keyframes customSlideFadeLeft {
        from { opacity: 0; transform: translateX(-32px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes customSlideFadeRight {
        from { opacity: 0; transform: translateX(32px); }
        to { opacity: 1; transform: translateX(0); }
      }

      .animate-custom-fade {
        animation-name: customFadeIn;
      }
      .animate-custom-slide-up {
        animation-name: customSlideUp;
      }
      .animate-custom-spring {
        animation-name: customSpring;
      }
      .animate-custom-zoom-in {
        animation-name: customZoomIn;
      }
      .animate-custom-bounce {
        animation-name: customBounce;
      }
      .animate-custom-pulse {
        animation-name: customPulse;
      }
      .animate-custom-float {
        animation-name: customFloat;
      }
      .animate-custom-glitch {
        animation-name: customGlitch;
      }
      .animate-custom-reveal-left {
        animation-name: customRevealLeft;
      }
      .animate-custom-reveal-right {
        animation-name: customRevealRight;
      }
      .animate-custom-flip-3d {
        animation-name: customFlip3d;
      }
      .animate-custom-shimmer {
        background: linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0) 70%) -150% 0 / 250% 100% no-repeat;
        animation-name: customShimmerSweep;
      }
      .animate-custom-blur-reveal {
        animation-name: customBlurReveal;
      }
      .animate-custom-cosmic-spin {
        animation-name: customCosmicSpin;
      }
      .animate-custom-elastic-boing {
        animation-name: customElasticBoing;
      }
      .animate-custom-rgb-jitter {
        animation-name: customRgbJitter;
      }
      .animate-custom-slide-fade-left {
        animation-name: customSlideFadeLeft;
      }
      .animate-custom-slide-fade-right {
        animation-name: customSlideFadeRight;
      }
    `}</style>
  )

  const bwCls = buttonWeight === 'normal' ? 'font-normal' : buttonWeight === 'medium' ? 'font-medium'
    : buttonWeight === 'bold' ? 'font-bold' : buttonWeight === 'black' ? 'font-black' : 'font-semibold'

  type BtnType = { className: string; style: React.CSSProperties }
  const btnVariant: Record<string, BtnType> = {
    solid:   { className: 'text-white hover:opacity-90 active:scale-[0.98]', style: { background: primary } },
    outline: { className: 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98]', style: { border: `1.5px solid ${primary}`, color: primary } },
    ghost:   { className: 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98]', style: { color: primary } },
    soft:    { className: 'hover:opacity-90 active:scale-[0.98]', style: { background: `${primary}18`, color: primary } },
  }
  const bv = btnVariant[buttonStyle] ?? btnVariant.solid
  const btnBaseClass = `${rc} ${bwCls} transition-all duration-150 flex items-center justify-center gap-1.5 ${bv.className}`

  const inputStyle: Record<string, string> = {
    outlined:  `border border-slate-300 dark:border-slate-800 ${rc}`,
    underline: 'border-b border-slate-400 dark:border-slate-700 rounded-none',
    filled:    `bg-slate-100 dark:bg-slate-900 border-0 ${rc}`,
    soft:      `${rc}`,
  }
  const inputSoftStyle: React.CSSProperties = inputVariant === 'soft' ? { background: `${primary}14`, border: `1px solid ${primary}33` } : {}
  const inputCls = `w-full py-2 px-3 text-[10px] bg-transparent focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-${colorPalette} transition-all ${inputStyle[inputVariant] ?? inputStyle.outlined}`

  const topBarStyle: React.CSSProperties = topBarTheme === 'slate'
    ? isDark ? { background: '#0f172a', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.06)' }
             : { background: '#1e293b', color: '#e2e8f0' }
    : topBarTheme === 'cyan'
    ? { background: '#06b6d4', color: '#fff' }
    : { background: primary, color: '#fff' }

  const padX = templateConfig.spacing === 'compact' ? 'px-4 sm:px-6' : templateConfig.spacing === 'spacious' ? 'px-8 sm:px-12' : 'px-6 sm:px-8'
  const padY = templateConfig.spacing === 'compact' ? 'py-2 sm:py-2.5' : templateConfig.spacing === 'spacious' ? 'py-4 sm:py-5' : 'py-3 sm:py-3.5'
  const secPad = templateConfig.spacing === 'compact' ? 'px-6 py-8 sm:py-10' : templateConfig.spacing === 'spacious' ? 'px-12 py-16 sm:py-24' : 'px-8 py-12 sm:py-16'

  const primaryStyle: React.CSSProperties = { color: primary }
  const primaryBgSubtleStyle: React.CSSProperties = { background: `${primary}14`, color: primary }

  const navItems = lang === 'ar' ? content.navAr : content.nav
  const logoPos  = templateConfig.headerLogoPosition
  const menuPos  = templateConfig.headerMenuPosition

  const Logo = () => (
    <div className={`flex items-center gap-2 shrink-0 ${logoPos === 'center' ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
      <span className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-black shadow-md"
        style={{ background: `linear-gradient(135deg, ${primary}, ${primary}aa)` }}>N</span>
      <span className="text-[11px] font-black tracking-tight" style={{ color: primary }}>NEZAM</span>
    </div>
  )

  const PrimaryBtn = ({ label, size = 'sm', icon }: { label: string; size?: 'xs' | 'sm'; icon?: React.ReactNode }) => (
    <button
      className={`${btnBaseClass} ${size === 'xs' ? 'px-2.5 py-1 text-[9px]' : 'px-4 py-2 text-[10px]'}`}
      style={bv.style}
    >
      {label}
      {icon}
    </button>
  )

  const isRtl = lang === 'ar'

  return (
    <div className="flex flex-col overflow-hidden select-text text-start" style={{ fontFamily, direction: isRtl ? 'rtl' : 'ltr', minHeight: '100%' }}>
      {styleTag}

      {/* ── Edit mode indicator ── */}
      {isEditMode && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-1.5 z-30" style={{ background: 'rgba(245,158,11,0.12)', borderBottom: '1px solid rgba(245,158,11,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400">Edit Mode — Click highlighted text to edit</span>
        </div>
      )}

      {/* ── Page Content Wrapper ── */}
      <div className="flex flex-col" style={{ backgroundColor: pageBg, color: textMain, minHeight: isEditMode ? 'calc(100% - 32px)' : '100%' }}>


        {/* Announcement announcement bar */}
        {showTopBar && (
          <div className="shrink-0 flex items-center justify-between px-4 py-1.5 text-[9px] font-semibold tracking-wide transition-all" style={topBarStyle}>
            <span className="truncate mx-auto">{topBarText}</span>
            <button className="shrink-0 ms-2 opacity-70 hover:opacity-100 flex items-center"><X size={10} /></button>
          </div>
        )}

        {/* ── Sidebar layout ── */}
        {templateConfig.headerStyle === 'sidebar' ? (
          <div className="flex flex-1 min-h-0">
            <aside className={`w-40 shrink-0 flex flex-col gap-1 p-4 ${hdrBorder} border-r`} style={{ background: surfBg }}>
              <Logo />
              <div className="mt-5 space-y-0.5">
                {navItems.map((item, i) => (
                  <a key={item} href="#" className="block text-[9px] font-bold uppercase tracking-wider px-2 py-1.5 rounded transition-all"
                    style={i === 0 ? primaryBgSubtleStyle : undefined}>
                    <span className={i === 0 ? '' : textMuted}>{item}</span>
                  </a>
                ))}
              </div>
              <div className="mt-auto pt-4 space-y-3">
                {templateConfig.headerShowPhone && (
                  <div className={`flex items-center gap-1.5 text-[9px] ${textMuted}`}>
                    <Phone size={9} style={primaryStyle} />
                    <span className="font-mono">+20 100 123 4567</span>
                  </div>
                )}
                {templateConfig.headerShowCta && <PrimaryBtn label={t('Get Started', 'ابدأ الآن')} size="xs" />}
              </div>
            </aside>
            <div className="flex-1 overflow-y-auto flex flex-col">
              <HeroSection
                content={content}
                heroStyle={templateConfig.heroStyle}
                rc={rc}
                secPad={secPad}
                isDark={isDark}
                textMuted={textMuted}
                t={t}
                lang={lang}
                PrimaryBtn={PrimaryBtn}
                cardBg={cardBg}
                primary={primary}
                primaryStyle={primaryStyle}
                primaryBgSubtleStyle={primaryBgSubtleStyle}
                animationClass={animationClass}
                animationStyle={animationStyle}
                animateTrigger={animateTrigger}
                EditableText={EditableText}
              />
              
              {/* Optional dynamic landing components */}
              {templateConfig.showStats === true && (
                <EgyptianPartnershipStrip cfg={templateConfig} isDark={isDark} textMuted={textMuted} t={t} primary={primary} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}
              {templateConfig.showFeatures !== false && (
                <FeatureStrip isDark={isDark} textMuted={textMuted} cardBg={cardBg} rc={rc} t={t} websiteType={websiteType} primary={primary} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}
              {templateConfig.showStats === true && (
                <StatsBar rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}
              {templateConfig.showPricing === true && (
                <PricingSection rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} lang={lang} PrimaryBtn={PrimaryBtn} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}
              {templateConfig.showTestimonials !== false && (
                <TestimonialsSection rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}
              {templateConfig.showTeam === true && (
                <TeamGrid rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}
              {templateConfig.showForm !== false && (
                <FormSection cfg={templateConfig} content={content} rc={rc} isDark={isDark} cardBg={cardBg} lang={lang} t={t} inputCls={inputCls} inputSoftStyle={inputSoftStyle} PrimaryBtn={PrimaryBtn} textMuted={textMuted} primary={primary} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
              )}

              <FooterSection cfg={templateConfig} isDark={isDark} pal={pal} padX={padX} textMuted={textMuted} primaryStyle={primaryStyle} primary={primary} t={t} />
            </div>
          </div>
        ) : (
          <>
            {/* ── Top header ── */}
            <header className="sticky top-0 z-20 shrink-0 backdrop-blur-md" style={{ backgroundColor: hdrBg }}>
              <div className={`${hdrBorder} border-b`} />
              <div className={`flex items-center ${padX} ${padY} gap-4 max-w-6xl mx-auto relative`}>
                <div className={`${logoPos === 'right' ? 'order-last ms-auto' : logoPos === 'center' ? 'order-2' : 'order-first'}`}>
                  <Logo />
                </div>

                {templateConfig.headerMenuMode === 'topbar' ? (
                  <nav className={`hidden md:flex items-center gap-5 ${menuPos === 'right' ? 'order-last ms-auto' : menuPos === 'center' ? 'order-2 mx-auto' : 'order-2'}`}>
                    {templateConfig.headerStyle === 'mega' && (
                      <div className="relative">
                        <button onClick={() => setMegaOpen(v => !v)}
                          className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider transition-all ${textMuted} hover:text-slate-300`}>
                          {navItems[0]} <ChevronDown size={8} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {megaOpen && (
                          <div className={`absolute top-full mt-2 ${isRtl ? 'right-0' : 'left-0'} w-52 p-3 rounded-lg border shadow-xl z-30 grid grid-cols-2 gap-2 ${isDark ? 'bg-[#121318] border-white/10 text-white' : 'bg-white border-slate-200 shadow-slate-200/60 text-slate-800'}`}>
                            {['Design Suite', 'Swarm Engine', 'Wireframes', 'Logs'].map(x => (
                              <a key={x} href="#" className={`text-[8px] font-bold uppercase py-1 px-1.5 rounded hover:bg-white/5 transition-colors ${textMuted}`}>{x}</a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {navItems.slice(templateConfig.headerStyle === 'mega' ? 1 : 0).map((item, i) => (
                      <a key={item} href="#" className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${textMuted} hover:text-slate-300`}
                        style={i === 0 && templateConfig.headerStyle !== 'mega' ? primaryStyle : undefined}>{item}</a>
                    ))}
                  </nav>
                ) : (
                  <button className="order-last ms-auto flex flex-col gap-[3.5px] p-1">
                    {[0,0,0].map((_, i) => (
                      <span key={i} className={`block h-[1.5px] ${isDark ? 'bg-slate-300' : 'bg-slate-700'} transition-all ${i === 1 ? 'w-3.5' : 'w-4.5'}`} />
                    ))}
                  </button>
                )}

                <div className="flex items-center gap-3 order-last ms-auto shrink-0">
                  {templateConfig.headerShowPhone && (
                    <a href="#" className={`hidden sm:flex items-center gap-1 text-[8px] font-bold ${textMuted}`}>
                      <Phone size={8} style={primaryStyle} /> +20 100 123
                    </a>
                  )}
                  {templateConfig.headerShowSocials && <Share2 size={10} className={`${textMuted} cursor-pointer hover:text-slate-300 transition-colors`} />}
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center ${textMuted} border border-white/5`} style={{ background: `${primary}18` }}><User size={9} /></div>
                  {templateConfig.headerShowCta && <PrimaryBtn label={t('Get Started', 'ابدأ الآن')} size="xs" />}
                </div>
              </div>
            </header>

            {/* Main Landing Sections list */}
            <HeroSection
              content={content}
              heroStyle={templateConfig.heroStyle}
              rc={rc}
              secPad={secPad}
              isDark={isDark}
              textMuted={textMuted}
              t={t}
              lang={lang}
              PrimaryBtn={PrimaryBtn}
              cardBg={cardBg}
              primary={primary}
              primaryStyle={primaryStyle}
              primaryBgSubtleStyle={primaryBgSubtleStyle}
              animationClass={animationClass}
              animationStyle={animationStyle}
              animateTrigger={animateTrigger}
              EditableText={EditableText}
            />
            
            {templateConfig.showStats === true && (
              <EgyptianPartnershipStrip cfg={templateConfig} isDark={isDark} textMuted={textMuted} t={t} primary={primary} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            {templateConfig.showFeatures !== false && (
              <FeatureStrip isDark={isDark} textMuted={textMuted} cardBg={cardBg} rc={rc} t={t} websiteType={websiteType} primary={primary} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            {templateConfig.showStats === true && (
              <StatsBar rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            {templateConfig.showPricing === true && (
              <PricingSection rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} lang={lang} PrimaryBtn={PrimaryBtn} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            {templateConfig.showTestimonials !== false && (
              <TestimonialsSection rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            {templateConfig.showTeam === true && (
              <TeamGrid rc={rc} cardBg={cardBg} isDark={isDark} textMuted={textMuted} primary={primary} t={t} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            {templateConfig.showForm !== false && (
              <FormSection cfg={templateConfig} content={content} rc={rc} isDark={isDark} cardBg={cardBg} lang={lang} t={t} inputCls={inputCls} inputSoftStyle={inputSoftStyle} PrimaryBtn={PrimaryBtn} textMuted={textMuted} primary={primary} animationClass={animationClass} animationStyle={animationStyle} animateTrigger={animateTrigger} />
            )}

            <FooterSection cfg={templateConfig} isDark={isDark} pal={pal} padX={padX} textMuted={textMuted} primaryStyle={primaryStyle} primary={primary} t={t} />
          </>
        )}
      </div>
    </div>
  )
}

// ── Hero Section ────────────────────────────────────────────────────────────
function HeroSection({ content, heroStyle, rc, secPad, isDark, textMuted, t, lang, PrimaryBtn, cardBg, primary, primaryStyle, primaryBgSubtleStyle, animationClass, animationStyle, animateTrigger, EditableText }: any) {
  const title = lang === 'ar' ? content.titleAr : content.title
  const desc  = lang === 'ar' ? content.descAr  : content.desc
  const tag   = lang === 'ar' ? content.tagAr   : content.tag
  const cta   = lang === 'ar' ? content.ctaAr   : content.cta

  const Tag = () => (
    <span className="inline-block text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm"
      style={primaryBgSubtleStyle}>{tag}</span>
  )

  const isRtl = lang === 'ar'

  // Editable wrapper — if EditableText exists use it, else passthrough
  const ET = EditableText ?? (({ children, className }: any) => <span className={className}>{children}</span>)

  // Showcase layout rendering a beautiful dashboard mockup
  if (heroStyle === 'showcase') {
    return (
      <section key={animateTrigger} className={`${secPad} flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto ${animationClass}`} style={animationStyle}>
        <Tag />
        <h1 className="text-xl sm:text-2xl font-black leading-tight max-w-2xl">
          <ET editKey="heroTitle" className="">{title}</ET>
        </h1>
        <p className={`text-[10px] sm:text-[11px] leading-relaxed max-w-xl ${textMuted}`}>
          <ET editKey="heroDesc" className="">{desc}</ET>
        </p>
        <div className="flex gap-2.5">
          <PrimaryBtn label={<ET editKey="heroCta" className="">{cta}</ET>} icon={<ArrowUpRight size={10} />} />
          <button className={`px-4 py-2 ${rc} border border-slate-300 dark:border-white/10 hover:bg-white/5 text-[10px] font-bold transition-all ${textMuted}`}>{t('Learn More', 'اعرف المزيد')}</button>
        </div>

        {/* SaaS Dashboard Premium Mockup */}
        <div className={`w-full max-w-3xl mt-6 border border-white/[0.08] ${rc} bg-[#0c0d12] shadow-2xl p-4 overflow-hidden relative`}>
          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[8px] font-bold text-slate-500 font-mono ms-2">cairo-sahel-swarm-03.nezam.dev</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Operational</span>
            </div>
          </div>

          {/* Grid Layout inside Mockup */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded bg-white/5 border border-white/[0.06] text-start space-y-1.5">
              <div className="text-[8px] uppercase tracking-wider text-slate-400">Total Requests</div>
              <div className="text-sm font-black tracking-tight" style={primaryStyle}>2,489,190</div>
              <div className="text-[7px] text-emerald-500 font-bold flex items-center gap-0.5">
                <span className="inline-block text-[6px]">▲</span> +14.2% {t('this hour', 'الساعة الحالية')}
              </div>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/[0.06] text-start space-y-1.5">
              <div className="text-[8px] uppercase tracking-wider text-slate-400">Egypt Sync Speed</div>
              <div className="text-sm font-black tracking-tight text-white font-mono">14.05<span className="text-[8px] text-slate-400 ms-0.5">ms</span></div>
              <div className="text-[7px] text-emerald-500 font-bold flex items-center gap-0.5">
                <span className="inline-block text-[6px]">▼</span> -2.4ms {t('optimized', 'تم تحسينه')}
              </div>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/[0.06] text-start space-y-1.5">
              <div className="text-[8px] uppercase tracking-wider text-slate-400">Logical Compliance</div>
              <div className="text-sm font-black tracking-tight text-white">100%</div>
              <div className="text-[7px] text-indigo-400 font-bold">{t('Clean Audit', 'تدقيق سليم')}</div>
            </div>
          </div>

          {/* Dummy Sparkline Graphic */}
          <div className="mt-4 h-12 bg-white/[0.02] rounded border border-white/[0.04] p-2 flex items-end gap-1">
            {[34, 45, 23, 56, 78, 65, 43, 89, 92, 67, 54, 76, 88, 95, 110, 85, 90, 115, 124, 98, 112].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-300"
                style={{
                  height: `${(h / 130) * 100}%`,
                  background: i === 20 ? primary : `linear-gradient(to top, ${primary}10, ${primary}99)`
                }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (heroStyle === 'split') {
    return (
      <section key={animateTrigger} className={`${secPad} grid md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-5xl mx-auto ${animationClass}`} style={animationStyle}>
        <div className="space-y-4">
          <Tag />
          <h1 className="text-lg sm:text-xl font-black leading-tight">{title}</h1>
          <p className={`text-[10px] sm:text-[11px] leading-relaxed ${textMuted}`}>{desc}</p>
          <div className="flex gap-2 pt-1">
            <PrimaryBtn label={cta} icon={<ArrowUpRight size={10} />} />
            <button className={`px-3 py-1.5 ${rc} border border-slate-300 dark:border-white/10 hover:bg-white/5 text-[9px] sm:text-[10px] font-bold transition-all ${textMuted}`}>{t('Learn More', 'اعرف المزيد')}</button>
          </div>
        </div>
        <div className={`p-4 ${rc} ${cardBg} space-y-4 relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent`}>
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-black font-mono tracking-tight" style={primaryStyle}>NEZAM_SWARM_NODE_A</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] uppercase font-bold text-emerald-400">Operational</span>
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: t('Cairo Hub West', 'مركز غرب القاهرة'), val: 78, meta: '14.2ms' },
              { label: t('Sahel Coast Edge', 'عقدة الساحل الشمالي'), val: 56, meta: '9.8ms' },
              { label: t('Delta Swarm Node', 'سرب وسط الدلتا'), val: 89, meta: '12.4ms' }
            ].map((node, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold">
                  <span className={textMuted}>{node.label}</span>
                  <span className="text-white font-mono">{node.val}% <span className="text-[6px] text-slate-500">({node.meta})</span></span>
                </div>
                <div className={`h-1.5 ${rc} overflow-hidden`} style={{ background: `${primary}18` }}>
                  <div className={`h-full ${rc} transition-all duration-500`} style={{ width: `${node.val}%`, background: primary }} />
                </div>
              </div>
            ))}
          </div>
          <div className={`text-[8px] font-bold uppercase tracking-wider ${textMuted} border-t border-white/[0.04] pt-2 flex justify-between`}>
            <span>{t('Active Swarms: 3/3', 'الفرق النشطة: ٣')}</span>
            <span>{t('Average Latency: 12.1ms', 'معدل الاستجابة: ١٢.١ مل ث')}</span>
          </div>
        </div>
      </section>
    )
  }

  if (heroStyle === 'video') {
    return (
      <section key={animateTrigger} className={`relative flex items-center justify-center text-center ${secPad} overflow-hidden min-h-[220px] ${animationClass}`}
        style={{ ...animationStyle, background: isDark ? '#07080e' : `${primary}08` }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${primary}26, transparent 80%)` }} />
        
        {/* Animated grid visual decoration */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

        <div className="relative z-10 space-y-4 max-w-xl px-4">
          <Tag />
          <h1 className="text-xl sm:text-2xl font-black leading-tight text-white">{title}</h1>
          <p className={`text-[10px] sm:text-[11px] leading-relaxed max-w-md mx-auto ${textMuted}`}>{desc}</p>
          <div className="flex justify-center gap-3">
            <PrimaryBtn label={cta} icon={<Play size={9} fill="currentColor" />} />
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-white hover:bg-white/10 flex items-center gap-1.5 transition-all">
              <Activity size={10} className="text-emerald-400" />
              {t('View Network Status', 'عرض حالة الشبكة')}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Centered / Default Hero — Rich illustrated layout
  return (
    <section key={animateTrigger}
      className={`relative overflow-hidden ${secPad} ${animationClass}`}
      style={{ ...animationStyle, background: isDark ? `linear-gradient(135deg, #0c0d12 0%, #0f1018 100%)` : 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)' }}>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -start-20 w-72 h-72 rounded-full opacity-[0.12] blur-[80px]"
          style={{ background: primary }} />
        <div className="absolute top-10 end-0 w-48 h-48 rounded-full opacity-[0.08] blur-[60px]"
          style={{ background: '#8b5cf6' }} />
        <div className="absolute bottom-0 start-1/3 w-40 h-40 rounded-full opacity-[0.06] blur-[50px]"
          style={{ background: '#06b6d4' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className={`relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 px-4 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

        {/* ── Left: copy ── */}
        <div className={`flex-1 min-w-0 space-y-4 text-center lg:text-start ${isRtl ? 'lg:text-end' : ''}`}>
          <Tag />
          <h1 className={`text-2xl sm:text-3xl font-black leading-[1.15] tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <ET editKey="heroTitle" className="">{title}</ET>
          </h1>
          <p className={`text-[11px] sm:text-[12px] leading-[1.8] max-w-md ${isRtl ? 'lg:ms-auto' : ''} ${textMuted}`}>
            <ET editKey="heroDesc" className="">{desc}</ET>
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
            <PrimaryBtn label={<ET editKey="heroCta" className="">{cta}</ET>} icon={<ArrowUpRight size={10} />} />
            <button className={`px-4 py-2 ${rc} border text-[10px] font-bold transition-all ${textMuted} ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
              {t('Watch Demo', 'شاهد العرض')}
            </button>
          </div>
          {/* Social proof */}
          <div className={`flex items-center gap-3 pt-1 justify-center lg:justify-start ${isRtl ? 'lg:justify-end' : ''}`}>
            <div className="flex -space-x-1.5">
              {['#f97316','#8b5cf6','#06b6d4','#10b981'].map((c, i) => (
                <div key={i} className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center text-[7px] font-black text-white"
                  style={{ background: c, borderColor: isDark ? '#0c0d12' : '#f8faff' }}>
                  {['M','A','L','S'][i]}
                </div>
              ))}
            </div>
            <div className={`text-[8px] font-medium ${textMuted}`}>
              <span className="font-black" style={{ color: primary }}>+2,400</span>
              {t(' teams building with NEZAM', ' فريق يبني بنيظام')}
            </div>
          </div>
        </div>

        {/* ── Right: SVG illustration / dashboard mockup ── */}
        <div className="relative flex-shrink-0 w-full max-w-xs lg:max-w-sm">
          {/* Main card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border"
            style={{ background: isDark ? '#10111a' : '#ffffff', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
            {/* Card header bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b"
              style={{ background: isDark ? '#0d0e16' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' }}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-0.5 rounded text-[8px] font-mono"
                  style={{ background: isDark ? '#1a1c28' : '#e8edf5', color: isDark ? '#636480' : '#6b7280' }}>
                  nezam.eg/dashboard
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Dashboard content */}
            <div className="p-3 space-y-2">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Revenue', value: '247K', sub: '+18%', icon: '💰', c: '#10B981' },
                  { label: 'Visitors', value: '84.2K', sub: '+31%', icon: '👥', c: '#06B6D4' },
                  { label: 'Conv.',   value: '4.8%', sub: '+0.6%',icon: '⚡', c: primary },
                ].map(stat => (
                  <div key={stat.label} className="rounded-lg p-2 space-y-0.5 border"
                    style={{ background: isDark ? '#16182a' : '#f1f5f9', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
                    <div className="text-[7px]" style={{ color: isDark ? '#6b7280' : '#94a3b8' }}>{stat.icon} {stat.label}</div>
                    <div className="text-[11px] font-black" style={{ color: isDark ? '#e8e8ed' : '#1e293b' }}>{stat.value}</div>
                    <div className="text-[7px] font-bold" style={{ color: stat.c }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="rounded-lg p-2.5 border" style={{ background: isDark ? '#16182a' : '#f8fafc', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0' }}>
                <div className="flex items-end gap-1 h-12">
                  {[30,55,42,70,60,85,65,90,78,95,82,100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all"
                      style={{ height: `${h}%`, background: i === 11 ? primary : isDark ? `${primary}30` : `${primary}20`, opacity: i > 8 ? 1 : 0.7 }} />
                  ))}
                </div>
                <div className={`text-[7px] mt-1.5 font-semibold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                  {t('Revenue · Last 12 months', 'الإيرادات · آخر ١٢ شهرًا')}
                </div>
              </div>

              {/* Recent activity */}
              <div className="space-y-1">
                {[
                  { name: 'Ahmed S.',  action: t('New subscription', 'اشتراك جديد'),  time: '2m', c: '#10B981' },
                  { name: 'Layla M.',  action: t('Upgrade to Pro', 'ترقية للاحترافي'), time: '8m', c: primary },
                  { name: 'Omar K.',   action: t('Form submitted', 'نموذج مرسل'),      time: '15m',c: '#8b5cf6' },
                ].map(a => (
                  <div key={a.name} className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-black text-white shrink-0"
                      style={{ background: a.c }}>
                      {a.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[8px] font-semibold" style={{ color: isDark ? '#d1d5db' : '#374151' }}>{a.name}</span>
                      <span className="text-[7px] ms-1" style={{ color: isDark ? '#4b5563' : '#9ca3af' }}>{a.action}</span>
                    </div>
                    <span className="text-[6px] shrink-0" style={{ color: isDark ? '#374151' : '#d1d5db' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge — top right */}
          <div className="absolute -top-3 -end-3 px-2.5 py-1.5 rounded-xl text-[8px] font-bold flex items-center gap-1.5 shadow-xl"
            style={{ background: isDark ? '#1a1c2e' : '#fff', border: `1px solid ${primary}30`, color: primary, boxShadow: `0 8px 24px -6px ${primary}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
            {t('Live Preview', 'معاينة حية')}
          </div>

          {/* Floating metric — bottom left */}
          <div className="absolute -bottom-3 -start-3 px-2.5 py-2 rounded-xl shadow-xl"
            style={{ background: isDark ? '#1a1c2e' : '#fff', border: `1px solid rgba(139,92,246,0.25)`, boxShadow: '0 8px 24px -6px rgba(139,92,246,0.3)' }}>
            <div className="text-[7px] font-medium" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>AI Score</div>
            <div className="text-[14px] font-black" style={{ color: '#8b5cf6' }}>98<span className="text-[8px]">/100</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}


// ── Egyptian Partnerships Strip ──────────────────────────────────────────────
function EgyptianPartnershipStrip({ cfg, isDark, textMuted, t, primary, animationClass, animationStyle, animateTrigger }: any) {
  const showPaymobFawry = cfg?.showStats !== false
  const showInstapay = cfg?.showTeam !== false

  type Badge = { name: string; color: string; bg: string; border: string; emoji: string; liveColor?: string }

  const allBadges: Badge[] = [
    ...(showPaymobFawry ? [
      { name: 'PAYMOB', color: '#00d4ff', bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', emoji: '💳', liveColor: '#00d4ff' },
      { name: 'FAWRY', color: primary,   bg: `${primary}0f`,         border: `${primary}33`,         emoji: '⚡' },
    ] : []),
    ...(showInstapay ? [
      { name: 'INSTAPAY', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', emoji: '📲', liveColor: '#10B981' },
    ] : []),
    { name: 'SWVL', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', emoji: '🚌' },
    { name: 'NEZAM LABS', color: primary, bg: `${primary}10`, border: `${primary}30`, emoji: '🧬' },
    { name: 'VALEO EGYPT', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', emoji: '🏭' },
  ]

  return (
    <div key={animateTrigger} className={`border-y py-4 px-4 shrink-0 ${animationClass}`}
      style={{ ...animationStyle, borderColor: 'rgba(255,255,255,0.05)', background: isDark ? '#08090e' : '#f8fafc' }}>
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-[7.5px] font-black uppercase tracking-widest" style={{ color: '#6b7280' }}>
            {t('Trusted by Egyptian Enterprises', 'شركاء النجاح في التكنولوجيا المصرية')}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[7px] text-emerald-500 font-bold uppercase tracking-wider">{t('Live Integrations', 'تكاملات حية')}</span>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex items-center flex-wrap gap-2">
          {allBadges.map((b, i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-md text-[8.5px] font-black tracking-wider transition-all hover:scale-[1.03] cursor-default select-none"
              style={{ color: b.color, background: b.bg, border: `1px solid ${b.border}` }}>
              {b.liveColor && (
                <span className="w-1 h-1 rounded-full animate-pulse shrink-0" style={{ background: b.liveColor }} />
              )}
              <span>{b.emoji}</span>
              <span>{b.name}</span>
            </div>
          ))}
          {/* Count badge */}
          <div className="ms-auto text-[7px] text-slate-600 font-mono">
            {allBadges.length} {t('active', 'نشط')} · {t('EG', 'مصر')} 🇪🇬
          </div>
        </div>
      </div>
    </div>
  )
}


// ── Feature Strip ────────────────────────────────────────────────────────────
function FeatureStrip({ isDark, textMuted, cardBg, rc, t, websiteType, primary, animationClass, animationStyle, animateTrigger }: any) {
  const featMap: Record<string, { icon: React.ReactNode; label: string; desc: string }[]> = {
    saas: [
      { icon: <Cpu size={12} />, label: 'AI Automation Swarms', desc: 'Pre-engineered workflow orchestration agents' },
      { icon: <Shield size={12} />, label: 'SOC2-Ready Vault', desc: 'Secure environment keys with multi-tenant isolation' },
      { icon: <Layers size={12} />, label: 'Adaptive UI Presets', desc: 'Synchronized visual workspaces instantly' },
    ],
    ecommerce: [
      { icon: <Cpu size={12} />, label: 'Cairo QuickCheckout', desc: 'One-click purchases tailored for Instapay & Fawry' },
      { icon: <Shield size={12} />, label: 'Egypt Logistics sync', desc: 'Direct shipping partners spanning Cairo & Sahel' },
      { icon: <Layers size={12} />, label: 'Curated catalogs', desc: 'Showcase local Egyptian craftsmanship elegantly' },
    ],
    agency: [
      { icon: <Cpu size={12} />, label: 'Artisan Branding', desc: 'Blending heritage aesthetics with modern specs' },
      { icon: <Shield size={12} />, label: '14-Day MVP Launch', desc: 'High-speed design-to-development execution' },
      { icon: <Layers size={12} />, label: 'SEO & Localization', desc: 'Egyptian Masri search optimization built in' },
    ]
  }

  const features = featMap[websiteType] || featMap.saas

  return (
    <div key={animateTrigger} className={`px-6 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto w-full ${animationClass}`} style={animationStyle}>
      <div className="text-center mb-8 space-y-1">
        <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: primary }}>{t('Engineered Excellence', 'التميز الهندسي')}</h2>
        <p className={`text-[10px] ${textMuted}`}>{t('Uncompromising standard layout capabilities', 'مواصفات قياسية فائقة في جميع العناصر')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((feat, idx) => (
          <div key={idx} className={`p-4 rounded-xl ${cardBg} space-y-3 hover:border-ds-primary/30 transition-all group`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ background: `${primary}14`, color: primary }}>
              {feat.icon}
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-white group-hover:text-ds-primary transition-colors">{feat.label}</h3>
              <p className={`text-[8.5px] leading-relaxed ${textMuted}`}>{t(feat.desc, 'مدمجة بسلاسة مع سياق نظام التصميم الخاص بك لضمان أقصى كفاءة.')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Stats Bar ──────────────────────────────────────────────────────────────
function StatsBar({ rc, cardBg, isDark, textMuted, primary, t, animationClass, animationStyle, animateTrigger }: any) {
  return (
    <div key={animateTrigger} className={`px-6 sm:px-8 py-8 bg-slate-950/20 w-full border-t border-b border-white/[0.04] ${animationClass}`} style={animationStyle}>
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
        {[
          { label: t('Sahel Node Uptime', 'نسبة تشغيل عقد الساحل'), value: '99.98%', trend: '▲ 0.02%' },
          { label: t('Swarm Sync Speed', 'زمن مزامنة السرب'), value: '14.05ms', trend: '▼ 2.4ms' },
          { label: t('Cairo Requests Daily', 'الطلبات اليومية بالقاهرة'), value: '4.8M+', trend: '▲ 18.5%' }
        ].map((stat, idx) => (
          <div key={idx} className="p-3 text-center space-y-1">
            <span className="text-[8px] uppercase tracking-wider text-[#8e8e93] block">{stat.label}</span>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white block font-mono">{stat.value}</span>
            <span className="text-[7px] text-emerald-500 font-bold block">{stat.trend}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Pricing Section ─────────────────────────────────────────────────────────
function PricingSection({ rc, cardBg, isDark, textMuted, primary, t, lang, PrimaryBtn, animationClass, animationStyle, animateTrigger }: any) {
  const isRtl = lang === 'ar'
  return (
    <div key={animateTrigger} className={`px-6 sm:px-8 py-12 sm:py-16 max-w-5xl mx-auto w-full ${animationClass}`} style={animationStyle}>
      <div className="text-center mb-8 space-y-1">
        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${primary}14`, color: primary }}>
          {t('Transparent Plans', 'خطط أسعار واضحة')}
        </span>
        <h2 className="text-sm font-black uppercase tracking-wider text-white pt-1">{t('Select Your Tech Accent Plan', 'اختر باقة السداد المناسبة')}</h2>
        <p className={`text-[9px] ${textMuted}`}>{t('Flexible options for startups and enterprises in Egypt', 'خيارات مرنة للشركات الناشئة والمؤسسات بمصر')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
        {/* Plan 1 */}
        <div className={`p-5 rounded-xl ${cardBg} flex flex-col justify-between hover:border-white/10 transition-all`}>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Delta Starter</div>
              <div className="text-lg font-black text-white mt-1">FREE <span className="text-[8px] text-slate-500 font-normal">/ {t('lifetime', 'مدى الحياة')}</span></div>
            </div>
            <p className={`text-[8.5px] leading-relaxed ${textMuted}`}>{t('Perfect for sandbox Cairo MVPs and local tests.', 'مثالية لاختبار الأفكار والمشاريع الصغيرة بالقاهرة.')}</p>
            <ul className="space-y-2 text-[8px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <Check size={8} className="text-emerald-500" />
                <span>1 {t('Egyptian Node Instance', 'عقدة عمل مصرية')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} className="text-emerald-500" />
                <span>{t('Standard Web Fonts', 'خطوط الويب القياسية')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} className="text-emerald-500" />
                <span>500 {t('requests / hour', 'طلب في الساعة')}</span>
              </li>
            </ul>
          </div>
          <div className="pt-6">
            <button className={`w-full py-1.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all border border-slate-700 hover:bg-white/5 ${textMuted}`}>{t('Get Sandbox', 'ابدأ مجاناً')}</button>
          </div>
        </div>

        {/* Plan 2 - Featured */}
        <div className={`p-5 rounded-xl border-2 flex flex-col justify-between hover:scale-[1.01] transition-all relative overflow-hidden`}
          style={{ borderColor: primary, background: `${primary}04` }}>
          <div className="absolute top-0 right-0 bg-ds-primary text-white text-[7px] font-black uppercase tracking-widest py-0.5 px-3 rounded-bl-lg" style={{ background: primary }}>
            {t('RECOMMENDED', 'الأكثر طلباً')}
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Sahel Pro</div>
              <div className="text-lg font-black text-white mt-1">1,250 EGP <span className="text-[8px] text-slate-400 font-normal">/ {t('month', 'شهرياً')}</span></div>
            </div>
            <p className={`text-[8.5px] leading-relaxed ${textMuted}`}>{t('For production scale landing experiences with swarms.', 'لإطلاق المشاريع الكبرى مع دعم كامل لأسراب العمل.')}</p>
            <ul className="space-y-2 text-[8px] text-slate-200">
              <li className="flex items-center gap-1.5">
                <Check size={8} style={{ color: primary }} />
                <span>5 {t('Cairo High-Speed Swarms', 'عقد عمل سحابية فائقة السرعة')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} style={{ color: primary }} />
                <span>{t('Custom named Style Archetypes', 'أنماط تصميم مخصصة بالكامل')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} style={{ color: primary }} />
                <span>{t('Premium Egyptian CDN sync', 'مزامنة مع شبكات توصيل مصرية')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} style={{ color: primary }} />
                <span>{t('24/7 Priority Support', 'دعم فني ذكي على مدار الساعة')}</span>
              </li>
            </ul>
          </div>
          <div className="pt-6">
            <PrimaryBtn label={t('Upgrade to Pro', 'اشترك الآن')} />
          </div>
        </div>

        {/* Plan 3 */}
        <div className={`p-5 rounded-xl ${cardBg} flex flex-col justify-between hover:border-white/10 transition-all`}>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Giza Enterprise</div>
              <div className="text-lg font-black text-white mt-1">Custom <span className="text-[8px] text-slate-500 font-normal">/ {t('quote', 'حسب الطلب')}</span></div>
            </div>
            <p className={`text-[8.5px] leading-relaxed ${textMuted}`}>{t('Global infrastructure for high-traffic multi-tenant firms.', 'للمؤسسات الكبرى متعددة المستأجرين ذات الاستهلاك الضخم.')}</p>
            <ul className="space-y-2 text-[8px] text-slate-300">
              <li className="flex items-center gap-1.5">
                <Check size={8} className="text-emerald-500" />
                <span>{t('Unlimited Cairo backup nodes', 'عقد نسخ احتياطي غير محدودة بالقاهرة')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} className="text-emerald-500" />
                <span>{t('Custom SLA & Private gateway', 'بوابة مخصصة واتفاقية مستوى خدمة')}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check size={8} className="text-emerald-500" />
                <span>{t('Dedicated RTL content design', 'دعم هندسي كامل للغات RTL')}</span>
              </li>
            </ul>
          </div>
          <div className="pt-6">
            <button className={`w-full py-1.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all border border-slate-700 hover:bg-white/5 ${textMuted}`}>{t('Contact Sales', 'اتصل بنا')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Testimonials Section ────────────────────────────────────────────────────
function TestimonialsSection({ rc, cardBg, isDark, textMuted, primary, t, animationClass, animationStyle, animateTrigger }: any) {
  return (
    <div key={animateTrigger} className={`px-6 sm:px-8 py-12 bg-slate-950/10 w-full border-t border-white/[0.02] ${animationClass}`} style={animationStyle}>
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: primary }}>{t('Loved by Innovators', 'آراء شركاء النجاح')}</h2>
          <p className={`text-[9px] ${textMuted}`}>{t('Real feedback from top Cairo tech startups', 'آراء حقيقية من قادة الشركات التقنية في مصر')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: t('Eng. Amr - CTO Paymob', 'م. عمرو - المدير التقني بـ Paymob'),
              quote: t('Nezam redesigned our entire Cairo operations. Sahel Orange palette looks so elite and fits perfectly!', 'أعاد نظام نيظام تصميم عملياتنا بالكامل بالقاهرة. Sahel Orange هو النمط الأكثر أناقة وملاءمة تماماً!')
            },
            {
              name: t('Dina - Design Lead Swvl', 'دينا - مديرة التصميم بـ Swvl'),
              quote: t('The Blender-style properties mixer is a pure masterpiece. It made layout customization instant and logical.', 'خلاط الأنماط الذكي بأسلوب Blender هو تحفة فنية حقيقية. جعل تخصيص الواجهات فورياً ومنطقياً للغاية.')
            },
            {
              name: t('Tarek - Architect Giza', 'طارق - مهندس برمجيات بالجيزة'),
              quote: t('Outstanding Egyptian Masri RTL layout properties. Support for HSL tokens handles responsive screens beautifully.', 'خصائص RTL وتصميم Masri فائقة الدقة. دعم HSL tokens يعالج الشاشات المتجاوبة بمرونة استثنائية.')
            }
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl ${cardBg} space-y-3 hover:scale-[1.005] transition-all`}>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map(s => (
                  <Star key={s} size={8} fill={primary} stroke="none" />
                ))}
              </div>
              <p className="text-[9px] leading-relaxed text-slate-200 italic font-medium">"{item.quote}"</p>
              <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.04]">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: primary }}>
                  {item.name.charAt(0)}
                </div>
                <span className="text-[8px] font-bold text-slate-400">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Team Grid Section ───────────────────────────────────────────────────────
function TeamGrid({ rc, cardBg, isDark, textMuted, primary, t, animationClass, animationStyle, animateTrigger }: any) {
  return (
    <div key={animateTrigger} className={`px-6 sm:px-8 py-12 max-w-5xl mx-auto w-full ${animationClass}`} style={animationStyle}>
      <div className="text-center mb-8 space-y-1">
        <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: primary }}>{t('The Cairo Core Swarm', 'نواة العمل بالقاهرة')}</h2>
        <p className={`text-[9px] ${textMuted}`}>{t('The technical minds crafting Egypt\'s visual future', 'العقول التقنية التي تبني مستقبل التصميم في مصر')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: t('Amina Hegazi', 'أمينة حجازي'), role: t('Principal Architect', 'كبير المهندسين المعماريين'), loc: t('Cairo West', 'غرب القاهرة') },
          { name: t('Sherif Sabry', 'شريف صبري'), role: t('Swarms Director', 'مدير تنسيق أسراب العمل'), loc: t('Sahel Edge', 'عقدة الساحل الشمالي') },
          { name: t('El-Ghazaly Sabry', 'الغزالي صبري'), role: t('Senior RTL Engineer', 'كبير مهندسي واجهات RTL'), loc: t('Giza Hub', 'مركز الجيزة التقني') }
        ].map((member, idx) => (
          <div key={idx} className={`p-4 rounded-xl ${cardBg} text-center space-y-2.5 hover:border-white/10 transition-all`}>
            <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center font-black text-white text-[11px] shadow-inner"
              style={{ background: `linear-gradient(135deg, ${primary}, ${primary}aa)` }}>
              {member.name.split(' ').map((n: string) => n.charAt(0)).join('')}
            </div>
            <div>
              <div className="text-[10px] font-black text-white">{member.name}</div>
              <div className="text-[7.5px] uppercase tracking-wider text-slate-400 mt-0.5">{member.role}</div>
              <span className="inline-block text-[6.5px] font-bold px-2 py-0.5 rounded-full mt-2" style={{ background: `${primary}14`, color: primary }}>
                {member.loc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Form Section ────────────────────────────────────────────────────────────
function FormSection({ cfg, content, rc, isDark, cardBg, lang, t, inputCls, inputSoftStyle, PrimaryBtn, textMuted, primary, animationClass, animationStyle, animateTrigger }: any) {
  return (
    <div key={animateTrigger} className={`flex justify-center px-6 sm:px-8 pb-12 ${animationClass}`} style={animationStyle}>
      <div className={`w-full max-w-sm p-5 sm:p-6 rounded-2xl ${cardBg} space-y-4 shadow-xl border border-white/[0.06] bg-[#0c0d12]`}>
        <div className={`text-[10px] font-black uppercase tracking-wider ${textMuted} border-b ${isDark ? 'border-white/[0.04]' : 'border-slate-200'} pb-3 flex justify-between`}>
          <span>{t('Quick Consultation Request', 'طلب استشارة فورية')}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="space-y-4">
          {[
            { label: lang === 'ar' ? 'الاسم بالكامل' : 'Full Name', val: 'Ahmed Hassan / أحمد حسن' },
            { label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address', val: 'ahmed@paymob.eg' },
            { label: lang === 'ar' ? 'رقم الهاتف (الساحل/القاهرة)' : 'Mobile Phone (Egypt)', val: '+20 100 123 4567' }
          ].map(({ label, val }) => (
            <div key={label} className="space-y-1">
              <label className={`text-[8.5px] font-bold ${textMuted} block`}>{label}</label>
              <input readOnly defaultValue={val} className={inputCls} style={inputSoftStyle} />
            </div>
          ))}
        </div>
        <div className="pt-2">
          <PrimaryBtn label={lang === 'ar' ? 'إرسال الطلب للسرب' : 'Submit Consult Proposal'} icon={<ArrowUpRight size={10} />} />
        </div>
      </div>
    </div>
  )
}

// ── Footer Section ──────────────────────────────────────────────────────────
function FooterSection({ cfg, isDark, pal, padX, textMuted, primaryStyle, primary, t }: any) {
  if (cfg.footerStyle === 'simple') {
    return (
      <footer className={`shrink-0 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-200'} py-4 ${padX}`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[8px] font-bold uppercase tracking-wider text-slate-500">
          <span>&copy; 2026 NEZAM &middot; Cairo Developer Suite</span>
          <div className="flex items-center gap-3">
            {cfg.footerShowPhone && <span className="flex items-center gap-1"><Phone size={7} style={primaryStyle} />+20 100 123 4567</span>}
            {cfg.footerShowSocials && <Share2 size={7} className="cursor-pointer hover:text-white" />}
          </div>
        </div>
      </footer>
    )
  }

  // Large multi-column footer
  return (
    <footer className={`shrink-0 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-200 bg-slate-50'} py-8 ${padX}`}
      style={isDark ? { background: pal.bg } : undefined}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cfg.footerColumns || 3}, minmax(0, 1fr))` }}>
          {['Products', 'Resources', 'Company', 'Support', 'Legal'].slice(0, cfg.footerColumns || 3).map((col, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-[8.5px] font-black uppercase tracking-widest" style={primaryStyle}>{t(col, col === 'Products' ? 'المنتجات' : col === 'Resources' ? 'الموارد' : col === 'Company' ? 'الشركة' : col === 'Support' ? 'الدعم الفني' : 'القوانين')}</div>
              {['Overview', 'Features', 'Pricing', 'Docs'].map(l => (
                <a key={l} href="#" className={`block text-[8px] font-bold text-slate-500 hover:text-white transition-colors`}>{t(l, l === 'Overview' ? 'نظرة عامة' : l === 'Features' ? 'الميزات' : l === 'Pricing' ? 'الأسعار' : 'التوثيق')}</a>
              ))}
            </div>
          ))}
        </div>
        <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/[0.04]' : 'border-slate-200'} text-[8px] font-bold uppercase tracking-wider text-slate-500`}>
          <span>&copy; 2026 NEZAM Cairo Developer Hub</span>
          <div className="flex items-center gap-3">
            {cfg.footerShowPhone && <span className="flex items-center gap-1"><Phone size={7} style={primaryStyle} />+20 100 123 4567</span>}
            {cfg.footerShowSocials && <Share2 size={7} className="cursor-pointer hover:text-white" />}
          </div>
        </div>
      </div>
    </footer>
  )
}
