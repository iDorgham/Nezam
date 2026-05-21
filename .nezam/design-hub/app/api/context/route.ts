import { NextResponse } from 'next/server'
import fs from 'fs'
import { getProjectContextPath } from '@/lib/paths'
import { parseProjectContext } from '@/lib/parsers/context.parser'

export async function GET() {
  try {
    const contextPath = getProjectContextPath()
    
    if (!fs.existsSync(contextPath)) {
      return NextResponse.json({ exists: false, data: null })
    }

    const fileContent = fs.readFileSync(contextPath, 'utf8')
    const rawData = JSON.parse(fileContent)
    const validatedData = parseProjectContext(rawData)

    return NextResponse.json({ exists: true, data: validatedData })
  } catch (error: any) {
    console.error('Error reading project_context.json:', error)
    return NextResponse.json(
      { exists: true, error: 'Failed to read or parse project_context.json', details: error.message },
      { status: 500 }
    )
  }
}
