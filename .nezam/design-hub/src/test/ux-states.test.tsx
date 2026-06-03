import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import Loading from '../../app/loading'
import NotFound from '../../app/not-found'
import ErrorBoundary from '../../app/error'

/** T-P4-003 — UX states: loading / error / not-found. */

describe('Loading boundary (T-P4-003)', () => {
  it('AC-001/AC-003: mounts and exposes a status role', async () => {
    const { getByRole, container } = render(<Loading />)
    expect(getByRole('status')).toBeTruthy() // Spinner provides role=status
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('NotFound boundary (T-P4-002/003)', () => {
  it('AC-002/AC-003: renders a branded empty state with a heading', async () => {
    const { getByRole, container } = render(<NotFound />)
    expect(getByRole('heading', { name: /page not found/i })).toBeTruthy()
    expect(getByRole('region', { name: /page not found/i })).toBeTruthy()
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Error boundary (T-P4-003)', () => {
  it('AC-001: renders an alert and a working reset action', async () => {
    const reset = vi.fn()
    const { getByRole } = render(
      <ErrorBoundary error={Object.assign(new Error('boom'), { digest: 'x' })} reset={reset} />,
    )
    expect(getByRole('alert')).toBeTruthy()
    const btn = getByRole('button', { name: /try again/i })
    btn.click()
    expect(reset).toHaveBeenCalledTimes(1)
  })
})
