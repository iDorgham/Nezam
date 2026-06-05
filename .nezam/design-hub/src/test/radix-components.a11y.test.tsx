import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe } from 'vi-axe'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Tooltip } from '@/components/ui/Tooltip'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

/** T-P4-001 — a11y for complex Radix-backed components. */

// Two axe rules are noise when testing portaled Radix content in isolation, not
// real defects in the app:
//  - `region`: portal content lands on a bare document.body with no page
//    landmark (in-app it opens over a landmarked layout).
//  - `aria-hidden-focus`: Radix's focus-guard sentinels are aria-hidden with
//    tabindex=0 by design (focus-trap), a documented axe false-positive.
const PORTAL_AXE_OPTS = {
  rules: { region: { enabled: false }, 'aria-hidden-focus': { enabled: false } },
}

describe('Dialog (T-P4-001)', () => {
  it('AC-001: open dialog with title/description has no axe violations', async () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <p className="text-sm">Body content</p>
        </DialogContent>
      </Dialog>,
    )
    expect(await axe(document.body, PORTAL_AXE_OPTS)).toHaveNoViolations()
  })
})

describe('Tabs (T-P4-001)', () => {
  it('AC-001/AC-002: tablist exposes roles and active aria-selected, no violations', async () => {
    const { container, getAllByRole, getByRole } = render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Sections">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>,
    )
    expect(getAllByRole('tab')).toHaveLength(2)
    expect(getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true')
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('DropdownMenu (T-P4-001)', () => {
  it('AC-001/AC-002: open menu trigger + items have no axe violations', async () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger aria-label="Open menu">Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(await axe(document.body, PORTAL_AXE_OPTS)).toHaveNoViolations()
  })
})

describe('Tooltip (T-P4-001)', () => {
  it('AC-001: tooltip-wrapped trigger has no axe violations', async () => {
    const { container } = render(
      <Tooltip label="Save your work" kbd="⌘S">
        <Button type="button">Save</Button>
      </Tooltip>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('Select (T-P4-001)', () => {
  it('AC-002: native select associates its label (regression guard)', async () => {
    const { container, getByLabelText } = render(
      <Select
        label="Profile"
        options={[
          { value: 'a', label: 'Minimal' },
          { value: 'b', label: 'Premium' },
        ]}
      />,
    )
    expect(getByLabelText('Profile')).toBeTruthy()
    expect(await axe(container)).toHaveNoViolations()
  })
})
