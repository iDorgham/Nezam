'use client'

import { useState, useEffect, useId, type KeyboardEvent } from 'react'
import {
  Network, Palette, Eye, Puzzle, ArrowRight, Check,
  Sparkles, Layers, Globe, Zap, ChevronLeft, Search,
  CheckSquare, Square, Sliders, Info, LayoutTemplate, Package,
} from 'lucide-react'
import { useHub, HUB_VERSION } from '@/store/hub.store'
import { ARCH_PROFILES, ARCH_PROFILES_MAP, ARCH_PROFILE_GROUPS } from '@/data/arch-profiles'
import { DESIGN_PROFILES, DESIGN_PROFILES_MAP } from '@/data/design-profiles'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { ArchProfileId } from '@/types/arch'
import type { DesignProfileId } from '@/types/design'
import { ArchPagePacksPicker } from '@/components/arch/ArchPagePacksPicker'

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Welcome' },
  { label: 'Architecture' },
  { label: 'Design' },
]

// ─── Main onboarding overlay ──────────────────────────────────────────────────

export function Onboarding() {
  const completed          = useHub((s) => s.onboarding.completed)
  const step               = useHub((s) => s.onboarding.step)
  const onboardingSetStep  = useHub((s) => s.onboardingSetStep)
  const onboardingComplete = useHub((s) => s.onboardingComplete)
  const archApplyProfile   = useHub((s) => s.archApplyProfile)
  const designApplyProfile = useHub((s) => s.designApplyProfile)

  const [archChoice, setArchChoice]     = useState<ArchProfileId | null>(null)
  const [designChoice, setDesignChoice] = useState<DesignProfileId | null>(null)
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [pageSearch, setPageSearch] = useState('')

  // Pre-select first architecture profile on mount/step load
  useEffect(() => {
    if (!archChoice && ARCH_PROFILES.length > 0) {
      const defaultId = ARCH_PROFILES[0].id as ArchProfileId
      setArchChoice(defaultId)
      setSelectedPages(ARCH_PROFILES[0].pages.map(p => p.id))
    }
  }, [archChoice])

  // Pre-select first design profile on mount/step load
  useEffect(() => {
    if (!designChoice && DESIGN_PROFILES.length > 0) {
      setDesignChoice(DESIGN_PROFILES[0].id as DesignProfileId)
    }
  }, [designChoice])

  if (completed) return null

  function handleSelectArch(id: ArchProfileId) {
    setArchChoice(id)
    const profile = ARCH_PROFILES_MAP[id]
    if (profile) {
      setSelectedPages(profile.pages.map(p => p.id))
    }
  }

  function handleLaunch() {
    if (archChoice) {
      archApplyProfile(archChoice, selectedPages)
    }
    if (designChoice) {
      designApplyProfile(designChoice)
    }
    onboardingComplete()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto app-scroll">
      {/* Sleek Atlassian dark gradient backdrop */}
      <div
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #202025 0%, #121214 60%, #0c0c0d 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px',
        }}
      />

      {/* Center container */}
      <div className="relative z-10 flex min-h-full w-full items-center justify-center py-6">
        <div className="flex w-full max-w-4xl flex-col px-6 gap-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'linear-gradient(135deg, #0065FF 0%, #855AF2 100%)' }}
              >
                <Layers size={16} className="text-white" />
              </div>
              <span className="text-[14px] font-bold text-white tracking-tight">NEZAM Design Hub</span>
              <span className="text-[9.5px] font-semibold text-white/30 bg-white/5 border border-white/10 px-1.5 py-0.2 rounded-full tracking-wide">
                {HUB_VERSION}
              </span>
            </div>
            
            {/* Progress stepper */}
            <StepperDots step={step} total={STEPS.length} />
          </div>

          {/* Main Card — Fixed Dimensions to eliminate layout jumps */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: '#1E1F22',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              height: '590px', // Strict constant height across all 3 steps
            }}
          >
            {step === 0 && (
              <WelcomeStep
                onNext={() => onboardingSetStep(1)}
                onSkip={handleLaunch}
              />
            )}
            {step === 1 && (
              <ArchStep
                selected={archChoice}
                onSelect={handleSelectArch}
                selectedPages={selectedPages}
                setSelectedPages={setSelectedPages}
                pageSearch={pageSearch}
                setPageSearch={setPageSearch}
                onBack={() => onboardingSetStep(0)}
                onNext={() => onboardingSetStep(2)}
              />
            )}
            {step === 2 && (
              <DesignStep
                selected={designChoice}
                onSelect={setDesignChoice}
                onBack={() => onboardingSetStep(1)}
                onComplete={handleLaunch}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Progress stepper dots ────────────────────────────────────────────────────

function StepperDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => {
        const done    = i < step
        const current = i === step
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[9.5px] font-bold transition-all duration-300',
                done    ? 'bg-blue-600 text-white' :
                current ? 'bg-white/10 text-white ring-1 ring-white/20' :
                          'bg-white/5 text-white/30',
              )}
            >
              {done ? <Check size={10} /> : i + 1}
            </div>
            <span className={cn(
              'text-[10.5px] font-medium transition-colors duration-200',
              current ? 'text-white' : done ? 'text-white/40' : 'text-white/20',
            )}>
              {STEPS[i].label}
            </span>
            {i < total - 1 && (
              <div className={cn('h-px w-6 transition-all duration-300', done ? 'bg-blue-600/40' : 'bg-white/5')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 0 — Welcome ─────────────────────────────────────────────────────────

function WelcomeStep({ onNext, onSkip }: { onNext(): void; onSkip(): void }) {
  const FEATURES = [
    {
      icon: Network,
      color: '#0065FF',
      bg: 'rgba(0, 101, 255, 0.12)',
      title: 'Architecture',
      badge: 'Interactive',
      desc: 'Map visual sitemaps. Design pages, nested groups, and microservices links in real-time.',
    },
    {
      icon: Palette,
      color: '#855AF2',
      bg: 'rgba(133, 90, 242, 0.12)',
      title: 'Design Tokens',
      badge: 'Fully Curated',
      desc: 'Fine-tune dynamic parameters for colors, scales, borders, shadows, and spacing scales.',
    },
    {
      icon: Eye,
      color: '#36B37E',
      bg: 'rgba(54, 179, 126, 0.12)',
      title: 'Cinematic Preview',
      badge: 'Multidevice',
      desc: 'Pixel-perfect live rendering of your tokens inside mobile, tablet, and widescreen dashboard viewports.',
    },
    {
      icon: Puzzle,
      color: '#FFAB00',
      bg: 'rgba(255, 171, 0, 0.12)',
      title: 'Components Hub',
      badge: '80+ Elements',
      desc: 'Interactive elements library matching Atlaskit-standard interfaces and copyable Tailwind codes.',
    },
    {
      icon: Globe,
      color: '#00B8D9',
      bg: 'rgba(0, 184, 217, 0.12)',
      title: 'Presets Catalog',
      badge: 'Full Sections',
      desc: 'Detailed heroes, features, pricing grids, and dashboard templates loaded with المصري Egyptian content.',
    },
    {
      icon: Zap,
      color: '#FF5630',
      bg: 'rgba(255, 86, 48, 0.12)',
      title: 'AI Swarm Ready',
      badge: 'Zero-Lag Handoff',
      desc: 'Export seamless DESIGN.md contracts directly and orchestrate your autonomous NEZAM coding agents.',
    },
  ]

  return (
    <div className="p-8 flex flex-col justify-between h-full">
      {/* Hero Header */}
      <div className="text-center flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 self-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles size={10} />
          Visual Handoff Design Workspace
        </div>
        <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
          Develop with absolute confidence.<br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Perfect code, aligned to your design tokens.
          </span>
        </h1>
        <p className="text-[11.5px] text-white/50 max-w-xl mx-auto leading-relaxed">
          Design Hub connects sitemap pages, variables, and presets directly to your source files. Set up your workspace parameters in under a minute.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-3 my-1">
        {FEATURES.map(({ icon: Icon, color, bg, title, badge, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-2 rounded-xl p-3.5 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg" style={{ background: bg }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: bg, color }}>
                {badge}
              </span>
            </div>
            <div>
              <p className="text-[11.5px] font-bold text-white/95">{title}</p>
              <p className="text-[9.5px] text-white/40 leading-relaxed mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow order strip */}
      <div className="text-center my-1">
        <p className="text-[9.5px] text-white/30">
          Recommended flow:{'  '}
          <span className="text-white/50 font-semibold">Architecture</span>
          <span className="text-white/15 mx-1">→</span>
          <span className="text-white/50 font-semibold">Wireframes</span>
          <span className="text-white/15 mx-1">→</span>
          <span className="text-white/50 font-semibold">Design System</span>
          <span className="text-white/15 mx-1">→</span>
          <span className="text-white/50 font-semibold">Preview</span>
          <span className="text-white/15 mx-1">→</span>
          <span className="text-white/50 font-semibold">Export</span>
        </p>
      </div>

      {/* Centered Actions */}
      <div className="flex items-center gap-3 justify-center border-t border-white/5 pt-4">
        <button
          onClick={onSkip}
          className="text-[11.5px] text-white/40 hover:text-white/70 transition-colors px-4 py-2"
        >
          Skip setup
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-6 h-9 rounded-full text-[11.5px] font-bold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #0065FF 0%, #855AF2 100%)', boxShadow: '0 0 16px rgba(0, 101, 255, 0.3)' }}
        >
          Set up my workspace
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 1 — Architecture with Pages Selector ──────────────────────────────────

interface ArchStepProps {
  selected: ArchProfileId | null
  onSelect(id: ArchProfileId): void
  selectedPages: string[]
  setSelectedPages(ids: string[]): void
  pageSearch: string
  setPageSearch(val: string): void
  onBack(): void
  onNext(): void
}

type ArchSourceTab = 'blueprint' | 'packs'

function ArchStep({
  selected, onSelect, selectedPages, setSelectedPages,
  pageSearch, setPageSearch, onBack, onNext,
}: ArchStepProps) {
  const [sourceTab, setSourceTab] = useState<ArchSourceTab>('blueprint')
  const [sourceSearch, setSourceSearch] = useState('')
  const blueprintPanelId = useId()
  const packsPanelId = useId()

  const activeProfile = selected ? ARCH_PROFILES_MAP[selected] : null
  const sourceQuery = sourceSearch.trim().toLowerCase()

  const blueprintMatchCount = ARCH_PROFILE_GROUPS.reduce((count, group) => {
    return (
      count +
      group.ids.filter((id) => {
        const profile = ARCH_PROFILES_MAP[id]
        if (!profile) return false
        if (!sourceQuery) return true
        return (
          profile.name.toLowerCase().includes(sourceQuery) ||
          profile.description.toLowerCase().includes(sourceQuery)
        )
      }).length
    )
  }, 0)

  function handleSourceTabKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      setSourceTab('packs')
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      setSourceTab('blueprint')
    }
  }
  const pagesList = activeProfile?.pages ?? []

  // Filter pages inside the active sitemap template
  const filteredPages = pagesList.filter(
    (p) =>
      p.name.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.route.toLowerCase().includes(pageSearch.toLowerCase())
  )

  const togglePage = (id: string) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(selectedPages.filter((pid) => pid !== id))
    } else {
      setSelectedPages([...selectedPages, id])
    }
  }

  const toggleAll = () => {
    if (selectedPages.length === pagesList.length) {
      setSelectedPages([])
    } else {
      setSelectedPages(pagesList.map(p => p.id))
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      
      {/* Row: Title & Subtitle */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-3 shrink-0">
        <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">Step 1 of 2</p>
        <h2 className="text-[17px] font-bold text-white tracking-tight">Configure Architecture & Page Routing</h2>
        <p className="text-[11px] text-white/40">
          Pick a template or page pack on the left; choose sitemap routes on the right.
        </p>
      </div>

      <div className="flex flex-1 min-h-0 gap-5 py-3">
        {/* Left: source tabs + panel */}
        <div className="flex w-[42%] min-h-0 shrink-0 flex-col border-r border-white/5 pr-4">
          <nav
            className="flex shrink-0 flex-row gap-1 rounded-lg border border-white/[0.06] bg-black/25 p-1"
            role="tablist"
            aria-label="Architecture sources"
            onKeyDown={handleSourceTabKeyDown}
          >
            <ArchLeftSourceTab
              layout="horizontal"
              active={sourceTab === 'blueprint'}
              onClick={() => setSourceTab('blueprint')}
              id={`${blueprintPanelId}-tab`}
              controls={blueprintPanelId}
              icon={LayoutTemplate}
              label="Templates"
            />
            <ArchLeftSourceTab
              layout="horizontal"
              active={sourceTab === 'packs'}
              onClick={() => setSourceTab('packs')}
              id={`${packsPanelId}-tab`}
              controls={packsPanelId}
              icon={Package}
              label="Page packs"
            />
          </nav>

          <div className="mt-2 flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/30 px-2 h-8">
            <Search size={11} className="text-white/35 shrink-0" aria-hidden />
            <input
              type="search"
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              placeholder={sourceTab === 'blueprint' ? 'Search templates…' : 'Search page packs…'}
              aria-label={
                sourceTab === 'blueprint' ? 'Search architecture templates' : 'Search page packs'
              }
              className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-white/25 focus-visible:ring-0"
            />
          </div>

          <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
            {sourceTab === 'blueprint' ? (
              <div
                id={blueprintPanelId}
                role="tabpanel"
                aria-labelledby={`${blueprintPanelId}-tab`}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="flex-1 min-h-0 overflow-y-auto app-scroll space-y-3 pr-0.5">
                  {ARCH_PROFILE_GROUPS.map((group) => {
                    const profiles = group.ids.filter((id) => {
                      const profile = ARCH_PROFILES_MAP[id]
                      if (!profile) return false
                      if (!sourceQuery) return true
                      return (
                        profile.name.toLowerCase().includes(sourceQuery) ||
                        profile.description.toLowerCase().includes(sourceQuery)
                      )
                    })
                    if (profiles.length === 0) return null
                    return (
                      <div key={group.label}>
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-white/35">
                          {group.label}
                        </p>
                        <div className="space-y-1">
                          {profiles.map((id) => {
                            const profile = ARCH_PROFILES_MAP[id]
                            const isSelected = selected === id
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => onSelect(id)}
                                className={cn(
                                  'flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors duration-150',
                                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35',
                                  isSelected
                                    ? 'border-blue-500/35 bg-blue-600/12'
                                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]',
                                )}
                              >
                                <span
                                  className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-md border',
                                    isSelected
                                      ? 'border-blue-500/25 bg-blue-500/15 text-blue-300'
                                      : 'border-white/[0.06] bg-white/[0.04] text-white/40',
                                  )}
                                >
                                  <IconRenderer name={profile.icon} size={14} />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[11px] font-semibold leading-tight text-white/90">
                                    {profile.name}
                                  </span>
                                  <span className="mt-0.5 block truncate text-[9px] text-white/35">
                                    {profile.pages.length} routes
                                  </span>
                                </span>
                                {isSelected ? (
                                  <span
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600"
                                    aria-hidden
                                  >
                                    <Check size={10} className="text-white" />
                                  </span>
                                ) : null}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                  {sourceQuery && blueprintMatchCount === 0 ? (
                    <p className="px-1 py-6 text-center text-[11px] text-white/35">
                      No templates match your search
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div
                id={packsPanelId}
                role="tabpanel"
                aria-labelledby={`${packsPanelId}-tab`}
                className="flex min-h-0 flex-1 flex-col"
              >
                <ArchPagePacksPicker
                  showHeading={false}
                  variant="onboarding"
                  hideFilters
                  searchQuery={sourceSearch}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: sitemap pages (always visible) */}
        <ArchSitemapPagesPanel
          activeProfile={activeProfile}
          pagesList={pagesList}
          filteredPages={filteredPages}
          selectedPages={selectedPages}
          pageSearch={pageSearch}
          setPageSearch={setPageSearch}
          onTogglePage={togglePage}
          onToggleAll={toggleAll}
        />
      </div>

      {/* Navigation Actions */}
      <div className="mt-3 flex shrink-0 items-center justify-between border-t border-white/5 pt-3.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-bold text-white/45 hover:text-white transition-colors"
        >
          <ChevronLeft size={13} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedPages.length === 0}
          className={cn(
            'flex items-center gap-1.5 px-5 h-8 rounded-full text-[11px] font-bold text-white transition-all duration-150',
            selectedPages.length > 0
              ? 'hover:scale-[1.02] active:scale-[0.98]'
              : 'opacity-40 cursor-not-allowed'
          )}
          style={{
            background: selectedPages.length > 0 ? 'linear-gradient(135deg, #0065FF 0%, #855AF2 100%)' : 'rgba(255,255,255,0.06)',
            boxShadow: selectedPages.length > 0 ? '0 0 16px rgba(0, 101, 255, 0.25)' : 'none',
          }}
        >
          Continue
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

function ArchLeftSourceTab({
  active,
  onClick,
  id,
  controls,
  icon: Icon,
  label,
  layout = 'vertical',
  hint,
}: {
  active: boolean
  onClick(): void
  id: string
  controls: string
  icon: typeof LayoutTemplate
  label: string
  layout?: 'vertical' | 'horizontal'
  hint?: string
}) {
  const isHorizontal = layout === 'horizontal'

  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={cn(
        'rounded-md transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#1E1F22]',
        isHorizontal
          ? cn(
              'flex flex-1 min-w-0 items-center justify-center gap-1.5 px-2 py-2',
              active
                ? 'bg-blue-600/14 text-white ring-1 ring-inset ring-blue-500/25'
                : 'text-white/50 hover:bg-white/[0.04] hover:text-white/75',
            )
          : cn(
              'flex w-full items-center gap-2.5 px-2.5 py-2 text-left',
              active
                ? 'bg-blue-600/14 text-white ring-1 ring-inset ring-blue-500/25'
                : 'text-white/50 hover:bg-white/[0.04] hover:text-white/75',
            ),
      )}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-md border transition-colors',
          isHorizontal ? 'h-6 w-6' : 'h-7 w-7',
          active
            ? 'border-blue-500/25 bg-blue-500/15 text-blue-300'
            : 'border-white/5 bg-white/[0.03] text-white/35',
        )}
      >
        <Icon size={isHorizontal ? 12 : 13} strokeWidth={2.25} />
      </span>
      <span className={cn('min-w-0', isHorizontal ? 'text-center' : 'flex-1')}>
        <span className="block text-[10.5px] font-bold leading-tight tracking-tight truncate">
          {label}
        </span>
        {!isHorizontal && hint ? (
          <span className={cn('block text-[9px] mt-0.5 truncate', active ? 'text-white/45' : 'text-white/25')}>
            {hint}
          </span>
        ) : null}
      </span>
    </button>
  )
}

type ArchProfileMeta = (typeof ARCH_PROFILES)[number]

function ArchSitemapPagesPanel({
  activeProfile,
  pagesList,
  filteredPages,
  selectedPages,
  pageSearch,
  setPageSearch,
  onTogglePage,
  onToggleAll,
}: {
  activeProfile: ArchProfileMeta | null | undefined
  pagesList: ArchProfileMeta['pages']
  filteredPages: ArchProfileMeta['pages']
  selectedPages: string[]
  pageSearch: string
  setPageSearch(val: string): void
  onTogglePage(id: string): void
  onToggleAll(): void
}) {
  const allSelected = pagesList.length > 0 && selectedPages.length === pagesList.length

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <p className="text-[9.5px] font-bold uppercase tracking-wider text-white/40">Sitemap pages</p>
        {activeProfile ? (
          <span className="text-[9px] text-white/30 truncate max-w-[45%]">{activeProfile.name}</span>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex h-8 min-w-0 flex-1 items-center rounded-md border border-white/[0.08] bg-black/30 px-2">
          <Search size={11} className="mr-1.5 shrink-0 text-white/35" aria-hidden />
          <input
            type="search"
            placeholder="Filter routes…"
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
            aria-label="Filter sitemap routes"
            className="w-full min-w-0 bg-transparent text-[11px] text-white outline-none placeholder:text-white/25 focus-visible:ring-0"
          />
        </div>
        <button
          type="button"
          onClick={onToggleAll}
          disabled={pagesList.length === 0}
          className="h-8 shrink-0 rounded-md border border-white/10 px-2.5 text-[10px] font-bold text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded-lg border border-white/[0.06] bg-black/15 p-2 app-scroll">
        {pagesList.length === 0 ? (
          <div className="flex min-h-[8rem] h-full flex-col items-center justify-center p-4 text-center">
            <p className="text-[11px] text-white/40">Choose a blueprint on the left to load routes</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="flex min-h-[8rem] h-full flex-col items-center justify-center p-4 text-center">
            <p className="text-[11px] text-white/40">No routes match this filter</p>
          </div>
        ) : (
          filteredPages.map((page) => {
            const isChecked = selectedPages.includes(page.id)
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => onTogglePage(page.id)}
                aria-pressed={isChecked}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/35',
                  isChecked
                    ? 'border-white/10 bg-white/[0.05] text-white'
                    : 'border-transparent text-white/45 hover:bg-white/[0.03]',
                )}
              >
                {isChecked ? (
                  <CheckSquare size={13} className="text-blue-500 shrink-0" />
                ) : (
                  <Square size={13} className="text-white/25 shrink-0" />
                )}
                <IconRenderer name={page.icon} size={11} className="shrink-0 opacity-60" />
                <div className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-bold truncate">{page.name}</span>
                  <span className="text-[9px] font-mono opacity-40 truncate shrink-0">{page.route}</span>
                </div>
              </button>
            )
          })
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between text-[10px] text-white/30 px-0.5">
        <span>
          {selectedPages.length} of {pagesList.length} selected
        </span>
        <span className="text-[9.5px] px-0.5" style={{
          color: selectedPages.length === 0
            ? 'rgba(248,113,113,0.8)'   // red-400/80
            : selectedPages.length <= 3
            ? 'rgba(255,255,255,0.35)'  // white/35
            : selectedPages.length <= 8
            ? 'rgba(52,211,153,0.6)'    // emerald-400/60
            : 'rgba(251,191,36,0.6)',   // amber-400/60
        }}>
          {selectedPages.length === 0
            ? 'Select at least one page to continue.'
            : selectedPages.length <= 3
            ? 'Good start — you can add more pages later.'
            : selectedPages.length <= 8
            ? 'Solid foundation.'
            : 'Large project — consider splitting into phases after setup.'}
        </span>
      </div>
    </div>
  )
}

// ─── Step 2 — Design with Specs Preview ──────────────────────────────────────────

function DesignStep({
  selected, onSelect, onBack, onComplete,
}: {
  selected: DesignProfileId | null
  onSelect(id: DesignProfileId): void
  onBack(): void
  onComplete(): void
}) {

  const activeProfile = selected ? DESIGN_PROFILES_MAP[selected] : null
  const tokens = activeProfile?.tokens

  return (
    <div className="flex flex-col h-full justify-between p-6">
      <style>{`
        @keyframes profileFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes profileFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>

      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
        <p className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest">Step 2 of 2</p>
        <h2 className="text-[17px] font-bold text-white tracking-tight">Select Design System Brand Aesthetics</h2>
        <p className="text-[11px] text-white/40">Select your styling presets. We will load these core design tokens into your workspace.</p>
      </div>

      {/* Two Column Layout: Aesthetics Left, Live Spec Details Right */}
      <div className="flex flex-1 min-h-0 py-3 gap-6">
        
        {/* Left Column: Aesthetics directory list */}
        <div className="w-[45%] flex flex-col gap-1.5 border-r border-white/5 pr-1">
          <p className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider mb-0.5">Design Presets</p>
          <div className="flex-1 overflow-y-auto app-scroll space-y-1.5 pr-1">
            {DESIGN_PROFILES.map((profile) => {
              const isSelected = selected === profile.id
              const brandColor = profile.tokens.colors.brand['500']
              return (
                <button
                  key={profile.id}
                  onClick={() => onSelect(profile.id as DesignProfileId)}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-lg p-2.5 text-left border transition-all duration-150',
                    isSelected
                      ? 'bg-purple-600/10 border-purple-500/30'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                  )}
                  style={{
                    animation: 'profileFadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1) both',
                    animationDelay: `${Math.min(DESIGN_PROFILES.indexOf(profile), 7) * 40}ms`,
                  }}
                >
                  <div
                    className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-md text-[13px]"
                    style={{ background: isSelected ? 'rgba(133, 90, 242, 0.2)' : 'rgba(255,255,255,0.06)' }}
                  >
                    <span style={{ color: isSelected ? '#a855f7' : 'inherit' }}>{profile.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <p className="text-[11.5px] font-bold text-white leading-none">{profile.name}</p>
                      <span className="w-2 h-2 rounded-full" style={{ background: brandColor }} />
                    </div>
                    <p className="text-[9.5px] text-white/30 truncate mt-0.5 leading-tight">{profile.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column: Gorgeous Dynamic brand specs layout */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <p className="text-[9.5px] font-bold text-white/40 uppercase tracking-wider">Aesthetic Specifications Preview</p>
          
          {tokens ? (
            <div className="flex-1 flex flex-col gap-3 rounded-lg border border-white/5 bg-black/15 p-4 overflow-y-auto app-scroll">
              
              {/* Typography Font Spec Section */}
              <div className="flex flex-col gap-1 border-b border-white/5 pb-2">
                <p className="text-[8.5px] text-white/30 font-bold uppercase">Active Typography Family</p>
                <p className="text-[14px] font-extrabold text-white" style={{ fontFamily: tokens.typography.sans }}>
                  {tokens.typography.sans.split(',')[0]}
                </p>
                <p className="text-[9.5px] text-white/40 leading-relaxed italic" style={{ fontFamily: tokens.typography.sans }}>
                  "NEZAM design tokens dynamically sync interfaces across platforms seamlessly."
                </p>
              </div>

              {/* Color Chips Section */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[8.5px] text-white/30 font-bold uppercase">Color Palette Foundations</p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  
                  {/* Brand Color Swatch */}
                  <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded px-2 py-1">
                    <span className="w-3.5 h-3.5 rounded shrink-0" style={{ background: tokens.colors.brand['500'] }} />
                    <div className="min-w-0">
                      <p className="font-bold text-white/80">Primary Brand</p>
                      <p className="text-[8.5px] font-mono text-white/40 truncate">{tokens.colors.brand['500']}</p>
                    </div>
                  </div>

                  {/* Accent Color Swatch */}
                  <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded px-2 py-1">
                    <span className="w-3.5 h-3.5 rounded shrink-0" style={{ background: tokens.colors.accent['500'] }} />
                    <div className="min-w-0">
                      <p className="font-bold text-white/80">Accent Hue</p>
                      <p className="text-[8.5px] font-mono text-white/40 truncate">{tokens.colors.accent['500']}</p>
                    </div>
                  </div>

                  {/* Surface background swatch */}
                  <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded px-2 py-1">
                    <span className="w-3.5 h-3.5 rounded shrink-0 border border-white/10" style={{ background: tokens.colors.surface.bg }} />
                    <div className="min-w-0">
                      <p className="font-bold text-white/80">Workspace Base</p>
                      <p className="text-[8.5px] font-mono text-white/40 truncate">{tokens.colors.surface.bg}</p>
                    </div>
                  </div>

                  {/* Muted Text swatch */}
                  <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded px-2 py-1">
                    <span className="w-3.5 h-3.5 rounded shrink-0" style={{ background: tokens.colors.text.primary }} />
                    <div className="min-w-0">
                      <p className="font-bold text-white/80">Text Primary</p>
                      <p className="text-[8.5px] font-mono text-white/40 truncate">{tokens.colors.text.primary}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Render Geometry components sandbox mockup */}
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[8.5px] text-white/30 font-bold uppercase">Geometric Token Mechanics</p>
                <div
                  className="rounded p-3 border flex flex-col gap-2.5 transition-all duration-200"
                  style={{
                    backgroundColor: tokens.colors.surface.panel,
                    borderColor: tokens.colors.surface.border,
                    borderRadius: tokens.radius.md,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-bold" style={{ color: tokens.colors.text.primary }}>
                      Interactive Card Demo
                    </span>
                    <span
                      className="text-[8.5px] font-extrabold px-1.5 py-0.2 uppercase"
                      style={{
                        background: tokens.colors.brand['50'] || 'rgba(0,0,0,0.1)',
                        color: tokens.colors.brand['600'],
                        borderRadius: tokens.radius.full,
                      }}
                    >
                      Active Token
                    </span>
                  </div>

                  {/* Simulated buttons showing chosen radius and brand colors */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex-1 h-6.5 text-[9.5px] font-bold border-none text-white transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: tokens.colors.brand['500'],
                        borderRadius: tokens.radius.sm,
                      }}
                    >
                      Primary
                    </button>
                    <button
                      className="flex-1 h-6.5 text-[9.5px] font-bold bg-transparent transition-colors"
                      style={{
                        border: `1px solid ${tokens.colors.surface.border}`,
                        color: tokens.colors.text.secondary,
                        borderRadius: tokens.radius.sm,
                      }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional components */}
              <div className="flex flex-col gap-2">
                <p className="text-[8.5px] font-bold text-white/30 uppercase tracking-wider">Additional components</p>

                {/* Badge strip */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Active',   bg: tokens.colors.brand['50'] || 'rgba(0,0,0,0.2)',    color: tokens.colors.brand['600'] || tokens.colors.brand['500'] },
                    { label: 'Draft',    bg: 'rgba(255,255,255,0.06)',  color: tokens.colors.text.secondary || tokens.colors.text.muted },
                    { label: 'Archived', bg: 'rgba(255,255,255,0.03)',  color: tokens.colors.text.muted },
                  ].map(({ label, bg, color }) => (
                    <span
                      key={label}
                      className="text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wide"
                      style={{ background: bg, color, borderRadius: tokens.radius.full }}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* Input field */}
                <input
                  readOnly
                  value="user@example.com"
                  className="w-full text-[10px] px-2.5 py-1.5 outline-none bg-transparent"
                  style={{
                    background: tokens.colors.surface.bg,
                    border: `1px solid ${tokens.colors.surface.border}`,
                    borderRadius: tokens.radius.sm,
                    color: tokens.colors.text.primary,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center rounded-lg border border-white/5 bg-black/15 p-4 text-center">
              <Info size={24} className="text-white/20 mb-2" />
              <p className="text-[11px] text-white/30">Select an brand aesthetic layout on the left to audit design token variables.</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-bold text-white/45 hover:text-white transition-colors"
        >
          <ChevronLeft size={13} />
          Back
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-6 h-8 rounded-full text-[11px] font-bold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #0065FF 0%, #855AF2 100%)',
            boxShadow: '0 0 16px rgba(0, 101, 255, 0.25)',
          }}
        >
          <Zap size={12} />
          Launch Design Hub
        </button>
      </div>
    </div>
  )
}
