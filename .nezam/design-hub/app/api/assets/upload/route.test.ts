import { describe, expect, it, vi, beforeEach } from 'vitest'

// F-008 §8 (ARCHITECTURE.md) — POST /api/assets/upload route handler.
// Storage is mocked at the seam so tests never hit Vercel Blob; the route
// orchestrates MIME allowlist, SVG hardlock (containsTextElement), and the
// AssetItem response envelope.

vi.mock('@/src/lib/asset-storage', () => ({
  storeAsset: vi.fn().mockResolvedValue({
    url:      'https://blob.example/assets/test.bin',
    pathname: 'assets/test.bin',
  }),
}))

// Optimizer is mocked so route tests don't need real raster bytes.
vi.mock('@/src/lib/asset-optimizer', () => ({
  optimizeImage: vi.fn().mockImplementation(async ({ name }) => ({
    bytes:    new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]),
    mimeType: 'image/webp' as const,
    altText:  (name ?? '').replace(/\.[^.]+$/, ''),
  })),
}))

vi.mock('@/src/lib/vision-gate', () => ({
  triggerVisionGate: vi.fn().mockResolvedValue({ status: 'valid' }),
}))

// `after()` is mocked to run its callback synchronously so route tests can
// assert side effects without juggling response commit timing. Production
// behavior (post-response execution) is preserved at runtime.
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return {
    ...actual,
    after: vi.fn((fn: () => unknown | Promise<unknown>) => {
      void Promise.resolve(fn())
    }),
  }
})

import { POST } from './route'

const makeRequest = (body?: FormData) =>
  new Request('http://localhost/api/assets/upload', {
    method: 'POST',
    body,
  })

describe('POST /api/assets/upload · request validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects a request with no file field (400 missing-file)', async () => {
    const fd = new FormData()
    fd.append('caption', 'no file attached')
    const res = await POST(makeRequest(fd))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('missing-file')
    expect(body.error).toMatch(/file/i)
  })

  it('rejects an unsupported MIME type (422 unsupported-mime-type)', async () => {
    const fd = new FormData()
    fd.append(
      'file',
      new File(['MZ\x90\x00\x03'], 'evil.exe', {
        type: 'application/octet-stream',
      }),
    )
    const res = await POST(makeRequest(fd))
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.code).toBe('unsupported-mime-type')
    expect(body.details).toMatchObject({ received: 'application/octet-stream' })
  })
})

describe('POST /api/assets/upload · SVG hardlock', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects SVG containing a <text> element (422 text-element)', async () => {
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg><g><text>secret</text></g></svg>'], 'hi.svg', {
        type: 'image/svg+xml',
      }),
    )
    const res = await POST(makeRequest(fd))
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.code).toBe('text-element')
  })

  it('does not call storage when the SVG is rejected', async () => {
    const { storeAsset } = await import('@/src/lib/asset-storage')
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg><text/></svg>'], 'h.svg', { type: 'image/svg+xml' }),
    )
    await POST(makeRequest(fd))
    expect(storeAsset).not.toHaveBeenCalled()
  })
})

describe('POST /api/assets/upload · happy path', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('accepts a clean SVG and returns a 201 AssetItem', async () => {
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg><circle cx="50" cy="50" r="40"/></svg>'], 'circle.svg', {
        type: 'image/svg+xml',
      }),
    )
    const res = await POST(makeRequest(fd))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.asset).toMatchObject({
      name:         'circle.svg',
      mimeType:     'image/svg+xml',
      optimizedUrl: 'https://blob.example/assets/test.bin',
      visionStatus: 'pending',
    })
    expect(body.asset.id).toMatch(/^[0-9a-f-]{36}$/i)
    expect(body.asset.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('accepts a PNG, converts to WebP via the optimizer, marks visionStatus pending', async () => {
    const { optimizeImage } = await import('@/src/lib/asset-optimizer')
    const fd = new FormData()
    fd.append(
      'file',
      new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'logo.png', {
        type: 'image/png',
      }),
    )
    const res = await POST(makeRequest(fd))
    expect(res.status).toBe(201)
    const body = await res.json()
    // Optimizer ran → reported MIME is the served format (WebP).
    expect(body.asset.mimeType).toBe('image/webp')
    expect(body.asset.visionStatus).toBe('pending')
    // altText was hydrated from filename stem by the optimizer fixture.
    expect(body.asset.altText).toBe('logo')
    expect(optimizeImage).toHaveBeenCalledOnce()
  })

  it('does not call the optimizer for SVG (sanitizer is enough)', async () => {
    const { optimizeImage } = await import('@/src/lib/asset-optimizer')
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg/>'], 'icon.svg', { type: 'image/svg+xml' }),
    )
    await POST(makeRequest(fd))
    expect(optimizeImage).not.toHaveBeenCalled()
  })

  it('does not call the optimizer for non-image MIME types (WOFF2)', async () => {
    const { optimizeImage } = await import('@/src/lib/asset-optimizer')
    const fd = new FormData()
    fd.append(
      'file',
      new File([new Uint8Array([0x77, 0x4f, 0x46, 0x32])], 'x.woff2', {
        type: 'font/woff2',
      }),
    )
    await POST(makeRequest(fd))
    expect(optimizeImage).not.toHaveBeenCalled()
  })

  it('accepts a WOFF2 font and marks visionStatus valid (skips Vision Gate)', async () => {
    const fd = new FormData()
    fd.append(
      'file',
      new File([new Uint8Array([0x77, 0x4f, 0x46, 0x32])], 'IBMPlexArabic.woff2', {
        type: 'font/woff2',
      }),
    )
    const res = await POST(makeRequest(fd))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.asset.mimeType).toBe('font/woff2')
    expect(body.asset.visionStatus).toBe('valid')
  })

  it('calls storeAsset with the file bytes and parsed MIME type', async () => {
    const { storeAsset } = await import('@/src/lib/asset-storage')
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg/>'], 'empty.svg', { type: 'image/svg+xml' }),
    )
    await POST(makeRequest(fd))
    expect(storeAsset).toHaveBeenCalledOnce()
    const args = vi.mocked(storeAsset).mock.calls[0][0]
    expect(args.name).toBe('empty.svg')
    expect(args.mimeType).toBe('image/svg+xml')
    expect(args.bytes).toBeInstanceOf(Uint8Array)
  })
})

