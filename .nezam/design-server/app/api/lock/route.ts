import { NextResponse } from 'next/server'
import fs from 'fs'
import { getExportDesignPath } from '@/lib/paths'
import { generateDesignMarkdown } from '@/lib/locking/export-design'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { tokens, sitemap } = data

    if (!tokens || !sitemap) {
      return NextResponse.json({ error: 'Missing tokens or sitemap data' }, { status: 400 })
    }

    // Pre-lock validation logic
    if (Object.keys(tokens.colors).length < 5) {
      return NextResponse.json({ error: 'Validation failed: Profile must define at least 5 core colors.' }, { status: 400 })
    }

    if (sitemap.length === 0) {
      return NextResponse.json({ error: 'Validation failed: Sitemap must contain at least one page.' }, { status: 400 })
    }

    const mdContent = generateDesignMarkdown(tokens, sitemap)
    const exportPath = getExportDesignPath()

    // Write DESIGN.md to project root
    fs.writeFileSync(exportPath, mdContent, 'utf8')

    // Here we would also run git commands if needed
    // execSync('git add DESIGN.md && git commit -m "docs: lock design system"', { cwd: getProjectRoot() })

    return NextResponse.json({ 
      success: true, 
      message: 'Design locked and exported successfully!',
      path: exportPath
    })
  } catch (error: any) {
    console.error('Error locking design:', error)
    return NextResponse.json(
      { error: 'Failed to lock design', details: error.message },
      { status: 500 }
    )
  }
}
