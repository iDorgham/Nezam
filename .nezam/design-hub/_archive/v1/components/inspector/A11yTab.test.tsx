import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import A11yTab, { type A11yValues } from './A11yTab'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const PASSING: A11yValues = {
  fgColor:  '#000000',
  bgColor:  '#ffffff',
  tabIndex: 0,
  ariaRole: 'region',
}

const FAILING: A11yValues = {
  fgColor:  '#cccccc',
  bgColor:  '#ffffff',
  tabIndex: 0,
  ariaRole: 'region',
}

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

describe('A11yTab · passing contrast (AC-004)', () => {
  it('shows the green pass badge with grade and ratio', () => {
    render(<A11yTab values={PASSING} onChange={() => {}} />)

    const badge = container!.querySelector('[role="status"][data-contrast-grade="AAA"]')!
    expect(badge).not.toBeNull()
    expect(badge.textContent).toContain('21')
    expect(badge.textContent).toContain('AAA')
  })
})

describe('A11yTab · failing contrast (AC-004)', () => {
  it('shows the red fail alert with the actual ratio', () => {
    render(<A11yTab values={FAILING} onChange={() => {}} />)

    const alert = container!.querySelector('[role="alert"]')!
    expect(alert).not.toBeNull()
    expect(alert.textContent).toMatch(/Contrast fail/i)
    expect(alert.textContent).toMatch(/:1/)
  })

  it('exposes a safe-color suggestion button and fires onChange when clicked', () => {
    const onChange = vi.fn()
    render(<A11yTab values={FAILING} onChange={onChange} />)

    const button = container!.querySelector<HTMLButtonElement>('[role="alert"] button')!
    expect(button.textContent).toMatch(/Use #/)

    act(() => { button.click() })
    expect(onChange).toHaveBeenCalledWith('fgColor', expect.stringMatching(/^#[0-9a-f]{6}$/i))
  })
})

describe('A11yTab · unparseable inputs', () => {
  it('shows a neutral "Enter both colors" hint when contrast cannot be computed', () => {
    render(
      <A11yTab
        values={{ ...PASSING, fgColor: 'not-a-color', bgColor: '' }}
        onChange={() => {}}
      />,
    )

    const hint = container!.querySelector('[aria-label="Contrast unavailable"]')!
    expect(hint).not.toBeNull()
    expect(hint.textContent).toContain('Enter both colors')
  })
})

describe('A11yTab · ARIA + tab-index inputs', () => {
  it('renders read-write inputs for tab-index and aria-role', () => {
    const onChange = vi.fn()
    render(<A11yTab values={PASSING} onChange={onChange} />)

    const tabIndex = container!.querySelector<HTMLInputElement>('[aria-label="tab-index"]')!
    const ariaRole = container!.querySelector<HTMLInputElement>('[aria-label="aria-role"]')!
    expect(tabIndex.value).toBe('0')
    expect(ariaRole.value).toBe('region')

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(tabIndex, '3')
      tabIndex.dispatchEvent(new Event('input', { bubbles: true }))
    })
    expect(onChange).toHaveBeenCalledWith('tabIndex', 3)
  })

  it('disables every control when disabled is set', () => {
    render(<A11yTab values={PASSING} onChange={() => {}} disabled />)

    const inputs = container!.querySelectorAll<HTMLInputElement>('input')
    for (const input of inputs) expect(input.disabled).toBe(true)
  })
})
