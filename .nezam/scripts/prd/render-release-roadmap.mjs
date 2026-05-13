#!/usr/bin/env node
/**
 * Sync PRD.md §11 Release Roadmap table from .nezam/workspace/prd/release-roadmap.json
 *
 * Usage:
 *   node .nezam/scripts/prd/render-release-roadmap.mjs --write   # update PRD.md
 *   node .nezam/scripts/prd/render-release-roadmap.mjs --check  # exit 1 if drift
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const jsonPath = path.join(root, '.nezam/workspace/prd/release-roadmap.json');
const prdPath = path.join(root, '.nezam/workspace/prd/PRD.md');

const START = '<!-- NEZAM_RELEASE_ROADMAP_TABLE_START -->';
const END = '<!-- NEZAM_RELEASE_ROADMAP_TABLE_END -->';

function escCell(s) {
  return String(s)
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function buildTable(milestones) {
  const lines = [
    '| Milestone | Version | Scope |',
    '|---|---|---|',
    ...milestones.map(
      (m) =>
        `| ${escCell(m.milestone)} | \`${escCell(m.version)}\` | ${escCell(m.scope)} |`
    ),
    '',
  ];
  return lines.join('\n');
}

function loadMilestones() {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.milestones)) {
    throw new Error(`${jsonPath}: expected { "milestones": [ ... ] }`);
  }
  for (const m of data.milestones) {
    if (!m.milestone || !m.version || m.scope == null) {
      throw new Error(`${jsonPath}: each milestone needs milestone, version, scope`);
    }
  }
  return data.milestones;
}

function extractMarkedTable(prd) {
  const i0 = prd.indexOf(START);
  const i1 = prd.indexOf(END);
  if (i0 === -1 || i1 === -1 || i1 <= i0) {
    throw new Error(
      `${prdPath}: missing ${START} / ${END} — add markers around §11 table`
    );
  }
  return prd.slice(i0 + START.length, i1).trim();
}

function injectTable(prd, tableMd) {
  const i0 = prd.indexOf(START);
  const i1 = prd.indexOf(END);
  if (i0 === -1 || i1 === -1 || i1 <= i0) {
    throw new Error(`${prdPath}: missing roadmap markers`);
  }
  const before = prd.slice(0, i0 + START.length);
  const after = prd.slice(i1);
  return `${before}\n\n${tableMd.trim()}\n\n${after}`;
}

const milestones = loadMilestones();
const tableMd = buildTable(milestones);
const mode = process.argv.includes('--check')
  ? 'check'
  : process.argv.includes('--write')
    ? 'write'
    : null;

if (!mode) {
  console.error('Usage: node .nezam/scripts/prd/render-release-roadmap.mjs --write | --check');
  process.exit(1);
}

const prd = fs.readFileSync(prdPath, 'utf8');
const current = extractMarkedTable(prd);

if (mode === 'check') {
  if (current !== tableMd.trim()) {
    console.error(
      'PRD.md §11 release roadmap table is out of sync with .nezam/workspace/prd/release-roadmap.json'
    );
    console.error('Run: pnpm prd:roadmap');
    process.exit(1);
  }
  console.log('Release roadmap table matches release-roadmap.json');
  process.exit(0);
}

// --write
fs.writeFileSync(prdPath, injectTable(prd, tableMd.trim()), 'utf8');
console.log(`Updated ${path.relative(root, prdPath)} from release-roadmap.json`);
