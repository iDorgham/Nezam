import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

/**
 * POST /api/lock-sync
 *
 * Receives the compiled Design Hub session payloads and writes them to
 * .nezam/design-hub/.session/ — the canonical handoff directory that the
 * NEZAM Agent Swarm reads when triggered via HANDOFF_QUEUE.yaml.
 *
 * Body: { sitemap: object, tokens: object, wireframes: object }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sitemap, tokens, wireframes } = body as {
      sitemap:    Record<string, unknown>
      tokens:     Record<string, unknown>
      wireframes: Record<string, unknown>
    }

    // Resolve .session dir relative to the design-hub root (two levels up from app/api/lock-sync/)
    const hubRoot   = path.resolve(process.cwd())
    const sessionDir = path.join(hubRoot, '.session')

    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true })
    }

    const write = (filename: string, data: Record<string, unknown>) =>
      fs.writeFileSync(path.join(sessionDir, filename), JSON.stringify(data, null, 2), 'utf-8')

    write('sitemap.json',           sitemap)
    write('tokens.json',            tokens)
    write('wireframes_locked.json', wireframes)

    // Append a minimal entry to HANDOFF_QUEUE.yaml in the workspace root
    const workspaceRoot = path.resolve(hubRoot, '../../..') // .nezam/design-hub → repo root
    const queuePath = path.join(workspaceRoot, '.cursor', 'state', 'HANDOFF_QUEUE.yaml')
    const entry = [
      '',
      `- triggeredAt: '${new Date().toISOString()}'`,
      `  source: design-hub`,
      `  status: pending`,
      `  sessionDir: .nezam/design-hub/.session`,
      `  agents: [ui-depth-architect, motion-performance-specialist, frontend-lead]`,
    ].join('\n')

    if (fs.existsSync(queuePath)) {
      fs.appendFileSync(queuePath, entry, 'utf-8')
    }

    return NextResponse.json({
      ok: true,
      written: [
        `.session/sitemap.json`,
        `.session/tokens.json`,
        `.session/wireframes_locked.json`,
      ],
    })
  } catch (err) {
    console.error('[lock-sync]', err)
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    )
  }
}
