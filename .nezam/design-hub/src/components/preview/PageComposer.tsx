'use client'

import { type ReactNode } from 'react'
import type { ArchPage } from '@/types/arch'
import { DUMMY, IllusHero, IllusFeatures, IllusDashboard, IllusChart, IllusAvatar, IllusProduct, IllusEmpty } from './dummy-content'

// ─── Style helpers (mirrored from DeviceFrame.tsx for independence) ──────────

const S = {
  page:   (m: boolean): React.CSSProperties => ({ backgroundColor: 'var(--bg-surface)', color: 'var(--text)', fontFamily: 'var(--font-sans)', minHeight: '100%' }),
  nav: (m: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${m ? '16px' : '28px'}`, height: '52px', backgroundColor: 'var(--panel)', borderBottom: 'var(--border-width) var(--border-style) var(--border)', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 10 }),
  logo: (): React.CSSProperties => ({ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--brand)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }),
  pill: (act = false): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 500, backgroundColor: act ? 'var(--brand)' : 'var(--brand-subtle)', color: act ? '#fff' : 'var(--brand)', border: 'none', cursor: 'pointer' }),
  btn: (m = false): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: m ? '9px 18px' : '10px 22px', backgroundColor: 'var(--brand)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }),
  btnOut: (m = false): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: m ? '9px 18px' : '10px 22px', backgroundColor: 'transparent', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 500, border: 'var(--border-width) var(--border-style) var(--border)', cursor: 'pointer' }),
  card: (): React.CSSProperties => ({ backgroundColor: 'var(--panel)', border: 'var(--border-width) var(--border-style) var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }),
  input: (): React.CSSProperties => ({ height: '38px', width: '100%', backgroundColor: 'var(--bg-surface)', border: 'var(--border-width) var(--border-style) var(--border)', borderRadius: 'var(--radius-md)', padding: '0 12px', fontSize: '13px', display: 'flex', alignItems: 'center', color: 'var(--text-disabled)' }),
  label: (): React.CSSProperties => ({ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '5px' }),
  h1: (m: boolean, t: boolean): React.CSSProperties => ({ fontSize: m ? '26px' : t ? '34px' : '44px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.1, color: 'var(--text)', marginBottom: '14px', letterSpacing: '-0.02em' }),
  h2: (m: boolean): React.CSSProperties => ({ fontSize: m ? '20px' : '26px', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2, color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.015em' }),
  sec: (m: boolean): React.CSSProperties => ({ padding: m ? '40px 16px' : '60px 28px' }),
  foot: (): React.CSSProperties => ({ padding: '32px 28px', backgroundColor: 'var(--panel)', borderTop: 'var(--border-width) var(--border-style) var(--border)' }),
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function Nav({ m, links = ['Features', 'Pricing', 'Blog', 'Docs'], cta = 'Get Started' }: { m: boolean; links?: string[]; cta?: string }) {
  return (
    <nav style={S.nav(m)}>
      <div style={S.logo()}><span style={{ width: 20, height: 20, borderRadius: '5px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />YourApp</div>
      {!m && <div style={{ display: 'flex', gap: '24px' }}>{links.map(l => <span key={l} style={{ fontSize: '13px', color: 'var(--text-muted)', cursor: 'pointer' }}>{l}</span>)}</div>}
      <button style={S.btn(m)}>{cta}</button>
    </nav>
  )
}

function Sidebar({ m, items, active = 0 }: { m: boolean; items: string[]; active?: number }) {
  if (m) return null
  return (
    <aside style={{ width: '180px', flexShrink: 0, backgroundColor: 'var(--panel)', borderRight: 'var(--border-width) var(--border-style) var(--border)', display: 'flex', flexDirection: 'column', padding: '14px 8px' }}>
      <div style={{ ...S.logo(), fontSize: '13px', padding: '4px 8px', marginBottom: '14px' }}><span style={{ width: 16, height: 16, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />YourApp</div>
      {items.map((item, i) => (
        <div key={item} style={{ padding: '7px 10px', borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: i === active ? 600 : 400, color: i === active ? 'var(--brand)' : 'var(--text-muted)', backgroundColor: i === active ? 'var(--brand-subtle)' : 'transparent', marginBottom: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: i === active ? 'var(--brand)' : 'var(--neutral-300)', flexShrink: 0 }} />
          {item}
        </div>
      ))}
    </aside>
  )
}

function Stat({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div style={{ ...S.card(), padding: '16px' }}>
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{value}</p>
      <p style={{ fontSize: '11px', color: up ? 'var(--success)' : 'var(--error)', display: 'flex', alignItems: 'center', gap: '3px' }}><span>{up ? '↑' : '↓'}</span> {delta}</p>
    </div>
  )
}

function Input({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <p style={S.label()}>{label}</p>
      <div style={S.input()}><span style={{ fontSize: '13px', color: 'var(--text-disabled)' }}>{placeholder}</span></div>
    </div>
  )
}

function Footer({ minimal = false }: { minimal?: boolean }) {
  return (
    <footer style={S.foot()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {!minimal && <div style={S.logo()}><span style={{ width: 16, height: 16, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />YourApp</div>}
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>© 2025 YourApp · Privacy · Terms · Support</p>
        {!minimal && <div style={{ display: 'flex', gap: '16px' }}>{['Twitter', 'GitHub', 'LinkedIn'].map(s => <span key={s} style={{ fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer' }}>{s}</span>)}</div>}
      </div>
    </footer>
  )
}

function Avatar({ initials }: { initials: string }) {
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']
  const c = colors[initials.charCodeAt(0) % colors.length]
  return <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

// ─── Blueprint block renderers ──────────────────────────────────────────────

type Ctx = { m: boolean; t: boolean; page: ArchPage }

function blockNav(ctx: Ctx): ReactNode {
  return <Nav m={ctx.m} />
}

function blockSidebar(ctx: Ctx, items: string[], active = 0): ReactNode {
  return <Sidebar m={ctx.m} items={items} active={active} />
}

function blockHeroMarketing(ctx: Ctx): ReactNode {
  const { m, t, page } = ctx
  return (
    <section style={{ ...S.sec(m), background: `linear-gradient(170deg, var(--brand-subtle) 0%, var(--bg-surface) 60%)`, textAlign: 'center', paddingBottom: m ? '48px' : '80px' }}>
      <span style={S.pill()}>✦ Now in public beta</span>
      <h1 style={{ ...S.h1(m, t), marginTop: '14px' }}>The smarter way<br />to build {page.name}</h1>
      <p style={{ fontSize: m ? '14px' : '16px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.65 }}>{DUMMY.descriptions[0]}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={S.btn(m)}>Start for free →</button>
        <button style={S.btnOut(m)}>Watch demo</button>
      </div>
      <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex' }}>{['YD', 'AB', 'CX'].map((n, i) => <div key={n} style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: ['#3b82f6','#10b981','#8b5cf6'][i], border: '2px solid var(--bg-surface)', marginLeft: i ? '-6px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700 }}>{n}</div>)}</div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trusted by 12,000+ teams</span>
        <span style={{ fontSize: '12px', color: 'var(--warning)' }}>★★★★★ 4.9/5</span>
      </div>
    </section>
  )
}

function blockLogos(ctx: Ctx): ReactNode {
  return (
    <div style={{ borderTop: 'var(--border-width) var(--border-style) var(--border)', borderBottom: 'var(--border-width) var(--border-style) var(--border)', padding: '18px 28px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
      {['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map(n => <span key={n} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--neutral-300)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{n}</span>)}
    </div>
  )
}

function blockFeaturesGrid(ctx: Ctx): ReactNode {
  const { m, t } = ctx; const cols = m ? 1 : t ? 2 : 3
  return (
    <section style={S.sec(m)}>
      <div style={{ marginBottom: '36px' }}>
        <h2 style={S.h2(m)}>Everything you need</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Powerful features that grow with your team</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }}>
        {DUMMY.features.map((f, i) => (
          <div key={f.title} style={{ ...S.card(), padding: '20px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <span style={{ width: 14, height: 14, borderRadius: '3px', backgroundColor: 'var(--brand)', opacity: 0.7 + i * 0.05 }} />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{f.title}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function blockCtaBanner(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <section style={{ margin: `0 ${m ? '16px' : '28px'} 48px`, padding: '36px', backgroundColor: 'var(--brand)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px', fontFamily: 'var(--font-display)' }}>Ready to get started?</h2>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '20px' }}>Join thousands of teams building better products.</p>
      <button style={{ ...S.btn(), backgroundColor: '#fff', color: 'var(--brand)' }}>Start free trial</button>
    </section>
  )
}

function blockPricing(ctx: Ctx): ReactNode {
  const { m, t } = ctx
  return (
    <section style={{ ...S.sec(m), textAlign: 'center' }}>
      <h1 style={S.h1(m, t)}>Simple, transparent pricing</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '36px' }}>Start free. Scale as you grow. No surprises.</p>
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : t ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '16px', maxWidth: '820px', margin: '0 auto' }}>
        {DUMMY.prices.map(p => (
          <div key={p.name} style={{ ...S.card(), padding: '28px', border: p.featured ? '2px solid var(--brand)' : undefined, position: 'relative' }}>
            {p.featured && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', ...S.pill(true) }}>Popular</div>}
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{p.name}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '20px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.03em' }}>{p.price}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>/mo</span>
            </div>
            <button style={{ ...S.btn(), width: '100%', backgroundColor: p.featured ? 'var(--brand)' : 'transparent', color: p.featured ? '#fff' : 'var(--text)', border: p.featured ? 'none' : 'var(--border-width) var(--border-style) var(--border)', marginBottom: '20px' }}>Get started</button>
            {['5 projects', 'Unlimited members', 'Priority support', 'Analytics'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function blockFeaturesDetail(ctx: Ctx): ReactNode {
  const { m, t } = ctx; const cols = m ? 1 : t ? 2 : 3
  return (
    <section style={S.sec(m)}>
      <h2 style={S.h2(m)}>Everything you need</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Powerful features that grow with your team</p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
        {DUMMY.features.map((f, i) => (
          <div key={f.title} style={{ ...S.card(), padding: '20px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <span style={{ width: 14, height: 14, borderRadius: '3px', backgroundColor: 'var(--brand)', opacity: 0.7 + i * 0.05 }} />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{f.title}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function blockBlogList(ctx: Ctx): ReactNode {
  const { m, t } = ctx; const cols = m ? 1 : 2
  return (
    <section style={S.sec(m)}>
      <h1 style={{ ...S.h1(m, t), marginBottom: '6px' }}>Blog</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Ideas, engineering notes, and product updates from our team.</p>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {['All', 'Engineering', 'Product', 'Design', 'Company'].map((t, i) => <span key={t} style={{ ...S.pill(i === 0), fontSize: '11px' }}>{t}</span>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
        {DUMMY.blogPosts.map(p => (
          <div key={p.title} style={{ ...S.card(), padding: '22px', cursor: 'pointer' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.tag}</span>
            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.35, fontFamily: 'var(--font-display)', marginTop: '12px' }}>{p.title}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>An in-depth look at {p.title.toLowerCase()} — what we learned, what we shipped, and what's next.</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: 700 }}>YD</div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.date}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function blockArticle(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  return (
    <article style={{ maxWidth: '680px', margin: '0 auto', padding: m ? '32px 16px' : '48px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={S.pill()}>Engineering</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>May 2025 · 8 min read</span>
      </div>
      <h1 style={{ fontSize: m ? '24px' : '34px', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.15, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.02em' }}>{page.name}</h1>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>{DUMMY.descriptions[0]}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 0', borderTop: 'var(--border-width) var(--border-style) var(--border)', borderBottom: 'var(--border-width) var(--border-style) var(--border)', marginBottom: '28px' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700 }}>YD</div>
        <div><p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Yasser Dorgham</p><p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Design Architect</p></div>
      </div>
      {[
        'Building a scalable design system starts with a clear understanding of your design tokens. Tokens are the single source of truth for all visual decisions — colors, spacing, typography, shadows — expressed as named variables.',
        'When we first introduced tokens at YourApp, we had 40 separate product surfaces each making their own visual choices. The result was inconsistency, maintenance burden, and a poor user experience across the board.',
        'The key insight was that tokens need to have semantic meaning, not just describe their value. A color called "blue-500" is less useful than one called "brand-primary", because the former tells you what it is, while the latter tells you what it\'s for.',
      ].map((p, i) => <p key={i} style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '18px' }}>{p}</p>)}
      <div style={{ backgroundColor: '#1a1b26', borderRadius: 'var(--radius-md)', padding: '16px', fontFamily: 'var(--font-mono)' }}>
        <p style={{ fontSize: '11px', color: '#7aa2f7' }}>{'// Design token example'}</p>
        <p style={{ fontSize: '11px', color: '#c0caf5', marginTop: '6px' }}>{'const tokens = {'}</p>
        <p style={{ fontSize: '11px', color: '#c0caf5', paddingLeft: '16px' }}>{'brand: { primary: \'#3b82f6\', hover: \'#2563eb\' },'}</p>
        <p style={{ fontSize: '11px', color: '#c0caf5', paddingLeft: '16px' }}>{'spacing: { sm: \'8px\', md: \'16px\', lg: \'24px\' },'}</p>
        <p style={{ fontSize: '11px', color: '#c0caf5' }}>{'}'}</p>
      </div>
    </article>
  )
}

function blockContact(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <section style={S.sec(m)}>
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: '40px', maxWidth: '780px', margin: '0 auto' }}>
        <div>
          <h1 style={{ ...S.h1(m, false), marginBottom: '8px' }}>Get in touch</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.7 }}>Have a question, idea, or project? We'd love to hear from you.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{['hello@yourapp.com', '+1 (555) 020-2020', 'San Francisco, CA'].map(d => <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}><span style={{ color: 'var(--brand)', fontWeight: 700 }}>●</span> {d}</div>)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input label="Name" placeholder="Your name" />
          <Input label="Email" placeholder="you@example.com" />
          <Input label="Subject" placeholder="How can we help?" />
          <div><p style={S.label()}>Message</p><div style={{ ...S.input(), height: '80px', alignItems: 'flex-start', padding: '10px 12px' }}><span style={{ fontSize: '13px', color: 'var(--text-disabled)' }}>Tell us more...</span></div></div>
          <button style={{ ...S.btn(), width: '100%', marginTop: '4px' }}>Send message</button>
        </div>
      </div>
    </section>
  )
}

function blockContactInfo(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <section style={{ ...S.sec(m), backgroundColor: 'var(--panel)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : 'repeat(3, 1fr)', gap: '20px', maxWidth: '680px', margin: '0 auto' }}>
        {[
          { icon: '✉', label: 'Email', val: 'hello@yourapp.com' },
          { icon: '📞', label: 'Phone', val: '+1 (555) 020-2020' },
          { icon: '📍', label: 'Office', val: 'San Francisco, CA' },
        ].map(d => <div key={d.label} style={{ ...S.card(), padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', marginBottom: '8px' }}>{d.icon}</div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</p>
          <p style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500, marginTop: '4px' }}>{d.val}</p>
        </div>)}
      </div>
    </section>
  )
}

function blockAuth(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  const isLogin = page.route.includes('login') || page.name.toLowerCase().includes('login')
  const isForgot = page.route.includes('forgot') || page.route.includes('reset')
  const title = isForgot ? 'Reset your password' : isLogin ? 'Welcome back' : 'Create your account'
  const subtitle = isForgot ? 'Enter your email and we\'ll send a reset link.' : isLogin ? 'Sign in to continue to YourApp' : 'Get started for free today'
  return (
    <div style={{ ...S.page(m), display: 'flex', height: '100%', background: 'linear-gradient(135deg, var(--brand-subtle) 0%, var(--bg-surface) 55%)' }}>
      {!m && <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', backgroundColor: 'var(--brand)' }}>
        <div style={S.logo()}><span style={{ width: 22, height: 22, borderRadius: '6px', backgroundColor: '#fff', opacity: 0.9, display: 'inline-block' }} /><span style={{ color: '#fff' }}>YourApp</span></div>
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>Build faster, ship smarter</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '32px' }}>{DUMMY.descriptions[1]}</p>
          {['No credit card required', 'Unlimited projects on free tier', 'SOC2 certified security'].map(f => <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}><span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>✓</span><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{f}</span></div>)}
        </div>
      </div>}
      <div style={{ flex: m ? 1 : '0 0 420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: m ? '32px 16px' : '48px 40px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ ...S.logo(), marginBottom: '20px' }}><span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />YourApp</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>{title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!isLogin && !isForgot && <Input label="Full name" placeholder="Jane Smith" />}
            <Input label="Email address" placeholder="you@company.com" />
            {!isForgot && <Input label="Password" placeholder="••••••••••••" />}
            {isLogin && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ fontSize: '12px', color: 'var(--brand)', cursor: 'pointer' }}>Forgot password?</span></div>}
            <button style={{ ...S.btn(), width: '100%', marginTop: '4px', padding: '12px' }}>{isForgot ? 'Send reset link' : isLogin ? 'Sign in' : 'Create account'}</button>
            {!isForgot && <><div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}><div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} /><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>or continue with</span><div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} /></div><button style={{ ...S.btnOut(), width: '100%', padding: '10px', gap: '8px' }}><span style={{ fontWeight: 700, fontSize: '13px' }}>G</span> Google</button></>}
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              {isLogin ? "Don't have an account? " : isForgot ? 'Remember it? ' : 'Already have one? '}
              <span style={{ color: 'var(--brand)', cursor: 'pointer', fontWeight: 500 }}>{isLogin ? 'Sign up free' : 'Sign in'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function blockDashboardHeader(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: m ? '14px' : '18px' }}>
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{page.name}</h2>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Welcome back — here's what's happening today.</p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ ...S.btnOut(), padding: '7px 14px', fontSize: '12px' }}>Export</button>
        <button style={{ ...S.btn(), padding: '7px 14px', fontSize: '12px' }}>+ New</button>
      </div>
    </div>
  )
}

function blockStatsRow(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <div style={{ display: 'grid', gridTemplateColumns: m ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '12px' }}>
      {DUMMY.stats.map(s => <Stat key={s.label} label={s.label} value={s.value} delta={s.change} up={s.up} />)}
    </div>
  )
}

function blockChart(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <div style={{ ...S.card(), padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Revenue Overview</p>
        <div style={{ display: 'flex', gap: '4px' }}>{['7d', '30d', '90d'].map((p, i) => <span key={p} style={{ ...S.pill(i === 1), fontSize: '10px', padding: '2px 7px' }}>{p}</span>)}</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '90px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>{['12k', '6k', '0'].map(v => <span key={v} style={{ fontSize: '9px', color: 'var(--text-muted)', width: '22px' }}>{v}</span>)}</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '5px', height: '100%' }}>
          {[42, 58, 45, 72, 61, 88, 65, 80, 55, 90, 70, 95].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 11 ? 'var(--brand)' : `var(--brand)${Math.round(30 + i * 5).toString(16)}`, borderRadius: '3px 3px 0 0' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '30px' }}>
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m} style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{m}</span>)}
      </div>
    </div>
  )
}

function blockRecentUsers(ctx: Ctx): ReactNode {
  const rows = [
    { name: 'Alice Johnson', role: 'Admin', status: 'Active' },
    { name: 'Bob Smith', role: 'Member', status: 'Active' },
    { name: 'Carol White', role: 'Viewer', status: 'Pending' },
    { name: 'Dan Brown', role: 'Member', status: 'Inactive' },
  ]
  const sc: Record<string, string> = { Active: 'var(--success)', Pending: 'var(--warning)', Inactive: 'var(--text-muted)' }
  const sb: Record<string, string> = { Active: 'var(--success)18', Pending: 'var(--warning)18', Inactive: 'var(--neutral-100)' }
  const initials = ['AJ', 'BS', 'CW', 'DB']
  return (
    <div style={{ ...S.card(), overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: 'var(--border-width) var(--border-style) var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Recent Users</p>
        <span style={{ fontSize: '11px', color: 'var(--brand)', cursor: 'pointer' }}>View all →</span>
      </div>
      {rows.map((row, i) => (
        <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: i < rows.length - 1 ? 'var(--border-width) var(--border-style) var(--border)' : 'none' }}>
          <Avatar initials={initials[i]} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.2 }}>{row.name}</p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{row.role}</p>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 500, color: sc[row.status], backgroundColor: sb[row.status], padding: '2px 7px', borderRadius: 'var(--radius-full)' }}>{row.status}</span>
        </div>
      ))}
    </div>
  )
}

function blockAnalyticsHeader(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: m ? '14px' : '18px' }}>
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{page.name}</h2>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Last 30 days · Updated 2 minutes ago</p>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>{['7d', '30d', '90d', '1y'].map((d, i) => <span key={d} style={{ ...S.pill(i === 1), fontSize: '11px' }}>{d}</span>)}</div>
    </div>
  )
}

function blockTrafficChart(ctx: Ctx): ReactNode {
  return (
    <div style={{ ...S.card(), padding: '18px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Traffic Overview</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100px' }}>
        {[30, 45, 38, 62, 50, 75, 58, 80, 65, 90, 70, 85, 60, 95, 72, 88, 78, 92, 68, 84, 73, 90, 65, 88, 78, 92, 70, 86, 80, 95].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i >= 28 ? 'var(--brand)' : 'var(--brand)30', borderRadius: '2px 2px 0 0' }} />
        ))}
      </div>
    </div>
  )
}

function blockTopPages(ctx: Ctx): ReactNode {
  const pages = [{ path: '/', views: '480K', pct: 100 }, { path: '/pricing', views: '210K', pct: 44 }, { path: '/blog', views: '165K', pct: 34 }, { path: '/docs', views: '140K', pct: 29 }, { path: '/signup', views: '98K', pct: 20 }]
  return (
    <div style={{ ...S.card(), padding: '18px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Top Pages</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pages.map(p => <div key={p.path}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{p.path}</span><span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.views}</span></div><div style={{ height: '4px', backgroundColor: 'var(--neutral-200)', borderRadius: '2px' }}><div style={{ height: '100%', width: `${p.pct}%`, backgroundColor: 'var(--brand)', borderRadius: '2px' }} /></div></div>)}
      </div>
    </div>
  )
}

function blockSettings(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <main style={{ flex: 1, padding: m ? '16px' : '28px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '520px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>Settings</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '28px' }}>Manage your account preferences and settings.</p>
        <div style={{ ...S.card(), padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '14px' }}>Profile Photo</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#fff', fontWeight: 700 }}>YD</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...S.btnOut(), padding: '6px 14px', fontSize: '12px' }}>Upload photo</button>
              <button style={{ ...S.btnOut(), padding: '6px 14px', fontSize: '12px', color: 'var(--error)', borderColor: 'var(--error)30' }}>Remove</button>
            </div>
          </div>
        </div>
        <div style={{ ...S.card(), padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>Personal Information</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="First name" placeholder="Yasser" />
              <Input label="Last name" placeholder="Dorgham" />
            </div>
            <Input label="Email address" placeholder="yasser@yourapp.com" />
            <Input label="Job title" placeholder="Design Architect" />
            <Input label="Company" placeholder="YourApp" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button style={{ ...S.btnOut(), padding: '7px 16px', fontSize: '12px' }}>Cancel</button>
            <button style={{ ...S.btn(), padding: '7px 16px', fontSize: '12px' }}>Save changes</button>
          </div>
        </div>
        <div style={{ ...S.card(), padding: '20px', border: '1px solid var(--error)20' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--error)', marginBottom: '6px' }}>Danger Zone</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Permanently delete your account and all associated data.</p>
          <button style={{ ...S.btnOut(), padding: '7px 16px', fontSize: '12px', color: 'var(--error)', borderColor: 'var(--error)40' }}>Delete account</button>
        </div>
      </div>
    </main>
  )
}

function blockProfile(ctx: Ctx): ReactNode {
  const { m, t, page } = ctx; const cols = m ? 1 : t ? 2 : 3
  const works = [
    { title: 'Design System v3', tag: 'Design', color: '#3b82f6' },
    { title: 'Analytics Dashboard', tag: 'Product', color: '#10b981' },
    { title: 'Mobile App Redesign', tag: 'Mobile', color: '#8b5cf6' },
    { title: 'E-Commerce Platform', tag: 'Frontend', color: '#f59e0b' },
    { title: 'Brand Identity', tag: 'Branding', color: '#ef4444' },
    { title: 'Motion Library', tag: 'Animation', color: '#06b6d4' },
  ]
  return (
    <>
      <Nav m={m} links={['Work', 'About', 'Contact']} cta="Hire me" />
      <div style={{ background: 'linear-gradient(160deg, var(--brand-subtle) 0%, var(--bg-surface) 50%)', padding: m ? '40px 16px 32px' : '60px 28px 40px' }}>
        <div style={{ display: 'flex', alignItems: m ? 'flex-start' : 'center', gap: m ? '16px' : '24px', flexDirection: m ? 'column' : 'row' }}>
          <div style={{ width: m ? 64 : 80, height: m ? 64 : 80, borderRadius: '50%', backgroundColor: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: m ? '22px' : '28px', color: '#fff', fontWeight: 800, flexShrink: 0 }}>YD</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: m ? '22px' : '28px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '4px', letterSpacing: '-0.02em' }}>{page.name}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Design Architect · San Francisco, CA</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button style={{ ...S.btn(m), padding: '7px 16px', fontSize: '12px' }}>Download CV</button>
              <button style={{ ...S.btnOut(m), padding: '7px 16px', fontSize: '12px' }}>Get in touch</button>
            </div>
          </div>
          {!m && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
            {[{ n: '8+', l: 'Years exp.' }, { n: '40+', l: 'Projects' }, { n: '12k', l: 'GitHub stars' }].map(({ n, l }) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{n}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l}</p>
              </div>
            ))}
          </div>}
        </div>
      </div>
      <section style={S.sec(m)}>
        <h2 style={{ ...S.h2(m), marginBottom: '20px' }}>Selected Work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }}>
          {works.map(w => (
            <div key={w.title} style={{ ...S.card(), overflow: 'hidden', cursor: 'pointer' }}>
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
    </>
  )
}

function blockProductList(ctx: Ctx): ReactNode {
  const { m, t } = ctx; const cols = m ? 2 : t ? 3 : 3
  const products = [
    { name: 'Minimal Chair', price: '$249', tag: 'Bestseller', color: '#d4a57a' },
    { name: 'Arc Table Lamp', price: '$149', tag: 'New', color: '#7ab8d4' },
    { name: 'Wool Throw', price: '$89', tag: null, color: '#a8d4a0' },
    { name: 'Ceramic Vase', price: '$65', tag: 'Sale', color: '#d4a0a0' },
    { name: 'Oak Side Table', price: '$320', tag: null, color: '#c4b07a' },
    { name: 'Linen Cushion', price: '$45', tag: 'New', color: '#b0a0d4' },
  ]
  return (
    <>
      <Nav m={m} links={['Shop', 'Sale', 'New In', 'Brands']} cta="Cart (2)" />
      <section style={S.sec(m)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ ...S.h1(m, t), marginBottom: '4px' }}>All Products</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>128 products</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...S.btnOut(), padding: '7px 12px', fontSize: '12px' }}>Filter</button>
            <button style={{ ...S.btnOut(), padding: '7px 12px', fontSize: '12px' }}>Sort: Featured</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
          {products.map(p => (
            <div key={p.name} style={{ cursor: 'pointer' }}>
              <div style={{ height: m ? '130px' : '160px', backgroundColor: p.color + '25', borderRadius: 'var(--radius-lg)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-width) var(--border-style) var(--border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', backgroundColor: p.color + '50' }} />
                {p.tag && <div style={{ position: 'absolute', top: '8px', left: '8px', ...S.pill(p.tag === 'Sale'), fontSize: '9px', padding: '2px 7px', backgroundColor: p.tag === 'Sale' ? 'var(--error)' : p.tag === 'New' ? 'var(--success)' : 'var(--brand)', color: '#fff' }}>{p.tag}</div>}
              </div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '3px' }}>{p.name}</p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand)' }}>{p.price}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}

function blockProductDetail(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  return (
    <>
      <Nav m={m} links={['Shop', 'Sale', 'New In', 'Brands']} cta="Cart (2)" />
      <section style={S.sec(m)}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 1fr', gap: '32px' }}>
          <div>
            <div style={{ height: m ? '220px' : '320px', backgroundColor: 'var(--neutral-100)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'var(--border-width) var(--border-style) var(--border)', marginBottom: '12px' }}>
              <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--neutral-200)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
              {['var(--neutral-100)', 'var(--brand-subtle)', 'var(--neutral-200)', 'var(--neutral-100)'].map((bg, i) => (
                <div key={i} style={{ height: '56px', backgroundColor: bg, borderRadius: 'var(--radius-md)', border: i === 0 ? '2px solid var(--brand)' : 'var(--border-width) var(--border-style) var(--border)', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={S.pill()}>New Arrival</span>
              <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>● In stock</span>
            </div>
            <h1 style={{ fontSize: m ? '22px' : '28px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '8px', letterSpacing: '-0.02em' }}>{page.name}</h1>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>$249</span>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>$319</span>
              <span style={{ fontSize: '12px', color: 'var(--error)', fontWeight: 600 }}>22% off</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>Premium quality, thoughtfully designed for modern interiors. Crafted from sustainable materials with a 5-year warranty.</p>
            <div style={{ marginBottom: '16px' }}>
              <p style={S.label()}>Color</p>
              <div style={{ display: 'flex', gap: '8px' }}>{['#d4a57a', '#7ab8d4', '#a8d4a0', '#b0a0d4'].map((c, i) => (
                <div key={c} style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: c, border: i === 0 ? '3px solid var(--brand)' : '2px solid var(--border)', cursor: 'pointer' }} />
              ))}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...S.btn(), flex: 1, padding: '12px' }}>Add to cart</button>
              <button style={{ ...S.btnOut(), padding: '12px 14px' }}>♡</button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

function blockCart(ctx: Ctx): ReactNode {
  const { m } = ctx
  const items = [
    { name: 'Minimal Chair', price: 249, qty: 1, color: '#d4a57a' },
    { name: 'Arc Table Lamp', price: 149, qty: 2, color: '#7ab8d4' },
    { name: 'Ceramic Vase Set', price: 65, qty: 1, color: '#d4a0a0' },
  ]
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  return (
    <>
      <Nav m={m} links={['Shop', 'Sale', 'New In', 'Brands']} cta="My Account" />
      <section style={S.sec(m)}>
        <h1 style={{ ...S.h1(m, false), marginBottom: '24px' }}>Shopping Cart</h1>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 320px', gap: '24px' }}>
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
          <div style={{ ...S.card(), padding: '22px', height: 'fit-content' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px' }}>Order Summary</p>
            {[['Subtotal', `$${subtotal}`], ['Shipping', 'Free'], ['Tax', `$${Math.round(subtotal * 0.08)}`]].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontSize: '12px', color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: 'var(--border-width) var(--border-style) var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>${subtotal + Math.round(subtotal * 0.08)}</span>
            </div>
            <Input label="Promo code" placeholder="WELCOME20" />
            <button style={{ ...S.btnOut(), width: '100%', marginTop: '8px', fontSize: '12px' }}>Apply</button>
            <button style={{ ...S.btn(), width: '100%', marginTop: '10px', padding: '12px' }}>Proceed to Checkout</button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

function blockCheckout(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <>
      <nav style={{ ...S.nav(m), justifyContent: 'center' }}>
        <div style={S.logo()}><span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />YourApp Checkout</div>
      </nav>
      <section style={S.sec(m)}>
        <div style={{ display: 'grid', gridTemplateColumns: m ? '1fr' : '1fr 340px', gap: '28px', maxWidth: '860px', margin: '0 auto' }}>
          <div>
            <div style={{ display: 'flex', gap: '0', marginBottom: '28px' }}>
              {['Contact', 'Shipping', 'Payment', 'Review'].map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: i === 0 ? 'var(--brand)' : 'var(--neutral-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: i <= 0 ? '#fff' : 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</div>
                    <span style={{ fontSize: '11px', color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', fontWeight: i === 0 ? 600 : 400 }}>{step}</span>
                  </div>
                  {i < 3 && <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--neutral-200)', margin: '0 6px' }} />}
                </div>
              ))}
            </div>
            <div style={{ ...S.card(), padding: '22px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>Contact Information</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input label="First name" placeholder="Yasser" />
                  <Input label="Last name" placeholder="Dorgham" />
                </div>
                <Input label="Email" placeholder="yasser@example.com" />
                <Input label="Phone" placeholder="+1 (555) 000-0000" />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', margin: '20px 0 14px' }}>Shipping Address</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input label="Street address" placeholder="123 Main Street" />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                  <Input label="City" placeholder="San Francisco" />
                  <Input label="State" placeholder="CA" />
                  <Input label="ZIP" placeholder="94105" />
                </div>
              </div>
              <button style={{ ...S.btn(), width: '100%', marginTop: '20px', padding: '12px' }}>Continue to Shipping →</button>
            </div>
          </div>
          <div style={{ ...S.card(), padding: '20px', height: 'fit-content' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>Order (3 items)</p>
            {[['Minimal Chair ×1', '$249'], ['Arc Table Lamp ×2', '$298'], ['Ceramic Vase ×1', '$65']].map(([n, p]) => (
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
    </>
  )
}

function blockOrderSuccess(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <>
      <nav style={{ ...S.nav(m), justifyContent: 'center' }}>
        <div style={S.logo()}><span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />YourApp</div>
      </nav>
      <section style={{ ...S.sec(m), textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--success)20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <span style={{ fontSize: '28px', color: 'var(--success)' }}>✓</span>
        </div>
        <h1 style={{ ...S.h1(m, false), marginBottom: '8px' }}>Order confirmed!</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Your order #NEZ-2025-4839 has been placed. We'll send tracking info to your email.</p>
        <div style={{ ...S.card(), padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>Delivery estimate</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>May 30 – Jun 3</p>
        </div>
        <button style={S.btn(m)}>Track your order →</button>
      </section>
      <Footer minimal />
    </>
  )
}

function blockOnboarding(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  return (
    <>
      <nav style={{ ...S.nav(m), justifyContent: 'center', position: 'static' }}>
        <div style={S.logo()}><span style={{ width: 18, height: 18, borderRadius: '4px', backgroundColor: 'var(--brand)', display: 'inline-block' }} />{page.name}</div>
      </nav>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: m ? '32px 16px' : '60px 28px', maxWidth: '420px', margin: '0 auto', textAlign: 'center', flex: 1 }}>
        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <span style={{ width: 20, height: 20, borderRadius: '4px', backgroundColor: 'var(--brand)' }} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>Welcome to YourApp</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>Let's set up your workspace in a few steps.</p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ width: i === 0 ? 20 : 8, height: 6, borderRadius: '3px', backgroundColor: i === 0 ? 'var(--brand)' : 'var(--neutral-200)' }} />)}
        </div>
        <Input label="Workspace name" placeholder="e.g., Acme Corp" />
        <Input label="Your role" placeholder="e.g., Designer" />
        <button style={{ ...S.btn(), width: '100%', marginTop: '16px', padding: '12px' }}>Continue →</button>
        <button style={{ ...S.btnOut(), width: '100%', marginTop: '8px', padding: '12px' }}>Skip for now</button>
      </div>
    </>
  )
}

function blockTeam(ctx: Ctx): ReactNode {
  const { m, t } = ctx; const cols = m ? 1 : t ? 2 : 3
  return (
    <>
      <Nav m={m} />
      <section style={S.sec(m)}>
        <h2 style={S.h2(m)}>Our team</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>Meet the people behind the product.</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
          {DUMMY.team.map(t => (
            <div key={t.name} style={{ ...S.card(), padding: '20px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '14px', color: 'var(--brand)', fontWeight: 700 }}>{t.initials}</div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>{t.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>{t.role}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {['TW', 'LI', 'GH'].map(s => <span key={s} style={{ fontSize: '9px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}

function blockError(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <div style={{ ...S.page(m), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--error)15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '36px', fontWeight: 800, color: 'var(--error)', fontFamily: 'var(--font-display)' }}>404</div>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Page not found</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '360px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={S.btn(m)}>Go home</button>
        <button style={S.btnOut(m)}>Contact support</button>
      </div>
    </div>
  )
}

function blockNotifications(ctx: Ctx): ReactNode {
  const { m } = ctx
  return (
    <>
      <Nav m={m} links={['Inbox', 'Archive', 'Spam']} cta="Compose" />
      <section style={S.sec(m)}>
        <h1 style={{ ...S.h1(m, false), marginBottom: '20px' }}>Notifications</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {DUMMY.notifications.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: i === 0 ? 'var(--brand-subtle)' : 'transparent', borderRadius: 'var(--radius-md)' }}>
              <Avatar initials={n.user.split(' ').map(w => w[0]).join('')} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.4 }}><strong>{n.user}</strong> {n.action}</p>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>{n.time}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function blockDocs(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  const sections = ['Getting Started', 'Installation', 'Configuration', 'Deployment', 'API Reference', 'Troubleshooting']
  return (
    <div style={{ ...S.page(m), display: 'flex', minHeight: '600px' }}>
      <Sidebar m={m} items={sections} active={0} />
      <main style={{ flex: 1, padding: m ? '20px 16px' : '36px 32px', maxWidth: '720px' }}>
        <h1 style={{ fontSize: m ? '22px' : '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>{page.name}</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>{DUMMY.descriptions[2]}</p>
        {[1, 2, 3].map(ch => (
          <div key={ch} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '10px' }}>Chapter {ch}: Setup Guide</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '10px' }}>Follow these steps to get started with {page.name}. This guide covers installation, configuration, and first steps.</p>
            <div style={{ ...S.card(), padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Install the CLI tool — <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', backgroundColor: 'var(--neutral-100)', padding: '1px 6px', borderRadius: '3px' }}>npm install @yourapp/cli</span></span>
            </div>
            <div style={{ ...S.card(), padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--success)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Configure your project with <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', backgroundColor: 'var(--neutral-100)', padding: '1px 6px', borderRadius: '3px' }}>yourapp init</span></span>
            </div>
            <div style={{ ...S.card(), padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-muted)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Deploy to production (coming next)</span>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

function blockApiExplorer(ctx: Ctx): ReactNode {
  const { m, page } = ctx
  const endpoints = [
    { method: 'GET', path: '/api/v1/users', desc: 'List all users', auth: true },
    { method: 'POST', path: '/api/v1/users', desc: 'Create a new user', auth: true },
    { method: 'GET', path: '/api/v1/users/:id', desc: 'Get user by ID', auth: true },
    { method: 'PUT', path: '/api/v1/users/:id', desc: 'Update user', auth: true },
    { method: 'DELETE', path: '/api/v1/users/:id', desc: 'Delete user', auth: true },
  ]
  const mc: Record<string, string> = { GET: '#10b981', POST: '#3b82f6', PUT: '#f59e0b', DELETE: '#ef4444' }
  return (
    <>
      <Nav m={m} />
      <div style={{ ...S.page(m), display: 'flex' }}>
        <Sidebar m={m} items={['Overview', 'Users', 'Auth', 'Webhooks', 'SDKs', 'Changelog']} active={1} />
        <main style={{ flex: 1, padding: m ? '16px' : '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: '4px' }}>{page.name}</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>REST API reference — Base URL: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>https://api.yourapp.com/v1</span></p>
          {endpoints.map(ep => (
            <div key={ep.path} style={{ ...S.card(), padding: '12px 16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', backgroundColor: mc[ep.method], padding: '3px 7px', borderRadius: '4px', fontFamily: 'var(--font-mono)', letterSpacing: '0.03em', flexShrink: 0 }}>{ep.method}</span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text)', flex: 1 }}>{ep.path}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', flex: 1 }}>{ep.desc}</span>
              <span style={{ fontSize: '9px', color: 'var(--warning)', fontWeight: 600, flexShrink: 0 }}>{ep.auth ? '🔒 Auth' : ''}</span>
            </div>
          ))}
        </main>
      </div>
    </>
  )
}

function blockMediaLibrary(ctx: Ctx): ReactNode {
  const { m } = ctx; const cols = m ? 3 : 6
  return (
    <>
      <Nav m={m} links={['Photos', 'Videos', 'Documents', 'Trash']} cta="Upload" />
      <section style={S.sec(m)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ ...S.h1(m, false), marginBottom: 0 }}>Media Library</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ ...S.btnOut(), padding: '7px 12px', fontSize: '12px' }}>Select</button>
            <button style={{ ...S.btn(), padding: '7px 12px', fontSize: '12px' }}>+ Upload</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '8px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', backgroundColor: `var(--brand)${10 + (i % 5) * 5}`, border: 'var(--border-width) var(--border-style) var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <div style={{ width: '40%', height: '40%', borderRadius: '4px', backgroundColor: `var(--brand)${20 + (i % 3) * 10}`, opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function blockMarketingTeam(ctx: Ctx): ReactNode {
  const { m, t } = ctx; const cols = m ? 1 : t ? 2 : 3
  return (
    <>
      <Nav m={m} />
      <section style={S.sec(m)}>
        <h2 style={S.h2(m)}>Meet the team</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>The people building the future of your workflow.</p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px' }}>
          {DUMMY.team.map(t => (
            <div key={t.name} style={{ ...S.card(), padding: '20px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '16px', color: 'var(--brand)', fontWeight: 700 }}>{t.initials}</div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>{t.name}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{t.role}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Passionate about building tools that help teams do their best work.</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  )
}

// ─── Blueprint → rendered composition ──────────────────────────────────────

type Blueprint = ((ctx: Ctx) => ReactNode)[]

const BLUEPRINTS: Record<string, Blueprint> = {
  marketing:      [blockNav, blockHeroMarketing, blockLogos, blockFeaturesGrid, blockCtaBanner, () => <Footer />],
  features:       [blockNav, blockFeaturesDetail, blockLogos, blockCtaBanner, () => <Footer />],
  pricing:        [blockNav, blockPricing, () => <Footer />],
  'blog-list':    [blockNav, blockBlogList, () => <Footer />],
  article:        [blockNav, blockArticle, () => <Footer minimal />],
  contact:        [blockNav, blockContact, blockContactInfo, () => <Footer />],
  'auth-login':   [blockAuth],
  'auth-signup':  [blockAuth],
  'auth-forgot':  [blockAuth],
  dashboard:      [(ctx) => <div style={{ ...S.page(ctx.m), display: 'flex', height: '100%', minHeight: '700px' }}>{blockSidebar(ctx, ['Overview', 'Analytics', 'Users', 'Projects', 'Billing', 'Settings'], 0)}<main style={{ flex: 1, overflow: 'hidden', padding: ctx.m ? '16px' : '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>{blockDashboardHeader(ctx)}{blockStatsRow(ctx)}<div style={{ display: 'grid', gridTemplateColumns: ctx.m ? '1fr' : '1fr 1fr', gap: '14px', flex: 1 }}>{blockChart(ctx)}{blockRecentUsers(ctx)}</div></main></div>],
  analytics:      [(ctx) => <div style={{ ...S.page(ctx.m), display: 'flex', minHeight: '700px' }}>{blockSidebar(ctx, ['Overview', 'Reports', 'Explorer', 'Alerts', 'Integrations', 'Settings'], 0)}<main style={{ flex: 1, padding: ctx.m ? '16px' : '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>{blockAnalyticsHeader(ctx)}<div style={{ display: 'grid', gridTemplateColumns: ctx.m ? '1fr' : '3fr 2fr', gap: '14px', flex: 1 }}>{blockTrafficChart(ctx)}{blockTopPages(ctx)}</div></main></div>],
  settings:       [(ctx) => <div style={{ ...S.page(ctx.m), display: 'flex', minHeight: '700px' }}>{blockSidebar(ctx, ['Account', 'Profile', 'Notifications', 'Security', 'Privacy', 'Billing', 'API', 'Integrations'], 0)}{blockSettings(ctx)}</div>],
  profile:        [(ctx) => <div style={S.page(ctx.m)}>{blockProfile(ctx)}</div>],
  'product-list': [(ctx) => <div style={S.page(ctx.m)}>{blockProductList(ctx)}</div>],
  'product-detail': [(ctx) => <div style={S.page(ctx.m)}>{blockProductDetail(ctx)}</div>],
  cart:           [(ctx) => <div style={S.page(ctx.m)}>{blockCart(ctx)}</div>],
  checkout:       [(ctx) => <div style={S.page(ctx.m)}>{blockCheckout(ctx)}</div>],
  'order-success': [(ctx) => <div style={S.page(ctx.m)}>{blockOrderSuccess(ctx)}</div>],
  onboarding:     [(ctx) => <div style={{ ...S.page(ctx.m), display: 'flex', flexDirection: 'column', minHeight: '600px' }}>{blockOnboarding(ctx)}</div>],
  'error-404':    [blockError],
  team:           [(ctx) => <div style={S.page(ctx.m)}>{blockTeam(ctx)}</div>],
  docs:           [blockDocs],
  'api-explorer': [(ctx) => <div style={S.page(ctx.m)}>{blockApiExplorer(ctx)}</div>],
  'media-library': [(ctx) => <div style={S.page(ctx.m)}>{blockMediaLibrary(ctx)}</div>],
  notifications:  [(ctx) => <div style={S.page(ctx.m)}>{blockNotifications(ctx)}</div>],
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function composePage(template: string, page: ArchPage, isMobile: boolean, isTablet: boolean): ReactNode {
  const blueprint = BLUEPRINTS[template]
  if (!blueprint) return null
  const ctx: Ctx = { m: isMobile, t: isTablet, page }
  return <>{blueprint.map((fn, i) => <div key={i}>{fn(ctx)}</div>)}</>
}
