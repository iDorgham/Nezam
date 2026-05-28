import type { ArchProfileId } from '@/types/arch'

export type CanvasMode = 'web' | 'saas' | 'mobile'

export function inferCanvasMode(profileId: ArchProfileId | null): CanvasMode {
  if (profileId === 'mobile-app') return 'mobile'
  if (
    profileId === 'saas' ||
    profileId === 'analytics' ||
    profileId === 'enterprise' ||
    profileId === 'developer-console'
  ) {
    return 'saas'
  }
  return 'web'
}
