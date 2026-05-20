'use client'
import React from 'react'
import { Phone, Share2, ChevronDown, X, Search, Bell, User } from 'lucide-react'
import { websiteContent, radiusClassMap } from './config'
import type { TemplateConfig } from '@/lib/store/session.store'
import type { WebsiteType, RadiusScale, TopBarTheme } from './config'

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
}

export default function PreviewCanvas({
  templateConfig, websiteType, showTopBar, topBarText, topBarTheme,
  radius, lang, t, fontStack, buttonStyle = 'solid', buttonWeight = 'semibold', inputVariant = 'outlined',
}: Props) {
  const [megaOpen, setMegaOpen] = React.useState(false)
  const content = websiteContent[websiteType]
  const rc = radiusClassMap[radius]

  const isDark = templateConfig.colorProfile !== 'light'
  const pageBg  = isDark ? '#0a0a0f' : '#f8fafc'
  const hdrBg   = isDark ? 'rgba(10,10,18,0.96)' : 'rgba(255,255,255,0.97)'
  const hdrBorder = isDark ? 'border-b border-white/[0.06]' : 'border-b border-slate-200'
  const textMain = isDark ? 'text-slate-100' : 'text-slate-900'
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500'
  const cardBg   = isDark ? 'bg-white/5 border border-white/[0.08]' : 'bg-white border border-slate-200 shadow-sm'
  const urlBg    = isDark ? 'bg-slate-950/70 border border-white/[0.08]' : 'bg-slate-100 border border-slate-200'
  const navHover = isDark ? 'hover:text-orange-400' : 'hover:text-orange-600'

  const fontFamily = fontStack ?? '"Inter", system-ui, sans-serif'

  const bwCls = buttonWeight === 'normal' ? 'font-normal' : buttonWeight === 'medium' ? 'font-medium'
    : buttonWeight === 'bold' ? 'font-bold' : buttonWeight === 'black' ? 'font-black' : 'font-semibold'

  const btnStyle: Record<string, string> = {
    solid:   'bg-orange-500 text-white hover:bg-orange-600',
    outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10',
    ghost:   'text-orange-500 hover:bg-orange-500/10',
    soft:    'bg-orange-500/15 text-orange-400 hover:bg-orange-500/20',
  }
  const btnCls = `${btnStyle[buttonStyle] ?? btnStyle.solid} ${bwCls} transition-all`

  const inputStyle: Record<string, string> = {
    outlined:  `border border-slate-300 dark:border-slate-700 ${rc}`,
    underline: 'border-b border-slate-400 rounded-none',
    filled:    `bg-slate-100 dark:bg-slate-800 border-0 ${rc}`,
    soft:      `bg-orange-500/8 border border-orange-400/20 ${rc}`,
  }
  const inputCls = `w-full py-1.5 px-2 text-[10px] bg-transparent focus:outline-none transition-colors ${inputStyle[inputVariant] ?? inputStyle.outlined}`

  const topBarCls = {
    orange: 'bg-orange-500 text-white',
    slate:  isDark ? 'bg-slate-900 text-slate-300 border-b border-white/[0.06]' : 'bg-slate-800 text-slate-200',
    cyan:   'bg-cyan-500 text-white',
  }[topBarTheme] ?? 'bg-orange-500 text-white'

  const padX = templateConfig.spacing === 'compact' ? 'px-4' : 'px-6'
  const padY = templateConfig.spacing === 'compact' ? 'py-2.5' : 'py-3.5'
  const secPad = templateConfig.spacing === 'compact' ? 'px-6 py-10' : 'px-8 py-14'

  const navItems = lang === 'ar' ? content.navAr : content.nav
  const logoPos  = templateConfig.headerLogoPosition
  const menuPos  = templateConfig.headerMenuPosition

  const Logo = () => (
    <div className={`flex items-center gap-1.5 shrink-0 ${logoPos === 'center' ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>
      <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white text-[9px] font-black shadow-sm">N</span>
      <span className="text-[11px] font-black text-orange-500 tracking-tight">NEZAM</span>
    </div>
  )

  const PrimaryBtn = ({ label, size = 'sm' }: { label: string; size?: 'xs' | 'sm' }) => (
    <button className={`${rc} ${btnCls} ${size === 'xs' ? 'px-2.5 py-1 text-[9px]' : 'px-3 py-1.5 text-[10px]'}`}>{label}</button>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily }}>
      {/* ── Browser chrome ── */}
      <div className={`shrink-0 flex items-center gap-3 px-3 py-2.5 ${isDark ? 'bg-[#0f1015] border-b border-white/[0.06]' : 'bg-slate-100 border-b border-slate-200'}`}>
        <div className="flex gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className={`flex-1 flex items-center gap-1.5 ${urlBg} rounded-md px-2.5 py-1 text-[10px] ${textMuted}`}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span className="flex-1 truncate">nezam.eg / {websiteType} — preview</span>
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-semibold">Live</span>
          </span>
        </div>
        <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          <Search size={10} />
          <Bell size={10} />
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="flex-1 overflow-y-auto flex flex-col" style={{ backgroundColor: pageBg }}>

        {/* Top announcement */}
        {showTopBar && (
          <div className={`shrink-0 flex items-center justify-between px-4 py-1.5 text-[9px] font-semibold ${topBarCls}`}>
            <span className="truncate">{topBarText}</span>
            <button className="shrink-0 ml-2 opacity-70 hover:opacity-100 flex items-center"><X size={11} /></button>
          </div>
        )}

        {/* ── Sidebar layout ── */}
        {templateConfig.headerStyle === 'sidebar' ? (
          <div className="flex flex-1 min-h-0">
            <aside className={`w-44 shrink-0 flex flex-col gap-0.5 p-4 ${hdrBorder} ${isDark ? 'bg-[#0a0a0f]' : 'bg-white'} border-r`}>
              <Logo />
              <div className="mt-5 space-y-0.5">
                {navItems.map((item, i) => (
                  <a key={item} href="#" className={`block text-[10px] font-medium px-2 py-1.5 rounded-md transition-colors ${
                    i === 0 ? 'bg-orange-500/10 text-orange-500' : `${textMuted} ${navHover}`
                  }`}>{item}</a>
                ))}
              </div>
              <div className="mt-auto pt-4 space-y-2">
                {templateConfig.headerShowPhone && (
                  <div className={`flex items-center gap-1 text-[9px] ${textMuted}`}><Phone size={9} className="text-orange-500" /><span>+20 100 123</span></div>
                )}
                {templateConfig.headerShowCta && <PrimaryBtn label={t('Get Started', 'ابدأ')} size="xs" />}
              </div>
            </aside>
            <div className="flex-1 overflow-y-auto">
              <HeroSection content={content} heroStyle={templateConfig.heroStyle} rc={rc} secPad={secPad} isDark={isDark} textMuted={textMuted} t={t} lang={lang} PrimaryBtn={PrimaryBtn} cardBg={cardBg} />
              <FormSection cfg={templateConfig} content={content} rc={rc} isDark={isDark} cardBg={cardBg} lang={lang} t={t} inputCls={inputCls} PrimaryBtn={PrimaryBtn} textMuted={textMuted} />
            </div>
          </div>
        ) : (
          <>
            {/* ── Top header ── */}
            <header className="sticky top-0 z-20 shrink-0 backdrop-blur-md" style={{ backgroundColor: hdrBg }}>
              <div className={`${hdrBorder} border-b`} />
              <div className={`flex items-center ${padX} ${padY} gap-4 max-w-6xl mx-auto relative`}>
                <div className={`${logoPos === 'right' ? 'order-last ml-auto' : logoPos === 'center' ? 'order-2' : 'order-first'}`}>
                  <Logo />
                </div>

                {templateConfig.headerMenuMode === 'topbar' ? (
                  <nav className={`flex items-center gap-4 ${menuPos === 'right' ? 'order-last ml-auto' : menuPos === 'center' ? 'order-2 mx-auto' : 'order-2'}`}>
                    {templateConfig.headerStyle === 'mega' && (
                      <div className="relative">
                        <button onClick={() => setMegaOpen(v => !v)}
                          className={`flex items-center gap-0.5 text-[10px] font-semibold transition-colors ${navHover} ${textMuted}`}>
                          {navItems[0]} <ChevronDown size={9} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {megaOpen && (
                          <div className={`absolute top-full mt-2 left-0 w-56 p-3.5 rounded-xl border shadow-xl z-30 grid grid-cols-2 gap-2 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/60'}`}>
                            {['Design Suite', 'Token Studio', 'Canvas', 'Assets'].map(x => (
                              <a key={x} href="#" className={`text-[9px] font-semibold py-1 transition-colors ${navHover} ${textMuted}`}>{x}</a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {navItems.slice(templateConfig.headerStyle === 'mega' ? 1 : 0).map((item, i) => (
                      <a key={item} href="#" className={`text-[10px] font-semibold transition-colors ${i === 0 && templateConfig.headerStyle !== 'mega' ? 'text-orange-500' : `${textMuted} ${navHover}`}`}>{item}</a>
                    ))}
                  </nav>
                ) : (
                  <button className="order-last ml-auto flex flex-col gap-[3px] p-1">
                    {[0,0,0].map((_, i) => (
                      <span key={i} className={`block h-[2px] ${isDark ? 'bg-slate-300' : 'bg-slate-700'} transition-all ${i === 1 ? 'w-4' : 'w-5'}`} />
                    ))}
                  </button>
                )}

                <div className="flex items-center gap-2 order-last ml-auto">
                  {templateConfig.headerShowPhone && (
                    <a href="#" className={`hidden sm:flex items-center gap-1 text-[9px] font-semibold transition-colors ${navHover} ${textMuted}`}>
                      <Phone size={9} className="text-orange-400" /> +20 100 123
                    </a>
                  )}
                  {templateConfig.headerShowSocials && <Share2 size={11} className={`${textMuted} hover:text-orange-500 cursor-pointer transition-colors`} />}
                  <div className={`w-6 h-6 rounded-full bg-ds-primary/20 flex items-center justify-center ${textMuted}`}><User size={10} /></div>
                  {templateConfig.headerShowCta && <PrimaryBtn label={t('Get Started', 'ابدأ الآن')} size="xs" />}
                </div>
              </div>
            </header>

            <HeroSection content={content} heroStyle={templateConfig.heroStyle} rc={rc} secPad={secPad} isDark={isDark} textMuted={textMuted} t={t} lang={lang} PrimaryBtn={PrimaryBtn} cardBg={cardBg} />
            <FeatureStrip isDark={isDark} textMuted={textMuted} cardBg={cardBg} rc={rc} t={t} websiteType={websiteType} />
            <FormSection cfg={templateConfig} content={content} rc={rc} isDark={isDark} cardBg={cardBg} lang={lang} t={t} inputCls={inputCls} PrimaryBtn={PrimaryBtn} textMuted={textMuted} />
          </>
        )}

        {/* ── Footer ── */}
        <footer className={`shrink-0 border-t ${isDark ? 'border-white/[0.06] bg-[#050508]' : 'border-slate-200 bg-slate-50'}`}>
          {templateConfig.footerStyle === 'simple' ? (
            <div className={`flex items-center justify-between ${padX} py-4 text-[9px] font-medium ${textMuted}`}>
              <span>&copy; 2026 NEZAM &mdash; Cairo Dev Hub</span>
              <div className="flex items-center gap-3">
                {templateConfig.footerShowPhone && <span className="flex items-center gap-1"><Phone size={8} className="text-orange-400" />+20 100 123</span>}
                {templateConfig.footerShowSocials && <Share2 size={9} className="hover:text-orange-500 transition-colors cursor-pointer" />}
              </div>
            </div>
          ) : (
            <div className={`${padX} py-8 space-y-6`}>
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${templateConfig.footerColumns}, 1fr)` }}>
                {['Products', 'Resources', 'Company', 'Support', 'Legal'].slice(0, templateConfig.footerColumns).map(col => (
                  <div key={col} className="space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-orange-400">{col}</div>
                    {['Overview', 'Features', 'Pricing', 'Docs'].map(l => (
                      <a key={l} href="#" className={`block text-[9px] ${textMuted} hover:text-orange-400 transition-colors`}>{l}</a>
                    ))}
                  </div>
                ))}
              </div>
              <div className={`flex items-center justify-between pt-5 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'} text-[9px] font-medium ${textMuted}`}>
                <span>&copy; 2026 NEZAM Cairo Developer Suite</span>
                <div className="flex items-center gap-3">
                  {templateConfig.footerShowPhone && <span className="flex items-center gap-1"><Phone size={8} className="text-orange-400" />+20 100 123</span>}
                  {templateConfig.footerShowSocials && <Share2 size={9} className="hover:text-orange-400 transition-colors cursor-pointer" />}
                </div>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}

// ── Hero ────────────────────────────────────────────────────────────────────
function HeroSection({ content, heroStyle, rc, secPad, isDark, textMuted, t, lang, PrimaryBtn, cardBg }: any) {
  const title = lang === 'ar' ? content.titleAr : content.title
  const desc  = lang === 'ar' ? content.descAr  : content.desc
  const tag   = lang === 'ar' ? content.tagAr   : content.tag
  const cta   = lang === 'ar' ? content.ctaAr   : content.cta
  const Tag   = () => <span className="inline-block text-[8px] font-black uppercase tracking-widest text-orange-400 px-2 py-0.5 bg-orange-500/10 rounded-full">{tag}</span>

  if (heroStyle === 'split') return (
    <section className={`${secPad} grid md:grid-cols-2 gap-10 items-center`}>
      <div className="space-y-4">
        <Tag />
        <h1 className="text-lg font-black leading-tight">{title}</h1>
        <p className={`text-[11px] leading-relaxed ${textMuted}`}>{desc}</p>
        <div className="flex gap-2 pt-1">
          <PrimaryBtn label={cta} />
          <button className={`px-3 py-1.5 ${rc} border border-slate-300 dark:border-white/20 text-[10px] font-semibold transition-colors ${textMuted} hover:text-orange-500`}>{t('Learn More', 'اعرف المزيد')}</button>
        </div>
      </div>
      <div className={`p-5 ${rc} ${cardBg} space-y-3`}>
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-black text-orange-400 font-mono">NEZAM_NODE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          {[75, 55, 88].map((w, i) => (
            <div key={i}>
              <div className="flex justify-between text-[8px] mb-0.5"><span className={textMuted}>Worker {i + 1}</span><span className={textMuted}>{w}%</span></div>
              <div className={`h-1.5 ${rc} bg-orange-500/15`}><div className={`h-full ${rc} bg-orange-500`} style={{ width: `${w}%` }} /></div>
            </div>
          ))}
        </div>
        <div className={`text-[8px] font-medium ${textMuted}`}>Cairo Swarm &middot; 3 workers &middot; 14ms avg</div>
      </div>
    </section>
  )

  if (heroStyle === 'video') return (
    <section className={`relative flex items-center justify-center text-center ${secPad} overflow-hidden bg-[#070711]`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14),transparent_70%)]" />
      <div className="relative z-10 space-y-4 max-w-lg">
        <Tag />
        <h1 className="text-2xl font-black leading-tight text-white">{title}</h1>
        <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
        <PrimaryBtn label={cta} />
      </div>
    </section>
  )

  return (
    <section className={`flex flex-col items-center justify-center text-center ${secPad} space-y-4`}>
      <Tag />
      <h1 className="text-xl font-black leading-tight max-w-md">{title}</h1>
      <p className={`text-[11px] leading-relaxed max-w-sm ${textMuted}`}>{desc}</p>
      <div className="flex gap-2.5 pt-1">
        <PrimaryBtn label={cta} />
        <button className={`px-3 py-1.5 ${rc} border border-slate-300 dark:border-white/20 text-[10px] font-semibold ${textMuted} hover:text-orange-500 transition-colors`}>{t('Learn More', 'اعرف المزيد')}</button>
      </div>
    </section>
  )
}

