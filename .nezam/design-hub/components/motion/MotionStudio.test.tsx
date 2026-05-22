import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import MotionStudio from './MotionStudio'
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

function dock(): HTMLElement {
  return container!.querySelector<HTMLElement>('section[aria-label="Motion Studio"]')!
}

function getButton(name: string): HTMLButtonElement {
  return container!.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!
}

describe('MotionStudio · expanded default', () => {
  it('renders the dock with 240px expanded height', () => {
    render(<MotionStudio />)

    expect(dock().style.height).toBe('240px')
    expect(dock().dataset.collapsed).toBeUndefined()
    // Timeline (T-F006-002) is mounted in the body.
    expect(container!.querySelector('[aria-label="Timeline"]')).not.toBeNull()
  })

  it('shows the header transport controls + time readout', () => {
    render(<MotionStudio />)

    expect(getButton('Play')).not.toBeNull()
    expect(getButton('Stop')).not.toBeNull()
    expect(container!.querySelector('[aria-label="current time"]')?.textContent).toBe('0.00s')
    expect(container!.querySelector('[aria-label="duration"]')?.textContent).toBe('2.00s')
  })
})

describe('MotionStudio · collapse', () => {
  it('collapses the body when the collapse toggle is clicked', () => {
    render(<MotionStudio />)

    const toggle = getButton('Collapse Motion Studio')
    expect(toggle.getAttribute('aria-expanded')).toBe('true')

    act(() => { toggle.click() })

    expect(dock().dataset.collapsed).toBe('true')
    expect(container!.querySelector('[aria-label="Timeline"]')).toBeNull()
    expect(getButton('Expand Motion Studio').getAttribute('aria-expanded')).toBe('false')
  })

  it('re-expands when toggled again', () => {
    useMotionStore.getState().setCollapsed(true)
    render(<MotionStudio />)

    const expandToggle = getButton('Expand Motion Studio')
    act(() => { expandToggle.click() })

    expect(dock().dataset.collapsed).toBeUndefined()
    expect(container!.querySelector('[aria-label="Timeline"]')).not.toBeNull()
  })
})

describe('MotionStudio · transport', () => {
  it('Play toggles isPlaying and flips its data-state', () => {
    render(<MotionStudio />)

    const play = getButton('Play')
    expect(play.dataset.state).toBe('paused')
    act(() => { play.click() })

    expect(useMotionStore.getState().isPlaying).toBe(true)
    // Re-query — the same button now reads "Pause".
    expect(getButton('Pause').dataset.state).toBe('playing')
  })

  it('Stop rewinds the playhead to 0 and pauses', () => {
    useMotionStore.getState().setCurrentTime(1500)
    useMotionStore.getState().setIsPlaying(true)
    render(<MotionStudio />)

    act(() => { getButton('Stop').click() })

    const state = useMotionStore.getState()
    expect(state.currentTimeMs).toBe(0)
    expect(state.isPlaying).toBe(false)
  })

  it('renders the time readout reactively to store changes', () => {
    render(<MotionStudio />)

    act(() => { useMotionStore.getState().setCurrentTime(750) })
    act(() => { useMotionStore.getState().setDuration(3000) })

    expect(container!.querySelector('[aria-label="current time"]')?.textContent).toBe('0.75s')
    expect(container!.querySelector('[aria-label="duration"]')?.textContent).toBe('3.00s')
  })
})

describe('MotionStudio · persisted heightPx', () => {
  it('honors a custom heightPx from the store', () => {
    useMotionStore.getState().setHeightPx(320)
    render(<MotionStudio />)

    expect(dock().style.height).toBe('320px')
  })
})
