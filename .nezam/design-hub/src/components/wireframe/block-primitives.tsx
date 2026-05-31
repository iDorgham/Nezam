'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  type BlockDensity,
  type BlockMotion,
  type BlockTint,
  BLOCK_SECTION_DENSITY,
  blockHeroCoverStyle,
  blockImageStyle,
  blockMotionClass,
  blockTintAt,
  blockTintBg,
  blockTintFg,
  blockTintStyles,
} from '@/lib/wireframe/block-visual-system'

export function BlockSection({
  children,
  className,
  density = 'default',
  bleed = false,
  motion = 'none',
  style,
}: {
  children: ReactNode
  className?: string
  density?: BlockDensity
  bleed?: boolean
  motion?: BlockMotion
  style?: CSSProperties
}) {
  return (
    <section
      className={cn(
        BLOCK_SECTION_DENSITY[density],
        bleed ? 'max-w-none w-full' : 'max-w-6xl mx-auto',
        blockMotionClass(motion),
        className,
      )}
      style={style}
    >
      {children}
    </section>
  )
}

export function BlockSurface({
  children,
  className,
  tint = 'surface',
  motion = 'lift',
  padding = 'p-4',
}: {
  children: ReactNode
  className?: string
  tint?: BlockTint
  motion?: BlockMotion
  padding?: string
}) {
  const t = blockTintStyles(tint)
  return (
    <div
      className={cn(
        'rounded-app-md border shadow-sm',
        padding,
        blockMotionClass(motion),
        className,
      )}
      style={{
        background: tint === 'surface' ? 'var(--app-surface)' : t.bg,
        borderColor: t.border,
      }}
    >
      {children}
    </div>
  )
}

export function BlockHoverCard({
  children,
  className,
  tint,
  index = 0,
}: {
  children: ReactNode
  className?: string
  tint?: BlockTint
  index?: number
}) {
  const resolved = tint ?? (['brand', 'accent', 'secondary'] as BlockTint[])[index % 3]
  const t = blockTintStyles(resolved)
  return (
    <div
      className={cn(
        'rounded-app-md border p-4 md:p-5 block-hover-lift block-hover-border-accent',
        className,
      )}
      style={{ background: t.bg, borderColor: t.border }}
    >
      {children}
    </div>
  )
}

export function BlockMediaBackground({
  children,
  className,
  seed = 0,
  minHeight = 'min-h-[220px]',
  overlay = 0.45,
}: {
  children?: ReactNode
  className?: string
  seed?: number
  minHeight?: string
  overlay?: number
}) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-app-md block-hover-scale-media', minHeight, className)}
      style={blockImageStyle(seed, overlay)}
    >
      {children ? <div className="relative z-[1] h-full">{children}</div> : null}
    </div>
  )
}

export function BlockHeroBackdrop({
  children,
  className,
  seed = 0,
  fullBleed = true,
}: {
  children: ReactNode
  className?: string
  seed?: number
  fullBleed?: boolean
}) {
  return (
    <div
      className={cn('relative overflow-hidden', fullBleed && 'w-full', className)}
      style={blockHeroCoverStyle(seed)}
    >
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

export function BlockTintBand({
  children,
  className,
  tint = 'accent',
}: {
  children: ReactNode
  className?: string
  tint?: BlockTint
}) {
  return (
    <div
      className={cn(
        'rounded-app-md p-6 md:p-8 block-hover-glow',
        className,
      )}
      style={{
        background: `linear-gradient(128deg, ${blockTintBg(tint, 72, 'var(--accent)')} 0%, color-mix(in oklab, var(--brand) 48%, var(--accent)) 100%)`,
        color: blockTintFg(tint),
      }}
    >
      {children}
    </div>
  )
}

export function BlockHeading({
  children,
  className,
  as: Tag = 'h2',
  size = 'lg',
}: {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  size?: 'xl' | 'lg' | 'md'
}) {
  const sizes = {
    xl: 'text-3xl md:text-4xl font-bold tracking-tight',
    lg: 'text-2xl md:text-3xl font-bold tracking-tight',
    md: 'text-xl font-semibold',
  }
  return <Tag className={cn(sizes[size], 'text-app-text mb-2', className)}>{children}</Tag>
}

export function BlockLead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm md:text-base text-app-muted leading-relaxed max-w-[68ch]', className)}>
      {children}
    </p>
  )
}

export function BlockFormStack({
  children,
  className,
  variant = 'default',
}: {
  children: ReactNode
  className?: string
  variant?: 'default' | 'inline' | 'band'
}) {
  const shell =
    variant === 'band'
      ? 'rounded-app-md border border-app-border bg-app-elevated/80 p-4 md:p-5 backdrop-blur-[2px]'
      : variant === 'inline'
        ? 'flex flex-col sm:flex-row gap-2'
        : 'space-y-3'
  return <div className={cn(shell, className)}>{children}</div>
}

