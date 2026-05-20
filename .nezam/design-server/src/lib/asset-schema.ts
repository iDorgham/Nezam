import { z } from 'zod'

// ARCHITECTURE.md §4 — AssetItem entity. MIME allowlist matches the union of
// supported asset types: images, fonts, structured data (JSON/YAML).

export const ASSET_MIME_TYPES = [
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/webp',
  'font/woff2',
  'application/json',
  'text/yaml',
] as const

export const AssetMimeType = z.enum(ASSET_MIME_TYPES)
export type AssetMimeType = z.infer<typeof AssetMimeType>

export const AssetItem = z.object({
  id:           z.string().uuid(),
  name:         z.string(),
  mimeType:     AssetMimeType,
  optimizedUrl: z.string(),
  altText:      z.string().default(''),
  visionStatus: z.enum(['pending', 'valid', 'rejected']),
  createdAt:    z.string().datetime(),
})
export type AssetItem = z.infer<typeof AssetItem>

// Non-image MIME types skip the async Vision Gate (no embedded-text risk),
// so they go straight to `visionStatus: 'valid'` on upload.
export const NON_IMAGE_MIME_TYPES: ReadonlySet<AssetMimeType> = new Set([
  'font/woff2',
  'application/json',
  'text/yaml',
])
