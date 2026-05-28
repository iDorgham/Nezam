import type { LockSitemapPage } from '@/lib/locking/build-lock-payload'

export type PagesOutForP0Validation = {
  page_id: string
  title: string
  route: string
  sections: unknown[]
}

export function validateP0Wireframes(params: {
  sitemap: LockSitemapPage[]
  pagesOut: PagesOutForP0Validation[]
}) {
  const { sitemap, pagesOut } = params
  const byId = new Map(pagesOut.map((p) => [p.page_id, p]))

  const errors: string[] = []

  for (const p of sitemap) {
    if (p.type === 'public' && p.priority === 'P0') {
      const out = byId.get(p.id)
      const sections = out?.sections ?? []
      if (sections.length === 0) {
        errors.push(
          `No P0 wireframe saved for "${p.title}" (${p.route}) — add at least one block and save the page session.`,
        )
      }
    }
  }

  return { errors }
}

