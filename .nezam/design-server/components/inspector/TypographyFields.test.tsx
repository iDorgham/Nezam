import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TypographyFields, {
  isFluidFontSize,
  type TypographyValues,
} from './TypographyFields'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const BASE: TypographyValues = {
  fontFamily: 'Geist Sans',
  fontWeight: 400,
  fontSize:   'clamp(1rem, 2vw, 1.25rem)',
  lineHeight: 1.5,
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

describe('isFluidFontSize · hardlock predicate', () => {
  it('accepts clamp() expressions', () => {
    expect(isFluidFontSize('clamp(1rem, 2vw, 1.25rem)')).toBe(true)
  })

  it('accepts CSS variable references', () => {
    expect(isFluidFontSize('var(--ds-font-size-base)')).toBe(true)
  })

  it('rejects fixed px values', () => {
    expect(isFluidFontSize('16px')).toBe(false)
  })

  it('rejects fixed rem values', () => {
    expect(isFluidFontSize('1rem')).toBe(false)
  })

  it('rejects bare numbers', () => {
    expect(isFluidFontSize('14')).toBe(false)
  })

  it('treats empty strings as not-yet-entered (no error)', () => {
    expect(isFluidFontSize('')).toBe(true)
  })
})

describe('TypographyFields · render and bindings', () => {
  it('renders all four labelled inputs', () => {
    render(<TypographyFields values={BASE} onChange={() => {}} />)

    expect(container!.querySelector('[aria-label="font-family"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="font-weight"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="font-size"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="line-height"]')).not.toBeNull()
  })

  it('shows the inline hardlock error when font-size is a fixed unit', () => {
    render(
      <TypographyFields
        values={{ ...BASE, fontSize: '16px' }}
        onChange={() => {}}
      />,
    )

    const size = container!.querySelector<HTMLInputElement>('input[aria-label="font-size"]')!
    expect(size.getAttribute('aria-invalid')).toBe('true')
    expect(container!.querySelector('[role="alert"]')?.textContent).toMatch(/clamp\(\)/)
  })

  it('omits the error when font-size is a clamp() formula', () => {
    render(<TypographyFields values={BASE} onChange={() => {}} />)

    const size = container!.querySelector<HTMLInputElement>('input[aria-label="font-size"]')!
    expect(size.getAttribute('aria-invalid')).toBe('false')
    expect(container!.querySelector('[role="alert"]')).toBeNull()
  })

  it('fires onChange when the line-height input is edited', () => {
    const onChange = vi.fn()
    render(<TypographyFields values={BASE} onChange={onChange} />)

    const leading = container!.querySelector<HTMLInputElement>('input[aria-label="line-height"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(leading, '1.7')
      leading.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(onChange).toHaveBeenCalledWith('lineHeight', 1.7)
  })

  it('disables every control when disabled is set', () => {
    render(<TypographyFields values={BASE} onChange={() => {}} disabled />)

    expect(container!.querySelector<HTMLSelectElement>('[aria-label="font-family"]')!.disabled).toBe(true)
    expect(container!.querySelector<HTMLSelectElement>('[aria-label="font-weight"]')!.disabled).toBe(true)
    expect(container!.querySelector<HTMLInputElement>('[aria-label="font-size"]')!.disabled).toBe(true)
    expect(container!.querySelector<HTMLInputElement>('[aria-label="line-height"]')!.disabled).toBe(true)
  })
})
