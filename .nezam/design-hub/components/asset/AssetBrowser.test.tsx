import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AssetBrowser from './AssetBrowser'
import { useAssetStore } from '@/src/store/asset.store'
import type { AssetItem } from '@/src/lib/asset-schema'

// F-008 §3.3 — AssetBrowser orchestrates the asset store + DropZone + asset
// grid + upload-progress rows. The default uploader posts to
// /api/assets/upload; tests inject a deterministic mock instead.

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const sample = (overrides: Partial<AssetItem> = {}): AssetItem => ({
  id:           '11111111-1111-4111-8111-111111111111',
  name:         'a.svg',
  mimeType:     'image/svg+xml',
  optimizedUrl: 'https://blob.example/a.svg',
  altText:      '',
  visionStatus: 'valid',
  createdAt:    '2026-05-19T10:00:00.000Z',
  ...overrides,
})

let container: HTMLDivElement | null = null
let root: Root | null = null

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => { root!.render(ui) })
}

function fireDrop(target: Element, files: File[]) {
  const event = new Event('drop', { bubbles: true, cancelable: true })
  ;(event as unknown as { dataTransfer: unknown }).dataTransfer = {
    files,
    items: files.map((f) => ({ kind: 'file', type: f.type, getAsFile: () => f })),
    types: ['Files'],
  }
  act(() => { target.dispatchEvent(event) })
}

beforeEach(() => {
  useAssetStore.setState({ assets: [], uploads: [] })
})

afterEach(() => {
  if (root) {
    act(() => { root!.unmount() })
    root = null
  }
  container?.remove()
  container = null
})

describe('AssetBrowser · empty state', () => {
  it('renders the DropZone with the supported-extension list', () => {
    render(<AssetBrowser />)
    expect(container!.querySelector('[data-dropzone]')).not.toBeNull()
    const accepts = container!.querySelector('[data-accepts]')!
    expect(accepts.textContent).toContain('.svg')
    expect(accepts.textContent).toContain('.png')
  })

  it('renders no asset cards and no upload rows', () => {
    render(<AssetBrowser />)
    expect(container!.querySelectorAll('[data-asset-card]').length).toBe(0)
    expect(container!.querySelectorAll('[role="progressbar"]').length).toBe(0)
  })
})

describe('AssetBrowser · populated state', () => {
  it('renders one AssetCard per asset in the store', () => {
    useAssetStore.setState({
      assets: [
        sample({ id: 'aaaa', name: 'a.svg' }),
        sample({ id: 'bbbb', name: 'b.png', mimeType: 'image/png' }),
      ],
      uploads: [],
    })
    render(<AssetBrowser />)
    expect(container!.querySelectorAll('[data-asset-card]').length).toBe(2)
    expect(container!.textContent).toContain('a.svg')
    expect(container!.textContent).toContain('b.png')
  })

  it('renders one UploadProgress row per in-flight upload', () => {
    useAssetStore.setState({
      assets: [],
      uploads: [
        { name: 'hero.png', percent: 30 },
        { name: 'logo.webp', percent: 70 },
      ],
    })
    render(<AssetBrowser />)
    expect(container!.querySelectorAll('[role="progressbar"]').length).toBe(2)
    expect(container!.textContent).toContain('hero.png')
    expect(container!.textContent).toContain('logo.webp')
  })
})

describe('AssetBrowser · upload flow', () => {
  it('calls the injected uploader for each dropped file', async () => {
    const uploader = vi.fn().mockResolvedValue(sample())
    render(<AssetBrowser uploader={uploader} />)
    const zone = container!.querySelector('[data-dropzone]')!
    const file = new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })
    fireDrop(zone, [file])
    await act(async () => { await Promise.resolve() })
    expect(uploader).toHaveBeenCalledOnce()
    expect((uploader.mock.calls[0][0] as File).name).toBe('a.svg')
  })

  it('adds the resolved asset to the store and clears the upload row', async () => {
    const asset = sample({ id: 'fresh', name: 'a.svg' })
    const uploader = vi.fn().mockResolvedValue(asset)
    render(<AssetBrowser uploader={uploader} />)
    const zone = container!.querySelector('[data-dropzone]')!
    fireDrop(zone, [new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })])
    await act(async () => { await Promise.resolve() })
    await act(async () => { await Promise.resolve() }) // flush microtasks for the finally block
    expect(useAssetStore.getState().assets.map((a) => a.id)).toEqual(['fresh'])
    expect(useAssetStore.getState().uploads).toEqual([])
  })

  it('clears the upload row when the uploader rejects', async () => {
    const uploader = vi.fn().mockRejectedValue(new Error('boom'))
    render(<AssetBrowser uploader={uploader} />)
    const zone = container!.querySelector('[data-dropzone]')!
    fireDrop(zone, [new File(['<svg/>'], 'a.svg', { type: 'image/svg+xml' })])
    await act(async () => { await Promise.resolve() })
    await act(async () => { await Promise.resolve() })
    expect(useAssetStore.getState().assets).toEqual([])
    expect(useAssetStore.getState().uploads).toEqual([])
  })
})
