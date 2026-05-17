export interface DesignAsset {
  id: number
  name: string
  size: string
  type: 'image' | 'vector' | 'font' | 'video' | 'data'
}

export const designAssets: DesignAsset[] = [
  { id: 1, name: 'hero-banner.jpg', size: '1.2MB', type: 'image' },
  { id: 2, name: 'logo-dark.svg', size: '45KB', type: 'vector' },
  { id: 3, name: 'product-01.png', size: '890KB', type: 'image' },
  { id: 4, name: 'font-bold.woff2', size: '120KB', type: 'font' },
  { id: 5, name: 'marketing-video.mp4', size: '12.5MB', type: 'video' },
  { id: 6, name: 'icon-set.json', size: '12KB', type: 'data' },
]
