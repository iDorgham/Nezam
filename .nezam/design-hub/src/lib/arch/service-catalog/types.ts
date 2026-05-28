import type { ServiceKind } from '@/types/arch'

export interface ServiceIntegrationMcp {
  install: string
  config: string
  registryNote?: string
}

export interface ServiceIntegrationCli {
  install: string
  usage: string
}

export interface ServiceIntegration {
  apiSteps: string[]
  envVars: string[]
  mcp?: ServiceIntegrationMcp
  cli?: ServiceIntegrationCli
  agentPrompt: string
}

export interface CatalogProvider {
  id: string
  name: string
  categoryId: string
  categoryLabel: string
  description: string
  skills: string[]
  useCases: string[]
  pricing: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  serviceKind: ServiceKind
  simpleIconSlug: string
  hasCli: boolean
  hasMcp: boolean
  docsUrl: string
  nezamSkillPath?: string
  ownerAgent: string
  integration: ServiceIntegration
}

export interface ServiceCatalog {
  version: number
  generatedAt: string
  categories: Array<{ id: string; label: string }>
  providers: CatalogProvider[]
}
