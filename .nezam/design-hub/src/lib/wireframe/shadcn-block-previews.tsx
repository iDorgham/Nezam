'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { ChromeButton, ChromeInput, ChromeTabPills } from '@/lib/wireframe/wireframe-preview-primitives'

export const SHADCN_BLOCK_PREVIEW_TYPES = [
  'Nav_TopBar',
  'Nav_Sidebar',
  'Nav_Mobile',
  'Nav_Footer',
  'Nav_Breadcrumb',
  'Nav_Subnav',
  'Hero_Simple',
  'Hero_Centered',
  'Hero_Split',
  'Hero_ImageCover',
  'Hero_GradientMesh',
  'Hero_Video',
  'Hero_Minimal',
  'Content_Text',
  'Content_Card',
  'Content_SplitMedia',
  'Content_ProfileBands',
  'Content_Features',
  'Content_Pricing',
  'Content_PricingToggle',
  'Content_FeatureBento',
  'Content_FAQ',
  'Content_CTA',
  'Content_Stats',
  'Content_Testimonials',
  'Content_Logos',
  'Content_BlogGrid',
  'Content_Timeline',
  'Content_Comparison',
  'Content_Gallery',
  'Content_Tabs',
  'Form_Login',
  'Form_Contact',
  'Form_Newsletter',
  'Form_WaitlistInline',
  'Form_Signup',
  'Form_SplitAuth',
  'Form_Search',
  'Data_KPI_Row',
  'Data_Table',
  'Data_Chart',
  'Data_Activity',
  'Data_FilterBar',
  'Layout_PageHeader',
  'Layout_TwoColumn',
  'Layout_AuthSplit',
  'Layout_EmptyState',
  'Layout_ThreeColumn',
  'Layout_StickyCTA',
  'Content_ContactChannels',
  'Content_ContactSplit',
  'Content_UserInvite',
  'Content_ProfileHeader',
  'Content_AboutHero',
  'Content_AboutValues',
  'Content_AboutTimeline',
  'Content_DangerZone',
  'Form_ProfileDetails',
  'Form_SettingsSections',
  'Data_UserTable',
  'Data_AnalyticsToolbar',
  'Data_AnalyticsOverview',
  'Data_AnalyticsChartGrid',
  'Layout_ProfileTabs',
  'Layout_SettingsShell',
] as const

export type ShadcnBlockPreviewType = (typeof SHADCN_BLOCK_PREVIEW_TYPES)[number]

const PREVIEW_SET = new Set<string>(SHADCN_BLOCK_PREVIEW_TYPES)

export function hasShadcnBlockPreview(blockType: string): boolean {
  return PREVIEW_SET.has(blockType)
}

type PreviewOpts = { compact?: boolean; /** Wireframes canvas left column: nav strip only, fills column height. */ sidebarColumn?: boolean }

