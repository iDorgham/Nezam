// Force reload after registry update
import fs from 'fs'
import path from 'path'
import { getBlockRegistryPath } from '../paths'

export interface BlockDefinition {
  type: string
  name: string
  canvas_modes: string[]
  description?: string
  props?: Record<string, { type: string, values?: string[], default?: any, description?: string }>
}

export interface BlockRegistry {
  $schemaVersion: string
  description: string
  canvas_modes: string[]
  blocks: Record<string, BlockDefinition[]>
}

let registryCache: BlockRegistry | null = null

export function getBlockRegistry(): BlockRegistry {
  if (registryCache) return registryCache

  const registryPath = getBlockRegistryPath()

  if (!fs.existsSync(registryPath)) {
    throw new Error(`Block registry not found at ${registryPath}`)
  }

  const content = fs.readFileSync(registryPath, 'utf8')
  registryCache = JSON.parse(content) as BlockRegistry
  return registryCache
}

export function getAllBlocks(): BlockDefinition[] {
  const registry = getBlockRegistry()
  const allBlocks: BlockDefinition[] = []
  
  Object.values(registry.blocks).forEach(categoryBlocks => {
    allBlocks.push(...categoryBlocks)
  })
  
  return allBlocks
}

export function getBlocksForMode(mode: string): BlockDefinition[] {
  return getAllBlocks().filter(block => block.canvas_modes.includes(mode))
}

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return getAllBlocks().find(block => block.type === type)
}
