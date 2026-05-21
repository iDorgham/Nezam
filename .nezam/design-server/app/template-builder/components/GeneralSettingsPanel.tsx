'use client'
import React, { useState } from 'react'
import {
  Settings2, Globe, BarChart3, Search, Link2, Share2,
  Eye, Lock, Bell, Palette, Code2, Database,
  CheckCircle2, AlertCircle, Info,
} from 'lucide-react'

interface GeneralSettingsPanelProps {
  lang: string
  t: (en: string, ar: string) => string
}

type SettingsTab = 'seo' | 'domain' | 'analytics' | 'security' | 'social' | 'advanced'

const SETTING_TABS: { id: SettingsTab; icon: React.ReactNode; label: string; labelAr: string }[] = [
  { id: 'seo',      icon: <Search   size={10}/>, label: 'SEO',       labelAr: 'SEO'        },
  { id: 'domain',   icon: <Globe    size={10}/>, label: 'Domain',    labelAr: 'النطاق'     },
  { id: 'analytics',icon: <BarChart3 size={10}/>,label: 'Analytics', labelAr: 'الإحصائيات'},
  { id: 'security', icon: <Lock     size={10}/>, label: 'Security',  labelAr: 'الأمان'    },
  { id: 'social',   icon: <Share2   size={10}/>, label: 'Social',    labelAr: 'السوشيال'  },
  { id: 'advanced', icon: <Code2    size={10}/>, label: 'Advanced',  labelAr: 'متقدم'     },
]

