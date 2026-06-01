import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

import { getPageSessionPath, getPagesSessionDir } from '@/lib/paths'

function atomicWrite(filePath: string, content: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, filePath)
}

function readJsonIfExists(filePath: string): unknown | null {
  try {
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function sanitizePageId(pageId: string) {
  if (typeof pageId !== 'string') return null
  // Prevent directory traversal and keep file names deterministic.
  if (!/^[A-Za-z0-9_-]+$/.test(pageId)) return null
  return pageId
}

type PageSessionSection = {
  section_id?: string
  block_type?: string
  order?: number
  approved?: boolean
  locked_props?: Record<string, unknown>
  flexible_props?: Record<string, unknown>
  content_slots?: Record<string, unknown>
  states?: Record<string, unknown>
  // Allow extra fields to keep the editor forward-compatible.
  [key: string]: unknown
}

type PageSession = {
  arch_page_id?: string
  lock_page_id?: string
  layout_approved?: boolean
  sections?: PageSessionSection[]
  [key: string]: unknown
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ pageId: string }> }
) {
  const { pageId: rawPageId } = await context.params
  const pageId = sanitizePageId(rawPageId)
  if (!pageId) {
    return NextResponse.json({ error: 'Invalid pageId' }, { status: 400 })
  }

  const sessionPath = getPageSessionPath(pageId)
  const session = readJsonIfExists(sessionPath) as PageSession | null

  return NextResponse.json({
    pageId,
    session: session ?? null,
  })
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ pageId: string }> }
) {
  const { pageId: rawPageId } = await context.params
  const pageId = sanitizePageId(rawPageId)
  if (!pageId) {
    return NextResponse.json({ error: 'Invalid pageId' }, { status: 400 })
  }

  const body = (await request.json()) as Partial<PageSession>
  const sectionsRaw = body.sections

  if (sectionsRaw && !Array.isArray(sectionsRaw)) {
    return NextResponse.json({ error: '`sections` must be an array' }, { status: 422 })
  }

  const sections: PageSessionSection[] = Array.isArray(sectionsRaw) ? sectionsRaw : []
  const layoutApproved = typeof body.layout_approved === 'boolean' ? body.layout_approved : sections.length > 0
  const archPageId = typeof body.arch_page_id === 'string' ? body.arch_page_id : pageId
  const lockPageId = typeof body.lock_page_id === 'string' ? body.lock_page_id : undefined

  // Ensure session dir exists (for local dev and first-time lock).
  const sessionDir = getPagesSessionDir()
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

  const sessionPath = getPageSessionPath(pageId)
  atomicWrite(
    sessionPath,
    JSON.stringify(
      {
        arch_page_id: archPageId,
        lock_page_id: lockPageId,
        layout_approved: layoutApproved,
        sections,
        updated_at: new Date().toISOString(),
      },
      null,
      2
    )
  )

  return NextResponse.json({ success: true, pageId })
}

