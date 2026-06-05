'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight, Bell, Search, Star, TrendingUp, TrendingDown, User, Check, Play,
  SlidersHorizontal, Settings, CircleAlert, CheckCircle2, Info, AlertTriangle, Layers,
  Compass, Plus, ChevronRight, Activity, Clock, ShieldCheck, Sparkles, LayoutGrid, Zap
} from 'lucide-react'
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
  /** Dynamic Border size slider (0px to 6px) */
  borderWidth?: number
  /** Dynamic Motion Curves preset */
  motionStyle?: 'none' | 'smooth' | 'spring' | 'pulsing'
}

function shadowFor(
  style: NonNullable<Props['shadowStyle']>,
  surface: NonNullable<Props['surfaceStyle']>,
  primary: string,
  mode: 'light' | 'dark',
  border: string
): string {
  if (surface === 'brutalist') {
    if (style === 'none') return 'none'
    const shadowColor = mode === 'dark' ? primary : '#111827'
    return `5px 5px 0 0 ${shadowColor}`
  }

  switch (style) {
    case 'none': return 'none'
    case 'hard': return mode === 'dark' ? `5px 5px 0 0 ${primary}` : '5px 5px 0 0 rgba(0,0,0,0.85)'
    case 'glow': return `0 0 24px ${primary}40`
    case 'neon': return `0 0 8px ${primary}, 0 0 24px ${primary}60`
    default:     return mode === 'dark'
      ? '0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.6)'
      : '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)'
  }
}

