'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, Globe, Lock } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'

export default function ThemeLanguageToggles() {
  const [theme, setTheme] = useState('dark')
  const { lang, setLang } = useSessionStore()

  useEffect(() => {
    // Check initial theme from document
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark'
    setTheme(currentTheme)
    
    // Check initial lang from document
    const currentLang = document.documentElement.getAttribute('lang') || 'en'
    setLang(currentLang)
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
    document.documentElement.setAttribute('lang', newLang)
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
  }

  return (
    <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
      {/* Language Switcher */}
      <button
        onClick={toggleLang}
        className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] text-ds-text-primary text-sm font-medium rounded-lg transition-colors border border-white/[0.05]"
        title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        <Globe size={16} className="text-[#8a8f98]" />
        <span>{lang === 'en' ? 'EN' : 'AR'}</span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 bg-white/[0.03] hover:bg-white/[0.08] text-ds-text-primary rounded-lg transition-colors border border-white/[0.05]"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun size={16} className="text-[#8a8f98] hover:text-ds-text-primary transition-colors" />
        ) : (
          <Moon size={16} className="text-[#8a8f98] hover:text-ds-text-primary transition-colors" />
        )}
      </button>

      {/* Help Button */}
      <button className="px-3 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] text-ds-text-primary text-sm font-medium rounded-lg transition-colors border border-white/[0.05]">
        {lang === 'ar' ? 'مساعدة' : 'Help'}
      </button>

      {/* Lock & Export Button */}
      <button className="px-3 py-1.5 bg-[#FF5701] hover:bg-[#e04e00] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5">
        <Lock size={14} />
        <span>{lang === 'ar' ? 'قفل وتصدير' : 'Lock & Export'}</span>
      </button>
    </div>
  )
}
