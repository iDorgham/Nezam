import type { AssetItem, AssetMimeType } from '@/src/lib/asset-schema'

// F-008 §3.3 / AC-007 — Pure render of an AssetItem.
// No fetch, no store wiring; the parent supplies the optional rejectionReason
// text shown when visionStatus is 'rejected'.

interface AssetCardProps {
  asset:            AssetItem
  /** Surfaced under the rejection overlay; falls back to a generic message. */
  rejectionReason?: string
}

const MIME_LABEL: Record<AssetMimeType, string> = {
  'image/svg+xml':    'SVG',
  'image/png':        'PNG',
  'image/jpeg':       'JPG',
  'image/webp':       'WEBP',
  'font/woff2':       'WOFF2',
  'application/json': 'JSON',
  'text/yaml':        'YAML',
}

const IMAGE_MIME_TYPES: ReadonlySet<AssetMimeType> = new Set([
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/webp',
])

export default function AssetCard({ asset, rejectionReason }: AssetCardProps) {
  const isImage = IMAGE_MIME_TYPES.has(asset.mimeType)

  return (
    <article
      aria-label={asset.name}
      className="relative flex flex-col rounded-ds-sm border border-ds-border bg-ds-surface-elevated overflow-hidden"
    >
      <div className="relative aspect-square bg-ds-surface flex items-center justify-center">
        {isImage ? (
          <img
            src={asset.optimizedUrl}
            alt={asset.altText || asset.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-ds-xs font-mono text-ds-text-muted"
          >
            {MIME_LABEL[asset.mimeType]}
          </span>
        )}

        <span
          data-mime-badge
          className="absolute top-1 end-1 px-1.5 py-0.5 rounded-ds-sm bg-ds-surface text-[9px] font-mono font-semibold text-ds-text-secondary border border-ds-border"
        >
          {MIME_LABEL[asset.mimeType]}
        </span>

        {asset.visionStatus === 'pending' && (
          <span
            data-vision-status="pending"
            role="status"
            className="absolute bottom-1 start-1 px-1.5 py-0.5 rounded-ds-sm bg-ds-surface/80 text-[9px] font-mono text-ds-text-muted"
          >
            Scanning…
          </span>
        )}

        {asset.visionStatus === 'rejected' && (
          <div
            data-vision-status="rejected"
            role="alert"
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ds-destructive/90 text-ds-destructive-foreground text-center p-2"
          >
            <span aria-hidden="true" className="text-lg font-bold">✗</span>
            <span className="text-ds-xs font-semibold">
              {rejectionReason ?? 'Asset rejected'}
            </span>
          </div>
        )}
      </div>

      <p
        className="px-2 py-1.5 text-ds-xs text-ds-text-primary truncate"
        title={asset.name}
      >
        {asset.name}
      </p>
    </article>
  )
}
