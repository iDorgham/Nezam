import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getDesignProfilePath } from '@/lib/paths'
import { parseProfile, serializeTokensToMarkdown } from '@/lib/parsers/profile.parser'

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const profileName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    const body = await request.json()
    const { tokens } = body

    if (!tokens) {
      return NextResponse.json({ error: 'Missing tokens in body' }, { status: 400 })
    }

    const mdPath = getDesignProfilePath(profileName)
    const dir = path.dirname(mdPath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const markdown = serializeTokensToMarkdown(profileName, tokens)
    fs.writeFileSync(mdPath, markdown, 'utf8')

    const parsed = parseProfile(profileName, markdown)

    return NextResponse.json({ success: true, profile: parsed })
  } catch (error: any) {
    console.error(`Error saving profile:`, error)
    return NextResponse.json(
      { error: 'Failed to save profile', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const profileName = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    const mdPath = getDesignProfilePath(profileName)
    const dir = path.dirname(mdPath)

    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath)
    }

    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
      if (files.length === 0) {
        fs.rmdirSync(dir)
      }
    }

    return NextResponse.json({ success: true, message: `Profile ${profileName} deleted successfully` })
  } catch (error: any) {
    console.error(`Error deleting profile:`, error)
    return NextResponse.json(
      { error: 'Failed to delete profile', details: error.message },
      { status: 500 }
    )
  }
}


