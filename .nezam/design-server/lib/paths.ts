import path from 'path'

// Get the actual project root (where the user runs the command from)
// process.cwd() will be the project root when running `cd .nezam/design-server && pnpm dev` from the root package.json
// Wait, if the command is `cd .nezam/design-server && pnpm dev`, process.cwd() is inside `.nezam/design-server`.
// Let's look at the instruction:
// "All .nezam/ paths resolved relative to process.cwd() (the repo root), NOT relative to the app's own directory."
// Wait, if the root package.json runs `cd .nezam/design-server && pnpm dev`, then inside Next.js, process.cwd() will be `/Users/.../.nezam/design-server`.
// Let's resolve to `../../` from process.cwd() to get the true repo root.
// Or we can use `path.join(process.cwd(), '../..')`.

export const getProjectRoot = () => {
  return path.join(process.cwd(), '../..')
}

export const getDesignProfilesDir = () => {
  return path.join(getProjectRoot(), '.nezam/design')
}

export const getProjectContextPath = () => {
  return path.join(getProjectRoot(), 'project_context.json')
}

export const getBlockRegistryPath = () => {
  return path.join(getProjectRoot(), '.nezam/templates/wireframe-server/block_registry.json')
}

export const getDesignProfilePath = (profileName: string) => {
  return path.join(getDesignProfilesDir(), profileName, 'design.md')
}

export const getExportDesignPath = () => {
  return path.join(getProjectRoot(), 'DESIGN.md')
}

export const getExportWireframesPath = () => {
  return path.join(getProjectRoot(), 'wireframes_locked.json')
}

export const getAutosavePath = () => {
  return path.join(process.cwd(), '.session/autosave.json')
}

export const getPagesSessionDir = () => {
  return path.join(getProjectRoot(), '.session/pages')
}

export const getPageSessionPath = (pageId: string) => {
  return path.join(getPagesSessionDir(), `${pageId}.json`)
}

