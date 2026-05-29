'use client'

import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export const SHADCN_BLOCK_PREVIEW_TYPES = [
  'Nav_TopBar',
  'Nav_Sidebar',
  'Nav_Mobile',
  'Nav_Footer',
  'Hero_Simple',
  'Hero_Centered',
  'Hero_Split',
  'Content_Text',
  'Content_Card',
  'Content_Features',
  'Content_Pricing',
  'Content_FAQ',
  'Content_CTA',
  'Content_Stats',
  'Content_Testimonials',
  'Content_Logos',
  'Content_BlogGrid',
  'Form_Login',
  'Form_Contact',
  'Form_Newsletter',
  'Form_Signup',
  'Data_KPI_Row',
  'Data_Table',
  'Data_Chart',
  'Layout_PageHeader',
  'Layout_TwoColumn',
  'Layout_AuthSplit',
  'Layout_EmptyState',
] as const

export type ShadcnBlockPreviewType = (typeof SHADCN_BLOCK_PREVIEW_TYPES)[number]

const PREVIEW_SET = new Set<string>(SHADCN_BLOCK_PREVIEW_TYPES)

export function hasShadcnBlockPreview(blockType: string): boolean {
  return PREVIEW_SET.has(blockType)
}

type PreviewOpts = { compact?: boolean }

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
}: {
  compact?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-app-sm border border-app-border bg-app-elevated/50',
        compact ? 'p-1.5' : 'p-2.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

type ChromeButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ChromeButtonSize = 'xs' | 'sm' | 'md' | 'lg'

const chromeButtonBase =
  'inline-flex items-center justify-center gap-1.5 font-medium rounded-app-sm select-none'

const chromeButtonVariants: Record<ChromeButtonVariant, string> = {
  primary: 'bg-app-accent text-app-on-accent',
  secondary: 'bg-app-elevated text-app-text',
  ghost: 'bg-transparent text-app-muted',
  danger: 'bg-transparent text-red-400',
  outline: 'border border-app-border text-app-muted',
}

const chromeButtonSizes: Record<ChromeButtonSize, string> = {
  xs: 'h-6 px-2 text-[11px]',
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3 text-xs',
  lg: 'h-9 px-4 text-sm',
}

/** Palette thumbnails sit inside `<button>` — use non-interactive chrome when compact. */
function ChromeButton({
  compact,
  variant = 'secondary',
  size = 'md',
  className,
  children,
}: {
  compact?: boolean
  variant?: ChromeButtonVariant
  size?: ChromeButtonSize
  className?: string
  children: ReactNode
}) {
  const style = cn(chromeButtonBase, chromeButtonVariants[variant], chromeButtonSizes[size], className)

  if (compact) {
    return <span className={style}>{children}</span>
  }

  return (
    <Button variant={variant} size={size} type="button" tabIndex={-1} className={cn('pointer-events-none', className)}>
      {children}
    </Button>
  )
}

function ChromeInput({
  compact,
  placeholder,
  className,
  type,
}: {
  compact?: boolean
  placeholder?: string
  className?: string
  type?: string
}) {
  if (compact) {
    return (
      <span
        className={cn(
          'block w-full rounded-app-sm border border-app-border bg-app-inset px-2.5 text-[10px] text-app-subtle truncate',
          className,
        )}
      >
        {type === 'password' ? placeholder ?? '••••••••' : placeholder}
      </span>
    )
  }

  return <Input placeholder={placeholder} type={type} className={className} readOnly tabIndex={-1} />
}

function ChromeTabPills({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="inline-flex h-5 items-center gap-0.5 rounded-app-sm border border-app-border bg-app-elevated p-0.5">
        <span className="inline-flex h-4 items-center rounded-app-sm bg-app-surface px-1.5 text-[8px] text-app-text">
          Week
        </span>
        <span className="inline-flex h-4 items-center px-1.5 text-[8px] text-app-muted">Month</span>
      </div>
    )
  }

  return (
    <Tabs defaultValue="w" className="pointer-events-none">
      <TabsList className="h-5">
        <TabsTrigger value="w" className="text-[8px] px-1.5 h-4">
          Week
        </TabsTrigger>
        <TabsTrigger value="m" className="text-[8px] px-1.5 h-4">
          Month
        </TabsTrigger>
      </TabsList>
    </Tabs>
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

function PreviewNavSidebar({ compact }: PreviewOpts) {
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className="flex h-full">
        <aside
          className={cn(
            'border-r border-app-border bg-app-elevated flex flex-col gap-1',
            compact ? 'w-[28%] p-1.5' : 'w-[30%] p-2',
          )}
        >
          <Skeleton className="h-2 w-3/4 mb-1" />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'rounded-app-sm px-1.5 py-0.5',
                i === 1 ? 'bg-app-accent/15' : 'bg-transparent',
              )}
            >
              <Skeleton className={cn('h-1.5', i === 1 ? 'w-full' : 'w-4/5')} />
            </div>
          ))}
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
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-16' : 'h-24'}>
      <div className={cn('grid grid-cols-3 gap-1.5', compact ? 'p-2' : 'p-3')}>
        {[1, 2, 3].map((i) => (
          <MiniCard
            key={i}
            compact={compact}
            className={cn(i === 2 && 'border-app-accent/40 bg-app-accent-subtle/30')}
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

function PreviewContentFaq({ compact }: PreviewOpts) {
  const count = compact ? 2 : 3
  return (
    <WireframePreviewFrame compact={compact} className={compact ? 'h-14' : 'h-[5.5rem]'}>
      <div className={cn('space-y-1', compact ? 'p-2' : 'p-3')}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-app-sm border border-app-border px-2 py-1 bg-app-bg/50"
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
  Hero_Simple: PreviewHeroSimple,
  Hero_Centered: PreviewHeroCentered,
  Hero_Split: PreviewHeroSplit,
  Content_Text: PreviewContentText,
  Content_Card: PreviewContentCard,
  Content_Features: PreviewContentFeatures,
  Content_Pricing: PreviewContentPricing,
  Content_FAQ: PreviewContentFaq,
  Content_CTA: PreviewContentCta,
  Content_Stats: PreviewContentStats,
  Content_Testimonials: PreviewContentTestimonials,
  Content_Logos: PreviewContentLogos,
  Content_BlogGrid: PreviewContentBlogGrid,
  Form_Login: PreviewFormLogin,
  Form_Contact: PreviewFormContact,
  Form_Newsletter: PreviewFormNewsletter,
  Form_Signup: PreviewFormSignup,
  Data_KPI_Row: PreviewDataKpiRow,
  Data_Table: PreviewDataTable,
  Data_Chart: PreviewDataChart,
  Layout_PageHeader: PreviewLayoutPageHeader,
  Layout_TwoColumn: PreviewLayoutTwoColumn,
  Layout_AuthSplit: PreviewLayoutAuthSplit,
  Layout_EmptyState: PreviewLayoutEmptyState,
}

export function ShadcnBlockPreview({
  blockType,
  compact = false,
  className,
}: {
  blockType: string
  compact?: boolean
  className?: string
}) {
  const Renderer = hasShadcnBlockPreview(blockType)
    ? RENDERERS[blockType as ShadcnBlockPreviewType]
    : null

  return (
    <div className={cn('w-full', className)}>
      {Renderer ? <Renderer compact={compact} /> : <PreviewFallback blockType={blockType} compact={compact} />}
    </div>
  )
}
