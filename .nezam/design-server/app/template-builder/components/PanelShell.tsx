'use client'

import React from 'react'
import { Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSessionStore } from '@/lib/store/session.store'
import { PT } from './panel-primitives'

interface PanelShellProps {
  children: React.ReactNode
  collapsed?: boolean
  onCollapse?: () => void
}

export default function PanelShell({ children, collapsed, onCollapse }: PanelShellProps) {
  const { theme, setTheme, lang, setLang } = useSessionStore()

  return (
    <div className="flex flex-col h-full" style={{ background: PT.bg }}>
      {/* Shell top bar */}
      <div
        className="shrink-0 h-8 flex items-center justify-end gap-1 px-2 border-b"
        style={{ borderColor: PT.border }}
      >
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/[0.06]"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ color: PT.textMuted }}
        >
          {theme === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
        </button>

        {/* Locale toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="h-6 px-1.5 flex items-center rounded text-[9px] font-bold uppercase transition-colors hover:bg-white/[0.06]"
          title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          style={{ color: PT.textMuted }}
        >
          {lang === 'en' ? 'AR' : 'EN'}
        </button>

        {/* Collapse toggle */}
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/[0.06]"
            title={collapsed ? 'Expand panel' : 'Collapse panel'}
            aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
            style={{ color: PT.textMuted }}
          >
            {collapsed ? <ChevronLeft size={11} /> : <ChevronRight size={11} />}
          </button>
        )}
      </div>

      {/* Panel content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
