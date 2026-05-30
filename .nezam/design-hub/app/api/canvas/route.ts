/**
 * /api/canvas
 *
 * Reserved placeholder route. Implementation deferred to a later phase.
 * Returning 501 keeps this a valid TypeScript module so production builds
 * succeed, while preserving the URL path for future implementation.
 */
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(
    {
      error: 'not_implemented',
      path: '/api/canvas',
      message: 'Endpoint reserved — implementation deferred to a later phase.',
    },
    { status: 501 }
  )
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'not_implemented',
      path: '/api/canvas',
      message: 'Endpoint reserved — implementation deferred to a later phase.',
    },
    { status: 501 }
  )
}
