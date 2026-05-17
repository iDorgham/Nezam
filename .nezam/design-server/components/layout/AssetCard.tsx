'use client'

import type { DesignAsset } from '@/lib/assets'

interface AssetCardProps {
  asset: DesignAsset
  compact?: boolean
}

export default function AssetCard({ asset, compact = false }: AssetCardProps) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('application/x-nezam-asset', JSON.stringify(asset))
        event.dataTransfer.effectAllowed = 'copy'
      }}
      className="bg-ds-surface border border-ds-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group cursor-grab active:cursor-grabbing"
    >
      <div className={`aspect-square bg-ds-background flex items-center justify-center p-4 ${compact ? 'max-h-24' : ''}`}>
        {asset.type === 'image' && <div className="w-full h-full bg-gradient-to-br from-ds-primary/20 to-ds-success/20 rounded" />}
        {asset.type === 'vector' && <div className="w-8 h-8 text-ds-info"><svg fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 11-2 0 1 1 0 012 0zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 6a4 4 0 100 8 4 4 0 000-8z" /></svg></div>}
        {asset.type === 'font' && <span className="text-2xl font-bold text-ds-text-muted">Aa</span>}
        {asset.type === 'video' && <div className="w-full h-full bg-ds-secondary rounded flex items-center justify-center"><div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin" /></div>}
        {asset.type === 'data' && <span className="text-xs font-mono text-ds-text-muted">{"{}"}</span>}
      </div>
      <div className="p-3">
        <p className="text-[11px] font-medium truncate text-ds-text-primary" title={asset.name}>{asset.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-ds-text-muted uppercase tracking-tighter">{asset.type}</span>
          <span className="text-[10px] text-ds-text-muted">{asset.size}</span>
        </div>
      </div>
    </div>
  )
}
