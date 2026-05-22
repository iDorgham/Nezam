import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import UploadProgress from './UploadProgress'

// F-008 §3.3 / AC-006 — Per-file progress row. Pure render of name + percent.
// onCancel fires only while the upload is in-flight (percent < 100).

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

describe('UploadProgress · rendering', () => {
  it('renders the filename', () => {
    render(<UploadProgress name="hero.png" percent={42} onCancel={() => {}} />)
    expect(container!.textContent).toContain('hero.png')
  })

  it('renders the percent label rounded to an integer', () => {
    render(<UploadProgress name="x.png" percent={42.7} onCancel={() => {}} />)
    expect(container!.textContent).toContain('43%')
  })

  it('renders a progressbar with matching aria-valuenow / min / max', () => {
    render(<UploadProgress name="x.png" percent={42} onCancel={() => {}} />)
    const bar = container!.querySelector('[role="progressbar"]')!
    expect(bar).not.toBeNull()
    expect(bar.getAttribute('aria-valuenow')).toBe('42')
    expect(bar.getAttribute('aria-valuemin')).toBe('0')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
  })
})

describe('UploadProgress · cancel control', () => {
  it('renders a cancel button while the upload is in flight', () => {
    render(<UploadProgress name="x.png" percent={42} onCancel={() => {}} />)
    const cancel = container!.querySelector<HTMLButtonElement>('button[aria-label="Cancel upload"]')!
    expect(cancel).not.toBeNull()
  })

  it('fires onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<UploadProgress name="x.png" percent={42} onCancel={onCancel} />)
    const cancel = container!.querySelector<HTMLButtonElement>('button[aria-label="Cancel upload"]')!
    act(() => { cancel.click() })
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('hides the cancel button once the upload is complete (percent === 100)', () => {
    render(<UploadProgress name="x.png" percent={100} onCancel={() => {}} />)
    expect(container!.querySelector('button[aria-label="Cancel upload"]')).toBeNull()
  })
})

describe('UploadProgress · clamping', () => {
  it('clamps negative percent to 0', () => {
    render(<UploadProgress name="x.png" percent={-5} onCancel={() => {}} />)
    const bar = container!.querySelector('[role="progressbar"]')!
    expect(bar.getAttribute('aria-valuenow')).toBe('0')
  })

  it('clamps overflow percent to 100', () => {
    render(<UploadProgress name="x.png" percent={150} onCancel={() => {}} />)
    const bar = container!.querySelector('[role="progressbar"]')!
    expect(bar.getAttribute('aria-valuenow')).toBe('100')
  })
})
