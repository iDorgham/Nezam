import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PropertyInspector from './PropertyInspector'
import {
  useCanvasGraphStore,
  type CanvasNode,
} from '@/src/store/canvas-graph.store'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

function makeNode(overrides: Partial<CanvasNode> = {}): CanvasNode {
  return {
    id:               overrides.id ?? 'n1',
    type:             overrides.type ?? 'page',
    title:            overrides.title ?? 'Home',
    route:            overrides.route,
    x:                overrides.x ?? 0,
    y:                overrides.y ?? 0,
    width:            overrides.width ?? 180,
    height:           overrides.height ?? 80,
    rtlCompliant:     overrides.rtlCompliant ?? false,
    wcagCompliant:    overrides.wcagCompliant ?? false,
    hardlockFailures: overrides.hardlockFailures ?? [],
    locked:           overrides.locked ?? false,
    attachments:      overrides.attachments ?? [],
    generationStatus: overrides.generationStatus ?? 'idle',
    style:            overrides.style ?? {},
  }
}

let container: HTMLDivElement | null = null
let root: Root | null = null

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => { root!.render(ui) })
}

beforeEach(() => {
  useCanvasGraphStore.persist.clearStorage()
  useCanvasGraphStore.setState({
    nodes:           [],
    wires:           [],
    viewport:        { x: 0, y: 0, scale: 1 },
    selectedNodeIds: [],
    selectedWireId:  null,
    generativeMode:  'idle',
    rtlMode:         false,
  })
})

afterEach(() => {
  if (root) {
    act(() => { root!.unmount() })
    root = null
  }
  container?.remove()
  container = null
})

function tabs(): HTMLButtonElement[] {
  return Array.from(container!.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
}

describe('PropertyInspector · empty state (AC-005)', () => {
  it('shows "Select a component to inspect" when no node is selected', () => {
    render(<PropertyInspector />)

    expect(container!.querySelector('[role="status"]')?.textContent).toMatch(
      /Select a component to inspect/,
    )
  })
})

describe('PropertyInspector · single selection', () => {
  beforeEach(() => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode({ id: 'n1', title: 'Dashboard' })],
      selectedNodeIds: ['n1'],
    })
  })

  it('renders the selected node title in the header', () => {
    render(<PropertyInspector />)

    expect(container!.querySelector('header')?.textContent).toContain('Dashboard')
  })

  it('renders the CSS tab body with BoxModelFields and TypographyFields by default', () => {
    render(<PropertyInspector />)

    // BoxModelFields is the one rendering logical-property inputs.
    expect(container!.querySelector('input[aria-label="margin-inline-start"]')).not.toBeNull()
    // TypographyFields owns font-family / line-height.
    expect(container!.querySelector('[aria-label="font-family"]')).not.toBeNull()
    expect(container!.querySelector('[aria-label="line-height"]')).not.toBeNull()
  })

  it('renders all 4 tabs (Layers / Settings / CSS / A11y)', () => {
    render(<PropertyInspector />)

    const labels = tabs().map((b) => b.textContent?.trim())
    expect(labels).toEqual(['Layers', 'Settings', 'CSS', 'A11y'])
  })

  it('marks exactly one tab as aria-selected at a time (roving tabindex)', () => {
    render(<PropertyInspector />)

    const selected = tabs().filter((b) => b.getAttribute('aria-selected') === 'true')
    expect(selected).toHaveLength(1)
    expect(selected[0].textContent?.trim()).toBe('CSS')

    // Non-selected tabs have tabIndex -1 so they're skipped in Tab navigation.
    const nonSelected = tabs().filter((b) => b.getAttribute('aria-selected') !== 'true')
    for (const tab of nonSelected) expect(tab.tabIndex).toBe(-1)
  })
})

describe('PropertyInspector · keyboard navigation across tabs', () => {
  beforeEach(() => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode()],
      selectedNodeIds: ['n1'],
    })
  })

  function pressKey(key: string) {
    const tablist = container!.querySelector<HTMLDivElement>('[role="tablist"]')!
    act(() => {
      tablist.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    })
  }

  it('moves selection right with ArrowRight, wrapping from the end', () => {
    render(<PropertyInspector />)

    // CSS (index 2) → A11y (index 3)
    pressKey('ArrowRight')
    expect(tabs()[3].getAttribute('aria-selected')).toBe('true')

    // A11y (3) wraps to Layers (0)
    pressKey('ArrowRight')
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')
  })

  it('moves selection left with ArrowLeft, wrapping from the start', () => {
    render(<PropertyInspector />)

    // CSS (2) → Settings (1)
    pressKey('ArrowLeft')
    expect(tabs()[1].getAttribute('aria-selected')).toBe('true')

    // Settings (1) → Layers (0)
    pressKey('ArrowLeft')
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')

    // Layers (0) wraps to A11y (3)
    pressKey('ArrowLeft')
    expect(tabs()[3].getAttribute('aria-selected')).toBe('true')
  })

  it('jumps to the first tab with Home and the last with End', () => {
    render(<PropertyInspector />)

    pressKey('Home')
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true')

    pressKey('End')
    expect(tabs()[3].getAttribute('aria-selected')).toBe('true')
  })
})

