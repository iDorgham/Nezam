'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Check,
  Trash2,
  Copy,
  Download,
  Sparkles,
} from 'lucide-react'
import { useHub } from '@/store/hub.store'
import { PanelHeader, PanelBody, Section } from '@/components/ui/Panel'
import { downloadFile } from '@/lib/export'
import { cn } from '@/lib/cn'

/** Comments panel — list, edit, export for AI agents. */
export function CommentsPanel() {
  const comments = useHub((s) => s.comments)
  const selection = useHub((s) => s.selection)
  const updateComment = useHub((s) => s.updateComment)
  const toggleResolve = useHub((s) => s.toggleResolveComment)
  const removeComment = useHub((s) => s.removeComment)
  const exportForAI = useHub((s) => s.exportCommentsForAI)
  const setTool = useHub((s) => s.setTool)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportForAI())
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        icon={<MessageCircle size={15} />}
        title="Comments"
        subtitle="Pin instructions for AI agents to act on"
      />
      <PanelBody>
        {comments.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-8 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-app-lg border border-app-border bg-app-inset text-app-subtle">
              <MessageCircle size={20} />
            </div>
            <div className="text-xs font-semibold text-app-text">No comments yet</div>
            <p className="mt-1 text-[11px] leading-relaxed text-app-subtle">
              Pick the Comment tool from the left toolbar, then click any element to pin a note.
            </p>
            <button
              onClick={() => setTool('comment')}
              className="mt-3 inline-flex items-center gap-1.5 rounded-app-sm bg-app-accent px-2.5 py-1.5 text-[11px] font-semibold text-app-on-accent hover:bg-app-accent-hover active:scale-95"
            >
              <Sparkles size={12} />
              Use comment tool
            </button>
          </div>
        ) : (
          <>
            <Section
              label="Export for AI agents"
              hint="A structured task bundle the agent can act on."
            >
              <div className="flex gap-2">
                <button
                  onClick={onCopy}
                  className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-app-sm border border-app-border bg-app-inset px-2.5 py-1.5 text-[11px] font-medium text-app-text hover:border-app-border-strong"
                >
                  {copied ? <Check size={12} className="text-app-accent" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Copy bundle'}
                </button>
                <button
                  onClick={() => downloadFile('ai-comments.json', exportForAI(), 'application/json')}
                  className="focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-app-sm bg-app-accent px-2.5 py-1.5 text-[11px] font-semibold text-app-on-accent hover:bg-app-accent-hover"
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            </Section>

            <Section label={`Pins (${comments.length})`}>
              <div className="space-y-1.5">
                {comments.map((c, i) => {
                  const active = selection?.nodeId === c.nodeId
                  return (
                    <div
                      key={c.id}
                      className={cn(
                        'rounded-app border bg-app-inset/60 p-2.5 transition-colors',
                        active
                          ? 'border-app-accent'
                          : c.resolved
                            ? 'border-app-border opacity-70'
                            : 'border-app-border hover:border-app-border-strong',
                      )}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span
                          className={cn(
                            'grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold',
                            c.resolved
                              ? 'bg-app-surface text-app-muted'
                              : 'bg-app-accent text-app-on-accent',
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-app-text">
                          {c.label}
                        </span>
                        <button
                          onClick={() => toggleResolve(c.id)}
                          aria-label={c.resolved ? 'Reopen' : 'Resolve'}
                          className={cn(
                            'focus-ring grid h-6 w-6 place-items-center rounded-app-sm transition-colors',
                            c.resolved
                              ? 'text-app-accent hover:bg-app-elevated'
                              : 'text-app-subtle hover:bg-app-elevated hover:text-app-text',
                          )}
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => removeComment(c.id)}
                          aria-label="Delete"
                          className="focus-ring grid h-6 w-6 place-items-center rounded-app-sm text-app-subtle hover:bg-app-elevated hover:text-app-danger"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                      <textarea
                        value={c.text}
                        onChange={(e) => updateComment(c.id, e.target.value)}
                        placeholder="Describe what the AI should change…"
                        rows={2}
                        className="focus-ring w-full resize-none rounded-app-sm border border-app-border bg-app-bg px-2 py-1.5 text-[11px] leading-relaxed text-app-text placeholder:text-app-subtle"
                      />
                    </div>
                  )
                })}
              </div>
            </Section>
          </>
        )}
      </PanelBody>
    </div>
  )
}
