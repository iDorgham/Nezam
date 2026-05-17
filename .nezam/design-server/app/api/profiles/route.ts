import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getDesignProfilesDir, getDesignProfilePath } from '@/lib/paths'
import { parseProfile } from '@/lib/parsers/profile.parser'

export async function GET() {
  try {
    const profilesDir = getDesignProfilesDir()
    
    if (!fs.existsSync(profilesDir)) {
      return NextResponse.json({ profiles: [] })
    }

    const entries = await fs.promises.readdir(profilesDir, { withFileTypes: true })
    
    const profilePromises = entries.map(async (entry) => {
      if (entry.isDirectory()) {
        const profileName = entry.name
        const mdPath = getDesignProfilePath(profileName)
        
        try {
          const content = await fs.promises.readFile(mdPath, 'utf8')
          return parseProfile(profileName, content)
        } catch (e) {
          return null
        }
      }
      return null
    })

    const resolvedProfiles = await Promise.all(profilePromises)
    const profiles = resolvedProfiles.filter((p): p is NonNullable<typeof p> => p !== null)

    return NextResponse.json({ profiles })
  } catch (error: any) {
    console.error('Error reading design profiles:', error)
    return NextResponse.json(
      { error: 'Failed to read design profiles', details: error.message },
      { status: 500 }
    )
  }
}
