'use client'

import { ArrowRight, BarChart2, Check, ChevronRight, Code2, Globe, Grid3X3, Image as ImageIcon, Play, Search, Shield, Star, Users, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'
import { renderArtWireframeSection } from './art-wireframe-sections'
import { DUMMY, IllusChart, IllusDashboard, IllusEmpty, IllusFeatures, IllusHero, IllusProduct } from './dummy-content'

type WireframeSection = {
  section_id?: string
  block_type?: string
  order?: number
}

type AuthVariant = 'login' | 'signup'

function isAuthPage(page: ArchPage): boolean {
  const route = page.route.toLowerCase()
  const name = page.name.toLowerCase()
  return (
    route.includes('login') ||
    route.includes('forgot') ||
    route.includes('signup') ||
    route.includes('sign-up') ||
    route.includes('register') ||
    name.includes('login') ||
    name.includes('sign up') ||
    name.includes('signup')
  )
}

function getAuthVariant(page: ArchPage): AuthVariant {
  const route = page.route.toLowerCase()
  const name = page.name.toLowerCase()
  if (
    route.includes('signup') ||
    route.includes('sign-up') ||
    route.includes('register') ||
    name.includes('sign up') ||
    name.includes('signup')
  ) {
    return 'signup'
  }
  return 'login'
}

function shouldUseSidebarShell(sections: WireframeSection[]): boolean {
  return sections.length > 1 && sections[0]?.block_type === 'Nav_Sidebar'
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full bg-[var(--bg-surface)] text-[var(--text)]">{children}</div>
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-app-md border border-app-border bg-app-surface shadow-sm', className)}>
      {children}
    </div>
  )
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('px-6 py-14', className)}>{children}</section>
}

