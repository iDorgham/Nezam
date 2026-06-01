import { NextResponse } from 'next/server'
import type { DesignTokens } from '@/types/design'
import { pushTokensToFigma } from '@/lib/figma-sync'

type SyncBody = {
  tokens?: DesignTokens
}

export async function POST(req: Request) {
  const accessToken = process.env.FIGMA_ACCESS_TOKEN
  const fileKey = process.env.FIGMA_FILE_KEY

  if (!accessToken || !fileKey) {
    return NextResponse.json(
      {
        error:
          'Figma sync is not configured. Set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY in the environment.',
      },
      { status: 503 },
    )
  }

  let body: SyncBody
  try {
    body = (await req.json()) as SyncBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!body.tokens) {
    return NextResponse.json({ error: 'Missing tokens in request body.' }, { status: 400 })
  }

  try {
    const result = await pushTokensToFigma({
      fileKey,
      accessToken,
      tokens: body.tokens,
    })

    if (!result.ok) {
      return NextResponse.json(result, { status: 422 })
    }

    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unexpected Figma sync error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
