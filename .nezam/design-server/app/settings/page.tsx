'use client'

import { useSessionStore } from '@/lib/store/session.store'
import { restartOnboarding } from '@/components/onboarding/OnboardingTour'
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip'
import { Sun, Moon, Languages, PlayCircle, Sparkles } from 'lucide-react'

export default function SettingsPage() {
  const { lang, setLang, theme, setTheme } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const applyTheme = (next: 'light' | 'dark') => {
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch {}
  }

  const applyLang = (next: 'en' | 'ar') => {
    setLang(next)
    try { localStorage.setItem('lang', next) } catch {}
    document.documentElement.setAttribute('lang', next)
    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr')
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-8 max-w-3xl mx-auto space-y-6 text-ds-text-primary">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">{t('Settings', 'الإعدادات')}</h1>
          <p className="text-sm text-ds-text-muted mt-1">
            {t('Manage your workspace preferences.', 'إدارة تفضيلات مساحة العمل.')}
          </p>
        </header>

        <section className="bg-ds-surface border border-ds-border rounded-ds-lg overflow-hidden divide-y divide-ds-border">
          {/* Language */}
          <SettingsRow
            icon={<Languages className="w-4 h-4 text-ds-text-muted" />}
            title={t('Language', 'اللغة')}
            description={t('Workspace language. Affects UI labels and AI prompts.', 'لغة مساحة العمل. تؤثر على الواجهة وطلبات الذكاء الاصطناعي.')}
          >
            <SegmentedControl
              options={[
                { value: 'en', label: 'English' },
                { value: 'ar', label: 'العربية' },
              ]}
              value={lang}
              onChange={(v) => applyLang(v as 'en' | 'ar')}
            />
          </SettingsRow>

          {/* Theme */}
          <SettingsRow
            icon={theme === 'dark' ? <Moon className="w-4 h-4 text-ds-text-muted" /> : <Sun className="w-4 h-4 text-ds-text-muted" />}
            title={t('Theme', 'السمة')}
            description={t('Switch between light and dark mode.', 'بدّل بين الفاتح والداكن.')}
          >
            <SegmentedControl
              options={[
                { value: 'light', label: t('Light', 'فاتح') },
                { value: 'dark', label: t('Dark', 'داكن') },
              ]}
              value={theme}
              onChange={(v) => applyTheme(v as 'light' | 'dark')}
            />
          </SettingsRow>

          {/* Onboarding */}
          <SettingsRow
            icon={<PlayCircle className="w-4 h-4 text-ds-text-muted" />}
            title={t('Onboarding tour', 'الجولة التعريفية')}
            description={t('Replay the welcome tour. Useful when something is unclear.', 'أعد تشغيل الجولة التعريفية في أي وقت.')}
          >
            <Tooltip content={t('Replay tour now', 'أعد الجولة الآن')} side="left">
              <button
                onClick={restartOnboarding}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-ds-md bg-ds-primary text-ds-primary-foreground text-xs font-semibold hover:bg-ds-primary-hover transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('Restart tour', 'إعادة الجولة')}
              </button>
            </Tooltip>
          </SettingsRow>
        </section>

        <p className="text-[11px] text-ds-text-muted">
          {t(
            'Preferences are persisted to localStorage and applied on every page load.',
            'يتم حفظ التفضيلات في localStorage وتطبيقها مع كل تحميل.'
          )}
        </p>
      </div>
    </TooltipProvider>
  )
}

function SettingsRow({
  icon,
  title,
  description,
  children,
}: {
  icon?: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="p-5 flex items-center justify-between gap-6">
      <div className="flex items-start gap-3 min-w-0">
        {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-ds-text-primary">{title}</h3>
          <p className="text-xs text-ds-text-muted mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 rounded-ds-md bg-ds-surface-elevated border border-ds-border">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'px-3 h-7 rounded-ds-sm text-xs font-medium transition-colors',
              active
                ? 'bg-ds-primary text-ds-primary-foreground'
                : 'text-ds-text-muted hover:text-ds-text-primary',
            ].join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