function DashboardSidebar() {
  return (
    <aside className="border-r border-app-border bg-app-elevated p-4 min-h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-7 w-7 rounded-app-sm bg-app-accent/30 border border-app-accent/50" />
        <span className="text-sm font-semibold">Workspace</span>
      </div>
      <nav className="space-y-0.5">
        {['Overview', 'Analytics', 'Users', 'Media', 'Settings'].map((item, i) => (
          <button
            key={item}
            type="button"
            className={cn(
              'w-full h-9 rounded-app-sm px-3 text-left text-xs transition',
              i === 0
                ? 'bg-app-accent/15 text-app-text font-medium'
                : 'text-app-muted hover:bg-app-surface hover:text-app-text',
            )}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function LayoutAuthSplit({ page, variant }: { page: ArchPage; variant: AuthVariant }) {
  const isSignup = variant === 'signup'
  const title = isSignup ? 'Create your account' : 'Welcome back'
  const subtitle = isSignup
    ? 'Start building with your team in minutes.'
    : 'Sign in to continue to your workspace dashboard.'

  return (
    <div className="grid min-h-[calc(100vh-7rem)] md:grid-cols-2">
      <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-app-border bg-gradient-to-br from-app-accent/15 via-app-elevated to-app-surface p-8 md:p-12">
        <Badge variant="default" className="w-fit mb-4">
          {isSignup ? 'Get started' : 'Secure access'}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-sm text-app-muted leading-relaxed max-w-md mb-6">{subtitle}</p>
        <ul className="space-y-2 text-sm text-app-muted">
          <li className="flex items-center gap-2">
            <Check size={14} className="text-app-accent shrink-0" />
            SSO-ready for Google and GitHub
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-app-accent shrink-0" />
            Role-based access for your team
          </li>
          <li className="flex items-center gap-2">
            <Check size={14} className="text-app-accent shrink-0" />
            {isSignup ? 'No credit card required' : 'Session recovery and MFA support'}
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 bg-app-surface">
        <Card className="w-full max-w-md p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-1">{isSignup ? 'Sign up' : 'Sign in'}</h2>
          <p className="text-xs text-app-muted mb-5">
            {isSignup ? `Join ${page.name || 'YourApp'}` : `Access ${page.name || 'YourApp'}`}
          </p>

          <div className="space-y-2 mb-4">
            <Button variant="outline" size="md" className="w-full justify-center">
              Continue with Google
            </Button>
            <Button variant="outline" size="md" className="w-full justify-center">
              Continue with GitHub
            </Button>
            <Button variant="outline" size="md" className="w-full justify-center">
              Continue with Apple
            </Button>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-app-border" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
              <span className="bg-app-surface px-2 text-app-muted">or continue with email</span>
            </div>
          </div>

          <div className="space-y-3">
            {isSignup ? <Input label="Full name" placeholder="Alex Rivera" /> : null}
            <Input label="Email" placeholder="you@company.com" />
            <Input label="Password" type="password" placeholder="********" />
            {isSignup ? (
              <Input label="Confirm password" type="password" placeholder="********" />
            ) : (
              <div className="flex justify-end">
                <button type="button" className="text-[11px] text-app-accent hover:underline">
                  Forgot password?
                </button>
              </div>
            )}
            <Button variant="primary" size="md" className="w-full">
              {isSignup ? 'Create account' : 'Sign in'}
            </Button>
          </div>

          <p className="mt-4 text-center text-[11px] text-app-muted">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button type="button" className="text-app-accent font-medium hover:underline">
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  )
}

function RuntimeChrome() {
  return (
    <div className="border-b border-app-border px-6 py-3 flex items-center justify-between bg-app-bg/60 shrink-0">
      <div className="text-xs text-app-muted flex items-center gap-2">
        <Grid3X3 size={12} />
        Wireframe runtime
      </div>
      <Tabs defaultValue="preview">
        <TabsList className="h-8">
          <TabsTrigger value="preview" className="text-[11px]">Preview</TabsTrigger>
          <TabsTrigger value="components" className="text-[11px]">Components</TabsTrigger>
          <TabsTrigger value="sections" className="text-[11px]">Sections</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

function RenderBlock({ blockType, page }: { blockType: string; page: ArchPage }) {
  const artSection = renderArtWireframeSection(blockType)
  if (artSection) return artSection

  const brand = 'var(--brand)'
  const accent = 'var(--accent)'
  switch (blockType) {
    case 'Nav_TopBar':
      return (
        <header className="w-full sticky top-0 z-10 border-b border-app-border bg-app-surface/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="h-6 w-6 rounded bg-app-accent/30 border border-app-accent/50" />
              YourApp
            </div>
            <nav className="hidden md:flex items-center gap-6 text-xs text-app-muted">
              <span>Features</span>
              <span>Pricing</span>
              <span>Blog</span>
              <span>Docs</span>
            </nav>
            <Button variant="primary" size="sm">Get Started</Button>
          </div>
        </header>
      )
    case 'Nav_Sidebar':
      return <DashboardSidebar />
    case 'Layout_AuthSplit':
      return <LayoutAuthSplit page={page} variant={getAuthVariant(page)} />
    case 'Nav_Mobile':
      return (
        <div className="border-y border-app-border bg-app-surface">
          <div className="h-12 px-4 flex items-center justify-between">
            <span className="text-xs font-semibold">YourApp</span>
            <Search size={14} className="text-app-muted" />
          </div>
          <div className="h-12 border-t border-app-border grid grid-cols-4">
            {['Home', 'Search', 'Inbox', 'Me'].map((item) => (
              <button key={item} className="text-[10px] text-app-muted">{item}</button>
            ))}
          </div>
        </div>
      )
    case 'Nav_Footer':
      return (
        <footer className="w-full border-t border-app-border bg-app-elevated">
          <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Product', 'Company', 'Resources', 'Legal'].map((c) => (
              <div key={c}>
                <div className="text-[11px] font-semibold mb-2">{c}</div>
                <div className="space-y-1 text-[11px] text-app-muted">
                  <div>Overview</div>
                  <div>Pricing</div>
                  <div>Contact</div>
                </div>
              </div>
            ))}
          </div>
        </footer>
      )
    case 'Hero_Simple':
      return (
        <div className="relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 72%)' }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <Section className="text-center pt-16 md:pt-24 relative">
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-app-border bg-app-elevated/80 text-app-muted backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-app-accent" />
                What&apos;s new · v3.0 shipped
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3">Build faster with real components</h1>
            <p className="text-sm text-app-muted max-w-xl mx-auto mb-5">{DUMMY.descriptions[0]}</p>
            <Button variant="primary" size="md">Start now</Button>
          </Section>
        </div>
      )
    case 'Hero_Centered':
      return (
        <div className="relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 72%)' }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <Section className="text-center pt-16 md:pt-24 relative">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-app-border bg-app-elevated/80 text-app-muted backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-app-accent animate-pulse" />
                Now in public beta · Read the changelog
              </span>
            </div>
            <Badge variant="default" className="mb-4">Free forever plan available</Badge>
            <h1 className="text-4xl font-bold mb-3">{DUMMY.headings[0]}</h1>
            <p className="text-sm text-app-muted max-w-2xl mx-auto mb-6">{DUMMY.descriptions[1]}</p>
            <div className="flex items-center justify-center gap-2">
              <Button variant="primary" size="md">Start free</Button>
              <Button variant="outline" size="md" icon={<Play size={12} />}>Watch demo</Button>
            </div>
            <div className="mt-8 h-44 mx-auto max-w-3xl">
              <IllusHero brand={brand} />
            </div>
          </Section>
        </div>
      )
    case 'Hero_Split':
      return (
        <div className="relative overflow-hidden" style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 72%)' }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <Section className="grid md:grid-cols-2 gap-6 items-center pt-16 md:pt-24 relative">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-app-border bg-app-elevated/80 text-app-muted mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-app-accent" />
                Trusted by 2,800+ teams
              </div>
              <h2 className="text-3xl font-bold mb-3">{DUMMY.headings[2]}</h2>
              <p className="text-sm text-app-muted mb-4">{DUMMY.descriptions[2]}</p>
              <div className="flex gap-2">
                <Button variant="primary" size="md" iconEnd={<ArrowRight size={12} />}>Try it</Button>
                <Button variant="ghost" size="md">Learn more</Button>
              </div>
            </div>
            <Card className="p-4 h-64">
              <IllusFeatures brand={brand} />
            </Card>
          </Section>
        </div>
      )
    case 'Content_Text':
      return (
        <Section>
          <h3 className="text-xl font-semibold mb-2">{page.name}</h3>
          <p className="text-sm text-app-muted leading-7 max-w-3xl">{DUMMY.descriptions[3]}</p>
        </Section>
      )
    case 'Content_Card':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.features.slice(0, 3).map((f) => (
              <Card key={f.title} className="p-4">
                <div className="h-10 w-10 rounded bg-app-accent/20 border border-app-accent/30 mb-3 flex items-center justify-center">
                  <Star size={14} className="text-app-accent" />
                </div>
                <div className="text-sm font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-app-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Content_Features': {
      const featureIcons = [
        <Zap key="zap" size={22} className="text-app-accent" />,
        <Shield key="shield" size={22} className="text-app-accent" />,
        <Users key="users" size={22} className="text-app-accent" />,
        <BarChart2 key="bar" size={22} className="text-app-accent" />,
        <Code2 key="code" size={22} className="text-app-accent" />,
        <Globe key="globe" size={22} className="text-app-accent" />,
      ]
      return (
        <Section>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Everything you need</h3>
            <p className="text-sm text-app-muted">Sections built from icons, text, vectors, and components.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.features.slice(0, 6).map((f, i) => (
              <Card key={f.title} className="p-5">
                <div className="h-12 w-12 rounded-app-md bg-app-accent/10 border border-app-accent/20 flex items-center justify-center mb-4">
                  {featureIcons[i]}
                </div>
                <div className="text-sm font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-app-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      )
    }
    case 'Content_Pricing':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.prices.map((p) => (
              <Card key={p.name} className={cn('p-4', p.featured && 'border-app-accent')}>
                <div className="text-xs text-app-muted">{p.name}</div>
                <div className="text-3xl font-bold my-2">{p.price}</div>
                <p className="text-xs text-app-muted mb-4">{p.desc}</p>
                <Button variant={p.featured ? 'primary' : 'outline'} size="sm" className="w-full">
                  Choose plan
                </Button>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Content_FAQ':
      return (
        <Section>
          <div className="max-w-3xl mx-auto space-y-2">
            {['Is there a free plan?', 'Can I cancel anytime?', 'Do you support SSO?', 'Do you offer onboarding?'].map((q) => (
              <Card key={q} className="p-3 flex items-center justify-between">
                <span className="text-sm">{q}</span>
                <ChevronRight size={14} className="text-app-muted" />
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Content_CTA':
      return (
        <Section>
          <div className="rounded-app-md p-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, color-mix(in oklch, var(--accent) 70%, #1e1b4b) 100%)' }}>
            <div>
              <div className="text-xl font-bold text-white mb-1">Ready to launch your project?</div>
              <p className="text-sm text-white/70">Ship production-ready interfaces with reusable blocks.</p>
            </div>
            <button
              type="button"
              className="shrink-0 h-10 px-6 rounded-app-sm text-sm font-semibold bg-white text-[var(--accent)] hover:bg-white/90 transition border-0 shadow-md whitespace-nowrap"
            >
              Start now →
            </button>
          </div>
        </Section>
      )
    case 'Content_Stats':
      return (
        <Section>
          <div className="grid md:grid-cols-4 gap-3">
            {DUMMY.stats.map((s) => (
              <Card key={s.label} className="p-3">
                <div className="text-[11px] text-app-muted mb-1">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-[11px] text-green-500">{s.change}</div>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Content_Testimonials':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.team.slice(0, 3).map((member) => (
              <Card key={member.name} className="p-4">
                <p className="text-sm mb-4">"{DUMMY.descriptions[0]}"</p>
                <div className="flex items-center gap-2">
                  <Avatar size="md"><AvatarFallback>{member.initials}</AvatarFallback></Avatar>
                  <div>
                    <div className="text-xs font-semibold">{member.name}</div>
                    <div className="text-[11px] text-app-muted">{member.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Content_Logos': {
      const companyLogos = [
        { name: 'GitHub',  src: '/logos/GitHub.png'  },
        { name: 'Notion',  src: '/logos/Notion.png'  },
        { name: 'Slack',   src: '/logos/Slack.png'   },
        { name: 'Miro',    src: '/logos/Miro.png'    },
        { name: 'Loom',    src: '/logos/Loom.png'    },
        { name: 'Zapier',  src: '/logos/Zapier.png'  },
      ]
      return (
        <Section>
          <p className="text-center text-[11px] text-app-muted mb-5 uppercase tracking-widest">Trusted by teams at</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {companyLogos.map(({ name, src }) => (
              <Card key={name} className="h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-default">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={name} className="object-contain w-auto" style={{ maxHeight: 52, maxWidth: 110 }} />
              </Card>
            ))}
          </div>
        </Section>
      )
    }
    case 'Form_Login':
      return (
        <Section>
          <Card className="max-w-md mx-auto p-5">
            <h3 className="text-lg font-semibold mb-4">Sign in</h3>
            <div className="space-y-3">
              <Input label="Email" placeholder="you@company.com" />
              <Input label="Password" type="password" placeholder="********" />
              <Button variant="primary" size="md" className="w-full">Continue</Button>
            </div>
          </Card>
        </Section>
      )
    case 'Form_Contact':
      return (
        <Section>
          <Card className="max-w-2xl mx-auto p-5">
            <h3 className="text-lg font-semibold mb-4">Contact us</h3>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <Input label="First name" placeholder="Alex" />
              <Input label="Last name" placeholder="Rivera" />
            </div>
            <Input label="Email" placeholder="alex@example.com" className="mb-3" />
            <textarea className="w-full h-24 rounded-app-sm border border-app-border bg-app-inset p-2.5 text-xs" placeholder="Your message..." />
            <Button variant="primary" size="md" className="mt-3">Send message</Button>
          </Card>
        </Section>
      )
    case 'Form_Newsletter':
      return (
        <Section>
          <Card className="max-w-2xl mx-auto p-4">
            <div className="text-sm font-semibold mb-2">Join our newsletter</div>
            <div className="flex gap-2">
              <Input placeholder="you@company.com" className="flex-1" />
              <Button variant="primary" size="md">Subscribe</Button>
            </div>
          </Card>
        </Section>
      )
    case 'Form_Signup':
      return (
        <Section>
          <Card className="max-w-md mx-auto p-5">
            <h3 className="text-lg font-semibold mb-4">Create account</h3>
            <div className="space-y-3">
              <Input label="Full name" placeholder="Alex Rivera" />
              <Input label="Email" placeholder="you@company.com" />
              <Input label="Password" type="password" placeholder="********" />
              <Button variant="primary" size="md" className="w-full">Create account</Button>
            </div>
          </Card>
        </Section>
      )
    case 'Data_KPI_Row':
      return (
        <Section>
          <div className="grid md:grid-cols-4 gap-3">
            {DUMMY.stats.map((s) => (
              <Card key={s.label} className="p-3">
                <div className="text-[11px] text-app-muted">{s.label}</div>
                <div className="text-2xl font-bold my-1">{s.value}</div>
                <div className="text-[11px] text-app-muted">{s.change}</div>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Data_Table':
      return (
        <Section>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr] text-[11px] text-app-muted bg-app-elevated px-4 py-2 border-b border-app-border">
              <span>Name</span><span>Role</span><span>Status</span>
            </div>
            {DUMMY.names.slice(0, 5).map((name, i) => (
              <div key={name} className="grid grid-cols-[2fr_1fr_1fr] px-4 py-2 border-b border-app-border last:border-0 text-xs">
                <span>{name}</span>
                <span>{['Admin', 'Editor', 'Viewer'][i % 3]}</span>
                <span className="text-app-muted">{['Active', 'Pending', 'Invited'][i % 3]}</span>
              </div>
            ))}
          </Card>
        </Section>
      )
    case 'Data_Chart':
      return (
        <Section>
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">Usage trend</div>
            <div className="h-56">
              <IllusChart brand={brand} accent={accent} />
            </div>
          </Card>
        </Section>
      )
    case 'Layout_PageHeader':
      return (
        <Section className="pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-app-muted">Workspace / Pages</div>
              <h2 className="text-2xl font-bold">{page.name}</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="primary" size="sm">Create</Button>
            </div>
          </div>
        </Section>
      )
    case 'Layout_TwoColumn':
      return (
        <Section>
          <div className="grid md:grid-cols-[260px_1fr] gap-4">
            <Card className="p-3">
              <div className="text-xs font-semibold mb-2">Sidebar panel</div>
              <div className="space-y-1 text-xs text-app-muted">
                <div>Overview</div>
                <div>Filters</div>
                <div>Tags</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="h-44"><IllusDashboard brand={brand} /></div>
            </Card>
          </div>
        </Section>
      )
    case 'Layout_EmptyState':
      return (
        <Section>
          <Card className="p-8 text-center">
            <div className="h-24 w-24 mx-auto mb-4"><IllusEmpty brand={brand} /></div>
            <h3 className="text-lg font-semibold mb-1">No items yet</h3>
            <p className="text-sm text-app-muted mb-4">Start by creating your first item.</p>
            <Button variant="primary" size="md" icon={<Check size={12} />}>Create item</Button>
          </Card>
        </Section>
      )
    case 'Content_BlogGrid':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.blogPosts.slice(0, 3).map((post) => (
              <Card key={post.title} className="p-4">
                <Badge variant="muted" className="mb-2">{post.tag}</Badge>
                <div className="font-semibold mb-1">{post.title}</div>
                <div className="text-[11px] text-app-muted">{post.date} - {post.readTime}</div>
              </Card>
            ))}
          </div>
        </Section>
      )
    default:
      return (
        <Section>
          <Card className="p-4">
            <div className="text-sm font-semibold mb-2">{blockType}</div>
            <p className="text-xs text-app-muted">Fallback renderer</p>
          </Card>
        </Section>
      )
  }
}

export function WireframeBlocksPage({
  page,
  sections,
  device,
}: {
  page: ArchPage
  sections: WireframeSection[]
  device: 'desktop' | 'tablet' | 'mobile'
}) {
  const isCompact = device !== 'desktop'
  const ordered = [...sections].sort((a, b) => {
    const ao = Number(a.order ?? 0)
    const bo = Number(b.order ?? 0)
    return ao - bo
  })

  const authPage =
    isAuthPage(page) || ordered.some((section) => section.block_type === 'Layout_AuthSplit')
  const sidebarShell = !authPage && shouldUseSidebarShell(ordered)
  const mainSections = sidebarShell ? ordered.slice(1) : ordered

  if (authPage) {
    const hasAuthBlock = ordered.some((section) => section.block_type === 'Layout_AuthSplit')
    return (
      <Shell>
        <RuntimeChrome />
        {hasAuthBlock ? (
          <RenderBlock blockType="Layout_AuthSplit" page={page} />
        ) : (
          <LayoutAuthSplit page={page} variant={getAuthVariant(page)} />
        )}
      </Shell>
    )
  }

  if (sidebarShell) {
    return (
      <Shell>
        <RuntimeChrome />
        <div className={cn('grid grid-cols-1 md:grid-cols-[240px_1fr] min-h-[520px]', isCompact && 'max-w-2xl mx-auto')}>
          <DashboardSidebar />
          <main className="min-w-0 bg-[var(--bg-surface)]">
            {mainSections.length === 0 ? (
              <RenderBlock blockType="Layout_EmptyState" page={page} />
            ) : (
              mainSections.map((section, index) => (
                <div key={section.section_id ?? `${section.block_type}-${index}`}>
                  <RenderBlock blockType={section.block_type ?? 'Layout_EmptyState'} page={page} />
                </div>
              ))
            )}
          </main>
        </div>
        <Section className="pt-0">
          <Card className="p-4 flex flex-wrap items-center gap-2 text-xs text-app-muted">
            <ImageIcon size={12} />
            Dashboard shell: sidebar navigation with main content blocks.
            <div className="ml-auto flex gap-2">
              <Badge variant="success">Stable</Badge>
              <Badge variant="muted">Dashboard</Badge>
            </div>
          </Card>
        </Section>
      </Shell>
    )
  }

  const headerBlocks = ordered.filter(s => s.block_type === 'Nav_TopBar')
  const footerBlocks = ordered.filter(s => s.block_type === 'Nav_Footer')
  const bodyBlocks   = ordered.filter(s => s.block_type !== 'Nav_TopBar' && s.block_type !== 'Nav_Footer')

  return (
    <Shell>
      <RuntimeChrome />

      {headerBlocks.map((section, index) => (
        <div key={section.section_id ?? `Nav_TopBar-${index}`} className="w-full">
          <RenderBlock blockType="Nav_TopBar" page={page} />
        </div>
      ))}

      <div className={cn('mx-auto', isCompact ? 'max-w-2xl' : 'max-w-6xl')}>
        {bodyBlocks.length === 0 && footerBlocks.length === 0 && headerBlocks.length === 0 ? (
          <RenderBlock blockType="Layout_EmptyState" page={page} />
        ) : (
          bodyBlocks.map((section, index) => (
            <div key={section.section_id ?? `${section.block_type}-${index}`}>
              <RenderBlock blockType={section.block_type ?? 'Layout_EmptyState'} page={page} />
            </div>
          ))
        )}
      </div>

      {footerBlocks.map((section, index) => (
        <div key={section.section_id ?? `Nav_Footer-${index}`} className="w-full">
          <RenderBlock blockType="Nav_Footer" page={page} />
        </div>
      ))}

      <Section className="pt-0">
        <Card className="p-4 flex flex-wrap items-center gap-2 text-xs text-app-muted">
          <ImageIcon size={12} />
          Uses shadcn components + dummy text/icons/vectors/images across sitemap preset sections.
          <div className="ml-auto flex gap-2">
            <Badge variant="success">Stable</Badge>
            <Badge variant="muted">Preset mode</Badge>
          </div>
        </Card>
      </Section>
    </Shell>
  )
}

