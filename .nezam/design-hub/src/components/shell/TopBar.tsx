'use client'

import { Network, Palette, Eye, Puzzle, ArrowUpRight, Check, RotateCcw } from 'lucide-react'
import { useHub, type HubSection } from '@/store/hub.store'
import { cn } from '@/lib/utils'

const SECTIONS: { id: HubSection; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'architecture', label: 'Architecture', Icon: Network },
  { id: 'design',       label: 'Design System', Icon: Palette },
  { id: 'preview',      label: 'Preview',       Icon: Eye },
  { id: 'components',   label: 'Components',    Icon: Puzzle },
]

// ─── Progress steps for the workflow bar ──────────────────────────────────────

const PROGRESS_STEPS: {
  id: HubSection
  label: string
  checkFn: (s: ReturnType<typeof useHub.getState>) => boolean
}[] = [
  {
    id: 'architecture',
    label: 'Architecture',
    checkFn: (s) => Object.keys(s.arch.pages).length > 0,
  },
  {
    id: 'design',
    label: 'Design',
    checkFn: (s) => s.design.activeProfileId !== null,
  },
  {
    id: 'preview',
    label: 'Preview',
    checkFn: (s) => s.visitedSections.includes('preview'),
  },
  {
    id: 'components',
    label: 'Components',
    checkFn: (s) => s.visitedSections.includes('components'),
  },
]

export function TopBar() {
  const section          = useHub((s) => s.section)
  const setSection       = useHub((s) => s.setSection)
  const arch             = useHub((s) => s.arch)
  const design           = useHub((s) => s.design)
  const visitedSections  = useHub((s) => s.visitedSections)
  const onboardingReset  = useHub((s) => s.onboardingReset)

  const storeSnap = { arch, design, visitedSections } as ReturnType<typeof useHub.getState>

  const stepResults  = PROGRESS_STEPS.map((step) => step.checkFn(storeSnap))
  const completedCount = stepResults.filter(Boolean).length
  const progressPct  = Math.round((completedCount / PROGRESS_STEPS.length) * 100)

  return (
    <header className="shrink-0 border-b border-app-border bg-app-surface">
      {/* ── Main nav row ── */}
      <div className="flex h-11 items-center px-4 gap-4">
        {/* Wordmark */}
        <div className="flex items-center gap-2 select-none shrink-0">
          <span className="text-sm font-bold text-app-text tracking-tight">Design Hub</span>
          <span className="text-[9.5px] font-semibold text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full tracking-wide">
            v5
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
                  active
                    ? 'text-app-text'
                    : 'text-app-muted hover:text-app-text',
                )}
              >
                <Icon size={13} className={active ? 'text-app-accent' : ''} />
                {label}
                {/* Bottom border accent for active tab */}
                {active && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full bg-app-accent" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Reset onboarding (dev helper) */}
          <button
            onClick={onboardingReset}
            title="Re-run onboarding"
            className="flex items-center justify-center h-6 w-6 rounded-app-sm text-app-subtle hover:text-app-muted hover:bg-app-elevated transition-colors"
          >
            <RotateCcw size={11} />
          </button>
          <ExportButton />
        </div>
      </div>

      {/* ── Workflow progress bar ── */}
      <WorkflowProgress
        steps={PROGRESS_STEPS}
        results={stepResults}
        progressPct={progressPct}
        activeSection={section}
        onStep={(id) => setSection(id)}
      />
    </header>
  )
}

// ─── Workflow progress ────────────────────────────────────────────────────────

function WorkflowProgress({
  steps,
  results,
  progressPct,
  activeSection,
  onStep,
}: {
  steps: typeof PROGRESS_STEPS
  results: boolean[]
  progressPct: number
  activeSection: HubSection
  onStep(id: HubSection): void
}) {
  return (
    <div className="flex items-center gap-0 border-t border-app-border/50 bg-app-bg px-4" style={{ height: '28px' }}>
      {/* Completion label */}
      <span className="text-[10px] font-semibold text-app-subtle mr-3 shrink-0 select-none">
        {progressPct === 100 ? '✓ Ready' : `${progressPct}%`}
      </span>

      {/* Steps */}
      <div className="flex items-center gap-0 flex-1">
        {steps.map((step, i) => {
          const done    = results[i]
          const active  = activeSection === step.id
          const isLast  = i === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step pill */}
              <button
                onClick={() => onStep(step.id)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150 select-none shrink-0',
                  active
                    ? 'text-app-text bg-app-elevated'
                    : done
                    ? 'text-app-accent/80 hover:text-app-accent hover:bg-app-elevated/50'
                    : 'text-app-subtle hover:text-app-muted hover:bg-app-elevated/50',
                )}
              >
                {done ? (
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full"
                    style={{ background: 'var(--app-success)', boxShadow: '0 0 6px rgba(45,157,120,0.4)' }}
                  >
                    <Check size={8} className="text-white" />
                  </span>
                ) : (
                  <span
                    className={cn(
                      'flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[8px] font-bold',
                      active
                        ? 'border-app-accent text-app-accent bg-app-accent-subtle'
                        : 'border-app-border text-app-subtle',
                    )}
                  >
                    {i + 1}
                  </span>
                )}
                {step.label}
              </button>

              {/* Connector track */}
              {!isLast && (
                <div className="flex-1 h-px mx-1.5 rounded-full overflow-hidden bg-app-border">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: done ? '100%' : '0%',
                      background: 'var(--app-success)',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Overall thin fill bar on the far right */}
      <div className="ml-3 shrink-0 flex items-center gap-1.5">
        <div className="w-24 h-1 rounded-full overflow-hidden bg-app-border">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: progressPct === 100
                ? 'var(--app-success)'
                : 'linear-gradient(90deg, var(--app-accent), #7c3aed)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Export button ────────────────────────────────────────────────────────────

function ExportButton() {
  const setSection = useHub((s) => s.setSection)
  return (
    <button
      onClick={() => setSection('preview')}
      className="flex items-center gap-1.5 h-7 px-3 rounded-app-sm text-[11px] font-semibold bg-app-accent text-app-on-accent hover:bg-app-accent-hover active:bg-app-accent-active transition-colors duration-100 select-none"
    >
      <ArrowUpRight size={12} />
      Export
    </button>
  )
}
