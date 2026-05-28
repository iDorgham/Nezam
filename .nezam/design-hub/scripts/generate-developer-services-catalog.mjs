#!/usr/bin/env node
/**
 * Generates developer-services-catalog.json for template + design-hub bundle.
 * Run: node scripts/generate-developer-services-catalog.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const hubRoot = join(__dirname, '..')

const CATEGORIES = [
  { id: 'baas', label: 'BaaS & Databases' },
  { id: 'auth', label: 'Authentication' },
  { id: 'payments_mena', label: 'Payments (MENA)' },
  { id: 'payments_global', label: 'Payments (Global)' },
  { id: 'payments_egypt', label: 'Payments (Egypt)' },
  { id: 'search', label: 'Search & Discovery' },
  { id: 'storage', label: 'Storage & CDN' },
  { id: 'ai_llm', label: 'AI & LLM' },
  { id: 'email', label: 'Email & Messaging' },
  { id: 'analytics', label: 'Analytics & Product' },
  { id: 'hosting', label: 'Hosting & Deploy' },
  { id: 'monitoring', label: 'Monitoring & Observability' },
  { id: 'cms', label: 'CMS & Content' },
  { id: 'cache_realtime', label: 'Cache & Realtime' },
  { id: 'secrets', label: 'Secrets & Config' },
  { id: 'automation', label: 'Automation & Jobs' },
  { id: 'devtools', label: 'Developer Tools' },
]

const MCP_IDS = new Set([
  'supabase',
  'neon',
  'clerk',
  'stripe',
  'github',
  'gitlab',
  'vercel',
  'cloudflare',
  'sentry',
  'posthog',
  'firebase',
  'auth0',
  'openrouter',
  'prisma',
  'datadog',
])

/** @type {Array<Record<string, unknown>>} */
const RAW = [
  // BaaS
  { id: 'supabase', cat: 'baas', name: 'Supabase', kind: 'database', slug: 'supabase', owner: 'lead-database-architect', skill: 'backend/nezam-supabase-architect', docs: 'https://supabase.com/docs', price: 'Free tier + usage', diff: 'beginner' },
  { id: 'supabase-auth', cat: 'baas', name: 'Supabase Auth', kind: 'auth', slug: 'supabase', owner: 'auth-security-manager', docs: 'https://supabase.com/docs/guides/auth', price: 'Included with Supabase', diff: 'beginner' },
  { id: 'supabase-realtime', cat: 'baas', name: 'Supabase Realtime', kind: 'database', slug: 'supabase', owner: 'real-time-streaming-specialist', docs: 'https://supabase.com/docs/guides/realtime', price: 'Included with Supabase', diff: 'intermediate' },
  { id: 'neon', cat: 'baas', name: 'Neon Postgres', kind: 'database', slug: 'neon', owner: 'neon-database-architect', skill: 'backend/nezam-neon-postgres', docs: 'https://neon.tech/docs', price: 'Free tier + compute', diff: 'beginner', mcp: true },
  { id: 'planetscale', cat: 'baas', name: 'PlanetScale', kind: 'database', slug: 'planetscale', owner: 'lead-database-architect', docs: 'https://planetscale.com/docs', price: 'Hobby + paid', diff: 'intermediate' },
  { id: 'firebase', cat: 'baas', name: 'Firebase', kind: 'database', slug: 'firebase', owner: 'lead-backend-architect', skill: 'backend/nezam-firebase', docs: 'https://firebase.google.com/docs', price: 'Spark free + Blaze', diff: 'beginner', mcp: true },
  { id: 'mongodb-atlas', cat: 'baas', name: 'MongoDB Atlas', kind: 'database', slug: 'mongodb', owner: 'nosql-expert', docs: 'https://www.mongodb.com/docs/atlas', price: 'Free M0 + paid', diff: 'intermediate' },
  { id: 'drizzle-orm', cat: 'baas', name: 'Drizzle ORM', kind: 'database', slug: 'drizzle', owner: 'lead-database-architect', skill: 'backend/nezam-drizzle-orm', docs: 'https://orm.drizzle.team/docs', price: 'Open source', diff: 'intermediate', cli: true },
  { id: 'prisma', cat: 'baas', name: 'Prisma', kind: 'database', slug: 'prisma', owner: 'lead-database-architect', skill: 'backend/nezam-prisma-orm', docs: 'https://www.prisma.io/docs', price: 'Open source + platform', diff: 'intermediate', cli: true, mcp: true },
  { id: 'aiven', cat: 'baas', name: 'Aiven', kind: 'database', slug: 'aiven', owner: 'lead-database-architect', docs: 'https://aiven.io/docs', price: 'Trial + usage', diff: 'advanced' },
  // Auth
  { id: 'clerk', cat: 'auth', name: 'Clerk', kind: 'auth', slug: 'clerk', owner: 'auth-security-manager', skill: 'backend/nezam-clerk-auth', docs: 'https://clerk.com/docs', price: 'Free dev + MAU', diff: 'beginner', mcp: true },
  { id: 'auth0', cat: 'auth', name: 'Auth0', kind: 'auth', slug: 'auth0', owner: 'auth-security-manager', docs: 'https://auth0.com/docs', price: 'Free tier + B2B', diff: 'intermediate', mcp: true },
  { id: 'nextauth', cat: 'auth', name: 'NextAuth.js', kind: 'auth', slug: 'nextdotjs', owner: 'nextjs-app-architect', docs: 'https://authjs.dev', price: 'Open source', diff: 'intermediate' },
  { id: 'lucia', cat: 'auth', name: 'Lucia Auth', kind: 'auth', slug: 'lucia', owner: 'auth-security-manager', docs: 'https://lucia-auth.com', price: 'Open source', diff: 'advanced' },
  // Payments MENA
  { id: 'paymob', cat: 'payments_mena', name: 'Paymob', kind: 'payment', slug: 'paymob', owner: 'mena-payments-specialist', skill: 'backend/nezam-mena-payment-routing', docs: 'https://developers.paymob.com', price: 'Per transaction', diff: 'intermediate' },
  { id: 'fawry', cat: 'payments_mena', name: 'Fawry', kind: 'payment', slug: 'fawry', owner: 'mena-payments-specialist', docs: 'https://www.fawry.com/developers', price: 'Per transaction', diff: 'intermediate' },
  { id: 'tap-payments', cat: 'payments_mena', name: 'Tap Payments', kind: 'payment', slug: 'tap', owner: 'mena-payments-specialist', docs: 'https://developers.tap.company', price: 'Per transaction', diff: 'intermediate' },
  { id: 'moyasar', cat: 'payments_mena', name: 'Moyasar', kind: 'payment', slug: 'moyasar', owner: 'mena-payments-specialist', docs: 'https://docs.moyasar.com', price: 'Per transaction', diff: 'beginner' },
  // Payments Global
  { id: 'stripe', cat: 'payments_global', name: 'Stripe', kind: 'payment', slug: 'stripe', owner: 'payments-lead', skill: 'backend/nezam-stripe', docs: 'https://docs.stripe.com', price: 'Per transaction', diff: 'beginner', cli: true, mcp: true },
  { id: 'paypal', cat: 'payments_global', name: 'PayPal', kind: 'payment', slug: 'paypal', owner: 'payments-lead', docs: 'https://developer.paypal.com/docs', price: 'Per transaction', diff: 'intermediate' },
  { id: 'paddle', cat: 'payments_global', name: 'Paddle', kind: 'payment', slug: 'paddle', owner: 'saas-billing-architect', docs: 'https://developer.paddle.com', price: 'Revenue share', diff: 'intermediate' },
  // Egypt
  { id: 'accept-paymob', cat: 'payments_egypt', name: 'Accept (Paymob Egypt)', kind: 'payment', slug: 'paymob', owner: 'mena-payments-specialist', docs: 'https://developers.paymob.com/egypt', price: 'EGP transactions', diff: 'intermediate' },
  // Search
  { id: 'algolia', cat: 'search', name: 'Algolia', kind: 'api', slug: 'algolia', owner: 'search-cache-manager', docs: 'https://www.algolia.com/doc', price: 'Free trial + usage', diff: 'intermediate' },
  { id: 'typesense', cat: 'search', name: 'Typesense', kind: 'api', slug: 'typesense', owner: 'search-cache-manager', skill: 'backend/nezam-typesense-search', docs: 'https://typesense.org/docs', price: 'Cloud + self-host', diff: 'intermediate' },
  { id: 'meilisearch', cat: 'search', name: 'Meilisearch', kind: 'api', slug: 'meilisearch', owner: 'search-cache-manager', docs: 'https://www.meilisearch.com/docs', price: 'Open source + cloud', diff: 'beginner' },
  { id: 'pinecone', cat: 'search', name: 'Pinecone', kind: 'api', slug: 'pinecone', owner: 'vector-store-specialist', skill: 'backend/nezam-vector-db-qdrant', docs: 'https://docs.pinecone.io', price: 'Serverless pricing', diff: 'intermediate' },
  { id: 'qdrant', cat: 'search', name: 'Qdrant', kind: 'api', slug: 'qdrant', owner: 'vector-store-specialist', skill: 'backend/nezam-vector-db-qdrant', docs: 'https://qdrant.tech/documentation', price: 'Cloud + self-host', diff: 'intermediate' },
  // Storage
  { id: 'cloudinary', cat: 'storage', name: 'Cloudinary', kind: 'api', slug: 'cloudinary', owner: 'visual-asset-manager', docs: 'https://cloudinary.com/documentation', price: 'Free tier + credits', diff: 'beginner' },
  { id: 'aws-s3', cat: 'storage', name: 'AWS S3', kind: 'api', slug: 'amazons3', owner: 'lead-devops-performance', skill: 'infrastructure/nezam-aws-infra', docs: 'https://docs.aws.amazon.com/s3', price: 'Pay per use', diff: 'intermediate', cli: true },
  { id: 'vercel-blob', cat: 'storage', name: 'Vercel Blob', kind: 'api', slug: 'vercel', owner: 'lead-devops-performance', docs: 'https://vercel.com/docs/storage/vercel-blob', price: 'Usage-based', diff: 'beginner', mcp: true },
  { id: 'uploadthing', cat: 'storage', name: 'UploadThing', kind: 'api', slug: 'uploadthing', owner: 'frontend-lead', docs: 'https://docs.uploadthing.com', price: 'Free + paid', diff: 'beginner' },
  // AI / LLM
  { id: 'openai', cat: 'ai_llm', name: 'OpenAI API', kind: 'api', slug: 'openai', owner: 'prompt-engineer', skill: 'backend/nezam-vercel-ai-sdk', docs: 'https://platform.openai.com/docs', price: 'Token usage', diff: 'beginner' },
  { id: 'anthropic', cat: 'ai_llm', name: 'Anthropic API', kind: 'api', slug: 'anthropic', owner: 'prompt-engineer', docs: 'https://docs.anthropic.com', price: 'Token usage', diff: 'beginner' },
  { id: 'openrouter', cat: 'ai_llm', name: 'OpenRouter', kind: 'api', slug: 'openrouter', owner: 'prompt-engineer', skill: 'backend/nezam-openrouter', docs: 'https://openrouter.ai/docs', price: 'Pass-through + fee', diff: 'beginner', mcp: true },
  { id: 'vercel-ai-sdk', cat: 'ai_llm', name: 'Vercel AI SDK', kind: 'api', slug: 'vercel', owner: 'lead-modern-frontend-architect', skill: 'backend/nezam-vercel-ai-sdk', docs: 'https://sdk.vercel.ai/docs', price: 'Open source', diff: 'intermediate' },
  { id: 'gemini', cat: 'ai_llm', name: 'Google Gemini', kind: 'api', slug: 'googlegemini', owner: 'prompt-engineer', skill: 'backend/nezam-gemini-integration', docs: 'https://ai.google.dev/docs', price: 'Free tier + paid', diff: 'beginner' },
  { id: 'helicone', cat: 'ai_llm', name: 'Helicone', kind: 'api', slug: 'helicone', owner: 'lead-ai-ethics-officer', docs: 'https://docs.helicone.ai', price: 'Free tier + usage', diff: 'intermediate' },
  { id: 'langsmith', cat: 'ai_llm', name: 'LangSmith', kind: 'api', slug: 'langchain', owner: 'prompt-engineer', docs: 'https://docs.smith.langchain.com', price: 'Developer free + paid', diff: 'intermediate' },
  { id: 'tavily', cat: 'ai_llm', name: 'Tavily', kind: 'api', slug: 'tavily', owner: 'prompt-engineer', skill: 'system/nezam-tavily-research', docs: 'https://docs.tavily.com', price: 'Credits', diff: 'beginner' },
  { id: 'apify', cat: 'ai_llm', name: 'Apify', kind: 'api', slug: 'apify', owner: 'automation-manager', skill: 'backend/nezam-apify-scraper', docs: 'https://docs.apify.com', price: 'Free + compute units', diff: 'intermediate', cli: true },
  // Email
  { id: 'resend', cat: 'email', name: 'Resend', kind: 'api', slug: 'resend', owner: 'lead-backend-architect', skill: 'backend/nezam-resend-email', docs: 'https://resend.com/docs', price: 'Free tier + volume', diff: 'beginner', cli: true },
  { id: 'sendgrid', cat: 'email', name: 'SendGrid', kind: 'api', slug: 'sendgrid', owner: 'lead-backend-architect', docs: 'https://docs.sendgrid.com', price: 'Free tier + paid', diff: 'beginner' },
  { id: 'brevo', cat: 'email', name: 'Brevo', kind: 'api', slug: 'brevo', owner: 'content-workflow-manager', docs: 'https://developers.brevo.com', price: 'Free tier + paid', diff: 'beginner' },
  { id: 'loops', cat: 'email', name: 'Loops.so', kind: 'api', slug: 'loops', owner: 'content-strategist', docs: 'https://loops.so/docs', price: 'Free + paid', diff: 'beginner' },
  { id: 'onesignal', cat: 'email', name: 'OneSignal', kind: 'api', slug: 'onesignal', owner: 'mobile-push-notifications-specialist', docs: 'https://documentation.onesignal.com', price: 'Free tier + paid', diff: 'intermediate' },
  { id: 'novu', cat: 'email', name: 'Novu', kind: 'api', slug: 'novu', owner: 'mobile-push-notifications-specialist', docs: 'https://docs.novu.co', price: 'Open source + cloud', diff: 'intermediate' },
  // Analytics
  { id: 'posthog', cat: 'analytics', name: 'PostHog', kind: 'api', slug: 'posthog', owner: 'lead-analytics-architect', skill: 'infrastructure/nezam-product-analytics', docs: 'https://posthog.com/docs', price: 'Free tier + usage', diff: 'beginner', mcp: true },
  { id: 'mixpanel', cat: 'analytics', name: 'Mixpanel', kind: 'api', slug: 'mixpanel', owner: 'analytics-engineer', docs: 'https://docs.mixpanel.com', price: 'Free + growth', diff: 'intermediate' },
  { id: 'amplitude', cat: 'analytics', name: 'Amplitude', kind: 'api', slug: 'amplitude', owner: 'analytics-engineer', docs: 'https://www.docs.developers.amplitude.com', price: 'Free tier + enterprise', diff: 'intermediate' },
  { id: 'plausible', cat: 'analytics', name: 'Plausible', kind: 'api', slug: 'plausibleanalytics', owner: 'seo-specialist', docs: 'https://plausible.io/docs', price: 'Subscription', diff: 'beginner' },
  { id: 'google-analytics', cat: 'analytics', name: 'Google Analytics 4', kind: 'api', slug: 'googleanalytics', owner: 'seo-specialist', docs: 'https://developers.google.com/analytics', price: 'Free', diff: 'intermediate' },
  // Hosting
  { id: 'vercel', cat: 'hosting', name: 'Vercel', kind: 'api', slug: 'vercel', owner: 'lead-devops-performance', skill: 'infrastructure/nezam-vercel-deploy', docs: 'https://vercel.com/docs', price: 'Hobby + Pro', diff: 'beginner', cli: true, mcp: true },
  { id: 'netlify', cat: 'hosting', name: 'Netlify', kind: 'api', slug: 'netlify', owner: 'devops-manager', docs: 'https://docs.netlify.com', price: 'Free + paid', diff: 'beginner', cli: true },
  { id: 'cloudflare', cat: 'hosting', name: 'Cloudflare', kind: 'api', slug: 'cloudflare', owner: 'lead-devops-performance', skill: 'infrastructure/nezam-cloudflare-edge', docs: 'https://developers.cloudflare.com', price: 'Free + paid', diff: 'intermediate', mcp: true },
  { id: 'railway', cat: 'hosting', name: 'Railway', kind: 'api', slug: 'railway', owner: 'devops-manager', docs: 'https://docs.railway.app', price: 'Usage-based', diff: 'beginner', cli: true },
  { id: 'fly-io', cat: 'hosting', name: 'Fly.io', kind: 'api', slug: 'flydotio', owner: 'docker-k8s-specialist', docs: 'https://fly.io/docs', price: 'Pay as you go', diff: 'intermediate', cli: true },
  { id: 'render', cat: 'hosting', name: 'Render', kind: 'api', slug: 'render', owner: 'devops-manager', docs: 'https://render.com/docs', price: 'Free tier + paid', diff: 'beginner' },
  // Monitoring
  { id: 'sentry', cat: 'monitoring', name: 'Sentry', kind: 'api', slug: 'sentry', owner: 'sre-incident-specialist', docs: 'https://docs.sentry.io', price: 'Developer free + paid', diff: 'beginner', mcp: true },
  { id: 'datadog', cat: 'monitoring', name: 'Datadog', kind: 'api', slug: 'datadog', owner: 'observability-specialist', docs: 'https://docs.datadoghq.com', price: 'Trial + host pricing', diff: 'advanced', mcp: true },
  { id: 'betterstack', cat: 'monitoring', name: 'Better Stack', kind: 'api', slug: 'betterstack', owner: 'sre-incident-specialist', docs: 'https://betterstack.com/docs', price: 'Free tier + paid', diff: 'beginner' },
  { id: 'grafana', cat: 'monitoring', name: 'Grafana Cloud', kind: 'api', slug: 'grafana', owner: 'observability-specialist', docs: 'https://grafana.com/docs', price: 'Free tier + usage', diff: 'intermediate' },
  // CMS
  { id: 'sanity', cat: 'cms', name: 'Sanity', kind: 'api', slug: 'sanity', owner: 'cms-headless-architect', skill: 'backend/nezam-cms-integration', docs: 'https://www.sanity.io/docs', price: 'Free + growth', diff: 'intermediate', cli: true },
  { id: 'contentful', cat: 'cms', name: 'Contentful', kind: 'api', slug: 'contentful', owner: 'cms-headless-architect', docs: 'https://www.contentful.com/developers/docs', price: 'Free + paid', diff: 'intermediate' },
  { id: 'strapi', cat: 'cms', name: 'Strapi', kind: 'api', slug: 'strapi', owner: 'cms-manager', docs: 'https://docs.strapi.io', price: 'Open source + cloud', diff: 'intermediate' },
  { id: 'payload', cat: 'cms', name: 'Payload CMS', kind: 'api', slug: 'payloadcms', owner: 'cms-headless-architect', docs: 'https://payloadcms.com/docs', price: 'Open source + cloud', diff: 'intermediate' },
  { id: 'wordpress', cat: 'cms', name: 'WordPress', kind: 'api', slug: 'wordpress', owner: 'cms-manager', skill: 'cms-saas/nezam-wordpress', docs: 'https://developer.wordpress.org', price: 'Hosting varies', diff: 'beginner' },
  // Cache / Realtime
  { id: 'upstash-redis', cat: 'cache_realtime', name: 'Upstash Redis', kind: 'database', slug: 'upstash', owner: 'search-cache-manager', docs: 'https://upstash.com/docs/redis', price: 'Pay per request', diff: 'beginner', cli: true },
  { id: 'redis-cloud', cat: 'cache_realtime', name: 'Redis Cloud', kind: 'database', slug: 'redis', owner: 'search-cache-manager', docs: 'https://redis.io/docs', price: 'Free + paid', diff: 'intermediate' },
  { id: 'aws-elasticache', cat: 'cache_realtime', name: 'AWS ElastiCache', kind: 'database', slug: 'amazonwebservices', owner: 'lead-devops-performance', docs: 'https://docs.aws.amazon.com/elasticache', price: 'Instance hours', diff: 'advanced' },
  { id: 'pusher', cat: 'cache_realtime', name: 'Pusher', kind: 'api', slug: 'pusher', owner: 'real-time-streaming-specialist', docs: 'https://pusher.com/docs', price: 'Free + channels', diff: 'beginner' },
  { id: 'ably', cat: 'cache_realtime', name: 'Ably', kind: 'api', slug: 'ably', owner: 'real-time-streaming-specialist', docs: 'https://ably.com/docs', price: 'Free tier + usage', diff: 'intermediate' },
  // Secrets
  { id: 'doppler', cat: 'secrets', name: 'Doppler', kind: 'api', slug: 'doppler', owner: 'encryption-privacy-specialist', docs: 'https://docs.doppler.com', price: 'Free team + paid', diff: 'beginner', cli: true },
  { id: 'infisical', cat: 'secrets', name: 'Infisical', kind: 'api', slug: 'infisical', owner: 'encryption-privacy-specialist', docs: 'https://infisical.com/docs', price: 'Open source + cloud', diff: 'intermediate', cli: true },
  { id: 'hashicorp-vault', cat: 'secrets', name: 'HashiCorp Vault', kind: 'api', slug: 'vault', owner: 'lead-security-officer', docs: 'https://developer.hashicorp.com/vault/docs', price: 'OSS + enterprise', diff: 'advanced' },
  // Automation
  { id: 'inngest', cat: 'automation', name: 'Inngest', kind: 'api', slug: 'inngest', owner: 'task-automation-specialist', docs: 'https://www.inngest.com/docs', price: 'Free tier + usage', diff: 'intermediate', cli: true },
  { id: 'trigger-dev', cat: 'automation', name: 'Trigger.dev', kind: 'api', slug: 'triggerdotdev', owner: 'task-automation-specialist', skill: 'backend/nezam-trigger-dev', docs: 'https://trigger.dev/docs', price: 'Free + paid', diff: 'intermediate', cli: true },
  { id: 'temporal', cat: 'automation', name: 'Temporal', kind: 'api', slug: 'temporal', owner: 'task-workflow-architect', docs: 'https://docs.temporal.io', price: 'Cloud + self-host', diff: 'advanced' },
  // Devtools
  { id: 'github', cat: 'devtools', name: 'GitHub', kind: 'api', slug: 'github', owner: 'gitops-engineer', skill: 'external/nezam-git-workflow', docs: 'https://docs.github.com', price: 'Free + Teams', diff: 'beginner', cli: true, mcp: true },
  { id: 'gitlab', cat: 'devtools', name: 'GitLab', kind: 'api', slug: 'gitlab', owner: 'gitops-engineer', docs: 'https://docs.gitlab.com', price: 'Free + paid', diff: 'intermediate', mcp: true },
  { id: 'expo', cat: 'devtools', name: 'Expo', kind: 'api', slug: 'expo', owner: 'lead-mobile-architect', docs: 'https://docs.expo.dev', price: 'Free + EAS', diff: 'beginner', cli: true },
]

