import { act, useRef, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import KeyframeDiamond from './KeyframeDiamond'
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

// Test harness: mount a single diamond inside a lane whose bounding rect we
// can override deterministically. Provides the lane ref the component needs.
function Harness({
  keyframeId,
  initialMs,
  laneRect,
}: {
  keyframeId: string
  initialMs:  number
  laneRect:   DOMRect
}) {
  const laneRef = useRef<HTMLDivElement>(null)

  // Mount once with the keyframe; rely on the parent test's setup for store.
  return (
    <div
      ref={(el) => {
        if (!el || laneRef.current === el) return
        ;(laneRef as { current: HTMLDivElement | null }).current = el
        el.getBoundingClientRect = () => laneRect
      }}
      style={{ position: 'relative', width: 500 }}
      data-testid="lane"
    >
      <KeyframeDiamond
        property="opacity"
        keyframe={{ id: keyframeId, timeMs: initialMs, value: 0 }}
        laneRef={laneRef as React.RefObject<HTMLElement | null>}
        trackLabel="Opacity"
      />
    </div>
  )
}

function laneRect(): DOMRect {
  return {
    x: 0, y: 0, top: 0, left: 0, right: 500, bottom: 28, width: 500, height: 28,
    toJSON() { return {} },
  } as DOMRect
}

function withSelfReadingProp(node: HTMLElement) {
  // happy-dom's PointerEvent ignores button:0 sometimes — also patch the
  // `setPointerCapture` / `hasPointerCapture` / `releasePointerCapture` calls.
  if (typeof node.setPointerCapture !== 'function') {
    node.setPointerCapture     = () => {}
    node.hasPointerCapture     = () => false
    node.releasePointerCapture = () => {}
  }
  return node
}

function pointer(node: HTMLElement, type: string, clientX: number) {
  act(() => {
    const ev = new PointerEvent(type, {
      bubbles:   true,
      clientX,
      clientY:   14,
      button:    0,
      pointerId: 1,
    })
    withSelfReadingProp(node).dispatchEvent(ev)
  })
}

describe('KeyframeDiamond · render', () => {
  it('renders at left=msToPx(initial timeMs)', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 500, value: 0 })

    render(<Harness keyframeId="k1" initialMs={500} laneRect={laneRect()} />)

    const diamond = container!.querySelector<HTMLButtonElement>('[data-testid="keyframe-diamond"]')!
    expect(diamond.style.left).toBe(`${PX_PER_SECOND * 0.5}px`)
    expect(diamond.dataset.timeMs).toBe('500')
  })

  it('exposes aria-valuenow and a screen-reader-friendly label', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 750, value: 0 })

    render(<Harness keyframeId="k1" initialMs={750} laneRect={laneRect()} />)

    const diamond = container!.querySelector('[data-testid="keyframe-diamond"]')!
    expect(diamond.getAttribute('aria-valuenow')).toBe('750')
    expect(diamond.getAttribute('aria-label')).toMatch(/Opacity keyframe at 0\.75s/)
  })
})

describe('KeyframeDiamond · drag updates timeMs through the store', () => {
  it('moves the keyframe to the pointer position on drag', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 100, value: 0 })

    render(<Harness keyframeId="k1" initialMs={100} laneRect={laneRect()} />)
    const diamond = container!.querySelector<HTMLButtonElement>('[data-testid="keyframe-diamond"]')!

    pointer(diamond, 'pointerdown', 12)            // start near initial
    pointer(diamond, 'pointermove', PX_PER_SECOND) // drag to 1000ms == 1.0s
    pointer(diamond, 'pointerup',   PX_PER_SECOND)

    expect(useMotionStore.getState().tracks.opacity[0].timeMs).toBe(1000)
  })

  it('clamps drags past the duration end', () => {
    useMotionStore.getState().setDuration(1500)
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 0, value: 0 })

    render(<Harness keyframeId="k1" initialMs={0} laneRect={laneRect()} />)
    const diamond = container!.querySelector<HTMLButtonElement>('[data-testid="keyframe-diamond"]')!

    pointer(diamond, 'pointerdown', 0)
    pointer(diamond, 'pointermove', PX_PER_SECOND * 10) // way past 1500ms
    pointer(diamond, 'pointerup',   PX_PER_SECOND * 10)

    expect(useMotionStore.getState().tracks.opacity[0].timeMs).toBe(1500)
  })

  it('clamps drags before zero', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 500, value: 0 })

    render(<Harness keyframeId="k1" initialMs={500} laneRect={laneRect()} />)
    const diamond = container!.querySelector<HTMLButtonElement>('[data-testid="keyframe-diamond"]')!

    pointer(diamond, 'pointerdown', 60)
    pointer(diamond, 'pointermove', -200)
    pointer(diamond, 'pointerup',   -200)

    expect(useMotionStore.getState().tracks.opacity[0].timeMs).toBe(0)
  })
})

describe('KeyframeDiamond · click (no drag) scrubs the playhead', () => {
  it('sets currentTimeMs to the keyframe time when pointerup happens without movement', () => {
    useMotionStore.getState().addKeyframe('opacity', { id: 'k1', timeMs: 800, value: 0 })

    render(<Harness keyframeId="k1" initialMs={800} laneRect={laneRect()} />)
    const diamond = container!.querySelector<HTMLButtonElement>('[data-testid="keyframe-diamond"]')!

    pointer(diamond, 'pointerdown', 96) // 800ms ≈ 96px
    pointer(diamond, 'pointerup',   96)

    expect(useMotionStore.getState().currentTimeMs).toBe(800)
  })
})
