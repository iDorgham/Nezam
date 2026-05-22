import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getExportWireframesPath } from '@/lib/paths'

export async function POST(request: Request) {
  try {
    const { data } = await request.json()

    if (!data || !data.pages) {
      return NextResponse.json({ error: 'Missing wireframe data' }, { status: 400 })
    }

    const exportPath = getExportWireframesPath()

    // Ensure directory exists
    const dir = path.dirname(exportPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'wireframes_locked.json written successfully',
      path: exportPath,
      pageCount: data.pages.length,
      blockCount: data.pages.reduce((sum: number, p: any) => sum + p.blocks.length, 0),
    })
  } catch (error: any) {
    console.error('Error exporting wireframes:', error)
    return NextResponse.json(
      { error: 'Failed to export wireframes', details: error.message },
      { status: 500 }
    )
  }
}
