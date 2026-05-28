'use client'

import {
  ArrowRight,
  BarChart3,
  Check,
  Layers,
  LayoutGrid,
  Quote,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasArtShadcnBlockPreview } from '@/lib/wireframe/art-shadcn-block-previews'
import { cn } from '@/lib/utils'
import { DUMMY, IllusDashboard, IllusFeatures, IllusHero } from './dummy-content'

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('px-6 py-14 max-w-6xl mx-auto', className)}>{children}</section>
}

function PageCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-app-md border border-app-border bg-app-surface shadow-sm', className)}>
      {children}
    </div>
  )
}

export function renderArtWireframeSection(blockType: string): React.ReactNode | null {
  if (!hasArtShadcnBlockPreview(blockType)) return null

  switch (blockType) {
    case 'Art_Hero_Cinematic':
      return (
        <Section className="pt-16 md:pt-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="muted" className="mb-4">New release</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Build something remarkable</h1>
              <p className="text-sm text-app-muted mb-6 max-w-md">{DUMMY.descriptions[0]}</p>
              <div className="flex gap-2">
                <Button variant="primary" size="md">Start building</Button>
                <Button variant="outline" size="md">Watch demo</Button>
              </div>
            </div>
            <PageCard className="p-2 overflow-hidden">
              <div className="h-56 md:h-72 rounded-app-sm overflow-hidden">
                <IllusHero brand="var(--brand)" />
              </div>
            </PageCard>
          </div>
        </Section>
      )
    case 'Art_Hero_Bento':
      return (
        <Section className="text-center">
          <h1 className="text-3xl font-bold mb-2">{DUMMY.headings[1]}</h1>
          <p className="text-sm text-app-muted mb-8 max-w-xl mx-auto">{DUMMY.descriptions[1]}</p>
          <div className="grid grid-cols-4 grid-rows-2 gap-3 max-w-3xl mx-auto text-start">
            <Card className="col-span-2 row-span-2 p-4">
              <Sparkles className="h-5 w-5 text-app-accent mb-2" />
              <div className="font-semibold text-sm mb-1">Composable blocks</div>
              <p className="text-xs text-app-muted">Ship polished sections from your wireframe lock.</p>
            </Card>
            {['Speed', 'Quality', 'Scale'].map((t) => (
              <Card key={t} className="p-3">
                <div className="text-xs font-semibold">{t}</div>
                <p className="text-[11px] text-app-muted mt-1">Marketing-ready layout.</p>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Hero_StatsFloat':
      return (
        <Section className="text-center">
          <h1 className="text-4xl font-bold mb-3">{DUMMY.headings[0]}</h1>
          <p className="text-sm text-app-muted max-w-2xl mx-auto mb-8">{DUMMY.descriptions[2]}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { v: '98%', l: 'Satisfaction' },
              { v: '2.4k', l: 'Teams' },
              { v: '4.9', l: 'Rating' },
            ].map((s) => (
              <Badge key={s.l} variant="muted" className="px-4 py-2 text-sm border border-app-border">
                <span className="font-bold text-app-accent me-2">{s.v}</span>
                {s.l}
              </Badge>
            ))}
          </div>
        </Section>
      )
    case 'Art_BentoGrid_4':
      return (
        <Section>
          <div className="grid md:grid-cols-2 gap-3">
            {[LayoutGrid, Zap, Layers, Star].map((Icon, i) => (
              <Card key={i} className={cn('p-4', i === 0 && 'md:row-span-1')}>
                <Icon className="h-5 w-5 text-app-accent mb-2" />
                <div className="font-semibold text-sm">Capability {i + 1}</div>
                <p className="text-xs text-app-muted mt-1">{DUMMY.descriptions[i % 3]}</p>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_BentoGrid_6':
      return (
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-3">
                <Skeleton className="h-20 mb-2 rounded-app-sm" />
                <div className="text-xs font-semibold">Highlight {i + 1}</div>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Feature_Zigzag':
      return (
        <Section className="space-y-10">
          {DUMMY.features.slice(0, 3).map((f, i) => (
            <div
              key={f.title}
              className={cn('flex flex-col md:flex-row gap-6 items-center', i % 2 === 1 && 'md:flex-row-reverse')}
            >
              <div className="h-24 w-24 rounded-app-md bg-app-accent/10 flex items-center justify-center shrink-0">
                <Zap className="h-8 w-8 text-app-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-app-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </Section>
      )
    case 'Art_Feature_IconMatrix':
      return (
        <Section>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DUMMY.features.map((f) => (
              <Card key={f.title} className="p-4">
                <BarChart3 className="h-5 w-5 text-app-accent mb-2" />
                <div className="font-semibold text-sm mb-1">{f.title}</div>
                <p className="text-xs text-app-muted">{f.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Pricing_Spotlight':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {['Starter', 'Growth', 'Enterprise'].map((tier, i) => (
              <Card
                key={tier}
                className={cn('p-5 flex flex-col', i === 1 && 'ring-2 ring-app-accent border-app-accent/40 scale-[1.02]')}
              >
                {i === 1 ? <Badge className="w-fit mb-2">Most popular</Badge> : null}
                <div className="text-lg font-bold mb-1">{tier}</div>
                <div className="text-2xl font-bold text-app-accent mb-4">${(i + 1) * 19}</div>
                <ul className="text-xs text-app-muted space-y-1 mb-4 flex-1">
                  <li>• Unlimited projects</li>
                  <li>• Team seats</li>
                  <li>• Priority support</li>
                </ul>
                <Button variant={i === 1 ? 'primary' : 'outline'} size="sm" className="w-full">
                  Choose plan
                </Button>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Testimonial_Spotlight': {
      const spotlight = DUMMY.team[0]
      return (
        <Section>
          <Card className="p-8 md:p-12 text-center max-w-3xl mx-auto">
            <Quote className="h-8 w-8 text-app-accent mx-auto mb-4" />
            <p className="text-lg md:text-xl font-medium mb-6">&ldquo;{DUMMY.descriptions[0]}&rdquo;</p>
            <div className="flex items-center justify-center gap-3">
              <Avatar>
                <AvatarFallback>{spotlight.initials}</AvatarFallback>
              </Avatar>
              <div className="text-start text-sm">
                <div className="font-semibold">{spotlight.name}</div>
                <div className="text-app-muted text-xs">{spotlight.role}</div>
              </div>
            </div>
          </Card>
        </Section>
      )
    }
    case 'Art_Testimonial_Masonry':
      return (
        <Section>
          <div className="columns-1 md:columns-3 gap-4 space-y-4">
            {DUMMY.team.map((member) => (
              <Card key={member.name} className="p-4 break-inside-avoid">
                <p className="text-sm mb-3">&ldquo;{DUMMY.descriptions[1]}&rdquo;</p>
                <div className="flex items-center gap-2 text-xs">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Logos_Marquee':
      return (
        <section className="py-8 border-y border-app-border bg-app-elevated/40">
          <p className="text-center text-xs text-app-muted mb-4">Trusted by product teams</p>
          <div className="flex flex-wrap justify-center gap-6 px-6 max-w-5xl mx-auto motion-reduce:flex motion-reduce:flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-app-sm" />
            ))}
          </div>
        </section>
      )
    case 'Art_Stats_BigNumber':
      return (
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: '12k+', l: 'Active users' },
              { v: '98%', l: 'Uptime' },
              { v: '4.9', l: 'Avg rating' },
              { v: '24/7', l: 'Support' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-bold text-app-accent mb-1">{s.v}</div>
                <div className="text-sm text-app-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </Section>
      )
    case 'Art_Team_Portraits':
      return (
        <Section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DUMMY.team.map((m) => (
              <Card key={m.name} className="p-4 text-center">
                <Avatar className="h-14 w-14 mx-auto mb-2">
                  <AvatarFallback>{m.initials}</AvatarFallback>
                </Avatar>
                <div className="font-semibold text-sm">{m.name}</div>
                <Badge variant="muted" className="mt-1 text-[10px]">
                  {m.role}
                </Badge>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_CaseStudy_Row':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4">
            {DUMMY.blogPosts.slice(0, 3).map((post) => (
              <Card key={post.title} className="p-5">
                <Badge variant="muted" className="mb-2">
                  {post.tag}
                </Badge>
                <h3 className="font-semibold mb-2">{post.title}</h3>
                <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />}>
                  Read case study
                </Button>
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Gallery_Masonry':
      return (
        <Section>
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className={cn('w-full rounded-app-md break-inside-avoid', i % 2 ? 'h-40' : 'h-28')} />
            ))}
          </div>
        </Section>
      )
    case 'Art_Media_SplitCinematic':
      return (
        <Section>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">See the product in motion</h2>
              <p className="text-sm text-app-muted mb-4">{DUMMY.descriptions[3]}</p>
              <Button variant="primary" size="md">
                Explore features
              </Button>
            </div>
            <PageCard className="p-2">
              <div className="h-64 rounded-app-sm overflow-hidden">
                <IllusProductPlaceholder />
              </div>
            </PageCard>
          </div>
        </Section>
      )
    case 'Art_Comparison_Matrix':
      return (
        <Section>
          <PageCard className="overflow-x-auto p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-app-muted">
                  <th className="text-start p-2" />
                  {['Basic', 'Pro', 'Enterprise'].map((h) => (
                    <th key={h} className="p-2 text-center font-semibold text-app-text">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['API access', 'SSO', 'SLA'].map((row) => (
                  <tr key={row} className="border-t border-app-border">
                    <td className="p-2 text-app-muted">{row}</td>
                    {[0, 1, 2].map((c) => (
                      <td key={c} className="p-2 text-center">
                        <Check className="h-4 w-4 text-app-accent inline-block" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </PageCard>
        </Section>
      )
    case 'Art_CTA_Band':
      return (
        <section className="py-12 bg-app-elevated border-y border-app-border">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Ready to ship your next release?</h2>
              <p className="text-sm text-app-muted">Start with locked wireframes and design tokens.</p>
            </div>
            <Button variant="primary" size="md">
              Get started
            </Button>
          </div>
        </section>
      )
    case 'Art_Newsletter_Card':
      return (
        <Section>
          <Card className="max-w-lg mx-auto p-6 text-center">
            <CardHeader className="p-0 pb-2">
              <h3 className="text-lg font-semibold">Stay in the loop</h3>
              <p className="text-sm text-app-muted">Product updates, no spam.</p>
            </CardHeader>
            <CardContent className="p-0 pt-4 flex gap-2">
              <Input placeholder="you@company.com" className="flex-1" readOnly />
              <Button variant="primary" size="md">
                Subscribe
              </Button>
            </CardContent>
          </Card>
        </Section>
      )
    case 'Art_FAQ_Split':
      return (
        <Section>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              {[
                { q: 'Is there a free plan?', a: 'Yes — start with core wireframe blocks at no cost.' },
                { q: 'Can I export locked wireframes?', a: 'Lock sessions export to wireframes_locked.json for /DEVELOP.' },
                { q: 'Do you support RTL?', a: 'Layouts use logical spacing for Arabic and MENA markets.' },
                { q: 'How do teams collaborate?', a: 'Architecture pages bind 1:1 to wireframe sessions.' },
              ].map((item) => (
                <Card key={item.q} className="p-4">
                  <div className="font-semibold text-sm mb-1">{item.q}</div>
                  <p className="text-xs text-app-muted">{item.a}</p>
                </Card>
              ))}
            </div>
            <PageCard className="p-4 min-h-[240px] flex items-center justify-center">
              <IllusFeatures brand="var(--accent)" />
            </PageCard>
          </div>
        </Section>
      )
    case 'Art_Blog_Featured':
      return (
        <Section>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2 p-6">
              <Badge className="mb-2">Featured</Badge>
              <h3 className="text-xl font-bold mb-2">{DUMMY.blogPosts[0].title}</h3>
              <p className="text-sm text-app-muted">{DUMMY.blogPosts[0].date}</p>
            </Card>
            <div className="space-y-3">
              {DUMMY.blogPosts.slice(1, 3).map((post) => (
                <Card key={post.title} className="p-4">
                  <div className="font-semibold text-sm">{post.title}</div>
                  <div className="text-[11px] text-app-muted">{post.readTime}</div>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )
    case 'Art_Integrations_Wall':
      return (
        <Section>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="p-4 text-center relative">
                <Skeleton className="h-8 w-16 mx-auto rounded-app-sm mb-2" />
                <div className="text-xs font-medium">Integration {i + 1}</div>
                {i % 3 === 0 ? (
                  <Badge className="absolute top-2 end-2 text-[9px]">Connected</Badge>
                ) : null}
              </Card>
            ))}
          </div>
        </Section>
      )
    case 'Art_Process_Timeline':
      return (
        <Section>
          <ol className="relative border-s-2 border-app-border ps-6 space-y-8 max-w-xl">
            {['Discover', 'Design', 'Build', 'Launch'].map((step, i) => (
              <li key={step} className="relative">
                <span className="absolute -start-[calc(1.5rem+5px)] flex h-8 w-8 items-center justify-center rounded-full bg-app-accent/15 text-sm font-bold text-app-accent">
                  {i + 1}
                </span>
                <h3 className="font-semibold mb-1">{step}</h3>
                <p className="text-sm text-app-muted">{DUMMY.descriptions[i % 4]}</p>
              </li>
            ))}
          </ol>
        </Section>
      )
    case 'Art_Product_Highlight':
      return (
        <Section>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <PageCard className="p-2 overflow-hidden">
              <div className="h-56">
                <IllusProductPlaceholder />
              </div>
            </PageCard>
            <div>
              <h2 className="text-2xl font-bold mb-4">Built for modern teams</h2>
              <ul className="space-y-2 text-sm text-app-muted">
                {['Token-driven UI', 'Wireframe-to-spec pipeline', 'RTL-ready layouts'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-app-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )
    case 'Art_AppPreview_Frame':
      return (
        <Section>
          <Card className="overflow-hidden max-w-4xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-app-border bg-app-elevated/80">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <span className="text-[11px] text-app-muted flex-1 text-center">app.yourproduct.com</span>
            </div>
            <div className="p-4">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="data">Analytics</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="mt-4 h-48 rounded-app-sm overflow-hidden border border-app-border">
                <IllusDashboard brand="var(--brand)" />
              </div>
            </div>
          </Card>
        </Section>
      )
    default:
      return null
  }
}

function IllusProductPlaceholder() {
  return (
    <div className="h-full w-full bg-app-elevated flex items-center justify-center text-app-muted text-xs">
      Product media
    </div>
  )
}
