import { describe, expect, it } from 'vitest'
import {
  bezierControlPoints,
  bezierPathD,
  canvasToScreen,
  clampScale,
  lodForScale,
  mirrorDeltaX,
  screenToCanvas,
  sourcePort,
  targetPort,
  zoomAroundPoint,
  MAX_SCALE,
  MIN_SCALE,
} from './canvas-math'

describe('canvas-math · screenToCanvas / canvasToScreen round-trip', () => {
  const vp = { x: 100, y: 50, scale: 2 }

  it('round-trips an arbitrary point exactly', () => {
    const screen = { x: 320, y: 240 }
    const canvas = screenToCanvas(screen, vp)
    const back   = canvasToScreen(canvas, vp)
    expect(back.x).toBeCloseTo(screen.x)
    expect(back.y).toBeCloseTo(screen.y)
  })

  it('places (0,0) canvas at the viewport pan origin', () => {
    expect(canvasToScreen({ x: 0, y: 0 }, vp)).toEqual({ x: 100, y: 50 })
  })
})

describe('canvas-math · clampScale', () => {
  it(`clamps below MIN_SCALE (${MIN_SCALE})`, () => {
    expect(clampScale(0)).toBe(MIN_SCALE)
    expect(clampScale(-1)).toBe(MIN_SCALE)
  })

  it(`clamps above MAX_SCALE (${MAX_SCALE})`, () => {
    expect(clampScale(99)).toBe(MAX_SCALE)
  })

  it('returns 1 for non-finite input as a safe default', () => {
    expect(clampScale(NaN)).toBe(1)
    expect(clampScale(Infinity)).toBe(1)
  })
})

describe('canvas-math · zoomAroundPoint (cursor-anchored zoom)', () => {
  it('keeps the anchor screen point fixed in canvas space', () => {
    const vp     = { x: 0, y: 0, scale: 1 }
    const anchor = { x: 200, y: 200 }
    const before = screenToCanvas(anchor, vp)
    const next   = zoomAroundPoint(vp, anchor, 2)
    const after  = screenToCanvas(anchor, next)
    expect(after.x).toBeCloseTo(before.x)
    expect(after.y).toBeCloseTo(before.y)
    expect(next.scale).toBe(2)
  })

  it('returns the same viewport when the factor clamps to a no-op', () => {
    const vp = { x: 5, y: 5, scale: MAX_SCALE }
    expect(zoomAroundPoint(vp, { x: 0, y: 0 }, 10)).toBe(vp)
  })
})

describe('canvas-math · mirrorDeltaX (AC-004)', () => {
  it('passes dx through in LTR', () => {
    expect(mirrorDeltaX(15, false)).toBe(15)
    expect(mirrorDeltaX(-7, false)).toBe(-7)
  })

  it('negates dx in RTL', () => {
    expect(mirrorDeltaX(15, true)).toBe(-15)
    expect(mirrorDeltaX(-7, true)).toBe(7)
  })
})

describe('canvas-math · port anchors swap with RTL', () => {
  const node = { x: 100, y: 100, width: 180, height: 80 }

  it('LTR: source on trailing (right) edge, target on leading (left) edge', () => {
    expect(sourcePort(node, false)).toEqual({ x: 280, y: 140 })
    expect(targetPort(node, false)).toEqual({ x: 100, y: 140 })
  })

  it('RTL: source/target swap so curves still bow the right way', () => {
    expect(sourcePort(node, true)).toEqual({ x: 100, y: 140 })
    expect(targetPort(node, true)).toEqual({ x: 280, y: 140 })
  })
})

describe('canvas-math · bezierControlPoints', () => {
  const src       = { x: 0,   y: 0 }
  const tgt       = { x: 200, y: 0 }
  const cp1Offset = { x: 80,  y: 0 }
  const cp2Offset = { x: -80, y: 0 }

  it('places control points relative to the endpoints (LTR)', () => {
    const path = bezierControlPoints(src, tgt, cp1Offset, cp2Offset, false)
    expect(path.cp1).toEqual({ x: 80,  y: 0 })
    expect(path.cp2).toEqual({ x: 120, y: 0 })
  })

  it('mirrors control-point X in RTL', () => {
    const path = bezierControlPoints(src, tgt, cp1Offset, cp2Offset, true)
    expect(path.cp1).toEqual({ x: -80, y: 0 })
    expect(path.cp2).toEqual({ x: 280, y: 0 })
  })

  it('serializes to an SVG path d string', () => {
    const path = bezierControlPoints(src, tgt, cp1Offset, cp2Offset, false)
    expect(bezierPathD(path)).toBe('M 0 0 C 80 0, 120 0, 200 0')
  })
})

describe('canvas-math · lodForScale (AC-005, AC-006)', () => {
  it('< 0.1 → dot', () => {
    expect(lodForScale(0.05)).toBe('dot')
    expect(lodForScale(0.099)).toBe('dot')
  })

  it('0.1–0.4 → simplified', () => {
    expect(lodForScale(0.1)).toBe('simplified')
    expect(lodForScale(0.39)).toBe('simplified')
  })

  it('≥ 0.4 → full', () => {
    expect(lodForScale(0.4)).toBe('full')
    expect(lodForScale(1)).toBe('full')
    expect(lodForScale(MAX_SCALE)).toBe('full')
  })
})
