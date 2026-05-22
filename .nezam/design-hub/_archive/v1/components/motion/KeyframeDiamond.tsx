'use client'

import { useCallback, useRef, type PointerEvent } from 'react'
import {
  useMotionStore,
  type MotionKeyframe,
  type MotionTrackProperty,
} from '@/src/store/motion.store'
import { msToPx, pxToMs } from './Timeline'

// F-006 T-F006-004 — Draggable keyframe diamond.
// Pointer-drag along the lane updates keyframe.timeMs through the store;
// the diamond's left coordinate is derived from currentTimeMs so the visual
// always tracks committed state. Click without movement scrubs the playhead
// to the keyframe (preserves prior TrackList stub behaviour).

interface KeyframeDiamondProps {
  property:  MotionTrackProperty
  keyframe:  MotionKeyframe
  /** Lane element used as the coordinate reference frame for drag math. */
  laneRef:   React.RefObject<HTMLElement | null>
  /** Visual label suffix for screen readers (e.g. "Opacity"). */
  trackLabel: string
}

const DRAG_THRESHOLD_PX = 2

export default function KeyframeDiamond({
  property,
  keyframe,
  laneRef,
  trackLabel,
}: KeyframeDiamondProps) {
  const durationMs    = useMotionStore((s) => s.durationMs)
  const updateKeyframe = useMotionStore((s) => s.updateKeyframe)
  const setCurrentTime = useMotionStore((s) => s.setCurrentTime)

  // Drag state lives in a ref so we don't re-render on every pointermove.
  const drag = useRef<{
    startX:    number
    moved:     boolean
    originMs:  number
  } | null>(null)

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return
      e.stopPropagation()
      e.preventDefault()
      ;(e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId)
      drag.current = { startX: e.clientX, moved: false, originMs: keyframe.timeMs }
    },
    [keyframe.timeMs],
  )

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      const d = drag.current
      if (!d) return
      if (!d.moved && Math.abs(e.clientX - d.startX) < DRAG_THRESHOLD_PX) return
      d.moved = true

      const lane = laneRef.current
      if (!lane) return
      const rect = lane.getBoundingClientRect()
      const localX = e.clientX - rect.left
      const nextMs = Math.max(0, Math.min(pxToMs(localX), durationMs))
      updateKeyframe(property, keyframe.id, { timeMs: nextMs })
    },
    [durationMs, keyframe.id, laneRef, property, updateKeyframe],
  )

  const onPointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      const d = drag.current
      drag.current = null
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
      // Treat a no-drag pointerup as a click: scrub to this keyframe.
      if (d && !d.moved) setCurrentTime(keyframe.timeMs)
    },
    [keyframe.timeMs, setCurrentTime],
  )

  return (
    <button
      type="button"
      role="slider"
      aria-label={`${trackLabel} keyframe at ${(keyframe.timeMs / 1000).toFixed(2)}s`}
      aria-valuemin={0}
      aria-valuemax={durationMs}
      aria-valuenow={keyframe.timeMs}
      data-testid="keyframe-diamond"
      data-keyframe-id={keyframe.id}
      data-time-ms={keyframe.timeMs}
      data-property={property}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-ds-primary border border-ds-primary-foreground hover:bg-ds-primary-hover cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-ds-border-focus"
      style={{ left: msToPx(keyframe.timeMs) }}
    />
  )
}
