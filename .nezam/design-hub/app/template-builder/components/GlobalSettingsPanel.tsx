'use client'

import React, { useState } from 'react'
import { Globe, Copy, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { PT, PanelHeader, PanelSection, PanelField, PanelInput, PanelToggle, PanelButton, PanelBadge } from './panel-primitives'

type Env = 'dev' | 'staging' | 'production'
type Role = 'owner' | 'editor' | 'viewer'

interface Integration {
  name: string
  status: 'connected' | 'disconnected' | 'error'
}

const MOCK_API_KEY = 'nzm_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')

const ENV_COLORS: Record<Env, string> = {
  dev:        '#a78bfa',
  staging:    '#f59e0b',
  production: '#22c55e',
}

const STATUS_ICON: Record<Integration['status'], React.ReactNode> = {
  connected:    <CheckCircle size={10} style={{ color: '#22c55e' }} />,
  disconnected: <XCircle size={10} style={{ color: '#71717a' }} />,
  error:        <AlertTriangle size={10} style={{ color: '#ef4444' }} />,
}

const ROLES: Role[] = ['owner', 'editor', 'viewer']
const ROLE_LABELS: Record<Role, string> = { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' }

const INITIAL_INTEGRATIONS: Integration[] = [
  { name: 'Stripe', status: 'connected' },
  { name: 'Mailchimp', status: 'disconnected' },
  { name: 'Google Analytics 4', status: 'connected' },
  { name: 'HubSpot', status: 'error' },
]

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

export default function GlobalSettingsPanel({ lang }: { lang: string }) {
  const t = (en: string, ar: string) => lang === 'ar' ? ar : en

  const [siteName, setSiteName] = useState('My NEZAM Site')
  const [logoUrl, setLogoUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')
  const [env, setEnv] = useState<Env>('dev')
  const [roleToggles, setRoleToggles] = useState<Record<Role, boolean>>({ owner: true, editor: true, viewer: false })
  const [keyCopied, setKeyCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  function copyKey() {
    copyToClipboard(MOCK_API_KEY)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2000)
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function reset() {
    if (!resetConfirm) { setResetConfirm(true); return }
    setSiteName('My NEZAM Site')
    setLogoUrl('')
    setFaviconUrl('')
    setEnv('dev')
    setRoleToggles({ owner: true, editor: true, viewer: false })
    setResetConfirm(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      <PanelHeader
        icon={<Globe size={12} />}
        title={t('Global Settings', 'الإعدادات العامة')}
        subtitle={t('Site · Roles · Integrations', 'الموقع · الأدوار · التكاملات')}
        actions={
          saved ? <PanelBadge color="green">{t('Saved', 'محفوظ')}</PanelBadge> : undefined
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Site Identity */}
        <PanelSection title={t('Site Identity', 'هوية الموقع')} defaultOpen>
          <PanelField label={t('Site Name', 'اسم الموقع')} row={false}>
            <PanelInput value={siteName} onChange={setSiteName} placeholder="My Site" />
          </PanelField>

          <PanelField label={t('Logo URL', 'رابط الشعار')} row={false}>
            <PanelInput value={logoUrl} onChange={setLogoUrl} placeholder="https://…/logo.svg" />
          </PanelField>

          <PanelField label={t('Favicon', 'الأيقونة المفضلة')} row={false}>
            <div className="flex items-center gap-2">
              <PanelInput value={faviconUrl} onChange={setFaviconUrl} placeholder="https://…/favicon.png" />
              {faviconUrl && (
                <div className="w-4 h-4 rounded border shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ borderColor: PT.border, background: PT.bgElevated }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faviconUrl} alt="favicon preview" className="w-full h-full object-cover" />
                </div>
              )}
              {!faviconUrl && (
                <div className="w-4 h-4 rounded border shrink-0" style={{ borderColor: PT.border, background: PT.bgElevated }} />
              )}
            </div>
          </PanelField>
        </PanelSection>

        {/* Environment */}
        <PanelSection title={t('Environment', 'البيئة')} defaultOpen={false}>
          <div className="flex gap-1.5">
            {(['dev', 'staging', 'production'] as Env[]).map(e => (
              <button
                key={e}
                onClick={() => setEnv(e)}
                className="flex-1 py-1.5 text-[9px] font-bold uppercase rounded border transition-all capitalize"
                style={{
                  background: env === e ? ENV_COLORS[e] + '20' : PT.surface,
                  borderColor: env === e ? ENV_COLORS[e] : PT.border,
                  color: env === e ? ENV_COLORS[e] : PT.textMuted,
                }}
                aria-pressed={env === e}
              >
                {t(e.charAt(0).toUpperCase() + e.slice(1), e)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[9px]"
            style={{ background: ENV_COLORS[env] + '10', borderColor: ENV_COLORS[env] + '30', color: ENV_COLORS[env] }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ENV_COLORS[env] }} />
            {t('Active environment', 'البيئة النشطة')}: <strong>{env}</strong>
          </div>
        </PanelSection>

        {/* Roles */}
        <PanelSection title={t('Access Roles', 'أدوار الوصول')} defaultOpen={false}>
          <div className="space-y-1">
            {ROLES.map(role => (
              <div key={role} className="flex items-center justify-between px-2.5 py-2 rounded-md border"
                style={{ background: PT.surface, borderColor: PT.border }}>
                <div>
                  <div className="text-[10px] font-medium" style={{ color: PT.textPrimary }}>
                    {t(ROLE_LABELS[role], ROLE_LABELS[role])}
                  </div>
                  <div className="text-[8px]" style={{ color: PT.textMuted }}>
                    {role === 'owner' && t('Full control — cannot be disabled', 'تحكم كامل — لا يمكن تعطيله')}
                    {role === 'editor' && t('Can edit pages and content', 'يمكنه تعديل الصفحات والمحتوى')}
                    {role === 'viewer' && t('Read-only access to all content', 'وصول للقراءة فقط')}
                  </div>
                </div>
                <div className="shrink-0">
                  {role === 'owner' ? (
                    <PanelBadge color="primary">{t('Always on', 'دائمًا')}</PanelBadge>
                  ) : (
                    <button
                      onClick={() => setRoleToggles(prev => ({ ...prev, [role]: !prev[role] }))}
                      className="relative inline-flex items-center"
                      style={{ width: 32, height: 18 }}
                      aria-label={`Toggle ${role} role`}
                      title={`Toggle ${role} role`}
                    >
                      <span className="w-full h-full rounded-full transition-colors"
                        style={{ background: roleToggles[role] ? 'var(--ds-primary)' : PT.border }} />
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-white transition-all"
                        style={{ [roleToggles[role] ? 'right' : 'left']: 2, top: 2 }} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PanelSection>

        {/* Integrations */}
        <PanelSection title={t('Integrations', 'التكاملات')} defaultOpen={false}>
          <div className="space-y-1">
            {INITIAL_INTEGRATIONS.map(int => (
              <div key={int.name} className="flex items-center justify-between px-2.5 py-2 rounded-md border"
                style={{ background: PT.surface, borderColor: PT.border }}>
                <div className="flex items-center gap-2">
                  {STATUS_ICON[int.status]}
                  <span className="text-[10px] font-medium" style={{ color: PT.textPrimary }}>{int.name}</span>
                </div>
                <PanelBadge color={int.status === 'connected' ? 'green' : int.status === 'error' ? 'red' : 'default'}>
                  {int.status}
                </PanelBadge>
              </div>
            ))}
          </div>
        </PanelSection>

        {/* API Key */}
        <PanelSection title={t('API Key', 'مفتاح API')} defaultOpen={false}>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border font-mono text-[8px]"
            style={{ background: PT.bgElevated, borderColor: PT.border, color: PT.textMuted }}>
            <span className="flex-1 truncate">{MOCK_API_KEY.slice(0, 28)}…</span>
          </div>
          <PanelButton size="sm" variant="ghost" fullWidth icon={<Copy size={10} />} onClick={copyKey}>
            {keyCopied ? t('Copied ✓', 'تم النسخ ✓') : t('Copy API Key', 'نسخ مفتاح API')}
          </PanelButton>
        </PanelSection>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-3 py-2 border-t flex items-center gap-2" style={{ borderColor: PT.border }}>
        <PanelButton variant="primary" size="sm" fullWidth onClick={save}>
          {saved ? t('Saved ✓', 'تم الحفظ ✓') : t('Save Changes', 'حفظ التغييرات')}
        </PanelButton>
        <PanelButton
          variant={resetConfirm ? 'danger' : 'ghost'}
          size="sm"
          onClick={reset}
        >
          {resetConfirm ? t('Confirm?', 'تأكيد؟') : t('Reset', 'إعادة')}
        </PanelButton>
      </div>
    </div>
  )
}
