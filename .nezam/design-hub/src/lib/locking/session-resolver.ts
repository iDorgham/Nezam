type SitempPageLookup = {
  id: string
  arch_page_id?: string
}

export function readSessionForSitemapPage(
  page: SitempPageLookup,
  readSession: (pageId: string) => unknown | null
): { session: unknown; sessionPageId: string } {
  const primaryId = page.arch_page_id ?? page.id
  const primarySession = readSession(primaryId)
  if (primarySession) return { session: primarySession, sessionPageId: primaryId }

  if (/^PAGE-[0-9]{3}$/.test(page.id)) {
    const legacySession = readSession(page.id)
    if (legacySession) return { session: legacySession, sessionPageId: page.id }
  }

  return { session: null, sessionPageId: primaryId }
}
