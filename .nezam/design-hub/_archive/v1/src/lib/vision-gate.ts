import type { AssetMimeType } from './asset-schema'

// F-008 AC-004 — Async Vision Gate trigger.
//
// This module is the *trigger pathway*: the upload route calls
// `triggerVisionGate` from inside `after()` from `next/server` so the
// asset response goes out before the model call starts. The current
// implementation resolves immediately with a placeholder result; the
// real model wiring lives in `app/api/ai/vision-gate/route.ts` and is
// plugged in via a follow-up that moves the gate logic onto the
// Vercel AI Gateway. Tests assert that the trigger runs for image
// MIME types and is skipped for fonts / structured data.

export type VisionStatus = 'valid' | 'rejected'

export interface VisionGateResult {
  status:  VisionStatus
  reason?: string
}

export interface VisionGateInput {
  assetId:  string
  bytes:    Uint8Array
  mimeType: AssetMimeType
}

export async function triggerVisionGate(_input: VisionGateInput): Promise<VisionGateResult> {
  return { status: 'valid' }
}
