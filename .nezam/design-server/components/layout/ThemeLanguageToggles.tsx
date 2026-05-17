'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Globe, Lock, Images } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'

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

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={openAssetManager}
        className="flex items-center gap-2 px-3 py-1.5 bg-ds-surface hover:bg-ds-surface-hover text-ds-text-primary text-sm font-medium rounded-lg transition-all border border-ds-border active:scale-95"
        title={lang === 'ar' ? 'افتح مدير الملفات' : 'Open Asset Manager'}
      >
        <Images size={14} className="text-ds-text-muted" />
        <span className="text-[11px]">{lang === 'ar' ? 'الأصول' : 'Assets'}</span>
      </button>

      {/* Language Switcher */}
      <button
        onClick={toggleLang}
        className="flex items-center gap-2 px-3 py-1.5 bg-ds-surface hover:bg-ds-surface-hover text-ds-text-primary text-sm font-medium rounded-lg transition-all border border-ds-border active:scale-95"
        title={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      >
        <Globe size={14} className="text-ds-text-muted" />
        <span className="text-[11px] tracking-wider">{lang === 'en' ? 'EN' : 'AR'}</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 bg-ds-surface hover:bg-ds-surface-hover text-ds-text-primary rounded-lg transition-all border border-ds-border active:scale-95"
        title={theme === 'dark' ? (lang === 'ar' ? 'الوضع المضيء' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
      >
        {theme === 'dark' ? (
          <Sun size={14} className="text-ds-text-muted hover:text-ds-text-primary transition-colors" />
        ) : (
          <Moon size={14} className="text-ds-text-muted hover:text-ds-text-primary transition-colors" />
        )}
      </button>

      {/* Help Button */}
      <button className="hidden sm:flex px-3 py-1.5 bg-ds-surface hover:bg-ds-surface-hover text-ds-text-primary text-[11px] font-medium rounded-lg transition-all border border-ds-border active:scale-95">
        {lang === 'ar' ? 'مساعدة' : 'Help'}
      </button>

      {/* Lock & Export Button */}
      <button className="px-3 py-1.5 bg-ds-primary hover:bg-ds-primary/90 text-white text-[11px] font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-ds-primary/20 active:scale-95">
        <Lock size={12} />
        <span>{lang === 'ar' ? 'قفل وتصدير' : 'Lock & Export'}</span>
      </button>
    </div>
  )
}
