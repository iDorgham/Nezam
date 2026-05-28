'use client'

import * as simpleIcons from 'simple-icons'
import { Server } from 'lucide-react'
import { cn } from '@/lib/utils'

type SimpleIconData = { path: string; hex: string; title: string }
const iconCache = new Map<string, SimpleIconData | null>()

function slugToKey(slug: string): string {
  return `si${slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')}`
}

function getIcon(slug: string): SimpleIconData | null {
  const cached = iconCache.get(slug)
  if (cached !== undefined) return cached
  const key = slugToKey(slug)
  const icon = (simpleIcons as Record<string, SimpleIconData | undefined>)[key]
  const resolved = icon ?? null
  iconCache.set(slug, resolved)
  return resolved
}

interface BrandIconProps {
  slug: string
  size?: number
  className?: string
  title?: string
}

export function BrandIcon({ slug, size = 16, className, title }: BrandIconProps) {
  const icon = getIcon(slug)
  if (!icon) {
    return (
      <Server
        size={size}
        className={cn('shrink-0 text-app-muted', className)}
        aria-hidden
      />
    )
  }

  const label = title ?? icon.title
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-label={label}
    >
      <title>{label}</title>
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  )
}