export default function GeneralSettingsPanel({ lang, t }: GeneralSettingsPanelProps) {
  const [tab, setTab] = useState<SettingsTab>('seo')
  const [siteTitle,    setSiteTitle]    = useState('NEZAM — Smart Website Builder')
  const [metaDesc,     setMetaDesc]     = useState('Build stunning Egyptian-first websites with AI-powered design intelligence.')
  const [keywords,     setKeywords]     = useState('NEZAM, website builder, Egypt, Cairo, design system')
  const [ogTitle,      setOgTitle]      = useState('')
  const [domain,       setDomain]       = useState('nezam.eg')
  const [customDomain, setCustomDomain] = useState('')
  const [gaId,         setGaId]         = useState('')
  const [fbPixel,      setFbPixel]      = useState('')
  const [hotjarId,     setHotjarId]     = useState('')
  const [sslEnabled,   setSslEnabled]   = useState(true)
  const [robotsEnabled,setRobotsEnabled]= useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [twitterHandle, setTwitterHandle] = useState('@nezam_eg')
  const [linkedinUrl,  setLinkedinUrl]  = useState('')
  const [headScript,   setHeadScript]   = useState('')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2e2e30] shrink-0 flex items-center gap-2">
        <Settings2 size={11} className="text-ds-primary" />
        <span className="text-[10px] font-semibold text-[#a1a1a6]">{t('General Settings', 'الإعدادات العامة')}</span>
      </div>

      {/* Tab pills row */}
      <div className="px-2 pt-2 pb-1 shrink-0 flex gap-1 overflow-x-auto scrollbar-none">
        {SETTING_TABS.map(st => (
          <button
            key={st.id}
            onClick={() => setTab(st.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-semibold whitespace-nowrap transition-all shrink-0 ${
              tab === st.id
                ? 'bg-ds-primary/15 text-ds-primary border border-ds-primary/30'
                : 'text-[#636366] border border-[#2e2e30] hover:text-[#a1a1a6] hover:border-[#3a3a3c]'
            }`}
          >
            {st.icon}
            {t(st.label, st.labelAr)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* ── SEO ── */}
        {tab === 'seo' && (
          <div className="space-y-3">
            <Notice type="info" msg={t('Changes apply to all pages unless overridden.', 'التغييرات تنطبق على كل الصفحات.')} />
            <Field label={t('Site Title', 'عنوان الموقع')} hint="~60 chars">
              <input value={siteTitle} onChange={e => setSiteTitle(e.target.value)}
                className={inputCls} placeholder="My Awesome Site — Egypt" />
              <ProgressBar value={siteTitle.length} max={60} />
            </Field>
            <Field label={t('Meta Description', 'وصف التعريف')} hint="~155 chars">
              <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={2}
                className={`${inputCls} resize-none`} />
              <ProgressBar value={metaDesc.length} max={155} />
            </Field>
            <Field label={t('Keywords', 'الكلمات المفتاحية')}>
              <input value={keywords} onChange={e => setKeywords(e.target.value)} className={inputCls} />
            </Field>
            <Field label={t('OG / Social Title', 'عنوان السوشيال (OG)')}>
              <input value={ogTitle} onChange={e => setOgTitle(e.target.value)}
                placeholder={t('Same as Site Title', 'نفس عنوان الموقع')} className={inputCls} />
            </Field>
            <ToggleRow
              label={t('Search Engine Indexing', 'فهرسة محركات البحث')}
              desc={t('Allow Google/Bing to index your site', 'السماح لجوجل وبينج بفهرسة الموقع')}
              checked={robotsEnabled}
              onChange={setRobotsEnabled}
            />
          </div>
        )}

        {/* ── Domain ── */}
        {tab === 'domain' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-emerald-400">{t('Active Domain', 'النطاق النشط')}</p>
                  <p className="text-[9px] text-[#636366] font-mono">{domain}</p>
                </div>
              </div>
            </div>
            <Field label={t('Custom Domain', 'نطاق مخصص')}>
              <div className="flex gap-1.5">
                <input value={customDomain} onChange={e => setCustomDomain(e.target.value)}
                  placeholder="yourdomain.com" className={`${inputCls} flex-1`} />
                <button className="px-3 text-[9px] font-semibold bg-ds-primary text-white rounded-md hover:opacity-90 transition-all shrink-0">
                  {t('Connect', 'ربط')}
                </button>
              </div>
            </Field>
            <Field label={t('Default Subdomain', 'النطاق الفرعي')}>
              <input value={domain} onChange={e => setDomain(e.target.value)} className={inputCls} />
            </Field>
            <ToggleRow
              label={t('Force HTTPS / SSL', 'تفعيل SSL / HTTPS')}
              desc={t('Redirect all HTTP to HTTPS automatically', 'تحويل كل طلبات HTTP إلى HTTPS')}
              checked={sslEnabled}
              onChange={setSslEnabled}
            />
            <ToggleRow
              label={t('Maintenance Mode', 'وضع الصيانة')}
              desc={t('Show a maintenance page to visitors', 'عرض صفحة صيانة للزوار')}
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
            />
          </div>
        )}

        {/* ── Analytics ── */}
        {tab === 'analytics' && (
          <div className="space-y-3">
            <Notice type="info" msg={t('Paste your tracking IDs below — scripts are injected in <head>.', 'الصق معرفات التتبع أدناه — سيتم حقنها في <head>.')} />
            <Field label="Google Analytics 4 (GA4)" hint="G-XXXXXXXXXX">
              <input value={gaId} onChange={e => setGaId(e.target.value)} className={inputCls} placeholder="G-XXXXXXXXXX" />
            </Field>
            <Field label="Meta Pixel (Facebook)" hint="Pixel ID">
              <input value={fbPixel} onChange={e => setFbPixel(e.target.value)} className={inputCls} placeholder="123456789" />
            </Field>
            <Field label="Hotjar" hint="Site ID">
              <input value={hotjarId} onChange={e => setHotjarId(e.target.value)} className={inputCls} placeholder="1234567" />
            </Field>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {['Mixpanel', 'Plausible', 'PostHog', 'Clarity'].map(tool => (
                <button key={tool} className="text-[9px] text-[#636366] border border-[#2e2e30] rounded-md py-2 hover:border-ds-primary/40 hover:text-ds-primary transition-all">
                  + {tool}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Security ── */}
        {tab === 'security' && (
          <div className="space-y-3">
            <Notice type="info" msg={t('Security settings for your site and CMS access.', 'إعدادات أمان الموقع.')} />
            <ToggleRow label={t('SSL Certificate', 'شهادة SSL')} desc="Let's Encrypt auto-renewed" checked={sslEnabled} onChange={setSslEnabled} />
            <ToggleRow label={t('Force HTTPS', 'إجبار HTTPS')} desc={t('Redirect HTTP → HTTPS', 'تحويل HTTP إلى HTTPS')} checked={true} onChange={() => {}} />
            <ToggleRow label={t('Two-Factor Auth', 'التحقق بخطوتين')} desc={t('Require 2FA for CMS login', 'مطلوب للدخول للوحة التحكم')} checked={false} onChange={() => {}} />
            <ToggleRow label="DDoS Protection" desc="Cloudflare WAF integration" checked={true} onChange={() => {}} />
            <ToggleRow label="Bot Protection" desc="Block scrapers & malicious bots" checked={true} onChange={() => {}} />
          </div>
        )}

        {/* ── Social ── */}
        {tab === 'social' && (
          <div className="space-y-3">
            <Field label="X / Twitter">
              <input value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} className={inputCls} placeholder="@handle" />
            </Field>
            <Field label="LinkedIn">
              <input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} className={inputCls} placeholder="https://linkedin.com/company/..." />
            </Field>
            {['Instagram', 'Facebook', 'YouTube', 'TikTok', 'WhatsApp Business'].map(s => (
              <Field key={s} label={s}>
                <input className={inputCls} placeholder={`${s} URL or handle`} />
              </Field>
            ))}
          </div>
        )}

        {/* ── Advanced ── */}
        {tab === 'advanced' && (
          <div className="space-y-3">
            <Notice type="warn" msg={t('Advanced settings — incorrect code can break your site.', 'إعدادات متقدمة — الكود الخاطئ قد يكسر الموقع.')} />
            <Field label={t('Custom <head> Script', 'سكريبت <head> مخصص')}>
              <textarea
                value={headScript}
                onChange={e => setHeadScript(e.target.value)}
                rows={4}
                className={`${inputCls} resize-none font-mono text-[9px]`}
                placeholder={'<!-- paste your custom scripts here -->'}
              />
            </Field>
            <Field label={t('Custom CSS', 'CSS مخصص')}>
              <textarea rows={3} className={`${inputCls} resize-none font-mono text-[9px]`} placeholder="/* global overrides */" />
            </Field>
            <Field label={t('Redirects', 'إعادة التوجيه')}>
              <textarea rows={2} className={`${inputCls} resize-none font-mono text-[9px]`} placeholder="/old-path → /new-path" />
            </Field>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared micro-components ──────────────────────────────────────────────────

const inputCls = 'w-full bg-[#1c1c1e] border border-[#2e2e30] rounded-md px-2.5 py-1.5 text-[10px] text-[#e1e1e6] placeholder:text-[#48484a] focus:outline-none focus:border-[#636366] transition-colors'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-semibold text-[#8e8e93] uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[8px] text-[#48484a]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  const color = pct < 60 ? '#22c55e' : pct < 90 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      <div className="flex-1 h-0.5 rounded-full bg-[#1c1c1e]">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[7px] font-mono" style={{ color }}>{value}/{max}</span>
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-[#e1e1e6] leading-tight">{label}</p>
        {desc && <p className="text-[8px] text-[#636366] mt-0.5 leading-tight">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-8 h-4 rounded-full transition-all relative shrink-0 ${checked ? 'bg-ds-primary' : 'bg-[#2e2e30]'}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${checked ? 'end-0.5' : 'start-0.5'}`} />
      </button>
    </div>
  )
}

function Notice({ type, msg }: { type: 'info' | 'warn'; msg: string }) {
  const isWarn = type === 'warn'
  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg border ${isWarn ? 'border-amber-500/20 bg-amber-500/5' : 'border-[#2e2e30] bg-[#131314]'}`}>
      {isWarn ? <AlertCircle size={10} className="text-amber-400 mt-0.5 shrink-0" /> : <Info size={10} className="text-[#636366] mt-0.5 shrink-0" />}
      <p className={`text-[9px] leading-relaxed ${isWarn ? 'text-amber-400/80' : 'text-[#636366]'}`}>{msg}</p>
    </div>
  )
}
