'use client'
import React, { useState } from 'react'
import {
  Settings2, Globe, Palette, Bell, Shield, Code2,
  AlertTriangle, Info, Upload, Trash2, RotateCcw,
  Database, Plug, Key, Download, ExternalLink,
  Sun, Moon, Languages, LayoutTemplate,
} from 'lucide-react'
import {
  PanelHeader, PanelSection, PanelField, PanelInput, PanelTextarea,
  PanelSelect, PanelToggle, PanelButton, PanelBadge, PT,
} from './panel-primitives'

type AppSettingsTab = 'brand' | 'locale' | 'notifications' | 'integrations' | 'advanced'

const SETTINGS_TABS: { id: AppSettingsTab; icon: React.ReactNode; label: string }[] = [
  { id: 'brand',         icon: <Palette   size={10} />, label: 'Brand'        },
  { id: 'locale',        icon: <Globe     size={10} />, label: 'Locale'       },
  { id: 'notifications', icon: <Bell      size={10} />, label: 'Notifs'       },
  { id: 'integrations',  icon: <Plug      size={10} />, label: 'APIs'         },
  { id: 'advanced',      icon: <Code2     size={10} />, label: 'Advanced'     },
]

interface AppSettingsPanelProps {
  lang: string
  t: (en: string, ar: string) => string
  theme: string
  setTheme: (t: string) => void
}