function WireframePreviewFrame({
  compact,
  children,
  className,
}: {
  compact?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative z-0 rounded-app-md border border-app-border bg-app-surface shadow-sm overflow-hidden',
        compact ? 'min-h-[52px]' : 'min-h-[88px]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function MiniCard({
  compact,
  children,
  className,
  style,
}: {
  compact?: boolean
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cn(
        'rounded-app-sm border border-app-border bg-app-elevated/50',
        compact ? 'p-1.5' : 'p-2.5',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

function PreviewNavTopBar({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-[4.5rem]'}>
      <div className={cn('flex items-center justify-between', compact ? 'px-2 py-1.5' : 'px-3 py-2.5')}>
        <div className="flex items-center gap-2">
          <Avatar className={compact ? 'h-5 w-5' : 'h-6 w-6'}>
            <AvatarFallback className="text-[8px] bg-app-accent/20">N</AvatarFallback>
          </Avatar>
          <Skeleton className={cn(compact ? 'h-2 w-10' : 'h-2.5 w-14')} />
        </div>
        <div className="flex items-center gap-1">
          <ChromeButton compact={compact} variant="ghost" size="xs">
            Link
          </ChromeButton>
          <ChromeButton compact={compact} variant="outline" size="xs">
            Docs
          </ChromeButton>
          <ChromeButton compact={compact} variant="primary" size="xs">
            Start
          </ChromeButton>
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewNavSidebar({ compact, sidebarColumn }: PreviewOpts) {
  const itemCount = sidebarColumn ? 6 : 4

  const navItems = (
    <>
      <Skeleton className={cn('mb-1', compact ? 'h-2 w-3/4' : 'h-2.5 w-3/4')} />
      {Array.from({ length: itemCount }, (_, i) => i + 1).map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-app-sm px-1.5 py-0.5',
            i === 1 ? 'bg-app-accent/15' : 'bg-transparent',
          )}
        >
          <Skeleton className={cn(compact ? 'h-1.5' : 'h-2', i === 1 ? 'w-full' : 'w-4/5')} />
        </div>
      ))}
      {sidebarColumn ? (
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2 rounded-app-sm border border-app-border bg-app-surface/80 p-1.5">
            <Avatar className={compact ? 'h-5 w-5' : 'h-6 w-6'}>
              <AvatarFallback className="text-[8px] bg-app-accent/20">U</AvatarFallback>
            </Avatar>
            <Skeleton className={cn(compact ? 'h-1.5 w-10' : 'h-2 w-12')} />
          </div>
        </div>
      ) : null}
    </>
  )

  if (sidebarColumn) {
    return (
      <aside className="flex h-full min-h-0 w-full flex-col gap-1 bg-app-elevated p-2">
        {navItems}
      </aside>
    )
  }

  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className="flex h-full">
        <aside
          className={cn(
            'border-r border-app-border bg-app-elevated flex flex-col gap-1',
            compact ? 'w-[28%] p-1.5' : 'w-[30%] p-2',
          )}
        >
          {navItems}
        </aside>
        <div className="flex-1 p-2 space-y-1">
          <Skeleton className="h-2 w-1/3" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-1.5 w-5/6" />
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewNavMobile({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className="flex flex-col h-full">
        <div className={cn('flex-1', compact ? 'p-2' : 'p-3')}>
          <Skeleton className="h-2 w-1/2 mb-1" />
          <Skeleton className="h-1.5 w-3/4" />
        </div>
        <div className="flex border-t border-app-border">
          {['Home', 'Search', 'Add', 'Profile'].map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-0.5 py-1">
              <div
                className={cn(
                  'rounded-sm',
                  compact ? 'h-2 w-2' : 'h-2.5 w-2.5',
                  i === 0 ? 'bg-app-accent/60' : 'bg-app-border',
                )}
              />
              <span className="text-[7px] text-app-subtle">{label.slice(0, 1)}</span>
            </div>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewNavFooter({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('grid grid-cols-4 gap-2', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3, 4].map((col) => (
          <div key={col} className="space-y-1">
            <Skeleton className="h-1.5 w-2/3 bg-app-accent/25" />
            <Skeleton className="h-1 w-full" />
            <Skeleton className="h-1 w-4/5" />
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewNavBreadcrumb({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-12'}>
      <div className={cn('flex items-center gap-1', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
        {['Home', 'Products', 'Detail'].map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight className="h-2.5 w-2.5 text-app-subtle" aria-hidden /> : null}
            <Skeleton
              className={cn(
                'h-1.5',
                compact ? 'w-8' : 'w-10',
                i === 2 ? 'bg-app-accent/25 w-12' : '',
              )}
            />
          </span>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewNavSubnav({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-11' : 'h-14'}>
      <div className={cn('flex items-center gap-1 border-b border-app-border', compact ? 'px-2 py-1' : 'px-3 py-1.5')}>
        {['Overview', 'Reports', 'Settings'].map((tab, i) => (
          <span
            key={tab}
            className={cn(
              'rounded-app-sm px-2 py-0.5 text-[8px]',
              i === 0 ? 'bg-app-accent/15 text-app-text' : 'text-app-muted',
            )}
          >
            {compact ? tab.slice(0, 3) : tab}
          </span>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroSimple({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-28'}>
      <div
        className={cn(
          'flex flex-col items-center justify-center text-center',
          compact ? 'gap-1 p-2' : 'gap-2 p-4',
        )}
      >
        <Skeleton className={cn(compact ? 'h-2.5 w-2/3' : 'h-3.5 w-3/5')} />
        <Skeleton className={cn(compact ? 'h-2 w-1/2' : 'h-2.5 w-2/5')} />
        <ChromeButton compact={compact} variant="primary" size="xs" className="mt-0.5">
          Get started
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroCentered({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-28'}>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          compact ? 'gap-1 p-2' : 'gap-2 p-4',
        )}
      >
        <Badge variant="muted" className="text-[8px]">
          New
        </Badge>
        <Skeleton className={cn(compact ? 'h-2.5 w-3/4' : 'h-3.5 w-4/5')} />
        <Skeleton className={cn(compact ? 'h-2 w-1/2' : 'h-2 w-2/5')} />
        <div className="flex gap-1.5 mt-0.5">
          <ChromeButton compact={compact} variant="primary" size="xs">
            Primary
          </ChromeButton>
          <ChromeButton compact={compact} variant="outline" size="xs">
            Secondary
          </ChromeButton>
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroSplit({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-28'}>
      <div className={cn('flex gap-2', compact ? 'p-2' : 'p-3')}>
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          <Skeleton className={cn(compact ? 'h-2.5 w-full' : 'h-3 w-full')} />
          <Skeleton className={cn(compact ? 'h-2 w-4/5' : 'h-2 w-3/4')} />
          <ChromeButton compact={compact} variant="primary" size="xs" className="w-fit">
            Learn more
          </ChromeButton>
        </div>
        <MiniCard compact={compact} className={cn('bg-app-elevated', compact ? 'w-[38%]' : 'w-[40%]')}>
          <Skeleton className="h-full min-h-[40px] w-full rounded-app-sm" />
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroVideo({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-28'}>
      <div className={cn('flex flex-col items-center gap-1.5', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn(compact ? 'h-2 w-2/3' : 'h-3 w-1/2')} />
        <MiniCard compact={compact} className="relative w-full max-w-[85%]">
          <Skeleton className={cn('w-full rounded-app-sm', compact ? 'h-8' : 'h-12')} />
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'rounded-full border border-app-border bg-app-surface/90 flex items-center justify-center',
                compact ? 'h-4 w-4 text-[7px]' : 'h-6 w-6 text-[9px]',
              )}
            >
              ▶
            </span>
          </span>
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroMinimal({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-14'}>
      <div className={cn('flex flex-col justify-center', compact ? 'gap-0.5 px-3 py-2' : 'gap-1 px-4 py-3')}>
        <Skeleton className={cn(compact ? 'h-2.5 w-3/5' : 'h-3 w-2/5')} />
        <Skeleton className={cn(compact ? 'h-1.5 w-2/5' : 'h-2 w-1/3')} />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroImageCover({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'min-h-[72px]' : 'min-h-[112px]'}>
      <div
        className={cn('relative flex flex-col justify-end h-full', compact ? 'gap-1 p-2 min-h-[72px]' : 'gap-1.5 p-3 min-h-[112px]')}
        style={{
          backgroundImage:
            'linear-gradient(160deg, color-mix(in oklab, var(--brand) 42%, var(--app-elevated)), color-mix(in oklab, var(--accent) 26%, var(--app-surface)))',
        }}
      >
        <Skeleton className={cn(compact ? 'h-2.5 w-2/3' : 'h-3 w-3/5', 'bg-app-surface/70')} />
        <Skeleton className={cn(compact ? 'h-2 w-1/2' : 'h-2 w-2/5', 'bg-app-surface/60')} />
        <ChromeButton compact={compact} variant="primary" size="xs" className="w-fit mt-0.5">
          Explore
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentText({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        <Skeleton className="h-2 w-1/4" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-1.5 w-11/12" />
        <Skeleton className="h-1.5 w-4/5" />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentCard({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-24'}>
      <MiniCard compact={compact} className="m-2 h-[calc(100%-1rem)]">
        <Skeleton className={cn('w-full rounded-app-sm mb-2', compact ? 'h-6' : 'h-10')} />
        <Skeleton className="h-2 w-1/2 mb-1" />
        <Skeleton className="h-1.5 w-full" />
      </MiniCard>
    </WireframePreviewFrame>
  )
}

function PreviewContentSplitMedia({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'min-h-[72px]' : 'min-h-[96px]'}>
      <div className={cn('grid md:grid-cols-2 gap-2 items-center', compact ? 'p-2' : 'p-3')}>
        <div className="space-y-1.5">
          <Skeleton className={cn(compact ? 'h-2.5 w-full' : 'h-3 w-4/5')} />
          <Skeleton className={cn(compact ? 'h-2 w-full' : 'h-2 w-full')} />
          <Skeleton className={cn(compact ? 'h-2 w-3/4' : 'h-2 w-2/3')} />
        </div>
        <MiniCard
          compact={compact}
          className="overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(135deg, color-mix(in oklab, var(--accent) 32%, var(--app-elevated)), color-mix(in oklab, var(--brand) 18%, var(--app-surface)))',
          }}
        >
          <Skeleton className={cn('w-full rounded-app-sm', compact ? 'h-10' : 'h-14', 'opacity-40')} />
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentProfileBands({ compact }: PreviewOpts) {
  const tints = [
    'color-mix(in oklab, var(--brand) 16%, var(--app-surface))',
    'color-mix(in oklab, var(--accent) 14%, var(--app-surface))',
    'color-mix(in oklab, var(--app-success, var(--accent)) 12%, var(--app-surface))',
  ]
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'min-h-[80px]' : 'min-h-[108px]'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        {tints.map((bg, i) => (
          <div
            key={i}
            className={cn('rounded-app-sm border border-app-border/70 flex items-center gap-2', compact ? 'px-2 py-1.5' : 'px-3 py-2')}
            style={{ background: bg }}
          >
            <Skeleton className={cn('rounded-full shrink-0', compact ? 'h-5 w-5' : 'h-6 w-6')} />
            <div className="flex-1 space-y-1">
              <Skeleton className={cn(compact ? 'h-1.5 w-1/3' : 'h-2 w-2/5')} />
              <Skeleton className={cn(compact ? 'h-1 w-4/5' : 'h-1.5 w-3/4')} />
            </div>
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentFeatures({ compact }: PreviewOpts) {
  const cols = compact ? 3 : 3
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn(compact ? 'p-2' : 'p-3')}>
        <Skeleton className="h-2 w-1/3 mx-auto mb-2" />
        <div className={cn('grid gap-1.5', `grid-cols-${cols}`)} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {[1, 2, 3].map((i) => (
            <MiniCard key={i} compact={compact}>
              <Badge variant="default" className="text-[7px] mb-1">
                {i}
              </Badge>
              <Skeleton className="h-1.5 w-full mb-0.5" />
              <Skeleton className="h-1 w-4/5" />
            </MiniCard>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentPricing({ compact }: PreviewOpts) {
  const tints = [
    'color-mix(in oklab, var(--brand) 12%, var(--app-surface))',
    'color-mix(in oklab, var(--accent) 14%, var(--app-surface))',
    'color-mix(in oklab, var(--accent) 22%, var(--app-surface))',
  ]
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('grid grid-cols-3 gap-1.5', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3].map((i) => (
          <MiniCard
            key={i}
            compact={compact}
            className={cn(i === 2 && 'border-app-accent/40')}
            style={{ background: tints[i - 1] }}
          >
            <Skeleton className="h-1.5 w-2/3 mb-1" />
            <Skeleton className="h-2 w-1/2 mb-1 bg-app-accent/20" />
            <Skeleton className="h-1 w-full" />
            {i === 2 ? (
              <ChromeButton compact={compact} variant="primary" size="xs" className="w-full mt-1">
                Pro
              </ChromeButton>
            ) : null}
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentPricingToggle({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-[4.25rem]' : 'h-28'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        <ChromeTabPills compact={compact} />
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <MiniCard
              key={i}
              compact={compact}
              className={cn(i === 2 && 'border-app-accent/40')}
              style={{
                background:
                  i === 2
                    ? 'color-mix(in oklab, var(--accent) 18%, var(--app-surface))'
                    : 'color-mix(in oklab, var(--brand) 10%, var(--app-surface))',
              }}
            >
              <Skeleton className="h-1.5 w-2/3" />
              <Skeleton className="h-2 w-1/2 bg-app-accent/15" />
            </MiniCard>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentFeatureBento({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-20' : 'h-28'}>
      <div
        className={cn('grid gap-1.5', compact ? 'p-2 grid-cols-2' : 'p-3 grid-cols-4 grid-rows-2')}
        style={{ gridTemplateAreas: compact ? undefined : '"a a b" "a a c"' }}
      >
        <MiniCard
          compact={compact}
          className={compact ? 'col-span-2' : ''}
          style={{
            gridArea: compact ? undefined : 'a',
            background: 'color-mix(in oklab, var(--brand) 14%, var(--app-surface))',
          }}
        >
          <Skeleton className={cn(compact ? 'h-8' : 'h-12 w-full')} />
        </MiniCard>
        <MiniCard
          compact={compact}
          style={{ background: 'color-mix(in oklab, var(--accent) 12%, var(--app-surface))' }}
        >
          <Skeleton className="h-2 w-3/4 mb-1" />
          <Skeleton className="h-1.5 w-full" />
        </MiniCard>
        {!compact ? (
          <MiniCard style={{ background: 'color-mix(in oklab, var(--success) 10%, var(--app-surface))' }}>
            <Skeleton className="h-2 w-2/3 mb-1" />
            <Skeleton className="h-1.5 w-full" />
          </MiniCard>
        ) : null}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewHeroGradientMesh({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'min-h-[72px]' : 'min-h-[100px]'}>
      <div
        className={cn('relative flex flex-col justify-center h-full', compact ? 'gap-1 p-2' : 'gap-1.5 p-3')}
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 30%, color-mix(in oklab, var(--brand) 35%, transparent), transparent), radial-gradient(ellipse 70% 50% at 80% 70%, color-mix(in oklab, var(--accent) 28%, transparent), transparent), var(--app-surface)',
        }}
      >
        <Skeleton className={cn(compact ? 'h-2.5 w-3/4' : 'h-3 w-2/3')} />
        <Skeleton className={cn(compact ? 'h-2 w-1/2' : 'h-2 w-1/2')} />
        <ChromeButton compact={compact} variant="primary" size="xs" className="w-fit">
          Start
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormSplitAuth({ compact }: PreviewOpts) {
  return <PreviewLayoutAuthSplit compact={compact} />
}

function PreviewContentFaq({ compact }: PreviewOpts) {
  const count = compact ? 2 : 3
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-[5.5rem]'}>
      <div className={cn('space-y-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-app-sm border px-2 py-1"
            style={{
              borderColor: `color-mix(in oklab, var(--brand) ${12 + i * 4}%, var(--app-border))`,
              background: `color-mix(in oklab, var(--brand) ${6 + i * 3}%, var(--app-surface))`,
            }}
          >
            <Skeleton className="h-1.5 w-2/3" />
            <ChevronRight className="h-3 w-3 text-app-subtle shrink-0" />
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentCta({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-16'}>
      <div
        className={cn(
          'flex items-center justify-between gap-2 bg-app-accent-subtle/40',
          compact ? 'px-2 py-1.5' : 'px-3 py-2.5',
        )}
      >
        <div className="space-y-1 flex-1 min-w-0">
          <Skeleton className="h-2 w-2/3" />
          <Skeleton className="h-1.5 w-1/2" />
        </div>
        <ChromeButton compact={compact} variant="primary" size="xs" className="shrink-0">
          Action
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentStats({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-16'}>
      <div className={cn('grid grid-cols-4 gap-1.5', compact ? 'p-2' : 'p-3')}>
        {['12k', '98%', '4.2', '24h'].map((val) => (
          <MiniCard key={val} compact={compact} className="text-center py-1">
            <div className={cn('font-semibold text-app-text', compact ? 'text-[9px]' : 'text-[10px]')}>{val}</div>
            <Skeleton className="h-1 w-2/3 mx-auto mt-0.5" />
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentTestimonials({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('grid grid-cols-3 gap-1.5', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3].map((i) => (
          <MiniCard key={i} compact={compact}>
            <Skeleton className="h-1.5 w-full mb-1" />
            <Skeleton className="h-1 w-4/5 mb-1" />
            <div className="flex items-center gap-1">
              <Avatar className="h-3 w-3">
                <AvatarFallback className="text-[6px]">U</AvatarFallback>
              </Avatar>
              <Skeleton className="h-1 w-1/2" />
            </div>
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentLogos({ compact }: PreviewOpts) {
  const n = compact ? 4 : 5
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-14'}>
      <div className={cn('flex items-center justify-center gap-2 flex-wrap', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: n }).map((_, i) => (
          <Skeleton key={i} className={cn(compact ? 'h-4 w-8' : 'h-5 w-10', 'rounded-sm')} />
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentBlogGrid({ compact }: PreviewOpts) {
  const cols = compact ? 2 : 3
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn(compact ? 'p-2' : 'p-3')}>
        <Skeleton className="h-2 w-1/4 mb-2" />
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <MiniCard key={i} compact={compact}>
              <Skeleton className={cn('w-full mb-1 rounded-sm', compact ? 'h-5' : 'h-8')} />
              <Skeleton className="h-1.5 w-full" />
            </MiniCard>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentTimeline({ compact }: PreviewOpts) {
  const steps = compact ? 3 : 4
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: steps }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full border border-app-accent/50 bg-app-accent/20" />
              {i < steps - 1 ? <div className="w-px flex-1 min-h-[8px] bg-app-border" /> : null}
            </div>
            <div className="flex-1 space-y-0.5 pb-1">
              <Skeleton className="h-1.5 w-1/3" />
              <Skeleton className="h-1 w-full" />
            </div>
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentComparison({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-24'}>
      <div className={cn('grid grid-cols-2 gap-1.5', compact ? 'p-2' : 'p-3')}>
        {[1, 2].map((col) => (
          <MiniCard key={col} compact={compact}>
            <Skeleton className="h-1.5 w-2/3 mb-1" />
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-sm bg-app-accent/40" />
                <Skeleton className="h-1 flex-1" />
              </div>
            ))}
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentGallery({ compact }: PreviewOpts) {
  const cols = 3
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={cn('rounded-app-sm', compact ? 'h-6' : 'h-9')} />
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentTabs({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        <div className="flex gap-1 border-b border-app-border pb-1">
          {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, i) => (
            <span
              key={tab}
              className={cn(
                'text-[8px] px-1.5 py-0.5 rounded-t-app-sm',
                i === 0 ? 'bg-app-accent/15 text-app-text' : 'text-app-muted',
              )}
            >
              {compact ? `T${i + 1}` : tab}
            </span>
          ))}
        </div>
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-1.5 w-5/6" />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormLogin({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-20' : 'h-28'}>
      <div className={cn('flex justify-center', compact ? 'p-2' : 'p-3')}>
        <MiniCard compact={compact} className={cn('w-full max-w-[200px]', compact ? 'space-y-1' : 'space-y-2')}>
          <Skeleton className="h-2 w-1/2 mx-auto" />
          <div className="space-y-1">
            <Label className="text-[9px]">Email</Label>
            <ChromeInput compact={compact} placeholder="you@example.com" className="h-6 text-[10px]" />
          </div>
          <div className="space-y-1">
            <Label className="text-[9px]">Password</Label>
            <ChromeInput compact={compact} type="password" placeholder="••••••••" className="h-6 text-[10px]" />
          </div>
          <ChromeButton compact={compact} variant="primary" size="xs" className="w-full">
            Sign in
          </ChromeButton>
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormContact({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-[4.5rem]' : 'h-28'}>
      <MiniCard compact={compact} className={cn('m-2', compact ? 'space-y-1' : 'space-y-2')}>
        <div className="grid grid-cols-2 gap-1.5">
          <ChromeInput compact={compact} placeholder="Name" className="h-6 text-[10px]" />
          <ChromeInput compact={compact} placeholder="Email" className="h-6 text-[10px]" />
        </div>
        <Skeleton className={cn('w-full rounded-app-sm border border-app-border', compact ? 'h-8' : 'h-12')} />
        <ChromeButton compact={compact} variant="primary" size="xs" className="w-fit">
          Send
        </ChromeButton>
      </MiniCard>
    </WireframePreviewFrame>
  )
}

function PreviewFormNewsletter({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-14'}>
      <div className={cn('flex items-center gap-2', compact ? 'p-2' : 'p-3')}>
        <ChromeInput compact={compact} placeholder="Email address" className="h-6 text-[10px] flex-1" />
        <ChromeButton compact={compact} variant="primary" size="xs" className="shrink-0">
          Subscribe
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormWaitlistInline({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'min-h-[64px]' : 'min-h-[88px]'}>
      <div className={cn('flex flex-col items-center text-center', compact ? 'gap-1.5 p-2' : 'gap-2 p-3')}>
        <Skeleton className={cn(compact ? 'h-2 w-1/3' : 'h-2.5 w-2/5')} />
        <Skeleton className={cn(compact ? 'h-1.5 w-2/3' : 'h-2 w-1/2')} />
        <div className={cn('flex items-center gap-1.5 w-full max-w-[220px]', compact ? 'mt-0.5' : 'mt-1')}>
          <ChromeInput compact={compact} placeholder="Email" className="h-6 text-[10px] flex-1" />
          <ChromeButton compact={compact} variant="primary" size="xs" className="shrink-0">
            Join
          </ChromeButton>
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormSignup({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-[5.5rem]' : 'h-32'}>
      <div className={cn('flex justify-center', compact ? 'p-2' : 'p-3')}>
        <MiniCard compact={compact} className={cn('w-full max-w-[220px]', compact ? 'space-y-1' : 'space-y-1.5')}>
          <Skeleton className="h-2.5 w-2/3 mx-auto" />
          <ChromeInput compact={compact} placeholder="Name" className="h-6 text-[10px]" />
          <ChromeInput compact={compact} placeholder="Email" className="h-6 text-[10px]" />
          <ChromeInput compact={compact} placeholder="Password" className="h-6 text-[10px]" />
          <ChromeButton compact={compact} variant="primary" size="xs" className="w-full">
            Create account
          </ChromeButton>
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormSearch({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-11' : 'h-14'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        <ChromeInput compact={compact} placeholder="Search…" className="h-6 text-[10px]" />
        <div className="flex flex-wrap gap-1">
          {['All', 'Active', 'Draft'].map((chip, i) => (
            <Badge key={chip} variant={i === 0 ? 'default' : 'muted'} className="text-[8px] px-1.5 py-0">
              {chip}
            </Badge>
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewDataKpiRow({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-16'}>
      <div className={cn('grid grid-cols-4 gap-1.5', compact ? 'p-2' : 'p-3')}>
        {['Revenue', 'Users', 'Churn', 'NPS'].map((label) => (
          <MiniCard key={label} compact={compact}>
            <Skeleton className="h-1 w-2/3 mb-1" />
            <div className={cn('font-semibold text-app-text', compact ? 'text-[9px]' : 'text-[11px]')}>—</div>
            <Skeleton className="h-1 w-1/2 mt-0.5" />
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

const DATA_TABLE_ROWS = [
  { customer: 'Acme Corp', status: 'Active' as const, plan: 'Pro' },
  { customer: 'Globex', status: 'Pending' as const, plan: 'Team' },
  { customer: 'Initech', status: 'Active' as const, plan: 'Enterprise' },
  { customer: 'Umbrella', status: 'Paused' as const, plan: 'Starter' },
] as const

function PreviewDataTable({ compact }: PreviewOpts) {
  const rows = DATA_TABLE_ROWS.slice(0, compact ? 2 : 4)

  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <MiniCard compact={compact} className="m-2 overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-app-elevated/50 hover:bg-app-elevated/50">
              <TableHead className={compact ? 'text-[8px] h-6 px-1.5' : undefined}>Customer</TableHead>
              <TableHead className={compact ? 'text-[8px] h-6 px-1.5' : undefined}>Status</TableHead>
              <TableHead className={cn('text-right', compact ? 'text-[8px] h-6 px-1.5' : undefined)}>Plan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.customer}>
                <TableCell className={cn('font-medium', compact ? 'text-[8px] px-1.5 py-1' : undefined)}>
                  {row.customer}
                </TableCell>
                <TableCell className={compact ? 'px-1.5 py-1' : undefined}>
                  <Badge
                    variant={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'muted'}
                    className={compact ? 'text-[7px] px-1 py-0' : undefined}
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className={cn('text-right text-app-muted', compact ? 'text-[8px] px-1.5 py-1' : undefined)}>
                  {row.plan}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MiniCard>
    </WireframePreviewFrame>
  )
}

function PreviewDataChart({ compact }: PreviewOpts) {
  const bars = compact ? 4 : 6
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn(compact ? 'p-2' : 'p-3')}>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-2 w-1/4" />
          <ChromeTabPills compact={compact} />
        </div>
        <div className="flex items-end gap-0.5 h-10 border-b border-app-border pb-0.5">
          {[40, 65, 45, 80, 55, 70].slice(0, bars).map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-app-accent/45" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewDataActivity({ compact }: PreviewOpts) {
  const rows = compact ? 3 : 4
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('space-y-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Avatar className={compact ? 'h-4 w-4' : 'h-5 w-5'}>
              <AvatarFallback className="text-[7px]">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-0.5">
              <Skeleton className="h-1.5 w-2/3" />
              <Skeleton className="h-1 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewDataFilterBar({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-12'}>
      <div className={cn('flex items-center justify-between gap-2', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
        <ChromeTabPills compact={compact} />
        <div className="flex gap-1">
          <ChromeButton compact={compact} variant="outline" size="xs">
            Filter
          </ChromeButton>
          <ChromeButton compact={compact} variant="ghost" size="xs">
            ⋯
          </ChromeButton>
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutPageHeader({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-12'}>
      <div className={cn('flex items-center justify-between', compact ? 'px-2 py-1.5' : 'px-3 py-2')}>
        <div className="space-y-0.5">
          <Skeleton className="h-1 w-12" />
          <Skeleton className={cn(compact ? 'h-2 w-20' : 'h-2.5 w-28', 'bg-app-accent/20')} />
        </div>
        <div className="flex gap-1">
          <ChromeButton compact={compact} variant="outline" size="xs">
            Export
          </ChromeButton>
          <ChromeButton compact={compact} variant="primary" size="xs">
            New
          </ChromeButton>
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutTwoColumn({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('flex gap-2', compact ? 'p-2' : 'p-3')}>
        <MiniCard compact={compact} className="w-[32%] space-y-1">
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-1.5 w-4/5" />
        </MiniCard>
        <MiniCard compact={compact} className="flex-1 space-y-1">
          <Skeleton className="h-2 w-1/2" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-1.5 w-11/12" />
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutAuthSplit({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-[4.5rem]' : 'h-28'}>
      <div className="flex h-full overflow-hidden">
        <div
          className={cn(
            'w-1/2 border-r border-app-border bg-app-accent-subtle/25 space-y-1',
            compact ? 'p-2' : 'p-3',
          )}
        >
          <Skeleton className="h-2 w-2/3 bg-app-accent/25" />
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-1.5 w-4/5" />
        </div>
        <div className={cn('w-1/2 space-y-1', compact ? 'p-2' : 'p-3')}>
          <Skeleton className="h-1.5 w-1/2 mx-auto" />
          <ChromeInput compact={compact} className="h-6 text-[10px]" />
          <ChromeInput compact={compact} className="h-6 text-[10px]" />
          <ChromeButton compact={compact} variant="primary" size="xs" className="w-full">
            Continue
          </ChromeButton>
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutEmptyState({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div
        className={cn(
          'flex flex-col items-center justify-center text-center',
          compact ? 'gap-1 p-3' : 'gap-2 p-4',
        )}
      >
        <div
          className={cn(
            'rounded-full border border-dashed border-app-border bg-app-elevated flex items-center justify-center',
            compact ? 'h-6 w-6' : 'h-8 w-8',
          )}
        >
          <span className="text-[10px] text-app-subtle">∅</span>
        </div>
        <Skeleton className="h-2 w-24 bg-app-accent/20" />
        <Skeleton className="h-1.5 w-32" />
        <ChromeButton compact={compact} variant="primary" size="xs">
          Create
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutThreeColumn({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className="flex h-full">
        <aside className={cn('border-r border-app-border bg-app-elevated', compact ? 'w-[22%]' : 'w-1/5')}>
          <Skeleton className="h-full w-full min-h-[40px]" />
        </aside>
        <main className="flex-1 border-r border-app-border p-2 space-y-1">
          <Skeleton className="h-2 w-1/3" />
          <Skeleton className="h-1.5 w-full" />
        </main>
        <aside className={cn('bg-app-elevated/50', compact ? 'w-[22%]' : 'w-1/5')}>
          <Skeleton className="h-full w-full min-h-[40px]" />
        </aside>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutStickyCta({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-12'}>
      <div
        className={cn(
          'flex items-center justify-between gap-2 border-t border-app-border bg-app-elevated',
          compact ? 'px-2 py-1.5' : 'px-3 py-2',
        )}
      >
        <Skeleton className={cn(compact ? 'h-1.5 w-1/2' : 'h-2 w-2/5')} />
        <ChromeButton compact={compact} variant="primary" size="xs">
          Upgrade
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentContactChannels({ compact }: PreviewOpts) {
  const cols = compact ? 2 : 3
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('grid gap-1', compact ? 'p-2' : 'p-3')} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <MiniCard key={i} compact={compact}>
            <Skeleton className="h-1.5 w-2/3 mb-1" />
            <Skeleton className="h-1 w-full" />
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentContactSplit({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('grid grid-cols-2 gap-1.5', compact ? 'p-2' : 'p-3')}>
        <MiniCard compact={compact} className="space-y-1">
          <Skeleton className="h-1.5 w-1/2" />
          <ChromeInput compact={compact} className="h-5" />
          <ChromeInput compact={compact} className="h-5" />
        </MiniCard>
        <Skeleton className={cn('rounded-app-sm', compact ? 'h-full min-h-12' : 'min-h-16')} />
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentUserInvite({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-14'}>
      <div className={cn('flex gap-1.5 items-end', compact ? 'p-2' : 'p-3')}>
        <ChromeInput compact={compact} placeholder="email" className="flex-1 h-6" />
        <ChromeButton compact={compact} size="xs">
          Invite
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentProfileHeader({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-16'}>
      <div className={cn('flex items-center gap-2', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn('rounded-full shrink-0', compact ? 'h-6 w-6' : 'h-8 w-8')} />
        <div className="flex-1 space-y-0.5">
          <Skeleton className="h-1.5 w-1/3" />
          <Skeleton className="h-1 w-1/2" />
        </div>
        <ChromeButton compact={compact} size="xs" variant="outline">
          Edit
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentAboutHero({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('space-y-1.5 text-center', compact ? 'p-2' : 'p-3')}>
        <Skeleton className="h-2 w-2/3 mx-auto" />
        <Skeleton className="h-1.5 w-full" />
        <div className="flex justify-center gap-2 pt-1">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className={cn('rounded-app-sm', compact ? 'h-4 w-8' : 'h-5 w-10')} />
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentAboutValues({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('grid grid-cols-3 gap-1', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3].map((i) => (
          <MiniCard key={i} compact={compact}>
            <Skeleton className="h-1.5 w-2/3 mb-1" />
            <Skeleton className="h-1 w-full" />
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewContentAboutTimeline({ compact }: PreviewOpts) {
  return PreviewContentTimeline({ compact })
}

function PreviewContentDangerZone({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-16'}>
      <div className={cn('border border-destructive/30 rounded-app-sm', compact ? 'p-2' : 'p-3')}>
        <Skeleton className="h-1.5 w-1/3 mb-1" />
        <ChromeButton compact={compact} size="xs" variant="outline" className="text-destructive">
          Delete
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormProfileDetails({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-0.5">
            <Label className="text-[8px]">Field</Label>
            <ChromeInput compact={compact} className="h-5" />
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFormSettingsSections({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('space-y-1', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between gap-2 py-0.5 border-b border-app-border/50 last:border-0">
            <Skeleton className="h-1.5 w-1/3" />
            <Switch className="scale-75" disabled />
          </div>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewDataUserTable({ compact }: PreviewOpts) {
  return PreviewDataTable({ compact })
}

function PreviewDataAnalyticsToolbar({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-10' : 'h-12'}>
      <div className={cn('flex gap-1 items-center flex-wrap', compact ? 'p-2' : 'p-3')}>
        <Skeleton className={cn('rounded-app-sm', compact ? 'h-5 w-14' : 'h-6 w-16')} />
        <Skeleton className={cn('rounded-app-sm', compact ? 'h-5 w-10' : 'h-6 w-12')} />
        <ChromeButton compact={compact} size="xs" variant="outline">
          Export
        </ChromeButton>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewDataAnalyticsOverview({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('grid grid-cols-4 gap-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: 4 }).map((_, i) => (
          <MiniCard key={i} compact={compact}>
            <Skeleton className="h-1 w-2/3 mb-0.5" />
            <Skeleton className="h-2 w-1/2" />
          </MiniCard>
        ))}
        <Skeleton className={cn('col-span-3 rounded-app-sm', compact ? 'h-8' : 'h-12')} />
        <div className="space-y-0.5">
          {[1, 2].map((i) => (
            <Skeleton key={i} className={cn('rounded-app-sm w-full', compact ? 'h-3' : 'h-4')} />
          ))}
        </div>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewDataAnalyticsChartGrid({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-20'}>
      <div className={cn('grid grid-cols-2 gap-1', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3, 4].map((i) => (
          <MiniCard key={i} compact={compact}>
            <Skeleton className="h-1 w-1/2 mb-1" />
            <Skeleton className={cn('w-full rounded-app-sm', compact ? 'h-6' : 'h-8')} />
          </MiniCard>
        ))}
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewLayoutProfileTabs({ compact }: PreviewOpts) {
  return PreviewContentTabs({ compact })
}

function PreviewLayoutSettingsShell({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('grid grid-cols-[1fr_2fr] gap-1', compact ? 'p-2' : 'p-3')}>
        <div className="space-y-0.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className={cn('rounded-app-sm w-full', compact ? 'h-3' : 'h-4')} />
          ))}
        </div>
        <MiniCard compact={compact}>
          <Skeleton className="h-1.5 w-1/2 mb-1" />
          <Skeleton className="h-1 w-full" />
        </MiniCard>
      </div>
    </WireframePreviewFrame>
  )
}

function PreviewFallback({ blockType, compact }: { blockType: string; compact?: boolean }) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-12' : 'h-16'}>
      <div className={cn('space-y-1.5', compact ? 'p-2' : 'p-3')}>
        <Skeleton className="h-2 w-1/3" />
        <Skeleton className="h-1.5 w-full" />
        <span className="text-[8px] text-app-subtle font-mono truncate block">{blockType}</span>
      </div>
    </WireframePreviewFrame>
  )
}

const RENDERERS: Record<ShadcnBlockPreviewType, (opts: PreviewOpts) => ReactNode> = {
  Nav_TopBar: PreviewNavTopBar,
  Nav_Sidebar: PreviewNavSidebar,
  Nav_Mobile: PreviewNavMobile,
  Nav_Footer: PreviewNavFooter,
  Nav_Breadcrumb: PreviewNavBreadcrumb,
  Nav_Subnav: PreviewNavSubnav,
  Hero_Simple: PreviewHeroSimple,
  Hero_Centered: PreviewHeroCentered,
  Hero_Split: PreviewHeroSplit,
  Hero_ImageCover: PreviewHeroImageCover,
  Hero_GradientMesh: PreviewHeroGradientMesh,
  Hero_Video: PreviewHeroVideo,
  Hero_Minimal: PreviewHeroMinimal,
  Content_Text: PreviewContentText,
  Content_Card: PreviewContentCard,
  Content_SplitMedia: PreviewContentSplitMedia,
  Content_ProfileBands: PreviewContentProfileBands,
  Content_Features: PreviewContentFeatures,
  Content_Pricing: PreviewContentPricing,
  Content_PricingToggle: PreviewContentPricingToggle,
  Content_FeatureBento: PreviewContentFeatureBento,
  Content_FAQ: PreviewContentFaq,
  Content_CTA: PreviewContentCta,
  Content_Stats: PreviewContentStats,
  Content_Testimonials: PreviewContentTestimonials,
  Content_Logos: PreviewContentLogos,
  Content_BlogGrid: PreviewContentBlogGrid,
  Content_Timeline: PreviewContentTimeline,
  Content_Comparison: PreviewContentComparison,
  Content_Gallery: PreviewContentGallery,
  Content_Tabs: PreviewContentTabs,
  Form_Login: PreviewFormLogin,
  Form_Contact: PreviewFormContact,
  Form_Newsletter: PreviewFormNewsletter,
  Form_WaitlistInline: PreviewFormWaitlistInline,
  Form_Signup: PreviewFormSignup,
  Form_SplitAuth: PreviewFormSplitAuth,
  Form_Search: PreviewFormSearch,
  Data_KPI_Row: PreviewDataKpiRow,
  Data_Table: PreviewDataTable,
  Data_Chart: PreviewDataChart,
  Data_Activity: PreviewDataActivity,
  Data_FilterBar: PreviewDataFilterBar,
  Layout_PageHeader: PreviewLayoutPageHeader,
  Layout_TwoColumn: PreviewLayoutTwoColumn,
  Layout_AuthSplit: PreviewLayoutAuthSplit,
  Layout_EmptyState: PreviewLayoutEmptyState,
  Layout_ThreeColumn: PreviewLayoutThreeColumn,
  Layout_StickyCTA: PreviewLayoutStickyCta,
  Content_ContactChannels: PreviewContentContactChannels,
  Content_ContactSplit: PreviewContentContactSplit,
  Content_UserInvite: PreviewContentUserInvite,
  Content_ProfileHeader: PreviewContentProfileHeader,
  Content_AboutHero: PreviewContentAboutHero,
  Content_AboutValues: PreviewContentAboutValues,
  Content_AboutTimeline: PreviewContentAboutTimeline,
  Content_DangerZone: PreviewContentDangerZone,
  Form_ProfileDetails: PreviewFormProfileDetails,
  Form_SettingsSections: PreviewFormSettingsSections,
  Data_UserTable: PreviewDataUserTable,
  Data_AnalyticsToolbar: PreviewDataAnalyticsToolbar,
  Data_AnalyticsOverview: PreviewDataAnalyticsOverview,
  Data_AnalyticsChartGrid: PreviewDataAnalyticsChartGrid,
  Layout_ProfileTabs: PreviewLayoutProfileTabs,
  Layout_SettingsShell: PreviewLayoutSettingsShell,
}

export function ShadcnBlockPreview({
  blockType,
  compact = false,
  sidebarColumn = false,
  className,
}: {
  blockType: string
  compact?: boolean
  sidebarColumn?: boolean
  className?: string
}) {
  const Renderer = hasShadcnBlockPreview(blockType)
    ? RENDERERS[blockType as ShadcnBlockPreviewType]
    : null
  const opts: PreviewOpts = { compact, sidebarColumn }

  return (
    <div className={cn('w-full', sidebarColumn && 'flex min-h-0 flex-1 flex-col', className)}>
      {Renderer ? <Renderer {...opts} /> : <PreviewFallback blockType={blockType} compact={compact} />}
    </div>
  )
}