export function BlockProfileBand({
  title,
  subtitle,
  seed,
  index = 0,
}: {
  title: string
  subtitle: string
  seed: number
  index?: number
}) {
  const tints: BlockTint[] = ['brand', 'accent', 'secondary', 'success']
  const tint = tints[index % tints.length]
  return (
    <div className="grid md:grid-cols-[1.1fr_1fr] gap-0 overflow-hidden rounded-app-md border border-app-border block-hover-lift">
      <div className="p-5 md:p-6 flex flex-col justify-center" style={{ background: blockTintBg(tint, 12) }}>
        <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: blockTintStyles(tint).subtle }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="text-base font-semibold text-app-text mb-1">{title}</div>
        <p className="text-xs text-app-muted leading-relaxed max-w-md">{subtitle}</p>
      </div>
      <BlockMediaBackground seed={seed} minHeight="min-h-[140px] md:min-h-full" overlay={0.25} />
    </div>
  )
}

export function BlockWaitlistInline({
  placeholder = 'you@company.com',
  cta = 'Get early access',
}: {
  placeholder?: string
  cta?: string
}) {
  return (
    <BlockFormStack variant="inline" className="max-w-xl">
      <Input
        placeholder={placeholder}
        className="flex-1 h-10 text-sm bg-app-surface/90 border-app-border/80 focus:border-app-accent"
      />
      <Button variant="primary" size="md" className="shrink-0">
        {cta}
      </Button>
    </BlockFormStack>
  )
}

export function BlockPricingColumn({
  name,
  price,
  desc,
  featured = false,
  index = 0,
}: {
  name: string
  price: string
  desc: string
  featured?: boolean
  index?: number
}) {
  const tint = featured ? 'accent' : blockTintAt(index)
  return (
    <BlockHoverCard
      index={index}
      tint={tint}
      className={cn('flex flex-col h-full', featured && 'block-hover-border-accent ring-1')}
    >
      {featured ? (
        <Badge variant="default" className="w-fit mb-2 text-[10px]">
          Popular
        </Badge>
      ) : null}
      <div className="text-xs text-app-muted">{name}</div>
      <div className="text-3xl font-bold my-2 text-app-text">{price}</div>
      <p className="text-xs text-app-muted mb-4 flex-1 leading-relaxed">{desc}</p>
      <Button variant={featured ? 'primary' : 'outline'} size="sm" className="w-full mt-auto">
        Choose plan
      </Button>
    </BlockHoverCard>
  )
}

export function BlockFaqRow({ question }: { question: string }) {
  return (
    <BlockSurface tint="surface" motion="lift" padding="p-3" className="flex items-center justify-between gap-3">
      <span className="text-sm text-app-text">{question}</span>
      <span className="text-app-muted shrink-0" aria-hidden>
        ›
      </span>
    </BlockSurface>
  )
}

export function BlockStatTile({
  label,
  value,
  change,
  index = 0,
}: {
  label: string
  value: string
  change: string
  index?: number
}) {
  const tint = blockTintAt(index)
  const t = blockTintStyles(tint)
  const positive = change.trim().startsWith('+')
  return (
    <BlockSurface tint={tint} motion="lift" padding="p-3">
      <div className="text-[11px] mb-1" style={{ color: t.subtle }}>
        {label}
      </div>
      <div className="text-xl font-bold text-app-text">{value}</div>
      <div
        className="text-[11px] mt-1"
        style={{ color: positive ? 'var(--app-success, var(--accent))' : 'var(--app-muted)' }}
      >
        {change}
      </div>
    </BlockSurface>
  )
}

export function BlockKpiPill({
  label,
  value,
  delta,
  index = 0,
}: {
  label: string
  value: string
  delta?: string
  index?: number
}) {
  const tint = blockTintAt(index)
  const t = blockTintStyles(tint)
  return (
    <div
      className="rounded-app-sm border px-2.5 py-2"
      style={{ background: t.bg, borderColor: t.border }}
    >
      <div className="text-[10px] truncate" style={{ color: t.subtle }}>
        {label}
      </div>
      <div className="text-sm font-semibold text-app-text leading-tight">{value}</div>
      {delta ? (
        <div className="text-[10px] text-app-muted mt-0.5">{delta}</div>
      ) : null}
    </div>
  )
}

export function BlockAvatarHeader({
  name,
  subtitle,
  role,
  index = 0,
}: {
  name: string
  subtitle: string
  role?: string
  index?: number
}) {
  const tint = blockTintAt(index)
  const t = blockTintStyles(tint)
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-14 w-14 shrink-0 rounded-full border-2 flex items-center justify-center text-sm font-semibold"
          style={{ borderColor: t.border, background: t.bg, color: t.fg }}
        >
          {name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold text-app-text truncate">{name}</div>
          <div className="text-xs text-app-muted truncate">{subtitle}</div>
          {role ? (
            <Badge variant="muted" className="mt-1 text-[10px]">
              {role}
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Button variant="outline" size="sm">
          Share
        </Button>
        <Button variant="primary" size="sm">
          Edit profile
        </Button>
      </div>
    </div>
  )
}

export function BlockSettingsRow({
  label,
  description,
  control,
}: {
  label: string
  description?: string
  control?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-app-border last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-app-text">{label}</div>
        {description ? (
          <div className="text-xs text-app-muted mt-0.5 leading-relaxed">{description}</div>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

export function blockMediaCoverProps(seed: number): { style: CSSProperties; className: string } {
  return {
    style: blockImageStyle(seed, 0.3),
    className: 'absolute inset-0 -z-[0]',
  }
}
