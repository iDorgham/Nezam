import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getPageSessionPath, getPagesSessionDir } from '@/lib/paths'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page_id: string }> }
) {
  try {
    const resolvedParams = await params
    const pageId = resolvedParams.page_id
    const filePath = getPageSessionPath(pageId)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ blocks: [] })
    }

    const content = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read page data', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ page_id: string }> }
) {
  try {
    const resolvedParams = await params
    const pageId = resolvedParams.page_id
    const data = await request.json()
    const filePath = getPageSessionPath(pageId)
    const dirPath = getPagesSessionDir()

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to save page data', details: error.message },
      { status: 500 }
    )
  }
}
