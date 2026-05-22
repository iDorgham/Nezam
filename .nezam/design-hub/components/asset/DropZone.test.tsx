import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DropZone from './DropZone'

// F-008 §3.3 / AC-005 / AC-006 — DropZone is the drag-target surface.
// Renders an accepts list, toggles a drag-over visual, and emits onFiles on
// drop. The component never reads files synchronously off disk — that is the
// parent's job. Click-to-picker is also wired since the empty state needs
// a keyboard-and-pointer accessible affordance.

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

// Dispatch a drag/drop event with a synthetic dataTransfer. happy-dom's
// DragEvent does not expose a constructable dataTransfer, so we attach it
// directly to the event object — React reads it from nativeEvent.
function fireDrag(target: Element, type: 'dragover' | 'dragleave' | 'drop', files: File[] = []) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  ;(event as unknown as { dataTransfer: unknown }).dataTransfer = {
    files,
    items: files.map((f) => ({ kind: 'file', type: f.type, getAsFile: () => f })),
    types: files.length > 0 ? ['Files'] : [],
  }
  act(() => { target.dispatchEvent(event) })
}

describe('DropZone · rendering', () => {
  it('renders the empty-state copy', () => {
    render(<DropZone onFiles={() => {}} accepts={['.svg', '.png']} />)
    expect(container!.textContent).toMatch(/drop/i)
  })

  it('renders the accepts extension list', () => {
    render(<DropZone onFiles={() => {}} accepts={['.svg', '.png', '.json']} />)
    const list = container!.querySelector('[data-accepts]')!
    expect(list).not.toBeNull()
    expect(list.textContent).toContain('.svg')
    expect(list.textContent).toContain('.png')
    expect(list.textContent).toContain('.json')
  })

  it('exposes role="button" and an accessible label for keyboard / SR users', () => {
    render(<DropZone onFiles={() => {}} accepts={['.svg']} />)
    const zone = container!.querySelector('[data-dropzone]')!
    expect(zone.getAttribute('role')).toBe('button')
    expect(zone.getAttribute('aria-label')).toBeTruthy()
  })
})

describe('DropZone · drag visual state', () => {
  it('sets data-drag-over="true" on dragover', () => {
    render(<DropZone onFiles={() => {}} accepts={['.svg']} />)
    const zone = container!.querySelector('[data-dropzone]')!
    fireDrag(zone, 'dragover')
    expect(zone.getAttribute('data-drag-over')).toBe('true')
  })

  it('clears data-drag-over on dragleave', () => {
    render(<DropZone onFiles={() => {}} accepts={['.svg']} />)
    const zone = container!.querySelector('[data-dropzone]')!
    fireDrag(zone, 'dragover')
    fireDrag(zone, 'dragleave')
    expect(zone.getAttribute('data-drag-over')).toBe('false')
  })
})

describe('DropZone · drop event', () => {
  it('fires onFiles with the dropped files', () => {
    const onFiles = vi.fn()
    render(<DropZone onFiles={onFiles} accepts={['.svg']} />)
    const zone = container!.querySelector('[data-dropzone]')!
    const file = new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })
    fireDrag(zone, 'drop', [file])
    expect(onFiles).toHaveBeenCalledOnce()
    const arg = onFiles.mock.calls[0][0] as File[]
    expect(arg).toHaveLength(1)
    expect(arg[0].name).toBe('a.svg')
  })

  it('does not call onFiles when the drop has no files', () => {
    const onFiles = vi.fn()
    render(<DropZone onFiles={onFiles} accepts={['.svg']} />)
    const zone = container!.querySelector('[data-dropzone]')!
    fireDrag(zone, 'drop', [])
    expect(onFiles).not.toHaveBeenCalled()
  })

  it('resets the drag-over visual after drop', () => {
    render(<DropZone onFiles={() => {}} accepts={['.svg']} />)
    const zone = container!.querySelector('[data-dropzone]')!
    fireDrag(zone, 'dragover')
    fireDrag(zone, 'drop', [new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })])
    expect(zone.getAttribute('data-drag-over')).toBe('false')
  })
})
