/**
 * Writes /tmp/nezam-hub-persist.json for Playwright hub UI spot-checks.
 * Run: pnpm exec vite-node scripts/generate-hub-persist.ts
 */
import { writeFileSync } from 'node:fs'
import { ARCH_PROFILES_MAP } from '../src/data/arch-profiles'
import { DESIGN_PROFILES_MAP } from '../src/data/design-profiles'
import type { ArchProfileId } from '../src/types/arch'

function pagesRecord(profileId: ArchProfileId) {
  const profile = ARCH_PROFILES_MAP[profileId]
  const pages: Record<string, unknown> = {}
  for (const pg of profile.pages) {
    pages[pg.id] = { ...pg }
  }
  return pages
}

function buildPersist(profileId: ArchProfileId, section: string) {
  return {
    state: {
      section,
      arch: {
        pages: pagesRecord(profileId),
        selectedPageId: null,
        selectedServiceId: null,
        activeProfileId: profileId,
      },
      design: {
        tokens: DESIGN_PROFILES_MAP.minimal.tokens,
        selectedCategory: 'colors',
        activeProfileId: 'minimal',
        showPreviewStrip: true,
        subTab: 'tokens',
      },
      theme: { previewOverride: null, savedProfiles: [], editorSnapshot: null },
      preview: {
        selectedPageId: null,
        device: 'desktop',
        rtl: false,
        comments: [],
        isAddingComment: false,
        subTab: 'preview',
        layerStateByPage: {},
      },
      onboarding: { completed: true, step: 0 },
      visitedSections: ['architecture', 'wireframes'],
      hubTheme: 'dark',
      sidebarWidth: 240,
      lockedAt: null,
    },
    version: 4,
  }
}

const out = {
  cms: buildPersist('cms', 'wireframes'),
  analytics: buildPersist('analytics', 'wireframes'),
}

writeFileSync('/tmp/nezam-hub-persist.json', JSON.stringify(out))
console.log('Wrote /tmp/nezam-hub-persist.json')
