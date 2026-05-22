import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import EasingSelector, {
  bezierPath,
  EASING_PRESETS,
  parseEasing,
} from './EasingSelector'

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

describe('parseEasing', () => {
  it('returns [0,0,1,1] for "linear"', () => {
    expect(parseEasing('linear')).toEqual([0, 0, 1, 1])
  })

  it('returns the preset control points for a canonical cubic-bezier string', () => {
    expect(parseEasing('cubic-bezier(0.42, 0, 0.58, 1)')).toEqual([0.42, 0, 0.58, 1])
  })

  it('parses an arbitrary cubic-bezier(...) string with whitespace + negatives', () => {
    expect(parseEasing('cubic-bezier(  0.1 , -0.2 ,  0.5,  1.05 )'))
      .toEqual([0.1, -0.2, 0.5, 1.05])
  })

  it('returns null for unrecognized strings', () => {
    expect(parseEasing('spring(100, 10)')).toBeNull()
    expect(parseEasing('cubic-bezier(0.1, 0.2)')).toBeNull()
  })
})

describe('bezierPath', () => {
  it('starts at the bottom-left padding corner and ends at the top-right', () => {
    const d = bezierPath([0, 0, 1, 1], 80, 8)
    expect(d.startsWith('M 8 72')).toBe(true)   // (pad, size-pad)
    expect(d.endsWith('72 8')).toBe(true)       // (size-pad, pad)
  })

  it('encodes both control points inside the inner box', () => {
    const d = bezierPath([0.5, 0.5, 0.5, 0.5], 80, 8)
    // 0.5 maps to padding + 0.5 * inner = 8 + 32 = 40 on both axes.
    expect(d).toContain('C 40 40, 40 40')
  })
})

describe('EasingSelector', () => {
  it('renders the preset list with the active value selected', () => {
    render(<EasingSelector value="cubic-bezier(0.42, 0, 0.58, 1)" onChange={() => {}} />)

    const select = container!.querySelector<HTMLSelectElement>('[aria-label="easing preset"]')!
    expect(select.value).toBe('cubic-bezier(0.42, 0, 0.58, 1)')
    // All canonical presets render at least once.
    for (const preset of EASING_PRESETS) {
      expect(container!.textContent).toContain(preset.label)
    }
  })

  it('falls back to a synthesized "Custom — value" option for unrecognized strings', () => {
    render(<EasingSelector value="cubic-bezier(0.05, 0.05, 0.95, 0.95)" onChange={() => {}} />)

    const select = container!.querySelector<HTMLSelectElement>('[aria-label="easing preset"]')!
    expect(select.value).toBe('custom')
    expect(container!.textContent).toContain('Custom — cubic-bezier(0.05, 0.05, 0.95, 0.95)')
  })

  it('fires onChange when a preset is selected', () => {
    const onChange = vi.fn()
    render(<EasingSelector value="linear" onChange={onChange} />)

    const select = container!.querySelector<HTMLSelectElement>('[aria-label="easing preset"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')!.set!
      setter.call(select, 'cubic-bezier(0.42, 0, 0.58, 1)')
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(onChange).toHaveBeenCalledWith('cubic-bezier(0.42, 0, 0.58, 1)')
  })

  it('does NOT call onChange when the user selects the synthetic "custom" option', () => {
    const onChange = vi.fn()
    render(<EasingSelector value="cubic-bezier(0.05, 0.05, 0.95, 0.95)" onChange={onChange} />)

    const select = container!.querySelector<HTMLSelectElement>('[aria-label="easing preset"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')!.set!
      setter.call(select, 'custom')
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders the SVG curve and both control-point dots', () => {
    render(<EasingSelector value="cubic-bezier(0.25, 0.1, 0.25, 1)" onChange={() => {}} />)

    expect(container!.querySelector('[data-testid="easing-preview"]')).not.toBeNull()
    expect(container!.querySelector('[data-testid="easing-curve"]')).not.toBeNull()
    expect(container!.querySelector('[data-testid="cp1"]')).not.toBeNull()
    expect(container!.querySelector('[data-testid="cp2"]')).not.toBeNull()
  })
})
