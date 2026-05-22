import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateText, Output } from 'ai'
import { composeProfile, generateProfile, hueFromPrompt } from '@/lib/ai'

/**
 * AI Co-Pilot endpoint. Asks a model (via the Vercel AI Gateway) for a compact
 * design brief, then synthesizes a coherent light + dark system locally.
 * Falls back to fully local generation when no gateway key is configured.
 */

const briefSchema = z.object({
  name: z.string().describe('A short, evocative 2-word system name'),
  personality: z.string().describe('One sentence describing the brand feel'),
  hue: z.number().min(0).max(360).describe('Brand color hue on the color wheel'),
  accentHue: z.number().min(0).max(360).describe('Accent hue — harmonious with the brand'),
  saturation: z.number().min(45).max(92).describe('Brand saturation percentage'),
  radius: z.number().min(3).max(22).describe('Base corner radius in px'),
  density: z.enum(['compact', 'cozy', 'spacious']),
  shadow: z.enum(['soft', 'crisp', 'dramatic']),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({ prompt: '' }))
  const prompt: string = typeof body?.prompt === 'string' ? body.prompt : ''

  // Try the gateway only when a key is present and a prompt was given.
  if (process.env.AI_GATEWAY_API_KEY && prompt.trim()) {
    try {
      // Erase the generic so TS cannot deep-instantiate the zod ⇄ SDK types.
      const makeObjectOutput = Output.object as (cfg: { schema: unknown }) => never
      const { output } = await generateText({
        model: 'anthropic/claude-sonnet-4.6',
        output: makeObjectOutput({ schema: briefSchema }),
        prompt:
          'You are a senior brand and product designer. Translate this creative ' +
          `brief into a precise design brief: "${prompt}". Choose a hue and a ` +
          'harmonious accent hue, a saturation, a corner radius, a spacing density, ' +
          'and an elevation style that authentically express the requested feeling.',
      })
      const brief = briefSchema.parse(output)
      return NextResponse.json({ profile: composeProfile(brief), source: 'gateway' })
    } catch (err) {
      console.error('[api/ai] gateway generation failed, using local fallback:', err)
    }
  }

  // Local, offline-safe generation.
  const profile = generateProfile({ hueHint: hueFromPrompt(prompt) })
  if (prompt.trim()) {
    profile.personality = `Composed for: "${prompt.trim().slice(0, 120)}"`
  }
  return NextResponse.json({ profile, source: 'local' })
}
