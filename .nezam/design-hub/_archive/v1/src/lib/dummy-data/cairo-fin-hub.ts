import type { CanvasNode, CanvasWire } from '@/src/store/canvas-graph.store'

// CairoFin Hub — Egyptian Fintech demo site
// 8 pages in a 3-column flow layout with navigational wires.
// Titles are in English; nameAr is stored in the AST for RTL rendering.

const COL_W = 220
const COL_H = 100
const H_GAP = 80
const V_GAP = 60

function node(
  id: string,
  title: string,
  titleAr: string,
  route: string,
  type: CanvasNode['type'],
  col: number,
  row: number,
): CanvasNode {
  return {
    id,
    type,
    title,
    route,
    x: col * (COL_W + H_GAP) + 80,
    y: row * (COL_H + V_GAP) + 80,
    width:  COL_W,
    height: COL_H,
    rtlCompliant: false,
    wcagCompliant: false,
    hardlockFailures: [],
    locked: false,
    attachments: [],
    generationStatus: 'idle',
    style: {},
    // AST carries Arabic title for RTL rendering in section/element LOD
    // @ts-expect-error extra field stored in sourceNodeAST-equivalent
    meta: { titleAr },
  }
}

function wire(
  fromId: string,
  toId: string,
  type: CanvasWire['type'] = 'navigational',
): CanvasWire {
  return {
    id: `wire-${fromId}-${toId}`,
    fromNodeId: fromId,
    toNodeId: toId,
    type,
    attachments: [],
    annotativeDirectives: [],
    cp1Offset: { x: 80,  y: 0 },
    cp2Offset: { x: -80, y: 0 },
  }
}

export const CAIROFIN_NODES: CanvasNode[] = [
  node('cf-home',     'Home',              'الرئيسية',            '/',                  'page',    1, 0),
  node('cf-personal', 'Personal Banking',  'الخدمات الشخصية',    '/personal',          'page',    0, 1),
  node('cf-business', 'Business Banking',  'خدمات الأعمال',      '/business',          'page',    1, 1),
  node('cf-loans',    'Loans & Credit',    'القروض والائتمان',    '/loans',             'page',    2, 1),
  node('cf-invest',   'Investments',       'الاستثمارات',          '/investments',       'page',    0, 2),
  node('cf-mobile',   'Mobile App',        'التطبيق المحمول',      '/app',               'mobile',  1, 2),
  node('cf-about',    'About CairoFin',    'عن كايروفن',           '/about',             'page',    2, 2),
  node('cf-support',  'Support Center',    'مركز الدعم',           '/support',           'auth',    1, 3),
]

export const CAIROFIN_WIRES: CanvasWire[] = [
  wire('cf-home',     'cf-personal'),
  wire('cf-home',     'cf-business'),
  wire('cf-home',     'cf-loans'),
  wire('cf-personal', 'cf-invest'),
  wire('cf-business', 'cf-mobile'),
  wire('cf-loans',    'cf-about'),
  wire('cf-mobile',   'cf-support'),
  wire('cf-invest',   'cf-support', 'data'),
]
