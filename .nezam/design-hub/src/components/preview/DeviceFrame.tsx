'use client'

import { useMemo } from 'react'
import { useHub } from '@/store/hub.store'
import type { PreviewDevice } from '@/store/hub.store'
import type { ArchPage } from '@/types/arch'
import type { DesignTokens } from '@/types/design'

// ─── Build override CSS vars from a previewOverride record ────────────────────
// Maps shadcn token names → DeviceFrame CSS var names so the applied theme
// palette is actually visible in the Preview tab.
function buildOverrideVars(override: NonNullable<ReturnType<typeof useHub.getState>['theme']['previewOverride']>): React.CSSProperties {
  const v = override[override.mode]
  if (!v) return {}
  return {
    '--bg-surface':     v.background   ?? undefined,
    '--panel':          v.card         ?? undefined,
    '--border':         v.border       ?? undefined,
    '--text':           v.foreground   ?? undefined,
    '--text-secondary': v['card-foreground'] ?? v['muted-foreground'] ?? undefined,
    '--text-muted':     v['muted-foreground'] ?? undefined,
    '--brand':          v.primary      ?? undefined,
    '--brand-hover':    v.primary      ?? undefined,  // approximation
    '--brand-subtle':   v.secondary    ?? undefined,
    '--brand-deep':     v.primary      ?? undefined,  // approximation
    '--accent':         v.accent       ?? undefined,
    '--neutral-100':    v.secondary    ?? undefined,
    '--neutral-200':    v.muted        ?? undefined,
    '--error':          v.destructive  ?? undefined,
    '--radius-md':      v.radius       ?? undefined,
    '--radius-lg':      v.radius       ?? undefined,
  } as React.CSSProperties
}

// ─── Device sizes ─────────────────────────────────────────────────────────────

interface Props { device: PreviewDevice; page: ArchPage }

const DEVICE_SIZES: Record<PreviewDevice, { width: number; label: string }> = {
  desktop: { width: 1280, label: '1280px' },
  tablet:  { width: 768,  label: '768px' },
  mobile:  { width: 390,  label: '390px' },
}
const DISPLAY_WIDTHS: Record<PreviewDevice, string> = {
  desktop: '920px',
  tablet:  '560px',
  mobile:  '320px',
}
const SCALE: Record<PreviewDevice, number> = {
  desktop: 0.72,
  tablet:  0.86,
  mobile:  0.95,
}

// ─── Token → CSS vars ─────────────────────────────────────────────────────────

