'use client'

/**
 * SPEC-DS-VISUAL-001 — Hero section configurator.
 * Controls layout variant, CTA count, media side, and token-mapped styles.
 */

import { useState } from 'react'
import { AlignLeft, AlignCenter, AlignRight, Layers } from 'lucide-react'
import { cn } from '@/lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type HeroLayout = 'split-left' | 'split-right' | 'centered' | 'full-bleed' | 'stacked'
type MediaKind = 'image' | 'video' | 'lottie' | 'none'
type CtaStyle = 'filled' | 'outlined' | 'text'

export interface HeroConfig {
  layout: HeroLayout
  mediaKind: MediaKind
  ctaCount: 1 | 2
  ctaStyle: CtaStyle
  showBadge: boolean
  showRating: boolean
  showSocialProof: boolean
  overlayGradient: boolean
  minHeight: number
}

const DEFAULT_CONFIG: HeroConfig = {
  layout: 'split-left',
  mediaKind: 'image',
  ctaCount: 2,
  ctaStyle: 'filled',
  showBadge: true,
  showRating: false,
  showSocialProof: true,
  overlayGradient: false,
  minHeight: 600,
}

// ── Visual layout picker ──────────────────────────────────────────────────────

const LAYOUTS: { id: HeroLayout; label: string; preview: React.ReactNode }[] = [
  {
    id: 'split-left',
    label: 'Split L',
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".08" />
        <rect x="3" y="6" width="20" height="4" rx="1" fill="currentColor" opacity=".4" />
        <rect x="3" y="12" width="16" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="3" y="16" width="12" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="3" y="22" width="8" height="5" rx="1.5" fill="currentColor" opacity=".5" />
        <rect x="26" y="4" width="20" height="24" rx="2" fill="currentColor" opacity=".15" />
      </svg>
    ),
  },
  {
    id: 'split-right',
    label: 'Split R',
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".08" />
        <rect x="2" y="4" width="20" height="24" rx="2" fill="currentColor" opacity=".15" />
        <rect x="26" y="6" width="20" height="4" rx="1" fill="currentColor" opacity=".4" />
        <rect x="26" y="12" width="16" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="26" y="16" width="12" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="26" y="22" width="8" height="5" rx="1.5" fill="currentColor" opacity=".5" />
      </svg>
    ),
  },
  {
    id: 'centered',
    label: 'Centered',
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".08" />
        <rect x="12" y="7" width="24" height="4" rx="1" fill="currentColor" opacity=".4" />
        <rect x="16" y="13" width="16" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="18" y="16" width="12" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="15" y="22" width="8" height="5" rx="1.5" fill="currentColor" opacity=".5" />
        <rect x="25" y="22" width="8" height="5" rx="1.5" fill="currentColor" opacity=".2" />
      </svg>
    ),
  },
  {
    id: 'full-bleed',
    label: 'Full bleed',
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".18" />
        <rect x="8" y="8" width="32" height="4" rx="1" fill="white" opacity=".7" />
        <rect x="12" y="14" width="24" height="2" rx="1" fill="white" opacity=".4" />
        <rect x="16" y="22" width="16" height="5" rx="1.5" fill="white" opacity=".6" />
      </svg>
    ),
  },
  {
    id: 'stacked',
    label: 'Stacked',
    preview: (
      <svg viewBox="0 0 48 32" className="h-full w-full">
        <rect x="1" y="1" width="46" height="30" rx="2" fill="currentColor" opacity=".08" />
        <rect x="8" y="3" width="32" height="10" rx="2" fill="currentColor" opacity=".15" />
        <rect x="12" y="15" width="24" height="4" rx="1" fill="currentColor" opacity=".4" />
        <rect x="16" y="21" width="16" height="2" rx="1" fill="currentColor" opacity=".2" />
        <rect x="18" y="25" width="12" height="4" rx="1.5" fill="currentColor" opacity=".5" />
      </svg>
    ),
  },
]

// ── Section helpers ───────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-app-subtle">{label}</p>
      {children}
    </div>
  )
}

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-xs text-app-text">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-4 w-7 rounded-full transition-colors',
          checked ? 'bg-app-brand' : 'bg-app-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-3.5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  )
}

function Chip<T extends string>({
  value, current, onChange, label,
}: { value: T; current: T; onChange: (v: T) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(value)}
      className={cn(
        'rounded-md px-2.5 py-1 text-[11px] transition-colors',
        current === value
          ? 'bg-app-brand text-app-on-brand'
          : 'bg-app-surface text-app-subtle hover:text-app-text',
      )}
    >
      {label}
    </button>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface HeroBuilderProps {
  value?: Partial<HeroConfig>
  onChange?: (config: HeroConfig) => void
}

export function HeroBuilder({ value, onChange }: HeroBuilderProps) {
  const [cfg, setCfg] = useState<HeroConfig>({ ...DEFAULT_CONFIG, ...value })

  const update = <K extends keyof HeroConfig>(key: K, val: HeroConfig[K]) => {
    const next = { ...cfg, [key]: val }
    setCfg(next)
    onChange?.(next)
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Layout */}
      <Section label="Layout">
        <div className="grid grid-cols-5 gap-1.5">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => update('layout', l.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md p-1 transition-all',
                cfg.layout === l.id
                  ? 'bg-app-brand/10 text-app-brand ring-1 ring-app-brand'
                  : 'text-app-text hover:bg-app-surface',
              )}
              aria-label={l.label}
            >
              <div className="h-8 w-full">{l.preview}</div>
              <span className="text-[9px] opacity-70">{l.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Media */}
      <Section label="Media">
        <div className="flex gap-1">
          {(['image', 'video', 'lottie', 'none'] as MediaKind[]).map((k) => (
            <Chip key={k} value={k} current={cfg.mediaKind} onChange={(v) => update('mediaKind', v)} label={k} />
          ))}
        </div>
      </Section>

      {/* CTAs */}
      <Section label="Call to action">
        <div className="flex items-center gap-3">
          <span className="text-xs text-app-subtle">Count</span>
          <div className="flex gap-1">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                onClick={() => update('ctaCount', n)}
                className={cn(
                  'h-7 w-7 rounded-md text-xs transition-colors',
                  cfg.ctaCount === n ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <span className="ml-2 text-xs text-app-subtle">Style</span>
          <div className="flex gap-1">
            {(['filled', 'outlined', 'text'] as CtaStyle[]).map((s) => (
              <Chip key={s} value={s} current={cfg.ctaStyle} onChange={(v) => update('ctaStyle', v)} label={s} />
            ))}
          </div>
        </div>
      </Section>

      {/* Min height */}
      <Section label="Min height">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={300} max={1000} step={50}
            value={cfg.minHeight}
            onChange={(e) => update('minHeight', Number(e.target.value))}
            className="h-1.5 flex-1 accent-app-brand"
          />
          <span className="w-14 text-right text-xs tabular-nums text-app-subtle">{cfg.minHeight}px</span>
        </div>
      </Section>

      {/* Options */}
      <Section label="Options">
        <div className="flex flex-col gap-2.5">
          <Toggle checked={cfg.showBadge} onChange={(v) => update('showBadge', v)} label="Badge / eyebrow" />
          <Toggle checked={cfg.showRating} onChange={(v) => update('showRating', v)} label="Star rating" />
          <Toggle checked={cfg.showSocialProof} onChange={(v) => update('showSocialProof', v)} label="Social proof row" />
          <Toggle checked={cfg.overlayGradient} onChange={(v) => update('overlayGradient', v)} label="Overlay gradient" />
        </div>
      </Section>
    </div>
  )
}
