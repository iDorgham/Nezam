'use client'

import type { ReactNode } from 'react'
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
import { cn } from '@/lib/utils'
import { WireframePreviewFrame } from '@/lib/wireframe/wireframe-preview-primitives'

export const ART_SHADCN_BLOCK_PREVIEW_TYPES = [
  'Art_Hero_Cinematic',
  'Art_Hero_Bento',
  'Art_Hero_StatsFloat',
  'Art_BentoGrid_4',
  'Art_BentoGrid_6',
  'Art_Feature_Zigzag',
  'Art_Feature_IconMatrix',
  'Art_Pricing_Spotlight',
  'Art_Testimonial_Spotlight',
  'Art_Testimonial_Masonry',
  'Art_Logos_Marquee',
  'Art_Stats_BigNumber',
  'Art_Team_Portraits',
  'Art_CaseStudy_Row',
  'Art_Gallery_Masonry',
  'Art_Media_SplitCinematic',
  'Art_Comparison_Matrix',
  'Art_CTA_Band',
  'Art_Newsletter_Card',
  'Art_FAQ_Split',
  'Art_Blog_Featured',
  'Art_Integrations_Wall',
  'Art_Process_Timeline',
  'Art_Product_Highlight',
  'Art_AppPreview_Frame',
] as const

export type ArtShadcnBlockPreviewType = (typeof ART_SHADCN_BLOCK_PREVIEW_TYPES)[number]

const ART_PREVIEW_SET = new Set<string>(ART_SHADCN_BLOCK_PREVIEW_TYPES)

export function hasArtShadcnBlockPreview(blockType: string): boolean {
  return ART_PREVIEW_SET.has(blockType)
}

type PreviewOpts = { compact?: boolean }

function iconSize(compact?: boolean) {
  return compact ? 'h-3 w-3' : 'h-4 w-4'
}

