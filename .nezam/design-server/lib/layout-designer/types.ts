// ─────────────────────────────────────────────────────────────────────────────
// NEZAM Layout Designer — Core Types
// ─────────────────────────────────────────────────────────────────────────────

export type BlockCategory =
  | 'navigation'
  | 'hero'
  | 'content'
  | 'data'
  | 'forms'
  | 'media'
  | 'commerce'
  | 'layout'
  | 'feedback'
  | 'overlay'

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12
export type SpacingKey = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
export type Breakpoint = 'mobile' | 'tablet' | 'desktop'
export type AlignItems = 'start' | 'center' | 'end' | 'stretch'
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type DisplayMode = 'block' | 'flex' | 'grid' | 'hidden'

// ── Component / Block Library Item ───────────────────────────────────────────

export interface ComponentVariant {
  id: string
  label: string
  description?: string
  previewSvg?: string // inline SVG thumbnail
}

export interface LibraryBlock {
  id: string
  name: string
  description: string
  category: BlockCategory
  shadcnComponents: string[]   // e.g. ['Button', 'Card', 'Input']
  radixPrimitives: string[]    // e.g. ['Dialog', 'Popover']
  variants: ComponentVariant[]
  canvasHeight: number         // preview height in px
  supportsGrid: boolean
  supportsRTL: boolean
  tags: string[]
}

// ── Layout Instance (placed on canvas) ───────────────────────────────────────

export interface LayoutSlot {
  id: string
  blockId: string            // ref to LibraryBlock.id
  variantId: string          // ref to ComponentVariant.id
  order: number
  label: string              // user-editable name
  colSpan: GridCols          // how many of 12 columns this block takes
  offsetCols: number         // left offset in 12-col grid
  paddingTop: SpacingKey
  paddingBottom: SpacingKey
  paddingX: SpacingKey
  display: DisplayMode
  flexDir: FlexDirection
  alignItems: AlignItems
  justifyContent: JustifyContent
  gap: SpacingKey
  breakpoints: Record<Breakpoint, Partial<Pick<LayoutSlot, 'colSpan' | 'display' | 'paddingTop' | 'paddingBottom' | 'paddingX' | 'gap'>>>
  locked: boolean
  approved: boolean
  notes: string
}

// ── Page Layout ───────────────────────────────────────────────────────────────

export interface PageLayout {
  pageId: string
  pageName: string
  pageRoute: string
  gridCols: GridCols           // base grid columns (12 standard)
  containerMaxWidth: string    // e.g. '1280px'
  containerPadding: SpacingKey
  rowGap: SpacingKey
  colGap: SpacingKey
  slots: LayoutSlot[]
  lockedAt: string | null
  exportedAt: string | null
}

// ── Layout Designer State ─────────────────────────────────────────────────────

export interface LayoutDesignerState {
  pages: PageLayout[]
  activePageId: string | null
  selectedSlotId: string | null
  activeBreakpoint: Breakpoint
  canvasZoom: number            // 0.5 – 1.5
  showGrid: boolean
  showLabels: boolean
  panelWidth: number            // library panel width in px
  inspectorWidth: number
}

// ── Export Shapes ─────────────────────────────────────────────────────────────

export interface WireframeExport {
  $schemaVersion: string
  exportedAt: string
  pages: Array<{
    pageId: string
    pageName: string
    route: string
    grid: {
      cols: number
      containerMaxWidth: string
      padding: string
      rowGap: string
      colGap: string
    }
    blocks: Array<{
      id: string
      block: string
      variant: string
      order: number
      colSpan: number
      offset: number
      spacing: { top: string; bottom: string; x: string }
      layout: { display: string; flexDir: string; align: string; justify: string; gap: string }
      locked: boolean
      approved: boolean
      notes: string
    }>
  }>
}
