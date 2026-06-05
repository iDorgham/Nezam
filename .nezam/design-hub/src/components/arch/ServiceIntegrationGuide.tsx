'use client'

import { X, Copy, SquareArrowOutUpRight } from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { getCatalogProvider } from '@/lib/arch/service-catalog'
import { BrandIcon } from '@/components/arch/BrandIcon'
import { Button } from '@/components/ui/button'
import type { ArchPage } from '@/types/arch'

interface Props {
  servicePage: ArchPage
  onClose: () => void
}

function CopyBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-app border border-app-border bg-app-bg/50 p-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-app-muted">{label}</span>
        <button
          type="button"
          className="text-app-subtle hover:text-app-text"
          onClick={() => void navigator.clipboard.writeText(text)}
          title="Copy"
        >
          <Copy size={12} />
        </button>
      </div>
      <pre className="text-[10px] text-app-text whitespace-pre-wrap font-mono leading-relaxed">{text}</pre>
    </div>
  )
}

export function ServiceIntegrationGuide({ servicePage, onClose }: Props) {
  const archDeletePage = useHub((s) => s.archDeletePage)
  const providerId = servicePage.serviceProviderId
  const provider = providerId ? getCatalogProvider(providerId) : undefined
  const integration = provider?.integration

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 border-b border-app-border p-4">
        <div className="flex items-start gap-2 min-w-0">
          {provider ? (
            <BrandIcon slug={provider.simpleIconSlug} size={22} className="mt-0.5" />
          ) : null}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-app-text truncate">{servicePage.name}</h2>
            <p className="text-[10px] text-app-subtle font-mono truncate">{servicePage.route}</p>
            {provider && (
              <p className="text-[9px] text-app-muted mt-1">
                Owner: <span className="text-app-text">{provider.ownerAgent}</span>
              </p>
            )}
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-app-subtle hover:text-app-text shrink-0">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto app-scroll p-4 space-y-4">
        {!provider && (
          <p className="text-[11px] text-app-warning">
            Legacy service without catalog binding. Re-add from the catalog to unlock the integration guide.
          </p>
        )}

        {provider && (
          <>
            <p className="text-[11px] text-app-subtle leading-relaxed">{provider.description}</p>
            <div className="flex flex-wrap gap-1">
              {provider.skills.map((s) => (
                <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-app-elevated text-app-muted">
                  {s}
                </span>
              ))}
            </div>

            {integration && (
              <>
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-app-muted mb-2">
                    API setup
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-app-text">
                    {integration.apiSteps.map((step, i) => (
                      <li key={i} className="leading-relaxed pl-0.5">
                        {step}
                      </li>
                    ))}
                  </ol>
                </section>

                {integration.envVars.length > 0 && (
                  <CopyBlock
                    label="Environment variables"
                    text={integration.envVars.map((v) => `${v}=`).join('\n')}
                  />
                )}

                {integration.mcp && (
                  <CopyBlock
                    label="MCP (copy only — enable in Cursor)"
                    text={`${integration.mcp.install}\n\nConfig sketch:\n${integration.mcp.config}${
                      integration.mcp.registryNote ? `\n\n${integration.mcp.registryNote}` : ''
                    }`}
                  />
                )}

                {integration.cli && (
                  <CopyBlock
                    label="CLI"
                    text={`Install:\n${integration.cli.install}\n\nUsage:\n${integration.cli.usage}`}
                  />
                )}

                <CopyBlock label="Agent prompt" text={integration.agentPrompt} />

                <a
                  href={provider.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-app-accent hover:underline"
                >
                  Official docs
                  <SquareArrowOutUpRight size={12} />
                </a>
              </>
            )}
          </>
        )}
      </div>

      <div className="border-t border-app-border p-3">
        <Button
          variant="danger"
          size="sm"
          className="w-full"
          onClick={() => {
            archDeletePage(servicePage.id)
            onClose()
          }}
        >
          Remove from rack
        </Button>
      </div>
    </div>
  )
}
