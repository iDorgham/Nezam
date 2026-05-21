'use client'

import React, { useState } from 'react'
import {
  Laptop,
  Tablet,
  Smartphone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  PhoneCall,
  ChevronRight,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import type { TemplateConfig } from '@/lib/store/session.store'

interface LivePreviewProps {
  config: TemplateConfig
  lang: 'en' | 'ar'
  onToggleLang: () => void
}

type ViewportType = 'desktop' | 'tablet' | 'mobile'

export default function LivePreview({
  config,
  lang,
  onToggleLang,
}: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportType>('desktop')
  const [activeMenuOpen, setActiveMenuOpen] = useState(false)

  const isAr = lang === 'ar'
  const t = (en: string, ar: string) => (isAr ? ar : en)

  // Masri Egyptian Arabic Translations for Mock Data
  const texts = {
    logo: t('NEZAM', 'نِظام'),
    phone: t('+20 100 123 4567', '+٢٠ ١٠٠ ١٢٣ ٤٥٦٧'),
    cta: t('Get Started', 'ابدأ دلوقتي'),
    navHome: t('Home', 'الرئيسية'),
    navServices: t('Services', 'خدماتنا'),
    navWork: t('Our Work', 'شغلنا'),
    navAbout: t('About Us', 'عن الشركة'),
    navContact: t('Contact', 'كلمنا'),
    heroTitle: t('Built a Nezam for your Cairo projects', 'عملنا نظام يليق بمشاريعك هنا في مصر'),
    heroSubtitle: t('A premium flat design contract powering unified MENA branding and fast high-end development.', 'عقد تصميم مسطح فاخر بيشغل هوية موحدة في الشرق الأوسط وتطوير سريع جداً.'),
    inputName: t('Full Name', 'الاسم بالكامل'),
    inputEmail: t('Email Address', 'البريد الإلكتروني'),
    inputPhone: t('Phone Number', 'رقم الموبايل'),
    formSubmit: t('Submit Request', 'ارسل الطلب'),
    formTitle: t('Ready to Build?', 'جاهز تبني معانا؟'),
    formSub: t('Fill your data below and our Cairo team will reach out.', 'سجل بياناتك هنا وفريق القاهرة هيكلمك علطول.'),
    copyright: t('© 2026 Nezam. All rights reserved.', '© ٢٠٢٦ شركة نظام. كل الحقوق محفوظة.'),
    colProducts: t('Products', 'المنتجات'),
    colCompany: t('Company', 'الشركة'),
    colResources: t('Resources', 'المصادر'),
    colLegal: t('Legal', 'قانوني'),
    colSupport: t('Support', 'الدعم الفني')
  }

  const navLinks = [texts.navHome, texts.navServices, texts.navWork, texts.navAbout, texts.navContact]

  // Setup viewport width styling
  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]'
  }

  // Handle alignment rendering styles
  const getAlignmentClass = (pos: 'left' | 'center' | 'right') => {
    if (pos === 'left') return 'justify-start text-left'
    if (pos === 'center') return 'justify-center text-center'
    return 'justify-end text-right'
  }

  return (
    <div className="flex flex-col h-full bg-ds-background-subtle rounded-2xl border border-ds-border overflow-hidden">
      {/* 1. Studio Viewport Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-ds-surface border-b border-ds-border">
        <div className="flex items-center gap-1.5 border border-ds-border rounded-lg p-0.5 bg-ds-surface-subtle">
          {(['desktop', 'tablet', 'mobile'] as ViewportType[]).map((v) => {
            const Icon = v === 'desktop' ? Laptop : v === 'tablet' ? Tablet : Smartphone
            return (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`p-1.5 rounded transition-all ${
                  viewport === v
                    ? 'bg-ds-surface border border-ds-border text-ds-primary'
                    : 'text-ds-text-muted hover:text-ds-text-primary'
                }`}
                title={v.toUpperCase()}
              >
                <Icon size={14} />
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-ds-text-muted">
            {t('Studio View', 'معاينة الاستوديو')}
          </span>
          <span className="h-3.5 w-px bg-ds-border" />
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2 py-1 border border-ds-border rounded-lg bg-ds-surface hover:bg-ds-surface-hover text-[11px] font-semibold text-ds-text-primary transition-all"
          >
            <Globe size={12} />
            <span>{isAr ? 'English' : 'عربي مصري'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Preview Canvas Frame */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start bg-ds-background/40">
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className={`h-full min-h-[600px] flex flex-col bg-ds-background border border-ds-border-strong rounded-xl shadow-sm transition-all duration-300 overflow-hidden ${
            viewportWidths[viewport]
          }`}
        >
          {/* A. Interactive Simulated Header */}
          <header className={`w-full bg-ds-surface border-b border-ds-border px-4 py-3 flex items-center justify-between ${
            config.headerMenuMode === 'sidebar' ? 'relative' : ''
          }`}>
            {/* Horizontal menu alignment containers */}
            <div className={`flex items-center w-full ${isAr ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
              
              {/* Logo section */}
              <div className={`flex items-center ${config.headerLogoPosition === 'center' ? 'mx-auto' : ''}`}>
                <span className="font-extrabold text-sm tracking-tight text-ds-text-primary flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-ds-primary rounded-full" />
                  {texts.logo}
                </span>
              </div>

              {/* Menu layout (only shown for topbar menu mode) */}
              {config.headerMenuMode === 'topbar' && (
                <nav className={`hidden md:flex items-center gap-5 text-xs font-semibold ${
                  config.headerMenuPosition === 'center' ? 'mx-auto' : config.headerMenuPosition === 'left' ? 'mr-auto' : 'ml-auto'
                }`}>
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-ds-text-muted hover:text-ds-text-primary transition-colors py-1"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
              )}

              {/* Extras/Actions section */}
              <div className="flex items-center gap-3">
                {config.headerShowPhone && (
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-ds-text-muted hover:text-ds-text-primary"
                  >
                    <PhoneCall size={12} className="text-ds-primary" />
                    <span>{texts.phone}</span>
                  </a>
                )}

                {config.headerShowSocials && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Facebook size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                    <Twitter size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                    <Instagram size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                  </div>
                )}

                {config.headerShowCta && (
                  <button className="bg-ds-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                    {texts.cta}
                  </button>
                )}

                {/* Sidebar toggle button (shown in sidebar menu mode or small devices) */}
                {(config.headerMenuMode === 'sidebar' || viewport !== 'desktop') && (
                  <button
                    onClick={() => setActiveMenuOpen(!activeMenuOpen)}
                    className="p-1 rounded hover:bg-ds-surface-hover text-ds-text-primary md:hidden"
                  >
                    <span className="sr-only">Toggle menu</span>
                    <div className="w-5 h-4 flex flex-col justify-between items-end">
                      <span className="w-full h-0.5 bg-ds-text-primary rounded" />
                      <span className="w-4/5 h-0.5 bg-ds-text-primary rounded" />
                      <span className="w-3/5 h-0.5 bg-ds-text-primary rounded" />
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar menu panel layer */}
            {config.headerMenuMode === 'sidebar' && (
              <div className="hidden md:flex absolute top-full left-0 w-64 h-[calc(100vh-80px)] bg-ds-surface border-r border-ds-border z-40 p-4 flex-col justify-between">
                <nav className="flex flex-col gap-2.5">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs font-semibold text-ds-text-muted hover:text-ds-text-primary transition-colors py-2 px-3 hover:bg-ds-surface-hover rounded-xl block"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
                <div className="border-t border-ds-border pt-4 space-y-3">
                  {config.headerShowPhone && (
                    <div className="text-[11px] font-semibold text-ds-text-primary flex items-center gap-2 px-3">
                      <PhoneCall size={12} className="text-ds-primary" />
                      <span>{texts.phone}</span>
                    </div>
                  )}
                  {config.headerShowCta && (
                    <button className="w-full bg-ds-primary text-white text-xs font-bold py-2 rounded-xl">
                      {texts.cta}
                    </button>
                  )}
                </div>
              </div>
            )}
          </header>

          {/* B. Simulated Body / Interactive Hero and Forms */}
          <main className="flex-1 flex flex-col">
            
            {/* Hero style picker */}
            <section className={`px-6 py-14 flex flex-col justify-center bg-ds-surface-subtle border-b border-ds-border relative ${
              config.heroStyle === 'centered' ? 'text-center items-center' : 'text-start'
            }`}>
              {config.heroStyle === 'video' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-ds-primary/10 via-transparent to-transparent z-0 opacity-80" />
              )}

              <div className={`max-w-2xl space-y-4 z-10 ${config.heroStyle === 'centered' ? 'mx-auto' : ''}`}>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-ds-primary/15 text-ds-primary border border-ds-primary/20">
                  {t('Introducing Nezam', 'نقدم لكم نظام')}
                </span>
                
                <h1 className={`text-2xl font-extrabold tracking-tight text-ds-text-primary leading-tight ${
                  config.typography === 'serif' ? 'font-serif' : 'font-sans'
                }`}>
                  {texts.heroTitle}
                </h1>
                
                <p className="text-xs text-ds-text-muted leading-relaxed">
                  {texts.heroSubtitle}
                </p>

                <div className={`flex items-center gap-3 pt-2 ${config.heroStyle === 'centered' ? 'justify-center' : ''}`}>
                  <button className="bg-ds-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-1">
                    <span>{texts.cta}</span>
                    <ArrowRight size={12} className={isAr ? 'rotate-180' : ''} />
                  </button>
                  <button className="border border-ds-border hover:bg-ds-surface-hover text-ds-text-primary text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                    {t('Learn More', 'اعرف أكتر')}
                  </button>
                </div>
              </div>
            </section>

            {/* Form layout preview */}
            <section className="px-6 py-12 bg-ds-background flex flex-col items-center">
              <div className="max-w-md w-full border border-ds-border rounded-2xl bg-ds-surface p-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-bold text-ds-text-primary">{texts.formTitle}</h3>
                  <p className="text-[11px] text-ds-text-muted mt-0.5">{texts.formSub}</p>
                </div>

                <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-ds-text-muted">{texts.inputName}</label>
                    <input
                      type="text"
                      className={`w-full text-xs bg-ds-surface-subtle text-ds-text-primary px-3 py-2 outline-none transition-colors border ${
                        config.formStyle === 'minimal'
                          ? 'border-0 border-b border-ds-border focus:border-ds-primary rounded-none'
                          : 'border-ds-border focus:border-ds-primary rounded-lg'
                      }`}
                      placeholder={t('Ahmed Ali', 'أحمد علي')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-ds-text-muted">{texts.inputEmail}</label>
                    <input
                      type="email"
                      className={`w-full text-xs bg-ds-surface-subtle text-ds-text-primary px-3 py-2 outline-none transition-colors border ${
                        config.formStyle === 'minimal'
                          ? 'border-0 border-b border-ds-border focus:border-ds-primary rounded-none'
                          : 'border-ds-border focus:border-ds-primary rounded-lg'
                      }`}
                      placeholder="ahmed@nezam.app"
                    />
                  </div>

                  <button className="w-full bg-ds-primary text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-opacity">
                    {texts.formSubmit}
                  </button>
                </form>
              </div>
            </section>
          </main>

          {/* C. Simulated Footer Layout */}
          <footer className="w-full bg-ds-surface border-t border-ds-border p-6 mt-auto">
            {config.footerStyle === 'big' ? (
              <div className="space-y-6">
                <div className={`grid grid-cols-2 md:grid-cols-${config.footerColumns || 3} gap-4`}>
                  {/* Nezam info brand column */}
                  <div className="col-span-2 md:col-span-1 space-y-2">
                    <span className="font-extrabold text-sm text-ds-text-primary">{texts.logo}</span>
                    <p className="text-[10px] text-ds-text-muted leading-relaxed">
                      {t('Premium Egyptian Design framework.', 'إطار عمل تصميم فاخر للشركات المصرية.')}
                    </p>
                    {config.footerShowPhone && (
                      <div className="text-[10px] font-semibold text-ds-text-primary flex items-center gap-1.5">
                        <PhoneCall size={10} className="text-ds-primary" />
                        <span>{texts.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Column blocks */}
                  {Array.from({ length: (config.footerColumns || 3) - 1 }).map((_, idx) => {
                    const colNames = [texts.colProducts, texts.colCompany, texts.colResources, texts.colLegal]
                    const colName = colNames[idx % colNames.length]
                    return (
                      <div key={idx} className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ds-text-primary">{colName}</span>
                        <ul className="space-y-1 text-[10px] text-ds-text-muted font-medium">
                          <li><a href="#" className="hover:text-ds-primary">Link One</a></li>
                          <li><a href="#" className="hover:text-ds-primary">Link Two</a></li>
                          <li><a href="#" className="hover:text-ds-primary">Link Three</a></li>
                        </ul>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-ds-border/60 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-[10px] text-ds-text-muted">{texts.copyright}</span>
                  {config.footerShowSocials && (
                    <div className="flex items-center gap-3">
                      <Facebook size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                      <Twitter size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                      <Instagram size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[10px] text-ds-text-muted">{texts.copyright}</span>
                <div className="flex items-center gap-4">
                  {config.footerShowPhone && (
                    <span className="text-[10px] text-ds-text-muted font-semibold">{texts.phone}</span>
                  )}
                  {config.footerShowSocials && (
                    <div className="flex items-center gap-3">
                      <Facebook size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                      <Twitter size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                      <Instagram size={12} className="text-ds-text-muted hover:text-ds-primary cursor-pointer" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </footer>
        </div>
      </div>
    </div>
  )
}
