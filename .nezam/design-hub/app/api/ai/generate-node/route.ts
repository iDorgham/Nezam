import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAllBlocks } from '@/lib/blocks/registry'

// SPEC-DS-CANVAS-001 §5 Flow 1 Step 7 + §8.1 — AC-008.
// Receives a wire's compressed ContextPayload and produces target-node
// wireframe blocks. Mirrors the contract of /api/ai/generate but adds the
// canvas-specific context (source AST, design tokens, attachments,
// annotative directives) into the system + user prompts so the generated
// page inherits the source node's design language.
//
// Request:  { wireId, compressedPayload: ContextPayload, tokenCount }
// Response: { blocks: BlockNode[], model: string, wireId: string }

const MODEL_ANTHROPIC = 'claude-haiku-4-5-20251001'
const MODEL_GEMINI    = 'gemini-2.5-flash'
const MAX_TOKENS      = 2048
const ANTHROPIC_URL   = 'https://api.anthropic.com/v1/messages'
const HARD_TOKEN_BUDGET = 32000

const AttachmentSummarySchema = z.object({
  type:         z.enum(['image', 'text', 'markdown', 'pdf']),
  role:         z.enum(['style-reference', 'content-source', 'prd-note']),
  content:      z.string().optional(),
  url:          z.string().optional(),
  altText:      z.string().optional(),
  visionStatus: z.enum(['pending', 'valid', 'rejected']).optional(),
})

const CompressedPayloadSchema = z.object({
  sourceNodeId:         z.string().min(1),
  sourceNodeAST:        z.record(z.unknown()),
  designTokens:         z.record(z.string()),
  attachedAssets:       z.array(AttachmentSummarySchema.passthrough()),
  annotativeDirectives: z.array(z.string()),
  compressedAt:         z.string().optional(),
  tokenCount:           z.number().optional(),
})

const RequestSchema = z.object({
  wireId:            z.string().min(1),
  compressedPayload: CompressedPayloadSchema,
  tokenCount:        z.number().nonnegative(),
})

function buildSystemPrompt(allowedBlockTypes: string[]): string {
  return [
    'You are the NEZAM Design Server context-aware page generator.',
    'You are generating a target page that is being wired from a source page on the canvas.',
    'The user payload contains the source page AST, inherited design tokens, vetted attachments, and annotative directives.',
    '',
    'Output rules:',
    '- Respond ONLY with a valid JSON array of wireframe blocks. No markdown fences, no prose.',
    '- Each block: { "id": string, "type": string, "name": string, "props": object }.',
    `- "type" MUST be one of: ${allowedBlockTypes.join(', ')}.`,
    '- "id" is short kebab-case, unique within the array.',
    '- "props" is a flat object that uses ONLY the design tokens provided. Do not invent new colors, type ramps, or radii.',
    '- Order blocks top-to-bottom. Prefer 4–8 blocks; never fewer than 1.',
    '',
    'Context inheritance:',
    '- Inherit typography, spacing, and color tokens from the source page.',
    '- Honor annotative directives literally where applicable.',
    '- Treat attachments tagged "style-reference" as visual inspiration, "content-source" as copy seed, "prd-note" as scope.',
  ].join('\n')
}

interface CompressedPayloadInput {
  sourceNodeId:         string
  sourceNodeAST:        Record<string, unknown>
  designTokens:         Record<string, string>
  attachedAssets:       Array<{
    type:         string
    role:         string
    content?:     string
    url?:         string
    altText?:     string
    visionStatus?: string
  }>
  annotativeDirectives: string[]
}

function buildUserPrompt(payload: CompressedPayloadInput): string {
  const directives = payload.annotativeDirectives.length > 0
    ? payload.annotativeDirectives.map((d, i) => `${i + 1}. ${d}`).join('\n')
    : '(none)'

  const tokens = Object.keys(payload.designTokens).length > 0
    ? Object.entries(payload.designTokens).map(([k, v]) => `  ${k}: ${v}`).join('\n')
    : '  (none — generate without inherited tokens)'

  const attachments = payload.attachedAssets.length > 0
    ? payload.attachedAssets
        .map((a, i) => `${i + 1}. [${a.role}] (${a.type}) ${a.content ?? a.url ?? a.altText ?? '(no descriptor)'}`)
        .join('\n')
    : '(none)'

  return [
    `Source node id: ${payload.sourceNodeId}`,
    '',
    'Source AST (truncated by context-compression tiers):',
    JSON.stringify(payload.sourceNodeAST),
    '',
    'Inherited design tokens:',
    tokens,
    '',
    'Vetted attachments:',
    attachments,
    '',
    'Annotative directives:',
    directives,
    '',
    'Generate the target page block array now.',
  ].join('\n')
}

