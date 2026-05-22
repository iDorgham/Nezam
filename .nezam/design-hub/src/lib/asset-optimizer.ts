import sharp from 'sharp'

// F-008 §3 / AC-003 — Raster optimizer. PNG / JPEG ⇒ WebP @ q85; WebP passes
// through untouched. Callers are expected to filter by MIME before calling;
// the runtime guard exists to make a programmer error loud rather than
// silently misbehave with an SVG byte stream.

export type RasterMime = 'image/png' | 'image/jpeg' | 'image/webp'

export interface OptimizerInput {
  bytes:    Uint8Array
  mimeType: RasterMime
  /** Source filename, used to derive a fallback alt-text. */
  name?:    string
}

export interface OptimizerOutput {
  bytes:    Uint8Array
  mimeType: 'image/webp'
  altText:  string
}

const WEBP_QUALITY = 85

// Drop the trailing extension and any path segment so a user-supplied name
// like "uploads/Hero Banner.png" becomes "Hero Banner". Empty / unparseable
// names fall back to ''.
function altTextFromName(name: string | undefined): string {
  if (!name) return ''
  const base = name.split(/[\\/]/).pop() ?? ''
  const stem = base.replace(/\.[^.]+$/, '')
  return stem.trim()
}

export async function optimizeImage(
  input: OptimizerInput,
): Promise<OptimizerOutput> {
  const { bytes, mimeType, name } = input

  if (mimeType !== 'image/png' && mimeType !== 'image/jpeg' && mimeType !== 'image/webp') {
    throw new Error(`optimizeImage only handles raster MIME types — got ${mimeType}`)
  }

  // WebP source: identity passthrough so we don't waste CPU re-encoding an
  // already-optimized asset.
  if (mimeType === 'image/webp') {
    return { bytes, mimeType: 'image/webp', altText: altTextFromName(name) }
  }

  const input32 = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const out     = await sharp(input32).webp({ quality: WEBP_QUALITY }).toBuffer()

  return {
    bytes:    new Uint8Array(out.buffer, out.byteOffset, out.byteLength),
    mimeType: 'image/webp',
    altText:  altTextFromName(name),
  }
}
