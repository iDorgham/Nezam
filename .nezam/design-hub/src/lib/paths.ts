import path from 'path'
import fs from 'fs'

/**
 * Resolve the true repository root.
 *
 * In the common dev flow we run:
 *   cd .nezam/design-hub && pnpm dev
 * so Next's process.cwd() is `.nezam/design-hub`.
 *
 * From `.nezam/design-hub` to repo root is `../..`.
 */
export function getProjectRoot(): string {
  const candidate = path.resolve(process.cwd(), '../..')
  // Prefer a real marker (package.json) to avoid weird cwd assumptions.
  if (fs.existsSync(path.join(candidate, 'package.json'))) return candidate
  return path.resolve(process.cwd())
}

export function getDesignProfilesDir() {
  return path.join(getProjectRoot(), '.nezam/design-hub/design')
}

export function getProjectContextPath() {
  return path.join(getProjectRoot(), 'project_context.json')
}

export function getBlockRegistryPath() {
  return path.join(getProjectRoot(), '.nezam/templates/wireframe-server/block_registry.json')
}

export function getDesignProfilePath(profileName: string) {
  return path.join(getDesignProfilesDir(), profileName, 'design.md')
}

export function getExportDesignPath() {
  return path.join(getProjectRoot(), 'DESIGN.md')
}

export function getExportWireframesPath() {
  return path.join(getProjectRoot(), 'wireframes_locked.json')
}

export function getAutosavePath() {
  return path.join(process.cwd(), '.session/autosave.json')
}

export function getPagesSessionDir() {
  return path.join(getProjectRoot(), '.session/pages')
}

export function getPageSessionPath(pageId: string) {
  return path.join(getPagesSessionDir(), `${pageId}.json`)
}

export function getCanvasSessionPath() {
  return path.join(getProjectRoot(), '.session/canvas.json')
}

