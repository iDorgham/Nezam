import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vi-axe'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

/** T-Q-001 — axe-core accessibility coverage for interactive UI primitives. */

describe('UI primitives · axe', () => {
  it('AC-001: Button has no violations', async () => {
    const { container } = render(<Button type="button">Save layout</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('AC-001: Input associates its label (regression guard for unlabeled inputs)', async () => {
    const { container, getByLabelText } = render(<Input label="Email" hint="we never share it" />)
    // Programmatic association: querying by label must find the input.
    expect(getByLabelText('Email')).toBeTruthy()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('AC-001: Switch has no violations when given an accessible name', async () => {
    const { container } = render(<Switch aria-label="Enable hints" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('AC-002: Badge has no violations', async () => {
    const { container } = render(<Badge variant="muted">Beta</Badge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
