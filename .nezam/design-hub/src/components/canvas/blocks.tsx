'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  TrendingUp,
  Layers as LayersIcon,
  Zap,
  Play,
  Star,
  Calendar,
  ShoppingBag,
  ImageIcon as ImageGlyph,
  Type as TypeGlyph,
  Lock,
  Store as StoreIcon,
  FileText,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { ensureGsap, prefersReducedMotion } from '@/lib/gsap'
import { Node } from './Node'
import type { Block, NodeStyle } from '@/types'
import { cn } from '@/lib/cn'

/* ── BlockShell — visibility + lock + section selection ─────── */

function BlockShell({
  block,
  children,
  baseSection,
}: {
  block: Block
  children: ReactNode
  /** Optional default style for the section container before user overrides. */
  baseSection?: NodeStyle
}) {
  const meta = useHub((s) => s.getBlockMeta(block.id))
  const device = useHub((s) => s.device)
  const ns = useHub((s) => s.nodeStyles[block.id])
  const ref = useRef<HTMLElement | null>(null)

  // Parallax: subtle bg shift on canvas scroll for the .bgScroll === 'parallax' case.
  useEffect(() => {
    const scrollMode = ns?.bgScroll
    if (scrollMode !== 'parallax') return
    const node = ref.current
    if (!node) return
    const scroller = node.closest('.app-scroll') as HTMLElement | null
    if (!scroller) return
    const onScroll = () => {
      const rect = node.getBoundingClientRect()
      const scRect = scroller.getBoundingClientRect()
      const offset = rect.top - scRect.top
      node.style.backgroundPosition = `center calc(50% + ${offset * -0.18}px)`
    }
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [ns?.bgScroll])

  if (!meta.desktop && device !== 'mobile') return null
  if (!meta.mobile && device === 'mobile') return null

  return (
    <div className={cn('relative', meta.locked && 'layer-locked')}>
      {meta.locked && (
        <span
          className="absolute z-10 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
          style={{
            top: -8,
            insetInlineEnd: 8,
            background: 'var(--n-text)',
            color: 'var(--n-bg)',
          }}
        >
          <Lock size={8} />
          locked
        </span>
      )}
      <Node
        as="section"
        id={block.id}
        blockId={block.id}
        label={block.label}
        role="box"
        selectsSection
        animKey={block.kind}
        style={baseSection ? sectionStyleFrom(baseSection) : undefined}
      >
        <div ref={(el) => { ref.current = el?.parentElement ?? null }} style={{ display: 'contents' }} />
        {children}
      </Node>
    </div>
  )
}

function sectionStyleFrom(s: NodeStyle): React.CSSProperties {
  const out: React.CSSProperties = {}
  if (s.padding != null) out.padding = s.padding
  if (s.margin != null) out.margin = s.margin
  if (s.minHeight != null) out.minHeight = s.minHeight
  if (s.radius != null) out.borderRadius = s.radius
  return out
}

/* ── helpers ────────────────────────────────────────────────── */

function n(blockId: string, ...parts: string[]) {
  return [blockId, ...parts].join(':')
}

const SECTION_PAD = 'padding: var(--n-space-6); display: grid; gap: var(--n-space-3);'

/* ── Nav ────────────────────────────────────────────────────── */

function NavBlock({ block }: { block: Block }) {
  const dir = useHub((s) => s.dir)
  const rtl = dir === 'rtl'
  const c = block.content as { brand: string; links: string[]; cta: string; variant?: string; padding?: number }
  const variant = c.variant || 'minimal'
  const paddingVal = c.padding != null ? `${c.padding}px` : 'var(--n-space-3)'

  // Render wrapper helper to keep editable nodes matching ID mappings
  const renderBrand = (size = 30) => (
    <div className="flex items-center" style={{ gap: 'var(--n-space-2)' }}>
      <span
        className="grid place-items-center font-bold transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{
          background: 'var(--n-brand)',
          color: 'var(--n-on-brand)',
          width: size,
          height: size,
          borderRadius: 'var(--n-radius-sm)',
          fontFamily: 'var(--n-font-display)',
        }}
      >
        {rtl ? 'ن' : 'N'}
      </span>
      <Node
        id={n(block.id, 'brand')}
        blockId={block.id}
        label="Brand wordmark"
        role="text"
        editable
        fallback={c.brand}
        baseFontSize="15px"
        as="span"
        style={{
          color: 'var(--n-text)',
          fontSize: 15,
          fontWeight: 700,
          fontFamily: 'var(--n-font-display)',
        }}
      />
    </div>
  )

  const renderLinks = (gap = 'var(--n-space-4)', linkStyle?: React.CSSProperties) => (
    <div className="hidden items-center sm:flex" style={{ gap }}>
      {c.links.map((link, i) => (
        <div key={i} className="flex items-center gap-1 group/link">
          <Node
            id={n(block.id, `link-${i}`)}
            blockId={block.id}
            label={`Nav link · ${link}`}
            role="text"
            editable
            fallback={link}
            baseFontSize="13px"
            as="span"
            className="cursor-pointer transition-colors duration-150 hover:text-app-text active:scale-98"
            style={{
              color: i === 0 ? 'var(--n-text)' : 'var(--n-text-muted)',
              fontSize: 13,
              fontWeight: i === 0 ? 600 : 500,
              ...linkStyle,
            }}
          />
          {variant === 'sticky' && i === 1 && (
            <span className="text-[10px] text-app-subtle group-hover/link:translate-y-0.5 transition-transform duration-200">▼</span>
          )}
        </div>
      ))}
    </div>
  )

  const renderCTA = (additionalStyles?: React.CSSProperties) => (
    <Node
      id={n(block.id, 'cta')}
      blockId={block.id}
      label="Sign in button"
      role="text"
      editable
      fallback={c.cta}
      baseFontSize="12px"
      as="span"
      className="cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
      style={{
        background: 'var(--n-brand)',
        color: 'var(--n-on-brand)',
        fontSize: 12,
        fontWeight: 600,
        padding: '7px 16px',
        borderRadius: 'var(--n-radius)',
        ...additionalStyles,
      }}
    />
  )

  if (variant === 'centered') {
    return (
      <BlockShell block={block}>
        <nav
          className="flex flex-col items-center gap-3"
          style={{
            background: 'var(--n-surface)',
            border: '1px solid var(--n-border)',
            borderRadius: 'var(--n-radius-lg)',
            padding: `${paddingVal} var(--n-space-6)`,
            margin: 'var(--n-space-6) var(--n-space-6) 0',
            boxShadow: 'var(--n-shadow)',
          }}
        >
          {/* Top row: Brand */}
          <div className="flex w-full items-center justify-between">
            <div className="opacity-0 w-[80px]" /> {/* Spacer to balance CTA */}
            {renderBrand(32)}
            <div className="flex w-[80px] justify-end">{renderCTA()}</div>
          </div>
          <div className="w-full h-px bg-app-border/40" />
          {/* Bottom row: Links */}
          {renderLinks('var(--n-space-5)')}
        </nav>
      </BlockShell>
    )
  }

  if (variant === 'sticky') {
    return (
      <BlockShell block={block}>
        <nav
          className="flex items-center justify-between backdrop-blur-md transition-all duration-200"
          style={{
            background: 'color-mix(in srgb, var(--n-surface) 80%, transparent)',
            border: '1px solid var(--n-border-strong)',
            borderRadius: 'var(--n-radius-pill)',
            padding: `${paddingVal} var(--n-space-5)`,
            margin: 'var(--n-space-4) var(--n-space-6) 0',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.1) inset',
            position: 'sticky',
            top: 16,
            zIndex: 40,
          }}
        >
          {renderBrand(28)}
          {renderLinks('var(--n-space-4)')}
          {renderCTA({ borderRadius: 'var(--n-radius-pill)' })}
        </nav>
      </BlockShell>
    )
  }

  if (variant === 'split') {
    return (
      <BlockShell block={block}>
        <nav
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
          style={{
            background: 'var(--n-surface)',
            border: '1px solid var(--n-border)',
            borderRadius: 'var(--n-radius-xl)',
            padding: `${paddingVal} var(--n-space-5)`,
            margin: 'var(--n-space-6) var(--n-space-6) 0',
            boxShadow: 'var(--n-shadow)',
          }}
        >
          <div className="flex items-center justify-between gap-6">
            {renderBrand(30)}
            <div className="hidden sm:block h-6 w-px bg-app-border/40" />
            {renderLinks('var(--n-space-4)')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-app-muted cursor-pointer hover:text-app-text hidden sm:inline">Sign up</span>
            {renderCTA()}
          </div>
        </nav>
      </BlockShell>
    )
  }

  // Default: 'minimal'
  return (
    <BlockShell block={block}>
      <nav
        className="flex items-center justify-between"
        style={{
          background: 'var(--n-surface)',
          border: '1px solid var(--n-border)',
          borderRadius: 'var(--n-radius-lg)',
          padding: `${paddingVal} var(--n-space-4)`,
          margin: 'var(--n-space-6) var(--n-space-6) 0',
          boxShadow: 'var(--n-shadow)',
        }}
      >
        {renderBrand(30)}
        {renderLinks('var(--n-space-4)')}
        {renderCTA()}
      </nav>
    </BlockShell>
  )
}

