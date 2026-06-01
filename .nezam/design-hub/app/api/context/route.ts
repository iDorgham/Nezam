import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

import { getProjectContextPath } from '@/lib/paths'

type ProjectContext = {
  pages: any[]
  sections: any[]
  design_tokens: Record<string, unknown>
  sitemap: any[]
}

function parseProjectContext(data: unknown): ProjectContext {
  if (!data || typeof data !== 'object') {
    return { pages: [], sections: [], design_tokens: {}, sitemap: [] }
  }

  const obj = data as Record<string, unknown>

  return {
    pages: Array.isArray(obj.pages) ? obj.pages : [],
    sections: Array.isArray(obj.sections) ? obj.sections : [],
    design_tokens: obj.design_tokens && typeof obj.design_tokens === 'object' ? (obj.design_tokens as Record<string, unknown>) : {},
    sitemap: Array.isArray(obj.sitemap) ? obj.sitemap : [],
  }
}

function atomicWrite(filePath: string, content: string) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`
  fs.writeFileSync(tmp, content, 'utf8')
  fs.renameSync(tmp, filePath)
}

export async function GET() {
  try {
    const contextPath = getProjectContextPath()

    if (!fs.existsSync(contextPath)) {
      return NextResponse.json({ exists: false, data: null })
    }

    const raw = fs.readFileSync(contextPath, 'utf8')
    const parsed = JSON.parse(raw)
    const validated = parseProjectContext(parsed)

    return NextResponse.json({ exists: true, data: validated })
  } catch (error: any) {
    console.error('[api/context] Error reading project_context.json:', error)
    return NextResponse.json(
      { exists: true, error: 'Failed to read or parse project_context.json', details: error?.message ?? String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown
    const validated = parseProjectContext(body)

    const contextPath = getProjectContextPath()
    atomicWrite(contextPath, JSON.stringify(validated, null, 2))

    return NextResponse.json({ success: true, path: contextPath })
  } catch (error: any) {
    console.error('[api/context] Error writing project_context.json:', error)
    return NextResponse.json(
      { error: 'Failed to write project_context.json', details: error?.message ?? String(error) },
      { status: 500 }
    )
  }
}

