import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { CanvasNodeSchema } from '@/src/store/canvas-graph.store'
import { upsertNode } from '@/src/lib/canvas-storage'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'INVALID_JSON', message: 'Request body must be valid JSON' },
      { status: 400 },
    )
  }

  const parsed = CanvasNodeSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return NextResponse.json(
      {
        error:   'VALIDATION_ERROR',
        message: firstIssue?.message ?? 'Invalid node payload',
        path:    firstIssue?.path,
      },
      { status: 400 },
    )
  }

  try {
    const state = await upsertNode(parsed.data)
    return NextResponse.json({ node: parsed.data, state })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: err.issues[0]?.message ?? 'Invalid node' },
        { status: 400 },
      )
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'WRITE_FAILED', message },
      { status: 500 },
    )
  }
}