describe('POST /api/assets/upload · Vision Gate async trigger (T-F008-008)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('queues triggerVisionGate via after() for a clean SVG upload', async () => {
    const { after } = await import('next/server')
    const { triggerVisionGate } = await import('@/src/lib/vision-gate')
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg><circle/></svg>'], 'icon.svg', { type: 'image/svg+xml' }),
    )
    await POST(makeRequest(fd))
    expect(after).toHaveBeenCalledOnce()
    // The mocked `after` invokes the callback, which awaits triggerVisionGate.
    await new Promise((r) => setTimeout(r, 0))
    expect(triggerVisionGate).toHaveBeenCalledOnce()
    const arg = vi.mocked(triggerVisionGate).mock.calls[0][0]
    expect(arg.mimeType).toBe('image/svg+xml')
    expect(arg.assetId).toMatch(/^[0-9a-f-]{36}$/i)
    expect(arg.bytes).toBeInstanceOf(Uint8Array)
  })

  it('queues triggerVisionGate via after() for a PNG (post-optimization WebP)', async () => {
    const { after } = await import('next/server')
    const { triggerVisionGate } = await import('@/src/lib/vision-gate')
    const fd = new FormData()
    fd.append(
      'file',
      new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'logo.png', {
        type: 'image/png',
      }),
    )
    await POST(makeRequest(fd))
    expect(after).toHaveBeenCalledOnce()
    await new Promise((r) => setTimeout(r, 0))
    expect(triggerVisionGate).toHaveBeenCalledOnce()
    // The Vision Gate sees the optimized payload, not the original PNG.
    expect(vi.mocked(triggerVisionGate).mock.calls[0][0].mimeType).toBe('image/webp')
  })

  it('does NOT call after() for non-image MIME types (WOFF2)', async () => {
    const { after } = await import('next/server')
    const { triggerVisionGate } = await import('@/src/lib/vision-gate')
    const fd = new FormData()
    fd.append(
      'file',
      new File([new Uint8Array([0x77, 0x4f, 0x46, 0x32])], 'x.woff2', {
        type: 'font/woff2',
      }),
    )
    await POST(makeRequest(fd))
    expect(after).not.toHaveBeenCalled()
    expect(triggerVisionGate).not.toHaveBeenCalled()
  })

  it('does NOT call after() for application/json', async () => {
    const { after } = await import('next/server')
    const fd = new FormData()
    fd.append(
      'file',
      new File(['{}'], 'config.json', { type: 'application/json' }),
    )
    await POST(makeRequest(fd))
    expect(after).not.toHaveBeenCalled()
  })

  it('does NOT call after() when SVG is rejected by the text hardlock', async () => {
    const { after } = await import('next/server')
    const { triggerVisionGate } = await import('@/src/lib/vision-gate')
    const fd = new FormData()
    fd.append(
      'file',
      new File(['<svg><text/></svg>'], 'bad.svg', { type: 'image/svg+xml' }),
    )
    await POST(makeRequest(fd))
    expect(after).not.toHaveBeenCalled()
    expect(triggerVisionGate).not.toHaveBeenCalled()
  })
})