function extractJsonArray(text: string): unknown[] {
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
  try {
    const parsed = JSON.parse(stripped)
    if (Array.isArray(parsed)) return parsed
    if (parsed && typeof parsed === 'object') {
      for (const val of Object.values(parsed)) {
        if (Array.isArray(val)) return val as unknown[]
      }
    }
  } catch {
    // Fall through to regex extraction
  }

  const match = stripped.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Model returned no JSON array')
  const parsed = JSON.parse(match[0])
  if (!Array.isArray(parsed)) throw new Error('Model returned non-array JSON')
  return parsed
}

async function callGemini(apiKey: string, system: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_GEMINI}:generateContent?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents:           [{ parts: [{ text: prompt }] }],
      systemInstruction:  { parts: [{ text: system }] },
      generationConfig:   { responseMimeType: 'application/json' },
    }),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(`Gemini ${res.status}: ${data?.error?.message ?? res.statusText}`)
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned an empty response')
  return text
}

async function callAnthropic(apiKey: string, system: string, prompt: string): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      MODEL_ANTHROPIC,
      max_tokens: MAX_TOKENS,
      system,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
    throw new Error(`Anthropic ${res.status}: ${data?.error?.message ?? res.statusText}`)
  }

  const data = (await res.json()) as { content?: Array<{ text?: string }> }
  const text = data?.content?.[0]?.text
  if (!text) throw new Error('Anthropic returned an empty response')
  return text
}

function getAllowedBlockTypes(): string[] {
  try {
    return getAllBlocks().map((b) => b.type)
  } catch {
    return [
      'Nav_TopBar', 'Nav_Sidebar', 'Hero_Simple', 'Hero_Split',
      'Section_Features', 'Section_Testimonials', 'Section_CTA', 'Section_Pricing',
      'Content_Text', 'Content_Card', 'Content_Grid', 'Form_Contact', 'Footer_Simple',
    ]
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null)
    const parsed = RequestSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', issues: parsed.error.issues },
        { status: 400 },
      )
    }

    const { wireId, compressedPayload, tokenCount } = parsed.data

    // Hard token budget guard — store-side compression should already enforce
    // this, but defending the route is cheap and prevents unbounded LLM bills.
    if (tokenCount > HARD_TOKEN_BUDGET) {
      return NextResponse.json(
        {
          error:      'Context exceeds 32,000-token budget',
          tokenCount,
          maxTokens:  HARD_TOKEN_BUDGET,
        },
        { status: 413 },
      )
    }

    const geminiKey    = process.env.GEMINI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!geminiKey && !anthropicKey) {
      return NextResponse.json(
        {
          error: 'Neither GEMINI_API_KEY nor ANTHROPIC_API_KEY is set',
          hint:  'Add a model key to your environment and restart the design server.',
        },
        { status: 500 },
      )
    }

    const system = buildSystemPrompt(getAllowedBlockTypes())
    const prompt = buildUserPrompt(compressedPayload)

    let text = ''
    let model = ''

    if (geminiKey) {
      try {
        model = MODEL_GEMINI
        text  = await callGemini(geminiKey, system, prompt)
      } catch (geminiError) {
        console.warn('[api/ai/generate-node] Gemini failed, attempting Anthropic fallback:', geminiError)
        if (!anthropicKey) throw geminiError
        model = MODEL_ANTHROPIC
        text  = await callAnthropic(anthropicKey, system, prompt)
      }
    } else if (anthropicKey) {
      model = MODEL_ANTHROPIC
      text  = await callAnthropic(anthropicKey, system, prompt)
    }

    if (!text) {
      return NextResponse.json(
        { error: 'Model returned an empty response' },
        { status: 502 },
      )
    }

    const blocks = extractJsonArray(text)
    return NextResponse.json({ blocks, model, wireId })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[api/ai/generate-node] Error:', message)
    return NextResponse.json(
      { error: 'Failed to generate target node', details: message },
      { status: 500 },
    )
  }
}
