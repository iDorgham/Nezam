import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GenerateButton from './GenerateButton'

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

function button(): HTMLButtonElement {
  return container!.querySelector<HTMLButtonElement>('button')!
}

describe('GenerateButton · idle state', () => {
  it('is disabled with the default hint when canGenerate is false', () => {
    render(<GenerateButton canGenerate={false} mode="idle" onClick={() => {}} />)

    expect(button().disabled).toBe(true)
    expect(button().textContent).toContain('Generate target')
    expect(container!.textContent).toContain('Add an attachment or directive to enable')
  })

  it('is enabled and shows the default label when canGenerate is true', () => {
    render(<GenerateButton canGenerate mode="idle" onClick={() => {}} />)

    expect(button().disabled).toBe(false)
    expect(container!.textContent).not.toContain('Add an attachment or directive to enable')
  })

  it('fires onClick when enabled', () => {
    const onClick = vi.fn()
    render(<GenerateButton canGenerate mode="idle" onClick={onClick} />)

    act(() => { button().click() })

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('GenerateButton · busy states (validating / compressing / generating)', () => {
  it('shows the validating label and is disabled', () => {
    render(<GenerateButton canGenerate mode="validating" onClick={() => {}} />)

    expect(button().disabled).toBe(true)
    expect(button().getAttribute('aria-busy')).toBe('true')
    expect(button().textContent).toContain('Validating')
  })

  it('shows the compressing label and is disabled', () => {
    render(<GenerateButton canGenerate mode="compressing" onClick={() => {}} />)

    expect(button().disabled).toBe(true)
    expect(button().textContent).toContain('Compressing')
  })

  it('shows the generating label and is disabled', () => {
    render(<GenerateButton canGenerate mode="generating" onClick={() => {}} />)

    expect(button().disabled).toBe(true)
    expect(button().textContent).toContain('Generating')
  })
})

describe('GenerateButton · terminal states (done / error)', () => {
  it('shows the success label and stays enabled in done state', () => {
    render(<GenerateButton canGenerate mode="done" onClick={() => {}} />)

    expect(button().disabled).toBe(false)
    expect(button().getAttribute('data-state')).toBe('done')
    expect(button().textContent).toContain('Generated')
  })

  it('shows the retry label and the error message in error state', () => {
    render(
      <GenerateButton
        canGenerate
        mode="error"
        onClick={() => {}}
        errorMessage="Vision gate rejected one asset"
      />,
    )

    expect(button().disabled).toBe(false)
    expect(button().getAttribute('data-state')).toBe('error')
    expect(button().textContent).toContain('Retry')
    expect(container!.querySelector('[role="alert"]')?.textContent).toContain(
      'Vision gate rejected one asset',
    )
  })

  it('omits the hint paragraph when in an error state even if canGenerate is false', () => {
    render(
      <GenerateButton
        canGenerate={false}
        mode="error"
        onClick={() => {}}
        errorMessage="Token budget exceeded"
      />,
    )

    expect(container!.textContent).not.toContain('Add an attachment or directive to enable')
    expect(container!.querySelector('[role="alert"]')?.textContent).toContain(
      'Token budget exceeded',
    )
  })
})
