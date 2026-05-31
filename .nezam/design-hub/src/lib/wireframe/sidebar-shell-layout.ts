export type WireframeSectionLike = { block_type?: string; order?: number }

function sortByOrder<T extends WireframeSectionLike>(sections: T[]): T[] {
  return [...sections].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
}

/** First block is Nav_Sidebar and there is at least one main block. */
export function isSidebarShellLayout(sections: WireframeSectionLike[]): boolean {
  if (sections.length <= 1) return false
  const ordered = sortByOrder(sections)
  return ordered[0]?.block_type === 'Nav_Sidebar'
}

export function splitSidebarShellSections<T extends WireframeSectionLike>(
  sections: T[],
): { sidebar: T | null; main: T[]; ordered: T[] } {
  const ordered = sortByOrder(sections)
  if (!isSidebarShellLayout(ordered)) {
    return { sidebar: null, main: ordered, ordered }
  }
  return { sidebar: ordered[0] ?? null, main: ordered.slice(1), ordered }
}
