#!/usr/bin/env node
/**
 * check-wireframes-lock.js
 * Structural validation for wireframes_locked.json.
 *
 * Run: node .nezam/core/scripts/checks/check-wireframes-lock.js
 * Exit 0 on pass, 1 on fail.
 *
 * Owner: design-hub-wireframe + lead-qa-architect
 * Spec:  T-P0-003 AC-2 — wireframes_locked.json validated in CI
 */

const fs = require('fs')
const path = require('path')

const REPO_ROOT = process.cwd()
const CANDIDATES = [
  path.join(REPO_ROOT, 'wireframes_locked.json'),
  path.join(REPO_ROOT, '.nezam/design-hub/wireframes_locked.json'),
]

const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/

const errors = []
const warnings = []

function err(msg) { errors.push(msg) }
function warn(msg) { warnings.push(msg) }

function findLock() {
  for (const p of CANDIDATES) {
    if (fs.existsSync(p)) return p
  }
  return null
}

function isObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v) }

function require_(obj, key, type, ctx) {
  if (!(key in obj)) {
    err(`${ctx}: missing required field "${key}"`)
    return false
  }
  const v = obj[key]
  if (type === 'string' && typeof v !== 'string') { err(`${ctx}.${key}: expected string, got ${typeof v}`); return false }
  if (type === 'array' && !Array.isArray(v)) { err(`${ctx}.${key}: expected array, got ${typeof v}`); return false }
  if (type === 'object' && !isObject(v)) { err(`${ctx}.${key}: expected object, got ${typeof v}`); return false }
  if (type === 'iso8601' && (typeof v !== 'string' || !ISO_8601.test(v))) {
    err(`${ctx}.${key}: expected ISO 8601 timestamp, got "${v}"`); return false
  }
  return true
}

function validateMeta(meta) {
  const ctx = 'meta'
  require_(meta, 'project_name', 'string', ctx)
  require_(meta, 'project_slug', 'string', ctx)
  require_(meta, 'locked_at', 'iso8601', ctx)
  require_(meta, 'profile', 'string', ctx)
  require_(meta, 'nezam_version', 'string', ctx)
}

function validateSitemap(sitemap) {
  const ctx = 'sitemap'
  if (!require_(sitemap, 'pages', 'array', ctx)) return
  sitemap.pages.forEach((p, i) => {
    const c = `${ctx}.pages[${i}]`
    if (!isObject(p)) { err(`${c}: not an object`); return }
    require_(p, 'id', 'string', c)
    require_(p, 'title', 'string', c)
    require_(p, 'route', 'string', c)
    require_(p, 'status', 'string', c)
  })
}

function validatePages(pages) {
  const ctx = 'pages'
  pages.forEach((p, i) => {
    const c = `${ctx}[${i}]`
    if (!isObject(p)) { err(`${c}: not an object`); return }
    require_(p, 'page_id', 'string', c)
    require_(p, 'title', 'string', c)
    require_(p, 'route', 'string', c)
    if (require_(p, 'sections', 'array', c)) {
      p.sections.forEach((s, j) => {
        const sc = `${c}.sections[${j}]`
        if (!isObject(s)) { err(`${sc}: not an object`); return }
        require_(s, 'section_id', 'string', sc)
        require_(s, 'block_type', 'string', sc)
        if (!('order' in s)) err(`${sc}: missing "order"`)
      })
    }
  })
}

function validateDesignSystem(ds) {
  const ctx = 'design_system'
  require_(ds, 'color_profile', 'object', ctx)
  require_(ds, 'typography', 'object', ctx)
  require_(ds, 'spacing', 'object', ctx)
  if (isObject(ds.color_profile)) {
    require_(ds.color_profile, 'primary', 'string', `${ctx}.color_profile`)
    require_(ds.color_profile, 'background', 'string', `${ctx}.color_profile`)
    require_(ds.color_profile, 'text_primary', 'string', `${ctx}.color_profile`)
  }
  if (isObject(ds.typography)) {
    require_(ds.typography, 'heading_font', 'string', `${ctx}.typography`)
    require_(ds.typography, 'body_font', 'string', `${ctx}.typography`)
  }
}

function validateCrossRefs(doc) {
  if (!isObject(doc.sitemap) || !Array.isArray(doc.sitemap.pages)) return
  if (!Array.isArray(doc.pages)) return
  const sitemapIds = new Set(doc.sitemap.pages.map(p => p.id))
  const pageIds = new Set(doc.pages.map(p => p.page_id))
  for (const id of sitemapIds) {
    if (!pageIds.has(id)) warn(`sitemap page "${id}" has no matching pages[].page_id`)
  }
  for (const id of pageIds) {
    if (!sitemapIds.has(id)) warn(`pages[] entry "${id}" has no matching sitemap.pages[].id`)
  }
}

function main() {
  const lockPath = findLock()
  if (!lockPath) {
    err(`wireframes_locked.json not found at any of: ${CANDIDATES.join(', ')}`)
    report(); process.exit(1)
  }

  let raw, doc
  try { raw = fs.readFileSync(lockPath, 'utf8') } catch (e) {
    err(`Could not read ${lockPath}: ${e.message}`); report(); process.exit(1)
  }
  try { doc = JSON.parse(raw) } catch (e) {
    err(`Invalid JSON in ${lockPath}: ${e.message}`); report(); process.exit(1)
  }

  // Top-level required keys
  for (const k of ['meta', 'sitemap', 'pages', 'design_system', 'locked_at']) {
    if (!(k in doc)) err(`top-level: missing required field "${k}"`)
  }

  if (isObject(doc.meta)) validateMeta(doc.meta)
  if (isObject(doc.sitemap)) validateSitemap(doc.sitemap)
  if (Array.isArray(doc.pages)) validatePages(doc.pages)
  if (isObject(doc.design_system)) validateDesignSystem(doc.design_system)
  validateCrossRefs(doc)

  // Top-level locked_at consistency
  if (doc.meta && doc.meta.locked_at && doc.locked_at && doc.meta.locked_at !== doc.locked_at) {
    warn(`meta.locked_at ("${doc.meta.locked_at}") does not match top-level locked_at ("${doc.locked_at}")`)
  }

  report()
  process.exit(errors.length > 0 ? 1 : 0)
}

function report() {
  const lockPath = findLock() || '(not found)'
  console.log(`📋 wireframes_locked.json: ${lockPath}`)
  if (warnings.length) {
    console.log(`\n⚠️  ${warnings.length} warning(s):`)
    warnings.forEach(w => console.log(`   - ${w}`))
  }
  if (errors.length) {
    console.log(`\n❌ ${errors.length} error(s):`)
    errors.forEach(e => console.log(`   - ${e}`))
    console.log('\nLock structure invalid. Fix above issues then re-export via Design Hub.')
  } else {
    console.log(`\n✅ Lock structure valid (warnings: ${warnings.length})`)
  }
}

main()
