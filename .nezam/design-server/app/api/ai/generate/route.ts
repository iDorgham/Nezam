import { NextResponse } from 'next/server'
import { getAllBlocks } from '@/lib/blocks/registry'

type GenerateBody = {
  prompt: string
  mode?: 'web' | 'saas' | 'mobile'
  pageType?: string
}

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 2048
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

function buildSystemPrompt(): string {
  let blockNames: string[] = []
  try {
    blockNames = getAllBlocks().map((b) => b.type)
  } catch {
    // Registry missing — fall back to a known set so the route still works.
    blockNames = [
      'Nav_TopBar',
      'Nav_Sidebar',
      'Hero_Simple',
      'Hero_Split',
      'Section_Features',
      'Section_Testimonials',
      'Section_CTA',
      'Section_Pricing',
      'Content_Text',
      'Content_Card',
      'Content_Grid',
      'Form_Contact',
      'Footer_Simple',
    ]
  }

  return [
    'You are the NEZAM Design Server wireframe generator.',
    'Given a natural-language description of a page or page section, you return a JSON array of wireframe block objects.',
    '',
    'Each block must have this exact shape:',
    '{ "id": string, "type": string, "name": string, "props": object }',
    '',
    `Valid "type" values (use ONLY these, do not invent new types): ${blockNames.join(', ')}.`,
    '',
    'Rules:',
    '- "id" must be a short kebab-case string unique within the array (e.g. "hero-1", "feat-grid-1").',
    '- "name" is a human-readable label for the block.',
    '- "props" is a flat object of string/number/array values appropriate for the block type.',
    '- Order blocks top-to-bottom as they should appear on the page.',
    '- Prefer 4–8 blocks per page. Never return fewer than 1.',
    '',
    'Output: respond ONLY with a valid JSON array. No markdown fences. No explanation.',
  ].join('\n')
}

function extractJsonArray(text: string): unknown[] {
  // Strip optional markdown fences then locate the outermost [...]
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
  const match = stripped.match(/\[[\s\S]*\]/)
  const jsonString = match ? match[0] : stripped
  const parsed = JSON.parse(jsonString)
  if (!Array.isArray(parsed)) throw new Error('Model returned non-array JSON')
  return parsed
}

async function callAnthropic(apiKey: string, prompt: string, system: string) {
  let lastError: unknown = null
  // Two attempts — handle transient 5xx / overload.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const msg = data?.error?.message ?? res.statusText
        // Retry on 5xx / 429
        if (res.status >= 500 || res.status === 429) {
          lastError = new Error(`Anthropic ${res.status}: ${msg}`)
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
          continue
        }
        throw new Error(`Anthropic ${res.status}: ${msg}`)
      }

      return res.json()
    } catch (err) {
      lastError = err
      if (attempt === 1) throw err
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Anthropic call failed')
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateBody>
    const prompt = body?.prompt?.trim()
    if (!prompt) {
      return NextResponse.json({ error: 'Missing "prompt" in request body' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'ANTHROPIC_API_KEY is not set',
          hint: 'Add ANTHROPIC_API_KEY to your environment, then restart the design server.',
        },
        { status: 500 }
      )
    }

    const userPrompt = [
      `Page mode: ${body.mode ?? 'web'}`,
      body.pageType ? `Page type: ${body.pageType}` : null,
      '',
      'Description:',
      prompt,
    ]
      .filter(Boolean)
      .join('\n')

    const data = await callAnthropic(apiKey, userPrompt, buildSystemPrompt())
    const text: string = data?.content?.[0]?.text ?? ''
    if (!text) {
      return NextResponse.json(
        { error: 'Model returned an empty response' },
        { status: 502 }
      )
    }

    const blocks = extractJsonArray(text)
    return NextResponse.json({ blocks, model: MODEL })
  } catch (error: any) {
    console.error('[api/ai/generate] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate blocks', details: error?.message ?? String(error) },
      { status: 500 }
    )
  }
}
