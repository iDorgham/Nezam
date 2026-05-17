'use client'

import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import ConsolePanel from '@/components/layout/ConsolePanel'
import ThemeLanguageToggles from '@/components/layout/ThemeLanguageToggles'
import TabRouter from '@/components/layout/TabRouter'
import ActiveTabLabel from '@/components/layout/ActiveTabLabel'
import { useSessionStore } from '@/lib/store/session.store'
import { useEffect, useState } from 'react'
import AssetManagerOverlay from '@/components/layout/AssetManagerOverlay'
import OnboardingTour from '@/components/onboarding/OnboardingTour'
import { TooltipProvider } from '@/components/ui/Tooltip'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { lang, theme, hydratePreferences } = useSessionStore()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const [tourSignal, setTourSignal] = useState(0)

  useEffect(() => {
    hydratePreferences()
  }, [hydratePreferences])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.documentElement.setAttribute('data-theme', theme)
  }, [lang, dir, theme])

  useEffect(() => {
    const handler = () => setTourSignal((n) => n + 1)
    window.addEventListener('nezam-ds:restart-tour', handler)
    return () => window.removeEventListener('nezam-ds:restart-tour', handler)
  }, [])

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <title>NEZAM Design Server</title>
        <meta name="description" content="Human-in-the-Loop design decision engine" />
      </head>
      <body className="bg-ds-background text-ds-text-primary min-h-screen font-sans flex overflow-hidden antialiased">
        <TooltipProvider delayDuration={200}>
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            {/* Topbar */}
            <header
              className="h-14 border-b border-ds-border flex items-center justify-between px-4 bg-ds-background shrink-0 z-30"
              aria-label={t('Workspace toolbar', 'شريط أدوات مساحة العمل')}
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-ds-text-muted">{t('Workspace', 'مساحة العمل')}</span>
                <span className="text-ds-text-disabled">/</span>
                <ActiveTabLabel />
              </div>
              <div className="flex items-center gap-2" data-tour="topbar-toggles">
                <ThemeLanguageToggles />
              </div>
            </header>

            <main className="flex-1 overflow-auto pb-10 bg-ds-background">
              <TabRouter>{children}</TabRouter>
            </main>
            <ConsolePanel />
            <AssetManagerOverlay />
          </div>
          <OnboardingTour key={tourSignal} forceOpen={tourSignal > 0} />
        </TooltipProvider>
      </body>
    </html>
  )
}
