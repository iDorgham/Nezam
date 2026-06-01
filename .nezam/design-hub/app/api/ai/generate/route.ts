import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextResponse } from 'next/server'

import { getBlocksByCategory, BLOCK_CATEGORIES } from '@/lib/wireframe/blockRegistry'
import type { WireframeBlockDescriptor } from '@/lib/wireframe/blockRegistry'

const MODEL_NAME = 'claude-3-5-haiku-latest'
export const maxDuration = 60

type GenerateBody = {
  prompt: string
  mode?: 'web' | 'saas' | 'mobile'
  pageType?: string
  lodLevel?: string
}

function getAllBlockTypes(): string[] {
  const set = new Set<string>()
  for (const cat of BLOCK_CATEGORIES) {
    const blocks = getBlocksByCategory(cat) as WireframeBlockDescriptor[]
    for (const b of blocks) {
      if (b.type) set.add(b.type)
    }
  }
  return Array.from(set)
}

function buildSystemPrompt(blockTypes: string[]): string {
  const fallbackTypes = [
    'Nav_TopBar', 'Nav_Sidebar', 'Hero_Simple', 'Hero_Split',
    'Section_Features', 'Section_Testimonials', 'Section_CTA',
    'Section_Pricing', 'Content_Text', 'Content_Card',
    'Content_Grid', 'Form_Contact', 'Footer_Simple',
  ]

  const validTypes = (blockTypes.length ? blockTypes : fallbackTypes).join(', ')

  return [
    'You are the NEZAM Design Server wireframe generator for Nezam Infinity Studio.',
    'Given a natural-language description, return a JSON array of wireframe block objects.',
    '',
    'Each block must have this exact shape:',
    '{ "id": string, "type": string, "name": string, "props": object }',
    '',
    `Valid "type" values (use ONLY these): ${validTypes}.`,
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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateBody>
    const prompt = body?.prompt?.trim()
    if (!prompt) {
      return NextResponse.json({ error: 'Missing "prompt"' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI generation disabled', details: 'ANTHROPIC_API_KEY not set' },
        { status: 503 },
      )
    }

    const userPrompt = [
      `Canvas mode: ${body.mode ?? 'web'}`,
      body.pageType ? `Page type: ${body.pageType}` : null,
      body.lodLevel ? `Current zoom level: ${body.lodLevel}` : null,
      '',
      'Description:',
      prompt,
    ].filter(Boolean).join('\n')

    const result = streamText({
      model: anthropic(MODEL_NAME),
      system: buildSystemPrompt(getAllBlockTypes()),
      prompt: userPrompt,
      maxOutputTokens: 2048,
    })

    return result.toTextStreamResponse()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[api/ai/generate] Error:', message)
    return NextResponse.json({ error: 'Generation failed', details: message }, { status: 500 })
  }
}

