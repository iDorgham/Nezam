import type { ArchProfileId } from '@/types/arch'

export type CanvasMode = 'web' | 'saas' | 'mobile'

export function inferCanvasMode(profileId: ArchProfileId | null): CanvasMode {
  if (profileId === 'mobile-app') return 'mobile'
  if (
    profileId === 'saas' ||
    profileId === 'analytics' ||
    profileId === 'enterprise' ||
    profileId === 'developer-console' ||
    profileId === 'ai-assistant' ||
    profileId === 'fintech' ||
    profileId === 'cms' ||
    profileId === 'task-manager'
  ) {
    return 'saas'
  }
  return 'web'
}
