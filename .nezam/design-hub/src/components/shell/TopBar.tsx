'use client'

import { Network, Palette, Eye, Download, RotateCcw, Sun, Moon, Layers, Puzzle, LayoutTemplate, ArrowRight } from 'lucide-react'
import { useHub, type HubSection, type DesignSubTab, HUB_VERSION } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import { PREMIUM_ICON, PREMIUM_MOTION, PREMIUM_SPACE, PREMIUM_TYPE } from '@/lib/design/premium-standards'

const SECTIONS: { id: HubSection; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'architecture', label: 'Architecture',  Icon: Network },
  { id: 'wireframes',   label: 'Wireframes',   Icon: LayoutTemplate },
  { id: 'design',       label: 'Design System', Icon: Layers },
  { id: 'components',   label: 'Components',   Icon: Puzzle },
  { id: 'theming',      label: 'Theming',       Icon: Palette },
  { id: 'preview',      label: 'Preview',       Icon: Eye },
]

const SECTION_ORDER: HubSection[] = [
  'architecture',
  'wireframes',
  'design',
  'components',
  'theming',
  'preview',
]

export function TopBar() {
  const section         = useHub((s) => s.section)
  const setSection      = useHub((s) => s.setSection)
  const onboardingReset = useHub((s) => s.onboardingReset)
  const hubTheme        = useHub((s) => s.hubTheme)
  const setHubTheme     = useHub((s) => s.setHubTheme)
  const visitedSections = useHub((s) => s.visitedSections)
  const completedSections = useHub((s) => s.completedSections)
  const lockedAt = useHub((s) => s.lockedAt)
  const setExportPanelOpen = useHub((s) => s.setExportPanelOpen)
  const activeSectionIndex = SECTION_ORDER.findIndex((id) => id === section)
  const progressCount = completedSections.length
  const progressTotal = SECTION_ORDER.length

  function focusSectionTab(nextIndex: number) {
    const bounded = (nextIndex + SECTION_ORDER.length) % SECTION_ORDER.length
    const id = SECTION_ORDER[bounded]
    setSection(id)
    if (typeof document === 'undefined') return
    requestAnimationFrame(() => {
      const btn = document.getElementById(`topbar-tab-${id}`)
      btn?.focus()
    })
  }

  return (
    <header className="shrink-0 border-b border-app-border bg-app-surface backdrop-blur-md">
      <div className="flex h-11 items-center px-4 gap-0">
        {/* Wordmark */}
        <div className="flex items-center gap-2 select-none shrink-0 mr-3">
          <span className="text-sm font-bold text-app-text tracking-tight">Design Hub</span>
          <span className="text-[9.5px] font-semibold text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full tracking-wide">
            {HUB_VERSION}
          </span>
          {lockedAt ? (
            <button
              type="button"
              onClick={() => setExportPanelOpen(true)}
              title="Wireframes locked — open export formats"
              className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-full tracking-wide hover:bg-emerald-500/15 transition-colors"
            >
              Locked
            </button>
          ) : (
            <span
              className="text-[9px] font-medium text-app-subtle/80 px-1 py-0.5"
              title="Wireframes not locked yet"
            >
              Unlocked
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-4 w-px bg-app-border shrink-0 mx-1" />

        {/* Section tabs */}
        {/* Section tabs */}
        <nav className="flex items-center h-11 shrink-0" role="tablist" aria-label="Design Hub sections">
          {SECTIONS.map(({ id, label, Icon }) => {
            const active = section === id
            const tooltip = id === 'architecture' ? 'Map visual sitemaps, establish page routes, and configure backend microservices'
                          : id === 'wireframes' ? 'Create per-page wireframe blocks used for lock + P0 validation'
                          : id === 'design' ? 'Configure design token presets, typography structures, and fluid scaling scales'
                          : id === 'theming' ? 'Apply brand aesthetic presets, color palette swatches, and interface themes'
                          : 'Render interactive device frame previews and download production-ready code tokens'
            return (
              <button
                key={id}
                onClick={() => setSection(id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    focusSectionTab(activeSectionIndex + 1)
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    focusSectionTab(activeSectionIndex - 1)
                  } else if (e.key === 'Home') {
                    e.preventDefault()
                    focusSectionTab(0)
                  } else if (e.key === 'End') {
                    e.preventDefault()
                    focusSectionTab(SECTION_ORDER.length - 1)
                  }
                }}
                id={`topbar-tab-${id}`}
                role="tab"
                aria-selected={active}
                aria-controls={`topbar-panel-${id}`}
                tabIndex={active ? 0 : -1}
                title={tooltip}
                style={{
                  height: PREMIUM_SPACE.tabHeight,
                  fontSize: PREMIUM_TYPE.tabSize,
                  fontWeight: PREMIUM_TYPE.tabWeight,
                  transitionDuration: PREMIUM_MOTION.durationFast,
                  transitionTimingFunction: PREMIUM_MOTION.easingStandard,
                }}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 transition-all rounded-t-md border-b-2 select-none motion-reduce:transition-none',
                  active
                    ? 'border-app-accent text-app-text bg-app-elevated/40'
                    : 'border-transparent text-app-muted hover:text-app-text hover:bg-app-elevated/20 focus-visible:text-app-text',
                )}
              >
                <Icon size={PREMIUM_ICON.tab} className={active ? 'text-app-accent' : ''} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Section progress dots */}
        <div className="ml-auto flex items-center gap-2" title={`${progressCount} of ${progressTotal} workspace phases completed`}>
          <span className="text-[9.5px] text-app-subtle font-medium hidden sm:block">
            {progressCount}/{progressTotal}
          </span>
          {SECTION_ORDER.map((s) => {
            const completed = completedSections.includes(s)
            const visited = visitedSections.includes(s)
            const phaseLabel = s === 'architecture'
              ? 'Architecture'
              : s === 'wireframes'
                ? 'Wireframes'
                : s === 'design'
                  ? 'Design Tokens'
                  : s === 'theming'
                    ? 'Theming'
                    : 'Cinematic Preview'
            return (
              <span
                key={s}
                title={completed
                  ? `Phase completed: You have successfully configured and validated the ${phaseLabel} parameters.`
                  : visited
                    ? `Visited: ${phaseLabel} — finish required actions to mark complete.`
                    : `Upcoming phase: Navigate to ${phaseLabel} to build out the respective workspace layer.`}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-default',
                  completed ? 'w-4 bg-app-accent' : visited ? 'w-3 bg-app-accent/40' : 'w-1.5 bg-app-border',
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
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent transition-colors"
          >
            {hubTheme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
          </button>

          <button
            onClick={onboardingReset}
            title="Re-initialize onboarding walkthrough wizard and workspace configuration guides"
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent transition-colors"
          >
            <RotateCcw size={11} />
          </button>
          {section !== 'preview' ? (
            <button
              onClick={() => {
                if (section === 'architecture') setSection('wireframes')
                else if (section === 'wireframes') setSection('design')
                else if (section === 'design') setSection('components')
                else if (section === 'components') setSection('theming')
                else if (section === 'theming') setSection('preview')
              }}
              title={`Proceed to next phase: Configure ${section === 'architecture' ? 'Wireframe Blocks' : section === 'wireframes' ? 'Design System Scales' : section === 'design' ? 'Component Library' : section === 'components' ? 'Interface Mode & Color Presets' : 'Interactive Device Viewports'}`}
              className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active transition-colors duration-100 select-none animate-in fade-in"
            >
              Next
              <ArrowRight size={11} />
            </button>
          ) : null}
          <button
            onClick={() => setExportPanelOpen(true)}
            title="Download design tokens, CSS variables, wireframes, and 12 export formats"
            className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-elevated text-app-text border border-app-border hover:bg-app-elevated/80 active:scale-[0.99] transition-colors duration-100 select-none"
          >
            <Download size={11} />
            Export
          </button>
        </div>
      </div>
    </header>
  )
}
