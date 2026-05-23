'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useCanvasGraph } from '@/store/canvas-graph.store'
import type { CameraState } from '@/store/canvas-graph.store'

const MIN_SCALE = 0.1
const MAX_SCALE = 2.0
// Trackpad and wheel: 0.0008 gives smooth zooming. Hold Ctrl for pinch-to-zoom (browser handles scale).
const ZOOM_FACTOR = 0.0008

/**
 * Manages infinite canvas pan/zoom with zero React re-renders during interaction.
 * Camera transforms are applied directly to the DOM via refs; Zustand is synced
 * only on interaction-end for persistent state.
 *
 * Pan triggers: Spacebar + left-drag, or middle-mouse button.
 * Zoom trigger: Scroll wheel (zoom-to-cursor).
 */
export function useCanvasCamera(
  containerRef: React.RefObject<HTMLDivElement | null>,
  worldRef: React.RefObject<HTMLDivElement | null>,
  gridRef: React.RefObject<HTMLDivElement | null>,
) {
  const setCamera = useCanvasGraph((s) => s.setCamera)

  // Live camera — mutated directly, never triggers React renders
  const cam = useRef<CameraState>({ ...useCanvasGraph.getState().camera })
  const isPanning = useRef(false)
  const spaceHeld = useRef(false)
  const panStart = useRef({ clientX: 0, clientY: 0, panX: 0, panY: 0 })
  const raf = useRef<number>(0)

  /** Paint the world container transform and update the grid background offset. */
  const applyTransform = useCallback(() => {
    const world = worldRef.current
    const grid = gridRef.current
    if (!world) return

    const { panX, panY, scale } = cam.current
    world.style.transform = `translate3d(${panX}px,${panY}px,0) scale(${scale})`

    if (grid) {
      // Grid dot spacing scales with zoom; background-position shifts with pan
      const sz = 22 * scale
      grid.style.backgroundSize = `${sz}px ${sz}px`
      // Modulo keeps the position within one tile cycle (avoids large fractional values)
      grid.style.backgroundPosition = `${((panX % sz) + sz) % sz}px ${((panY % sz) + sz) % sz}px`
    }
  }, [worldRef, gridRef])

  const syncStore = useCallback(() => {
    setCamera({ ...cam.current })
  }, [setCamera])

  /**
   * Zoom toward the cursor point (cx, cy) in container-local coordinates.
   * Invariant: the world point currently under (cx, cy) stays under (cx, cy) after zoom.
   */
  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      const { panX, panY, scale } = cam.current
      const wx = (cx - panX) / scale
      const wy = (cy - panY) / scale
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * factor))
      cam.current = {
        panX: cx - wx * newScale,
        panY: cy - wy * newScale,
        scale: newScale,
      }
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(applyTransform)
      syncStore()
    },
    [applyTransform, syncStore],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Paint initial state immediately
    applyTransform()

    // ── Wheel zoom ──────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, 1 - e.deltaY * ZOOM_FACTOR)
    }

    // ── Spacebar pan mode ───────────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return
      if ((e.target as HTMLElement).closest('input,textarea,[contenteditable]')) return
      e.preventDefault()
      spaceHeld.current = true
      if (!isPanning.current) el.style.cursor = 'grab'
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      spaceHeld.current = false
      if (!isPanning.current) el.style.cursor = ''
    }

    // ── Pointer pan (spacebar+left or middle button) ────────────────
    const onPointerDown = (e: PointerEvent) => {
      const isMid = e.button === 1
      const isSpaceDrag = spaceHeld.current && e.button === 0
      if (!isMid && !isSpaceDrag) return

      e.preventDefault()
      isPanning.current = true
      panStart.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: cam.current.panX,
        panY: cam.current.panY,
      }
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isPanning.current) return
      const dx = e.clientX - panStart.current.clientX
      const dy = e.clientY - panStart.current.clientY
      cam.current = {
        ...cam.current,
        panX: panStart.current.panX + dx,
        panY: panStart.current.panY + dy,
      }
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(applyTransform)
    }

    const onPointerUp = () => {
      if (!isPanning.current) return
      isPanning.current = false
      el.style.cursor = spaceHeld.current ? 'grab' : ''
      syncStore()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    el.addEventListener('pointerdown', onPointerDown)
    // pointermove/up on window so we don't lose the pointer if it leaves the container
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      cancelAnimationFrame(raf.current)
    }
  }, [containerRef, applyTransform, syncStore, zoomAt])

  /** Convert screen coordinates (clientX/Y) to world space. */
  const screenToWorld = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 }
      const { panX, panY, scale } = cam.current
      return {
        x: (clientX - rect.left - panX) / scale,
        y: (clientY - rect.top - panY) / scale,
      }
    },
    [containerRef],
  )

  /** Programmatically jump to a camera position and sync to DOM + store. */
  const jumpTo = useCallback(
    (next: CameraState) => {
      cam.current = next
      applyTransform()
      syncStore()
    },
    [applyTransform, syncStore],
  )

  return { cam, screenToWorld, jumpTo }
}
