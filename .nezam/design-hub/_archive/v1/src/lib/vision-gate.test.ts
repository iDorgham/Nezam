import { describe, expect, it } from 'vitest'
import { triggerVisionGate } from './vision-gate'

describe('triggerVisionGate · placeholder contract', () => {
  it('resolves to a VisionGateResult with a valid/rejected status', async () => {
    const result = await triggerVisionGate({
      assetId:  '11111111-1111-4111-8111-111111111111',
      bytes:    new Uint8Array([0x52, 0x49, 0x46, 0x46]),
      mimeType: 'image/webp',
    })
    expect(result).toBeTruthy()
    expect(['valid', 'rejected']).toContain(result.status)
  })
})
