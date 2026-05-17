export interface ProjectContext {
  pages: any[]
  sections: any[]
  design_tokens: Record<string, any>
  sitemap: any[]
}

export function parseProjectContext(data: unknown): ProjectContext {
  if (!data || typeof data !== 'object') {
    return {
      pages: [],
      sections: [],
      design_tokens: {},
      sitemap: [],
    }
  }

  const obj = data as Record<string, any>

  return {
    pages: Array.isArray(obj.pages) ? obj.pages : [],
    sections: Array.isArray(obj.sections) ? obj.sections : [],
    design_tokens: (obj.design_tokens && typeof obj.design_tokens === 'object') ? obj.design_tokens : {},
    sitemap: Array.isArray(obj.sitemap) ? obj.sitemap : [],
  }
}
