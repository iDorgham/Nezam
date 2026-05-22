import { NextResponse } from 'next/server'
import { readCanvasState } from '@/src/lib/canvas-storage'

export async function GET() {
  try {
    const state = await readCanvasState()
    return NextResponse.json(state)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'READ_FAILED', message },
      { status: 500 },
    )
  }
}