function catLabel(catId) {
  return CATEGORIES.find((c) => c.id === catId)?.label ?? catId
}

function buildIntegration(row) {
  const envKey = row.id.toUpperCase().replace(/-/g, '_')
  const hasMcp = row.mcp === true || MCP_IDS.has(row.id)
  const hasCli = row.cli === true
  const steps = [
    `Sign up or open the ${row.name} dashboard (${row.docs}).`,
    `Create a project/app and generate API keys or connection strings.`,
    `Add secrets to \`.env.local\` (never commit): ${envKey}_API_KEY or provider-specific vars.`,
    row.skill
      ? `Follow NEZAM skill \`.cursor/skills/${row.skill}/SKILL.md\` for stack-specific patterns.`
      : `Wire the SDK per official docs; validate in a staging environment.`,
  ]
  const integration = {
    apiSteps: steps,
    envVars: [`${envKey}_API_KEY`, `${envKey}_SECRET`].slice(0, row.kind === 'auth' ? 2 : 1),
    agentPrompt: `Integrate ${row.name} (${row.id}) for ${row.useCases ?? 'product features'}. Owner agent: ${row.owner}. Read ${row.docs} and use governed tokens from DESIGN.md. Do not hardcode secrets.`,
  }
  if (hasMcp) {
    integration.mcp = {
      install: 'See .nezam/core/memory/MCP_REGISTRY.md — enable the matching MCP server in Cursor settings.',
      config: JSON.stringify({ provider: row.id }, null, 2),
      registryNote: MCP_IDS.has(row.id) ? 'Listed in NEZAM MCP_REGISTRY' : 'Verify MCP availability before enabling',
    }
  }
  if (hasCli) {
    const pkg = row.cliPkg ?? (row.id === 'vercel' ? 'vercel' : row.id === 'github' ? 'gh' : row.id)
    integration.cli = {
      install: `npm install -g ${pkg}  # or use npx ${pkg}`,
      usage: `${pkg} --help`,
    }
  }
  return integration
}

