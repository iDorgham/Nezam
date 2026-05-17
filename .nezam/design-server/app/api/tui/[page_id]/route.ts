import { NextResponse } from 'next/server'
import { drawTextInBox } from '@/lib/tui/box-drawing'
import fs from 'fs'
import { getPageSessionPath } from '@/lib/paths'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page_id: string }> }
) {
  try {
    const resolvedParams = await params
    const pageId = resolvedParams.page_id
    const width = 60
    const filePath = getPageSessionPath(pageId)

    let content = `Page: ${pageId}\nStatus: Active\n\n`

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileContent)
      const blocks = data.blocks || []
      
      if (blocks.length > 0) {
        content += `Blocks on canvas: ${blocks.length}\n\n`
        blocks.forEach((block: any) => {
          content += `- ${block.name} (${block.type})\n`
        })
      } else {
        content += 'No blocks on canvas.'
      }
    } else {
      content += 'No saved data found for this page.\nEdit the page in the UI to create it.'
    }
    
    const tuiText = drawTextInBox(content, width)

    return new Response(tuiText, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate TUI', details: error.message },
      { status: 500 }
    )
  }
}
