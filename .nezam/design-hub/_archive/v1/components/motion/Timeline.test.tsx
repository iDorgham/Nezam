import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import Timeline, { msToPx, pxToMs, PX_PER_SECOND } from './Timeline'
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

describe('msToPx / pxToMs · coordinate helpers', () => {
  it('msToPx scales linearly with PX_PER_SECOND', () => {
    expect(msToPx(0)).toBe(0)
    expect(msToPx(1000)).toBe(PX_PER_SECOND)
    expect(msToPx(500)).toBeCloseTo(PX_PER_SECOND / 2)
  })

  it('pxToMs is the inverse of msToPx', () => {
    expect(pxToMs(0)).toBe(0)
    expect(pxToMs(PX_PER_SECOND)).toBe(1000)
    expect(msToPx(pxToMs(73))).toBeCloseTo(73)
  })
})

describe('Timeline · ruler ticks (every 0.1s, major every 1.0s)', () => {
  it('renders one minor tick every 100ms over the full duration', () => {
    useMotionStore.getState().setDuration(2000)
    render(<Timeline />)

    const minor = container!.querySelectorAll('[data-tick-ms]')
    // 0, 100, 200, ..., 2000 → 21 ticks.
    expect(minor.length).toBe(21)
  })

  it('marks 0ms / 1000ms / 2000ms as major and labels them', () => {
    useMotionStore.getState().setDuration(2000)
    render(<Timeline />)

    const major = container!.querySelectorAll('[data-tick-major]')
    expect(major.length).toBe(3)
    expect(container!.textContent).toContain('0.0s')
    expect(container!.textContent).toContain('1.0s')
    expect(container!.textContent).toContain('2.0s')
  })

  it('positions a major tick at exactly msToPx(ms) pixels', () => {
    useMotionStore.getState().setDuration(2000)
    render(<Timeline />)

    const major = container!.querySelectorAll<HTMLDivElement>('[data-tick-major]')
    // First major is 0ms → left:0; second 1000ms → left:PX_PER_SECOND.
    expect(major[0].style.left).toBe('0px')
    expect(major[1].style.left).toBe(`${PX_PER_SECOND}px`)
  })

  it('regenerates ticks when the store duration changes', () => {
    useMotionStore.getState().setDuration(500)
    render(<Timeline />)
    expect(container!.querySelectorAll('[data-tick-ms]').length).toBe(6) // 0..500

    act(() => { useMotionStore.getState().setDuration(1500) })
    expect(container!.querySelectorAll('[data-tick-ms]').length).toBe(16) // 0..1500
  })
})

describe('Timeline · scrub interaction', () => {
  it('exposes a slider role with the playhead position', () => {
    useMotionStore.getState().setDuration(2000)
    useMotionStore.getState().setCurrentTime(500)
    render(<Timeline />)

    const slider = container!.querySelector('[role="slider"]')!
    expect(slider.getAttribute('aria-valuemin')).toBe('0')
    expect(slider.getAttribute('aria-valuemax')).toBe('2000')
    expect(slider.getAttribute('aria-valuenow')).toBe('500')
    expect(slider.getAttribute('aria-valuetext')).toContain('0.50 seconds')
  })

  it('updates aria-valuenow reactively when the playhead moves', () => {
    render(<Timeline />)
    act(() => { useMotionStore.getState().setCurrentTime(1234) })

    expect(container!.querySelector('[role="slider"]')!.getAttribute('aria-valuenow')).toBe('1234')
  })

  it('clicking the ruler at x=PX_PER_SECOND scrubs to 1000ms', () => {
    // happy-dom's getBoundingClientRect returns 0 everywhere by default. To
    // exercise the math we stub it for the ruler element.
    useMotionStore.getState().setDuration(2000)
    render(<Timeline />)

    const ruler = container!.querySelector<HTMLDivElement>('[data-testid="timeline-ruler"]')!
    ruler.getBoundingClientRect = () => ({
      x: 0, y: 0, top: 0, left: 0, right: 500, bottom: 24, width: 500, height: 24,
      toJSON() { return {} },
    })

    act(() => {
      ruler.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: PX_PER_SECOND, clientY: 8 }))
    })

    expect(useMotionStore.getState().currentTimeMs).toBe(1000)
  })

  it('clamps a scrub past the duration to the duration end', () => {
    useMotionStore.getState().setDuration(1000)
    render(<Timeline />)

    const ruler = container!.querySelector<HTMLDivElement>('[data-testid="timeline-ruler"]')!
    ruler.getBoundingClientRect = () => ({
      x: 0, y: 0, top: 0, left: 0, right: 500, bottom: 24, width: 500, height: 24,
      toJSON() { return {} },
    })

    act(() => {
      ruler.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: PX_PER_SECOND * 5, clientY: 8 }))
    })

    expect(useMotionStore.getState().currentTimeMs).toBe(1000)
  })
})

describe('Timeline · scrub playhead (T-F006-008)', () => {
  it('renders a single 1px playhead line in the timeline column', () => {
    useMotionStore.getState().setDuration(2000)
    useMotionStore.getState().setCurrentTime(0)
    render(<Timeline />)

    const playheads = container!.querySelectorAll('[data-testid="timeline-playhead"]')
    expect(playheads.length).toBe(1)
  })

  it('positions the playhead at msToPx(currentTimeMs)', () => {
    useMotionStore.getState().setDuration(2000)
    useMotionStore.getState().setCurrentTime(1000)
    render(<Timeline />)

    const playhead = container!.querySelector<HTMLDivElement>('[data-testid="timeline-playhead"]')!
    expect(playhead.style.left).toBe(`${PX_PER_SECOND}px`)
  })

  it('moves reactively when the playhead position changes', () => {
    render(<Timeline />)

    act(() => { useMotionStore.getState().setCurrentTime(500) })

    const playhead = container!.querySelector<HTMLDivElement>('[data-testid="timeline-playhead"]')!
    expect(playhead.style.left).toBe(`${PX_PER_SECOND * 0.5}px`)
  })
})

describe('Timeline · grid body', () => {
  it('renders the grid body that future TrackList rows mount into', () => {
    render(<Timeline />)

    const grid = container!.querySelector('[data-testid="timeline-grid"]')
    expect(grid).not.toBeNull()
  })

  it('renders children inside the grid body', () => {
    render(
      <Timeline>
        <div data-testid="track-stub">stub</div>
      </Timeline>,
    )

    const grid = container!.querySelector('[data-testid="timeline-grid"]')!
    expect(grid.querySelector('[data-testid="track-stub"]')).not.toBeNull()
  })
})
