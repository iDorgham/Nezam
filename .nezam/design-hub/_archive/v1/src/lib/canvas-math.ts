// Pure math for the infinity canvas (F-005). No DOM access, no React.
// Used by useCanvasViewport, CanvasWorkspace, BezierWire, and the
// generative pipeline once it lands.

export interface Point {
  x: number
  y: number
}

export interface Viewport {
  x:     number // pan in screen px
  y:     number
  scale: number
}

// Scale bounds. AC-006 requires < 0.1 to render dot LOD, so we allow zoom
// out to 0.05 (50% past the dot threshold). Max zoom 4× keeps nodes
// readable without blurring CSS-rendered text.
export const MIN_SCALE = 0.05
export const MAX_SCALE = 4

export function clampScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1
  if (scale < MIN_SCALE) return MIN_SCALE
  if (scale > MAX_SCALE) return MAX_SCALE
  return scale
}

// ── Screen ↔ canvas conversion ────────────────────────────────────────────────
// Canvas div CSS: transform: translate(pan.x, pan.y) scale(scale)
// with transform-origin: 0 0. The math falls out of that:
//   screen = canvas * scale + pan
//   canvas = (screen - pan) / scale

export function screenToCanvas(screen: Point, vp: Viewport): Point {
  return {
    x: (screen.x - vp.x) / vp.scale,
    y: (screen.y - vp.y) / vp.scale,
  }
}

export function canvasToScreen(canvas: Point, vp: Viewport): Point {
  return {
    x: canvas.x * vp.scale + vp.x,
    y: canvas.y * vp.scale + vp.y,
  }
}

// ── Zoom anchoring ────────────────────────────────────────────────────────────
// Zoom in/out while keeping the canvas point under `anchorScreen` stationary
// — the usual "zoom to cursor" UX. We solve for the new pan that satisfies:
//   (anchorScreen - newPan) / newScale = (anchorScreen - oldPan) / oldScale
// → newPan = anchorScreen - (anchorScreen - oldPan) * newScale / oldScale

export function zoomAroundPoint(
  vp:           Viewport,
  anchorScreen: Point,
  factor:       number,
): Viewport {
  const nextScale = clampScale(vp.scale * factor)
  // If clamping made the factor a no-op, return the existing viewport
  // unchanged so we don't drift the pan from floating-point rounding.
  if (nextScale === vp.scale) return vp

  const ratio = nextScale / vp.scale
  return {
    x:     anchorScreen.x - (anchorScreen.x - vp.x) * ratio,
    y:     anchorScreen.y - (anchorScreen.y - vp.y) * ratio,
    scale: nextScale,
  }
}

// ── RTL coordinate mirroring (AC-004) ─────────────────────────────────────────
// Pan deltas must flip horizontally in RTL so dragging "right" still feels
// "right" to the user (Arabic readers expect reverse-X).
export function mirrorDeltaX(dx: number, rtl: boolean): number {
  return rtl ? -dx : dx
}

// Port anchor for a node, accounting for RTL. Source port is on the
// trailing edge of the node, target port on the leading edge.
//   LTR: source = right side, target = left side
//   RTL: swap
export interface NodeBox {
  x:      number
  y:      number
  width:  number
  height: number
}

export function sourcePort(node: NodeBox, rtl: boolean): Point {
  return {
    x: rtl ? node.x : node.x + node.width,
    y: node.y + node.height / 2,
  }
}

export function targetPort(node: NodeBox, rtl: boolean): Point {
  return {
    x: rtl ? node.x + node.width : node.x,
    y: node.y + node.height / 2,
  }
}

// ── Bezier control points (T-F005-010) ────────────────────────────────────────
// SPEC-DS-CANVAS-001 §4:
//   cp1 = src + wire.cp1Offset
//   cp2 = tgt + wire.cp2Offset
// Offsets are stored per-wire (cp1Offset.x: +80, cp2Offset.x: -80 default).
// In RTL we negate the X offset so the curve bows the right way.

export interface BezierPath {
  src: Point
  cp1: Point
  cp2: Point
  tgt: Point
}

export function bezierControlPoints(
  src:       Point,
  tgt:       Point,
  cp1Offset: Point,
  cp2Offset: Point,
  rtl:       boolean,
): BezierPath {
  const sign = rtl ? -1 : 1
  return {
    src,
    cp1: { x: src.x + cp1Offset.x * sign, y: src.y + cp1Offset.y },
    cp2: { x: tgt.x + cp2Offset.x * sign, y: tgt.y + cp2Offset.y },
    tgt,
  }
}

// Serialize a cubic bezier into an SVG `path d` string.
export function bezierPathD(p: BezierPath): string {
  return `M ${p.src.x} ${p.src.y} C ${p.cp1.x} ${p.cp1.y}, ${p.cp2.x} ${p.cp2.y}, ${p.tgt.x} ${p.tgt.y}`
}

// ── LOD threshold helper (used by F-005b) ─────────────────────────────────────
export type LOD = 'dot' | 'simplified' | 'full'

export function lodForScale(scale: number): LOD {
  if (scale < 0.1) return 'dot'
  if (scale < 0.4) return 'simplified'
  return 'full'
}

// ── Viewport frustum culling ──────────────────────────────────────────────────
// Returns true when a node rectangle (in canvas/world coords) is visible in
// the current viewport, expanded by `margin` pixels in screen space.
export function isInFrustum(
  node:     NodeBox,
  vp:       Viewport,
  screenW:  number,
  screenH:  number,
  margin = 200,
): boolean {
  // Convert the expanded screen bounds to canvas coords.
  const topLeft = screenToCanvas({ x: -margin, y: -margin }, vp)
  const botRight = screenToCanvas({ x: screenW + margin, y: screenH + margin }, vp)

  return (
    node.x + node.width  >= topLeft.x &&
    node.x               <= botRight.x &&
    node.y + node.height >= topLeft.y &&
    node.y               <= botRight.y
  )
}
