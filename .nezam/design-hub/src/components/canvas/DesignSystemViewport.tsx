'use client'

import { useMemo, useState } from 'react'
import * as RadixTabs from '@radix-ui/react-tabs'
import { useHub } from '@/store/hub.store'
import { resolveTokens, tokensToCssVars, contrastRatio } from '@/lib/tokens'
import { PROFILES } from '@/data/profiles'
import { Scrubber } from '@/components/ui/Scrubber'
import { cn } from '@/lib/cn'
import type { ResolvedTokens } from '@/types'

/* ─────────────────────────────────────────────────────────────────────────────
   Token resolution helper — stable via useMemo (avoids getSnapshot loop)
───────────────────────────────────────────────────────────────────────────── */

function useResolvedTokens(forceTheme?: 'light' | 'dark'): ResolvedTokens {
  const profileId = useHub((s) => s.profileId)
  const overrides = useHub((s) => s.overrides)
  const storeTheme = useHub((s) => s.theme)
  const generated = useHub((s) => s.generated)
  const theme = forceTheme ?? storeTheme

  return useMemo(() => {
    const profile =
      PROFILES.find((p) => p.id === profileId) ||
      generated.find((p) => p.id === profileId) ||
      PROFILES[0]
    return resolveTokens(profile, theme, overrides)
  }, [profileId, overrides, theme, generated])
}

/* ── Helpers ──────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-app-subtle">
      {children}
    </h3>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-app-border bg-app-surface p-4', className)}>
      {children}
    </div>
  )
}

/* ── WCAG badge ──────────────────────────────────────────────── */

function WcagBadge({ ratio, large = false }: { ratio: number; large?: boolean }) {
  const threshold = large ? 3 : 4.5
  const pass = ratio >= threshold
  const aaa = ratio >= (large ? 4.5 : 7)
  return (
    <span
      title={`Contrast ratio: ${ratio.toFixed(2)}:1`}
      className={cn(
        'inline-flex items-center gap-0.5 rounded px-1 py-px font-mono text-[8px] font-bold',
        aaa  ? 'bg-green-500/15 text-green-400'  :
        pass ? 'bg-yellow-500/15 text-yellow-400' :
               'bg-red-500/15 text-red-400',
      )}
    >
      {aaa ? 'AAA' : pass ? 'AA' : 'AA✗'}
    </span>
  )
}

/* ── Color section ────────────────────────────────────────────── */

interface TokensProps { tokens: ResolvedTokens }

