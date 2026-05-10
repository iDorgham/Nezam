# Developer tech stack reference (2026)

Curated catalog of common **BaaS**, **AI**, **auth**, **payments**, **media**, **infra**, **observability**, and **tooling** services. Use it to compare **CLI** and **MCP** availability (including common Cursor/IDE integrations), **documentation** entry points, **AI-related capabilities**, and rough **difficulty**.

**Legend**

| Symbol | Meaning |
| --- | --- |
| **CLI** | Official or widely used command-line tooling for day-to-day workflows |
| **MCP** | [Model Context Protocol](https://modelcontextprotocol.io/) server or first-party integration commonly used from AI IDEs (availability varies by host) |
| **Difficulty** | **Low** = quick onboarding; **Medium** = multiple concepts or ops work; **High** = security/compliance, distributed systems, or heavy customization |

**Difficulty** is subjective and depends on stack and team; it encodes typical time-to-productive for a mid-level web developer.

---

## BaaS & data

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Supabase** | Open-source Firebase-style platform on **PostgreSQL** (DB, Auth, Storage, Edge Functions, Realtime). | Medium | Yes | Yes | pgvector, AI guides, Edge for inference/RAG patterns | [AI & vectors](https://supabase.com/docs/guides/ai) | SaaS backends, realtime dashboards, mobile/Web auth | [Supabase docs](https://supabase.com/docs) |
| **Prisma** | Type-safe **ORM** and migration tooling for Node/TS; Prisma Postgres option. | Medium | Yes | No* | Prisma Optimize (query insights); vector types in Postgres workflows | [Prisma Optimize](https://www.prisma.io/optimize) | Relational apps, serverless APIs, typed data access | [Prisma docs](https://www.prisma.io/docs) |
| **Neon** | **Serverless Postgres**, branching, scale-to-zero. | Medium | Yes | Yes† | AI app patterns, branching for preview DBs | [AI on Neon](https://neon.tech/docs/guides/ai-apps) | Preview environments, multi-tenant SaaS, edge-friendly APIs | [Neon docs](https://neon.tech/docs) |
| **Turso** | **libSQL** (SQLite at the edge) with replication; vector search. | Medium | Yes | No* | Edge-friendly vector search via libSQL | [Turso docs (search)](https://docs.turso.tech) | Globally low-latency apps, embedded/edge data | [Turso documentation](https://docs.turso.tech) |
| **Cloudflare D1** | **Serverless SQL** on Cloudflare’s network. | Medium | Yes | Yes | Pairs with Workers AI, Vectorize for RAG patterns | [D1](https://developers.cloudflare.com/d1/) | Edge-first APIs, IoT/session data at the edge | [D1 docs](https://developers.cloudflare.com/d1/) |
| **Firebase** | Google **BaaS** (Firestore, Auth, hosting, FCM, etc.). | Medium | Yes | Yes | **Genkit** for AI/Gemini/Vertex-style flows | [Firebase Genkit](https://firebase.google.com/docs/genkit) | Mobile/web MVPs, rapid prototypes | [Firebase docs](https://firebase.google.com/docs) |
| **MongoDB Atlas** | Managed **MongoDB** with search and vector features. | Medium | Yes | No* | Atlas Vector Search for RAG | [Atlas Vector Search](https://www.mongodb.com/products/platform/atlas-vector-search) | Content, catalogs, flexible schemas at scale | [Atlas documentation](https://www.mongodb.com/docs/atlas/) |
| **PlanetScale** | **MySQL** platform with branching, deploy requests, and scale-out posture. | Medium | Yes | No* | Operational ergonomics over “AI-native” features | [PlanetScale](https://planetscale.com/) | Product databases, safe migration workflows | [PlanetScale docs](https://planetscale.com/docs) |
| **Upstash** | **Serverless Redis**, QStash (HTTP queues), Kafka, workflow primitives. | Medium | Yes | No* | Caching and rate limits for AI/LLM gateways | [Upstash](https://upstash.com/) | Cache, sessions, background delivery | [Upstash docs](https://upstash.com/docs) |
| **Convex** | **Reactive backend**: functions plus realtime sync data for TypeScript. | Medium | Yes | No* | Live queries and collaboration-friendly data model | [Convex](https://www.convex.dev/) | Real-time apps, fast product iteration | [Convex docs](https://docs.convex.dev/) |
| **Appwrite** | **Open-source BaaS** (cloud or self-host) with broad SDK coverage. | Medium | Yes | No* | Batteries included; AI features are DIY | [Appwrite](https://appwrite.io/) | OSS-heavy teams, private deployments | [Appwrite docs](https://appwrite.io/docs) |
| **Drizzle ORM** | **SQL-first ORM** for TypeScript with Drizzle Kit migrations. | Medium | Yes | No* | Type-safe SQL; pairs cleanly with Neon/Postgres | [Drizzle ORM](https://orm.drizzle.team/) | Relational apps without heavy ORM magic | [Drizzle docs](https://orm.drizzle.team/docs/overview) |

\*MCP availability varies by IDE vendor; “No” means no widely bundled first-party MCP in most setups at time of writing.  
†Neon is available as a Postgres MCP integration in many Cursor-style environments.

---

## AI hub & LLM

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **OpenRouter** | Unified **API** to many model providers. | Low | Yes | Yes | Routing, fallbacks, usage visibility | [OpenRouter](https://openrouter.ai/) | Multi-model agents, cost-aware routing | [OpenRouter docs](https://openrouter.ai/docs) |
| **Vercel AI SDK** | **UI/streaming/tools** primitives for TS/React (provider-agnostic). | Medium | Yes | Yes | Streaming, tool-calling, provider adapters | [AI SDK](https://sdk.vercel.ai/) | Chat UIs, structured LLM outputs, RAG UIs | [AI SDK docs](https://sdk.vercel.ai/docs) |
| **Google AI Studio** | Workspace for **Gemini** API keys, prompts, prototyping. | Low | Yes | No | Multimodal Gemini models | [Google AI for developers](https://ai.google.dev/) | Assistants, multimodal pipelines | [Google AI docs](https://ai.google.dev/gemini-api/docs) |
| **Groq** | **LPU**-backed hosted inference (latency-focused). | Low | No | No | Very fast inference on supported models | [Groq Console](https://console.groq.com/) | Voice, realtime assistants | [Groq API docs](https://console.groq.com/docs) |
| **Helicone** | **LLM observability** (logging, cache, sessions, prompts). | Low | No | Yes | Gateway features, evaluations (product evolves) | [Helicone](https://helicone.ai/) | Cost/prompt debugging, prod LLM tracing | [Helicone docs](https://docs.helicone.ai/) |
| **LangSmith** | **Tracing/evals** for LangChain/LangGraph-style apps. | Medium | Yes | No | Datasets, evaluators, tracing | [LangSmith](https://smith.langchain.com/) | LLM QA, agent reliability work | [LangSmith docs](https://docs.smith.langchain.com/) |
| **Pinecone** | Managed **vector** database. | Medium | Yes | No | Large-scale vector search for RAG | [Pinecone](https://www.pinecone.io/) | Long-term memory, semantic retrieval | [Pinecone docs](https://docs.pinecone.io/) |
| **Mistral AI** | **Models + API** (open-weights lineage, EU options). | Low | No | No | Strong multilingual/enterprise positioning | [Mistral](https://mistral.ai/) | EU sovereignty, custom assistants | [Mistral docs](https://docs.mistral.ai/) |
| **GitHub Models** | **Hosted model access** in GitHub ecosystem. | Medium | Yes | Yes | In-repo/agent workflows integrated with GitHub | [Models in GitHub](https://github.com/marketplace/models) | Prototyping inside GitHub Actions/Copilot flows | [GitHub Models docs](https://docs.github.com/github-models) |
| **Cloudflare Workers AI** | **Inference** on Cloudflare’s network. | Medium | Yes | Yes | Llama, Whisper, and related models at the edge | [Workers AI](https://developers.cloudflare.com/workers-ai/) | Edge inference, low-latency AI | [Workers AI docs](https://developers.cloudflare.com/workers-ai/) |
| **OpenAI** | **GPT** family APIs: chat, embeddings, images, audio, tools. | Low | Yes | No* | Largest ecosystem of examples and third-party tooling | [OpenAI Platform](https://platform.openai.com/) | General LLM products, agents, embeddings | [OpenAI API docs](https://platform.openai.com/docs) |
| **Anthropic** | **Claude** models via Messages API and platform tools. | Low | Yes | No* | Long-context, strong reasoning defaults | [Anthropic](https://www.anthropic.com/) | Coding agents, enterprise assistants | [Anthropic docs](https://docs.anthropic.com/) |
| **Azure OpenAI** | **Enterprise** OpenAI models inside Microsoft Azure. | Medium | Yes | No* | Private networking, policy, and compliance posture | [Azure OpenAI Service](https://azure.microsoft.com/products/ai-services/openai-service) | Regulated orgs already on Azure | [Azure OpenAI docs](https://learn.microsoft.com/azure/ai-services/openai/) |
| **Amazon Bedrock** | **Unified** access to many foundation models on AWS. | Medium | Yes | No* | Pick models and route with IAM/VPC controls | [Amazon Bedrock](https://aws.amazon.com/bedrock/) | AWS-native generative AI workloads | [Bedrock docs](https://docs.aws.amazon.com/bedrock/) |
| **Cohere** | **Embeddings**, rerank, and command models with multilingual focus. | Low | Yes | No* | Retrieval and classification strengths | [Cohere](https://cohere.com/) | Enterprise search, classification, RAG | [Cohere docs](https://docs.cohere.com/) |
| **Together AI** | **Fast inference** for open-weight and partner models. | Low | Yes | No* | Cost/latency tuned for OSS-style workloads | [Together AI](https://www.together.ai/) | Open model serving, fine-tuning | [Together docs](https://docs.together.ai/) |
| **Replicate** | **Model marketplace** that runs open models over HTTP. | Low | Yes | No* | Rapid experimentation across modalities | [Replicate](https://replicate.com/) | Image/video experiments, quick prototypes | [Replicate docs](https://replicate.com/docs) |
| **Hugging Face** | **Hub + Inference** for models, datasets, and spaces. | Medium | Yes | No* | Community OSS models and hardware partners | [Hugging Face](https://huggingface.co/) | OSS ML, embeddings, fine-tunes | [HF docs](https://huggingface.co/docs) |
| **Langfuse** | **LLM engineering**: tracing, prompt management, evals, datasets. | Medium | Yes | No* | Popular OSS pattern for production LLM ops | [Langfuse](https://langfuse.com/) | Ship and debug agents safely | [Langfuse docs](https://langfuse.com/docs) |
| **Qdrant** | **Vector** database (managed + self-host) focused on speed/filters. | Medium | Yes | No* | Payload filters + hybrid patterns for RAG | [Qdrant](https://qdrant.tech/) | Semantic search, recommendation systems | [Qdrant docs](https://qdrant.tech/documentation/) |
| **Weaviate** | **Vector** database with modules and GraphQL ergonomics. | Medium | Yes | No* | Built-in chunkers/connectors in ecosystem | [Weaviate](https://weaviate.io/) | Multimodal knowledge bases | [Weaviate docs](https://weaviate.io/developers/weaviate) |

---

## Auth & identity

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Clerk** | **Hosted auth** with React/Next components and B2B/org features. | Low | Limited | Yes | Fraud/bot signals; Copilot-style DX focus (product marketing) | [Clerk docs home](https://clerk.com/docs) | SaaS auth, organizations, SSO-ready paths | [Clerk documentation](https://clerk.com/docs) |
| **Supabase Auth** | **Auth** integrated with Supabase (email/OAuth/magic links). | Medium | Yes | Yes | Security docs for DB + auth patterns | [Supabase Auth](https://supabase.com/docs/guides/auth) | Mobile/web apps paired with Postgres | [Supabase docs](https://supabase.com/docs) |
| **Auth0** | **Enterprise IAM** (Universal Login, rules/actions, B2B). | High | Limited | Yes | Adaptive access, enterprise features | [Auth0 docs](https://auth0.com/docs) | Enterprise SSO, compliance-heavy IAM | [Auth0 documentation](https://auth0.com/docs) |
| **Firebase Auth** | **Google-backed** consumer auth patterns. | Medium | Yes | No | Integrates with broader Google/Firebase security | [Firebase Authentication](https://firebase.google.com/docs/auth) | Mobile-centric apps, Google sign-in heavy | [Firebase Auth docs](https://firebase.google.com/docs/auth) |
| **ZITADEL** | Cloud-native **OIDC/IAM** with strong org/B2B features. | High | No | Yes | Enterprise RBAC/OIDC (not “LLM-native”) | [ZITADEL](https://zitadel.com/) | Regulated orgs, multi-tenant IAM | [ZITADEL docs](https://zitadel.com/docs) |
| **Keycloak** | **Self-hosted** open-source IdP. | High | Yes | Yes* | Fully customizable; AI is DIY/plugins | [Keycloak](https://www.keycloak.org/) | On-prem, air-gapped, heavy customization | [Keycloak documentation](https://www.keycloak.org/documentation) |
| **WorkOS** | **Enterprise SSO**, Directory Sync, and HR-driven provisioning APIs. | Medium | Yes | No* | Ship SAML/OIDC to customers without rebuilding IdP glue | [WorkOS](https://workos.com/) | B2B SaaS SSO and org onboarding | [WorkOS docs](https://workos.com/docs) |
| **Okta** | **Identity platform** for workforce and customer use cases. | High | Limited | No* | Threat intelligence and adaptive policies (tier-dependent) | [Okta](https://www.okta.com/) | Large enterprise IAM programs | [Okta developer](https://developer.okta.com/) |
| **AWS Cognito** | **Managed auth** for apps: user pools, identity pools, hosted UI. | Medium | Yes | No* | Deep integration with API Gateway, Lambda, mobile SDKs | [Amazon Cognito](https://aws.amazon.com/cognito/) | AWS-native mobile and web stacks | [Cognito docs](https://docs.aws.amazon.com/cognito/) |

---

## Payments

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Stripe** | **Global payments**, billing, Connect, Radar fraud. | Medium | Yes | Yes | Radar and agentic commerce surfaces (per Stripe roadmap) | [Stripe docs](https://docs.stripe.com/) | SaaS billing, marketplaces, subscriptions | [Stripe documentation](https://docs.stripe.com/) |
| **PayPal** | **Consumer + merchant** payments. | Medium | No | No | Fraud tooling (vendor-side) | [PayPal Developer](https://developer.paypal.com/) | International consumer checkout | [PayPal developer](https://developer.paypal.com/docs/) |
| **Paymob** | **MENA** gateway. | Medium | No | No | Regional risk/fraud tooling | [Paymob](https://www.paymob.com/) | Egypt/MENA ecommerce | [Paymob docs](https://docs.paymob.com/) |
| **Fawry** | **Egypt** digital payments network. | Medium | No | No | Traditional gateway (not LLM-centric) | [Fawry for developers](https://developer.fawrystaging.com/) | Bill pay, cash/light digital flows in Egypt | [Fawry API (staging portal)](https://developer.fawrystaging.com/) |
| **PayTabs** | **MENA** payments processor. | Medium | No | No | Regional acquiring | [PayTabs](https://site.paytabs.com/en/) | Middle East ecommerce | [PayTabs developer](https://docs.paytabs.com/) |
| **Mollie** | **EU**-friendly payments. | Medium | No | No | Localized EU methods | [Mollie](https://www.mollie.com/) | European ecommerce | [Mollie API docs](https://docs.mollie.com/) |
| **Klarna** | **BNPL + payments** network. | Medium | No | No | BNPL UX, financing | [Klarna for developers](https://developers.klarna.com/) | Retail BNPL, high-ticket ecommerce | [Klarna developer docs](https://developers.klarna.com/) |
| **GoCardless** | **Bank debit** (direct debit, open banking). | Medium | No | No | Recurring bank payments | [GoCardless](https://gocardless.com/) | B2B invoicing, subscriptions (bank rails) | [GoCardless API](https://developer.gocardless.com/) |
| **Adyen** | **Global payments** platform (online, in-person, unified reporting). | High | Yes | No* | Risk and conversion tooling at platform depth | [Adyen](https://www.adyen.com/) | Enterprise retail and marketplaces | [Adyen docs](https://docs.adyen.com/) |
| **Square** | **Payments + seller** software (POS, online, hardware). | Medium | Yes | No* | Omnichannel commerce for SMBs | [Square](https://squareup.com/) | Retail, restaurants, invoices | [Square developer](https://developer.squareup.com/) |
| **Tap Payments** | **Regional** acquirer focused on **MENA/GCC** coverage. | Medium | Yes | No* | Local methods and compliance posture | [Tap Payments](https://www.tap.company/) | GCC/MENA ecommerce and platforms | [Tap API docs](https://developers.tap.company/) |

---

## Storage & media

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Cloudflare R2** | **S3-compatible** object storage; egress-friendly pricing model. | Medium | Yes | Yes | Pairs with Workers for media/AI pipelines | [R2](https://developers.cloudflare.com/r2/) | User uploads, static/software delivery | [R2 docs](https://developers.cloudflare.com/r2/) |
| **Cloudinary** | **Image/video** pipeline (transforms, optimization, AI). | Medium | Yes | No | AI cropping, generative/editing features (product) | [Cloudinary AI](https://cloudinary.com/documentation/cloudinary_ai) | Dynamic imagery, video-on-demand | [Cloudinary docs](https://cloudinary.com/documentation) |
| **Backblaze B2** | **Object storage** (S3 compatible API). | Medium | Yes | No | Durable/cheap storage focus | [B2 docs](https://www.backblaze.com/b2/docs/) | Archives, backups, large blobs | [Backblaze B2 docs](https://www.backblaze.com/b2/docs/) |
| **DigitalOcean Spaces** | **S3-compatible** object storage + CDN integration. | Low | Yes | No | Straightforward object storage | [Spaces](https://docs.digitalocean.com/products/spaces/) | Static assets, small product media | [DigitalOcean Spaces docs](https://docs.digitalocean.com/products/spaces/) |
| **Mux** | **Video** API (encoding, playback, live, data). | Medium | Yes | No | AI captioning/signal features depend on plan | [Mux](https://www.mux.com/) | VOD/live platforms | [Mux docs](https://docs.mux.com/) |
| **Amazon S3** | **Object storage** with tiers, events, and global durability model. | Medium | Yes | No* | AWS-native AI data lakes and batch pipelines | [Amazon S3](https://aws.amazon.com/s3/) | Universal blobs and lakehouses | [S3 docs](https://docs.aws.amazon.com/s3/) |
| **Google Cloud Storage** | **Object storage** integrated with GCP data + AI services. | Medium | Yes | No* | Feeds Vertex and batch analytics cleanly | [Cloud Storage](https://cloud.google.com/storage) | GCP-native apps and ML inputs | [GCS docs](https://cloud.google.com/storage/docs) |
| **Imgix** | **Image + video CDN** with URL-based transforms and optimizations. | Medium | Yes | No* | Parameterized responsiveness and art direction at the edge | [Imgix](https://imgix.com/) | Marketing sites and rich media | [Imgix docs](https://docs.imgix.com/) |

---

## Infra & deploy

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Vercel** | **Frontend cloud**: Next.js-optimized hosting and functions. | Medium | Yes | Yes | AI integrations (SDK, marketplace, observability) | [Vercel docs](https://vercel.com/docs) | Next.js, serverless APIs, edge | [Vercel documentation](https://vercel.com/docs) |
| **Cloudflare** | **CDN**, DNS, WAF, Workers, R2, Queues, etc. | Medium | Yes | Yes | WAF/managed rules; Workers AI ecosystem | [Cloudflare docs](https://developers.cloudflare.com/) | Global performance + security | [Cloudflare Developers](https://developers.cloudflare.com/) |
| **Cloudflare Pages** | **Static + full-stack** on Workers (frameworks). | Medium | Yes | Yes | Hooks to Workers AI / ecosystem | [Pages](https://developers.cloudflare.com/pages/) | Jamstack, SSR via Workers | [Cloudflare Pages docs](https://developers.cloudflare.com/pages/) |
| **Netlify** | **Web platform** (hosting, functions, CI). | Medium | Yes | No | Standard serverless model | [Netlify docs](https://docs.netlify.com/) | JAMstack marketing sites | [Netlify documentation](https://docs.netlify.com/) |
| **Railway** | **Fast provisioning** for services and databases. | Low | Yes | No | Simple “ship containers/DBs” DX | [Railway](https://railway.app/) | Prototypes, internal tools | [Railway docs](https://docs.railway.app/) |
| **Fly.io** | **Global** VMs/machines; Docker-first. | Medium | Yes | Yes | GPUs on platform for LLM hosting | [Fly docs](https://fly.io/docs/) | Latency-sensitive APIs, custom stacks | [Fly.io documentation](https://fly.io/docs/) |
| **Render** | **PaaS**: web services, workers, DBs. | Medium | Yes | No | Observability/scaling UX (product-level) | [Render](https://render.com/) | Simple full-stack hosting | [Render docs](https://render.com/docs) |
| **Let’s Encrypt** | **Free CA** for TLS certificates. | Medium | Yes | No | ACME automation (not LLM-specific) | [Let’s Encrypt](https://letsencrypt.org/) | HTTPS everywhere | [Let’s Encrypt docs](https://letsencrypt.org/docs/) |
| **Amazon Web Services** | **Hyperscaler** primitives: IAM, VPC, compute, databases, and ML. | High | Yes | No* | Bedrock, SageMaker, and data services for AI stacks | [AWS](https://aws.amazon.com/) | Default cloud for many enterprises | [AWS documentation](https://docs.aws.amazon.com/) |
| **Google Cloud Run** | **Serverless containers** that scale to zero on HTTPS. | Medium | Yes | No* | Fast deploy path for services next to BigQuery and Vertex | [Cloud Run](https://cloud.google.com/run) | Stateless APIs and workers on GCP | [Cloud Run docs](https://cloud.google.com/run/docs) |
| **DigitalOcean** | **Simpler cloud**: Droplets, Kubernetes, managed DBs, App Platform. | Medium | Yes | No* | Opinionated UX for SMB teams | [DigitalOcean](https://www.digitalocean.com/) | MVPs, agencies, straightforward hosting | [DigitalOcean docs](https://docs.digitalocean.com/) |
| **Coolify** | **Self-hosted** PaaS to deploy Docker Compose stacks privately. | High | Yes | No* | You own upgrades, backups, and tenancy model | [Coolify](https://coolify.io/) | Private clouds and agency hosting | [Coolify docs](https://coolify.io/docs) |

---

## DevOps

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **GitHub** | **Git hosting**, Actions, Codespaces, security features. | Low | Yes | Yes | Copilot, advanced security, Models | [GitHub Docs](https://docs.github.com/) | Source control, CI/CD, collaboration | [GitHub documentation](https://docs.github.com/) |
| **GitLab** | **DevSecOps** platform (CI, registry, security). | Medium | Yes | Yes | GitLab Duo AI features (tier-dependent) | [GitLab docs](https://docs.gitlab.com/) | Enterprise CI/CD, compliance | [GitLab documentation](https://docs.gitlab.com/) |
| **Bitbucket** | **Git** hosting with native Jira integration (Atlassian). | Low | Yes | No* | Bitbucket Pipelines for CI | [Bitbucket Cloud](https://bitbucket.org/) | Teams standardized on Atlassian | [Bitbucket docs](https://support.atlassian.com/bitbucket-cloud/) |
| **CircleCI** | **Cloud CI/CD** with parallelism and orbs ecosystem. | Medium | Yes | No* | Insights and test splitting (product-tier dependent) | [CircleCI](https://circleci.com/) | High-velocity engineering orgs | [CircleCI docs](https://circleci.com/docs/) |

---

## Observability

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sentry** | **Errors + performance** with rich context. | Medium | Yes | Yes | Issue triage assistance, workflow integrations | [Sentry](https://sentry.io/) | Production stability | [Sentry docs](https://docs.sentry.io/) |
| **PostHog** | **Product analytics**, flags, session replay, experiments. | Medium | Yes | Yes* | LLM analytics, session summaries (feature-dependent) | [PostHog docs](https://posthog.com/docs) | Funnels, experiments, feature flags | [PostHog documentation](https://posthog.com/docs) |
| **Axiom** | **Logs/metrics** platform (serverless-oriented). | Medium | Yes | No | High-volume log search | [Axiom](https://axiom.co/) | Centralized logs, K8s/app telemetry | [Axiom docs](https://axiom.co/docs) |
| **Better Stack** | **Uptime + logs + status pages**. | Medium | No | No | Incident-focused UX | [Better Stack](https://betterstack.com/) | Monitoring + on-call adjacent | [Better Stack docs](https://betterstack.com/docs) |
| **UptimeRobot** | **Uptime monitoring** for HTTP/ping. | Low | No | No | Straightforward uptime checks | [UptimeRobot](https://uptimerobot.com/) | Basic SLA/uptime visibility | [UptimeRobot API](https://uptimerobot.com/api/) |
| **Datadog** | **Unified** observability (APM, logs, RUM, security signals). | Medium | Yes | Yes‡ | Watchdog anomaly detection and newer LLM observability surfaces | [Datadog](https://www.datadoghq.com/) | Large distributed systems | [Datadog docs](https://docs.datadoghq.com/) |
| **Grafana Cloud** | **Managed** LGTM stack (logs, metrics, traces, alerting). | Medium | Yes | No* | Dashboards and SLO workflows teams know from OSS | [Grafana Cloud](https://grafana.com/products/cloud/) | Platform teams standardizing telemetry | [Grafana documentation](https://grafana.com/docs/) |
| **Honeycomb** | **High-cardinality**, event-centric debugging for services. | Medium | Yes | No* | BubbleUp workflows to isolate surprising cohorts | [Honeycomb](https://www.honeycomb.io/) | Incident response, microservices | [Honeycomb docs](https://docs.honeycomb.io/) |

\*PostHog ships MCP tooling in some AI IDE setups (see PostHog’s integration docs for your host).  
‡Datadog MCP availability depends on your IDE host and integration packaging.

---

## Automation & realtime

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Trigger.dev** | **Background jobs** framework for TS (runs on infra). | Medium | Yes | No | Durable workflows suited to agentic jobs | [Trigger.dev](https://trigger.dev/) | Async jobs, queues, schedules | [Trigger.dev docs](https://trigger.dev/docs) |
| **Supabase Realtime** | **Postgres change** fan-out and channels. | Medium | Yes | Yes | Realtime listeners for modern apps | [Realtime guide](https://supabase.com/docs/guides/realtime) | Live dashboards, chat | [Supabase Realtime](https://supabase.com/docs/guides/realtime) |
| **Pusher** | **Pub/sub realtime** channels. | Low | Yes | No | Hosted websocket infra | [Pusher](https://pusher.com/) | Live updates, presence | [Pusher channels docs](https://pusher.com/docs/channels) |
| **Inngest** | **Durable functions** and event-driven workflow engine. | Medium | Yes | No* | Reliable steps with retries for agentic and async jobs | [Inngest](https://www.inngest.com/) | Long-running workflows without bespoke queues | [Inngest docs](https://www.inngest.com/docs) |
| **Ably** | **Realtime** pub/sub with global fanout guarantees. | Medium | Yes | No* | Presence, history, and strong delivery semantics | [Ably](https://ably.com/) | Live dashboards, sports, collaboration | [Ably docs](https://ably.com/docs) |
| **Temporal Cloud** | **Durable execution** for mission-critical workflows. | High | Yes | No* | Correct retries, timers, and saga-style orchestration | [Temporal](https://temporal.io/) | Money movement, provisioning, migrations | [Temporal Cloud docs](https://docs.temporal.io/cloud) |

---

## Specialized (comms, search, email, PDF)

| Service | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Resend** | **Transactional email** API. | Low | Yes | No | Deliverability + modern DX | [Resend](https://resend.com/) | Auth emails, receipts | [Resend docs](https://resend.com/docs) |
| **Loops** | **Email marketing** for SaaS teams. | Low | Yes | No | Campaign tooling and automation | [Loops](https://loops.so/) | Newsletters, lifecycle email | [Loops documentation](https://loops.so/docs) |
| **DeepL API** | **Translation** API. | Low | No | No | High-quality NMT | [DeepL for developers](https://developers.deepl.com/) | i18n at scale | [DeepL API docs](https://developers.deepl.com/docs) |
| **Twilio** | **SMS/voice/video** customer engagement. | Medium | Yes | No | Voice AI assistants (vendor roadmap) | [Twilio](https://www.twilio.com/) | OTP, notifications, call centers | [Twilio docs](https://www.twilio.com/docs) |
| **Typesense** | **Typo-tolerant search** engine with vector support. | Medium | Yes | No | Vectors usable in hybrid search | [Typesense](https://typesense.org/) | Ecommerce/docs search | [Typesense docs](https://typesense.org/docs/) |
| **Flagsmith** | **Feature flags** and remote config (OSS + cloud). | Low | Yes | No | Standard flagging workflows | [Flagsmith](https://www.flagsmith.com/) | Rollouts, experiments | [Flagsmith docs](https://docs.flagsmith.com/) |
| **Tally** | **No-code forms**. | Low | No | No | Form builder (not dev-first LLM tooling) | [Tally](https://tally.so/) | Surveys, lead capture | [Tally help](https://tally.so/help) |
| **Gotenberg** | **Stateless PDF** generation API (often containerized). | Medium | No | No | HTML → PDF at scale | [Gotenberg](https://gotenberg.dev/) | Invoices, reports | [Gotenberg docs](https://gotenberg.dev/docs/getting-started/introduction) |
| **SendGrid** | **Email API** for transactional and marketing programs. | Medium | Yes | No* | Deliverability analytics and segmentation tooling | [SendGrid](https://sendgrid.com/) | High-volume email with governance | [SendGrid docs](https://docs.sendgrid.com/) |
| **Mailgun** | **Email sending** API plus validation and inbound routing. | Medium | Yes | No* | Routing and validation for complex mail flows | [Mailgun](https://www.mailgun.com/) | App email plus inbound pipelines | [Mailgun docs](https://documentation.mailgun.com/) |
| **Algolia** | **Hosted search** with ranking, analytics, and UI kits. | Medium | Yes | No* | Neural and hybrid retrieval features (plan dependent) | [Algolia](https://www.algolia.com/) | Instant search for product or docs sites | [Algolia docs](https://www.algolia.com/doc/) |
| **Meilisearch** | **Open search** engine with cloud hosting and simple operations. | Medium | Yes | No* | Typo tolerance with developer-friendly deployment story | [Meilisearch](https://www.meilisearch.com/) | SaaS search without Elasticsearch ops | [Meilisearch docs](https://www.meilisearch.com/docs) |
| **Elastic (Elastic Cloud)** | **Search + observability** stack with vector retrieval. | High | Yes | No* | GenAI assistants via Elasticsearch vector stores | [Elastic](https://www.elastic.co/) | Logs clusters, enterprise search | [Elastic docs](https://www.elastic.co/guide/index.html) |

---

## Mobile

| Service / stack | Description | Difficulty | CLI | MCP | AI / differentiated features | Skills / AI resources | Primary use cases | Documentation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Flutter** | **Dart UI** toolkit for iOS/Android/desktop/web. | Medium | Yes | No | Gemini/Google AI Dart samples | [Flutter AI samples](https://docs.flutter.dev/ai) | Cross-platform mobile | [Flutter docs](https://docs.flutter.dev/) |
| **React Native** | **React** for native mobile apps. | Medium | Yes | No | Community AI libraries vary by project | [React Native](https://reactnative.dev/) | Shared codebase mobile apps | [React Native docs](https://reactnative.dev/docs/getting-started) |
| **Expo** | **Toolchain** for React Native (router, dev builds, EAS submit/update). | Medium | Yes | No* | OTA updates and native-project hygiene without full Xcode focus daily | [Expo](https://expo.dev/) | Shipping RN apps fast with sane defaults | [Expo docs](https://docs.expo.dev/) |

---

## Maintenance

- **Review cadence:** Revisit **CLI/MCP** columns quarterly—tooling hosts add MCP servers frequently.
- **Verify before adopting:** Use official docs links above for security, compliance, and data residency.
- **NEZAM MCP mirror policy:** This repository treats some tools as canonical in `.cursor/` (see workspace orchestration rules); when a vendor ships an official MCP, prefer pinning versions in your IDE configuration.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-05-10 | Initial curated table with difficulty, docs, and skill links |
| 2026-05-10 | Expanded catalog: BaaS/data, LLM providers, auth, MENA/global payments, object CDN, hyperscaler deploy, CI, observability, workflow/realtime, search/email, mobile tooling |
