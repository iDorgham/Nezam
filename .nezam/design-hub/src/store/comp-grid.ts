/** Shared bounds for Components library grid density controls. */

export const COMP_GRID_COLUMNS_MIN = 2
export const COMP_GRID_COLUMNS_MAX = 6
export const COMP_GRID_COLUMNS_DEFAULT = 4

export const COMP_CARD_SCALE_MIN = 0.75
export const COMP_CARD_SCALE_MAX = 1.35
export const COMP_CARD_SCALE_STEP = 0.05
export const COMP_CARD_SCALE_DEFAULT = 1

export function clampGridColumns(value: number): number {
  return Math.min(
    COMP_GRID_COLUMNS_MAX,
    Math.max(COMP_GRID_COLUMNS_MIN, Math.round(value)),
  )
}

export function clampCardScale(value: number): number {
  const stepped = Math.round(value / COMP_CARD_SCALE_STEP) * COMP_CARD_SCALE_STEP
  return Math.min(COMP_CARD_SCALE_MAX, Math.max(COMP_CARD_SCALE_MIN, stepped))
}
