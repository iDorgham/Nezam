'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { useHub } from '@/store/hub.store'
import { useTokens } from '@/hooks/useTokens'
import { cn } from '@/lib/cn'

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

/* ── Color section ────────────────────────────────────────────── */

function ColorSection() {
  const tokens = useTokens()

  const groups: Array<{ label: string; swatches: Array<{ name: string; value: string }> }> = [
    {
      label: 'Primary Brand',
      swatches: [
        { name: 'Brand',        value: tokens.brand       },
        { name: 'Brand Hover',  value: tokens.brandHover  },
        { name: 'Brand Subtle', value: tokens.brandSubtle },
        { name: 'On Brand',     value: tokens.onBrand     },
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
        { name: 'Text',       value: tokens.text       },
        { name: 'Text Muted', value: tokens.textMuted  },
        { name: 'Subtle',     value: tokens.textSubtle },
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
              {group.swatches.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span
                    className="h-5 w-5 shrink-0 rounded border border-app-border shadow-sm"
                    style={{ background: s.value }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-app-text">{s.name}</p>
                    <p className="font-mono text-[9px] text-app-subtle">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ── Typography section ───────────────────────────────────────── */

function TypographySection() {
  const tokens = useTokens()

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

function ShapeSection() {
  const tokens = useTokens()
  const radii   = [0, 4, 8, 12, 16, 24]

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
          <p className="mb-3 text-[10px] font-semibold text-app-muted">
            Border Radius · current: {tokens.radius}px
          </p>
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
  const duration = useHub((s) => s.timeline.duration)

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
        <p className="mb-3 text-[10px] font-semibold text-app-muted">
          Timeline Duration · {duration}s
        </p>
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

function ComponentsSection() {
  const tokens = useTokens()

  return (
    <div className="flex flex-col gap-8">
      {/* Buttons */}
      <div>
        <SectionTitle>Buttons & Inputs</SectionTitle>
        <Card>
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

/* ── Public component ─────────────────────────────────────────── */

/** Dense Relume-style token & component grid for DESIGN_SYSTEM mode. */
export function DesignSystemViewport() {
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
        </RadixTabs.List>

        {/* Tokens tab */}
        <RadixTabs.Content value="tokens" className="app-scroll flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-10 px-6 py-6">
            <ColorSection />
            <TypographySection />
            <SpacingSection />
            <ShapeSection />
            <MotionSection />
          </div>
        </RadixTabs.Content>

        {/* Components tab */}
        <RadixTabs.Content value="components" className="app-scroll flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <ComponentsSection />
          </div>
        </RadixTabs.Content>
      </RadixTabs.Root>
    </div>
  )
}
