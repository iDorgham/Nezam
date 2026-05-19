import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import WireInspector from './WireInspector'
import {
  useCanvasGraphStore,
  type AttachmentPayload,
  type CanvasWire,
} from '@/src/store/canvas-graph.store'

// React 19's `act` warns when this flag is not set in non-test bundlers.
;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const ISO = '2026-01-01T00:00:00.000Z'

function makeWire(overrides: Partial<CanvasWire> = {}): CanvasWire {
  return {
    id:                   overrides.id ?? 'w1',
    fromNodeId:           overrides.fromNodeId ?? 'home',
    toNodeId:             overrides.toNodeId ?? 'about',
    type:                 overrides.type ?? 'navigational',
    contextPayload:       overrides.contextPayload,
    attachments:          overrides.attachments ?? [],
    annotativeDirectives: overrides.annotativeDirectives ?? [],
    cp1Offset:            overrides.cp1Offset ?? { x: 80, y: 0 },
    cp2Offset:            overrides.cp2Offset ?? { x: -80, y: 0 },
  }
}

function makeAttachment(overrides: Partial<AttachmentPayload> = {}): AttachmentPayload {
  return {
    id:           overrides.id ?? '00000000-0000-4000-8000-000000000001',
    parentId:     overrides.parentId ?? 'w1',
    parentType:   overrides.parentType ?? 'wire',
    type:         overrides.type ?? 'image',
    url:          overrides.url,
    content:      overrides.content ?? 'hero.png',
    altText:      overrides.altText,
    visionStatus: overrides.visionStatus ?? 'pending',
    role:         overrides.role ?? 'style-reference',
    createdAt:    overrides.createdAt ?? ISO,
  }
}

let container: HTMLDivElement | null = null
let root: Root | null = null

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
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

describe('WireInspector · selection gating', () => {
  it('renders nothing when no wire is selected', () => {
    render(<WireInspector />)

    expect(container!.querySelector('aside[aria-label="Wire inspector"]')).toBeNull()
  })

  it('renders nothing when selectedWireId points at a missing wire', () => {
    useCanvasGraphStore.setState({ selectedWireId: 'ghost' })

    render(<WireInspector />)

    expect(container!.querySelector('aside[aria-label="Wire inspector"]')).toBeNull()
  })

  it('renders the inspector aside with endpoint labels when a wire is selected', () => {
    useCanvasGraphStore.setState({
      wires:          [makeWire()],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const aside = container!.querySelector('aside[aria-label="Wire inspector"]')
    expect(aside).not.toBeNull()
    expect(aside!.textContent).toContain('home')
    expect(aside!.textContent).toContain('about')
  })
})

describe('WireInspector · wire type radiogroup', () => {
  beforeEach(() => {
    useCanvasGraphStore.setState({
      wires:          [makeWire({ type: 'navigational' })],
      selectedWireId: 'w1',
    })
  })

  it('marks the current wire type as aria-checked', () => {
    render(<WireInspector />)

    const buttons = container!.querySelectorAll('[role="radio"]')
    expect(buttons.length).toBe(4)

    const navButton = Array.from(buttons).find((b) => b.textContent?.includes('Navigation'))
    const dataButton = Array.from(buttons).find((b) => b.textContent?.includes('Data'))

    expect(navButton?.getAttribute('aria-checked')).toBe('true')
    expect(dataButton?.getAttribute('aria-checked')).toBe('false')
  })

  it('clicking a different wire type updates the store', () => {
    render(<WireInspector />)

    const buttons = container!.querySelectorAll('[role="radio"]')
    const authButton = Array.from(buttons).find((b) => b.textContent?.includes('Auth'))
    expect(authButton).toBeTruthy()

    act(() => {
      (authButton as HTMLButtonElement).click()
    })

    expect(useCanvasGraphStore.getState().wires[0].type).toBe('auth')
  })
})

describe('WireInspector · directives', () => {
  beforeEach(() => {
    useCanvasGraphStore.setState({
      wires:          [makeWire()],
      selectedWireId: 'w1',
    })
  })

  it('commits a typed directive on blur and clears the textarea', () => {
    render(<WireInspector />)

    const textarea = container!.querySelector<HTMLTextAreaElement>('#wire-directive-input')!
    expect(textarea).toBeTruthy()

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )!.set!
      setter.call(textarea, 'Use a soft hero gradient')
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
    })

    // React's onBlur listens via focusout (blur doesn't bubble).
    act(() => {
      textarea.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    })

    expect(useCanvasGraphStore.getState().wires[0].annotativeDirectives).toEqual([
      'Use a soft hero gradient',
    ])
    expect(textarea.value).toBe('')
  })

  it('renders existing directives and removes one when its delete button is clicked', () => {
    useCanvasGraphStore.setState({
      wires: [
        makeWire({ annotativeDirectives: ['Keep it minimal', 'Use brand teal'] }),
      ],
    })

    render(<WireInspector />)

    const removeButtons = container!.querySelectorAll('button[aria-label="Remove directive"]')
    expect(removeButtons.length).toBe(2)

    act(() => {
      (removeButtons[0] as HTMLButtonElement).click()
    })

    expect(useCanvasGraphStore.getState().wires[0].annotativeDirectives).toEqual([
      'Use brand teal',
    ])
  })
})