function PreviewArtHeroCinematic({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'min-h-[72px]' : 'min-h-[100px]'}>
      <div className={cn('grid gap-2', compact ? 'p-2 md:grid-cols-2' : 'p-3 md:grid-cols-2')}>
        <div className="space-y-1.5">
          <Badge variant="muted" className="text-[8px]">New release</Badge>
          <Skeleton className={cn(compact ? 'h-3 w-3/4' : 'h-4 w-4/5')} />
          <Skeleton className="h-2 w-full" />
          <div className="flex gap-1 pt-1">
            <Button size="xs" variant="primary" type="button" tabIndex={-1} className="pointer-events-none">
              Start
            </Button>
            <Button size="xs" variant="outline" type="button" tabIndex={-1} className="pointer-events-none">
              Demo
            </Button>
          </div>
        </div>
        <Skeleton className={cn('rounded-app-sm', compact ? 'h-14' : 'h-20')} />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtHeroBento({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('space-y-2', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn(compact ? 'h-3 w-2/3 mx-auto' : 'h-4 w-1/2 mx-auto')} />
        <div className="grid grid-cols-4 grid-rows-2 gap-1">
          <Card className={cn('col-span-2 row-span-2', compact ? 'p-1' : 'p-2')}>
            <Sparkles className={cn(iconSize(compact), 'text-app-accent mb-1')} />
            <Skeleton className="h-2 w-3/4" />
          </Card>
          {[1, 2, 3].map((i) => (
            <Card key={i} className={compact ? 'p-1' : 'p-1.5'}>
              <Skeleton className="h-2 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtHeroStatsFloat({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('text-center space-y-2', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn('mx-auto', compact ? 'h-3 w-2/3' : 'h-4 w-1/2')} />
        <Skeleton className="h-2 w-4/5 mx-auto" />
        <div className="flex justify-center gap-1 flex-wrap">
          {['98%', '2.4k', '4.9'].map((v) => (
            <Badge key={v} variant="muted" className="text-[8px] font-mono border border-app-border">
              {v}
            </Badge>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtBentoGrid4({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-2 gap-1', compact ? 'p-2' : 'p-3')}>
        {[LayoutGrid, Zap, Layers, Star].map((Icon, i) => (
          <Card key={i} className={cn(compact ? 'p-1.5' : 'p-2', i === 0 && 'col-span-1 row-span-1')}>
            <Icon className={cn(iconSize(compact), 'text-app-accent mb-1')} />
            <Skeleton className="h-2 w-2/3" />
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtBentoGrid6({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className={compact ? 'p-1' : 'p-1.5'}>
            <Skeleton className={cn('mb-1', compact ? 'h-6' : 'h-8')} />
            <Skeleton className="h-1.5 w-full" />
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtFeatureZigzag({ compact }: PreviewOpts) {
  const rows = compact ? 2 : 3
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={cn('flex items-center gap-2', i % 2 === 1 && 'flex-row-reverse')}>
            <div className="h-6 w-6 rounded-app-sm bg-app-accent/15 flex items-center justify-center shrink-0">
              <Zap className="h-3 w-3 text-app-accent" />
            </div>
            <div className="flex-1 space-y-0.5">
              <Skeleton className="h-2 w-2/3" />
              <Skeleton className="h-1.5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtFeatureIconMatrix({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className={compact ? 'p-1' : 'p-1.5'}>
            <BarChart3 className={cn(iconSize(compact), 'text-app-accent mb-0.5')} />
            <Skeleton className="h-1.5 w-full" />
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtPricingSpotlight({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-3 gap-1 items-end', compact ? 'p-2' : 'p-3')}>
        {[0, 1, 2].map((i) => (
          <Card
            key={i}
            className={cn(
              compact ? 'p-1' : 'p-2',
              i === 1 && 'ring-1 ring-app-accent border-app-accent/50 scale-[1.02]',
            )}
          >
            {i === 1 ? <Badge className="text-[7px] mb-0.5">Popular</Badge> : null}
            <Skeleton className="h-3 w-1/2 mb-1" />
            <Skeleton className="h-2 w-2/3" />
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtTestimonialSpotlight({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <Card className={cn('border-0 shadow-none bg-transparent', compact ? 'p-2' : 'p-3')}>
        <Quote className={cn(iconSize(compact), 'text-app-accent mb-1')} />
        <Skeleton className={cn('mb-2', compact ? 'h-6' : 'h-8')} />
        <div className="flex items-center gap-1.5">
          <Avatar className={compact ? 'h-5 w-5' : 'h-6 w-6'}>
            <AvatarFallback className="text-[8px]">AK</AvatarFallback>
          </Avatar>
          <Skeleton className="h-2 w-16" />
        </div>
      </Card>
    </WireframePreviewFrame>
  )
}

function PreviewArtTestimonialMasonry({ compact }: PreviewOpts) {
  const heights = compact ? ['h-10', 'h-14', 'h-12'] : ['h-14', 'h-20', 'h-16']
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {heights.map((h, i) => (
          <Card key={i} className={cn('p-1.5', h)}>
            <Skeleton className="h-2 w-full mb-1" />
            <Skeleton className="h-1.5 w-2/3" />
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtLogosMarquee({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-14'}>
      <div className="px-2 py-2 overflow-hidden">
        <p className="text-[8px] text-app-subtle text-center mb-1">Trusted by teams</p>
        <div
          className={cn(
            'flex gap-2 justify-center',
            'motion-safe:animate-none',
            '[@media(prefers-reduced-motion:no-preference)]:flex',
          )}
        >
          {Array.from({ length: compact ? 4 : 6 }).map((_, i) => (
            <Skeleton key={i} className={cn('rounded-app-sm shrink-0', compact ? 'h-4 w-10' : 'h-5 w-12')} />
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtStatsBigNumber({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-4 gap-1 text-center', compact ? 'p-2' : 'p-3')}>
        {['12k', '98%', '4.9', '24/7'].map((n) => (
          <div key={n}>
            <div className={cn('font-bold text-app-accent', compact ? 'text-sm' : 'text-base')}>{n}</div>
            <Skeleton className="h-1.5 w-3/4 mx-auto mt-0.5" />
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtTeamPortraits({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
          <Card key={i} className={cn('text-center', compact ? 'p-1' : 'p-2')}>
            <Avatar className={cn('mx-auto mb-1', compact ? 'h-6 w-6' : 'h-8 w-8')}>
              <AvatarFallback className="text-[8px]">{String.fromCharCode(65 + i)}</AvatarFallback>
            </Avatar>
            <Badge variant="muted" className="text-[7px]">
              Role
            </Badge>
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtCaseStudyRow({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className={compact ? 'p-1.5' : 'p-2'}>
            <Badge variant="muted" className="text-[7px] mb-1">
              Case
            </Badge>
            <Skeleton className="h-2 w-full mb-1" />
            <Button size="xs" variant="ghost" type="button" tabIndex={-1} className="pointer-events-none h-5 px-1">
              Read <ArrowRight className="h-2 w-2" />
            </Button>
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtGalleryMasonry({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('columns-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {['h-8', 'h-12', 'h-10', 'h-14', 'h-9', 'h-11'].slice(0, compact ? 4 : 6).map((h, i) => (
          <Skeleton key={i} className={cn('w-full mb-1 rounded-app-sm', h)} />
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtMediaSplitCinematic({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid md:grid-cols-2 gap-2 items-center', compact ? 'p-2' : 'p-3')}>
        <div className="space-y-1">
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-2 w-full" />
          <Button size="xs" variant="primary" type="button" tabIndex={-1} className="pointer-events-none mt-1">
            Explore
          </Button>
        </div>
        <Skeleton className={cn('rounded-app-md w-full', compact ? 'h-16' : 'h-24')} />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtComparisonMatrix({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('overflow-x-auto', compact ? 'p-2' : 'p-3')}>
        <div className="grid grid-cols-4 gap-px text-[8px]">
          <div />
          {['Basic', 'Pro', 'Ent'].map((h) => (
            <div key={h} className="text-center font-medium text-app-muted p-1">
              {h}
            </div>
          ))}
          {['API', 'SSO', 'SLA'].map((row) => [
            <div key={`${row}-label`} className="text-app-muted p-1">
              {row}
            </div>,
            ...[0, 1, 2].map((c) => (
              <div key={`${row}-${c}`} className="flex justify-center p-1">
                <Check className="h-2.5 w-2.5 text-app-accent" />
              </div>
            )),
          ])}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtCtaBand({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className="bg-app-elevated/60">
      <div className={cn('flex items-center justify-between gap-2', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn(compact ? 'h-3 w-1/2' : 'h-4 w-2/5')} />
        <Button size="xs" variant="primary" type="button" tabIndex={-1} className="pointer-events-none shrink-0">
          Get started
        </Button>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtNewsletterCard({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <Card className={cn('mx-auto max-w-[90%]', compact ? 'p-2' : 'p-3')}>
        <CardHeader className="p-0 pb-2">
          <Skeleton className="h-3 w-3/4 mx-auto" />
        </CardHeader>
        <CardContent className="p-0 flex gap-1">
          <Input className="h-6 text-[9px] flex-1 pointer-events-none" placeholder="you@company.com" readOnly />
          <Button size="xs" variant="primary" type="button" tabIndex={-1} className="pointer-events-none">
            Join
          </Button>
        </CardContent>
      </Card>
    </WireframePreviewFrame>
  )
}

function PreviewArtFaqSplit({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid md:grid-cols-2 gap-2', compact ? 'p-2' : 'p-3')}>
        <div className="space-y-1">
          {Array.from({ length: compact ? 2 : 4 }).map((_, i) => (
            <Card key={i} className="p-1.5">
              <Skeleton className="h-2 w-4/5" />
            </Card>
          ))}
        </div>
        <Skeleton className={cn('rounded-app-sm', compact ? 'h-16' : 'h-24')} />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtBlogFeatured({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid md:grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        <Card className="md:col-span-2 p-2">
          <Badge className="text-[7px] mb-1">Featured</Badge>
          <Skeleton className="h-3 w-4/5 mb-1" />
          <Skeleton className="h-2 w-full" />
        </Card>
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <Card key={i} className="p-1.5">
              <Skeleton className="h-2 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtIntegrationsWall({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid grid-cols-4 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: compact ? 4 : 8 }).map((_, i) => (
          <Card key={i} className={cn('relative', compact ? 'p-1.5' : 'p-2')}>
            <Skeleton className={cn('mx-auto rounded-app-sm', compact ? 'h-4 w-8' : 'h-5 w-10')} />
            {i % 3 === 0 ? (
              <Badge className="absolute -top-1 -end-1 text-[6px] px-0.5">Live</Badge>
            ) : null}
          </Card>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtProcessTimeline({ compact }: PreviewOpts) {
  const steps = compact ? 3 : 4
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('space-y-1 ps-2 border-s-2 border-app-border', compact ? 'p-2 ms-1' : 'p-3 ms-2')}>
        {Array.from({ length: steps }).map((_, i) => (
          <div key={i} className="flex gap-1.5 items-start">
            <div className="h-4 w-4 rounded-full bg-app-accent/20 flex items-center justify-center shrink-0 -ms-[calc(0.5rem+5px)]">
              <span className="text-[7px] font-bold">{i + 1}</span>
            </div>
            <div className="flex-1 pb-1">
              <Skeleton className="h-2 w-2/3 mb-0.5" />
              <Skeleton className="h-1.5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtProductHighlight({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <div className={cn('grid md:grid-cols-2 gap-2', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn('rounded-app-md', compact ? 'h-16' : 'h-24')} />
        <div className="space-y-1">
          <Skeleton className="h-3 w-3/4" />
          {['Spec A', 'Spec B', 'Spec C'].map((s) => (
            <div key={s} className="flex items-center gap-1 text-[8px] text-app-muted">
              <Check className="h-2.5 w-2.5 text-app-accent" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewArtAppPreviewFrame({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact}>
      <Card className={cn('overflow-hidden', compact ? 'm-2' : 'm-3')}>
        <div className="flex items-center gap-1 px-2 py-1 border-b border-app-border bg-app-elevated/80">
          <div className="flex gap-0.5">
            {['bg-red-400/60', 'bg-amber-400/60', 'bg-emerald-400/60'].map((c) => (
              <div key={c} className={cn('h-1.5 w-1.5 rounded-full', c)} />
            ))}
          </div>
          <Skeleton className="h-2 flex-1 max-w-[40%] mx-auto" />
        </div>
        <div className={cn('p-2', compact ? 'space-y-1' : 'space-y-2')}>
          <Tabs defaultValue="a" className="pointer-events-none">
            <TabsList className="h-6">
              <TabsTrigger value="a" className="text-[8px] px-2">
                Overview
              </TabsTrigger>
              <TabsTrigger value="b" className="text-[8px] px-2">
                Data
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className={compact ? 'h-6' : 'h-10'} />
            ))}
          </div>
        </div>
      </Card>
    </WireframePreviewFrame>
  )
}

const ART_RENDERERS: Record<ArtShadcnBlockPreviewType, (opts: PreviewOpts) => ReactNode> = {
  Art_Hero_Cinematic: PreviewArtHeroCinematic,
  Art_Hero_Bento: PreviewArtHeroBento,
  Art_Hero_StatsFloat: PreviewArtHeroStatsFloat,
  Art_BentoGrid_4: PreviewArtBentoGrid4,
  Art_BentoGrid_6: PreviewArtBentoGrid6,
  Art_Feature_Zigzag: PreviewArtFeatureZigzag,
  Art_Feature_IconMatrix: PreviewArtFeatureIconMatrix,
  Art_Pricing_Spotlight: PreviewArtPricingSpotlight,
  Art_Testimonial_Spotlight: PreviewArtTestimonialSpotlight,
  Art_Testimonial_Masonry: PreviewArtTestimonialMasonry,
  Art_Logos_Marquee: PreviewArtLogosMarquee,
  Art_Stats_BigNumber: PreviewArtStatsBigNumber,
  Art_Team_Portraits: PreviewArtTeamPortraits,
  Art_CaseStudy_Row: PreviewArtCaseStudyRow,
  Art_Gallery_Masonry: PreviewArtGalleryMasonry,
  Art_Media_SplitCinematic: PreviewArtMediaSplitCinematic,
  Art_Comparison_Matrix: PreviewArtComparisonMatrix,
  Art_CTA_Band: PreviewArtCtaBand,
  Art_Newsletter_Card: PreviewArtNewsletterCard,
  Art_FAQ_Split: PreviewArtFaqSplit,
  Art_Blog_Featured: PreviewArtBlogFeatured,
  Art_Integrations_Wall: PreviewArtIntegrationsWall,
  Art_Process_Timeline: PreviewArtProcessTimeline,
  Art_Product_Highlight: PreviewArtProductHighlight,
  Art_AppPreview_Frame: PreviewArtAppPreviewFrame,
}

export function renderArtShadcnBlockPreview(blockType: string, opts: PreviewOpts = {}): ReactNode | null {
  if (!hasArtShadcnBlockPreview(blockType)) return null
  const Renderer = ART_RENDERERS[blockType as ArtShadcnBlockPreviewType]
  return Renderer ? <Renderer compact={opts.compact} /> : null
}
