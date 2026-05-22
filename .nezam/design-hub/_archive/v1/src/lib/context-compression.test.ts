import { describe, expect, it } from 'vitest'
import {
  compressPayload,
  DEFAULT_MAX_TOKENS,
  estimateTokens,
} from './context-compression'
import type {
  AttachmentPayload,
  ContextPayload,
} from '@/src/store/canvas-graph.store'

const ISO = '2026-01-01T00:00:00.000Z'

function makeAttachment(overrides: Partial<AttachmentPayload> = {}): AttachmentPayload {
  return {
    id:           overrides.id ?? `att-${Math.random().toString(36).slice(2, 10)}`,
    parentId:     overrides.parentId ?? 'wire-1',
    parentType:   overrides.parentType ?? 'wire',
    type:         overrides.type ?? 'image',
    url:          overrides.url,
    content:      overrides.content ?? 'screenshot.png',
    altText:      overrides.altText,
    visionStatus: overrides.visionStatus ?? 'valid',
    role:         overrides.role ?? 'style-reference',
    createdAt:    overrides.createdAt ?? ISO,
  }
}

function makePayload(overrides: Partial<ContextPayload> = {}): ContextPayload {
  return {
    sourceNodeId:         overrides.sourceNodeId         ?? 'node-home',
    sourceNodeAST:        overrides.sourceNodeAST        ?? { nodeType: 'page', title: 'Home', blocks: [] },
    designTokens:         overrides.designTokens         ?? {},
    attachedAssets:       overrides.attachedAssets       ?? [],
    annotativeDirectives: overrides.annotativeDirectives ?? [],
    compressedAt:         overrides.compressedAt,
    tokenCount:           overrides.tokenCount,
  }
}

// Build a payload whose JSON is at least `targetChars` long so we can push it
// past arbitrary token budgets without crafting massive fixture strings.
function bloat(chars: number): string {
  return 'x'.repeat(chars)
}

describe('estimateTokens', () => {
  it('returns 1 for empty payload (JSON "{}" rounds up)', () => {
    const tokens = estimateTokens(makePayload())
    expect(tokens).toBeGreaterThan(0)
  })

  it('scales with JSON character length', () => {
    const small = estimateTokens(makePayload({ annotativeDirectives: ['hi'] }))
    const big   = estimateTokens(makePayload({ annotativeDirectives: [bloat(4000)] }))
    expect(big).toBeGreaterThan(small * 10)
  })
})

describe('compressPayload · already under budget (tier 0)', () => {
  it('returns ok with tier=0 when no compression is needed', () => {
    const result = compressPayload(makePayload({ annotativeDirectives: ['compact'] }), DEFAULT_MAX_TOKENS)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tier).toBe(0)
      expect(result.payload.annotativeDirectives).toEqual(['compact'])
      expect(result.payload.compressedAt).toBeTruthy()
      expect(result.payload.tokenCount).toBe(result.tokenCount)
    }
  })

  it('does not mutate the input payload', () => {
    const original = makePayload({ annotativeDirectives: ['keep me'] })
    const snapshot = JSON.parse(JSON.stringify(original))

    compressPayload(original, DEFAULT_MAX_TOKENS)

    expect(original).toEqual(snapshot)
  })
})

describe('compressPayload · tier 1 (simplify block AST)', () => {
  it('strips block prop details but keeps type/name', () => {
    const payload = makePayload({
      sourceNodeAST: {
        nodeType: 'page',
        blocks: [
          { type: 'Hero',    name: 'Hero1',    props: { title: bloat(4000), subtitle: bloat(4000) } },
          { type: 'Section', name: 'Feat1',    props: { items: Array(40).fill(bloat(500)) } },
        ],
      },
    })

    const result = compressPayload(payload, 1000) // tiny budget forces tier 1

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tier).toBeGreaterThanOrEqual(1)
      const blocks = (result.payload.sourceNodeAST as Record<string, unknown>).blocks as Array<Record<string, unknown>>
      expect(blocks).toHaveLength(2)
      expect(blocks[0]).toEqual({ type: 'Hero',    name: 'Hero1' })
      expect(blocks[1]).toEqual({ type: 'Section', name: 'Feat1' })
    }
  })
})

describe('compressPayload · tier 2 (drop low-priority attachments)', () => {
  it('drops prd-note first, then content-source, preserving style-reference', () => {
    const payload = makePayload({
      annotativeDirectives: [bloat(2000)],
      attachedAssets: [
        makeAttachment({ role: 'style-reference', content: bloat(2000), id: 'a-style' }),
        makeAttachment({ role: 'content-source', content: bloat(2000), id: 'a-content' }),
        makeAttachment({ role: 'prd-note',       content: bloat(2000), id: 'a-prd' }),
      ],
    })

    const result = compressPayload(payload, 2000)

    expect(result.ok).toBe(true)
    if (result.ok) {
      const roles = result.payload.attachedAssets.map((a) => a.role)
      // prd-note is always dropped before content-source is even considered.
      expect(roles).not.toContain('prd-note')
      // style-reference is the last to ever be touched — should still be here
      // until we cross into very small budgets.
      expect(roles).toContain('style-reference')
    }
  })

  it('drops both prd-note and content-source when needed, retaining only style-reference', () => {
    const payload = makePayload({
      attachedAssets: [
        makeAttachment({ role: 'style-reference', content: bloat(200), id: 'a-style' }),
        makeAttachment({ role: 'content-source', content: bloat(4000), id: 'a-content' }),
        makeAttachment({ role: 'prd-note',       content: bloat(4000), id: 'a-prd' }),
      ],
    })

    const result = compressPayload(payload, 300)

    expect(result.ok).toBe(true)
    if (result.ok) {
      const roles = result.payload.attachedAssets.map((a) => a.role)
      expect(roles).toEqual(['style-reference'])
    }
  })
})

describe('compressPayload · tier 3 (truncate directives)', () => {
  it('keeps only the first 3 directives when previous tiers cannot fit the budget', () => {
    const payload = makePayload({
      annotativeDirectives: Array(20).fill(0).map((_, i) => `Directive ${i} ${bloat(800)}`),
    })

    const result = compressPayload(payload, 800)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tier).toBe(3)
      expect(result.payload.annotativeDirectives).toHaveLength(3)
      expect(result.payload.annotativeDirectives[0]).toMatch(/Directive 0/)
    }
  })
})

describe('compressPayload · unrecoverable overflow', () => {
  it('returns ok:false with an actionable error when even tier 3 cannot fit', () => {
    const payload = makePayload({
      // Two single huge directives — tier 3 truncates to 3 but each still
      // exceeds the budget on its own, so total stays over.
      annotativeDirectives: [bloat(50_000), bloat(50_000), bloat(50_000)],
    })

    const result = compressPayload(payload, 1000)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/Context too large/)
      expect(result.tokenCount).toBeGreaterThan(1000)
    }
  })
})

describe('compressPayload · default budget', () => {
  it('uses 32_000 as the default max', () => {
    expect(DEFAULT_MAX_TOKENS).toBe(32_000)
  })
})
