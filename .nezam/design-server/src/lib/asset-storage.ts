import { put } from '@vercel/blob'

// Thin wrapper around @vercel/blob so the upload route has a single seam to
// mock in tests. Production path: anonymous bytes → public URL on the
// asset-host bucket. Filenames are namespaced under `assets/` and Blob's
// addRandomSuffix avoids collisions without us tracking IDs separately.

export interface StoreAssetParams {
  /** Original filename (used only for the Blob pathname; not trusted). */
  name:     string
  mimeType: string
  bytes:    Uint8Array
  access?:  'public' | 'private'
}

export interface StoredAsset {
  url:      string
  pathname: string
}

export async function storeAsset({
  name,
  mimeType,
  bytes,
  access = 'public',
}: StoreAssetParams): Promise<StoredAsset> {
  // @vercel/blob's PutBody requires Buffer (or Blob/Stream); a plain
  // Uint8Array is rejected by the SDK's type signature even though both
  // wrap the same backing memory.
  const body = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const blob = await put(`assets/${name}`, body, {
    access,
    contentType:     mimeType,
    addRandomSuffix: true,
  })
  return { url: blob.url, pathname: blob.pathname }
}
