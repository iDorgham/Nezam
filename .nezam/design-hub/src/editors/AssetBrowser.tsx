'use client'

/**
 * SPEC-DS-VISUAL-001 — zero-text visual asset browser.
 * Shape-only SVG placeholders, upload area, type filter chips.
 * No visible labels in generated assets — visual purity rule.
 */

import { useState, useRef, useCallback } from 'react'
import { Upload, Grid2X2, LayoutList, Image, Film, Type, Shapes } from 'lucide-react'
import { cn } from '@/lib/cn'

// ── Asset types ───────────────────────────────────────────────────────────────

type AssetType = 'all' | 'image' | 'video' | 'svg' | 'font'

interface Asset {
  id: string
  type: Exclude<AssetType, 'all'>
  name: string
  /** URL or data-uri — never shown as text overlay in the preview. */
  src?: string
  width: number
  height: number
  colorHex?: string
}

// ── Shape-only SVG placeholders ───────────────────────────────────────────────

const SHAPE_PALETTE = [
  '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b',
  '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6',
  '#bbf7d0', '#86efac', '#4ade80', '#22c55e',
  '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b',
]

function ShapePlaceholder({
  width, height, colorHex = '#e2e8f0', type,
}: Pick<Asset, 'width' | 'height' | 'colorHex' | 'type'>) {
  const ar = height / width

  const shape = (() => {
    if (type === 'image') {
      return (
        <>
          <rect x="0" y="0" width="100%" height="100%" fill={colorHex} />
          <circle cx="30%" cy="35%" r="12%" fill={`${colorHex}88`} />
          <path d="M5%,85% L35%,50% L60%,70% L80%,45% L100%,65% L100%,100% L0%,100% Z" fill={`${colorHex}cc`} />
        </>
      )
    }
    if (type === 'video') {
      return (
        <>
          <rect x="0" y="0" width="100%" height="100%" fill={colorHex} rx="4" />
          <polygon points="38%,30% 38%,70% 70%,50%" fill={`${colorHex}aa`} />
        </>
      )
    }
    if (type === 'svg') {
      return (
        <>
          <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke={colorHex} strokeWidth="3" rx="8" />
          <circle cx="50%" cy="50%" r="20%" fill={`${colorHex}55`} />
        </>
      )
    }
    if (type === 'font') {
      return (
        <>
          <rect x="0" y="0" width="100%" height="100%" fill={colorHex} />
          <rect x="20%" y="25%" width="60%" height="8%" fill={`${colorHex}aa`} />
          <rect x="25%" y="45%" width="50%" height="8%" fill={`${colorHex}aa`} />
          <rect x="30%" y="65%" width="40%" height="8%" fill={`${colorHex}aa`} />
        </>
      )
    }
    return <rect x="0" y="0" width="100%" height="100%" fill={colorHex} />
  })()

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {shape}
    </svg>
  )
}

// ── Filter chips ──────────────────────────────────────────────────────────────

const FILTERS: { id: AssetType; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'all',   Icon: Grid2X2 },
  { id: 'image', Icon: Image },
  { id: 'video', Icon: Film },
  { id: 'svg',   Icon: Shapes },
  { id: 'font',  Icon: Type },
]

// ── Upload drop zone ──────────────────────────────────────────────────────────

function UploadZone({ onUpload }: { onUpload: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handle = (files: FileList | null) => {
    if (files && files.length > 0) onUpload(files)
  }

  return (
    <div
      className={cn(
        'flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors',
        dragging
          ? 'border-app-brand bg-app-brand/5'
          : 'border-app-border hover:border-app-border-strong',
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files) }}
      onClick={() => inputRef.current?.click()}
    >
      <Upload size={18} className="text-app-subtle" />
      <span className="text-[11px] text-app-subtle">Drop or click to upload</span>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,.svg,.woff,.woff2,.ttf"
        className="hidden"
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  )
}

// ── Asset card ────────────────────────────────────────────────────────────────

function AssetCard({ asset, selected, onSelect }: {
  asset: Asset
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(asset.id)}
      className={cn(
        'group relative overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-brand',
        selected ? 'border-app-brand ring-1 ring-app-brand' : 'border-app-border hover:border-app-border-strong',
      )}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      aria-label={asset.name}
    >
      {asset.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <ShapePlaceholder
          width={asset.width}
          height={asset.height}
          colorHex={asset.colorHex}
          type={asset.type}
        />
      )}
    </button>
  )
}

// ── Seed data (shape-only placeholders, no text) ──────────────────────────────

