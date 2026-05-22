'use client'

import { DragOverlay, useDndContext } from '@dnd-kit/core'
import type { WidgetDef } from '@/lib/widgets/catalog'

export default function CanvasDropOverlay() {
  const { active } = useDndContext()
  const widget = active?.data?.current?.widget as WidgetDef | undefined

  if (!widget) return null

  return (
    <DragOverlay dropAnimation={null}>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-ds-primary/60 bg-ds-primary/10 text-ds-primary text-[11px] font-medium shadow-lg pointer-events-none"
        style={{ minWidth: 120 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-ds-primary shrink-0" />
        {widget.name}
      </div>
    </DragOverlay>
  )
}