// ── Feature strip (shows below hero to fill the canvas) ────────────────────
function FeatureStrip({ isDark, textMuted, cardBg, rc, t, websiteType }: any) {
  const features: Record<string, { icon: string; label: string }[]> = {
    saas:      [{ icon: '⬡', label: 'AI Automation' }, { icon: '⬡', label: 'Multi-tenant' }, { icon: '⬡', label: 'Global CDN' }],
    ecommerce: [{ icon: '⬡', label: 'Fast Checkout' }, { icon: '⬡', label: 'Inventory Sync' }, { icon: '⬡', label: 'Smart Shipping' }],
    agency:    [{ icon: '⬡', label: 'Brand Design' }, { icon: '⬡', label: 'Dev Sprints' }, { icon: '⬡', label: 'SEO Boost' }],
    portfolio: [{ icon: '⬡', label: 'Case Studies' }, { icon: '⬡', label: 'Lab Projects' }, { icon: '⬡', label: 'Open Source' }],
    default:   [{ icon: '⬡', label: 'Core Feature' }, { icon: '⬡', label: 'Analytics' }, { icon: '⬡', label: 'Integrations' }],
  }
  const items = features[websiteType] ?? features.default
  return (
    <div className={`grid grid-cols-3 gap-3 px-8 pb-10`}>
      {items.map(({ label }) => (
        <div key={label} className={`p-4 ${rc} ${cardBg} space-y-2`}>
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <span className="w-3 h-3 rounded-sm bg-orange-500/60 block" />
          </div>
          <div className="text-[10px] font-bold">{label}</div>
          <div className={`text-[9px] leading-relaxed ${textMuted}`}>{t('Seamlessly integrated into your workflow.', 'متكامل بسلاسة مع سير عملك.')}</div>
        </div>
      ))}
    </div>
  )
}

// ── Form section ────────────────────────────────────────────────────────────
function FormSection({ cfg, content, rc, isDark, cardBg, lang, t, inputCls, PrimaryBtn, textMuted }: any) {
  return (
    <div className="flex justify-center px-8 pb-10">
      <div className={`w-full max-w-xs p-5 ${rc} ${cardBg} space-y-4`}>
        <div className={`text-[10px] font-semibold uppercase tracking-wider ${textMuted} border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-200'} pb-2.5`}>
          {t('Quick Enquiry', 'استفسار سريع')}
        </div>
        <div className="space-y-3.5">
          {[
            { label: lang === 'ar' ? 'الاسم الكامل' : 'Full Name', val: 'Ahmed Hassan' },
            { label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', val: 'ahmed@nezam.eg' },
          ].map(({ label, val }) => (
            <div key={label}>
              <label className={`text-[9px] font-semibold ${textMuted} block mb-1`}>{label}</label>
              <input readOnly defaultValue={val} className={inputCls} />
            </div>
          ))}
        </div>
        <PrimaryBtn label={lang === 'ar' ? 'إرسال' : 'Submit Enquiry'} />
      </div>
    </div>
  )
}
