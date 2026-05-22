import type { AttachmentPayload, ContextPayload } from '@/src/store/canvas-graph.store'

// SPEC-DS-CANVAS-001 §7 context-window-manager — AC-008 / F-C04.
// Pure 3-tier compression: shrink a ContextPayload below a hard token budget
// (default 32k) without losing structurally critical fields. Used both by
// canvas-graph.store.compressContext (per-wire) and by any server-side
// callers that want to validate a payload before sending to the LLM.
//
// Tiers (applied in order, only if the previous failed to fit):
//   Tier 1 → drop block prop details on sourceNodeAST.blocks (keep type/name)
//   Tier 2 → drop attachments by ascending priority: prd-note → content-source
//   Tier 3 → truncate annotativeDirectives to the first 3
// If tier 3 still overflows, returns ok:false with an actionable error.

export const DEFAULT_MAX_TOKENS = 32_000

// 1 token ≈ 4 chars of JSON — cheap heuristic, good enough for a budget gate.
// Real token counts come back from the LLM response; this is purely gating.
export function estimateTokens(payload: ContextPayload): number {
  return Math.ceil(JSON.stringify(payload).length / 4)
}

export type CompressionTier = 0 | 1 | 2 | 3

export type CompressionResult =
  | { ok: true;  payload: ContextPayload; tokenCount: number; tier: CompressionTier }
  | { ok: false; error: string;           tokenCount: number; tier: CompressionTier }

// Order assets are *dropped* in — lowest semantic priority first.
// SPEC §7: "drop lowest-priority attachments (prd-note first, then content-source)".
// style-reference is retained as long as possible since it drives visual coherence.
const DROP_ORDER: ReadonlyArray<AttachmentPayload['role']> = ['prd-note', 'content-source']

function simplifyBlocks(ast: ContextPayload['sourceNodeAST']): ContextPayload['sourceNodeAST'] {
  const next = { ...ast } as Record<string, unknown>
  const blocks = Array.isArray(next.blocks) ? next.blocks : []
  next.blocks = blocks.map((b) => {
    const block = b as Record<string, unknown>
    return { type: block.type, name: block.name }
  })
  return next
}

export function compressPayload(
  basePayload: ContextPayload,
  maxTokens: number = DEFAULT_MAX_TOKENS,
): CompressionResult {
  let payload: ContextPayload = { ...basePayload }
  let tier: CompressionTier = 0

  // Tier 1 — simplify block AST
  if (estimateTokens(payload) > maxTokens) {
    payload = { ...payload, sourceNodeAST: simplifyBlocks(payload.sourceNodeAST) }
    tier = 1
  }

  // Tier 2 — drop low-priority attachments one role at a time
  if (estimateTokens(payload) > maxTokens) {
    let assets = [...payload.attachedAssets]
    for (const role of DROP_ORDER) {
      if (estimateTokens(payload) <= maxTokens) break
      assets = assets.filter((a) => a.role !== role)
      payload = { ...payload, attachedAssets: assets }
    }
    tier = 2
  }

  // Tier 3 — truncate directives to the first 3
  if (estimateTokens(payload) > maxTokens) {
    payload = {
      ...payload,
      annotativeDirectives: payload.annotativeDirectives.slice(0, 3),
    }
    tier = 3
  }

  const tokenCount = estimateTokens(payload)
  if (tokenCount > maxTokens) {
    return {
      ok:    false,
      error: 'Context too large — remove attachments or simplify source',
      tokenCount,
      tier,
    }
  }

  return {
    ok:    true,
    payload: { ...payload, compressedAt: new Date().toISOString(), tokenCount },
    tokenCount,
    tier,
  }
}
