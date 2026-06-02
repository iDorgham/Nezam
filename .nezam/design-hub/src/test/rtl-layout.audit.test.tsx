import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  isSidebarShellLayout,
  splitSidebarShellSections,
} from '@/lib/wireframe/sidebar-shell-layout'

/** T-Q-002 — RTL rendering audit. */

describe('RTL rendering (T-Q-002)', () => {
  it('AC-001: primitives render inside a dir="rtl" container without error', () => {
    const { container } = render(
      <div dir="rtl">
        <Button type="button">حفظ</Button>
        <Input label="الاسم" />
      </div>,
    )
    const wrapper = container.querySelector('[dir="rtl"]')
    expect(wrapper).toBeTruthy()
    expect(wrapper?.querySelector('button')).toBeTruthy()
    expect(wrapper?.querySelector('input')).toBeTruthy()
  })

  it('AC-002: sidebar-shell split is direction-agnostic and order-stable', () => {
    const sections = [
      { block_type: 'Content_Features', order: 2 },
      { block_type: 'Nav_Sidebar', order: 0 },
      { block_type: 'Content_CTA', order: 1 },
    ]
    expect(isSidebarShellLayout(sections)).toBe(true)
    const split = splitSidebarShellSections(sections)
    expect(split.sidebar?.block_type).toBe('Nav_Sidebar')
    expect(split.main.map((s) => s.block_type)).toEqual(['Content_CTA', 'Content_Features'])
    // Re-running on a reshuffled copy yields identical geometry (mirror-safe).
    const reshuffled = [...sections].reverse()
    expect(splitSidebarShellSections(reshuffled).main.map((s) => s.block_type)).toEqual(
      split.main.map((s) => s.block_type),
    )
  })

  it('AC-003: no physical-direction CSS in src/styles (use logical properties)', () => {
    const physical = /(margin|padding|border)-(left|right)\s*:|(?:^|[;{\s])(left|right)\s*:/m
    for (const file of ['tokens.css', 'canvas.css']) {
      const css = readFileSync(resolve(__dirname, '../styles', file), 'utf8')
      expect(physical.test(css), `${file} must not use physical-direction CSS`).toBe(false)
    }
  })
})
