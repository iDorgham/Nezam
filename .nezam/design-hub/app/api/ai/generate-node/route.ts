/**
 * /api/ai/generate-node
 *
 * Reserved placeholder route. Generates a single architecture node from an AI prompt.
 * Implementation deferred to Phase 2 (Core Features) — tracked under T-C-AI-* tasks.
 *
 * Returning 501 keeps the route a valid module so production builds succeed, while
 * preserving the URL path for the eventual implementation.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST() {
  return NextResponse.json(
    {
      error: 'not_implemented',
      message:
        '/api/ai/generate-node is reserved for Phase 2. Use /api/ai/generate for the current generator.',
    },
    { status: 501 }
  )
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'method_not_allowed',
      message: 'POST only. This endpoint is reserved (not yet implemented).',
    },
    { status: 405 }
  )
}
