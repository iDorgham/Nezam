import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import AssetCard from './AssetCard'
import type { AssetItem } from '@/src/lib/asset-schema'

// F-008 §3.3 / AC-007 — AssetCard is a pure render of an AssetItem. No store
// wiring, no fetches. Parent owns the rejection text + cancel/retry actions.

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const baseAsset: AssetItem = {
  id:           '11111111-1111-4111-8111-111111111111',
  name:         'hero.svg',
  mimeType:     'image/svg+xml',
  optimizedUrl: 'https://blob.example/assets/hero.svg',
  altText:      'company logo',
  visionStatus: 'valid',
  createdAt:    '2026-05-19T10:00:00.000Z',
}

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

describe('AssetCard · core rendering', () => {
  it('renders the asset filename', () => {
    render(<AssetCard asset={baseAsset} />)
    expect(container!.textContent).toContain('hero.svg')
  })

  it('renders a short MIME badge', () => {
    render(<AssetCard asset={baseAsset} />)
    const badge = container!.querySelector('[data-mime-badge]')!
    expect(badge).not.toBeNull()
    expect(badge.textContent).toBe('SVG')
  })

  it('renders an <img> with optimizedUrl + altText for image MIMEs', () => {
    render(<AssetCard asset={baseAsset} />)
    const img = container!.querySelector('img')!
    expect(img).not.toBeNull()
    expect(img.src).toBe('https://blob.example/assets/hero.svg')
    expect(img.alt).toBe('company logo')
  })

  it('falls back to filename for alt text when altText is empty', () => {
    render(<AssetCard asset={{ ...baseAsset, altText: '' }} />)
    const img = container!.querySelector('img')!
    expect(img.alt).toBe('hero.svg')
  })
})

describe('AssetCard · non-image MIME types', () => {
  it.each([
    ['font/woff2',       'WOFF2'],
    ['application/json', 'JSON'],
    ['text/yaml',        'YAML'],
  ] as const)('renders the %s badge as "%s" with no <img> thumbnail', (mime, label) => {
    render(<AssetCard asset={{ ...baseAsset, mimeType: mime, name: `file.${label.toLowerCase()}` }} />)
    expect(container!.querySelector('[data-mime-badge]')!.textContent).toBe(label)
    expect(container!.querySelector('img')).toBeNull()
  })
})

describe('AssetCard · visionStatus indicators', () => {
  it('renders a "Scanning…" pending indicator when visionStatus === "pending"', () => {
    render(<AssetCard asset={{ ...baseAsset, visionStatus: 'pending' }} />)
    const status = container!.querySelector('[data-vision-status="pending"]')!
    expect(status).not.toBeNull()
    expect(status.textContent).toMatch(/scanning/i)
  })

  it('renders no overlay when visionStatus === "valid"', () => {
    render(<AssetCard asset={baseAsset} />)
    expect(container!.querySelector('[data-vision-status="rejected"]')).toBeNull()
    expect(container!.querySelector('[data-vision-status="pending"]')).toBeNull()
  })

  it('renders a red rejection overlay with the supplied reason when visionStatus === "rejected"', () => {
    render(
      <AssetCard
        asset={{ ...baseAsset, visionStatus: 'rejected' }}
        rejectionReason="Text layer detected — blocked"
      />,
    )
    const overlay = container!.querySelector('[data-vision-status="rejected"]')!
    expect(overlay).not.toBeNull()
    expect(overlay.getAttribute('role')).toBe('alert')
    expect(overlay.textContent).toContain('Text layer detected — blocked')
  })

  it('falls back to a generic rejection message when no rejectionReason is supplied', () => {
    render(<AssetCard asset={{ ...baseAsset, visionStatus: 'rejected' }} />)
    const overlay = container!.querySelector('[data-vision-status="rejected"]')!
    expect(overlay.textContent).toMatch(/rejected/i)
  })
})
