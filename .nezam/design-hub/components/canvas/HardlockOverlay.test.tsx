import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import HardlockOverlay from './HardlockOverlay'
import type { HardlockFailure } from '@/src/store/canvas-graph.store'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement | null = null
let root: Root | null = null

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => { root!.render(ui) })
}

afterEach(() => {
  if (root) {
    act(() => { root!.unmount() })
    root = null
  }
  container?.remove()
  container = null
})

describe('HardlockOverlay', () => {
  it('renders nothing when there are no failures', () => {
    render(<HardlockOverlay failures={[]} />)

    expect(container!.querySelector('[aria-label="Hardlock failures"]')).toBeNull()
  })

  it('renders one chip per failure with its label and message tooltip', () => {
    const failures: HardlockFailure[] = [
      { type: 'rtl',    message: 'RTL parity not verified on source node' },
      { type: 'wcag',   message: 'WCAG AA compliance not verified' },
      { type: 'vision', message: 'One attachment failed Vision Gate' },
    ]

    render(<HardlockOverlay failures={failures} />)

    const items = container!.querySelectorAll('[aria-label="Hardlock failures"] li')
    expect(items.length).toBe(3)
    expect(items[0].textContent).toContain('RTL parity')
    expect(items[0].getAttribute('title')).toBe('RTL parity not verified on source node')
    expect(items[1].textContent).toContain('WCAG AA')
    expect(items[2].textContent).toContain('Vision Gate')
  })

  it('renders just the failures that are present', () => {
    render(<HardlockOverlay failures={[{ type: 'vision', message: 'rejected asset' }]} />)

    const items = container!.querySelectorAll('[aria-label="Hardlock failures"] li')
    expect(items.length).toBe(1)
    expect(items[0].textContent).toContain('Vision Gate')
  })
})
