'use client'

/**
 * SPEC-DS-VISUAL-001 — Form section builder.
 * Drag-reorder fields, field type picker, layout variants.
 */

import { useState } from 'react'
import { Plus, GripVertical, Trash2 } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
type FormLayout = '1-col' | '2-col' | 'inline'
type SubmitStyle = 'filled' | 'outlined' | 'ghost'

export interface FormField {
  id: string
  type: FieldType
  label: string
  required: boolean
  halfWidth: boolean
}

export interface FormConfig {
  layout: FormLayout
  fields: FormField[]
  submitLabel: string
  submitStyle: SubmitStyle
  showSuccess: boolean
  enableRecaptcha: boolean
}

const FIELD_TYPES: FieldType[] = ['text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'radio', 'file']

const FIELD_ICONS: Record<FieldType, string> = {
  text: 'T', email: '@', phone: '#', textarea: '¶',
  select: '▾', checkbox: '☑', radio: '◎', file: '↑',
}

const uid = () => Math.random().toString(36).slice(2, 8)

const DEFAULT_FIELDS: FormField[] = [
  { id: uid(), type: 'text',  label: 'Name',    required: true,  halfWidth: false },
  { id: uid(), type: 'email', label: 'Email',   required: true,  halfWidth: false },
  { id: uid(), type: 'textarea', label: 'Message', required: false, halfWidth: false },
]

// ── Sortable field row ────────────────────────────────────────────────────────

function FieldRow({
  field, onUpdate, onRemove,
}: {
  field: FormField
  onUpdate: (patch: Partial<FormField>) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center gap-2 rounded-md border border-app-border bg-app-surface px-2 py-1.5 transition-shadow',
        isDragging && 'shadow-app-md opacity-50',
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-app-subtle opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag"
      >
        <GripVertical size={14} />
      </button>

      {/* Type selector */}
      <select
        value={field.type}
        onChange={(e) => onUpdate({ type: e.target.value as FieldType })}
        className="rounded border border-app-border bg-transparent px-1 py-0.5 text-[11px] text-app-text focus:outline-none"
      >
        {FIELD_TYPES.map((t) => (
          <option key={t} value={t}>{FIELD_ICONS[t]} {t}</option>
        ))}
      </select>

      {/* Label */}
      <input
        value={field.label}
        onChange={(e) => onUpdate({ label: e.target.value })}
        className="min-w-0 flex-1 bg-transparent text-xs text-app-text placeholder:text-app-subtle focus:outline-none"
        placeholder="Field label"
      />

      {/* Req toggle */}
      <button
        onClick={() => onUpdate({ required: !field.required })}
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] transition-colors',
          field.required ? 'bg-app-brand/10 text-app-brand' : 'text-app-subtle hover:text-app-text',
        )}
        title="Required"
      >
        *
      </button>

      {/* Half width */}
      <button
        onClick={() => onUpdate({ halfWidth: !field.halfWidth })}
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] transition-colors',
          field.halfWidth ? 'bg-app-brand/10 text-app-brand' : 'text-app-subtle hover:text-app-text',
        )}
        title="Half width"
      >
        ½
      </button>

      <button
        onClick={onRemove}
        className="text-app-subtle opacity-0 transition-opacity hover:text-app-danger group-hover:opacity-100"
        aria-label="Remove field"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

// ── Toggle / chip helpers ─────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="text-xs text-app-text">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-4 w-7 rounded-full transition-colors', checked ? 'bg-app-brand' : 'bg-app-border')}
      >
        <span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-3.5' : 'translate-x-0.5')} />
      </button>
    </label>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-app-subtle">{label}</p>
      {children}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export interface FormBuilderProps {
  value?: Partial<FormConfig>
  onChange?: (cfg: FormConfig) => void
}

export function FormBuilder({ value, onChange }: FormBuilderProps) {
  const [cfg, setCfg] = useState<FormConfig>({
    layout: '1-col',
    fields: DEFAULT_FIELDS,
    submitLabel: 'Submit',
    submitStyle: 'filled',
    showSuccess: true,
    enableRecaptcha: false,
    ...value,
  })

  const update = <K extends keyof FormConfig>(key: K, val: FormConfig[K]) => {
    const next = { ...cfg, [key]: val }
    setCfg(next)
    onChange?.(next)
  }

  const updateField = (id: string, patch: Partial<FormField>) => {
    update('fields', cfg.fields.map((f) => f.id === id ? { ...f, ...patch } : f))
  }

  const removeField = (id: string) => {
    update('fields', cfg.fields.filter((f) => f.id !== id))
  }

  const addField = () => {
    update('fields', [...cfg.fields, { id: uid(), type: 'text', label: 'New field', required: false, halfWidth: false }])
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const from = cfg.fields.findIndex((f) => f.id === active.id)
    const to   = cfg.fields.findIndex((f) => f.id === over.id)
    if (from !== -1 && to !== -1) update('fields', arrayMove(cfg.fields, from, to))
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <Section label="Layout">
        <div className="flex gap-1">
          {(['1-col', '2-col', 'inline'] as FormLayout[]).map((l) => (
            <button
              key={l}
              onClick={() => update('layout', l)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[11px] transition-colors',
                cfg.layout === l ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </Section>

      <Section label="Fields">
        <DndContext id="form-builder" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={cfg.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {cfg.fields.map((field) => (
                <FieldRow
                  key={field.id}
                  field={field}
                  onUpdate={(patch) => updateField(field.id, patch)}
                  onRemove={() => removeField(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <button
          onClick={addField}
          className="mt-1 flex items-center gap-1.5 rounded-md border border-dashed border-app-border px-3 py-1.5 text-[11px] text-app-subtle transition-colors hover:border-app-border-strong hover:text-app-text"
        >
          <Plus size={12} /> Add field
        </button>
      </Section>

      <Section label="Submit button">
        <div className="flex items-center gap-3">
          <input
            value={cfg.submitLabel}
            onChange={(e) => update('submitLabel', e.target.value)}
            className="flex-1 rounded-md border border-app-border bg-app-surface px-2 py-1 text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-app-brand"
          />
          <div className="flex gap-1">
            {(['filled', 'outlined', 'ghost'] as SubmitStyle[]).map((s) => (
              <button
                key={s}
                onClick={() => update('submitStyle', s)}
                className={cn(
                  'rounded-md px-2 py-1 text-[11px] transition-colors',
                  cfg.submitStyle === s ? 'bg-app-brand text-app-on-brand' : 'bg-app-surface text-app-subtle hover:text-app-text',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section label="Options">
        <div className="flex flex-col gap-2.5">
          <Toggle checked={cfg.showSuccess} onChange={(v) => update('showSuccess', v)} label="Success message" />
          <Toggle checked={cfg.enableRecaptcha} onChange={(v) => update('enableRecaptcha', v)} label="reCAPTCHA" />
        </div>
      </Section>
    </div>
  )
}
