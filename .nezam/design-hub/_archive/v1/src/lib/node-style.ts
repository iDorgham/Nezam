import type { CanvasNode, WireType } from '@/src/store/canvas-graph.store'

// Maps the node `type` from CanvasNodeSchema to a CSS variable. Lets the
// dot/simplified LOD render a recognizable color per node category
// without re-deriving it in every component.
export function nodeTypeColorVar(type: CanvasNode['type']): string {
  switch (type) {
    case 'page':    return 'var(--ds-primary)'      // Electric Cyan
    case 'service': return 'var(--ds-info)'         // Blue
    case 'auth':    return 'var(--dv-wire-auth)'    // Purple
    case 'mobile':  return 'var(--ds-success)'      // Green
    case 'group':   return 'var(--ds-warning)'      // Amber
  }
}

export function wireTypeColorVar(type: WireType): string {
  switch (type) {
    case 'navigational': return 'var(--dv-wire-navigational)'
    case 'data':         return 'var(--dv-wire-data)'
    case 'auth':         return 'var(--dv-wire-auth)'
    case 'conditional':  return 'var(--dv-wire-conditional)'
  }
}
