import { z } from 'zod'

export const projectContextSchema = z.object({
  pages: z.array(z.any()).optional().default([]),
  sections: z.array(z.any()).optional().default([]),
  design_tokens: z.record(z.any()).optional().default({}),
  sitemap: z.array(z.any()).optional().default([]),
})

export type ProjectContext = z.infer<typeof projectContextSchema>

export function parseProjectContext(data: unknown): ProjectContext {
  return projectContextSchema.parse(data)
}
