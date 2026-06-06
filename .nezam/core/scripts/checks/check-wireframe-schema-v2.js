#!/usr/bin/env node
/**
 * check-wireframe-schema-v2.js
 * Verifies wireframes_locked.json complies with schema v2.0.0.
 *
 * Exit 0 on pass, 1 on fail.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const candidates = [
  path.join(REPO_ROOT, 'wireframes_locked.json'),
  path.join(REPO_ROOT, '.nezam/design-hub/wireframes_locked.json'),
];

const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/;

function findLock() {
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const lockPath = findLock();
if (!lockPath) {
  console.error(`Error: wireframes_locked.json not found at any of: ${candidates.join(', ')}`);
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(lockPath, 'utf8'));

  // 1. Check $schemaVersion is >= 2.0
  if (!data.$schemaVersion) {
    console.error('Error: "$schemaVersion" is missing at root');
    process.exit(1);
  }
  const version = parseFloat(data.$schemaVersion);
  if (isNaN(version) || version < 2.0) {
    console.error(`Error: "$schemaVersion" must be 2.0.0 or higher. Found: "${data.$schemaVersion}"`);
    process.exit(1);
  }

  // 2. Check meta.validated_at is present and valid timestamp
  if (!data.meta) {
    console.error('Error: "meta" is missing at root');
    process.exit(1);
  }
  if (!data.meta.validated_at) {
    console.error('Error: "meta.validated_at" is missing');
    process.exit(1);
  }
  if (!ISO_8601.test(data.meta.validated_at)) {
    console.error(`Error: "meta.validated_at" must be a valid ISO 8601 timestamp. Found: "${data.meta.validated_at}"`);
    process.exit(1);
  }

  // 3. Check arch_page_id in sitemap pages
  if (!data.sitemap || !Array.isArray(data.sitemap.pages)) {
    console.error('Error: "sitemap.pages" is missing or not an array');
    process.exit(1);
  }
  for (let i = 0; i < data.sitemap.pages.length; i++) {
    const p = data.sitemap.pages[i];
    if (!p.arch_page_id || typeof p.arch_page_id !== 'string' || p.arch_page_id.trim() === '') {
      console.error(`Error: sitemap.pages[${i}] (ID: ${p.id || 'unknown'}) is missing "arch_page_id"`);
      process.exit(1);
    }
  }

  // 4. Check arch_page_id in pages
  if (!data.pages || !Array.isArray(data.pages)) {
    console.error('Error: "pages" is missing or not an array at root');
    process.exit(1);
  }
  for (let i = 0; i < data.pages.length; i++) {
    const p = data.pages[i];
    if (!p.arch_page_id || typeof p.arch_page_id !== 'string' || p.arch_page_id.trim() === '') {
      console.error(`Error: pages[${i}] (ID: ${p.page_id || 'unknown'}) is missing "arch_page_id"`);
      process.exit(1);
    }
  }

  console.log('✅ wireframes_locked.json complies with schema v2.0.0');
  process.exit(0);
} catch (err) {
  console.error('Error parsing or validating wireframes_locked.json:', err.message);
  process.exit(1);
}
