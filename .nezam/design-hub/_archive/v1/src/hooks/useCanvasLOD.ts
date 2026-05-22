'use client'

import { useCanvasGraphStore } from '@/src/store/canvas-graph.store'

export type LODLevel = 'sitemap' | 'page' | 'section' | 'element'

// LOD thresholds keyed to zoom scale:
//   < 0.30  → sitemap   (thumbnail pill — page title only)
//   < 0.70  → page      (wireframe skeleton)
//   < 1.50  → section   (block labels + prop preview)
//  >= 1.50  → element   (inline editing handles)
export function useCanvasLOD(): LODLevel {
  const scale = useCanvasGraphStore((s) => s.viewport.scale)
  if (scale < 0.3)  return 'sitemap'
  if (scale < 0.7)  return 'page'
  if (scale < 1.5)  return 'section'
  return 'element'
}

export function scaleTolod(scale: number): LODLevel {
  if (scale < 0.3)  return 'sitemap'
  if (scale < 0.7)  return 'page'
  if (scale < 1.5)  return 'section'
  return 'element'
}