function makeSeedAssets(): Asset[] {
  const configs: Omit<Asset, 'id'>[] = [
    { type: 'image', name: 'hero-wide',    width: 1600, height: 900,  colorHex: SHAPE_PALETTE[0] },
    { type: 'image', name: 'card-square',  width: 400,  height: 400,  colorHex: SHAPE_PALETTE[4] },
    { type: 'image', name: 'card-tall',    width: 400,  height: 600,  colorHex: SHAPE_PALETTE[8] },
    { type: 'image', name: 'thumb-wide',   width: 800,  height: 450,  colorHex: SHAPE_PALETTE[12] },
    { type: 'image', name: 'avatar',       width: 200,  height: 200,  colorHex: SHAPE_PALETTE[5] },
    { type: 'video', name: 'promo-16x9',   width: 1280, height: 720,  colorHex: SHAPE_PALETTE[3] },
    { type: 'video', name: 'story-9x16',   width: 720,  height: 1280, colorHex: SHAPE_PALETTE[6] },
    { type: 'svg',   name: 'icon-set',     width: 100,  height: 100,  colorHex: SHAPE_PALETTE[9] },
    { type: 'svg',   name: 'logo-shape',   width: 200,  height: 80,   colorHex: SHAPE_PALETTE[13] },
    { type: 'font',  name: 'type-sample',  width: 300,  height: 100,  colorHex: SHAPE_PALETTE[2] },
  ]
  return configs.map((c, i) => ({ ...c, id: `seed-${i}` }))
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface AssetBrowserProps {
  selectedId?: string
  onSelect?: (asset: Asset) => void
  className?: string
}

export function AssetBrowser({ selectedId, onSelect, className }: AssetBrowserProps) {
  const [assets, setAssets] = useState<Asset[]>(makeSeedAssets)
  const [filter, setFilter] = useState<AssetType>('all')
  const [grid, setGrid] = useState<'grid' | 'list'>('grid')

  const filtered = filter === 'all' ? assets : assets.filter((a) => a.type === filter)

  const handleUpload = useCallback((files: FileList) => {
    const newAssets: Asset[] = Array.from(files).map((f, i) => {
      const type: Asset['type'] = f.type.startsWith('video/')
        ? 'video'
        : f.type === 'image/svg+xml'
          ? 'svg'
          : f.name.match(/\.(woff|woff2|ttf|otf)$/)
            ? 'font'
            : 'image'
      return {
        id: `upload-${Date.now()}-${i}`,
        type,
        name: f.name,
        src: URL.createObjectURL(f),
        width: type === 'image' ? 400 : 300,
        height: type === 'image' ? 300 : 100,
        colorHex: SHAPE_PALETTE[i % SHAPE_PALETTE.length],
      }
    })
    setAssets((prev) => [...newAssets, ...prev])
  }, [])

  const handleSelect = useCallback((id: string) => {
    const asset = assets.find((a) => a.id === id)
    if (asset) onSelect?.(asset)
  }, [assets, onSelect])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <UploadZone onUpload={handleUpload} />

      {/* Filter bar */}
      <div className="flex items-center gap-1">
        {FILTERS.map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              filter === id
                ? 'bg-app-brand text-app-on-brand'
                : 'text-app-subtle hover:bg-app-surface hover:text-app-text',
            )}
            aria-label={id}
          >
            <Icon size={14} />
          </button>
        ))}
        <div className="ml-auto flex gap-0.5">
          <button
            onClick={() => setGrid('grid')}
            className={cn('flex h-7 w-7 items-center justify-center rounded-md transition-colors', grid === 'grid' ? 'bg-app-surface' : 'text-app-subtle hover:bg-app-surface')}
          >
            <Grid2X2 size={13} />
          </button>
          <button
            onClick={() => setGrid('list')}
            className={cn('flex h-7 w-7 items-center justify-center rounded-md transition-colors', grid === 'list' ? 'bg-app-surface' : 'text-app-subtle hover:bg-app-surface')}
          >
            <LayoutList size={13} />
          </button>
        </div>
      </div>

      {/* Asset grid */}
      <div
        className={cn(
          'grid gap-2',
          grid === 'grid' ? 'grid-cols-3' : 'grid-cols-1',
        )}
      >
        {filtered.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            selected={asset.id === selectedId}
            onSelect={handleSelect}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex h-24 items-center justify-center text-[11px] text-app-subtle">
            No assets
          </div>
        )}
      </div>
    </div>
  )
}
