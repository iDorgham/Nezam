#!/usr/bin/env node
/**
 * Vendor external design skills from local installs (Claude/Cursor global skills)
 * into .cursor/skills/ per .nezam/core/gates/design-skills.yaml
 *
 * Usage:
 *   node .nezam/core/scripts/skills/vendor-external-design-skills.js
 *   node .nezam/core/scripts/skills/vendor-external-design-skills.js --force
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, ".nezam/core/gates/design-skills.yaml");
const force = process.argv.includes("--force");

const NEZAM_FM_BLOCK = `tier: 2
version: 1.0.0
updated: 2026-05-29
breaking_changes: false
changelog:
  - version: 1.0.0
    date: 2026-05-29
    notes: "Vendored via vendor-external-design-skills.js from upstream."`;

function expandHome(p) {
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return p;
}

function parseSimpleYaml(text) {
  const skills = [];
  let inSkills = false;
  let current = null;
  let listKey = null;

  for (const line of text.split("\n")) {
    if (line.trim() === "skills:") {
      inSkills = true;
      continue;
    }
    if (inSkills && /^default_stacks:/.test(line)) break;
    if (!inSkills) continue;

    const item = line.match(/^\s+-\s+id:\s+(.+)$/);
    if (item) {
      if (current) skills.push(current);
      current = { id: item[1].trim(), local_sources: [], extra_files: [] };
      listKey = null;
      continue;
    }
    if (!current) continue;

    const kv = line.match(/^\s+([a-z_]+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      const val = kv[2].trim().replace(/^["']|["']$/g, "");
      if (val === "" || val === "[]") {
        listKey = key;
        current[key] = current[key] || [];
      } else if (key === "managed_in_repo" || key === "enabled") {
        current[key] = val === "true";
      } else if (key === "tier") {
        current[key] = Number(val);
      } else {
        current[key] = val;
        listKey = null;
      }
      continue;
    }

    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && listKey) {
      current[listKey].push(listItem[1].trim().replace(/^["']|["']$/g, ""));
    }
  }
  if (current) skills.push(current);
  return skills;
}

function ensureNezamFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return content;
  const fm = match[1];
  if (/^tier:\s+/m.test(fm)) return content;
  const newFm = `${fm.trimEnd()}\n${NEZAM_FM_BLOCK}\n`;
  return content.replace(/^---\n[\s\S]*?\n---\n/, `---\n${newFm}---\n`);
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && !force) return false;
  fs.copyFileSync(src, dest);
  return true;
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else if (!fs.existsSync(d) || force) fs.copyFileSync(s, d);
  }
}

function resolveSource(entry) {
  if (entry.managed_in_repo) {
    const dir = path.join(repoRoot, entry.canonical_dir);
    return fs.existsSync(path.join(dir, "SKILL.md")) ? dir : null;
  }
  for (const src of entry.local_sources || []) {
    const expanded = expandHome(src);
    if (fs.existsSync(path.join(expanded, "SKILL.md"))) return expanded;
  }
  return null;
}

function main() {
  if (!fs.existsSync(manifestPath)) {
    console.error(`Missing manifest: ${manifestPath}`);
    process.exit(1);
  }

  const manifestText = fs.readFileSync(manifestPath, "utf8");
  const skills = parseSimpleYaml(manifestText);

  let copied = 0;
  let skipped = 0;
  const missing = [];

  for (const entry of skills) {
    if (entry.managed_in_repo) {
      console.log(`✓ ${entry.id}: managed in repo (${entry.canonical_dir})`);
      continue;
    }

    const sourceDir = resolveSource(entry);
    const destDir = path.join(repoRoot, entry.canonical_dir);

    if (!sourceDir) {
      missing.push({ id: entry.id, hint: entry.npx_add || "install upstream skill globally" });
      continue;
    }

    const srcSkill = path.join(sourceDir, "SKILL.md");
    const destSkill = path.join(destDir, "SKILL.md");
    let content = fs.readFileSync(srcSkill, "utf8");
    content = ensureNezamFrontmatter(content);

    if (fs.existsSync(destSkill) && !force) {
      console.log(`○ ${entry.id}: exists (use --force to overwrite)`);
      skipped++;
    } else {
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(destSkill, content, "utf8");
      console.log(`✓ ${entry.id}: vendored SKILL.md from ${sourceDir}`);
      copied++;
    }

    for (const extra of entry.extra_files || []) {
      const srcExtra = path.join(sourceDir, extra);
      const destExtra = path.join(destDir, extra);
      if (fs.existsSync(srcExtra)) {
        if (copyFile(srcExtra, destExtra)) {
          console.log(`  + ${extra}`);
        }
      }
    }

    const refDir = path.join(sourceDir, "reference");
    if (fs.existsSync(refDir)) {
      copyDirRecursive(refDir, path.join(destDir, "reference"));
    }
  }

  if (missing.length) {
    console.log("\nMissing upstream installs:");
    for (const m of missing) {
      console.log(`  - ${m.id}: ${m.hint}`);
    }
  }

  console.log(`\nDone. copied=${copied} skipped=${skipped} missing=${missing.length}`);
  if (missing.length) process.exit(2);
}

main();
