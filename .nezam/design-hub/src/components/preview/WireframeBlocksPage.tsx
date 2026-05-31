'use client'

import { memo } from 'react'
import {
  ArrowRight,
  BarChart2,
  Check,
  ChevronRight,
  Code2,
  Globe,
  Image as ImageIcon,
  Play,
  Search,
  Shield,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BlockAvatarHeader,
  BlockFaqRow,
  BlockFormStack,
  BlockHeading,
  BlockHeroBackdrop,
  BlockHoverCard,
  BlockKpiPill,
  BlockLead,
  BlockMediaBackground,
  BlockPricingColumn,
  BlockProfileBand,
  BlockSection,
  BlockSettingsRow,
  BlockStatTile,
  BlockSurface,
  BlockTintBand,
  BlockWaitlistInline,
} from '@/components/wireframe/block-primitives'
import { Switch } from '@/components/ui/switch'
import { blockTintAt, blockTintStyles } from '@/lib/wireframe/block-visual-system'
import { isSidebarShellLayout, splitSidebarShellSections } from '@/lib/wireframe/sidebar-shell-layout'
import { cn } from '@/lib/utils'
import type { ArchPage } from '@/types/arch'
import { renderArtWireframeSection } from './art-wireframe-sections'
import {
  ArchNavFooter,
  ArchNavSidebar,
  ArchNavTopBar,
  archNavSignature,
} from './arch-nav-preview'
import { DUMMY, IllusChart, IllusDashboard, IllusEmpty, IllusFeatures, IllusHero, IllusProduct } from './dummy-content'

type WireframeSection = {
  section_id?: string
  block_type?: string
  order?: number
}

type AuthVariant = 'login' | 'signup'

/** Body blocks whose band/background should span the full preview width (not max-w-6xl). */
const FULL_BLEED_BODY_BLOCK_TYPES = new Set<string>([
  'Art_CTA_Band',
  'Art_Logos_Marquee',
  'Art_Section_Marquee',
  'Hero_ImageCover',
  'Hero_GradientMesh',
  'Art_Hero_ImageBackdrop',
])

function isFullBleedBodyBlock(blockType: string | undefined): boolean {
  return FULL_BLEED_BODY_BLOCK_TYPES.has(blockType ?? '')
}

function bodyBlockWidthClass(isCompact: boolean, blockType: string | undefined): string {
  return isFullBleedBodyBlock(blockType)
    ? 'w-full'
    : cn('mx-auto', isCompact ? 'max-w-2xl' : 'max-w-6xl')
}

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

function Shell({
  children,
  className,
  fillHeight,
}: {
  children: React.ReactNode
  className?: string
  /** When true, fill the preview viewport so only inner panes scroll (sidebar shell). */
  fillHeight?: boolean
}) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-surface)] text-[var(--text)]',
        fillHeight ? 'flex h-full min-h-0 flex-1 flex-col' : 'min-h-full',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-app-md border border-app-border bg-app-surface shadow-sm', className)}>
      {children}
    </div>
  )
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <BlockSection density="default" motion="reveal" className={className}>
      {children}
    </BlockSection>
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

function sectionsSignature(sections: WireframeSection[]): string {
  return sections
    .map((s) => `${s.section_id ?? ''}:${s.block_type ?? ''}:${s.order ?? 0}`)
    .join('|')
}

const LAZY_SECTION_STYLE = { contentVisibility: 'auto' as const, containIntrinsicSize: 'auto 320px' }

