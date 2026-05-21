'use client'

import { useCallback } from 'react'
import DropZone from './DropZone'
import AssetCard from './AssetCard'
import UploadProgress from './UploadProgress'
import { useAssetStore } from '@/src/store/asset.store'
import type { AssetItem } from '@/src/lib/asset-schema'

// F-008 §3.3 / T-F008-001 — Left-dock orchestrator.
// Composes DropZone, UploadProgress rows, and the AssetCard grid against the
// asset store. The default uploader posts to /api/assets/upload; consumers
// (and tests) can inject a different uploader to swap the fetch boundary.

export const SUPPORTED_EXTENSIONS = [
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.woff2', '.json', '.yaml',
] as const

interface AssetBrowserProps {
  /** Replaceable upload boundary. Default fetches /api/assets/upload. */
  uploader?: (file: File) => Promise<AssetItem>
}

async function defaultUploader(file: File): Promise<AssetItem> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/assets/upload', { method: 'POST', body: fd })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Upload failed (${res.status})`)
  }
  const { asset } = await res.json()
  return asset as AssetItem
}

export default function AssetBrowser({ uploader = defaultUploader }: AssetBrowserProps) {
  const assets         = useAssetStore((s) => s.assets)
  const uploads        = useAssetStore((s) => s.uploads)
  const startUpload    = useAssetStore((s) => s.startUpload)
  const completeUpload = useAssetStore((s) => s.completeUpload)
  const addAsset       = useAssetStore((s) => s.addAsset)

  const handleFiles = useCallback(
    async (files: File[]) => {
      await Promise.all(files.map(async (file) => {
        startUpload(file.name)
        try {
          const asset = await uploader(file)
          addAsset(asset)
        } catch {
          // Failure is surfaced via the absence of an AssetCard; future work
          // can route the error to a toast. The upload row is still cleared
          // so the UI doesn't hang on a dead progress bar.
        } finally {
          completeUpload(file.name)
        }
      }))
    },
    [uploader, startUpload, completeUpload, addAsset],
  )

  return (
    <section
      aria-label="Asset browser"
      className="flex flex-col gap-3 p-3 bg-ds-surface"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-ds-xs uppercase tracking-wider text-ds-text-muted">
          Assets
        </h2>
        <span className="text-[10px] font-mono text-ds-text-muted tabular-nums">
          {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
        </span>
      </header>

      <DropZone onFiles={handleFiles} accepts={SUPPORTED_EXTENSIONS} />

      {uploads.length > 0 && (
        <div className="flex flex-col gap-1.5" aria-label="Uploads in progress">
          {uploads.map((u) => (
            <UploadProgress
              key={u.name}
              name={u.name}
              percent={u.percent}
              onCancel={() => completeUpload(u.name)}
            />
          ))}
        </div>
      )}

      {assets.length > 0 && (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns:
              'repeat(auto-fill, minmax(var(--ds-asset-card-min), 1fr))',
          }}
          aria-label="Asset grid"
        >
          {assets.map((asset) => (
            <div key={asset.id} data-asset-card>
              <AssetCard asset={asset} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
