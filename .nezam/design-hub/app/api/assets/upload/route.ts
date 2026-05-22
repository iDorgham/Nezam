import { randomUUID } from 'node:crypto'
import { NextResponse, after } from 'next/server'
import { containsTextElement } from '@/src/lib/svg-sanitizer'
import { storeAsset } from '@/src/lib/asset-storage'
import { optimizeImage, type RasterMime } from '@/src/lib/asset-optimizer'
import { triggerVisionGate } from '@/src/lib/vision-gate'
import {
  ASSET_MIME_TYPES,
  AssetMimeType,
  NON_IMAGE_MIME_TYPES,
  type AssetItem,
} from '@/src/lib/asset-schema'

const RASTER_MIME_TYPES: ReadonlySet<RasterMime> = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
])
const isRaster = (m: AssetMimeType): m is RasterMime =>
  RASTER_MIME_TYPES.has(m as RasterMime)

// F-008 §8 (ARCHITECTURE.md) — POST /api/assets/upload
// Pipeline: multipart parse → MIME allowlist → SVG hardlock (<text> scan)
// → store on Vercel Blob (via storeAsset seam) → return AssetItem envelope.
// Vision Gate hand-off is deferred to T-F008-008; this route just marks
// image-MIME assets with `visionStatus: 'pending'` so the consumer can
// trigger the async scan post-upload.

interface ErrorBody {
  error:    string
  code:     string
  details?: Record<string, unknown>
}

const err = (status: number, body: ErrorBody) =>
  NextResponse.json(body, { status })

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return err(400, { error: 'Missing file in upload', code: 'missing-file' })
  }

  const mimeParse = AssetMimeType.safeParse(file.type)
  if (!mimeParse.success) {
    return err(422, {
      error:   'Unsupported MIME type',
      code:    'unsupported-mime-type',
      details: { received: file.type, allowed: ASSET_MIME_TYPES },
    })
  }
  const incomingMime = mimeParse.data
  const incomingBytes = new Uint8Array(await file.arrayBuffer())

  if (incomingMime === 'image/svg+xml') {
    const svgText = new TextDecoder().decode(incomingBytes)
    if (containsTextElement(svgText)) {
      return err(422, {
        error: 'Text layer detected — blocked by zero-text policy',
        code:  'text-element',
      })
    }
  }

  // Raster images are funneled through the optimizer (PNG/JPEG → WebP@85;
  // WebP passes through). The served MIME / altText reflect the optimizer
  // output, not the upload.
  const optimized = isRaster(incomingMime)
    ? await optimizeImage({ bytes: incomingBytes, mimeType: incomingMime, name: file.name })
    : { bytes: incomingBytes, mimeType: incomingMime, altText: '' }

  const stored = await storeAsset({
    name:     file.name,
    mimeType: optimized.mimeType,
    bytes:    optimized.bytes,
  })

  const asset: AssetItem = {
    id:           randomUUID(),
    name:         file.name,
    mimeType:     optimized.mimeType,
    optimizedUrl: stored.url,
    altText:      optimized.altText,
    visionStatus: NON_IMAGE_MIME_TYPES.has(optimized.mimeType) ? 'valid' : 'pending',
    createdAt:    new Date().toISOString(),
  }

  // F-008 AC-004 / T-F008-008 — fire the Vision Gate post-response for any
  // image asset that survived ingest. `after()` keeps the function alive past
  // the JSON reply so the model call doesn't add latency to the upload.
  if (optimized.mimeType.startsWith('image/')) {
    after(() => triggerVisionGate({
      assetId:  asset.id,
      bytes:    optimized.bytes,
      mimeType: optimized.mimeType,
    }))
  }

  return NextResponse.json({ asset }, { status: 201 })
}
