'use client'

import type { ColorTokens } from '@/types'
import { cn } from '@/lib/cn'

interface MiniPreviewProps {
  colors: ColorTokens
  radius: number
  fontSans?: string
  className?: string
}

/**
 * A tiny, self-contained live preview of a token set — a nav bar, a heading,
 * a primary button, and a swatch row. Used in profile + saved-design cards.
 */
export function MiniPreview({ colors, radius, fontSans, className }: MiniPreviewProps) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ background: colors.bg, fontFamily: fontSans }}
    >
      <div className="flex h-full flex-col gap-1.5 p-2.5">
        {/* nav */}
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full" style={{ background: colors.brand }} />
          <div className="h-1 w-6 rounded-full" style={{ background: colors.textMuted, opacity: 0.5 }} />
          <div className="ml-auto flex gap-1">
            <div className="h-1 w-3 rounded-full" style={{ background: colors.textSubtle, opacity: 0.6 }} />
            <div className="h-1 w-3 rounded-full" style={{ background: colors.textSubtle, opacity: 0.6 }} />
          </div>
        </div>
        {/* card */}
        <div
          className="flex flex-1 flex-col justify-between p-1.5"
          style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: Math.min(radius, 10),
          }}
        >
          <div className="space-y-1">
            <div className="h-1.5 w-3/4 rounded-full" style={{ background: colors.text }} />
            <div className="h-1 w-full rounded-full" style={{ background: colors.textMuted, opacity: 0.55 }} />
            <div className="h-1 w-2/3 rounded-full" style={{ background: colors.textMuted, opacity: 0.55 }} />
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-3 w-9"
              style={{ background: colors.brand, borderRadius: Math.min(radius, 8) }}
            />
            <div
              className="h-3 w-6"
              style={{
                border: `1px solid ${colors.borderStrong}`,
                borderRadius: Math.min(radius, 8),
              }}
            />
          </div>
        </div>
        {/* swatch row */}
        <div className="flex gap-1">
          {[colors.brand, colors.accent, colors.success, colors.warning, colors.danger].map(
            (c, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full" style={{ background: c }} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}
