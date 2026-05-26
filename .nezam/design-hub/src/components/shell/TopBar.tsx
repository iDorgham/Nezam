'use client'

import { Network, Palette, Eye, Download, RotateCcw, Sun, Moon } from 'lucide-react'
import { useHub, type HubSection, HUB_VERSION } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const SECTIONS: { id: HubSection; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'architecture', label: 'Architecture',  Icon: Network },
  { id: 'design',       label: 'Design System', Icon: Palette },
  { id: 'preview',      label: 'Preview',       Icon: Eye },
]

const SECTION_ORDER: HubSection[] = ['architecture', 'design', 'preview']

export function TopBar() {
  const section         = useHub((s) => s.section)
  const setSection      = useHub((s) => s.setSection)
  const onboardingReset = useHub((s) => s.onboardingReset)
  const hubTheme        = useHub((s) => s.hubTheme)
  const setHubTheme     = useHub((s) => s.setHubTheme)
  const visitedSections = useHub((s) => s.visitedSections)

  return (
    <header className="shrink-0 border-b border-app-border bg-app-surface bg-app-surface/90 backdrop-blur-md">
      <div className="flex h-11 items-center px-4 gap-4">
        {/* Wordmark */}
        <div className="flex items-center gap-2 select-none shrink-0">
          <span className="text-sm font-bold text-app-text tracking-tight">Design Hub</span>
          <span className="text-[9.5px] font-semibold text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full tracking-wide">
            {HUB_VERSION}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-app-border" />

        {/* Section tabs */}
        <nav className="flex items-center gap-0.5 h-11">
          {SECTIONS.map(({ id, label, Icon }) => {
            const active = section === id
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={cn(
                  'relative flex items-center gap-1.5 h-full px-3 text-[11px] font-medium transition-colors duration-100 select-none',
                  active ? 'text-app-text' : 'text-app-muted hover:text-app-text',
                )}
              >
                <Icon size={13} className={active ? 'text-app-accent' : ''} />
                {label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-app-accent" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Section progress dots */}
        <div className="ml-auto flex items-center gap-2" title={`${visitedSections.length}/3 sections visited`}>
          <span className="text-[9.5px] text-app-subtle font-medium hidden sm:block">
            {visitedSections.length}/3
          </span>
          {SECTION_ORDER.map((s) => {
            const visited = visitedSections.includes(s)
            return (
              <span
                key={s}
                title={`${s}${visited ? ' ✓' : ''}`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-default',
                  visited ? 'w-4 bg-app-accent' : 'w-1.5 bg-app-border',
                )}
              />
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Hub theme switcher toggle */}
          <button
            onClick={() => setHubTheme(hubTheme === 'light' ? 'dark' : 'light')}
            title={`Switch to ${hubTheme === 'light' ? 'dark' : 'light'} mode`}
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated transition-colors"
          >
            {hubTheme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
          </button>

          <button
            onClick={onboardingReset}
            title="Re-run onboarding"
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated transition-colors"
          >
            <RotateCcw size={11} />
          </button>
          <button
            onClick={() => setSection('design')}
            title="Go to Design > Tokens to export"
            className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active transition-colors duration-100 select-none"
          >
            <Download size={11} />
            Export
          </button>
        </div>
      </div>
    </header>
  )
}