/* ── Hero ───────────────────────────────────────────────────── */

function HeroBlock({ block }: { block: Block }) {
  const dir = useHub((s) => s.dir)
  const rtl = dir === 'rtl'
  const c = block.content as { badge: string; title: string; subtitle: string; primary: string; secondary: string; variant?: string; gap?: number }
  const variant = c.variant || 'saas'
  const gapVal = c.gap != null ? `${c.gap}px` : 'var(--n-space-3)'

  // Render elements helpers
  const renderBadge = () => (
    <Node
      id={n(block.id, 'badge')}
      blockId={block.id}
      label="Hero badge"
      role="text"
      editable
      fallback={c.badge}
      baseFontSize="11px"
      as="span"
      className="inline-flex transition-transform duration-200 hover:scale-105"
      style={{
        background: 'var(--n-brand-subtle)',
        color: 'var(--n-brand)',
        fontSize: 11,
        fontWeight: 600,
        padding: '5px 12px',
        borderRadius: 'var(--n-radius-pill)',
      }}
    />
  )

  const renderTitle = (alignmentClass = 'text-center') => (
    <Node
      id={n(block.id, 'title')}
      blockId={block.id}
      label="Hero heading"
      role="text"
      editable
      fallback={c.title}
      baseFontSize="clamp(26px, 4.4vw, 42px)"
      as="h1"
      className={cn("max-w-[34ch]", alignmentClass)}
      style={{
        color: variant === 'glassmorphic' ? 'transparent' : 'var(--n-text)',
        backgroundImage: variant === 'glassmorphic' ? 'linear-gradient(to right, var(--n-text), color-mix(in srgb, var(--n-text) 60%, var(--n-brand)))' : 'none',
        backgroundClip: variant === 'glassmorphic' ? 'text' : 'unset',
        fontFamily: 'var(--n-font-display)',
        fontSize: 'clamp(26px, 4.4vw, 42px)',
        fontWeight: 800,
        lineHeight: rtl ? 1.4 : 1.15,
        letterSpacing: rtl ? 0 : '-0.025em',
      }}
    />
  )

  const renderSubtitle = (alignmentClass = 'text-center') => (
    <Node
      id={n(block.id, 'subtitle')}
      blockId={block.id}
      label="Hero subtitle"
      role="text"
      editable
      fallback={c.subtitle}
      baseFontSize="15px"
      as="p"
      className={cn("max-w-[46ch]", alignmentClass)}
      style={{
        color: 'var(--n-text-muted)',
        fontSize: 15,
        lineHeight: rtl ? 1.85 : 1.65,
      }}
    />
  )

  const renderButtons = () => (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Node
        id={n(block.id, 'primary')}
        blockId={block.id}
        label="Primary button"
        role="text"
        editable
        fallback={c.primary}
        baseFontSize="14px"
        as="button"
        className="inline-flex items-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-app-glow"
        style={{
          gap: 8,
          background: 'var(--n-brand)',
          color: 'var(--n-on-brand)',
          fontSize: 14,
          fontWeight: 600,
          padding: '11px 22px',
          borderRadius: 'var(--n-radius)',
        }}
      />
      <Node
        id={n(block.id, 'secondary')}
        blockId={block.id}
        label="Secondary button"
        role="text"
        editable
        fallback={c.secondary}
        baseFontSize="14px"
        as="button"
        className="inline-flex items-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-app-inset/30"
        style={{
          gap: 8,
          color: 'var(--n-text)',
          fontSize: 14,
          fontWeight: 600,
          padding: '11px 22px',
          borderRadius: 'var(--n-radius)',
          border: '1px solid var(--n-border-strong)',
        }}
      />
    </div>
  )

  if (variant === 'split') {
    return (
      <BlockShell block={block}>
        <section
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-8 py-16",
            rtl ? "text-right" : "text-left"
          )}
          style={{ gap: gapVal }}
        >
          {/* Left / Content column */}
          <div className={cn("flex flex-col gap-4", rtl ? "items-start md:items-start" : "items-start")}>
            {renderBadge()}
            {renderTitle(rtl ? 'text-right' : 'text-left')}
            {renderSubtitle(rtl ? 'text-right' : 'text-left')}
            <div className="pt-2">
              {renderButtons()}
            </div>
          </div>

          {/* Right / Visual column */}
          <div className="relative flex justify-center items-center">
            {/* Visual background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--n-brand-rgb),0.1),transparent_70%)] pointer-events-none" />
            
            {/* Stack of floating token cards */}
            <div className="relative w-full max-w-[360px] h-[280px]">
              {/* Card 1: Layers list */}
              <div className="absolute top-4 left-4 right-12 bg-app-surface/90 border border-app-border rounded-xl p-4 shadow-lg backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:rotate-1">
                <div className="flex items-center gap-2 border-b border-app-border pb-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-[10px] font-semibold text-app-muted ml-1">Sidebar hierarchy</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-app-accent-subtle/20 border border-app-accent/30 rounded p-1 text-[9px] text-app-text">
                    <span className="font-semibold">✦ Hero Section</span>
                    <span className="text-[8px] text-app-accent opacity-80">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between border border-app-border/40 rounded p-1 text-[9px] text-app-muted">
                    <span>⚡ Feature Grid</span>
                    <span className="text-[8px] text-app-subtle">LOCKED</span>
                  </div>
                  <div className="flex items-center justify-between border border-app-border/40 rounded p-1 text-[9px] text-app-muted">
                    <span>💰 Pricing Block</span>
                    <span className="text-[8px] text-app-subtle">VISIBLE</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Token studio pill */}
              <div className="absolute bottom-8 right-4 w-[220px] bg-app-elevated/95 border border-app-border-strong rounded-xl p-4 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:translate-y-1 hover:-rotate-1">
                <div className="text-[9px] font-bold text-app-accent uppercase tracking-wider mb-2">Brand palette</div>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="h-6 rounded bg-indigo-500 hover:scale-105 transition-transform" />
                  <div className="h-6 rounded bg-emerald-500 hover:scale-105 transition-transform" />
                  <div className="h-6 rounded bg-amber-500 hover:scale-105 transition-transform" />
                  <div className="h-6 rounded bg-rose-500 hover:scale-105 transition-transform" />
                </div>
                <div className="mt-3 flex items-center justify-between text-[8px] text-app-muted">
                  <span>Accessibility score</span>
                  <span className="font-mono font-bold text-green-400">98% PASS</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </BlockShell>
    )
  }

  if (variant === 'glassmorphic') {
    return (
      <BlockShell block={block}>
        <section
          className="relative px-8 py-20 overflow-hidden"
          style={{ gap: gapVal }}
        >
          {/* Futuristic background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,color-mix(in srgb,var(--n-brand)_20%,transparent),transparent_60%)] filter blur-3xl pointer-events-none" />
          
          {/* Glass Card Wrapper */}
          <div className="relative max-w-4xl mx-auto backdrop-blur-xl bg-app-surface/30 dark:bg-black/20 border border-app-border/40 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center gap-5">
            {/* Elegant glass badge */}
            <div className="backdrop-blur-md bg-app-inset/40 border border-app-border/40 rounded-full px-1.5 py-0.5 shadow-sm">
              {renderBadge()}
            </div>

            {renderTitle('text-center')}
            {renderSubtitle('text-center')}
            
            <div className="pt-4">
              {renderButtons()}
            </div>

            {/* Glowing active outline micro-animation */}
            <div className="absolute -inset-px rounded-3xl border border-app-accent/20 pointer-events-none animate-pulse" />
          </div>
        </section>
      </BlockShell>
    )
  }

  // Default: 'saas'
  return (
    <BlockShell block={block}>
      <section
        className="flex flex-col items-center text-center px-8 py-16"
        style={{ gap: gapVal }}
      >
        {renderBadge()}
        {renderTitle('text-center')}
        {renderSubtitle('text-center')}
        <div className="pt-2">
          {renderButtons()}
        </div>

        {/* Floating Mockup Browser Preview for SaaS */}
        <div className="relative mt-8 w-full max-w-[620px] transition-transform duration-300 hover:scale-[1.01] hover:-translate-y-0.5">
          <div className="w-full bg-app-surface/90 border border-app-border rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Browser top chrome */}
            <div className="flex items-center gap-1.5 border-b border-app-border bg-app-inset/80 px-4 py-2 text-[10px] text-app-muted">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400/80" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                <span className="h-2 w-2 rounded-full bg-green-400/80" />
              </div>
              <span className="mx-auto truncate select-none opacity-60">localhost:4000/nezam-studio</span>
            </div>
            
            {/* Browser client space */}
            <div className="p-4 bg-app-surface/40 flex flex-col gap-3 text-left">
              {/* Simulated mini analytics metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-app-inset/40 border border-app-border/40 rounded p-2 flex flex-col">
                  <span className="text-[9px] text-app-muted">Active Sessions</span>
                  <span className="text-xs font-bold text-app-text mt-0.5">14,248</span>
                </div>
                <div className="bg-app-inset/40 border border-app-border/40 rounded p-2 flex flex-col">
                  <span className="text-[9px] text-app-muted">Conversion Rate</span>
                  <span className="text-xs font-bold text-app-text mt-0.5">3.8%</span>
                </div>
                <div className="bg-app-inset/40 border border-app-border/40 rounded p-2 flex flex-col">
                  <span className="text-[9px] text-app-muted">Team Members</span>
                  <span className="text-xs font-bold text-app-text mt-0.5">18 Active</span>
                </div>
              </div>
              <div className="h-[44px] rounded bg-app-accent-subtle/25 border border-app-accent/20 p-2 flex items-center justify-between text-[10px]">
                <span className="text-app-text font-medium">⚡ Real-time design token sync is active</span>
                <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlockShell>
  )
}

/* ── Feature grid ───────────────────────────────────────────── */

function FeatureGridBlock({ block }: { block: Block }) {
  const c = block.content as { title: string; items: { icon: string; title: string; desc: string }[] }
  const ns = useHub((s) => s.nodeStyles[block.id])
  const cols = ns?.columns ?? 3
  const cardIcons = [LayersIcon, Zap, Play, Star, Calendar]
  return (
    <BlockShell block={block}>
      <section style={{ padding: 'var(--n-space-6)', display: 'grid', gap: 'var(--n-space-4)' }}>
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Section title"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="22px"
          as="h2"
          style={{
            color: 'var(--n-text)',
            fontFamily: 'var(--n-font-display)',
            fontSize: 22,
            fontWeight: 700,
            textAlign: 'center',
          }}
        />
        <div className="grid" style={{ gap: 'var(--n-space-3)', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {c.items.map((it, i) => {
            const cardId = n(block.id, `card-${i}`)
            const Icon = cardIcons[i % cardIcons.length]
            return (
              <Node
                key={i}
                id={cardId}
                blockId={block.id}
                label={`Feature card · ${it.title}`}
                role="card"
                as="div"
                className="transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'var(--n-elevated)',
                  border: '1px solid var(--n-border)',
                  borderRadius: 'var(--n-radius-lg)',
                  padding: 'var(--n-space-4)',
                  boxShadow: 'var(--n-shadow)',
                  display: 'grid',
                  gap: 'var(--n-space-2)',
                }}
              >
                <Node
                  id={n(cardId, 'icon')}
                  blockId={block.id}
                  label="Card icon"
                  role="box"
                  as="span"
                  className="grid place-items-center"
                  style={{
                    width: 34,
                    height: 34,
                    background: 'var(--n-brand-subtle)',
                    color: 'var(--n-brand)',
                    borderRadius: 'var(--n-radius)',
                  }}
                >
                  <Icon size={17} />
                </Node>
                <Node
                  id={n(cardId, 'title')}
                  blockId={block.id}
                  label="Card title"
                  role="text"
                  editable
                  fallback={it.title}
                  baseFontSize="14px"
                  as="h3"
                  style={{ color: 'var(--n-text)', fontSize: 14, fontWeight: 600 }}
                />
                <Node
                  id={n(cardId, 'desc')}
                  blockId={block.id}
                  label="Card description"
                  role="text"
                  editable
                  fallback={it.desc}
                  baseFontSize="12px"
                  as="p"
                  style={{ color: 'var(--n-text-muted)', fontSize: 12, lineHeight: 1.55 }}
                />
              </Node>
            )
          })}
        </div>
      </section>
    </BlockShell>
  )
}

/* ── Stats ──────────────────────────────────────────────────── */

function StatsBlock({ block }: { block: Block }) {
  const c = block.content as { items: { value: string; label: string }[] }
  return (
    <BlockShell block={block}>
      <div className="grid grid-cols-3" style={{ gap: 'var(--n-space-3)', padding: 'var(--n-space-6)' }}>
        {c.items.map((s, i) => {
          const id = n(block.id, `stat-${i}`)
          return (
            <Node
              key={i}
              id={id}
              blockId={block.id}
              label={`Stat · ${s.label}`}
              role="card"
              as="div"
              style={{
                background: 'var(--n-surface)',
                border: '1px solid var(--n-border)',
                borderRadius: 'var(--n-radius-lg)',
                padding: 'var(--n-space-4)',
              }}
            >
              <Node
                id={n(id, 'value')}
                blockId={block.id}
                label="Stat value"
                role="text"
                editable
                fallback={s.value}
                baseFontSize="26px"
                as="div"
                style={{
                  color: 'var(--n-text)',
                  fontFamily: 'var(--n-font-display)',
                  fontSize: 26,
                  fontWeight: 700,
                }}
              />
              <Node
                id={n(id, 'label')}
                blockId={block.id}
                label="Stat label"
                role="text"
                editable
                fallback={s.label}
                baseFontSize="11px"
                as="div"
                style={{ color: 'var(--n-text-subtle)', fontSize: 11, marginTop: 2 }}
              />
            </Node>
          )
        })}
      </div>
    </BlockShell>
  )
}

/* ── Product grid ───────────────────────────────────────────── */

function ProductGridBlock({ block }: { block: Block }) {
  const c = block.content as { title: string; items: { name: string; price: string; tag: string }[] }
  const ns = useHub((s) => s.nodeStyles[block.id])
  const cols = ns?.columns ?? 4
  return (
    <BlockShell block={block}>
      <section style={{ padding: 'var(--n-space-6)', display: 'grid', gap: 'var(--n-space-4)' }}>
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Section title"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="22px"
          as="h2"
          style={{ color: 'var(--n-text)', fontFamily: 'var(--n-font-display)', fontSize: 22, fontWeight: 700 }}
        />
        <div className="grid" style={{ gap: 'var(--n-space-3)', gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {c.items.map((p, i) => {
            const cardId = n(block.id, `product-${i}`)
            return (
              <Node
                key={i}
                id={cardId}
                blockId={block.id}
                label={`Product · ${p.name}`}
                role="card"
                as="article"
                style={{
                  background: 'var(--n-elevated)',
                  border: '1px solid var(--n-border)',
                  borderRadius: 'var(--n-radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--n-shadow)',
                }}
              >
                <div
                  className="grid place-items-center"
                  style={{
                    background: `linear-gradient(135deg, var(--n-brand-subtle), color-mix(in srgb, var(--n-brand) 12%, var(--n-elevated)))`,
                    height: 88,
                    color: 'var(--n-brand)',
                    position: 'relative',
                  }}
                >
                  <ShoppingBag size={22} />
                  {p.tag && (
                    <span
                      style={{
                        position: 'absolute',
                        insetInlineStart: 8,
                        top: 8,
                        background: 'var(--n-brand)',
                        color: 'var(--n-on-brand)',
                        fontSize: 9,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 999,
                      }}
                    >
                      {p.tag}
                    </span>
                  )}
                </div>
                <div style={{ padding: 'var(--n-space-3)', display: 'grid', gap: 4 }}>
                  <Node
                    id={n(cardId, 'name')}
                    blockId={block.id}
                    label="Product name"
                    role="text"
                    editable
                    fallback={p.name}
                    baseFontSize="13px"
                    as="div"
                    style={{ color: 'var(--n-text)', fontSize: 13, fontWeight: 600 }}
                  />
                  <Node
                    id={n(cardId, 'price')}
                    blockId={block.id}
                    label="Product price"
                    role="text"
                    editable
                    fallback={p.price}
                    baseFontSize="12px"
                    as="div"
                    style={{ color: 'var(--n-brand)', fontSize: 12, fontWeight: 700 }}
                  />
                </div>
              </Node>
            )
          })}
        </div>
      </section>
    </BlockShell>
  )
}

/* ── Article list ───────────────────────────────────────────── */

function ArticleListBlock({ block }: { block: Block }) {
  const c = block.content as { title: string; items: { title: string; excerpt: string; meta: string }[] }
  return (
    <BlockShell block={block}>
      <section style={{ padding: 'var(--n-space-6)', display: 'grid', gap: 'var(--n-space-4)' }}>
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Section title"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="22px"
          as="h2"
          style={{ color: 'var(--n-text)', fontFamily: 'var(--n-font-display)', fontSize: 22, fontWeight: 700 }}
        />
        <div style={{ display: 'grid', gap: 'var(--n-space-3)' }}>
          {c.items.map((a, i) => {
            const cardId = n(block.id, `article-${i}`)
            return (
              <Node
                key={i}
                id={cardId}
                blockId={block.id}
                label={`Article · ${a.title}`}
                role="card"
                as="article"
                style={{
                  background: 'var(--n-surface)',
                  border: '1px solid var(--n-border)',
                  borderRadius: 'var(--n-radius-lg)',
                  padding: 'var(--n-space-4)',
                  display: 'grid',
                  gap: 6,
                }}
              >
                <Node
                  id={n(cardId, 'meta')}
                  blockId={block.id}
                  label="Article meta"
                  role="text"
                  editable
                  fallback={a.meta}
                  baseFontSize="10px"
                  as="div"
                  style={{
                    color: 'var(--n-text-subtle)',
                    fontSize: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600,
                  }}
                />
                <Node
                  id={n(cardId, 'title')}
                  blockId={block.id}
                  label="Article title"
                  role="text"
                  editable
                  fallback={a.title}
                  baseFontSize="18px"
                  as="h3"
                  style={{ color: 'var(--n-text)', fontFamily: 'var(--n-font-display)', fontSize: 18, fontWeight: 600 }}
                />
                <Node
                  id={n(cardId, 'excerpt')}
                  blockId={block.id}
                  label="Article excerpt"
                  role="text"
                  editable
                  fallback={a.excerpt}
                  baseFontSize="13px"
                  as="p"
                  style={{ color: 'var(--n-text-muted)', fontSize: 13, lineHeight: 1.55 }}
                />
              </Node>
            )
          })}
        </div>
      </section>
    </BlockShell>
  )
}

/* ── Pricing ────────────────────────────────────────────────── */

function PricingBlock({ block }: { block: Block }) {
  const c = block.content as {
    title: string
    tiers: { name: string; price: string; features: string[]; featured: boolean }[]
  }
  return (
    <BlockShell block={block}>
      <section style={{ padding: 'var(--n-space-6)', display: 'grid', gap: 'var(--n-space-4)' }}>
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Pricing title"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="22px"
          as="h2"
          style={{
            color: 'var(--n-text)',
            fontFamily: 'var(--n-font-display)',
            fontSize: 22,
            fontWeight: 700,
            textAlign: 'center',
          }}
        />
        <div className="grid grid-cols-3" style={{ gap: 'var(--n-space-3)' }}>
          {c.tiers.map((t, i) => {
            const cardId = n(block.id, `tier-${i}`)
            const featured = t.featured
            return (
              <Node
                key={i}
                id={cardId}
                blockId={block.id}
                label={`Tier · ${t.name}`}
                role="card"
                as="div"
                style={{
                  background: featured ? 'var(--n-brand-subtle)' : 'var(--n-surface)',
                  border: `1px solid ${featured ? 'var(--n-brand)' : 'var(--n-border)'}`,
                  borderRadius: 'var(--n-radius-lg)',
                  padding: 'var(--n-space-4)',
                  display: 'grid',
                  gap: 'var(--n-space-2)',
                }}
              >
                <Node
                  id={n(cardId, 'name')}
                  blockId={block.id}
                  label="Tier name"
                  role="text"
                  editable
                  fallback={t.name}
                  baseFontSize="13px"
                  as="div"
                  style={{ color: 'var(--n-text)', fontSize: 13, fontWeight: 600 }}
                />
                <Node
                  id={n(cardId, 'price')}
                  blockId={block.id}
                  label="Tier price"
                  role="text"
                  editable
                  fallback={t.price}
                  baseFontSize="30px"
                  as="div"
                  style={{
                    color: featured ? 'var(--n-brand)' : 'var(--n-text)',
                    fontFamily: 'var(--n-font-display)',
                    fontSize: 30,
                    fontWeight: 700,
                  }}
                />
                <ul style={{ display: 'grid', gap: 4, marginTop: 4 }}>
                  {t.features.map((f, j) => (
                    <li
                      key={j}
                      className="inline-flex items-center"
                      style={{ color: 'var(--n-text-muted)', fontSize: 12, gap: 6 }}
                    >
                      <Check size={11} style={{ color: 'var(--n-brand)' }} strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>
              </Node>
            )
          })}
        </div>
      </section>
    </BlockShell>
  )
}

/* ── Dashboard ──────────────────────────────────────────────── */

function DashboardBlock({ block }: { block: Block }) {
  const c = block.content as {
    title: string
    metrics: { label: string; value: string; delta: string }[]
    chart: number[]
  }
  return (
    <BlockShell block={block}>
      <section style={{ padding: 'var(--n-space-6)', display: 'grid', gap: 'var(--n-space-3)' }}>
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Dashboard title"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="16px"
          as="div"
          style={{ color: 'var(--n-text)', fontSize: 16, fontWeight: 600 }}
        />
        <div className="grid grid-cols-3" style={{ gap: 'var(--n-space-3)' }}>
          {c.metrics.map((m, i) => {
            const cardId = n(block.id, `metric-${i}`)
            return (
              <Node
                key={i}
                id={cardId}
                blockId={block.id}
                label={`Metric · ${m.label}`}
                role="card"
                as="div"
                style={{
                  background: 'var(--n-surface)',
                  border: '1px solid var(--n-border)',
                  borderRadius: 'var(--n-radius-lg)',
                  padding: 'var(--n-space-3)',
                }}
              >
                <div style={{ color: 'var(--n-text-subtle)', fontSize: 11 }}>{m.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ color: 'var(--n-text)', fontSize: 22, fontWeight: 700, fontFamily: 'var(--n-font-display)' }}>
                    {m.value}
                  </span>
                  <span style={{ color: 'var(--n-success)', fontSize: 11, fontWeight: 600 }}>{m.delta}</span>
                </div>
              </Node>
            )
          })}
        </div>
        <Node
          id={n(block.id, 'chart')}
          blockId={block.id}
          label="Chart widget"
          role="card"
          as="div"
          style={{
            background: 'var(--n-surface)',
            border: '1px solid var(--n-border)',
            borderRadius: 'var(--n-radius-lg)',
            padding: 'var(--n-space-3)',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ color: 'var(--n-text)', fontSize: 12, fontWeight: 600 }}>Weekly activity</span>
            <span style={{ color: 'var(--n-success)', fontSize: 11, fontWeight: 600 }} className="inline-flex items-center">
              <TrendingUp size={12} /> +18%
            </span>
          </div>
          <div className="flex items-end justify-between" style={{ gap: 5, height: 64 }}>
            {c.chart.map((v, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${v}%`,
                  background: i === c.chart.length - 2 ? 'var(--n-brand)' : 'var(--n-brand-subtle)',
                  borderRadius: 'var(--n-radius-sm)',
                }}
              />
            ))}
          </div>
        </Node>
      </section>
    </BlockShell>
  )
}

/* ── Vendor grid ────────────────────────────────────────────── */

function VendorGridBlock({ block }: { block: Block }) {
  const c = block.content as { title: string; items: { name: string; category: string; rating: string }[] }
  return (
    <BlockShell block={block}>
      <section style={{ padding: 'var(--n-space-6)', display: 'grid', gap: 'var(--n-space-4)' }}>
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Section title"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="22px"
          as="h2"
          style={{ color: 'var(--n-text)', fontFamily: 'var(--n-font-display)', fontSize: 22, fontWeight: 700 }}
        />
        <div className="grid grid-cols-3" style={{ gap: 'var(--n-space-3)' }}>
          {c.items.map((v, i) => {
            const cardId = n(block.id, `vendor-${i}`)
            return (
              <Node
                key={i}
                id={cardId}
                blockId={block.id}
                label={`Vendor · ${v.name}`}
                role="card"
                as="div"
                style={{
                  background: 'var(--n-elevated)',
                  border: '1px solid var(--n-border)',
                  borderRadius: 'var(--n-radius-lg)',
                  padding: 'var(--n-space-4)',
                  display: 'grid',
                  gap: 8,
                  textAlign: 'center',
                  boxShadow: 'var(--n-shadow)',
                }}
              >
                <div
                  className="mx-auto grid place-items-center"
                  style={{
                    width: 42,
                    height: 42,
                    background: 'var(--n-brand-subtle)',
                    color: 'var(--n-brand)',
                    borderRadius: 'var(--n-radius-pill)',
                  }}
                >
                  <StoreIcon size={20} />
                </div>
                <Node
                  id={n(cardId, 'name')}
                  blockId={block.id}
                  label="Vendor name"
                  role="text"
                  editable
                  fallback={v.name}
                  baseFontSize="13px"
                  as="div"
                  style={{ color: 'var(--n-text)', fontSize: 13, fontWeight: 600 }}
                />
                <div style={{ color: 'var(--n-text-muted)', fontSize: 11 }}>
                  {v.category} · ★ {v.rating}
                </div>
              </Node>
            )
          })}
        </div>
      </section>
    </BlockShell>
  )
}

/* ── CTA ────────────────────────────────────────────────────── */

function CtaBlock({ block }: { block: Block }) {
  const c = block.content as { title: string; subtitle: string; button: string }
  return (
    <BlockShell block={block}>
      <section
        className="text-center"
        style={{
          margin: 'var(--n-space-6)',
          padding: 'var(--n-space-8)',
          background: 'linear-gradient(135deg, var(--n-brand), color-mix(in srgb, var(--n-accent) 60%, var(--n-brand)))',
          color: 'var(--n-on-brand)',
          borderRadius: 'var(--n-radius-xl)',
          boxShadow: 'var(--n-shadow)',
          display: 'grid',
          gap: 'var(--n-space-3)',
          justifyItems: 'center',
        }}
      >
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="CTA headline"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="26px"
          as="h2"
          style={{ color: 'var(--n-on-brand)', fontFamily: 'var(--n-font-display)', fontSize: 26, fontWeight: 700, maxWidth: '32ch' }}
        />
        <Node
          id={n(block.id, 'subtitle')}
          blockId={block.id}
          label="CTA subtitle"
          role="text"
          editable
          fallback={c.subtitle}
          baseFontSize="14px"
          as="p"
          style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, maxWidth: '44ch' }}
        />
        <Node
          id={n(block.id, 'button')}
          blockId={block.id}
          label="CTA button"
          role="text"
          editable
          fallback={c.button}
          baseFontSize="14px"
          as="button"
          className="inline-flex items-center"
          style={{
            gap: 7,
            background: '#ffffff',
            color: 'var(--n-text)',
            fontSize: 14,
            fontWeight: 700,
            padding: '12px 22px',
            borderRadius: 'var(--n-radius)',
          }}
        />
      </section>
    </BlockShell>
  )
}

/* ── Footer ─────────────────────────────────────────────────── */

function FooterBlock({ block }: { block: Block }) {
  const dir = useHub((s) => s.dir)
  const rtl = dir === 'rtl'
  const c = block.content as { brand: string; columns: { title: string; links: string[] }[]; variant?: string; padding?: number }
  const variant = c.variant || 'minimal'
  const paddingVal = c.padding != null ? `${c.padding}px` : 'var(--n-space-6)'

  // Render elements helpers
  const renderBrand = () => (
    <Node
      id={n(block.id, 'brand')}
      blockId={block.id}
      label="Footer brand"
      role="text"
      editable
      fallback={c.brand}
      baseFontSize="18px"
      as="div"
      style={{
        color: 'var(--n-text)',
        fontFamily: 'var(--n-font-display)',
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: '-0.02em',
      }}
    />
  )

  const renderColumns = (gridColsClass = "grid-cols-3") => (
    <div className={cn("grid gap-6", gridColsClass)} style={{ gap: 'var(--n-space-4)' }}>
      {c.columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div style={{ color: 'var(--n-text)', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em' }}>
            {col.title}
          </div>
          <ul style={{ display: 'grid', gap: 6 }}>
            {col.links.map((l, j) => (
              <li
                key={j}
                className="cursor-pointer transition-colors duration-150 hover:text-app-text text-[11.5px]"
                style={{ color: 'var(--n-text-muted)', fontSize: 12 }}
              >
                {l}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )

  if (variant === 'multicolumn') {
    return (
      <BlockShell block={block}>
        <footer
          className={cn(
            "grid grid-cols-1 lg:grid-cols-5 gap-8 border-t border-app-border/40",
            rtl ? "text-right" : "text-left"
          )}
          style={{
            marginTop: 'var(--n-space-6)',
            padding: `${paddingVal} var(--n-space-6)`,
            background: 'var(--n-surface)',
          }}
        >
          {/* Brand & Newsletter col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {renderBrand()}
            <p className="text-[11.5px] text-app-muted max-w-[28ch] leading-relaxed">
              {rtl
                ? 'ابنِ عقود تصميم لا مفرّ منها، وثّق كلّ التفاصيل وشحن النتيجة بثقة.'
                : 'Beautifully consistent design contracts. Author tokens, styles, and deploy.'}
            </p>
            {/* Subscription Form */}
            <div className="flex flex-col gap-1.5 max-w-[240px]">
              <label className="text-[9px] font-bold text-app-subtle uppercase tracking-wider">
                {rtl ? 'اشترك في النشرة البريدية' : 'Subscribe to our updates'}
              </label>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder={rtl ? 'بريدك الإلكتروني...' : 'you@domain.com'}
                  className="focus-ring flex-1 h-7.5 bg-app-inset border border-app-border rounded px-2 text-[10.5px] focus:outline-none"
                />
                <button className="h-7.5 w-7.5 bg-app-accent text-app-on-accent rounded flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                  <span className="text-[10px]">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-3">
            {renderColumns("grid-cols-2 sm:grid-cols-3")}
          </div>
        </footer>
      </BlockShell>
    )
  }

  if (variant === 'centered') {
    return (
      <BlockShell block={block}>
        <footer
          className="flex flex-col items-center gap-8 border-t border-app-border/40 text-center"
          style={{
            marginTop: 'var(--n-space-6)',
            padding: `${paddingVal} var(--n-space-6)`,
            background: 'var(--n-surface)',
          }}
        >
          {/* Brand */}
          <div className="flex flex-col items-center gap-2">
            <span
              className="grid place-items-center font-bold text-sm"
              style={{
                background: 'var(--n-brand)',
                color: 'var(--n-on-brand)',
                width: 32,
                height: 32,
                borderRadius: 'var(--n-radius-sm)',
                fontFamily: 'var(--n-font-display)',
              }}
            >
              {rtl ? 'ن' : 'N'}
            </span>
            {renderBrand()}
          </div>

          {/* Draggable links flattened */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {c.columns.flatMap(col => col.links).map((link, idx) => (
              <span
                key={idx}
                className="cursor-pointer transition-colors duration-150 hover:text-app-text text-[12px] font-medium"
                style={{ color: 'var(--n-text-muted)' }}
              >
                {link}
              </span>
            ))}
          </div>

          {/* Social Icons row */}
          <div className="flex items-center gap-4 text-app-muted">
            {['Twitter', 'GitHub', 'LinkedIn'].map((platform, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:text-app-accent transition-colors"
              >
                {platform}
              </span>
            ))}
          </div>

          {/* Copyright line */}
          <div className="w-full border-t border-app-border/30 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-app-subtle max-w-4xl">
            <span>© {new Date().getFullYear()} Nezam. All rights reserved.</span>
            <span>Cairo / Sahel / Heliopolis</span>
          </div>
        </footer>
      </BlockShell>
    )
  }

  // Default: 'minimal'
  return (
    <BlockShell block={block}>
      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-app-border/40"
        style={{
          marginTop: 'var(--n-space-6)',
          padding: `${paddingVal} var(--n-space-6)`,
          background: 'var(--n-surface)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center font-bold text-xs"
            style={{
              background: 'var(--n-brand)',
              color: 'var(--n-on-brand)',
              width: 24,
              height: 24,
              borderRadius: 'var(--n-radius-sm)',
              fontFamily: 'var(--n-font-display)',
            }}
          >
            {rtl ? 'ن' : 'N'}
          </span>
          {renderBrand()}
          <span className="text-[11px] text-app-subtle">
            © {new Date().getFullYear()}
          </span>
        </div>
        
        {/* Horizontal inline menu links */}
        <div className="flex flex-wrap items-center gap-4 text-app-muted">
          {c.columns.flatMap(col => col.links).slice(0, 5).map((l, j) => (
            <span
              key={j}
              className="cursor-pointer transition-colors duration-150 hover:text-app-text text-[11px]"
              style={{ color: 'var(--n-text-muted)' }}
            >
              {l}
            </span>
          ))}
        </div>
      </footer>
    </BlockShell>
  )
}

/* ── Arabic typography ──────────────────────────────────────── */

function ArabicBlock({ block }: { block: Block }) {
  const c = block.content as { title: string; body: string; caption: string }
  return (
    <BlockShell block={block}>
      <Node
        id={n(block.id, 'card')}
        blockId={block.id}
        label="Arabic sample"
        role="card"
        as="div"
        style={{
          margin: 'var(--n-space-6)',
          background: 'var(--n-elevated)',
          border: '1px solid var(--n-border)',
          borderRadius: 'var(--n-radius-lg)',
          padding: 'var(--n-space-6)',
          boxShadow: 'var(--n-shadow)',
          fontFamily: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
          direction: 'rtl',
          textAlign: 'right',
        }}
      >
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Arabic heading"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="22px"
          as="h3"
          style={{ color: 'var(--n-text)', fontSize: 22, fontWeight: 700, lineHeight: 1.5, marginBottom: 10 }}
        />
        <Node
          id={n(block.id, 'body')}
          blockId={block.id}
          label="Arabic body"
          role="text"
          editable
          fallback={c.body}
          baseFontSize="14px"
          as="p"
          style={{ color: 'var(--n-text-muted)', fontSize: 14, lineHeight: 1.85 }}
        />
        <Node
          id={n(block.id, 'caption')}
          blockId={block.id}
          label="Arabic caption"
          role="text"
          editable
          fallback={c.caption}
          baseFontSize="11px"
          as="div"
          style={{
            color: 'var(--n-text-subtle)',
            fontSize: 11,
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid var(--n-border)',
          }}
        />
      </Node>
    </BlockShell>
  )
}

/* ── Simple inserted blocks ─────────────────────────────────── */

function TextBlock({ block }: { block: Block }) {
  const c = block.content as { text: string }
  return (
    <BlockShell block={block}>
      <div style={{ padding: 'var(--n-space-6)' }}>
        <Node
          id={n(block.id, 'text')}
          blockId={block.id}
          label="Heading"
          role="text"
          editable
          fallback={c.text}
          baseFontSize="28px"
          as="h2"
          style={{ color: 'var(--n-text)', fontFamily: 'var(--n-font-display)', fontSize: 28, fontWeight: 700 }}
        />
      </div>
    </BlockShell>
  )
}

function ParagraphBlock({ block }: { block: Block }) {
  const c = block.content as { text: string }
  return (
    <BlockShell block={block}>
      <div style={{ padding: 'var(--n-space-4) var(--n-space-6)' }}>
        <Node
          id={n(block.id, 'text')}
          blockId={block.id}
          label="Paragraph"
          role="text"
          editable
          fallback={c.text}
          baseFontSize="15px"
          as="p"
          style={{ color: 'var(--n-text)', fontSize: 15, lineHeight: 1.7, maxWidth: '64ch' }}
        />
      </div>
    </BlockShell>
  )
}

function ImageBlock({ block }: { block: Block }) {
  const c = block.content as { caption: string }
  return (
    <BlockShell block={block}>
      <Node
        id={n(block.id, 'image')}
        blockId={block.id}
        label="Image"
        role="box"
        as="div"
        style={{
          margin: 'var(--n-space-4) var(--n-space-6)',
          background: 'var(--n-brand-subtle)',
          color: 'var(--n-brand)',
          borderRadius: 'var(--n-radius-lg)',
          border: '1px dashed var(--n-border-strong)',
          minHeight: 140,
          display: 'grid',
          placeItems: 'center',
          gap: 6,
        }}
      >
        <ImageGlyph size={28} />
        <Node
          id={n(block.id, 'caption')}
          blockId={block.id}
          label="Image caption"
          role="text"
          editable
          fallback={c.caption}
          baseFontSize="11px"
          as="span"
          style={{ color: 'var(--n-brand)', fontSize: 11 }}
        />
      </Node>
    </BlockShell>
  )
}

function IconBlock({ block }: { block: Block }) {
  const c = block.content as { label: string }
  return (
    <BlockShell block={block}>
      <div className="inline-flex items-center" style={{ gap: 10, padding: 'var(--n-space-4) var(--n-space-6)' }}>
        <Node
          id={n(block.id, 'icon')}
          blockId={block.id}
          label="Icon"
          role="box"
          as="span"
          className="grid place-items-center"
          style={{
            width: 40,
            height: 40,
            background: 'var(--n-brand-subtle)',
            color: 'var(--n-brand)',
            borderRadius: 'var(--n-radius)',
          }}
        >
          <Star size={20} />
        </Node>
        <Node
          id={n(block.id, 'label')}
          blockId={block.id}
          label="Icon label"
          role="text"
          editable
          fallback={c.label}
          baseFontSize="13px"
          as="span"
          style={{ color: 'var(--n-text-muted)', fontSize: 13 }}
        />
      </div>
    </BlockShell>
  )
}

function GenericSectionBlock({ block }: { block: Block }) {
  const c = block.content as { label: string }
  return (
    <BlockShell block={block}>
      <Node
        id={n(block.id, 'placeholder')}
        blockId={block.id}
        label="Empty section"
        role="box"
        as="div"
        className="grid place-items-center"
        style={{
          margin: 'var(--n-space-4) var(--n-space-6)',
          background: 'var(--n-surface)',
          border: '1px dashed var(--n-border-strong)',
          borderRadius: 'var(--n-radius-lg)',
          minHeight: 120,
          color: 'var(--n-text-subtle)',
          fontSize: 12,
          gap: 6,
        }}
      >
        <FileText size={20} />
        <Node
          id={n(block.id, 'label')}
          blockId={block.id}
          label="Section label"
          role="text"
          editable
          fallback={c.label}
          baseFontSize="12px"
          as="span"
          style={{ color: 'var(--n-text-subtle)', fontSize: 12 }}
        />
      </Node>
    </BlockShell>
  )
}

/* ── Dispatcher ─────────────────────────────────────────────── */

export function RenderBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case 'nav': return <NavBlock block={block} />
    case 'hero': return <HeroBlock block={block} />
    case 'featureGrid': return <FeatureGridBlock block={block} />
    case 'stats': return <StatsBlock block={block} />
    case 'productGrid': return <ProductGridBlock block={block} />
    case 'articleList': return <ArticleListBlock block={block} />
    case 'pricing': return <PricingBlock block={block} />
    case 'dashboard': return <DashboardBlock block={block} />
    case 'vendorGrid': return <VendorGridBlock block={block} />
    case 'cta': return <CtaBlock block={block} />
    case 'footer': return <FooterBlock block={block} />
    case 'arabic': return <ArabicBlock block={block} />
    case 'text': return <TextBlock block={block} />
    case 'paragraph': return <ParagraphBlock block={block} />
    case 'image': return <ImageBlock block={block} />
    case 'icon': return <IconBlock block={block} />
    case 'section': return <GenericSectionBlock block={block} />
  }
}

/* Unused import guard to keep tree-shake honest */
void ensureGsap
void prefersReducedMotion
void ArrowRight
