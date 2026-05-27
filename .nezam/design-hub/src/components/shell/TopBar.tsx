'use client'

import { Network, Palette, Eye, Download, RotateCcw, Sun, Moon, Layers, Puzzle, LayoutTemplate, ArrowRight } from 'lucide-react'
import { useHub, type HubSection, type DesignSubTab, HUB_VERSION } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const SECTIONS: { id: HubSection; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'architecture', label: 'Architecture',  Icon: Network },
  { id: 'design',       label: 'Design System', Icon: Layers },
  { id: 'theming',      label: 'Theming',       Icon: Palette },
  { id: 'preview',      label: 'Preview',       Icon: Eye },
]

const SECTION_ORDER: HubSection[] = ['architecture', 'design', 'theming', 'preview']

export function TopBar() {
  const section         = useHub((s) => s.section)
  const setSection      = useHub((s) => s.setSection)
  const onboardingReset = useHub((s) => s.onboardingReset)
  const hubTheme        = useHub((s) => s.hubTheme)
  const setHubTheme     = useHub((s) => s.setHubTheme)
  const visitedSections = useHub((s) => s.visitedSections)
  const setExportModalOpen = useHub((s) => s.setExportModalOpen)

  return (
    <header className="shrink-0 border-b border-app-border bg-app-surface backdrop-blur-md">
      <div className="flex h-11 items-center px-4 gap-0">
        {/* Wordmark */}
        <div className="flex items-center gap-2 select-none shrink-0 mr-3">
          <span className="text-sm font-bold text-app-text tracking-tight">Design Hub</span>
          <span className="text-[9.5px] font-semibold text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full tracking-wide">
            {HUB_VERSION}
          </span>
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-app-border shrink-0 mx-1" />

        {/* Section tabs */}
        {/* Section tabs */}
        <nav className="flex items-center h-11 shrink-0">
          {SECTIONS.map(({ id, label, Icon }) => {
            const active = section === id
            const tooltip = id === 'architecture' ? 'Map visual sitemaps, establish page routes, and configure backend microservices'
                          : id === 'design' ? 'Configure design token presets, typography structures, and fluid scaling scales'
                          : id === 'theming' ? 'Apply brand aesthetic presets, color palette swatches, and interface themes'
                          : 'Render interactive device frame previews and download production-ready code tokens'
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                title={tooltip}
                className={cn(
                  'relative flex items-center gap-1.5 h-full px-3 text-[11px] font-medium transition-colors duration-100 select-none',
                  active ? 'text-app-text' : 'text-app-muted hover:text-app-text',
                )}
              >
                <Icon size={12} className={active ? 'text-app-accent' : ''} />
                {label}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full bg-app-accent" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Section progress dots */}
        <div className="ml-auto flex items-center gap-2" title={`${visitedSections.length} of 4 workspace workflow phases fully completed`}>
          <span className="text-[9.5px] text-app-subtle font-medium hidden sm:block">
            {visitedSections.length}/4
          </span>
          {SECTION_ORDER.map((s) => {
            const visited = visitedSections.includes(s)
            const phaseLabel = s === 'architecture' ? 'Architecture' : s === 'design' ? 'Design Tokens' : s === 'theming' ? 'Theming' : 'Cinematic Preview'
            return (
              <span
                key={s}
                title={visited 
                  ? `Phase completed: You have successfully configured and validated the ${phaseLabel} parameters.`
                  : `Upcoming phase: Navigate to ${phaseLabel} to build out the respective workspace layer.`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-default',
                  visited ? 'w-4 bg-app-accent' : 'w-1.5 bg-app-border',
                )}
              />
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={() => setHubTheme(hubTheme === 'light' ? 'dark' : 'light')}
            title={`Toggle workspace visual theme: switch to ${hubTheme === 'light' ? 'dark' : 'light'} color palette mode`}
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated transition-colors"
          >
            {hubTheme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
          </button>

          <button
            onClick={onboardingReset}
            title="Re-initialize onboarding walkthrough wizard and workspace configuration guides"
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated transition-colors"
          >
            <RotateCcw size={11} />
          </button>
          {section !== 'preview' ? (
            <button
              onClick={() => {
                if (section === 'architecture') setSection('design')
                else if (section === 'design') setSection('theming')
                else if (section === 'theming') setSection('preview')
              }}
              title={`Proceed to next phase: Configure ${section === 'architecture' ? 'Design System Scales' : section === 'design' ? 'Interface Mode & Color Presets' : 'Interactive Device Viewports'}`}
              className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active transition-colors duration-100 select-none animate-in fade-in"
            >
              Next
              <ArrowRight size={11} />
            </button>
          ) : (
            <button
              onClick={() => setExportModalOpen(true)}
              title="Launch export options to export W3C tokens JSON, CSS custom variables, NextJS router files, and system presets"
              className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active transition-colors duration-100 select-none animate-in fade-in"
            >
              <Download size={11} />
              Export
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
