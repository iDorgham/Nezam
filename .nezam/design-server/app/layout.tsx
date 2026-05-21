'use client'

import './globals.css'
import TabRouter from '@/components/layout/TabRouter'
import { useSessionStore } from '@/lib/store/session.store'
import { useEffect } from 'react'
import AssetManagerOverlay from '@/components/layout/AssetManagerOverlay'
import { TooltipProvider } from '@/components/ui/Tooltip'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { lang, theme, hydratePreferences } = useSessionStore()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    hydratePreferences()
  }, [hydratePreferences])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.documentElement.setAttribute('data-theme', theme)
  }, [lang, dir, theme])

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <title>NEZAM Design Server</title>
        <meta name="description" content="All-in-One Website Builder" />
      </head>
      <body className="bg-ds-background text-ds-text-primary font-sans overflow-hidden antialiased" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <TooltipProvider delayDuration={200}>
          {/* Full-height builder — no sidebar, no footer, no breadcrumb header */}
          <main className="flex-1 overflow-hidden min-h-0">
            <TabRouter>{children}</TabRouter>
          </main>
          <AssetManagerOverlay />
        </TooltipProvider>
      </body>
    </html>
  )
}
