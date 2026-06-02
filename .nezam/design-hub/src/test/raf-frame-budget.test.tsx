import { fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { scheduleIdleWork } from '@/lib/preview/schedule-idle'
import { Scrubber } from '@/components/ui/Scrubber'

/** T-Q-003 — idle scheduling + Scrubber coalescing / clamping. */

describe('scheduleIdleWork (T-Q-003)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    // @ts-expect-error — clean up any injected global
    delete globalThis.requestIdleCallback
  })

  it('AC-001: uses requestIdleCallback with a timeout when available', () => {
    const ric = vi.fn((cb: () => void, _opts?: { timeout: number }) => {
      cb()
      return 1
    })
    // @ts-expect-error — inject idle API
    globalThis.requestIdleCallback = ric
    const work = vi.fn()
    scheduleIdleWork(work, 1234)
    expect(ric).toHaveBeenCalledTimes(1)
    expect(ric.mock.calls[0][1]).toEqual({ timeout: 1234 })
    expect(work).toHaveBeenCalledTimes(1)
  })

  it('AC-001/AC-003: falls back to a single setTimeout dispatch', () => {
    vi.useFakeTimers()
    // @ts-expect-error — ensure idle API is absent
    delete globalThis.requestIdleCallback
    const work = vi.fn()
    scheduleIdleWork(work)
    expect(work).not.toHaveBeenCalled()
    vi.advanceTimersByTime(64)
    expect(work).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1000)
    expect(work).toHaveBeenCalledTimes(1) // no double-dispatch
  })
})

describe('Scrubber (T-Q-003)', () => {
  beforeEach(() => {
    // happy-dom elements lack pointer-capture APIs.
    Element.prototype.setPointerCapture = vi.fn()
  })

  it('AC-002: coalesces pointer moves that do not change the value', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Scrubber value={10} onChange={onChange} step={1} pixelsPerStep={3} />)
    const el = getByRole('spinbutton')
    fireEvent.pointerDown(el, { clientX: 100, pointerId: 1 })
    fireEvent.pointerMove(el, { clientX: 100, pointerId: 1 }) // dx 0 → unchanged
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.pointerMove(el, { clientX: 103, pointerId: 1 }) // dx 3 → +1
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(11)
  })

  it('AC-002: clamps to max/min on keyboard increment', () => {
    const onChange = vi.fn()
    const { getByRole, rerender } = render(
      <Scrubber value={5} onChange={onChange} min={0} max={5} step={1} />,
    )
    fireEvent.keyDown(getByRole('spinbutton'), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(5) // clamped at max

    rerender(<Scrubber value={0} onChange={onChange} min={0} max={5} step={1} />)
    fireEvent.keyDown(getByRole('spinbutton'), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(0) // clamped at min
  })
})
