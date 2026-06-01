'use client'

import { ArchTemplatesPanel } from '@/components/arch/ArchTemplatesPanel'
import { cn } from '@/lib/utils'

type Props = {
  /** When false, omit the section heading (parent provides tab label). */
  showHeading?: boolean
  /** Onboarding modal uses dark chrome; templates panel adapts tokens and grid density. */
  variant?: 'default' | 'onboarding'
  hideFilters?: boolean
  searchQuery?: string
}

/** Page packs (formerly Architecture → Templates). */
export function ArchPagePacksPicker({
  showHeading = true,
  variant = 'default',
  hideFilters = false,
  searchQuery = '',
}: Props) {
  const isOnboarding = variant === 'onboarding'

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {showHeading ? (
        <p
          className={cn(
            'shrink-0 text-[9px] font-bold uppercase tracking-wider px-1',
            isOnboarding ? 'text-white/40' : 'text-app-subtle',
          )}
        >
          Page packs
        </p>
      ) : null}
      <div
        className={cn(
          'min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg border',
          isOnboarding
            ? 'border-white/[0.08] bg-black/20'
            : 'rounded-app border-app-border bg-app-inset/30',
        )}
      >
        <ArchTemplatesPanel
          gridColumns={isOnboarding ? 2 : 4}
          variant={variant}
          hideFilters={hideFilters}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}
