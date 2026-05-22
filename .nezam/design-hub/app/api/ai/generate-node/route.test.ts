import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the block registry so this test doesn't depend on disk-backed JSON.
vi.mock('@/lib/blocks/registry', () => ({
  getAllBlocks: () => [
    { type: 'Hero_Simple',      name: 'Hero',     canvas_modes: ['web'] },
    { type: 'Section_Features', name: 'Features', canvas_modes: ['web'] },
  ],
}))

interface MockBody {
  wireId:            string
  compressedPayload: Record<string, unknown>
  tokenCount:        number
}

const VALID_PAYLOAD: MockBody = {
  wireId: 'wire-1',
  compressedPayload: {
    sourceNodeId:         'node-home',
    sourceNodeAST:        { nodeType: 'page', title: 'Home', blocks: [] },
    designTokens:         { primary: '#06b6d4', background: '#0b1220' },
    attachedAssets:       [],
    annotativeDirectives: ['Use a soft hero gradient'],
  },
  tokenCount: 12_000,
}

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/ai/generate-node', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
}

const originalAnthropic = process.env.ANTHROPIC_API_KEY
const originalGemini    = process.env.GEMINI_API_KEY

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY
  delete process.env.GEMINI_API_KEY
})

afterEach(() => {
  if (originalAnthropic) process.env.ANTHROPIC_API_KEY = originalAnthropic
  else delete process.env.ANTHROPIC_API_KEY
  if (originalGemini) process.env.GEMINI_API_KEY = originalGemini
  else delete process.env.GEMINI_API_KEY

  vi.restoreAllMocks()
})

describe('POST /api/ai/generate-node · request validation', () => {
  it('returns 400 when the body is missing required fields', async () => {
    const { POST } = await import('./route')
    const res = await POST(makeRequest({ wireId: 'w1' }))

    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Invalid request payload/i)
  })

  it('returns 400 when compressedPayload is missing required fields', async () => {
    const { POST } = await import('./route')
    const res = await POST(
      makeRequest({
        wireId:            'w1',
        compressedPayload: { sourceNodeId: '' }, // bad — empty string and missing AST
        tokenCount:        100,
      }),
    )

    expect(res.status).toBe(400)
  })

  it('returns 413 when tokenCount exceeds the 32k hard budget', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test'
    const { POST } = await import('./route')
    const res = await POST(
      makeRequest({ ...VALID_PAYLOAD, tokenCount: 32_001 }),
    )

    expect(res.status).toBe(413)
    const data = await res.json()
    expect(data.maxTokens).toBe(32000)
  })
})

describe('POST /api/ai/generate-node · environment guard', () => {
  it('returns 500 with a helpful hint when no model key is configured', async () => {
    const { POST } = await import('./route')
    const res = await POST(makeRequest(VALID_PAYLOAD))

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/GEMINI_API_KEY/)
    expect(data.error).toMatch(/ANTHROPIC_API_KEY/)
    expect(data.hint).toMatch(/restart the design server/)
  })
})

describe('POST /api/ai/generate-node · happy path', () => {
  it('returns parsed blocks and the active model name on a successful Anthropic call', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test'

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              text: JSON.stringify([
                { id: 'hero-1', type: 'Hero_Simple',      name: 'Hero',     props: {} },
                { id: 'feat-1', type: 'Section_Features', name: 'Features', props: {} },
              ]),
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const { POST } = await import('./route')
    const res = await POST(makeRequest(VALID_PAYLOAD))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.model).toMatch(/claude/)
    expect(data.wireId).toBe('wire-1')
    expect(Array.isArray(data.blocks)).toBe(true)
    expect(data.blocks).toHaveLength(2)
    expect(data.blocks[0].type).toBe('Hero_Simple')
  })

  it('falls back to Anthropic when Gemini fails and both keys are present', async () => {
    process.env.GEMINI_API_KEY    = 'g-test'
    process.env.ANTHROPIC_API_KEY = 'sk-test'

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = typeof input === 'string' ? input : (input as Request).url
      if (url.includes('generativelanguage.googleapis.com')) {
        return new Response(
          JSON.stringify({ error: { message: 'overloaded' } }),
          { status: 503 },
        )
      }
      return new Response(
        JSON.stringify({ content: [{ text: '[{"id":"h","type":"Hero_Simple","name":"H","props":{}}]' }] }),
        { status: 200 },
      )
    })

    const { POST } = await import('./route')
    const res = await POST(makeRequest(VALID_PAYLOAD))

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.model).toMatch(/claude/)
    expect(data.blocks[0].type).toBe('Hero_Simple')
  })

  it('returns 500 when the model response is not parseable as a JSON array', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-test'

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ content: [{ text: 'I cannot do that.' }] }),
        { status: 200 },
      ),
    )

    const { POST } = await import('./route')
    const res = await POST(makeRequest(VALID_PAYLOAD))

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toMatch(/Failed to generate target node/)
  })
})
