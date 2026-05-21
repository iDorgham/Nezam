import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import VisionGateBadge from './VisionGateBadge'

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

describe('VisionGateBadge', () => {
  it('renders the pending spinner with a "Scanning" label', () => {
    render(<VisionGateBadge status="pending" />)

    const badge = container!.querySelector('[role="status"]')!
    expect(badge.getAttribute('aria-label')).toBe('Vision Gate scanning')
    expect(badge.textContent).toBe('…')
  })

  it('renders the valid check', () => {
    render(<VisionGateBadge status="valid" />)

    const badge = container!.querySelector('[role="status"]')!
    expect(badge.getAttribute('aria-label')).toBe('Vision Gate passed')
    expect(badge.textContent).toBe('✓')
  })

  it('renders the rejected mark with the provided reason in the label and title', () => {
    render(<VisionGateBadge status="rejected" reason="Text detected in image" />)

    const badge = container!.querySelector('[role="status"]')!
    expect(badge.getAttribute('aria-label')).toContain('Text detected in image')
    expect(badge.getAttribute('title')).toBe('Text detected in image')
    expect(badge.textContent).toBe('✗')
  })

  it('falls back to a default rejection title when no reason is supplied', () => {
    render(<VisionGateBadge status="rejected" />)

    const badge = container!.querySelector('[role="status"]')!
    expect(badge.getAttribute('title')).toContain('Zero-Text Policy')
  })
})