function buildVars(t: DesignTokens): React.CSSProperties {
  return {
    '--brand':          t.colors.brand['500'],
    '--brand-hover':    t.colors.brand['400'],
    '--brand-subtle':   t.colors.brand['100'],
    '--brand-deep':     t.colors.brand['700'],
    '--bg-surface':     t.colors.surface.bg,
    '--panel':          t.colors.surface.panel,
    '--border':         t.colors.surface.border,
    '--text':           t.colors.text.primary,
    '--text-secondary': t.colors.text.secondary,
    '--text-muted':     t.colors.text.muted,
    '--text-disabled':  t.colors.text.disabled,
    '--success':        t.colors.semantic.success,
    '--warning':        t.colors.semantic.warning,
    '--error':          t.colors.semantic.error,
    '--accent':         t.colors.accent['500'],
    '--radius-sm':      t.radius.sm,
    '--radius-md':      t.radius.md,
    '--radius-lg':      t.radius.lg,
    '--radius-xl':      t.radius.xl,
    '--radius-full':    t.radius.full,
    '--shadow-sm':      t.shadows.sm,
    '--shadow-md':      t.shadows.md,
    '--shadow-lg':      t.shadows.lg,
    '--font-sans':      t.typography.sans,
    '--font-display':   t.typography.display,
    '--font-mono':      t.typography.mono,
    '--motion-duration': t.motion.duration.base,
    '--motion-easing':  t.motion.easing.default,
    '--border-width':   t.borders.width,
    '--border-style':   t.borders.style,
    '--neutral-100':    t.colors.neutral['100'],
    '--neutral-200':    t.colors.neutral['200'],
    '--neutral-300':    t.colors.neutral['300'],
    '--spacing-base':   `${t.spacing.base}px`,
  } as React.CSSProperties
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const css = {
  page:   (isMobile: boolean): React.CSSProperties => ({
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text)',
    fontFamily: 'var(--font-sans)',
    minHeight: '100%',
    padding: 0,
    margin: 0,
  }),
  nav: (isMobile: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: `0 ${isMobile ? '16px' : '28px'}`,
    height: '52px',
    backgroundColor: 'var(--panel)',
    borderBottom: 'var(--border-width) var(--border-style) var(--border)',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  }),
  logo: (): React.CSSProperties => ({
    fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--brand)',
    letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px',
  }),
  navLinks: (): React.CSSProperties => ({
    display: 'flex', gap: '24px',
  }),
  navLink: (): React.CSSProperties => ({
    fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer',
  }),
  pill: (active = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px', fontWeight: 500,
    backgroundColor: active ? 'var(--brand)' : 'var(--brand-subtle)',
    color: active ? '#fff' : 'var(--brand)',
    border: 'none',
    cursor: 'pointer',
  }),
  btnPrimary: (isMobile = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: isMobile ? '9px 18px' : '10px 22px',
    backgroundColor: 'var(--brand)', color: '#fff',
    borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600,
    border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-md)',
  }),
  btnOutline: (isMobile = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: isMobile ? '9px 18px' : '10px 22px',
    backgroundColor: 'transparent', color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 500,
    border: 'var(--border-width) var(--border-style) var(--border)', cursor: 'pointer',
  }),
  card: (): React.CSSProperties => ({
    backgroundColor: 'var(--panel)',
    border: 'var(--border-width) var(--border-style) var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  }),
  input: (): React.CSSProperties => ({
    height: '38px', width: '100%',
    backgroundColor: 'var(--bg-surface)',
    border: 'var(--border-width) var(--border-style) var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 12px', fontSize: '13px', color: 'var(--text-disabled)',
    display: 'flex', alignItems: 'center',
  }),
  label: (): React.CSSProperties => ({
    fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '5px',
  }),
  h1: (isMobile: boolean, isTablet: boolean): React.CSSProperties => ({
    fontSize: isMobile ? '26px' : isTablet ? '34px' : '44px',
    fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.1,
    color: 'var(--text)', marginBottom: '14px', letterSpacing: '-0.02em',
  }),
  h2: (isMobile: boolean): React.CSSProperties => ({
    fontSize: isMobile ? '20px' : '26px',
    fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2,
    color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.015em',
  }),
  section: (isMobile: boolean): React.CSSProperties => ({
    padding: isMobile ? '40px 16px' : '60px 28px',
  }),
  footer: (): React.CSSProperties => ({
    padding: '32px 28px',
    backgroundColor: 'var(--panel)',
    borderTop: 'var(--border-width) var(--border-style) var(--border)',
  }),
}

// ─── Page type detector ───────────────────────────────────────────────────────

type PageTemplate =
  | 'marketing' | 'features' | 'pricing' | 'blog-list' | 'article' | 'contact'
  | 'auth-login' | 'auth-signup' | 'auth-forgot'
  | 'dashboard' | 'analytics' | 'settings' | 'profile' | 'team'
  | 'docs' | 'api-explorer' | 'media-library' | 'notifications'
  | 'product-list' | 'product-detail' | 'cart' | 'checkout' | 'order-success'
  | 'onboarding' | 'error-404'

function detectTemplate(page: ArchPage): PageTemplate {
  const name  = page.name.toLowerCase()
  const route = (page.route ?? '').toLowerCase()

  // Substring match in name OR route
  const has = (...terms: string[]) =>
    terms.some((t) => name.includes(t) || route.includes(t))

  // Exact word match in tokenised name (prevents 'me' matching 'home')
  const nameWords = new Set(name.split(/[\s\-_/[\].]+/).filter(Boolean))
  const word = (...terms: string[]) => terms.some((t) => nameWords.has(t))

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (has('login', 'sign-in', 'signin') || word('login'))          return 'auth-login'
  if (has('signup', 'sign-up', 'register') || word('register'))    return 'auth-signup'
  if (has('forgot', 'reset', 'password'))                          return 'auth-forgot'

  // ── E-Commerce ────────────────────────────────────────────────────────────
  if (has('checkout'))                                              return 'checkout'
  if (has('cart', 'basket'))                                        return 'cart'
  if (has('order', 'success', 'thank') || word('confirm'))          return 'order-success'
  if ((has('product', 'item', '[') || has('detail')) && !has('list', 'catalog')) return 'product-detail'
  if (has('shop', 'store', 'catalog', 'collection', 'wishlist') || (has('product') && has('list'))) return 'product-list'

  // ── Content ───────────────────────────────────────────────────────────────
  if (has('pricing', 'plan', 'price'))                              return 'pricing'
  if (has('blog', 'news', 'articles', 'posts') || word('post'))     return 'blog-list'
  if (has('article', 'journal', 'story') || word('slug'))           return 'article'
  if (has('contact', 'reach', 'get-in-touch'))                      return 'contact'
  if (has('newsletter'))                                            return 'blog-list'

  // ── Docs / API ─────────────────────────────────────────────────────────────
  if (has('docs', 'documentation', 'guide', 'reference') || word('doc')) return 'docs'
  if (has('api') && (has('explorer', 'reference', 'docs') || route.includes('/api'))) return 'api-explorer'

  // ── App pages ─────────────────────────────────────────────────────────────
  if (has('analytics', 'report', 'chart', 'insight', 'explorer') || word('reports')) return 'analytics'
  if (has('settings', 'preference', 'security', 'privacy', 'billing') || word('account')) return 'settings'
  if (has('notification', 'inbox', 'message') && !has('setting'))    return 'notifications'
  if (has('team', 'member', 'people', 'staff') || word('org'))        return 'team'
  if (has('media', 'library', 'asset', 'upload') || word('files'))    return 'media-library'

  // ── Profile — uses word() for 'me' to avoid 'home' false-match ─────────
  if (has('profile', 'portfolio', 'resume') || word('me', 'about'))   return 'profile'

  // ── Onboarding ────────────────────────────────────────────────────────────
  if (has('onboarding', 'welcome', 'setup', 'permission') || word('start')) return 'onboarding'

  // ── Features page (must come BEFORE dashboard / marketing) ────────────────
  if (has('feature') || word('features'))                             return 'features'

  // ── Dashboard (broad catch — route-based) ─────────────────────────────────
  if (has('dashboard', 'overview', 'admin') ||
      route.startsWith('/app') || route.startsWith('/dashboard') || route.startsWith('/admin'))
    return 'dashboard'

  // ── Home / landing ────────────────────────────────────────────────────────
  if (route === '/' || word('home', 'landing'))                       return 'marketing'

  // ── 404 ───────────────────────────────────────────────────────────────────
  if (has('404', 'not-found', 'error'))                               return 'error-404'

  return 'marketing'
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function NavBar({
  isMobile,
  links = ['Features', 'Pricing', 'Blog', 'Docs'],
  cta = 'Get Started',
}: {
  isMobile: boolean
  links?: string[]
  cta?: string
}) {
  return (
    <nav style={css.nav(isMobile)}>
      <div style={css.logo()}>
        <span style={{ width: 20, height: 20, borderRadius: '5px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
        YourApp
      </div>
      {!isMobile && (
        <div style={css.navLinks()}>
          {links.map((l) => <span key={l} style={css.navLink()}>{l}</span>)}
        </div>
      )}
      <button style={css.btnPrimary(isMobile)}>{cta}</button>
    </nav>
  )
}

function AppSidebar({ isMobile, items, active = 0 }: { isMobile: boolean; items: string[]; active?: number }) {
  if (isMobile) return null
  return (
    <aside style={{
      width: '180px', flexShrink: 0,
      backgroundColor: 'var(--panel)',
      borderRight: 'var(--border-width) var(--border-style) var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '14px 8px',
    }}>
      <div style={{ ...css.logo(), fontSize: '13px', padding: '4px 8px', marginBottom: '14px' }}>
        <span style={{ width: 16, height: 16, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
        YourApp
      </div>
      {items.map((item, i) => (
        <div key={item} style={{
          padding: '7px 10px',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px',
          fontWeight: i === active ? 600 : 400,
          color: i === active ? 'var(--brand)' : 'var(--text-muted)',
          backgroundColor: i === active ? 'var(--brand-subtle)' : 'transparent',
          marginBottom: '1px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === active ? 'var(--brand)' : 'var(--neutral-300)', flexShrink: 0 }} />
          {item}
        </div>
      ))}
    </aside>
  )
}

function StatCard({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div style={{ ...css.card(), padding: '16px' }}>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{value}</p>
      <p style={{ fontSize: '11px', color: up ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', gap: '3px' }}>
        <span>{up ? '↑' : '↓'}</span> {delta}
      </p>
    </div>
  )
}

function InputField({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <p style={css.label()}>{label}</p>
      <div style={css.input()}>
        <span style={{ fontSize: '13px', color: 'var(--text-disabled)' }}>{placeholder}</span>
      </div>
    </div>
  )
}

function Footer({ minimal = false }: { minimal?: boolean }) {
  return (
    <footer style={css.footer()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {!minimal && (
          <div style={css.logo()}>
            <span style={{ width: 16, height: 16, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
            YourApp
          </div>
        )}
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          © 2025 YourApp · Privacy · Terms · Support
        </p>
        {!minimal && (
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Twitter', 'GitHub', 'LinkedIn'].map((s) => (
              <span key={s} style={{ fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer' }}>{s}</span>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}

// ─── Page templates ───────────────────────────────────────────────────────────

function MarketingPage({ page, isMobile, isTablet }: { page: ArchPage; isMobile: boolean; isTablet: boolean }) {
  const features = [
    { title: 'Lightning Fast',    desc: 'Sub-100ms response times worldwide with edge delivery.' },
    { title: 'Secure by Default', desc: 'SOC2 certified infrastructure with end-to-end encryption.' },
    { title: 'Beautiful UI',      desc: 'Thoughtfully designed with accessibility at the core.' },
    { title: 'Real-time Sync',    desc: 'Instant updates across all devices and collaborators.' },
    { title: 'Deep Integrations', desc: 'Connects to 200+ tools your team already uses.' },
    { title: 'Global Scale',      desc: 'Auto-scales to millions of users without config.' },
  ]
  const cols = isMobile ? 1 : isTablet ? 2 : 3

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} />

      {/* Hero */}
      <section style={{
        ...css.section(isMobile),
        background: `linear-gradient(170deg, var(--brand-subtle) 0%, var(--bg-surface) 60%)`,
        textAlign: 'center',
        paddingBottom: isMobile ? '48px' : '80px',
      }}>
        <span style={css.pill()}>✦ Now in public beta</span>
        <h1 style={{ ...css.h1(isMobile, isTablet), marginTop: '14px' }}>
          The smarter way<br />to build {page.name}
        </h1>
        <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.65 }}>
          Everything your team needs to move fast, stay aligned, and ship great products. No complexity, just results.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={css.btnPrimary(isMobile)}>Start for free →</button>
          <button style={css.btnOutline(isMobile)}>Watch demo</button>
        </div>
        {/* Social proof */}
        <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex' }}>
            {['#3b82f6','#10b981','#8b5cf6'].map((c, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: c, border: '2px solid var(--bg-surface)', marginLeft: i ? '-6px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700 }}>
                {['YD','AB','CX'][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trusted by 12,000+ teams</span>
          <span style={{ fontSize: '12px', color: 'var(--warning)' }}>★★★★★ 4.9/5</span>
        </div>
      </section>

      {/* Logos strip */}
      <div style={{ borderTop: 'var(--border-width) var(--border-style) var(--border)', borderBottom: 'var(--border-width) var(--border-style) var(--border)', padding: '18px 28px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
        {['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((n) => (
          <span key={n} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--neutral-300)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{n}</span>
        ))}
      </div>

      {/* Features */}
      <section style={css.section(isMobile)}>
        <div style={{ marginBottom: '36px' }}>
          <h2 style={css.h2(isMobile)}>Everything you need</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Powerful features that grow with your team</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }}>
          {features.map((f, i) => (
            <div key={f.title} style={{ ...css.card(), padding: '20px' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <span style={{ width: 14, height: 14, borderRadius: '3px', backgroundColor: 'var(--brand)', opacity: 0.7 + i * 0.05 }} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{f.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ margin: '0 28px 48px', padding: '36px', backgroundColor: 'var(--brand)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>Ready to get started?</h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px' }}>Join thousands of teams building better products.</p>
        <button style={{ ...css.btnPrimary(), backgroundColor: '#fff', color: 'var(--brand)' }}>Start free trial</button>
      </section>

      <Footer />
    </div>
  )
}

function PricingPage({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const plans = [
    { name: 'Starter',    price: '$0',   period: '/mo', color: 'var(--neutral-200)', tag: null,     features: ['5 projects', '3 team members', '1 GB storage', 'Email support'] },
    { name: 'Pro',        price: '$29',  period: '/mo', color: 'var(--brand)',  tag: 'Popular', features: ['Unlimited projects', '25 members', '50 GB storage', 'Priority support', 'Analytics', 'Custom domain'] },
    { name: 'Enterprise', price: '$99',  period: '/mo', color: 'var(--brand-deep)', tag: null,     features: ['Everything in Pro', 'Unlimited members', '1 TB storage', 'Dedicated support', 'SSO & SAML', 'SLA 99.99%'] },
  ]
  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} />
      <section style={{ ...css.section(isMobile), textAlign: 'center' }}>
        <h1 style={css.h1(isMobile, isTablet)}>Simple, transparent pricing</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '36px' }}>Start free. Scale as you grow. No surprises.</p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '16px', maxWidth: '820px', margin: '0 auto' }}>
          {plans.map((plan) => (
            <div key={plan.name} style={{ ...css.card(), padding: '28px', border: plan.name === 'Pro' ? `2px solid var(--brand)` : undefined, position: 'relative' }}>
              {plan.tag && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', ...css.pill(true) }}>{plan.tag}</div>
              )}
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{plan.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '20px' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.03em' }}>{plan.price}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>
              <button style={{ ...css.btnPrimary(), width: '100%', backgroundColor: plan.name === 'Pro' ? 'var(--brand)' : 'transparent', color: plan.name === 'Pro' ? '#fff' : 'var(--text)', border: plan.name === 'Pro' ? 'none' : 'var(--border-width) var(--border-style) var(--border)', marginBottom: '20px' }}>
                Get started
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}

function BlogListPage({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const posts = [
    { tag: 'Engineering', title: 'Building a Design System at Scale', excerpt: 'How we unified 40 products under a single token architecture and shipped in 6 months.', date: 'May 2025', read: '8 min' },
    { tag: 'Product',     title: 'The Anatomy of a Great Onboarding Flow', excerpt: 'We studied 200 onboarding flows. Here\'s what separates delightful from frustrating.', date: 'Apr 2025', read: '6 min' },
    { tag: 'Design',      title: 'Typography in UI: A Practical Guide', excerpt: 'Font choices, line heights, and spacing — the decisions that define readability.', date: 'Apr 2025', read: '5 min' },
    { tag: 'Engineering', title: 'From REST to GraphQL: Lessons Learned', excerpt: 'Our migration journey, the wins, the mistakes, and what we\'d do differently.', date: 'Mar 2025', read: '10 min' },
  ]
  const cols = isMobile ? 1 : isTablet ? 2 : 2

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} />
      <section style={css.section(isMobile)}>
        <h1 style={{ ...css.h1(isMobile, isTablet), marginBottom: '6px' }}>Blog</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Ideas, engineering notes, and product updates from our team.</p>
        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {['All', 'Engineering', 'Product', 'Design', 'Company'].map((t, i) => (
            <span key={t} style={{ ...css.pill(i === 0), fontSize: '11px' }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
          {posts.map((post) => (
            <div key={post.title} style={{ ...css.card(), padding: '22px', cursor: 'pointer' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{post.tag}</span>
              </div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.35, fontFamily: 'var(--font-display)' }}>{post.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700 }}>YD</div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{post.date}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{post.read} read</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}

function ArticlePage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} />
      <article style={{ maxWidth: '680px', margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 28px' }}>
        {/* Tag + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={css.pill()}>Engineering</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>May 2025 · 8 min read</span>
        </div>
        <h1 style={{ fontSize: isMobile ? '24px' : '34px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.02em' }}>{page.name}</h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
          Everything your team needs to move fast, stay aligned, and ship great products. No complexity, just results.
        </p>
        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 0', borderTop: 'var(--border-width) var(--border-style) var(--border)', borderBottom: 'var(--border-width) var(--border-style) var(--border)', marginBottom: '28px' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700 }}>YD</div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Yasser Dorgham</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Design Architect</p>
          </div>
        </div>
        {/* Body paragraphs */}
        {[
          'Building a scalable design system starts with a clear understanding of your design tokens. Tokens are the single source of truth for all visual decisions — colors, spacing, typography, shadows — expressed as named variables.',
          'When we first introduced tokens at YourApp, we had 40 separate product surfaces each making their own visual choices. The result was inconsistency, maintenance burden, and a poor user experience across the board.',
          'The key insight was that tokens need to have semantic meaning, not just describe their value. A color called "blue-500" is less useful than one called "brand-primary", because the former tells you what it is, while the latter tells you what it\'s for.',
        ].map((p, i) => (
          <p key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '18px' }}>{p}</p>
        ))}
        {/* Code block */}
        <div style={{ backgroundColor: '#1a1b26', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '18px', fontFamily: 'var(--font-mono)' }}>
          <p style={{ fontSize: '11px', color: '#7aa2f7' }}>{'// Design token example'}</p>
          <p style={{ fontSize: '11px', color: '#c0caf5', marginTop: '6px' }}>{'const tokens = {'}</p>
          <p style={{ fontSize: '11px', color: '#c0caf5', paddingLeft: '16px' }}>{'brand: { primary: \'#3b82f6\', hover: \'#2563eb\' },'}</p>
          <p style={{ fontSize: '11px', color: '#c0caf5', paddingLeft: '16px' }}>{'spacing: { sm: \'8px\', md: \'16px\', lg: \'24px\' },'}</p>
          <p style={{ fontSize: '11px', color: '#c0caf5' }}>{'}'}</p>
        </div>
      </article>
      <Footer minimal />
    </div>
  )
}

function AuthPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const isLogin  = page.route.includes('login') || page.name.toLowerCase().includes('login') || page.name.toLowerCase().includes('sign in')
  const isForgot = page.route.includes('forgot') || page.route.includes('reset') || page.name.toLowerCase().includes('forgot')

  const title   = isForgot ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create your account'
  const subtitle = isForgot ? 'Enter your email and we\'ll send a reset link.' : isLogin ? 'Sign in to continue to YourApp' : 'Get started for free today'

  return (
    <div style={{
      ...css.page(isMobile),
      display: 'flex', minHeight: '600px',
      background: `linear-gradient(135deg, var(--brand-subtle) 0%, var(--bg-surface) 55%)`,
    }}>
      {!isMobile && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', backgroundColor: 'var(--brand)' }}>
          <div style={css.logo()}>
            <span style={{ width: 22, height: 22, borderRadius: '6px', backgroundColor: '#fff', opacity: 0.9, display: 'inline-block' }} />
            <span style={{ color: '#fff' }}>YourApp</span>
          </div>
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
              Build faster, ship smarter
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '32px' }}>
              Join 12,000+ teams using YourApp to design, build, and launch world-class products.
            </p>
            {['No credit card required', 'Unlimited projects on free tier', 'SOC2 certified security'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ flex: isMobile ? 1 : '0 0 420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '32px 16px' : '48px 40px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ ...css.logo(), marginBottom: '20px' }}>
              <span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
              YourApp
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!isLogin && !isForgot && <InputField label="Full name" placeholder="Jane Smith" />}
            <InputField label="Email address" placeholder="you@company.com" type="email" />
            {!isForgot && <InputField label="Password" placeholder="••••••••••••" type="password" />}
            {isLogin && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px', color: 'var(--brand)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
            )}
            <button style={{ ...css.btnPrimary(), width: '100%', marginTop: '4px', padding: '12px' }}>
              {isForgot ? 'Send reset link' : isLogin ? 'Sign in' : 'Create account'}
            </button>
            {!isForgot && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>or continue with</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              </div>
            )}
            {!isForgot && (
              <button style={{ ...css.btnOutline(), width: '100%', padding: '10px', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px' }}>G</span> Google
              </button>
            )}
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : isForgot ? 'Remember it? ' : 'Already have one? '}
              <span style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 500 }}>
                {isLogin ? 'Sign up free' : isForgot ? 'Sign in' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const navItems = ['Overview', 'Analytics', 'Users', 'Projects', 'Billing', 'Settings']
  const stats = [
    { label: 'Total Users',  value: '12,483', delta: '+12%', up: true },
    { label: 'Revenue',      value: '$48,290', delta: '+8.2%',  up: true },
    { label: 'Active Now',   value: '1,204',   delta: '+3.1%',  up: true },
    { label: 'Churn Rate',   value: '2.1%',    delta: '-0.4%', up: false },
  ]
  const rows = [
    { name: 'Alice Johnson', email: 'alice@co.com', role: 'Admin',  status: 'Active',   joined: 'Jan 2025' },
    { name: 'Bob Smith',     email: 'bob@co.com',   role: 'Member', status: 'Active',   joined: 'Feb 2025' },
    { name: 'Carol White',   email: 'carol@co.com', role: 'Viewer', status: 'Pending',  joined: 'Apr 2025' },
    { name: 'Dan Brown',     email: 'dan@co.com',   role: 'Member', status: 'Inactive', joined: 'Mar 2025' },
  ]
  const statusColors: Record<string, string> = { Active: 'var(--success)', Pending: 'var(--warning)', Inactive: 'var(--text-muted)' }
  const statusBg: Record<string, string>     = { Active: 'var(--success)18', Pending: 'var(--warning)18', Inactive: 'var(--neutral-100)' }

  return (
    <div style={{ ...css.page(isMobile), display: 'flex', height: '100%', minHeight: '700px' }}>
      <AppSidebar isMobile={isMobile} items={navItems} active={0} />
      <main style={{ flex: 1, overflow: 'hidden', padding: isMobile ? '16px' : '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{page.name}</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Welcome back — here's what's happening today.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...css.btnOutline(), padding: '7px 14px', fontSize: '12px' }}>Export</button>
            <button style={{ ...css.btnPrimary(), padding: '7px 14px', fontSize: '12px' }}>+ New</button>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '12px' }}>
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Chart + table row */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', flex: 1 }}>
          {/* Chart */}
          <div style={{ ...css.card(), padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Revenue Overview</p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['7d','30d','90d'].map((p, i) => (
                  <span key={p} style={{ ...css.pill(i === 1), fontSize: '10px', padding: '2px 7px' }}>{p}</span>
                ))}
              </div>
            </div>
            {/* Y-axis labels + bars */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '90px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                {['12k','6k','0'].map((v) => <span key={v} style={{ fontSize: '9px', color: 'var(--text-muted)', width: '22px' }}>{v}</span>)}
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '5px', height: '100%' }}>
                {[42,58,45,72,61,88,65,80,55,90,70,95].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 11 ? 'var(--brand)' : `var(--brand)${Math.round(30 + i * 5).toString(16)}`, borderRadius: '3px 3px 0 0' }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '30px' }}>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m) => (
                <span key={m} style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Users mini table */}
          <div style={{ ...css.card(), overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: 'var(--border-width) var(--border-style) var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Recent Users</p>
              <span style={{ fontSize: '11px', color: 'var(--brand)', cursor: 'pointer' }}>View all →</span>
            </div>
            {rows.map((row, i) => (
              <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: i < rows.length - 1 ? 'var(--border-width) var(--border-style) var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: ['#3b82f6','#10b981','#8b5cf6','#f59e0b'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                  {row.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.2 }}>{row.name}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{row.role}</p>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 500, color: statusColors[row.status], backgroundColor: statusBg[row.status], padding: '2px 7px', borderRadius: 'var(--radius-full)' }}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function AnalyticsPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const navItems = ['Overview', 'Reports', 'Explorer', 'Alerts', 'Integrations', 'Settings']
  const metrics = [
    { label: 'Page Views', value: '2.4M', delta: '+18%', up: true },
    { label: 'Unique Visitors', value: '189K', delta: '+11%', up: true },
    { label: 'Avg. Session', value: '4m 22s', delta: '+8%', up: true },
    { label: 'Bounce Rate', value: '38.2%', delta: '-3.1%', up: false },
  ]
  const topPages = [
    { path: '/', views: '480K', pct: 100 },
    { path: '/pricing', views: '210K', pct: 44 },
    { path: '/blog', views: '165K', pct: 34 },
    { path: '/docs', views: '140K', pct: 29 },
    { path: '/signup', views: '98K', pct: 20 },
  ]

  return (
    <div style={{ ...css.page(isMobile), display: 'flex', minHeight: '700px' }}>
      <AppSidebar isMobile={isMobile} items={navItems} active={0} />
      <main style={{ flex: 1, padding: isMobile ? '16px' : '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{page.name}</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Last 30 days · Updated 2 minutes ago</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['7d','30d','90d','1y'].map((d, i) => (
              <span key={d} style={{ ...css.pill(i === 1), fontSize: '11px' }}>{d}</span>
            ))}
          </div>
        </div>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '12px' }}>
          {metrics.map((m) => <StatCard key={m.label} {...m} />)}
        </div>
        {/* Chart + top pages */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', gap: '14px', flex: 1 }}>
          <div style={{ ...css.card(), padding: '18px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Traffic Overview</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px' }}>
              {[30,45,38,62,50,75,58,80,65,90,70,85,60,95,72,88,78,92,68,84,73,90,65,88,78,92,70,86,80,95].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i >= 28 ? 'var(--brand)' : `var(--brand)30`, borderRadius: '2px 2px 0 0' }} />
              ))}
            </div>
          </div>
          <div style={{ ...css.card(), padding: '18px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Top Pages</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topPages.map((tp) => (
                <div key={tp.path}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{tp.path}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tp.views}</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: 'var(--neutral-200)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${tp.pct}%`, backgroundColor: 'var(--brand)', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SettingsPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const sections = ['Account', 'Profile', 'Notifications', 'Security', 'Privacy', 'Billing', 'API', 'Integrations']
  return (
    <div style={{ ...css.page(isMobile), display: 'flex', minHeight: '700px' }}>
      <AppSidebar isMobile={isMobile} items={sections} active={0} />
      <main style={{ flex: 1, padding: isMobile ? '16px' : '28px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '520px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{page.name}</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px' }}>Manage your account preferences and settings.</p>

          {/* Avatar section */}
          <div style={{ ...css.card(), padding: '20px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Profile Photo</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#fff', fontWeight: 700 }}>YD</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...css.btnOutline(), padding: '6px 14px', fontSize: '12px' }}>Upload photo</button>
                <button style={{ ...css.btnOutline(), padding: '6px 14px', fontSize: '12px', color: 'var(--error)', borderColor: 'var(--error)30' }}>Remove</button>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div style={{ ...css.card(), padding: '20px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>Personal Information</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputField label="First name" placeholder="Yasser" />
                <InputField label="Last name" placeholder="Dorgham" />
              </div>
              <InputField label="Email address" placeholder="yasser@yourapp.com" />
              <InputField label="Job title" placeholder="Design Architect" />
              <InputField label="Company" placeholder="YourApp" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button style={{ ...css.btnOutline(), padding: '7px 16px', fontSize: '12px' }}>Cancel</button>
              <button style={{ ...css.btnPrimary(), padding: '7px 16px', fontSize: '12px' }}>Save changes</button>
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ ...css.card(), padding: '20px', border: '1px solid var(--error)20' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--error)', marginBottom: '6px' }}>Danger Zone</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Permanently delete your account and all associated data.</p>
            <button style={{ ...css.btnOutline(), padding: '7px 16px', fontSize: '12px', color: 'var(--error)', borderColor: 'var(--error)40' }}>Delete account</button>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProfilePage({ page, isMobile, isTablet }: { page: ArchPage; isMobile: boolean; isTablet: boolean }) {
  const cols = isMobile ? 1 : isTablet ? 2 : 3
  const works = [
    { title: 'Design System v3', tag: 'Design', color: '#3b82f6' },
    { title: 'Analytics Dashboard', tag: 'Product', color: '#10b981' },
    { title: 'Mobile App Redesign', tag: 'Mobile', color: '#8b5cf6' },
    { title: 'E-Commerce Platform', tag: 'Frontend', color: '#f59e0b' },
    { title: 'Brand Identity', tag: 'Branding', color: '#ef4444' },
    { title: 'Motion Library', tag: 'Animation', color: '#06b6d4' },
  ]

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Work', 'About', 'Contact']} cta="Hire me" />
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, var(--brand-subtle) 0%, var(--bg-surface) 50%)`, padding: isMobile ? '40px 16px 32px' : '60px 28px 40px' }}>
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '16px' : '24px', flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '22px' : '28px', color: '#fff', fontWeight: 800, flexShrink: 0 }}>YD</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '4px', letterSpacing: '-0.02em' }}>{page.name}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Design Architect · San Francisco, CA</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button style={{ ...css.btnPrimary(isMobile), padding: '7px 16px', fontSize: '12px' }}>Download CV</button>
              <button style={{ ...css.btnOutline(isMobile), padding: '7px 16px', fontSize: '12px' }}>Get in touch</button>
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
              {[{ n: '8+', l: 'Years exp.' }, { n: '40+', l: 'Projects' }, { n: '12k', l: 'GitHub stars' }].map(({ n, l }) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{n}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Work grid */}
      <section style={css.section(isMobile)}>
        <h2 style={{ ...css.h2(isMobile), marginBottom: '20px' }}>Selected Work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }}>
          {works.map((w) => (
            <div key={w.title} style={{ ...css.card(), overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: '100px', backgroundColor: w.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: w.color + '30', border: `2px solid ${w.color}40` }} />
              </div>
              <div style={{ padding: '14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: w.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{w.tag}</span>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>{w.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer minimal />
    </div>
  )
}

function ProductListPage({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
  const products = [
    { name: 'Minimal Chair', price: '$249', tag: 'Bestseller', color: '#d4a57a' },
    { name: 'Arc Table Lamp', price: '$149', tag: 'New',        color: '#7ab8d4' },
    { name: 'Wool Throw',     price: '$89',  tag: null,         color: '#a8d4a0' },
    { name: 'Ceramic Vase',   price: '$65',  tag: 'Sale',       color: '#d4a0a0' },
    { name: 'Oak Side Table', price: '$320', tag: null,         color: '#c4b07a' },
    { name: 'Linen Cushion',  price: '$45',  tag: 'New',        color: '#b0a0d4' },
  ]
  const cols = isMobile ? 2 : isTablet ? 3 : 3

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Shop', 'Sale', 'New In', 'Brands']} cta="Cart (2)" />
      <section style={css.section(isMobile)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ ...css.h1(isMobile, isTablet), marginBottom: '4px' }}>All Products</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>128 products</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...css.btnOutline(), padding: '7px 12px', fontSize: '12px' }}>Filter</button>
            <button style={{ ...css.btnOutline(), padding: '7px 12px', fontSize: '12px' }}>Sort: Featured</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
          {products.map((p) => (
            <div key={p.name} style={{ cursor: 'pointer' }}>
              <div style={{ height: isMobile ? '130px' : '160px', backgroundColor: p.color + '25', borderRadius: 'var(--radius-lg)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-width) var(--border-style) var(--border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', backgroundColor: p.color + '50' }} />
                {p.tag && (
                  <div style={{ position: 'absolute', top: '8px', left: '8px', ...css.pill(p.tag === 'Sale'), fontSize: '9px', padding: '2px 7px', backgroundColor: p.tag === 'Sale' ? 'var(--error)' : p.tag === 'New' ? 'var(--success)' : 'var(--brand)', color: '#fff' }}>{p.tag}</div>
                )}
              </div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '3px' }}>{p.name}</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand)' }}>{p.price}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}

function ProductDetailPage({ page, isMobile, isTablet }: { page: ArchPage; isMobile: boolean; isTablet: boolean }) {
  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Shop', 'Sale', 'New In', 'Brands']} cta="Cart (2)" />
      <section style={css.section(isMobile)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px' }}>
          {/* Image */}
          <div>
            <div style={{ height: isMobile ? '220px' : '320px', backgroundColor: 'var(--neutral-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-width) var(--border-style) var(--border)', marginBottom: '12px' }}>
              <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--neutral-200)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
              {['var(--neutral-100)','var(--brand-subtle)','var(--neutral-200)','var(--neutral-100)'].map((bg, i) => (
                <div key={i} style={{ height: '56px', backgroundColor: bg, borderRadius: 'var(--radius-md)', border: i === 0 ? '2px solid var(--brand)' : 'var(--border-width) var(--border-style) var(--border)', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={css.pill()}>New Arrival</span>
              <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>● In stock</span>
            </div>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '8px', letterSpacing: '-0.02em' }}>{page.name}</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>$249</span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>$319</span>
              <span style={{ fontSize: '12px', color: 'var(--error)', fontWeight: 600 }}>22% off</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
              Premium quality, thoughtfully designed for modern interiors. Crafted from sustainable materials with a 5-year warranty.
            </p>
            {/* Options */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ ...css.label(), marginBottom: '8px' }}>Color</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['#d4a57a','#7ab8d4','#a8d4a0','#b0a0d4'].map((c, i) => (
                  <div key={c} style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: c, border: i === 0 ? '3px solid var(--brand)' : '2px solid var(--border)', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <p style={css.label()}>Quantity</p>
              <div style={{ display: 'flex', alignItems: 'center', border: 'var(--border-width) var(--border-style) var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {['−','1','+'].map((v, i) => (
                  <button key={i} style={{ width: 36, height: 36, border: 'none', backgroundColor: i === 1 ? 'var(--bg-surface)' : 'var(--panel)', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', borderLeft: i > 0 ? 'var(--border-width) var(--border-style) var(--border)' : 'none' }}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...css.btnPrimary(), flex: 1, padding: '12px' }}>Add to cart</button>
              <button style={{ ...css.btnOutline(), padding: '12px 14px' }}>♡</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function CartPage({ isMobile }: { isMobile: boolean }) {
  const items = [
    { name: 'Minimal Chair',     price: 249, qty: 1, color: '#d4a57a' },
    { name: 'Arc Table Lamp',    price: 149, qty: 2, color: '#7ab8d4' },
    { name: 'Ceramic Vase Set',  price: 65,  qty: 1, color: '#d4a0a0' },
  ]
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Shop', 'Sale', 'New In', 'Brands']} cta="My Account" />
      <section style={css.section(isMobile)}>
        <h1 style={{ ...css.h1(isMobile, false), marginBottom: '24px' }}>Shopping Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: '24px' }}>
          <div>
            {items.map((item, i) => (
              <div key={item.name} style={{ display: 'flex', gap: '14px', padding: '16px 0', borderBottom: 'var(--border-width) var(--border-style) var(--border)' }}>
                <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', backgroundColor: item.color + '25', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-width) var(--border-style) var(--border)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', backgroundColor: item.color + '60' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Color: Natural</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: 'var(--border-width) var(--border-style) var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                      {['−', item.qty.toString(), '+'].map((v, j) => (
                        <button key={j} style={{ width: 28, height: 28, border: 'none', backgroundColor: j === 1 ? 'transparent' : 'var(--neutral-100)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px', borderLeft: j > 0 ? 'var(--border-width) var(--border-style) var(--border)' : 'none' }}>{v}</button>
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>Remove</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}>${item.price * item.qty}</p>
              </div>
            ))}
          </div>
          {/* Summary */}
          <div style={{ ...css.card(), padding: '22px', height: 'fit-content' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Order Summary</p>
            {[['Subtotal', `$${subtotal}`], ['Shipping', 'Free'], ['Tax', `$${Math.round(subtotal * 0.08)}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontSize: '12px', color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: 'var(--border-width) var(--border-style) var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>${subtotal + Math.round(subtotal * 0.08)}</span>
            </div>
            <InputField label="Promo code" placeholder="WELCOME20" />
            <button style={{ ...css.btnOutline(), width: '100%', marginTop: '8px', fontSize: '12px' }}>Apply</button>
            <button style={{ ...css.btnPrimary(), width: '100%', marginTop: '10px', padding: '12px' }}>Proceed to Checkout</button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function CheckoutPage({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={css.page(isMobile)}>
      <nav style={{ ...css.nav(isMobile), justifyContent: 'center' }}>
        <div style={css.logo()}>
          <span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
          YourApp Checkout
        </div>
      </nav>
      <section style={css.section(isMobile)}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: '28px', maxWidth: '860px', margin: '0 auto' }}>
          <div>
            {/* Steps */}
            <div style={{ display: 'flex', gap: '0', marginBottom: '28px' }}>
              {['Contact', 'Shipping', 'Payment', 'Review'].map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: i === 0 ? 'var(--brand)' : i < 0 ? 'var(--success)' : 'var(--neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: i <= 0 ? '#fff' : 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</div>
                    <span style={{ fontSize: '11px', color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--neutral-200)', margin: '0 6px' }} />}
                </div>
              ))}
            </div>
            {/* Form */}
            <div style={{ ...css.card(), padding: '22px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>Contact Information</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <InputField label="First name" placeholder="Yasser" />
                  <InputField label="Last name" placeholder="Dorgham" />
                </div>
                <InputField label="Email" placeholder="yasser@example.com" />
                <InputField label="Phone" placeholder="+1 (555) 000-0000" />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: '20px 0 14px' }}>Shipping Address</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <InputField label="Street address" placeholder="123 Main Street" />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                  <InputField label="City" placeholder="San Francisco" />
                  <InputField label="State" placeholder="CA" />
                  <InputField label="ZIP" placeholder="94105" />
                </div>
              </div>
              <button style={{ ...css.btnPrimary(), width: '100%', marginTop: '20px', padding: '12px' }}>Continue to Shipping →</button>
            </div>
          </div>
          {/* Order summary */}
          <div style={{ ...css.card(), padding: '20px', height: 'fit-content' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>Order (3 items)</p>
            {[['Minimal Chair ×1','$249'],['Arc Table Lamp ×2','$298'],['Ceramic Vase ×1','$65']].map(([n,p]) => (
              <div key={n as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '160px' }}>{n}</span>
                <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 500 }}>{p}</span>
              </div>
            ))}
            <div style={{ borderTop: 'var(--border-width) var(--border-style) var(--border)', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Total</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>$659</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function OrderSuccessPage({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '60px 16px' : '80px 28px', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--success)18', border: `2px solid var(--success)40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '28px', color: 'var(--success)' }}>✓</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '10px', letterSpacing: '-0.02em' }}>Order confirmed!</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '28px' }}>
          Thank you for your purchase. Order #2025-0481 has been confirmed and is being processed.
        </p>
        <div style={{ ...css.card(), padding: '20px', maxWidth: '380px', width: '100%', marginBottom: '24px', textAlign: 'left' }}>
          {[['Order number','#2025-0481'],['Estimated delivery','May 28–30, 2025'],['Shipping to','San Francisco, CA'],['Email sent to','yasser@example.com']].map(([l,v]) => (
            <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: 'var(--border-width) var(--border-style) var(--border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l}</span>
              <span style={{ fontSize: '11px', color: 'var(--text)', fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ ...css.btnPrimary(), padding: '10px 22px' }}>Track order</button>
          <button style={{ ...css.btnOutline(), padding: '10px 22px' }}>Continue shopping</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function OnboardingPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const steps = ['Welcome', 'Features', 'Permissions', 'Get Started']
  const activeStep = page.name.toLowerCase().includes('feature') ? 1 : page.name.toLowerCase().includes('permission') ? 2 : 0
  const stepContent = [
    { icon: '◈', title: 'Welcome to YourApp', desc: 'The smarter way to build and ship world-class products — faster than ever before.', action: 'Get started →' },
    { icon: '✦', title: 'Everything you need', desc: 'Design tokens, component libraries, architecture planning, and live preview — all in one place.', action: 'Next: Permissions →' },
    { icon: '○', title: 'Allow notifications', desc: 'Stay on top of project updates, team activity, and deadline reminders in real time.', action: 'Allow & Continue →' },
  ]
  const content = stepContent[Math.min(activeStep, stepContent.length - 1)]

  return (
    <div style={{ ...css.page(isMobile), display: 'flex', flexDirection: 'column', minHeight: '600px', backgroundColor: 'var(--brand)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px 20px' : '60px 40px', textAlign: 'center' }}>
        {/* Step dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '40px' }}>
          {steps.slice(0, -1).map((_, i) => (
            <div key={i} style={{ width: i === activeStep ? 24 : 6, height: 6, borderRadius: 'var(--radius-full)', backgroundColor: i === activeStep ? '#fff' : 'rgba(255,255,255,0.3)', transition: '0.3s' }} />
          ))}
        </div>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>{content.icon}</div>
        <h1 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginBottom: '12px', letterSpacing: '-0.02em' }}>{content.title}</h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', maxWidth: '360px', lineHeight: 1.65, marginBottom: '36px' }}>{content.desc}</p>
        <button style={{ ...css.btnPrimary(), backgroundColor: '#fff', color: 'var(--brand)', padding: '12px 28px', fontSize: '14px', marginBottom: '16px' }}>{content.action}</button>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Skip for now</span>
      </div>
    </div>
  )
}

function ErrorPage({ isMobile }: { isMobile: boolean }) {
  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '60px 16px' : '80px 28px', textAlign: 'center' }}>
        <p style={{ fontSize: '80px', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--neutral-200)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '16px' }}>404</p>
        <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>Page not found</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '380px', lineHeight: 1.6, marginBottom: '28px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ ...css.btnPrimary(), padding: '10px 20px' }}>← Go home</button>
          <button style={{ ...css.btnOutline(), padding: '10px 20px' }}>Contact support</button>
        </div>
        {/* Suggested links */}
        <div style={{ marginTop: '40px', textAlign: 'left', width: '100%', maxWidth: '340px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Helpful links</p>
          {['Documentation', 'API Reference', 'Community Forum', 'Status Page'].map((l) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: 'var(--border-width) var(--border-style) var(--border)' }}>
              <span style={{ fontSize: '13px', color: 'var(--brand)', cursor: 'pointer' }}>{l}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>→</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

function ContactPage({ page, isMobile, isTablet }: { page: ArchPage; isMobile: boolean; isTablet: boolean }) {
  const pageName = page.name || 'Contact'
  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Home', 'About', 'Work', 'Blog']} cta="Book a call" />
      <section style={{ ...css.section(isMobile), maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--brand-subtle)', borderRadius: 'var(--radius-full)', padding: '4px 12px', marginBottom: '14px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand)' }}>Available for projects</span>
          </div>
          <h1 style={css.h1(isMobile, isTablet)}>Let&apos;s work together</h1>
          <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
            Have a project in mind or just want to say hello? Fill in the form and I&apos;ll get back within 24 hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 360px', gap: isMobile ? '28px' : '40px' }}>
          {/* Form */}
          <div style={{ ...css.card(), padding: isMobile ? '20px' : '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <InputField label="First name" placeholder="Yasser" />
                <InputField label="Last name" placeholder="Dorgham" />
              </div>
              <InputField label="Email address" placeholder="yasser@example.com" />
              <InputField label="Company (optional)" placeholder="Acme Corp" />
              {/* Subject select */}
              <div>
                <p style={css.label()}>Subject</p>
                <div style={{ ...css.input(), paddingRight: '8px', justifyContent: 'space-between' }}>
                  <span>New project</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>▾</span>
                </div>
              </div>
              {/* Message textarea */}
              <div>
                <p style={css.label()}>Message</p>
                <div style={{ backgroundColor: 'var(--bg-surface)', border: 'var(--border-width) var(--border-style) var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', height: '100px', fontSize: '13px', color: 'var(--text-disabled)' }}>
                  Tell me about your project…
                </div>
              </div>
              {/* Budget row */}
              <div>
                <p style={css.label()}>Budget range</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['< $5k', '$5–20k', '$20–50k', '$50k+'].map((b, i) => (
                    <div key={b} style={{ textAlign: 'center', padding: '7px 4px', borderRadius: 'var(--radius-md)', border: 'var(--border-width) var(--border-style) var(--border)', fontSize: '11px', fontWeight: i === 1 ? 600 : 400, backgroundColor: i === 1 ? 'var(--brand-subtle)' : 'transparent', color: i === 1 ? 'var(--brand)' : 'var(--text-muted)', cursor: 'pointer' }}>{b}</div>
                  ))}
                </div>
              </div>
              <button style={{ ...css.btnPrimary(), width: '100%', padding: '13px', justifyContent: 'center' }}>
                Send message →
              </button>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                By submitting you agree to our privacy policy.
              </p>
            </div>
          </div>

          {/* Contact info sidebar */}
          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Info card */}
              <div style={{ ...css.card(), padding: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>Contact info</p>
                {[
                  { icon: '✉', label: 'Email', value: 'hello@yourapp.io' },
                  { icon: '📍', label: 'Location', value: 'San Francisco, CA' },
                  { icon: '🕐', label: 'Response time', value: 'Within 24 hours' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
                      {row.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{row.label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div style={{ ...css.card(), padding: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Connect</p>
                {['Twitter / X', 'LinkedIn', 'GitHub', 'Dribbble'].map((soc, i) => (
                  <div key={soc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < 3 ? 'var(--border-width) var(--border-style) var(--border)' : 'none' }}>
                    <span style={{ fontSize: '13px', color: 'var(--brand)', cursor: 'pointer' }}>{soc}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>→</span>
                  </div>
                ))}
              </div>

              {/* Availability badge */}
              <div style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--success)', padding: '16px 20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Taking on work Q3 2025</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Limited slots available. Book early.</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

// ─── TeamPage ─────────────────────────────────────────────────────────────────

function TeamPage({ isMobile }: { isMobile: boolean }) {
  const members = [
    { name: 'Yasser Dorgham',   role: 'Lead Designer',     dept: 'Design',     status: 'Active',  color: '#c2410c' },
    { name: 'Alex Rivera',       role: 'Frontend Engineer',  dept: 'Engineering',status: 'Active',  color: '#7c3aed' },
    { name: 'Priya Nair',        role: 'Product Manager',    dept: 'Product',    status: 'Active',  color: '#0891b2' },
    { name: 'Jordan Kim',        role: 'Backend Engineer',   dept: 'Engineering',status: 'Away',    color: '#059669' },
    { name: 'Sam Okafor',        role: 'UX Researcher',      dept: 'Design',     status: 'Active',  color: '#d97706' },
    { name: 'Dana Meza',         role: 'DevOps Engineer',    dept: 'Engineering',status: 'Offline', color: '#64748b' },
  ]
  const statusColor = { Active: '#10b981', Away: '#f59e0b', Offline: '#94a3b8' }
  const depts = ['All', 'Design', 'Engineering', 'Product']

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Overview', 'Team', 'Projects', 'Settings']} cta="Invite" />
      <div style={{ display: 'flex', minHeight: 'calc(100% - 52px)' }}>
        {!isMobile && <AppSidebar isMobile={false} items={['Overview', 'Projects', 'Team', 'Billing', 'Settings']} active={2} />}
        <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '28px', overflowY: 'auto' }}>
          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '4px' }}>Team</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{members.length} members across {depts.length - 1} departments</p>
            </div>
            <button style={{ ...css.btnPrimary(), fontSize: '12px', padding: '8px 16px' }}>+ Invite member</button>
          </div>

          {/* Dept filter tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: 'var(--border-width) var(--border-style) var(--border)', paddingBottom: '0' }}>
            {depts.map((d, i) => (
              <button key={d} style={{ padding: '6px 14px', fontSize: '12px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', background: 'none', border: 'none', borderBottom: i === 0 ? '2px solid var(--brand)' : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px' }}>
                {d} {i > 0 && <span style={{ fontSize: '10px', opacity: 0.7 }}>{members.filter(m => m.dept === d).length}</span>}
              </button>
            ))}
          </div>

          {/* Search + view toggle */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1, ...css.input(), maxWidth: '280px' }}>
              <span style={{ fontSize: '11px' }}>🔍 Search members…</span>
            </div>
            <div style={{ display: 'flex', gap: '2px', borderRadius: 'var(--radius-md)', border: 'var(--border-width) var(--border-style) var(--border)', overflow: 'hidden' }}>
              {['Grid', 'List'].map((v, i) => (
                <button key={v} style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: i === 0 ? 'var(--brand-subtle)' : 'transparent', color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>{v}</button>
              ))}
            </div>
          </div>

          {/* Member grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
            {members.map((m) => (
              <div key={m.name} style={{ ...css.card(), padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                    {m.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2, marginBottom: '2px' }}>{m.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.role}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--brand)', backgroundColor: 'var(--brand-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{m.dept}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor[m.status as keyof typeof statusColor] }} />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.status}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{ ...css.btnOutline(), flex: 1, fontSize: '11px', padding: '5px 8px', justifyContent: 'center' }}>Message</button>
                  <button style={{ ...css.btnOutline(), flex: 1, fontSize: '11px', padding: '5px 8px', justifyContent: 'center' }}>Profile</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── FeaturesPage ─────────────────────────────────────────────────────────────

function FeaturesPage({ page, isMobile, isTablet }: { page: ArchPage; isMobile: boolean; isTablet: boolean }) {
  const features = [
    { title: 'Lightning Fast', body: 'Sub-100ms response times worldwide with global edge delivery. Your users experience near-instant interactions regardless of location.', accent: 'var(--brand)' },
    { title: 'Built-in Analytics', body: 'Real-time dashboards, funnel analysis, and retention cohorts. Understand your users deeply without switching tools.', accent: 'var(--accent)' },
    { title: 'Team Collaboration', body: 'Live presence indicators, shared workspaces, and granular permissions. Keep everyone aligned at any scale.', accent: 'var(--success)' },
    { title: 'Enterprise Security', body: 'SOC 2 Type II certified, end-to-end encryption, and SSO/SAML support. Your data is always protected.', accent: 'var(--warning)' },
  ]
  const accentShapes = ['var(--brand)', 'var(--accent)', 'var(--success)', 'var(--error)']

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Features', 'Pricing', 'Docs', 'Blog']} cta="Start free" />

      {/* Hero */}
      <section style={{ ...css.section(isMobile), textAlign: 'center', paddingBottom: isMobile ? '32px' : '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--brand-subtle)', borderRadius: 'var(--radius-full)', padding: '4px 14px', marginBottom: '16px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--brand)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--brand)' }}>Everything you need to ship faster</span>
        </div>
        <h1 style={{ ...css.h1(isMobile, isTablet), maxWidth: '560px', margin: '0 auto 16px' }}>
          Powerful features for<br />modern teams
        </h1>
        <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.7 }}>
          Everything your team needs to design, build, and ship great products — all in one place.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ ...css.btnPrimary(), padding: '11px 24px' }}>Start for free →</button>
          <button style={{ ...css.btnOutline(), padding: '11px 24px' }}>Watch demo</button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: isMobile ? '16px' : '40px', justifyContent: 'center', marginTop: '44px', flexWrap: 'wrap' }}>
          {[['10k+', 'Active users'], ['99.9%', 'Uptime SLA'], ['< 50ms', 'Avg latency'], ['SOC 2', 'Certified']].map(([stat, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--brand)', letterSpacing: '-0.02em' }}>{stat}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature sections — alternating layout */}
      {features.map((feat, i) => (
        <section
          key={feat.title}
          style={{
            ...css.section(isMobile),
            backgroundColor: i % 2 === 1 ? 'var(--panel)' : 'transparent',
            borderTop: 'var(--border-width) var(--border-style) var(--border)',
            borderBottom: 'var(--border-width) var(--border-style) var(--border)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '24px' : '48px', alignItems: 'center', maxWidth: '860px', margin: '0 auto', direction: (i % 2 === 1 && !isMobile) ? 'rtl' : 'ltr' }}>
            <div style={{ direction: 'ltr' }}>
              <div style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-lg)', backgroundColor: feat.accent + '20', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {/* Inline SVG icon */}
                <svg viewBox="0 0 20 20" width={20} height={20} fill="none" style={{ color: feat.accent }}>
                  {i === 0 && <path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5M2 9l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                  {i === 1 && <path d="M2 10h4M14 10h4M10 2v4M10 14v4M5.05 5.05l2.83 2.83M12.12 12.12l2.83 2.83M5.05 14.95l2.83-2.83M12.12 7.88l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
                  {i === 2 && <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                  {i === 3 && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
                </svg>
              </div>
              <h2 style={{ ...css.h2(isMobile), marginBottom: '12px' }}>{feat.title}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>{feat.body}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ ...css.btnPrimary(), fontSize: '12px', padding: '7px 16px' }}>Learn more →</button>
                <button style={{ ...css.btnOutline(), fontSize: '12px', padding: '7px 16px' }}>See demo</button>
              </div>
            </div>
            {/* Visual mockup */}
            <div style={{ direction: 'ltr', borderRadius: 'var(--radius-lg)', border: 'var(--border-width) var(--border-style) var(--border)', backgroundColor: 'var(--panel)', padding: '20px', minHeight: isMobile ? '120px' : '160px', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />)}
              </div>
              {[...Array(3)].map((_, j) => (
                <div key={j} style={{ height: j === 0 ? '10px' : '7px', borderRadius: 'var(--radius-full)', backgroundColor: j === 0 ? feat.accent + '40' : 'var(--border)', width: ['80%','60%','70%'][j] }} />
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                {[...Array(4)].map((_, j) => <div key={j} style={{ height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: 'var(--border-width) var(--border-style) var(--border)' }} />)}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ ...css.section(isMobile), textAlign: 'center', backgroundColor: 'var(--brand)', color: '#fff' }}>
        <h2 style={{ fontSize: isMobile ? '22px' : '30px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '10px' }}>Ready to get started?</h2>
        <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '24px' }}>Join 10,000+ teams building with {page.name || 'YourApp'}.</p>
        <button style={{ padding: '12px 28px', backgroundColor: '#fff', color: 'var(--brand)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          Start free today →
        </button>
      </section>
      <Footer />
    </div>
  )
}

// ─── DocsPage ─────────────────────────────────────────────────────────────────

function DocsPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const chapters = ['Getting Started', 'Core Concepts', 'API Reference', 'Components', 'Guides', 'Migration']
  const sections = ['Introduction', 'Installation', 'Quick Start', 'Configuration', 'Authentication']
  const codeSnippet = `npm install @yourapp/sdk\n\nimport { YourApp } from '@yourapp/sdk'\n\nconst client = new YourApp({\n  apiKey: process.env.API_KEY,\n})`

  return (
    <div style={css.page(isMobile)}>
      {/* Docs topbar */}
      <nav style={{ ...css.nav(isMobile), backgroundColor: 'var(--panel)', borderBottom: 'var(--border-width) var(--border-style) var(--border)' }}>
        <div style={css.logo()}>
          <span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
          {isMobile ? 'Docs' : 'YourApp Docs'}
        </div>
        {!isMobile && (
          <div style={{ flex: 1, maxWidth: '280px', margin: '0 24px' }}>
            <div style={{ ...css.input(), fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>⌘K</span>
              <span>Search docs…</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {!isMobile && ['v2.4', 'GitHub', 'Community'].map(l => (
            <span key={l} style={css.navLink()}>{l}</span>
          ))}
          <button style={{ ...css.btnPrimary(isMobile), fontSize: '12px', padding: '6px 14px' }}>Get API Key</button>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100% - 52px)' }}>
        {/* Left TOC sidebar */}
        {!isMobile && (
          <aside style={{ width: '220px', flexShrink: 0, backgroundColor: 'var(--panel)', borderRight: 'var(--border-width) var(--border-style) var(--border)', padding: '20px 0', overflowY: 'auto' }}>
            {/* Version badge */}
            <div style={{ margin: '0 16px 16px', padding: '6px 10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-subtle)', border: 'var(--border-width) var(--border-style) var(--border)' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '1px' }}>Version</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand)' }}>v2.4.0 — Latest</p>
            </div>
            {chapters.map((ch, ci) => (
              <div key={ch} style={{ marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{ch}</span>
                </div>
                {ci === 0 && sections.map((s, si) => (
                  <div key={s} style={{ padding: '4px 16px 4px 28px', cursor: 'pointer', backgroundColor: si === 2 ? 'var(--brand-subtle)' : 'transparent', borderLeft: si === 2 ? '2px solid var(--brand)' : '2px solid transparent', marginLeft: '0' }}>
                    <span style={{ fontSize: '12px', color: si === 2 ? 'var(--brand)' : 'var(--text-muted)', fontWeight: si === 2 ? 600 : 400 }}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </aside>
        )}

        {/* Main content */}
        <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '32px 40px', maxWidth: '760px', lineHeight: 1.7 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '20px' }}>
            {['Docs', 'Getting Started', 'Quick Start'].map((seg, i) => (
              <span key={seg} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>/</span>}
                <span style={{ fontSize: '11px', color: i === 2 ? 'var(--text)' : 'var(--brand)', cursor: i < 2 ? 'pointer' : 'default' }}>{seg}</span>
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            {page.name || 'Quick Start'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
            Get up and running with {page.name || 'YourApp'} in under five minutes.
          </p>

          {/* Callout */}
          <div style={{ borderRadius: 'var(--radius-md)', border: 'var(--border-width) var(--border-style) var(--brand)', backgroundColor: 'var(--brand-subtle)', padding: '14px 16px', marginBottom: '24px', display: 'flex', gap: '10px' }}>
            <svg viewBox="0 0 16 16" width={16} height={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--brand)' }}>
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 010 1.5.75.75 0 010-1.5zm0 3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 7.5z" fill="currentColor"/>
            </svg>
            <p style={{ fontSize: '13px', color: 'var(--brand)', lineHeight: 1.6 }}>
              <strong>Prerequisites:</strong> Node.js ≥ 18.x and an active YourApp account.
            </p>
          </div>

          {/* Step 1 */}
          <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '10px', marginTop: '28px' }}>1. Install the SDK</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Install via npm, yarn, or pnpm:</p>

          {/* Code block */}
          <div style={{ borderRadius: 'var(--radius-md)', backgroundColor: '#0f1117', padding: '16px 20px', marginBottom: '24px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>Terminal</span>
              <span style={{ fontSize: '10px', color: 'var(--brand)', cursor: 'pointer' }}>Copy</span>
            </div>
            {codeSnippet.split('\n').map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.8' }}>
                <span style={{ color: '#475569', minWidth: '16px', textAlign: 'right', userSelect: 'none' }}>{i > 0 ? i : ''}</span>
                <span style={{ color: line.startsWith('import') || line.startsWith('const') ? '#7dd3fc' : line.startsWith('npm') ? '#86efac' : line.startsWith('  ') ? '#fda4af' : '#e2e8f0' }}>
                  {line || ' '}
                </span>
              </div>
            ))}
          </div>

          {/* Step 2 */}
          <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '10px' }}>2. Configure your environment</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.7 }}>
            Add your API key to your environment variables. Never commit secrets to source control — use a <span style={{ color: 'var(--brand)', cursor: 'pointer' }}>.env file</span> or your platform&apos;s secret manager.
          </p>

          {/* Nav between articles */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '40px', paddingTop: '24px', borderTop: 'var(--border-width) var(--border-style) var(--border)' }}>
            <div style={{ ...css.card(), flex: 1, padding: '14px', cursor: 'pointer' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>← Previous</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand)' }}>Installation</p>
            </div>
            <div style={{ ...css.card(), flex: 1, padding: '14px', cursor: 'pointer', textAlign: 'right' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Next →</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand)' }}>Configuration</p>
            </div>
          </div>
        </main>

        {/* Right on-this-page sidebar */}
        {!isMobile && (
          <aside style={{ width: '200px', flexShrink: 0, padding: '32px 20px', borderLeft: 'var(--border-width) var(--border-style) var(--border)' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>On this page</p>
            {['Install the SDK', 'Configure env', 'First request', 'Next steps'].map((h, i) => (
              <div key={h} style={{ padding: '5px 0', borderLeft: i === 0 ? '2px solid var(--brand)' : '2px solid transparent', paddingLeft: '10px', marginLeft: '-10px', cursor: 'pointer' }}>
                <span style={{ fontSize: '12px', color: i === 0 ? 'var(--brand)' : 'var(--text-muted)' }}>{h}</span>
              </div>
            ))}
          </aside>
        )}
      </div>
    </div>
  )
}

// ─── ApiExplorerPage ──────────────────────────────────────────────────────────

function ApiExplorerPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const endpoints = [
    { method: 'GET',    path: '/v1/users',           desc: 'List all users',           tag: 'Users' },
    { method: 'POST',   path: '/v1/users',            desc: 'Create a user',            tag: 'Users' },
    { method: 'GET',    path: '/v1/users/{id}',       desc: 'Retrieve a user',          tag: 'Users' },
    { method: 'PATCH',  path: '/v1/users/{id}',       desc: 'Update a user',            tag: 'Users' },
    { method: 'DELETE', path: '/v1/users/{id}',       desc: 'Delete a user',            tag: 'Users' },
    { method: 'GET',    path: '/v1/projects',         desc: 'List projects',            tag: 'Projects' },
    { method: 'POST',   path: '/v1/projects',         desc: 'Create a project',         tag: 'Projects' },
  ]
  const methodColor = { GET: '#10b981', POST: '#3b82f6', PATCH: '#f59e0b', DELETE: '#ef4444', PUT: '#8b5cf6' }
  const methodBg    = { GET: '#d1fae5', POST: '#dbeafe', PATCH: '#fef3c7', DELETE: '#fee2e2', PUT: '#ede9fe' }

  return (
    <div style={css.page(isMobile)}>
      <nav style={{ ...css.nav(isMobile) }}>
        <div style={css.logo()}>
          <span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />
          {isMobile ? 'API' : 'API Reference'}
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: '6px', padding: '3px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface)', border: 'var(--border-width) var(--border-style) var(--border)' }}>
            {['v2.4', 'v2.3', 'v2.0'].map((v, i) => (
              <button key={v} style={{ padding: '4px 10px', borderRadius: 'var(--radius-md)', fontSize: '11px', backgroundColor: i === 0 ? 'var(--panel)' : 'transparent', color: i === 0 ? 'var(--text)' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>{v}</button>
            ))}
          </div>
        )}
        <button style={{ ...css.btnPrimary(isMobile), fontSize: '12px', padding: '6px 14px' }}>Get API Key</button>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100% - 52px)' }}>
        {/* Left endpoint list */}
        {!isMobile && (
          <aside style={{ width: '240px', flexShrink: 0, backgroundColor: 'var(--panel)', borderRight: 'var(--border-width) var(--border-style) var(--border)', padding: '16px 0', overflowY: 'auto' }}>
            {/* Auth header */}
            <div style={{ padding: '0 16px 12px', borderBottom: 'var(--border-width) var(--border-style) var(--border)', marginBottom: '12px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Authentication</p>
              <div style={{ ...css.input(), fontSize: '11px', backgroundColor: 'var(--bg-surface)' }}>sk-…••••••••</div>
            </div>
            {['Users', 'Projects', 'Teams', 'Webhooks', 'Events'].map((group, gi) => (
              <div key={group} style={{ marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', cursor: 'pointer' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: gi === 0 ? 'var(--text)' : 'var(--text-muted)' }}>{group}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{gi === 0 ? '5' : gi === 1 ? '4' : '3'}</span>
                </div>
                {gi === 0 && endpoints.slice(0, 5).map((ep, ei) => (
                  <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 16px 4px 28px', cursor: 'pointer', backgroundColor: ei === 0 ? 'var(--brand-subtle)' : 'transparent' }}>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: methodColor[ep.method as keyof typeof methodColor], backgroundColor: methodBg[ep.method as keyof typeof methodBg], padding: '1px 4px', borderRadius: '3px', minWidth: '34px', textAlign: 'center' }}>{ep.method}</span>
                    <span style={{ fontSize: '10px', color: ei === 0 ? 'var(--brand)' : 'var(--text-muted)', fontFamily: 'monospace' }}>/users{ep.path.replace('/v1/users', '')}</span>
                  </div>
                ))}
              </div>
            ))}
          </aside>
        )}

        {/* Main detail pane */}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '28px 32px', overflowY: 'auto' }}>
          {/* Endpoint header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: methodColor['GET'], backgroundColor: methodBg['GET'], padding: '4px 10px', borderRadius: 'var(--radius-md)' }}>GET</span>
            <code style={{ fontSize: '14px', fontFamily: 'monospace', color: 'var(--text)', backgroundColor: 'var(--panel)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: 'var(--border-width) var(--border-style) var(--border)' }}>/v1/users</code>
            <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--success)' }} /> 200 OK
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
            Returns a paginated list of all users in your account. Results are sorted by creation date, newest first.
          </p>

          {/* Parameters table */}
          <div style={{ ...css.card(), overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ padding: '12px 16px', borderBottom: 'var(--border-width) var(--border-style) var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>Query Parameters</p>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>4 params</span>
            </div>
            {[
              { name: 'limit',   type: 'integer', req: false, desc: 'Max results to return. Default: 20, max: 100.' },
              { name: 'offset',  type: 'integer', req: false, desc: 'Number of results to skip for pagination.' },
              { name: 'email',   type: 'string',  req: false, desc: 'Filter users by email address.' },
              { name: 'status',  type: 'enum',    req: false, desc: 'Filter by status: active, inactive, pending.' },
            ].map((param, i) => (
              <div key={param.name} style={{ display: 'grid', gridTemplateColumns: '120px 70px 1fr', gap: '12px', padding: '10px 16px', borderBottom: i < 3 ? 'var(--border-width) var(--border-style) var(--border)' : 'none', alignItems: 'start' }}>
                <code style={{ fontSize: '12px', color: 'var(--brand)', fontFamily: 'monospace' }}>{param.name}</code>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 'var(--radius-full)', alignSelf: 'start' }}>{param.type}</span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{param.desc}</p>
              </div>
            ))}
          </div>

          {/* Response example */}
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>Response</p>
          <div style={{ borderRadius: 'var(--radius-md)', backgroundColor: '#0f1117', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'monospace' }}>200 OK</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>application/json</span>
            </div>
            {[
              '{ "data": [',
              '  { "id": "usr_01HXYZ...",',
              '    "email": "alex@example.com",',
              '    "name": "Alex Rivera",',
              '    "created_at": "2025-01-15T10:30:00Z" }',
              '], "meta": { "total": 142, "offset": 0 } }',
            ].map((line, i) => (
              <div key={i} style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.7', color: i === 0 || i === 5 ? '#94a3b8' : i === 1 || i === 2 || i === 3 || i === 4 ? '#7dd3fc' : '#e2e8f0' }}>
                {line}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── MediaLibraryPage ─────────────────────────────────────────────────────────

function MediaLibraryPage({ page, isMobile }: { page: ArchPage; isMobile: boolean }) {
  const files = [
    { name: 'hero-banner.png',    size: '2.4 MB',  type: 'image',    color: '#3b82f6', w: 1920, h: 1080 },
    { name: 'logo-mark.svg',      size: '48 KB',   type: 'vector',   color: '#8b5cf6', w: 200,  h: 200 },
    { name: 'product-demo.mp4',   size: '18.2 MB', type: 'video',    color: '#ef4444', w: 1280, h: 720 },
    { name: 'brand-kit.zip',      size: '4.8 MB',  type: 'archive',  color: '#f59e0b', w: null, h: null },
    { name: 'team-photo.jpg',     size: '1.1 MB',  type: 'image',    color: '#10b981', w: 1200, h: 800 },
    { name: 'pitch-deck.pdf',     size: '3.3 MB',  type: 'doc',      color: '#ef4444', w: null, h: null },
  ]

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Content', 'Pages', 'Media', 'Users', 'Settings']} cta="Upload" />
      <div style={{ display: 'flex', minHeight: 'calc(100% - 52px)' }}>
        {!isMobile && <AppSidebar isMobile={false} items={['Content', 'Pages', 'Media', 'Users', 'Settings']} active={2} />}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '3px' }}>Media Library</h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>23 files · 48.6 MB used</p>
            </div>
            <button style={{ ...css.btnPrimary(), fontSize: '12px', padding: '8px 16px' }}>↑ Upload files</button>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ ...css.input(), flex: 1, maxWidth: '240px' }}>
              <span style={{ fontSize: '11px' }}>🔍 Search files…</span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['All', 'Images', 'Videos', 'Docs'].map((f, i) => (
                <button key={f} style={{ ...css.pill(i === 0), fontSize: '11px' }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Upload drop zone */}
          <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', marginBottom: '20px', backgroundColor: 'var(--panel)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width={28} height={28} fill="none" style={{ color: 'var(--text-muted)' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>Drop files to upload</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>or <span style={{ color: 'var(--brand)', cursor: 'pointer' }}>browse files</span> · max 50 MB per file</p>
            </div>
          </div>

          {/* File grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {files.map((f) => (
              <div key={f.name} style={{ ...css.card(), overflow: 'hidden', cursor: 'pointer' }}>
                {/* Preview area */}
                <div style={{ height: '100px', backgroundColor: f.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: 'var(--border-width) var(--border-style) var(--border)', position: 'relative' }}>
                  {f.type === 'image' && (
                    <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${f.color}30 0%, ${f.color}10 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" style={{ color: f.color }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {f.type !== 'image' && (
                    <span style={{ fontSize: '28px' }}>{ f.type === 'video' ? '▶' : f.type === 'vector' ? '◇' : f.type === 'archive' ? '⬛' : '📄' }</span>
                  )}
                  <div style={{ position: 'absolute', top: '6px', right: '6px', width: '18px', height: '18px', borderRadius: '4px', backgroundColor: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>{f.type.slice(0,1).toUpperCase()}</span>
                  </div>
                </div>
                {/* File info */}
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{f.size}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── NotificationsPage ────────────────────────────────────────────────────────

function NotificationsPage({ isMobile }: { isMobile: boolean }) {
  const notifs = [
    { icon: '🔔', title: 'Alex Rivera mentioned you', body: 'in "Q4 Design Review" — @you can you review the new icon set?', time: '2m ago', read: false, color: '#3b82f6' },
    { icon: '✅', title: 'Task completed',              body: '"Update onboarding flow" was marked as done by Priya Nair.', time: '15m ago', read: false, color: '#10b981' },
    { icon: '💬', title: 'New comment on your project', body: 'Jordan Kim left feedback on "Mobile App Redesign".', time: '1h ago', read: false, color: '#8b5cf6' },
    { icon: '🚀', title: 'Deployment successful',       body: 'Production deploy v2.4.1 completed with 0 errors.', time: '2h ago', read: true, color: '#059669' },
    { icon: '⚠️', title: 'Usage limit warning',        body: 'You have used 80% of your monthly API quota (8,000 / 10,000).', time: '3h ago', read: true, color: '#f59e0b' },
    { icon: '👤', title: 'New team member joined',      body: 'Dana Meza joined your workspace. Send them a welcome message.', time: '1d ago', read: true, color: '#64748b' },
  ]
  const unreadCount = notifs.filter(n => !n.read).length

  return (
    <div style={css.page(isMobile)}>
      <NavBar isMobile={isMobile} links={['Overview', 'Projects', 'Team', 'Settings']} cta="Settings" />
      <div style={{ display: 'flex', minHeight: 'calc(100% - 52px)' }}>
        {!isMobile && <AppSidebar isMobile={false} items={['Overview', 'Projects', 'Team', 'Notifications', 'Settings']} active={3} />}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '28px', maxWidth: '700px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.015em' }}>Notifications</h1>
              {unreadCount > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', backgroundColor: 'var(--brand)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>{unreadCount} new</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...css.btnOutline(), fontSize: '11px', padding: '5px 12px' }}>Mark all read</button>
              <button style={{ ...css.btnOutline(), fontSize: '11px', padding: '5px 12px' }}>Settings</button>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: 'var(--border-width) var(--border-style) var(--border)', marginBottom: '16px' }}>
            {['All', 'Unread', 'Mentions', 'Tasks'].map((tab, i) => (
              <button key={tab} style={{ padding: '7px 16px', fontSize: '12px', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', background: 'none', border: 'none', borderBottom: i === 0 ? '2px solid var(--brand)' : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px' }}>{tab}</button>
            ))}
          </div>

          {/* Notification list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {notifs.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 16px', borderRadius: 'var(--radius-md)', backgroundColor: n.read ? 'transparent' : 'var(--brand-subtle)', border: n.read ? 'none' : 'var(--border-width) var(--border-style) var(--brand)', cursor: 'pointer', transition: 'background 150ms' }}>
                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: n.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                  {n.icon}
                </div>
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                    <p style={{ fontSize: '13px', fontWeight: n.read ? 400 : 600, color: 'var(--text)', lineHeight: 1.3 }}>{n.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.time}</span>
                      {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--brand)' }} />}
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Master dispatcher ─────────────────────────────────────────────────────────

export function PageRenderer({ page, tokens, device }: { page: ArchPage; tokens: DesignTokens; device: PreviewDevice }) {
  const vars           = useMemo(() => buildVars(tokens), [tokens])
  const previewOverride = useHub((s) => s.theme.previewOverride)
  const overrideVars   = useMemo(
    () => previewOverride ? buildOverrideVars(previewOverride) : {},
    [previewOverride],
  )
  const isMobile = device === 'mobile'
  const isTablet  = device === 'tablet'
  const template  = detectTemplate(page)

  // Override vars come LAST so applied theme colors win over token defaults
  const wrapStyle: React.CSSProperties = { ...vars, ...overrideVars, minHeight: '100%' }

  const content = (() => {
    switch (template) {
      case 'pricing':        return <PricingPage isMobile={isMobile} isTablet={isTablet} />
      case 'blog-list':      return <BlogListPage isMobile={isMobile} isTablet={isTablet} />
      case 'article':        return <ArticlePage page={page} isMobile={isMobile} />
      case 'contact':        return <ContactPage page={page} isMobile={isMobile} isTablet={isTablet} />
      case 'auth-login':
      case 'auth-signup':
      case 'auth-forgot':    return <AuthPage page={page} isMobile={isMobile} />
      case 'analytics':      return <AnalyticsPage page={page} isMobile={isMobile} />
      case 'settings':       return <SettingsPage page={page} isMobile={isMobile} />
      case 'profile':        return <ProfilePage page={page} isMobile={isMobile} isTablet={isTablet} />
      case 'product-list':   return <ProductListPage isMobile={isMobile} isTablet={isTablet} />
      case 'product-detail': return <ProductDetailPage page={page} isMobile={isMobile} isTablet={isTablet} />
      case 'cart':           return <CartPage isMobile={isMobile} />
      case 'checkout':       return <CheckoutPage isMobile={isMobile} />
      case 'order-success':  return <OrderSuccessPage isMobile={isMobile} />
      case 'onboarding':     return <OnboardingPage page={page} isMobile={isMobile} />
      case 'error-404':      return <ErrorPage isMobile={isMobile} />
      case 'dashboard':      return <DashboardPage page={page} isMobile={isMobile} />
      case 'team':           return <TeamPage isMobile={isMobile} />
      case 'features':       return <FeaturesPage page={page} isMobile={isMobile} isTablet={isTablet} />
      case 'docs':           return <DocsPage page={page} isMobile={isMobile} />
      case 'api-explorer':   return <ApiExplorerPage page={page} isMobile={isMobile} />
      case 'media-library':  return <MediaLibraryPage page={page} isMobile={isMobile} />
      case 'notifications':  return <NotificationsPage isMobile={isMobile} />
      default:               return <MarketingPage page={page} isMobile={isMobile} isTablet={isTablet} />
    }
  })()

  return <div style={wrapStyle}>{content}</div>
}

// ─── Device frame ─────────────────────────────────────────────────────────────

export function DeviceFrame({ device, page }: Props) {
  const tokens          = useHub((s) => s.design.tokens)
  const previewOverride = useHub((s) => s.theme.previewOverride)
  // Resolve live surface/panel colors respecting any active theme override
  const bgColor  = previewOverride ? previewOverride[previewOverride.mode]?.background  ?? tokens.colors.surface.bg    : tokens.colors.surface.bg
  const panelColor = previewOverride ? previewOverride[previewOverride.mode]?.card ?? tokens.colors.surface.panel : tokens.colors.surface.panel
  const textSecondary = previewOverride ? previewOverride[previewOverride.mode]?.['muted-foreground'] ?? tokens.colors.text.secondary : tokens.colors.text.secondary
  const textMuted = previewOverride ? previewOverride[previewOverride.mode]?.['muted-foreground'] ?? tokens.colors.text.muted : tokens.colors.text.muted
  const { width, label } = DEVICE_SIZES[device]
  const displayW = DISPLAY_WIDTHS[device]
  const scale    = SCALE[device]
  const radius   = device === 'mobile' ? '36px' : device === 'tablet' ? '22px' : '10px'

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label */}
      <p className="text-[11px] text-app-subtle font-mono tracking-wider">
        {label} · {width}px
      </p>

      {/* Chrome shell */}
      <div
        style={{
          width: displayW,
          borderRadius: radius,
          border: `${device === 'mobile' ? '6px' : device === 'tablet' ? '5px' : '2px'} solid var(--app-border, #2a2a2a)`,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          backgroundColor: bgColor,
        }}
      >
        {/* Desktop menu bar */}
        {device === 'desktop' && (
          <div style={{ height: '26px', backgroundColor: '#1c1c1e', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '6px' }}>
            {['#ff5f57','#febc2e','#28c840'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
            ))}
            <div style={{ flex: 1, marginLeft: '10px', height: '14px', backgroundColor: '#2c2c2e', borderRadius: '3px' }} />
          </div>
        )}

        {/* Mobile status bar */}
        {device === 'mobile' && (
          <div style={{ height: '30px', backgroundColor: panelColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: textSecondary, fontFamily: tokens.typography.sans }}>9:41</span>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <div style={{ width: 12, height: 7, borderRadius: '1px', border: `1.5px solid ${textMuted}`, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '1px', right: '2px', backgroundColor: textMuted, borderRadius: '1px' }} />
              </div>
            </div>
          </div>
        )}

        {/* Tablet status bar */}
        {device === 'tablet' && (
          <div style={{ height: '24px', backgroundColor: panelColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: textSecondary }}>9:41</span>
            <span style={{ fontSize: '10px', color: textMuted }}>● ● ●</span>
          </div>
        )}

        {/* Scaled page content */}
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${Math.round(100 / scale)}%`,
        }}>
          <PageRenderer page={page} tokens={tokens} device={device} />
        </div>
      </div>
    </div>
  )
}
