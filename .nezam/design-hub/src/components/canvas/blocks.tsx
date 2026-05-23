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
  const c = block.content as { brand: string; links: string[]; cta: string }
  return (
    <BlockShell block={block}>
      <nav
        className="flex items-center justify-between"
        style={{
          background: 'var(--n-surface)',
          border: '1px solid var(--n-border)',
          borderRadius: 'var(--n-radius-lg)',
          padding: 'var(--n-space-3) var(--n-space-4)',
          margin: 'var(--n-space-6) var(--n-space-6) 0',
          boxShadow: 'var(--n-shadow)',
        }}
      >
        <div className="flex items-center" style={{ gap: 'var(--n-space-2)' }}>
          <span
            className="grid place-items-center font-bold"
            style={{
              background: 'var(--n-brand)',
              color: 'var(--n-on-brand)',
              width: 30,
              height: 30,
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
              fontWeight: 600,
              fontFamily: 'var(--n-font-display)',
            }}
          />
        </div>
        <div className="hidden items-center sm:flex" style={{ gap: 'var(--n-space-4)' }}>
          {c.links.map((link, i) => (
            <Node
              key={i}
              id={n(block.id, `link-${i}`)}
              blockId={block.id}
              label={`Nav link · ${link}`}
              role="text"
              editable
              fallback={link}
              baseFontSize="13px"
              as="span"
              style={{
                color: i === 0 ? 'var(--n-text)' : 'var(--n-text-muted)',
                fontSize: 13,
                fontWeight: i === 0 ? 600 : 500,
              }}
            />
          ))}
        </div>
        <Node
          id={n(block.id, 'cta')}
          blockId={block.id}
          label="Sign in button"
          role="text"
          editable
          fallback={c.cta}
          baseFontSize="12px"
          as="span"
          style={{
            background: 'var(--n-brand)',
            color: 'var(--n-on-brand)',
            fontSize: 12,
            fontWeight: 600,
            padding: '7px 14px',
            borderRadius: 'var(--n-radius)',
          }}
        />
      </nav>
    </BlockShell>
  )
}

/* ── Hero ───────────────────────────────────────────────────── */

function HeroBlock({ block }: { block: Block }) {
  const dir = useHub((s) => s.dir)
  const rtl = dir === 'rtl'
  const c = block.content as { badge: string; title: string; subtitle: string; primary: string; secondary: string }
  return (
    <BlockShell block={block}>
      <section
        className="flex flex-col items-center text-center"
        style={{ gap: 'var(--n-space-3)', padding: 'var(--n-space-8) var(--n-space-6) var(--n-space-4)' }}
      >
        <Node
          id={n(block.id, 'badge')}
          blockId={block.id}
          label="Hero badge"
          role="text"
          editable
          fallback={c.badge}
          baseFontSize="11px"
          as="span"
          style={{
            background: 'var(--n-brand-subtle)',
            color: 'var(--n-brand)',
            fontSize: 11,
            fontWeight: 600,
            padding: '5px 11px',
            borderRadius: 'var(--n-radius-pill)',
          }}
        />
        <Node
          id={n(block.id, 'title')}
          blockId={block.id}
          label="Hero heading"
          role="text"
          editable
          fallback={c.title}
          baseFontSize="clamp(26px, 4.4vw, 40px)"
          as="h1"
          className="max-w-[34ch]"
          style={{
            color: 'var(--n-text)',
            fontFamily: 'var(--n-font-display)',
            fontSize: 'clamp(26px, 4.4vw, 40px)',
            fontWeight: 700,
            lineHeight: rtl ? 1.5 : 1.12,
            letterSpacing: rtl ? 0 : '-0.02em',
          }}
        />
        <Node
          id={n(block.id, 'subtitle')}
          blockId={block.id}
          label="Hero subtitle"
          role="text"
          editable
          fallback={c.subtitle}
          baseFontSize="15px"
          as="p"
          className="max-w-[46ch]"
          style={{ color: 'var(--n-text-muted)', fontSize: 15, lineHeight: rtl ? 1.8 : 1.6 }}
        />
        <div className="mt-2 flex flex-wrap items-center justify-center" style={{ gap: 'var(--n-space-2)' }}>
          <Node
            id={n(block.id, 'primary')}
            blockId={block.id}
            label="Primary button"
            role="text"
            editable
            fallback={c.primary}
            baseFontSize="14px"
            as="button"
            className="inline-flex items-center"
            style={{
              gap: 7,
              background: 'var(--n-brand)',
              color: 'var(--n-on-brand)',
              fontSize: 14,
              fontWeight: 600,
              padding: '11px 20px',
              borderRadius: 'var(--n-radius)',
              boxShadow: 'var(--n-shadow)',
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
            className="inline-flex items-center"
            style={{
              gap: 7,
              color: 'var(--n-text)',
              fontSize: 14,
              fontWeight: 600,
              padding: '11px 20px',
              borderRadius: 'var(--n-radius)',
              border: '1px solid var(--n-border-strong)',
            }}
          />
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
  const c = block.content as { brand: string; columns: { title: string; links: string[] }[] }
  return (
    <BlockShell block={block}>
      <footer
        style={{
          marginTop: 'var(--n-space-6)',
          padding: 'var(--n-space-6)',
          background: 'var(--n-surface)',
          borderTop: '1px solid var(--n-border)',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 'var(--n-space-6)',
        }}
      >
        <Node
          id={n(block.id, 'brand')}
          blockId={block.id}
          label="Footer brand"
          role="text"
          editable
          fallback={c.brand}
          baseFontSize="18px"
          as="div"
          style={{ color: 'var(--n-text)', fontFamily: 'var(--n-font-display)', fontSize: 18, fontWeight: 700 }}
        />
        <div className="grid grid-cols-3" style={{ gap: 'var(--n-space-4)' }}>
          {c.columns.map((col, i) => (
            <div key={i}>
              <div style={{ color: 'var(--n-text)', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                {col.title}
              </div>
              <ul style={{ display: 'grid', gap: 4 }}>
                {col.links.map((l, j) => (
                  <li key={j} style={{ color: 'var(--n-text-muted)', fontSize: 12 }}>{l}</li>
                ))}
              </ul>
            </div>
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
