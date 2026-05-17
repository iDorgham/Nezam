'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Globe, Lock, Images, HelpCircle } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'
import { Tooltip } from '@/components/ui/Tooltip'
import { restartOnboarding } from '@/components/onboarding/OnboardingTour'

export default function ThemeLanguageToggles() {
  const [hydrated, setHydrated] = useState(false)
  const {
    lang,
    setLang,
    theme,
    setTheme,
    hydratePreferences,
    openAssetManager,
  } = useSessionStore()

  useEffect(() => {
    hydratePreferences()
    setHydrated(true)
  }, [hydratePreferences])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.setAttribute('lang', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
  }

  if (!hydrated) return null

  const btnBase =
    'h-8 px-2.5 inline-flex items-center gap-1.5 rounded-ds-md border border-ds-border bg-ds-surface text-ds-text-primary hover:bg-ds-surface-hover hover:border-ds-border-hover transition-colors text-[11px] font-medium'

  return (
    <div className="flex items-center gap-1.5">
      <Tooltip side="bottom" content={lang === 'ar' ? 'افتح مدير الملفات' : 'Open Asset Manager'}>
        <button onClick={openAssetManager} className={btnBase} aria-label="Asset manager">
          <Images size={14} className="text-ds-text-muted" />
          <span>{lang === 'ar' ? 'الأصول' : 'Assets'}</span>
        </button>
      </Tooltip>

      <Tooltip side="bottom" content={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}>
        <button onClick={toggleLang} className={btnBase} aria-label="Toggle language">
          <Globe size={14} className="text-ds-text-muted" />
          <span className="tracking-wider">{lang === 'en' ? 'EN' : 'AR'}</span>
        </button>
      </Tooltip>

      <Tooltip
        side="bottom"
        content={
          theme === 'dark'
            ? lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode'
            : lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode'
        }
      >
        <button onClick={toggleTheme} className={`${btnBase} px-2`} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </Tooltip>

      <Tooltip side="bottom" content={lang === 'ar' ? 'إعادة الجولة التعريفية' : 'Restart tour'}>
        <button onClick={restartOnboarding} className={`${btnBase} px-2`} aria-label="Restart onboarding">
          <HelpCircle size={14} />
        </button>
      </Tooltip>

      <Tooltip side="bottom" content={lang === 'ar' ? 'قفل وتصدير العقد' : 'Lock & export contract'} shortcut="⌘ ↵">
        <button
          onClick={() => useSessionStore.getState().openTab({ id: 'export', title: lang === 'ar' ? 'تصدير' : 'Export', type: 'export' as any })}
          className="h-8 px-3 inline-flex items-center gap-1.5 rounded-ds-md bg-ds-primary text-ds-primary-foreground text-[11px] font-semibold hover:bg-ds-primary-hover transition-colors shadow-ds-sm"
        >
          <Lock size={12} />
          <span>{lang === 'ar' ? 'قفل وتصدير' : 'Lock & Export'}</span>
        </button>
      </Tooltip>
    </div>
  )
}
