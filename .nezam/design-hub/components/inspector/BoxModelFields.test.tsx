import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BoxModelFields, {
  physicalSideHint,
  type BoxModelKey,
  type BoxModelValues,
} from './BoxModelFields'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const ZERO: BoxModelValues = {
  marginInlineStart:  0,
  marginInlineEnd:    0,
  marginBlockStart:   0,
  marginBlockEnd:     0,
  paddingInlineStart: 0,
  paddingInlineEnd:   0,
  paddingBlockStart:  0,
  paddingBlockEnd:    0,
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

describe('BoxModelFields · logical-property surface (AC-001)', () => {
  it('renders all 4 logical groups with start/end pairs and labels them with logical CSS names', () => {
    render(<BoxModelFields values={ZERO} onChange={() => {}} />)

    expect(container!.querySelector('[aria-label="Margin · Inline"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="Margin · Block"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="Padding · Inline"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="Padding · Block"]')).not.toBeNull()

    // Spec-mandated logical-property names are present on the inputs.
    expect(container!.querySelector('input[aria-label="margin-inline-start"]')).not.toBeNull()
    expect(container!.querySelector('input[aria-label="margin-inline-end"]')).not.toBeNull()
    expect(container!.querySelector('input[aria-label="padding-block-start"]')).not.toBeNull()
    expect(container!.querySelector('input[aria-label="padding-block-end"]')).not.toBeNull()
  })

  it('never renders directional (-left / -right / -top / -bottom) field names', () => {
    render(<BoxModelFields values={ZERO} onChange={() => {}} />)

    const html = container!.innerHTML
    expect(html).not.toMatch(/margin-left|margin-right|padding-left|padding-right/)
    expect(html).not.toMatch(/margin-top|margin-bottom|padding-top|padding-bottom/)
  })
})

describe('BoxModelFields · value binding', () => {
  it('displays the provided values in each input', () => {
    const values: BoxModelValues = {
      ...ZERO,
      marginInlineStart: 12,
      paddingBlockEnd:   24,
    }

    render(<BoxModelFields values={values} onChange={() => {}} />)

    const start = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    const end   = container!.querySelector<HTMLInputElement>('input[aria-label="padding-block-end"]')!
    expect(start.value).toBe('12')
    expect(end.value).toBe('24')
  })

  it('fires onChange with the typed numeric value', () => {
    const onChange = vi.fn()
    render(<BoxModelFields values={ZERO} onChange={onChange} />)

    const input = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-end"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(input, '16')
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(onChange).toHaveBeenCalledWith('marginInlineEnd', 16)
  })

  it('coerces an empty / NaN input to 0 instead of leaking NaN to the consumer', () => {
    const onChange = vi.fn()
    render(<BoxModelFields values={{ ...ZERO, marginInlineStart: 8 }} onChange={onChange} />)

    const input = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(input, '')
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(onChange).toHaveBeenCalledWith('marginInlineStart', 0)
  })
})

describe('BoxModelFields · disabled state (hardlock)', () => {
  it('disables every input when disabled prop is true', () => {
    render(<BoxModelFields values={ZERO} onChange={() => {}} disabled />)

    const inputs = container!.querySelectorAll<HTMLInputElement>('input[type="number"]')
    expect(inputs.length).toBe(8)
    for (const input of inputs) expect(input.disabled).toBe(true)
  })
})

describe('physicalSideHint (AC-006 / T-F007-010)', () => {
  it('maps inline-start to "left" in LTR', () => {
    expect(physicalSideHint('inline', 'start', false)).toBe('left')
    expect(physicalSideHint('inline', 'end',   false)).toBe('right')
  })

  it('maps inline-start to "right" in RTL (mirrored)', () => {
    expect(physicalSideHint('inline', 'start', true)).toBe('right')
    expect(physicalSideHint('inline', 'end',   true)).toBe('left')
  })

  it('always maps block-start/end to top/bottom regardless of rtlMode', () => {
    expect(physicalSideHint('block', 'start', false)).toBe('top')
    expect(physicalSideHint('block', 'end',   false)).toBe('bottom')
    expect(physicalSideHint('block', 'start', true)).toBe('top')
    expect(physicalSideHint('block', 'end',   true)).toBe('bottom')
  })
})

describe('BoxModelFields · mixed-keys placeholder (T-F007-009)', () => {
  it('renders the (mixed) placeholder on listed keys and an empty value', () => {
    const mixed = new Set<BoxModelKey>(['marginInlineStart', 'paddingBlockEnd'])
    render(<BoxModelFields values={ZERO} onChange={() => {}} mixedKeys={mixed} />)

    const start = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(start.value).toBe('')
    expect(start.placeholder).toBe('(mixed)')
    expect(start.dataset.mixed).toBe('true')

    const padding = container!.querySelector<HTMLInputElement>('input[aria-label="padding-block-end"]')!
    expect(padding.placeholder).toBe('(mixed)')

    // Non-mixed keys still render their value.
    const blockStart = container!.querySelector<HTMLInputElement>('input[aria-label="margin-block-start"]')!
    expect(blockStart.value).toBe('0')
    expect(blockStart.placeholder).toBe('')
  })

  it('exposes data-side-hint on every input for RTL-aware DOM queries', () => {
    render(<BoxModelFields values={ZERO} onChange={() => {}} rtlMode />)

    const inlineStart = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(inlineStart.dataset.sideHint).toBe('right')

    const blockEnd = container!.querySelector<HTMLInputElement>('input[aria-label="padding-block-end"]')!
    expect(blockEnd.dataset.sideHint).toBe('bottom')
  })
})