function ColorSection({ tokens }: TokensProps) {
  const groups: Array<{
    label: string
    swatches: Array<{ name: string; value: string; textPair?: string; bgPair?: string }>
  }> = [
    {
      label: 'Primary Brand',
      swatches: [
        { name: 'Brand',        value: tokens.brand,       textPair: tokens.onBrand,    bgPair: tokens.onBrand },
        { name: 'Brand Hover',  value: tokens.brandHover,  textPair: tokens.onBrand,    bgPair: tokens.onBrand },
        { name: 'Brand Subtle', value: tokens.brandSubtle, textPair: tokens.text,        bgPair: tokens.bg },
        { name: 'On Brand',     value: tokens.onBrand,     textPair: tokens.brand,       bgPair: tokens.brand },
      ],
    },
    {
      label: 'Accent',
      swatches: [
        { name: 'Accent', value: tokens.accent },
      ],
    },
    {
      label: 'Semantic',
      swatches: [
        { name: 'Success', value: tokens.success },
        { name: 'Warning', value: tokens.warning },
        { name: 'Danger',  value: tokens.danger  },
        { name: 'Info',    value: tokens.info     },
      ],
    },
    {
      label: 'Text',
      swatches: [
        { name: 'Text',       value: tokens.text,       textPair: tokens.text,       bgPair: tokens.bg },
        { name: 'Text Muted', value: tokens.textMuted,  textPair: tokens.textMuted,  bgPair: tokens.bg },
        { name: 'Subtle',     value: tokens.textSubtle, textPair: tokens.textSubtle, bgPair: tokens.bg },
      ],
    },
    {
      label: 'Backgrounds',
      swatches: [
        { name: 'BG',       value: tokens.bg       },
        { name: 'Surface',  value: tokens.surface  },
        { name: 'Elevated', value: tokens.elevated },
      ],
    },
  ]

  return (
    <div>
      <SectionTitle>Colors</SectionTitle>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {groups.map((group) => (
          <Card key={group.label} className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold text-app-muted">{group.label}</p>
            <div className="flex flex-col gap-1.5">
              {group.swatches.map((s) => {
                const ratio = s.textPair && s.bgPair ? contrastRatio(s.textPair, s.bgPair) : null
                return (
                  <div key={s.name} className="flex items-center gap-2">
                    <span
                      className="h-5 w-5 shrink-0 rounded border border-app-border shadow-sm"
                      style={{ background: s.value }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-[11px] font-medium text-app-text">{s.name}</p>
                        {ratio !== null && <WcagBadge ratio={ratio} />}
                      </div>
                      <p className="font-mono text-[9px] text-app-subtle">{s.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ── Typography section ───────────────────────────────────────── */

function TypographySection({ tokens }: TokensProps) {
  const scale = [
    { name: 'text-xs',   size: '12px', sample: 'Caption text'    },
    { name: 'text-sm',   size: '14px', sample: 'Small body text' },
    { name: 'text-base', size: '16px', sample: 'Body text'       },
    { name: 'text-lg',   size: '18px', sample: 'Large body'      },
    { name: 'text-xl',   size: '20px', sample: 'Lead paragraph'  },
    { name: 'text-2xl',  size: '24px', sample: 'Subheading'      },
    { name: 'text-3xl',  size: '30px', sample: 'Heading 3'       },
    { name: 'text-4xl',  size: '36px', sample: 'Heading 2'       },
  ]

  return (
    <div>
      <SectionTitle>Typography</SectionTitle>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-3 text-[10px] font-semibold text-app-muted">Display Font</p>
          <p className="text-3xl text-app-text" style={{ fontFamily: tokens.fontDisplay }}>
            {tokens.fontDisplay}
          </p>
          <p className="mt-1 text-sm text-app-subtle" style={{ fontFamily: tokens.fontDisplay }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </Card>
        <Card>
          <p className="mb-3 text-[10px] font-semibold text-app-muted">UI Font</p>
          <p className="text-3xl text-app-text" style={{ fontFamily: tokens.fontSans }}>
            {tokens.fontSans}
          </p>
          <p className="mt-1 text-sm text-app-subtle" style={{ fontFamily: tokens.fontSans }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </Card>
        <Card className="lg:col-span-2">
          <p className="mb-3 text-[10px] font-semibold text-app-muted">Type Scale</p>
          <div className="divide-y divide-app-border">
            {scale.map((s) => (
              <div key={s.name} className="flex items-baseline gap-4 py-2">
                <span className="w-24 shrink-0 font-mono text-[10px] text-app-subtle">
                  {s.name} · {s.size}
                </span>
                <span
                  className={cn(s.name, 'text-app-text leading-tight')}
                  style={{ fontFamily: tokens.fontSans }}
                >
                  {s.sample}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ── Spacing section ──────────────────────────────────────────── */

function SpacingSection() {
  const spacings = [4, 8, 12, 16, 24, 32, 48, 64]

  return (
    <div>
      <SectionTitle>Spacing</SectionTitle>
      <Card>
        <div className="flex flex-col gap-3">
          {spacings.map((px) => (
            <div key={px} className="flex items-center gap-4">
              <span className="w-8 shrink-0 font-mono text-[10px] text-app-subtle">{px}px</span>
              <div
                className="h-4 rounded-sm bg-app-accent/50"
                style={{ width: px * 2 }}
              />
              <span className="text-[10px] text-app-subtle">{px / 4}rem</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── Shape & Depth section ────────────────────────────────────── */

function ShapeSection({ tokens }: TokensProps) {
  const setToken = useHub((s) => s.setToken)
  const radii    = [0, 4, 8, 12, 16, 24]

  const shadows = [
    { label: 'none', style: 'none'                           },
    { label: 'sm',   style: '0 1px 2px rgba(0,0,0,.08)'     },
    { label: 'md',   style: '0 4px 12px rgba(0,0,0,.12)'    },
    { label: 'lg',   style: '0 8px 24px rgba(0,0,0,.16)'    },
    { label: 'xl',   style: '0 16px 48px rgba(0,0,0,.20)'   },
  ]

  return (
    <div>
      <SectionTitle>Shape & Depth</SectionTitle>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold text-app-muted">
            <span>Border Radius · current:</span>
            <Scrubber
              value={tokens.radius}
              onChange={(v) => setToken('radius', v)}
              min={0}
              max={28}
              step={1}
              format={(v) => `${v}px`}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {radii.map((r) => (
              <div key={r} className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-10 border-2 border-app-accent/60 bg-app-elevated"
                  style={{ borderRadius: r }}
                />
                <span className="text-[9px] text-app-subtle">{r}px</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="mb-3 text-[10px] font-semibold text-app-muted">Shadow Elevation</p>
          <div className="flex flex-col gap-3">
            {shadows.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div
                  className="h-8 w-24 rounded bg-app-surface"
                  style={{ boxShadow: s.style }}
                />
                <span className="font-mono text-[10px] text-app-subtle">{s.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ── Motion section ───────────────────────────────────────────── */

function MotionSection() {
  const duration    = useHub((s) => s.timeline.duration)
  const setDuration = useHub((s) => s.setDuration)

  const easings = [
    { label: 'ease-in',     curve: 'cubic-bezier(0.4, 0, 1, 1)'         },
    { label: 'ease-out',    curve: 'cubic-bezier(0, 0, 0.2, 1)'         },
    { label: 'ease-in-out', curve: 'cubic-bezier(0.4, 0, 0.2, 1)'      },
    { label: 'spring',      curve: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  ]

  return (
    <div>
      <SectionTitle>Motion</SectionTitle>
      <Card>
        <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold text-app-muted">
          <span>Timeline Duration ·</span>
          <Scrubber
            value={duration}
            onChange={setDuration}
            min={0.4}
            max={8}
            step={0.1}
            pixelsPerStep={5}
            format={(v) => `${v.toFixed(1)}s`}
          />
        </div>
        <div className="flex flex-col gap-4">
          {easings.map((e) => (
            <div key={e.label} className="flex items-center gap-4">
              <span className="w-24 shrink-0 font-mono text-[10px] text-app-subtle">
                {e.label}
              </span>
              <div className="relative h-1 flex-1 rounded-full bg-app-elevated">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-app-accent/30 to-app-accent" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ── Components tab ───────────────────────────────────────────── */

function ComponentsSection({ tokens }: TokensProps) {
  // Variant matrix: button states
  const buttonVariants = [
    { label: 'Default',  opacity: 1,   cursor: 'pointer' },
    { label: 'Hover',    opacity: 0.9,  cursor: 'pointer' },
    { label: 'Focus',    outline: `2px solid ${tokens.brand}`, cursor: 'pointer' },
    { label: 'Disabled', opacity: 0.35, cursor: 'not-allowed' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Buttons */}
      <div>
        <SectionTitle>Buttons & Inputs</SectionTitle>
        <Card>
          {/* Variant matrix */}
          <p className="mb-3 text-[10px] font-semibold text-app-muted">Variant Matrix — Primary Button</p>
          <div className="mb-4 grid grid-cols-4 gap-2">
            {buttonVariants.map((v) => (
              <div key={v.label} className="flex flex-col items-center gap-1.5">
                <button
                  className="w-full rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity"
                  style={{
                    background: tokens.brand,
                    opacity: v.opacity ?? 1,
                    outline: v.outline,
                    cursor: v.cursor,
                  }}
                >
                  Button
                </button>
                <span className="text-[9px] text-app-subtle">{v.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: tokens.brand }}
            >
              Primary
            </button>
            <button
              className="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-app-elevated"
              style={{ borderColor: tokens.brand, color: tokens.brand }}
            >
              Outline
            </button>
            <button className="rounded-lg bg-app-elevated px-4 py-2 text-sm font-semibold text-app-muted transition-colors hover:bg-app-border">
              Secondary
            </button>
            <button className="text-sm font-semibold text-app-subtle underline-offset-4 hover:text-app-text hover:underline">
              Ghost
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              readOnly
              value="Input field"
              className="rounded-lg border border-app-border bg-app-elevated px-3 py-2 text-sm text-app-text outline-none"
            />
            <input
              readOnly
              value="Focused"
              className="rounded-lg border px-3 py-2 text-sm text-app-text outline-none"
              style={{ borderColor: tokens.accent }}
            />
          </div>
        </Card>
      </div>

      {/* Cards */}
      <div>
        <SectionTitle>Cards & Data Display</SectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['Default Card', 'Elevated Card', 'Brand Card'] as const).map((title, i) => (
            <div
              key={title}
              className="rounded-xl border p-4"
              style={{
                borderColor: i === 2 ? tokens.brand : tokens.border,
                background:
                  i === 1 ? tokens.elevated
                  : i === 2 ? `${tokens.brand}14`
                  : tokens.surface,
              }}
            >
              <p className="text-sm font-semibold text-app-text">{title}</p>
              <p className="mt-1 text-xs text-app-subtle">
                Pick a card style that matches your overall aesthetic.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── WCAG validation banner ──────────────────────────────────── */

function WcagBanner({ tokens }: TokensProps) {
  const pairs = [
    { label: 'Text on BG',           fg: tokens.text,       bg: tokens.bg      },
    { label: 'Muted text on BG',     fg: tokens.textMuted,  bg: tokens.bg      },
    { label: 'Subtle text on BG',    fg: tokens.textSubtle, bg: tokens.bg      },
    { label: 'On-brand on brand',    fg: tokens.onBrand,    bg: tokens.brand   },
    { label: 'Text on surface',      fg: tokens.text,       bg: tokens.surface },
  ]
  const failures = pairs.filter((p) => contrastRatio(p.fg, p.bg) < 4.5)

  if (failures.length === 0) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/8 px-3 py-2 text-[11px] text-green-400">
        <span className="text-base">✓</span>
        All critical color pairs pass WCAG 2.2 AA (4.5:1)
      </div>
    )
  }

  return (
    <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/8 px-3 py-2 text-[11px] text-red-400">
      <div className="mb-1 font-semibold">
        ⚠ {failures.length} contrast {failures.length === 1 ? 'failure' : 'failures'} — WCAG 2.2 AA
      </div>
      <ul className="space-y-0.5 text-[10px] text-red-300/80">
        {failures.map((f) => (
          <li key={f.label}>
            {f.label}: {contrastRatio(f.fg, f.bg).toFixed(2)}:1 (need 4.5:1)
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Single token pane ────────────────────────────────────────── */

function TokensPane({ tokens, label, dir }: { tokens: ResolvedTokens; label: string; dir: 'ltr' | 'rtl' }) {
  return (
    <div className="min-w-0 flex-1" dir={dir}>
      <div className="sticky top-0 z-10 border-b border-app-border bg-app-surface/90 px-4 py-2 backdrop-blur-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-app-subtle">{label}</span>
      </div>
      <div className="space-y-10 px-6 py-6">
        <WcagBanner tokens={tokens} />
        <ColorSection tokens={tokens} />
        <TypographySection tokens={tokens} />
        <SpacingSection />
        <ShapeSection tokens={tokens} />
        <MotionSection />
      </div>
    </div>
  )
}

/* ── Public component ─────────────────────────────────────────── */

/** Dense Relume-style token & component grid for DESIGN_SYSTEM mode. */
export function DesignSystemViewport() {
  const [viewMode, setViewMode] = useState<'single' | 'split'>('single')

  const tokensLight = useResolvedTokens('light')
  const tokensDark  = useResolvedTokens('dark')
  const tokensSingle = useResolvedTokens()

  return (
    <div className="flex h-full flex-col overflow-hidden bg-app-bg">
      <RadixTabs.Root defaultValue="tokens" className="flex h-full flex-col">
        {/* Tab strip */}
        <RadixTabs.List className="flex shrink-0 items-center gap-1 border-b border-app-border bg-app-surface px-4">
          {(['tokens', 'components'] as const).map((tab) => (
            <RadixTabs.Trigger
              key={tab}
              value={tab}
              className={cn(
                'relative flex h-10 items-center px-4 text-[12px] font-medium capitalize transition-colors',
                'text-app-subtle hover:text-app-muted',
                'data-[state=active]:text-app-text',
                'focus-visible:outline-none',
              )}
            >
              {tab}
              <span className="absolute inset-x-0 bottom-0 h-[2px] scale-x-0 rounded-t bg-app-accent transition-transform data-[state=active]:scale-x-100" />
            </RadixTabs.Trigger>
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Dual-axis toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-app-border bg-app-elevated p-0.5">
            {(['single', 'split'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={cn(
                  'rounded-md px-3 py-1 text-[11px] font-medium transition-colors',
                  viewMode === m
                    ? 'bg-app-accent text-white'
                    : 'text-app-subtle hover:text-app-text',
                )}
              >
                {m === 'single' ? '◻ Single' : '◫ Split LTR/RTL'}
              </button>
            ))}
          </div>
        </RadixTabs.List>

        {/* Tokens tab */}
        <RadixTabs.Content value="tokens" className="flex min-h-0 flex-1 overflow-hidden">
          {viewMode === 'split' ? (
            /* Dual-axis: light/LTR + dark/RTL side by side */
            <div className="flex min-h-0 flex-1 divide-x divide-app-border overflow-hidden">
              <div className="app-scroll flex-1 overflow-y-auto">
                <TokensPane tokens={tokensLight} label="☀ Light · LTR" dir="ltr" />
              </div>
              <div className="app-scroll flex-1 overflow-y-auto bg-[#161616]">
                <TokensPane tokens={tokensDark} label="🌙 Dark · RTL" dir="rtl" />
              </div>
            </div>
          ) : (
            /* Single pane */
            <div className="app-scroll flex-1 overflow-y-auto">
              <div className="mx-auto max-w-6xl space-y-10 px-6 py-6">
                <WcagBanner tokens={tokensSingle} />
                <ColorSection tokens={tokensSingle} />
                <TypographySection tokens={tokensSingle} />
                <SpacingSection />
                <ShapeSection tokens={tokensSingle} />
                <MotionSection />
              </div>
            </div>
          )}
        </RadixTabs.Content>

        {/* Components tab */}
        <RadixTabs.Content value="components" className="app-scroll flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <ComponentsSection tokens={tokensSingle} />
          </div>
        </RadixTabs.Content>
      </RadixTabs.Root>
    </div>
  )
}
