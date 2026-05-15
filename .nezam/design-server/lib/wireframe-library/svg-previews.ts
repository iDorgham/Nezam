// ─────────────────────────────────────────────────────────────────────────────
// NEZAM Wireframe Library — SVG Preview Renderer
// Generates inline SVG wireframe previews for every block category
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg: '#0F111A',
  surface: '#161824',
  surface2: '#1E2130',
  border: '#2A2E3F',
  primary: '#FF5701',
  primaryMuted: 'rgba(255,87,1,0.15)',
  text: '#6B7280',
  textLight: '#9CA3AF',
  white: '#FFFFFF',
  muted: 'rgba(107,114,128,0.5)',
}

function rect(x: number, y: number, w: number, h: number, fill = C.surface, rx = 4) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`
}
function line(x1: number, y1: number, x2: number, y2: number, color = C.border) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1"/>`
}
function text(x: number, y: number, content: string, size = 9, fill = C.text, anchor = 'start') {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${content}</text>`
}
function circle(cx: number, cy: number, r: number, fill = C.surface2) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`
}
function pill(x: number, y: number, w: number, h: number, fill = C.surface2) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"/>`
}

function wrapSvg(w: number, h: number, content: string) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <rect width="${w}" height="${h}" fill="${C.bg}"/>
  ${content}
