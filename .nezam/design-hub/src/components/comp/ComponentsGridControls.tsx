'use client'

import { LayoutGrid, Maximize2 } from 'lucide-react'
import { Slider } from '@/components/ui/Slider'
import { useHub } from '@/store/hub.store'
import {
  COMP_CARD_SCALE_DEFAULT,
  COMP_CARD_SCALE_MAX,
  COMP_CARD_SCALE_MIN,
  COMP_CARD_SCALE_STEP,
  COMP_GRID_COLUMNS_DEFAULT,
  COMP_GRID_COLUMNS_MAX,
  COMP_GRID_COLUMNS_MIN,
} from '@/store/comp-grid'

export function ComponentsGridControls({ compact = false }: { compact?: boolean }) {
  const gridColumns = useHub((s) => s.comp.gridColumns)
  const cardScale = useHub((s) => s.comp.cardScale)
  const setGridColumns = useHub((s) => s.compSetGridColumns)
  const setCardScale = useHub((s) => s.compSetCardScale)

  if (compact) {
    return (
      <div className="flex shrink-0 items-center gap-6" aria-label="Component grid layout">
        <div className="flex items-center gap-2.5">
          <LayoutGrid className="h-4 w-4 shrink-0 text-app-muted" aria-hidden />
          <span className="text-xs font-medium text-app-muted whitespace-nowrap">Per row</span>
          <Slider
            className="w-[120px]"
            size="comfortable"
            hideLabel
            label="Per row"
            min={COMP_GRID_COLUMNS_MIN}
            max={COMP_GRID_COLUMNS_MAX}
            step={1}
            value={gridColumns}
            onChange={setGridColumns}
            format={(v) => `${v}`}
          />
          <span className="w-5 shrink-0 text-right font-mono text-xs tabular-nums text-app-text">
            {gridColumns}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Maximize2 className="h-4 w-4 shrink-0 text-app-muted" aria-hidden />
          <span className="text-xs font-medium text-app-muted whitespace-nowrap">Card size</span>
          <Slider
            className="w-[120px]"
            size="comfortable"
            hideLabel
            label="Card size"
            min={COMP_CARD_SCALE_MIN}
            max={COMP_CARD_SCALE_MAX}
            step={COMP_CARD_SCALE_STEP}
            value={cardScale}
            onChange={setCardScale}
            format={(v) => `${Math.round(v * 100)}%`}
          />
          <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-app-text">
            {Math.round(cardScale * 100)}%
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5 lg:min-w-[300px]"
      aria-label="Component grid layout"
    >
      <div className="flex min-w-[120px] items-center gap-2">
        <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-app-muted" aria-hidden />
        <Slider
          className="flex-1"
          label="Per row"
          min={COMP_GRID_COLUMNS_MIN}
          max={COMP_GRID_COLUMNS_MAX}
          step={1}
          value={gridColumns}
          onChange={setGridColumns}
          format={(v) => `${v}`}
        />
      </div>
      <div className="flex min-w-[120px] items-center gap-2">
        <Maximize2 className="h-3.5 w-3.5 shrink-0 text-app-muted" aria-hidden />
        <Slider
          className="flex-1"
          label="Card size"
          min={COMP_CARD_SCALE_MIN}
          max={COMP_CARD_SCALE_MAX}
          step={COMP_CARD_SCALE_STEP}
          value={cardScale}
          onChange={setCardScale}
          format={(v) => `${Math.round(v * 100)}%`}
        />
      </div>
    </div>
  )
}
