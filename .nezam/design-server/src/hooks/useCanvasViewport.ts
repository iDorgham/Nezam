'use client'

import { useCallback, useEffect, useRef, type PointerEvent, type WheelEvent } from 'react'
import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'
import {
  clampScale,
  mirrorDeltaX,
  screenToCanvas,
  zoomAroundPoint,
  type Point,
  type Viewport,
} from '@/src/lib/canvas-math'

// Wheel multiplier per "tick" of vertical scroll.
const ZOOM_STEP = 1.1

interface UseCanvasViewportResult {
  viewport:        Viewport
  handlePointerDown: (e: PointerEvent<HTMLElement>) => void
  handlePointerMove: (e: PointerEvent<HTMLElement>) => void
  handlePointerUp:   (e: PointerEvent<HTMLElement>) => void
  handleWheel:       (e: WheelEvent<HTMLElement>) => void
  // Helpers consumers may want for ports / hit-testing.
  screenToWorld:     (screen: Point) => Point
}

// Drives pan/zoom for CanvasWorkspace.
//
// Pan: hold the left mouse button (or single-touch) and drag.
// Zoom: scroll wheel — Ctrl/Cmd makes the zoom faster (3× factor); plain
// wheel still zooms because trackpad pinch on macOS comes through as
// wheel + ctrlKey synthetic event.
//
// AC-004: in `rtlMode`, raw pointer deltaX is negated so panning preserves
// the directional metaphor for RTL readers.
export function useCanvasViewport(): UseCanvasViewportResult {
  const viewport   = useCanvasGraphStore((s) => s.viewport)
  const setViewport = useCanvasGraphStore((s) => s.setViewport)
  const rtlMode    = useCanvasGraphStore((s) => s.rtlMode)

  const panAnchor = useRef<{ screen: Point; vp: Viewport } | null>(null)

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      // Only respond to primary button; right-click is reserved for context menu.
      if (e.button !== 0) return
      e.currentTarget.setPointerCapture(e.pointerId)
      panAnchor.current = {
        screen: { x: e.clientX, y: e.clientY },
        vp:     viewport,
      }
    },
    [viewport],
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const anchor = panAnchor.current
      if (!anchor) return

      const rawDx = e.clientX - anchor.screen.x
      const rawDy = e.clientY - anchor.screen.y
      const dx    = mirrorDeltaX(rawDx, rtlMode)

      setViewport(anchor.vp.x + dx, anchor.vp.y + rawDy, anchor.vp.scale)
    },
    [rtlMode, setViewport],
  )

  const handlePointerUp = useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    panAnchor.current = null
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent<HTMLElement>) => {
      // The canvas owns scrolling — don't let the browser scroll the page.
      e.preventDefault()

      const rect = e.currentTarget.getBoundingClientRect()
      const anchor: Point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      // Trackpad pinch sends ctrlKey; treat it as a stronger zoom step.
      const step      = e.ctrlKey || e.metaKey ? ZOOM_STEP ** 3 : ZOOM_STEP
      // deltaY > 0 → user scrolled down → zoom OUT.
      const factor    = e.deltaY > 0 ? 1 / step : step
      const next      = zoomAroundPoint(viewport, anchor, factor)
      // Skip a state update when clamping made it a no-op.
      if (next === viewport) return
      setViewport(next.x, next.y, next.scale)
    },
    [viewport, setViewport],
  )

  const screenToWorld = useCallback(
    (screen: Point) => screenToCanvas(screen, viewport),
    [viewport],
  )

  // Release pointer capture on unmount to avoid stuck cursor state.
  useEffect(
    () => () => {
      panAnchor.current = null
    },
    [],
  )

  // Guarantee scale stays in bounds even if something pokes the store
  // directly. Cheap and defensive.
  useEffect(() => {
    const clamped = clampScale(viewport.scale)
    if (clamped !== viewport.scale) {
      setViewport(viewport.x, viewport.y, clamped)
    }
  }, [viewport, setViewport])

  return {
    viewport,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    screenToWorld,
  }
}