function RenderBlock({
  blockType,
  page,
  archPages,
}: {
  blockType: string
  page: ArchPage
  archPages: Record<string, ArchPage>
}) {
  const artSection = renderArtWireframeSection(blockType)
  if (artSection) return artSection

  const brand = 'var(--brand)'
  const accent = 'var(--accent)'
  switch (blockType) {
    case 'Nav_TopBar':
      return <ArchNavTopBar page={page} pages={archPages} />
    case 'Nav_Sidebar':
      return <ArchNavSidebar page={page} pages={archPages} />
    case 'Nav_Breadcrumb':
      return (
        <BlockSection density="compact" motion="reveal" className="!py-0">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
            <button type="button" className="text-app-muted transition hover:text-app-text">
              Home
            </button>
            <ChevronRight size={14} className="shrink-0 text-app-subtle" aria-hidden />
            <button type="button" className="text-app-muted transition hover:text-app-text">
              Workspace
            </button>
            <ChevronRight size={14} className="shrink-0 text-app-subtle" aria-hidden />
            <span className="font-medium text-app-text">{page.name || 'Overview'}</span>
          </nav>
        </BlockSection>
      )
    case 'Nav_Subnav':
      return (
        <BlockSection density="compact" motion="reveal" className="!py-0">
          <Tabs defaultValue="overview">
            <TabsList className="h-9 w-full justify-start rounded-none border-b border-app-border bg-transparent p-0">
              {['Overview', 'Reports', 'Settings'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="rounded-none border-b-2 border-transparent px-4 text-xs data-[state=active]:border-[var(--brand)] data-[state=active]:bg-transparent data-[state=active]:text-app-text"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </BlockSection>
      )
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
      return <ArchNavFooter page={page} pages={archPages} />
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
        <BlockSection
          density="spacious"
          motion="reveal"
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border border-app-border bg-app-elevated/80 text-app-muted mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-app-accent" />
              Trusted by 2,800+ teams
            </div>
            <BlockHeading as="h2" size="lg">{DUMMY.headings[2]}</BlockHeading>
            <BlockLead className="mb-5">{DUMMY.descriptions[2]}</BlockLead>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="md" iconEnd={<ArrowRight size={12} />}>Try it</Button>
              <Button variant="ghost" size="md">Learn more</Button>
            </div>
          </div>
          <BlockMediaBackground seed={0} minHeight="min-h-[260px]" overlay={0.12}>
            <div className="flex h-full min-h-[260px] items-center justify-center p-4">
              <IllusFeatures brand={brand} />
            </div>
          </BlockMediaBackground>
        </BlockSection>
      )
    case 'Hero_ImageCover':
      return (
        <BlockHeroBackdrop seed={1} fullBleed>
          <BlockSection density="spacious" bleed motion="reveal" className="relative text-center max-w-3xl">
            <Badge variant="muted" className="mb-4">Featured launch</Badge>
            <BlockHeading as="h1" size="xl">{DUMMY.headings[0]}</BlockHeading>
            <BlockLead className="mx-auto mb-6">{DUMMY.descriptions[0]}</BlockLead>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="primary" size="md">Get started</Button>
              <Button variant="outline" size="md">See examples</Button>
            </div>
          </BlockSection>
        </BlockHeroBackdrop>
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
        <BlockSection density="default" motion="reveal">
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.features.slice(0, 3).map((f, i) => (
              <BlockHoverCard key={f.title} index={i} tint={blockTintAt(i)}>
                <div
                  className="h-10 w-10 rounded-app-sm mb-3 flex items-center justify-center border"
                  style={{
                    background: blockTintStyles(blockTintAt(i)).bg,
                    borderColor: blockTintStyles(blockTintAt(i)).border,
                  }}
                >
                  <Star size={14} style={{ color: blockTintStyles(blockTintAt(i)).subtle }} />
                </div>
                <div className="text-sm font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-app-muted leading-relaxed">{f.desc}</p>
              </BlockHoverCard>
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_SplitMedia':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div>
              <BlockHeading size="lg">{DUMMY.headings[1]}</BlockHeading>
              <BlockLead className="mb-5">{DUMMY.descriptions[1]}</BlockLead>
              <Button variant="primary" size="md" iconEnd={<ArrowRight size={12} />}>Explore</Button>
            </div>
            <BlockMediaBackground seed={3} minHeight="min-h-[240px] md:min-h-[300px]" overlay={0.18} />
          </div>
        </BlockSection>
      )
    case 'Content_ProfileBands':
      return (
        <BlockSection density="default" motion="reveal" className="space-y-4">
          <div className="max-w-2xl mb-1">
            <BlockHeading size="md">Built for every lane</BlockHeading>
            <BlockLead>Profile tints cycle across bands so previews reflect your locked design system.</BlockLead>
          </div>
          {DUMMY.features.slice(0, 3).map((f, i) => (
            <BlockProfileBand key={f.title} title={f.title} subtitle={f.desc} seed={i + 4} index={i} />
          ))}
        </BlockSection>
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
        <BlockSection density="default" motion="reveal">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <BlockHeading size="lg" className="mb-2">Everything you need</BlockHeading>
            <BlockLead className="mx-auto">Sections built from icons, text, vectors, and components.</BlockLead>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {DUMMY.features.slice(0, 6).map((f, i) => (
              <BlockHoverCard key={f.title} index={i} tint={blockTintAt(i)}>
                <div
                  className="h-12 w-12 rounded-app-md border flex items-center justify-center mb-4"
                  style={{
                    background: `color-mix(in oklab, var(--accent) 10%, var(--app-surface))`,
                    borderColor: 'color-mix(in oklab, var(--accent) 22%, var(--app-border))',
                  }}
                >
                  {featureIcons[i]}
                </div>
                <div className="text-sm font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-app-muted leading-relaxed">{f.desc}</p>
              </BlockHoverCard>
            ))}
          </div>
        </BlockSection>
      )
    }
    case 'Content_Pricing':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {DUMMY.prices.map((p, i) => (
              <BlockPricingColumn
                key={p.name}
                name={p.name}
                price={p.price}
                desc={p.desc}
                featured={p.featured}
                index={i}
              />
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_PricingToggle':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="flex justify-center mb-6">
            <Tabs defaultValue="monthly">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual · save 20%</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {DUMMY.prices.map((p, i) => (
              <BlockPricingColumn
                key={p.name}
                name={p.name}
                price={p.price}
                desc={p.desc}
                featured={p.featured}
                index={i}
              />
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_FeatureBento':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid md:grid-cols-12 gap-3 auto-rows-[minmax(100px,auto)]">
            {DUMMY.features.slice(0, 4).map((f, i) => (
              <BlockHoverCard
                key={f.title}
                index={i}
                tint={blockTintAt(i)}
                className={cn(
                  'flex flex-col justify-end',
                  i === 0 && 'md:col-span-7 md:row-span-2 min-h-[200px]',
                  i === 1 && 'md:col-span-5',
                  i === 2 && 'md:col-span-4',
                  i === 3 && 'md:col-span-8',
                )}
              >
                <div className="text-sm font-semibold mb-1">{f.title}</div>
                <p className="text-xs text-app-muted leading-relaxed">{f.desc}</p>
              </BlockHoverCard>
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_FAQ':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="max-w-3xl mx-auto space-y-2">
            {['Is there a free plan?', 'Can I cancel anytime?', 'Do you support SSO?', 'Do you offer onboarding?'].map(
              (q) => (
                <BlockFaqRow key={q} question={q} />
              ),
            )}
          </div>
        </BlockSection>
      )
    case 'Content_CTA':
      return (
        <BlockSection density="compact" motion="reveal">
          <BlockTintBand tint="accent" className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
            <div>
              <div className="text-xl font-bold mb-1">Ready to launch your project?</div>
              <p className="text-sm opacity-80 max-w-md">Ship production-ready interfaces with reusable blocks.</p>
            </div>
            <Button
              variant="ghost"
              size="lg"
              className="shrink-0 min-w-[7.5rem] border border-white bg-transparent text-white font-semibold tracking-tight hover:bg-white hover:text-app-muted hover:border-white active:scale-[0.98] whitespace-nowrap"
            >
              Start now
            </Button>
          </BlockTintBand>
        </BlockSection>
      )
    case 'Content_Stats':
      return (
        <BlockSection density="compact" motion="reveal">
          <div className="grid md:grid-cols-4 gap-3">
            {DUMMY.stats.map((s, i) => (
              <BlockStatTile key={s.label} label={s.label} value={s.value} change={s.change} index={i} />
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_Testimonials':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.team.slice(0, 3).map((member, i) => (
              <BlockHoverCard key={member.name} index={i} tint={blockTintAt(i)} className="block-hover-lift">
                <p className="text-sm mb-4 leading-relaxed">&ldquo;{DUMMY.descriptions[0]}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <Avatar size="md">
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs font-semibold">{member.name}</div>
                    <div className="text-[11px] text-app-muted">{member.role}</div>
                  </div>
                </div>
              </BlockHoverCard>
            ))}
          </div>
        </BlockSection>
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
              <Card
                key={name}
                className="h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-default block-hover-glow"
              >
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
        <BlockSection density="default" motion="reveal">
          <BlockSurface tint="surface" padding="p-5" className="max-w-md mx-auto">
            <BlockHeading as="h3" size="md" className="mb-4">
              Sign in
            </BlockHeading>
            <BlockFormStack>
              <Input label="Email" placeholder="you@company.com" />
              <Input label="Password" type="password" placeholder="********" />
              <Button variant="primary" size="md" className="w-full">
                Continue
              </Button>
            </BlockFormStack>
          </BlockSurface>
        </BlockSection>
      )
    case 'Form_SplitAuth':
      return (
        <BlockSection density="default" motion="reveal" bleed className="grid md:grid-cols-2 min-h-[420px]">
          <BlockMediaBackground seed={5} minHeight="min-h-[280px] md:min-h-full" overlay={0.2} className="hidden md:block" />
          <div className="flex items-center justify-center p-6 md:p-10">
            <BlockSurface tint="surface" padding="p-5" className="w-full max-w-sm">
              <BlockHeading as="h3" size="md" className="mb-4">
                Welcome back
              </BlockHeading>
              <BlockFormStack>
                <Input label="Email" placeholder="you@company.com" />
                <Input label="Password" type="password" placeholder="********" />
                <Button variant="primary" size="md" className="w-full">
                  Sign in
                </Button>
              </BlockFormStack>
            </BlockSurface>
          </div>
        </BlockSection>
      )
    case 'Form_Contact':
      return (
        <BlockSection density="default" motion="reveal">
          <BlockSurface tint="surface" padding="p-5" className="max-w-2xl mx-auto">
            <BlockHeading as="h3" size="md" className="mb-4">
              Contact us
            </BlockHeading>
            <div className="grid md:grid-cols-2 gap-3 mb-3">
              <Input label="First name" placeholder="Alex" />
              <Input label="Last name" placeholder="Rivera" />
            </div>
            <Input label="Email" placeholder="alex@example.com" className="mb-3" />
            <textarea
              className="w-full h-24 rounded-app-sm border border-app-border bg-app-inset p-2.5 text-xs"
              placeholder="Your message..."
            />
            <Button variant="primary" size="md" className="mt-3">
              Send message
            </Button>
          </BlockSurface>
        </BlockSection>
      )
    case 'Form_Newsletter':
      return (
        <BlockSection density="compact" motion="reveal">
          <Card className="max-w-2xl mx-auto p-5 md:p-6 border-app-border/80">
            <BlockHeading as="h3" size="md" className="mb-2">Join our newsletter</BlockHeading>
            <BlockLead className="mb-4">Product updates and layout recipes, no spam.</BlockLead>
            <BlockWaitlistInline placeholder="you@company.com" cta="Subscribe" />
          </Card>
        </BlockSection>
      )
    case 'Form_WaitlistInline':
      return (
        <BlockSection density="compact" motion="reveal" className="text-center">
          <BlockHeading as="h3" size="md" className="mb-2">Join the waitlist</BlockHeading>
          <BlockLead className="mx-auto mb-5 max-w-lg">{DUMMY.descriptions[2]}</BlockLead>
          <div className="flex justify-center">
            <BlockWaitlistInline />
          </div>
        </BlockSection>
      )
    case 'Form_Signup':
      return (
        <BlockSection density="default" motion="reveal">
          <BlockSurface tint="surface" padding="p-5" className="max-w-md mx-auto">
            <BlockHeading as="h3" size="md" className="mb-4">
              Create account
            </BlockHeading>
            <BlockFormStack>
              <Input label="Full name" placeholder="Alex Rivera" />
              <Input label="Email" placeholder="you@company.com" />
              <Input label="Password" type="password" placeholder="********" />
              <Button variant="primary" size="md" className="w-full">
                Create account
              </Button>
            </BlockFormStack>
          </BlockSurface>
        </BlockSection>
      )
    case 'Hero_GradientMesh':
      return (
        <BlockSection
          density="spacious"
          motion="reveal"
          bleed
          className="relative min-h-[300px] flex items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 40%, color-mix(in srgb, var(--brand) 35%, transparent), transparent),
              radial-gradient(ellipse 70% 50% at 80% 60%, color-mix(in srgb, var(--accent) 28%, transparent), transparent),
              var(--app-surface)`,
          }}
        >
          <div className="text-center relative z-[1] px-6 max-w-2xl">
            <BlockHeading as="h1" size="xl">
              {DUMMY.headings[0]}
            </BlockHeading>
            <BlockLead className="mb-5">{DUMMY.descriptions[1]}</BlockLead>
            <Button variant="primary" size="md">
              Explore
            </Button>
          </div>
        </BlockSection>
      )
    case 'Data_KPI_Row':
      return (
        <BlockSection density="compact" motion="reveal">
          <div className="grid md:grid-cols-4 gap-3">
            {DUMMY.stats.map((s, i) => (
              <BlockStatTile key={s.label} label={s.label} value={s.value} change={s.change} index={i} />
            ))}
          </div>
        </BlockSection>
      )
    case 'Data_Table':
      return (
        <BlockSection density="compact" motion="reveal">
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
        </BlockSection>
      )
    case 'Data_Chart':
      return (
        <BlockSection density="compact" motion="reveal">
          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">Usage trend</div>
            <div className="h-56">
              <IllusChart brand={brand} accent={accent} />
            </div>
          </Card>
        </BlockSection>
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
    case 'Content_ContactChannels':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Email', body: 'hello@company.com', icon: Globe },
              { title: 'Phone', body: '+1 (555) 010-2000', icon: Users },
              { title: 'Hours', body: 'Mon–Fri, 9am–6pm', icon: Shield },
            ].map((ch, i) => (
              <BlockHoverCard key={ch.title} index={i}>
                <div className="text-sm font-semibold mb-1">{ch.title}</div>
                <p className="text-xs text-app-muted leading-relaxed">{ch.body}</p>
              </BlockHoverCard>
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_ContactSplit':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid lg:grid-cols-2 gap-6">
            <BlockSurface tint="surface" padding="p-5">
              <BlockHeading as="h3" size="md" className="mb-4">
                Send a message
              </BlockHeading>
              <Input label="Name" placeholder="Your name" className="mb-3" />
              <Input label="Email" placeholder="you@company.com" className="mb-3" />
              <textarea
                className="w-full h-24 rounded-app-sm border border-app-border bg-app-inset p-2.5 text-xs"
                placeholder="How can we help?"
              />
              <Button variant="primary" size="md" className="mt-3">
                Send message
              </Button>
            </BlockSurface>
            <BlockSurface tint="muted" padding="p-0" className="relative overflow-hidden min-h-[16rem]">
              <BlockMediaBackground seed={3} minHeight="min-h-[16rem]" />
              <div className="relative p-5">
                <BlockHeading as="h3" size="md">
                  Visit us
                </BlockHeading>
                <BlockLead className="mt-2">123 Market Street, Suite 400</BlockLead>
              </div>
            </BlockSurface>
          </div>
        </BlockSection>
      )
    case 'Content_UserInvite':
      return (
        <BlockSection density="compact" motion="reveal">
          <BlockSurface tint="surface" padding="p-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <Input label="Invite by email" placeholder="teammate@company.com" className="flex-1" />
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm">
                  Member
                </Button>
                <Button variant="primary" size="sm">
                  Send invite
                </Button>
              </div>
            </div>
          </BlockSurface>
        </BlockSection>
      )
    case 'Content_ProfileHeader':
      return (
        <BlockSection density="compact" motion="reveal">
          <BlockSurface tint="surface" padding="p-5">
            <BlockAvatarHeader
              name="Alex Rivera"
              subtitle="alex@company.com"
              role="Workspace admin"
            />
          </BlockSurface>
        </BlockSection>
      )
    case 'Content_AboutHero':
      return (
        <BlockSection density="default" motion="reveal">
          <BlockHeroBackdrop seed={1}>
            <BlockHeading as="h2" size="lg" className="max-w-xl">
              We build tools that help teams ship with clarity
            </BlockHeading>
            <BlockLead className="mt-3 max-w-lg">
              Our mission is to make product decisions visible, measurable, and humane.
            </BlockLead>
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md">
              {DUMMY.stats.slice(0, 3).map((s, i) => (
                <BlockStatTile key={s.label} label={s.label} value={s.value} change={s.change} index={i} />
              ))}
            </div>
          </BlockHeroBackdrop>
        </BlockSection>
      )
    case 'Content_AboutValues':
      return (
        <BlockSection density="default" motion="reveal">
          <BlockHeading as="h3" size="md" className="mb-4 text-center">
            What we stand for
          </BlockHeading>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Craft', body: 'Polish the details that users feel every day.' },
              { title: 'Trust', body: 'Security and transparency are non-negotiable.' },
              { title: 'Momentum', body: 'Ship iteratively without losing the north star.' },
            ].map((v, i) => (
              <BlockHoverCard key={v.title} index={i}>
                <div className="text-sm font-semibold mb-1">{v.title}</div>
                <p className="text-xs text-app-muted leading-relaxed">{v.body}</p>
              </BlockHoverCard>
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_AboutTimeline':
      return (
        <BlockSection density="default" motion="reveal">
          <BlockHeading as="h3" size="md" className="mb-6">
            Our story
          </BlockHeading>
          <div className="space-y-4 border-l-2 border-app-border pl-6">
            {[
              { year: '2022', title: 'Founded', desc: 'Started as a design systems consultancy.' },
              { year: '2024', title: 'Platform launch', desc: 'Shipped the first public beta.' },
              { year: '2026', title: 'Global teams', desc: 'Serving customers in 40+ countries.' },
            ].map((m) => (
              <div key={m.year} className="relative">
                <span className="absolute -left-[1.6rem] top-1 h-2.5 w-2.5 rounded-full bg-app-accent border-2 border-app-surface" />
                <div className="text-[11px] text-app-muted">{m.year}</div>
                <div className="font-semibold text-sm">{m.title}</div>
                <div className="text-xs text-app-muted mt-0.5">{m.desc}</div>
              </div>
            ))}
          </div>
        </BlockSection>
      )
    case 'Content_DangerZone':
      return (
        <BlockSection density="compact" motion="reveal">
          <Card className="p-5 border-[color-mix(in_srgb,var(--app-danger,#ef4444)_40%,var(--app-border))]">
            <BlockHeading as="h3" size="md" className="mb-2 text-[var(--app-danger,#ef4444)]">
              Danger zone
            </BlockHeading>
            <BlockLead className="mb-4">
              Irreversible actions for this workspace or account.
            </BlockLead>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Revoke API keys
              </Button>
              <Button variant="outline" size="sm" className="text-[var(--app-danger,#ef4444)] border-[color-mix(in_srgb,var(--app-danger,#ef4444)_50%,var(--app-border))]">
                Delete account
              </Button>
            </div>
          </Card>
        </BlockSection>
      )
    case 'Form_ProfileDetails':
      return (
        <BlockSection density="compact" motion="reveal">
          <BlockSurface tint="surface" padding="p-5">
            <BlockFormStack>
              <Input label="Display name" placeholder="Alex Rivera" />
              <Input label="Email" placeholder="alex@company.com" />
              <div>
                <label className="text-[11px] text-app-muted mb-1 block">Bio</label>
                <textarea
                  className="w-full h-20 rounded-app-sm border border-app-border bg-app-inset p-2.5 text-xs"
                  placeholder="Tell teammates about yourself"
                />
              </div>
            </BlockFormStack>
            <Button variant="primary" size="md" className="mt-4">
              Save changes
            </Button>
          </BlockSurface>
        </BlockSection>
      )
    case 'Form_SettingsSections':
      return (
        <BlockSection density="compact" motion="reveal">
          <BlockSurface tint="surface" padding="p-5">
            <BlockHeading as="h3" size="md" className="mb-2">
              Notifications
            </BlockHeading>
            <BlockSettingsRow
              label="Email digests"
              description="Weekly summary of workspace activity"
              control={<Switch defaultChecked />}
            />
            <BlockSettingsRow
              label="Product updates"
              description="Release notes and feature announcements"
              control={<Switch defaultChecked />}
            />
            <BlockHeading as="h3" size="md" className="mt-6 mb-2">
              Privacy
            </BlockHeading>
            <BlockSettingsRow
              label="Profile visibility"
              description="Show profile to other workspace members"
              control={<Switch />}
            />
          </BlockSurface>
        </BlockSection>
      )
    case 'Data_UserTable':
      return (
        <BlockSection density="compact" motion="reveal">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input placeholder="Search members..." className="flex-1" />
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] text-[11px] text-app-muted bg-app-elevated px-4 py-2 border-b border-app-border">
              <span>Member</span>
              <span>Role</span>
              <span>Status</span>
              <span />
            </div>
            {DUMMY.names.slice(0, 6).map((name, i) => (
              <div
                key={name}
                className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-4 py-2.5 border-b border-app-border last:border-0 text-xs gap-2"
              >
                <span className="font-medium">{name}</span>
                <Badge variant="muted">{['Admin', 'Editor', 'Viewer'][i % 3]}</Badge>
                <span className="text-app-muted">{['Active', 'Pending', 'Invited'][i % 3]}</span>
                <Button variant="ghost" size="sm" className="text-[10px] h-7">
                  ···
                </Button>
              </div>
            ))}
          </Card>
          <div className="flex justify-between items-center mt-3 text-[11px] text-app-muted">
            <span>1–6 of 24</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2">
                Prev
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-2">
                Next
              </Button>
            </div>
          </div>
        </BlockSection>
      )
    case 'Data_AnalyticsToolbar':
      return (
        <BlockSection density="compact" motion="reveal">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap gap-2">
              {['7d', '30d', '90d'].map((r, i) => (
                <Button key={r} variant={i === 1 ? 'primary' : 'outline'} size="sm">
                  {r}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="flex items-center gap-2 text-xs text-app-muted">
                <Switch defaultChecked />
                Compare
              </label>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
        </BlockSection>
      )
    case 'Data_AnalyticsOverview':
      return (
        <BlockSection density="compact" motion="reveal">
          <div className="grid lg:grid-cols-[1fr_12rem] gap-4">
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {DUMMY.stats.slice(0, 3).map((s, i) => (
                  <BlockStatTile key={s.label} label={s.label} value={s.value} change={s.change} index={i} />
                ))}
              </div>
              <div className="h-48">
                <IllusChart brand={brand} accent={accent} />
              </div>
            </Card>
            <div className="space-y-2">
              {DUMMY.stats.slice(0, 4).map((s, i) => (
                <BlockKpiPill key={s.label} label={s.label} value={s.value} delta={s.change} index={i} />
              ))}
            </div>
          </div>
        </BlockSection>
      )
    case 'Data_AnalyticsChartGrid':
      return (
        <BlockSection density="compact" motion="reveal">
          <div className="grid md:grid-cols-2 gap-4">
            {['Sessions', 'Conversion', 'Retention', 'Revenue'].map((title, i) => (
              <Card key={title} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-semibold">{title}</div>
                  <Badge variant="muted" className="text-[10px]">
                    {DUMMY.stats[i % DUMMY.stats.length]?.change ?? '+0%'}
                  </Badge>
                </div>
                <div className="h-24">
                  <IllusChart brand={brand} accent={accent} />
                </div>
              </Card>
            ))}
          </div>
        </BlockSection>
      )
    case 'Layout_ProfileTabs':
      return (
        <BlockSection density="compact" motion="reveal" className="!py-0">
          <Tabs defaultValue="profile">
            <TabsList className="h-9 w-full justify-start rounded-none border-b border-app-border bg-transparent p-0">
              {['Profile', 'Security', 'Notifications'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-app-accent data-[state=active]:bg-transparent text-xs"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </BlockSection>
      )
    case 'Layout_SettingsShell':
      return (
        <BlockSection density="default" motion="reveal">
          <div className="grid lg:grid-cols-[14rem_1fr] gap-6 min-h-[20rem]">
            <Card className="p-2">
              {['General', 'Notifications', 'Billing', 'API'].map((item, i) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-app-sm text-xs',
                    i === 0 ? 'bg-app-accent/15 text-app-text font-medium' : 'text-app-muted hover:bg-app-elevated',
                  )}
                >
                  {item}
                </button>
              ))}
            </Card>
            <BlockSurface tint="surface" padding="p-5">
              <BlockHeading as="h3" size="md" className="mb-2">
                General
              </BlockHeading>
              <BlockLead className="mb-4">Workspace name, locale, and defaults.</BlockLead>
              <Input label="Workspace name" placeholder="Acme Inc." />
            </BlockSurface>
          </div>
        </BlockSection>
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

const MemoRenderBlock = memo(RenderBlock, (prev, next) => {
  return (
    prev.blockType === next.blockType &&
    prev.page.id === next.page.id &&
    archNavSignature(prev.page, prev.archPages) === archNavSignature(next.page, next.archPages)
  )
})

function WireframeBlocksPageInner({
  page,
  sections,
  device,
  archPages,
}: {
  page: ArchPage
  sections: WireframeSection[]
  device: 'desktop' | 'tablet' | 'mobile'
  archPages: Record<string, ArchPage>
}) {
  const isCompact = device !== 'desktop'
  const ordered = [...sections].sort((a, b) => {
    const ao = Number(a.order ?? 0)
    const bo = Number(b.order ?? 0)
    return ao - bo
  })

  const authPage =
    isAuthPage(page) || ordered.some((section) => section.block_type === 'Layout_AuthSplit')
  const sidebarShell = !authPage && isSidebarShellLayout(ordered)
  const { main: mainSections } = splitSidebarShellSections(ordered)

  if (authPage) {
    const hasAuthBlock = ordered.some((section) => section.block_type === 'Layout_AuthSplit')
    return (
      <Shell>
        {hasAuthBlock ? (
          <MemoRenderBlock blockType="Layout_AuthSplit" page={page} archPages={archPages} />
        ) : (
          <LayoutAuthSplit page={page} variant={getAuthVariant(page)} />
        )}
      </Shell>
    )
  }

  if (sidebarShell) {
    return (
      <Shell fillHeight={!isCompact}>
        <div
          className={cn(
            'grid min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[240px_1fr]',
            isCompact
              ? 'mx-auto min-h-[520px] max-w-2xl'
              : 'min-h-0 flex-1',
          )}
        >
          <div className="hidden h-full min-h-0 overflow-hidden md:block">
            <ArchNavSidebar page={page} pages={archPages} />
          </div>
          {isCompact ? (
            <div className="border-b border-app-border md:hidden">
              <ArchNavSidebar page={page} pages={archPages} />
            </div>
          ) : null}
          <main className="min-h-0 min-w-0 h-full max-h-full overflow-y-auto overscroll-contain bg-[var(--bg-surface)] app-scroll">
            {mainSections.length === 0 ? (
              <MemoRenderBlock blockType="Layout_EmptyState" page={page} archPages={archPages} />
            ) : (
              mainSections.map((section, index) => (
                <div
                  key={section.section_id ?? `${section.block_type}-${index}`}
                  style={LAZY_SECTION_STYLE}
                >
                  <MemoRenderBlock
                    blockType={section.block_type ?? 'Layout_EmptyState'}
                    page={page}
                    archPages={archPages}
                  />
                </div>
              ))
            )}
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
          </main>
        </div>
      </Shell>
    )
  }

  const headerBlocks = ordered.filter(s => s.block_type === 'Nav_TopBar')
  const footerBlocks = ordered.filter(s => s.block_type === 'Nav_Footer')
  const bodyBlocks   = ordered.filter(s => s.block_type !== 'Nav_TopBar' && s.block_type !== 'Nav_Footer')

  return (
    <Shell>
      {headerBlocks.map((section, index) => (
        <div key={section.section_id ?? `Nav_TopBar-${index}`} className="w-full">
          <MemoRenderBlock blockType="Nav_TopBar" page={page} archPages={archPages} />
        </div>
      ))}

      {bodyBlocks.length === 0 && footerBlocks.length === 0 && headerBlocks.length === 0 ? (
        <div className={bodyBlockWidthClass(isCompact, 'Layout_EmptyState')}>
          <MemoRenderBlock blockType="Layout_EmptyState" page={page} archPages={archPages} />
        </div>
      ) : (
        bodyBlocks.map((section, index) => {
          const blockType = section.block_type ?? 'Layout_EmptyState'
          return (
            <div
              key={section.section_id ?? `${blockType}-${index}`}
              className={bodyBlockWidthClass(isCompact, blockType)}
              style={LAZY_SECTION_STYLE}
            >
              <MemoRenderBlock blockType={blockType} page={page} archPages={archPages} />
            </div>
          )
        })
      )}

      {footerBlocks.map((section, index) => (
        <div key={section.section_id ?? `Nav_Footer-${index}`} className="w-full">
          <MemoRenderBlock blockType="Nav_Footer" page={page} archPages={archPages} />
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

export const WireframeBlocksPage = memo(WireframeBlocksPageInner, (prev, next) => {
  return (
    prev.page.id === next.page.id &&
    prev.device === next.device &&
    prev.archPages === next.archPages &&
    sectionsSignature(prev.sections) === sectionsSignature(next.sections)
  )
})