describe('WireInspector · Generate button gating (AC-007)', () => {
  it('is disabled when the wire has no attachments and no directives', () => {
    useCanvasGraphStore.setState({
      wires:          [makeWire()],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const generate = container!.querySelector<HTMLButtonElement>('footer button')!
    expect(generate.disabled).toBe(true)
    expect(generate.getAttribute('aria-disabled')).toBe('true')
    expect(container!.textContent).toContain('Add an attachment or directive to enable')
  })

  it('is enabled once a committed directive exists', () => {
    useCanvasGraphStore.setState({
      wires:          [makeWire({ annotativeDirectives: ['Anything'] })],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const generate = container!.querySelector<HTMLButtonElement>('footer button')!
    expect(generate.disabled).toBe(false)
  })

  it('is enabled by an in-progress directive draft, before blur', () => {
    useCanvasGraphStore.setState({
      wires:          [makeWire()],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const textarea = container!.querySelector<HTMLTextAreaElement>('#wire-directive-input')!
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value',
      )!.set!
      setter.call(textarea, 'draft only')
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
    })

    const generate = container!.querySelector<HTMLButtonElement>('footer button')!
    expect(generate.disabled).toBe(false)
  })

  it('is enabled by at least one valid attachment', () => {
    useCanvasGraphStore.setState({
      wires: [
        makeWire({
          attachments: [makeAttachment({ visionStatus: 'valid' })],
        }),
      ],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const generate = container!.querySelector<HTMLButtonElement>('footer button')!
    expect(generate.disabled).toBe(false)
  })

  it('is disabled while the generative pipeline is in a busy state', () => {
    useCanvasGraphStore.setState({
      wires:          [makeWire({ annotativeDirectives: ['ready'] })],
      selectedWireId: 'w1',
      generativeMode: 'generating',
    })

    render(<WireInspector />)

    const generate = container!.querySelector<HTMLButtonElement>('footer button')!
    expect(generate.disabled).toBe(true)
    expect(generate.textContent).toContain('Generating')
  })
})

describe('WireInspector · close', () => {
  it('clears selectedWireId when the close button is clicked', () => {
    useCanvasGraphStore.setState({
      wires:          [makeWire()],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const close = container!.querySelector<HTMLButtonElement>('button[aria-label="Close inspector"]')!
    act(() => { close.click() })

    expect(useCanvasGraphStore.getState().selectedWireId).toBeNull()
  })
})

describe('WireInspector · attachments list', () => {
  it('renders one row per attachment and shows the count', () => {
    useCanvasGraphStore.setState({
      wires: [
        makeWire({
          attachments: [
            makeAttachment({ id: '00000000-0000-4000-8000-000000000001', content: 'hero.png' }),
            makeAttachment({ id: '00000000-0000-4000-8000-000000000002', content: 'spec.md', type: 'markdown' }),
          ],
        }),
      ],
      selectedWireId: 'w1',
    })

    render(<WireInspector />)

    const items = container!.querySelectorAll('aside[aria-label="Wire inspector"] ul li')
    expect(items.length).toBeGreaterThanOrEqual(2)
    expect(container!.textContent).toContain('hero.png')
    expect(container!.textContent).toContain('spec.md')
  })
})