describe('PropertyInspector · multi-select shared/mixed (T-F007-009)', () => {
  it('shows "(multiple selected)" header and keeps inputs enabled', () => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode({ id: 'n1' }), makeNode({ id: 'n2', title: 'Profile' })],
      selectedNodeIds: ['n1', 'n2'],
    })

    render(<PropertyInspector />)

    expect(container!.querySelector('header')?.textContent).toMatch(/multiple selected/)
    const margin = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(margin.disabled).toBe(false)
  })

  it('renders shared values directly and marks differing fields as (mixed)', () => {
    useCanvasGraphStore.setState({
      nodes: [
        makeNode({ id: 'n1', style: { marginInlineStart: 12, paddingBlockEnd: 24 } }),
        makeNode({ id: 'n2', style: { marginInlineStart: 12, paddingBlockEnd: 8  } }),
      ],
      selectedNodeIds: ['n1', 'n2'],
    })

    render(<PropertyInspector />)

    // Shared field — both 12 — should display 12.
    const shared = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(shared.value).toBe('12')
    expect(shared.dataset.mixed).toBeUndefined()

    // Differing field — 24 vs 8 — should be empty with "(mixed)" placeholder.
    const mixed = container!.querySelector<HTMLInputElement>('input[aria-label="padding-block-end"]')!
    expect(mixed.value).toBe('')
    expect(mixed.placeholder).toBe('(mixed)')
    expect(mixed.dataset.mixed).toBe('true')
  })

  it('propagates a single edit to every selected node, collapsing the mixed field', () => {
    useCanvasGraphStore.setState({
      nodes: [
        makeNode({ id: 'n1', style: { marginInlineStart: 4  } }),
        makeNode({ id: 'n2', style: { marginInlineStart: 16 } }),
      ],
      selectedNodeIds: ['n1', 'n2'],
    })

    render(<PropertyInspector />)

    const margin = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(margin.dataset.mixed).toBe('true')

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(margin, '20')
      margin.dispatchEvent(new Event('input', { bubbles: true }))
    })

    const ns = useCanvasGraphStore.getState().nodes
    expect(ns[0].style.marginInlineStart).toBe(20)
    expect(ns[1].style.marginInlineStart).toBe(20)
  })
})

describe('PropertyInspector · RTL label annotation (AC-006 / T-F007-010)', () => {
  it('annotates margin-inline-start with "(left)" in LTR mode', () => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode()],
      selectedNodeIds: ['n1'],
      rtlMode:         false,
    })

    render(<PropertyInspector />)

    const startInput = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(startInput.dataset.sideHint).toBe('left')

    const endInput = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-end"]')!
    expect(endInput.dataset.sideHint).toBe('right')
  })

  it('annotates margin-inline-start with "(right)" in RTL mode', () => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode()],
      selectedNodeIds: ['n1'],
      rtlMode:         true,
    })

    render(<PropertyInspector />)

    const startInput = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    expect(startInput.dataset.sideHint).toBe('right')

    const endInput = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-end"]')!
    expect(endInput.dataset.sideHint).toBe('left')
  })

  it('keeps block-start/end labels stable regardless of rtlMode (top/bottom)', () => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode()],
      selectedNodeIds: ['n1'],
      rtlMode:         true,
    })

    render(<PropertyInspector />)

    const top    = container!.querySelector<HTMLInputElement>('input[aria-label="margin-block-start"]')!
    const bottom = container!.querySelector<HTMLInputElement>('input[aria-label="margin-block-end"]')!
    expect(top.dataset.sideHint).toBe('top')
    expect(bottom.dataset.sideHint).toBe('bottom')
  })
})

describe('PropertyInspector · live preview store-binding (AC-002 / T-F007-008)', () => {
  beforeEach(() => {
    useCanvasGraphStore.setState({
      nodes:           [makeNode({ id: 'n1', title: 'Home' })],
      selectedNodeIds: ['n1'],
    })
  })

  it('reads existing node.style values into the BoxModelFields inputs', () => {
    useCanvasGraphStore.setState({
      nodes: [
        makeNode({
          id:    'n1',
          title: 'Home',
          style: { marginInlineStart: 24, paddingBlockEnd: 32 },
        }),
      ],
      selectedNodeIds: ['n1'],
    })

    render(<PropertyInspector />)

    const margin = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    const padding = container!.querySelector<HTMLInputElement>('input[aria-label="padding-block-end"]')!
    expect(margin.value).toBe('24')
    expect(padding.value).toBe('32')
  })

  it('pushes BoxModel edits through updateNode → live node.style', () => {
    render(<PropertyInspector />)

    const margin = container!.querySelector<HTMLInputElement>('input[aria-label="margin-inline-start"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(margin, '20')
      margin.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(useCanvasGraphStore.getState().nodes[0].style.marginInlineStart).toBe(20)
  })

  it('pushes Typography edits through updateNode → live node.style', () => {
    render(<PropertyInspector />)

    const leading = container!.querySelector<HTMLInputElement>('input[aria-label="line-height"]')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!
      setter.call(leading, '1.8')
      leading.dispatchEvent(new Event('input', { bubbles: true }))
    })

    expect(useCanvasGraphStore.getState().nodes[0].style.lineHeight).toBe(1.8)
  })
})
