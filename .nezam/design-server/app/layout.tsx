import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import ConsolePanel from '@/components/layout/ConsolePanel'
import ThemeLanguageToggles from '@/components/layout/ThemeLanguageToggles'
import TabRouter from '@/components/layout/TabRouter'
import ActiveTabLabel from '@/components/layout/ActiveTabLabel'

export const metadata: Metadata = {
  title: 'NEZAM Design Server',
  description: 'Human-in-the-Loop design decision engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-ds-background text-ds-text-primary min-h-screen font-sans flex">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Toolbar */}
          <div className="h-14 border-b border-ds-border flex items-center justify-between px-4 bg-ds-surface shrink-0">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-ds-text-muted">Workspace</span>
              <span className="text-white/20">/</span>
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
