'use client'

import { useMemo } from 'react'
import { ArrowUpRight, Bell, Search, Star, TrendingUp, User } from 'lucide-react'
import type { ThemeTokens } from './theme-presets'

interface Props {
  tokens: ThemeTokens
  radius: number   // rem
  fontSans: string
  fontMono: string
  mode: 'light' | 'dark'
  /** Surface treatment: flat | glass | brutalist. Defaults to flat. */
  surfaceStyle?: 'flat' | 'glass' | 'brutalist'
  /** Shadow intensity: none | soft | hard | glow | neon. Defaults to soft. */
  shadowStyle?: 'none' | 'soft' | 'hard' | 'glow' | 'neon'
  /** Body letter-spacing in em. */
  letterSpacing?: number
  /** Contrast multiplier 0.7–1.4 — affects text/bg lightness diff in preview. */
  contrast?: number
}

function shadowFor(style: NonNullable<Props['shadowStyle']>, primary: string): string {
  switch (style) {
    case 'none': return 'none'
    case 'hard': return '4px 4px 0 0 rgba(0,0,0,0.85)'
    case 'glow': return `0 0 24px ${primary}55`
    case 'neon': return `0 0 8px ${primary}, 0 0 24px ${primary}88`
    default:     return '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.06)'
  }
}

function surfaceStyleFor(style: NonNullable<Props['surfaceStyle']>, cardBg: string): React.CSSProperties {
  switch (style) {
    case 'glass': return {
      background: `color-mix(in srgb, ${cardBg} 60%, transparent)`,
      backdropFilter: 'blur(16px) saturate(140%)',
      WebkitBackdropFilter: 'blur(16px) saturate(140%)',
    }
    case 'brutalist': return {
      background: cardBg,
      border: '2px solid currentColor',
    }
    default: return { background: cardBg }
  }
}

/**
 * Live preview of the theme being edited. Renders a representative
 * dashboard slice (cards, buttons, inputs, badges, chart) using
 * the supplied tokens via inline CSS variables. The preview is fully
 * self-contained and never leaks tokens onto :root.
 */
