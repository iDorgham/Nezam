'use client'

import { useMemo } from 'react'
import { Search, Layers2 } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import {
  SECTIONS_LIBRARY,
  SECTION_CATEGORY_LABELS,
  SECTION_CATEGORY_ORDER,
  filterSections,
  type SectionDef,
  type SectionCategory,
} from '@/data/sections-library'

// ─── Live section previews ────────────────────────────────────────────────────

function SectionPreview({ section }: { section: SectionDef }) {
  const tokens = useHub((s) => s.design.tokens)

  const brand   = tokens.colors.brand['500']
  const brandSub = tokens.colors.brand['100']
  const panel   = tokens.colors.surface.panel
  const border  = tokens.colors.surface.border
  const text    = tokens.colors.text.primary
  const muted   = tokens.colors.text.muted
  const bg      = tokens.colors.surface.bg
  const accent  = tokens.colors.accent['500']
  const radius  = tokens.radius.md

  const s: React.CSSProperties = {
    backgroundColor: bg,
    color: text,
    fontFamily: tokens.typography.sans,
    borderRadius: radius,
    overflow: 'hidden',
    fontSize: '10px',
    lineHeight: '1.4',
  }

  const SHARED = { bg, panel, border, text, muted, brand, brandSub, accent, radius }

  switch (section.id) {

    // ── Navigation ────────────────────────────────────────────────────────
    case 'navbar-centered':
      return (
        <div style={{ ...s, backgroundColor: panel, borderBottom: `1px solid ${border}`, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: brand, fontSize: '11px' }}>Logo</span>
          <div style={{ display: 'flex', gap: 12, color: muted, fontSize: '9.5px' }}>
            {['Home', 'Features', 'Pricing', 'About'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div style={{ background: brand, color: '#fff', borderRadius: '4px', padding: '3px 10px', fontSize: '9.5px', fontWeight: 600 }}>Get Started</div>
        </div>
      )

    case 'sidebar-app':
      return (
        <div style={{ ...s, display: 'flex', height: '60px' }}>
          <div style={{ width: '44px', backgroundColor: panel, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0', gap: 6 }}>
            {['▣', '◈', '◉', '⊞'].map((ic, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: '4px', background: i === 0 ? brand : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#fff' : muted, fontSize: '9px' }}>{ic}</div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '8px 10px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: text, marginBottom: 4 }}>Dashboard</div>
            {['Overview', 'Analytics', 'Team', 'Settings'].map((item, i) => (
              <div key={item} style={{ fontSize: '9px', color: i === 0 ? brand : muted, padding: '2px 0', fontWeight: i === 0 ? 600 : 400 }}>{item}</div>
            ))}
          </div>
        </div>
      )

    case 'tab-bar':
      return (
        <div style={{ ...s, backgroundColor: panel, borderBottom: `1px solid ${border}`, display: 'flex', gap: 2, padding: '0 12px' }}>
          {['Overview', 'Analytics', 'Reports', 'Settings'].map((tab, i) => (
            <div key={tab} style={{ padding: '8px 12px', fontSize: '9.5px', color: i === 0 ? brand : muted, borderBottom: i === 0 ? `2px solid ${brand}` : '2px solid transparent', fontWeight: i === 0 ? 600 : 400 }}>{tab}</div>
          ))}
        </div>
      )

    // ── Hero ──────────────────────────────────────────────────────────────
    case 'hero-centered':
      return (
        <div style={{ ...s, padding: '16px 20px', textAlign: 'center', background: `linear-gradient(135deg, ${brandSub} 0%, ${bg} 60%)` }}>
          <div style={{ display: 'inline-flex', background: brandSub, color: brand, borderRadius: '20px', padding: '2px 10px', fontSize: '9px', fontWeight: 600, marginBottom: 6 }}>✦ New release</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: text, letterSpacing: '-0.02em', marginBottom: 4 }}>Build better products, faster</div>
          <div style={{ fontSize: '9.5px', color: muted, marginBottom: 10 }}>The complete platform for modern product teams.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            <div style={{ background: brand, color: '#fff', borderRadius: radius, padding: '4px 12px', fontSize: '9.5px', fontWeight: 600 }}>Start free</div>
            <div style={{ border: `1px solid ${border}`, color: text, borderRadius: radius, padding: '4px 12px', fontSize: '9.5px' }}>See demo</div>
          </div>
        </div>
      )

    case 'hero-split':
      return (
        <div style={{ ...s, display: 'flex', gap: 0, height: '64px' }}>
          <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: text, letterSpacing: '-0.02em', marginBottom: 4 }}>Ship products that users love</div>
            <div style={{ fontSize: '9px', color: muted, marginBottom: 8 }}>Design, prototype, and deploy in one workflow.</div>
            <div style={{ background: brand, color: '#fff', borderRadius: radius, padding: '3px 10px', fontSize: '9px', fontWeight: 600, width: 'fit-content' }}>Get started →</div>
          </div>
          <div style={{ width: '80px', backgroundColor: brandSub, display: 'flex', alignItems: 'center', justifyContent: 'center', color: brand, fontSize: '20px', opacity: 0.6 }}>⬡</div>
        </div>
      )

    case 'hero-gradient':
      return (
        <div style={{ ...s, padding: '14px 16px', background: `linear-gradient(135deg, ${brand} 0%, ${accent} 100%)`, textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>The platform for creators</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.75)', marginBottom: 8 }}>Design, build, and ship — all in one place.</div>
          <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: radius, padding: '3px 12px', fontSize: '9.5px', fontWeight: 600, display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)' }}>Start building free</div>
        </div>
      )

    case 'hero-app':
      return (
        <div style={{ ...s, padding: '10px 12px', background: `linear-gradient(160deg, ${brandSub} 0%, ${bg} 70%)` }}>
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: text }}>Your new workspace</div>
            <div style={{ fontSize: '8.5px', color: muted, marginTop: 2 }}>Everything in one place.</div>
          </div>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '5px 8px' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
              {['#f87171','#fbbf24','#4ade80'].map(c => <div key={c} style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: '28px', backgroundColor: bg, borderRight: `1px solid ${border}`, paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 5, borderRadius: 2, background: i === 1 ? brand : border }} />)}
              </div>
              <div style={{ flex: 1 }}>
                {[80,60,90,50].map((w,i) => <div key={i} style={{ height: 3, borderRadius: 2, background: i === 0 ? brand : border, width: `${w}%`, marginBottom: 3 }} />)}
              </div>
            </div>
          </div>
        </div>
      )

    // ── Features ──────────────────────────────────────────────────────────
    case 'features-grid-3':
      return (
        <div style={{ ...s, padding: '10px 12px' }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: text }}>Everything you need</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {[{ ic: '⚡', t: 'Fast' }, { ic: '🔒', t: 'Secure' }, { ic: '📊', t: 'Analytics' }].map(f => (
              <div key={f.t} style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', marginBottom: 2 }}>{f.ic}</div>
                <div style={{ fontSize: '8.5px', fontWeight: 600, color: text }}>{f.t}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'bento-grid':
      return (
        <div style={{ ...s, padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 4 }}>
          <div style={{ gridColumn: '1 / 2', gridRow: '1 / 3', backgroundColor: brand, borderRadius: '6px', padding: '8px', color: '#fff' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, marginBottom: 2 }}>Ship faster</div>
            <div style={{ fontSize: '8px', opacity: 0.8 }}>Deploy in seconds.</div>
            <div style={{ marginTop: 6, fontSize: '20px', opacity: 0.4 }}>⚡</div>
          </div>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px' }}>
            <div style={{ fontSize: '8.5px', fontWeight: 600, color: text }}>Analytics</div>
            <div style={{ height: 16, background: `linear-gradient(90deg, ${brand} 65%, ${brandSub} 100%)`, borderRadius: 3, marginTop: 4, opacity: 0.7 }} />
          </div>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: brand, flexShrink: 0 }} />
            <div style={{ fontSize: '8.5px', fontWeight: 600, color: text }}>Team collab</div>
          </div>
        </div>
      )

    // ── Social Proof ──────────────────────────────────────────────────────
    case 'testimonials-grid':
      return (
        <div style={{ ...s, padding: '8px 10px' }}>
          <div style={{ textAlign: 'center', fontSize: '9.5px', fontWeight: 700, color: text, marginBottom: 6 }}>Loved by teams worldwide</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
            {['Sarah K.', 'Marcus L.', 'Aisha M.'].map((name, i) => (
              <div key={name} style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '5px' }}>
                <div style={{ color: '#fbbf24', fontSize: '8px', marginBottom: 2 }}>★★★★★</div>
                <div style={{ fontSize: '8px', color: muted, lineHeight: 1.3, marginBottom: 3 }}>
                  {i === 0 ? '"Transformed our workflow."' : i === 1 ? '"Best tool we use."' : '"Can\'t imagine without it."'}
                </div>
                <div style={{ fontSize: '8.5px', fontWeight: 600, color: text }}>{name}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'stats-strip':
      return (
        <div style={{ ...s, display: 'flex', justifyContent: 'space-around', padding: '12px 16px', backgroundColor: panel, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
          {[['10K+', 'Users'], ['99.9%', 'Uptime'], ['4.9★', 'Rating'], ['50M', 'Events/mo']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: brand, letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: '8.5px', color: muted }}>{label}</div>
            </div>
          ))}
        </div>
      )

    case 'logos-bar':
      return (
        <div style={{ ...s, padding: '10px 14px', backgroundColor: panel }}>
          <div style={{ textAlign: 'center', fontSize: '8.5px', color: muted, marginBottom: 6 }}>Trusted by teams at</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 8 }}>
            {['Stripe', 'Vercel', 'Linear', 'Figma', 'Notion'].map(name => (
              <div key={name} style={{ fontSize: '9px', fontWeight: 700, color: muted, letterSpacing: '0.02em', opacity: 0.5 }}>{name}</div>
            ))}
          </div>
        </div>
      )

    // ── Pricing ───────────────────────────────────────────────────────────
    case 'pricing-3-tiers':
      return (
        <div style={{ ...s, padding: '8px 10px' }}>
          <div style={{ textAlign: 'center', fontSize: '9.5px', fontWeight: 700, color: text, marginBottom: 6 }}>Simple pricing</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
            {[{ name: 'Starter', price: '$0', active: false }, { name: 'Pro', price: '$29', active: true }, { name: 'Ent.', price: 'Custom', active: false }].map(p => (
              <div key={p.name} style={{ backgroundColor: p.active ? brand : panel, border: `1px solid ${p.active ? brand : border}`, borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '8.5px', fontWeight: 600, color: p.active ? '#fff' : text, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: p.active ? '#fff' : text }}>{p.price}</div>
                {p.active && <div style={{ fontSize: '7.5px', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '1px 4px', color: '#fff', marginTop: 2 }}>Popular</div>}
              </div>
            ))}
          </div>
        </div>
      )

    // ── CTA ───────────────────────────────────────────────────────────────
    case 'cta-centered':
      return (
        <div style={{ ...s, padding: '14px 16px', textAlign: 'center', background: `linear-gradient(135deg, ${brandSub}, ${bg})` }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: text, marginBottom: 3 }}>Ready to get started?</div>
          <div style={{ fontSize: '9px', color: muted, marginBottom: 8 }}>Join thousands of teams. Free to start.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <div style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '4px', padding: '3px 8px' }}>
              <span style={{ fontSize: '8.5px', color: muted }}>you@company.com</span>
            </div>
            <div style={{ backgroundColor: brand, color: '#fff', borderRadius: '4px', padding: '3px 10px', fontSize: '8.5px', fontWeight: 600 }}>Start free →</div>
          </div>
        </div>
      )

    case 'newsletter':
      return (
        <div style={{ ...s, padding: '12px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: text, marginBottom: 2 }}>Stay in the loop</div>
          <div style={{ fontSize: '8.5px', color: muted, marginBottom: 6 }}>Weekly insights. No spam, unsubscribe anytime.</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
            <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '3px 10px', flex: 1, maxWidth: 100 }}>
              <span style={{ fontSize: '8px', color: muted }}>email@...</span>
            </div>
            <div style={{ backgroundColor: brand, color: '#fff', borderRadius: '4px', padding: '3px 10px', fontSize: '8.5px', fontWeight: 600 }}>Subscribe</div>
          </div>
        </div>
      )

    // ── Auth ──────────────────────────────────────────────────────────────
    case 'auth-login-card':
      return (
        <div style={{ ...s, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px', background: `linear-gradient(135deg, ${brandSub} 0%, ${bg} 100%)` }}>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '8px', padding: '12px 14px', width: '120px' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 700, color: text, marginBottom: 8, textAlign: 'center' }}>Sign in</div>
            {['Email', 'Password'].map(f => (
              <div key={f} style={{ marginBottom: 5 }}>
                <div style={{ fontSize: '7.5px', color: muted, marginBottom: 1 }}>{f}</div>
                <div style={{ height: 14, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
              </div>
            ))}
            <div style={{ backgroundColor: brand, color: '#fff', borderRadius: '4px', padding: '4px 0', textAlign: 'center', fontSize: '8.5px', fontWeight: 600, marginTop: 6 }}>Sign in</div>
          </div>
        </div>
      )

    case 'auth-split-panel':
      return (
        <div style={{ ...s, display: 'flex', height: '64px' }}>
          <div style={{ flex: 1, background: `linear-gradient(135deg, ${brand}, ${accent})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginBottom: 3 }}>Welcome back</div>
            <div style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.7)' }}>Sign in to continue to your workspace.</div>
          </div>
          <div style={{ flex: 1, backgroundColor: panel, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px 12px', gap: 4 }}>
            {['Email', 'Password'].map(f => (
              <div key={f} style={{ height: 12, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
            ))}
            <div style={{ backgroundColor: brand, color: '#fff', borderRadius: '3px', padding: '3px 0', textAlign: 'center', fontSize: '8px', fontWeight: 600 }}>Continue →</div>
          </div>
        </div>
      )

    // ── Dashboard ─────────────────────────────────────────────────────────
    case 'kpi-cards-row':
      return (
        <div style={{ ...s, padding: '8px 10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
            {[{ label: 'Revenue', val: '$48.2K', delta: '+12%', up: true }, { label: 'Users', val: '2,840', delta: '+8%', up: true }, { label: 'Churn', val: '2.4%', delta: '-0.3%', up: false }, { label: 'NPS', val: '72', delta: '+4', up: true }].map(k => (
              <div key={k.label} style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '5px', padding: '6px' }}>
                <div style={{ fontSize: '7.5px', color: muted, marginBottom: 2 }}>{k.label}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: text, marginBottom: 1 }}>{k.val}</div>
                <div style={{ fontSize: '7.5px', color: k.up ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{k.delta}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'activity-feed':
      return (
        <div style={{ ...s, padding: '8px 10px' }}>
          <div style={{ fontSize: '9px', fontWeight: 600, color: text, marginBottom: 6 }}>Recent activity</div>
          {[
            { user: 'S', action: 'Created project "Design Hub"', time: '2m ago' },
            { user: 'M', action: 'Deployed to production', time: '15m ago' },
            { user: 'A', action: 'Invited 3 team members', time: '1h ago' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: brand, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 700, flexShrink: 0 }}>{item.user}</div>
              <div style={{ flex: 1, fontSize: '8px', color: muted, lineHeight: 1.3 }}>{item.action}</div>
              <div style={{ fontSize: '7.5px', color: muted, opacity: 0.6, flexShrink: 0 }}>{item.time}</div>
            </div>
          ))}
        </div>
      )

    case 'data-table':
      return (
        <div style={{ ...s, padding: '8px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <div style={{ fontSize: '9px', fontWeight: 600, color: text }}>Users</div>
            <div style={{ backgroundColor: brand, color: '#fff', borderRadius: '3px', padding: '2px 6px', fontSize: '7.5px', fontWeight: 600 }}>+ Invite</div>
          </div>
          <div style={{ border: `1px solid ${border}`, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', backgroundColor: bg, borderBottom: `1px solid ${border}`, padding: '3px 6px' }}>
              {['Name', 'Email', 'Status'].map(h => <div key={h} style={{ fontSize: '7.5px', fontWeight: 600, color: muted }}>{h}</div>)}
            </div>
            {['Sarah K.', 'Marcus L.', 'Aisha M.'].map((name, i) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', backgroundColor: i % 2 ? bg : panel, padding: '3px 6px', borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}>
                <div style={{ fontSize: '7.5px', color: text }}>{name}</div>
                <div style={{ fontSize: '7.5px', color: muted }}>{name.toLowerCase().replace(' ', '.')}@co.io</div>
                <div style={{ fontSize: '7px', color: '#22c55e', fontWeight: 600 }}>Active</div>
              </div>
            ))}
          </div>
        </div>
      )

    // ── Footer ────────────────────────────────────────────────────────────
    case 'footer-multi-column':
      return (
        <div style={{ ...s, padding: '10px 14px', backgroundColor: panel, borderTop: `1px solid ${border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700, color: brand, fontSize: '11px', marginBottom: 4 }}>Logo</div>
              <div style={{ fontSize: '8px', color: muted, lineHeight: 1.4 }}>Build great products with great teams.</div>
            </div>
            {['Product', 'Company', 'Legal'].map(col => (
              <div key={col}>
                <div style={{ fontSize: '8.5px', fontWeight: 600, color: text, marginBottom: 4 }}>{col}</div>
                {['Features', 'Pricing', 'About'].map(link => (
                  <div key={link} style={{ fontSize: '8px', color: muted, marginBottom: 2 }}>{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '7.5px', color: muted }}>© 2025 Company Inc.</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['𝕏','in','gh'].map(s => <div key={s} style={{ fontSize: '8px', color: muted }}>{s}</div>)}
            </div>
          </div>
        </div>
      )

    case 'footer-minimal':
      return (
        <div style={{ ...s, padding: '8px 14px', backgroundColor: panel, borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '8px', color: muted }}>© 2025 Company</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => <div key={l} style={{ fontSize: '8px', color: muted }}>{l}</div>)}
          </div>
        </div>
      )

    // ── Empty States ──────────────────────────────────────────────────────
    case 'empty-no-data':
      return (
        <div style={{ ...s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px', gap: 5 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: brandSub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📭</div>
          <div style={{ fontSize: '9.5px', fontWeight: 600, color: text }}>Nothing here yet</div>
          <div style={{ fontSize: '8px', color: muted, textAlign: 'center' }}>Get started by creating your first item.</div>
          <div style={{ backgroundColor: brand, color: '#fff', borderRadius: radius, padding: '3px 10px', fontSize: '8.5px', fontWeight: 600 }}>+ Create new</div>
        </div>
      )

    // ── Banners ───────────────────────────────────────────────────────────
    case 'alert-banner':
      return (
        <div style={{ ...s, padding: '0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '4px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '10px' }}>⚠️</span>
            <span style={{ fontSize: '8.5px', color: '#92400e', fontWeight: 500 }}>Scheduled maintenance on Dec 15 at 3am UTC.</span>
          </div>
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '4px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: '10px' }}>✅</span>
            <span style={{ fontSize: '8.5px', color: '#166534', fontWeight: 500 }}>Your deployment is live!</span>
          </div>
        </div>
      )

    // ── Forms ─────────────────────────────────────────────────────────────
    case 'contact-form':
      return (
        <div style={{ ...s, padding: '10px 12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: text, marginBottom: 6 }}>Get in touch</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 4 }}>
            <div><div style={{ fontSize: '7.5px', color: muted, marginBottom: 1 }}>Name</div><div style={{ height: 14, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} /></div>
            <div><div style={{ fontSize: '7.5px', color: muted, marginBottom: 1 }}>Email</div><div style={{ height: 14, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} /></div>
          </div>
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: '7.5px', color: muted, marginBottom: 1 }}>Message</div>
            <div style={{ height: 24, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
          </div>
          <div style={{ backgroundColor: brand, color: '#fff', borderRadius: '4px', padding: '4px 0', textAlign: 'center', fontSize: '8.5px', fontWeight: 600 }}>Send message →</div>
        </div>
      )

    case 'onboarding-stepper':
      return (
        <div style={{ ...s, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
            {['Profile', 'Team', 'Plan', 'Done'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: i === 0 ? brand : i < 2 ? `${brand}40` : border, color: i === 0 ? '#fff' : muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 700 }}>{i < 1 ? '✓' : i + 1}</div>
                <div style={{ fontSize: '7.5px', color: i === 0 ? text : muted, fontWeight: i === 0 ? 600 : 400 }}>{step}</div>
                {i < 3 && <div style={{ width: 10, height: 1, backgroundColor: border }} />}
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '5px', padding: '8px' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 600, color: text, marginBottom: 3 }}>Set up your profile</div>
            <div style={{ height: 12, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px', marginBottom: 3 }} />
            <div style={{ height: 12, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px', marginBottom: 6 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              <div style={{ border: `1px solid ${border}`, borderRadius: '3px', padding: '2px 8px', fontSize: '7.5px', color: muted }}>Back</div>
              <div style={{ background: brand, color: '#fff', borderRadius: '3px', padding: '2px 8px', fontSize: '7.5px', fontWeight: 600 }}>Continue →</div>
            </div>
          </div>
        </div>
      )

    // ── Default ───────────────────────────────────────────────────────────
    default:
      return (
        <div style={{ ...s, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px', gap: 4, opacity: 0.6 }}>
          <div style={{ width: 24, height: 24, borderRadius: '6px', background: brandSub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>⬡</div>
          <div style={{ fontSize: '9px', color: muted }}>{section.name}</div>
        </div>
      )
  }
}

// ─── Complexity badge ─────────────────────────────────────────────────────────

function ComplexityBadge({ level }: { level: SectionDef['complexity'] }) {
  const map = {
    simple:  { label: 'Simple',  color: '#22c55e', bg: '#dcfce7' },
    medium:  { label: 'Medium',  color: '#f59e0b', bg: '#fef3c7' },
    complex: { label: 'Complex', color: '#8b5cf6', bg: '#ede9fe' },
  }
  const { label, color, bg } = map[level]
  return (
    <span style={{ background: bg, color, fontSize: '9px', fontWeight: 600, padding: '1px 6px', borderRadius: '10px' }}>
      {label}
    </span>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ section }: { section: SectionDef }) {
  return (
    <div className="group flex flex-col gap-0 rounded-app-lg border border-app-border bg-app-surface hover:border-app-accent/50 transition-all duration-150 overflow-hidden hover:shadow-sm">
      {/* Live preview */}
      <div className="shrink-0 border-b border-app-border bg-app-inset overflow-hidden" style={{ minHeight: 72 }}>
        <SectionPreview section={section} />
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11.5px] font-semibold text-app-text leading-tight">{section.name}</p>
          <ComplexityBadge level={section.complexity} />
        </div>
        <p className="text-[10px] text-app-subtle leading-relaxed line-clamp-2">{section.description}</p>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {section.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Category pill ────────────────────────────────────────────────────────────

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick(): void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 h-6 px-3 rounded-full text-[10px] font-medium transition-colors duration-100 whitespace-nowrap',
        active
          ? 'bg-app-accent text-app-on-accent'
          : 'bg-app-elevated border border-app-border text-app-subtle hover:text-app-muted',
      )}
    >
      {label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SectionsSection() {
  const category    = useHub((s) => s.sectionsCategory)
  const query       = useHub((s) => s.sectionsQuery)
  const setCategory = useHub((s) => s.setSectionsCategory)
  const setQuery    = useHub((s) => s.setSectionsQuery)

  const filtered = useMemo(
    () => filterSections(query, category),
    [query, category],
  )

  const categoryGroups = useMemo(() => {
    const used = new Set(SECTIONS_LIBRARY.map(s => s.category))
    return SECTION_CATEGORY_ORDER.filter(c => used.has(c))
  }, [])

  // Group filtered results by category
  const grouped = useMemo(() => {
    const map = new Map<SectionCategory, SectionDef[]>()
    filtered.forEach(s => {
      const list = map.get(s.category) ?? []
      list.push(s)
      map.set(s.category, list)
    })
    return map
  }, [filtered])

  const shownCategories = (category
    ? [category as SectionCategory]
    : SECTION_CATEGORY_ORDER
  ).filter(c => (grouped.get(c)?.length ?? 0) > 0)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 flex flex-col gap-2 px-5 py-3 border-b border-app-border bg-app-surface">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Layers2 size={13} className="text-app-accent shrink-0" />
          <p className="text-[11px] font-semibold text-app-text">Page Sections</p>
          <span className="text-[9.5px] font-mono text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full ml-auto">
            {filtered.length} sections
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-app-subtle pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search sections…"
            className="w-full h-7 pl-7 pr-3 rounded-app-sm bg-app-elevated border border-app-border text-[11px] text-app-text placeholder:text-app-subtle outline-none focus:border-app-accent"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          <CategoryPill label="All" active={!category} onClick={() => setCategory(null)} />
          {categoryGroups.map(c => (
            <CategoryPill
              key={c}
              label={SECTION_CATEGORY_LABELS[c]}
              active={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>
      </div>

      {/* Section grid */}
      <div className="flex-1 overflow-y-auto app-scroll px-5 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="h-10 w-10 rounded-xl bg-app-elevated border border-app-border flex items-center justify-center">
              <Layers2 size={18} className="text-app-subtle" />
            </div>
            <p className="text-sm font-medium text-app-text">No sections found</p>
            <p className="text-xs text-app-subtle">Try a different search or category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {shownCategories.map(cat => {
              const items = grouped.get(cat) ?? []
              if (items.length === 0) return null
              return (
                <section key={cat}>
                  <div className="flex items-baseline gap-2 mb-3">
                    <h2 className="text-[11px] font-semibold text-app-text">
                      {SECTION_CATEGORY_LABELS[cat]}
                    </h2>
                    <span className="text-[10px] text-app-subtle font-mono">{items.length}</span>
                  </div>
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                    {items.map(s => <SectionCard key={s.id} section={s} />)}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
