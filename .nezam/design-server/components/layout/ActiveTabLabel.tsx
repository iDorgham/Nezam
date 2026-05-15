'use client'

import { useSessionStore } from '@/lib/store/session.store'

const LABEL_MAP: Record<string, string> = {
  dashboard:       'Dashboard',
  sitemap:         'Sitemap',
  menus:           'Menus',
  canvas:          'Canvas',
  template:        'Template Builder',
  wireframes:      'Wireframes',
  'layout-designer': 'Layout Designer',
  'theme-editor':  'Theme Editor',
  'asset-manager': 'Asset Manager',
  'profile-editor': 'Profile Editor',
  profiles:        'Design Profiles',
  tokens:          'Token Studio',
  settings:        'Settings',
  ai:              'AI Assistant',
  export:          'Export',
  review:          'Review',
}

export default function ActiveTabLabel() {
  const activeTabId = useSessionStore((s) => s.activeTabId)
  const label = (activeTabId && LABEL_MAP[activeTabId]) || 'Design Server'

  return (
    <span className="text-white font-medium">{label}</span>
  )
}