const providers = RAW.map((row) => {
  const categoryId = row.cat
  const useCases =
    row.kind === 'payment'
      ? ['Checkout', 'Subscriptions', 'Invoicing']
      : row.kind === 'auth'
        ? ['Sign-in', 'Sessions', 'RBAC']
        : row.kind === 'database'
          ? ['Persistence', 'Migrations', 'Backups']
          : ['API integration', 'Automation', 'Observability']
  return {
    id: row.id,
    name: row.name,
    categoryId,
    categoryLabel: catLabel(categoryId),
    description: `${row.name} — ${catLabel(categoryId)} integration for NEZAM projects.`,
    skills: row.skill ? [row.skill.replace(/^[^/]+\//, 'nezam-')] : ['system/nezam-llm-integration'],
    useCases,
    pricing: row.price,
    difficulty: row.diff,
    serviceKind: row.kind,
    simpleIconSlug: row.slug,
    hasCli: row.cli === true,
    hasMcp: row.mcp === true || MCP_IDS.has(row.id),
    docsUrl: row.docs,
    ...(row.skill ? { nezamSkillPath: `.cursor/skills/${row.skill}/SKILL.md` } : {}),
    ownerAgent: row.owner,
    integration: buildIntegration({ ...row, useCases: useCases.join(', ') }),
  }
})

const catalog = {
  version: 1,
  generatedAt: new Date().toISOString(),
  categories: CATEGORIES,
  providers,
}

const outBundled = join(hubRoot, 'src/data/design-hub/developer-services-catalog.json')
const outTemplate = join(hubRoot, '../../templates/design-hub/developer-services-catalog.json')

mkdirSync(dirname(outBundled), { recursive: true })
mkdirSync(dirname(outTemplate), { recursive: true })

const json = JSON.stringify(catalog, null, 2)
writeFileSync(outBundled, json + '\n')
writeFileSync(outTemplate, json + '\n')

console.log(`Wrote ${providers.length} providers to:\n  ${outBundled}\n  ${outTemplate}`)
