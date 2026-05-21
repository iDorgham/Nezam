'use client'
import React, { useState } from 'react'
import {
  Zap, Mail, Bell, Send, Clock, Plus, X, CheckCircle2, Circle,
  Globe, FileText, ChevronRight, Bot, Calendar, Sparkles,
  Cpu, Activity, AlertTriangle, BarChart3, RefreshCw, Settings2,
} from 'lucide-react'

// ── Automation workflows ──────────────────────────────────────────────────────
interface Flow {
  id: string
  label: string
  labelAr: string
  icon: React.ReactNode
  trigger: string
  action: string
  status: 'active' | 'paused' | 'draft'
}

const DEFAULT_FLOWS: Flow[] = [
  { id: 'f1', label: 'Welcome Email',      labelAr: 'ترحيب بالمشترك',    icon: <Mail size={12}/>,  trigger: 'Form submit',      action: 'Send email',       status: 'active' },
  { id: 'f2', label: 'Newsletter Digest',  labelAr: 'النشرة الأسبوعية',  icon: <Bell size={12}/>,  trigger: 'Every Monday 8am', action: 'Publish to list',  status: 'active' },
  { id: 'f3', label: 'SEO Audit Weekly',   labelAr: 'تدقيق SEO أسبوعي',  icon: <Globe size={12}/>, trigger: 'Sunday midnight',  action: 'Generate report',  status: 'paused' },
  { id: 'f4', label: 'Blog Auto-Post',     labelAr: 'نشر المدونة تلقائياً', icon: <FileText size={12}/>, trigger: 'AI generates', action: 'Publish + share', status: 'draft'  },
]

// ── AI Agent tasks ────────────────────────────────────────────────────────────
interface AgentTask {
  id: string
  label: string
  labelAr: string
  desc: string
  type: 'content' | 'seo' | 'design' | 'analytics' | 'translate'
  scheduled: string
  status: 'idle' | 'running' | 'done' | 'error'
  progress?: number
}

const DEFAULT_TASKS: AgentTask[] = [
  { id: 't1', label: 'Generate Hero Copy',     labelAr: 'كتابة نص الهيرو',         desc: 'AI writes headline, sub-copy & CTA for all pages', type: 'content',   scheduled: 'Now',         status: 'idle'    },
  { id: 't2', label: 'SEO Meta Optimization',  labelAr: 'تحسين ميتا SEO',          desc: 'Generate title tags and descriptions for 6 pages', type: 'seo',       scheduled: 'Now',         status: 'done',   progress: 100 },
  { id: 't3', label: 'Arabic Translation',     labelAr: 'الترجمة للعربية',         desc: 'Translate all English content to Egyptian Arabic',  type: 'translate', scheduled: 'Tonight 11pm',status: 'idle'    },
  { id: 't4', label: 'A/B Test Setup',         labelAr: 'إعداد اختبار A/B',        desc: 'Create 2 hero variants and split traffic 50/50',   type: 'design',    scheduled: 'Tomorrow 9am',status: 'idle'    },
  { id: 't5', label: 'Performance Audit',      labelAr: 'تدقيق الأداء',            desc: 'LCP, INP, CLS audit across all breakpoints',       type: 'analytics', scheduled: 'Daily 2am',   status: 'running', progress: 63 },
  { id: 't6', label: 'Social Media Posts',     labelAr: 'منشورات السوشيال ميديا',  desc: 'Auto-generate LinkedIn + Instagram posts (7 days)', type: 'content',   scheduled: 'Every Sunday',status: 'idle'    },
]

