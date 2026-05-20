import { create } from 'zustand'
import type { AssetItem } from '@/src/lib/asset-schema'

// F-008 §3.3 — AssetBrowser's backing store.
// `assets`  : items returned by /api/assets/upload (post-ingest).
// `uploads` : in-flight upload rows, keyed by filename, refreshed by the
//             AssetBrowser as XHR/fetch progress events fire.

export interface UploadEntry {
  name:    string
  percent: number
}

interface AssetState {
  assets:  ReadonlyArray<AssetItem>
  uploads: ReadonlyArray<UploadEntry>

  addAsset:          (asset: AssetItem) => void
  removeAsset:       (id: string) => void
  setVisionStatus:   (id: string, status: AssetItem['visionStatus']) => void

  startUpload:       (name: string) => void
  setUploadProgress: (name: string, percent: number) => void
  completeUpload:    (name: string) => void
}

export const useAssetStore = create<AssetState>((set) => ({
  assets:  [],
  uploads: [],

  addAsset: (asset) =>
    set((s) => ({ assets: [...s.assets, asset] })),

  removeAsset: (id) =>
    set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

  setVisionStatus: (id, status) =>
    set((s) => ({
      assets: s.assets.map((a) => (a.id === id ? { ...a, visionStatus: status } : a)),
    })),

  startUpload: (name) =>
    set((s) => {
      if (s.uploads.some((u) => u.name === name)) return s
      return { uploads: [...s.uploads, { name, percent: 0 }] }
    }),

  setUploadProgress: (name, percent) =>
    set((s) => ({
      uploads: s.uploads.map((u) => (u.name === name ? { ...u, percent } : u)),
    })),

  completeUpload: (name) =>
    set((s) => ({ uploads: s.uploads.filter((u) => u.name !== name) })),
}))
