import { NextResponse } from 'next/server'
import { z } from 'zod'
import { DesignPresetSchema, DesignTokensSchema } from '@/src/types/tokens.types'

// ── Request schema ────────────────────────────────────────────────────────────

const SaveRequestSchema = z.object({
  name:          z.string().min(1, 'Preset name required'),
  tokens:        DesignTokensSchema.partial(),
  existingSlugs: z.array(z.string()).default([]),
  force:         z.boolean().default(false),
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Request body must be valid JSON' }, { status: 400 })
  }

  const parsed = SaveRequestSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    // AC-005: empty name → EMPTY_NAME code so client renders inline border-ds-destructive error
    if (firstIssue?.path.includes('name')) {
      return NextResponse.json(
        { error: 'EMPTY_NAME', message: 'Preset name required' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'VALIDATION_ERROR', message: firstIssue?.message ?? 'Invalid request' },
      { status: 400 }
    )
  }

  const { name, tokens, existingSlugs, force } = parsed.data
  const slug = toSlug(name)

  if (!slug) {
    return NextResponse.json(
      { error: 'EMPTY_NAME', message: 'Preset name required' },
      { status: 400 }
    )
  }

  // AC-006: collision check against client-supplied slug list
  if (!force && existingSlugs.includes(slug)) {
    return NextResponse.json(
      { error: 'COLLISION', slug, message: `A preset named "${name}" already exists` },
      { status: 409 }
    )
  }

  const now = new Date().toISOString()

  const preset = DesignPresetSchema.parse({
    id:        `user-${slug}`,
    name,
    slug,
    isSystem:  false,
    tokens,
    createdAt: now,
    updatedAt: now,
  })

  return NextResponse.json({ preset })
}
