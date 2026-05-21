import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { getAllBlocks } from '@/lib/blocks/registry'

// Routes through Vercel AI Gateway via plain "provider/model" string.
// Auth: run `vercel env pull` to provision VERCEL_OIDC_TOKEN (auto-refreshed on deployment).
// Local fallback: set AI_GATEWAY_API_KEY in .env.local if OIDC token is expired.
const MODEL = 'anthropic/claude-haiku-4.5' as const

type GenerateBody = {
  prompt:    string
  mode?:     'web' | 'saas' | 'mobile'
  pageType?: string
  lodLevel?: string
}

function buildSystemPrompt(): string {
  let blockNames: string[] = []
  try {
    blockNames = getAllBlocks().map((b) => b.type)
  } catch {
    blockNames = [
      'Nav_TopBar', 'Nav_Sidebar', 'Hero_Simple', 'Hero_Split',
      'Section_Features', 'Section_Testimonials', 'Section_CTA',
      'Section_Pricing', 'Content_Text', 'Content_Card',
      'Content_Grid', 'Form_Contact', 'Footer_Simple',
    ]
  }

  return [
    'You are the NEZAM Design Server wireframe generator for Nezam Infinity Studio.',
    'Given a natural-language description, return a JSON array of wireframe block objects.',
    '',
    'Each block must have this exact shape:',
    '{ "id": string, "type": string, "name": string, "props": object }',
    '',
    `Valid "type" values (use ONLY these): ${blockNames.join(', ')}.`,
    '',
    'Rules:',
    '- "id" must be a short kebab-case string unique within the array.',
    '- "name" is a human-readable label.',
    '- "props" is a flat object of string/number/boolean/array values.',
    '- Order blocks top-to-bottom as they appear on the page.',
    '- Prefer 4–8 blocks per page. Never return fewer than 1.',
    '- If the description is in Arabic, use Arabic values for "name" fields.',
    '',
    'Output: respond ONLY with a valid JSON array. No markdown fences. No explanation.',
  ].join('\n')
}

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateBody>
    const prompt = body?.prompt?.trim()
    if (!prompt) {
      return NextResponse.json({ error: 'Missing "prompt"' }, { status: 400 })
    }

    const userPrompt = [
      `Canvas mode: ${body.mode ?? 'web'}`,
      body.pageType ? `Page type: ${body.pageType}` : null,
      body.lodLevel  ? `Current zoom level: ${body.lodLevel}` : null,
      '',
      'Description:',
      prompt,
    ].filter(Boolean).join('\n')

    const result = streamText({
      model:     MODEL,
      system:    buildSystemPrompt(),
      prompt:    userPrompt,
      maxOutputTokens: 2048,
    })

    return result.toTextStreamResponse()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[api/ai/generate] Error:', message)
    return NextResponse.json({ error: 'Generation failed', details: message }, { status: 500 })
  }
}
