import { describe, expect, it } from 'vitest'
import { isSidebarShellLayout, splitSidebarShellSections } from '@/lib/wireframe/sidebar-shell-layout'

describe('sidebar-shell-layout', () => {
  it('detects Nav_Sidebar first with additional blocks', () => {
    const sections = [
      { block_type: 'Nav_Sidebar', order: 0 },
      { block_type: 'Content_Stats', order: 1 },
    ]
    expect(isSidebarShellLayout(sections)).toBe(true)
    const split = splitSidebarShellSections(sections)
    expect(split.sidebar?.block_type).toBe('Nav_Sidebar')
    expect(split.main).toHaveLength(1)
  })

  it('returns false for sidebar-only or non-sidebar first', () => {
    expect(isSidebarShellLayout([{ block_type: 'Nav_Sidebar', order: 0 }])).toBe(false)
    expect(
      isSidebarShellLayout([
        { block_type: 'Nav_TopBar', order: 0 },
        { block_type: 'Hero_Centered', order: 1 },
      ]),
    ).toBe(false)
  })
})
