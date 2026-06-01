/** Returns true when the event target is a text field — skip global shortcuts. */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}

export const HUB_SECTION_SHORTCUTS: { index: number; id: string; label: string }[] = [
  { index: 1, id: 'architecture', label: 'Architecture' },
  { index: 2, id: 'wireframes', label: 'Wireframes' },
  { index: 3, id: 'design', label: 'Design System' },
  { index: 4, id: 'components', label: 'Components' },
  { index: 5, id: 'theming', label: 'Theming' },
  { index: 6, id: 'preview', label: 'Preview' },
]