export function ThemingPreview({
  tokens, radius, fontSans, fontMono, mode,
  surfaceStyle = 'flat', shadowStyle = 'soft', letterSpacing = 0,
}: Props) {
  const cardShadow  = useMemo(() => shadowFor(shadowStyle, tokens.primary), [shadowStyle, tokens.primary])
  const cardBg = surfaceStyle === 'glass'
    ? `color-mix(in srgb, ${tokens.card} 55%, transparent)`
    : tokens.card
  const cardBackdrop = surfaceStyle === 'glass' ? 'blur(20px) saturate(140%)' : 'none'
  const cardBorder   = surfaceStyle === 'brutalist'
    ? `3px solid ${tokens.foreground}`
    : `1px solid ${tokens.border}`

  const style = useMemo(() => ({
    background:          tokens.background,
    color:               tokens.foreground,
    fontFamily:          fontSans,
    letterSpacing:       `${letterSpacing}em`,
    // expose tokens as scoped CSS vars for nested components
    '--bg':              tokens.background,
    '--fg':              tokens.foreground,
    '--card':            tokens.card,
    '--card-fg':         tokens.cardForeground,
    '--primary':         tokens.primary,
    '--primary-fg':      tokens.primaryForeground,
    '--secondary':       tokens.secondary,
    '--secondary-fg':    tokens.secondaryForeground,
    '--muted':           tokens.muted,
    '--muted-fg':        tokens.mutedForeground,
    '--accent':          tokens.accent,
    '--accent-fg':       tokens.accentForeground,
    '--destructive':     tokens.destructive,
    '--destructive-fg':  tokens.destructiveForeground,
    '--border':          tokens.border,
    '--input':           tokens.input,
    '--ring':            tokens.ring,
    '--c1':              tokens.chart1,
    '--c2':              tokens.chart2,
    '--c3':              tokens.chart3,
    '--c4':              tokens.chart4,
    '--c5':              tokens.chart5,
    '--radius':          `${radius}rem`,
    '--font-mono':       fontMono,
    '--card-bg':         cardBg,
    '--card-shadow':     cardShadow,
    '--card-backdrop':   cardBackdrop,
    '--card-border':     cardBorder,
  } as React.CSSProperties), [tokens, radius, fontSans, fontMono, letterSpacing, cardBg, cardShadow, cardBackdrop, cardBorder])

  return (
    <div style={style} className="min-h-full p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <header
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: 'var(--card-bg, var(--card))',
            color: 'var(--card-fg)',
            border: 'var(--card-border, 1px solid var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--card-shadow, none)',
            backdropFilter: 'var(--card-backdrop, none)',
            WebkitBackdropFilter: 'var(--card-backdrop, none)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center h-7 w-7"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)', borderRadius: 'calc(var(--radius) - 2px)' }}
            >
              <Star size={14} />
            </div>
            <span className="font-semibold text-[14px]">Acme · Dashboard</span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5"
              style={{
                background: 'var(--muted)',
                color: 'var(--muted-fg)',
                borderRadius: 'calc(var(--radius) - 4px)',
              }}
            >
              {mode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-2.5 h-7 w-44"
              style={{
                background: 'var(--input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <Search size={12} style={{ color: 'var(--muted-fg)' }} />
              <span className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>Search…</span>
            </div>
            <button
              className="flex items-center justify-center h-7 w-7"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-fg)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
              aria-label="Notifications"
            >
              <Bell size={12} />
            </button>
            <button
              className="flex items-center justify-center h-7 w-7"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-fg)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}
              aria-label="Account"
            >
              <User size={12} />
            </button>
          </div>
        </header>

        {/* KPI cards */}
        <section className="grid grid-cols-4 gap-4">
          {[
            { label: 'Revenue',  value: '$48,219', delta: '+12.4%', color: 'var(--c1)' },
            { label: 'Customers', value: '2,431',  delta: '+3.1%',  color: 'var(--c2)' },
            { label: 'MRR',       value: '$8,902', delta: '+7.8%',  color: 'var(--c3)' },
            { label: 'Churn',     value: '1.2%',   delta: '-0.4%',  color: 'var(--c4)' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col gap-2 p-4"
              style={{
                background: 'var(--card)',
                color: 'var(--card-fg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <p className="text-[11px] font-medium" style={{ color: 'var(--muted-fg)' }}>{kpi.label}</p>
              <p className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>{kpi.value}</p>
              <div className="flex items-center gap-1 text-[10.5px] font-semibold" style={{ color: kpi.color }}>
                <TrendingUp size={11} />
                {kpi.delta}
              </div>
            </div>
          ))}
        </section>

        {/* Chart + side */}
        <section className="grid grid-cols-3 gap-4">
          <div
            className="col-span-2 p-5 flex flex-col gap-3"
            style={{
              background: 'var(--card)',
              color: 'var(--card-fg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold">Weekly performance</p>
                <p className="text-[10.5px]" style={{ color: 'var(--muted-fg)' }}>Last 7 days · chart-1 → chart-5</p>
              </div>
              <button
                className="flex items-center gap-1 text-[10.5px] font-medium px-2 h-6"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-fg)',
                  borderRadius: 'calc(var(--radius) - 2px)',
                }}
              >
                Details <ArrowUpRight size={10} />
              </button>
            </div>
            <MiniChart tokens={tokens} />
          </div>

          <div
            className="p-5 flex flex-col gap-3"
            style={{
              background: 'var(--card)',
              color: 'var(--card-fg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p className="text-[12px] font-semibold">Buttons</p>
            <div className="flex flex-wrap gap-2">
              <button
                className="h-7 px-3 text-[11px] font-medium"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-fg)',
                  borderRadius: 'var(--radius)',
                }}
              >Primary</button>
              <button
                className="h-7 px-3 text-[11px] font-medium"
                style={{
                  background: 'var(--secondary)',
                  color: 'var(--secondary-fg)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >Secondary</button>
              <button
                className="h-7 px-3 text-[11px] font-medium"
                style={{
                  background: 'transparent',
                  color: 'var(--fg)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >Outline</button>
              <button
                className="h-7 px-3 text-[11px] font-medium"
                style={{
                  background: 'var(--destructive)',
                  color: 'var(--destructive-fg)',
                  borderRadius: 'var(--radius)',
                }}
              >Destructive</button>
            </div>

            <p className="text-[12px] font-semibold mt-2">Input</p>
            <input
              placeholder="hello@acme.dev"
              className="h-8 px-2.5 text-[12px] outline-none"
              style={{
                background: 'var(--input)',
                color: 'var(--fg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: `0 0 0 0px var(--ring)`,
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in srgb, ${tokens.ring} 30%, transparent)`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
            />

            <p className="text-[12px] font-semibold mt-2">Badges</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Default',     bg: 'var(--primary)',     fg: 'var(--primary-fg)' },
                { label: 'Secondary',   bg: 'var(--secondary)',   fg: 'var(--secondary-fg)' },
                { label: 'Outline',     bg: 'transparent',        fg: 'var(--fg)' },
                { label: 'Destructive', bg: 'var(--destructive)', fg: 'var(--destructive-fg)' },
              ].map((b) => (
                <span
                  key={b.label}
                  className="text-[10px] font-medium px-2 py-0.5"
                  style={{
                    background: b.bg,
                    color: b.fg,
                    borderRadius: 'calc(var(--radius) + 6px)',
                    border: b.label === 'Outline' ? '1px solid var(--border)' : '1px solid transparent',
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Table */}
        <section
          className="p-0 overflow-hidden"
          style={{
            background: 'var(--card-bg, var(--card))',
            color: 'var(--card-fg)',
            border: 'var(--card-border, 1px solid var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--card-shadow, none)',
            backdropFilter: 'var(--card-backdrop, none)',
            WebkitBackdropFilter: 'var(--card-backdrop, none)',
          }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-[12px] font-semibold">Recent activity</p>
            <span className="text-[10.5px]" style={{ color: 'var(--muted-fg)' }}>5 of 142</span>
          </div>
          <div className="flex flex-col">
            {[
              { user: 'Lana W.',  action: 'created invoice #1042', when: '2m', color: 'var(--c1)' },
              { user: 'Yuki S.',  action: 'refunded order #884',   when: '14m', color: 'var(--c2)' },
              { user: 'Ravi P.',  action: 'updated profile',        when: '1h', color: 'var(--c3)' },
              { user: 'Mia B.',   action: 'invited 2 teammates',    when: '3h', color: 'var(--c4)' },
              { user: 'Tomás G.', action: 'archived project',       when: '5h', color: 'var(--c5)' },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-2.5 text-[11.5px]"
                style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
                  <span className="font-medium">{row.user}</span>
                  <span style={{ color: 'var(--muted-fg)' }}>{row.action}</span>
                </div>
                <span style={{ color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)' }}>{row.when}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ─── Mini bar chart ─────────────────────────────────────────────────────────

function MiniChart({ tokens }: { tokens: ThemeTokens }) {
  const colors = [tokens.chart1, tokens.chart2, tokens.chart3, tokens.chart4, tokens.chart5]
  // Stable pseudo-random heights derived from index — avoids hydration flicker
  const heights = [62, 48, 78, 36, 84, 52, 70]
  return (
    <div className="h-32 flex items-end gap-3 pt-2">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-stretch gap-1">
          <div
            className="w-full transition-all duration-200"
            style={{
              height: `${h}%`,
              background: colors[i % colors.length],
              borderRadius: 'calc(var(--radius) - 4px)',
              opacity: 0.85,
            }}
          />
          <span className="text-[9.5px] text-center" style={{ color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)' }}>
            {['M','T','W','T','F','S','S'][i]}
          </span>
        </div>
      ))}
    </div>
  )
}