export default function AppSettingsPanel({ lang, t, theme, setTheme }: AppSettingsPanelProps) {
  const [tab, setTab] = useState<AppSettingsTab>('brand')

  // Brand state
  const [siteName,    setSiteName]    = useState('NEZAM Builder')
  const [tagline,     setTagline]     = useState('Build stunning Egyptian-first websites')
  const [favicon,     setFavicon]     = useState('')
  const [logoUrl,     setLogoUrl]     = useState('')

  // Locale state
  const [locale,      setLocale]      = useState('ar-EG')
  const [dateFormat,  setDateFormat]  = useState('DD/MM/YYYY')
  const [currency,    setCurrency]    = useState('EGP')
  const [rtlEnabled,  setRtlEnabled]  = useState(lang === 'ar')
  const [dualLang,    setDualLang]    = useState(false)

  // Notifications
  const [emailNotifs,  setEmailNotifs]  = useState(true)
  const [buildAlerts,  setBuildAlerts]  = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState(true)

  // Integrations
  const [apiKey, setApiKey] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: PT.bg }}>

      <PanelHeader
        icon={<Settings2 size={11} />}
        title={t('App Settings', 'إعدادات التطبيق')}
        subtitle={t('Global configuration', 'الإعداد العام')}
      />

      {/* Tab bar */}
      <div className="flex gap-0.5 px-2 py-2 shrink-0 overflow-x-auto scrollbar-none"
        style={{ borderBottom: `1px solid ${PT.border}` }}>
        {SETTINGS_TABS.map(st => (
          <button
            key={st.id}
            onClick={() => setTab(st.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[9px] font-semibold whitespace-nowrap transition-all shrink-0"
            style={{
              background: tab === st.id ? 'rgba(6,182,212,0.1)' : 'transparent',
              color: tab === st.id ? PT.primary : PT.textMuted,
              border: `1px solid ${tab === st.id ? PT.primary + '30' : 'transparent'}`,
            }}
          >
            {st.icon}
            {st.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── BRAND ── */}
        {tab === 'brand' && (
          <div className="p-3 space-y-3">
            {/* Logo upload */}
            <div className="flex gap-3 items-start">
              <div className="w-14 h-14 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-ds-primary transition-all shrink-0"
                style={{ borderColor: PT.border, color: PT.textMuted }}>
                <Upload size={14} />
                <span className="text-[7px] mt-1">Logo</span>
              </div>
              <div className="flex-1 space-y-2">
                <PanelField label={t('Site Name', 'اسم الموقع')}>
                  <PanelInput value={siteName} onChange={setSiteName} placeholder="My Brand" />
                </PanelField>
                <PanelField label={t('Tagline', 'الشعار')}>
                  <PanelInput value={tagline} onChange={setTagline} placeholder="Your brand tagline" />
                </PanelField>
              </div>
            </div>

            <PanelField label="Favicon URL" hint="32×32 .ico or .png">
              <PanelInput value={favicon} onChange={setFavicon} placeholder="https://example.com/favicon.ico" />
            </PanelField>

            {/* Theme */}
            <div className="pt-2 border-t" style={{ borderColor: PT.border }}>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: PT.textLabel }}>
                {t('Builder Theme', 'ثيم المحرر')}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'dark',  icon: <Moon size={12} />, label: t('Dark', 'داكن') },
                  { id: 'light', icon: <Sun  size={12} />, label: t('Light', 'فاتح') },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id)
                      document.documentElement.setAttribute('data-theme', opt.id)
                      localStorage.setItem('theme', opt.id)
                    }}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all"
                    style={{
                      borderColor: theme === opt.id ? PT.primary : PT.border,
                      background: theme === opt.id ? 'rgba(6,182,212,0.08)' : PT.bgElevated,
                      color: theme === opt.id ? PT.primary : PT.textSecondary,
                    }}
                  >
                    {opt.icon}
                    <span className="text-[9px] font-semibold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LOCALE ── */}
        {tab === 'locale' && (
          <div className="p-3 space-y-3">
            <div className="p-2.5 rounded-lg border flex items-start gap-2"
              style={{ borderColor: PT.primary + '30', background: 'rgba(6,182,212,0.04)' }}>
              <Info size={11} style={{ color: PT.primary }} className="mt-0.5 shrink-0" />
              <p className="text-[9px] leading-relaxed" style={{ color: PT.textSecondary }}>
                {t('Locale settings control language, date format, and regional defaults for your site.', 'إعدادات اللغة والتنسيق الإقليمي لموقعك.')}
              </p>
            </div>

            <PanelField label={t('Primary Language', 'اللغة الأساسية')}>
              <PanelSelect value={locale} onChange={setLocale} options={[
                { value: 'ar-EG', label: '🇪🇬 Arabic (Egypt — Masri)' },
                { value: 'en-US', label: '🇺🇸 English (US)' },
                { value: 'ar-SA', label: '🇸🇦 Arabic (Saudi)' },
                { value: 'ar-AE', label: '🇦🇪 Arabic (UAE)' },
                { value: 'fr-FR', label: '🇫🇷 French' },
              ]} />
            </PanelField>

            <PanelField label={t('Date Format', 'تنسيق التاريخ')}>
              <PanelSelect value={dateFormat} onChange={setDateFormat} options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (Egyptian)' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
              ]} />
            </PanelField>

            <PanelField label={t('Currency', 'العملة')}>
              <PanelSelect value={currency} onChange={setCurrency} options={[
                { value: 'EGP', label: '🇪🇬 EGP — Egyptian Pound' },
                { value: 'USD', label: '🇺🇸 USD — US Dollar' },
                { value: 'SAR', label: '🇸🇦 SAR — Saudi Riyal' },
                { value: 'AED', label: '🇦🇪 AED — UAE Dirham' },
              ]} />
            </PanelField>

            <div className="pt-2 border-t space-y-1.5" style={{ borderColor: PT.border }}>
              <PanelToggle
                label={t('RTL Layout', 'تخطيط من اليمين لليسار')}
                desc={t('Right-to-left text direction', 'اتجاه النص من اليمين لليسار')}
                checked={rtlEnabled}
                onChange={setRtlEnabled}
              />
              <PanelToggle
                label={t('Dual Language Mode', 'وضع اللغتين')}
                desc={t('Show both Arabic & English content', 'عرض المحتوى بالعربية والإنجليزية')}
                checked={dualLang}
                onChange={setDualLang}
              />
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {tab === 'notifications' && (
          <div className="p-3 space-y-2">
            <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: PT.textLabel }}>
              {t('Email Alerts', 'تنبيهات البريد')}
            </div>
            <PanelToggle label={t('Email Notifications', 'إشعارات البريد')}
              desc={t('Receive build & deploy updates', 'تحديثات البناء والنشر')}
              checked={emailNotifs} onChange={setEmailNotifs} />
            <PanelToggle label={t('Build Alerts', 'تنبيهات البناء')}
              desc={t('Notify on build success or failure', 'عند نجاح أو فشل البناء')}
              checked={buildAlerts} onChange={setBuildAlerts} />
            <PanelToggle label={t('Weekly Report', 'التقرير الأسبوعي')}
              desc={t('Analytics summary every Monday', 'ملخص الإحصائيات كل اثنين')}
              checked={weeklyReport} onChange={setWeeklyReport} />
            <PanelToggle label={t('Security Alerts', 'تنبيهات الأمان')}
              desc={t('Login attempts and suspicious activity', 'محاولات الدخول والأنشطة المشبوهة')}
              checked={securityAlerts} onChange={setSecurityAlerts} />
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {tab === 'integrations' && (
          <div className="p-3 space-y-3">
            <PanelField label={t('NEZAM API Key', 'مفتاح API')} hint="Secret">
              <div className="relative">
                <PanelInput value={apiKey} onChange={setApiKey} placeholder="nzm_sk_xxxxxxxxxxxxxxxx" type="password" />
              </div>
            </PanelField>

            <PanelField label={t('Webhook URL', 'رابط Webhook')}>
              <PanelInput value={webhookUrl} onChange={setWebhookUrl} placeholder="https://your-server.com/webhook" />
            </PanelField>

            <div className="pt-2 border-t" style={{ borderColor: PT.border }}>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: PT.textLabel }}>
                {t('Connected Services', 'الخدمات المرتبطة')}
              </div>
              {[
                { name: 'Google Analytics', connected: true  },
                { name: 'Mailchimp',        connected: false },
                { name: 'Zapier',           connected: false },
                { name: 'Stripe',           connected: false },
                { name: 'Neon Database',    connected: true  },
              ].map(svc => (
                <div key={svc.name} className="flex items-center gap-2 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${svc.connected ? 'bg-emerald-400' : 'bg-[#3a3a3c]'}`} />
                  <span className="flex-1 text-[10px]" style={{ color: svc.connected ? PT.textPrimary : PT.textSecondary }}>
                    {svc.name}
                  </span>
                  <PanelBadge color={svc.connected ? 'green' : 'default'}>
                    {svc.connected ? t('Connected', 'متصل') : t('Connect', 'اتصال')}
                  </PanelBadge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADVANCED ── */}
        {tab === 'advanced' && (
          <div className="p-3 space-y-3">
            <div className="p-2.5 rounded-lg border flex items-start gap-2"
              style={{ borderColor: '#f59e0b30', background: 'rgba(245,158,11,0.05)' }}>
              <AlertTriangle size={11} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[9px] leading-relaxed text-amber-400/80">
                {t('Changes here affect the entire builder application. Proceed with care.', 'التغييرات هنا تؤثر على كامل التطبيق.')}
              </p>
            </div>

            <PanelButton variant="default" size="sm" fullWidth icon={<Download size={10} />}>
              {t('Export Configuration', 'تصدير الإعدادات')}
            </PanelButton>

            <PanelButton variant="default" size="sm" fullWidth icon={<Upload size={10} />}>
              {t('Import Configuration', 'استيراد الإعدادات')}
            </PanelButton>

            <div className="pt-2 border-t space-y-1.5" style={{ borderColor: PT.border }}>
              <div className="text-[9px] font-bold uppercase tracking-widest mb-2 text-red-400">
                {t('Danger Zone', 'منطقة الخطر')}
              </div>
              <PanelButton variant="danger" size="sm" fullWidth icon={<RotateCcw size={10} />}>
                {t('Reset to Defaults', 'إعادة للافتراضي')}
              </PanelButton>
              <PanelButton variant="danger" size="sm" fullWidth icon={<Trash2 size={10} />}>
                {t('Clear All Data', 'حذف كل البيانات')}
              </PanelButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
