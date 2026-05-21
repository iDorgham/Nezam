import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HardlockError from './HardlockError'
import type { HardlockResult } from '@/src/lib/hardlock-check'

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

const BLOCKED_MARGIN: HardlockResult = {
  ok:         false,
  code:       'directional-margin',
  message:    'Use logical properties: margin-inline-start / margin-inline-end',
  suggestion: 'margin-inline-start',
}

describe('HardlockError', () => {
  it('renders nothing when the result is ok', () => {
    render(<HardlockError result={{ ok: true }} />)
    expect(container!.querySelector('[role="alert"]')).toBeNull()
  })

  it('renders the message and tags the code via data attribute', () => {
    render(<HardlockError result={BLOCKED_MARGIN} />)

    const alert = container!.querySelector('[role="alert"]')!
    expect(alert.getAttribute('data-hardlock-code')).toBe('directional-margin')
    expect(alert.textContent).toContain('margin-inline-start')
  })

  it('shows a passive "Try: ..." hint when no click handler is provided', () => {
    render(<HardlockError result={BLOCKED_MARGIN} />)

    expect(container!.textContent).toContain('Try: margin-inline-start')
    expect(container!.querySelector('button')).toBeNull()
  })

  it('renders an actionable button when onUseSuggestion is provided', () => {
    const onUseSuggestion = vi.fn()
    render(<HardlockError result={BLOCKED_MARGIN} onUseSuggestion={onUseSuggestion} />)

    const button = container!.querySelector<HTMLButtonElement>('button')!
    expect(button.textContent).toContain('Use margin-inline-start')

    act(() => { button.click() })
    expect(onUseSuggestion).toHaveBeenCalledWith('margin-inline-start')
  })
})
