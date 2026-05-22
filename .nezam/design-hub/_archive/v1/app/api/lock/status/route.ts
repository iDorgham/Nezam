import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getProjectRoot } from '@/lib/paths'
import { buildTokenCssBlock } from '@/lib/locking/write-css-vars'
import type { DesignTokens } from '@/lib/store/tokens.store'

const MARKER_START = '/* ===== NEZAM DESIGN TOKENS (auto-generated — do not edit) ===== */'
const MARKER_END = '/* ===== END NEZAM DESIGN TOKENS ===== */'

function findMainAppGlobalsCss(): string | null {
  const root = getProjectRoot()
  const candidates = [
    path.join(root, 'src/app/globals.css'),
    path.join(root, 'app/globals.css'),
    path.join(root, 'src/styles/globals.css'),
    path.join(root, 'styles/globals.css'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tokens } = body

    if (!tokens) {
      return NextResponse.json({ error: 'Missing tokens payload' }, { status: 400 })
    }

    const target = findMainAppGlobalsCss()
    if (!target) {
      return NextResponse.json({
        synced: false,
        reason: 'no-globals-css',
        message: 'No globals.css found in the project'
      })
    }

    // 1. Generate the CSS block from tokens
    const generatedBlock = buildTokenCssBlock(tokens).trim()

    // 2. Read the globals.css on disk
    const content = fs.readFileSync(target, 'utf8')

    // 3. Extract the active block from globals.css
    const startIdx = content.indexOf(MARKER_START)
    const endIdx = content.indexOf(MARKER_END)

    if (startIdx === -1 || endIdx === -1) {
      return NextResponse.json({
        synced: false,
        reason: 'no-tokens-block',
        message: 'No Nezam design tokens block found inside globals.css',
        path: target
      })
    }

    const diskBlock = content.slice(startIdx, endIdx + MARKER_END.length).trim()

    // 4. Compare them
    const normalize = (str: string) => str.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim()
    const isSynced = normalize(generatedBlock) === normalize(diskBlock)

    return NextResponse.json({
      synced: isSynced,
      reason: isSynced ? 'synced' : 'out-of-sync',
      path: target
    })
  } catch (error: any) {
    console.error('Error checking sync status:', error)
    return NextResponse.json({ error: 'Failed to check sync status', details: error.message }, { status: 500 })
  }
}
