'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/** Register GSAP plugins once, on the client. Safe to call repeatedly. */
export function ensureGsap(): typeof gsap {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    gsap.defaults({ ease: 'power3.out', duration: 0.6 })
    registered = true
  }
  return gsap
}

export { gsap, ScrollTrigger }

/** True when the user has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
