'use client'

import { ArchTemplatesPanel } from '@/components/arch/ArchTemplatesPanel'

/** Page packs (formerly Architecture → Templates). */
export function ArchPagePacksPicker() {
  return (
    <div className="flex flex-col gap-2 min-h-0">
      <p className="text-[9px] font-bold uppercase tracking-wider text-app-subtle px-1">
        Page packs
      </p>
      <div className="flex-1 min-h-0 overflow-hidden rounded-app border border-app-border">
        <ArchTemplatesPanel />
      </div>
    </div>
  )
}
