import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { optimizeImage, type OptimizerInput } from './asset-optimizer'

// F-008 §3 / AC-003 — Raster optimizer. PNG / JPEG / WebP go through sharp
// and emerge as quality-85 WebP. The caller chooses which MIME types to
// route through here; SVG / WOFF2 / JSON / YAML are not the optimizer's
// problem.

const WEBP_QUALITY_TARGET = 85 // sharp default we lock down for repeatability

async function makeTestPng(): Promise<Uint8Array> {
  const buf = await sharp({
    create: {
      width:      4,
      height:     4,
      channels:   4,
      background: { r: 200, g: 100, b: 50, alpha: 1 },
    },
  })
    .png()
    .toBuffer()
  return new Uint8Array(buf)
}

async function makeTestJpeg(): Promise<Uint8Array> {
  const buf = await sharp({
    create: {
      width:      4,
      height:     4,
      channels:   3,
      background: { r: 10, g: 200, b: 80 },
    },
  })
    .jpeg()
    .toBuffer()
  return new Uint8Array(buf)
}

async function makeTestWebp(): Promise<Uint8Array> {
  const buf = await sharp({
    create: {
      width:      4,
      height:     4,
      channels:   3,
      background: { r: 30, g: 30, b: 200 },
    },
  })
    .webp({ quality: WEBP_QUALITY_TARGET })
    .toBuffer()
  return new Uint8Array(buf)
}

function isWebpBuffer(bytes: Uint8Array): boolean {
  // RIFF....WEBP — bytes 0..3 are 'RIFF', bytes 8..11 are 'WEBP'.
  if (bytes.length < 12) return false
  const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
  const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
  return riff === 'RIFF' && webp === 'WEBP'
}

describe('optimizeImage · PNG → WebP', () => {
  it('converts PNG bytes to WebP', async () => {
    const png = await makeTestPng()
    const out = await optimizeImage({ bytes: png, mimeType: 'image/png' })
    expect(out.mimeType).toBe('image/webp')
    expect(isWebpBuffer(out.bytes)).toBe(true)
  })
})

describe('optimizeImage · JPEG → WebP', () => {
  it('converts JPEG bytes to WebP', async () => {
    const jpg = await makeTestJpeg()
    const out = await optimizeImage({ bytes: jpg, mimeType: 'image/jpeg' })
    expect(out.mimeType).toBe('image/webp')
    expect(isWebpBuffer(out.bytes)).toBe(true)
  })
})

describe('optimizeImage · WebP passthrough', () => {
  it('returns the input untouched when the source is already WebP', async () => {
    const webp = await makeTestWebp()
    const out = await optimizeImage({ bytes: webp, mimeType: 'image/webp' })
    expect(out.mimeType).toBe('image/webp')
    // Identity passthrough: the SAME byte sequence comes back, no re-encode.
    expect(out.bytes).toEqual(webp)
  })
})

describe('optimizeImage · altText hint', () => {
  it('exposes a filename-derived altText hint when name is supplied', async () => {
    const png = await makeTestPng()
    const out = await optimizeImage({
      bytes:    png,
      mimeType: 'image/png',
      name:     'hero-banner.png',
    })
    expect(out.altText).toBe('hero-banner')
  })

  it('returns empty altText when no name is supplied', async () => {
    const png = await makeTestPng()
    const out = await optimizeImage({ bytes: png, mimeType: 'image/png' })
    expect(out.altText).toBe('')
  })
})

describe('optimizeImage · rejects unsupported MIME types', () => {
  it('throws when given a non-raster MIME type', async () => {
    await expect(
      optimizeImage({
        bytes:    new Uint8Array([0]),
        // @ts-expect-error — runtime guard: SVG is not the optimizer's concern.
        mimeType: 'image/svg+xml' satisfies OptimizerInput['mimeType'],
      }),
    ).rejects.toThrow(/raster|unsupported/i)
  })
})
