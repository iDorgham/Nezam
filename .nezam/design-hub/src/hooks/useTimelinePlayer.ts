'use client'

import { useEffect, useRef } from 'react'
import { useHub } from '@/store/hub.store'
import { ensureGsap, prefersReducedMotion } from '@/lib/gsap'
import type { AnimProperty } from '@/types'

/** Translate a timeline property + value into a GSAP tween var. */
function propVar(property: AnimProperty, value: number): Record<string, unknown> {
  switch (property) {
    case 'opacity':
      return { opacity: value }
    case 'y':
      return { y: value }
    case 'x':
      return { x: value }
    case 'scale':
      return { scale: value }
    case 'rotate':
      return { rotation: value }
    case 'blur':
      return { filter: `blur(${value}px)` }
  }
}

/**
 * Drives a live GSAP timeline against the preview's `[data-anim]` elements.
 * Mount once — it reacts to play state, scrubbing, and structural edits.
 */
export function useTimelinePlayer() {
  const playing = useHub((s) => s.timeline.playing)
  const playhead = useHub((s) => s.timeline.playhead)
  const tracks = useHub((s) => s.timeline.tracks)
  const duration = useHub((s) => s.timeline.duration)
  const stagger = useHub((s) => s.timeline.stagger)

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const fromOnUpdate = useRef(false)

  // Rebuild on structural change — next play picks up the new shape.
  useEffect(() => {
    tlRef.current?.kill()
    tlRef.current = null
  }, [tracks, duration, stagger])

  // Play / pause.
  useEffect(() => {
    if (!playing) {
      tlRef.current?.pause()
      return
    }
    const setPlayhead = useHub.getState().setPlayhead
    const setPlaying = useHub.getState().setPlaying

    if (prefersReducedMotion()) {
      setPlayhead(1)
      setPlaying(false)
      return
    }

    const gsap = ensureGsap()
    const state = useHub.getState().timeline

    tlRef.current?.kill()
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        fromOnUpdate.current = true
        useHub.getState().setPlayhead(tl.progress())
        fromOnUpdate.current = false
      },
      onComplete: () => useHub.getState().setPlaying(false),
    })

    for (const track of state.tracks) {
      const sel =
        track.target === 'all' ? '[data-anim]' : `[data-anim="${track.target}"]`
      const targets = document.querySelectorAll(sel)
      if (!targets.length) continue
      for (const kf of track.keyframes) {
        tl.fromTo(
          targets,
          { ...propVar(kf.property, kf.from), immediateRender: false },
          {
            ...propVar(kf.property, kf.to),
            duration: state.duration * 0.55,
            ease: 'power3.out',
            stagger: state.stagger,
          },
          kf.at * state.duration,
        )
      }
    }

    tlRef.current = tl
    const start = playhead >= 1 ? 0 : playhead
    tl.progress(start).play()

    return () => {
      tl.pause()
    }
    // playhead intentionally excluded — only (re)start when play state flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  // Scrub: seek the timeline when the playhead moves while paused.
  useEffect(() => {
    if (fromOnUpdate.current || playing) return
    if (playhead === 0) {
      const gsap = ensureGsap()
      gsap.set('[data-anim]', { clearProps: 'all' })
      tlRef.current?.progress(0)
      return
    }
    if (tlRef.current) {
      tlRef.current.progress(playhead)
    }
  }, [playhead, playing])
}
