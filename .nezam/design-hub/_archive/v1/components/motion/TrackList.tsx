'use client'

import { useCallback, useRef } from 'react'
import {
  useMotionStore,
  MOTION_TRACK_PROPERTIES,
  type MotionTrackProperty,
} from '@/src/store/motion.store'
import KeyframeDiamond from './KeyframeDiamond'

// F-006 T-F006-003 — Track rows: opacity / translateY / scale / stagger.
// Each row pairs a 120px sidebar (label + visibility toggle) with a lane
// that hosts draggable KeyframeDiamonds (T-F006-004).

const TRACK_LABELS: Record<MotionTrackProperty, string> = {
  opacity:    'Opacity',
  translateY: 'Translate Y',
  scale:      'Scale',
  stagger:    'Stagger',
}

interface TrackRowProps {
  property: MotionTrackProperty
}

function TrackRow({ property }: TrackRowProps) {
  const tracks = useMotionStore((s) => s.tracks)
  const hidden = useMotionStore((s) => s.hiddenTracks)
  const toggle = useMotionStore((s) => s.toggleTrackVisibility)

  const laneRef   = useRef<HTMLDivElement | null>(null)
  const keyframes = tracks[property]
  const isHidden  = hidden.includes(property)

  const handleToggle = useCallback(() => toggle(property), [toggle, property])

  return (
    <div
      role="row"
      aria-label={`${TRACK_LABELS[property]} track`}
      data-track-property={property}
      data-track-hidden={isHidden || undefined}
      className={`flex items-stretch border-b border-ds-border/60 ${
        isHidden ? 'opacity-40' : ''
      }`}
    >
      {/* Sticky sidebar — pinned during horizontal scroll so labels stay
          visible while the timeline body scrolls under them. */}
      <div
        role="rowheader"
        className="flex items-center gap-2 px-2 py-1.5 min-w-[120px] w-[120px] sticky start-0 z-10 bg-ds-surface-elevated border-e border-ds-border"
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={!isHidden}
          aria-label={isHidden ? `Show ${TRACK_LABELS[property]}` : `Hide ${TRACK_LABELS[property]}`}
          className="w-4 h-4 flex items-center justify-center rounded-ds-sm text-ds-text-muted hover:text-ds-text-primary focus:outline-none focus:ring-2 focus:ring-ds-border-focus"
        >
          <span aria-hidden="true" className="text-[10px]">
            {isHidden ? '◌' : '●'}
          </span>
        </button>
        <span className="text-ds-xs text-ds-text-secondary truncate">
          {TRACK_LABELS[property]}
        </span>
        <span className="ms-auto text-[9px] font-mono text-ds-text-muted">
          {keyframes.length}
        </span>
      </div>

      {/* Track lane — keyframe diamonds are positioned absolutely. */}
      <div
        ref={laneRef}
        className="relative flex-1 min-h-[28px]"
        data-testid={`track-lane-${property}`}
      >
        {keyframes.map((kf) => (
          <KeyframeDiamond
            key={kf.id}
            property={property}
            keyframe={kf}
            laneRef={laneRef}
            trackLabel={TRACK_LABELS[property]}
          />
        ))}
      </div>
    </div>
  )
}

export default function TrackList() {
  return (
    <div role="rowgroup" aria-label="Motion tracks" className="flex flex-col">
      {MOTION_TRACK_PROPERTIES.map((p) => (
        <TrackRow key={p} property={p} />
      ))}
    </div>
  )
}