const taskTypeColor: Record<string, string> = {
  content:   'text-violet-400 bg-violet-500/10 border-violet-500/20',
  seo:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  design:    'text-ds-primary bg-ds-primary/10 border-ds-primary/20',
  analytics: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  translate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

interface AutomationPanelProps {
  lang: string
  t: (en: string, ar: string) => string
}

export default function AutomationPanel({ lang, t }: AutomationPanelProps) {
  const [subTab, setSubTab] = useState<'automation' | 'ai'>('automation')
  const [flows, setFlows] = useState(DEFAULT_FLOWS)
  const [tasks, setTasks] = useState(DEFAULT_TASKS)

  const toggleFlow = (id: string) => {
    setFlows(f => f.map(fl => fl.id === id ? {
      ...fl, status: fl.status === 'active' ? 'paused' : 'active'
    } : fl))
  }

  const runTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'running', progress: 0 } : t))
    // Simulate progress
    let p = 0
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTasks(prev => prev.map(t2 => t2.id === id ? { ...t2, status: 'done', progress: 100 } : t2))
      } else {
        setTasks(prev => prev.map(t2 => t2.id === id ? { ...t2, progress: p } : t2))
      }
    }, 400)
  }

  const statusIcon = (s: AgentTask['status']) => {
    if (s === 'done')    return <CheckCircle2 size={11} className="text-emerald-400" />
    if (s === 'running') return <RefreshCw size={11} className="text-ds-primary animate-spin" />
    if (s === 'error')   return <AlertTriangle size={11} className="text-red-400" />
    return <Circle size={11} className="text-[#48484a]" />
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[#2e2e30] shrink-0 flex items-center gap-2">
        <Zap size={11} className="text-ds-primary" />
        <span className="text-[10px] font-semibold text-[#a1a1a6]">{t('Automation & AI', 'الأتمتة والذكاء')}</span>

        {/* Sub tabs */}
        <div className="ms-auto flex items-center bg-[#1c1c1e] border border-[#2e2e30] rounded-md p-0.5 gap-0.5">
          <button
            onClick={() => setSubTab('automation')}
            className={`px-2 py-0.5 text-[9px] font-semibold rounded transition-all ${subTab === 'automation' ? 'bg-[#3a3a3c] text-[#e1e1e6]' : 'text-[#636366]'}`}
          >
            {t('Flows', 'التدفقات')}
          </button>
          <button
            onClick={() => setSubTab('ai')}
            className={`px-2 py-0.5 text-[9px] font-semibold rounded transition-all ${subTab === 'ai' ? 'bg-[#3a3a3c] text-[#e1e1e6]' : 'text-[#636366]'}`}
          >
            {t('AI Agent', 'وكيل AI')}
          </button>
        </div>
      </div>

      {/* ── Automation Flows ── */}
      {subTab === 'automation' && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[9px] font-semibold text-[#636366] uppercase tracking-wider">{t('Active Workflows', 'مسارات العمل')}</span>
            <button className="flex items-center gap-1 text-[9px] text-ds-primary hover:text-ds-primary/80 font-semibold transition-colors">
              <Plus size={9} /> {t('New', 'جديد')}
            </button>
          </div>

          <div className="px-2 pb-3 space-y-1.5">
            {flows.map(flow => (
              <div key={flow.id} className="p-2.5 rounded-lg border border-[#2e2e30] bg-[#131314] hover:border-[#3a3a3c] transition-all group">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-md bg-[#1c1c1e] text-ds-primary shrink-0 mt-0.5">{flow.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-[#e1e1e6] truncate">{t(flow.label, flow.labelAr)}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[8px] text-[#48484a] flex items-center gap-0.5"><Clock size={7} /> {flow.trigger}</span>
                      <ChevronRight size={7} className="text-[#3a3a3c]" />
                      <span className="text-[8px] text-[#48484a] flex items-center gap-0.5"><Send size={7} /> {flow.action}</span>
                    </div>
                  </div>
                  {/* Status toggle */}
                  <button
                    onClick={() => toggleFlow(flow.id)}
                    className={`shrink-0 w-7 h-4 rounded-full transition-all relative ${
                      flow.status === 'active' ? 'bg-emerald-500/80' :
                      flow.status === 'paused' ? 'bg-[#2e2e30]' : 'bg-[#1c1c1e] border border-dashed border-[#2e2e30]'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${flow.status === 'active' ? 'end-0.5' : 'start-0.5'}`} />
                  </button>
                </div>
                <div className="mt-2 ms-[34px]">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                    flow.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    flow.status === 'paused' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-[#1c1c1e] text-[#636366] border-[#2e2e30]'
                  }`}>{flow.status.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="px-2 py-2 border-t border-[#1f1f21]">
            <p className="text-[9px] font-semibold text-[#636366] uppercase tracking-wider px-1 mb-2">{t('Quick Integrations', 'تكاملات سريعة')}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {['Mailchimp', 'Zapier', 'Webhook', 'Slack', 'WhatsApp', 'Notion'].map(name => (
                <button key={name} className="text-[8px] text-[#636366] border border-[#2e2e30] rounded-md py-1.5 hover:border-ds-primary/40 hover:text-ds-primary transition-all">
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── AI Agent Scheduler ── */}
      {subTab === 'ai' && (
        <div className="flex-1 overflow-y-auto">
          {/* Status bar */}
          <div className="px-3 py-2.5 border-b border-[#1f1f21] flex items-center gap-2 bg-[#0f1a0f]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[9px] text-emerald-400 font-bold">NEZAM AI Agent Online</span>
            <span className="ms-auto text-[8px] text-[#48484a]">GPT-4o + Claude 3.5</span>
          </div>

          <div className="px-2 pt-2 pb-3 space-y-1.5">
            {tasks.map(task => (
              <div key={task.id} className="p-2.5 rounded-lg border border-[#2e2e30] bg-[#131314] hover:border-[#3a3a3c] transition-all">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">{statusIcon(task.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold text-[#e1e1e6]">{t(task.label, task.labelAr)}</span>
                      <span className={`text-[7px] font-bold px-1 py-px rounded border ${taskTypeColor[task.type]}`}>
                        {task.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[8px] text-[#636366] mt-0.5 leading-relaxed">{task.desc}</p>

                    {/* Progress bar */}
                    {(task.status === 'running' || task.status === 'done') && task.progress !== undefined && (
                      <div className="mt-1.5 space-y-0.5">
                        <div className="h-1 rounded-full bg-[#1c1c1e] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%`, background: task.status === 'done' ? '#22c55e' : 'var(--ds-primary, #06b6d4)' }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[7px] text-[#48484a] font-mono">{task.progress}%</span>
                          {task.status === 'done' && <span className="text-[7px] text-emerald-400 font-bold">✓ Complete</span>}
                        </div>
                      </div>
                    )}

                    {/* Scheduled time + run button */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[8px] text-[#48484a] flex items-center gap-0.5">
                        <Calendar size={7} /> {task.scheduled}
                      </span>
                      {task.status === 'idle' && (
                        <button
                          onClick={() => runTask(task.id)}
                          className="ms-auto text-[8px] font-semibold text-ds-primary border border-ds-primary/30 bg-ds-primary/8 hover:bg-ds-primary/15 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                        >
                          <Sparkles size={8} /> {t('Run Now', 'تشغيل الآن')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI model selector */}
          <div className="px-2 py-3 border-t border-[#1f1f21]">
            <p className="text-[9px] font-semibold text-[#636366] uppercase tracking-wider px-1 mb-2">{t('AI Model', 'نموذج الذكاء')}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'gpt4o', label: 'GPT-4o', active: true },
                { id: 'claude', label: 'Claude 3.5', active: false },
                { id: 'gemini', label: 'Gemini 2.0', active: false },
                { id: 'local', label: 'Local LLM', active: false },
              ].map(m => (
                <button key={m.id} className={`text-[9px] py-1.5 rounded-md border transition-all ${
                  m.active ? 'border-ds-primary bg-ds-primary/10 text-ds-primary font-semibold' :
                  'border-[#2e2e30] text-[#636366] hover:border-[#3a3a3c] hover:text-[#a1a1a6]'
                }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
