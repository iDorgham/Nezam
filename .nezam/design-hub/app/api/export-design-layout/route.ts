import { NextResponse } from 'next/server'
import fs from 'fs'
import { getExportDesignPath } from '@/lib/paths'

const LAYOUT_SECTION_MARKER_START = '<!-- LAYOUT_DESIGNER_START -->'
const LAYOUT_SECTION_MARKER_END = '<!-- LAYOUT_DESIGNER_END -->'

export async function POST(request: Request) {
  try {
    const { section } = await request.json()

    if (!section) {
      return NextResponse.json({ error: 'Missing section content' }, { status: 400 })
    }

    const designPath = getExportDesignPath()

    let existing = ''
    if (fs.existsSync(designPath)) {
      existing = fs.readFileSync(designPath, 'utf8')
    }

    const newBlock = `${LAYOUT_SECTION_MARKER_START}\n${section}\n${LAYOUT_SECTION_MARKER_END}`

    let updated: string
    if (existing.includes(LAYOUT_SECTION_MARKER_START)) {
      // Replace existing layout section
      const startIdx = existing.indexOf(LAYOUT_SECTION_MARKER_START)
      const endIdx = existing.indexOf(LAYOUT_SECTION_MARKER_END) + LAYOUT_SECTION_MARKER_END.length
      updated = existing.slice(0, startIdx) + newBlock + existing.slice(endIdx)
    } else {
      // Append to end
      updated = existing + '\n\n' + newBlock
    }

    fs.writeFileSync(designPath, updated, 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Layout section written to DESIGN.md',
      path: designPath,
    })
  } catch (error: any) {
    console.error('Error updating DESIGN.md:', error)
    return NextResponse.json(
      { error: 'Failed to update DESIGN.md', details: error.message },
      { status: 500 }
    )
  }
}
