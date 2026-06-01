import type { DesignTokens } from '@/types/design'
import { flattenTokens } from '@/lib/design/token-flattener'

export interface FigmaRgba {
  r: number
  g: number
  b: number
  a: number
}

export interface FigmaColorVariable {
  name: string
  path: string
  rgba: FigmaRgba
  hex: string
}

export interface FigmaSyncCollectionPreview {
  id: string
  name: string
  variableCount: number
}

export interface FigmaSyncResult {
  ok: boolean
  syncedAt: string
  collections: string[]
  created: number
  updated: number
  failed: number
  errors: string[]
}

const COLLECTION_NAME = 'Design Hub Tokens'

/** Convert #rgb / #rrggbb to Figma RGBA channels (0–1). */
export function hexToFigmaRgba(hex: string): FigmaRgba | null {
  const raw = hex.trim()
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(raw)
  if (!match) return null

  let h = match[1]!
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }

  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1

  return { r, g, b, a }
}

/** Map flattened color tokens to Figma variable payloads. */
export function buildColorVariables(tokens: DesignTokens): FigmaColorVariable[] {
  return flattenTokens(tokens)
    .filter((t) => t.value.startsWith('#'))
    .map((t) => {
      const rgba = hexToFigmaRgba(t.value)
      if (!rgba) return null
      return {
        name: t.path.replace(/\./g, '/'),
        path: t.path,
        rgba,
        hex: t.value,
      }
    })
    .filter((v): v is FigmaColorVariable => v !== null)
}

/** Collections shown in the confirmation dialog before sync. */
export function getSyncCollectionPreview(tokens: DesignTokens): FigmaSyncCollectionPreview[] {
  const colors = buildColorVariables(tokens).length
  const flat = flattenTokens(tokens)
  const groups: Record<string, number> = {}
  for (const row of flat) {
    groups[row.category] = (groups[row.category] ?? 0) + 1
  }

  const previews = Object.entries(groups).map(([name, variableCount]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    variableCount,
  }))

  if (colors > 0) {
    previews.unshift({ id: 'design-hub-colors', name: COLLECTION_NAME, variableCount: colors })
  }

  return previews
}

type FigmaLocalVariablesResponse = {
  meta?: {
    variableCollections?: Record<
      string,
      { id: string; name: string; modes?: Array<{ modeId: string; name: string }> }
    >
    variables?: Record<
      string,
      {
        id: string
        name: string
        variableCollectionId: string
        resolvedType: string
      }
    >
  }
}

async function figmaFetch<T>(
  accessToken: string,
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const data = (await res.json().catch(() => ({}))) as T & { err?: string; message?: string }
  if (!res.ok) {
    const msg =
      (data as { err?: string }).err ??
      (data as { message?: string }).message ??
      `Figma API ${res.status}`
    throw new Error(msg)
  }
  return data
}

/** Push color tokens to Figma via REST (server-only — requires Enterprise + file_variables:write). */
export async function pushTokensToFigma(params: {
  fileKey: string
  accessToken: string
  tokens: DesignTokens
}): Promise<FigmaSyncResult> {
  const { fileKey, accessToken, tokens } = params
  const syncedAt = new Date().toISOString()
  const colorVars = buildColorVariables(tokens)
  const errors: string[] = []

  if (colorVars.length === 0) {
    return {
      ok: false,
      syncedAt,
      collections: [],
      created: 0,
      updated: 0,
      failed: 0,
      errors: ['No hex color tokens found to sync.'],
    }
  }

  const local = await figmaFetch<FigmaLocalVariablesResponse>(
    accessToken,
    `https://api.figma.com/v1/files/${fileKey}/variables/local`,
  )

  const existingVars = local.meta?.variables ?? {}
  const byName = new Map<string, { id: string; collectionId: string }>()
  for (const v of Object.values(existingVars)) {
    byName.set(v.name, { id: v.id, collectionId: v.variableCollectionId })
  }

  let collectionId: string | null = null
  let modeId: string | null = null
  for (const col of Object.values(local.meta?.variableCollections ?? {})) {
    if (col.name === COLLECTION_NAME) {
      collectionId = col.id
      modeId = col.modes?.[0]?.modeId ?? null
      break
    }
  }

  const tempCollectionId = 'VariableCollectionId:0:0'
  const tempModeId = 'VariableModeId:0:0'
  const needsCollection = !collectionId

  const targetCollectionId = collectionId ?? tempCollectionId
  const targetModeId = modeId ?? tempModeId

  const variableCollections = needsCollection
    ? [
        {
          action: 'CREATE',
          id: tempCollectionId,
          name: COLLECTION_NAME,
          initialModeId: tempModeId,
        },
      ]
    : undefined

  const variableModes = needsCollection
    ? [
        {
          action: 'CREATE',
          id: tempModeId,
          name: 'Default',
          variableCollectionId: tempCollectionId,
        },
      ]
    : undefined

  const variables: Array<Record<string, unknown>> = []
  const variableModeValues: Array<Record<string, unknown>> = []
  let created = 0
  let updated = 0

  colorVars.forEach((cv, index) => {
    const existing = byName.get(cv.name)
    const tempVarId = `VariableID:0:${index}`

    if (existing) {
      variables.push({ action: 'UPDATE', id: existing.id, name: cv.name })
      variableModeValues.push({
        variableId: existing.id,
        modeId: targetModeId,
        value: cv.rgba,
      })
      updated += 1
    } else {
      variables.push({
        action: 'CREATE',
        id: tempVarId,
        name: cv.name,
        variableCollectionId: targetCollectionId,
        resolvedType: 'COLOR',
      })
      variableModeValues.push({
        variableId: tempVarId,
        modeId: targetModeId,
        value: cv.rgba,
      })
      created += 1
    }
  })

  const body: Record<string, unknown> = { variables, variableModeValues }
  if (variableCollections) body.variableCollections = variableCollections
  if (variableModes) body.variableModes = variableModes

  try {
    await figmaFetch(accessToken, `https://api.figma.com/v1/files/${fileKey}/variables`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Figma sync failed'
    errors.push(msg)
    return {
      ok: false,
      syncedAt,
      collections: getSyncCollectionPreview(tokens).map((c) => c.name),
      created,
      updated,
      failed: colorVars.length,
      errors,
    }
  }

  return {
    ok: true,
    syncedAt,
    collections: [COLLECTION_NAME, ...getSyncCollectionPreview(tokens).map((c) => c.name)],
    created,
    updated,
    failed: 0,
    errors,
  }
}