</svg>`
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function navBar(y = 0, w = 320) {
  return [
    rect(0, y, w, 28, C.surface),
    circle(12, y + 14, 8, C.primary + '33'),
    rect(28, y + 10, 40, 8, C.surface2, 2),
    rect(76, y + 10, 28, 8, C.surface2, 2),
    rect(112, y + 10, 28, 8, C.surface2, 2),
    rect(w - 60, y + 8, 52, 12, C.primary, 6),
  ].join('')
}

function btnPrimary(x: number, y: number, w = 64, h = 14) {
  return `${rect(x, y, w, h, C.primary, 7)}${text(x + w / 2, y + 9.5, '●  Button', 7, C.white, 'middle')}`
}

function inputField(x: number, y: number, w = 120, label = '') {
  return [
    label ? text(x, y - 3, label, 7, C.textLight) : '',
    rect(x, y, w, 14, C.surface2, 4),
    line(x + 4, y + 7, x + w - 30, y + 7, C.border),
  ].join('')
}

function cardBox(x: number, y: number, w: number, h: number, hasImage = false) {
  const img = hasImage ? `${rect(x + 4, y + 4, w - 8, (h / 2) - 4, C.surface2, 3)}<text x="${x + w / 2}" y="${y + h / 4 + 6}" font-size="14" fill="${C.border}" text-anchor="middle" font-family="system-ui">⬜</text>` : ''
  const ty = hasImage ? y + h / 2 + 4 : y + 16
  return [
    rect(x, y, w, h, C.surface, 6),
    img,
    rect(x + 4, ty, w - 8, 6, C.surface2, 2),
    rect(x + 4, ty + 9, (w - 8) * 0.7, 4, C.border, 2),
    rect(x + 4, ty + 16, (w - 8) * 0.5, 4, C.border, 2),
  ].join('')
}

function sectionHeader(x: number, y: number, w: number) {
  return [
    rect(x + (w / 2) - 24, y, 48, 6, C.primary + '44', 3),
    rect(x + (w / 2) - 48, y + 10, 96, 8, C.surface2, 3),
    rect(x + (w / 2) - 36, y + 22, 72, 5, C.border, 2),
  ].join('')
}

// ── RENDERERS ──────────────────────────────────────────────────────────────────

type Renderer = (variantId: string) => string

const RENDERERS: Record<string, Renderer> = {

  // Elements
  'element-button': () => wrapSvg(320, 56, [
    rect(20, 16, 72, 22, C.primary, 11),
    text(56, 31, 'Primary', 8, C.white, 'middle'),
    rect(104, 16, 72, 22, C.surface2, 11),
    line(104, 16, 176, 16, C.border), line(104, 38, 176, 38, C.border), line(104, 16, 104, 38, C.border), line(176, 16, 176, 38, C.border),
    text(140, 31, 'Secondary', 8, C.text, 'middle'),
    rect(188, 16, 60, 22, 'transparent', 11),
    text(218, 31, 'Ghost', 8, C.text, 'middle'),
    rect(260, 16, 44, 22, C.primary + '22', 11),
    circle(272, 27, 5, C.primary + '66'),
    text(285, 31, 'Icon', 8, C.text, 'middle'),
  ].join('')),

  'element-badge': () => wrapSvg(320, 40, [
    pill(16, 12, 56, 16, C.primary + '22'),
    text(44, 24, 'New', 8, C.primary, 'middle'),
    pill(84, 12, 64, 16, C.surface2),
    circle(98, 20, 4, '#22c55e'),
    text(118, 24, 'Active', 8, C.text, 'middle'),
    pill(160, 12, 56, 16, C.surface2),
    text(188, 24, 'Draft', 8, C.text, 'middle'),
    pill(228, 12, 76, 16, C.surface2),
    rect(242, 17, 6, 6, '#f59e0b', 3),
    text(262, 24, 'Warning', 8, C.text, 'middle'),
  ].join('')),

  'element-input': () => wrapSvg(320, 60, [
    text(16, 14, 'Email address', 7, C.textLight),
    rect(16, 18, 200, 24, C.surface2, 6),
    text(26, 34, 'user@example.com', 8, C.border),
    rect(224, 18, 80, 24, C.primary, 6),
    text(264, 34, 'Submit', 8, C.white, 'middle'),
  ].join('')),

  'element-textarea': () => wrapSvg(320, 120, [
    text(16, 14, 'Message', 7, C.textLight),
    rect(16, 18, 288, 80, C.surface2, 6),
    text(26, 36, 'Write your message here...', 8, C.border),
    rect(24, 80, 200, 6, C.surface, 2),
    rect(24, 90, 140, 4, C.surface, 2),
    text(292, 102, '0/500', 7, C.border, 'end'),
  ].join('')),

  'element-select': () => wrapSvg(320, 60, [
    text(16, 14, 'Country', 7, C.textLight),
    rect(16, 18, 200, 24, C.surface2, 6),
    text(26, 34, 'Select a country...', 8, C.border),
    text(200, 33, '▾', 9, C.text, 'end'),
  ].join('')),

  'element-toggle': () => wrapSvg(320, 48, [
    rect(20, 8, 44, 24, C.primary, 12),
    circle(50, 20, 9, C.white),
    text(72, 23, 'Dark mode', 8, C.text),
    rect(20, 40, 14, 14, C.surface2, 3),
    text(40, 51, 'Remember me', 8, C.text),
  ].join('')),

  'element-avatar': () => wrapSvg(320, 64, [
    circle(36, 32, 22, C.surface2),
    text(36, 37, 'DG', 10, C.text, 'middle'),
    circle(90, 32, 22, C.primary + '33'),
    text(90, 37, 'JD', 10, C.primary, 'middle'),
    circle(144, 32, 22, C.surface2), circle(168, 32, 22, C.surface2), circle(192, 32, 22, C.surface2),
    text(220, 37, '+3 more', 8, C.text),
  ].join('')),

  'element-divider': () => wrapSvg(320, 32, [
    line(16, 16, 120, 16, C.border),
    rect(126, 9, 68, 14, C.bg),
    text(160, 20, 'OR', 8, C.text, 'middle'),
    line(200, 16, 304, 16, C.border),
  ].join('')),

  'element-skeleton': () => wrapSvg(320, 120, [
    rect(16, 12, 80, 10, C.surface2, 5),
    rect(16, 28, 200, 10, C.surface2, 5),
    rect(16, 44, 160, 10, C.surface2, 5),
    rect(16, 68, 60, 60, C.surface2, 6),
    rect(84, 72, 120, 8, C.surface2, 4),
    rect(84, 86, 80, 6, C.surface2, 4),
    rect(84, 98, 100, 6, C.surface2, 4),
  ].join('')),

  'element-tooltip': () => wrapSvg(320, 80, [
    btnPrimary(100, 44, 120, 20),
    rect(60, 8, 200, 28, C.surface2, 6),
    text(160, 19, 'Tooltip: more information', 7.5, C.textLight, 'middle'),
    text(160, 30, 'about this action', 7.5, C.textLight, 'middle'),
    `<polygon points="155,36 165,36 160,42" fill="${C.surface2}"/>`,
  ].join('')),

  'element-progress': () => wrapSvg(320, 48, [
    text(16, 14, 'Upload Progress', 7, C.textLight),
    rect(16, 18, 240, 10, C.surface2, 5),
    rect(16, 18, 160, 10, C.primary, 5),
    text(264, 26, '66%', 8, C.text),
    rect(16, 36, 12, 12, C.surface2, 6),
    circle(22, 42, 5, C.primary),
    text(34, 46, 'Processing', 7, C.textLight),
  ].join('')),

  'element-alert': () => wrapSvg(320, 64, [
    rect(16, 8, 288, 20, '#1e3a2f', 4),
    rect(16, 8, 3, 20, '#22c55e'),
    text(28, 22, '✓  Saved successfully! Your changes have been applied.', 7.5, '#86efac'),
    rect(16, 36, 288, 20, '#3b1c1c', 4),
    rect(16, 36, 3, 20, '#ef4444'),
    text(28, 50, '✕  Error: Could not save. Please try again.', 7.5, '#fca5a5'),
  ].join('')),

  // Navigation
  'nav-topbar': (v) => wrapSvg(320, 72, [
    rect(0, 0, 320, 72, C.surface),
    v === 'announcement' ? [
      rect(0, 0, 320, 24, C.primary),
      text(160, 15, '🎉  New feature launched — Learn more →', 8, C.white, 'middle'),
      rect(0, 24, 320, 48, C.surface),
    ].join('') : '',
    circle(16, v === 'announcement' ? 48 : 36, 10, C.primary + '33'),
    text(16, (v === 'announcement' ? 48 : 36) + 4, 'N', 9, C.primary, 'middle'),
    rect(34, (v === 'announcement' ? 39 : 27), 32, 8, C.surface2, 3),
    rect(74, (v === 'announcement' ? 39 : 27), 28, 8, C.surface2, 3),
    rect(110, (v === 'announcement' ? 39 : 27), 28, 8, C.surface2, 3),
    rect(226, (v === 'announcement' ? 33 : 21), 80, 20, C.primary, 10),
    text(266, (v === 'announcement' ? 46 : 34), 'Get Started', 7.5, C.white, 'middle'),
  ].join('')),

  'nav-sidebar': () => wrapSvg(320, 480, [
    rect(0, 0, 80, 480, C.surface),
    circle(40, 28, 14, C.primary + '22'),
    text(40, 33, 'N', 10, C.primary, 'middle'),
    ...[60, 96, 132, 168, 204, 240, 276].map((y, i) => [
      rect(12, y, 56, 28, i === 0 ? C.primary + '22' : 'transparent', 6),
      rect(20, y + 10, 8, 8, C.surface2, 2),
      rect(32, y + 11, 28, 6, i === 0 ? C.primary + '44' : C.surface2, 2),
    ].join('')).join(''),
    line(80, 0, 80, 480, C.border),
    rect(80, 0, 240, 480, C.bg),
    rect(92, 16, 160, 12, C.surface2, 4),
    rect(92, 36, 200, 420, C.surface, 6),
  ].join('')),

  'nav-tabs': (v) => {
    const tabs = ['Overview', 'Analytics', 'Settings', 'Team']
    const isUnderline = v === 'underline'
    return wrapSvg(320, 56, [
      rect(0, 0, 320, 56, C.surface),
      ...tabs.map((label, i) => {
        const x = 16 + i * 76
        const active = i === 0
        const bg = active ? (v === 'pill' ? C.primary + '22' : 'transparent') : 'transparent'
        const textColor = active ? C.primary : C.text
        return [
          rect(x, 12, 68, 32, bg, v === 'pill' ? 16 : 4),
          text(x + 34, 32, label, 8, textColor, 'middle'),
          isUnderline && active ? rect(x + 8, 42, 52, 2, C.primary, 1) : '',
        ].join('')
      }).join(''),
    ].join(''))
  },

  'nav-breadcrumb': () => wrapSvg(320, 40, [
    text(16, 24, 'Home', 8, C.text),
    text(52, 24, '/', 8, C.border),
    text(62, 24, 'Blog', 8, C.text),
    text(90, 24, '/', 8, C.border),
    text(100, 24, 'How to build...', 8, C.primary),
  ].join('')),

  'nav-footer': (v) => {
    if (v === 'minimal') return wrapSvg(320, 100, [
      rect(0, 0, 320, 100, C.surface),
      circle(32, 36, 12, C.primary + '33'),
      text(32, 41, 'N', 9, C.primary, 'middle'),
      rect(52, 30, 48, 8, C.surface2, 3),
      rect(52, 42, 36, 6, C.surface2, 3),
      ...([0, 1, 2, 3].map(i => pill(16 + i * 64, 66, 52, 12, C.surface2))).join(''),
      text(160, 90, '© 2025 Brand. All rights reserved.', 7, C.border, 'middle'),
    ].join(''))
    return wrapSvg(320, 280, [
      rect(0, 0, 320, 280, C.surface),
      ...([0, 1, 2, 3].map(i => [
        circle(20 + i * 76, 28, 8, C.primary + '33'),
        text(20 + i * 76, 33, 'N', 7, C.primary, 'middle'),
        rect(34 + i * 76, 22, 40, 6, C.surface2, 2),
        rect(10 + i * 76, 44, 56, 4, C.border, 2),
        rect(10 + i * 76, 52, 48, 4, C.border, 2),
        rect(10 + i * 76, 60, 40, 4, C.border, 2),
        rect(10 + i * 76, 68, 52, 4, C.border, 2),
      ].join(''))).join(''),
      line(0, 100, 320, 100, C.border),
      text(160, 118, '© 2025 Brand', 7, C.border, 'middle'),
    ].join(''))
  },

  'nav-pagination': () => wrapSvg(320, 56, [
    rect(20, 16, 28, 24, C.surface2, 6),
    text(34, 32, '←', 10, C.text, 'middle'),
    rect(52, 16, 24, 24, C.primary, 6),
    text(64, 32, '1', 9, C.white, 'middle'),
    ...[2, 3, 4].map((n, i) => [
      rect(80 + i * 28, 16, 24, 24, C.surface2, 6),
      text(92 + i * 28, 32, String(n), 9, C.text, 'middle'),
    ].join('')).join(''),
    rect(168, 16, 28, 24, C.surface2, 6),
    text(182, 32, '→', 10, C.text, 'middle'),
  ].join('')),

  // Hero sections
  'hero-centered': (v) => wrapSvg(320, 320, [
    v === 'gradient' || v === 'particles' ? `<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a0d00"/><stop offset="100%" stop-color="${C.bg}"/></linearGradient></defs><rect width="320" height="320" fill="url(#hg)"/>` : '',
    pill(120, 24, 80, 18, C.primary + '22'),
    text(160, 37, '✦  New Release', 8, C.primary, 'middle'),
    rect(40, 50, 240, 20, C.surface2, 4),
    rect(56, 76, 208, 14, C.surface2, 3),
    rect(80, 96, 160, 10, C.border, 3),
    rect(96, 120, 128, 32, C.primary, 16),
    text(160, 140, 'Get Started Free', 8.5, C.white, 'middle'),
    rect(240, 120, 72, 32, C.surface2, 16),
    text(276, 140, 'See Demo →', 7.5, C.text, 'middle'),
    v === 'with-image' ? [
      rect(40, 172, 240, 136, C.surface, 8),
      rect(48, 180, 224, 120, C.surface2, 6),
      text(160, 248, '[ App Screenshot ]', 8, C.border, 'middle'),
    ].join('') : '',
    v === 'with-video' ? [
      rect(0, 180, 320, 140, '#000', 0),
      rect(0, 180, 320, 140, 'rgba(0,0,0,0.6)', 0),
      circle(160, 250, 28, 'rgba(255,255,255,0.2)'),
      text(160, 256, '▶', 14, C.white, 'middle'),
    ].join('') : '',
  ].join('')),

  'hero-split': (v) => wrapSvg(320, 240, [
    v === 'dark-side' ? `<rect x="0" y="0" width="160" height="240" fill="${C.surface}"/><rect x="160" y="0" width="160" height="240" fill="${C.bg}"/>` : '',
    v !== 'text-right' ? [
      rect(16, 40, 128, 12, C.surface2, 3),
      rect(16, 58, 128, 8, C.border, 3),
      rect(16, 70, 100, 6, C.border, 3),
      rect(16, 84, 80, 24, C.primary, 12),
      text(56, 100, 'Learn More', 7, C.white, 'middle'),
      rect(170, 16, 134, 208, C.surface2, 6),
      text(237, 124, '[ Image ]', 8, C.border, 'middle'),
    ].join('') : [
      rect(16, 16, 134, 208, C.surface2, 6),
      text(83, 124, '[ Image ]', 8, C.border, 'middle'),
      rect(170, 40, 128, 12, C.surface2, 3),
      rect(170, 58, 128, 8, C.border, 3),
      rect(170, 84, 80, 24, C.primary, 12),
      text(210, 100, 'Learn More', 7, C.white, 'middle'),
    ].join(''),
  ].join('')),

  'hero-saas': () => wrapSvg(320, 320, [
    rect(40, 16, 240, 16, C.surface2, 4),
    rect(48, 38, 224, 10, C.surface2, 3),
    rect(64, 54, 192, 8, C.border, 3),
    rect(88, 72, 80, 28, C.primary, 14),
    text(128, 90, 'Start Free', 8, C.white, 'middle'),
    rect(176, 72, 72, 28, C.surface2, 14),
    text(212, 90, 'See Demo', 8, C.text, 'middle'),
    text(160, 118, '— Trusted by 2,000+ teams —', 7, C.border, 'middle'),
    ...([0, 1, 2, 3, 4].map(i => [
      rect(16 + i * 60, 128, 50, 14, C.surface2, 4),
    ].join(''))).join(''),
    rect(20, 156, 280, 148, C.surface, 8),
    rect(28, 164, 264, 132, C.surface2, 6),
    navBar(168, 264),
    text(160, 302, '[ Dashboard Preview ]', 8, C.border, 'middle'),
  ].join('')),

  'hero-blog': (v) => wrapSvg(320, 200, [
    v === 'featured-hero' ? [
      rect(0, 0, 320, 200, C.surface2, 0),
      `<rect x="0" y="0" width="320" height="200" fill="rgba(0,0,0,0.55)"/>`,
      pill(16, 16, 56, 16, C.primary + 'aa'),
      text(44, 28, 'Design', 7, C.white, 'middle'),
      rect(16, 40, 220, 14, 'rgba(255,255,255,0.3)', 3),
      rect(16, 60, 180, 10, 'rgba(255,255,255,0.2)', 3),
      circle(20, 90, 10, 'rgba(255,255,255,0.3)'),
      rect(36, 85, 60, 6, 'rgba(255,255,255,0.2)', 3),
      rect(36, 95, 40, 4, 'rgba(255,255,255,0.15)', 3),
    ].join('') : [
      pill(16, 16, 56, 16, C.primary + '22'),
      text(44, 28, 'Design', 7, C.primary, 'middle'),
      rect(16, 40, 240, 16, C.surface2, 4),
      rect(16, 62, 200, 10, C.border, 3),
      line(0, 88, 320, 88, C.border),
      circle(20, 106, 14, C.surface2),
      rect(40, 100, 80, 8, C.surface2, 3),
      rect(40, 112, 48, 6, C.border, 2),
      text(200, 107, '5 min read', 7, C.border, 'middle'),
      text(200, 118, 'May 2025', 7, C.border, 'middle'),
    ].join(''),
  ].join('')),

  'hero-portfolio': (v) => wrapSvg(320, 280, [
    v === 'with-photo' ? rect(0, 0, 140, 280, C.surface) : '',
    v === 'with-photo' ? [
      circle(70, 80, 50, C.surface2),
      text(70, 87, '👤', 22, C.border, 'middle'),
    ].join('') : '',
    v === 'dark-minimal' ? `<rect width="320" height="280" fill="#07080f"/>` : '',
    ...[
      [v === 'with-photo' ? 156 : 16, 32, 180, 14],
      [v === 'with-photo' ? 156 : 16, 52, 140, 8],
      [v === 'with-photo' ? 156 : 16, 66, 200, 6],
      [v === 'with-photo' ? 156 : 16, 76, 180, 6],
    ].map(([x, y, w, h]) => rect(x, y, w, h, C.surface2, 3)),
    rect(v === 'with-photo' ? 156 : 16, 96, 80, 24, C.primary, 12),
    text((v === 'with-photo' ? 156 : 16) + 40, 112, 'View Work', 7.5, C.white, 'middle'),
    ...[0, 1, 2, 3].map(i => circle((v === 'with-photo' ? 156 : 16) + 16 + i * 28, 140, 8, C.surface2)).join(''),
  ].join('')),

  // Content blocks
  'content-features': (v) => {
    if (v === 'alternating') return wrapSvg(320, 320, [
      ...[0, 1].map(i => [
        rect(i % 2 === 0 ? 16 : 170, 16 + i * 152, 134, 128, C.surface, 6),
        text(i % 2 === 0 ? 83 : 237, 92 + i * 152, '[ Image ]', 8, C.border, 'middle'),
        rect(i % 2 === 0 ? 160 : 16, 24 + i * 152, 144, 10, C.surface2, 3),
        rect(i % 2 === 0 ? 160 : 16, 40 + i * 152, 144, 6, C.border, 2),
        rect(i % 2 === 0 ? 160 : 16, 50 + i * 152, 120, 6, C.border, 2),
      ].join('')).join(''),
    ].join(''))
    if (v === 'bento') return wrapSvg(320, 280, [
      rect(16, 16, 184, 152, C.surface, 8),
      rect(208, 16, 96, 72, C.surface, 6),
      rect(208, 96, 96, 72, C.surface, 6),
      rect(16, 176, 96, 88, C.surface, 6),
      rect(120, 176, 96, 88, C.surface, 6),
      rect(224, 176, 80, 88, C.surface, 6),
      text(108, 100, '★  Featured', 8, C.primary, 'middle'),
    ].join(''))
    const cols = v === 'grid-4' ? 4 : 3
    const w = Math.floor(280 / cols)
    return wrapSvg(320, 240, [
      sectionHeader(0, 12, 320),
      ...Array.from({ length: cols }, (_, i) => [
        circle(24 + 16 + i * (w + 8), 80, 14, C.primary + '22'),
        rect(16 + i * (w + 8), 100, w, 8, C.surface2, 3),
        rect(16 + i * (w + 8), 114, w - 16, 6, C.border, 2),
        rect(16 + i * (w + 8), 124, w - 24, 6, C.border, 2),
      ].join('')).join(''),
    ].join(''))
  },

  'content-testimonials': (v) => {
    if (v === 'masonry') return wrapSvg(320, 320, [
      ...[0, 1, 2].map(i => {
        const x = 12 + i * 100, h = [160, 200, 140][i]
        return [
          rect(x, 16, 92, h, C.surface, 6),
          text(x + 46, 36, '★★★★★', 7, C.primary, 'middle'),
          rect(x + 8, 46, 76, 28, C.surface2, 3),
          circle(x + 20, h + 16 - 28, 10, C.surface2),
          rect(x + 34, h + 16 - 32, 48, 6, C.surface2, 2),
          rect(x + 34, h + 16 - 22, 36, 4, C.border, 2),
        ].join('')
      }).join(''),
    ].join(''))
    if (v === 'single') return wrapSvg(320, 200, [
      text(160, 32, '❝', 28, C.primary + '44', 'middle'),
      rect(24, 48, 272, 12, C.surface2, 3),
      rect(40, 66, 240, 10, C.border, 3),
      rect(56, 80, 208, 8, C.border, 3),
      circle(130, 112, 16, C.surface2),
      rect(152, 106, 80, 8, C.surface2, 3),
      rect(152, 118, 56, 6, C.border, 2),
    ].join(''))
    return wrapSvg(320, 280, [
      sectionHeader(0, 12, 320),
      ...([0, 1, 2].map(i => [
        rect(8 + i * 104, 60, 96, 120, C.surface, 6),
        text(56 + i * 104, 80, '★★★★★', 7, C.primary, 'middle'),
        rect(16 + i * 104, 90, 80, 32, C.surface2, 3),
        circle(28 + i * 104, 140, 10, C.surface2),
        rect(44 + i * 104, 134, 48, 6, C.surface2, 2),
        rect(44 + i * 104, 144, 36, 4, C.border, 2),
      ].join(''))).join(''),
    ].join(''))
  },

  'content-cta': (v) => {
    const isDark = v === 'dark' || v === 'gradient'
    const bg = v === 'gradient' ? '#1a0a00' : isDark ? C.surface : C.bg
    return wrapSvg(320, 160, [
      `<rect width="320" height="160" fill="${bg}"/>`,
      v === 'gradient' ? `<defs><linearGradient id="ctag" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.primary}33"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs><rect width="320" height="160" fill="url(#ctag)"/>` : '',
      rect(40, 32, 240, 14, isDark ? C.surface2 : C.surface, 4),
      rect(64, 52, 192, 10, isDark ? '#ffffff11' : C.border, 3),
      rect(88, 76, 80, 28, C.primary, 14),
      text(128, 94, 'Get Started', 8, C.white, 'middle'),
      rect(176, 76, 64, 28, isDark ? 'rgba(255,255,255,0.1)' : C.surface, 14),
      text(208, 94, 'Learn More', 7.5, C.text, 'middle'),
    ].join(''))
  },

  'content-faq': () => wrapSvg(320, 300, [
    sectionHeader(0, 12, 320),
    ...([0, 1, 2, 3, 4].map(i => [
      rect(16, 60 + i * 46, 288, 38, i === 0 ? C.surface : 'transparent', 6),
      rect(16, 60 + i * 46, 288, 38, 'transparent', 6),
      line(16, 60 + i * 46, 304, 60 + i * 46, C.border),
      rect(24, 68 + i * 46, 200, 8, C.surface2, 2),
      text(290, 83 + i * 46, i === 0 ? '▲' : '▾', 8, C.text, 'end'),
      i === 0 ? rect(24, 80, 240, 6, C.border, 2) : '',
    ].join(''))).join(''),
  ].join('')),

  'content-logos': (v) => wrapSvg(320, 100, [
    v === 'with-heading' ? text(160, 20, 'Trusted by innovative teams', 7.5, C.border, 'middle') : '',
    ...([0, 1, 2, 3, 4].map(i => [
      rect(12 + i * 60, v === 'with-heading' ? 32 : 20, 50, 20, C.surface2, 4),
      rect(16 + i * 60, v === 'with-heading' ? 37 : 25, 16, 10, C.border, 3),
    ].join(''))).join(''),
  ].join('')),

  'content-stats': (v) => wrapSvg(320, 140, [
    v === 'dark-bg' ? `<rect width="320" height="140" fill="${C.surface}"/>` : '',
    sectionHeader(0, 12, 320),
    ...([0, 1, 2, 3].map(i => [
      v === 'with-icons' ? circle(32 + i * 76, 80, 12, C.primary + '22') : '',
      rect(8 + i * 76, 100, 64, 14, C.surface2, 3),
      rect(16 + i * 76, 118, 48, 8, C.border, 2),
    ].join(''))).join(''),
  ].join('')),

  'content-pricing': (v) => {
    if (v === 'table') return wrapSvg(320, 320, [
      rect(0, 0, 320, 32, C.surface),
      ...([0, 1, 2, 3].map(i => rect(80 + i * 60, 4, 56, 24, i === 1 ? C.primary + '22' : C.surface2, 4))).join(''),
      ...([0, 1, 2, 3, 4, 5, 6, 7].map(i => [
        rect(0, 32 + i * 36, 320, 36, i % 2 === 0 ? C.surface : 'transparent'),
        rect(8, 40 + i * 36, 64, 8, C.surface2, 2),
        ...([0, 1, 2, 3].map(j => text(108 + j * 60, 49 + i * 36, j === 2 ? '✓' : j === 0 ? '—' : '✓', 10, j === 2 ? C.primary : C.text, 'middle'))).join(''),
      ].join(''))).join(''),
    ].join(''))
    const plans = v === 'cards-2' ? 2 : 3
    const w = plans === 2 ? 140 : 92
    return wrapSvg(320, 320, [
      sectionHeader(0, 12, 320),
      ...Array.from({ length: plans }, (_, i) => {
        const x = 8 + i * (w + 8), featured = plans === 3 ? i === 1 : i === 1
        return [
          rect(x, 56, w, 240, featured ? C.surface : C.surface, featured ? 10 : 6),
          featured ? `<rect x="${x}" y="${56}" width="${w}" height="240" rx="10" stroke="${C.primary}" stroke-width="1.5" fill="none"/>` : '',
          featured ? pill(x + w / 2 - 24, 44, 48, 14, C.primary) : '',
          featured ? text(x + w / 2, 55, 'Popular', 7, C.white, 'middle') : '',
          rect(x + 8, 72, w - 16, 8, C.surface2, 3),
          rect(x + 8, 88, (w - 16) * 0.6, 16, featured ? C.primary + '44' : C.surface2, 3),
          ...[0, 1, 2, 3, 4].map(j => [
            text(x + 16, 118 + j * 20, '✓', 8, C.primary),
            rect(x + 26, 112 + j * 20, w - 34, 6, C.surface2, 2),
          ].join('')).join(''),
          rect(x + 8, 220, w - 16, 24, featured ? C.primary : C.surface2, 8),
          text(x + w / 2, 236, 'Choose Plan', 7.5, featured ? C.white : C.text, 'middle'),
        ].join('')
      }).join(''),
    ].join(''))
  },

  'content-timeline': (v) => {
    if (v === 'horizontal') return wrapSvg(320, 160, [
      sectionHeader(0, 12, 320),
      line(32, 100, 288, 100, C.border),
      ...([0, 1, 2, 3].map(i => [
        circle(32 + i * 86, 100, 10, i <= 1 ? C.primary : C.surface2),
        text(32 + i * 86, 126, ['Plan', 'Design', 'Build', 'Ship'][i], 7.5, C.text, 'middle'),
        rect(32 + i * 86 - 24, 72, 48, 20, C.surface2, 3),
      ].join(''))).join(''),
    ].join(''))
    return wrapSvg(320, 320, [
      sectionHeader(0, 12, 320),
      line(60, 56, 60, 300, C.border),
      ...([0, 1, 2, 3].map(i => [
        circle(60, 70 + i * 60, 10, i <= 1 ? C.primary : C.surface2),
        rect(80, 62 + i * 60, 220, 36, C.surface, 6),
        rect(88, 68 + i * 60, 120, 8, C.surface2, 3),
        rect(88, 82 + i * 60, 180, 6, C.border, 2),
        rect(88, 92 + i * 60, 140, 6, C.border, 2),
      ].join(''))).join(''),
    ].join(''))
  },

  'content-map': () => wrapSvg(320, 200, [
    rect(0, 0, 320, 200, C.surface2),
    `<rect width="320" height="200" fill="${C.surface2}"/>`,
    ...Array.from({ length: 12 }, (_, i) => line(0, i * 18, 320, i * 18, C.border + '44')).join(''),
    ...Array.from({ length: 10 }, (_, i) => line(i * 36, 0, i * 36, 200, C.border + '44')).join(''),
    rect(120, 60, 80, 80, C.primary + '11', 4),
    circle(160, 100, 12, C.primary),
    text(160, 105, '📍', 10, C.white, 'middle'),
    rect(170, 72, 90, 40, C.surface, 6),
    rect(178, 80, 72, 8, C.surface2, 2),
    rect(178, 92, 56, 6, C.border, 2),
  ].join('')),

  // Cards
  'card-feature': (v) => wrapSvg(320, 120, [
    ...[0, 1, 2].map(i => [
      rect(8 + i * 104, 8, 96, 104, C.surface, 6),
      v === 'icon-left' ? [
        circle(22 + i * 104, 40, 10, C.primary + '22'),
        rect(36 + i * 104, 32, 56, 6, C.surface2, 2),
        rect(36 + i * 104, 42, 40, 5, C.border, 2),
      ].join('') : [
        circle(56 + i * 104, 36, 14, C.primary + '22'),
        rect(20 + i * 104, 56, 68, 8, C.surface2, 2),
        rect(20 + i * 104, 68, 52, 6, C.border, 2),
        rect(20 + i * 104, 78, 60, 6, C.border, 2),
      ].join(''),
    ].join('')).join(''),
  ].join('')),

  'card-pricing': () => wrapSvg(320, 280, [
    rect(40, 8, 240, 264, C.surface, 8),
    `<rect x="40" y="8" width="240" height="264" rx="8" stroke="${C.primary}" stroke-width="1.5" fill="none"/>`,
    pill(104, -2, 112, 16, C.primary),
    text(160, 10, 'Most Popular', 7, C.white, 'middle'),
    rect(56, 24, 120, 12, C.surface2, 3),
    rect(56, 42, 80, 28, C.primary + '33', 4),
    ...[0, 1, 2, 3, 4].map(i => [
      text(64, 92 + i * 22, '✓', 8, C.primary),
      rect(76, 86 + i * 22, 180, 6, C.surface2, 2),
    ].join('')).join(''),
    rect(56, 212, 208, 36, C.primary, 10),
    text(160, 234, 'Start Free Trial', 8, C.white, 'middle'),
  ].join('')),

  'card-product': () => wrapSvg(320, 240, [
    ...[0, 1, 2].map(i => [
      rect(8 + i * 104, 8, 96, 224, C.surface, 6),
      rect(16 + i * 104, 16, 80, 80, C.surface2, 4),
      text(56 + i * 104, 64, '📦', 14, C.border, 'middle'),
      rect(16 + i * 104, 104, 80, 8, C.surface2, 2),
      rect(16 + i * 104, 116, 56, 12, C.primary + '33', 3),
      rect(16 + i * 104, 136, 80, 20, C.primary, 6),
      text(56 + i * 104, 150, 'Add to Cart', 7, C.white, 'middle'),
    ].join('')).join(''),
  ].join('')),

  'card-article': (v) => {
    if (v === 'horizontal') return wrapSvg(320, 120, [
      ...[0, 1].map(i => [
        rect(8, 8 + i * 56, 56, 48, C.surface2, 4),
        rect(72, 14 + i * 56, 200, 8, C.surface2, 3),
        rect(72, 26 + i * 56, 180, 6, C.border, 2),
        rect(72, 36 + i * 56, 100, 6, C.border, 2),
        pill(72, 46 + i * 56, 48, 10, C.primary + '22'),
        text(96, 55 + i * 56, 'Design', 6, C.primary, 'middle'),
      ].join('')).join(''),
    ].join(''))
    return wrapSvg(320, 280, [
      ...[0, 1, 2].map(i => [
        rect(8 + i * 104, 8, 96, 264, C.surface, 6),
        rect(16 + i * 104, 16, 80, 80, C.surface2, 4),
        pill(16 + i * 104, 20, 44, 12, C.primary + '33'),
        text(38 + i * 104, 30, 'Design', 6, C.primary, 'middle'),
        rect(16 + i * 104, 104, 80, 10, C.surface2, 2),
        rect(16 + i * 104, 118, 80, 8, C.border, 2),
        rect(16 + i * 104, 130, 60, 8, C.border, 2),
        circle(22 + i * 104, 156, 8, C.surface2),
        rect(34 + i * 104, 150, 56, 6, C.surface2, 2),
        rect(34 + i * 104, 160, 36, 4, C.border, 2),
      ].join('')).join(''),
    ].join(''))
  },

  'card-profile': (v) => wrapSvg(320, v === 'horizontal' ? 96 : 200, [
    ...(v === 'horizontal' ? [0, 1, 2] : []).map(i => [
      rect(8, 8 + i * 28, 304, 24, C.surface, 4),
      circle(20, 20 + i * 28, 8, C.surface2),
      rect(34, 13 + i * 28, 80, 6, C.surface2, 2),
      rect(34, 23 + i * 28, 56, 4, C.border, 2),
      rect(220, 13 + i * 28, 80, 14, C.surface2, 3),
    ].join('')).join(''),
    ...(v !== 'horizontal' ? [0, 1, 2].map(i => [
      rect(8 + i * 104, 8, 96, 184, C.surface, 6),
      circle(56 + i * 104, 48, 26, C.surface2),
      rect(20 + i * 104, 84, 72, 8, C.surface2, 3),
      rect(24 + i * 104, 96, 64, 6, C.border, 2),
      rect(12 + i * 104, 112, 80, 4, C.border, 2),
      rect(12 + i * 104, 120, 68, 4, C.border, 2),
      ...[0, 1, 2].map(j => circle(20 + j * 18 + i * 104, 148, 6, C.surface2)).join(''),
    ].join('')).join('') : []),
  ].join('')),

  'card-stat': (v) => wrapSvg(320, 100, [
    ...[0, 1, 2, 3].map(i => [
      rect(8 + i * 76, 8, 68, 84, C.surface, 6),
      v === 'with-icon' ? circle(42 + i * 76, 30, 12, C.primary + '22') : '',
      rect(16 + i * 76, v === 'with-icon' ? 48 : 24, 52, 16, C.surface2, 3),
      rect(16 + i * 76, v === 'with-icon' ? 70 : 46, 36, 8, C.border, 2),
      v === 'with-trend' ? [
        text(60 + i * 76, 74, '↑ 12%', 7, '#22c55e', 'end'),
      ].join('') : '',
    ].join('')).join(''),
  ].join('')),

  'card-testimonial': () => wrapSvg(320, 160, [
    rect(8, 8, 200, 144, C.surface, 6),
    text(28, 36, '❝', 16, C.primary + '66'),
    rect(28, 48, 164, 8, C.surface2, 2),
    rect(28, 60, 148, 6, C.border, 2),
    rect(28, 70, 160, 6, C.border, 2),
    text(28, 96, '★★★★★', 8, C.primary),
    circle(28, 120, 10, C.surface2),
    rect(44, 114, 80, 6, C.surface2, 2),
    rect(44, 124, 56, 4, C.border, 2),
  ].join('')),

  // Menus
  'menu-dropdown': () => wrapSvg(320, 200, [
    rect(16, 8, 100, 24, C.surface2, 6),
    text(50, 24, 'Options ▾', 8, C.text, 'middle'),
    rect(16, 36, 180, 152, C.surface, 8),
    `<rect x="16" y="36" width="180" height="152" rx="8" stroke="${C.border}" stroke-width="1" fill="none"/>`,
    ...(['Profile', 'Settings', 'Billing', '—', 'Sign Out'].map((item, i) => [
      item === '—' ? line(24, 100 + i * 28, 188, 100 + i * 28, C.border) : [
        rect(24, 44 + i * 28, 10, 10, C.surface2, 2),
        rect(40, 46 + i * 28, 80, 6, C.surface2, 2),
        i === 4 ? '' : rect(40, 46 + i * 28, 80, 6, C.surface2, 2),
      ].join(''),
    ].join(''))).join(''),
  ].join('')),

  'menu-mega': () => wrapSvg(320, 240, [
    navBar(0),
    rect(0, 28, 320, 200, C.surface, 0),
    `<rect x="0" y="28" width="320" height="200" stroke="${C.border}" stroke-width="1" fill="${C.surface}"/>`,
    ...[0, 1, 2].map(i => [
      rect(8 + i * 104, 40, 96, 10, C.primary + '33', 3),
      ...[0, 1, 2, 3].map(j => rect(8 + i * 104, 58 + j * 20, 80, 6, C.surface2, 2)).join(''),
    ].join('')).join(''),
    rect(8, 160, 304, 56, C.surface2, 6),
    rect(16, 168, 96, 40, C.primary + '11', 4),
    text(64, 192, 'Featured', 7, C.primary, 'middle'),
  ].join('')),

  'menu-command': () => wrapSvg(320, 300, [
    rect(32, 16, 256, 268, C.surface, 10),
    `<rect x="32" y="16" width="256" height="268" rx="10" stroke="${C.border}" stroke-width="1" fill="none"/>`,
    rect(40, 24, 240, 24, C.surface2, 6),
    text(52, 40, '🔍  Search...', 8, C.border),
    text(260, 40, '⌘K', 7, C.border, 'end'),
    line(32, 52, 288, 52, C.border),
    ...(['Recent', 'Commands', 'Navigation'].map((section, si) => [
      text(44, 68 + si * 76, section, 7, C.border),
      ...[0, 1].map(i => [
        rect(40, 74 + si * 76 + i * 24, 240, 20, i === 0 && si === 0 ? C.primary + '22' : 'transparent', 4),
        rect(48, 79 + si * 76 + i * 24, 10, 10, C.surface2, 2),
        rect(64, 81 + si * 76 + i * 24, 120, 6, C.surface2, 2),
        text(272, 88 + si * 76 + i * 24, '↵', 7, C.border, 'end'),
      ].join('')).join(''),
    ].join(''))).join(''),
  ].join('')),

  'menu-mobile': (v) => {
    if (v === 'bottom-nav') return wrapSvg(320, 80, [
      rect(0, 0, 320, 80, C.surface),
      line(0, 0, 320, 0, C.border),
      ...[0, 1, 2, 3, 4].map(i => [
        circle(32 + i * 64, 28, 12, i === 0 ? C.primary + '22' : 'transparent'),
        text(32 + i * 64, 50, ['Home', 'Search', 'Add', 'Inbox', 'Profile'][i], 6, i === 0 ? C.primary : C.text, 'middle'),
      ].join('')).join(''),
    ].join(''))
    return wrapSvg(320, 480, [
      rect(0, 0, 320, 480, 'rgba(0,0,0,0.6)'),
      rect(0, 0, 220, 480, C.surface),
      circle(36, 32, 14, C.primary + '33'),
      text(36, 37, 'N', 10, C.primary, 'middle'),
      ...(['Home', 'Products', 'Pricing', 'Blog', 'Contact'].map((item, i) => [
        rect(12, 60 + i * 40, 196, 32, i === 0 ? C.primary + '22' : 'transparent', 6),
        rect(20, 68 + i * 40, 100, 8, i === 0 ? C.primary + '44' : C.surface2, 3),
      ].join(''))).join(''),
      rect(12, 320, 196, 32, C.primary, 8),
      text(110, 340, 'Get Started', 8, C.white, 'middle'),
    ].join(''))
  },

  // Grids
  'grid-standard': (v) => {
    const cols = parseInt(v.split('-')[0]) || 3
    const w = Math.floor(296 / cols)
    return wrapSvg(320, 200, [
      ...Array.from({ length: cols }, (_, i) => cardBox(12 + i * (w + 4), 8, w, 180, true)).join(''),
    ].join(''))
  },

  'grid-masonry': () => wrapSvg(320, 280, [
    ...[0, 1].map(col => [
      [100, 140, 80].map((h, i) => {
        const x = 12 + col * 156
        const y = 8 + [0, 108, 256][i]
        const oy = col === 1 ? [60, 180] : [0, 0, 0]
        return i < 2 || col === 0 ? cardBox(x, 8 + (col === 1 ? [60, 208][i] || 0 : [0, 108, 256][i]), 144, [100, 140, 80][col === 1 ? i : i], true) : ''
      }).join(''),
    ].join('')).join(''),
  ].join('')),

  'grid-bento': (v) => wrapSvg(320, 280, [
    rect(12, 12, 180, 140, C.surface, 8),
    text(102, 88, '★  Featured Block', 8, C.primary, 'middle'),
    rect(200, 12, 108, 68, C.surface, 6),
    rect(200, 88, 108, 64, C.surface, 6),
    rect(12, 160, 88, 108, C.surface, 6),
    rect(108, 160, 88, 108, C.surface, 6),
    rect(204, 160, 104, 108, C.surface, 6),
    text(102, 100, '', 0, C.surface2, 0),
  ].join('')),

  'grid-gallery': (v) => wrapSvg(320, 240, [
    ...(v === 'collage' ? [
      rect(12, 12, 184, 216, C.surface2, 6),
      rect(204, 12, 104, 104, C.surface2, 6),
      rect(204, 124, 104, 104, C.surface2, 6),
    ] : Array.from({ length: 6 }, (_, i) => rect(12 + (i % 3) * 100, 12 + Math.floor(i / 3) * 108, 92, 100, C.surface2, 4))).join(''),
  ].join('')),

  'grid-blog': (v) => {
    if (v === 'magazine') return wrapSvg(320, 320, [
      rect(12, 12, 184, 164, C.surface2, 6),
      text(104, 104, 'Featured', 8, C.border, 'middle'),
      rect(204, 12, 104, 78, C.surface, 4),
      rect(204, 98, 104, 78, C.surface, 4),
      ...[0, 1, 2].map(i => cardBox(12 + i * 100, 184, 92, 120, false)).join(''),
    ].join(''))
    if (v === 'list') return wrapSvg(320, 240, [
      ...[0, 1, 2, 3].map(i => [
        rect(12, 12 + i * 56, 64, 48, C.surface2, 4),
        rect(84, 18 + i * 56, 180, 8, C.surface2, 2),
        rect(84, 30 + i * 56, 160, 6, C.border, 2),
        rect(84, 40 + i * 56, 100, 6, C.border, 2),
        pill(84, 50 + i * 56, 44, 8, C.primary + '22'),
        text(106, 58 + i * 56, 'Dev', 6, C.primary, 'middle'),
      ].join('')).join(''),
    ].join(''))
    return wrapSvg(320, 280, [
      ...([0, 1, 2].map(i => cardBox(12 + i * 100, 12, 92, 256, true))).join(''),
    ].join(''))
  },

  // Forms
  'form-auth': (v) => {
    if (v === 'split') return wrapSvg(320, 280, [
      rect(0, 0, 140, 280, C.primary + '11'),
      text(70, 100, '🔐', 20, C.primary, 'middle'),
      rect(16, 120, 108, 8, C.surface2, 3),
      rect(16, 134, 88, 6, C.border, 2),
      rect(148, 28, 164, 224, C.surface),
      rect(156, 40, 148, 8, C.surface2, 3),
      inputField(156, 56, 148, 'Email'),
      inputField(156, 90, 148, 'Password'),
      rect(156, 118, 148, 22, C.primary, 8),
      text(230, 133, 'Sign In', 8, C.white, 'middle'),
      text(230, 158, 'Forgot password?', 7, C.primary, 'middle'),
      line(156, 170, 304, 170, C.border),
      text(230, 182, 'or continue with', 7, C.border, 'middle'),
      rect(156, 192, 148, 22, C.surface2, 8),
      text(230, 207, 'G  Continue with Google', 7.5, C.text, 'middle'),
    ].join(''))
    if (v === 'otp') return wrapSvg(320, 200, [
      text(160, 28, 'Enter verification code', 9, C.text, 'middle'),
      text(160, 42, 'Sent to user@email.com', 7, C.border, 'middle'),
      ...([0, 1, 2, 3, 4, 5].map(i => [
        rect(32 + i * 44, 56, 36, 44, i === 2 ? C.primary + '22' : C.surface2, 8),
        i === 2 ? `<rect x="${32 + i * 44}" y="${56}" width="36" height="44" rx="8" stroke="${C.primary}" stroke-width="1.5" fill="none"/>` : '',
        text(50 + i * 44, 84, i < 2 ? ['3', '7'][i] : i === 2 ? '|' : '', 14, i < 2 ? C.white : C.border, 'middle'),
      ].join(''))).join(''),
      rect(64, 116, 192, 24, C.primary, 8),
      text(160, 132, 'Verify', 8, C.white, 'middle'),
    ].join(''))
    return wrapSvg(320, 280, [
      rect(60, 8, 200, 264, C.surface, 8),
      rect(80, 20, 160, 10, C.surface2, 4),
      inputField(76, 44, 168, 'Email'),
      inputField(76, 80, 168, 'Password'),
      v === 'register' ? inputField(76, 116, 168, 'Confirm Password') : '',
      rect(76, v === 'register' ? 148 : 108, 168, 24, C.primary, 8),
      text(160, v === 'register' ? 164 : 124, v === 'register' ? 'Create Account' : 'Sign In', 8, C.white, 'middle'),
      line(76, v === 'register' ? 180 : 140, 244, v === 'register' ? 180 : 140, C.border),
      text(160, v === 'register' ? 196 : 156, 'or continue with', 7, C.border, 'middle'),
      rect(76, v === 'register' ? 204 : 164, 168, 22, C.surface2, 8),
      text(160, v === 'register' ? 219 : 179, '⬜  Continue with Google', 7.5, C.text, 'middle'),
    ].join(''))
  },

  'form-contact': (v) => wrapSvg(320, 280, [
    v === 'with-map' ? [
      rect(0, 0, 180, 280, C.surface2, 0),
      ...Array.from({ length: 8 }, (_, i) => line(0, i * 36, 180, i * 36, C.border + '44')).join(''),
      ...Array.from({ length: 6 }, (_, i) => line(i * 36, 0, i * 36, 280, C.border + '44')).join(''),
      circle(90, 140, 12, C.primary),
      text(90, 145, '📍', 8, C.white, 'middle'),
    ].join('') : '',
    ...(v === 'with-map' ? [
      inputField(192, 20, 112, 'Name'),
      inputField(192, 56, 112, 'Email'),
      rect(192, 90, 112, 56, C.surface2, 4),
      rect(200, 156, 104, 22, C.primary, 8),
      text(252, 171, 'Send', 8, C.white, 'middle'),
    ] : [
      inputField(24, 20, 272, 'Full Name'),
      inputField(24, 56, 272, 'Email'),
      rect(24, 90, 272, 88, C.surface2, 4),
      text(34, 108, 'Tell us how we can help...', 8, C.border),
      rect(24, 188, 272, 28, C.primary, 10),
      text(160, 206, 'Send Message', 8.5, C.white, 'middle'),
    ]),
  ].join('')),

  'form-newsletter': (v) => {
    if (v === 'banner') return wrapSvg(320, 100, [
      `<rect width="320" height="100" fill="${C.surface}"/>`,
      text(160, 28, 'Stay in the loop', 10, C.white, 'middle'),
      rect(32, 44, 180, 24, C.surface2, 8),
      text(52, 60, 'Your email address', 8, C.border),
      rect(220, 44, 88, 24, C.primary, 8),
      text(264, 60, 'Subscribe', 7.5, C.white, 'middle'),
    ].join(''))
    return wrapSvg(320, 100, [
      text(160, 22, 'Get weekly design tips', 8, C.text, 'middle'),
      rect(24, 32, 196, 28, C.surface2, 8),
      text(44, 50, 'Your email...', 8, C.border),
      rect(228, 32, 80, 28, C.primary, 8),
      text(268, 50, 'Subscribe', 7.5, C.white, 'middle'),
      text(160, 76, 'No spam. Unsubscribe anytime.', 7, C.border, 'middle'),
    ].join(''))
  },

  'form-checkout': () => wrapSvg(320, 320, [
    rect(8, 8, 196, 304, C.surface, 8),
    rect(16, 20, 100, 8, C.surface2, 3),
    inputField(16, 40, 180, 'Full Name'),
    inputField(16, 76, 180, 'Email'),
    inputField(16, 112, 180, 'Card Number'),
    rect(16, 148, 86, 28, C.surface2, 4),
    rect(110, 148, 86, 28, C.surface2, 4),
    rect(16, 188, 180, 28, C.primary, 8),
    text(106, 206, 'Place Order', 8, C.white, 'middle'),
    rect(212, 8, 100, 304, C.surface2, 8),
    rect(220, 20, 84, 8, C.surface2, 3),
    ...[0, 1, 2].map(i => [
      rect(220, 40 + i * 28, 60, 8, C.surface, 3),
      rect(284, 40 + i * 28, 16, 8, C.surface, 3),
    ].join('')).join(''),
    line(212, 132, 312, 132, C.border),
    rect(220, 144, 60, 8, C.surface, 3),
    rect(284, 144, 20, 10, C.primary + '44', 3),
  ].join('')),

  'form-multistep': () => wrapSvg(320, 280, [
    rect(0, 0, 320, 32, C.surface),
    ...[0, 1, 2, 3].map(i => [
      circle(40 + i * 80, 16, 10, i === 0 ? C.primary : i === 1 ? C.primary + '66' : C.surface2),
      text(40 + i * 80, 21, String(i + 1), 7, i <= 1 ? C.white : C.text, 'middle'),
      i < 3 ? line(50 + i * 80, 16, 110 + i * 80, 16, i === 0 ? C.primary : C.border) : '',
    ].join('')).join(''),
    rect(16, 44, 288, 196, C.surface, 8),
    rect(24, 56, 160, 10, C.surface2, 3),
    inputField(24, 80, 272, 'First Name'),
    inputField(24, 116, 272, 'Last Name'),
    inputField(24, 152, 272, 'Company'),
    rect(24, 196, 272, 28, C.primary, 8),
    text(160, 214, 'Continue →', 8, C.white, 'middle'),
  ].join('')),

  'form-settings': () => wrapSvg(320, 320, [
    rect(0, 0, 80, 320, C.surface),
    ...(['Profile', 'Account', 'Notifications', 'Security', 'Billing'].map((item, i) => [
      rect(4, 8 + i * 36, 72, 28, i === 0 ? C.primary + '22' : 'transparent', 6),
      rect(12, 16 + i * 36, 52, 6, i === 0 ? C.primary + '44' : C.surface2, 2),
    ].join(''))).join(''),
    line(80, 0, 80, 320, C.border),
    rect(88, 8, 224, 304, C.surface, 8),
    rect(96, 20, 100, 8, C.surface2, 3),
    circle(112, 60, 24, C.surface2),
    rect(140, 48, 80, 8, C.surface2, 3),
    rect(140, 60, 60, 6, C.border, 3),
    rect(140, 72, 72, 16, C.surface2, 4),
    inputField(96, 100, 208, 'Display Name'),
    inputField(96, 136, 208, 'Email'),
    inputField(96, 172, 208, 'Bio'),
    rect(96, 212, 208, 24, C.primary, 8),
    text(200, 228, 'Save Changes', 8, C.white, 'middle'),
  ].join('')),

  // Media
  'media-image': () => wrapSvg(320, 200, [
    rect(16, 8, 288, 160, C.surface2, 6),
    text(160, 96, '🖼️  Image Block', 8, C.border, 'middle'),
    text(160, 180, 'Figure caption text goes here', 7, C.border, 'middle'),
  ].join('')),

  'media-video': () => wrapSvg(320, 200, [
    rect(16, 8, 288, 168, C.surface2, 6),
    text(160, 80, '▶', 22, 'rgba(255,255,255,0.2)'),
    circle(160, 92, 24, 'rgba(255,87,1,0.3)'),
    text(160, 99, '▶', 12, C.white, 'middle'),
    rect(16, 176, 288, 16, C.surface, 0),
    rect(16, 179, 180, 10, C.primary + '44', 0),
    circle(196, 184, 6, C.primary),
  ].join('')),

  // Data
  'data-table': (v) => wrapSvg(320, 240, [
    rect(0, 0, 320, 28, C.surface),
    ...(['Name', 'Status', 'Role', 'Action'].map((h, i) => [
      text(12 + i * 78, 18, h, 7.5, C.textLight),
    ].join(''))).join(''),
    line(0, 28, 320, 28, C.border),
    ...([0, 1, 2, 3, 4].map(i => [
      rect(0, 28 + i * 42, 320, 42, i % 2 === 0 && v === 'striped' ? C.surface : 'transparent'),
      circle(16, 49 + i * 42, 10, C.surface2),
      rect(32, 43 + i * 42, 60, 6, C.surface2, 2),
      rect(32, 53 + i * 42, 40, 4, C.border, 2),
      pill(100, 44 + i * 42, 40, 12, '#1e3a2f'),
      text(120, 54 + i * 42, 'Active', 6, '#86efac', 'middle'),
      rect(152, 43 + i * 42, 56, 6, C.surface2, 2),
      v === 'with-actions' ? [
        rect(220, 41 + i * 42, 32, 14, C.surface2, 4),
        rect(258, 41 + i * 42, 32, 14, C.surface2, 4),
        text(236, 52 + i * 42, 'Edit', 6, C.text, 'middle'),
        text(274, 52 + i * 42, 'Del', 6, C.text, 'middle'),
      ].join('') : '',
      line(0, 70 + i * 42, 320, 70 + i * 42, C.border),
    ].join(''))).join(''),
  ].join('')),

  'data-chart': (v) => {
    if (v === 'pie') return wrapSvg(320, 200, [
      `<circle cx="120" cy="100" r="70" fill="transparent" stroke="${C.primary}" stroke-width="40" stroke-dasharray="110 220" stroke-dashoffset="55"/>`,
      `<circle cx="120" cy="100" r="70" fill="transparent" stroke="${C.surface2}" stroke-width="40" stroke-dasharray="220 220" stroke-dashoffset="165"/>`,
      circle(120, 100, 36, C.bg),
      text(120, 105, '64%', 11, C.white, 'middle'),
      ...([0, 1, 2].map(i => [
        rect(208, 64 + i * 32, 10, 10, [C.primary, C.surface2, C.border][i], 2),
        rect(224, 66 + i * 32, 60, 6, C.surface2, 2),
        rect(224, 76 + i * 32, 44, 4, C.border, 2),
      ].join(''))).join(''),
    ].join(''))
    if (v === 'sparkline') return wrapSvg(320, 80, [
      rect(16, 16, 288, 48, C.surface, 4),
      `<polyline points="32,52 80,40 128,44 176,28 224,32 272,20 304,24" fill="none" stroke="${C.primary}" stroke-width="2"/>`,
    ].join(''))
    if (v === 'line') return wrapSvg(320, 200, [
      rect(16, 8, 288, 164, C.surface, 6),
      `<defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${C.primary}" stop-opacity="0.3"/><stop offset="100%" stop-color="${C.primary}" stop-opacity="0"/></linearGradient></defs>`,
      `<polyline points="32,140 88,100 144,120 200,60 256,80 296,40" fill="none" stroke="${C.primary}" stroke-width="2.5"/>`,
      `<polygon points="32,140 88,100 144,120 200,60 256,80 296,40 296,172 32,172" fill="url(#area)"/>`,
      ...Array.from({ length: 6 }, (_, i) => line(32 + i * 52, 28, 32 + i * 52, 172, C.border + '44')).join(''),
    ].join(''))
    // bar chart default
    return wrapSvg(320, 200, [
      rect(16, 8, 288, 164, C.surface, 6),
      ...([0, 1, 2, 3, 4, 5].map(i => {
        const h = [80, 120, 60, 140, 100, 90][i]
        return [
          rect(28 + i * 46, 172 - h, 36, h, i === 3 ? C.primary : C.primary + '55', 3),
          text(46 + i * 46, 182, `M${i + 1}`, 6, C.border, 'middle'),
        ].join('')
      })).join(''),
    ].join(''))
  },

  'data-list': (v) => wrapSvg(320, 240, [
    ...([0, 1, 2, 3, 4].map(i => [
      rect(0, i * 46, 320, 46, i % 2 === 0 ? C.surface : 'transparent'),
      v === 'avatar-list' ? circle(20, 23 + i * 46, 12, C.surface2) : rect(12, 16 + i * 46, 16, 16, C.surface2, 3),
      rect(40, 14 + i * 46, 140, 8, C.surface2, 2),
      rect(40, 26 + i * 46, 100, 6, C.border, 2),
      v === 'numbered' ? text(290, 26 + i * 46, `#${i + 1}`, 8, C.primary, 'end') : '',
      line(0, 46 + i * 46, 320, 46 + i * 46, C.border),
    ].join(''))).join(''),
  ].join('')),

  // Commerce
  'commerce-cart': (v) => {
    if (v === 'mini-cart') return wrapSvg(320, 200, [
      rect(120, 0, 200, 200, C.surface, 8),
      `<rect x="120" y="0" width="200" height="200" rx="8" stroke="${C.border}" stroke-width="1" fill="none"/>`,
      rect(128, 8, 110, 8, C.surface2, 3),
      text(312, 16, '✕', 8, C.text, 'end'),
      ...[0, 1].map(i => [
        rect(128, 28 + i * 64, 48, 48, C.surface2, 4),
        rect(184, 34 + i * 64, 80, 6, C.surface2, 2),
        rect(184, 44 + i * 64, 60, 5, C.border, 2),
        rect(184, 56 + i * 64, 48, 12, C.surface2, 4),
        text(288, 46 + i * 64, '$29', 8, C.text, 'end'),
      ].join('')).join(''),
      line(128, 156, 312, 156, C.border),
      rect(128, 164, 184, 24, C.primary, 8),
      text(220, 180, 'Checkout — $58', 8, C.white, 'middle'),
    ].join(''))
    return wrapSvg(320, 280, [
      rect(0, 0, 320, 28, C.surface),
      rect(8, 8, 120, 12, C.surface2, 3),
      ...[0, 1, 2].map(i => [
        rect(8, 36 + i * 68, 64, 56, C.surface2, 4),
        rect(80, 42 + i * 68, 140, 8, C.surface2, 2),
        rect(80, 54 + i * 68, 100, 6, C.border, 2),
        rect(80, 66 + i * 68, 64, 16, C.surface2, 4),
        rect(240, 42 + i * 68, 60, 8, C.surface2, 2),
        line(8, 92 + i * 68, 312, 92 + i * 68, C.border),
      ].join('')).join(''),
      rect(8, 244, 304, 28, C.primary, 8),
      text(160, 262, 'Proceed to Checkout', 8, C.white, 'middle'),
    ].join(''))
  },

  'commerce-product': () => wrapSvg(320, 280, [
    rect(8, 8, 168, 264, C.surface2, 6),
    text(92, 148, '📦', 22, C.border, 'middle'),
    ...[0, 1, 2, 3].map(i => [
      rect(8 + i * 44, 252, 40, 16, i === 0 ? C.primary + '44' : C.surface2, 3),
    ].join('')).join(''),
    rect(184, 8, 128, 264, C.surface, 6),
    pill(192, 16, 56, 12, C.primary + '22'),
    text(220, 26, 'In Stock', 6.5, C.primary, 'middle'),
    rect(192, 36, 110, 10, C.surface2, 3),
    text(192, 58, '★★★★☆  (128)', 7, C.primary),
    rect(192, 68, 60, 14, C.primary + '33', 3),
    text(192, 100, 'Color:', 7, C.border),
    ...[0, 1, 2].map(i => circle(192 + 12 + i * 20, 116, 7, [C.primary, C.surface2, '#6366f1'][i])).join(''),
    text(192, 140, 'Size:', 7, C.border),
    ...[0, 1, 2, 3].map(i => [
      rect(192 + i * 26, 148, 22, 14, i === 1 ? C.primary + '22' : C.surface2, 3),
      i === 1 ? `<rect x="${192 + i * 26}" y="${148}" width="22" height="14" rx="3" stroke="${C.primary}" stroke-width="1" fill="none"/>` : '',
      text(203 + i * 26, 159, ['S', 'M', 'L', 'XL'][i], 6, i === 1 ? C.primary : C.text, 'middle'),
    ].join('')).join(''),
    rect(192, 176, 110, 24, C.primary, 8),
    text(247, 192, 'Add to Cart', 7.5, C.white, 'middle'),
    rect(192, 208, 110, 24, C.surface2, 8),
    text(247, 224, '♡  Wishlist', 7.5, C.text, 'middle'),
  ].join('')),

  // Team
  'team-grid': (v) => {
    if (v === 'founders') return wrapSvg(320, 200, [
      sectionHeader(0, 12, 320),
      ...[0, 1].map(i => [
        circle(80 + i * 160, 100, 36, C.surface2),
        text(80 + i * 160, 107, '👤', 18, C.border, 'middle'),
        rect(40 + i * 160, 144, 80, 8, C.surface2, 3),
        rect(48 + i * 160, 156, 64, 6, C.border, 2),
        ...[0, 1, 2].map(j => circle(58 + j * 16 + i * 160, 172, 6, C.surface2)).join(''),
      ].join('')).join(''),
    ].join(''))
    const cols = v === '4-col' ? 4 : 3
    const w = Math.floor(292 / cols)
    return wrapSvg(320, 240, [
      ...Array.from({ length: cols }, (_, i) => [
        rect(8 + i * (w + 4), 8, w, 220, C.surface, 6),
        circle(8 + i * (w + 4) + w / 2, 56, 28, C.surface2),
        rect(16 + i * (w + 4), 92, w - 16, 8, C.surface2, 2),
        rect(20 + i * (w + 4), 104, w - 24, 6, C.border, 2),
        rect(20 + i * (w + 4), 114, w - 32, 6, C.border, 2),
        ...[0, 1, 2].map(j => circle(20 + j * 16 + i * (w + 4), 136, 6, C.surface2)).join(''),
      ].join('')).join(''),
    ].join(''))
  },

  'team-bio': () => wrapSvg(320, 200, [
    rect(16, 16, 100, 168, C.surface2, 6),
    text(66, 108, '👤', 22, C.border, 'middle'),
    rect(124, 24, 180, 12, C.surface2, 3),
    rect(124, 42, 130, 8, C.border, 2),
    rect(124, 56, 180, 6, C.border, 2),
    rect(124, 66, 170, 6, C.border, 2),
    rect(124, 76, 160, 6, C.border, 2),
    ...[0, 1, 2].map(i => circle(124 + i * 20, 100, 8, C.surface2)).join(''),
  ].join('')),

  // Blog
  'blog-index': (v) => {
    if (v === 'magazine') return wrapSvg(320, 320, [
      rect(12, 12, 184, 164, C.surface2, 6),
      pill(20, 20, 56, 14, C.primary + '33'),
      text(48, 31, 'Featured', 6, C.primary, 'middle'),
      rect(20, 42, 120, 10, 'rgba(255,255,255,0.3)', 3),
      rect(20, 58, 100, 8, 'rgba(255,255,255,0.2)', 3),
      rect(204, 12, 104, 78, C.surface, 4),
      rect(212, 20, 80, 8, C.surface2, 3),
      rect(212, 32, 80, 6, C.border, 2),
      rect(204, 98, 104, 78, C.surface, 4),
      rect(212, 106, 80, 8, C.surface2, 3),
      rect(212, 118, 80, 6, C.border, 2),
      ...[0, 1, 2].map(i => cardBox(12 + i * 100, 184, 92, 124, false)).join(''),
    ].join(''))
    return wrapSvg(320, 280, [
      ...[0, 1, 2].map(i => cardBox(12 + i * 100, 8, 92, 264, true)).join(''),
    ].join(''))
  },

  'blog-post': (v) => wrapSvg(320, 320, [
    v === 'with-toc' ? [
      rect(8, 8, 72, 304, C.surface, 6),
      rect(16, 20, 56, 8, C.primary + '44', 3),
      ...[0, 1, 2, 3, 4].map(i => rect(16, 36 + i * 24, 48, 5, C.border, 2)).join(''),
    ].join('') : '',
    rect(v === 'with-toc' ? 88 : 16, 8, v === 'with-toc' ? 224 : 288, 304, C.surface, 6),
    rect(v === 'with-toc' ? 96 : 24, 20, 200, 12, C.surface2, 3),
    rect(v === 'with-toc' ? 96 : 24, 40, 150, 8, C.border, 3),
    ...[0, 1, 2, 3, 4, 5, 6].map(i => rect(v === 'with-toc' ? 96 : 24, 60 + i * 20, [200, 190, 200, 0, 200, 180, 190][i], [5, 5, 5, 0, 5, 5, 5][i], i === 3 ? 'transparent' : C.border, 2)).join(''),
    rect(v === 'with-toc' ? 96 : 24, 164, 200, 80, C.surface2, 4),
    ...[8, 9, 10].map(i => rect(v === 'with-toc' ? 96 : 24, 60 + i * 20, [200, 170, 190][i - 8], 5, C.border, 2)).join(''),
  ].join('')),

  'blog-related': () => wrapSvg(320, 200, [
    text(16, 20, 'Related Articles', 9, C.text),
    line(16, 28, 304, 28, C.border),
    ...[0, 1, 2].map(i => cardBox(12 + i * 100, 36, 92, 152, true)).join(''),
  ].join('')),

  'blog-author': () => wrapSvg(320, 100, [
    rect(12, 12, 296, 76, C.surface, 8),
    circle(44, 50, 22, C.surface2),
    text(44, 57, '✍️', 12, C.border, 'middle'),
    rect(76, 22, 120, 8, C.surface2, 3),
    rect(76, 34, 90, 6, C.border, 2),
    rect(76, 48, 200, 5, C.border, 2),
    rect(76, 57, 180, 5, C.border, 2),
    ...[0, 1, 2].map(i => circle(76 + i * 18, 76, 6, C.surface2)).join(''),
  ].join('')),

  // Feedback
  'feedback-modal': (v) => {
    if (v === 'sheet') return wrapSvg(320, 280, [
      `<rect width="320" height="280" fill="rgba(0,0,0,0.5)"/>`,
      rect(0, 160, 320, 120, C.surface, 0),
      `<rect x="0" y="160" width="320" height="120" rx="16" fill="${C.surface}"/>`,
      rect(148, 168, 24, 4, C.border, 2),
      rect(16, 184, 180, 10, C.surface2, 3),
      inputField(16, 204, 288, ''),
      rect(16, 232, 288, 28, C.primary, 8),
      text(160, 250, 'Confirm', 8, C.white, 'middle'),
    ].join(''))
    return wrapSvg(320, 240, [
      `<rect width="320" height="240" fill="rgba(0,0,0,0.5)"/>`,
      rect(48, 24, 224, v === 'form' ? 192 : 160, C.surface, 10),
      text(304, 36, '✕', 8, C.text, 'end'),
      rect(64, 40, 160, 10, C.surface2, 3),
      rect(64, 56, 130, 7, C.border, 3),
      v === 'form' ? inputField(64, 80, 192, 'Email') : '',
      v === 'form' ? rect(64, 140, 192, 24, C.primary, 8) : [
        rect(64, 100, 90, 24, C.primary, 8),
        text(109, 116, 'Confirm', 7.5, C.white, 'middle'),
        rect(164, 100, 90, 24, C.surface2, 8),
        text(209, 116, 'Cancel', 7.5, C.text, 'middle'),
      ].join(''),
    ].join(''))
  },

  'feedback-empty': (v) => wrapSvg(320, 240, [
    v === '404' ? [
      text(160, 80, '404', 40, C.surface2, 'middle'),
      rect(80, 100, 160, 12, C.surface2, 4),
      rect(96, 118, 128, 8, C.border, 3),
      rect(112, 140, 96, 28, C.primary, 14),
      text(160, 158, 'Go Home', 8, C.white, 'middle'),
    ].join('') : [
      text(160, 80, v === 'success' ? '✓' : '○', 36, v === 'success' ? C.primary : C.surface2, 'middle'),
      rect(80, 104, 160, 10, C.surface2, 4),
      rect(96, 120, 128, 7, C.border, 3),
      v !== 'success' ? [
        rect(112, 144, 96, 28, C.primary, 14),
        text(160, 162, v === 'no-results' ? 'Clear Search' : 'Add Item', 8, C.white, 'middle'),
      ].join('') : text(160, 148, 'Done! Redirecting...', 7.5, C.border, 'middle'),
    ].join(''),
  ].join('')),

  // Layout
  'layout-section-header': (v) => wrapSvg(320, 100, [
    v === 'with-badge' ? pill(112, 16, 96, 16, C.primary + '22') : '',
    v === 'with-badge' ? text(160, 28, '✦  Section Label', 7, C.primary, 'middle') : '',
    rect(40, v === 'with-badge' ? 40 : 24, 240, 14, C.surface2, 4),
    rect(64, v === 'with-badge' ? 60 : 44, 192, 9, C.border, 3),
    v === 'with-cta' ? [
      rect(220, 60, 80, 20, C.primary, 10),
      text(260, 74, 'See All →', 7, C.white, 'middle'),
    ].join('') : '',
  ].join('')),

  'layout-page-header': (v) => wrapSvg(320, 120, [
    v === 'dark-bg' ? `<rect width="320" height="120" fill="${C.surface}"/>` : '',
    text(16, 28, 'Home  /  About  /  Team', 7, C.border),
    rect(16, 40, 200, 16, C.surface2, 4),
    v === 'with-description' ? rect(16, 62, 240, 9, C.border, 3) : '',
    v === 'with-description' ? rect(16, 76, 200, 7, C.border, 3) : '',
  ].join('')),

  'layout-sidebar': (v) => wrapSvg(320, 280, [
    v === 'right-sidebar' ? [
      rect(8, 8, 192, 264, C.surface, 6),
      ...[0, 1, 2, 3, 4, 5].map(i => rect(16, 16 + i * 20, 176, 14, C.border + (i === 0 ? '66' : '33'), 2)).join(''),
      rect(208, 8, 104, 264, C.surface, 6),
      rect(216, 16, 88, 8, C.surface2, 3),
      ...[0, 1, 2, 3].map(i => rect(216, 32 + i * 36, 88, 28, C.surface2, 4)).join(''),
    ].join('') : [
      rect(8, 8, 88, 264, C.surface, 6),
      ...[0, 1, 2, 3].map(i => rect(16, 16 + i * 36, 72, 28, C.surface2, 4)).join(''),
      rect(104, 8, 208, 264, C.surface, 6),
      ...[0, 1, 2, 3, 4, 5].map(i => rect(112, 16 + i * 20, 192, 14, C.border + '33', 2)).join(''),
    ].join(''),
  ].join('')),

  'layout-dashboard': (v) => wrapSvg(320, 280, [
    v === 'kanban' ? [
      rect(0, 0, 320, 28, C.surface),
      navBar(0, 320),
      ...[0, 1, 2, 3].map(i => [
        rect(8 + i * 78, 36, 72, 236, C.surface, 6),
        rect(12 + i * 78, 44, 64, 8, C.surface2, 3),
        ...[0, 1, 2].map(j => rect(12 + i * 78, 60 + j * 52, 64, 44, C.bg, 4)).join(''),
      ].join('')).join(''),
    ].join('') : [
      rect(0, 0, 64, 280, C.surface),
      rect(64, 0, 256, 280, C.bg),
      navBar(0, 320),
      ...[0, 1, 2, 3].map(i => [
        rect(72 + i * 60, 36, 52, 44, C.surface, 6),
        rect(80 + i * 60, 44, 36, 8, C.surface2, 3),
        rect(80 + i * 60, 56, 28, 12, C.primary + '44', 2),
      ].join('')).join(''),
      rect(72, 92, 168, 96, C.surface, 6),
      rect(248, 92, 72, 96, C.surface, 6),
      rect(72, 196, 248, 68, C.surface, 6),
    ].join(''),
  ].join('')),
}

export function getBlockSvg(svgCategory: string, variantId: string): string {
  const renderer = RENDERERS[svgCategory]
  if (!renderer) {
    return wrapSvg(320, 100, [
      rect(8, 8, 304, 84, C.surface, 6),
      text(160, 54, svgCategory, 8, C.border, 'middle'),
    ].join(''))
  }
  return renderer(variantId)
}
