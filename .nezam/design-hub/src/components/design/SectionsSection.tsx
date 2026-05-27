'use client'

import { useMemo } from 'react'
import { Layers2, Check, ArrowRight, User, Shield, Star, DollarSign, Activity } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { cn } from '@/lib/utils'
import {
  SECTIONS_LIBRARY,
  SECTION_CATEGORY_LABELS,
  type SectionDef,
  type SectionCategory,
} from '@/data/sections-library'
import { SectionsSidebar } from './SectionsSidebar'
import { PreviewSubTabs } from '@/components/preview/PreviewSubTabs'

// ─── Live Section Previews (Full-Page Masterpieces) ──────────────────────────

function SectionPreview({ section }: { section: SectionDef }) {
  const tokens = useHub((s) => s.design.tokens)

  const brand = tokens.colors.brand['500']
  const brandSub = tokens.colors.brand['100']
  const panel = tokens.colors.surface.panel
  const border = tokens.colors.surface.border
  const text = tokens.colors.text.primary
  const muted = tokens.colors.text.muted
  const bg = tokens.colors.surface.bg
  const accent = tokens.colors.accent['500']
  const radius = tokens.radius.md

  const containerStyle: React.CSSProperties = {
    backgroundColor: bg,
    color: text,
    fontFamily: tokens.typography.sans,
    borderRadius: radius,
    overflow: 'hidden',
    fontSize: '10.5px',
    lineHeight: '1.4',
    border: `1px solid ${border}`,
    position: 'relative',
    minHeight: '172px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }

  const SHARED = { bg, panel, border, text, muted, brand, brandSub, accent, radius }

  // Draw a standard premium visual image card inside the heros/CTAs
  const renderVisualMock = (width = '100%', height = '76px') => (
    <div 
      style={{ 
        width, 
        height, 
        background: panel, 
        border: `1px solid ${border}`, 
        borderRadius: '6px',
        padding: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', gap: '3px', marginBottom: '2px' }}>
        {['#ef4444', '#f59e0b', '#10b981'].map((c) => (
          <div key={c} style={{ width: '4px', height: '4px', borderRadius: '50%', background: c }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        <div style={{ width: '22px', borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '3px', borderRadius: '1.5px', background: i === 1 ? brand : border, width: i === 1 ? '100%' : '75%' }} />
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ height: '5px', width: '40%', background: brand, borderRadius: '2px' }} />
          <div style={{ height: '3px', width: '90%', background: border, borderRadius: '1px' }} />
          <div style={{ height: '3px', width: '70%', background: border, borderRadius: '1px' }} />
          <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
            <div style={{ height: '10px', width: '20px', background: accent, borderRadius: '2px' }} />
            <div style={{ height: '10px', width: '15px', background: border, border: `1px solid ${border}`, borderRadius: '2px' }} />
          </div>
        </div>
      </div>
    </div>
  )

  switch (section.id) {

    // ── Navigation ────────────────────────────────────────────────────────
    case 'navbar-centered':
      return (
        <div style={{ ...containerStyle, padding: '12px 18px', backgroundColor: panel, borderBottom: `2px solid ${border}`, minHeight: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '8px', fontWeight: 'bold' }}>N</div>
              <span style={{ fontWeight: 800, color: text, fontSize: '11px', letterSpacing: '-0.02em' }}>Nezaam</span>
            </div>
            <div style={{ display: 'flex', gap: '14px', color: muted, fontSize: '9px', fontWeight: 600 }}>
              {['Home', 'Products', 'Pricing', 'Company'].map((l, i) => (
                <span key={l} style={{ color: i === 0 ? brand : 'inherit', cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={{ border: `1px solid ${border}`, color: text, borderRadius: '4px', padding: '3px 8px', fontSize: '9px', fontWeight: 'bold', background: 'transparent' }}>Sign In</button>
              <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 10px', fontSize: '9px', fontWeight: 'bold' }}>Start Free</button>
            </div>
          </div>
        </div>
      )

    case 'navbar-saas':
      return (
        <div style={{ ...containerStyle, padding: '10px 16px', backgroundColor: panel, borderBottom: `2px solid ${border}`, minHeight: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px' }}>⚡</span>
                <span style={{ fontWeight: 900, color: text, fontSize: '11.5px', letterSpacing: '-0.03em' }}>NEZAAM</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', color: muted, fontSize: '8.5px', fontWeight: 700 }}>
                <span style={{ color: text, display: 'flex', alignItems: 'center', gap: '2px' }}>Solutions <span style={{ fontSize: '7px' }}>▼</span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>Resources <span style={{ fontSize: '7px' }}>▼</span></span>
                <span>Pricing</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: bg, border: `1px solid ${border}`, borderRadius: '4px', padding: '2px 6px', width: '90px' }}>
                <span style={{ fontSize: '8px', color: muted, marginRight: '4px' }}>🔍</span>
                <span style={{ fontSize: '8px', color: muted }}>Search...</span>
              </div>
              <div style={{ position: 'relative', fontSize: '10px', cursor: 'pointer' }}>
                🔔
                <span style={{ position: 'absolute', top: '-1px', right: '-1px', width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
              </div>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: brand, color: '#fff', fontSize: '7px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AD</div>
            </div>
          </div>
        </div>
      )

    case 'sidebar-app':
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', minHeight: '172px' }}>
          <div style={{ width: '64px', backgroundColor: panel, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', padding: '10px 5px', gap: '8px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '4px', paddingLeft: '4px' }}>
                <span style={{ fontSize: '9px' }}>🪐</span>
                <span style={{ fontWeight: 900, color: brand, fontSize: '9px', letterSpacing: '-0.02em' }}>NZM</span>
              </div>
              {[
                { label: 'Dashboard', icon: '▣' },
                { label: 'Team Space', icon: '◈' },
                { label: 'SLA Plan', icon: '◉' },
                { label: 'Settings', icon: '⚙' }
              ].map((item, i) => (
                <div key={item.label} style={{ fontSize: '8px', color: i === 0 ? brand : muted, padding: '3px 4px', background: i === 0 ? brandSub : 'transparent', borderRadius: '3px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{item.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', borderTop: `1px solid ${border}`, paddingTop: '6px', paddingLeft: '2px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: brand, color: '#fff', fontSize: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>EG</div>
              <span style={{ fontSize: '7px', fontWeight: 800, color: text }}>Egypt</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', background: bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '11px' }}>Core Dashboard</span>
              <span style={{ fontSize: '7.5px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>● Active</span>
            </div>
            {renderVisualMock('100%', '112px')}
          </div>
        </div>
      )

    case 'sidebar-minimal':
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', minHeight: '172px' }}>
          <div style={{ width: '28px', backgroundColor: panel, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '12px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 'bold' }}>N</div>
              {['⚡', '⚙', '📊', '🛡'].map((icon, i) => (
                <div key={i} style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', background: i === 0 ? brandSub : 'transparent', color: i === 0 ? brand : muted, fontSize: '9.5px', cursor: 'pointer' }}>
                  {icon}
                </div>
              ))}
            </div>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '6px', fontWeight: 'bold' }}>M</div>
          </div>
          <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', background: bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '10.5px' }}>Workspace Nodes</span>
              <span style={{ fontSize: '8px', color: muted }}>Port: 4000</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {['Cairo Core', 'Sahel Sync'].map((node, i) => (
                <div key={node} style={{ background: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px' }}>
                  <p style={{ fontSize: '8.5px', fontWeight: 'bold', margin: 0 }}>{node}</p>
                  <p style={{ fontSize: '7px', color: i === 0 ? '#22c55e' : muted, margin: '2px 0 0 0' }}>● {i === 0 ? 'online' : 'standby'}</p>
                </div>
              ))}
            </div>
            {renderVisualMock('100%', '64px')}
          </div>
        </div>
      )

    case 'breadcrumbs':
      return (
        <div style={{ ...containerStyle, padding: '14px 18px', backgroundColor: panel, borderBottom: `1px solid ${border}`, minHeight: 'fit-content', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: 600 }}>
              <span style={{ color: muted }}>Home</span>
              <span style={{ color: border }}>/</span>
              <span style={{ color: muted }}>Projects</span>
              <span style={{ color: border }}>/</span>
              <span style={{ color: brand, fontWeight: 700 }}>Nezaam Design Hub</span>
              <span style={{ color: border }}>/</span>
              <span style={{ color: text, fontWeight: 700 }}>Syncs</span>
            </div>
            <div style={{ fontSize: '8.5px', color: muted, fontStyle: 'italic' }}>Last sync: 2m ago</div>
          </div>
        </div>
      )

    case 'tab-bar':
      return (
        <div style={{ ...containerStyle, backgroundColor: panel, padding: '0px 14px', display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: 'fit-content', borderBottom: `1.5px solid ${border}` }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['Dashboard', 'Team Members', 'Usage Analytics', 'Integrations', 'Billing Logs'].map((tab, i) => (
              <div 
                key={tab} 
                style={{ 
                  padding: '10px 12px', 
                  fontSize: '9.5px', 
                  color: i === 0 ? brand : muted, 
                  borderBottom: i === 0 ? `2.5px solid ${brand}` : '2.5px solid transparent', 
                  fontWeight: i === 0 ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      )

    // ── Hero ──────────────────────────────────────────────────────────────
    case 'hero-centered':
      return (
        <div style={{ ...containerStyle, padding: '18px 20px', textAlign: 'center', gap: '10px', background: `radial-gradient(circle at top, ${brandSub} 0%, ${bg} 100%)` }}>
          <div>
            <div style={{ display: 'inline-flex', background: brandSub, color: brand, borderRadius: '20px', padding: '2px 8px', fontSize: '8.5px', fontWeight: 'bold', marginBottom: '6px', border: `1px solid ${brand}20` }}>✦ New version available</div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: text, letterSpacing: '-0.02em', marginBottom: '4px', lineHeight: '1.2' }}>Create enterprise apps at warp speed</h1>
            <p style={{ fontSize: '9px', color: muted, maxWidth: '290px', margin: '0 auto', lineHeight: '1.3' }}>Deploy serverless code, manage robust UI assets, and verify performance instantly in Nezaam design hub.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: radius, padding: '4.5px 14px', fontSize: '9px', fontWeight: 'bold' }}>Start Deploying</button>
            <button style={{ border: `1px solid ${border}`, color: text, background: 'transparent', borderRadius: radius, padding: '4.5px 14px', fontSize: '9px', fontWeight: 'bold' }}>Schedule Demo</button>
          </div>
          <div style={{ marginTop: '4px', border: `1px solid ${border}`, borderRadius: '6px', overflow: 'hidden', padding: '3px', background: panel }}>
            {renderVisualMock('100%', '58px')}
          </div>
        </div>
      )

    case 'hero-split':
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', padding: '16px', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '8px', fontWeight: 'extrabold', color: brand,  textTransform: 'uppercase', letterSpacing: '0.05em' }}>DEPLOYMENTS PANEL</span>
            <h1 style={{ fontSize: '15px', fontWeight: 800, color: text, letterSpacing: '-0.02em', lineHeight: '1.2' }}>Unified Operations Dashboard</h1>
            <p style={{ fontSize: '9px', color: muted, lineHeight: '1.3' }}>One place to build and inspect all design tokens, components, and code hooks.</p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: radius, padding: '4px 12px', fontSize: '8.5px', fontWeight: 'bold' }}>Get Started</button>
              <button style={{ border: `1px solid ${border}`, color: text, background: 'transparent', borderRadius: radius, padding: '4px 12px', fontSize: '8.5px', fontWeight: 'bold' }}>Learn more</button>
            </div>
          </div>
          <div style={{ flex: 0.8 }}>
            {renderVisualMock('100%', '110px')}
          </div>
        </div>
      )

    case 'hero-gradient':
      return (
        <div style={{ ...containerStyle, padding: '18px 16px', background: `linear-gradient(135deg, ${brand} 0%, ${accent} 100%)`, color: '#fff', textAlign: 'center', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.2' }}>The Digital Hub for Cairo Operators</h1>
            <p style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.85)', maxWidth: '310px', margin: '4px auto 0 auto', lineHeight: '1.3' }}>Synchronize multi-tenant billing models and dynamic regional configurations seamlessly.</p>
          </div>
          <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'center' }}>
            <button style={{ background: '#fff', color: brand, border: 'none', borderRadius: radius, padding: '5px 14px', fontSize: '9px', fontWeight: 'bold' }}>Activate Account</button>
            <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', borderRadius: radius, padding: '5px 14px', fontSize: '9px', fontWeight: 'bold' }}>View Pricing</button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '40px', width: '90%', margin: '0 auto', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold' }}>
            [Interactive Node Cluster Map - Active]
          </div>
        </div>
      )

    case 'hero-video':
      return (
        <div style={{ ...containerStyle, padding: '16px', textAlign: 'center', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '8px', fontWeight: 'bold', color: brand }}>SAHEL LAUNCH PRESENTATION</span>
            <h1 style={{ fontSize: '14.5px', fontWeight: 800, marginTop: '2px' }}>Explore the new Visual Design Engine</h1>
            <p style={{ fontSize: '8.5px', color: muted, maxWidth: '280px', margin: '2px auto 0 auto' }}>Watch our local Cairo engineering team showcase live border and outline sliders.</p>
          </div>
          <div style={{ position: 'relative', width: '80%', height: '76px', margin: '0 auto', background: '#111827', borderRadius: '6px', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>▶</div>
            <div style={{ position: 'absolute', bottom: '4px', left: '6px', fontSize: '7px', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>02:44 / 12:10</div>
          </div>
        </div>
      )

    case 'hero-app':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', background: `linear-gradient(180deg, ${brandSub} 0%, ${bg} 100%)`, gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '-0.01em' }}>Manage Billing & Pipelines</h1>
            <p style={{ fontSize: '8.5px', color: muted, marginTop: '2px' }}>Fully interactive dashboard interface with mock analytics</p>
          </div>
          {renderVisualMock('100%', '112px')}
        </div>
      )

    case 'hero-announcement':
      return (
        <div style={{ ...containerStyle, gap: '6px' }}>
          <div style={{ background: brand, color: '#fff', fontSize: '8.5px', fontWeight: 800, padding: '4px 8px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 4px', borderRadius: '3px', fontSize: '7px' }}>NEW RELEASE</span>
            <span>🎉 Nezaam V7 is officially live for Cairo operators!</span>
          </div>
          <div style={{ padding: '12px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h1 style={{ fontSize: '14px', fontWeight: 800 }}>Digital Sovereignty Redefined</h1>
            <p style={{ fontSize: '9px', color: muted }}>Fully compliant with local SLA regulations and multi-tenant security gates.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '2px' }}>
              <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 10px', fontSize: '8px', fontWeight: 'bold' }}>Get Started</button>
            </div>
          </div>
        </div>
      )

    // ── Features ──────────────────────────────────────────────────────────
    case 'features-grid-3':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 800 }}>Engineered for Scalability</h2>
            <p style={{ fontSize: '8.5px', color: muted }}>Everything you need to deliver premium product interfaces</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
            {[
              { ic: '⚡', t: 'Instant Sync', d: 'Token changes propagate in 2ms.' },
              { ic: '🔒', t: 'AA Compliant', d: 'Rigorous accessibility verification.' },
              { ic: '📊', t: 'Live Preview', d: 'Inspect responsive CSS variables.' }
            ].map(f => (
              <div key={f.t} style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px' }}>
                <span style={{ fontSize: '12px' }}>{f.ic}</span>
                <p style={{ fontSize: '9px', fontWeight: 'bold', margin: '2px 0 1px 0' }}>{f.t}</p>
                <p style={{ fontSize: '7.5px', color: muted, lineHeight: '1.2' }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'features-alternating':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '7px', fontWeight: 'bold', color: brand }}>INTEGRITY INDEX</span>
              <p style={{ fontSize: '9.5px', fontWeight: 'bold', margin: 0 }}>Automated HSL Generation</p>
              <p style={{ fontSize: '8px', color: muted, margin: 0 }}>Maintain strict contrast thresholds with WCAG AAA rules.</p>
            </div>
            <div style={{ flex: 0.8 }}>
              {renderVisualMock('100%', '42px')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: `1px solid ${border}`, paddingTop: '8px' }}>
            <div style={{ flex: 0.8 }}>
              {renderVisualMock('100%', '42px')}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '7px', fontWeight: 'bold', color: accent }}>DYNAMIC SCALING</span>
              <p style={{ fontSize: '9.5px', fontWeight: 'bold', margin: 0 }}>Fluid Border Sliders</p>
              <p style={{ fontSize: '8px', color: muted, margin: 0 }}>Animate outlines reactively on client layouts in 2.4ms.</p>
            </div>
          </div>
        </div>
      )

    case 'features-tabs':
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', minHeight: '172px' }}>
          <div style={{ width: '56px', backgroundColor: panel, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', padding: '12px 4px', gap: '6px' }}>
            <span style={{ fontSize: '7.5px', fontWeight: 'bold', color: muted, paddingLeft: '4px', marginBottom: '2px' }}>MODULES</span>
            {[
              { label: 'Speed', active: true },
              { label: 'Security', active: false },
              { label: 'Scaling', active: false }
            ].map((tab) => (
              <div key={tab.label} style={{ fontSize: '8px', padding: '3px 6px', borderRadius: '4px', background: tab.active ? brandSub : 'transparent', color: tab.active ? brand : muted, fontWeight: 'bold', cursor: 'pointer' }}>
                {tab.label}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', background: bg }}>
            <h3 style={{ fontSize: '10.5px', fontWeight: 'bold', margin: 0 }}>SLA Performance Engine</h3>
            <p style={{ fontSize: '8px', color: muted, margin: 0 }}>Egypt digital infrastructure benefits from robust multithreading nodes.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
              {['2.4ms sync latency', 'WCAG AAA compliance', 'Automatic local currency billing support'].map(chk => (
                <div key={chk} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '7.5px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span> {chk}
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'features-comparison':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 800 }}>Why Egypt Operators choose Nezaam</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {/* Legacy */}
            <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px' }}>
              <span style={{ fontSize: '7px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>LEGACY PIPELINES</span>
              <p style={{ fontSize: '8px', fontWeight: 'bold', margin: '4px 0 2px 0' }}>Stale & Slow</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '7px', color: muted }}>
                <span>❌ 2.4s global sync latency</span>
                <span>❌ Manual CSS overrides</span>
                <span>❌ Hardcoded layout boundaries</span>
              </div>
            </div>
            {/* Nezaam */}
            <div style={{ background: panel, border: `1.5px solid ${brand}`, borderRadius: '4px', padding: '6px', position: 'relative' }}>
              <span style={{ fontSize: '7px', background: brandSub, color: brand, padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>NEZAAM ACTIVE</span>
              <p style={{ fontSize: '8px', fontWeight: 'bold', margin: '4px 0 2px 0' }}>Real-time Hub</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '7px' }}>
                <span>✅ 2.4ms local sync</span>
                <span>✅ Dynamic HSL harmonies</span>
                <span>✅ Interactive border slider</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'bento-grid':
      return (
        <div style={{ ...containerStyle, padding: '10px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gridTemplateRows: 'auto auto', gap: '6px' }}>
          <div style={{ gridRow: '1 / 3', backgroundColor: brand, borderRadius: '6px', padding: '10px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '15px' }}>⚡</span>
              <p style={{ fontSize: '11px', fontWeight: 800, marginTop: '4px', margin: 0 }}>Bouncy Animations</p>
              <p style={{ fontSize: '8.5px', opacity: 0.85, margin: '2px 0 0 0' }}>Spring transitions applied globally.</p>
            </div>
            <div style={{ height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', width: '100%' }} />
          </div>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px' }}>
            <span style={{ fontSize: '8.5px', fontWeight: 'bold', color: accent }}>Live Analytics</span>
            <div style={{ height: '14px', background: `linear-gradient(90deg, ${brand} 75%, ${accent} 100%)`, borderRadius: '3px', marginTop: '4px', opacity: 0.85 }} />
          </div>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '6px' }}>✓</div>
            <div>
              <p style={{ fontSize: '8.5px', fontWeight: 'bold', margin: 0 }}>Teams Connected</p>
              <p style={{ fontSize: '7.5px', color: muted, margin: 0 }}>4 operators active</p>
            </div>
          </div>
        </div>
      )

    // ── Social Proof ──────────────────────────────────────────────────────
    case 'testimonials-grid':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '6px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 800 }}>Loved by Modern Developers</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
            {[
              { n: 'Sarah K.', r: 'CTO, Stripe', q: '"Transformed our design execution."' },
              { n: 'Marcus L.', r: 'VP Engineering', q: '"Bouncy spring interactions are a game changer."' },
              { n: 'Aisha M.', r: 'Product Head', q: '"Contrast scaling is flawless."' }
            ].map((t, idx) => (
              <div key={idx} style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{ color: '#fbbf24', fontSize: '8px' }}>★★★★★</span>
                <p style={{ fontSize: '8px', fontStyle: 'italic', color: muted, margin: '2px 0 4px 0', lineHeight: '1.2' }}>{t.q}</p>
                <div>
                  <p style={{ fontSize: '8.5px', fontWeight: 'bold', margin: 0 }}>{t.n}</p>
                  <p style={{ fontSize: '7px', color: muted, margin: 0 }}>{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'testimonials-carousel':
      return (
        <div style={{ ...containerStyle, padding: '16px 20px', background: `linear-gradient(to right, ${brandSub}, ${bg})`, gap: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '24px', color: brand, opacity: 0.3, display: 'block', height: '14px', lineHeight: 1 }}>“</span>
          <p style={{ fontSize: '10.5px', fontStyle: 'italic', fontWeight: 600, color: text, margin: '0 auto', maxWidth: '320px', lineHeight: '1.3' }}>
            The speed of the HSL generator and border control saves our design and development teams hours every week. Essential for regional startups.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: brand, color: '#fff', fontSize: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LW</div>
            <div>
              <span style={{ fontSize: '8px', fontWeight: 'bold', display: 'block' }}>Lana W.</span>
              <span style={{ fontSize: '7px', color: muted, display: 'block' }}>CTO, Nezaam Cairo Hub</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '2px' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: brand }} />
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: border }} />
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: border }} />
          </div>
        </div>
      )

    case 'logos-bar':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', backgroundColor: panel, minHeight: 'fit-content', justifyContent: 'center' }}>
          <p style={{ textAlign: 'center', fontSize: '8px', fontWeight: 'bold', color: muted,  textTransform: 'uppercase',  letterSpacing: '0.05em', marginBottom: '8px', margin: 0 }}>Empowering operations at these institutions</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', opacity: 0.65, marginTop: '6px' }}>
            {['stripe', 'vercel', 'linear', 'figma', 'notion', 'nezaam'].map(name => (
              <span key={name} style={{ fontSize: '10px', fontWeight: 800, color: text, textTransform: 'uppercase' }}>{name}</span>
            ))}
          </div>
        </div>
      )

    case 'stats-strip':
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: '14px 0', backgroundColor: panel, minHeight: 'fit-content' }}>
          {[
            ['10K+', 'Developers active'],
            ['99.99%', 'Performance uptime'],
            ['4.96★', 'Average rating'],
            ['50M', 'Operations/month']
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: val.includes('★') ? '#fbbf24' : brand, letterSpacing: '-0.02em' }}>{val}</div>
              <div style={{ fontSize: '8px', color: muted, fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      )

    case 'case-study-card':
      return (
        <div style={{ ...containerStyle, padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '7.5px', background: brandSub, color: brand, padding: '1px 5px', borderRadius: '3px', fontWeight: 'extrabold' }}>CASE STUDY</span>
            <span style={{ fontSize: '7.5px', color: muted }}>Read-time: 4 mins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '20px', fontWeight: 900, color: brand, letterSpacing: '-0.03em' }}>+820%</div>
            <div>
              <p style={{ fontSize: '9.5px', fontWeight: 'extrabold', margin: 0 }}>ROI Increase for Sahel PMs</p>
              <p style={{ fontSize: '8px', color: muted, margin: 0 }}>How real-time HSL generation saved 30+ engineering hours weekly.</p>
            </div>
          </div>
          <button style={{ border: `1px solid ${border}`, color: text, borderRadius: '4px', background: 'transparent', padding: '4px 0', fontSize: '8.5px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Read Case Study →</button>
        </div>
      )

    // ── Pricing ───────────────────────────────────────────────────────────
    case 'pricing-3-tiers':
      return (
        <div style={{ ...containerStyle, padding: '12px', gap: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '11px', fontWeight: 800 }}>Simple SaaS Pricing</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
            {[
              { name: 'Developer', price: '$0', desc: 'Personal projects', active: false },
              { name: 'Production Pro', price: '$29', desc: 'Standard business', active: true },
              { name: 'Enterprise', price: 'Custom', desc: 'Custom integrations', active: false }
            ].map(p => (
              <div 
                key={p.name} 
                style={{ 
                  backgroundColor: p.active ? brand : panel, 
                  border: `1.5px solid ${p.active ? brand : border}`, 
                  borderRadius: '6px', 
                  padding: '8px', 
                  color: p.active ? '#fff' : text,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ fontSize: '8.5px', fontWeight: 'bold' }}>{p.name}</div>
                  <div style={{ fontSize: '13px', fontWeight: 900, margin: '2px 0' }}>{p.price}</div>
                  <div style={{ fontSize: '7px', opacity: 0.8 }}>{p.desc}</div>
                </div>
                <button 
                  style={{ 
                    background: p.active ? '#fff' : brand, 
                    color: p.active ? brand : '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    fontSize: '8px', 
                    fontWeight: 'bold', 
                    padding: '2.5px 0', 
                    marginTop: '6px',
                    width: '100%'
                  }}
                >
                  Choose plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )

    case 'pricing-toggle':
      return (
        <div style={{ ...containerStyle, padding: '14px', gap: '8px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', background: panel, border: `1px solid ${border}`, borderRadius: '20px', padding: '2px 4px', margin: '0 auto', gap: '4px' }}>
            <span style={{ fontSize: '7.5px', background: brand, color: '#fff', padding: '2px 8px', borderRadius: '15px', fontWeight: 'bold' }}>Monthly</span>
            <span style={{ fontSize: '7.5px', color: muted, padding: '2px 8px', fontWeight: 'bold' }}>Annually <span style={{ color: '#22c55e', fontSize: '6.5px' }}>Save 20%</span></span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
            <div style={{ background: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold' }}>Starter</span>
              <p style={{ fontSize: '12px', fontWeight: 900, margin: '2px 0' }}>$19<span style={{ fontSize: '7px', fontWeight: 'normal', color: muted }}>/mo</span></p>
            </div>
            <div style={{ background: panel, border: `1.5px solid ${brand}`, borderRadius: '6px', padding: '6px' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: brand }}>Operator Pro</span>
              <p style={{ fontSize: '12px', fontWeight: 900, margin: '2px 0' }}>$49<span style={{ fontSize: '7px', fontWeight: 'normal', color: muted }}>/mo</span></p>
            </div>
          </div>
        </div>
      )

    case 'pricing-comparison-table':
      return (
        <div style={{ ...containerStyle, padding: '12px', gap: '6px' }}>
          <div style={{ fontSize: '9px', fontWeight: 'bold', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
            <span style={{ flex: 1.5 }}>Feature comparison</span>
            <span style={{ flex: 1, textAlign: 'center', color: muted }}>Starter</span>
            <span style={{ flex: 1, textAlign: 'center', color: brand }}>Pro</span>
          </div>
          {[
            { name: 'Cairo Nodes Sync', s: '2.4s', p: '2.4ms' },
            { name: 'Border Slider Range', s: '1-3px', p: '0-6px' },
            { name: 'Active Harmony', s: 'Complementary', p: 'All 6 scales' },
            { name: 'Uptime SLA Gate', s: '99%', p: '99.99%' }
          ].map((row, i) => (
            <div key={i} style={{ fontSize: '7.5px', borderBottom: i < 3 ? `1px dashed ${border}` : 'none', padding: '3px 0', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ flex: 1.5, fontWeight: 600 }}>{row.name}</span>
              <span style={{ flex: 1, textAlign: 'center', color: muted }}>{row.s}</span>
              <span style={{ flex: 1, textAlign: 'center', color: brand, fontWeight: 'bold' }}>{row.p}</span>
            </div>
          ))}
        </div>
      )

    case 'pricing-enterprise':
      return (
        <div style={{ ...containerStyle, padding: '14px 16px', background: `linear-gradient(135deg, ${brand} 0%, #1e1b4b 100%)`, color: '#fff', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '7.5px', background: 'rgba(255,255,255,0.15)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold',  textTransform: 'uppercase' }}>Dedicated Node</span>
              <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#fff', margin: '3px 0 0 0' }}>Nezaam Enterprise Hub</h3>
            </div>
            <span style={{ fontSize: '10px', color: accent }}>💎 VIP SLA</span>
          </div>
          <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Custom databases, custom reverse proxy nodes, and Egyptian Central Bank compliant security controls.</p>
          <button style={{ background: '#fff', color: brand, border: 'none', borderRadius: radius, padding: '4px 0', fontSize: '8.5px', fontWeight: 'bold', width: '100%', marginTop: '4px', cursor: 'pointer' }}>Request Custom Deployment</button>
        </div>
      )

    // ── CTA ───────────────────────────────────────────────────────────────
    case 'cta-centered':
      return (
        <div style={{ ...containerStyle, padding: '18px 20px', textAlign: 'center', gap: '10px', background: `linear-gradient(135deg, ${brandSub}, ${bg})` }}>
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '-0.01em', margin: 0 }}>Ready to optimize your custom design system?</h2>
            <p style={{ fontSize: '9px', color: muted, marginTop: '4px', maxWidth: '320px', margin: '4px auto 0 auto', lineHeight: '1.3' }}>Join thousands of product managers and developers using Egypt's premier operator layout catalog.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', width: '100%', maxWidth: '280px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="you@company.com" 
              style={{ flex: 1, height: '22px', border: `1px solid ${border}`, borderRadius: '4px', background: panel, padding: '0 8px', fontSize: '9px' }} 
              disabled
            />
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '0 10px', fontSize: '9px', fontWeight: 'bold', height: '22px' }}>Start Free</button>
          </div>
        </div>
      )

    case 'cta-split':
      return (
        <div style={{ ...containerStyle, padding: '16px', display: 'flex', flexDirection: 'row', gap: '14px', alignItems: 'center' }}>
          <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 style={{ fontSize: '11.5px', fontWeight: 800, margin: 0 }}>Deploy a production design system in minutes.</h3>
            <p style={{ fontSize: '8.5px', color: muted, margin: 0 }}>Our Cairo engineering gates guarantee 100% security compliance.</p>
          </div>
          <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '4.5px 0', fontSize: '8.5px', fontWeight: 'bold', width: '100%' }}>Deploy to Vercel</button>
            <button style={{ border: `1px solid ${border}`, color: text, background: 'transparent', borderRadius: '4px', padding: '4.5px 0', fontSize: '8.5px', fontWeight: 'bold', width: '100%' }}>Download JSON</button>
          </div>
        </div>
      )

    case 'cta-banner':
      return (
        <div style={{ ...containerStyle, padding: '8px 14px', background: brand, color: '#fff', minHeight: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px' }}>🎁</span>
              <span style={{ fontSize: '8.5px', fontWeight: 'bold' }}>Cairo Tech Launch discount code is active: <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 4px', borderRadius: '2px', fontFamily: 'monospace' }}>MASRI20</span> (20% off Pro)</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button style={{ background: '#fff', color: brand, border: 'none', borderRadius: '3px', fontSize: '8px', fontWeight: 'bold', padding: '2px 6px' }}>Claim Offer</button>
              <span style={{ fontSize: '9px', opacity: 0.7, cursor: 'pointer' }}>✕</span>
            </div>
          </div>
        </div>
      )

    case 'newsletter':
      return (
        <div style={{ ...containerStyle, padding: '14px 16px', gap: '8px', backgroundColor: panel }}>
          <div>
            <h2 style={{ fontSize: '11px', fontWeight: 800 }}>Subscribe to Nezaam Weekly</h2>
            <p style={{ fontSize: '8.5px', color: muted, marginTop: '2px' }}>Professional design tokens, billing pipelines, and Cairo operator checklists.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="text" 
              placeholder="email@company.io" 
              style={{ flex: 1, height: '22px', border: `1px solid ${border}`, borderRadius: '4px', background: bg, padding: '0 8px', fontSize: '9px' }} 
              disabled
            />
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '0 10px', fontSize: '9px', fontWeight: 'bold' }}>Subscribe</button>
          </div>
        </div>
      )

    // ── Content ───────────────────────────────────────────────────────────
    case 'blog-grid':
      return (
        <div style={{ ...containerStyle, padding: '12px', gap: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Knowledge Base Articles</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
            {[
              { cat: 'Engineering', t: 'Mastering HSL and border sliders', d: 'May 26' },
              { cat: 'Design', t: 'Brutalist vs Glassmorphism style guides', d: 'May 20' },
              { cat: 'Product', t: 'Aligning sitemap nodes for team sync', d: 'May 12' }
            ].map((art, idx) => (
              <div key={idx} style={{ background: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '6.5px', color: brand, fontWeight: 'bold',  textTransform: 'uppercase' }}>{art.cat}</span>
                  <p style={{ fontSize: '8px', fontWeight: 'extrabold', margin: '2px 0', lineClamp: '3', lineHeight: '1.2' }}>{art.t}</p>
                </div>
                <span style={{ fontSize: '6.5px', color: muted }}>{art.d} · 4m read</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'article-body':
      return (
        <div style={{ ...containerStyle, padding: '0px', minHeight: '172px' }}>
          <div style={{ width: '100%', height: '2.5px', background: border }}>
            <div style={{ width: '60%', height: '100%', background: brand }} />
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '7px', fontWeight: 'bold', color: brand }}>SAAS BEST PRACTICES</span>
            <h2 style={{ fontSize: '12px', fontWeight: 800, margin: 0 }}>Designing Premium Interactive Viewports</h2>
            <div style={{ borderLeft: `2px solid ${brand}`, paddingLeft: '8px', fontStyle: 'italic', fontSize: '8.5px', color: muted, margin: '2px 0' }}>
              "Always prioritize rich aesthetics and micro-animations to keep operations visual."
            </div>
            <p style={{ fontSize: '8.5px', color: text, margin: 0, lineHeight: '1.3' }}>
              The Egyptian developer market benefits enormously from high-performance landing interfaces...
            </p>
          </div>
        </div>
      )

    case 'faq-accordion':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Frequently Asked Questions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { q: 'How does real-time sync work?', a: 'Via centralized Zustand variables whitelisted in localStorage.', open: true },
              { q: 'Can I import tailwind variables?', a: 'Yes, fully supported in the next releases.', open: false }
            ].map((faq, i) => (
              <div key={i} style={{ background: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '8.5px', fontWeight: 'bold' }}>
                  <span>{faq.q}</span>
                  <span>{faq.open ? '▼' : '▶'}</span>
                </div>
                {faq.open && <p style={{ fontSize: '8px', color: muted, marginTop: '3px', borderTop: `1px dashed ${border}`, paddingTop: '3px', margin: '3px 0 0 0' }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      )

    case 'timeline':
      return (
        <div style={{ ...containerStyle, padding: '14px', gap: '6px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold',  textTransform: 'uppercase', color: muted, textAlign: 'center', display: 'block' }}>Release Checklist Axis</span>
          <div style={{ position: 'relative', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <div style={{ position: 'absolute', left: '4px', top: '2px', bottom: '2px', width: '1.5px', background: border }} />
            {[
              { v: 'V7.0 Launch', d: 'Drag-resizable side panels implemented', c: brand },
              { v: 'V7.1 Coming', d: 'Egyptian Arabic (Masri) localization engine', c: accent },
              { v: 'V7.2 Roadmap', d: 'Sitemap 12-format export compiler integrated', c: border }
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '-13.5px', top: '2.5px', width: '5px', height: '5px', borderRadius: '50%', background: step.c }} />
                <p style={{ fontSize: '8.5px', fontWeight: 'bold', margin: 0 }}>{step.v}</p>
                <p style={{ fontSize: '7.5px', color: muted, margin: 0 }}>{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'team-grid':
      return (
        <div style={{ ...containerStyle, padding: '12px', gap: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center' }}>Egypt Core Engineering Team</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', marginTop: '4px' }}>
            {[
              { n: 'Youssef D.', r: 'Lead Architect', i: 'YD' },
              { n: 'Mariam A.', r: 'Design Excellence', i: 'MA' },
              { n: 'Sherif K.', r: 'RTL Specialist', i: 'SK' }
            ].map((team) => (
              <div key={team.n} style={{ background: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '6px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: brand, color: '#fff', fontSize: '7px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>{team.i}</div>
                <p style={{ fontSize: '8.5px', fontWeight: 'extrabold', margin: 0 }}>{team.n}</p>
                <p style={{ fontSize: '7px', color: muted, margin: 0 }}>{team.r}</p>
              </div>
            ))}
          </div>
        </div>
      )

    // ── Auth ──────────────────────────────────────────────────────────────
    case 'auth-login-card':
      return (
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', background: `linear-gradient(135deg, ${brandSub} 0%, ${bg} 100%)` }}>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '12px 14px', width: '136px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, textAlign: 'center', marginBottom: '6px' }}>Sign in to Nezaam</div>
            {['Email Address', 'Password'].map((f) => (
              <div key={f} style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '7.5px', color: muted, fontWeight: 'bold' }}>{f}</span>
                <div style={{ height: '14px', backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
              </div>
            ))}
            <button style={{ backgroundColor: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 0', textAlign: 'center', fontSize: '8.5px', fontWeight: 'bold', width: '100%', marginTop: '6px', cursor: 'pointer' }}>
              Sign In
            </button>
          </div>
        </div>
      )

    case 'auth-signup-card':
      return (
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', background: `linear-gradient(135deg, ${brandSub} 0%, ${bg} 100%)` }}>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '10px 12px', width: '142px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 800, textAlign: 'center', marginBottom: '4px' }}>Create free account</div>
            {['Full Name', 'Workspace Email', 'Password'].map((f) => (
              <div key={f} style={{ marginBottom: '3px' }}>
                <span style={{ fontSize: '7px', color: muted, fontWeight: 'bold' }}>{f}</span>
                <div style={{ height: '12px', backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
              </div>
            ))}
            {/* Password strength meter */}
            <div style={{ display: 'flex', gap: '2px', margin: '3px 0' }}>
              <div style={{ flex: 1, height: '2px', background: '#22c55e' }} />
              <div style={{ flex: 1, height: '2px', background: '#22c55e' }} />
              <div style={{ flex: 1, height: '2px', background: border }} />
            </div>
            <button style={{ backgroundColor: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 0', textAlign: 'center', fontSize: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>
              Sign Up
            </button>
          </div>
        </div>
      )

    case 'auth-split-panel':
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'row', minHeight: '172px' }}>
          <div style={{ flex: 1, background: `linear-gradient(135deg, ${brand} 0%, ${accent} 100%)`, color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 900, fontSize: '10px' }}>NEZAAM</div>
            <div>
              <p style={{ fontSize: '9px', fontWeight: 'bold', margin: 0 }}>Built for Cairo Operations</p>
              <p style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0 0' }}>100% compliant with local secure authentication protocols.</p>
            </div>
          </div>
          <div style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px', background: panel, justifyContent: 'center' }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold' }}>Sign In</span>
            <div style={{ height: '12px', background: bg, border: `1px solid ${border}`, borderRadius: '3px', marginTop: '2px' }} />
            <div style={{ height: '12px', background: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '3px', padding: '3px 0', fontSize: '7.5px', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button>
          </div>
        </div>
      )

    case 'auth-otp':
      return (
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', background: `linear-gradient(135deg, ${brandSub} 0%, ${bg} 100%)` }}>
          <div style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '6px', padding: '12px', width: '136px', textAlign: 'center' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 'extrabold', display: 'block' }}>Enter Verification Code</span>
            <span style={{ fontSize: '7.5px', color: muted, display: 'block', margin: '2px 0 6px 0' }}>Code sent to *****@nezam.io</span>
            <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginBottom: '8px' }}>
              {[1, 2, 3, ''].map((v, i) => (
                <div key={i} style={{ width: '14px', height: '18px', border: i === 3 ? `1.5px solid ${brand}` : `1px solid ${border}`, background: bg, borderRadius: '3px', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {v}
                </div>
              ))}
            </div>
            <button style={{ backgroundColor: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 0', fontSize: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Verify & Login</button>
            <span style={{ fontSize: '7px', color: brand, display: 'block', marginTop: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Resend code in 44s</span>
          </div>
        </div>
      )

    // ── Dashboard ─────────────────────────────────────────────────────────
    case 'kpi-cards-row':
      return (
        <div style={{ ...containerStyle, padding: '10px', justifyContent: 'center', gap: '6px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px' }}>
            {[
              { label: 'Revenue', val: '$48.2K', delta: '+12%', up: true },
              { label: 'Customers', val: '2,431', delta: '+3%', up: true },
              { label: 'MRR', val: '$8.9K', delta: '+8%', up: true },
              { label: 'Churn', val: '1.2%', delta: '-0.4%', up: false }
            ].map(k => (
              <div key={k.label} style={{ backgroundColor: panel, border: `1px solid ${border}`, borderRadius: '4px', padding: '6px' }}>
                <span style={{ fontSize: '7px', color: muted, fontWeight: 'bold', textTransform: 'uppercase' }}>{k.label}</span>
                <p style={{ fontSize: '10px', fontWeight: 'bold', margin: '1px 0' }}>{k.val}</p>
                <span style={{ fontSize: '7px', color: k.up ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{k.delta}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'chart-area':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '9px', fontWeight: 'extrabold', display: 'block' }}>Area Performance Metric</span>
              <span style={{ fontSize: '7.5px', color: muted }}>Daily active nodes bandwidth utilization</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: bg, padding: '1px 3px', border: `1px solid ${border}`, borderRadius: '4px' }}>
              <span style={{ fontSize: '7px', fontWeight: 'bold', background: brand, color: '#fff', padding: '1px 4px', borderRadius: '2px' }}>7d</span>
              <span style={{ fontSize: '7px', color: muted, padding: '1px 4px' }}>30d</span>
            </div>
          </div>
          <div style={{ height: '56px', width: '100%', borderBottom: `1px solid ${border}`, position: 'relative' }}>
            {/* Simple high fidelity SVG chart preview */}
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0,25 C20,20 30,5 50,15 C70,25 80,8 100,5" fill="none" stroke="var(--primary)" strokeWidth="1.5" />
              <path d="M0,25 C20,20 30,5 50,15 C70,25 80,8 100,5 L100,30 L0,30 Z" fill="color-mix(in srgb, var(--primary) 15%, transparent)" />
            </svg>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: muted }}>
            <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
          </div>
        </div>
      )

    case 'data-table':
      return (
        <div style={{ ...containerStyle, padding: '10px 12px', gap: '4px' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block' }}>Recent Sync Logs</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', color: muted, borderBottom: `1px solid ${border}`, paddingBottom: '3px', fontWeight: 'bold' }}>
              <span style={{ flex: 1.5 }}>Operator Node</span>
              <span style={{ flex: 1 }}>Status</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Sync Time</span>
            </div>
            {[
              { n: 'cairo-primary-node', s: 'Synced', t: '2.4ms', c: '#22c55e' },
              { n: 'sahel-secondary-node', s: 'Standby', t: '12.8ms', c: muted },
              { n: 'alex-backup-edge', s: 'Synced', t: '4.1ms', c: '#22c55e' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', borderBottom: i < 2 ? `1px dashed ${border}` : 'none', padding: '3px 0' }}>
                <span style={{ flex: 1.5, fontWeight: 700 }}>{row.n}</span>
                <span style={{ flex: 1, color: row.c, fontWeight: 'bold' }}>● {row.s}</span>
                <span style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace' }}>{row.t}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'activity-feed':
      return (
        <div style={{ ...containerStyle, padding: '10px 12px', gap: '4px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: muted }}>Recent activity log</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { u: 'LW', a: 'Created invoice #1042', t: '2m ago', c: 'var(--c1)' },
              { u: 'YS', a: 'Refunded order #884', t: '14m ago', c: 'var(--c2)' },
              { u: 'RP', a: 'Updated settings override', t: '1h ago', c: 'var(--c3)' }
            ].map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: i < 2 ? `1px solid ${border}` : 'none', paddingBottom: '3px' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: act.c, color: '#fff', fontSize: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {act.u}
                </div>
                <span style={{ flex: 1, fontSize: '8px', color: text }}>{act.a}</span>
                <span style={{ fontSize: '7.5px', color: muted }}>{act.t}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'dashboard-header':
      return (
        <div style={{ ...containerStyle, padding: '12px 16px', backgroundColor: panel, borderBottom: `2px solid ${border}`, minHeight: 'fit-content', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 900, margin: 0 }}>System Configurations</h2>
              <span style={{ fontSize: '7.5px', background: brandSub, color: brand, padding: '1px 4px', borderRadius: '3px', fontWeight: 'bold' }}>v7.0</span>
            </div>
            <p style={{ fontSize: '8px', color: muted, margin: '2px 0 0 0' }}>Manage node metrics, theme contracts, and deployment gates.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={{ border: `1px solid ${border}`, color: text, borderRadius: '4px', background: bg, padding: '3.5px 8px', fontSize: '8.5px', fontWeight: 'bold' }}>Export JSON</button>
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3.5px 10px', fontSize: '8.5px', fontWeight: 'bold' }}>+ Add Node</button>
          </div>
        </div>
      )

    // ── Footer ────────────────────────────────────────────────────────────────
    case 'footer-multi-column':
      return (
        <div style={{ ...containerStyle, padding: '14px 16px', backgroundColor: panel, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 0.8fr', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px' }}>🪐</span>
                <span style={{ fontWeight: 800, fontSize: '9px' }}>NEZAAM</span>
              </div>
              <p style={{ fontSize: '7px', color: muted, margin: 0 }}>Egypt's premium operator design system database.</p>
            </div>
            {['Product', 'Resources', 'Safety'].map((cat) => (
              <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7.5px', fontWeight: 'bold', color: text }}>{cat}</span>
                <span style={{ fontSize: '7px', color: muted }}>Overview</span>
                <span style={{ fontSize: '7px', color: muted }}>Pricing</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: muted }}>
            <span>© 2026 Nezaam, Inc.</span>
            <span>Cairo, Egypt</span>
          </div>
        </div>
      )

    case 'footer-minimal':
      return (
        <div style={{ ...containerStyle, padding: '12px 16px', backgroundColor: panel, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 'fit-content' }}>
          <span style={{ fontSize: '8px', color: muted }}>© 2026 Nezaam Inc. Cairo Tech Hub.</span>
          <div style={{ display: 'flex', gap: '10px', fontSize: '8px', color: muted }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>● 100% SLA Uptime</span>
          </div>
        </div>
      )

    case 'footer-dark':
      return (
        <div style={{ ...containerStyle, padding: '14px 16px', background: '#111827', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#fff' }}>🪐</span>
              <span style={{ fontWeight: 900, color: '#fff', fontSize: '9.5px', letterSpacing: '-0.02em' }}>NEZAAM</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ background: '#1f2937', padding: '2px 6px', borderRadius: '3px', fontSize: '7px', color: '#fff' }}>App Store</div>
              <div style={{ background: '#1f2937', padding: '2px 6px', borderRadius: '3px', fontSize: '7px', color: '#fff' }}>Play Store</div>
            </div>
          </div>
          <p style={{ fontSize: '7.5px', color: '#6b7280', margin: 0 }}>Designed and engineered locally in Cairo, Egypt. Fully compliant with enterprise billing SLAs.</p>
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: '6px', fontSize: '7px', color: '#4b5563' }}>
            © 2026 Nezaam Technologies. All rights reserved.
          </div>
        </div>
      )

    // ── Empty States ──────────────────────────────────────────────────────────
    case 'empty-no-data':
      return (
        <div style={{ ...containerStyle, padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: brandSub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: `1px dashed ${brand}` }}>🗃</div>
          <div>
            <h3 style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>No projects deployed</h3>
            <p style={{ fontSize: '8px', color: muted, margin: '2px 0 0 0' }}>Get started by creating your first production sitemap node.</p>
          </div>
          <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '8.5px', fontWeight: 'bold', marginTop: '2px', cursor: 'pointer' }}>+ Create Project</button>
        </div>
      )

    case 'empty-search':
      return (
        <div style={{ ...containerStyle, padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '20px' }}>🔍</span>
          <div>
            <h3 style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>No search results found</h3>
            <p style={{ fontSize: '8px', color: muted, margin: '2px 0 0 0' }}>We couldn't find any match for your current query. Try adjusting filters.</p>
          </div>
          <button style={{ border: `1px solid ${border}`, color: text, background: 'transparent', borderRadius: '4px', padding: '3.5px 10px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Clear Filters</button>
        </div>
      )

    case 'empty-error-500':
      return (
        <div style={{ ...containerStyle, padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', background: `linear-gradient(135deg, color-mix(in srgb, var(--destructive) 10%, transparent), ${bg})` }}>
          <span style={{ fontSize: '20px', color: tokens.colors.accent['500'] }}>⚠️</span>
          <div>
            <h3 style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>Server connection lost</h3>
            <p style={{ fontSize: '8px', color: muted, margin: '2px 0 0 0' }}>Diagnostic code: <span style={{ fontFamily: 'monospace', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '1px 3px', borderRadius: '2px' }}>ERR_PORT_4000_TIMEOUT</span></p>
          </div>
          <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 12px', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Retry Connection</button>
        </div>
      )

    // ── Banners ───────────────────────────────────────────────────────────────
    case 'alert-banner':
      return (
        <div style={{ ...containerStyle, padding: '8px 12px', background: 'rgba(245,158,11,0.15)', color: '#d97706', border: '1px solid #f59e0b', borderRadius: '4px', minHeight: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '8.5px', fontWeight: 'bold' }}>
              <span>⚠️</span>
              <span>Production database backup is in progress. Sync operations are paused.</span>
            </div>
            <span style={{ fontSize: '10px', cursor: 'pointer', opacity: 0.7 }}>✕</span>
          </div>
        </div>
      )

    case 'cookie-consent':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', border: `1.5px solid ${border}`, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minHeight: 'fit-content', width: '90%', margin: '0 auto' }}>
          <p style={{ fontSize: '8.5px', fontWeight: 600, margin: 0, lineHeight: '1.3' }}>
            🍪 We use cookies to optimize HSL scale calculations, contrast ratios, and store sitemaps.
          </p>
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', justifyContent: 'flex-end' }}>
            <button style={{ border: `1px solid ${border}`, color: text, background: 'transparent', borderRadius: '3px', fontSize: '8px', fontWeight: 'bold', padding: '2px 8px', cursor: 'pointer' }}>Decline</button>
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '3px', fontSize: '8px', fontWeight: 'bold', padding: '2px 8px', cursor: 'pointer' }}>Accept All</button>
          </div>
        </div>
      )

    case 'upgrade-prompt':
      return (
        <div style={{ ...containerStyle, padding: '14px 16px', background: `linear-gradient(135deg, ${brandSub}, ${bg})`, border: `1.5px dashed ${brand}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px' }}>🚀</span>
            <span style={{ fontSize: '10px', fontWeight: 'extrabold', color: brand }}>Upgrade to Operator Pro</span>
          </div>
          <p style={{ fontSize: '8.5px', color: muted, margin: 0 }}>Unlock unlimited sitemap nodes, 12-format advanced export compilers, and 2.4ms sync speeds.</p>
          <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 0', fontSize: '8.5px', fontWeight: 'bold', width: '100%', marginTop: '2px', cursor: 'pointer' }}>Upgrade Now</button>
        </div>
      )

    // ── Tables ────────────────────────────────────────────────────────────────
    case 'simple-table':
      return (
        <div style={{ ...containerStyle, padding: '10px 12px', gap: '4px' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block' }}>Operational SLA Tiers</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', color: muted, borderBottom: `1px solid ${border}`, paddingBottom: '3px', fontWeight: 'bold' }}>
              <span style={{ flex: 1.5 }}>SLA Grade</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Uptime Guarantee</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Support Level</span>
            </div>
            {[
              { n: 'Egypt Gold SLA', s: '99.99%', t: '24/7 Phone' },
              { n: 'Sahel Bronze Tier', s: '99.9%', t: 'Email Ticket' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', borderBottom: i === 0 ? `1px dashed ${border}` : 'none', padding: '3px 0' }}>
                <span style={{ flex: 1.5, fontWeight: 700 }}>{row.n}</span>
                <span style={{ flex: 1, textAlign: 'center', color: brand, fontWeight: 'bold' }}>{row.s}</span>
                <span style={{ flex: 1, textAlign: 'right' }}>{row.t}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'transaction-table':
      return (
        <div style={{ ...containerStyle, padding: '10px 12px', gap: '4px' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block' }}>Recent Central Bank Syncs</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', color: muted, borderBottom: `1px solid ${border}`, paddingBottom: '3px', fontWeight: 'bold' }}>
              <span style={{ flex: 1.5 }}>Billing ID</span>
              <span style={{ flex: 1 }}>Sovereign Status</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Total (EGP)</span>
            </div>
            {[
              { n: 'TXN-CAIRO-902', s: 'Settled', t: ' Egyptian 4,200', c: '#22c55e' },
              { n: 'TXN-SAHEL-084', s: 'Pending', t: ' Egyptian 1,850', c: '#f59e0b' }
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7.5px', borderBottom: i === 0 ? `1px dashed ${border}` : 'none', padding: '3px 0' }}>
                <span style={{ flex: 1.5, fontWeight: 700 }}>{row.n}</span>
                <span style={{ flex: 1, color: row.c, fontWeight: 'bold' }}>● {row.s}</span>
                <span style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace' }}>{row.t}</span>
              </div>
            ))}
          </div>
        </div>
      )

    // ── Forms ─────────────────────────────────────────────────────────────────
    case 'contact-form':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '6px' }}>
          <div style={{ fontSize: '10px', fontWeight: 'extrabold', textAlign: 'center' }}>Contact Egypt Support</div>
          {['Your Name', 'Work Email'].map(f => (
            <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '7px', color: muted, fontWeight: 'bold' }}>{f}</span>
              <div style={{ height: '12px', background: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '7px', color: muted, fontWeight: 'bold' }}>Message</span>
            <div style={{ height: '24px', background: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
          </div>
          <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3.5px 0', fontSize: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Submit Request</button>
        </div>
      )

    case 'settings-form':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '6px' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 'bold', display: 'block' }}>Profile Settings</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${border}`, paddingBottom: '6px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: brand, color: '#fff', fontSize: '9px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>EG</div>
            <div>
              <span style={{ fontSize: '8.5px', fontWeight: 'bold', display: 'block' }}>Egypt Center Node</span>
              <span style={{ fontSize: '7px', color: brand, fontWeight: 'bold', cursor: 'pointer' }}>Upload new avatar</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {['First Name', 'Last Name'].map(f => (
              <div key={f} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '7px', color: muted, fontWeight: 'bold' }}>{f}</span>
                <div style={{ height: '12px', background: bg, border: `1px solid ${border}`, borderRadius: '3px' }} />
              </div>
            ))}
          </div>
          <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '4px', padding: '3.5px 0', fontSize: '8px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>Save Settings</button>
        </div>
      )

    case 'onboarding-stepper':
      return (
        <div style={{ ...containerStyle, padding: '12px 14px', gap: '6px' }}>
          {/* Stepper progress bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${border}`, paddingBottom: '4px' }}>
            <span style={{ fontSize: '8px', color: brand, fontWeight: 'bold' }}>Step 2 of 3</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              <div style={{ width: '8px', height: '3px', background: brand, borderRadius: '2px' }} />
              <div style={{ width: '8px', height: '3px', background: brand, borderRadius: '2px' }} />
              <div style={{ width: '8px', height: '3px', background: border, borderRadius: '2px' }} />
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 'extrabold', display: 'block' }}>Configure Brand Colors</span>
            <span style={{ fontSize: '7.5px', color: muted, display: 'block' }}>Generate your complimentary harmony HSL palette.</span>
          </div>
          <div style={{ height: '24px', background: bg, border: `1px dashed ${brand}40`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold', color: brand }}>
            [Interactive Color Harmony Grid]
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <button style={{ border: `1px solid ${border}`, color: text, background: 'transparent', borderRadius: '3px', fontSize: '7.5px', fontWeight: 'bold', padding: '2px 8px' }}>Back</button>
            <button style={{ background: brand, color: '#fff', border: 'none', borderRadius: '3px', fontSize: '7.5px', fontWeight: 'bold', padding: '2px 8px' }}>Continue</button>
          </div>
        </div>
      )

    // ── Default ───────────────────────────────────────────────────────────
    default:
      return (
        <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px', gap: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: brandSub, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⬡</div>
          <div style={{ fontSize: '9px', color: muted, fontWeight: 'bold' }}>{section.name}</div>
        </div>
      )
  }
}

// ─── Complexity Badge ─────────────────────────────────────────────────────────

function ComplexityBadge({ level }: { level: SectionDef['complexity'] }) {
  const map = {
    simple:  { label: 'Simple',  color: '#22c55e', bg: '#dcfce7' },
    medium:  { label: 'Medium',  color: '#f59e0b', bg: '#fef3c7' },
    complex: { label: 'Complex', color: '#8b5cf6', bg: '#ede9fe' },
  }
  const { label, color, bg } = map[level]
  return (
    <span style={{ background: bg, color, fontSize: '8.5px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '10px' }}>
      {label}
    </span>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ section }: { section: SectionDef }) {
  return (
    <div className="group flex flex-col gap-0 rounded-app-lg border border-app-border bg-app-surface hover:border-app-accent/50 transition-all duration-300 overflow-hidden hover:shadow-md">
      {/* Live preview (expanded height to represent full page layout) */}
      <div className="shrink-0 border-b border-app-border bg-app-inset overflow-hidden p-2.5 flex flex-col justify-center" style={{ minHeight: 180 }}>
        <SectionPreview section={section} />
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1.5 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11.5px] font-extrabold text-app-text leading-tight">{section.name}</p>
          <ComplexityBadge level={section.complexity} />
        </div>
        <p className="text-[10px] text-app-subtle leading-relaxed line-clamp-2">{section.description}</p>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {section.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] text-app-subtle bg-app-elevated border border-app-border px-1.5 py-0.5 rounded-full font-bold">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Sections Section Component ──────────────────────────────────────────

export function SectionsSection() {
  const category    = useHub((s) => s.sectionsCategory)
  const query       = useHub((s) => s.sectionsQuery)

  const filtered = useMemo(
    () => {
      const q = query.toLowerCase()
      return SECTIONS_LIBRARY.filter((s) => {
        const matchCat = !category || s.category === category
        const matchQ   = !q || s.name.toLowerCase().includes(q) ||
                         s.description.toLowerCase().includes(q) ||
                         s.tags.some((t) => t.toLowerCase().includes(q))
        return matchCat && matchQ
      })
    },
    [query, category],
  )

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

  const categoryGroups = useMemo(() => {
    const used = new Set(SECTIONS_LIBRARY.map(s => s.category))
    return used
  }, [])

  const shownCategories = useMemo(() => {
    const list = Array.from(categoryGroups) as SectionCategory[]
    return (category ? [category as SectionCategory] : list).filter(c => (grouped.get(c)?.length ?? 0) > 0)
  }, [category, categoryGroups, grouped])

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Standard Sidebar Layout replacing legacy toolbar */}
      <SectionsSidebar />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <PreviewSubTabs />

        {/* Unified Header Strip */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-app-border bg-app-surface">
          <div>
            <div className="flex items-center gap-2">
              <Layers2 size={14} className="text-app-accent" />
              <span className="font-extrabold text-[14px] tracking-tight">Full Page Sections</span>
            </div>
            <p className="text-[10px] text-app-subtle mt-0.5 uppercase tracking-wider font-semibold">PRESETS CATALOG LIBRARY</p>
          </div>
          <span className="text-[9.5px] font-mono text-app-subtle bg-app-elevated border border-app-border px-2 py-0.5 rounded-full font-bold">
            {filtered.length} layouts found
          </span>
        </div>

        {/* Section Cards Grid */}
        <div className="flex-1 overflow-y-auto app-scroll p-6 bg-app-inset">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="h-10 w-10 rounded-xl bg-app-elevated border border-app-border flex items-center justify-center">
                <Layers2 size={18} className="text-app-subtle" />
              </div>
              <p className="text-sm font-medium text-app-text">No section layouts found</p>
              <p className="text-xs text-app-subtle">Try a different search query or select a category sidebar filter.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-12">
              {shownCategories.map(cat => {
                const items = grouped.get(cat) ?? []
                if (items.length === 0) return null
                return (
                  <section key={cat} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[12px] font-extrabold text-app-text uppercase tracking-wider">
                        {SECTION_CATEGORY_LABELS[cat]}
                      </h2>
                      <span className="text-[9.5px] text-app-muted bg-app-surface border border-app-border px-1.5 py-0.2 rounded-full font-mono font-bold">
                        {items.length}
                      </span>
                      <div className="flex-1 h-px bg-app-border ml-2" />
                    </div>
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                      {items.map(s => <SectionCard key={s.id} section={s} />)}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
