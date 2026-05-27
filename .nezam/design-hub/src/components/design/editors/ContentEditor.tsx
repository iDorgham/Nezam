'use client'

import { useHub } from '@/store/hub.store'
import { BookOpen, Eye, FileText, Sparkles } from 'lucide-react'

const FIELDS = [
  { key: 'maxWidth', label: 'Max Reading Width', desc: 'Maximum block text width for horizontal scanning comfort' },
  { key: 'lineLength', label: 'Optimal Character Limit', desc: 'Optimal character limit per text row line' },
  { key: 'paragraphSpacing', label: 'Paragraph Margin', desc: 'Vertical separation margin between paragraphs' },
  { key: 'headingSpacing', label: 'Heading Space', desc: 'Preceding title top margins for proper page breathing' },
  { key: 'listIndent', label: 'Bullet list indent', desc: 'Horizontal padding for bullet list components' },
  { key: 'blockquoteBorder', label: 'Blockquote Border', desc: 'Callout vertical separator line weight' },
] as const

export function ContentEditor() {
  const content = useHub((s) => s.design.tokens.content)
  const setToken = useHub((s) => s.designSetToken)

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-app-border/40 pb-5">
        <div>
          <h2 className="text-base font-bold text-app-text tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-app-accent" />
            Content & Prose Typography
          </h2>
          <p className="text-xs text-app-subtle mt-0.5 font-medium">
            Fine-tune layout spacing, line lengths, and paragraph margins optimized for pleasant long-form reading.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left Side: Geometry Controls */}
        <div className="col-span-3 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-1 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-app-accent" />
              Prose Layout Spacing
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal">
              Adjust optimal reading proportions.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FIELDS.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-xl border border-app-border/60 bg-app-elevated/40"
              >
                <div>
                  <span className="text-xs font-bold text-app-text block">{label}</span>
                  <span className="text-[9px] text-app-muted leading-tight block mt-0.5">{desc}</span>
                </div>
                <input
                  type="text"
                  value={content[key]}
                  onChange={(e) => setToken(`content.${key}`, e.target.value)}
                  className="w-32 h-8 rounded-lg border border-app-border bg-app-inset px-2.5 text-center text-xs font-mono font-bold text-app-accent focus:outline-none focus:border-app-accent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Sandbox Prose View */}
        <div className="col-span-2 p-5 rounded-2xl bg-app-inset border border-app-border/40 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-app-text mb-3 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-app-accent" />
              Prose Layout Preview
            </h3>
            <p className="text-[10px] text-app-subtle leading-normal mb-4">
              Visualizing prose reading patterns using Egypt-oriented Egyptian Arabic (Masri) strings.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center bg-app-elevated border border-app-border/50 rounded-xl p-5 overflow-hidden relative">
            <div className="text-app-text text-xs leading-relaxed" style={{ maxWidth: content.maxWidth }}>
              <h3 className="font-bold text-sm text-app-text" style={{ marginBottom: content.headingSpacing }}>
                الأخبار والتقارير اليومية
              </h3>
              <p className="text-[11px] text-app-subtle" style={{ marginBottom: content.paragraphSpacing }}>
                ده مقال تجريبي بيوضح شكل ومقاسات الخطوط والهوامش في تطبيق نِظام. التصميم ده معمول مخصوص عشان القراءة تكون سهلة ومريحة للعين في الساحل والقاهرة.
              </p>
              <blockquote
                className="pl-3 text-app-accent/80 italic text-[11px] bg-app-inset/30 p-2 rounded-r-lg border-l-2 border-app-accent"
                style={{ borderLeftWidth: content.blockquoteBorder }}
              >
                "التفاصيل الصغيرة بتصنع الفرق الكبير في تجربة المستخدم."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
