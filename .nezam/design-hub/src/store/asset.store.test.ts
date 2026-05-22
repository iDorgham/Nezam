import { beforeEach, describe, expect, it } from 'vitest'
import { useAssetStore } from './asset.store'
import type { AssetItem } from '@/src/lib/asset-schema'

// F-008 §3.3 — Asset store backs the AssetBrowser. Two slices: persistent
// `assets` and ephemeral `uploads` (one row per in-flight POST).

const sample = (overrides: Partial<AssetItem> = {}): AssetItem => ({
  id:           '11111111-1111-4111-8111-111111111111',
  name:         'a.svg',
  mimeType:     'image/svg+xml',
  optimizedUrl: 'https://blob.example/a.svg',
  altText:      '',
  visionStatus: 'pending',
  createdAt:    '2026-05-19T10:00:00.000Z',
  ...overrides,
})

beforeEach(() => {
  useAssetStore.setState({ assets: [], uploads: [] })
})

describe('useAssetStore · assets slice', () => {
  it('starts with no assets', () => {
    expect(useAssetStore.getState().assets).toEqual([])
  })

  it('addAsset appends a new asset', () => {
    useAssetStore.getState().addAsset(sample())
    expect(useAssetStore.getState().assets).toHaveLength(1)
  })

  it('removeAsset filters by id', () => {
    useAssetStore.getState().addAsset(sample({ id: 'aaaa', name: 'a' }))
    useAssetStore.getState().addAsset(sample({ id: 'bbbb', name: 'b' }))
    useAssetStore.getState().removeAsset('aaaa')
    expect(useAssetStore.getState().assets.map((a) => a.id)).toEqual(['bbbb'])
  })

  it('setVisionStatus mutates the targeted asset', () => {
    useAssetStore.getState().addAsset(sample({ id: 'x', visionStatus: 'pending' }))
    useAssetStore.getState().setVisionStatus('x', 'rejected')
    expect(useAssetStore.getState().assets[0].visionStatus).toBe('rejected')
  })

  it('setVisionStatus is a no-op for an unknown id', () => {
    useAssetStore.getState().addAsset(sample({ id: 'x' }))
    useAssetStore.getState().setVisionStatus('unknown', 'valid')
    expect(useAssetStore.getState().assets[0].visionStatus).toBe('pending')
  })
})

describe('useAssetStore · uploads slice', () => {
  it('starts with no uploads', () => {
    expect(useAssetStore.getState().uploads).toEqual([])
  })

  it('startUpload registers an entry at 0%', () => {
    useAssetStore.getState().startUpload('hero.png')
    expect(useAssetStore.getState().uploads).toEqual([{ name: 'hero.png', percent: 0 }])
  })

  it('startUpload twice for the same name does not duplicate the entry', () => {
    useAssetStore.getState().startUpload('a.png')
    useAssetStore.getState().startUpload('a.png')
    expect(useAssetStore.getState().uploads).toHaveLength(1)
  })

  it('setUploadProgress updates the named entry', () => {
    useAssetStore.getState().startUpload('a.png')
    useAssetStore.getState().setUploadProgress('a.png', 47)
    expect(useAssetStore.getState().uploads[0].percent).toBe(47)
  })

  it('completeUpload removes the named entry', () => {
    useAssetStore.getState().startUpload('a.png')
    useAssetStore.getState().completeUpload('a.png')
    expect(useAssetStore.getState().uploads).toEqual([])
  })
})
