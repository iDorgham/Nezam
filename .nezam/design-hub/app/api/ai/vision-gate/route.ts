import { NextResponse } from 'next/server'

// SPEC-DS-CANVAS-001 §8.2 Vision Gate Protocol — AC-008.
// Inspects an uploaded image and decides whether it violates the
// Zero-Text Policy (no visible text, numbers, or UI mockups with labels).
//
// Request:  { image: <base64>, mimeType: 'image/png' | 'image/jpeg' | ... }
// Response: { compliant: boolean, reason: string, model: string }

const MODEL = 'claude-haiku-4-5-20251001'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])

const SYSTEM_PROMPT =
  'Inspect the provided image. Reply only with JSON: ' +
  '{ "compliant": boolean, "reason": string }. ' +
  'compliant must be false if the image contains visible text, numbers, ' +
  'screenshots of text-heavy interfaces, or UI mockups with readable labels.'

interface VisionGateBody {
  image:    string
  mimeType: string
}

interface VisionGateResult {
  compliant: boolean
  reason:    string
}

function stripDataUrlPrefix(image: string): string {
  // Accept either raw base64 or full data URLs (data:image/png;base64,XXX)
  const match = image.match(/^data:[^;]+;base64,(.+)$/)
  return match ? match[1] : image
}

function parseVisionResult(text: string): VisionGateResult {
  // Be lenient — model may wrap JSON in fences or prose.
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
  const match = stripped.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Vision model returned no JSON object')

  const parsed = JSON.parse(match[0]) as Partial<VisionGateResult>
  if (typeof parsed.compliant !== 'boolean') {
    throw new Error('Vision model JSON missing boolean "compliant"')
  }
  return {
    compliant: parsed.compliant,
    reason:    typeof parsed.reason === 'string' ? parsed.reason : '',
  }
}

async function callAnthropicVision(
  apiKey: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 256,
      system:     SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type:   'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 },
            },
            {
              type: 'text',
              text: 'Is this image compliant with the Zero-Text Policy?',
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: { message?: string } }
    const msg = data?.error?.message ?? res.statusText
    throw new Error(`Anthropic ${res.status}: ${msg}`)
  }

  const data = (await res.json()) as { content?: Array<{ text?: string }> }
  return data?.content?.[0]?.text ?? ''
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<VisionGateBody>
    const image    = body?.image?.trim()
    const mimeType = body?.mimeType?.trim()

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: 'Missing "image" or "mimeType" in request body' },
        { status: 400 },
      )
    }
    if (!ALLOWED_MIME.has(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported mimeType "${mimeType}". Allowed: ${[...ALLOWED_MIME].join(', ')}` },
        { status: 415 },
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'ANTHROPIC_API_KEY is not set',
          hint:  'Add ANTHROPIC_API_KEY to your environment and restart the design server.',
        },
        { status: 500 },
      )
    }

    const text = await callAnthropicVision(apiKey, stripDataUrlPrefix(image), mimeType)
    if (!text) {
      return NextResponse.json(
        { error: 'Vision model returned an empty response' },
        { status: 502 },
      )
    }

    const result = parseVisionResult(text)
    return NextResponse.json({ ...result, model: MODEL })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[api/ai/vision-gate] Error:', message)
    return NextResponse.json(
      { error: 'Vision Gate scan failed', details: message },
      { status: 500 },
    )
  }
}
