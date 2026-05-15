import { NextResponse } from 'next/server'
import fs from 'fs'
import { getDesignProfilePath } from '@/lib/paths'
import { parseProfile } from '@/lib/parsers/profile.parser'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const profileName = name
    const mdPath = getDesignProfilePath(profileName)
    
    if (!fs.existsSync(mdPath)) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const content = fs.readFileSync(mdPath, 'utf8')
    const parsed = parseProfile(profileName, content)

    return NextResponse.json({ profile: parsed })
  } catch (error: any) {
    console.error(`Error reading profile:`, error)
    return NextResponse.json(
      { error: 'Failed to read profile', details: error.message },
      { status: 500 }
    )
  }
}
