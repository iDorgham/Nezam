import type { ArchPage } from '@/types/arch'

export type EligibleArchPage = ArchPage & { type: 'page' | 'subpage' }

export function isEligibleArchPage(page: ArchPage): page is EligibleArchPage {
  return page.type === 'page' || page.type === 'subpage'
}

export function getEligibleArchPages(archPages: Record<string, ArchPage>): EligibleArchPage[] {
  return Object.values(archPages)
    .filter(isEligibleArchPage)
    .sort((a, b) => (a.order - b.order) || a.id.localeCompare(b.id))
}

export function toLockPageId(index: number): string {
  return `PAGE-${String(index + 1).padStart(3, '0')}`
}

export function buildArchToLockMap(eligiblePages: EligibleArchPage[]): Record<string, string> {
  return Object.fromEntries(eligiblePages.map((page, idx) => [page.id, toLockPageId(idx)]))
}

export function resolveArchPageId(lockPageId: string, eligiblePages: EligibleArchPage[]): string | null {
  const index = eligiblePages.findIndex((_, idx) => toLockPageId(idx) === lockPageId)
  if (index < 0) return null
  return eligiblePages[index]?.id ?? null
}
