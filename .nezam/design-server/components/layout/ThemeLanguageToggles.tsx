'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Globe, Lock } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'

export default function ThemeLanguageToggles() {
  const [theme, setTheme] = useState('dark')
  const { lang, setLang } = useSessionStore()

  useEffect(() => {
    // Check initial theme from document
    const savedTheme = localStorage.getItem('theme')
    const currentTheme = savedTheme || document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(currentTheme)
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme)
    }
    
    // Check initial lang from localStorage
    const savedLang = localStorage.getItem('lang')
    const currentLang = savedLang || document.documentElement.getAttribute('lang') || 'en'
    setLang(currentLang)
    document.documentElement.setAttribute('lang', currentLang)
    document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr')
  }, [setLang])

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

  return (
    <div className="flex items-center gap-3">
      {/* Language Switcher */}
      <button
        onClick={toggleLang}
        className="flex items-center gap-1 px-3 py-1.5 bg-ds-surface hover:bg-ds-surface/80 text-ds-text-primary text-sm font-medium rounded-lg transition-colors border border-ds-border"
        title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        <Globe size={16} className="text-ds-text-muted" />
        <span>{lang === 'en' ? 'EN' : 'AR'}</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 bg-ds-surface hover:bg-ds-surface/80 text-ds-text-primary rounded-lg transition-colors border border-ds-border"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun size={16} className="text-ds-text-muted hover:text-ds-text-primary transition-colors" />
        ) : (
          <Moon size={16} className="text-ds-text-muted hover:text-ds-text-primary transition-colors" />
        )}
      </button>

      {/* Help Button */}
      <button className="px-3 py-1.5 bg-ds-surface hover:bg-ds-surface/80 text-ds-text-primary text-sm font-medium rounded-lg transition-colors border border-ds-border">
        {lang === 'ar' ? 'مساعدة' : 'Help'}
      </button>

      {/* Lock & Export Button */}
      <button className="px-3 py-1.5 bg-ds-primary hover:bg-ds-primary/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5">
        <Lock size={14} />
        <span>{lang === 'ar' ? 'قفل وتصدير' : 'Lock & Export'}</span>
      </button>
    </div>
  )
}