export function ThemingPreview({
  tokens, radius, fontSans, fontMono, mode,
  surfaceStyle = 'flat', shadowStyle = 'soft', letterSpacing = 0,
  contrast = 1, borderWidth = 1, motionStyle = 'smooth'
}: Props) {
  // Live state interactive playground components
  const [toggleActive, setToggleActive] = useState(true)
  const [checkbox1, setCheckbox1] = useState(true)
  const [checkbox2, setCheckbox2] = useState(false)
  const [checkboxBlocked, setCheckboxBlocked] = useState(false)
  const [sliderVal, setSliderVal] = useState(72)
  const [activeSegment, setActiveSegment] = useState<'metrics' | 'activity'>('metrics')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeChartFilter, setActiveChartFilter] = useState<'7d' | '30d'>('7d')

  const cardShadow = useMemo(() => shadowFor(shadowStyle, surfaceStyle, tokens.primary, mode, tokens.border), [shadowStyle, surfaceStyle, tokens.primary, mode, tokens.border])
  
  const cardBg = useMemo(() => {
    if (surfaceStyle === 'glass') {
      return `color-mix(in srgb, ${tokens.card} 60%, transparent)`
    }
    return tokens.card
  }, [surfaceStyle, tokens.card])

  const cardBackdrop = surfaceStyle === 'glass' ? 'blur(20px) saturate(140%)' : 'none'
  
  // Calculate borders based on selected borderWidth knob
  const calculatedBorder = useMemo(() => {
    if (borderWidth === 0) return 'none'
    const color = surfaceStyle === 'brutalist' ? tokens.foreground : tokens.border
    return `${borderWidth}px solid ${color}`
  }, [borderWidth, surfaceStyle, tokens.border, tokens.foreground])

  // Get active transition/animation style matching selected motionStyle curve
  const getTransitionStyle = (): React.CSSProperties => {
    if (motionStyle === 'none') {
      return { transition: 'none' }
    }
    if (motionStyle === 'spring') {
      return { transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    }
    // smooth
    return { transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }
  }

  // Hover transition helper styles
  const getInteractiveHoverClass = (): string => {
    if (motionStyle === 'none') return ''
    if (motionStyle === 'spring') return 'hover:-translate-y-1 hover:scale-[1.015] hover:shadow-lg'
    return 'hover:-translate-y-0.5 hover:scale-[1.005] hover:shadow-sm'
  }

  // Standard container style applied to all dashboard cards
  const containerStyle = useMemo(() => ({
    background: cardBg,
    color: tokens.cardForeground,
    border: calculatedBorder,
    borderRadius: surfaceStyle === 'brutalist' ? '0px' : `${radius}rem`,
    boxShadow: cardShadow,
    backdropFilter: cardBackdrop,
    WebkitBackdropFilter: cardBackdrop,
    ...getTransitionStyle(),
  } as React.CSSProperties), [cardBg, calculatedBorder, cardShadow, cardBackdrop, surfaceStyle, radius, tokens.cardForeground, motionStyle])

  // Reusable button styles helper
  const getButtonStyle = (bg: string, fg: string, isOutline = false, isDisabled = false): React.CSSProperties => {
    const isBrutalist = surfaceStyle === 'brutalist'
    const borderVal = borderWidth === 0 ? 'none' : isBrutalist
      ? `${borderWidth}px solid ${tokens.foreground}`
      : isOutline ? `1px solid ${tokens.border}` : 'none'
    
    let shadowVal = 'none'
    if (isBrutalist && !isDisabled) {
      shadowVal = mode === 'dark' ? `2px 2px 0 0 ${tokens.primary}` : `2px 2px 0 0 rgba(0,0,0,1)`
    } else if (shadowStyle === 'glow' && !isDisabled && !isOutline) {
      shadowVal = `0 0 10px ${bg}50`
    } else if (shadowStyle === 'neon' && !isDisabled && !isOutline) {
      shadowVal = `0 0 6px ${bg}, 0 0 16px ${bg}80`
    }
      
    return {
      background: isDisabled ? 'var(--muted)' : bg,
      color: isDisabled ? 'var(--muted-fg)' : fg,
      border: borderVal,
      borderRadius: isBrutalist ? '0px' : `${radius}rem`,
      boxShadow: shadowVal,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      fontFamily: fontSans,
      letterSpacing: `${letterSpacing}em`,
      ...getTransitionStyle(),
    }
  }

  // Render a visual visual mockup dashboard/interface acting as high-fidelity "mock image"
  const renderVisualProductImage = () => {
    const isBrutalist = surfaceStyle === 'brutalist'
    return (
      <div 
        className={cn(
          "w-full h-full relative overflow-hidden flex flex-col gap-2 p-3.5",
          motionStyle === 'pulsing' ? 'animate-pulse' : ''
        )}
        style={{
          background: 'var(--card)',
          borderRadius: isBrutalist ? '0px' : `${radius}rem`,
          border: calculatedBorder,
          boxShadow: shadowStyle === 'none' ? 'none' : '0 10px 30px rgba(0,0,0,0.08)',
          ...getTransitionStyle(),
        }}
      >
        {/* Floating elements inside simulated screenshot image */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: 'var(--primary)' }} />
            <span className="text-[9.5px] font-bold tracking-tight">Active Analytics Module</span>
          </div>
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c1)' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c2)' }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1">
          {/* Left mini sidebar layout inside image */}
          <div className="border-r border-[var(--border)] pr-2 flex flex-col gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-3.5 rounded flex items-center px-1"
                style={{ background: i === 1 ? 'var(--primary)' : 'var(--secondary)' }}
              >
                <div className="h-1 w-6 rounded" style={{ background: i === 1 ? 'var(--primary-fg)' : 'var(--muted-fg)' }} />
              </div>
            ))}
          </div>

          {/* Right main workspace layout inside image */}
          <div className="col-span-2 flex flex-col gap-2">
            <div className="flex justify-between items-center bg-[var(--input)] p-1.5 rounded border border-[var(--border)]">
              <div className="h-2 w-14 rounded" style={{ background: 'var(--c1)' }} />
              <div className="h-2.5 w-5 rounded" style={{ background: 'var(--primary)' }} />
            </div>
            {/* SVG mini chart inside image */}
            <div className="h-16 w-full flex items-end gap-1 border-b border-[var(--border)] pb-1 pt-1">
              {[45, 68, 30, 85, 52, 90, 60].map((h, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 rounded-t transition-all"
                  style={{ 
                    height: `${h}%`, 
                    background: idx % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                    opacity: 0.8
                  }} 
                />
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-mono text-[var(--muted-fg)]">
              <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Absolute floating glowing badge inside image */}
        <div 
          className="absolute bottom-3 right-3 p-1.5 shadow-lg border border-[var(--border)] flex items-center gap-1.5"
          style={{
            background: 'var(--card)',
            borderRadius: isBrutalist ? '0px' : '4px',
          }}
        >
          <Zap size={9} style={{ color: 'var(--primary)' }} />
          <span className="text-[8px] font-bold">2.4ms Sync</span>
        </div>
      </div>
    )
  }

  // Master CSS variable scope applied to preview wrapper
  const style = useMemo(() => ({
    background:          tokens.background,
    color:               tokens.foreground,
    fontFamily:          fontSans,
    letterSpacing:       `${letterSpacing}em`,
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
  } as React.CSSProperties), [tokens, radius, fontSans, fontMono, letterSpacing])

  return (
    <div data-spotlight="theming-preview-pane" style={style} className="min-h-full p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Dynamic Interactive Header */}
        <header
          className="flex items-center justify-between px-5 py-4"
          style={containerStyle}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center h-8 w-8 transition-all duration-300 hover:rotate-12"
              style={{ 
                background: 'var(--primary)', 
                color: 'var(--primary-fg)', 
                borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 2px)',
                border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none',
                boxShadow: surfaceStyle === 'brutalist' ? '2px 2px 0 var(--fg)' : 'none',
              }}
            >
              <Star size={16} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[15px] tracking-tight">Nezaam Core</span>
                <span
                  className="text-[9.5px] font-bold px-1.5 py-0.5 uppercase tracking-wide transition-all"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--primary-fg)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '3px',
                    border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none',
                  }}
                >
                  PRO
                </span>
              </div>
              <p className="text-[10px]" style={{ color: 'var(--muted-fg)' }}>WORKSPACE HUB MANAGER</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input with Active Focus Border */}
            <div
              className="flex items-center gap-2 px-3 h-8 w-52 transition-all duration-200"
              style={{
                background: 'var(--input)',
                border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' 
                  ? `${borderWidth}px solid var(--fg)` 
                  : searchFocused 
                    ? '1px solid var(--primary)' 
                    : '1px solid var(--border)',
                borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'var(--radius)',
                boxShadow: searchFocused && surfaceStyle !== 'brutalist'
                  ? '0 0 0 2px color-mix(in srgb, var(--primary) 25%, transparent)'
                  : 'none',
              }}
            >
              <Search size={13} style={{ color: 'var(--muted-fg)' }} />
              <input
                type="text"
                placeholder="Quick search workspace..."
                className="bg-transparent border-none outline-none text-[11.5px] w-full"
                style={{ color: 'var(--fg)' }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>

            {/* Pulse Indicator Status Light */}
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-fg)',
                borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 3px)',
                border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--primary)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--primary)' }}></span>
              </span>
              System Live
            </div>

            {/* Notification triggers */}
            <button
              className="relative flex items-center justify-center h-8 w-8 transition-all hover:scale-105"
              style={getButtonStyle('var(--secondary)', 'var(--secondary-fg)', true)}
              aria-label="Notifications"
            >
              <Bell size={13} />
              <span 
                className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full border border-current"
                style={{ background: 'var(--destructive)', color: 'var(--card)' }}
              />
            </button>

            <button
              className="flex items-center justify-center h-8 w-8 transition-all hover:scale-105"
              style={getButtonStyle('var(--secondary)', 'var(--secondary-fg)', true)}
              aria-label="Account Settings"
            >
              <User size={13} />
            </button>
          </div>
        </header>

        {/* 🚀 New High-End Marketing Hero Landing Panel with Floating visual Mock Image */}
        <section 
          className={cn(
            "grid grid-cols-1 lg:grid-cols-5 p-6 sm:p-8 gap-6 sm:gap-8 items-center overflow-hidden",
            getInteractiveHoverClass()
          )}
          style={containerStyle}
        >
          <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
              <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Egypt\'s Leading SaaS Blueprint</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.1] max-w-lg">
              Powering Operational Digital Excellence
            </h1>
            
            <p className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: 'var(--muted-fg)' }}>
              Nezaam provides Egyptian product managers, engineers, and designers a unified ecosystem to inspect custom variables, generate mathematical color scale presets, and align components across multiple devices seamlessly.
            </p>

            <div className="flex flex-wrap gap-3 mt-1">
              <button 
                className="h-9 px-5 text-[11.5px] font-bold uppercase transition-all"
                style={getButtonStyle('var(--primary)', 'var(--primary-fg)')}
              >
                Start deploying free
              </button>
              <button 
                className="h-9 px-5 text-[11.5px] font-bold uppercase transition-all"
                style={getButtonStyle('transparent', 'var(--fg)', true)}
              >
                Inspect preset scales
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2 text-[10px] font-bold" style={{ color: 'var(--muted-fg)' }}>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={13} style={{ color: 'var(--c1)' }} /> ISO Certified</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={13} style={{ color: 'var(--c1)' }} /> Egypt SLA 99.9%</div>
            </div>
          </div>

          {/* Graphical Mock Illustration Card Acting as "Mock Image" */}
          <div className="lg:col-span-2 h-56 lg:h-64 flex items-center justify-center p-1 bg-neutral-500/5 rounded-xl border border-dashed border-[var(--border)]">
            {renderVisualProductImage()}
          </div>
        </section>

        {/* High-Contrast Interactive KPI Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Revenue with Mini SVG Sparkline */}
          <div className={cn("flex flex-col justify-between p-5", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-fg)' }}>Revenue</p>
                <span 
                  className="flex items-center gap-0.5 text-[10.5px] font-bold px-1.5 py-0.5"
                  style={{ 
                    background: 'color-mix(in srgb, var(--c1) 15%, transparent)', 
                    color: 'var(--c1)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                    border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none'
                  }}
                >
                  <TrendingUp size={11} /> +12.4%
                </span>
              </div>
              <p className="text-[26px] font-extrabold tracking-tight mt-1" style={{ fontFamily: 'var(--font-mono)' }}>$48,219</p>
            </div>
            
            {/* Smooth mini SVG sparkline */}
            <div className="h-10 w-full mt-3">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-c1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--c1)" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="var(--c1)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M0,25 C10,24 15,10 25,12 C35,14 40,28 50,20 C60,12 65,8 75,5 C85,2 90,4 100,1" 
                  fill="none" 
                  stroke="var(--c1)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M0,25 C10,24 15,10 25,12 C35,14 40,28 50,20 C60,12 65,8 75,5 C85,2 90,4 100,1 L100,30 L0,30 Z" 
                  fill="url(#spark-c1)"
                />
              </svg>
            </div>
            <p className="text-[9.5px] mt-2" style={{ color: 'var(--muted-fg)' }}>Target: $50,000 monthly</p>
          </div>

          {/* Card 2: Customers with premium Avatar cluster stack */}
          <div className={cn("flex flex-col justify-between p-5", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-fg)' }}>Customers</p>
                <span 
                  className="flex items-center gap-0.5 text-[10.5px] font-bold px-1.5 py-0.5"
                  style={{ 
                    background: 'color-mix(in srgb, var(--c2) 15%, transparent)', 
                    color: 'var(--c2)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                    border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none'
                  }}
                >
                  <TrendingUp size={11} /> +3.1%
                </span>
              </div>
              <p className="text-[26px] font-extrabold tracking-tight mt-1" style={{ fontFamily: 'var(--font-mono)' }}>2,431</p>
            </div>

            {/* Overlapping Avatar Stacks with custom colors */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex -space-x-2.5 overflow-hidden">
                {['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)'].map((col, idx) => (
                  <div 
                    key={idx}
                    className="inline-block h-6 w-6 rounded-full ring-2 text-[8px] font-bold flex items-center justify-center"
                    style={{ 
                      background: col, 
                      color: 'var(--card)', 
                      outline: '2px solid var(--card)',
                      border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none'
                    }}
                  >
                    {['LW', 'YS', 'RP', 'MB', 'TG'][idx]}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--muted-fg)' }}>+14 new today</span>
            </div>
            <p className="text-[9.5px] mt-2" style={{ color: 'var(--muted-fg)' }}>Active churn rate remains low</p>
          </div>

          {/* Card 3: MRR with Dynamic Progress Bar Indicator */}
          <div className={cn("flex flex-col justify-between p-5", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-fg)' }}>Monthly Recurring</p>
                <span 
                  className="flex items-center gap-0.5 text-[10.5px] font-bold px-1.5 py-0.5"
                  style={{ 
                    background: 'color-mix(in srgb, var(--c3) 15%, transparent)', 
                    color: 'var(--c3)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                    border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none'
                  }}
                >
                  <TrendingUp size={11} /> +7.8%
                </span>
              </div>
              <p className="text-[26px] font-extrabold tracking-tight mt-1" style={{ fontFamily: 'var(--font-mono)' }}>$8,902</p>
            </div>

            {/* Custom styled progress bars adapting to Brutalist & Glass */}
            <div className="mt-3">
              <div className="flex justify-between text-[9px] font-bold mb-1" style={{ color: 'var(--muted-fg)' }}>
                <span>GOAL CAP: $10,000</span>
                <span>89% REACHED</span>
              </div>
              <div 
                className="w-full h-2 overflow-hidden"
                style={{ 
                  background: 'var(--secondary)', 
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : '999px',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none'
                }}
              >
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: '89%', 
                    background: 'var(--primary)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '999px'
                  }}
                />
              </div>
            </div>
            <p className="text-[9.5px] mt-2" style={{ color: 'var(--muted-fg)' }}>On track to hit June threshold</p>
          </div>

          {/* Card 4: Churn with SVG Downward Path */}
          <div className={cn("flex flex-col justify-between p-5", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex justify-between items-start">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-fg)' }}>Churn Rate</p>
                <span 
                  className="flex items-center gap-0.5 text-[10.5px] font-bold px-1.5 py-0.5"
                  style={{ 
                    background: 'color-mix(in srgb, var(--destructive) 15%, transparent)', 
                    color: 'var(--destructive)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                    border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none'
                  }}
                >
                  <TrendingDown size={11} /> -0.4%
                </span>
              </div>
              <p className="text-[26px] font-extrabold tracking-tight mt-1" style={{ fontFamily: 'var(--font-mono)' }}>1.2%</p>
            </div>

            {/* Decreasing sparkline SVG */}
            <div className="h-10 w-full mt-3">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-dest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--destructive)" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="var(--destructive)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M0,2 C15,3 C25,18 40,8 55,22 C70,18 85,26 100,28" 
                  fill="none" 
                  stroke="var(--destructive)" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M0,2 C15,3 C25,18 40,8 55,22 C70,18 85,26 100,28 L100,30 L0,30 Z" 
                  fill="url(#spark-dest)"
                />
              </svg>
            </div>
            <p className="text-[9.5px] mt-2" style={{ color: 'var(--muted-fg)' }}>Lowest churn record in Q2</p>
          </div>
        </section>

        {/* Main Charts & Detailed Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Dual overlapping Curve SVG Chart */}
          <div className={cn("lg:col-span-2 p-5 flex flex-col gap-4", getInteractiveHoverClass())} style={containerStyle}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--primary)' }} />
                  <p className="text-[14px] font-extrabold tracking-tight">Weekly Performance</p>
                </div>
                <p className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>
                  Interactive live metrics comparison · active vs baseline projection
                </p>
              </div>

              {/* Chart range selector pill filters */}
              <div 
                className="flex p-0.5"
                style={{
                  background: 'var(--secondary)',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 2px)',
                }}
              >
                <button
                  className="px-3 py-1 text-[10px] font-bold transition-all"
                  style={getButtonStyle(
                    activeChartFilter === '7d' ? 'var(--primary)' : 'transparent',
                    activeChartFilter === '7d' ? 'var(--primary-fg)' : 'var(--secondary-fg)'
                  )}
                  onClick={() => setActiveChartFilter('7d')}
                >
                  7 Days
                </button>
                <button
                  className="px-3 py-1 text-[10px] font-bold transition-all"
                  style={getButtonStyle(
                    activeChartFilter === '30d' ? 'var(--primary)' : 'transparent',
                    activeChartFilter === '30d' ? 'var(--primary-fg)' : 'var(--secondary-fg)'
                  )}
                  onClick={() => setActiveChartFilter('30d')}
                >
                  30 Days
                </button>
              </div>
            </div>

            {/* Rich Dual overlapping SVG Line Chart */}
            <div className="relative h-48 w-full mt-2 pt-2">
              <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-primary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
                  </linearGradient>
                  <linearGradient id="gradient-secondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--secondary-fg)" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="var(--secondary-fg)" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4,4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4,4" />

                {/* Baseline Chart Area (underlay) */}
                <path 
                  d="M 20 130 C 60 120, 60 115, 100 115 C 140 115, 140 125, 180 125 C 220 125, 220 105, 260 105 C 300 105, 300 110, 340 110 C 380 110, 380 95, 420 95 C 450 95, 460 85, 480 85" 
                  fill="none" 
                  stroke="var(--secondary-fg)" 
                  strokeWidth="1.5" 
                  strokeDasharray="3,3"
                  opacity="0.6"
                />
                <path 
                  d="M 20 160 L 20 130 C 60 120, 60 115, 100 115 C 140 115, 140 125, 180 125 C 220 125, 220 105, 260 105 C 300 105, 300 110, 340 110 C 380 110, 380 95, 420 95 C 450 95, 460 85, 480 85 L 480 160 Z" 
                  fill="url(#gradient-secondary)"
                />

                {/* Primary Chart Area (Active) */}
                <path 
                  d="M 20 110 C 60 100, 60 95, 100 95 C 140 95, 140 120, 180 120 C 220 120, 220 70, 260 70 C 300 70, 300 85, 340 85 C 380 85, 380 40, 420 40 C 450 40, 460 30, 480 30" 
                  fill="none" 
                  stroke="var(--primary)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <path 
                  d="M 20 160 L 20 110 C 60 100, 60 95, 100 95 C 140 95, 140 120, 180 120 C 220 120, 220 70, 260 70 C 300 70, 300 85, 340 85 C 380 85, 380 40, 420 40 C 450 40, 460 30, 480 30 L 480 160 Z" 
                  fill="url(#gradient-primary)"
                />

                {/* Data point glowing markers */}
                <circle cx="260" cy="70" r="5" fill="var(--primary)" stroke="var(--card)" strokeWidth="2" />
                <circle cx="420" cy="40" r="5" fill="var(--primary)" stroke="var(--card)" strokeWidth="2" />
                <circle cx="480" cy="30" r="5" fill="var(--primary)" stroke="var(--card)" strokeWidth="2" />

                {/* Baseline markers */}
                <circle cx="260" cy="105" r="3" fill="var(--secondary-fg)" />
                <circle cx="480" cy="85" r="3" fill="var(--secondary-fg)" />
              </svg>

              {/* Simulated hover tooltip card */}
              <div 
                className="absolute top-4 left-[53%] -translate-x-1/2 p-2 pointer-events-none flex flex-col gap-0.5 text-[9.5px] font-bold shadow-md ring-1 ring-black/5"
                style={{
                  background: 'var(--card)',
                  color: 'var(--fg)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : '6px',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)'
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                  <span>Thursday Peak</span>
                </div>
                <span className="text-[11.5px] font-extrabold" style={{ fontFamily: 'var(--font-mono)' }}>$9,410.88</span>
                <span style={{ color: 'var(--muted-fg)', fontWeight: 500 }}>+42.1% projection delta</span>
              </div>
            </div>

            {/* Bottom week indicators */}
            <div className="flex justify-between items-center px-2 mt-1 text-[10px] font-bold text-center" style={{ color: 'var(--muted-fg)' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <span key={idx} className="flex-1">{day}</span>
              ))}
            </div>
          </div>

          {/* Project Trackers & Milestones */}
          <div className={cn("p-5 flex flex-col gap-4", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <p className="text-[14px] font-extrabold tracking-tight">Active Projects & Status</p>
              <p className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>Milestones and prioritized pipelines</p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Task 1: Complete */}
              <div 
                className="flex items-center justify-between p-2.5 transition-colors"
                style={{
                  background: 'var(--secondary)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 2px)',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCheckbox1(!checkbox1)}
                    className="h-4.5 w-4.5 flex items-center justify-center transition-all"
                    style={{
                      background: checkbox1 ? 'var(--primary)' : 'var(--input)',
                      color: 'var(--primary-fg)',
                      border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)',
                      borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {checkbox1 && <Check size={11} strokeWidth={3} />}
                  </button>
                  <div>
                    <p className="text-[11.5px] font-extrabold" style={{ textDecoration: checkbox1 ? 'line-through' : 'none', opacity: checkbox1 ? 0.6 : 1 }}>
                      Deploy CI Gate Matrix
                    </p>
                    <span className="text-[9.5px] font-semibold" style={{ color: 'var(--c1)' }}>High Priority</span>
                  </div>
                </div>
                <span 
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                  style={{ background: 'var(--border)', color: 'var(--muted-fg)' }}
                >
                  v2.4
                </span>
              </div>

              {/* Task 2: Active */}
              <div 
                className="flex items-center justify-between p-2.5 transition-colors"
                style={{
                  background: 'var(--secondary)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 2px)',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCheckbox2(!checkbox2)}
                    className="h-4.5 w-4.5 flex items-center justify-center transition-all"
                    style={{
                      background: checkbox2 ? 'var(--primary)' : 'var(--input)',
                      color: 'var(--primary-fg)',
                      border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)',
                      borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {checkbox2 && <Check size={11} strokeWidth={3} />}
                  </button>
                  <div>
                    <p className="text-[11.5px] font-extrabold" style={{ textDecoration: checkbox2 ? 'line-through' : 'none', opacity: checkbox2 ? 0.6 : 1 }}>
                      Brutalist Shadow Sync
                    </p>
                    <span className="text-[9.5px] font-semibold" style={{ color: 'var(--c3)' }}>In Progress</span>
                  </div>
                </div>
                <span 
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase animate-pulse"
                  style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
                >
                  Live
                </span>
              </div>

              {/* Task 3: Blocked */}
              <div 
                className="flex items-center justify-between p-2.5 transition-colors"
                style={{
                  background: 'var(--secondary)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 2px)',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCheckboxBlocked(!checkboxBlocked)}
                    className="h-4.5 w-4.5 flex items-center justify-center transition-all"
                    style={{
                      background: checkboxBlocked ? 'var(--primary)' : 'var(--input)',
                      color: 'var(--primary-fg)',
                      border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)',
                      borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {checkboxBlocked && <Check size={11} strokeWidth={3} />}
                  </button>
                  <div>
                    <p className="text-[11.5px] font-extrabold" style={{ textDecoration: checkboxBlocked ? 'line-through' : 'none', opacity: checkboxBlocked ? 0.6 : 1 }}>
                      Multimodal Inference API
                    </p>
                    <span className="text-[9.5px] font-semibold" style={{ color: 'var(--destructive)' }}>Blocked</span>
                  </div>
                </div>
                <span 
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                  style={{ background: 'color-mix(in srgb, var(--destructive) 20%, transparent)', color: 'var(--destructive)' }}
                >
                  Wait
                </span>
              </div>
            </div>

            {/* Micro progress percentages breakdown */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between text-[10px] font-bold" style={{ color: 'var(--muted-fg)' }}>
                <span>Milestones Overview</span>
                <span>78% complete</span>
              </div>
              <div 
                className="h-3 w-full p-0.5 flex"
                style={{
                  background: 'var(--input)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : '999px',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)'
                }}
              >
                <div className="h-full rounded-l" style={{ width: '48%', background: 'var(--c1)' }} />
                <div className="h-full" style={{ width: '20%', background: 'var(--c3)' }} />
                <div className="h-full rounded-r" style={{ width: '10%', background: 'var(--c4)' }} />
              </div>
              <div className="flex flex-wrap gap-2.5 text-[9px] font-semibold" style={{ color: 'var(--muted-fg)' }}>
                <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c1)' }}/> Ready (48%)</div>
                <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c3)' }}/> In-dev (20%)</div>
                <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--c4)' }}/> Review (10%)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Elements Sandbox, Alerts Panel and Button Specs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Interactive Controls Sandbox */}
          <div className={cn("p-5 flex flex-col justify-between gap-4", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-[14px] font-extrabold tracking-tight">Interactive Controls</p>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>Interactive state testing cockpit</p>
            </div>

            {/* Segmented controls tab */}
            <div>
              <p className="text-[11px] font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--muted-fg)' }}>Segmented Tabs</p>
              <div 
                className="flex p-0.5 w-full"
                style={{
                  background: 'var(--input)',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 2px)',
                }}
              >
                {['metrics', 'activity'].map((seg) => (
                  <button
                    key={seg}
                    className="flex-1 py-1.5 text-[10.5px] font-bold uppercase transition-all"
                    style={getButtonStyle(
                      activeSegment === seg ? 'var(--primary)' : 'transparent',
                      activeSegment === seg ? 'var(--primary-fg)' : 'var(--muted-fg)'
                    )}
                    onClick={() => setActiveSegment(seg as 'metrics' | 'activity')}
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom slider selector */}
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1" style={{ color: 'var(--muted-fg)' }}>
                <span className="uppercase tracking-wide">Dynamic Scaling Slider</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{sliderVal}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="w-full accent-primary"
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>

            {/* Toggle switch controls */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11.5px] font-extrabold">Auto-Synchronize Tokens</p>
                <p className="text-[9.5px]" style={{ color: 'var(--muted-fg)' }}>Broadcasting alterations instantaneously</p>
              </div>
              <button 
                onClick={() => setToggleActive(!toggleActive)}
                className="w-11 h-6 transition-all duration-300 relative p-0.5"
                style={{
                  background: toggleActive ? 'var(--primary)' : 'var(--input)',
                  border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1.5px solid var(--border)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : '999px',
                  cursor: 'pointer'
                }}
              >
                <div 
                  className="h-4.5 w-4.5 transition-all duration-300"
                  style={{
                    background: toggleActive ? 'var(--primary-fg)' : 'var(--muted-fg)',
                    borderRadius: surfaceStyle === 'brutalist' ? '0px' : '50%',
                    transform: toggleActive ? 'translateX(20px)' : 'translateX(0px)',
                    border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </button>
            </div>
          </div>

          {/* Diagnostics / Alerts Panel Showcase */}
          <div className={cn("p-5 flex flex-col gap-3", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-[14px] font-extrabold tracking-tight">Diagnostic Alerts</p>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>State-driven system alert layers</p>
            </div>

            <div className="flex flex-col gap-2">
              {/* Success Alert */}
              <div 
                className="flex items-start gap-2.5 p-2.5 border"
                style={{
                  background: 'color-mix(in srgb, var(--c1) 8%, var(--card))',
                  borderColor: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? 'var(--fg)' : 'color-mix(in srgb, var(--c1) 30%, transparent)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 3px)',
                  borderWidth: borderWidth === 0 ? '0px' : surfaceStyle === 'brutalist' ? `${borderWidth}px` : '1px'
                }}
              >
                <CheckCircle2 size={13} style={{ color: 'var(--c1)', marginTop: '2px' }} />
                <div>
                  <p className="text-[10.5px] font-bold leading-tight" style={{ color: 'var(--fg)' }}>Theme Synchronized</p>
                  <p className="text-[9px]" style={{ color: 'var(--muted-fg)' }}>Preset parsed successfully on port 4000</p>
                </div>
              </div>

              {/* Info Alert */}
              <div 
                className="flex items-start gap-2.5 p-2.5 border"
                style={{
                  background: 'color-mix(in srgb, var(--secondary-fg) 8%, var(--card))',
                  borderColor: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? 'var(--fg)' : 'color-mix(in srgb, var(--secondary-fg) 30%, transparent)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 3px)',
                  borderWidth: borderWidth === 0 ? '0px' : surfaceStyle === 'brutalist' ? `${borderWidth}px` : '1px'
                }}
              >
                <Info size={13} style={{ color: 'var(--secondary-fg)', marginTop: '2px' }} />
                <div>
                  <p className="text-[10.5px] font-bold leading-tight" style={{ color: 'var(--fg)' }}>Adaptive Contrast</p>
                  <p className="text-[9px]" style={{ color: 'var(--muted-fg)' }}>Lightness scaled by WCAG AAA filters</p>
                </div>
              </div>

              {/* Warning Alert */}
              <div 
                className="flex items-start gap-2.5 p-2.5 border"
                style={{
                  background: 'color-mix(in srgb, var(--c3) 8%, var(--card))',
                  borderColor: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? 'var(--fg)' : 'color-mix(in srgb, var(--c3) 30%, transparent)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 3px)',
                  borderWidth: borderWidth === 0 ? '0px' : surfaceStyle === 'brutalist' ? `${borderWidth}px` : '1px'
                }}
              >
                <AlertTriangle size={13} style={{ color: 'var(--c3)', marginTop: '2px' }} />
                <div>
                  <p className="text-[10.5px] font-bold leading-tight" style={{ color: 'var(--fg)' }}>Brutalist Shadow Threshold</p>
                  <p className="text-[9px]" style={{ color: 'var(--muted-fg)' }}>Color matching forces primary in dark mode</p>
                </div>
              </div>

              {/* Error Alert */}
              <div 
                className="flex items-start gap-2.5 p-2.5 border"
                style={{
                  background: 'color-mix(in srgb, var(--destructive) 8%, var(--card))',
                  borderColor: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? 'var(--fg)' : 'color-mix(in srgb, var(--destructive) 30%, transparent)',
                  borderRadius: surfaceStyle === 'brutalist' ? '0px' : 'calc(var(--radius) - 3px)',
                  borderWidth: borderWidth === 0 ? '0px' : surfaceStyle === 'brutalist' ? `${borderWidth}px` : '1px'
                }}
              >
                <CircleAlert size={13} style={{ color: 'var(--destructive)', marginTop: '2px' }} />
                <div>
                  <p className="text-[10.5px] font-bold leading-tight" style={{ color: 'var(--destructive)' }}>Deprecation Warning</p>
                  <p className="text-[9px]" style={{ color: 'var(--muted-fg)' }}>Avoid using global root style override</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Spec Sheet / Buttons & Badges */}
          <div className={cn("p-5 flex flex-col justify-between gap-4", getInteractiveHoverClass())} style={containerStyle}>
            <div>
              <div className="flex items-center gap-2">
                <Layers size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-[14px] font-extrabold tracking-tight">Component Spec Sheet</p>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>Visual weights of buttons & badges</p>
            </div>

            {/* Buttons Matrix */}
            <div>
              <p className="text-[10px] font-bold mb-2 uppercase tracking-wide text-app-subtle" style={{ color: 'var(--muted-fg)' }}>Button States</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="py-1.5 text-center text-[10px] font-bold uppercase transition-all"
                  style={getButtonStyle('var(--primary)', 'var(--primary-fg)')}
                >
                  Primary
                </button>
                <button
                  className="py-1.5 text-center text-[10px] font-bold uppercase transition-all"
                  style={getButtonStyle('var(--secondary)', 'var(--secondary-fg)', true)}
                >
                  Outline
                </button>
                <button
                  className="py-1.5 text-center text-[10px] font-bold uppercase transition-all"
                  style={getButtonStyle('var(--accent)', 'var(--accent-fg)')}
                >
                  Accent
                </button>
                <button
                  className="py-1.5 text-center text-[10px] font-bold uppercase transition-all"
                  style={getButtonStyle('var(--destructive)', 'var(--destructive-fg)')}
                >
                  Destructive
                </button>
                <button
                  className="py-1.5 text-center text-[10px] font-bold uppercase transition-all col-span-2"
                  style={getButtonStyle('var(--secondary)', 'var(--secondary-fg)', false, true)}
                  disabled
                >
                  Disabled State
                </button>
              </div>
            </div>

            {/* Badges Fills matrix */}
            <div>
              <p className="text-[10px] font-bold mb-2 uppercase tracking-wide text-app-subtle" style={{ color: 'var(--muted-fg)' }}>Badges Fills</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Primary', bg: 'var(--primary)', fg: 'var(--primary-fg)' },
                  { label: 'Secondary', bg: 'var(--secondary)', fg: 'var(--secondary-fg)' },
                  { label: 'Outline', bg: 'transparent', fg: 'var(--fg)', border: '1px solid var(--border)' },
                  { label: 'Destructive', bg: 'var(--destructive)', fg: 'var(--destructive-fg)' },
                  { label: 'Chart-1', bg: 'var(--c1)', fg: 'var(--card)' },
                  { label: 'Chart-2', bg: 'var(--c2)', fg: 'var(--card)' },
                ].map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[9.5px] font-bold px-2 py-0.5 transition-all"
                    style={{
                      background: badge.bg,
                      color: badge.fg,
                      border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' 
                        ? `${borderWidth}px solid var(--fg)` 
                        : badge.border || '1px solid transparent',
                      borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                    }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Recent Activities Feed Table */}
        <section className={cn("overflow-hidden", getInteractiveHoverClass())} style={containerStyle}>
          <div 
            className="flex items-center justify-between px-5 py-4" 
            style={{ borderBottom: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)' }}
          >
            <div>
              <div className="flex items-center gap-2">
                <Activity size={14} style={{ color: 'var(--primary)' }} />
                <p className="text-[14px] font-extrabold tracking-tight">Recent Core Activities</p>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--muted-fg)' }}>Full workspace operational audit trail</p>
            </div>
            
            <button
              className="flex items-center gap-1.5 px-3 h-7 text-[10.5px] font-bold transition-all"
              style={getButtonStyle('var(--secondary)', 'var(--secondary-fg)', true)}
            >
              Export Logs <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[11.5px]">
              <thead>
                <tr 
                  style={{ 
                    background: 'var(--secondary)',
                    borderBottom: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)'
                  }}
                >
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--muted-fg)' }}>Operator</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--muted-fg)' }}>Action</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--muted-fg)' }}>Category</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--muted-fg)' }}>Timeline</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: 'var(--muted-fg)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'Lana W.', action: 'Created invoice #1042', tag: 'Billing', when: '2 mins ago', color: 'var(--c1)', status: 'Success' },
                  { user: 'Yuki S.', action: 'Refunded order #884', tag: 'Safety', when: '14 mins ago', color: 'var(--c2)', status: 'Pending' },
                  { user: 'Ravi P.', action: 'Updated gate settings', tag: 'Security', when: '1 hour ago', color: 'var(--c3)', status: 'Success' },
                  { user: 'Mia B.', action: 'Invited 2 teammates', tag: 'Team', when: '3 hours ago', color: 'var(--c4)', status: 'Failed' },
                  { user: 'Tomás G.', action: 'Archived legacy project', tag: 'System', when: '5 hours ago', color: 'var(--c5)', status: 'Success' },
                ].map((row, idx) => (
                  <tr 
                    key={idx}
                    className="transition-colors hover:bg-neutral-500/5"
                    style={{ 
                      borderBottom: idx < 4 
                        ? (borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? `${borderWidth}px solid var(--fg)` : '1px solid var(--border)')
                        : 'none' 
                    }}
                  >
                    <td className="px-5 py-3.5 flex items-center gap-2.5">
                      <span className="h-5 w-5 rounded-full text-[8.5px] font-bold flex items-center justify-center" style={{ background: row.color, color: 'var(--card)' }}>
                        {row.user.split(' ')[0][0]}
                      </span>
                      <span className="font-extrabold">{row.user}</span>
                    </td>
                    <td className="px-5 py-3.5 text-app-subtle" style={{ color: 'var(--muted-fg)' }}>{row.action}</td>
                    <td className="px-5 py-3.5">
                      <span 
                        className="text-[9.5px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: 'var(--secondary)',
                          color: 'var(--secondary-fg)',
                          border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? '1px solid var(--fg)' : 'none'
                        }}
                      >
                        {row.tag}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: 'var(--muted-fg)', fontFamily: 'var(--font-mono)' }}>{row.when}</td>
                    <td className="px-5 py-3.5">
                      <span 
                        className="text-[9.5px] font-bold px-2 py-0.5"
                        style={{
                          background: row.status === 'Success' 
                            ? 'color-mix(in srgb, var(--c1) 15%, transparent)' 
                            : row.status === 'Pending'
                              ? 'color-mix(in srgb, var(--c3) 15%, transparent)'
                              : 'color-mix(in srgb, var(--destructive) 15%, transparent)',
                          color: row.status === 'Success' 
                            ? 'var(--c1)' 
                            : row.status === 'Pending'
                              ? 'var(--c3)'
                              : 'var(--destructive)',
                          borderRadius: surfaceStyle === 'brutalist' ? '0px' : '4px',
                          border: borderWidth === 0 ? 'none' : surfaceStyle === 'brutalist' ? '1px solid var(--fg)' : 'none'
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
