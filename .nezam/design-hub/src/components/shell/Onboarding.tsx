'use client'

import { useState } from 'react'
import {
  Network, Palette, Eye, Puzzle, ArrowRight, Check,
  Sparkles, Layers, Globe, Zap, ChevronLeft,
} from 'lucide-react'
import { useHub, HUB_VERSION } from '@/store/hub.store'
import { ARCH_PROFILES } from '@/data/arch-profiles'
import { DESIGN_PROFILES } from '@/data/design-profiles'
import { IconRenderer } from '@/lib/icons'
import { cn } from '@/lib/utils'
import type { ArchProfileId } from '@/types/arch'
import type { DesignProfileId } from '@/types/design'

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

  if (completed) return null

  function handleLaunch() {
    if (archChoice)   archApplyProfile(archChoice)
    if (designChoice) designApplyProfile(designChoice)
    onboardingComplete()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto app-scroll">
      {/* Backdrop — fixed so it covers viewport while content scrolls */}
      <div
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #1e2d4a 0%, #0d0d0f 55%, #0a0a0b 100%)',
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

      {/* Scrollable centered container — min-h-full + py for breathing room on tall screens, scroll on short ones */}
      <div className="relative z-10 flex min-h-full w-full items-center justify-center py-8">
      <div className="flex w-full max-w-2xl flex-col px-6 gap-8">

        {/* Brand */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #2680eb 0%, #7c3aed 100%)' }}
          >
            <Layers size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">NEZAM Design Hub</span>
          <span className="text-[10px] font-semibold text-white/40 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full tracking-wide">{HUB_VERSION}</span>
        </div>

        {/* Progress stepper */}
        <StepperDots step={step} total={STEPS.length} />

        {/* Step panel */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
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
              onSelect={setArchChoice}
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
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: total }).map((_, i) => {
        const done    = i < step
        const current = i === step
        return (
          <div key={i} className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300',
                done    ? 'bg-app-accent text-white'            :
                current ? 'bg-white/15 text-white ring-1 ring-white/30' :
                          'bg-white/5  text-white/30',
              )}
            >
              {done ? <Check size={11} /> : i + 1}
            </div>
            <span className={cn(
              'text-[11px] font-medium transition-colors duration-200',
              current ? 'text-white/90' : done ? 'text-white/50' : 'text-white/25',
            )}>
              {STEPS[i].label}
            </span>
            {i < total - 1 && (
              <div className={cn('h-px w-8 transition-all duration-300', done ? 'bg-app-accent/60' : 'bg-white/10')} />
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
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.12)',
      title: 'Architecture',
      badge: 'Sitemap',
      desc: 'Visual sitemap builder. Plan pages, routes, and information architecture before writing a line of code.',
    },
    {
      icon: Palette,
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.12)',
      title: 'Design Tokens',
      badge: '9 categories',
      desc: 'Live token editor for colors, typography, spacing, radius, shadows, motion, and more.',
    },
    {
      icon: Eye,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      title: 'Preview',
      badge: 'Real-time',
      desc: 'Pixel-accurate device previews with your actual tokens applied. Mobile, tablet, desktop.',
    },
    {
      icon: Puzzle,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      title: 'Components',
      badge: '80+ components',
      desc: 'Full Atlaskit-style component library with live, token-aware renders and copy-ready code.',
    },
    {
      icon: Globe,
      color: '#06b6d4',
      bg: 'rgba(6,182,212,0.12)',
      title: 'Sections',
      badge: '55+ templates',
      desc: 'Production-ready page sections: heroes, pricing, features, dashboards, auth flows, and more.',
    },
    {
      icon: Zap,
      color: '#f43f5e',
      bg: 'rgba(244,63,94,0.12)',
      title: 'Agent-ready',
      badge: 'NEZAM native',
      desc: 'Export your design to DESIGN.md, lock wireframes, and activate NEZAM agents in one click.',
    },
  ]

  return (
    <div className="p-10 flex flex-col gap-8">
      {/* Hero */}
      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 self-center px-3 py-1 rounded-full text-[11px] font-semibold"
          style={{ background: 'rgba(38,128,235,0.15)', color: '#60a5fa', border: '1px solid rgba(38,128,235,0.25)' }}
        >
          <Sparkles size={11} />
          Your complete design-to-code workspace
        </div>
        <h1 className="text-[30px] font-bold text-white tracking-tight leading-tight">
          From idea to production,<br />
          <span style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            without leaving your terminal.
          </span>
        </h1>
        <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
          Design Hub bridges the gap between design intent and code reality.
          Set your architecture, define your tokens, and hand off to NEZAM agents with one export.
        </p>
      </div>

      {/* Feature grid — 3 cols */}
      <div className="grid grid-cols-3 gap-2.5">
        {FEATURES.map(({ icon: Icon, color, bg, title, badge, desc }) => (
          <div
            key={title}
            className="flex flex-col gap-2.5 rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: bg }}>
                <Icon size={15} style={{ color }} />
              </div>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: bg, color }}>
                {badge}
              </span>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/90 mb-0.5">{title}</p>
              <p className="text-[10px] text-white/38 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-center">
        <button
          onClick={onSkip}
          className="text-[12px] text-white/35 hover:text-white/60 transition-colors px-4 py-2"
        >
          Skip setup
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #2680eb 0%, #7c3aed 100%)', boxShadow: '0 0 24px rgba(38,128,235,0.35)' }}
        >
          Set up my workspace
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Step 1 — Architecture ────────────────────────────────────────────────────

function ArchStep({
  selected, onSelect, onBack, onNext,
}: {
  selected: ArchProfileId | null
  onSelect(id: ArchProfileId): void
  onBack(): void
  onNext(): void
}) {
  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em]">Step 1 of 2</p>
        <h2 className="text-xl font-bold text-white tracking-tight">What are you building?</h2>
        <p className="text-sm text-white/40">Pick a template to pre-load a site structure. You can customise it later.</p>
      </div>

      <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto app-scroll pr-1">
        {ARCH_PROFILES.map((profile) => {
          const isSelected = selected === profile.id
          const pageCount  = profile.pages.length
          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id as ArchProfileId)}
              className={cn(
                'flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]',
                isSelected
                  ? 'ring-2 ring-app-accent'
                  : 'hover:bg-white/5',
              )}
              style={{
                background: isSelected ? 'rgba(38,128,235,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isSelected ? 'rgba(38,128,235,0.5)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: isSelected ? 'rgba(38,128,235,0.2)' : 'rgba(255,255,255,0.08)' }}
              >
                <IconRenderer name={profile.icon} size={15} className={isSelected ? 'text-app-accent' : 'text-white/60'} />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[11px] font-semibold text-white/90 truncate">{profile.name}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{pageCount} pages</p>
              </div>
              {isSelected && (
                <div className="self-end ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-app-accent">
                  <Check size={9} className="text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-white/60 transition-colors"
        >
          <ChevronLeft size={13} />
          Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onNext}
            className="text-[12px] text-white/35 hover:text-white/60 transition-colors px-3 py-1.5"
          >
            Skip
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-semibold text-white transition-all duration-150',
              selected
                ? 'hover:scale-[1.02] active:scale-[0.98]'
                : 'opacity-40 cursor-not-allowed',
            )}
            style={{
              background: selected ? 'linear-gradient(135deg, #2680eb 0%, #7c3aed 100%)' : 'rgba(255,255,255,0.1)',
              boxShadow: selected ? '0 0 20px rgba(38,128,235,0.3)' : 'none',
            }}
          >
            Continue
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2 — Design ──────────────────────────────────────────────────────────

const DESIGN_META: Record<string, { gradient: string; accent: string }> = {
  minimal:      { gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', accent: '#3b82f6' },
  vibrant:      { gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)', accent: '#a855f7' },
  corporate:    { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #065f46 100%)', accent: '#0ea5e9' },
  'dark-studio':{ gradient: 'linear-gradient(135deg, #0f172a 0%, #0e7490 100%)', accent: '#22d3ee' },
  'warm-earth': { gradient: 'linear-gradient(135deg, #92400e 0%, #4d7c0f 100%)', accent: '#d97706' },
  glass:        { gradient: 'linear-gradient(135deg, #1e40af 0%, #6d28d9 100%)', accent: '#7dd3fc' },
}

function DesignStep({
  selected, onSelect, onBack, onComplete,
}: {
  selected: DesignProfileId | null
  onSelect(id: DesignProfileId): void
  onBack(): void
  onComplete(): void
}) {
  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em]">Step 2 of 2</p>
        <h2 className="text-xl font-bold text-white tracking-tight">Choose your brand aesthetic</h2>
        <p className="text-sm text-white/40">This sets your design tokens — colors, type, radius, and more. Fully editable later.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {DESIGN_PROFILES.map((profile) => {
          const isSelected = selected === profile.id
          const meta = DESIGN_META[profile.id] ?? { gradient: 'linear-gradient(135deg, #374151, #1f2937)', accent: '#6b7280' }
          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id as DesignProfileId)}
              className={cn(
                'flex flex-col gap-3 rounded-xl p-4 text-left transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]',
                isSelected ? 'ring-2 ring-white/40' : '',
              )}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              {/* Color preview strip */}
              <div className="h-10 w-full rounded-lg overflow-hidden relative" style={{ background: meta.gradient }}>
                {/* Mini component preview dots */}
                <div className="absolute inset-0 flex items-end justify-start gap-1 p-2">
                  <div className="h-3 rounded-sm flex-1 opacity-60" style={{ background: 'rgba(255,255,255,0.3)' }} />
                  <div className="h-5 w-5 rounded-md opacity-80" style={{ background: meta.accent }} />
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[12px] font-semibold text-white/90">{profile.name}</p>
                  <p className="text-[10px] text-white/35 leading-relaxed mt-0.5 line-clamp-2">{profile.description}</p>
                </div>
                {isSelected && (
                  <div className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-white/30">
                    <Check size={9} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-white/60 transition-colors"
        >
          <ChevronLeft size={13} />
          Back
        </button>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #2680eb 0%, #7c3aed 100%)',
            boxShadow: '0 0 24px rgba(38,128,235,0.35)',
          }}
        >
          <Zap size={13} />
          Launch Design Hub
        </button>
      </div>
    </div>
  )
}
