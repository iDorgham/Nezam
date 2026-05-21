import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import TrackList from './TrackList'
import { PX_PER_SECOND } from './Timeline'
import { useMotionStore } from '@/src/store/motion.store'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement | null = null
let root: Root | null = null

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => { root!.render(ui) })
}

beforeEach(() => {
  useMotionStore.persist.clearStorage()
  useMotionStore.getState().reset()
})

afterEach(() => {
  if (root) {
    act(() => { root!.unmount() })
    root = null
  }
  container?.remove()
  container = null
})

describe('TrackList · row layout', () => {
  it('renders one row per built-in motion property (opacity / translateY / scale / stagger)', () => {
    render(<TrackList />)

    const rows = container!.querySelectorAll('[role="row"]')
    expect(rows.length).toBe(4)

    const props = Array.from(rows).map((r) => (r as HTMLElement).dataset.trackProperty)
    expect(props).toEqual(['opacity', 'translateY', 'scale', 'stagger'])
  })

  it('renders the human-readable label for each track', () => {
    render(<TrackList />)
    const text = container!.textContent ?? ''
    expect(text).toContain('Opacity')
    expect(text).toContain('Translate Y')
    expect(text).toContain('Scale')
    expect(text).toContain('Stagger')
  })

  it('exposes a per-property lane sized for absolute-positioned keyframes', () => {
    render(<TrackList />)
    expect(container!.querySelector('[data-testid="track-lane-opacity"]')).not.toBeNull()
    expect(container!.querySelector('[data-testid="track-lane-stagger"]')).not.toBeNull()
  })
})

describe('TrackList · visibility toggle', () => {
  it('marks a row as hidden via data attribute and flips the toggle aria-pressed', () => {
    render(<TrackList />)

    const toggle = container!.querySelector<HTMLButtonElement>('button[aria-label="Hide Opacity"]')!
    expect(toggle.getAttribute('aria-pressed')).toBe('true')

    act(() => { toggle.click() })

    const row = container!.querySelector<HTMLElement>('[data-track-property="opacity"]')!
    expect(row.dataset.trackHidden).toBe('true')

    // After toggling, the button label flips and aria-pressed inverts.
    const showButton = container!.querySelector<HTMLButtonElement>('button[aria-label="Show Opacity"]')!
    expect(showButton.getAttribute('aria-pressed')).toBe('false')
  })
})

describe('TrackList · keyframe rendering', () => {
  it('renders one diamond stub per keyframe at the correct msToPx position', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 500,  value: 0   })
    useMotionStore.getState().addKeyframe('opacity', { id: 'k2', timeMs: 1500, value: 1   })

    render(<TrackList />)

    const diamonds = container!.querySelectorAll<HTMLButtonElement>(
      '[data-testid="track-lane-opacity"] [data-testid="keyframe-diamond"]',
    )
    expect(diamonds.length).toBe(2)
    expect(diamonds[0].style.left).toBe(`${PX_PER_SECOND * 0.5}px`)
    expect(diamonds[1].style.left).toBe(`${PX_PER_SECOND * 1.5}px`)
  })

  it('keeps keyframes for other tracks out of a lane', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 500,  value: 0 })
    useMotionStore.getState().addKeyframe('scale',   { id: 'k2', timeMs: 1500, value: 1 })

    render(<TrackList />)

    expect(container!.querySelectorAll('[data-testid="track-lane-opacity"] [data-testid="keyframe-diamond"]').length).toBe(1)
    expect(container!.querySelectorAll('[data-testid="track-lane-scale"] [data-testid="keyframe-diamond"]').length).toBe(1)
    expect(container!.querySelectorAll('[data-testid="track-lane-stagger"] [data-testid="keyframe-diamond"]').length).toBe(0)
  })

  it('scrubs the playhead when a diamond receives pointerdown→pointerup without movement', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 750, value: 0.5 })

    render(<TrackList />)

    const diamond = container!.querySelector<HTMLButtonElement>('[data-testid="keyframe-diamond"]')!
    // happy-dom's HTMLElement is missing setPointerCapture; stub before dispatch.
    if (typeof diamond.setPointerCapture !== 'function') {
      diamond.setPointerCapture     = () => {}
      diamond.hasPointerCapture     = () => false
      diamond.releasePointerCapture = () => {}
    }

    act(() => {
      diamond.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, button: 0, pointerId: 1, clientX: 90, clientY: 14,
      }))
    })
    act(() => {
      diamond.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, button: 0, pointerId: 1, clientX: 90, clientY: 14,
      }))
    })

    expect(useMotionStore.getState().currentTimeMs).toBe(750)
  })
})
