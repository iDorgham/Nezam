import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vi-axe'
import { Button } from '@/components/ui/button'

describe('Button · axe smoke', () => {
  it('has no serious axe violations when labeled', async () => {
    const { container } = render(<Button type="button">Save layout</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
