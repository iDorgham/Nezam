'use client'

import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import ConsolePanel from '@/components/layout/ConsolePanel'
import ThemeLanguageToggles from '@/components/layout/ThemeLanguageToggles'
import TabRouter from '@/components/layout/TabRouter'
import ActiveTabLabel from '@/components/layout/ActiveTabLabel'
import { useSessionStore } from '@/lib/store/session.store'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { lang } = useSessionStore()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    // Sync attributes with document for hydration and external scripts
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <title>NEZAM Design Server</title>
        <meta name="description" content="Human-in-the-Loop design decision engine" />
      </head>
      <body className="bg-ds-background text-ds-text-primary min-h-screen font-sans flex group overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Toolbar */}
          <div className="h-14 border-b border-ds-border flex items-center justify-between px-4 bg-ds-surface shrink-0 z-40">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-ds-text-muted">{t('Workspace', 'مساحة العمل')}</span>
              <span className="text-ds-text-disabled">/</span>
              <ActiveTabLabel />
            </div>
            <div className="flex items-center gap-2">
              <ThemeLanguageToggles />
            </div>
          </div>
          <main className="flex-1 overflow-auto pb-10">
            <TabRouter>{children}</TabRouter>
          </main>
          <ConsolePanel />
        </div>
      </body>
    </html>
  )
}

